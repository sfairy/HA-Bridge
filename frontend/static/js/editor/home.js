import { PanelRenderer, airflowCanvasOffsetBounds, setBuiltinAssetVersions, syncedLineChartProperties } from "../../renderer/renderer.js?v=20260909-curtain-action-v15-20260911-navigation-light-v14-20260911-security-camera-popup-v6-quiet-feedback-v1-stage-retain-v1-focus-layout-anim-v1";
import { lightStatisticsEntityStateStatus, lightStatisticsEntitySupport } from "../../renderer/registry.js?v=20260814-tablet-resolution-v84-20260818-airer-v1-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-line-chart-performance-v3-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-effect-variant-v1-20260823-navigation-current-page-v1-20260824-light-statistics-v6-20260825-effect-load-queue-v1-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-editor-media-preview-v1-20260828-count-statistics-v1-20260831-background-media-v1-20260831-vacuum-map-background-v1-20260901-renderer-presence-runtime-v1-20260901-renderer-light-statistics-runtime-v1-20260901-renderer-line-chart-runtime-v1-20260901-renderer-door-window-runtime-v1-20260901-renderer-weather-chart-v2-20260901-renderer-date-time-runtime-v1-20260901-camera-prewarm-v1-20260901-vacuum-map-retry-v1-20260901-light-effect-first-frame-v1-20260901-light-effect-toggle-confirm-v1-20260901-light-effect-layering-v2-20260901-light-effect-color-cache-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260905-client-log-v1-20260906-i3d-complete-v6-20260827-runtime-hydration-retry-v1-20260908-access-lock-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1-20260911-navigation-light-v14-stage-retain-v1-focus-layout-anim-v1";
import { applyUiPackToDocument, createComponentFromTemplate, dateComponentDimensions, ensureUiPackRuntime, listComponentTemplates, timeComponentDimensions, weatherComponentDimensions } from "../ui-packs/loader.js?v=20260811-water-heater-popup-v44-20260815-component-thumbnails-v2-20260822-light-feedback-controls-v1-20260824-light-statistics-v6-20260828-count-statistics-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260908-environment-v1-20260908-lighting-mode-v1";
import { clone as cloneValue, newId, normalizedHexColor, hexToRgb, rgbToHex, rgbToHsv, hsvToRgb, roundField, clampNumber, normalizedFontWeight } from "./editor-utils.js?v=20260831-editor-utils-v1";
import { packPopupModules, popupLayoutColumns, popupLayoutMetrics } from "./popup-layout.js?v=20260821-electric-bed-combo-v2";
import { countComponentsOutsideCanvas, resizeDashboardDocument } from "./dashboard-resize.js?v=20260820-dashboard-resize-v439";
import { copyComponentsAcrossDocuments, copyComponentTargets, copyComponentsToTarget } from "./component-page-copy.js?v=20260826-cross-dashboard-copy-v4";
import { RELATED_ENTITY_DOMAIN_LABELS, legacyRelatedEntityIds, manualRelatedEntityConfig, relatedEntityIsAvailable, relatedEntityLabel, relatedEntityNeedsConfirmation, relatedPopupCandidates, relatedPopupContext, relatedPopupSelectionLimit, selectedRelatedEntityIds } from "./related-entities.js?v=20260825-bath-heater-primary-v1";
import { createIconVisibilityVirtualEntity } from "./virtual-entities.js?v=20260822-icon-visibility-v1";
import { createButtonSound } from "../shared/sound-effects.js?v=20260826-button-sound-v2";
import { deferHiddenEditorDialogs, installSettingsDialogBackdropGuard } from "./editor-dialogs.js?v=20260830-editor-dialogs-v1";
import { createEditorPickerElements } from "./editor-picker-elements.js?v=20260902-asset-display-name-v1";
import { EDITOR_PICKER_PAGE_SIZES, editorEntityPickerInitialPage, editorEntityPickerPage } from "./editor-picker-pagination.js?v=20260830-editor-picker-pagination-v1";
import { createEditorPickerQueries } from "./editor-picker-queries.js?v=20260830-editor-picker-queries-v1";
import { createEditorAssetMatcher } from "./editor-asset-queries.js?v=20260830-editor-asset-queries-v1";
import { createEditorPickerLifecycle } from "./editor-picker-lifecycle.js?v=20260831-editor-picker-lifecycle-v1";
import { createInteraction3dEditorPickers } from "../../modules/interaction3d/editor-pickers.js?v=20260910-presence-v9-20260906-i3d-buttons-v1-20260908-environment-v1-20260908-curtains-v1-20260908-nas-v1-20260908-devices-entry-v1-20260908-nas-status-panel-v1-television-v1-20260908-vacuum-v1-20260911-device-room-integration-v3";
import { createEditorAssetToolbar } from "./editor-asset-toolbar.js?v=20260902-asset-folder-delete-v1";
import { ACTION_TYPES, TOGGLE_ENTITY_DOMAINS, actionNeedsCurrentEntity, actionPopupData, componentActionIsSupported, entityIdSupportsToggle } from "./action-rules.js?v=20260831-action-rules-v1";
import { componentDirectLocation, findComponent, findComponentInItems, findComponentLocation } from "./component-tree.js?v=20260831-component-tree-v1";
import { applyCollectionLayerOrder, componentLabel, copiedComponentLabel, ensureSharedComponentReference, groupNameForCollection, nextTemplateInstanceName, refreshComponentIds, syncSharedComponentReferenceOrder } from "./editor-component-collections.js?v=20260831-editor-component-collections-v1";
import { fitInspectorComponentToDimensions, iconButtonEffectInspectorLayer, inspectorComponentMetrics, setInspectorToggle } from "./editor-basic-inspectors.js?v=20260901-editor-basic-inspectors-v4";
import { clonePageWithFreshIds, findCustomPopup, greatestCommonDivisor, normalizedPopupClimateDeviceType, popupModuleDropPosition, popupModuleEntityRecommended, popupModuleTypeLabel, reorderedPopupModules, uniquePagePath } from "./editor-document-management.js?v=20260901-editor-document-management-v1";
import { createRecoveryWriter, documentSignature, editorComponentEntries, editorComponentStructure, editorDocumentFrameSignature, recoveryStorageKey } from "./editor-history.js?v=20260909-preview-sleep-v1";
import { DEFAULT_BASE_LIGHTING, normalizeBaseLighting } from "../../3d-studio/studio-normalization.js?v=20260903-studio-normalization-v2";
import { guardInteraction3dChanges, renderInteraction3dThumbnail, updateInteraction3dCard, renderInteraction3dInspector } from "../../modules/interaction3d/editor.js?v=20260909-preview-sleep-v1-20260910-presence-security-v9-20260911-security-focal-v1-20260911-unified-device-settings-v3-navigation-scale-v1-stage-retain-v1-focus-layout-anim-v1";
import { createLicenseCard } from "./license-card.js?v=20260910-local-store-v1";
const qs = param => document.querySelector(param);
installSettingsDialogBackdropGuard();
const EDITOR_MIN_WIDTH = 1020;
const EDITOR_LAYOUT_GAP = 2;
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const TEMPLATE_DIALOG_SCALE_FACTOR = 1.1;
const editorHeader = qs(".editor-header");
const editorShell = qs(".editor-shell");
function syncEditorViewportFit() {
  const count = Math.max(1, editorHeader.offsetHeight + editorShell.offsetHeight);
  const value = Math.min(1, window.innerWidth / EDITOR_MIN_WIDTH, window.innerHeight / count);
  const needsViewportFit = value < 0.999;
  document.documentElement.classList.toggle("editor-viewport-fit", needsViewportFit);
  document.documentElement.style.setProperty("--editor-layout-height", count + "px");
  document.documentElement.style.setProperty("--editor-viewport-scale", String(value));
}
function syncComponentTemplateDialogScale() {
  const count = Math.max(0.1, TEMPLATE_DIALOG_SCALE_FACTOR * Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT));
  document.documentElement.style.setProperty("--component-template-dialog-scale", String(count));
}
syncEditorViewportFit();
syncComponentTemplateDialogScale();
const logoutBtn = qs("#logout");
const saveBtn = qs("#save");
const licenseOpenBtn = qs("#license-open");
const licenseDialog = qs("#license-dialog");
const licenseCloseBtn = qs("#license-close");
const licenseForm = qs("#license-form");
const licenseMessage = qs("#license-message");
const licenseDetailIndicator = qs("#license-detail-indicator");
const licenseDetailStatus = qs("#license-detail-status");
const licenseDetailEdition = qs("#license-detail-edition");
const licenseDetailError = qs("#license-detail-error");
const licenseCard = createLicenseCard({
  dialog: licenseDialog
});
const haOpenBtn = qs("#ha-open");
const haDialog = qs("#ha-dialog");
const haCloseBtn = qs("#ha-close");
const haForm = qs("#ha-form");
const haTestBtn = qs("#ha-test");
const haMessage = qs("#ha-message");
const haSyncState = qs("#ha-sync-state");
const haSyncDetail = qs("#ha-sync-detail");
const haSyncOverview = qs("#ha-sync-overview");
const haConnectionView = qs("#ha-connection-view");
const haDetailIndicator = qs("#ha-detail-indicator");
const haDetailName = qs("#ha-detail-name");
const haDetailStatus = qs("#ha-detail-status");
const haDetailUrl = qs("#ha-detail-url");
const haDetailVersion = qs("#ha-detail-version");
const haDetailCounts = qs("#ha-detail-counts");
const haDetailError = qs("#ha-detail-error");
const haEditBtn = qs("#ha-edit");
const haDeleteBtn = qs("#ha-delete");
const haEditCancelBtn = qs("#ha-edit-cancel");
const deleteHaDialog = qs("#delete-ha-dialog");
const deleteHaCloseBtn = qs("#delete-ha-close");
const deleteHaCancelBtn = qs("#delete-ha-cancel");
const deleteHaForm = qs("#delete-ha-form");
const deleteHaMessage = qs("#delete-ha-message");
const projectNewBtn = qs("#project-new");
const projectSelect = qs("#project-select");
const projectActionsButton = qs("#project-actions-button");
const projectActionsMenu = qs("#project-actions-menu");
const projectFloorplanOpenBtn = qs("#project-floorplan-open");
const uiPackOpenBtn = qs("#ui-pack-open");
const uiPackCurrentName = qs("#ui-pack-current-name");
const uiPackCurrentVersion = qs("#ui-pack-current-version");
const uiPackDialog = qs("#ui-pack-dialog");
const uiPackCloseBtn = qs("#ui-pack-close");
const uiPackList = qs("#ui-pack-list");
const uiPackMessage = qs("#ui-pack-message");
const navigatorContent = qs("#navigator-content");
const pageControl = qs(".page-control");
const popupControl = qs(".popup-control");
const showPageEditor = qs("#show-page-editor");
const showPopupEditor = qs("#show-popup-editor");
const pageNewBtn = qs("#page-new");
const pageSelect = qs("#page-select");
const pageActionsButton = qs("#page-actions-button");
const pageActionsMenu = qs("#page-actions-menu");
const defaultPageAction = qs("#default-page-action");
const popupNewBtn = qs("#popup-new");
const popupSelect = qs("#popup-select");
const popupList = qs("#popup-list");
const popupActionsButton = qs("#popup-actions-button");
const popupActionsMenu = qs("#popup-actions-menu");
const showSharedComponents = qs("#show-shared-components");
const showPageComponents = qs("#show-page-components");
const addComponentButton = qs("#add-component-button");
const componentTemplateDialog = qs("#component-template-dialog");
const componentTemplateCloseBtn = qs("#component-template-close");
const componentTemplateScope = qs("#component-template-scope");
const componentTemplateList = qs("#component-template-list");
const sharedComponentList = qs("#shared-component-list");
const pageComponentList = qs("#page-component-list");
const componentContextMenu = qs("#component-context-menu");
const projectDialog = qs("#project-dialog");
const projectDialogKicker = qs("#project-dialog-kicker");
const projectDialogTitle = qs("#project-dialog-title");
const projectCloseBtn = qs("#project-close");
const projectCancelBtn = qs("#project-cancel");
const projectForm = qs("#project-form");
const projectSubmitBtn = qs("#project-submit");
const projectMessage = qs("#project-message");
const projectTemplateFields = qs("#project-template-fields");
const projectTemplateOptions = qs("#project-template-options");
const projectPreviewDialog = qs("#project-preview-dialog");
const projectPreviewTitle = qs("#project-preview-title");
const projectPreviewCount = qs("#project-preview-count");
const projectPreviewImage = qs("#project-preview-image");
const projectPreviewPreviousBtn = qs("#project-preview-previous");
const projectPreviewNextBtn = qs("#project-preview-next");
const projectPreviewCloseBtn = qs("#project-preview-close");
const projectCanvasFields = qs("#project-canvas-fields");
const projectCanvasWidth = qs("#project-canvas-width");
const projectCanvasHeight = qs("#project-canvas-height");
const projectAspectRatio = qs("#project-aspect-ratio");
const projectAspectLock = qs("#project-aspect-lock");
const projectAspectLockLabel = qs("#project-aspect-lock-label");
const projectCanvasHint = qs("#project-canvas-hint");
const projectContentLockFields = qs("#project-content-lock-fields");
const projectContentLock = qs("#project-content-lock");
const projectResizeWarningDialog = qs("#project-resize-warning-dialog");
const projectResizeWarningText = qs("#project-resize-warning-text");
const projectResizeWarningCloseBtn = qs("#project-resize-warning-close");
const projectResizeWarningCancelBtn = qs("#project-resize-warning-cancel");
const projectResizeWarningConfirmBtn = qs("#project-resize-warning-confirm");
const pageDialog = qs("#page-dialog");
const pageDialogKicker = qs("#page-dialog-kicker");
const pageDialogTitle = qs("#page-dialog-title");
const pageCloseBtn = qs("#page-close");
const pageCancelBtn = qs("#page-cancel");
const pageForm = qs("#page-form");
const pageSubmitBtn = qs("#page-submit");
const pageMessage = qs("#page-message");
const componentGroupRenameDialog = qs("#component-group-rename-dialog");
const componentGroupRenameCloseBtn = qs("#component-group-rename-close");
const componentGroupRenameCancelBtn = qs("#component-group-rename-cancel");
const componentGroupRenameForm = qs("#component-group-rename-form");
const componentGroupRenameInput = qs("#component-group-rename-input");
const componentGroupRenameMessage = qs("#component-group-rename-message");
const editorCanvas = qs("#editor-canvas");
const workspace = qs(".workspace");
const workspaceTitle = qs("#workspace-title");
const workspaceResolution = qs("#workspace-resolution");
const dashboardSoundToggleBtn = document.createElement("button");
dashboardSoundToggleBtn.id = "dashboard-sound-toggle";
dashboardSoundToggleBtn.className = "workspace-sound-toggle";
dashboardSoundToggleBtn.type = "button";
dashboardSoundToggleBtn.setAttribute("aria-pressed", "true");
dashboardSoundToggleBtn.setAttribute("aria-label", "关闭仪表盘音效");
dashboardSoundToggleBtn.title = "关闭仪表盘音效";
dashboardSoundToggleBtn.innerHTML = "<svg class=\"sound-icon sound-icon-on\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 10v4h4l5 4V6l-5 4H4Z\"/><path d=\"M16 9.5a4 4 0 0 1 0 5\"/><path d=\"M18.5 7a7.5 7.5 0 0 1 0 10\"/></svg><svg class=\"sound-icon sound-icon-off\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 10v4h4l5 4V6l-5 4H4Z\"/><path d=\"m17 9 5 6M22 9l-5 6\"/></svg><span class=\"sound-label\">按键音效</span>";
workspaceResolution.after(dashboardSoundToggleBtn);
const dashboardDisplayHint = qs("#dashboard-display-hint");
const dashboardDisplayLink = qs("#dashboard-display-link");
const displayDevicesOpenBtn = qs("#display-devices-open");
const displayDevicesDialog = qs("#display-devices-dialog");
const displayDevicesCloseBtn = qs("#display-devices-close");
const displayPairingForm = qs("#display-pairing-form");
const displayPairingName = qs("#display-pairing-name");
const displayPairingCustomCode = qs("#display-pairing-custom-code");
const displayPairingGenerateBtn = qs("#display-pairing-generate");
const displayDeviceCount = qs("#display-device-count");
const displayDeviceList = qs("#display-device-list");
const displayDevicesMessage = qs("#display-devices-message");
const showEditorPreview = qs("#show-editor-preview");
const showDashboardPreview = qs("#show-dashboard-preview");
const openHomeAssistant = qs("#open-home-assistant");
const dashboardPreview = qs("#dashboard-preview");
const customPopupEditor = qs("#custom-popup-editor");
const buttonSound = createButtonSound();
function syncDashboardSoundToggle() {
  if (!dashboardSoundToggleBtn) {
    return;
  }
  const value = editorMode === "edit";
  dashboardSoundToggleBtn.hidden = !value;
  dashboardSoundToggleBtn.disabled = !currentProject;
  if (currentProject && typeof currentProject.document?.soundEnabled == "boolean" && buttonSound.isEnabled() !== currentProject.document.soundEnabled) {
    buttonSound.setEnabled(currentProject.document.soundEnabled);
  }
  dashboardSoundToggleBtn.setAttribute("aria-pressed", String(buttonSound.isEnabled()));
  dashboardSoundToggleBtn.title = buttonSound.isEnabled() ? "关闭仪表盘音效" : "开启仪表盘音效";
  dashboardSoundToggleBtn.setAttribute("aria-label", dashboardSoundToggleBtn.title);
  dashboardSoundToggleBtn.classList.toggle("is-muted", !buttonSound.isEnabled());
}
const deleteProjectDialog = qs("#delete-project-dialog");
const deleteProjectCloseBtn = qs("#delete-project-close");
const deleteProjectCancelBtn = qs("#delete-project-cancel");
const deleteProjectForm = qs("#delete-project-form");
const deleteProjectName = qs("#delete-project-name");
const deleteProjectMessage = qs("#delete-project-message");
const deletePageDialog = qs("#delete-page-dialog");
const deletePageCloseBtn = qs("#delete-page-close");
const deletePageCancelBtn = qs("#delete-page-cancel");
const deletePageConfirmBtn = qs("#delete-page-confirm");
const deletePageName = qs("#delete-page-name");
const deletePageMessage = qs("#delete-page-message");
const deleteComponentDialog = qs("#delete-component-dialog");
const deleteComponentCloseBtn = qs("#delete-component-close");
const deleteComponentCancelBtn = qs("#delete-component-cancel");
const deleteComponentConfirmBtn = qs("#delete-component-confirm");
const deleteComponentName = qs("#delete-component-name");
const copyComponentPageDialog = qs("#copy-component-page-dialog");
const copyComponentPageCloseBtn = qs("#copy-component-page-close");
const copyComponentPageCancelBtn = qs("#copy-component-page-cancel");
const copyComponentPageForm = qs("#copy-component-page-form");
const copyComponentPageName = qs("#copy-component-page-name");
const copyComponentPageScope = qs("#copy-component-page-scope");
const copyComponentPageProjectField = qs("#copy-component-page-project-field");
const copyComponentPageProject = qs("#copy-component-page-project");
const copyComponentPageTargetField = qs("#copy-component-page-target-field");
const copyComponentPageTargetLabel = qs("#copy-component-page-target-label");
const copyComponentPageTarget = qs("#copy-component-page-target");
const copyComponentScaleOptions = qs("#copy-component-scale-options");
const copyComponentResolutionSummary = qs("#copy-component-resolution-summary");
const copyComponentPageMessage = qs("#copy-component-page-message");
const copyComponentPageSubmitBtn = qs("#copy-component-page-submit");
const copyComponentSuccessDialog = qs("#copy-component-success-dialog");
const copyComponentSuccessMessage = qs("#copy-component-success-message");
const copyComponentSuccessStayBtn = qs("#copy-component-success-stay");
const copyComponentSuccessGoBtn = qs("#copy-component-success-go");
const errorDialog = qs("#error-dialog");
const errorDialogCloseBtn = qs("#error-dialog-close");
const errorDialogConfirmBtn = qs("#error-dialog-confirm");
const errorDialogMessage = qs("#error-dialog-message");
const recoveryDialog = qs("#recovery-dialog");
const recoveryDiscardBtn = qs("#recovery-discard");
const recoveryRestoreBtn = qs("#recovery-restore");
const undoBtn = qs("#undo");
const redoBtn = qs("#redo");
const inspectorEmpty = qs("#inspector-empty");
const inspector = qs(".inspector");
const imageInspector = qs("#image-inspector");
const imageType = qs("#image-type");
const imageLabel = qs("#image-label");
const imageEntityPicker = qs("#image-entity-picker");
const imageEntityButton = qs("#image-entity-button");
const imageEntityMenu = qs("#image-entity-menu");
const imageEntitySearch = qs("#image-entity-search");
const imageEntityOptions = qs("#image-entity-options");
const imageAssetPicker = qs("#image-asset-picker");
const imageAssetButton = qs("#image-asset-button");
const imageAssetMenu = qs("#image-asset-menu");
const imageAssetFolder = qs("#image-asset-folder");
const imageAssetSearch = qs("#image-asset-search");
const imageAssetOptions = qs("#image-asset-options");
const imageAssetUpload = qs("#image-asset-upload");
const imageAssetUploadInput = qs("#image-asset-upload-input");
const imageAssetUploadHint = qs("#image-asset-upload-hint");
const imageAssetLargePreview = qs("#image-asset-large-preview");
const imageAssetLargePreviewImage = qs("#image-asset-large-preview-image");
const imageAssetLargePreviewName = qs("#image-asset-large-preview-name");
const globalColorPicker = qs("#global-color-picker");
const globalColorPickerSv = qs("#global-color-picker-sv");
const globalColorPickerMarker = qs("#global-color-picker-marker");
const globalColorPickerHue = qs("#global-color-picker-hue");
const globalColorPickerSwatch = qs("#global-color-picker-swatch");
const globalColorPickerHex = qs("#global-color-picker-hex");
const globalColorPickerCopyBtn = qs("#global-color-picker-copy");
const globalColorPickerPasteBtn = qs("#global-color-picker-paste");
const globalColorPickerR = qs("#global-color-picker-r");
const globalColorPickerG = qs("#global-color-picker-g");
const globalColorPickerB = qs("#global-color-picker-b");
const imageOpacity = qs("#image-opacity");
const imageLayoutOptions = qs("#image-layout-options");
const imageLeft = qs("#image-left");
const imageTop = qs("#image-top");
const imageScale = qs("#image-scale");
const imageRotation = qs("#image-rotation");
const floorplanAutoDiagramInspector = qs("#floorplan-auto-diagram-inspector");
const floorplanAutoDiagramStatus = qs("#floorplan-auto-diagram-status");
const floorplanAutoDiagramOpenStudio = qs("#floorplan-auto-diagram-open-studio");
const floorplanAutoDiagramViewToggle = qs("#floorplan-auto-diagram-view-toggle");
const floorplanAutoDiagramLabel = qs("#floorplan-auto-diagram-label");
const floorplanAutoDiagramFolder = qs("#floorplan-auto-diagram-folder");
const floorplanAutoDiagramLayout = qs("#floorplan-auto-diagram-layout");
const floorplanAutoDiagramLeft = qs("#floorplan-auto-diagram-left");
const floorplanAutoDiagramTop = qs("#floorplan-auto-diagram-top");
const floorplanAutoDiagramWidth = qs("#floorplan-auto-diagram-width");
const floorplanAutoDiagramHeight = qs("#floorplan-auto-diagram-height");
const floorplanAutoDiagramScale = qs("#floorplan-auto-diagram-scale");
const floorplanAutoDiagramRotation = qs("#floorplan-auto-diagram-rotation");
const floorplanAutoDiagramFloor = qs("#floorplan-auto-diagram-floor");
const floorplanAutoDiagramCameraView = qs("#floorplan-auto-diagram-camera-view");
const floorplanAutoDiagramCameraMode = qs("#floorplan-auto-diagram-camera-mode");
const floorplanAutoDiagramFocalLength = qs("#floorplan-auto-diagram-focal-length");
const floorplanAutoDiagramRotateTop = qs("#floorplan-auto-diagram-rotate-top");
const floorplanAutoDiagramOpenBaseLighting = qs("#floorplan-auto-diagram-open-base-lighting");
const floorplanAutoDiagramBindings = qs("#floorplan-auto-diagram-bindings");
const floorplanAutoDiagramBindingList = qs("#floorplan-auto-diagram-binding-list");
const floorplanAutoLightingPanel = qs("#floorplan-auto-lighting-panel");
const floorplanAutoLightingHandle = qs("#floorplan-auto-lighting-handle");
const floorplanAutoLightingCloseBtn = qs("#floorplan-auto-lighting-close");
const floorplanAutoLightingReset = qs("#floorplan-auto-lighting-reset");
const floorplanAutoLightingSave = qs("#floorplan-auto-lighting-save");
const floorplanAutoLightingStatus = qs("#floorplan-auto-lighting-status");
const floorplanBaseLightFields = [...document.querySelectorAll("[data-floorplan-base-light]")];
let autoLightingComponentId = "";
let baseLightingState = normalizeBaseLighting(DEFAULT_BASE_LIGHTING);
let autoLightingDragState = null;
const componentActionControls = qs("#component-action-controls");
const floorplanAutoDiagramDialog = qs("#floorplan-auto-diagram-dialog");
const floorplanAutoDiagramCloseBtn = qs("#floorplan-auto-diagram-close");
const floorplanAutoDiagramGuide = qs("#floorplan-auto-diagram-guide");
const floorplanAutoDiagramLater = qs("#floorplan-auto-diagram-later");
const floorplanAutoDiagramContinue = qs("#floorplan-auto-diagram-continue");
const iconButtonEffectInspector = qs("#icon-button-effect-inspector");
const ibeLabel = qs("#ibe-label");
const ibeEntityButton = qs("#ibe-entity-button");
const ibeEntityMenu = qs("#ibe-entity-menu");
const ibeEntitySearch = qs("#ibe-entity-search");
const ibeEntityOptions = qs("#ibe-entity-options");
const ibeColorTemperatureRealtime = qs("#ibe-color-temperature-realtime");
const ibeBrightnessRealtime = qs("#ibe-brightness-realtime");
const ibePreviewState = qs("#ibe-preview-state");
const ibeLayerOptions = qs("#ibe-layer-options");
const ibeButtonSection = qs("#ibe-button-section");
const ibeEffectSection = qs("#ibe-effect-section");
const ibeButtonVisible = qs("#ibe-button-visible");
const ibeEffectVisible = qs("#ibe-effect-visible");
const ibeButtonTransformSection = qs("#ibe-button-transform-section");
const ibeActionSection = qs("#ibe-action-section");
const ibeIconButton = qs("#ibe-icon-button");
const ibeIconCopyBtn = qs("#ibe-icon-copy");
const ibeIconMenu = qs("#ibe-icon-menu");
const ibeIconSearch = qs("#ibe-icon-search");
const ibeIconOptions = qs("#ibe-icon-options");
const ibeIconOffColor = qs("#ibe-icon-off-color");
const ibeIconOnColor = qs("#ibe-icon-on-color");
const ibeIconSize = qs("#ibe-icon-size");
const ibeButtonOffColor = qs("#ibe-button-off-color");
const ibeButtonOnColor = qs("#ibe-button-on-color");
const ibeButtonOpacity = qs("#ibe-button-opacity");
const ibeFrameColor = qs("#ibe-frame-color");
const ibeFrameWidth = qs("#ibe-frame-width");
const ibeFrameOpacity = qs("#ibe-frame-opacity");
const ibeRadius = qs("#ibe-radius");
const ibeGlowColor = qs("#ibe-glow-color");
const ibeGlowOffStrength = qs("#ibe-glow-off-strength");
const ibeGlowOnStrength = qs("#ibe-glow-on-strength");
const ibeAssetButton = qs("#ibe-asset-button");
const ibeAssetMenu = qs("#ibe-asset-menu");
const ibeAssetFolder = qs("#ibe-asset-folder");
const ibeAssetSearch = qs("#ibe-asset-search");
const ibeAssetOptions = qs("#ibe-asset-options");
const ibeAssetUpload = qs("#ibe-asset-upload");
const ibeAssetUploadInput = qs("#ibe-asset-upload-input");
const ibeAssetUploadHint = qs("#ibe-asset-upload-hint");
const ibeEffectOpacity = qs("#ibe-effect-opacity");
const ibeEffectFadeDuration = qs("#ibe-effect-fade-duration");
const ibeEffectLayoutOptions = qs("#ibe-effect-layout-options");
const ibeEffectAlignImage = qs("#ibe-effect-align-image");
const ibeEffectLeft = qs("#ibe-effect-left");
const ibeEffectTop = qs("#ibe-effect-top");
const ibeEffectScale = qs("#ibe-effect-scale");
const ibeEffectRotation = qs("#ibe-effect-rotation");
const ibeEffectSizeHint = qs("#ibe-effect-size-hint");
const effectImageAlignDialog = qs("#effect-image-align-dialog");
const effectImageAlignCloseBtn = qs("#effect-image-align-close");
const effectImageAlignCancelBtn = qs("#effect-image-align-cancel");
const effectImageAlignConfirmBtn = qs("#effect-image-align-confirm");
const effectImageAlignOptions = qs("#effect-image-align-options");
const effectImageAlignMessage = qs("#effect-image-align-message");
const ibeLeft = qs("#ibe-left");
const ibeTop = qs("#ibe-top");
const ibeWidth = qs("#ibe-width");
const ibeHeight = qs("#ibe-height");
const ibeScale = qs("#ibe-scale");
const ibeRotation = qs("#ibe-rotation");
const ibeActionControls = qs("#ibe-action-controls");
const ibeApplyStyle = qs("#ibe-apply-style");
const ibeApplyCount = qs("#ibe-apply-count");
const titleButtonInspector = qs("#title-button-inspector");
const titleButtonLabel = qs("#title-button-label");
const titleButtonEntityButton = qs("#title-button-entity-button");
const titleButtonEntityMenu = qs("#title-button-entity-menu");
const titleButtonEntitySearch = qs("#title-button-entity-search");
const titleButtonEntityOptions = qs("#title-button-entity-options");
const titleButtonMainVisible = qs("#title-button-main-visible");
const titleButtonSecondaryVisible = qs("#title-button-secondary-visible");
const titleButtonMainText = qs("#title-button-main-text");
const titleButtonSecondaryLine1 = qs("#title-button-secondary-line-1");
const titleButtonSecondaryLine2 = qs("#title-button-secondary-line-2");
const titleButtonMainColor = qs("#title-button-main-color");
const titleButtonSecondaryColor = qs("#title-button-secondary-color");
const titleButtonMainSize = qs("#title-button-main-size");
const titleButtonSecondarySize = qs("#title-button-secondary-size");
const titleButtonMainWeight = qs("#title-button-main-weight");
const titleButtonSecondaryWeight = qs("#title-button-secondary-weight");
const titleButtonMainSpacing = qs("#title-button-main-spacing");
const titleButtonSecondarySpacing = qs("#title-button-secondary-spacing");
const titleButtonSecondaryLineGap = qs("#title-button-secondary-line-gap");
const titleButtonMainLeft = qs("#title-button-main-left");
const titleButtonMainTop = qs("#title-button-main-top");
const titleButtonSecondaryLeft = qs("#title-button-secondary-left");
const titleButtonSecondaryTop = qs("#title-button-secondary-top");
const titleButtonIconVisible = qs("#title-button-icon-visible");
const titleButtonIconButton = qs("#title-button-icon-button");
const titleButtonIconCopyBtn = qs("#title-button-icon-copy");
const titleButtonIconMenu = qs("#title-button-icon-menu");
const titleButtonIconSearch = qs("#title-button-icon-search");
const titleButtonIconOptions = qs("#title-button-icon-options");
const titleButtonIconColor = qs("#title-button-icon-color");
const titleButtonIconSize = qs("#title-button-icon-size");
const titleButtonIconLeft = qs("#title-button-icon-left");
const titleButtonIconTop = qs("#title-button-icon-top");
const titleButtonFrameColor = qs("#title-button-frame-color");
const titleButtonFrameVisible = qs("#title-button-frame-visible");
const titleButtonFrameWidth = qs("#title-button-frame-width");
const titleButtonFrameSize = qs("#title-button-frame-size");
const titleButtonFrameSpacing = qs("#title-button-frame-spacing");
const titleButtonFrameOffsetX = qs("#title-button-frame-offset-x");
const titleButtonFrameOffsetY = qs("#title-button-frame-offset-y");
const titleButtonMarkerVisible = qs("#title-button-marker-visible");
const titleButtonMarkerColor = qs("#title-button-marker-color");
const titleButtonMarkerSize = qs("#title-button-marker-size");
const titleButtonMarkerLeft = qs("#title-button-marker-left");
const titleButtonMarkerTop = qs("#title-button-marker-top");
const titleButtonLeft = qs("#title-button-left");
const titleButtonTop = qs("#title-button-top");
const titleButtonWidth = qs("#title-button-width");
const titleButtonHeight = qs("#title-button-height");
const titleButtonScale = qs("#title-button-scale");
const titleButtonRotation = qs("#title-button-rotation");
const titleButtonActionControls = qs("#title-button-action-controls");
const titleButtonApplyStyle = qs("#title-button-apply-style");
const titleButtonApplyCount = qs("#title-button-apply-count");
const lightStatisticsInspector = qs("#light-statistics-inspector");
const lightStatisticsLabel = qs("#light-statistics-label");
const lightStatisticsTitle = qs("#light-statistics-title");
const lightStatisticsEntityButton = qs("#light-statistics-entity-button");
const lightStatisticsEntityMenu = qs("#light-statistics-entity-menu");
const lightStatisticsEntitySearch = qs("#light-statistics-entity-search");
const lightStatisticsEntityOptions = qs("#light-statistics-entity-options");
const lightStatisticsEntityPending = qs("#light-statistics-entity-pending");
const lightStatisticsPendingName = qs("#light-statistics-pending-name");
const lightStatisticsPendingDetail = qs("#light-statistics-pending-detail");
const lightStatisticsEntityConfirmBtn = qs("#light-statistics-entity-confirm");
const lightStatisticsEntityMessage = qs("#light-statistics-entity-message");
const lightStatisticsEntityList = qs("#light-statistics-entity-list");
const lightStatisticsEntityCount = qs("#light-statistics-entity-count");
const lightStatisticsActionEntityButton = qs("#light-statistics-action-entity-button");
const lightStatisticsActionEntityMenu = qs("#light-statistics-action-entity-menu");
const lightStatisticsActionEntitySearch = qs("#light-statistics-action-entity-search");
const lightStatisticsActionEntityOptions = qs("#light-statistics-action-entity-options");
const lightStatisticsActionNote = qs("#light-statistics-action-note");
const lightStatisticsActionControls = qs("#light-statistics-action-controls");
const lightStatisticsIconButton = qs("#light-statistics-icon-button");
const lightStatisticsIconCopyBtn = qs("#light-statistics-icon-copy");
const lightStatisticsIconMenu = qs("#light-statistics-icon-menu");
const lightStatisticsIconSearch = qs("#light-statistics-icon-search");
const lightStatisticsIconOptions = qs("#light-statistics-icon-options");
const lightStatisticsIconVisible = qs("#light-statistics-icon-visible");
const lightStatisticsIconColor = qs("#light-statistics-icon-color");
const lightStatisticsIconActiveColor = qs("#light-statistics-icon-active-color");
const lightStatisticsIconSize = qs("#light-statistics-icon-size");
const lightStatisticsTitleVisible = qs("#light-statistics-title-visible");
const lightStatisticsTitleColor = qs("#light-statistics-title-color");
const lightStatisticsTitleSize = qs("#light-statistics-title-size");
const lightStatisticsTitleWeight = qs("#light-statistics-title-weight");
const lightStatisticsTitleSpacing = qs("#light-statistics-title-spacing");
const lightStatisticsCountVisible = qs("#light-statistics-count-visible");
const lightStatisticsCountColor = qs("#light-statistics-count-color");
const lightStatisticsCountActiveColor = qs("#light-statistics-count-active-color");
const lightStatisticsCountSize = qs("#light-statistics-count-size");
const lightStatisticsCountWeight = qs("#light-statistics-count-weight");
const lightStatisticsCountSpacing = qs("#light-statistics-count-spacing");
const lightStatisticsIconGap = qs("#light-statistics-icon-gap");
const lightStatisticsCountGap = qs("#light-statistics-count-gap");
const lightStatisticsLeft = qs("#light-statistics-left");
const lightStatisticsTop = qs("#light-statistics-top");
const lightStatisticsWidth = qs("#light-statistics-width");
const lightStatisticsHeight = qs("#light-statistics-height");
const lightStatisticsScale = qs("#light-statistics-scale");
const lightStatisticsRotation = qs("#light-statistics-rotation");
const iconButtonInspector = qs("#icon-button-inspector");
const iconButtonTypeLabel = qs("#icon-button-type-label");
const iconButtonType = qs("#icon-button-type");
const iconButtonLabel = qs("#icon-button-label");
const presenceSensorKindLabel = qs("#presence-sensor-kind-label");
const presenceSensorKind = qs("#presence-sensor-kind");
const iconButtonEntityButton = qs("#icon-button-entity-button");
const iconButtonEntityMenu = qs("#icon-button-entity-menu");
const iconButtonEntitySearch = qs("#icon-button-entity-search");
const iconButtonEntityOptions = qs("#icon-button-entity-options");
const coverSettingsInspector = qs("#cover-settings-inspector");
const coverSettingsKind = qs("#cover-settings-kind");
const coverSettingsDirection = qs("#cover-settings-direction");
const coverSettingsMotorDirection = qs("#cover-settings-motor-direction");
const iconButtonPreviewState = qs("#icon-button-preview-state");
const iconButtonPreviewControl = qs("#icon-button-preview-control");
const iconButtonIconButton = qs("#icon-button-icon-button");
const iconButtonIconCopyBtn = qs("#icon-button-icon-copy");
const iconButtonIconMenu = qs("#icon-button-icon-menu");
const iconButtonIconSearch = qs("#icon-button-icon-search");
const iconButtonIconOptions = qs("#icon-button-icon-options");
const iconButtonIconColor = qs("#icon-button-icon-color");
const iconButtonIconColorLabel = qs("#icon-button-icon-color-label");
const deviceButtonIconVisible = qs("#device-button-icon-visible");
const deviceButtonIconOnColor = qs("#device-button-icon-on-color");
const deviceButtonIconOnColorLabel = qs("#device-button-icon-on-color-label");
const deviceButtonBadgeColor = qs("#device-button-badge-color");
const deviceButtonBadgeColorLabel = qs("#device-button-badge-color-label");
const deviceButtonBadgeOpacity = qs("#device-button-badge-opacity");
const deviceButtonBadgeOpacityLabel = qs("#device-button-badge-opacity-label");
const iconButtonIconSize = qs("#icon-button-icon-size");
const iconButtonIconSizeLabel = qs("#icon-button-icon-size-label");
const deviceButtonSymbolSize = qs("#device-button-symbol-size");
const deviceButtonSymbolSizeLabel = qs("#device-button-symbol-size-label");
const deviceButtonBadgeSize = qs("#device-button-badge-size");
const deviceButtonBadgeSizeLabel = qs("#device-button-badge-size-label");
const deviceButtonStatePrecision = qs("#device-button-state-precision");
const deviceButtonStatePrecisionLabel = qs("#device-button-state-precision-label");
const iconButtonIconOffOpacity = qs("#icon-button-icon-off-opacity");
const iconButtonIconOnOpacity = qs("#icon-button-icon-on-opacity");
const iconButtonIconOffOpacityLabel = qs("#icon-button-icon-off-opacity-label");
const iconButtonIconOnOpacityLabel = qs("#icon-button-icon-on-opacity-label");
const iconButtonIconLeft = qs("#icon-button-icon-left");
const iconButtonIconTop = qs("#icon-button-icon-top");
const iconButtonMainText = qs("#icon-button-main-text");
const iconButtonSecondaryText = qs("#icon-button-secondary-text");
const iconButtonMainHeading = qs("#icon-button-main-heading");
const deviceButtonMainVisible = qs("#device-button-main-visible");
const iconButtonSecondaryHeading = qs("#icon-button-secondary-heading");
const deviceButtonSecondaryVisible = qs("#device-button-secondary-visible");
const iconButtonMainContentLabel = qs("#icon-button-main-content-label");
const iconButtonSecondaryContentLabel = qs("#icon-button-secondary-content-label");
const iconButtonMainColor = qs("#icon-button-main-color");
const iconButtonSecondaryColor = qs("#icon-button-secondary-color");
const iconButtonMainOffOpacity = qs("#icon-button-main-off-opacity");
const iconButtonMainOnOpacity = qs("#icon-button-main-on-opacity");
const iconButtonSecondaryOffOpacity = qs("#icon-button-secondary-off-opacity");
const iconButtonSecondaryOnOpacity = qs("#icon-button-secondary-on-opacity");
const iconButtonMainOffOpacityLabel = qs("#icon-button-main-off-opacity-label");
const iconButtonMainOnOpacityLabel = qs("#icon-button-main-on-opacity-label");
const iconButtonSecondaryOffOpacityLabel = qs("#icon-button-secondary-off-opacity-label");
const iconButtonSecondaryOnOpacityLabel = qs("#icon-button-secondary-on-opacity-label");
const iconButtonMainSize = qs("#icon-button-main-size");
const iconButtonSecondarySize = qs("#icon-button-secondary-size");
const iconButtonMainWeight = qs("#icon-button-main-weight");
const iconButtonSecondaryWeight = qs("#icon-button-secondary-weight");
const iconButtonMainSpacing = qs("#icon-button-main-spacing");
const iconButtonSecondarySpacing = qs("#icon-button-secondary-spacing");
const iconButtonMainLeft = qs("#icon-button-main-left");
const iconButtonMainTop = qs("#icon-button-main-top");
const iconButtonSecondaryLeft = qs("#icon-button-secondary-left");
const iconButtonSecondaryTop = qs("#icon-button-secondary-top");
const iconButtonOnFillVisible = qs("#icon-button-on-fill-visible");
const iconButtonFillSection = qs("#icon-button-fill-section");
const iconButtonOnFillColor = qs("#icon-button-on-fill-color");
const iconButtonOnFillStrength = qs("#icon-button-on-fill-strength");
const iconButtonOnFillFadeDuration = qs("#icon-button-on-fill-fade-duration");
const iconButtonFrameVisible = qs("#icon-button-frame-visible");
const iconButtonFrameSection = qs("#icon-button-frame-section");
const iconButtonFrameWidth = qs("#icon-button-frame-width");
const iconButtonFrameAngle = qs("#icon-button-frame-angle");
const iconButtonFrameOffOpacity = qs("#icon-button-frame-off-opacity");
const iconButtonFrameOnOpacity = qs("#icon-button-frame-on-opacity");
const iconButtonCutCorner = qs("#icon-button-cut-corner");
const iconButtonSoftLightVisible = qs("#icon-button-soft-light-visible");
const iconButtonSoftLightSection = qs("#icon-button-soft-light-section");
const iconButtonSoftLightColor = qs("#icon-button-soft-light-color");
const iconButtonSoftLightStrength = qs("#icon-button-soft-light-strength");
const iconButtonSoftLightSize = qs("#icon-button-soft-light-size");
const iconButtonSoftLightAngle = qs("#icon-button-soft-light-angle");
const iconButtonGlowVisible = qs("#icon-button-glow-visible");
const iconButtonGlowSection = qs("#icon-button-glow-section");
const iconButtonGlowColor = qs("#icon-button-glow-color");
const iconButtonGlowStrength = qs("#icon-button-glow-strength");
const iconButtonGlowSize = qs("#icon-button-glow-size");
const iconButtonGlowAngle = qs("#icon-button-glow-angle");
const iconButtonLeft = qs("#icon-button-left");
const iconButtonTop = qs("#icon-button-top");
const iconButtonWidth = qs("#icon-button-width");
const iconButtonHeight = qs("#icon-button-height");
const iconButtonScale = qs("#icon-button-scale");
const iconButtonRotation = qs("#icon-button-rotation");
const iconButtonActionControls = qs("#icon-button-action-controls");
const iconButtonActionSection = qs("#icon-button-action-section");
const iconButtonPreviewDetails = qs("#icon-button-preview-details");
const iconButtonApplyStyle = qs("#icon-button-apply-style");
const iconButtonApplyCount = qs("#icon-button-apply-count");
const presenceMotionSection = qs("#presence-motion-section");
const doorWindowPerspectiveSection = qs("#door-window-perspective-section");
const doorWindowPerspectiveEditBtn = qs("#door-window-perspective-edit");
const doorWindowPerspectiveReset = qs("#door-window-perspective-reset");
const doorWindowPerspectiveSave = qs("#door-window-perspective-save");
const presenceHaloVisible = qs("#presence-halo-visible");
const presenceHaloScaleX = qs("#presence-halo-scale-x");
const presenceHaloScaleY = qs("#presence-halo-scale-y");
const presenceHaloRotation = qs("#presence-halo-rotation");
const presenceHaloOpacity = qs("#presence-halo-opacity");
const presencePersonVisible = qs("#presence-person-visible");
const presencePersonScale = qs("#presence-person-scale");
const presencePersonRotation = qs("#presence-person-rotation");
const presencePersonOpacity = qs("#presence-person-opacity");
const presenceOrbitDuration = qs("#presence-orbit-duration");
const airConditionerInspector = qs("#air-conditioner-inspector");
const airConditionerLabel = qs("#air-conditioner-label");
const airConditionerDeviceType = qs("#air-conditioner-device-type");
const airConditionerEntityButton = qs("#air-conditioner-entity-button");
const airConditionerEntityMenu = qs("#air-conditioner-entity-menu");
const airConditionerEntitySearch = qs("#air-conditioner-entity-search");
const airConditionerEntityOptions = qs("#air-conditioner-entity-options");
const airConditionerPreviewState = qs("#air-conditioner-preview-state");
const airConditionerLayerOptions = qs("#air-conditioner-layer-options");
const airConditionerButtonSection = qs("#air-conditioner-button-section");
const airConditionerAirflowSection = qs("#air-conditioner-airflow-section");
const airConditionerTransformSection = qs("#air-conditioner-transform-section");
const airConditionerActionSection = qs("#air-conditioner-action-section");
const airConditionerIconVisible = qs("#air-conditioner-icon-visible");
const airConditionerIconOffColor = qs("#air-conditioner-icon-off-color");
const airConditionerIconOnColor = qs("#air-conditioner-icon-on-color");
const airConditionerBadgeColor = qs("#air-conditioner-badge-color");
const airConditionerBadgeOpacity = qs("#air-conditioner-badge-opacity");
const airConditionerSymbolSize = qs("#air-conditioner-symbol-size");
const airConditionerBadgeSize = qs("#air-conditioner-badge-size");
const airConditionerIconLeft = qs("#air-conditioner-icon-left");
const airConditionerIconTop = qs("#air-conditioner-icon-top");
const airConditionerMainVisible = qs("#air-conditioner-main-visible");
const airConditionerMainText = qs("#air-conditioner-main-text");
const airConditionerMainColor = qs("#air-conditioner-main-color");
const airConditionerMainSize = qs("#air-conditioner-main-size");
const airConditionerMainWeight = qs("#air-conditioner-main-weight");
const airConditionerMainSpacing = qs("#air-conditioner-main-spacing");
const airConditionerMainLeft = qs("#air-conditioner-main-left");
const airConditionerMainTop = qs("#air-conditioner-main-top");
const airConditionerSecondaryVisible = qs("#air-conditioner-secondary-visible");
const airConditionerSecondaryText = qs("#air-conditioner-secondary-text");
const airConditionerSecondaryColor = qs("#air-conditioner-secondary-color");
const airConditionerSecondarySize = qs("#air-conditioner-secondary-size");
const airConditionerSecondaryWeight = qs("#air-conditioner-secondary-weight");
const airConditionerSecondarySpacing = qs("#air-conditioner-secondary-spacing");
const airConditionerSecondaryLeft = qs("#air-conditioner-secondary-left");
const airConditionerSecondaryTop = qs("#air-conditioner-secondary-top");
const airConditionerAirflowVisible = qs("#air-conditioner-airflow-visible");
const airConditionerAirflowMotion = qs("#air-conditioner-airflow-motion");
const airConditionerAirflowCoolColor = qs("#air-conditioner-airflow-cool-color");
const airConditionerAirflowHeatColor = qs("#air-conditioner-airflow-heat-color");
const airConditionerAirflowOtherColor = qs("#air-conditioner-airflow-other-color");
const airConditionerAirflowAngle = qs("#air-conditioner-airflow-angle");
const airConditionerAirflowCurve = qs("#air-conditioner-airflow-curve");
const airConditionerAirflowLength = qs("#air-conditioner-airflow-length");
const airConditionerAirflowFade = qs("#air-conditioner-airflow-fade");
const airConditionerAirflowSpread = qs("#air-conditioner-airflow-spread");
const airConditionerAirflowDensity = qs("#air-conditioner-airflow-density");
const airConditionerAirflowIrregularity = qs("#air-conditioner-airflow-irregularity");
const airConditionerAirflowThickness = qs("#air-conditioner-airflow-thickness");
const airConditionerAirflowStrength = qs("#air-conditioner-airflow-strength");
const airConditionerAirflowBlur = qs("#air-conditioner-airflow-blur");
const airConditionerAirflowSpeed = qs("#air-conditioner-airflow-speed");
const airConditionerAirflowOffsetX = qs("#air-conditioner-airflow-offset-x");
const airConditionerAirflowOffsetY = qs("#air-conditioner-airflow-offset-y");
const airConditionerAirflowWidth = qs("#air-conditioner-airflow-width");
const airConditionerAirflowHeight = qs("#air-conditioner-airflow-height");
const airConditionerAirflowScale = qs("#air-conditioner-airflow-scale");
const airConditionerAirflowRotation = qs("#air-conditioner-airflow-rotation");
const airConditionerLeft = qs("#air-conditioner-left");
const airConditionerTop = qs("#air-conditioner-top");
const airConditionerWidth = qs("#air-conditioner-width");
const airConditionerHeight = qs("#air-conditioner-height");
const airConditionerScale = qs("#air-conditioner-scale");
const airConditionerRotation = qs("#air-conditioner-rotation");
const airConditionerActionControls = qs("#air-conditioner-action-controls");
const airConditionerPreviewDetails = qs("#air-conditioner-preview-details");
const airConditionerApplyStyle = qs("#air-conditioner-apply-style");
const airConditionerApplyCount = qs("#air-conditioner-apply-count");
const vacuumMapInspector = qs("#vacuum-map-inspector");
const vacuumMapLabel = qs("#vacuum-map-label");
const vacuumMapEntityButton = qs("#vacuum-map-entity-button");
const vacuumMapEntityMenu = qs("#vacuum-map-entity-menu");
const vacuumMapEntitySearch = qs("#vacuum-map-entity-search");
const vacuumMapEntityOptions = qs("#vacuum-map-entity-options");
const vacuumMapOpacity = qs("#vacuum-map-opacity");
const vacuumMapLeft = qs("#vacuum-map-left");
const vacuumMapTop = qs("#vacuum-map-top");
const vacuumMapScale = qs("#vacuum-map-scale");
const vacuumMapRotation = qs("#vacuum-map-rotation");
const cameraInspector = qs("#camera-inspector");
const cameraLabel = qs("#camera-label");
const cameraEntityButton = qs("#camera-entity-button");
const cameraEntityMenu = qs("#camera-entity-menu");
const cameraEntitySearch = qs("#camera-entity-search");
const cameraEntityOptions = qs("#camera-entity-options");
const cameraFitOptions = qs("#camera-fit-options");
const cameraDisplayModeOptions = qs("#camera-display-mode-options");
const cameraRefreshIntervalField = qs("#camera-refresh-interval-field");
const cameraRefreshInterval = qs("#camera-refresh-interval");
const cameraMediaVisible = qs("#camera-media-visible");
const cameraFrameVisible = qs("#camera-frame-visible");
const cameraFrameColor = qs("#camera-frame-color");
const cameraFrameWidth = qs("#camera-frame-width");
const cameraRadius = qs("#camera-radius");
const cameraFrameAngle = qs("#camera-frame-angle");
const cameraFrameOpacity = qs("#camera-frame-opacity");
const cameraLeft = qs("#camera-left");
const cameraTop = qs("#camera-top");
const cameraWidth = qs("#camera-width");
const cameraHeight = qs("#camera-height");
const cameraScale = qs("#camera-scale");
const cameraRotation = qs("#camera-rotation");
const cameraActionControls = qs("#camera-action-controls");
const cameraApplyStyle = qs("#camera-apply-style");
const cameraApplyCount = qs("#camera-apply-count");
const timeInspector = qs("#time-inspector");
const timeType = qs("#time-type");
const timeLabel = qs("#time-label");
const timeHourFormat = qs("#time-hour-format");
const timeSeconds = qs("#time-seconds");
const timeColor = qs("#time-color");
const timeFontSize = qs("#time-font-size");
const timeFontWeight = qs("#time-font-weight");
const timeLetterSpacing = qs("#time-letter-spacing");
const timeOpacity = qs("#time-opacity");
const timeLeft = qs("#time-left");
const timeTop = qs("#time-top");
const timeScale = qs("#time-scale");
const timeRotation = qs("#time-rotation");
const dateInspector = qs("#date-inspector");
const dateType = qs("#date-type");
const dateLabel = qs("#date-label");
const dateWeekday = qs("#date-weekday");
const dateLunar = qs("#date-lunar");
const datePrimaryColor = qs("#date-primary-color");
const datePrimarySize = qs("#date-primary-size");
const datePrimaryWeight = qs("#date-primary-weight");
const datePrimarySpacing = qs("#date-primary-spacing");
const dateLunarColor = qs("#date-lunar-color");
const dateLunarSize = qs("#date-lunar-size");
const dateLunarWeight = qs("#date-lunar-weight");
const dateLunarSpacing = qs("#date-lunar-spacing");
const dateLineGap = qs("#date-line-gap");
const dateOpacity = qs("#date-opacity");
const dateLeft = qs("#date-left");
const dateTop = qs("#date-top");
const dateScale = qs("#date-scale");
const dateRotation = qs("#date-rotation");
const weatherInspector = qs("#weather-inspector");
const weatherType = qs("#weather-type");
const weatherLabel = qs("#weather-label");
const weatherEntityPicker = qs("#weather-entity-picker");
const weatherEntityButton = qs("#weather-entity-button");
const weatherEntityMenu = qs("#weather-entity-menu");
const weatherEntitySearch = qs("#weather-entity-search");
const weatherEntityOptions = qs("#weather-entity-options");
const weatherIconVisible = qs("#weather-icon-visible");
const weatherTemperatureVisible = qs("#weather-temperature-visible");
const weatherConditionVisible = qs("#weather-condition-visible");
const weatherHumidityVisible = qs("#weather-humidity-visible");
const weatherIconSize = qs("#weather-icon-size");
const weatherIconGap = qs("#weather-icon-gap");
const weatherTemperatureColor = qs("#weather-temperature-color");
const weatherTemperatureSize = qs("#weather-temperature-size");
const weatherTemperatureWeight = qs("#weather-temperature-weight");
const weatherTemperatureSpacing = qs("#weather-temperature-spacing");
const weatherSecondaryColor = qs("#weather-secondary-color");
const weatherSecondarySize = qs("#weather-secondary-size");
const weatherSecondaryWeight = qs("#weather-secondary-weight");
const weatherSecondarySpacing = qs("#weather-secondary-spacing");
const weatherLineGap = qs("#weather-line-gap");
const weatherOpacity = qs("#weather-opacity");
const weatherLeft = qs("#weather-left");
const weatherTop = qs("#weather-top");
const weatherScale = qs("#weather-scale");
const weatherRotation = qs("#weather-rotation");
const lineChartInspector = qs("#line-chart-inspector");
const lineChartType = qs("#line-chart-type");
const lineChartLabel = qs("#line-chart-label");
const lineChartEntityPicker = qs("#line-chart-entity-picker");
const lineChartEntityButton = qs("#line-chart-entity-button");
const lineChartEntityMenu = qs("#line-chart-entity-menu");
const lineChartEntitySearch = qs("#line-chart-entity-search");
const lineChartEntityOptions = qs("#line-chart-entity-options");
const lineChartValueVisible = qs("#line-chart-value-visible");
const lineChartValueScale = qs("#line-chart-value-scale");
const lineChartValueColor = qs("#line-chart-value-color");
const lineChartStatePrecision = qs("#line-chart-state-precision");
const lineChartValueOffsetX = qs("#line-chart-value-offset-x");
const lineChartValueOffsetY = qs("#line-chart-value-offset-y");
const lineChartUpdateInterval = qs("#line-chart-update-interval");
const lineChartHours = qs("#line-chart-hours");
const lineChartCurveRadius = qs("#line-chart-curve-radius");
const lineChartThresholdMode = qs("#line-chart-threshold-mode");
const lineChartThresholdFields = [1, 2, 3, 4].map(item => ({
  value: qs("#line-chart-threshold-" + item + "-value"),
  color: qs("#line-chart-threshold-" + item + "-color")
}));
const lineChartLeft = qs("#line-chart-left");
const lineChartTop = qs("#line-chart-top");
const lineChartWidth = qs("#line-chart-width");
const lineChartHeight = qs("#line-chart-height");
const lineChartScale = qs("#line-chart-scale");
const lineChartRotation = qs("#line-chart-rotation");
const lineChartActionControls = qs("#line-chart-action-controls");
const lineChartApplyStyle = qs("#line-chart-apply-style");
const lineChartApplyCount = qs("#line-chart-apply-count");
const panelFrameInspector = qs("#panel-frame-inspector");
const panelFrameType = qs("#panel-frame-type");
const panelFrameLabel = qs("#panel-frame-label");
const panelFrameMainVisible = qs("#panel-frame-main-visible");
const panelFrameMainText = qs("#panel-frame-main-text");
const panelFrameMainColor = qs("#panel-frame-main-color");
const panelFrameMainSize = qs("#panel-frame-main-size");
const panelFrameMainWeight = qs("#panel-frame-main-weight");
const panelFrameMainOpacity = qs("#panel-frame-main-opacity");
const panelFrameMainSpacing = qs("#panel-frame-main-spacing");
const panelFrameMainLeft = qs("#panel-frame-main-left");
const panelFrameMainTop = qs("#panel-frame-main-top");
const panelFrameSecondaryVisible = qs("#panel-frame-secondary-visible");
const panelFrameSecondaryText = qs("#panel-frame-secondary-text");
const panelFrameSecondaryColor = qs("#panel-frame-secondary-color");
const panelFrameSecondarySize = qs("#panel-frame-secondary-size");
const panelFrameSecondaryWeight = qs("#panel-frame-secondary-weight");
const panelFrameSecondaryOpacity = qs("#panel-frame-secondary-opacity");
const panelFrameSecondarySpacing = qs("#panel-frame-secondary-spacing");
const panelFrameSecondaryLeft = qs("#panel-frame-secondary-left");
const panelFrameSecondaryTop = qs("#panel-frame-secondary-top");
const panelFrameEdgeVisible = qs("#panel-frame-edge-visible");
const panelFrameEdgeColor = qs("#panel-frame-edge-color");
const panelFrameEdgeWidth = qs("#panel-frame-edge-width");
const panelFrameEdgeOpacity = qs("#panel-frame-edge-opacity");
const panelFrameRadius = qs("#panel-frame-radius");
const panelFrameEdgeAngle = qs("#panel-frame-edge-angle");
const panelFrameGlowVisible = qs("#panel-frame-glow-visible");
const panelFrameGlowColor = qs("#panel-frame-glow-color");
const panelFrameGlowStrength = qs("#panel-frame-glow-strength");
const panelFrameGlowSize = qs("#panel-frame-glow-size");
const panelFrameGlowAngle = qs("#panel-frame-glow-angle");
const panelFrameLeft = qs("#panel-frame-left");
const panelFrameTop = qs("#panel-frame-top");
const panelFrameWidth = qs("#panel-frame-width");
const panelFrameHeight = qs("#panel-frame-height");
const panelFrameScale = qs("#panel-frame-scale");
const panelFrameRotation = qs("#panel-frame-rotation");
const panelFrameApplyStyle = qs("#panel-frame-apply-style");
const panelFrameApplyCount = qs("#panel-frame-apply-count");
const navigationInspector = qs("#navigation-inspector");
const navigationType = qs("#navigation-type");
const navigationLabel = qs("#navigation-label");
const navigationPreviewState = qs("#navigation-preview-state");
const navigationEntityButton = qs("#navigation-entity-button");
const navigationEntityMenu = qs("#navigation-entity-menu");
const navigationEntitySearch = qs("#navigation-entity-search");
const navigationEntityOptions = qs("#navigation-entity-options");
const navigationMainText = qs("#navigation-main-text");
const navigationSecondaryText = qs("#navigation-secondary-text");
const navigationMainVisible = qs("#navigation-main-visible");
const navigationSecondaryVisible = qs("#navigation-secondary-visible");
const navigationIconVisible = qs("#navigation-icon-visible");
const navigationFrameVisible = qs("#navigation-frame-visible");
const navigationGlowVisible = qs("#navigation-glow-visible");
const navigationIconButton = qs("#navigation-icon-button");
const navigationIconCopyBtn = qs("#navigation-icon-copy");
const navigationIconMenu = qs("#navigation-icon-menu");
const navigationIconSearch = qs("#navigation-icon-search");
const navigationIconOptions = qs("#navigation-icon-options");
const navigationMainColor = qs("#navigation-main-color");
const navigationSecondaryColor = qs("#navigation-secondary-color");
const navigationMainSize = qs("#navigation-main-size");
const navigationSecondarySize = qs("#navigation-secondary-size");
const navigationMainWeight = qs("#navigation-main-weight");
const navigationSecondaryWeight = qs("#navigation-secondary-weight");
const navigationMainSpacing = qs("#navigation-main-spacing");
const navigationSecondarySpacing = qs("#navigation-secondary-spacing");
const navigationMainTextLeft = qs("#navigation-main-text-left");
const navigationMainTextTop = qs("#navigation-main-text-top");
const navigationSecondaryTextLeft = qs("#navigation-secondary-text-left");
const navigationSecondaryTextTop = qs("#navigation-secondary-text-top");
const navigationTextIdleOpacity = qs("#navigation-text-idle-opacity");
const navigationTextActiveOpacity = qs("#navigation-text-active-opacity");
const navigationIconColor = qs("#navigation-icon-color");
const navigationIconSize = qs("#navigation-icon-size");
const navigationIconLeft = qs("#navigation-icon-left");
const navigationIconTop = qs("#navigation-icon-top");
const navigationIconIdleOpacity = qs("#navigation-icon-idle-opacity");
const navigationIconActiveOpacity = qs("#navigation-icon-active-opacity");
const navigationFrameColor = qs("#navigation-frame-color");
const navigationFrameWidth = qs("#navigation-frame-width");
const navigationFrameIdleOpacity = qs("#navigation-frame-idle-opacity");
const navigationFrameActiveOpacity = qs("#navigation-frame-active-opacity");
const navigationFrameAngle = qs("#navigation-frame-angle");
const navigationGlowColor = qs("#navigation-glow-color");
const navigationGlowAngle = qs("#navigation-glow-angle");
const navigationGlowIdleStrength = qs("#navigation-glow-idle-strength");
const navigationGlowIdleSize = qs("#navigation-glow-idle-size");
const navigationGlowActiveStrength = qs("#navigation-glow-active-strength");
const navigationGlowActiveSize = qs("#navigation-glow-active-size");
const navigationRadius = qs("#navigation-radius");
const navigationLeft = qs("#navigation-left");
const navigationTop = qs("#navigation-top");
const navigationWidth = qs("#navigation-width");
const navigationHeight = qs("#navigation-height");
const navigationScale = qs("#navigation-scale");
const navigationRotation = qs("#navigation-rotation");
const navigationActionControls = qs("#navigation-action-controls");
const navigationApplyStyle = qs("#navigation-apply-style");
const navigationApplyCount = qs("#navigation-apply-count");
const navigationStyleApplyDialog = qs("#navigation-style-apply-dialog");
const navigationStyleApplyCloseBtn = qs("#navigation-style-apply-close");
const navigationStyleApplyTitle = qs("#navigation-style-apply-title");
const navigationStyleApplySummary = qs("#navigation-style-apply-summary");
const navigationStyleApplyProperties = qs("#navigation-style-apply-properties");
const navigationStyleApplyTargetHeading = qs("#navigation-style-apply-target-heading");
const navigationStyleApplyTargetScope = qs("#navigation-style-apply-target-scope");
const navigationStyleApplyTargets = qs("#navigation-style-apply-targets");
const navigationStyleApplyMessage = qs("#navigation-style-apply-message");
const navigationStyleApplyCancelBtn = qs("#navigation-style-apply-cancel");
const navigationStyleApplyConfirmBtn = qs("#navigation-style-apply-confirm");
const popupNameDialog = qs("#popup-name-dialog");
const popupNameDialogTitle = qs("#popup-name-dialog-title");
const popupNameForm = qs("#popup-name-form");
const popupNameCloseBtn = qs("#popup-name-close");
const popupNameCancelBtn = qs("#popup-name-cancel");
const popupModuleDialog = qs("#popup-module-dialog");
const popupModuleDialogTitle = qs("#popup-module-dialog-title");
const popupModuleForm = qs("#popup-module-form");
const popupModuleCloseBtn = qs("#popup-module-close");
const popupModuleCancelBtn = qs("#popup-module-cancel");
const popupModuleEntityButton = qs("#popup-module-entity-button");
const popupModuleEntityMenu = qs("#popup-module-entity-menu");
const popupModuleEntitySearch = qs("#popup-module-entity-search");
const popupModuleEntityOptions = qs("#popup-module-entity-options");
const popupModuleClimateDeviceType = qs("#popup-module-climate-device-type");
const deletePopupDialog = qs("#delete-popup-dialog");
const deletePopupCloseBtn = qs("#delete-popup-close");
const deletePopupCancelBtn = qs("#delete-popup-cancel");
const deletePopupConfirmBtn = qs("#delete-popup-confirm");
const deletePopupName = qs("#delete-popup-name");
const deleteAssetDialog = qs("#delete-asset-dialog");
const deleteAssetCloseBtn = qs("#delete-asset-close");
const deleteAssetCancelBtn = qs("#delete-asset-cancel");
const deleteAssetConfirmBtn = qs("#delete-asset-confirm");
const deleteAssetName = qs("#delete-asset-name");
const deleteAssetFolderDialog = qs("#delete-asset-folder-dialog");
const deleteAssetFolderCloseBtn = qs("#delete-asset-folder-close");
const deleteAssetFolderCancelBtn = qs("#delete-asset-folder-cancel");
const deleteAssetFolderConfirmBtn = qs("#delete-asset-folder-confirm");
const deleteAssetFolderName = qs("#delete-asset-folder-name");
const deleteAssetFolderCount = qs("#delete-asset-folder-count");
let haConnection = null;
let haSyncStatus = null;
let editorRenderer = null;
let dashboardPreviewRenderer = null;
const historySeriesCache = new Map();
const runtimeStateCache = new Map();
const virtualEntityStateCache = new Map();
let editorMode = "edit";
let projectList = [];
let currentProject = null;
let componentAddScope = "shared";
let projectDialogMode = "create";
let projectResizeWarningResolve = null;
let selectedProjectTemplateId = "dwell-light";
let defaultCanvasWidth = 2778;
let defaultCanvasHeight = 1940;
let projectAspectLocked = false;
let lockedAspectWidth = 2778;
let lockedAspectHeight = 1940;
let projectPreviewUrls = [];
let projectPreviewTitles = [];
let projectPreviewIndex = 0;
let pageDialogMode = "create";
let haFormEditing = false;
let haBootstrapPromise = null;
let componentId = null;
let activeGroupId = null;
let lastComponentClick = {
  componentId: null,
  at: 0
};
let selectedPopupId = null;
let popupNameDialogMode = "create";
let editingPopupModuleId = null;
let popupActionPending = null;
let pendingDeletePopupId = null;
let pendingDeleteAssetId = null;
let pendingDeleteAssetFolder = null;
let builtinAssets = [];
let userAssets = [];
let assetsVersionToken = null;
let uiPacks = [];
let entityCatalog = [];
let deviceCatalog = [];
let entityById = new Map();
let entityStateById = {};
let entityLoadPromise = null;
let entitiesLoaded = false;
let entityLoadError = null;
let documentMutationQueue = Promise.resolve();
let imageAssetFolderFilter = "";
let ibeAssetFolderFilter = "";
let imageAssetSource = "builtin";
let ibeAssetSource = "builtin";
let imagePreviewTimer = null;
let navigationIconSearchTimer = null;
let navigationIconCopyResetTimer = null;
let ibeIconSearchTimer = null;
let ibeIconCopyResetTimer = null;
let iconButtonIconSearchTimer = null;
let iconButtonIconCopyResetTimer = null;
let titleButtonIconSearchTimer = null;
let titleButtonIconCopyResetTimer = null;
let lightStatisticsIconSearchTimer = null;
let lightStatisticsIconCopyResetTimer = null;
let lightStatisticsSelectedEntityId = "";
let lightStatisticsReplaceIndex = -1;
let lightStatisticsEditingComponentId = "";
let defaultStyleApplyResetTimer = null;
let panelFrameStyleApplyResetTimer = null;
let lineChartStyleApplyResetTimer = null;
let ibeStyleApplyResetTimer = null;
let titleButtonStyleApplyResetTimer = null;
let iconButtonStyleApplyResetTimer = null;
let cameraStyleApplyResetTimer = null;
let airConditionerStyleApplyResetTimer = null;
let styleApplyPending = null;
let effectImageAlignSourceId = null;
const effectSizeWarmupIds = new Set();
let selectedComponentIds = new Set();
let rangeSelectAnchorId = null;
const historyState = {
  undo: [],
  redo: [],
  busy: false
};
const maxHistoryEntries = 10;
const unsavedStoragePrefix = "ha-bridge:unsaved:";
let lastSavedSignature = "";
let autosaveTimer = null;
let documentDirty = false;
let copyTargetProject = null;
let copyScalePercent = 0;
let copySuccessPayload = null;
let isPastingComponents = false;
let recoveredDraft = null;
let contextMenuComponentId = null;
const imagePreviewStateById = new Map();
const ibePreviewStateById = new Map();
const presencePreviewStateById = new Map();
const presencePreviewExpandedIds = new Set();
const unitQuadUv = Object.freeze([0, 0, 1, 0, 1, 1, 0, 1]);
const ibeLayerById = new Map();
const airConditionerPreviewStateById = new Map();
const floorplanPreviewById = new Map();
const airConditionerLayerById = new Map();
const componentBoundsCache = new Map();
const entityOptionCache = new Map();
const iconOptionCache = new Map();
const assetOptionCache = new Map();
const popupEntityOptionCache = new Map();
const relatedEntityOptionCache = new Map();
const customSelectStateByEl = new Map();
const boundColorInputs = new Map();
const boundNumberInputs = new WeakSet();
let openMenuState = null;
let activeColorInput = null;
let colorPickerOriginalHex = "";
let colorPickerHue = 0;
let colorPickerSaturation = 0;
let colorPickerValue = 1;
let colorPickerPointerId = null;
let colorCopyResetTimer = null;
let colorPickerDraftHex = "";
let svPointerCapture = null;
async function apiFetch(value, fetchOptions = {}) {
  const response = await fetch("/api/v1" + value, {
    cache: "no-store",
    ...fetchOptions,
    headers: fetchOptions.body ? {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {})
    } : fetchOptions.headers
  });
  const responseText = response.status === 204 ? "" : await response.text();
  let temp = null;
  if (responseText) {
    try {
      temp = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error("接口返回格式异常：" + value.split("?")[0] + "（HTTP " + response.status + "）");
      }
    }
  }
  if (response.status === 401) {
    window.location.assign("/login");
    const error = new Error("登录状态已失效。");
    throw window.HABridgeLog?.linkError(error, response) || error;
  }
  if (response.status === 403 && temp?.detail?.code === "LICENSE_RESTRICTED") {
    window.location.replace("/license");
    const error = new Error("授权已失效，请重新激活。");
    throw window.HABridgeLog?.linkError(error, response) || error;
  }
  if (!response.ok) {
    const detail = temp?.detail;
    const sliced = responseText.trim().slice(0, 240);
    const error = new Error(typeof detail == "string" ? detail : detail?.message || "请求失败：" + value.split("?")[0] + "（HTTP " + response.status + "）" + (sliced ? " · " + sliced : ""));
    if (detail && typeof detail == "object" && detail.code) {
      error.code = detail.code;
    }
    throw window.HABridgeLog?.linkError(error, response) || error;
  }
  return temp;
}
function setStatusMessage(element, value, className = "") {
  element.hidden = !value;
  element.textContent = value;
  element.className = ("settings-message " + className).trim();
}
function onError(value) {
  window.HABridgeLog?.error(value, {
    projectId: currentProject?.projectId || "",
    componentId: componentId || "",
    phase: "editor-operation"
  });
  errorDialogMessage.textContent = value?.message || "操作失败。";
  if (!errorDialog.open) {
    errorDialog.showModal();
  }
}
function closeProjectActionsMenu() {
  projectActionsMenu.hidden = true;
  projectActionsButton.setAttribute("aria-expanded", "false");
}
function closePageActionsMenu() {
  pageActionsMenu.hidden = true;
  pageActionsButton.setAttribute("aria-expanded", "false");
}
function closePopupActionsMenu() {
  popupActionsMenu.hidden = true;
  popupActionsButton.setAttribute("aria-expanded", "false");
  popupActionPending = null;
}
function closeMenuState(value = openMenuState) {
  if (value) {
    value.menu.hidden = true;
    value.button.setAttribute("aria-expanded", "false");
    if (openMenuState === value) {
      openMenuState = null;
    }
  }
}
function positionMenuState(value) {
  if (value.menu.hidden) {
    return;
  }
  const rect = value.button.getBoundingClientRect();
  const count = Math.max(80, Math.min(320, window.innerHeight - 16));
  value.menu.style.width = rect.width + "px";
  value.menu.style.maxHeight = count + "px";
  const minValue = Math.min(value.menu.scrollHeight, count);
  const count2 = Math.max(8, Math.min(window.innerWidth - rect.width - 8, rect.left));
  const number = rect.bottom + 4;
  const chosen = number + minValue <= window.innerHeight - 8 ? number : Math.max(8, rect.top - minValue - 4);
  value.menu.style.left = count2 + "px";
  value.menu.style.top = chosen + "px";
}
function syncCustomSelect(element) {
  const value = customSelectStateByEl.get(element);
  if (!value) {
    return;
  }
  const temp2 = element.selectedOptions[0];
  const flag = element.id === "page-select" && temp2?.dataset.defaultPage === "true";
  value.button.textContent = flag ? "★ " + temp2.textContent : temp2?.textContent || (element.id === "project-select" ? "暂无仪表盘" : element.id === "popup-select" ? "暂无组合弹窗" : element.id === "image-asset-folder" ? "暂无图片文件夹" : "暂无页面");
  value.button.disabled = element.disabled;
  const chosen = element === imageAssetFolder ? "image" : element === ibeAssetFolder ? "ibe" : "";
  const chosen2 = chosen === "image" ? imageAssetSource : chosen === "ibe" ? ibeAssetSource : "";
  value.menu.replaceChildren(...[...element.options].map(el3 => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "custom-select-option";
    button.dataset.value = el3.value;
    if (element.id === "page-select" && el3.dataset.defaultPage === "true") {
      const span = document.createElement("span");
      span.className = "custom-select-default-marker";
      span.textContent = "★";
      span.setAttribute("aria-hidden", "true");
      const span2 = document.createElement("span");
      span2.textContent = el3.textContent;
      button.append(span, span2);
    } else {
      button.textContent = el3.textContent;
    }
    button.classList.toggle("active", el3.value === element.value);
    button.disabled = el3.disabled;
    if (!chosen || !isStudioExportFolder(chosen2, el3.value)) {
      return button;
    }
    const temp = document.createElement("div");
    temp.className = "custom-select-option-row";
    const button2 = document.createElement("button");
    button2.type = "button";
    button2.className = "custom-select-option-delete";
    button2.dataset.deleteStudio3dFolder = el3.value;
    button2.dataset.assetFolderKind = chosen;
    button2.title = "删除 " + el3.textContent;
    button2.setAttribute("aria-label", "删除自动导图文件夹 " + el3.textContent);
    button2.textContent = "×";
    temp.append(button, button2);
    return temp;
  }));
  if (element.disabled) {
    closeMenuState(value);
  } else if (!value.menu.hidden) {
    window.requestAnimationFrame(() => positionMenuState(value));
  }
}
function enhanceSelect(select) {
  if (!select || customSelectStateByEl.has(select) || select.dataset.nativeSelect === "true") {
    return;
  }
  const wrapper = document.createElement("span");
  wrapper.className = "custom-select";
  select.before(wrapper);
  wrapper.append(select);
  select.classList.add("native-select-control");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "custom-select-button";
  button.setAttribute("aria-label", select.getAttribute("aria-label") || "打开选择菜单");
  button.setAttribute("aria-haspopup", "listbox");
  button.setAttribute("aria-expanded", "false");
  wrapper.append(button);
  const menu = document.createElement("div");
  menu.className = "custom-select-menu";
  menu.dataset.selectId = select.id;
  menu.setAttribute("role", "listbox");
  menu.hidden = true;
  (select.closest("dialog") || document.body).append(menu);
  const value = {
    select,
    wrapper,
    button,
    menu
  };
  customSelectStateByEl.set(select, value);
  syncCustomSelect(select);
  button.addEventListener("click", () => {
    const hidden = menu.hidden;
    closeMenuState();
    closeProjectActionsMenu();
    closePageActionsMenu();
    if (hidden) {
      syncCustomSelect(select);
      menu.hidden = false;
      button.setAttribute("aria-expanded", "true");
      openMenuState = value;
      window.requestAnimationFrame(() => positionMenuState(value));
    }
  });
  menu.addEventListener("click", event => {
    const ancestorEl = event.target.closest("[data-delete-studio3d-folder]");
    if (ancestorEl) {
      event.preventDefault();
      event.stopPropagation();
      confirmDeleteStudioExportFolder(ancestorEl.dataset.assetFolderKind, ancestorEl.dataset.deleteStudio3dFolder);
      return;
    }
    const ancestorEl2 = event.target.closest(".custom-select-option");
    if (!ancestorEl2 || ancestorEl2.disabled) {
      return;
    }
    const inputValue = select.value;
    select.value = ancestorEl2.dataset.value;
    syncCustomSelect(select);
    closeMenuState(value);
    if (select.value !== inputValue) {
      select.dispatchEvent(new Event("change", {
        bubbles: true
      }));
    }
  });
  select.addEventListener("change", () => syncCustomSelect(select));
  new MutationObserver(() => syncCustomSelect(select)).observe(select, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["disabled", "label", "selected"]
  });
}
function enhanceSelectsIn(value = document) {
  if (value instanceof HTMLSelectElement) {
    enhanceSelect(value);
  }
  value.querySelectorAll?.("select").forEach(item => enhanceSelect(item));
}
function applyColorPickerHex(value, skipPreview = false) {
  const temp = normalizedHexColor(value);
  if (!temp || !activeColorInput) {
    return;
  }
  const rgb2 = hexToRgb(temp);
  const hsv = rgbToHsv(rgb2);
  colorPickerHue = hsv.s > 0 ? hsv.h : colorPickerHue;
  colorPickerSaturation = hsv.s;
  colorPickerValue = hsv.v;
  globalColorPicker.style.setProperty("--picker-hue", "hsl(" + colorPickerHue + " 100% 50%)");
  globalColorPicker.style.setProperty("--picker-color", temp);
  globalColorPickerMarker.style.left = colorPickerSaturation * 100 + "%";
  globalColorPickerMarker.style.top = (1 - colorPickerValue) * 100 + "%";
  globalColorPickerHue.value = String(Math.round(colorPickerHue));
  if (document.activeElement !== globalColorPickerHex) {
    globalColorPickerHex.value = temp.toUpperCase();
  }
  globalColorPickerR.value = String(Math.round(rgb2.r));
  globalColorPickerG.value = String(Math.round(rgb2.g));
  globalColorPickerB.value = String(Math.round(rgb2.b));
  globalColorPickerSwatch.style.background = temp;
  if (activeColorInput.value !== temp) {
    activeColorInput.value = temp;
    if (skipPreview) {
      activeColorInput.dispatchEvent(new Event("input", {
        bubbles: true
      }));
    }
  }
}
function syncColorPickerFromHsv() {
  const value = hsvToRgb(colorPickerHue, colorPickerSaturation, colorPickerValue);
  applyColorPickerHex(rgbToHex(value.r, value.g, value.b), true);
}
function positionGlobalColorPicker() {
  if (globalColorPicker.hidden || !activeColorInput) {
    return;
  }
  const value = activeColorInput.getBoundingClientRect();
  const rect = globalColorPicker.getBoundingClientRect();
  const temp = 9;
  const number2 = 8;
  const number = value.left - rect.width - temp;
  const chosen = number >= number2 ? number : Math.min(window.innerWidth - rect.width - number2, value.right + temp);
  const clamped = clampNumber(value.top, number2, Math.max(number2, window.innerHeight - rect.height - number2));
  globalColorPicker.style.left = Math.max(number2, chosen) + "px";
  globalColorPicker.style.top = clamped + "px";
}
function openGlobalColorPicker(element) {
  if (!element || element.disabled) {
    return;
  }
  if (activeColorInput && activeColorInput !== element) {
    closeGlobalColorPicker();
  }
  activeColorInput = element;
  colorPickerOriginalHex = normalizedHexColor(element.value) || "#000000";
  const value = rgbToHsv(hexToRgb(colorPickerOriginalHex));
  colorPickerHue = value.h;
  colorPickerSaturation = value.s;
  colorPickerValue = value.v;
  globalColorPicker.hidden = false;
  applyColorPickerHex(colorPickerOriginalHex);
  window.requestAnimationFrame(positionGlobalColorPicker);
}
function closeGlobalColorPicker() {
  if (!activeColorInput) {
    return;
  }
  const element = activeColorInput;
  const value = normalizedHexColor(element.value) !== colorPickerOriginalHex;
  globalColorPicker.hidden = true;
  activeColorInput = null;
  colorPickerPointerId = null;
  if (value) {
    element.dispatchEvent(new Event("change", {
      bubbles: true
    }));
  }
  syncIconButtonIcon4(element);
}
function refreshActiveColorPicker() {
  if (!globalColorPicker.hidden && activeColorInput?.isConnected) {
    applyColorPickerHex(activeColorInput.value);
  }
}
function bindColorInputsIn(value = document) {
  (value instanceof HTMLInputElement && value.type === "color" ? [value] : [...(value.querySelectorAll?.("input[type=\"color\"]") || [])]).forEach(el2 => {
    if (!boundColorInputs.has(el2)) {
      boundColorInputs.set(el2, true);
      el2.title = "打开颜色选择器";
      el2.addEventListener("pointerdown", event => {
        event.preventDefault();
        openGlobalColorPicker(el2);
      });
      el2.addEventListener("click", event => event.preventDefault());
      el2.addEventListener("keydown", event => {
        if (["Enter", " "].includes(event.key)) {
          event.preventDefault();
          openGlobalColorPicker(el2);
        }
      });
    }
  });
}
function stepNumberInput(element, value) {
  if (!element || element.disabled || element.readOnly) {
    return false;
  }
  const inputValue = element.value;
  try {
    if (value > 0) {
      element.stepUp();
    } else {
      element.stepDown();
    }
  } catch {
    const flag = Number(element.dataset?.numberStep) || Number(element.step) || 1;
    const number = Number(element.value) || 0;
    const chosen = element.min === "" ? -Infinity : Number(element.min);
    const chosen2 = element.max === "" ? Infinity : Number(element.max);
    element.value = String(clampNumber(number + flag * value, chosen, chosen2));
  }
  if (element.value === inputValue) {
    return false;
  } else {
    element.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    return true;
  }
}
function bindNumberInputsIn(value = document) {
  const elements = value instanceof HTMLInputElement && value.type === "number" ? [value] : [...(value.querySelectorAll?.(".inspector-form input[type=\"number\"], .i3d-editor input[type=\"number\"], .i3d-vacuum-map-editor input[type=\"number\"]") || [])];
  for (const temp of elements) {
    if (boundNumberInputs.has(temp)) {
      continue;
    }
    boundNumberInputs.add(temp);
    const span = document.createElement("span");
    span.className = "inspector-number-control";
    const span2 = document.createElement("span");
    span2.className = "inspector-number-steppers";
    const createControl = (item, param, param2) => {
      const element = document.createElement("button");
      element.type = "button";
      element.tabIndex = -1;
      element.className = "inspector-number-stepper";
      element.setAttribute("aria-label", param);
      element.innerHTML = "<svg viewBox=\"0 0 10 6\" aria-hidden=\"true\"><path d=\"" + param2 + "\"></path></svg>";
      element.addEventListener("click", event => event.preventDefault());
      element.addEventListener("pointerdown", event => {
        if (event.button !== 0 || temp.disabled || temp.readOnly) {
          return;
        }
        event.preventDefault();
        temp.focus({
          preventScroll: true
        });
        let temp5 = stepNumberInput(temp, item);
        let flag3 = false;
        let timerId = window.setTimeout(() => {
          timerId = window.setInterval(() => {
            temp5 = stepNumberInput(temp, item) || temp5;
          }, 55);
        }, 320);
        const callback = () => {
          if (!flag3) {
            flag3 = true;
            window.clearTimeout(timerId);
            window.clearInterval(timerId);
            element.removeEventListener("pointerup", callback);
            element.removeEventListener("pointercancel", callback);
            element.removeEventListener("lostpointercapture", callback);
            if (temp5) {
              temp.dispatchEvent(new Event("change", {
                bubbles: true
              }));
            }
          }
        };
        element.addEventListener("pointerup", callback);
        element.addEventListener("pointercancel", callback);
        element.addEventListener("lostpointercapture", callback);
        try {
          element.setPointerCapture(event.pointerId);
        } catch {}
      });
      return element;
    };
    span2.append(createControl(1, "增加数值", "M1 5 5 1l4 4"), createControl(-1, "减少数值", "M1 1 5 5l4-4"));
    temp.before(span);
    span.append(temp, span2);
    let flag2 = false;
    temp.addEventListener("keydown", event => {
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        flag2 = stepNumberInput(temp, event.key === "ArrowUp" ? 1 : -1) || flag2;
      }
    });
    temp.addEventListener("keyup", event2 => {
      if (!!["ArrowUp", "ArrowDown"].includes(event2.key) && !!flag2) {
        flag2 = false;
        temp.dispatchEvent(new Event("change", {
          bubbles: true
        }));
      }
    });
  }
}
function setWorkspaceEmpty(value) {
  workspace.classList.toggle("empty", !value);
  editorCanvas.classList.toggle("workspace-empty-state", !value);
  editorCanvas.classList.toggle("canvas-placeholder", value);
  projectActionsButton.disabled = !value;
  uiPackOpenBtn.disabled = !value;
  pageNewBtn.disabled = !value;
  popupNewBtn.disabled = !value;
  if (!value) {
    editorCanvas.removeAttribute("style");
    editorCanvas.innerHTML = "<div class=\"canvas-message\"><strong>请从左侧新建仪表盘。</strong></div>";
    closeProjectActionsMenu();
    closePageActionsMenu();
  }
  syncCanvasSizeFields();
  syncDashboardDisplayHint();
  syncDashboardSoundToggle();
}
function currentUiPackId(value = currentProject?.document) {
  return value?.uiPack?.id || "ui.base";
}
function currentUiPack(value = currentUiPackId()) {
  return uiPacks.find(component => component.id === value) || (value === "ui.base" ? {
    id: "ui.base",
    name: "栖光",
    englishName: "DWELL LIGHT",
    version: "1.0.0",
    featureCode: "ui.base",
    description: "黑色界面与橙色高亮，包含现有控件、弹窗和示例素材。",
    includes: ["components", "popups", "assets"],
    allowed: true
  } : null);
}
function renderUiPackSummary() {
  const value = currentUiPack();
  uiPackCurrentName.textContent = value?.name || "未知 UI";
  uiPackCurrentVersion.textContent = value ? (value.englishName || value.id) + " · " + value.version : currentUiPackId();
}
function renderUiPackDialog() {
  const value = currentUiPackId();
  const options = {
    dashboards: "仪表盘",
    components: "控件",
    popups: "弹窗",
    assets: "素材"
  };
  if (!uiPacks.length) {
    const element = document.createElement("div");
    element.className = "component-template-empty";
    element.textContent = "暂无可用 UI 方案。";
    uiPackList.replaceChildren(element);
    return;
  }
  uiPackList.replaceChildren(...uiPacks.map(component => {
    const temp = document.createElement("article");
    const flag = component.id === value;
    temp.className = "ui-pack-card" + (flag ? " current" : "");
    const element = document.createElement("div");
    element.className = "ui-pack-preview";
    if (component.previewUrl) {
      element.classList.add("has-cover");
      const img = document.createElement("img");
      img.src = component.previewUrl;
      img.alt = component.name + " 仪表盘预览";
      element.append(img);
    }
    const div2 = document.createElement("div");
    div2.className = "ui-pack-card-copy";
    const span = document.createElement("span");
    span.textContent = (component.englishName || component.id) + " · " + component.version;
    const el3 = document.createElement("strong");
    el3.textContent = component.name;
    const el4 = document.createElement("p");
    el4.textContent = component.description;
    const div3 = document.createElement("div");
    div3.className = "ui-pack-includes";
    for (const temp4 of component.includes || []) {
      const iconEl = document.createElement("i");
      iconEl.textContent = options[temp4] || temp4;
      div3.append(iconEl);
    }
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.uiPackId = component.id;
    button.disabled = flag || !component.allowed;
    button.textContent = flag ? "当前使用" : component.allowed ? "应用到当前仪表盘" : "尚未解锁";
    if (!flag && component.allowed) {
      button.className = "primary";
    }
    div2.append(span, el3, el4, div3, button);
    temp.append(element, div2);
    return temp;
  }));
}
async function loadUiPacks() {
  uiPacks = (await apiFetch("/ui-packs?_=" + Date.now())).items || [];
  renderUiPackSummary();
  if (uiPackDialog.open) {
    renderUiPackDialog();
  }
  return uiPacks;
}
function destroyDashboardPreview() {
  dashboardPreviewRenderer?.destroy();
  dashboardPreviewRenderer = null;
}
function renderDashboardPreview(value = pageSelect.value) {
  if (editorMode !== "dashboard") {
    destroyDashboardPreview();
    return;
  }
  if (!currentProject?.document?.pages?.length) {
    destroyDashboardPreview();
    dashboardPreview.innerHTML = "<div class=\"canvas-message\"><strong>" + (currentProject ? "请从左侧新建页面。" : "请从左侧新建仪表盘。") + "</strong></div>";
    return;
  }
  if (!dashboardPreviewRenderer) {
    dashboardPreviewRenderer = new PanelRenderer(dashboardPreview, {
      editable: false,
      historySeriesCache: historySeriesCache,
      runtimeStateCache: runtimeStateCache,
      virtualEntityStateCache: virtualEntityStateCache,
      onError,
      onRuntimeButtonPress() {
        buttonSound.play();
      },
      onPageChange(component) {
        pageSelect.value = component.path;
        syncCustomSelect(pageSelect);
      }
    });
    dashboardPreviewRenderer.setEntityCatalog(entityCatalog, entityStateById, deviceCatalog);
  }
  dashboardPreviewRenderer.setDocument(currentProject.document, value);
}
function syncDashboardDisplayHint() {
  const value = String(currentProject?.document?.name || "").trim();
  const flag = editorMode === "dashboard" && !!value;
  dashboardDisplayHint.hidden = !flag;
  if (!flag) {
    dashboardDisplayLink.removeAttribute("href");
    dashboardDisplayLink.textContent = "";
    return;
  }
  const temp = new URL("/habridge/" + encodeURIComponent(value), window.location.origin);
  dashboardDisplayLink.href = temp.href;
  dashboardDisplayLink.textContent = decodeURI(temp.href);
  dashboardDisplayLink.title = temp.href;
}
function formatDisplayDate(value) {
  const temp = new Date(value);
  if (Number.isFinite(temp.getTime())) {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(temp);
  } else {
    return "尚未在线";
  }
}
async function loadDisplayPairingCodes() {
  if (!currentProject) {
    return;
  }
  const value = (await apiFetch("/displays/pairing-codes?projectId=" + encodeURIComponent(currentProject.projectId))).items || [];
  displayDeviceCount.textContent = value.length + " 个";
  displayDeviceList.replaceChildren();
  if (!value.length) {
    const element = document.createElement("p");
    element.textContent = "暂无配对码";
    displayDeviceList.append(element);
    return;
  }
  for (const temp of value) {
    const div2 = document.createElement("div");
    div2.className = "display-device-item" + (temp.enabled ? "" : " is-disabled");
    const div3 = document.createElement("div");
    div3.className = "display-device-copy";
    const element = document.createElement("strong");
    element.textContent = temp.name;
    const span = document.createElement("span");
    const chosen = temp.device ? "已绑定 · 最后在线 " + formatDisplayDate(temp.device.lastSeenAt) : "等待设备配对";
    span.textContent = (temp.enabled ? "已启用" : "已停用") + " · " + chosen;
    const el3 = document.createElement("strong");
    el3.className = "display-device-code";
    el3.textContent = temp.code || "——";
    const div4 = document.createElement("div");
    div4.className = "display-device-actions";
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = temp.enabled ? "停用" : "启用";
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        await apiFetch("/displays/pairing-codes/" + encodeURIComponent(temp.id), {
          method: "PATCH",
          body: JSON.stringify({
            enabled: !temp.enabled
          })
        });
        await loadDisplayPairingCodes();
      } catch (error) {
        setStatusMessage(displayDevicesMessage, error.message, "error");
        button.disabled = false;
      }
    });
    const button2 = document.createElement("button");
    button2.type = "button";
    button2.className = "danger";
    button2.textContent = "删除";
    button2.addEventListener("click", async () => {
      if (window.confirm("确认删除“" + temp.name + "”的固定配对码？绑定设备会立即失效。")) {
        button2.disabled = true;
        try {
          await apiFetch("/displays/pairing-codes/" + encodeURIComponent(temp.id), {
            method: "DELETE"
          });
          await loadDisplayPairingCodes();
        } catch (error) {
          setStatusMessage(displayDevicesMessage, error.message, "error");
          button2.disabled = false;
        }
      }
    });
    div3.append(element, span);
    div4.append(button, button2);
    div2.append(div3, el3, div4);
    displayDeviceList.append(div2);
  }
}
async function openDisplayDevicesDialog() {
  if (currentProject) {
    setStatusMessage(displayDevicesMessage, "");
    if (!displayDevicesDialog.open) {
      displayDevicesDialog.showModal();
    }
    try {
      await loadDisplayPairingCodes();
    } catch (error) {
      setStatusMessage(displayDevicesMessage, error.message, "error");
    }
  }
}
async function generateDisplayPairingCode(event) {
  event?.preventDefault();
  if (currentProject) {
    displayPairingGenerateBtn.disabled = true;
    setStatusMessage(displayDevicesMessage, "");
    try {
      const value = await apiFetch("/displays/pairing-code", {
        method: "POST",
        body: JSON.stringify({
          projectId: currentProject.projectId,
          name: displayPairingName.value,
          code: displayPairingCustomCode.value
        })
      });
      displayPairingForm.reset();
      await loadDisplayPairingCodes();
    } catch (error) {
      setStatusMessage(displayDevicesMessage, error.message, "error");
    } finally {
      displayPairingGenerateBtn.disabled = false;
    }
  }
}
function syncCanvasSizeFields() {
  const canvas = currentProject?.document?.canvas;
  const numeric = Number(canvas?.width);
  const number = Number(canvas?.height);
  const value = editorMode !== "popup" && Number.isFinite(numeric) && numeric > 0 && Number.isFinite(number) && number > 0;
  workspaceResolution.hidden = !value;
  workspaceResolution.textContent = value ? Math.round(numeric) + " × " + Math.round(number) : "";
}
function setEditorMode(value) {
  editorMode = ["edit", "dashboard", "popup"].includes(value) ? value : "edit";
  const flag = editorMode === "edit";
  const flag2 = editorMode === "dashboard";
  const flag3 = editorMode === "popup";
  pageControl.hidden = flag3;
  popupControl.hidden = !flag3;
  navigatorContent.classList.toggle("popup-mode", flag3);
  showPageEditor.classList.toggle("active", !flag3);
  showPageEditor.setAttribute("aria-selected", String(!flag3));
  showPopupEditor.classList.toggle("active", flag3);
  showPopupEditor.setAttribute("aria-selected", String(flag3));
  if (!flag) {
    clearPreviewStates();
  }
  editorCanvas.hidden = !flag;
  dashboardPreview.hidden = !flag2;
  customPopupEditor.hidden = !flag3;
  workspace.classList.toggle("empty", !currentProject);
  workspaceTitle.textContent = flag2 ? "仪表盘" : flag3 ? "组合弹窗" : "页面画布";
  syncCanvasSizeFields();
  syncDashboardDisplayHint();
  syncDashboardSoundToggle();
  for (const [element, temp] of [[showEditorPreview, flag], [showDashboardPreview, flag2]]) {
    element.classList.toggle("active", temp);
    element.setAttribute("aria-selected", String(temp));
  }
  if (flag) {
    destroyDashboardPreview();
    if (currentProject?.document?.pages?.length) {
      createPanelRenderer().setDocument(currentProject.document, pageSelect.value);
      editorRenderer.setSelectedComponents([...selectedComponentIds], componentId);
    }
    window.requestAnimationFrame(fitWorkspaceToCanvas);
  } else if (flag2) {
    editorRenderer?.destroy();
    editorRenderer = null;
    renderDashboardPreview();
    window.requestAnimationFrame(() => dashboardPreviewRenderer?.resize());
  } else if (flag3) {
    clearSelection();
    renderComponentTree();
    refreshInspector();
    editorRenderer?.destroy();
    editorRenderer = null;
    destroyDashboardPreview();
    renderList();
  }
}
function haBaseUrlOrigin() {
  const value = String(haConnection?.baseUrl || "").trim();
  try {
    const payload = new URL(value);
    if (!["http:", "https:"].includes(payload.protocol) || payload.username || payload.password) {
      throw new Error();
    }
    window.open(payload.href, "_blank", "noopener,noreferrer");
  } catch {
    onError(new Error("请先配置有效的 Home Assistant 地址。"));
  }
}
function syncDefaultPageAction(value = !!currentProject?.document?.pages?.length) {
  if (defaultPageAction) {
    const page = currentPage();
    const flag = !!page && currentProject?.document?.defaultPagePath === page.path;
    defaultPageAction.textContent = flag ? "已是默认首屏" : "设为默认首屏";
    defaultPageAction.disabled = !value || flag;
  }
}
function setPageControlsEnabled(value) {
  pageSelect.disabled = !value;
  pageActionsButton.disabled = !value;
  syncDefaultPageAction(value);
  pageHasComponentTemplates();
  syncCustomSelect(pageSelect);
  if (!value) {
    closePageActionsMenu();
  }
}
function fitWorkspaceToCanvas() {
  if (!currentProject) {
    return;
  }
  const value = getComputedStyle(workspace);
  const contentWidth = workspace.clientWidth - Number.parseFloat(value.paddingLeft) - Number.parseFloat(value.paddingRight);
  const contentHeight = workspace.clientHeight - Number.parseFloat(value.paddingTop) - Number.parseFloat(value.paddingBottom);
  const canvasWidth = currentProject.document.canvas.width || 2778;
  const canvasHeight = currentProject.document.canvas.height || 1940;
  const number = canvasWidth / canvasHeight;
  const flag = contentWidth / contentHeight > number;
  const chosen = flag ? contentHeight * number : contentWidth;
  const chosen2 = flag ? contentHeight : contentWidth / number;
  editorCanvas.style.width = Math.max(1, chosen) + "px";
  editorCanvas.style.height = Math.max(1, chosen2) + "px";
  dashboardPreview.style.width = Math.max(1, chosen) + "px";
  dashboardPreview.style.height = Math.max(1, chosen2) + "px";
  window.requestAnimationFrame(() => {
    editorRenderer?.resize();
    dashboardPreviewRenderer?.resize();
  });
}
const workspaceResizeObserver = new ResizeObserver(() => {
  fitWorkspaceToCanvas();
  syncCustomPopupStage();
  dashboardPreviewRenderer?.resize();
});
workspaceResizeObserver.observe(workspace);
function currentPage() {
  return currentProject?.document?.pages?.find(value => value.path === pageSelect.value) || currentProject?.document?.pages?.[0] || null;
}
function canGroupSelection(value, doc = currentProject?.document) {
  const list2 = [...new Set(value || [])];
  if (list2.length < 2 || !doc) {
    return false;
  }
  const mapped = list2.map(item => componentDirectLocation(doc, item));
  if (mapped.some(item => !item || item.component.type === "group")) {
    return false;
  }
  const temp = mapped[0];
  return mapped.every(item => item.scope === temp.scope && item.page?.path === temp.page?.path && item.collection === temp.collection && item.component.properties?.layoutMode !== "fill");
}
function groupSelectedComponents(value) {
  const list2 = [...new Set(value || [])];
  if (!canGroupSelection(list2)) {
    onError(new Error("请选择同一页面或同一侧边栏中的两个或更多控件后再成组。"));
    return;
  }
  const ibeEffectRotation2 = newId("group");
  componentId = ibeEffectRotation2;
  selectedComponentIds = new Set([ibeEffectRotation2]);
  rangeSelectAnchorId = ibeEffectRotation2;
  activeGroupId = null;
  return mutateDocument(doc => {
    const mapped = list2.map(item => componentDirectLocation(doc, item));
    if (mapped.some(item => !item)) {
      return;
    }
    const collection = mapped[0].collection;
    const temp = mapped.map(item => item.component).sort((left, right) => collection.indexOf(left) - collection.indexOf(right));
    const mapped2 = temp.map(item => componentCenter(item));
    const minValue = Math.min(...mapped2.map(item => item.left));
    const minValue2 = Math.min(...mapped2.map(item => item.top));
    const count = Math.max(...mapped2.map(item => item.right));
    const count2 = Math.max(...mapped2.map(item => item.bottom));
    const minValue3 = Math.min(...temp.map(item => collection.indexOf(item)));
    const children = temp.map(component => ({
      ...component,
      position: {
        ...(component.position || {}),
        x: Number(component.position?.x || 0) - minValue,
        y: Number(component.position?.y || 0) - minValue2
      }
    }));
    const options = {
      id: ibeEffectRotation2,
      type: "group",
      componentVersion: 1,
      position: {
        x: minValue,
        y: minValue2,
        width: Math.max(1, count - minValue),
        height: Math.max(1, count2 - minValue2),
        rotation: 0,
        zIndex: 1
      },
      properties: {
        label: groupNameForCollection(collection)
      },
      bindings: {},
      actions: {},
      style: {},
      children
    };
    const allowed = new Set(list2);
    const filtered = collection.filter(component => !allowed.has(component.id));
    filtered.splice(Math.min(minValue3, filtered.length), 0, options);
    collection.splice(0, collection.length, ...filtered);
    applyCollectionLayerOrder(collection);
    if (mapped[0].scope === "shared") {
      for (const temp2 of doc.pages || []) {
        const flag = temp2.sharedComponentIds || [];
        const filtered2 = flag.map((item, index) => allowed.has(item) ? index : -1).filter(item => item >= 0);
        if (!filtered2.length) {
          continue;
        }
        const minValue4 = Math.min(...filtered2);
        const filtered3 = flag.filter(item => !allowed.has(item));
        filtered3.splice(Math.min(minValue4, filtered3.length), 0, ibeEffectRotation2);
        temp2.sharedComponentIds = [...new Set(filtered3)];
      }
      syncSharedComponentReferenceOrder(doc);
    }
  });
}
function ungroupComponent(value) {
  const temp = findComponentLocation(currentProject?.document, value);
  if (!temp || temp.component.type !== "group") {
    return;
  }
  const mapped = (temp.component.children || []).map(component => component.id);
  componentId = mapped[0] || null;
  selectedComponentIds = new Set(mapped);
  rangeSelectAnchorId = componentId;
  activeGroupId = null;
  mutateDocument(doc => {
    const locationValue = findComponentLocation(doc, value);
    if (!locationValue || locationValue.component.type !== "group") {
      return;
    }
    const flag = locationValue.component.position || {};
    const flag2 = locationValue.component.style || {};
    const numeric = Number(flag.rotation || 0);
    const count = Math.max(0.01, Math.min(5, Number(flag2.scale || 1)));
    const number = numeric * Math.PI / 180;
    const temp3 = Math.cos(number);
    const temp4 = Math.sin(number);
    const number4 = Number(flag.width || 100);
    const number5 = Number(flag.height || 100);
    const number2 = Number(flag.x || 0) + number4 / 2;
    const number3 = Number(flag.y || 0) + number5 / 2;
    const mapped2 = (locationValue.component.children || []).map(component => {
      const flag3 = component.position || {};
      const number10 = Number(flag3.width || 100);
      const number11 = Number(flag3.height || 100);
      const number4 = Number(flag3.x || 0) + number10 / 2 - number4 / 2;
      const number5 = Number(flag3.y || 0) + number11 / 2 - number5 / 2;
      const number6 = number4 * count;
      const number7 = number5 * count;
      const number8 = number2 + number6 * temp3 - number7 * temp4;
      const number9 = number3 + number6 * temp4 + number7 * temp3;
      const style = {
        ...(component.style || {})
      };
      const count2 = Math.max(0.01, Math.min(5, Number(style.scale || 1) * count));
      if (flag2.visible === false) {
        style.visible = false;
      }
      style.scale = count2;
      return {
        ...component,
        position: {
          ...flag3,
          x: number8 - number10 / 2,
          y: number9 - number11 / 2,
          rotation: Number(flag3.rotation || 0) + numeric
        },
        style
      };
    });
    locationValue.collection.splice(locationValue.index, 1, ...mapped2);
    applyCollectionLayerOrder(locationValue.collection);
    if (locationValue.scope === "shared" && locationValue.root) {
      for (const temp5 of doc.pages || []) {
        const flag3 = temp5.sharedComponentIds || [];
        const foundIndex = flag3.indexOf(value);
        if (!(foundIndex < 0)) {
          flag3.splice(foundIndex, 1, ...mapped2.map(component => component.id));
          temp5.sharedComponentIds = [...new Set(flag3)];
        }
      }
      syncSharedComponentReferenceOrder(doc);
    }
  });
}
function enterGroupEdit(value) {
  const component = findComponent(currentProject?.document, value)?.component;
  if (!!component && component.type === "group") {
    componentGroupRenameDialog.dataset.groupId = value;
    componentGroupRenameInput.value = componentLabel(component);
    setStatusMessage(componentGroupRenameMessage, "");
    componentGroupRenameDialog.showModal();
    window.setTimeout(() => componentGroupRenameInput.focus(), 0);
  }
}
function removeComponentById(value, param, param2 = null, param3 = false) {
  const temp = findComponentLocation(value, param);
  if (!temp) {
    return null;
  }
  const component = param2 ? cloneValue(param2) : refreshComponentIds(cloneValue(temp.component));
  component.properties = {
    ...(component.properties || {}),
    label: copiedComponentLabel(temp.component, temp.collection)
  };
  delete component.properties.previewState;
  if (param3) {
    const numeric = Number(value.canvas?.width || 2778);
    const canvasHeight = Number(value.canvas?.height || 1940);
    const number = Number(component.position?.width || 100);
    const number2 = Number(component.position?.height || 100);
    component.position = {
      ...(component.position || {}),
      x: clampNumber(Number(component.position?.x || 0) + 24, -number / 2, numeric - number / 2),
      y: clampNumber(Number(component.position?.y || 0) + 24, -number2 / 2, canvasHeight - number2 / 2)
    };
  }
  temp.collection.splice(temp.index, 0, component);
  applyCollectionLayerOrder(temp.collection);
  if (temp.scope === "shared" && temp.root) {
    for (const temp2 of value.pages || []) {
      const foundIndex = (temp2.sharedComponentIds || []).indexOf(param);
      if (foundIndex >= 0) {
        temp2.sharedComponentIds.splice(foundIndex, 0, component.id);
      }
    }
    syncSharedComponentReferenceOrder(value);
  }
  return component;
}
function detachComponentById(value, param) {
  const temp = findComponentLocation(value, param);
  if (!temp) {
    return null;
  }
  const [temp2] = temp.collection.splice(temp.index, 1);
  applyCollectionLayerOrder(temp.collection);
  if (temp.scope === "shared" && temp.root) {
    for (const temp3 of value.pages || []) {
      temp3.sharedComponentIds = (temp3.sharedComponentIds || []).filter(item => item !== param);
    }
    syncSharedComponentReferenceOrder(value);
  }
  return temp2;
}
function normalizeHex(value) {
  const temp = String(value || "").trim().toLowerCase();
  if (/^#[\da-f]{6}$/.test(temp)) {
    return temp;
  } else {
    return "";
  }
}
function selectedComponent() {
  return findComponent(currentProject?.document, componentId)?.component || null;
}
function componentsInScope(value) {
  if (activeGroupId) {
    const component = findComponent(currentProject?.document, activeGroupId)?.component;
    if (component?.type === "group") {
      return component.children || [];
    }
  }
  if (value === "shared") {
    return currentProject?.document?.sharedComponents || [];
  } else {
    return currentPage()?.components || [];
  }
}
function collectComponentsByType(value, param, param2 = []) {
  for (const temp of value || []) {
    if (temp?.type === param) {
      param2.push(temp);
    }
    collectComponentsByType(temp?.children, param, param2);
  }
  return param2;
}
function findComponentsByType(value) {
  return (currentProject?.document?.pages || []).flatMap(page => collectComponentsByType(page.components, value).map(component => ({
    component,
    page
  })));
}
function syncRendererSelection() {
  editorRenderer?.setActiveGroup(activeGroupId);
  editorRenderer?.setSelectedComponents([...selectedComponentIds], componentId);
}
function clearSelection() {
  clearPreviewStates();
  componentId = null;
  selectedComponentIds = new Set();
  rangeSelectAnchorId = null;
}
function clearPreviewStates() {
  for (const value of [imagePreviewStateById, ibePreviewStateById, presencePreviewStateById, airConditionerPreviewStateById]) {
    for (const temp of value.keys()) {
      editorRenderer?.setComponentPreviewState(temp, "auto");
    }
    value.clear();
  }
}
function selectComponent(value, {
  toggle: item = false,
  range: param = false,
  preserveGroup: param2 = false
} = {}) {
  const temp = findComponent(currentProject?.document, value);
  if (!temp) {
    clearSelection();
    syncRendererSelection();
    renderComponentTree();
    refreshInspector();
    return;
  }
  const componentLocation = findComponent(currentProject?.document, componentId);
  const flag = componentLocation?.scope === temp.scope && (temp.scope !== "page" || componentLocation.page?.path === temp.page?.path);
  if (param2 && selectedComponentIds.has(value)) {
    componentId = value;
  } else if (param && flag && rangeSelectAnchorId) {
    const temp3 = componentsInScope(temp.scope);
    const temp4 = temp3.findIndex(component => component.id === rangeSelectAnchorId);
    const temp5 = temp3.findIndex(component => component.id === value);
    if (temp4 >= 0 && temp5 >= 0) {
      const [chosen, chosen2] = temp4 <= temp5 ? [temp4, temp5] : [temp5, temp4];
      selectedComponentIds = new Set(temp3.slice(chosen, chosen2 + 1).map(component => component.id));
      componentId = value;
    } else {
      selectedComponentIds = new Set([value]);
      componentId = value;
      rangeSelectAnchorId = value;
    }
  } else if (item && flag) {
    const allowed = new Set(selectedComponentIds);
    if (allowed.has(value)) {
      allowed.delete(value);
    } else {
      allowed.add(value);
    }
    selectedComponentIds = allowed;
    componentId = allowed.has(value) ? value : allowed.values().next().value || null;
    rangeSelectAnchorId = value;
  } else if (!item && !param && selectedComponentIds.size === 1 && selectedComponentIds.has(value)) {
    clearSelection();
  } else {
    selectedComponentIds = new Set([value]);
    componentId = value;
    rangeSelectAnchorId = value;
  }
  if (temp.scope === "shared" && currentPage()?.path) {
    const cloned = cloneValue(currentProject.document);
    if (ensureSharedComponentReference(cloned, value, currentPage().path)) {
      commitDocumentEdit(cloned, currentPage().path).catch(onError);
    }
  }
  if (componentId) {
    setComponentTemplateScope(temp.scope);
  }
  syncRendererSelection();
  renderComponentTree();
  refreshInspector();
}
function mutateDocument(mutate, value = pageSelect.value, {
  throwOnError = false
} = {}) {
  const pending = documentMutationQueue.catch(() => {}).then(async () => {
    if (!currentProject) {
      throw new Error("请先选择仪表盘。");
    }
    const temp = cloneValue(currentProject.document);
    const asyncResult = await mutate(temp);
    await commitDocumentEdit(temp, value);
    return asyncResult;
  });
  documentMutationQueue = pending.catch(onError);
  if (throwOnError) {
    return pending;
  } else {
    return documentMutationQueue;
  }
}
function nudgeSelectedComponents(value, param) {
  const list = [...selectedComponentIds];
  if (!!list.length && (!!value || !!param)) {
    mutateDocument(doc => {
      const filtered = list.map(item => findComponent(doc, item)?.component).filter(Boolean);
      if (!filtered.length || filtered.some(component2 => component2.properties?.layoutMode === "fill")) {
        return;
      }
      const component = filtered.length === 1 && filtered[0].type === "air-conditioner" ? filtered[0] : null;
      if (component && airConditionerLayerById.get(component.id) === "airflow") {
        const count3 = Math.max(1, Number(component.position?.width || 100));
        const count4 = Math.max(1, Number(component.position?.height || 100));
        const temp = airflowCanvasOffsetBounds(component, doc.canvas);
        component.properties = {
          ...(component.properties || {}),
          airflowOffsetX: clampNumber(Number(component.properties?.airflowOffsetX ?? -75) + value / count3 * 100, temp.minX, temp.maxX),
          airflowOffsetY: clampNumber(Number(component.properties?.airflowOffsetY ?? 34) + param / count4 * 100, temp.minY, temp.maxY)
        };
        return;
      }
      const numeric = Number(doc.canvas?.width || 2778);
      const canvasHeight = Number(doc.canvas?.height || 1940);
      const count = Math.max(...filtered.map(component2 => -Number(component2.position?.width || 100) / 2 - Number(component2.position?.x || 0)));
      const minValue = Math.min(...filtered.map(component2 => numeric - Number(component2.position?.width || 100) / 2 - Number(component2.position?.x || 0)));
      const count2 = Math.max(...filtered.map(component2 => -Number(component2.position?.height || 100) / 2 - Number(component2.position?.y || 0)));
      const minValue2 = Math.min(...filtered.map(component2 => canvasHeight - Number(component2.position?.height || 100) / 2 - Number(component2.position?.y || 0)));
      const clamped = clampNumber(value, count, minValue);
      const clamped2 = clampNumber(param, count2, minValue2);
      for (const temp2 of filtered) {
        if (component) {
          const count3 = Math.max(1, Number(temp2.position?.width || 100));
          const count4 = Math.max(1, Number(temp2.position?.height || 100));
          const position = {
            ...(temp2.position || {}),
            x: Number(temp2.position?.x || 0) + clamped,
            y: Number(temp2.position?.y || 0) + clamped2
          };
          const temp = airflowCanvasOffsetBounds({
            ...temp2,
            position
          }, doc.canvas);
          temp2.properties = {
            ...(temp2.properties || {}),
            airflowOffsetX: clampNumber(Number(temp2.properties?.airflowOffsetX ?? -75) - clamped / count3 * 100, temp.minX, temp.maxX),
            airflowOffsetY: clampNumber(Number(temp2.properties?.airflowOffsetY ?? 34) - clamped2 / count4 * 100, temp.minY, temp.maxY)
          };
        }
        temp2.position = {
          ...(temp2.position || {}),
          x: Number(temp2.position?.x || 0) + clamped,
          y: Number(temp2.position?.y || 0) + clamped2
        };
      }
    });
  }
}
function componentCenter(value) {
  const flag = value.position || {};
  const count = Math.max(0.01, Number(flag.width || 100));
  const count2 = Math.max(0.01, Number(flag.height || 100));
  const count3 = Math.max(0.01, Math.min(5, Number(value.style?.scale || 1)));
  const number = Number(flag.rotation || 0) * Math.PI / 180;
  const number2 = (Math.abs(Math.cos(number)) * count * count3 + Math.abs(Math.sin(number)) * count2 * count3) / 2;
  const number3 = (Math.abs(Math.sin(number)) * count * count3 + Math.abs(Math.cos(number)) * count2 * count3) / 2;
  const number4 = Number(flag.x || 0) + count / 2;
  const number5 = Number(flag.y || 0) + count2 / 2;
  return {
    left: number4 - number2,
    top: number5 - number3,
    right: number4 + number2,
    bottom: number5 + number3
  };
}
function selectionRelativeOffsets(value) {
  if (selectedComponentIds.size < 2 || !currentProject || !componentId) {
    return [];
  }
  const list = [...selectedComponentIds].map(item => findComponent(currentProject.document, item)?.component).filter(Boolean);
  const found = list.find(component => component.id === componentId);
  if (!found || list.length !== selectedComponentIds.size || list.some(component => component.properties?.layoutMode === "fill")) {
    return [];
  }
  const count = Math.max(0.01, Math.min(5, Number(found.style?.scale || 1)));
  const number = Math.max(0.01, Math.min(5, Number(value))) / count;
  const count2 = Math.max(...list.map(el2 => 0.01 / Math.max(0.01, Number(el2.style?.scale || 1))));
  const minValue = Math.min(...list.map(el2 => 5 / Math.max(0.01, Number(el2.style?.scale || 1))));
  const clamped = clampNumber(number, count2, minValue);
  const mapped = list.map(componentCenter);
  const number2 = (Math.min(...mapped.map(item => item.left)) + Math.max(...mapped.map(item => item.right))) / 2;
  const number3 = (Math.min(...mapped.map(item => item.top)) + Math.max(...mapped.map(item => item.bottom))) / 2;
  return list.map(component => {
    const flag = component.position || {};
    const numeric = Number(flag.width || 100);
    const number6 = Number(flag.height || 100);
    const number4 = Number(flag.x || 0) + numeric / 2;
    const number5 = Number(flag.y || 0) + number6 / 2;
    return {
      componentId: component.id,
      x: number2 + (number4 - number2) * clamped - numeric / 2,
      y: number3 + (number5 - number3) * clamped - number6 / 2,
      scale: Math.max(0.01, Math.min(5, Number(component.style?.scale || 1) * clamped))
    };
  });
}
function selectedElementItemIds() {
  const value = [...document.querySelectorAll(".element-item.selected[data-component-id]")].map(el2 => el2.dataset.componentId).filter(Boolean);
  if (selectedComponentIds.size > 1) {
    return [...selectedComponentIds];
  } else {
    return value;
  }
}
function setComponentsRotation(value, param, rotation, param2 = []) {
  const chosen = param2.length > 1 ? param2 : [param];
  for (const temp of chosen) {
    const component = findComponent(value, temp)?.component;
    if (component) {
      component.position = {
        ...(component.position || {}),
        rotation
      };
    }
  }
}
function visibilityIconSvg(value) {
  if (value) {
    return "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z\"/><circle cx=\"12\" cy=\"12\" r=\"2.8\"/></svg>";
  } else {
    return "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m4 4 16 16M2.5 12s3.5-6 9.5-6c2 0 3.7.7 5.1 1.6M21.5 12s-3.5 6-9.5 6c-2 0-3.7-.7-5.1-1.6\"/></svg>";
  }
}
function setComponentsVisible(value, visible) {
  const list2 = [...new Set(value || [])];
  if (list2.length) {
    mutateDocument(item => {
      for (const temp of list2) {
        const component = findComponent(item, temp)?.component;
        if (component) {
          component.style = {
            ...(component.style || {}),
            visible
          };
        }
      }
    });
  }
}
function closeComponentContextMenu() {
  componentContextMenu.hidden = true;
  contextMenuComponentId = null;
}
function openComponentContextMenu(event, value) {
  event.preventDefault();
  event.stopPropagation();
  selectComponent(value, {
    preserveGroup: true
  });
  contextMenuComponentId = value;
  const chosen = selectedComponentIds.has(value) ? [...selectedComponentIds] : [value];
  const length = chosen.length;
  const element = componentContextMenu.querySelector("[data-component-action=\"copy\"]");
  const el3 = componentContextMenu.querySelector("[data-component-action=\"copy-to-page\"]");
  const el4 = componentContextMenu.querySelector("[data-component-action=\"visibility\"]");
  const el5 = componentContextMenu.querySelector("[data-component-action=\"delete\"]");
  const el6 = componentContextMenu.querySelector("[data-component-action=\"group\"]");
  const el7 = componentContextMenu.querySelector("[data-component-action=\"ungroup\"]");
  const el8 = componentContextMenu.querySelector("[data-component-action=\"rename-group\"]");
  const el9 = componentContextMenu.querySelector(":scope > strong");
  element.textContent = length > 1 ? "复制 " + length + " 个控件" : "复制控件";
  const component = findComponent(currentProject?.document, value)?.component;
  const mapped = chosen.map(item => findComponent(currentProject?.document, item)?.component).filter(Boolean).map(el2 => el2.style?.visible !== false);
  const flag = mapped.length === chosen.length && mapped.every(item => item === mapped[0]);
  el4.disabled = !flag;
  el4.textContent = flag ? mapped[0] ? length > 1 ? "批量隐藏 " + length + " 个" : "隐藏控件" : length > 1 ? "批量显示 " + length + " 个" : "显示控件" : "批量隐藏/显示";
  el4.title = flag ? "" : "选中的控件包含隐藏和显示状态，无法批量处理";
  const temp = canGroupSelection(chosen);
  el6.hidden = !temp;
  el7.hidden = component?.type !== "group" || length !== 1;
  el8.hidden = component?.type !== "group" || length !== 1;
  el3.textContent = "复制到其他区域";
  const hasMatch = projectList.some(component2 => component2.id !== currentProject?.projectId);
  const temp2 = collectCopyPayload(currentProject?.document, chosen);
  el3.disabled = temp2.length === 0 && !hasMatch;
  el3.title = el3.disabled ? "当前没有可复制的目标区域" : length > 1 ? "完整复制选中的 " + length + " 个控件到其他页面、侧边栏或其他仪表盘" : "完整复制当前控件到其他页面、侧边栏或其他仪表盘";
  el5.textContent = length > 1 ? "删除 " + length + " 个控件" : "删除控件";
  el9.textContent = length > 1 ? "颜色标签（" + length + " 个控件）" : "颜色标签";
  const mapped2 = chosen.map(item => {
    const temp3 = findComponent(currentProject?.document, item)?.component;
    return normalizeHex(temp3?.style?.editorLabelColor);
  });
  const chosen2 = mapped2.every(item => item === mapped2[0]) ? mapped2[0] : null;
  for (const temp3 of componentContextMenu.querySelectorAll("[data-label-color]")) {
    temp3.classList.toggle("active", chosen2 !== null && temp3.dataset.labelColor === chosen2);
  }
  componentContextMenu.hidden = false;
  componentContextMenu.style.left = "0px";
  componentContextMenu.style.top = "0px";
  window.requestAnimationFrame(() => {
    const rect = componentContextMenu.getBoundingClientRect();
    const clamped = clampNumber(event.clientX, 8, Math.max(8, window.innerWidth - rect.width - 8));
    const clamped2 = clampNumber(event.clientY, 8, Math.max(8, window.innerHeight - rect.height - 8));
    componentContextMenu.style.left = clamped + "px";
    componentContextMenu.style.top = clamped2 + "px";
  });
}
function collectCopyPayload(value, param) {
  const filtered = [...new Set(param || [])].filter(Boolean);
  if (!value || !filtered.length) {
    return [];
  }
  const idSet2 = filtered.map(item => new Set(copyComponentTargets(value, item).map(event2 => event2.key)));
  const list = [...(idSet2[0] || [])].filter(item => idSet2.every(item => item.has(item)));
  const temp = copyComponentTargets(value, filtered[0]);
  return list.map(item => temp.find(event2 => event2.key === item)).filter(Boolean);
}
function showCopySuccessDialog(value, param) {
  copySuccessPayload = param || null;
  copyComponentSuccessMessage.textContent = value;
  copyComponentSuccessDialog.showModal();
}
async function confirmCopySuccess() {
  const value = copySuccessPayload;
  copySuccessPayload = null;
  copyComponentSuccessDialog.close();
  if (value) {
    if (value.projectId && value.projectId !== currentProject?.projectId) {
      await loadProjectDraft(value.projectId, value.pagePath);
    } else if (value.pagePath && value.pagePath !== pageSelect.value) {
      pageSelect.value = value.pagePath;
      syncCustomSelect(pageSelect);
      editorRenderer?.navigate(value.pagePath);
      dashboardPreviewRenderer?.navigate(value.pagePath);
      renderComponentTree();
      refreshInspector();
    }
    setComponentTemplateScope(value.scope);
  }
}
function bringComponentsToFront(value, param = componentId) {
  const list2 = [...new Set(value || [])];
  if (list2.length) {
    mutateDocument(item => {
      const index = new Map(list2.map(item => [item, findComponentLocation(item, item)]));
      const temp = list2.filter(item => index.get(item)).sort((left, right) => {
        const temp2 = index.get(left);
        const temp3 = index.get(right);
        if (temp2.collection === temp3.collection) {
          return temp2.index - temp3.index;
        } else {
          return 0;
        }
      });
      const list = [];
      const idByKey = new Map();
      for (const temp2 of temp) {
        const temp3 = removeComponentById(item, temp2);
        if (temp3) {
          list.push(temp3.id);
          idByKey.set(temp2, temp3.id);
        }
      }
      if (list.length) {
        componentId = idByKey.get(param) || list[0];
        selectedComponentIds = new Set(list);
        rangeSelectAnchorId = componentId;
      }
    });
  }
}
function pagesForCopy(value, {
  includeShared: item = true,
  sourceComponentId: param = null
} = {}) {
  if (!value) {
    return [];
  }
  if (param) {
    return copyComponentTargets(value, param);
  }
  const mapped = (value.pages || []).map(page => ({
    key: "page:" + page.path,
    name: page.name,
    scope: "page",
    page
  }));
  if (item) {
    return [{
      key: "shared",
      name: "侧边栏",
      scope: "shared"
    }, ...mapped];
  } else {
    return mapped;
  }
}
function fillCopyPageTargets(value) {
  copyComponentPageTarget.replaceChildren(...value.map(event2 => new Option(event2.name, event2.key)));
  copyComponentPageTarget.disabled = !value.length;
  copyComponentPageTarget.value = value[0]?.key || "";
  syncCustomSelect(copyComponentPageTarget);
}
function documentCanvasSize(value) {
  return {
    width: Number(value?.canvas?.width || 2778),
    height: Number(value?.canvas?.height || 1940)
  };
}
function syncCopyScaleOptions() {
  if (copyComponentPageScope.value !== "other" || !copyTargetProject) {
    copyComponentScaleOptions.hidden = true;
    copyComponentResolutionSummary.textContent = "";
    return;
  }
  const value = documentCanvasSize(currentProject?.document);
  const temp = documentCanvasSize(copyTargetProject.document);
  const flag = value.width !== temp.width || value.height !== temp.height;
  copyComponentScaleOptions.hidden = !flag;
  copyComponentResolutionSummary.textContent = flag ? value.width + " × " + value.height + " → " + temp.width + " × " + temp.height : "";
}
async function loadCopyPageOptions() {
  const value = copyComponentPageScope.value === "other";
  let list = [];
  try {
    list = JSON.parse(copyComponentPageDialog.dataset.componentIds || "[]");
  } catch {
    list = [];
  }
  const temp = findComponent(currentProject?.document, list[0]);
  const length = list.length;
  const element = copyComponentPageDialog.querySelector("[data-copy-component-description]");
  copyComponentPageProjectField.hidden = !value;
  copyComponentPageTargetLabel.textContent = value ? "其他仪表盘目标页面" : "本仪表盘目标页面";
  copyComponentPageSubmitBtn.textContent = value ? "复制到目标仪表盘" : "复制并前往";
  element.textContent = value ? "将选中的 " + length + " 个控件完整复制到其他仪表盘的目标页面或侧边栏，源控件不受影响。" : temp?.scope === "shared" ? "将选中的 " + length + " 个侧边栏控件完整复制到指定主页面，复制后为该页面的独立控件。" : "将选中的 " + length + " 个控件完整复制到侧边栏或其他主页面，保留位置、尺寸、样式、实体绑定和动作配置。";
  copyTargetProject = null;
  copyComponentScaleOptions.hidden = true;
  setStatusMessage(copyComponentPageMessage, "");
  if (!value) {
    const temp3 = collectCopyPayload(currentProject?.document, list);
    fillCopyPageTargets(temp3);
    copyComponentPageSubmitBtn.disabled = !temp3.length;
    return;
  }
  const inputValue = copyComponentPageProject.value;
  if (!inputValue) {
    fillCopyPageTargets([]);
    copyComponentPageSubmitBtn.disabled = true;
    setStatusMessage(copyComponentPageMessage, "当前没有其他仪表盘可以复制。");
    return;
  }
  const temp2 = ++copyScalePercent;
  fillCopyPageTargets([]);
  copyComponentPageSubmitBtn.disabled = true;
  setStatusMessage(copyComponentPageMessage, "正在读取目标仪表盘…");
  try {
    const asyncResult = await apiFetch("/projects/" + encodeURIComponent(inputValue) + "/draft");
    if (temp2 !== copyScalePercent || copyComponentPageScope.value !== "other") {
      return;
    }
    copyTargetProject = asyncResult;
    const temp4 = pagesForCopy(asyncResult.document);
    fillCopyPageTargets(temp4);
    syncCopyScaleOptions();
    setStatusMessage(copyComponentPageMessage, temp4.length ? "" : "目标仪表盘还没有可复制到的区域。");
    copyComponentPageSubmitBtn.disabled = !temp4.length;
  } catch (error) {
    if (temp2 !== copyScalePercent) {
      return;
    }
    setStatusMessage(copyComponentPageMessage, error.message, "error");
  }
}
function copySelectedComponents(value) {
  const document = currentProject?.document;
  const filtered2 = [...new Set(value || [])].filter(item => findComponent(document, item));
  const temp = findComponent(document, filtered2[0]);
  if (!temp || !filtered2.length) {
    onError(new Error("没有找到要复制的控件。"));
    return;
  }
  copyComponentPageDialog.dataset.componentIds = JSON.stringify(filtered2);
  copyComponentPageName.textContent = filtered2.length > 1 ? "已选择 " + filtered2.length + " 个控件" : "“" + componentLabel(temp.component) + "”";
  copyComponentPageDialog.querySelector("[data-copy-component-description]").textContent = filtered2.length > 1 ? "将选中的 " + filtered2.length + " 个控件完整复制到目标区域。" : temp.scope === "shared" ? "将侧边栏控件完整复制到指定主页面，复制后为该页面的独立控件。" : "将当前控件完整复制到侧边栏或其他主页面，保留位置、尺寸、样式、实体绑定和动作配置。";
  copyComponentPageScope.value = "current";
  syncCustomSelect(copyComponentPageScope);
  const filtered = projectList.filter(component => component.id !== currentProject.projectId);
  copyComponentPageProject.replaceChildren(...filtered.map(component => new Option(component.name, component.id)));
  copyComponentPageProject.disabled = !filtered.length;
  syncCustomSelect(copyComponentPageProject);
  copyComponentPageForm.elements.copyScaleMode.value = "proportional";
  copyComponentPageDialog.showModal();
  loadCopyPageOptions();
}
function deleteSelectedComponents(value) {
  const filtered = [...new Set(value || [])].filter(item => findComponent(currentProject?.document, item));
  if (filtered.length) {
    deleteComponentDialog.dataset.componentIds = JSON.stringify(filtered);
    if (filtered.length > 1) {
      deleteComponentName.textContent = "“已选择的 " + filtered.length + " 个控件”";
    } else {
      const component = findComponent(currentProject?.document, filtered[0])?.component;
      deleteComponentName.textContent = "“" + componentLabel(component || {
        type: "控件"
      }) + "”";
    }
    deleteComponentDialog.showModal();
  }
}
function setSelectedComponentsColor(value, param) {
  const list2 = [...new Set(value || [])];
  if (!list2.length) {
    return;
  }
  const temp = normalizeHex(param);
  mutateDocument(item => {
    for (const temp2 of list2) {
      const component = findComponent(item, temp2)?.component;
      if (component) {
        component.style = {
          ...(component.style || {})
        };
        if (temp) {
          component.style.editorLabelColor = temp;
        } else {
          delete component.style.editorLabelColor;
        }
      }
    }
  });
}
function renderComponentListSection(value, param, param2, scope) {
  value.replaceChildren();
  if (!param.length) {
    const element = document.createElement("div");
    element.className = "element-list-empty";
    element.textContent = param2;
    value.append(element);
    return;
  }
  for (const temp of param) {
    const element = document.createElement("div");
    element.className = "element-item";
    element.dataset.componentId = temp.id;
    element.dataset.scope = scope;
    element.draggable = !activeGroupId;
    element.classList.toggle("selected", selectedComponentIds.has(temp.id));
    element.classList.toggle("selection-primary", temp.id === componentId);
    element.classList.toggle("group-item", temp.type === "group");
    const temp2 = normalizeHex(temp.style?.editorLabelColor);
    element.classList.toggle("has-color-label", !!temp2);
    if (temp2) {
      element.style.setProperty("--element-label-color", temp2);
    }
    const iconEl = document.createElement("i");
    iconEl.className = temp.type === "group" ? "element-group-icon" : "element-label-color";
    iconEl.setAttribute("aria-hidden", "true");
    if (temp.type === "group") {
      iconEl.innerHTML = "<svg viewBox=\"0 0 24 24\" focusable=\"false\"><path d=\"M3.5 7.5h6l1.8 2h9.2v9.5h-17z\"/><path d=\"M3.5 7.5v-1h6l1.8 2\"/></svg>";
    }
    const span = document.createElement("span");
    span.textContent = componentLabel(temp);
    const flag = temp.style?.visible !== false;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "element-visibility" + (flag ? "" : " hidden-element");
    button.setAttribute("aria-label", flag ? "隐藏" + componentLabel(temp) : "显示" + componentLabel(temp));
    button.innerHTML = visibilityIconSvg(flag);
    const callback = event => {
      lastComponentClick = {
        componentId: temp.id,
        at: Date.now()
      };
      event.stopPropagation();
    };
    button.addEventListener("pointerdown", callback);
    button.addEventListener("click", event => {
      lastComponentClick = {
        componentId: temp.id,
        at: Date.now()
      };
      event.stopPropagation();
      selectComponent(temp.id, {
        preserveGroup: true
      });
      setComponentsVisible([temp.id], !flag);
    });
    button.addEventListener("dblclick", callback);
    element.append(iconEl, span, button);
    element.addEventListener("click", event2 => {
      selectComponent(temp.id, {
        toggle: event2.metaKey || event2.ctrlKey,
        range: event2.shiftKey
      });
    });
    element.addEventListener("dblclick", event => {
      if (temp.type !== "group" || event.target.closest(".element-visibility")) {
        return;
      }
      if (lastComponentClick.componentId === temp.id && Date.now() - lastComponentClick.at < 600) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      activeGroupId = temp.id;
      clearSelection();
      renderComponentTree();
      syncRendererSelection();
      refreshInspector();
    });
    element.addEventListener("contextmenu", item => openComponentContextMenu(item, temp.id));
    element.addEventListener("dragstart", item => {
      if (selectedComponentIds.has(temp.id)) {
        componentId = temp.id;
      } else {
        selectedComponentIds = new Set([temp.id]);
        componentId = temp.id;
        rangeSelectAnchorId = temp.id;
      }
      const movingIds = [...selectedComponentIds];
      item.dataTransfer.effectAllowed = "move";
      item.dataTransfer.setData("text/plain", JSON.stringify({
        scope,
        sourceId: temp.id,
        movingIds
      }));
      value.querySelectorAll(".element-item").forEach(el3 => {
        el3.classList.toggle("dragging", movingIds.includes(el3.dataset.componentId));
      });
    });
    element.addEventListener("dragend", () => {
      value.querySelectorAll(".dragging").forEach(el3 => el3.classList.remove("dragging"));
      value.querySelectorAll(".drop-before, .drop-after").forEach(el3 => el3.classList.remove("drop-before", "drop-after"));
    });
    element.addEventListener("dragover", event => {
      if (!event.dataTransfer.types.includes("text/plain")) {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const rect = event.clientY >= element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2;
      element.classList.toggle("drop-before", !rect);
      element.classList.toggle("drop-after", rect);
    });
    element.addEventListener("dragleave", () => element.classList.remove("drop-before", "drop-after"));
    element.addEventListener("drop", event => {
      event.preventDefault();
      let payload2;
      try {
        payload2 = JSON.parse(event.dataTransfer.getData("text/plain"));
      } catch {
        return;
      }
      const {
        scope: alias,
        sourceId: alias2
      } = payload2;
      const list = Array.isArray(payload2.movingIds) ? payload2.movingIds : [alias2];
      const temp6 = element.classList.contains("drop-after");
      element.classList.remove("drop-before", "drop-after");
      if (alias === scope && !!alias2 && !list.includes(temp.id)) {
        componentId = alias2;
        selectedComponentIds = new Set(list);
        mutateDocument(document => {
          const chosen = scope === "shared" ? document.sharedComponents : document.pages.find(component => component.path === pageSelect.value)?.components;
          if (!chosen) {
            return;
          }
          const allowed = new Set(list);
          const filtered = chosen.filter(component => allowed.has(component.id));
          if (!filtered.length) {
            return;
          }
          const filtered2 = chosen.filter(component => !allowed.has(component.id));
          const temp7 = filtered2.findIndex(component => component.id === temp.id);
          if (!(temp7 < 0)) {
            filtered2.splice(temp7 + (temp6 ? 1 : 0), 0, ...filtered);
            chosen.splice(0, chosen.length, ...filtered2);
            applyCollectionLayerOrder(chosen);
            if (scope === "shared") {
              syncSharedComponentReferenceOrder(document);
            }
          }
        });
      }
    });
    value.append(element);
  }
}
function createComponentListItem(value, param) {
  if (!param) {
    return;
  }
  const element = document.createElement("button");
  element.type = "button";
  element.className = "element-group-back";
  element.textContent = "← 返回" + componentLabel(param);
  element.addEventListener("click", () => {
    activeGroupId = null;
    clearSelection();
    renderComponentTree();
    syncRendererSelection();
    refreshInspector();
  });
  value.prepend(element);
}
function renderComponentTree() {
  const value = currentPage();
  const chosen = activeGroupId ? findComponent(currentProject?.document, activeGroupId) : null;
  const chosen2 = chosen?.component?.type === "group" ? chosen.component : null;
  if (activeGroupId && !chosen2) {
    activeGroupId = null;
  }
  const mode2 = chosen2 && chosen.scope === "shared" ? chosen2.children || [] : currentProject?.document?.sharedComponents || [];
  const chosen4 = chosen2 && chosen.scope === "page" ? chosen2.children || [] : value?.components || [];
  renderComponentListSection(sharedComponentList, mode2, "暂无侧边栏控件", "shared");
  renderComponentListSection(pageComponentList, chosen4, "暂无主页面控件", "page");
  if (chosen2) {
    createComponentListItem(chosen.scope === "shared" ? sharedComponentList : pageComponentList, chosen2);
  }
}
function setComponentTemplateScope(value) {
  componentAddScope = value === "page" ? "page" : "shared";
  const flag = componentAddScope === "shared";
  showSharedComponents.classList.toggle("active", flag);
  showPageComponents.classList.toggle("active", !flag);
  sharedComponentList.hidden = !flag;
  pageComponentList.hidden = flag;
  pageHasComponentTemplates();
}
function pageHasComponentTemplates() {
  const value = !!currentPage();
  const doc = currentUiPackId();
  const hasMatch = ["shared", "page"].some(item => listComponentTemplates(item, doc).length > 0);
  addComponentButton.disabled = !value || !hasMatch;
  addComponentButton.title = value ? hasMatch ? "从模板库添加控件" : "该区域暂无可用控件模板" : "请先新建页面";
}
function listAllComponentTemplates() {
  const value = currentUiPackId();
  const list = [...listComponentTemplates("shared", value), ...listComponentTemplates("page", value)].filter((component, index, arr) => arr.findIndex(component2 => component2.id === component.id) === index);
  componentTemplateScope.textContent = componentAddScope === "shared" ? "当前添加到侧边栏，添加后会在所有页面显示。" : "当前添加到主页面，仅在“" + (currentPage()?.name || "当前页面") + "”显示。";
  if (!list.length) {
    const element = document.createElement("div");
    element.className = "component-template-empty";
    element.textContent = "当前 UI 方案暂无可用控件模板。";
    componentTemplateList.replaceChildren(element);
    return;
  }
  componentTemplateList.replaceChildren(...list.map(component => {
    const temp = document.createElement("button");
    temp.type = "button";
    temp.className = "component-template-card";
    temp.dataset.templateId = component.id;
    const span = document.createElement("span");
    span.className = "component-template-preview";
    span.setAttribute("aria-hidden", "true");
    if (component.id === "interaction3d") {
      renderInteraction3dThumbnail(span);
    } else {
      const img = document.createElement("img");
      const flag = component.thumbnailId || component.id;
      img.src = "/bridge-static/component-thumbnails/" + encodeURIComponent(flag) + ".jpg?v=20260902-component-thumbnails-v3";
      img.alt = "";
      span.append(img);
    }
    const span2 = document.createElement("span");
    span2.className = "component-template-copy";
    const element = document.createElement("strong");
    element.textContent = component.name;
    const span3 = document.createElement("span");
    span3.textContent = component.description;
    span2.append(element, span3);
    temp.append(span, span2);
    if (component.id === "interaction3d") {
      updateInteraction3dCard(temp);
    }
    return temp;
  }));
}
const toggleEntityDomains = new Set(["input_boolean", "input_button", "input_datetime", "input_number", "input_select", "input_text", "counter", "timer", "schedule"]);
const entityDomainLabels = {
  alarm_control_panel: "安防",
  automation: "自动化",
  binary_sensor: "二元传感器",
  button: "按钮",
  calendar: "日历",
  camera: "摄像头",
  climate: "空调",
  cover: "窗帘",
  device_tracker: "设备追踪",
  event: "事件",
  fan: "风扇",
  image: "图像",
  light: "灯光",
  lock: "门锁",
  media_player: "媒体播放器",
  number: "数值",
  person: "人员",
  remote: "遥控器",
  scene: "场景",
  script: "脚本",
  select: "选择器",
  sensor: "传感器",
  sun: "太阳",
  switch: "开关",
  text: "文本",
  update: "更新",
  vacuum: "扫地机",
  weather: "天气",
  zone: "区域"
};
function entityDomain(metadata) {
  return metadata?.domain || String(metadata?.entityId || "").split(".")[0];
}
function entityKindLabel(value) {
  const temp = entityDomain(value);
  if (value?.virtual) {
    return "虚拟实体";
  } else if (toggleEntityDomains.has(temp)) {
    return "辅助元素";
  } else {
    return entityDomainLabels[temp] || temp || "实体";
  }
}
function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}
function deviceDisplayName(value) {
  return normalizeWhitespace(entityById.get(String(value?.deviceId || "")));
}
function entityPreferredName(value, param = deviceDisplayName(value)) {
  const temp = normalizeWhitespace(value?.name);
  const temp2 = normalizeWhitespace(value?.originalName);
  if (!param) {
    return temp || temp2 || value?.entityId || "";
  }
  const chosen = temp === param ? "" : temp.startsWith(param + " ") ? temp.slice(param.length).trim() : temp.startsWith(param + "·") ? temp.slice(param.length + 1).trim() : temp;
  if (chosen && chosen !== param) {
    return chosen;
  } else if (temp2 && temp2 !== param) {
    return temp2;
  } else {
    return "";
  }
}
function entityPickerPrimaryName(value, param = "") {
  if (value?.virtual) {
    return value.name || value.entityId || "";
  }
  const temp = deviceDisplayName(value);
  const flag = normalizeWhitespace(param) || entityPreferredName(value, temp);
  if (temp) {
    if (flag && flag !== temp) {
      return temp + " · " + flag;
    } else {
      return temp;
    }
  } else {
    return flag || value?.entityId || "";
  }
}
function entityPickerText(value) {
  const temp = entityPickerPrimaryName(value);
  const flag = value?.entityId || "";
  return "[" + entityKindLabel(value) + "] " + temp + (temp && temp !== flag ? " · " + flag : "");
}
function lightStatisticsEntityIds(component = selectedComponent()) {
  return [...new Set((Array.isArray(component?.properties?.entityIds) ? component.properties.entityIds : []).map(value => String(value || "").trim()).filter(Boolean))];
}
function lightStatisticsEntityStatus(value, param = null) {
  if (!param) {
    return {
      label: "实体已删除",
      tone: "missing"
    };
  }
  const temp = editorRenderer?.states?.get?.(value);
  const flag = temp?.newState || temp;
  const temp2 = String(flag?.state ?? "").trim().toLowerCase();
  const temp3 = lightStatisticsEntityStateStatus(param, flag);
  if (temp3 === "on") {
    return {
      label: "已开启/运行",
      tone: "on"
    };
  } else if (temp3 === "off") {
    return {
      label: "已关闭",
      tone: "off"
    };
  } else if (temp2 === "unavailable") {
    return {
      label: "暂时不可用",
      tone: "abnormal"
    };
  } else if (temp2 === "unknown") {
    return {
      label: "状态未知",
      tone: "abnormal"
    };
  } else if (temp2) {
    return {
      label: "无法判断：" + temp2,
      tone: "abnormal"
    };
  } else {
    return {
      label: "等待状态",
      tone: "abnormal"
    };
  }
}
function setLightStatisticsEntityMessage(value = "", param = false) {
  lightStatisticsEntityMessage.textContent = value;
  lightStatisticsEntityMessage.hidden = !value;
  lightStatisticsEntityMessage.classList.toggle("error", !!param);
}
const defaultIconSize = 100;
function resetLightStatisticsEntityPicker({
  clearMessage: value = true
} = {}) {
  lightStatisticsSelectedEntityId = "";
  lightStatisticsReplaceIndex = -1;
  lightStatisticsEditingComponentId = "";
  lightStatisticsEntityPending.hidden = true;
  setPickerButtonLabel(lightStatisticsEntityButton, "选择一个实体");
  if (value) {
    setLightStatisticsEntityMessage("");
  }
}
function filterLightStatisticsEntities(value = "") {
  if (selectedComponent()?.type !== "light-statistics") {
    return;
  }
  const temp = value.trim().toLocaleLowerCase("zh-CN");
  const mapped = pickerEntitiesForComponentType("light-statistics").map((entity, index) => ({
    entity,
    index,
    support: lightStatisticsEntitySupport(entity)
  })).filter(({
    entity: item
  }) => !temp || (entityPickerText(item) + " " + entityDomain(item)).toLocaleLowerCase("zh-CN").includes(temp)).sort((left, right) => Number(right.support.supported) - Number(left.support.supported) || +(entityDomain(right.entity) === "light") - +(entityDomain(left.entity) === "light") || left.index - right.index).map(({
    entity: item,
    support: param
  }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "inspector-entity-option" + (item.entityId === lightStatisticsSelectedEntityId ? " selected" : "");
    button.dataset.lightStatisticsEntityId = item.entityId;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(item.entityId === lightStatisticsSelectedEntityId));
    const span = document.createElement("span");
    span.className = "inspector-entity-option-content";
    span.title = entityPickerText(item);
    const span2 = document.createElement("span");
    span2.className = "inspector-entity-option-line inspector-entity-name-line";
    const element = document.createElement("span");
    element.className = "inspector-entity-kind";
    element.textContent = "[" + entityKindLabel(item) + "] ";
    const span3 = document.createElement("span");
    span3.className = "inspector-entity-name";
    span3.textContent = entityPickerPrimaryName(item);
    span2.append(element, span3);
    const span4 = document.createElement("span");
    span4.className = "inspector-entity-option-line inspector-entity-id";
    span4.textContent = item.entityId;
    span4.title = item.entityId;
    span.append(span2, span4);
    enableEntityTextHoverScroll(button, span2);
    button.append(span);
    return button;
  });
  if (!mapped.length) {
    const element = document.createElement("div");
    element.className = "inspector-picker-empty";
    element.textContent = "没有匹配的实体";
    mapped.push(element);
  }
  lightStatisticsEntityOptions.replaceChildren(...mapped);
  lightStatisticsEntityOptions.scrollTop = 0;
}
function highlightLightStatisticsEntityOption(value, param = lightStatisticsReplaceIndex) {
  const temp = selectedComponent();
  if (temp?.type !== "light-statistics" || !pickerEntitiesForComponentType("light-statistics").find(item => item.entityId === value)) {
    return;
  }
  const foundIndex = lightStatisticsEntityIds(temp).indexOf(value);
  if (foundIndex >= 0 && foundIndex !== param) {
    setLightStatisticsEntityMessage("该实体已添加，请选择其它实体。", true);
    return;
  }
  lightStatisticsSelectedEntityId = value;
  lightStatisticsReplaceIndex = Number.isInteger(param) ? param : -1;
  lightStatisticsEditingComponentId = temp.id;
  return confirmLightStatisticsEntityPick();
}
function confirmLightStatisticsEntityPick() {
  const value = componentId;
  const temp = lightStatisticsSelectedEntityId;
  const alias = lightStatisticsReplaceIndex;
  const found = entityCatalog.find(item => item.entityId === temp);
  if (!value || !temp || !found) {
    return;
  }
  const component2 = selectedComponent();
  if (alias < 0 && lightStatisticsEntityIds(component2).length >= defaultIconSize) {
    setLightStatisticsEntityMessage("每个统计控件最多添加 " + defaultIconSize + " 个实体。", true);
    return;
  }
  return mutateDocument(item => {
    const component = findComponent(item, value)?.component;
    if (!component || component.type !== "light-statistics") {
      return "component-invalid";
    }
    const entityIds = lightStatisticsEntityIds(component);
    const foundIndex = entityIds.indexOf(temp);
    if (foundIndex >= 0 && foundIndex !== alias) {
      return "duplicate";
    }
    const chosen = alias >= 0 && alias < entityIds.length ? entityIds[alias] : "";
    if (!chosen && entityIds.length >= defaultIconSize) {
      return "limit-reached";
    }
    if (alias >= 0 && !chosen) {
      return "component-invalid";
    }
    if (chosen) {
      entityIds.splice(alias, 1, temp);
    } else {
      entityIds.push(temp);
    }
    const entityLabels = {
      ...(component.properties?.entityLabels || {})
    };
    if (chosen && chosen !== temp) {
      delete entityLabels[chosen];
    }
    entityLabels[temp] = entityPickerPrimaryName(found);
    component.properties = {
      ...(component.properties || {}),
      entityIds,
      entityLabels
    };
    if (chosen) {
      return "replaced";
    } else {
      return "added";
    }
  }).then(item => item === "limit-reached" ? (setLightStatisticsEntityMessage("每个统计控件最多添加 " + defaultIconSize + " 个实体。", true), item) : item === "duplicate" ? (setLightStatisticsEntityMessage("该实体已添加，请选择其它实体。", true), item) : item === "component-invalid" ? (setLightStatisticsEntityMessage("当前统计控件已发生变化，请重新选择。", true), item) : (item !== "added" && item !== "replaced" || (resetLightStatisticsEntityPicker({
    clearMessage: false
  }), setLightStatisticsEntityMessage(item === "replaced" ? "已更换统计实体。" : "已加入统计列表。")), item));
}
function removeLightStatisticsEntityAt(value) {
  const temp = componentId;
  if (!!temp && !!Number.isInteger(value) && !(value < 0)) {
    mutateDocument(item => {
      const component = findComponent(item, temp)?.component;
      if (!component || component.type !== "light-statistics") {
        return;
      }
      const entityIds = lightStatisticsEntityIds(component);
      const [temp2] = entityIds.splice(value, 1);
      const entityLabels = {
        ...(component.properties?.entityLabels || {})
      };
      if (temp2) {
        delete entityLabels[temp2];
      }
      component.properties = {
        ...(component.properties || {}),
        entityIds,
        entityLabels
      };
    });
    resetLightStatisticsEntityPicker();
  }
}
function syncLightStatisticsEntityButton(component = selectedComponent()) {
  if (component?.type !== "light-statistics") {
    return;
  }
  const value = lightStatisticsEntityIds(component);
  const flag = component.properties?.entityLabels || {};
  lightStatisticsEntityCount.textContent = value.length + " 个";
  const mapped = value.map((item, index) => {
    const flag2 = pickerEntitiesForComponentType("light-statistics").find(item => item.entityId === item) || null;
    const temp = lightStatisticsEntityStatus(item, flag2);
    const div2 = document.createElement("div");
    div2.className = "light-statistics-entity-row " + temp.tone + (flag2 ? "" : " missing");
    const div3 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = flag2 ? entityPickerPrimaryName(flag2) : flag[item] || item;
    const el3 = document.createElement("small");
    el3.textContent = item + " · " + temp.label;
    div3.append(element, el3);
    const span = document.createElement("span");
    span.className = "light-statistics-entity-actions";
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.lightStatisticsReplaceIndex = String(index);
    button.textContent = "更换";
    const button2 = document.createElement("button");
    button2.type = "button";
    button2.dataset.lightStatisticsRemoveIndex = String(index);
    button2.textContent = "删除";
    span.append(button, button2);
    div2.append(div3, span);
    return div2;
  });
  lightStatisticsEntityList.replaceChildren(...mapped);
}
function flattenComponentTree(value, param = []) {
  for (const temp of value || []) {
    param.push(temp);
    flattenComponentTree(temp.children, param);
  }
  return param;
}
function buildIdMap(value = currentPage()) {
  if (!value || !currentProject?.document) {
    return [];
  }
  const index = new Map((currentProject.document.sharedComponents || []).map(component => [component.id, component]));
  const filtered = (value.sharedComponentIds || []).map(item => index.get(item)).filter(Boolean);
  return flattenComponentTree([...(value.components || []), ...filtered]);
}
function ibeTemplateOptions(value = currentPage()) {
  if (buildIdMap(value).some(component => component.type === "icon-button-effect")) {
    return [createIconVisibilityVirtualEntity(value?.path)];
  } else {
    return [];
  }
}
function pickerEntitiesForComponentType(param = "image") {
  return [...entityCatalog, ...ibeTemplateOptions()];
}
const overflowScrollState = new WeakMap();
const overflowPreviewState = new WeakMap();
const overflowScrollSelector = "[data-overflow-scroll-preview], .inspector-picker-value, .inspector-entity-name-line";
function enableEntityTextHoverScroll(value, param) {
  const filtered = (Array.isArray(param) ? param : [param]).filter(Boolean);
  for (const temp of filtered) {
    temp.dataset.overflowScrollPreview = "true";
  }
  if (value && filtered.length) {
    value.dataset.overflowScrollPreviewRow = "true";
    overflowPreviewState.set(value, filtered);
  }
}
function closestOverflowScrollEl(value) {
  const temp = value.closest?.(overflowScrollSelector);
  if (temp) {
    return temp;
  }
  const temp2 = value.closest?.("[data-overflow-scroll-preview-row]");
  return overflowPreviewState.get(temp2)?.[0] || null;
}
function overflowPreviewRow(value) {
  return value?.closest?.("[data-overflow-scroll-preview-row]") || value;
}
function stopOverflowScroll(element) {
  const value = overflowScrollState.get(element);
  if (value) {
    window.clearTimeout(value.timer);
    window.cancelAnimationFrame(value.frame);
    overflowScrollState.delete(element);
  }
  element.scrollLeft = 0;
  element.classList.remove("hover-scrolling");
}
function pickerValueEl(element) {
  if (!element) {
    return null;
  }
  let inspectorPickerValue = element.querySelector(".inspector-picker-value");
  if (!inspectorPickerValue) {
    inspectorPickerValue = document.createElement("span");
    inspectorPickerValue.className = "inspector-picker-value";
    inspectorPickerValue.textContent = element.textContent.trim();
    element.replaceChildren(inspectorPickerValue);
  }
  enableEntityTextHoverScroll(element, inspectorPickerValue);
  return inspectorPickerValue;
}
function setPickerButtonLabel(value, param, param2 = "") {
  const element = pickerValueEl(value);
  if (element) {
    element.textContent = param;
    element.title = param2 || param;
    value.title = param2 || param;
  }
}
document.addEventListener("pointerover", value => {
  const element = closestOverflowScrollEl(value.target);
  const temp = overflowPreviewRow(element);
  const flag = value.relatedTarget instanceof Node && temp?.contains(value.relatedTarget);
  if (!element || flag || overflowScrollState.has(element)) {
    return;
  }
  const count = Math.max(0, element.scrollWidth - element.clientWidth);
  if (count <= 2) {
    return;
  }
  const options = {
    timer: null,
    frame: null
  };
  overflowScrollState.set(element, options);
  options.timer = window.setTimeout(() => {
    if (!element.isConnected) {
      stopOverflowScroll(element);
      return;
    }
    element.classList.add("hover-scrolling");
    const temp2 = performance.now();
    const callback = item => {
      const number = (item - temp2) * 0.04;
      element.scrollLeft = Math.min(count, number);
      if (number < count) {
        options.frame = window.requestAnimationFrame(callback);
      }
    };
    options.frame = window.requestAnimationFrame(callback);
  }, 350);
});
document.addEventListener("pointerout", value => {
  const temp = closestOverflowScrollEl(value.target);
  const temp2 = overflowPreviewRow(temp);
  const flag = value.relatedTarget instanceof Node && temp2?.contains(value.relatedTarget);
  if (!!temp && !flag) {
    stopOverflowScroll(temp);
  }
});
function closePickerPanel(panel, toggleButton) {
  panel.hidden = true;
  toggleButton.setAttribute("aria-expanded", "false");
  if (panel === imageAssetMenu) {
    hideImageLargePreview();
    closeMenuState(customSelectStateByEl.get(imageAssetFolder));
  }
  if (panel === ibeAssetMenu) {
    hideImageLargePreview();
    closeMenuState(customSelectStateByEl.get(ibeAssetFolder));
  }
}
function closeOtherPickerPanels(keepKind = null) {
  if (keepKind !== "entity") {
    closePickerPanel(imageEntityMenu, imageEntityButton);
  }
  if (keepKind !== "weather-entity") {
    closePickerPanel(weatherEntityMenu, weatherEntityButton);
  }
  if (keepKind !== "line-chart-entity") {
    closePickerPanel(lineChartEntityMenu, lineChartEntityButton);
  }
  if (keepKind !== "ibe-entity") {
    closePickerPanel(ibeEntityMenu, ibeEntityButton);
  }
  if (keepKind !== "icon-button-entity") {
    closePickerPanel(iconButtonEntityMenu, iconButtonEntityButton);
  }
  if (keepKind !== "vacuum-map-entity") {
    closePickerPanel(vacuumMapEntityMenu, vacuumMapEntityButton);
  }
  if (keepKind !== "camera-entity") {
    closePickerPanel(cameraEntityMenu, cameraEntityButton);
  }
  if (keepKind !== "air-conditioner-entity") {
    closePickerPanel(airConditionerEntityMenu, airConditionerEntityButton);
  }
  if (keepKind !== "title-button-entity") {
    closePickerPanel(titleButtonEntityMenu, titleButtonEntityButton);
  }
  if (keepKind !== "light-statistics-entity") {
    const flag = !lightStatisticsEntityMenu.hidden;
    closePickerPanel(lightStatisticsEntityMenu, lightStatisticsEntityButton);
    if (flag) {
      resetLightStatisticsEntityPicker();
    }
  }
  if (keepKind !== "light-statistics-action-entity") {
    closePickerPanel(lightStatisticsActionEntityMenu, lightStatisticsActionEntityButton);
  }
  if (keepKind !== "navigation-entity") {
    closePickerPanel(navigationEntityMenu, navigationEntityButton);
  }
  if (keepKind !== "asset") {
    closePickerPanel(imageAssetMenu, imageAssetButton);
  }
  if (keepKind !== "ibe-asset") {
    closePickerPanel(ibeAssetMenu, ibeAssetButton);
  }
  if (keepKind !== "ibe-icon") {
    closePickerPanel(ibeIconMenu, ibeIconButton);
  }
  if (keepKind !== "icon-button-icon") {
    closePickerPanel(iconButtonIconMenu, iconButtonIconButton);
  }
  if (keepKind !== "title-button-icon") {
    closePickerPanel(titleButtonIconMenu, titleButtonIconButton);
  }
  if (keepKind !== "light-statistics-icon") {
    closePickerPanel(lightStatisticsIconMenu, lightStatisticsIconButton);
  }
  if (keepKind !== "navigation-icon") {
    closePickerPanel(navigationIconMenu, navigationIconButton);
  }
}
function mdiIconUrl(value) {
  const temp = String(value || "").trim().replace(/^mdi:/, "");
  if (/^[a-z0-9-]+$/.test(temp)) {
    return "/bridge-static/vendor/mdi/7.4.47/svg/" + temp + ".svg";
  } else {
    return "";
  }
}
function syncNavigationIconButton(value) {
  const text = String(value || "");
  const element = navigationIconButton.querySelector("i");
  const el3 = navigationIconButton.querySelector("span");
  const temp = mdiIconUrl(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? "url(\"" + temp + "\")" : "";
  element.style.webkitMaskImage = temp ? "url(\"" + temp + "\")" : "";
  el3.textContent = text || "不使用图标";
  navigationIconCopyBtn.disabled = !text;
  navigationIconCopyBtn.title = text ? "复制 " + text : "当前未使用图标";
}
function syncIbeIconButton(value) {
  const text = String(value || "");
  const element = ibeIconButton.querySelector("i");
  const el3 = ibeIconButton.querySelector("span");
  const temp = mdiIconUrl(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? "url(\"" + temp + "\")" : "";
  element.style.webkitMaskImage = temp ? "url(\"" + temp + "\")" : "";
  el3.textContent = text || "不使用图标";
  ibeIconCopyBtn.disabled = !text;
  ibeIconCopyBtn.title = text ? "复制 " + text : "当前未使用图标";
}
function syncIconButtonIcon(value) {
  const text = String(value || "");
  const includesValue = ["device-button", "presence-sensor"].includes(selectedComponent()?.type);
  const element = iconButtonIconButton.querySelector("i");
  const el3 = iconButtonIconButton.querySelector("span");
  const temp = mdiIconUrl(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? "url(\"" + temp + "\")" : "";
  element.style.webkitMaskImage = temp ? "url(\"" + temp + "\")" : "";
  el3.textContent = text || (includesValue ? "跟随实体图标" : "不使用图标");
  iconButtonIconCopyBtn.disabled = !text;
  iconButtonIconCopyBtn.title = text ? "复制 " + text : "当前未使用图标";
}
function syncTitleButtonIcon(value) {
  const text = String(value || "");
  const element = titleButtonIconButton.querySelector("i");
  const el3 = titleButtonIconButton.querySelector("span");
  const temp = mdiIconUrl(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? "url(\"" + temp + "\")" : "";
  element.style.webkitMaskImage = temp ? "url(\"" + temp + "\")" : "";
  el3.textContent = text || "不使用图标";
  titleButtonIconCopyBtn.disabled = !text;
  titleButtonIconCopyBtn.title = text ? "复制 " + text : "当前未使用图标";
}
function syncLightStatisticsIcon(value) {
  const text = String(value ?? "mdi:lightbulb-group-outline");
  const element = lightStatisticsIconButton.querySelector("i");
  const el3 = lightStatisticsIconButton.querySelector("span");
  const temp = mdiIconUrl(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? "url(\"" + temp + "\")" : "";
  element.style.webkitMaskImage = temp ? "url(\"" + temp + "\")" : "";
  el3.textContent = text || "不使用图标";
  lightStatisticsIconCopyBtn.disabled = !text;
  lightStatisticsIconCopyBtn.title = text ? "复制 " + text : "当前未使用图标";
}
async function copyTextToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const element = document.createElement("textarea");
  element.value = value;
  element.setAttribute("readonly", "");
  element.style.position = "fixed";
  element.style.opacity = "0";
  document.body.append(element);
  element.select();
  const temp = document.execCommand("copy");
  element.remove();
  if (!temp) {
    throw new Error("复制失败。");
  }
}
function bindEntityCopyButton(value, param = () => value.dataset.entityId || "") {
  if (!value || value.dataset.entityCopyReady === "true") {
    return value._entityCopySync;
  }
  pickerValueEl(value);
  const temp = document.createElement("div");
  temp.className = "entity-picker-field-row";
  const element = document.createElement("button");
  element.type = "button";
  element.className = "navigation-icon-copy entity-picker-copy";
  element.title = "复制实体 ID";
  element.setAttribute("aria-label", "复制实体 ID");
  element.disabled = true;
  element.innerHTML = "<svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><rect x=\"5\" y=\"5\" width=\"8\" height=\"8\" rx=\"1.3\"></rect><path d=\"M10.5 5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9A1.5 1.5 0 0 0 3.5 10.5H5\"></path></svg><span aria-hidden=\"true\">✓</span>";
  const readEntityId = () => {
    const text = String(param() || "");
    element.dataset.entityId = text;
    element.disabled = !text;
    element.title = text ? "复制 " + text : "当前未选择实体";
  };
  element.addEventListener("click", async event => {
    event.preventDefault();
    event.stopPropagation();
    const flag = element.dataset.entityId || "";
    if (flag) {
      try {
        await copyTextToClipboard(flag);
        element.classList.add("copied");
        window.setTimeout(() => element.classList.remove("copied"), 1000);
      } catch (error) {
        onError(error);
      }
    }
  });
  value.replaceWith(temp);
  temp.append(value, element);
  value.dataset.entityCopyReady = "true";
  value._entityCopySync = readEntityId;
  readEntityId();
  return readEntityId;
}
function bindAllEntityCopyButtons() {
  for (const value of ["image-entity-button", "ibe-entity-button", "icon-button-entity-button", "air-conditioner-entity-button", "vacuum-map-entity-button", "camera-entity-button", "weather-entity-button", "line-chart-entity-button", "navigation-entity-button", "popup-module-entity-button"]) {
    const temp = document.getElementById(value);
    if (temp) {
      bindEntityCopyButton(temp);
    }
  }
}
bindAllEntityCopyButtons();
const pickerMenuGap = 160;
const entityNameHoverState = new WeakMap();
function entityNameHoverStateFor(value) {
  let temp = entityNameHoverState.get(value);
  if (!temp) {
    temp = {
      query: "",
      offset: 0,
      total: 0,
      loading: false,
      complete: false,
      generation: 0
    };
    entityNameHoverState.set(value, temp);
  }
  return temp;
}
let entityNameHoverTimer = null;
function hideEntityNameHover() {
  entityNameHoverTimer?.remove();
  entityNameHoverTimer = null;
}
function showEntityNameHover(element, value) {
  hideEntityNameHover();
  const ancestorEl = element.closest("dialog");
  if (!ancestorEl?.open || !value) {
    return;
  }
  const div2 = document.createElement("div");
  div2.className = "editor-icon-name-tooltip";
  div2.textContent = value;
  ancestorEl.append(div2);
  const rect = element.getBoundingClientRect();
  const rect2 = div2.getBoundingClientRect();
  const minValue = Math.min(window.innerWidth - rect2.width - 8, Math.max(8, rect.left + (rect.width - rect2.width) / 2));
  let number = rect.top - rect2.height - 8;
  if (number < 8) {
    number = rect.bottom + 8;
  }
  div2.style.left = minValue + "px";
  div2.style.top = number + "px";
  entityNameHoverTimer = div2;
}
function bindEditorIconNameTooltip(value, param) {
  value.addEventListener("pointerenter", () => showEntityNameHover(value, param));
  value.addEventListener("pointerleave", hideEntityNameHover);
  value.addEventListener("focus", () => showEntityNameHover(value, param));
  value.addEventListener("blur", hideEntityNameHover);
}
async function loadIconPickerOptions({
  optionsElement: value,
  query: item = "",
  currentIcon: param = "",
  clearLabel: param2 = "不使用图标",
  datasetKey: param3 = "iconName",
  append: param4 = false
}) {
  const trimmed = String(item || "").trim();
  const temp = entityNameHoverStateFor(value);
  if (!param4 || temp.query !== trimmed) {
    temp.query = trimmed;
    temp.offset = 0;
    temp.total = 0;
    temp.loading = false;
    temp.complete = false;
    temp.generation += 1;
    const div2 = document.createElement("div");
    div2.className = "navigation-icon-load-state";
    div2.textContent = "正在加载图标…";
    value.replaceChildren(createIconPickerClearOption(param, param2, param3), div2);
    value.scrollTop = 0;
  }
  if (temp.loading || temp.complete) {
    return;
  }
  const generation = temp.generation;
  const navigationIconLoadState = value.querySelector(".navigation-icon-load-state");
  temp.loading = true;
  if (navigationIconLoadState) {
    navigationIconLoadState.textContent = temp.offset ? "正在加载更多图标…" : "正在加载图标…";
  }
  try {
    const asyncResult = await apiFetch("/icons?query=" + encodeURIComponent(temp.query) + "&limit=" + pickerMenuGap + "&offset=" + temp.offset);
    if (generation !== temp.generation) {
      return;
    }
    const flag = asyncResult.items || [];
    const mapped = flag.map(item => createIconPickerOption(item, param, param3));
    if (navigationIconLoadState && mapped.length) {
      navigationIconLoadState.before(...mapped);
    }
    temp.offset += flag.length;
    temp.total = Math.max(Number(asyncResult.total) || 0, temp.offset);
    temp.complete = !flag.length || temp.offset >= temp.total;
    temp.loading = false;
    if (navigationIconLoadState) {
      navigationIconLoadState.textContent = temp.total ? temp.complete ? "已显示全部 " + temp.total + " 个图标" : "已加载 " + temp.offset + " / " + temp.total + " · 继续向下滚动" : "没有匹配的图标";
    }
  } catch (error) {
    if (generation === temp.generation) {
      temp.loading = false;
      if (navigationIconLoadState) {
        navigationIconLoadState.textContent = "图标加载失败，请稍后重试";
      }
    }
    throw error;
  }
}
function bindIconPickerInfiniteScroll(value, param) {
  value.addEventListener("scroll", () => {
    if (!(value.scrollHeight - value.scrollTop - value.clientHeight > 120)) {
      param().catch(onError);
    }
  });
}
async function loadIconPickerOptions2(query = "", {
  append = false
} = {}) {
  return loadIconPickerOptions({
    optionsElement: navigationIconOptions,
    query,
    currentIcon: selectedComponent()?.properties?.icon || "",
    append
  });
}
async function loadIconPickerOptions3(query = "", {
  append = false
} = {}) {
  return loadIconPickerOptions({
    optionsElement: ibeIconOptions,
    query,
    currentIcon: selectedComponent()?.properties?.icon || "",
    append
  });
}
async function loadIconPickerOptions4(query = "", {
  append = false
} = {}) {
  const component = selectedComponent();
  return loadIconPickerOptions({
    optionsElement: iconButtonIconOptions,
    query,
    currentIcon: component?.properties?.icon || "",
    clearLabel: component?.type === "device-button" ? "跟随实体图标" : "不使用图标",
    append
  });
}
async function loadIconPickerOptions5(query = "", {
  append = false
} = {}) {
  return loadIconPickerOptions({
    optionsElement: titleButtonIconOptions,
    query,
    currentIcon: selectedComponent()?.properties?.icon || "",
    append
  });
}
async function loadIconPickerOptions6(query = "", {
  append = false
} = {}) {
  const value = selectedComponent()?.properties || {};
  const currentIcon = String(Object.hasOwn(value, "icon") ? value.icon || "" : "mdi:lightbulb-group-outline");
  return loadIconPickerOptions({
    optionsElement: lightStatisticsIconOptions,
    query,
    currentIcon,
    datasetKey: "lightStatisticsIconName",
    append
  });
}
bindIconPickerInfiniteScroll(navigationIconOptions, () => loadIconPickerOptions2(navigationIconSearch.value, {
  append: true
}));
bindIconPickerInfiniteScroll(ibeIconOptions, () => loadIconPickerOptions3(ibeIconSearch.value, {
  append: true
}));
bindIconPickerInfiniteScroll(iconButtonIconOptions, () => loadIconPickerOptions4(iconButtonIconSearch.value, {
  append: true
}));
bindIconPickerInfiniteScroll(titleButtonIconOptions, () => loadIconPickerOptions5(titleButtonIconSearch.value, {
  append: true
}));
bindIconPickerInfiniteScroll(lightStatisticsIconOptions, () => loadIconPickerOptions6(lightStatisticsIconSearch.value, {
  append: true
}));
function positionNavigationIconMenu() {
  if (navigationIconMenu.hidden) {
    return;
  }
  const value = navigationIconButton.parentElement.getBoundingClientRect();
  const temp = 5;
  const number3 = 8;
  const number = window.innerHeight - value.bottom - temp - number3;
  const number2 = value.top - temp - number3;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  navigationIconMenu.style.left = clampNumber(value.left, number3, Math.max(number3, window.innerWidth - value.width - number3)) + "px";
  navigationIconMenu.style.top = flag ? value.bottom + temp + "px" : Math.max(number3, value.top - count - temp) + "px";
  navigationIconMenu.style.width = value.width + "px";
  navigationIconMenu.style.maxHeight = count + "px";
  navigationIconOptions.style.maxHeight = Math.max(90, count - 57) + "px";
}
function positionIbeIconMenu() {
  if (ibeIconMenu.hidden) {
    return;
  }
  const value = ibeIconButton.parentElement.getBoundingClientRect();
  const temp = 5;
  const number3 = 8;
  const number = window.innerHeight - value.bottom - temp - number3;
  const number2 = value.top - temp - number3;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  ibeIconMenu.style.left = clampNumber(value.left, number3, Math.max(number3, window.innerWidth - value.width - number3)) + "px";
  ibeIconMenu.style.top = flag ? value.bottom + temp + "px" : Math.max(number3, value.top - count - temp) + "px";
  ibeIconMenu.style.width = value.width + "px";
  ibeIconMenu.style.maxHeight = count + "px";
  ibeIconOptions.style.maxHeight = Math.max(90, count - 57) + "px";
}
function syncIconButtonIcon2() {
  if (iconButtonIconMenu.hidden) {
    return;
  }
  const value = iconButtonIconButton.parentElement.getBoundingClientRect();
  const temp = 5;
  const number3 = 8;
  const number = window.innerHeight - value.bottom - temp - number3;
  const number2 = value.top - temp - number3;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  iconButtonIconMenu.style.left = clampNumber(value.left, number3, Math.max(number3, window.innerWidth - value.width - number3)) + "px";
  iconButtonIconMenu.style.top = flag ? value.bottom + temp + "px" : Math.max(number3, value.top - count - temp) + "px";
  iconButtonIconMenu.style.width = value.width + "px";
  iconButtonIconMenu.style.maxHeight = count + "px";
  iconButtonIconOptions.style.maxHeight = Math.max(90, count - 57) + "px";
}
function syncTitleButtonIcon2() {
  if (titleButtonIconMenu.hidden) {
    return;
  }
  const value = titleButtonIconButton.parentElement.getBoundingClientRect();
  const temp = 5;
  const number3 = 8;
  const number = window.innerHeight - value.bottom - temp - number3;
  const number2 = value.top - temp - number3;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  titleButtonIconMenu.style.left = clampNumber(value.left, number3, Math.max(number3, window.innerWidth - value.width - number3)) + "px";
  titleButtonIconMenu.style.top = flag ? value.bottom + temp + "px" : Math.max(number3, value.top - count - temp) + "px";
  titleButtonIconMenu.style.width = value.width + "px";
  titleButtonIconMenu.style.maxHeight = count + "px";
  titleButtonIconOptions.style.maxHeight = Math.max(90, count - 57) + "px";
}
function syncLightStatisticsIcon2() {
  if (lightStatisticsIconMenu.hidden) {
    return;
  }
  const value = lightStatisticsIconButton.parentElement.getBoundingClientRect();
  const temp = 5;
  const number3 = 8;
  const number = window.innerHeight - value.bottom - temp - number3;
  const number2 = value.top - temp - number3;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  lightStatisticsIconMenu.style.left = clampNumber(value.left, number3, Math.max(number3, window.innerWidth - value.width - number3)) + "px";
  lightStatisticsIconMenu.style.top = flag ? value.bottom + temp + "px" : Math.max(number3, value.top - count - temp) + "px";
  lightStatisticsIconMenu.style.width = value.width + "px";
  lightStatisticsIconMenu.style.maxHeight = count + "px";
  lightStatisticsIconOptions.style.maxHeight = Math.max(90, count - 57) + "px";
}
function positionLightStatisticsEntityMenu() {
  if (lightStatisticsEntityMenu.hidden) {
    return;
  }
  const value = lightStatisticsEntityButton.getBoundingClientRect();
  const temp = 5;
  const number3 = 8;
  const minValue = Math.min(value.width, window.innerWidth - number3 * 2);
  const number = window.innerHeight - value.bottom - temp - number3;
  const number2 = value.top - temp - number3;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(430, flag ? number : number2));
  lightStatisticsEntityMenu.style.left = clampNumber(value.left, number3, Math.max(number3, window.innerWidth - minValue - number3)) + "px";
  lightStatisticsEntityMenu.style.top = flag ? value.bottom + temp + "px" : Math.max(number3, value.top - count - temp) + "px";
  lightStatisticsEntityMenu.style.width = minValue + "px";
  lightStatisticsEntityMenu.style.maxHeight = count + "px";
  lightStatisticsEntityOptions.style.maxHeight = Math.max(90, count - 58) + "px";
}
function entityPickerConfig(componentType = "image") {
  if (componentType === "light-statistics") {
    return {
      componentType,
      button: lightStatisticsActionEntityButton,
      menu: lightStatisticsActionEntityMenu,
      search: lightStatisticsActionEntitySearch,
      options: lightStatisticsActionEntityOptions,
      except: "light-statistics-action-entity",
      relatedSettings: false,
      recommended: recommended => TOGGLE_ENTITY_DOMAINS.has(entityDomain(recommended)) ? 2 : 0
    };
  } else if (componentType === "navigation-button") {
    return {
      componentType,
      button: navigationEntityButton,
      menu: navigationEntityMenu,
      search: navigationEntitySearch,
      options: navigationEntityOptions,
      except: "navigation-entity",
      recommended: recommended => recommended?.virtual ? 3 : TOGGLE_ENTITY_DOMAINS.has(entityDomain(recommended)) ? 2 : 0
    };
  } else if (componentType === "title-button") {
    return {
      componentType,
      button: titleButtonEntityButton,
      menu: titleButtonEntityMenu,
      search: titleButtonEntitySearch,
      options: titleButtonEntityOptions,
      except: "title-button-entity",
      recommended: recommended => recommended?.virtual ? 3 : TOGGLE_ENTITY_DOMAINS.has(entityDomain(recommended)) ? 2 : 0
    };
  } else if (componentType === "vacuum-map") {
    return {
      componentType,
      button: vacuumMapEntityButton,
      menu: vacuumMapEntityMenu,
      search: vacuumMapEntitySearch,
      options: vacuumMapEntityOptions,
      except: "vacuum-map-entity",
      recommended: recommended => ["camera", "image"].includes(entityDomain(recommended)) ? /(?:^|[_.\s-])map(?:$|[_.\s-])|地图/i.test((recommended.entityId || "") + " " + (recommended.name || "")) ? 2 : 1 : 0
    };
  } else if (componentType === "camera") {
    return {
      componentType,
      button: cameraEntityButton,
      menu: cameraEntityMenu,
      search: cameraEntitySearch,
      options: cameraEntityOptions,
      except: "camera-entity",
      recommended: recommended => entityDomain(recommended) === "camera"
    };
  } else if (componentType === "air-conditioner") {
    return {
      componentType,
      button: airConditionerEntityButton,
      menu: airConditionerEntityMenu,
      search: airConditionerEntitySearch,
      options: airConditionerEntityOptions,
      except: "air-conditioner-entity",
      recommended: recommended => entityDomain(recommended) === "climate" ? 2 : entityDomain(recommended) === "fan" ? 1 : 0
    };
  } else if (componentType === "device-button") {
    return {
      componentType,
      button: iconButtonEntityButton,
      menu: iconButtonEntityMenu,
      search: iconButtonEntitySearch,
      options: iconButtonEntityOptions,
      except: "icon-button-entity",
      recommended: recommended => TOGGLE_ENTITY_DOMAINS.has(entityDomain(recommended))
    };
  } else if (componentType === "presence-sensor") {
    return {
      componentType,
      button: iconButtonEntityButton,
      menu: iconButtonEntityMenu,
      search: iconButtonEntitySearch,
      options: iconButtonEntityOptions,
      except: "icon-button-entity",
      recommended: recommended => {
        const recommended2 = (recommended.entityId || "") + " " + (recommended.name || "") + " " + (recommended.originalName || "") + " " + (recommended.translationKey || "");
        const recommended3 = selectedComponent()?.properties?.sensorKind || "presence";
        const recommended4 = entityDomain(recommended);
        if (recommended4 === "event") {
          if (recommended3 === "presence" && /motion|occupancy|presence|pir|moving|移动|运动|人体|有人/i.test(recommended2)) {
            return 4;
          } else {
            return 0;
          }
        } else if (recommended4 !== "binary_sensor") {
          return 0;
        } else if (recommended3 === "water-leak") {
          if (/moisture|water|leak|flood|wet|水浸|漏水|积水|湿/i.test(recommended2)) {
            return 3;
          } else {
            return 1;
          }
        } else if (recommended3 === "smoke") {
          if (/smoke|fire|烟雾|烟感|火警/i.test(recommended2)) {
            return 3;
          } else {
            return 1;
          }
        } else if (recommended3 === "natural-gas") {
          if (/natural[_ -]?gas|combustible|gas|燃气|天然气|可燃气/i.test(recommended2)) {
            return 3;
          } else {
            return 1;
          }
        } else if (recommended3 === "door-window") {
          if (/door|window|contact|opening|门|窗|接触/i.test(recommended2)) {
            return 3;
          } else {
            return 1;
          }
        } else if (/presence|occupancy|人在|有人|存在|人体/i.test(recommended2)) {
          return 3;
        } else if (/motion|移动|运动/i.test(recommended2)) {
          return 1;
        } else {
          return 2;
        }
      }
    };
  } else if (componentType === "icon-button") {
    return {
      componentType,
      button: iconButtonEntityButton,
      menu: iconButtonEntityMenu,
      search: iconButtonEntitySearch,
      options: iconButtonEntityOptions,
      except: "icon-button-entity",
      recommended: recommended => entityDomain(recommended) === "light"
    };
  } else if (componentType === "icon-button-effect") {
    return {
      componentType,
      button: ibeEntityButton,
      menu: ibeEntityMenu,
      search: ibeEntitySearch,
      options: ibeEntityOptions,
      except: "ibe-entity",
      recommended: recommended => entityDomain(recommended) === "light"
    };
  } else if (componentType === "weather") {
    return {
      componentType,
      button: weatherEntityButton,
      menu: weatherEntityMenu,
      search: weatherEntitySearch,
      options: weatherEntityOptions,
      except: "weather-entity",
      recommended: recommended => entityDomain(recommended) === "weather"
    };
  } else if (componentType === "line-chart") {
    return {
      componentType,
      button: lineChartEntityButton,
      menu: lineChartEntityMenu,
      search: lineChartEntitySearch,
      options: lineChartEntityOptions,
      except: "line-chart-entity",
      recommended: recommended => entityDomain(recommended) === "sensor"
    };
  } else {
    return {
      componentType: "image",
      button: imageEntityButton,
      menu: imageEntityMenu,
      search: imageEntitySearch,
      options: imageEntityOptions,
      except: "entity",
      recommended: recommended => ["image", "camera"].includes(entityDomain(recommended))
    };
  }
}
function renderEntityPickerOptions(value = "", param = "image") {
  const temp = entityPickerConfig(param);
  const flag = selectedComponent()?.bindings?.entity?.entityId || "";
  const temp2 = value.trim().toLocaleLowerCase("zh-CN");
  const mapped = pickerEntitiesForComponentType(param).map((entity, index) => ({
    entity,
    index
  })).filter(({
    entity: item
  }) => !temp2 || (entityPickerText(item) + " " + entityDomain(item)).toLocaleLowerCase("zh-CN").includes(temp2)).sort((left, right) => {
    const callback = param2 => param2?.virtual ? 100 : Number(temp.recommended(param2));
    return callback(right.entity) - callback(left.entity) || left.index - right.index;
  }).map(({
    entity: item
  }) => item);
  const element = document.createElement("button");
  element.type = "button";
  element.className = "inspector-entity-option inspector-entity-clear" + (flag ? "" : " selected");
  element.dataset.entityId = "";
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(!flag));
  element.textContent = "不使用实体";
  const button = mapped.map(item => {
    const button2 = document.createElement("button");
    button2.type = "button";
    button2.className = "inspector-entity-option" + (item.entityId === flag ? " selected" : "");
    button2.dataset.entityId = item.entityId;
    button2.setAttribute("role", "option");
    button2.setAttribute("aria-selected", String(item.entityId === flag));
    const span = document.createElement("span");
    span.className = "inspector-entity-option-content";
    span.title = entityPickerText(item);
    const span2 = document.createElement("span");
    span2.className = "inspector-entity-option-line inspector-entity-name-line";
    const span3 = document.createElement("span");
    span3.className = "inspector-entity-kind";
    span3.textContent = "[" + entityKindLabel(item) + "] ";
    const span4 = document.createElement("span");
    span4.className = "inspector-entity-name";
    span4.textContent = entityPickerPrimaryName(item);
    span2.append(span3, span4);
    const span5 = document.createElement("span");
    span5.className = "inspector-entity-option-line inspector-entity-id";
    span5.textContent = item.entityId;
    span5.title = item.entityId;
    span.append(span2, span5);
    enableEntityTextHoverScroll(button2, span2);
    button2.append(span);
    return button2;
  });
  const div2 = document.createElement("div");
  div2.className = "inspector-picker-empty";
  if (!mapped.length) {
    div2.textContent = "没有匹配的实体";
  }
  temp.options.replaceChildren(element, ...button, ...(div2.textContent ? [div2] : []));
  temp.options.scrollTop = 0;
}
function pickerValueEl2(component) {
  const value = entityPickerConfig(component.type);
  const flag = component.bindings?.entity?.entityId || "";
  const found = pickerEntitiesForComponentType(component.type).find(item => item.entityId === flag);
  const chosen = found ? entityPickerText(found) : flag || "不使用实体";
  let inspectorPickerValue = value.button.querySelector(".inspector-picker-value");
  if (!inspectorPickerValue) {
    inspectorPickerValue = document.createElement("span");
    inspectorPickerValue.className = "inspector-picker-value";
    value.button.replaceChildren(inspectorPickerValue);
    enableEntityTextHoverScroll(value.button, inspectorPickerValue);
  }
  inspectorPickerValue.textContent = chosen;
  inspectorPickerValue.title = chosen;
  value.button.dataset.entityId = flag;
  value.button._entityCopySync?.();
  value.search.value = "";
  if (!value.menu.hidden) {
    renderEntityPickerOptions("", component.type);
  }
  renderRelatedEntityPicker(component, value.relatedSettings === false ? null : value.button.closest(".inspector-picker"));
}
let entityPickerPanel = null;
let iconPickerPanel = null;
let assetPickerPanel = null;
let relatedPickerPanel = null;
let popupEntityPickerPanel = null;
let floorplanPickerPanel = null;
let openPickerKind = null;
let pickerSearchInput = null;
let activePickerState = null;
function entityCatalogById() {
  return new Map(entityCatalog.map(value => [String(value.entityId || ""), value]).filter(([value]) => value));
}
function deviceCatalogById() {
  return new Map(deviceCatalog.map(value => [String(value.deviceId || ""), value]).filter(([value]) => value));
}
function countVisiblePopupEntityOptions() {
  const value = String(activePickerState?.value || "").trim().toLocaleLowerCase("zh-CN");
  let temp = 0;
  for (const temp2 of popupEntityPickerPanel?.querySelectorAll("[data-related-entity-id]") || []) {
    const flag = !value || String(temp2.dataset.relatedEntitySearch || "").includes(value);
    temp2.hidden = !flag;
    if (flag) {
      temp += 1;
    }
  }
  const el2 = popupEntityPickerPanel?.querySelector(".popup-related-entity-filter-empty");
  if (el2) {
    el2.hidden = temp > 0;
  }
}
function ensureRelatedEntityPickerPanel() {
  if (entityPickerPanel) {
    return entityPickerPanel;
  }
  entityPickerPanel = document.createElement("div");
  entityPickerPanel.id = "popup-related-entity-settings";
  entityPickerPanel.className = "popup-related-entity-settings";
  iconPickerPanel = document.createElement("strong");
  assetPickerPanel = document.createElement("span");
  floorplanPickerPanel = document.createElement("button");
  floorplanPickerPanel.type = "button";
  floorplanPickerPanel.className = "popup-related-entity-open";
  const element = document.createElement("i");
  element.setAttribute("aria-hidden", "true");
  element.textContent = "›";
  floorplanPickerPanel.append(assetPickerPanel, element);
  relatedPickerPanel = document.createElement("p");
  entityPickerPanel.append(iconPickerPanel, floorplanPickerPanel, relatedPickerPanel);
  openPickerKind = document.createElement("dialog");
  openPickerKind.id = "popup-related-entity-dialog";
  openPickerKind.className = "popup-related-entity-dialog";
  const className6 = document.createElement("div");
  className6.className = "popup-related-entity-dialog-card";
  const className7 = document.createElement("div");
  className7.className = "popup-related-entity-dialog-heading";
  const div2 = document.createElement("div");
  pickerSearchInput = document.createElement("strong");
  const span = document.createElement("span");
  span.textContent = "选择要放进设备弹窗的功能";
  div2.append(pickerSearchInput, span);
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", "关闭关联功能选择");
  button.textContent = "×";
  className7.append(div2, button);
  const el3 = document.createElement("label");
  el3.className = "popup-related-entity-dialog-search";
  activePickerState = document.createElement("input");
  activePickerState.type = "search";
  activePickerState.name = "popup-related-entity-search";
  activePickerState.placeholder = "搜索功能名称或实体 ID";
  activePickerState.autocomplete = "off";
  el3.append(activePickerState);
  popupEntityPickerPanel = document.createElement("div");
  popupEntityPickerPanel.className = "popup-related-entity-list";
  const className8 = document.createElement("div");
  className8.className = "popup-related-entity-dialog-footer";
  const button2 = document.createElement("button");
  button2.type = "button";
  button2.textContent = "完成";
  className8.append(button2);
  className6.append(className7, el3, popupEntityPickerPanel, className8);
  openPickerKind.append(className6);
  document.body.append(openPickerKind);
  floorplanPickerPanel.addEventListener("click", () => {
    if (!openPickerKind.open) {
      activePickerState.value = "";
      countVisiblePopupEntityOptions();
      openPickerKind.showModal();
      window.requestAnimationFrame(() => activePickerState.focus({
        preventScroll: true
      }));
    }
  });
  activePickerState.addEventListener("input", countVisiblePopupEntityOptions);
  button.addEventListener("click", () => openPickerKind.close());
  button2.addEventListener("click", () => openPickerKind.close());
  openPickerKind.addEventListener("click", event2 => {
    if (event2.target === openPickerKind) {
      openPickerKind.close();
    }
  });
  popupEntityPickerPanel.addEventListener("click", target => {
    const disabled = target.target.closest("[data-related-entity-id]");
    const alias = componentId;
    if (!disabled || !alias || disabled.disabled) {
      return;
    }
    const text = String(disabled.dataset.relatedEntityId || "");
    const temp = selectedComponent();
    const temp4 = entityCatalogById();
    const temp5 = deviceCatalogById();
    if (!relatedPopupContext(temp, temp4, temp5)) {
      return;
    }
    const temp6 = selectedRelatedEntityIds(temp);
    const idSet = new Set(temp6 === null ? legacyRelatedEntityIds(temp, temp4, temp5) : temp6);
    const temp7 = relatedPopupContext(temp, temp4, temp5);
    const selectionLimit = relatedPopupSelectionLimit(temp7);
    if (idSet.has(text)) {
      idSet.delete(text);
    } else if (!selectionLimit || idSet.size < selectionLimit) {
      idSet.add(text);
    } else {
      return;
    }
    mutateDocument(param => {
      const properties11 = findComponent(param, alias)?.component;
      if (properties11) {
        properties11.properties = {
          ...(properties11.properties || {}),
          relatedEntities: manualRelatedEntityConfig([...idSet])
        };
      }
    });
  });
  return entityPickerPanel;
}
function renderRelatedEntityPicker(value, param) {
  const temp = ensureRelatedEntityPickerPanel();
  const temp2 = entityCatalogById();
  const temp3 = deviceCatalogById();
  const temp4 = relatedPopupContext(value, temp2, temp3);
  if (!temp4 || !param) {
    temp.hidden = true;
    if (openPickerKind?.open) {
      openPickerKind.close();
    }
    return;
  }
  if (temp.previousElementSibling !== param) {
    param.insertAdjacentElement("afterend", temp);
  }
  temp.hidden = false;
  const temp5 = selectedRelatedEntityIds(value);
  const flag = temp5 === null;
  const allowed = new Set(flag ? legacyRelatedEntityIds(value, temp2, temp3) : temp5);
  const selectionLimit = relatedPopupSelectionLimit(temp4);
  const flag2 = selectionLimit > 0 && allowed.size >= selectionLimit;
  const temp7 = relatedPopupCandidates(value, temp2, temp3);
  const allowed2 = new Set(temp7.map(item => item.entityId));
  for (const name of allowed) {
    if (!allowed2.has(name)) {
      temp7.push({
        entityId: name,
        domain: String(name).split(".", 1)[0],
        name,
        status: "missing"
      });
    }
  }
  iconPickerPanel.textContent = temp4.deviceLabel + "弹窗功能";
  assetPickerPanel.textContent = flag ? "自动适配" : "已选 " + allowed.size + (selectionLimit ? " / " + selectionLimit : "") + " 项";
  assetPickerPanel.classList.toggle("is-automatic", flag);
  relatedPickerPanel.textContent = flag ? "当前沿用原来的自动适配，点击可改为手动选择。" : "只显示已勾选的关联功能" + (selectionLimit ? "，最多 " + selectionLimit + " 项" : "") + "。";
  pickerSearchInput.textContent = temp4.deviceLabel + "弹窗功能 · " + (flag ? "自动适配" : "已选 " + allowed.size + (selectionLimit ? " / " + selectionLimit : "") + " 项");
  const mapped = temp7.map(metadata => {
    const temp8 = allowed.has(metadata.entityId);
    const entityAvailable = relatedEntityIsAvailable(metadata);
    const button = document.createElement("button");
    button.type = "button";
    const flag3 = flag2 && !temp8;
    button.className = "popup-related-entity-option" + (temp8 ? " selected" : "") + (entityAvailable ? "" : " unavailable") + (flag3 ? " limit-reached" : "");
    button.dataset.relatedEntityId = metadata.entityId;
    button.setAttribute("aria-pressed", String(temp8));
    button.disabled = !entityAvailable && !temp8 || flag3;
    const iconEl = document.createElement("i");
    iconEl.setAttribute("aria-hidden", "true");
    const span = document.createElement("span");
    const element = document.createElement("strong");
    const entityLabel = relatedEntityLabel(temp4, metadata);
    element.textContent = entityPickerPrimaryName(metadata, entityLabel);
    const el3 = document.createElement("small");
    const list = [RELATED_ENTITY_DOMAIN_LABELS[String(metadata.domain || metadata.entityId || "").split(".", 1)[0]] || "实体", metadata.entityId];
    if (entityAvailable) {
      if (flag3) {
        list.push("最多选择 " + selectionLimit + " 项");
      } else if (relatedEntityNeedsConfirmation(metadata)) {
        list.push("点击时需确认");
      }
    } else {
      list.push("暂时不可用");
    }
    el3.textContent = list.join(" · ");
    button.dataset.relatedEntitySearch = (element.textContent + " " + (metadata.name || "") + " " + (metadata.originalName || "") + " " + el3.textContent).toLocaleLowerCase("zh-CN");
    enableEntityTextHoverScroll(button, element);
    span.append(element, el3);
    button.append(iconEl, span);
    return button;
  });
  if (mapped.length) {
    const element = document.createElement("div");
    element.className = "popup-related-entity-empty popup-related-entity-filter-empty";
    element.textContent = "没有匹配的关联功能。";
    element.hidden = true;
    mapped.push(element);
  } else {
    const element = document.createElement("div");
    element.className = "popup-related-entity-empty";
    element.textContent = "这个 HA 设备暂时没有可选择的关联实体。";
    mapped.push(element);
  }
  popupEntityPickerPanel.replaceChildren(...mapped);
  countVisiblePopupEntityOptions();
}
function positionEntityPickerMenu(value = "image") {
  const temp = entityPickerConfig(value);
  if (temp.menu.hidden) {
    return;
  }
  const rect = temp.button.getBoundingClientRect();
  const number3 = 5;
  const number4 = 8;
  const minValue = Math.min(rect.width, window.innerWidth - number4 * 2);
  const number = window.innerHeight - rect.bottom - number3 - number4;
  const number2 = rect.top - number3 - number4;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(430, flag ? number : number2));
  const left = rect.left;
  temp.menu.style.left = clampNumber(left, number4, Math.max(number4, window.innerWidth - minValue - number4)) + "px";
  temp.menu.style.width = minValue + "px";
  temp.menu.style.maxHeight = count + "px";
  temp.options.style.maxHeight = Math.max(90, count - 58) + "px";
  temp.menu.style.top = flag ? rect.bottom + number3 + "px" : Math.max(number4, rect.top - count - number3) + "px";
}
function positionImageEntityPickerMenu() {
  positionEntityPickerMenu("image");
}
function toText(value) {
  if (value?.url) {
    return String(value.url);
  }
  const text = String(value?.assetId || "");
  if (text.startsWith("user:")) {
    const sliced = text.slice(5);
    if (/^[0-9a-f]{32}$/.test(sliced)) {
      return "/api/v1/assets/user/" + sliced;
    } else {
      return "";
    }
  }
  const temp = String(value?.relativePath || text).replace(/^builtin:/, "");
  const joined = (temp.startsWith("v1/2D/") || temp.startsWith("v1/3D/") ? temp.replace(/^v1\//, "v1/户型图示例/") : temp).split("/").filter(Boolean).map(item => encodeURIComponent(item)).join("/");
  if (!joined) {
    return "";
  }
  const text2 = String(value?.version || "");
  return "/assets/builtin/" + joined + (text2 ? "?v=" + encodeURIComponent(text2) : "");
}
function assetPreviewUrl(value) {
  const url = value?.effectVariant?.url;
  if (typeof url == "string" && url.startsWith("/api/v1/assets/effect-variant?")) {
    return url;
  } else {
    return toText(value);
  }
}
const {
  createIconPickerClearOption: createIconPickerClearOption,
  createIconPickerOption: createIconPickerOption,
  createEditorPickerCurrentIcon: createEditorPickerCurrentIcon,
  createEditorEntityPickerOption: createEditorEntityPickerOption,
  editorPickerClearOption: editorPickerClearOption,
  editorPickerClearAction: editorPickerClearAction,
  editorPickerEntityAction: editorPickerEntityAction,
  createEditorPickerCurrentEntity: createEditorPickerCurrentEntity,
  createEditorPickerCurrentAsset: createEditorPickerCurrentAsset
} = createEditorPickerElements({
  entityKindLabel: entityKindLabel,
  entityPickerPrimaryName: entityPickerPrimaryName,
  entityPickerText: entityPickerText,
  enableEntityTextHoverScroll: enableEntityTextHoverScroll,
  assetDisplayName: assetDisplayName,
  assetPreviewUrl: assetPreviewUrl,
  bindEditorIconNameTooltip: bindEditorIconNameTooltip,
  mdiIconUrl: mdiIconUrl
});
const {
  editorEntityMatches: readEntityId,
  editorPickerComponentTypeLabel: editorPickerComponentTypeLabel
} = createEditorPickerQueries({
  entityPickerConfig: entityPickerConfig,
  pickerEntitiesForComponentType: pickerEntitiesForComponentType,
  entityPickerText: entityPickerText,
  entityDomain: entityDomain
});
const i3dEditorPickers = createInteraction3dEditorPickers({
  getState: param => editorRenderer?.states?.get(param),
  openPicker: getSource => openEditorPicker(getSource),
  fetchIcons: (setSource, setSource2, param) => apiFetch("/icons?query=" + encodeURIComponent(setSource) + "&limit=" + setSource2 + "&offset=" + param),
  getEntities: () => entityCatalog,
  ensureEntities: () => entitiesLoaded ? Promise.resolve() : entityLoadPromise || ensureEntitiesLoaded(),
  entityPickerText: entityPickerText,
  elements: {
    createEditorPickerCurrentIcon: createEditorPickerCurrentIcon,
    createIconPickerOption: createIconPickerOption,
    createEditorPickerCurrentEntity: createEditorPickerCurrentEntity,
    createEditorEntityPickerOption: createEditorEntityPickerOption,
    editorPickerClearAction: editorPickerClearAction
  }
});
const editorAssetMatcher = createEditorAssetMatcher({
  getImageSource: () => imageAssetSource,
  getImageFolder: () => imageAssetFolderFilter,
  getIbeSource: () => ibeAssetSource,
  getIbeFolder: () => ibeAssetFolderFilter,
  getUserAssets: () => userAssets,
  getBuiltinAssets: () => builtinAssets
});
const editorAssetToolbar = createEditorAssetToolbar({
  documentObject: document,
  getSource: param => param === "image" ? imageAssetSource : ibeAssetSource,
  setSource: (param, param2) => {
    if (param === "image") {
      imageAssetSource = param2;
    } else {
      ibeAssetSource = param2;
    }
  },
  getFolder: param => param === "image" ? imageAssetFolderFilter : ibeAssetFolderFilter,
  setFolder: (param, param2) => {
    if (param === "image") {
      imageAssetFolderFilter = param2;
    } else {
      ibeAssetFolderFilter = param2;
    }
  },
  getAssets: param => param === "user" ? userAssets : builtinAssets,
  getUploadInput: param => param === "image" ? imageAssetUploadInput : ibeAssetUploadInput,
  canDeleteFolder: (param, param2) => isStudioExportFolder(param, param2),
  onDeleteFolder: (param, param2) => confirmDeleteStudioExportFolder(param, param2)
});
function assetMatchesId(value, param) {
  return value?.assetId === param || (value?.legacyAssetIds || []).includes(param);
}
function allAssets() {
  return [...builtinAssets, ...userAssets];
}
function findAssetById(value) {
  return allAssets().find(item => assetMatchesId(item, value));
}
function assetDisplayName(value) {
  return String(value?.name || value?.relativePath || value?.assetId || "").replace(/\.(?:png|jpe?g|webp|gif|svg)$/i, "");
}
function studioExportAssetsInFolder(value) {
  return userAssets.filter(item => item.folder === value && item.source === "studio3d-export");
}
function isStudioExportFolder(value, param) {
  if (value !== "user" || !param) {
    return false;
  }
  const filtered = userAssets.filter(item => item.folder === param);
  return filtered.length > 0 && filtered.every(item => item.source === "studio3d-export");
}
function syncAssetSourceMenu(value) {
  const flag = value === "image";
  const chosen = flag ? imageAssetSource : ibeAssetSource;
  const chosen2 = flag ? imageAssetMenu : ibeAssetMenu;
  const chosen3 = flag ? imageAssetFolder : ibeAssetFolder;
  const chosen4 = flag ? imageAssetUploadHint : ibeAssetUploadHint;
  const chosen5 = flag ? "[data-image-asset-source]" : "[data-ibe-asset-source]";
  for (const element of chosen2.querySelectorAll(chosen5)) {
    element.classList.toggle("active", element.dataset[flag ? "imageAssetSource" : "ibeAssetSource"] === chosen);
  }
  const temp = customSelectStateByEl.get(chosen3);
  if (temp) {
    const chosen6 = chosen === "user" ? userAssets : builtinAssets;
    temp.wrapper.hidden = !chosen6.some(item => item.folder);
    if (temp.wrapper.hidden) {
      closeMenuState(temp);
    }
  }
  chosen4.hidden = chosen !== "user";
}
function syncAssetFolderMenu(value) {
  const flag = value === "image";
  const chosen = flag ? imageAssetSource : ibeAssetSource;
  const element = flag ? imageAssetFolder : ibeAssetFolder;
  const chosen2 = chosen === "user" ? userAssets : builtinAssets;
  const sorted = [...new Set(chosen2.map(item => item.folder).filter(Boolean))].sort((left, right) => left.localeCompare(right, "zh-CN"));
  const chosen3 = flag ? imageAssetFolderFilter : ibeAssetFolderFilter;
  const chosen4 = sorted.includes(chosen3) ? chosen3 : sorted[0] || "";
  if (flag) {
    imageAssetFolderFilter = chosen4;
  } else {
    ibeAssetFolderFilter = chosen4;
  }
  element.replaceChildren(...sorted.map(item => new Option(item === "." ? "根目录" : item, item)));
  element.value = chosen4;
  syncCustomSelect(element);
  syncAssetSourceMenu(value);
}
function ensureAssetDimensions(value) {
  if (Number(value?.width) > 0 && Number(value?.height) > 0) {
    return Promise.resolve({
      width: Number(value.width),
      height: Number(value.height)
    });
  } else {
    return new Promise((item, param) => {
      const temp = new Image();
      temp.decoding = "async";
      temp.addEventListener("load", () => {
        value.width = temp.naturalWidth;
        value.height = temp.naturalHeight;
        item({
          width: value.width,
          height: value.height
        });
      }, {
        once: true
      });
      temp.addEventListener("error", () => param(new Error("无法读取图片尺寸：" + (value?.name || ""))), {
        once: true
      });
      temp.src = toText(value);
    });
  }
}
function applyAssetToComponent(component, assetId, value) {
  const callback = (item, fallback) => {
    const numeric = Number(item?.width || value.width);
    const number3 = Number(item?.height || value.height);
    const clamped = clampNumber(Number(fallback || 1), 0.01, 5);
    const number = Number(item?.x || 0) + numeric / 2;
    const number2 = Number(item?.y || 0) + number3 / 2;
    return {
      position: {
        ...(item || {}),
        x: number - value.width / 2,
        y: number2 - value.height / 2,
        width: value.width,
        height: value.height
      },
      scale: clampNumber(numeric * clamped / value.width, 0.01, 5)
    };
  };
  component.properties = {
    ...(component.properties || {})
  };
  if (component.properties.layoutMode === "fill") {
    const freeLayout = component.properties.freeLayout;
    if (freeLayout?.position) {
      const temp = callback(freeLayout.position, freeLayout.scale);
      component.properties.freeLayout = temp;
    }
  } else {
    const temp = callback(component.position, component.style?.scale);
    component.position = temp.position;
    component.style = {
      ...(component.style || {}),
      scale: temp.scale
    };
  }
  component.properties = {
    ...(component.properties || {}),
    assetId,
    fit: "contain",
    naturalWidth: value.width,
    naturalHeight: value.height
  };
}
function effectNaturalSize(value, fallback = null) {
  const width = Number(value?.effectNaturalWidth || fallback?.width || 0);
  const height = Number(value?.effectNaturalHeight || fallback?.height || 0);
  if (width > 0 && height > 0) {
    return {
      width,
      height
    };
  } else {
    return null;
  }
}
function warmupEffectSize(value, param) {
  if (!value || !param) {
    return;
  }
  const number = value.id + ":" + param.assetId;
  if (!effectSizeWarmupIds.has(number)) {
    effectSizeWarmupIds.add(number);
    ensureAssetDimensions(param).then(item => {
      const component = findComponent(currentProject?.document, value.id)?.component;
      if (!!component && component.properties?.assetId === param.assetId && (component.properties?.layoutMode !== "fill" && (Number(component.position?.width) !== item.width || Number(component.position?.height) !== item.height) || Number(component.properties?.naturalWidth) !== item.width || Number(component.properties?.naturalHeight) !== item.height)) {
        mutateDocument(param2 => {
          const temp2 = findComponent(param2, value.id)?.component;
          if (!!temp2 && temp2.properties?.assetId === param.assetId) {
            applyAssetToComponent(temp2, param.assetId, item);
          }
        });
      }
    }).catch(onError).finally(() => effectSizeWarmupIds.delete(number));
  }
}
function positionImageAssetMenu() {
  if (imageAssetMenu.hidden) {
    return;
  }
  const value = imageAssetButton.getBoundingClientRect();
  const temp = 5;
  const number3 = 8;
  const number = window.innerHeight - value.bottom - temp - number3;
  const number2 = value.top - temp - number3;
  const flag = number >= 260 || number >= number2;
  const count = Math.max(150, Math.min(470, flag ? number : number2));
  imageAssetMenu.style.left = clampNumber(value.left, number3, Math.max(number3, window.innerWidth - value.width - number3)) + "px";
  imageAssetMenu.style.width = value.width + "px";
  imageAssetMenu.style.maxHeight = count + "px";
  imageAssetOptions.style.maxHeight = Math.max(80, count - 150) + "px";
  imageAssetMenu.style.top = flag ? value.bottom + temp + "px" : Math.max(number3, value.top - count - temp) + "px";
}
function positionImageLargePreview(element, el3 = imageAssetMenu) {
  if (imageAssetLargePreview.hidden || !element?.isConnected) {
    return;
  }
  const value = element.getBoundingClientRect();
  const rect = el3.getBoundingClientRect();
  const rect2 = imageAssetLargePreview.getBoundingClientRect();
  const temp = 18;
  const chosen = rect.left < window.innerWidth / 2 ? rect.right + temp : rect.left - rect2.width - temp;
  imageAssetLargePreview.style.left = clampNumber(chosen, 12, Math.max(12, window.innerWidth - rect2.width - 12)) + "px";
  imageAssetLargePreview.style.top = clampNumber(value.top, 12, Math.max(12, window.innerHeight - rect2.height - 12)) + "px";
}
function scheduleImageLargePreview(value, param, el2 = imageAssetMenu) {
  if (!!value && !!param) {
    clearTimeout(imagePreviewTimer);
    imagePreviewTimer = window.setTimeout(() => {
      const temp = assetPreviewUrl(value);
      if (!!temp && !el2.hidden && !!param.isConnected) {
        imageAssetLargePreviewImage.onload = () => positionImageLargePreview(param, el2);
        imageAssetLargePreviewImage.src = temp;
        imageAssetLargePreviewName.textContent = value.name || value.relativePath;
        imageAssetLargePreview.hidden = false;
        window.requestAnimationFrame(() => positionImageLargePreview(param, el2));
      }
    }, 300);
  }
}
function hideImageLargePreview() {
  clearTimeout(imagePreviewTimer);
  imagePreviewTimer = null;
  imageAssetLargePreview.hidden = true;
  imageAssetLargePreviewImage.onload = null;
}
function createAssetOptionButton(value, param) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = "inspector-asset-option" + (assetMatchesId(value, param) ? " selected" : "");
  element.dataset.assetId = value.assetId;
  element.title = value.name;
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(assetMatchesId(value, param)));
  const temp = document.createElement("img");
  temp.src = assetPreviewUrl(value);
  temp.alt = value.name;
  temp.loading = "lazy";
  temp.addEventListener("error", () => element.classList.add("image-load-error"));
  const span = document.createElement("span");
  span.textContent = assetDisplayName(value);
  element.append(temp, span);
  if (value.source === "studio3d-export" || value.source !== "user") {
    return element;
  }
  const div2 = document.createElement("div");
  div2.className = "user-asset-option-wrap";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "user-asset-delete";
  button.dataset.deleteUserAsset = value.assetId;
  button.title = "删除 " + value.name;
  button.setAttribute("aria-label", "删除 " + value.name);
  button.textContent = "×";
  div2.append(element, button);
  return div2;
}
function renderImageAssetOptions(value = "") {
  hideImageLargePreview();
  const flag = selectedComponent()?.properties?.assetId || "";
  const temp = value.trim().toLocaleLowerCase("zh-CN");
  const filtered = (imageAssetSource === "user" ? userAssets : builtinAssets).filter(item => {
    const flag2 = !temp || (item.name + " " + item.relativePath).toLocaleLowerCase("zh-CN").includes(temp);
    const flag3 = !!temp || item.folder === imageAssetFolderFilter;
    return flag2 && flag3;
  });
  const element = document.createElement("button");
  element.type = "button";
  element.className = "inspector-asset-clear" + (flag ? "" : " selected");
  element.dataset.assetId = "";
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(!flag));
  element.textContent = "不使用图片";
  if (!filtered.length) {
    const div2 = document.createElement("div");
    div2.className = "inspector-picker-empty";
    div2.textContent = "没有匹配的图片";
    imageAssetOptions.replaceChildren(element, div2);
    return;
  }
  imageAssetOptions.replaceChildren(element, ...filtered.map(item => createAssetOptionButton(item, flag)));
}
function syncImageAssetButton(component) {
  const value = component.properties?.assetId || "";
  const temp = findAssetById(value);
  imageAssetSource = ["user", "studio3d-export"].includes(temp?.source) || userAssets.length && !temp ? "user" : "builtin";
  imageAssetFolderFilter = temp?.folder || "" || imageAssetFolderFilter;
  syncAssetFolderMenu("image");
  syncAssetSourceMenu("image");
  imageAssetButton.textContent = temp?.name || value || "不使用图片";
  imageAssetSearch.value = "";
  imageAssetOptions.replaceChildren();
  warmupEffectSize(component, temp);
}
function positionIbeAssetMenu() {
  if (ibeAssetMenu.hidden) {
    return;
  }
  const value = ibeAssetButton.getBoundingClientRect();
  const temp = 5;
  const number3 = 8;
  const number = window.innerHeight - value.bottom - temp - number3;
  const number2 = value.top - temp - number3;
  const flag = number >= 260 || number >= number2;
  const count = Math.max(150, Math.min(470, flag ? number : number2));
  ibeAssetMenu.style.left = clampNumber(value.left, number3, Math.max(number3, window.innerWidth - value.width - number3)) + "px";
  ibeAssetMenu.style.width = value.width + "px";
  ibeAssetMenu.style.maxHeight = count + "px";
  ibeAssetOptions.style.maxHeight = Math.max(80, count - 150) + "px";
  ibeAssetMenu.style.top = flag ? value.bottom + temp + "px" : Math.max(number3, value.top - count - temp) + "px";
}
function renderIbeAssetOptions(value = "") {
  hideImageLargePreview();
  const flag = selectedComponent()?.properties?.effectAssetId || "";
  const temp = value.trim().toLocaleLowerCase("zh-CN");
  const filtered = (ibeAssetSource === "user" ? userAssets : builtinAssets).filter(item => (!temp || (item.name + " " + item.relativePath).toLocaleLowerCase("zh-CN").includes(temp)) && (!!temp || item.folder === ibeAssetFolderFilter));
  const element = document.createElement("button");
  element.type = "button";
  element.className = "inspector-asset-clear" + (flag ? "" : " selected");
  element.dataset.assetId = "";
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(!flag));
  element.textContent = "不使用图片";
  const mapped = filtered.map(item => createAssetOptionButton(item, flag));
  const div2 = document.createElement("div");
  div2.className = "inspector-picker-empty";
  if (!mapped.length) {
    div2.textContent = "没有匹配的图片";
  }
  ibeAssetOptions.replaceChildren(element, ...mapped, ...(div2.textContent ? [div2] : []));
}
function syncIbeAssetButton(component) {
  const value = component.properties?.effectAssetId || "";
  const temp = findAssetById(value);
  ibeAssetSource = ["user", "studio3d-export"].includes(temp?.source) || userAssets.length && !temp ? "user" : "builtin";
  ibeAssetFolderFilter = temp?.folder || ibeAssetFolderFilter;
  syncAssetFolderMenu("ibe");
  syncAssetSourceMenu("ibe");
  ibeAssetButton.textContent = temp?.name || value || "不使用图片";
  ibeAssetSearch.value = "";
  ibeAssetOptions.replaceChildren();
}
function actionControlKey(value) {
  const flag = value.closest(".inspector-form[id]")?.id || "component-action";
  const temp = String(value.dataset.actionTrigger || "action").replace(/[^a-zA-Z0-9_-]/g, "-");
  const list = [["[data-action-target]", "target"], ["[data-popup-source]", "popup-source"], ["[data-popup-entity-search]", "popup-entity-search"], ["[data-popup-entity]", "popup-entity"], ["[data-popup-custom]", "popup-custom"]];
  for (const [selector, temp2] of list) {
    const element = value.querySelector(selector);
    if (element && !element.id && !element.name) {
      element.id = flag + "-" + temp + "-" + temp2;
    }
  }
}
function syncMoreInfoActionLabels() {
  for (const element of document.querySelectorAll("[data-action-type=\"more-info\"]")) {
    element.textContent = "打开弹窗";
  }
  for (const value of document.querySelectorAll(".component-action-control[data-action-trigger]")) {
    actionControlKey(value);
    if (value.querySelector(".component-popup-config")) {
      continue;
    }
    const element = document.createElement("div");
    element.className = "component-popup-config";
    element.hidden = true;
    element.innerHTML = "\n      <label class=\"component-popup-config-row\"><span>弹窗来源</span><select data-popup-source><option value=\"current\">当前实体</option><option value=\"entity\">其它实体</option><option value=\"custom\">组合弹窗</option></select></label>\n      <div class=\"component-popup-config-row\" data-popup-entity-row><span>选择实体</span><div class=\"component-popup-entity-picker\"><button class=\"inspector-picker-button\" type=\"button\" data-popup-entity-button aria-haspopup=\"listbox\" aria-expanded=\"false\">选择实体</button><div class=\"inspector-picker-menu component-popup-entity-menu\" data-popup-entity-menu hidden><input type=\"search\" data-popup-entity-search placeholder=\"搜索实体名称或 ID\" autocomplete=\"off\"><div class=\"inspector-entity-options\" data-popup-entity-options role=\"listbox\"></div></div><input type=\"hidden\" data-popup-entity></div></div>\n      <label class=\"component-popup-config-row\" data-popup-custom-row><span>选择弹窗</span><select data-popup-custom></select></label>\n      <button class=\"component-popup-preview\" type=\"button\" data-popup-preview>预览弹窗</button>";
    value.append(element);
    actionControlKey(value);
    const el3 = element.querySelector("[data-popup-entity-button]");
    const el4 = element.querySelector("[data-popup-entity]");
    bindEntityCopyButton(el3, () => el4?.value || "");
  }
}
function closePopupEntityMenus(value = null) {
  for (const temp of document.querySelectorAll("[data-popup-entity-menu]")) {
    const ancestorEl = temp.closest("[data-action-trigger]");
    if (ancestorEl !== value) {
      temp.hidden = true;
      ancestorEl?.querySelector("[data-popup-entity-button]")?.setAttribute("aria-expanded", "false");
    }
  }
}
function popupEntityIdFromRow(value) {
  const el2 = value?.querySelector("[data-popup-entity]")?.value || "";
  const found = entityCatalog.find(item => item.entityId === el2);
  const el3 = value?.querySelector("[data-popup-entity-button]");
  if (!el3) {
    return;
  }
  const chosen = found ? "[" + entityKindLabel(found) + "] " + entityPickerPrimaryName(found) : el2 || "选择实体";
  setPickerButtonLabel(el3, chosen, el2 || chosen);
  el3.dataset.entityId = el2;
  el3._entityCopySync?.();
}
function renderPopupEntityOptions(value, param = "") {
  const el2 = value?.querySelector("[data-popup-entity-options]");
  const el3 = value?.querySelector("[data-popup-entity]")?.value || "";
  if (!el2) {
    return;
  }
  const temp = String(param || "").trim().toLocaleLowerCase("zh-CN");
  const filtered = entityCatalog.filter(item => !temp || (entityPickerText(item) + " " + item.entityId).toLocaleLowerCase("zh-CN").includes(temp));
  el2.replaceChildren(...filtered.map(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "inspector-entity-option" + (item.entityId === el3 ? " selected" : "");
    button.dataset.popupActionEntityId = item.entityId;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(item.entityId === el3));
    const span = document.createElement("span");
    span.className = "inspector-entity-option-content";
    const element = document.createElement("span");
    element.className = "inspector-entity-option-line inspector-entity-name-line";
    element.textContent = "[" + entityKindLabel(item) + "] " + entityPickerPrimaryName(item);
    const span2 = document.createElement("span");
    span2.className = "inspector-entity-option-line inspector-entity-id";
    span2.textContent = item.entityId;
    span.append(element, span2);
    enableEntityTextHoverScroll(button, element);
    button.append(span);
    return button;
  }));
  if (!filtered.length) {
    const element = document.createElement("div");
    element.className = "inspector-picker-empty";
    element.textContent = "没有匹配的实体";
    el2.append(element);
  }
}
function syncPopupEntityButton(value) {
  const element = value?.querySelector("[data-popup-entity-button]");
  const el2 = value?.querySelector("[data-popup-entity-menu]");
  if (!element || !el2 || el2.hidden) {
    return;
  }
  const rect = element.getBoundingClientRect();
  const minValue = Math.min(rect.width, window.innerWidth - 16);
  const minValue2 = Math.min(340, window.innerHeight - 16);
  el2.style.width = minValue + "px";
  el2.style.maxHeight = minValue2 + "px";
  const el3 = el2.querySelector("[data-popup-entity-options]");
  if (el3) {
    el3.style.maxHeight = Math.max(120, minValue2 - 58) + "px";
  }
  const clamped = clampNumber(rect.left, 8, window.innerWidth - minValue - 8);
  const minValue3 = Math.min(el2.scrollHeight, minValue2);
  const number = rect.bottom + 5;
  const chosen = number + minValue3 <= window.innerHeight - 8 ? number : Math.max(8, rect.top - minValue3 - 5);
  el2.style.left = clamped + "px";
  el2.style.top = chosen + "px";
}
function syncComponentActionControls(component, value) {
  syncMoreInfoActionLabels();
  const flag = component.bindings?.entity?.entityId || "";
  const flag2 = component.type === "light-statistics";
  if (flag2) {
    lightStatisticsActionNote.textContent = flag ? "切换和“当前实体”弹窗作用于绑定实体；其它实体弹窗、组合弹窗和跳转页面无需绑定动作实体。" : "未绑定动作实体时仍可使用其它实体弹窗、组合弹窗和跳转页面。";
    value.setAttribute("aria-disabled", "false");
  }
  const flag3 = currentProject.document.pages || [];
  const pagePaths = new Set(flag3.map(item2 => item2.path));
  const popupIds = new Set((currentProject.document.customPopups || []).map(component2 => component2.id));
  const element = value.querySelector("[data-hidden-content-clickable-control]");
  if (element) {
    const includesValue = ["title-button", "device-button", "icon-button-effect"].includes(component.type);
    element.hidden = !includesValue;
    for (const temp2 of element.querySelectorAll("[data-hidden-content-clickable]")) {
      const flag4 = temp2.dataset.hiddenContentClickable === (component.properties?.hiddenContentClickable === true ? "on" : "off");
      temp2.classList.toggle("active", flag4);
      temp2.setAttribute("aria-pressed", String(flag4));
    }
  }
  for (const temp of value.querySelectorAll("[data-action-trigger]")) {
    const actionTrigger = temp.dataset.actionTrigger;
    const temp2 = component.actions?.[actionTrigger];
    const chosen = componentActionIsSupported(component, temp2, {
      pagePaths,
      popupIds
    }) ? temp2.type : "none";
    for (const temp4 of temp.querySelectorAll("[data-action-type]")) {
      const flag5 = temp4.dataset.actionType === chosen;
      temp4.classList.toggle("active", flag5);
      temp4.setAttribute("aria-pressed", String(flag5));
      temp4.disabled = temp4.dataset.actionType === "toggle" && (!flag || !entityIdSupportsToggle(flag)) || flag2 && !["none", "toggle", "more-info", "navigate"].includes(temp4.dataset.actionType);
    }
    const componentActionTarget = temp.querySelector(".component-action-target");
    const el3 = temp.querySelector("[data-action-target]");
    const target = component.actions?.[actionTrigger]?.target;
    el3.replaceChildren(...flag3.map(item2 => new Option(item2.name, item2.path)));
    el3.value = pagePaths.has(target) ? target : pageSelect.value || flag3[0]?.path || "";
    syncCustomSelect(el3);
    componentActionTarget.hidden = chosen !== "navigate";
    const componentPopupConfig = temp.querySelector(".component-popup-config");
    const el4 = temp.querySelector("[data-popup-source]");
    const el5 = temp.querySelector("[data-popup-entity]");
    const el6 = temp.querySelector("[data-popup-custom]");
    const el7 = temp.querySelector("[data-popup-entity-row]");
    const el8 = temp.querySelector("[data-popup-custom-row]");
    const el9 = temp.querySelector("[data-popup-preview]");
    const temp3 = actionPopupData(component.actions?.[actionTrigger]);
    el4.value = temp3.source;
    const el10 = el4.querySelector("option[value=\"current\"]");
    if (el10) {
      el10.disabled = !flag;
    }
    el5.value = temp3.entityId || entityCatalog[0]?.entityId || "";
    const flag4 = currentProject.document.customPopups || [];
    el6.replaceChildren(...flag4.map(component2 => new Option(component2.name, component2.id)));
    el6.value = flag4.some(component2 => component2.id === temp3.popupId) ? temp3.popupId : flag4[0]?.id || "";
    syncCustomSelect(el4);
    syncCustomSelect(el6);
    popupEntityIdFromRow(temp);
    const el11 = temp.querySelector("[data-popup-entity-menu]");
    if (el11 && !el11.hidden) {
      renderPopupEntityOptions(temp, temp.querySelector("[data-popup-entity-search]")?.value || "");
      window.requestAnimationFrame(() => syncPopupEntityButton(temp));
    }
    componentPopupConfig.hidden = chosen !== "more-info";
    el7.hidden = temp3.source !== "entity";
    el8.hidden = temp3.source !== "custom";
    el9.disabled = temp3.source === "current" ? !flag : temp3.source === "entity" ? !el5.value : !el6.value;
  }
}
function fitTimeComponent(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(component, value, timeComponentDimensions);
}
function syncTimeInspector(component) {
  const value = component.properties || {};
  const {
    left: temp,
    top: temp2,
    scale: temp3,
    rotation: temp4
  } = inspectorComponentMetrics(component, currentProject.document);
  timeType.value = "时间";
  timeLabel.value = value.label || "";
  for (const element of timeHourFormat.querySelectorAll("[data-time-hour-format]")) {
    element.classList.toggle("active", element.dataset.timeHourFormat === (value.hour12 === true ? "12" : "24"));
  }
  for (const element of timeSeconds.querySelectorAll("[data-time-seconds]")) {
    element.classList.toggle("active", element.dataset.timeSeconds === (value.showSeconds === true ? "on" : "off"));
  }
  timeColor.value = value.color || "#248eb2";
  timeFontSize.value = roundField(clampNumber(Number(value.fontSize ?? 96), 12, 500));
  timeFontWeight.value = roundField(normalizedFontWeight(value.fontWeight));
  timeLetterSpacing.value = roundField(clampNumber(Number(value.letterSpacing ?? 2.2), -20, 100));
  timeOpacity.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  timeLeft.value = temp;
  timeTop.value = temp2;
  timeScale.value = temp3;
  timeRotation.value = temp4;
  timeScale.disabled = false;
  timeRotation.disabled = false;
}
function fitDateComponent(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(component, value, dateComponentDimensions);
}
function syncDateInspector(component) {
  const value = component.properties || {};
  const {
    left: temp,
    top: temp2,
    scale: temp3,
    rotation: temp4
  } = inspectorComponentMetrics(component, currentProject.document);
  dateType.value = "日期";
  dateLabel.value = value.label || "";
  for (const element of dateWeekday.querySelectorAll("[data-date-weekday]")) {
    element.classList.toggle("active", element.dataset.dateWeekday === (value.showWeekday === false ? "off" : "on"));
  }
  for (const element of dateLunar.querySelectorAll("[data-date-lunar]")) {
    element.classList.toggle("active", element.dataset.dateLunar === (value.showLunar === true ? "on" : "off"));
  }
  datePrimaryColor.value = value.primaryColor || "#8d9296";
  datePrimarySize.value = roundField(clampNumber(Number(value.primarySize ?? 36), 12, 500));
  datePrimaryWeight.value = roundField(normalizedFontWeight(value.primaryWeight));
  datePrimarySpacing.value = roundField(clampNumber(Number(value.primarySpacing ?? 1), -20, 100));
  dateLunarColor.value = value.lunarColor || "#7f878c";
  dateLunarSize.value = roundField(clampNumber(Number(value.lunarSize ?? 24), 10, 500));
  dateLunarWeight.value = roundField(normalizedFontWeight(value.lunarWeight));
  dateLunarSpacing.value = roundField(clampNumber(Number(value.lunarSpacing ?? 1), -20, 100));
  dateLineGap.value = roundField(clampNumber(Number(value.lineGap ?? 8), 0, 200));
  dateOpacity.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  dateLeft.value = temp;
  dateTop.value = temp2;
  dateScale.value = temp3;
  dateRotation.value = temp4;
  dateScale.disabled = false;
  dateRotation.disabled = false;
}
function fitWeatherComponent(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(component, value, weatherComponentDimensions);
}
function syncWeatherInspector(component) {
  const value = component.properties || {};
  const {
    left: temp,
    top: temp2,
    scale: temp3,
    rotation: temp4
  } = inspectorComponentMetrics(component, currentProject.document);
  pickerValueEl2(component);
  weatherType.value = "天气";
  weatherLabel.value = value.label || "";
  const list = [[weatherIconVisible, "weatherIconVisible", value.iconVisible !== false], [weatherTemperatureVisible, "weatherTemperatureVisible", value.temperatureVisible !== false], [weatherConditionVisible, "weatherConditionVisible", value.conditionVisible !== false], [weatherHumidityVisible, "weatherHumidityVisible", value.humidityVisible !== false]];
  for (const [temp5, temp6, temp7] of list) {
    for (const element of temp5.querySelectorAll("[data-" + temp6.replace(/[A-Z]/g, item => "-" + item.toLowerCase()) + "]")) {
      const temp8 = element.dataset[temp6];
      element.classList.toggle("active", temp8 === (temp7 ? "on" : "off"));
      element.setAttribute("aria-pressed", String(temp8 === (temp7 ? "on" : "off")));
    }
  }
  weatherIconSize.value = roundField(clampNumber(Number(value.iconSize ?? 64), 12, 500));
  weatherIconGap.value = roundField(clampNumber(Number(value.iconGap ?? 22), 0, 300));
  weatherTemperatureColor.value = value.temperatureColor || "#aeb3b7";
  weatherTemperatureSize.value = roundField(clampNumber(Number(value.temperatureSize ?? 32), 12, 500));
  weatherTemperatureWeight.value = roundField(normalizedFontWeight(value.temperatureWeight));
  weatherTemperatureSpacing.value = roundField(clampNumber(Number(value.temperatureSpacing ?? 1), -20, 100));
  weatherSecondaryColor.value = value.secondaryColor || "#8d9296";
  weatherSecondarySize.value = roundField(clampNumber(Number(value.secondarySize ?? 18), 10, 500));
  weatherSecondaryWeight.value = roundField(normalizedFontWeight(value.secondaryWeight));
  weatherSecondarySpacing.value = roundField(clampNumber(Number(value.secondarySpacing ?? 1), -20, 100));
  weatherLineGap.value = roundField(clampNumber(Number(value.lineGap ?? 7), 0, 200));
  weatherOpacity.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  weatherLeft.value = temp;
  weatherTop.value = temp2;
  weatherScale.value = temp3;
  weatherRotation.value = temp4;
  weatherScale.disabled = false;
  weatherRotation.disabled = false;
}
function syncLineChartInspector(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(flag.width || 100);
  const number2 = Number(flag.height || 100);
  pickerValueEl2(component);
  lineChartType.value = "折线图";
  lineChartLabel.value = value.label || "";
  for (const element of lineChartValueVisible.querySelectorAll("[data-line-chart-value-visible]")) {
    const flag3 = element.dataset.lineChartValueVisible === (value.valueVisible === false ? "off" : "on");
    element.classList.toggle("active", flag3);
    element.setAttribute("aria-pressed", String(flag3));
  }
  lineChartValueScale.value = roundField(clampNumber(Number(value.valueScale ?? 100), 10, 500));
  lineChartValueColor.value = value.valueColor || "#dce1e5";
  lineChartStatePrecision.value = ["0", "1", "2", "3", "4"].includes(String(value.statePrecision)) ? String(value.statePrecision) : "auto";
  lineChartValueOffsetX.value = roundField(clampNumber(Number(value.valueOffsetX ?? 0), -100, 100));
  lineChartValueOffsetY.value = roundField(clampNumber(Number(value.valueOffsetY ?? 0), -100, 100));
  lineChartUpdateInterval.value = roundField(clampNumber(Number(value.updateInterval ?? 600), 30, 86400));
  lineChartHours.value = roundField(clampNumber(Number(value.hours ?? 24), 1, 168));
  lineChartCurveRadius.value = roundField(clampNumber(Number(value.cornerRadius ?? 10), 0, 50));
  const list = [{
    value: 0,
    color: "#ddffc2"
  }, {
    value: 13,
    color: "#68cc3e"
  }, {
    value: 27,
    color: "#ff8e52"
  }, {
    value: 40,
    color: "#ff1a1a"
  }];
  const flag2 = Array.isArray(value.thresholds) && value.thresholds.some(element => Number.isFinite(Number(element?.value)));
  const chosen = value.thresholdMode === "auto" || !flag2 && value.thresholdMode !== "manual" ? "auto" : "manual";
  lineChartThresholdMode.value = chosen;
  const chosen2 = flag2 ? value.thresholds : list;
  lineChartThresholdFields.forEach((element, index) => {
    element.value.value = roundField(Number(chosen2[index]?.value ?? list[index].value));
    element.color.value = chosen2[index]?.color || list[index].color;
    element.value.disabled = chosen === "auto";
    element.color.disabled = chosen === "auto";
  });
  lineChartLeft.value = roundField(clampNumber((Number(flag.x || 0) + number / 2) / numeric * 100, 0, 100));
  lineChartTop.value = roundField(clampNumber((Number(flag.y || 0) + number2 / 2) / canvasHeight * 100, 0, 100));
  lineChartWidth.value = roundField(clampNumber(number / numeric * 100, 0.1, 100));
  lineChartHeight.value = roundField(clampNumber(number2 / canvasHeight * 100, 0.1, 100));
  lineChartScale.value = roundField(clampNumber(Number(component.style?.scale || 1) * 100, 1, 500));
  lineChartRotation.value = roundField(clampNumber(Number(flag.rotation || 0), -360, 360));
  const isMultiSelect = selectedComponentIds.size > 1;
  lineChartWidth.disabled = isMultiSelect;
  lineChartHeight.disabled = isMultiSelect;
  lineChartScale.disabled = false;
  lineChartRotation.disabled = false;
  const length = collectComponentsByType(currentProject.document.sharedComponents, "line-chart").length;
  const length2 = collectList(component).length;
  lineChartApplyStyle.disabled = length < 2 || !length2;
  lineChartApplyCount.textContent = length2 + " 项修改";
  lineChartApplyStyle.textContent = "一键应用到同类型控件";
  syncComponentActionControls(component, lineChartActionControls);
}
function syncPanelFrameInspector(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(flag.width || 100);
  const number2 = Number(flag.height || 100);
  panelFrameType.value = "底图框";
  panelFrameLabel.value = value.label || "";
  setInspectorToggle(panelFrameMainVisible, value.mainTextVisible !== false);
  panelFrameMainText.value = value.mainText || "";
  panelFrameMainColor.value = value.mainColor || "#ffffff";
  panelFrameMainSize.value = roundField(clampNumber(Number(value.mainSize ?? 30), 8, 500));
  panelFrameMainWeight.value = roundField(clampNumber(Number(value.mainWeight ?? 0), 0, 3));
  panelFrameMainOpacity.value = roundField(clampNumber(Number(value.mainOpacity ?? 0.72) * 100, 0, 100));
  panelFrameMainSpacing.value = roundField(clampNumber(Number(value.mainSpacing ?? 2), -20, 100));
  const number3 = Number(value.textLeft ?? 5.2);
  const number4 = Number(value.textTop ?? 28);
  panelFrameMainLeft.value = roundField(clampNumber(Number(value.mainTextLeft ?? number3), -100, 200));
  panelFrameMainTop.value = roundField(clampNumber(Number(value.mainTextTop ?? number4 - Number(value.lineGap ?? 24) / number2 * 100), -100, 200));
  setInspectorToggle(panelFrameSecondaryVisible, value.secondaryTextVisible !== false);
  panelFrameSecondaryText.value = value.secondaryText || "";
  panelFrameSecondaryColor.value = value.secondaryColor || "#ffffff";
  panelFrameSecondarySize.value = roundField(clampNumber(Number(value.secondarySize ?? 15), 6, 500));
  panelFrameSecondaryWeight.value = roundField(clampNumber(Number(value.secondaryWeight ?? 0), 0, 3));
  panelFrameSecondaryOpacity.value = roundField(clampNumber(Number(value.secondaryOpacity ?? 0.36) * 100, 0, 100));
  panelFrameSecondarySpacing.value = roundField(clampNumber(Number(value.secondarySpacing ?? 2.1), -20, 100));
  panelFrameSecondaryLeft.value = roundField(clampNumber(Number(value.secondaryTextLeft ?? number3), -100, 200));
  panelFrameSecondaryTop.value = roundField(clampNumber(Number(value.secondaryTextTop ?? number4), -100, 200));
  setInspectorToggle(panelFrameEdgeVisible, value.edgeVisible !== false);
  panelFrameEdgeColor.value = value.edgeColor || "#d4d4d4";
  panelFrameEdgeWidth.value = roundField(clampNumber(Number(value.edgeWidth ?? 0.9), 0, 20));
  panelFrameEdgeOpacity.value = roundField(clampNumber(Number(value.edgeOpacity ?? 1) * 100, 0, 100));
  panelFrameRadius.value = roundField(clampNumber(Number(value.radius ?? 0.195) * 100, 0, 50));
  panelFrameEdgeAngle.value = roundField(clampNumber(Number(value.edgeAngle ?? 45), 0, 360));
  setInspectorToggle(panelFrameGlowVisible, value.glowVisible !== false);
  panelFrameGlowColor.value = value.glowColor || "#ffffff";
  panelFrameGlowStrength.value = roundField(clampNumber(Number(value.glowStrength ?? 0.5) * 100, 0, 500));
  panelFrameGlowSize.value = roundField(clampNumber(Number(value.glowSize ?? 1.5) * 100, 0, 300));
  panelFrameGlowAngle.value = roundField(clampNumber(Number(value.glowAngle ?? 242), 0, 360));
  panelFrameLeft.value = roundField(clampNumber((Number(flag.x || 0) + number / 2) / numeric * 100, 0, 100));
  panelFrameTop.value = roundField(clampNumber((Number(flag.y || 0) + number2 / 2) / canvasHeight * 100, 0, 100));
  panelFrameWidth.value = roundField(clampNumber(number / numeric * 100, 0.1, 100));
  panelFrameHeight.value = roundField(clampNumber(number2 / canvasHeight * 100, 0.1, 100));
  panelFrameScale.value = roundField(clampNumber(Number(component.style?.scale || 1) * 100, 1, 500));
  panelFrameRotation.value = roundField(clampNumber(Number(flag.rotation || 0), -360, 360));
  const isMultiSelect = selectedComponentIds.size > 1;
  panelFrameWidth.disabled = isMultiSelect;
  panelFrameHeight.disabled = isMultiSelect;
  panelFrameScale.disabled = false;
  panelFrameRotation.disabled = false;
  const chosen = findComponent(currentProject.document, component.id)?.scope === "page" ? findComponentsByType("panel-frame").length : collectComponentsByType(currentProject.document.sharedComponents, "panel-frame").length;
  const length = collectList6(component).length;
  panelFrameApplyStyle.disabled = chosen < 2 || !length;
  panelFrameApplyCount.textContent = length + " 项修改";
  panelFrameApplyStyle.textContent = "一键应用到同类型控件";
}
function syncNavigationInspector(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const flag2 = currentProject.document.pages || [];
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(flag.width || 100);
  const number2 = Number(flag.height || 100);
  navigationType.value = "导航按钮";
  navigationLabel.value = value.label || "";
  pickerValueEl2(component);
  const text2 = imagePreviewStateById.get(component.id) || "auto";
  for (const element of navigationPreviewState.querySelectorAll("[data-navigation-preview]")) {
    element.classList.toggle("active", element.dataset.navigationPreview === text2);
  }
  navigationMainText.value = value.mainText || "页面导航";
  navigationSecondaryText.value = value.secondaryText || "NAVIGATION";
  setInspectorToggle(navigationMainVisible, value.mainTextVisible !== false);
  setInspectorToggle(navigationSecondaryVisible, value.secondaryTextVisible !== false);
  setInspectorToggle(navigationIconVisible, value.iconVisible !== false);
  setInspectorToggle(navigationFrameVisible, value.frameVisible !== false);
  setInspectorToggle(navigationGlowVisible, value.glowVisible !== false);
  syncNavigationIconButton(value.icon || "");
  navigationMainColor.value = value.mainColor || "#e9edf0";
  navigationSecondaryColor.value = value.secondaryColor || "#e9edf0";
  navigationMainSize.value = roundField(Number(value.mainSize ?? 30));
  navigationSecondarySize.value = roundField(Number(value.secondarySize ?? 11));
  navigationMainWeight.value = roundField(Number(value.mainWeight ?? 0));
  navigationSecondaryWeight.value = roundField(Number(value.secondaryWeight ?? 0));
  navigationMainSpacing.value = roundField(Number(value.mainSpacing ?? 8));
  navigationSecondarySpacing.value = roundField(Number(value.secondarySpacing ?? 3));
  const number3 = Number(value.textLeft ?? 27.5);
  const number4 = Number(value.textTop ?? 81.5);
  navigationMainTextLeft.value = roundField(Number(value.mainTextLeft ?? number3));
  navigationMainTextTop.value = roundField(Number(value.mainTextTop ?? number4 - 1800 / 64.36));
  navigationSecondaryTextLeft.value = roundField(Number(value.secondaryTextLeft ?? number3));
  navigationSecondaryTextTop.value = roundField(Number(value.secondaryTextTop ?? number4));
  navigationTextIdleOpacity.value = roundField(clampNumber(Number(value.textIdleOpacity ?? value.idleOpacity ?? 0.3) * 100, 0, 100));
  navigationTextActiveOpacity.value = roundField(clampNumber(Number(value.textActiveOpacity ?? value.activeOpacity ?? 0.96) * 100, 0, 100));
  navigationIconColor.value = value.iconColor || "#e9edf0";
  navigationIconSize.value = roundField(Number(value.iconSize ?? 50));
  navigationIconLeft.value = roundField(Number(value.iconLeft ?? 14));
  navigationIconTop.value = roundField(Number(value.iconTop ?? 50));
  navigationIconIdleOpacity.value = roundField(clampNumber(Number(value.iconIdleOpacity ?? value.idleOpacity ?? 0.3) * 100, 0, 100));
  navigationIconActiveOpacity.value = roundField(clampNumber(Number(value.iconActiveOpacity ?? value.activeOpacity ?? 0.96) * 100, 0, 100));
  navigationFrameColor.value = value.frameColor || "#d9e0e6";
  navigationFrameWidth.value = roundField(Number(value.frameWidth ?? 2));
  navigationFrameIdleOpacity.value = roundField(clampNumber(Number(value.frameIdleOpacity ?? 0.48) * 100, 0, 100));
  navigationFrameActiveOpacity.value = roundField(clampNumber(Number(value.frameActiveOpacity ?? 0.98) * 100, 0, 100));
  navigationFrameAngle.value = roundField(clampNumber(Number(value.frameAngle ?? 45), 0, 360));
  navigationGlowColor.value = value.glowColor || "#f2f6fa";
  navigationGlowAngle.value = roundField(clampNumber(Number(value.glowAngle ?? 45), 0, 360));
  navigationGlowIdleStrength.value = roundField(clampNumber(Number(value.glowIdleStrength ?? 0.5) * 100, 0, 500));
  navigationGlowIdleSize.value = roundField(clampNumber(Number(value.glowIdleSize ?? 1.5) * 100, 0, 300));
  navigationGlowActiveStrength.value = roundField(clampNumber(Number(value.glowActiveStrength ?? 2.2) * 100, 0, 500));
  navigationGlowActiveSize.value = roundField(clampNumber(Number(value.glowActiveSize ?? 3) * 100, 0, 300));
  navigationRadius.value = roundField(clampNumber(Number(value.radius ?? 0.5) * 100, 0, 50));
  navigationLeft.value = roundField(clampNumber((Number(flag.x || 0) + number / 2) / numeric * 100, 0, 100));
  navigationTop.value = roundField(clampNumber((Number(flag.y || 0) + number2 / 2) / canvasHeight * 100, 0, 100));
  navigationWidth.value = roundField(clampNumber(number / numeric * 100, 0.1, 100));
  navigationHeight.value = roundField(clampNumber(number2 / canvasHeight * 100, 0.1, 100));
  navigationScale.value = roundField(clampNumber(Number(component.style?.scale || 1) * 100, 1, 500));
  navigationRotation.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  navigationWidth.disabled = isMultiSelect;
  navigationHeight.disabled = isMultiSelect;
  navigationScale.disabled = false;
  navigationRotation.disabled = false;
  const length = collectComponentsByType(currentProject.document.sharedComponents, "navigation-button").length;
  const length2 = collectList7(component).length;
  navigationApplyStyle.disabled = length < 2 || !length2;
  navigationApplyCount.textContent = length2 + " 项修改";
  navigationApplyStyle.textContent = "一键应用到同类型控件";
  syncComponentActionControls(component, navigationActionControls);
}
function syncVacuumMapInspector(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(flag.width || 100);
  const number2 = Number(flag.height || 100);
  titleButtonLabel.value = value.label || "";
  pickerValueEl2(component);
  setInspectorToggle(titleButtonMainVisible, value.mainTextVisible !== false);
  setInspectorToggle(titleButtonSecondaryVisible, value.secondaryTextVisible !== false);
  setInspectorToggle(titleButtonFrameVisible, value.frameVisible !== false);
  setInspectorToggle(titleButtonIconVisible, value.iconVisible !== false);
  titleButtonMainText.value = value.mainText || "";
  const temp = String(value.secondaryText || "").split(/\r?\n/).slice(0, 2);
  titleButtonSecondaryLine1.value = temp[0] || "";
  titleButtonSecondaryLine2.value = temp[1] || "";
  titleButtonMainColor.value = value.mainColor || "#b9bbc0";
  titleButtonSecondaryColor.value = value.secondaryColor || "#70737b";
  titleButtonMainSize.value = roundField(Number(value.mainSize ?? 34));
  titleButtonSecondarySize.value = roundField(Number(value.secondarySize ?? 12));
  titleButtonMainWeight.value = roundField(normalizedFontWeight(value.mainWeight, 0.3));
  titleButtonSecondaryWeight.value = roundField(normalizedFontWeight(value.secondaryWeight, 0.2));
  titleButtonMainSpacing.value = roundField(Number(value.mainSpacing ?? 1));
  titleButtonSecondarySpacing.value = roundField(Number(value.secondarySpacing ?? 2));
  titleButtonSecondaryLineGap.value = roundField(Number(value.secondaryLineGap ?? 2));
  titleButtonMainLeft.value = roundField(Number(value.mainTextLeft ?? 5.5));
  titleButtonMainTop.value = roundField(Number(value.mainTextTop ?? 45));
  titleButtonSecondaryLeft.value = roundField(Number(value.secondaryTextLeft ?? 54));
  titleButtonSecondaryTop.value = roundField(Number(value.secondaryTextTop ?? 43));
  syncTitleButtonIcon(value.icon || "");
  titleButtonIconColor.value = value.iconColor || "#b9bbc0";
  titleButtonIconSize.value = roundField(Number(value.iconSize ?? 30));
  titleButtonIconLeft.value = roundField(Number(value.iconLeft ?? 50));
  titleButtonIconTop.value = roundField(Number(value.iconTop ?? 45));
  titleButtonFrameColor.value = value.frameColor || "#60636a";
  titleButtonFrameWidth.value = roundField(Number(value.frameWidth ?? 1.5));
  titleButtonFrameSize.value = roundField(Number(value.frameSize ?? 100));
  titleButtonFrameSpacing.value = roundField(Number(value.frameSpacing ?? 100));
  titleButtonFrameOffsetX.value = roundField(Number(value.frameOffsetX ?? 0));
  titleButtonFrameOffsetY.value = roundField(Number(value.frameOffsetY ?? 0));
  titleButtonMarkerColor.value = value.markerColor || "#f2a20d";
  titleButtonMarkerSize.value = roundField(Number(value.markerSize ?? 10));
  titleButtonMarkerLeft.value = roundField(Number(value.markerLeft ?? 1.8));
  titleButtonMarkerTop.value = roundField(Number(value.markerTop ?? 84));
  const flag2 = value.markerVisible !== false;
  setInspectorToggle(titleButtonMarkerVisible, flag2);
  titleButtonLeft.value = roundField(clampNumber((Number(flag.x || 0) + number / 2) / numeric * 100, 0, 100));
  titleButtonTop.value = roundField(clampNumber((Number(flag.y || 0) + number2 / 2) / canvasHeight * 100, 0, 100));
  titleButtonWidth.value = roundField(number / numeric * 100);
  titleButtonHeight.value = roundField(number2 / canvasHeight * 100);
  titleButtonScale.value = roundField(Number(component.style?.scale || 1) * 100);
  titleButtonRotation.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  for (const temp2 of [titleButtonWidth, titleButtonHeight]) {
    temp2.disabled = isMultiSelect;
  }
  titleButtonRotation.disabled = false;
  titleButtonScale.disabled = false;
  const length = findComponentsByType("title-button").length;
  const length2 = collectList2(component).length;
  titleButtonApplyStyle.disabled = length < 2 || !length2;
  titleButtonApplyCount.textContent = length2 + " 项修改";
  titleButtonApplyStyle.textContent = "一键应用到同类型控件";
  syncComponentActionControls(component, titleButtonActionControls);
}
function syncCameraInspector(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(flag.width || 100);
  const number2 = Number(flag.height || 100);
  if (lightStatisticsEditingComponentId && lightStatisticsEditingComponentId !== component.id) {
    resetLightStatisticsEntityPicker();
  }
  lightStatisticsLabel.value = value.label || "";
  lightStatisticsTitle.value = value.title || "数量";
  pickerValueEl2(component);
  setInspectorToggle(lightStatisticsIconVisible, value.iconVisible !== false);
  setInspectorToggle(lightStatisticsTitleVisible, value.titleVisible !== false);
  setInspectorToggle(lightStatisticsCountVisible, value.countVisible !== false);
  syncLightStatisticsIcon(value.icon ?? "mdi:lightbulb-group-outline");
  lightStatisticsIconColor.value = value.iconColor || "#8b9298";
  lightStatisticsIconActiveColor.value = value.iconActiveColor || "#f2a20d";
  lightStatisticsIconSize.value = roundField(Number(value.iconSize ?? 42));
  lightStatisticsTitleColor.value = value.titleColor || "#b9bbc0";
  lightStatisticsTitleSize.value = roundField(Number(value.titleSize ?? 32));
  lightStatisticsTitleWeight.value = roundField(normalizedFontWeight(value.titleWeight, 0.3));
  lightStatisticsTitleSpacing.value = roundField(Number(value.titleSpacing ?? 1.2));
  lightStatisticsCountColor.value = value.countColor || "#b9bbc0";
  lightStatisticsCountActiveColor.value = value.countActiveColor || "#f2a20d";
  lightStatisticsCountSize.value = roundField(Number(value.countSize ?? 34));
  lightStatisticsCountWeight.value = roundField(normalizedFontWeight(value.countWeight, 0.35));
  lightStatisticsCountSpacing.value = roundField(Number(value.countSpacing ?? 0));
  lightStatisticsIconGap.value = roundField(Number(value.iconGap ?? 4.5));
  lightStatisticsCountGap.value = roundField(Number(value.countGap ?? 4.5));
  lightStatisticsLeft.value = roundField(clampNumber((Number(flag.x || 0) + number / 2) / numeric * 100, 0, 100));
  lightStatisticsTop.value = roundField(clampNumber((Number(flag.y || 0) + number2 / 2) / canvasHeight * 100, 0, 100));
  lightStatisticsWidth.value = roundField(number / numeric * 100);
  lightStatisticsHeight.value = roundField(number2 / canvasHeight * 100);
  lightStatisticsScale.value = roundField(Number(component.style?.scale || 1) * 100);
  lightStatisticsRotation.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  lightStatisticsWidth.disabled = isMultiSelect;
  lightStatisticsHeight.disabled = isMultiSelect;
  lightStatisticsScale.disabled = false;
  lightStatisticsRotation.disabled = false;
  setPickerButtonLabel(lightStatisticsEntityButton, lightStatisticsReplaceIndex >= 0 ? "选择替换实体" : "选择一个实体");
  syncLightStatisticsEntityButton(component);
  if (!lightStatisticsEntityMenu.hidden) {
    filterLightStatisticsEntities(lightStatisticsEntitySearch.value);
  }
  syncComponentActionControls(component, lightStatisticsActionControls);
}
function syncPresenceInspector(component) {
  const value = component.properties || {};
  const flag = component.type === "presence-sensor";
  const chosen = ["presence", "door-window", "water-leak", "smoke", "natural-gas"].includes(value.sensorKind) ? value.sensorKind : "presence";
  const temp = {
    presence: "人体/人在传感器",
    "door-window": "门窗传感器",
    "water-leak": "水浸传感器",
    smoke: "烟雾传感器",
    "natural-gas": "天然气传感器"
  }[chosen];
  const flag2 = component.type === "device-button" || flag;
  const flag3 = component.position || {};
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(flag3.width || 100);
  const number2 = Number(flag3.height || 100);
  iconButtonType.value = flag ? temp : flag2 ? "设备按钮" : "图标按钮";
  iconButtonTypeLabel.classList.remove("inspector-full-row");
  presenceSensorKindLabel.hidden = !flag;
  presenceSensorKindLabel.classList.toggle("inspector-full-row", flag);
  presenceSensorKind.value = chosen;
  syncCustomSelect(presenceSensorKind);
  iconButtonMainHeading.textContent = flag2 ? "标题" : "中文标题";
  iconButtonSecondaryHeading.textContent = flag2 ? "状态" : "英文标题";
  iconButtonMainContentLabel.textContent = flag2 ? "自定义标题" : "内容";
  iconButtonSecondaryContentLabel.textContent = flag2 ? "自定义状态" : "内容";
  iconButtonMainText.placeholder = flag2 ? "留空跟随实体名称" : "";
  iconButtonSecondaryText.placeholder = flag2 ? "留空跟随实体状态" : "";
  iconButtonPreviewControl.hidden = flag2;
  iconButtonActionSection.hidden = flag;
  iconButtonPreviewDetails.hidden = true;
  presenceMotionSection.hidden = !flag || chosen !== "presence";
  doorWindowPerspectiveSection.hidden = !flag || chosen !== "door-window";
  const temp2 = presencePreviewExpandedIds.has(component.id);
  doorWindowPerspectiveEditBtn.classList.toggle("active", temp2);
  doorWindowPerspectiveEditBtn.setAttribute("aria-pressed", String(temp2));
  doorWindowPerspectiveEditBtn.textContent = "编辑透视";
  doorWindowPerspectiveSave.disabled = !temp2;
  iconButtonMainHeading.closest(".inspector-section").hidden = flag;
  const ancestorEl = iconButtonIconButton.closest(".inspector-section");
  ancestorEl.querySelector("h3").textContent = flag ? "显示颜色" : "图标";
  const ancestorEl2 = iconButtonIconButton.closest(".inspector-picker");
  ancestorEl2.hidden = flag;
  ancestorEl2.style.display = flag ? "none" : "";
  iconButtonFillSection.hidden = flag2;
  iconButtonFrameSection.hidden = flag2;
  iconButtonSoftLightSection.hidden = flag2;
  iconButtonGlowSection.hidden = flag2;
  iconButtonIconColorLabel.hidden = flag;
  iconButtonIconColorLabel.firstChild.textContent = flag2 ? "关闭颜色" : "颜色";
  deviceButtonIconVisible.hidden = !flag2 || flag;
  deviceButtonMainVisible.hidden = !flag2;
  deviceButtonSecondaryVisible.hidden = !flag2;
  deviceButtonIconOnColorLabel.hidden = !flag2;
  deviceButtonIconOnColorLabel.firstChild.textContent = flag ? {
    presence: "有人颜色",
    "door-window": "打开颜色",
    "water-leak": "水浸颜色",
    smoke: "烟雾颜色",
    "natural-gas": "天然气颜色"
  }[chosen] : "开启颜色";
  deviceButtonBadgeColorLabel.hidden = !flag2 || flag;
  deviceButtonBadgeOpacityLabel.hidden = !flag2 || flag;
  iconButtonIconSizeLabel.hidden = flag2;
  deviceButtonSymbolSizeLabel.hidden = !flag2 || flag;
  deviceButtonBadgeSizeLabel.hidden = !flag2 || flag;
  deviceButtonStatePrecisionLabel.hidden = !flag2 || flag;
  iconButtonIconLeft.closest("label").hidden = flag;
  iconButtonIconTop.closest("label").hidden = flag;
  iconButtonIconOffOpacityLabel.hidden = flag2;
  iconButtonIconOnOpacityLabel.hidden = flag2;
  iconButtonMainOffOpacityLabel.hidden = flag2;
  iconButtonMainOnOpacityLabel.hidden = flag2;
  iconButtonSecondaryOffOpacityLabel.hidden = flag2;
  iconButtonSecondaryOnOpacityLabel.hidden = flag2;
  iconButtonLabel.value = value.label || "";
  pickerValueEl2(component);
  syncIconButtonIcon(value.icon || "");
  iconButtonIconColor.value = value.iconColor || (flag ? value.clearColor : "") || value.iconOffColor || value.iconOnColor || "#d7d8da";
  setInspectorToggle(deviceButtonIconVisible, value.iconVisible !== false);
  deviceButtonIconOnColor.value = chosen === "water-leak" ? value.waterLeakColor || "#42c8ff" : chosen === "smoke" ? value.smokeColor || "#ffffff" : chosen === "natural-gas" ? value.naturalGasColor || "#ffb347" : value.iconOnColor || (flag ? value.occupiedColor : "") || "#379bff";
  deviceButtonBadgeColor.value = value.badgeColor || "#5b5e66";
  deviceButtonBadgeOpacity.value = roundField(Number(value.badgeOpacity ?? 0.58) * 100);
  deviceButtonBadgeSize.value = roundField(Number(value.badgeSize ?? value.iconSize ?? 28));
  deviceButtonSymbolSize.value = roundField(Number(value.symbolSize ?? Number(value.iconSize ?? 28) * 0.5));
  deviceButtonStatePrecision.value = ["0", "1", "2", "3", "4"].includes(String(value.statePrecision)) ? String(value.statePrecision) : "auto";
  presenceHaloScaleX.value = roundField(Number(value.haloScaleX ?? value.haloScale ?? 1) * 100);
  presenceHaloScaleY.value = roundField(Number(value.haloScaleY ?? value.haloScale ?? 1) * 100);
  presenceHaloRotation.value = roundField(Number(value.haloRotation ?? 0));
  presenceHaloOpacity.value = roundField(Number(value.haloOpacity ?? 1) * 100);
  presencePersonScale.value = roundField(Number(value.personScale ?? 1) * 100);
  presencePersonRotation.value = roundField(Number(value.personRotation ?? 0));
  presencePersonOpacity.value = roundField(Number(value.personOpacity ?? 1) * 100);
  presenceOrbitDuration.value = roundField(Number(value.orbitDuration ?? 8));
  setInspectorToggle(presenceHaloVisible, value.haloVisible !== false);
  setInspectorToggle(presencePersonVisible, value.personVisible !== false);
  iconButtonIconSize.value = roundField(Number(value.iconSize ?? 42));
  iconButtonIconOffOpacity.value = roundField(Number(value.iconOffOpacity ?? 1) * 100);
  iconButtonIconOnOpacity.value = roundField(Number(value.iconOnOpacity ?? 1) * 100);
  iconButtonIconLeft.value = roundField(Number(value.iconLeft ?? 50));
  iconButtonIconTop.value = roundField(Number(value.iconTop ?? 34));
  iconButtonMainText.value = value.mainText || "";
  setInspectorToggle(deviceButtonMainVisible, value.mainTextVisible !== false);
  iconButtonSecondaryText.value = value.secondaryText || "";
  setInspectorToggle(deviceButtonSecondaryVisible, value.secondaryTextVisible !== false);
  iconButtonMainColor.value = value.mainColor || value.mainOffColor || value.mainOnColor || "#c7c8cb";
  iconButtonSecondaryColor.value = value.secondaryColor || value.secondaryOffColor || value.secondaryOnColor || "#75777d";
  iconButtonMainOffOpacity.value = roundField(Number(value.mainOffOpacity ?? 1) * 100);
  iconButtonMainOnOpacity.value = roundField(Number(value.mainOnOpacity ?? 1) * 100);
  iconButtonSecondaryOffOpacity.value = roundField(Number(value.secondaryOffOpacity ?? 1) * 100);
  iconButtonSecondaryOnOpacity.value = roundField(Number(value.secondaryOnOpacity ?? 1) * 100);
  iconButtonMainSize.value = roundField(Number(value.mainSize ?? 25));
  iconButtonSecondarySize.value = roundField(Number(value.secondarySize ?? 10));
  iconButtonMainWeight.value = roundField(normalizedFontWeight(value.mainWeight, 0.25));
  iconButtonSecondaryWeight.value = roundField(normalizedFontWeight(value.secondaryWeight, 0.18));
  iconButtonMainSpacing.value = roundField(Number(value.mainSpacing ?? 1));
  iconButtonSecondarySpacing.value = roundField(Number(value.secondarySpacing ?? 0.7));
  iconButtonMainLeft.value = roundField(Number(value.mainTextLeft ?? 9));
  iconButtonMainTop.value = roundField(Number(value.mainTextTop ?? 78));
  iconButtonSecondaryLeft.value = roundField(Number(value.secondaryTextLeft ?? 9));
  iconButtonSecondaryTop.value = roundField(Number(value.secondaryTextTop ?? 91));
  setInspectorToggle(iconButtonOnFillVisible, value.onFillVisible !== false);
  iconButtonOnFillColor.value = value.onFillColor || "#dfb64f";
  iconButtonOnFillStrength.value = roundField(Number(value.onFillStrength ?? 1) * 100);
  iconButtonOnFillFadeDuration.value = roundField(Number(value.onFillFadeDuration ?? 0.3));
  setInspectorToggle(iconButtonFrameVisible, value.frameVisible !== false);
  iconButtonFrameWidth.value = roundField(Number(value.frameWidth ?? 1));
  iconButtonFrameAngle.value = roundField(Number(value.frameAngle ?? 45));
  iconButtonFrameOffOpacity.value = roundField(Number(value.frameOffOpacity ?? 0.8) * 100);
  iconButtonFrameOnOpacity.value = roundField(Number(value.frameOnOpacity ?? 1) * 100);
  iconButtonCutCorner.value = roundField(Number(value.cutCorner ?? 20));
  setInspectorToggle(iconButtonSoftLightVisible, value.softLightVisible !== false);
  iconButtonSoftLightColor.value = value.softLightColor || "#ffffff";
  iconButtonSoftLightStrength.value = roundField(Number(value.softLightStrength ?? 1) * 100);
  iconButtonSoftLightSize.value = roundField(Number(value.softLightSize ?? 1) * 100);
  iconButtonSoftLightAngle.value = roundField(Number(value.softLightAngle ?? 45));
  setInspectorToggle(iconButtonGlowVisible, value.glowVisible !== false);
  iconButtonGlowColor.value = value.glowColor || "#ffffff";
  iconButtonGlowStrength.value = roundField(Number(value.glowStrength ?? 1) * 100);
  iconButtonGlowSize.value = roundField(Number(value.glowSize ?? 1) * 100);
  iconButtonGlowAngle.value = roundField(Number(value.glowAngle ?? 220));
  iconButtonLeft.value = roundField(clampNumber((Number(flag3.x || 0) + number / 2) / numeric * 100, 0, 100));
  iconButtonTop.value = roundField(clampNumber((Number(flag3.y || 0) + number2 / 2) / canvasHeight * 100, 0, 100));
  iconButtonWidth.value = roundField(number / numeric * 100);
  iconButtonHeight.value = roundField(number2 / canvasHeight * 100);
  iconButtonScale.value = roundField(Number(component.style?.scale || 1) * 100);
  iconButtonRotation.value = roundField(Number(flag3.rotation || 0));
  if (flag && !presencePreviewStateById.has(component.id)) {
    presencePreviewStateById.set(component.id, "on");
    editorRenderer?.setComponentPreviewState(component.id, "on");
  }
  const text2 = presencePreviewStateById.get(component.id) || "auto";
  for (const element of iconButtonPreviewState.querySelectorAll("[data-icon-button-preview]")) {
    const flag5 = element.dataset.iconButtonPreview === text2;
    element.classList.toggle("active", flag5);
    element.setAttribute("aria-pressed", String(flag5));
  }
  const isMultiSelect = selectedComponentIds.size > 1;
  for (const temp3 of [iconButtonWidth, iconButtonHeight]) {
    temp3.disabled = isMultiSelect;
  }
  iconButtonRotation.disabled = false;
  iconButtonScale.disabled = false;
  const chosen2 = component.type === "presence-sensor" ? findComponentsByType(component.type).filter(({
    component: item
  }) => presenceSensorKind2(item) === chosen).length : findComponentsByType(component.type).length;
  const length = syncIconButtonIcon5(component).length;
  iconButtonApplyStyle.disabled = chosen2 < 2 || !length;
  iconButtonApplyCount.textContent = length + " 项修改";
  iconButtonApplyStyle.textContent = "一键应用到同类型控件";
  syncComponentActionControls(component, iconButtonActionControls);
}
function syncAirConditionerInspector(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(flag.width || 100);
  const number2 = Number(flag.height || 100);
  cameraLabel.value = value.label || "";
  pickerValueEl2(component);
  setInspectorToggle(cameraMediaVisible, value.mediaVisible !== false);
  const chosen = value.displayMode === "snapshot" ? "snapshot" : "live";
  for (const element of cameraDisplayModeOptions.querySelectorAll("[data-camera-display-mode]")) {
    const flag2 = element.dataset.cameraDisplayMode === chosen;
    element.classList.toggle("active", flag2);
    element.setAttribute("aria-pressed", String(flag2));
  }
  const number3 = Number(value.refreshInterval);
  const chosen2 = Number.isFinite(number3) ? Math.max(6, Math.round(number3)) : 10;
  cameraRefreshInterval.value = String(chosen2);
  cameraRefreshIntervalField.hidden = chosen !== "snapshot";
  cameraRefreshInterval.disabled = chosen !== "snapshot";
  const chosen3 = value.fit === "contain" ? "contain" : "fill";
  for (const element of cameraFitOptions.querySelectorAll("[data-camera-fit]")) {
    const flag2 = element.dataset.cameraFit === chosen3;
    element.classList.toggle("active", flag2);
    element.setAttribute("aria-pressed", String(flag2));
  }
  setInspectorToggle(cameraFrameVisible, value.frameVisible !== false);
  cameraFrameColor.value = value.frameColor || "#d4d4d4";
  cameraFrameWidth.value = roundField(Number(value.frameWidth ?? 1));
  const number4 = Number(value.radius ?? 0.04);
  cameraRadius.value = roundField(clampNumber(number4 > 0.5 ? number4 : number4 * 100, 0, 50));
  cameraFrameAngle.value = roundField(Number(value.frameAngle ?? 45));
  cameraFrameOpacity.value = roundField(Number(value.frameOpacity ?? 0.9) * 100);
  cameraLeft.value = roundField(clampNumber((Number(flag.x || 0) + number / 2) / numeric * 100, 0, 100));
  cameraTop.value = roundField(clampNumber((Number(flag.y || 0) + number2 / 2) / canvasHeight * 100, 0, 100));
  cameraWidth.value = roundField(number / numeric * 100);
  cameraHeight.value = roundField(number2 / canvasHeight * 100);
  cameraScale.value = roundField(Number(component.style?.scale || 1) * 100);
  cameraRotation.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  cameraWidth.disabled = isMultiSelect;
  cameraHeight.disabled = isMultiSelect;
  cameraRotation.disabled = false;
  cameraScale.disabled = false;
  const length = findComponentsByType("camera").length;
  const length2 = collectList5(component).length;
  cameraApplyStyle.disabled = length < 2 || !length2;
  cameraApplyCount.textContent = length2 + " 项修改";
  cameraApplyStyle.textContent = "一键应用到同类型控件";
  const chosen4 = Object.prototype.hasOwnProperty.call(component.actions || {}, "tap") ? component : {
    ...component,
    actions: {
      tap: {
        type: "more-info",
        data: {
          popupSource: "current"
        }
      },
      ...(component.actions || {})
    }
  };
  syncComponentActionControls(chosen4, cameraActionControls);
}
function syncIconButtonInspector(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(flag.width || 100);
  const number2 = Number(flag.height || 100);
  airConditionerLabel.value = value.label || "";
  const chosen = ["air-conditioner", "bath-heater"].includes(value.deviceType) ? value.deviceType : "auto";
  for (const element of airConditionerDeviceType.querySelectorAll("[data-air-conditioner-device-type]")) {
    const flag4 = element.dataset.airConditionerDeviceType === chosen;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  airConditionerPreviewDetails.textContent = chosen === "bath-heater" ? "预览浴霸详情" : "预览空调 / 浴霸详情";
  pickerValueEl2(component);
  airConditionerPreviewDetails.disabled = !component.bindings?.entity?.entityId;
  airConditionerIconOffColor.value = value.iconOffColor || "#9aa5ad";
  airConditionerIconOnColor.value = value.iconOnColor || "#73c8ff";
  airConditionerBadgeColor.value = value.badgeColor || "#5b5e66";
  airConditionerBadgeOpacity.value = roundField(Number(value.badgeOpacity ?? 0.58) * 100);
  airConditionerSymbolSize.value = roundField(Number(value.symbolSize ?? 14));
  airConditionerBadgeSize.value = roundField(Number(value.badgeSize ?? 28));
  airConditionerIconLeft.value = roundField(Number(value.iconLeft ?? 20));
  airConditionerIconTop.value = roundField(Number(value.iconTop ?? 50));
  setInspectorToggle(airConditionerIconVisible, value.iconVisible !== false);
  airConditionerMainText.value = value.mainText || "";
  airConditionerMainColor.value = value.mainColor || "#c7c8cb";
  airConditionerMainSize.value = roundField(Number(value.mainSize ?? 21));
  airConditionerMainWeight.value = roundField(normalizedFontWeight(value.mainWeight, 0.24));
  airConditionerMainSpacing.value = roundField(Number(value.mainSpacing ?? 0.5));
  airConditionerMainLeft.value = roundField(Number(value.mainTextLeft ?? 39));
  airConditionerMainTop.value = roundField(Number(value.mainTextTop ?? 40));
  setInspectorToggle(airConditionerMainVisible, value.mainTextVisible !== false);
  airConditionerSecondaryText.value = value.secondaryText || "";
  airConditionerSecondaryColor.value = value.secondaryColor || "#75777d";
  airConditionerSecondarySize.value = roundField(Number(value.secondarySize ?? 12));
  airConditionerSecondaryWeight.value = roundField(normalizedFontWeight(value.secondaryWeight, 0.12));
  airConditionerSecondarySpacing.value = roundField(Number(value.secondarySpacing ?? 0.3));
  airConditionerSecondaryLeft.value = roundField(Number(value.secondaryTextLeft ?? 39));
  airConditionerSecondaryTop.value = roundField(Number(value.secondaryTextTop ?? 67));
  setInspectorToggle(airConditionerSecondaryVisible, value.secondaryTextVisible !== false);
  setInspectorToggle(airConditionerAirflowVisible, value.airflowVisible !== false);
  const chosen2 = value.airflowMotion === "static" ? "static" : "dynamic";
  for (const element of airConditionerAirflowMotion.querySelectorAll("[data-airflow-motion]")) {
    const flag4 = element.dataset.airflowMotion === chosen2;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  airConditionerAirflowCoolColor.value = value.airflowCoolColor || "#73c8ff";
  airConditionerAirflowHeatColor.value = value.airflowHeatColor || "#ff8a65";
  airConditionerAirflowOtherColor.value = value.airflowOtherColor || "#dce2e6";
  airConditionerAirflowAngle.value = roundField(Number(value.airflowAngle ?? 7));
  airConditionerAirflowCurve.value = roundField(Number(value.airflowCurve ?? 20));
  airConditionerAirflowLength.value = roundField(Number(value.airflowLength ?? 200));
  airConditionerAirflowFade.value = roundField(Number(value.airflowFadePosition ?? 50));
  airConditionerAirflowSpread.value = roundField(Number(value.airflowSpread ?? 100));
  airConditionerAirflowDensity.value = roundField(Number(value.airflowDensity ?? 60));
  airConditionerAirflowIrregularity.value = roundField(Number(value.airflowIrregularity ?? 50));
  airConditionerAirflowThickness.value = roundField(Number(value.airflowThickness ?? 40));
  airConditionerAirflowStrength.value = roundField(Number(value.airflowStrength ?? 200));
  airConditionerAirflowBlur.value = roundField(Number(value.airflowBlur ?? 6));
  airConditionerAirflowSpeed.value = roundField(Number(value.airflowSpeed ?? 1));
  airConditionerAirflowSpeed.disabled = chosen2 === "static";
  const temp = airflowCanvasOffsetBounds(component, currentProject.document.canvas);
  airConditionerAirflowOffsetX.min = String(roundField(temp.minX));
  airConditionerAirflowOffsetX.max = String(roundField(temp.maxX));
  airConditionerAirflowOffsetY.min = String(roundField(temp.minY));
  airConditionerAirflowOffsetY.max = String(roundField(temp.maxY));
  airConditionerAirflowOffsetX.value = roundField(Number(value.airflowOffsetX ?? -75));
  airConditionerAirflowOffsetY.value = roundField(Number(value.airflowOffsetY ?? 34));
  airConditionerAirflowWidth.value = roundField(Number(value.airflowWidth ?? 64));
  airConditionerAirflowHeight.value = roundField(Number(value.airflowHeight ?? 125));
  airConditionerAirflowScale.value = roundField(Number(value.airflowScale ?? 1) * 100);
  airConditionerAirflowRotation.value = roundField(Number(value.airflowRotation ?? -3));
  airConditionerLeft.value = roundField(clampNumber((Number(flag.x || 0) + number / 2) / numeric * 100, 0, 100));
  airConditionerTop.value = roundField(clampNumber((Number(flag.y || 0) + number2 / 2) / canvasHeight * 100, 0, 100));
  airConditionerWidth.value = roundField(number / numeric * 100);
  airConditionerHeight.value = roundField(number2 / canvasHeight * 100);
  airConditionerScale.value = roundField(Number(component.style?.scale || 1) * 100);
  airConditionerRotation.value = roundField(Number(flag.rotation || 0));
  const chosen3 = airConditionerLayerById.get(component.id) === "airflow" ? "airflow" : "button";
  if (!airConditionerPreviewStateById.has(component.id)) {
    const chosen4 = chosen3 === "airflow" ? "on" : "off";
    airConditionerPreviewStateById.set(component.id, chosen4);
    editorRenderer?.setComponentPreviewState(component.id, chosen4);
  }
  const text2 = airConditionerPreviewStateById.get(component.id) || "auto";
  for (const element of airConditionerPreviewState.querySelectorAll("[data-air-conditioner-preview]")) {
    const flag4 = element.dataset.airConditionerPreview === text2;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  editorRenderer?.setComponentSelectionLayer(component.id, chosen3);
  for (const element of airConditionerLayerOptions.querySelectorAll("[data-air-conditioner-layer]")) {
    const flag4 = element.dataset.airConditionerLayer === chosen3;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  const flag3 = chosen3 === "airflow";
  airConditionerButtonSection.hidden = flag3;
  airConditionerTransformSection.hidden = flag3;
  airConditionerActionSection.hidden = flag3;
  airConditionerAirflowSection.hidden = !flag3;
  const isMultiSelect = selectedComponentIds.size > 1;
  for (const temp2 of [airConditionerWidth, airConditionerHeight]) {
    temp2.disabled = isMultiSelect;
  }
  airConditionerRotation.disabled = false;
  airConditionerScale.disabled = false;
  const length = findComponentsByType("air-conditioner").length;
  const length2 = collectList3(component).length;
  airConditionerApplyStyle.disabled = length < 2 || !length2;
  airConditionerApplyCount.textContent = length2 + " 项修改";
  syncComponentActionControls(component, airConditionerActionControls);
}
function syncTitleButtonInspector(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(flag.width || 100);
  const number2 = Number(flag.height || 100);
  vacuumMapLabel.value = value.label || "";
  pickerValueEl2(component);
  vacuumMapOpacity.value = roundField(Number(value.opacity ?? 0.5) * 100);
  vacuumMapLeft.value = roundField(clampNumber((Number(flag.x || 0) + number / 2) / numeric * 100, 0, 100));
  vacuumMapTop.value = roundField(clampNumber((Number(flag.y || 0) + number2 / 2) / canvasHeight * 100, 0, 100));
  vacuumMapScale.value = roundField(Number(component.style?.scale || 1) * 100);
  vacuumMapRotation.value = roundField(Number(flag.rotation || 0));
  vacuumMapRotation.disabled = false;
  vacuumMapScale.disabled = false;
}
function hideAllInspectors(component) {
  const value = [imageInspector, iconButtonEffectInspector, titleButtonInspector, iconButtonInspector, vacuumMapInspector, cameraInspector, airConditionerInspector, timeInspector, dateInspector, weatherInspector, lineChartInspector, panelFrameInspector, navigationInspector].find(el2 => el2 && !el2.hidden)?.querySelector(":scope > .inspector-section");
  if (value && value.nextElementSibling !== coverSettingsInspector) {
    value.insertAdjacentElement("afterend", coverSettingsInspector);
  }
  const coverProps = component.properties || {};
  const coverKind = ["standard", "dream", "airer"].includes(coverProps.coverKind) ? coverProps.coverKind : "auto";
  for (const element of coverSettingsKind.querySelectorAll("[data-cover-kind]")) {
    const coverKind2 = element.dataset.coverKind === coverKind;
    element.classList.toggle("active", coverKind2);
    element.setAttribute("aria-pressed", String(coverKind2));
  }
  const coverDirection = ["left", "right"].includes(coverProps.coverDirection) ? coverProps.coverDirection : "split";
  for (const element of coverSettingsDirection.querySelectorAll("[data-cover-direction]")) {
    const coverDirection2 = element.dataset.coverDirection === coverDirection;
    element.classList.toggle("active", coverDirection2);
    element.setAttribute("aria-pressed", String(coverDirection2));
  }
  const motorDirection = ["normal", "reversed"].includes(coverProps.coverMotorDirection) ? coverProps.coverMotorDirection : "auto";
  for (const element of coverSettingsMotorDirection.querySelectorAll("[data-cover-motor-direction]")) {
    const motorDirection2 = element.dataset.coverMotorDirection === motorDirection;
    element.classList.toggle("active", motorDirection2);
    element.setAttribute("aria-pressed", String(motorDirection2));
  }
}
function refreshInspector() {
  window.requestAnimationFrame(refreshActiveColorPicker);
  const component = selectedComponent();
  const flag = component?.type === "image";
  const flag2 = component?.type === "interaction3d";
  renderInteraction3dInspector(inspector, component, {
    document: currentProject?.document,
    entities: entityCatalog,
    states: editorRenderer?.states,
    pickers: i3dEditorPickers,
    enhanceControls: param => {
      enhanceSelectsIn(param);
      bindColorInputsIn(param);
      bindNumberInputsIn(param);
    },
    prepareCanvas: () => {
      const page2 = findComponent(currentProject?.document, component.id);
      if (!page2) {
        throw new Error("3D 控件已不存在。");
      }
      const flag22 = page2.page?.path || pageSelect.value;
      const flag21 = editorMode !== "edit" || editorRenderer?.page?.path !== flag22;
      pageSelect.value = flag22;
      syncCustomSelect(pageSelect);
      if (flag21) {
        setEditorMode("edit");
      }
      renderComponentTree();
      syncRendererSelection();
    },
    onError,
    onChange: (param, {
      replaceProperties: param2 = false
    } = {}) => mutateDocument(param3 => {
      const target = findComponent(param3, component.id)?.component;
      if (!target || target.type !== "interaction3d") {
        throw new Error("3D 控件已不存在。");
      }
      for (const [key, value] of Object.entries(param)) {
        target[key] = key === "properties" && param2 ? value : {
          ...target[key],
          ...value
        };
      }
    }, pageSelect.value, {
      throwOnError: true
    })
  });
  const flag3 = component?.type === "floorplan-auto-diagram";
  const flag4 = component?.type === "icon-button-effect";
  const flag5 = component?.type === "title-button";
  const flag6 = component?.type === "light-statistics";
  const includesValue = ["icon-button", "device-button", "presence-sensor"].includes(component?.type);
  const flag7 = component?.type === "vacuum-map";
  const flag8 = component?.type === "camera";
  const flag9 = component?.type === "air-conditioner";
  const flag10 = component?.type === "time";
  const flag11 = component?.type === "date";
  const flag12 = component?.type === "weather";
  const flag13 = component?.type === "line-chart";
  const flag14 = component?.type === "panel-frame";
  const flag19 = component?.type === "navigation-button";
  const flag20 = component?.type === "group";
  for (const temp2 of [...imagePreviewStateById.keys()]) {
    if (!flag19 || temp2 !== component.id) {
      imagePreviewStateById.delete(temp2);
      editorRenderer?.setComponentPreviewState(temp2, "auto");
    }
  }
  for (const temp2 of [...ibePreviewStateById.keys()]) {
    if (!flag4 || temp2 !== component.id) {
      ibePreviewStateById.delete(temp2);
      editorRenderer?.setComponentPreviewState(temp2, "auto");
    }
  }
  for (const temp2 of [...presencePreviewStateById.keys()]) {
    if (!includesValue || temp2 !== component.id) {
      presencePreviewStateById.delete(temp2);
      editorRenderer?.setComponentPreviewState(temp2, "auto");
    }
  }
  for (const temp2 of [...airConditionerPreviewStateById.keys()]) {
    if (!flag9 || temp2 !== component.id) {
      airConditionerPreviewStateById.delete(temp2);
      editorRenderer?.setComponentPreviewState(temp2, "auto");
    }
  }
  const flag15 = flag2 || flag20 || flag || flag3 || flag4 || flag5 || flag6 || includesValue || flag7 || flag8 || flag9 || flag10 || flag11 || flag12 || flag13 || flag14 || flag19;
  inspectorEmpty.hidden = flag15;
  if (flag20) {
    inspectorEmpty.querySelector("p").textContent = "组合支持整体移动、复制、旋转和缩放；双击组合可进入组内编辑。";
  }
  imageInspector.hidden = !flag;
  floorplanAutoDiagramInspector.hidden = !flag3;
  iconButtonEffectInspector.hidden = !flag4;
  titleButtonInspector.hidden = !flag5;
  lightStatisticsInspector.hidden = !flag6;
  iconButtonInspector.hidden = !includesValue;
  vacuumMapInspector.hidden = !flag7;
  cameraInspector.hidden = !flag8;
  airConditionerInspector.hidden = !flag9;
  timeInspector.hidden = !flag10;
  dateInspector.hidden = !flag11;
  weatherInspector.hidden = !flag12;
  lineChartInspector.hidden = !flag13;
  panelFrameInspector.hidden = !flag14;
  navigationInspector.hidden = !flag19;
  const temp = String(component?.bindings?.entity?.entityId || "").startsWith("cover.");
  coverSettingsInspector.hidden = !flag15 || !temp;
  if (!flag15) {
    closeOtherPickerPanels();
    inspectorEmpty.querySelector("p").textContent = component ? "“" + componentLabel(component) + "”的专属属性尚未实现。" : "选择一个控件开始编辑。";
    return;
  }
  if (temp) {
    hideAllInspectors(component);
  }
  if (flag3) {
    const flag19 = component.properties || {};
    const flag20 = component.position || {};
    const canvasWidth = Number(currentProject.document.canvas.width || 2778);
    const canvasHeight2 = Number(currentProject.document.canvas.height || 1940);
    const number3 = Number(flag20.width || 100);
    const number4 = Number(flag20.height || 100);
    const list = Array.isArray(flag19.lightLayers) ? flag19.lightLayers.length : 0;
    const flag21 = flag19.previewReady === true && (flag19.generated !== true || flag19.previewing === true);
    floorplanAutoDiagramStatus.textContent = flag19.generating ? "正在后台生成底图和灯组效果，请稍候…" : flag19.generated && list ? "已生成导图，包含 " + list + " 个灯组。" : flag21 ? "3D画面已置入仪表盘，请先确定位置、大小和视角。" : "尚未载入3D画面。";
    floorplanAutoDiagramViewToggle.hidden = !flag21;
    const flag22 = flag19.interactionMode === "view";
    floorplanAutoDiagramViewToggle.classList.toggle("active", flag22);
    floorplanAutoDiagramViewToggle.setAttribute("aria-pressed", String(flag22));
    floorplanAutoDiagramViewToggle.textContent = flag22 ? "完成3D视角调整" : "调整3D视角";
    floorplanAutoDiagramLabel.value = flag19.label || flag19.instanceName || "";
    floorplanAutoDiagramFolder.value = flag19.exportFolder || "";
    const chosen2 = flag19.layoutMode === "fill" ? "fill" : "free";
    for (const element of floorplanAutoDiagramLayout.querySelectorAll("[data-floorplan-layout]")) {
      const flag24 = element.dataset.floorplanLayout === chosen2;
      element.classList.toggle("active", flag24);
      element.setAttribute("aria-pressed", String(flag24));
    }
    floorplanAutoDiagramLeft.value = roundField(clampNumber((Number(flag20.x || 0) + number3 / 2) / canvasWidth * 100, 0, 100));
    floorplanAutoDiagramTop.value = roundField(clampNumber((Number(flag20.y || 0) + number4 / 2) / canvasHeight2 * 100, 0, 100));
    floorplanAutoDiagramWidth.value = roundField(number3 / canvasWidth * 100);
    floorplanAutoDiagramHeight.value = roundField(number4 / canvasHeight2 * 100);
    floorplanAutoDiagramScale.value = roundField(Number(component.style?.scale || 1) * 100);
    floorplanAutoDiagramRotation.value = roundField(Number(flag20.rotation || 0));
    const temp2 = floorplanPreviewById.get(component.id);
    const chosen5 = Array.isArray(temp2?.floors) ? temp2.floors : [];
    const flag23 = String(flag19.floorSelection || "") || String(temp2?.selected || "");
    if (chosen5.length) {
      const option = chosen5.map(component2 => Object.assign(document.createElement("option"), {
        value: component2.id,
        textContent: component2.name
      }));
      if (chosen5.length > 1) {
        option.unshift(Object.assign(document.createElement("option"), {
          value: "all",
          textContent: "全楼"
        }));
      }
      floorplanAutoDiagramFloor.replaceChildren(...option);
      floorplanAutoDiagramFloor.value = option.some(element => element.value === flag23) ? flag23 : option[0].value;
    } else {
      floorplanAutoDiagramFloor.replaceChildren(Object.assign(document.createElement("option"), {
        value: "",
        textContent: flag21 ? "正在读取楼层…" : "载入3D画面后选择"
      }));
    }
    floorplanAutoDiagramFloor.disabled = !flag21 || chosen5.length === 0 || flag19.generating === true;
    const chosen3 = flag19.cameraView === "top" ? "top" : "free";
    const chosen4 = flag19.cameraMode === "perspective" ? "perspective" : "orthographic";
    for (const element of floorplanAutoDiagramCameraView.querySelectorAll("[data-floorplan-camera-view]")) {
      const flag24 = element.dataset.floorplanCameraView === chosen3;
      element.classList.toggle("active", flag24);
      element.setAttribute("aria-pressed", String(flag24));
    }
    for (const element of floorplanAutoDiagramCameraMode.querySelectorAll("[data-floorplan-camera-mode]")) {
      const flag24 = element.dataset.floorplanCameraMode === chosen4;
      element.classList.toggle("active", flag24);
      element.setAttribute("aria-pressed", String(flag24));
    }
    floorplanAutoDiagramFocalLength.value = roundField(clampNumber(Number(flag19.cameraFocalLength || 50), 18, 120));
    floorplanAutoDiagramFocalLength.disabled = chosen4 !== "perspective" || !flag21;
    floorplanAutoDiagramRotateTop.disabled = chosen3 !== "top" || !flag21;
    floorplanAutoDiagramOpenBaseLighting.disabled = !flag21;
    for (const temp3 of [floorplanAutoDiagramLeft, floorplanAutoDiagramTop, floorplanAutoDiagramWidth, floorplanAutoDiagramHeight, floorplanAutoDiagramScale, floorplanAutoDiagramRotation]) {
      temp3.disabled = chosen2 === "fill";
    }
    floorplanAutoDiagramOpenStudio.disabled = flag19.generating === true;
    floorplanAutoDiagramOpenStudio.textContent = flag19.generated && !flag19.previewing ? "重新调整位置和视角" : flag19.generating ? "正在后台生成…" : flag21 ? "确定位置大小并后台生成" : "载入3D画面";
    floorplanAutoDiagramBindings.hidden = list === 0;
    const filtered = entityCatalog.filter(item => entityDomain(item) === "light");
    const mapped = (flag19.lightLayers || []).map(component2 => {
      const element = document.createElement("label");
      element.textContent = component2.note || component2.name || "灯组";
      const el3 = document.createElement("select");
      el3.dataset.floorplanLightGroupId = component2.id;
      const text2 = component.bindings?.["lightGroup:" + component2.id]?.entityId || "";
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "选择实体";
      el3.append(option);
      for (const temp3 of filtered) {
        const option2 = document.createElement("option");
        option2.value = temp3.entityId;
        option2.textContent = entityPickerText(temp3);
        el3.append(option2);
      }
      if (text2 && !filtered.some(item => item.entityId === text2)) {
        const option2 = document.createElement("option");
        option2.value = text2;
        option2.textContent = text2;
        el3.append(option2);
      }
      el3.value = text2;
      element.append(el3);
      return element;
    });
    floorplanAutoDiagramBindingList.replaceChildren(...mapped);
    return;
  }
  if (flag4) {
    const chosen2 = ibeEntityMenu.hidden ? ibeAssetMenu.hidden ? ibeIconMenu.hidden ? null : "ibe-icon" : "ibe-asset" : "ibe-entity";
    closeOtherPickerPanels(chosen2);
    const flag19 = component.properties || {};
    const flag20 = component.position || {};
    const canvasWidth = Number(currentProject.document.canvas.width || 2778);
    const canvasHeight2 = Number(currentProject.document.canvas.height || 1940);
    const number3 = Number(flag20.width || 100);
    const number4 = Number(flag20.height || 100);
    ibeLabel.value = flag19.label || "";
    setInspectorToggle(ibeButtonVisible, flag19.buttonVisible !== false);
    setInspectorToggle(ibeEffectVisible, flag19.effectVisible !== false);
    ibeColorTemperatureRealtime.checked = flag19.effectColorTemperatureRealtime !== false;
    ibeBrightnessRealtime.checked = flag19.effectBrightnessRealtime !== false;
    for (const temp4 of [ibeColorTemperatureRealtime, ibeBrightnessRealtime]) {
      temp4.disabled = false;
      temp4.title = "";
      temp4.closest(".check-row")?.classList.remove("is-disabled");
    }
    pickerValueEl2(component);
    syncIbeAssetButton(component);
    syncIbeIconButton(flag19.icon || "");
    ibeIconOffColor.value = flag19.iconOffColor || "#9aa5ad";
    ibeIconOnColor.value = flag19.iconOnColor || "#ffffff";
    ibeIconSize.value = roundField(Number(flag19.iconSize ?? 44));
    ibeButtonOffColor.value = flag19.buttonOffColor || "#17242d";
    ibeButtonOnColor.value = flag19.buttonOnColor || "#1f91b8";
    ibeButtonOpacity.value = roundField(Number(flag19.buttonOpacity ?? 0.92) * 100);
    ibeFrameColor.value = flag19.frameColor || "#dcebf2";
    ibeFrameWidth.value = roundField(Number(flag19.frameWidth ?? 1.5));
    ibeFrameOpacity.value = roundField(Number(flag19.frameOpacity ?? 0.72) * 100);
    ibeRadius.value = roundField(Number(flag19.radius ?? 50));
    ibeGlowColor.value = flag19.glowColor || "#43c8f0";
    ibeGlowOffStrength.value = roundField(Number(flag19.glowOffStrength ?? 0) * 100);
    ibeGlowOnStrength.value = roundField(Number(flag19.glowOnStrength ?? 1) * 100);
    ibeEffectOpacity.value = roundField(Number(flag19.effectOpacity ?? 1) * 100);
    ibeEffectFadeDuration.value = roundField(Number(flag19.effectFadeDuration ?? 0.52));
    ibeEffectLeft.value = roundField(Number(flag19.effectLeft ?? 50));
    ibeEffectTop.value = roundField(Number(flag19.effectTop ?? 50));
    ibeEffectScale.value = roundField(Number(flag19.effectScale ?? 1) * 100);
    ibeEffectRotation.value = roundField(Number(flag19.effectRotation ?? 0));
    ibeLeft.value = roundField(clampNumber((Number(flag20.x || 0) + number3 / 2) / canvasWidth * 100, 0, 100));
    ibeTop.value = roundField(clampNumber((Number(flag20.y || 0) + number4 / 2) / canvasHeight2 * 100, 0, 100));
    ibeWidth.value = roundField(number3 / canvasWidth * 100);
    ibeHeight.value = roundField(number4 / canvasHeight2 * 100);
    ibeScale.value = roundField(Number(component.style?.scale || 1) * 100);
    ibeRotation.value = roundField(Number(flag20.rotation || 0));
    const isMultiSelect2 = selectedComponentIds.size > 1;
    ibeWidth.disabled = isMultiSelect2;
    ibeHeight.disabled = isMultiSelect2;
    ibeScale.disabled = false;
    ibeRotation.disabled = false;
    const chosen3 = flag19.effectLayoutMode === "fill" ? "fill" : "free";
    for (const element of ibeEffectLayoutOptions.querySelectorAll("[data-ibe-layout]")) {
      const flag23 = element.dataset.ibeLayout === chosen3;
      element.classList.toggle("active", flag23);
      element.setAttribute("aria-pressed", String(flag23));
    }
    for (const temp4 of [ibeEffectLeft, ibeEffectTop, ibeEffectScale, ibeEffectRotation]) {
      temp4.disabled = chosen3 === "fill";
    }
    const temp2 = effectNaturalSize(flag19);
    ibeEffectSizeHint.textContent = temp2 ? "原始尺寸：" + roundField(temp2.width) + " × " + roundField(temp2.height) + "；仅支持等比缩放。" : "效果图片将按原始尺寸等比缩放。";
    const temp3 = iconButtonEffectInspectorLayer(component, ibeLayerById.get(component.id));
    editorRenderer?.setComponentSelectionLayer(component.id, temp3);
    if (!ibePreviewStateById.has(component.id)) {
      ibePreviewStateById.set(component.id, "on");
      editorRenderer?.setComponentPreviewState(component.id, "on");
    }
    const text2 = ibePreviewStateById.get(component.id) || "auto";
    for (const element of ibePreviewState.querySelectorAll("[data-ibe-preview]")) {
      const flag23 = element.dataset.ibePreview === text2;
      element.classList.toggle("active", flag23);
      element.setAttribute("aria-pressed", String(flag23));
    }
    for (const element of ibeLayerOptions.querySelectorAll("[data-ibe-layer]")) {
      const flag23 = element.dataset.ibeLayer === temp3;
      element.classList.toggle("active", flag23);
      element.setAttribute("aria-pressed", String(flag23));
    }
    const flag22 = temp3 === "effect";
    ibeButtonSection.hidden = flag22;
    ibeButtonTransformSection.hidden = flag22;
    ibeActionSection.hidden = flag22;
    ibeEffectSection.hidden = !flag22;
    const length = findComponentsByType("icon-button-effect").length;
    const length2 = ibeTemplateOptions3(component).length;
    ibeApplyStyle.disabled = length < 2 || !length2;
    ibeApplyCount.textContent = length2 + " 项修改";
    ibeApplyStyle.textContent = "一键应用到同类型控件";
    syncComponentActionControls(component, ibeActionControls);
    return;
  }
  if (flag9) {
    closeOtherPickerPanels(airConditionerEntityMenu.hidden ? null : "air-conditioner-entity");
    syncIconButtonInspector(component);
    return;
  }
  if (flag5) {
    const chosen2 = titleButtonEntityMenu.hidden ? titleButtonIconMenu.hidden ? null : "title-button-icon" : "title-button-entity";
    closeOtherPickerPanels(chosen2);
    syncVacuumMapInspector(component);
    return;
  }
  if (flag6) {
    const chosen2 = lightStatisticsEntityMenu.hidden ? lightStatisticsActionEntityMenu.hidden ? lightStatisticsIconMenu.hidden ? null : "light-statistics-icon" : "light-statistics-action-entity" : "light-statistics-entity";
    closeOtherPickerPanels(chosen2);
    syncCameraInspector(component);
    return;
  }
  if (includesValue) {
    const chosen2 = iconButtonEntityMenu.hidden ? iconButtonIconMenu.hidden ? null : "icon-button-icon" : "icon-button-entity";
    closeOtherPickerPanels(chosen2);
    syncPresenceInspector(component);
    return;
  }
  if (flag8) {
    closeOtherPickerPanels(cameraEntityMenu.hidden ? null : "camera-entity");
    syncAirConditionerInspector(component);
    return;
  }
  if (flag7) {
    closeOtherPickerPanels(vacuumMapEntityMenu.hidden ? null : "vacuum-map-entity");
    syncTitleButtonInspector(component);
    return;
  }
  if (flag19) {
    closeOtherPickerPanels(navigationIconMenu.hidden ? null : "navigation-icon");
    syncNavigationInspector(component);
    return;
  }
  if (flag10) {
    closeOtherPickerPanels();
    syncTimeInspector(component);
    return;
  }
  if (flag11) {
    closeOtherPickerPanels();
    syncDateInspector(component);
    return;
  }
  if (flag12) {
    closeOtherPickerPanels();
    syncWeatherInspector(component);
    return;
  }
  if (flag13) {
    closeOtherPickerPanels();
    syncLineChartInspector(component);
    return;
  }
  if (flag14) {
    closeOtherPickerPanels();
    syncPanelFrameInspector(component);
    return;
  }
  const flag16 = component.properties || {};
  const flag17 = component.position || {};
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(flag17.width || 100);
  const number2 = Number(flag17.height || 100);
  imageType.value = "图片";
  imageLabel.value = flag16.label || "";
  pickerValueEl2(component);
  syncImageAssetButton(component);
  imageOpacity.value = roundField(Number(flag16.opacity ?? 1) * 100);
  imageLeft.value = roundField(clampNumber((Number(flag17.x || 0) + number / 2) / numeric * 100, 0, 100));
  imageTop.value = roundField(clampNumber((Number(flag17.y || 0) + number2 / 2) / canvasHeight * 100, 0, 100));
  imageScale.value = roundField(clampNumber(Number(component.style?.scale || 1) * 100, 1, 500));
  imageRotation.value = roundField(Number(flag17.rotation || 0));
  const chosen = flag16.layoutMode === "fill" ? "fill" : "free";
  for (const element of imageLayoutOptions.querySelectorAll("[data-image-layout]")) {
    const flag19 = element.dataset.imageLayout === chosen;
    element.classList.toggle("active", flag19);
    element.setAttribute("aria-pressed", String(flag19));
  }
  const flag18 = chosen === "fill";
  const isMultiSelect = selectedComponentIds.size > 1;
  imageLeft.disabled = flag18;
  imageTop.disabled = flag18;
  imageScale.disabled = flag18;
  imageRotation.disabled = flag18;
  syncComponentActionControls(component, componentActionControls);
}
async function loadAssets({
  refreshInspector: value = true
} = {}) {
  const [temp, asyncResult] = await Promise.all([apiFetch("/assets/builtin?_=" + Date.now()), apiFetch("/assets/user?_=" + Date.now())]);
  builtinAssets = temp.items || [];
  userAssets = asyncResult.items || [];
  assetsVersionToken = (temp.catalogVersion || "") + ":" + (asyncResult.catalogVersion || "");
  const temp3 = setBuiltinAssetVersions(allAssets());
  if (temp3) {
    editorRenderer?.renderComponents(true);
    dashboardPreviewRenderer?.renderComponents(true);
  }
  if (value) {
    refreshInspector();
  }
  return temp3;
}
async function refreshAssetsIfChanged() {
  const value = await apiFetch("/assets/version");
  const number = (value.builtin || "") + ":" + (value.user || "");
  if (assetsVersionToken !== number) {
    await loadAssets({
      refreshInspector: true
    });
  }
}
async function ensureEntitiesLoaded({
  afterCurrent: value = false
} = {}) {
  if (entityLoadPromise) {
    if (value) {
      await entityLoadPromise;
      return ensureEntitiesLoaded();
    } else {
      return entityLoadPromise;
    }
  } else {
    entityLoadPromise = (async () => {
      const list = [];
      let temp = 0;
      let number = 0;
      do {
        const asyncResult3 = await apiFetch("/ha/entities?limit=500&offset=" + temp);
        list.push(...(asyncResult3.items || []));
        number = Number(asyncResult3.total || 0);
        temp += Number(asyncResult3.limit || 500);
      } while (list.length < number);
      entityCatalog = list.filter(item => item.status !== "missing");
      const [asyncResult, asyncResult2] = await Promise.all([apiFetch("/ha/devices").catch(() => ({
        items: []
      })), apiFetch("/ha/translations").catch(() => ({
        resources: {}
      }))]);
      deviceCatalog = asyncResult?.items || [];
      entityById = new Map(deviceCatalog.map(item => [String(item.deviceId || ""), normalizeWhitespace(item.name)]).filter(([item, param]) => item && param));
      entityStateById = asyncResult2?.resources || {};
      entitiesLoaded = true;
      editorRenderer?.setEntityCatalog(entityCatalog, entityStateById, deviceCatalog);
      dashboardPreviewRenderer?.setEntityCatalog(entityCatalog, entityStateById, deviceCatalog);
      syncPopupEntityFields();
      if (!document.activeElement?.closest?.(".inspector-form")) {
        refreshInspector();
      }
    })().finally(() => {
      entityLoadPromise = null;
    });
    return entityLoadPromise;
  }
}
function renderPopupList(value, param = selectedPopupId) {
  const flag = value?.customPopups || [];
  popupSelect.replaceChildren();
  popupList.replaceChildren();
  if (!flag.length) {
    selectedPopupId = null;
    popupSelect.append(new Option("暂无组合弹窗", ""));
    popupSelect.disabled = true;
    popupActionsButton.disabled = true;
    syncCustomSelect(popupSelect);
    const element = document.createElement("div");
    element.className = "popup-list-empty";
    element.textContent = "还没有组合弹窗";
    popupList.append(element);
    return;
  }
  for (const temp of flag) {
    popupSelect.append(new Option(temp.name, temp.id));
  }
  selectedPopupId = flag.some(component => component.id === param) ? param : flag[0].id;
  popupSelect.value = selectedPopupId;
  popupSelect.disabled = false;
  popupActionsButton.disabled = false;
  syncCustomSelect(popupSelect);
  for (const temp of flag) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "popup-list-item" + (temp.id === selectedPopupId ? " selected" : "");
    button.dataset.popupId = temp.id;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(temp.id === selectedPopupId));
    const element = document.createElement("span");
    element.textContent = temp.name;
    const el3 = document.createElement("small");
    el3.textContent = (temp.modules || []).length + " 个模块";
    button.append(element, el3);
    popupList.append(button);
  }
}
function syncPopupEntityFields() {
  for (const element of document.querySelectorAll("[data-popup-entity]")) {
    const value = element.closest("[data-action-trigger]");
    if (!element.value && entityCatalog[0]?.entityId) {
      element.value = entityCatalog[0].entityId;
    }
    popupEntityIdFromRow(value);
    const el2 = value?.querySelector("[data-popup-entity-menu]");
    if (el2 && !el2.hidden) {
      renderPopupEntityOptions(value, value.querySelector("[data-popup-entity-search]")?.value || "");
    }
  }
}
function syncPopupModuleClimateFields(value = popupModuleForm.elements.deviceType.value) {
  const flag = popupModuleForm.elements.type.value === "climate";
  const temp = normalizedPopupClimateDeviceType(value);
  popupModuleClimateDeviceType.hidden = !flag;
  popupModuleForm.elements.deviceType.value = temp;
  for (const element of popupModuleClimateDeviceType.querySelectorAll("[data-popup-module-device-type]")) {
    const flag2 = element.dataset.popupModuleDeviceType === temp;
    element.classList.toggle("active", flag2);
    element.setAttribute("aria-pressed", String(flag2));
  }
}
function entityDisplayName(value) {
  return entityCatalog.find(item => item.entityId === value)?.name || value || "未选择实体";
}
function syncPopupModuleEntityButton() {
  const value = popupModuleForm.elements.entityId.value;
  const found = entityCatalog.find(item => item.entityId === value);
  const chosen = found ? "[" + entityKindLabel(found) + "] " + entityPickerPrimaryName(found) : value || "选择实体";
  setPickerButtonLabel(popupModuleEntityButton, chosen, value || chosen);
  popupModuleEntityButton.dataset.entityId = value;
  popupModuleEntityButton._entityCopySync?.();
}
function filterPopupModuleEntities(value = popupModuleEntitySearch.value) {
  const inputValue = popupModuleForm.elements.entityId.value;
  const temp = String(value || "").trim().toLocaleLowerCase("zh-CN");
  const mapped = entityCatalog.map((entity, index) => ({
    entity,
    index
  })).filter(({
    entity: item
  }) => !temp || (entityPickerText(item) + " " + item.entityId).toLocaleLowerCase("zh-CN").includes(temp)).sort((left, right) => Number(popupModuleEntityRecommended(right.entity, popupModuleForm.elements.type.value)) - Number(popupModuleEntityRecommended(left.entity, popupModuleForm.elements.type.value)) || left.index - right.index).map(({
    entity: item
  }) => item);
  popupModuleEntityOptions.replaceChildren(...mapped.map(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "inspector-entity-option" + (item.entityId === inputValue ? " selected" : "");
    button.dataset.popupModuleEntityId = item.entityId;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(item.entityId === inputValue));
    const span = document.createElement("span");
    span.className = "inspector-entity-option-content";
    const element = document.createElement("span");
    element.className = "inspector-entity-option-line inspector-entity-name-line";
    element.textContent = "[" + entityKindLabel(item) + "] " + entityPickerPrimaryName(item);
    const span2 = document.createElement("span");
    span2.className = "inspector-entity-option-line inspector-entity-id";
    span2.textContent = item.entityId;
    span.append(element, span2);
    enableEntityTextHoverScroll(button, element);
    button.append(span);
    return button;
  }));
  if (!mapped.length) {
    const element = document.createElement("div");
    element.className = "inspector-picker-empty";
    element.textContent = "没有匹配的实体";
    popupModuleEntityOptions.append(element);
  }
}
function closePopupModuleEntityMenu() {
  popupModuleEntityMenu.hidden = true;
  popupModuleEntityButton.setAttribute("aria-expanded", "false");
}
function syncCustomPopupStage() {
  if (editorMode !== "popup") {
    return;
  }
  const value = findCustomPopup(currentProject?.document, selectedPopupId);
  const customPopupStageWrap = customPopupEditor.querySelector(".custom-popup-stage-wrap");
  const customPopupViewport = customPopupEditor.querySelector(".custom-popup-viewport");
  const customPopupStage = customPopupEditor.querySelector(".custom-popup-stage");
  const customPopupEditorToolbar = customPopupEditor.querySelector(".custom-popup-editor-toolbar");
  if (!value || !customPopupStageWrap || !customPopupViewport || !customPopupStage || !customPopupEditorToolbar) {
    return;
  }
  const temp = popupLayoutMetrics(value.modules || [], value.layout);
  const gridWidth = temp.gridWidth;
  const gridHeight = temp.gridHeight;
  const count = Math.max(0.2, Math.min(customPopupStageWrap.clientWidth / gridWidth, customPopupStageWrap.clientHeight / gridHeight));
  const count2 = Math.max(1, gridWidth * count);
  const count3 = Math.max(1, gridHeight * count);
  customPopupViewport.style.width = count2 + "px";
  customPopupViewport.style.height = count3 + "px";
  customPopupStage.style.width = gridWidth + "px";
  customPopupStage.style.height = gridHeight + "px";
  customPopupStage.style.transform = "scale(" + count + ")";
  customPopupEditorToolbar.style.width = customPopupStageWrap.clientWidth + "px";
}
function updateCustomPopupModule(value, param, param2 = null, param3 = false) {
  const found = (currentProject?.document?.customPopups || []).find(component => component.id === value);
  if (!found) {
    return;
  }
  const temp = reorderedPopupModules(found.modules, param, param2, param3);
  if (temp.length !== (found.modules || []).length || !temp.every((component, index) => component.id === found.modules[index]?.id)) {
    if (!packPopupModules(temp, found.layout).fits) {
      onError(new Error("这个排序会使当前布局超过 3 行。"));
      return;
    }
    mutateDocument(doc => {
      const found2 = (doc.customPopups || []).find(component => component.id === value);
      if (found2) {
        found2.modules = reorderedPopupModules(found2.modules, param, param2, param3);
      }
    });
  }
}
function buildPopupCoverSettings(value, component) {
  const temp = document.createElement("div");
  temp.className = "popup-cover-settings";
  const coverDirection = [{
    label: "窗帘类型",
    property: "coverKind",
    fallback: "auto",
    allowed: ["auto", "standard", "dream", "airer"],
    options: [["auto", "自动识别"], ["standard", "普通窗帘"], ["dream", "梦幻帘"], ["airer", "晾衣机"]]
  }, {
    label: "开合方向",
    property: "coverDirection",
    fallback: "split",
    allowed: ["split", "left", "right"],
    options: [["split", "双开"], ["left", "向左"], ["right", "向右"]]
  }, {
    label: "电机方向",
    property: "coverMotorDirection",
    fallback: "auto",
    allowed: ["auto", "normal", "reversed"],
    options: [["auto", "跟随 HA"], ["normal", "正常"], ["reversed", "反向"]]
  }];
  for (const temp2 of coverDirection) {
    const div2 = document.createElement("div");
    div2.className = "popup-cover-setting-row";
    const element = document.createElement("span");
    element.textContent = temp2.label;
    const div3 = document.createElement("div");
    div3.className = "popup-cover-setting-options";
    div3.setAttribute("role", "group");
    div3.setAttribute("aria-label", temp2.label);
    const temp5 = component.properties?.[temp2.property];
    const chosen = temp2.allowed.includes(temp5) ? temp5 : temp2.fallback;
    for (const [temp6, temp7] of temp2.options) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = temp7;
      button.classList.toggle("active", temp6 === chosen);
      button.setAttribute("aria-pressed", String(temp6 === chosen));
      button.addEventListener("click", event => {
        event.stopPropagation();
        if (temp6 !== chosen) {
          mutateDocument(doc => {
            const temp8 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
            if (!!temp8 && temp8.type === "cover") {
              temp8.properties = {
                ...(temp8.properties || {}),
                [temp2.property]: temp6
              };
            }
          });
        }
      });
      div3.append(button);
    }
    div2.append(element, div3);
    temp.append(div2);
  }
  return temp;
}
function buildPopupClimateSettings(value, component) {
  const temp = document.createElement("div");
  temp.className = "popup-climate-settings";
  const div2 = document.createElement("div");
  div2.className = "popup-cover-setting-row";
  const element = document.createElement("span");
  element.textContent = "设备类型";
  const div3 = document.createElement("div");
  div3.className = "popup-cover-setting-options";
  div3.setAttribute("role", "group");
  div3.setAttribute("aria-label", "设备类型");
  const flag = component.properties?.deviceType || component.deviceType;
  const temp4 = normalizedPopupClimateDeviceType(flag);
  for (const [deviceType, temp5] of [["auto", "自动识别"], ["air-conditioner", "空调"], ["bath-heater", "浴霸"]]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = temp5;
    button.classList.toggle("active", deviceType === temp4);
    button.setAttribute("aria-pressed", String(deviceType === temp4));
    button.addEventListener("click", event => {
      event.stopPropagation();
      if (deviceType !== temp4) {
        mutateDocument(doc => {
          const temp6 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
          if (!!temp6 && temp6.type === "climate") {
            temp6.properties = {
              ...(temp6.properties || {}),
              deviceType
            };
            delete temp6.deviceType;
          }
        });
      }
    });
    div3.append(button);
  }
  div2.append(element, div3);
  temp.append(div2);
  return temp;
}
function defaultLineChartThresholds(component) {
  const value = [{
    value: 0,
    color: "#ddffc2"
  }, {
    value: 13,
    color: "#68cc3e"
  }, {
    value: 27,
    color: "#ff8e52"
  }, {
    value: 40,
    color: "#ff1a1a"
  }];
  const list = Array.isArray(component.properties?.thresholds) ? component.properties.thresholds : [];
  return value.map((element, index) => ({
    value: Number.isFinite(Number(list[index]?.value)) ? Number(list[index].value) : element.value,
    color: String(list[index]?.color || element.color)
  }));
}
function buildPopupLineChartSettings(value, component) {
  const temp = document.createElement("div");
  temp.className = "popup-line-chart-settings";
  const div2 = document.createElement("div");
  div2.className = "popup-line-chart-setting-row";
  const element = document.createElement("span");
  element.textContent = "数值小数位";
  const el3 = document.createElement("select");
  el3.setAttribute("aria-label", "组合弹窗折线图数值小数位");
  for (const [temp8, temp9] of [["auto", "自动"], ["0", "0 位"], ["1", "1 位"], ["2", "2 位"], ["3", "3 位"], ["4", "4 位"]]) {
    el3.append(new Option(temp9, temp8));
  }
  const temp3 = syncedLineChartProperties(currentProject?.document, currentPage(), component.entityId, component.properties);
  el3.value = ["0", "1", "2", "3", "4"].includes(String(temp3.statePrecision)) ? String(temp3.statePrecision) : "auto";
  el3.addEventListener("pointerdown", event => event.stopPropagation());
  el3.addEventListener("click", event => event.stopPropagation());
  el3.addEventListener("change", event => {
    event.stopPropagation();
    const statePrecision = ["0", "1", "2", "3", "4"].includes(el3.value) ? el3.value : "auto";
    mutateDocument(doc => {
      const temp8 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
      if (!!temp8 && temp8.type === "line-chart") {
        temp8.properties = {
          ...(temp8.properties || {}),
          statePrecision
        };
      }
    });
  });
  div2.append(element, el3);
  temp.append(div2);
  const createControl = (item, param, param2, param3 = false) => {
    const div6 = document.createElement("div");
    div6.className = "popup-line-chart-setting-row";
    const span3 = document.createElement("span");
    span3.textContent = item;
    const div7 = document.createElement("div");
    div7.className = "popup-line-chart-colors";
    param.forEach((item, index) => {
      const el5 = document.createElement("input");
      el5.type = "color";
      el5.value = item;
      el5.disabled = param3;
      el5.setAttribute("aria-label", "" + item + (param.length > 1 ? " " + (index + 1) : ""));
      el5.addEventListener("pointerdown", event => event.stopPropagation());
      el5.addEventListener("click", event => event.stopPropagation());
      el5.addEventListener("change", event => {
        event.stopPropagation();
        param2(el5.value, index);
      });
      div7.append(el5);
    });
    div6.append(span3, div7);
    temp.append(div6);
  };
  createControl("数值颜色", [String(component.properties?.valueColor || "#dce1e5")], valueColor => {
    mutateDocument(doc => {
      const temp8 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
      if (!!temp8 && temp8.type === "line-chart") {
        temp8.properties = {
          ...(temp8.properties || {}),
          valueColor
        };
      }
    });
  });
  const div3 = document.createElement("div");
  div3.className = "popup-line-chart-setting-row";
  const span = document.createElement("span");
  span.textContent = "阈值模式";
  const el4 = document.createElement("select");
  el4.setAttribute("aria-label", "组合弹窗折线图阈值模式");
  el4.append(new Option("自动（按历史范围）", "auto"), new Option("手动设置", "manual"));
  const flag = Array.isArray(component.properties?.thresholds) && component.properties.thresholds.some(item2 => Number.isFinite(Number(item2?.value)));
  el4.value = component.properties?.thresholdMode === "auto" || !flag && component.properties?.thresholdMode !== "manual" ? "auto" : "manual";
  el4.addEventListener("pointerdown", event => event.stopPropagation());
  el4.addEventListener("click", event => event.stopPropagation());
  el4.addEventListener("change", event => {
    event.stopPropagation();
    const thresholdMode = el4.value === "manual" ? "manual" : "auto";
    mutateDocument(doc => {
      const temp8 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
      if (!temp8 || temp8.type !== "line-chart") {
        return;
      }
      const options = {
        ...(temp8.properties || {}),
        thresholdMode
      };
      if (thresholdMode === "manual" && !Array.isArray(options.thresholds)) {
        options.thresholds = defaultLineChartThresholds(temp8);
      }
      temp8.properties = options;
    });
  });
  div3.append(span, el4);
  temp.append(div3);
  const temp5 = defaultLineChartThresholds(component);
  const div4 = document.createElement("div");
  div4.className = "popup-line-chart-setting-row";
  const span2 = document.createElement("span");
  span2.textContent = "阈值";
  const div5 = document.createElement("div");
  div5.className = "popup-line-chart-threshold-values";
  temp5.forEach((el5, index) => {
    const el6 = document.createElement("input");
    el6.type = "number";
    el6.step = "any";
    el6.value = roundField(el5.value);
    el6.disabled = el4.value === "auto";
    el6.setAttribute("aria-label", "折线阈值 " + (index + 1));
    el6.addEventListener("pointerdown", event => event.stopPropagation());
    el6.addEventListener("click", event => event.stopPropagation());
    el6.addEventListener("change", event => {
      event.stopPropagation();
      const number = Number(el6.value);
      if (Number.isFinite(number)) {
        el6.value = roundField(number);
        mutateDocument(doc => {
          const temp8 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
          if (!temp8 || temp8.type !== "line-chart") {
            return;
          }
          const thresholds = defaultLineChartThresholds(temp8);
          thresholds[index] = {
            ...thresholds[index],
            value: number
          };
          temp8.properties = {
            ...(temp8.properties || {}),
            thresholdMode: "manual",
            thresholds
          };
        });
      }
    });
    div5.append(el6);
  });
  div4.append(span2, div5);
  temp.append(div4);
  createControl("折线颜色", temp5.map(item => item.color), (color, param) => {
    mutateDocument(doc => {
      const temp8 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
      if (!temp8 || temp8.type !== "line-chart") {
        return;
      }
      const thresholds = defaultLineChartThresholds(temp8);
      thresholds[param] = {
        ...thresholds[param],
        color
      };
      temp8.properties = {
        ...(temp8.properties || {}),
        thresholdMode: "manual",
        thresholds
      };
    });
  }, el4.value === "auto");
  return temp;
}
function renderList() {
  if (editorMode !== "popup") {
    return;
  }
  const value = findCustomPopup(currentProject?.document, selectedPopupId);
  customPopupEditor.replaceChildren();
  if (!value) {
    const div8 = document.createElement("div");
    div8.className = "custom-popup-empty";
    div8.innerHTML = "<div><strong>还没有组合弹窗</strong><p>从左侧新建后，可以混合添加灯光、空调、空气净化器、窗帘、摄像头和折线图。</p></div>";
    customPopupEditor.append(div8);
    return;
  }
  const temp = document.createElement("div");
  temp.className = "custom-popup-editor-shell";
  const div2 = document.createElement("div");
  div2.className = "custom-popup-editor-toolbar";
  const div3 = document.createElement("div");
  const element = document.createElement("strong");
  element.textContent = value.name;
  const span = document.createElement("span");
  const temp4 = popupLayoutMetrics(value.modules || [], value.layout);
  span.textContent = temp4.columns + " 列 × " + temp4.rows + " 行·行数自适应";
  div3.append(element, span);
  const div4 = document.createElement("div");
  div4.className = "custom-popup-toolbar-actions";
  const span2 = document.createElement("span");
  span2.className = "custom-popup-layout-toggle";
  for (const columns of [2, 3, 4]) {
    const button2 = document.createElement("button");
    button2.type = "button";
    button2.textContent = columns + " 列";
    button2.classList.toggle("active", popupLayoutColumns(value.layout) === columns);
    button2.addEventListener("click", () => {
      if (popupLayoutColumns(value.layout) === columns) {
        return;
      }
      const options = {
        ...(value.layout || {}),
        columns
      };
      if (!packPopupModules(value.modules || [], options).fits) {
        onError(new Error("当前模块在 " + columns + " 列布局中会超过 3 行。"));
        return;
      }
      mutateDocument(doc => {
        const found = (doc.customPopups || []).find(component => component.id === value.id);
        if (found) {
          found.layout = {
            ...(found.layout || {}),
            columns
          };
        }
      });
    });
    span2.append(button2);
  }
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "＋ 添加模块";
  button.addEventListener("click", () => openPopupModuleDialog());
  div4.append(span2, button);
  div2.append(div3, div4);
  const div5 = document.createElement("div");
  div5.className = "custom-popup-stage-wrap";
  const div6 = document.createElement("div");
  div6.className = "custom-popup-viewport";
  const div7 = document.createElement("div");
  div7.className = "custom-popup-stage";
  div7.style.width = temp4.gridWidth + "px";
  div7.style.height = temp4.gridHeight + "px";
  div7.style.setProperty("--popup-columns", temp4.columns);
  div7.style.setProperty("--popup-rows", temp4.rows);
  div7.style.gridTemplateColumns = "repeat(" + temp4.columns + ", minmax(0, 1fr))";
  div7.style.gridTemplateRows = "repeat(" + temp4.rows + ", minmax(0, 1fr))";
  let id2 = null;
  const elements = () => {
    div7.classList.remove("popup-module-append-target");
    for (const temp10 of div7.querySelectorAll(".popup-module-drop-top,.popup-module-drop-right,.popup-module-drop-bottom,.popup-module-drop-left")) {
      temp10.classList.remove("popup-module-drop-top", "popup-module-drop-right", "popup-module-drop-bottom", "popup-module-drop-left");
    }
  };
  div7.addEventListener("dragover", event => {
    if (!!id2 && !event.target.closest(".popup-module-card")) {
      event.preventDefault();
      elements();
      div7.classList.add("popup-module-append-target");
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    }
  });
  div7.addEventListener("drop", event => {
    if (!id2 || event.target.closest(".popup-module-card")) {
      return;
    }
    event.preventDefault();
    const alias = id2;
    elements();
    updateCustomPopupModule(value.id, alias);
  });
  for (const [temp10, temp11] of (value.modules || []).entries()) {
    const flag = temp4.placements[temp10] || {
      x: 0,
      y: temp10,
      width: 1,
      height: 1
    };
    const chosen = ["climate", "air-purifier", "water-heater", "media-player", "camera", "line-chart"].includes(temp11.type) ? 2 : flag.width;
    const el3 = document.createElement("article");
    el3.className = "popup-module-card";
    el3.dataset.popupModuleId = temp11.id;
    el3.draggable = true;
    el3.setAttribute("aria-label", (temp11.title || entityDisplayName(temp11.entityId)) + "，可拖动排序");
    el3.style.gridColumn = flag.x + 1 + " / span " + chosen;
    el3.style.gridRow = flag.y + 1 + " / span " + flag.height;
    const div8 = document.createElement("div");
    div8.className = "popup-module-card-heading";
    const div9 = document.createElement("div");
    const el4 = document.createElement("strong");
    el4.textContent = temp11.title || entityDisplayName(temp11.entityId);
    div9.append(el4);
    const span3 = document.createElement("span");
    span3.className = "popup-module-card-actions";
    const button2 = document.createElement("button");
    button2.type = "button";
    button2.textContent = "✎";
    button2.title = "编辑模块";
    button2.addEventListener("click", () => openPopupModuleDialog(temp11));
    const button3 = document.createElement("button");
    button3.type = "button";
    button3.textContent = "⎘";
    button3.title = "复制模块";
    button3.addEventListener("click", () => {
      const list = [...(value.modules || []), {
        ...cloneValue(temp11),
        id: "candidate"
      }];
      if (!packPopupModules(list, value.layout).fits) {
        onError(new Error("当前布局已放不下这个复制模块。"));
        return;
      }
      mutateDocument(event => {
        const found = (event.customPopups || []).find(component => component.id === value.id);
        const temp16 = found?.modules?.find(component => component.id === temp11.id);
        if (temp16) {
          found.modules.push({
            ...cloneValue(temp16),
            id: newId("popup-module")
          });
        }
      });
    });
    const button4 = document.createElement("button");
    button4.type = "button";
    button4.textContent = "×";
    button4.title = "删除模块";
    button4.addEventListener("click", () => mutateDocument(doc => {
      const found = (doc.customPopups || []).find(component => component.id === value.id);
      if (found) {
        found.modules = found.modules.filter(component => component.id !== temp11.id);
      }
    }));
    span3.append(button2, button3, button4);
    el3.addEventListener("pointerdown", event2 => {
      el3.dataset.dragBlocked = String(!!event2.target.closest(".popup-module-card-actions,.popup-cover-settings,.popup-climate-settings,.popup-line-chart-settings"));
    });
    el3.addEventListener("pointerup", () => {
      delete el3.dataset.dragBlocked;
    });
    el3.addEventListener("pointercancel", () => {
      delete el3.dataset.dragBlocked;
    });
    el3.addEventListener("dragstart", event => {
      if (el3.dataset.dragBlocked === "true") {
        event.preventDefault();
        delete el3.dataset.dragBlocked;
        return;
      }
      id2 = temp11.id;
      el3.classList.add("popup-module-dragging");
      el3.setAttribute("aria-grabbed", "true");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", temp11.id);
      }
    });
    el3.addEventListener("dragover", event => {
      if (!id2 || id2 === temp11.id) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      elements();
      const {
        edge: temp16
      } = popupModuleDropPosition(el3, event);
      el3.classList.add("popup-module-drop-" + temp16);
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    });
    el3.addEventListener("drop", event => {
      if (!id2 || id2 === temp11.id) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const alias = id2;
      const {
        placeAfter: temp17
      } = popupModuleDropPosition(el3, event);
      elements();
      updateCustomPopupModule(value.id, alias, temp11.id, temp17);
    });
    el3.addEventListener("dragend", () => {
      id2 = null;
      delete el3.dataset.dragBlocked;
      el3.classList.remove("popup-module-dragging");
      el3.removeAttribute("aria-grabbed");
      elements();
    });
    div8.append(div9, span3);
    const div10 = document.createElement("div");
    div10.className = "popup-module-placeholder";
    const el5 = document.createElement("strong");
    el5.textContent = popupModuleTypeLabel(temp11.type) + "交互模块";
    const span4 = document.createElement("span");
    span4.textContent = entityDisplayName(temp11.entityId);
    const el6 = document.createElement("small");
    el6.textContent = temp11.entityId;
    div10.append(el5, span4, el6);
    if (temp11.type === "cover") {
      div10.append(buildPopupCoverSettings(value.id, temp11));
    }
    if (temp11.type === "climate") {
      div10.append(buildPopupClimateSettings(value.id, temp11));
    }
    if (temp11.type === "line-chart") {
      div10.append(buildPopupLineChartSettings(value.id, temp11));
    }
    el3.append(div8, div10);
    div7.append(el3);
  }
  if (!(value.modules || []).length) {
    const div8 = document.createElement("div");
    div8.className = "custom-popup-empty";
    div8.style.gridColumn = "1 / -1";
    div8.style.gridRow = "1 / -1";
    div8.textContent = "点击“添加模块”开始组合弹窗";
    div7.append(div8);
  }
  div6.append(div7);
  div5.append(div6);
  temp.append(div2, div5);
  customPopupEditor.append(temp);
  window.requestAnimationFrame(syncCustomPopupStage);
}
function openPopupModuleDialog(component = null) {
  if (!findCustomPopup(currentProject?.document, selectedPopupId)) {
    return;
  }
  editingPopupModuleId = component?.id || null;
  popupModuleDialogTitle.textContent = component ? "编辑弹窗模块" : "添加弹窗模块";
  const value = component?.type === "capability-device" ? "generic" : component?.type;
  popupModuleForm.elements.type.value = ["light", "climate", "air-purifier", "water-heater", "media-player", "electric-bed", "switch", "cover", "camera", "line-chart", "generic"].includes(value) ? value : "light";
  syncCustomSelect(popupModuleForm.elements.type);
  const flag = entityCatalog.find(item => popupModuleEntityRecommended(item, popupModuleForm.elements.type.value)) || entityCatalog[0];
  popupModuleForm.elements.entityId.value = component?.entityId || flag?.entityId || "";
  popupModuleForm.elements.title.value = component?.title || "";
  syncPopupModuleClimateFields(component?.properties?.deviceType || component?.deviceType || "auto");
  popupModuleEntitySearch.value = "";
  syncPopupModuleEntityButton();
  popupModuleEntityOptions.replaceChildren();
  closePopupModuleEntityMenu();
  popupModuleDialog.showModal();
}
function renderList2(value, param = null) {
  pageSelect.replaceChildren();
  if (!value.pages.length) {
    pageSelect.append(new Option("暂无页面", ""));
    pageSelect.disabled = true;
    syncCustomSelect(pageSelect);
    return false;
  }
  const chosen = value.pages.some(component => component.path === value.defaultPagePath) ? value.defaultPagePath : null;
  for (const temp of value.pages) {
    const temp2 = new Option(temp.name, temp.path);
    temp2.dataset.defaultPage = String(temp.path === chosen);
    pageSelect.append(temp2);
  }
  pageSelect.disabled = false;
  pageSelect.value = param && value.pages.some(component => component.path === param) ? param : chosen || value.pages[0].path;
  syncCustomSelect(pageSelect);
  return true;
}
function applyRendererSelection(value, param) {
  const chosen = selectedComponentIds.size ? [...selectedComponentIds] : componentId ? [componentId] : [];
  selectedComponentIds = new Set(chosen.filter(item => {
    const temp = findComponent(value, item);
    return temp && (temp.scope !== "page" || temp.page?.path === param);
  }));
  if (!selectedComponentIds.has(componentId)) {
    componentId = selectedComponentIds.values().next().value || null;
  }
  if (!componentId) {
    rangeSelectAnchorId = null;
  }
}
const pendingAssetFolderDeletes = new Set();
function onRendererDocumentChange(value, param, param2) {
  if (editorMode !== "edit" || !editorRenderer || editorRenderer.page?.path !== param2 || editorDocumentFrameSignature(value) !== editorDocumentFrameSignature(param)) {
    return null;
  }
  const temp = editorComponentEntries(value);
  const temp2 = editorComponentEntries(param);
  if (temp.order.length !== temp2.order.length || temp.order.some((item, index) => item !== temp2.order[index]) || temp.entries.size !== temp2.entries.size) {
    return null;
  }
  const list = [];
  for (const [componentId, temp3] of temp.entries) {
    const temp4 = temp2.entries.get(componentId);
    if (!temp4 || temp3.scope !== temp4.scope || temp3.pagePath !== temp4.pagePath || temp3.parentId !== temp4.parentId || pendingAssetFolderDeletes.has(temp3.component.type) || editorComponentStructure(temp3.component) !== editorComponentStructure(temp4.component)) {
      return null;
    }
    if (JSON.stringify(temp3.component) !== JSON.stringify(temp4.component)) {
      if (!editorRenderer.componentHosts.has(componentId)) {
        return null;
      }
      list.push({
        componentId,
        component: temp4.component
      });
    }
  }
  if (list.length) {
    return list;
  } else {
    return null;
  }
}
function selectedComponent2(value, fallback) {
  const component = findComponent(currentProject?.document, value)?.component;
  if (!component || value !== componentId) {
    return;
  }
  const numeric = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number = Number(component.position?.width || 100);
  const number2 = Number(component.position?.height || 100);
  const chosen = Number.isFinite(fallback.width) ? fallback.width : number;
  const chosen2 = Number.isFinite(fallback.height) ? fallback.height : number2;
  const includesValue = ["icon-button", "device-button", "presence-sensor"].includes(component.type);
  const element = component.type === "title-button" ? titleButtonLeft : component.type === "light-statistics" ? lightStatisticsLeft : includesValue ? iconButtonLeft : component.type === "air-conditioner" ? airConditionerLeft : component.type === "vacuum-map" ? vacuumMapLeft : component.type === "camera" ? cameraLeft : component.type === "icon-button-effect" ? ibeLeft : component.type === "navigation-button" ? navigationLeft : component.type === "time" ? timeLeft : component.type === "date" ? dateLeft : component.type === "weather" ? weatherLeft : component.type === "line-chart" ? lineChartLeft : component.type === "panel-frame" ? panelFrameLeft : imageLeft;
  const chosen3 = component.type === "title-button" ? titleButtonTop : component.type === "light-statistics" ? lightStatisticsTop : includesValue ? iconButtonTop : component.type === "air-conditioner" ? airConditionerTop : component.type === "vacuum-map" ? vacuumMapTop : component.type === "camera" ? cameraTop : component.type === "icon-button-effect" ? ibeTop : component.type === "navigation-button" ? navigationTop : component.type === "time" ? timeTop : component.type === "date" ? dateTop : component.type === "weather" ? weatherTop : component.type === "line-chart" ? lineChartTop : component.type === "panel-frame" ? panelFrameTop : imageTop;
  const chosen4 = component.type === "title-button" ? titleButtonScale : component.type === "light-statistics" ? lightStatisticsScale : includesValue ? iconButtonScale : component.type === "air-conditioner" ? airConditionerScale : component.type === "vacuum-map" ? vacuumMapScale : component.type === "camera" ? cameraScale : component.type === "icon-button-effect" ? ibeScale : component.type === "navigation-button" ? navigationScale : component.type === "time" ? timeScale : component.type === "date" ? dateScale : component.type === "weather" ? weatherScale : component.type === "line-chart" ? lineChartScale : component.type === "panel-frame" ? panelFrameScale : imageScale;
  const chosen5 = component.type === "title-button" ? titleButtonRotation : component.type === "light-statistics" ? lightStatisticsRotation : includesValue ? iconButtonRotation : component.type === "air-conditioner" ? airConditionerRotation : component.type === "vacuum-map" ? vacuumMapRotation : component.type === "camera" ? cameraRotation : component.type === "icon-button-effect" ? ibeRotation : component.type === "navigation-button" ? navigationRotation : component.type === "time" ? timeRotation : component.type === "date" ? dateRotation : component.type === "weather" ? weatherRotation : component.type === "line-chart" ? lineChartRotation : component.type === "panel-frame" ? panelFrameRotation : imageRotation;
  if (Number.isFinite(fallback.x)) {
    element.value = roundField(clampNumber((fallback.x + chosen / 2) / numeric * 100, 0, 100));
  }
  if (Number.isFinite(fallback.y)) {
    chosen3.value = roundField(clampNumber((fallback.y + chosen2 / 2) / canvasHeight * 100, 0, 100));
  }
  if (component.type === "navigation-button" && Number.isFinite(fallback.width)) {
    navigationWidth.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "navigation-button" && Number.isFinite(fallback.height)) {
    navigationHeight.value = roundField(clampNumber(fallback.height / canvasHeight * 100, 0.1, 100));
  }
  if (component.type === "icon-button-effect" && Number.isFinite(fallback.width)) {
    ibeWidth.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "icon-button-effect" && Number.isFinite(fallback.height)) {
    ibeHeight.value = roundField(clampNumber(fallback.height / canvasHeight * 100, 0.1, 100));
  }
  if (component.type === "title-button" && Number.isFinite(fallback.width)) {
    titleButtonWidth.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "title-button" && Number.isFinite(fallback.height)) {
    titleButtonHeight.value = roundField(clampNumber(fallback.height / canvasHeight * 100, 0.1, 100));
  }
  if (component.type === "light-statistics" && Number.isFinite(fallback.width)) {
    lightStatisticsWidth.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "light-statistics" && Number.isFinite(fallback.height)) {
    lightStatisticsHeight.value = roundField(clampNumber(fallback.height / canvasHeight * 100, 0.1, 100));
  }
  if (includesValue && Number.isFinite(fallback.width)) {
    iconButtonWidth.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (includesValue && Number.isFinite(fallback.height)) {
    iconButtonHeight.value = roundField(clampNumber(fallback.height / canvasHeight * 100, 0.1, 100));
  }
  if (component.type === "camera" && Number.isFinite(fallback.width)) {
    cameraWidth.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "camera" && Number.isFinite(fallback.height)) {
    cameraHeight.value = roundField(clampNumber(fallback.height / canvasHeight * 100, 0.1, 100));
  }
  if (component.type === "air-conditioner" && Number.isFinite(fallback.width)) {
    airConditionerWidth.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "air-conditioner" && Number.isFinite(fallback.height)) {
    airConditionerHeight.value = roundField(clampNumber(fallback.height / canvasHeight * 100, 0.1, 100));
  }
  if (component.type === "line-chart" && Number.isFinite(fallback.width)) {
    lineChartWidth.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "line-chart" && Number.isFinite(fallback.height)) {
    lineChartHeight.value = roundField(clampNumber(fallback.height / canvasHeight * 100, 0.1, 100));
  }
  if (component.type === "panel-frame" && Number.isFinite(fallback.width)) {
    panelFrameWidth.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "panel-frame" && Number.isFinite(fallback.height)) {
    panelFrameHeight.value = roundField(clampNumber(fallback.height / canvasHeight * 100, 0.1, 100));
  }
  if (Number.isFinite(fallback.scale)) {
    chosen4.value = roundField(fallback.scale * 100);
  }
  if (Number.isFinite(fallback.rotation)) {
    chosen5.value = roundField(fallback.rotation);
  }
}
function createPanelRenderer() {
  return editorRenderer || (editorRenderer = new PanelRenderer(editorCanvas, {
    editable: true,
    historySeriesCache: historySeriesCache,
    runtimeStateCache: runtimeStateCache,
    virtualEntityStateCache: virtualEntityStateCache,
    onComponentTransform(value, param) {
      componentId = value;
      selectedComponentIds = new Set([value]);
      mutateDocument(item => {
        const component = findComponent(item, value)?.component;
        if (!component) {
          return;
        }
        const temp = readAirConditionerProperty(component, "width");
        const temp2 = readAirConditionerProperty(component, "height");
        const temp3 = readAirConditionerProperty(component, "scale");
        const temp4 = readAirConditionerProperty(component, "rotation");
        const {
          scale,
          airflowOffsetX,
          airflowOffsetY,
          ...alias
        } = param;
        component.position = {
          ...(component.position || {}),
          ...alias
        };
        if (Number.isFinite(scale)) {
          component.style = {
            ...(component.style || {}),
            scale
          };
        }
        if (component.type === "air-conditioner" && (Number.isFinite(airflowOffsetX) || Number.isFinite(airflowOffsetY))) {
          component.properties = {
            ...(component.properties || {}),
            ...(Number.isFinite(airflowOffsetX) ? {
              airflowOffsetX
            } : {}),
            ...(Number.isFinite(airflowOffsetY) ? {
              airflowOffsetY
            } : {})
          };
        }
        if (component.type === "navigation-button" && Number.isFinite(param.width)) {
          buildIdMap2(value, "width", temp, readAirConditionerProperty(component, "width"));
        }
        if (component.type === "navigation-button" && Number.isFinite(param.height)) {
          buildIdMap2(value, "height", temp2, readAirConditionerProperty(component, "height"));
        }
        if (component.type === "navigation-button" && Number.isFinite(param.scale)) {
          buildIdMap2(value, "scale", temp3, readAirConditionerProperty(component, "scale"));
        }
        if (component.type === "navigation-button" && Number.isFinite(param.rotation)) {
          buildIdMap2(value, "rotation", temp4, readAirConditionerProperty(component, "rotation"));
        }
      });
    },
    onComponentsTransform(value, param) {
      componentId = param;
      mutateDocument(item => {
        for (const temp of value) {
          const component = findComponent(item, temp.componentId)?.component;
          if (component) {
            component.position = {
              ...(component.position || {}),
              ...(Number.isFinite(temp.x) ? {
                x: temp.x
              } : {}),
              ...(Number.isFinite(temp.y) ? {
                y: temp.y
              } : {}),
              ...(Number.isFinite(temp.rotation) ? {
                rotation: temp.rotation
              } : {})
            };
            if (Number.isFinite(temp.scale)) {
              component.style = {
                ...(component.style || {}),
                scale: temp.scale
              };
            }
          }
        }
      });
    },
    onComponentDuplicate(value, component) {
      componentId = component.id;
      selectedComponentIds = new Set([component.id]);
      rangeSelectAnchorId = component.id;
      mutateDocument(item => {
        removeComponentById(item, value, component, false);
      });
    },
    onComponentsDuplicate(value, param, param2) {
      const mapped = value.map(item => item.copiedComponent.id);
      componentId = param2 || mapped[0] || null;
      selectedComponentIds = new Set(mapped);
      rangeSelectAnchorId = componentId;
      mutateDocument(item => {
        for (const temp of value) {
          removeComponentById(item, temp.sourceComponentId, temp.copiedComponent, false);
        }
      });
    },
    onComponentTransformPreview(value, param) {
      selectedComponent2(value, param);
    },
    onComponentProperties(value, param) {
      mutateDocument(item => {
        const component = findComponent(item, value)?.component;
        if (!!component && !!["air-conditioner", "presence-sensor"].includes(component.type) && (component.type !== "presence-sensor" || component.properties?.sensorKind === "door-window")) {
          component.properties = {
            ...(component.properties || {}),
            ...param
          };
        }
      });
    },
    onComponentPropertiesPreview(value, param) {
      if (value === componentId) {
        if (Number.isFinite(param.airflowScale)) {
          airConditionerAirflowScale.value = roundField(param.airflowScale * 100);
        }
        if (Number.isFinite(param.airflowRotation)) {
          airConditionerAirflowRotation.value = roundField(param.airflowRotation);
        }
        if (Number.isFinite(param.airflowOffsetX)) {
          airConditionerAirflowOffsetX.value = roundField(param.airflowOffsetX);
        }
        if (Number.isFinite(param.airflowOffsetY)) {
          airConditionerAirflowOffsetY.value = roundField(param.airflowOffsetY);
        }
      }
    },
    onComponentsTransformPreview(value, param) {
      componentId = param;
      const found = value.find(item => item.componentId === param);
      if (found) {
        selectedComponent2(param, found);
      }
    },
    onError,
    onRuntimeStateChange() {
      const value = selectedComponent();
      if (value?.type === "light-statistics") {
        syncLightStatisticsEntityButton(value);
      }
    },
    onPageChange(value) {
      pageSelect.value = value.path;
      syncCustomSelect(pageSelect);
      applyRendererSelection(currentProject?.document, value.path);
      editorRenderer?.setSelectedComponents([...selectedComponentIds], componentId);
      renderComponentTree();
      refreshInspector();
    }
  }), editorRenderer.setEntityCatalog(entityCatalog, entityStateById, deviceCatalog), editorRenderer);
}
function refreshEditorChrome(value = null) {
  renderUiPackSummary();
  syncDashboardSoundToggle();
  syncCanvasSizeFields();
  renderPopupList(currentProject.document, selectedPopupId);
  const temp = renderList2(currentProject.document, value);
  setPageControlsEnabled(temp);
  fitWorkspaceToCanvas();
  if (!temp) {
    clearSelection();
    editorRenderer?.destroy();
    editorRenderer = null;
    editorCanvas.innerHTML = "<div class=\"canvas-message\"><strong>请从左侧新建页面。</strong></div>";
    renderComponentTree();
    refreshInspector();
    renderDashboardPreview(value);
    if (editorMode === "popup") {
      renderList();
    }
    return;
  }
  applyRendererSelection(currentProject.document, pageSelect.value);
  if (editorMode === "edit") {
    createPanelRenderer().setDocument(currentProject.document, pageSelect.value);
    editorRenderer.setActiveGroup(activeGroupId);
    editorRenderer.setSelectedComponents([...selectedComponentIds], componentId);
  } else {
    editorRenderer?.destroy();
    editorRenderer = null;
  }
  renderComponentTree();
  refreshInspector();
  if (editorMode === "dashboard") {
    renderDashboardPreview(pageSelect.value);
  } else if (editorMode === "popup") {
    renderList();
  } else {
    destroyDashboardPreview();
  }
}
function syncHistoryButtons() {
  undoBtn.disabled = historyState.busy || !historyState.undo.length || !currentProject;
  redoBtn.disabled = historyState.busy || !historyState.redo.length || !currentProject;
}
function readRecoveredDraft(value = currentProject?.projectId) {
  if (value) {
    recoveryWriter.cancel(value);
    try {
      sessionStorage.removeItem(recoveryStorageKey(unsavedStoragePrefix, value));
    } catch {}
  }
}
function readRecoveredDraft2(value) {
  try {
    const temp = sessionStorage.getItem(recoveryStorageKey(unsavedStoragePrefix, value));
    if (!temp) {
      return null;
    }
    const payload = JSON.parse(temp);
    if (!payload?.document || payload.projectId !== value) {
      return null;
    } else {
      return payload;
    }
  } catch {
    return null;
  }
}
const recoveryWriter = createRecoveryWriter(readRecoveredDraft3);
window.addEventListener("pagehide", recoveryWriter.flush);
window.addEventListener("beforeunload", recoveryWriter.flush);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    recoveryWriter.flush();
  }
});
function persistUnsavedDraft() {
  if (!currentProject || !documentDirty) {
    return;
  }
  const value = {
    projectId: currentProject.projectId,
    revision: currentProject.revision,
    document: currentProject.document,
    selectedPath: pageSelect.value,
    selectedComponentId: componentId,
    selectedComponentIds: [...selectedComponentIds],
    undo: [...historyState.undo],
    redo: [...historyState.redo],
    savedAt: new Date().toISOString()
  };
  recoveryWriter.schedule(value);
}
function readRecoveredDraft3(projectId2) {
  try {
    sessionStorage.setItem(recoveryStorageKey(unsavedStoragePrefix, projectId2.projectId), JSON.stringify(projectId2));
  } catch {
    try {
      sessionStorage.setItem(recoveryStorageKey(unsavedStoragePrefix, projectId2.projectId), JSON.stringify({
        projectId: projectId2.projectId,
        revision: projectId2.revision,
        document: projectId2.document,
        selectedPath: projectId2.selectedPath,
        selectedComponentId: projectId2.selectedComponentId,
        selectedComponentIds: projectId2.selectedComponentIds,
        undo: [],
        redo: [],
        savedAt: projectId2.savedAt
      }));
    } catch {}
  }
}
function syncDocumentDirtyState({
  preserveRecovery: param = false
} = {}) {
  documentDirty = !!currentProject && documentSignature(currentProject.document) !== lastSavedSignature;
  saveBtn.disabled = !currentProject || !documentDirty || isPastingComponents;
  if (documentDirty) {
    persistUnsavedDraft();
  } else if (!param) {
    readRecoveredDraft();
  }
}
function resetHistory() {
  historyState.undo = [];
  historyState.redo = [];
  historyState.busy = false;
  syncHistoryButtons();
}
function pushHistoryEntry(value, param) {
  for (value.push(param); value.filter(item => item.kind !== "save").length > maxHistoryEntries;) {
    const temp = value.findIndex(item => item.kind !== "save");
    if (temp < 0) {
      break;
    }
    value.splice(temp, 1);
  }
  if (value.length > maxHistoryEntries * 2) {
    value.splice(0, value.length - maxHistoryEntries * 2);
  }
}
function captureHistorySnapshot() {
  return {
    kind: "edit",
    document: cloneValue(currentProject.document),
    selectedPath: pageSelect.value,
    selectedComponentId: componentId,
    selectedComponentIds: [...selectedComponentIds]
  };
}
async function loadProjectDraft(projectId, value = null) {
  recoveryWriter.flush();
  window.HABridgeLog?.setContext({
    projectId
  });
  currentProject = await apiFetch("/projects/" + projectId + "/draft");
  colorPickerDraftHex = "";
  let temp = currentUiPack(currentUiPackId(currentProject.document));
  if (!temp) {
    await loadUiPacks();
    temp = currentUiPack(currentUiPackId(currentProject.document));
  }
  if (!temp?.allowed) {
    throw new Error("当前授权尚未解锁该 UI 方案。");
  }
  await ensureUiPackRuntime(temp);
  componentBoundsCache.clear();
  entityOptionCache.clear();
  iconOptionCache.clear();
  assetOptionCache.clear();
  popupEntityOptionCache.clear();
  relatedEntityOptionCache.clear();
  autosaveTimer = cloneValue(currentProject.document);
  lastSavedSignature = documentSignature(currentProject.document);
  recoveredDraft = readRecoveredDraft2(projectId);
  if (recoveredDraft && (recoveredDraft.revision !== currentProject.revision || documentSignature(recoveredDraft.document) === lastSavedSignature)) {
    readRecoveredDraft(projectId);
    recoveredDraft = null;
  }
  clearSelection();
  resetHistory();
  syncDocumentDirtyState({
    preserveRecovery: !!recoveredDraft
  });
  setWorkspaceEmpty(true);
  projectSelect.value = projectId;
  syncCustomSelect(projectSelect);
  refreshEditorChrome(value);
  if (recoveredDraft && !recoveryDialog.open) {
    recoveryDialog.showModal();
  }
}
async function loadProjectList(param = null) {
  projectList = (await apiFetch("/projects")).items || [];
  projectSelect.replaceChildren();
  if (!projectList.length) {
    editorRenderer?.destroy();
    editorRenderer = null;
    destroyDashboardPreview();
    currentProject = null;
    renderUiPackSummary();
    componentBoundsCache.clear();
    entityOptionCache.clear();
    iconOptionCache.clear();
    assetOptionCache.clear();
    popupEntityOptionCache.clear();
    relatedEntityOptionCache.clear();
    clearSelection();
    autosaveTimer = null;
    lastSavedSignature = "";
    recoveredDraft = null;
    resetHistory();
    syncDocumentDirtyState();
    setWorkspaceEmpty(false);
    setPageControlsEnabled(false);
    projectSelect.append(new Option("暂无仪表盘", ""));
    pageSelect.replaceChildren(new Option("暂无页面", ""));
    popupSelect.replaceChildren(new Option("暂无组合弹窗", ""));
    popupList.innerHTML = "<div class=\"popup-list-empty\">还没有组合弹窗</div>";
    projectSelect.disabled = true;
    pageSelect.disabled = true;
    popupSelect.disabled = true;
    popupActionsButton.disabled = true;
    syncCustomSelect(projectSelect);
    syncCustomSelect(pageSelect);
    syncCustomSelect(popupSelect);
    renderComponentTree();
    renderDashboardPreview();
    return;
  }
  for (const name14 of projectList) {
    projectSelect.append(new Option(name14.name, name14.id));
  }
  projectSelect.disabled = false;
  syncCustomSelect(projectSelect);
  const chosen = param && projectList.some(component => component.id === param) ? param : projectList[0].id;
  await loadProjectDraft(chosen);
}
async function commitDocumentEdit(value, param = pageSelect.value, {
  recordHistory: item = true
} = {}) {
  if (!currentProject) {
    throw new Error("请先选择仪表盘。");
  }
  const document = currentProject.document;
  await guardInteraction3dChanges(document, value);
  const temp = onRendererDocumentChange(document, value, param);
  const temp2 = captureHistorySnapshot();
  if (documentSignature(temp2.document) === documentSignature(value)) {
    return currentProject;
  }
  currentProject = {
    ...currentProject,
    document: cloneValue(value)
  };
  if (item) {
    pushHistoryEntry(historyState.undo, temp2);
    historyState.redo = [];
  }
  const found = projectList.find(component => component.id === currentProject.projectId);
  if (found) {
    found.name = currentProject.document.name;
  }
  const element = projectSelect.selectedOptions[0];
  if (element) {
    element.textContent = currentProject.document.name;
  }
  syncCustomSelect(projectSelect);
  if (temp && editorRenderer?.applyEditorComponentUpdates(currentProject.document, param, temp)) {
    renderComponentTree();
    refreshInspector();
  } else {
    refreshEditorChrome(param);
  }
  syncDocumentDirtyState();
  syncHistoryButtons();
  return currentProject;
}
async function autosaveDocument() {
  if (!currentProject || !documentDirty || isPastingComponents) {
    return;
  }
  const beforeSavedDocument = cloneValue(autosaveTimer);
  const value = cloneValue(currentProject.document);
  const temp = documentSignature(value);
  const globalPopupsDirty = documentSignature(value.customPopups || []) !== documentSignature(autosaveTimer.customPopups || []);
  isPastingComponents = true;
  syncDocumentDirtyState();
  try {
    const asyncResult = await apiFetch("/projects/" + currentProject.projectId + "/draft", {
      method: "PUT",
      hbLogContext: {
        projectId: currentProject.projectId,
        phase: "save-draft"
      },
      body: JSON.stringify({
        revision: currentProject.revision,
        globalPopupRevision: currentProject.globalPopupRevision,
        globalPopupsDirty,
        document: currentProject.document
      })
    });
    currentProject = asyncResult;
    autosaveTimer = cloneValue(asyncResult.document);
    lastSavedSignature = documentSignature(asyncResult.document);
    entityOptionCache.clear();
    iconOptionCache.clear();
    assetOptionCache.clear();
    popupEntityOptionCache.clear();
    relatedEntityOptionCache.clear();
    pushHistoryEntry(historyState.undo, {
      kind: "save",
      beforeSavedDocument,
      afterSavedDocument: cloneValue(asyncResult.document)
    });
    historyState.redo = [];
    const found = projectList.find(component => component.id === currentProject.projectId);
    if (found) {
      found.name = currentProject.document.name;
    }
    const element = projectSelect.selectedOptions[0];
    if (element) {
      element.textContent = currentProject.document.name;
    }
    syncCustomSelect(projectSelect);
    if (documentSignature(asyncResult.document) !== temp) {
      refreshEditorChrome(pageSelect.value);
    }
  } catch (error) {
    onError(error);
  } finally {
    isPastingComponents = false;
    syncDocumentDirtyState();
    syncHistoryButtons();
  }
}
async function fetchHelper(value, param) {
  const document = param === "undo" ? value.beforeSavedDocument : value.afterSavedDocument;
  const globalPopupsDirty = documentSignature(document.customPopups || []) !== documentSignature(autosaveTimer.customPopups || []);
  const document2 = cloneValue(currentProject.document);
  const inputValue = pageSelect.value;
  const temp = await apiFetch("/projects/" + currentProject.projectId + "/draft", {
    method: "PUT",
    body: JSON.stringify({
      revision: currentProject.revision,
      globalPopupRevision: currentProject.globalPopupRevision,
      globalPopupsDirty,
      document
    })
  });
  autosaveTimer = cloneValue(temp.document);
  lastSavedSignature = documentSignature(temp.document);
  if (!globalPopupsDirty) {
    document2.customPopups = cloneValue(temp.document.customPopups || []);
  }
  currentProject = {
    ...temp,
    document: document2
  };
  refreshEditorChrome(inputValue);
  syncDocumentDirtyState();
}
async function mutateDocument2(param) {
  await documentMutationQueue.catch(() => {});
  if (historyState.busy || !currentProject) {
    return;
  }
  const flag = param === "undo" ? historyState.undo : historyState.redo;
  const chosen = param === "undo" ? historyState.redo : historyState.undo;
  const document2 = flag.pop();
  if (document2) {
    historyState.busy = true;
    syncHistoryButtons();
    entityOptionCache.clear();
    iconOptionCache.clear();
    assetOptionCache.clear();
    popupEntityOptionCache.clear();
    relatedEntityOptionCache.clear();
    try {
      if (document2.kind === "save") {
        await fetchHelper(document2, param);
        pushHistoryEntry(chosen, document2);
      } else {
        const temp = captureHistorySnapshot();
        const length3 = Array.isArray(document2.selectedComponentIds) ? document2.selectedComponentIds.filter(item => findComponent(document2.document, item)) : [];
        componentId = findComponent(document2.document, document2.selectedComponentId) ? document2.selectedComponentId : length3[0] || null;
        selectedComponentIds = new Set(length3.length ? length3 : componentId ? [componentId] : []);
        rangeSelectAnchorId = componentId;
        await commitDocumentEdit(document2.document, document2.selectedPath, {
          recordHistory: false
        });
        pushHistoryEntry(chosen, temp);
      }
    } catch (temp) {
      pushHistoryEntry(flag, document2);
      onError(temp);
    } finally {
      historyState.busy = false;
      syncHistoryButtons();
      if (documentDirty) {
        persistUnsavedDraft();
      }
    }
  }
}
async function fetchAuthMe() {
  const value = await apiFetch("/auth/me");
}
async function loadHaConnection({
  preserveForm: param = false
} = {}) {
  haConnection = await apiFetch("/ha/connection");
  const flag = haDialog.open && !haForm.hidden;
  if (!param || !haFormEditing && !flag) {
    haForm.elements.name.value = haConnection.name || "Home Assistant";
    haForm.elements.baseUrl.value = haConnection.baseUrl || "";
    haForm.elements.accessToken.value = "";
    haForm.elements.accessToken.placeholder = haConnection.hasToken ? "已加密保存，留空则保留原 Token" : "输入 Long-Lived Access Token";
    haForm.elements.verifyTls.checked = haConnection.verifyTls !== false;
  }
  const flag2 = !haConnection.connected && !!haConnection.lastError;
  haOpenBtn.classList.toggle("connected", haConnection.connected);
  haOpenBtn.classList.toggle("error", flag2);
  haOpenBtn.querySelector("span").textContent = haConnection.connected ? ("HA 已连接 · " + (haConnection.version || "")).trim() : haConnection.lastError ? "HA 连接异常" : haConnection.configured ? "HA 重连中" : "HA 未配置";
  openHomeAssistant.disabled = !haConnection.configured || !haConnection.baseUrl;
  syncHaConnectionPanels();
}
async function loadHaSyncStatus() {
  const value = await apiFetch("/ha/sync/status");
  haSyncStatus = value;
  const flag = value.counts || {
    entities: 0,
    devices: 0,
    areas: 0
  };
  haSyncState.textContent = value.configured ? value.connected ? "已连接并实时同步" : value.status === "error" ? "连接异常" : "正在连接或同步" : "尚未配置";
  haSyncDetail.textContent = "实体 " + flag.entities + " · 设备 " + flag.devices + " · 区域 " + flag.areas;
  syncHaConnectionPanels();
  if (!value.configured) {
    entityLoadError = null;
    entitiesLoaded = false;
    if (entityCatalog.length || deviceCatalog.length || Object.keys(entityStateById).length) {
      entityCatalog = [];
      deviceCatalog = [];
      entityById = new Map();
      entityStateById = {};
      editorRenderer?.setEntityCatalog([], {}, []);
      dashboardPreviewRenderer?.setEntityCatalog([], {}, []);
      syncPopupEntityFields();
      if (!document.activeElement?.closest?.(".inspector-form")) {
        refreshInspector();
      }
    }
    return;
  }
  const temp = JSON.stringify([Number.isFinite(Number(value.catalogRevision)) ? Number(value.catalogRevision) : value.lastFullSyncAt || "", Number(flag.entities || 0), Number(flag.devices || 0), Number(flag.areas || 0)]);
  if ((value.connected || value.status === "connected") && temp !== entityLoadError) {
    const alias = entityLoadError;
    entityLoadError = temp;
    try {
      await ensureEntitiesLoaded({
        afterCurrent: true
      });
    } catch (error) {
      if (entityLoadError === temp) {
        entityLoadError = alias;
      }
      throw error;
    }
  }
}
function syncHaConnectionPanels() {
  const value = !!haConnection?.configured;
  haConnectionView.hidden = !value || haFormEditing;
  haForm.hidden = value && !haFormEditing;
  haSyncOverview.hidden = value && !haFormEditing;
  haEditCancelBtn.hidden = !value || !haFormEditing;
  if (!value) {
    return;
  }
  const flag = haSyncStatus?.counts || {
    entities: 0,
    devices: 0,
    areas: 0
  };
  const flag2 = !!haConnection.connected || !!haSyncStatus?.connected;
  const flag3 = !flag2 && (!!haConnection.lastError || !!haSyncStatus?.lastError);
  haDetailIndicator.classList.toggle("connected", flag2);
  haDetailIndicator.classList.toggle("error", flag3);
  haDetailName.textContent = haConnection.name || "Home Assistant";
  haDetailStatus.textContent = flag2 ? "已连接并实时同步" : flag3 ? "连接异常" : "正在重连";
  haDetailUrl.textContent = haConnection.baseUrl || "—";
  haDetailUrl.title = haConnection.baseUrl || "";
  haDetailVersion.textContent = haConnection.version || "未知";
  haDetailCounts.textContent = "实体 " + flag.entities + " · 设备 " + flag.devices + " · 区域 " + flag.areas;
  haDetailError.hidden = !flag3;
  haDetailError.textContent = flag3 && (haConnection.lastError || haSyncStatus?.lastError) || "";
}
function startHaFormEdit() {
  haFormEditing = true;
  syncHaConnectionPanels();
  setStatusMessage(haMessage, "");
}
function cancelHaFormEdit() {
  haFormEditing = false;
  syncHaConnectionPanels();
}
function delay(param) {
  return new Promise(param2 => window.setTimeout(param2, param));
}
async function ensureHaBootstrap({
  preserveForm = true
} = {}) {
  return haBootstrapPromise || (haBootstrapPromise = Promise.all([loadHaConnection({
    preserveForm
  }), loadHaSyncStatus()]).finally(() => {
    haBootstrapPromise = null;
  }), haBootstrapPromise);
}
async function waitForHaConnection(value = 30000) {
  const temp = Date.now() + value;
  while (Date.now() < temp) {
    await ensureHaBootstrap({
      preserveForm: false
    });
    if (haConnection?.connected) {
      return true;
    }
    if (haConnection?.lastError) {
      return false;
    }
    await delay(500);
  }
  return !!haConnection?.connected;
}
function readHaFormPayload(value = false) {
  const flag = new FormData(haForm);
  const list = String(flag.get("accessToken") || "").trim();
  if (value && !list) {
    throw new Error("测试连接时请输入 Home Assistant Token。");
  }
  return {
    name: String(flag.get("name") || "").trim(),
    baseUrl: String(flag.get("baseUrl") || "").trim(),
    accessToken: list || null,
    verifyTls: flag.get("verifyTls") === "on"
  };
}
function selectProjectTemplate(param = selectedProjectTemplateId) {
  const some2 = uiPacks.find(component => component.id === "ui.base")?.dashboardTemplates || [];
  selectedProjectTemplateId = param === "" || some2.some(component => component.id === param) ? param : some2[0]?.id || "";
  const list2 = [{
    id: "",
    name: "空白仪表盘",
    description: "使用栖光 UI 创建空白画布，不预置页面、控件或弹窗。",
    previewUrls: [],
    previewLabels: [],
    canvasWidth: null,
    canvasHeight: null
  }, ...some2.map(component => ({
    id: component.id,
    name: component.name,
    description: component.description + " · v" + component.version,
    previewUrls: component.previewUrls || [],
    previewLabels: component.previewLabels || [],
    canvasWidth: Number(component.canvasWidth || 2778),
    canvasHeight: Number(component.canvasHeight || 1940)
  }))];
  projectTemplateOptions.replaceChildren(...list2.map(previewUrls => {
    const dataset4 = document.createElement("div");
    dataset4.className = "project-template-option" + (previewUrls.id === selectedProjectTemplateId ? " active" : "");
    dataset4.dataset.projectTemplateId = previewUrls.id;
    dataset4.dataset.previewUrls = JSON.stringify(previewUrls.previewUrls);
    dataset4.dataset.previewLabels = JSON.stringify(previewUrls.previewLabels);
    dataset4.dataset.previewIndex = "0";
    dataset4.setAttribute("role", "radio");
    dataset4.setAttribute("aria-checked", String(previewUrls.id === selectedProjectTemplateId));
    dataset4.tabIndex = 0;
    const className3 = document.createElement("div");
    className3.className = "project-template-carousel" + (previewUrls.previewUrls.length ? "" : " blank");
    if (previewUrls.previewUrls.length) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "project-template-preview-open";
      button.dataset.projectPreviewAction = "open";
      button.title = "点击放大预览";
      const src = document.createElement("img");
      src.src = previewUrls.previewUrls[0];
      src.alt = previewUrls.previewLabels[0] || previewUrls.name + "预览 1";
      src.loading = "eager";
      button.append(src);
      const button2 = document.createElement("button");
      button2.type = "button";
      button2.className = "project-template-carousel-arrow previous";
      button2.dataset.projectPreviewAction = "previous";
      button2.setAttribute("aria-label", "上一张预览");
      button2.textContent = "‹";
      const button3 = document.createElement("button");
      button3.type = "button";
      button3.className = "project-template-carousel-arrow next";
      button3.dataset.projectPreviewAction = "next";
      button3.setAttribute("aria-label", "下一张预览");
      button3.textContent = "›";
      const className = document.createElement("div");
      className.className = "project-template-carousel-meta";
      const textContent = document.createElement("strong");
      textContent.textContent = previewUrls.previewLabels[0] || "栖光预览";
      const textContent2 = document.createElement("span");
      textContent2.textContent = "1 / " + previewUrls.previewUrls.length;
      className.append(textContent, textContent2);
      className3.append(button, button2, button3, className);
    } else {
      className3.replaceChildren(...Array.from({
        length: 4
      }, () => document.createElement("i")));
    }
    const textContent3 = document.createElement("strong");
    textContent3.textContent = previewUrls.name;
    const textContent4 = document.createElement("span");
    textContent4.textContent = previewUrls.description;
    dataset4.append(className3, textContent3, textContent4);
    return dataset4;
  }));
  projectCanvasFields.hidden = false;
  if (projectDialogMode === "create") {
    const found = list2.find(component => component.id === selectedProjectTemplateId);
    projectForm.elements.name.value = found?.id ? found.name : "我的仪表盘";
    const readOnly = !!found?.id;
    projectCanvasWidth.readOnly = readOnly;
    projectCanvasHeight.readOnly = readOnly;
    projectCanvasWidth.value = String(readOnly ? found.canvasWidth : defaultCanvasWidth);
    projectCanvasHeight.value = String(readOnly ? found.canvasHeight : defaultCanvasHeight);
    projectCanvasFields.classList.toggle("fixed", readOnly);
    projectCanvasFields.classList.remove("name-only");
    projectCanvasHint.textContent = readOnly ? "栖光使用固定画布分辨率，创建时会完整保留页面布局与比例。" : "编辑器和仪表盘将共用该分辨率与比例，显示时只做等比缩放。";
    readProjectCanvasSize();
    syncProjectAspectLockUi(readOnly);
  }
}
function parseTemplatePreviewMeta(value) {
  try {
    return {
      urls: JSON.parse(value.dataset.previewUrls || "[]"),
      labels: JSON.parse(value.dataset.previewLabels || "[]")
    };
  } catch {
    return {
      urls: [],
      labels: []
    };
  }
}
function showTemplatePreviewAt(value, param) {
  const {
    urls: temp,
    labels: temp2
  } = parseTemplatePreviewMeta(value);
  if (!temp.length) {
    return;
  }
  const number = (Number(param) % temp.length + temp.length) % temp.length;
  value.dataset.previewIndex = String(number);
  const element = value.querySelector(".project-template-preview-open img");
  const el3 = value.querySelector(".project-template-carousel-meta strong");
  const el4 = value.querySelector(".project-template-carousel-meta span");
  if (element) {
    element.src = temp[number];
    element.alt = temp2[number] || "栖光预览 " + (number + 1);
  }
  if (el3) {
    el3.textContent = temp2[number] || "栖光预览";
  }
  if (el4) {
    el4.textContent = number + 1 + " / " + temp.length;
  }
}
function syncProjectPreviewCarousel() {
  if (projectPreviewUrls.length) {
    projectPreviewIndex = (projectPreviewIndex % projectPreviewUrls.length + projectPreviewUrls.length) % projectPreviewUrls.length;
    projectPreviewImage.src = projectPreviewUrls[projectPreviewIndex];
    projectPreviewImage.alt = projectPreviewTitles[projectPreviewIndex] || "栖光预览 " + (projectPreviewIndex + 1);
    projectPreviewTitle.textContent = projectPreviewTitles[projectPreviewIndex] || "栖光预览";
    projectPreviewCount.textContent = projectPreviewIndex + 1 + " / " + projectPreviewUrls.length;
  }
}
function openDialog(dataset29) {
  const {
    urls: length14,
    labels: temp
  } = parseTemplatePreviewMeta(dataset29);
  if (length14.length) {
    projectPreviewUrls = length14;
    projectPreviewTitles = temp;
    projectPreviewIndex = Number(dataset29.dataset.previewIndex || 0);
    syncProjectPreviewCarousel();
    projectPreviewDialog.showModal();
  }
}
function openProjectDialog(value = "create") {
  projectDialogMode = value;
  const flag = value === "edit";
  const flag2 = value === "resize";
  projectForm.reset();
  projectDialogKicker.textContent = flag2 ? "RESIZE DASHBOARD" : flag ? "EDIT PROJECT" : "NEW PROJECT";
  projectDialogTitle.textContent = flag2 ? "修改仪表盘分辨率" : flag ? "修改仪表盘" : "创建仪表盘项目";
  projectSubmitBtn.textContent = flag2 ? "应用修改" : flag ? "保存修改" : "创建项目";
  projectForm.elements.name.value = flag || flag2 ? currentProject?.document?.name || "" : "我的仪表盘";
  projectTemplateFields.hidden = flag || flag2;
  projectCanvasWidth.readOnly = false;
  projectCanvasHeight.readOnly = false;
  projectContentLock.checked = false;
  projectContentLockFields.hidden = !flag2;
  projectCanvasFields.classList.remove("fixed", "name-only");
  if (!flag && !flag2) {
    defaultCanvasWidth = 2778;
    defaultCanvasHeight = 1940;
    projectAspectLocked = false;
    lockedAspectWidth = 2778;
    lockedAspectHeight = 1940;
    projectCanvasWidth.value = "2778";
    projectCanvasHeight.value = "1940";
    readProjectCanvasSize();
    selectProjectTemplate("dwell-light");
  } else if (flag) {
    projectCanvasFields.hidden = false;
    projectCanvasFields.classList.add("name-only");
  } else {
    selectedProjectTemplateId = "";
    const number = Number(currentProject?.document?.canvas?.width || 2778);
    const canvasHeight = Number(currentProject?.document?.canvas?.height || 1940);
    defaultCanvasWidth = number;
    defaultCanvasHeight = canvasHeight;
    projectAspectLocked = true;
    lockedAspectWidth = number;
    lockedAspectHeight = canvasHeight;
    projectCanvasFields.hidden = false;
    projectCanvasWidth.value = String(number);
    projectCanvasHeight.value = String(canvasHeight);
    projectCanvasHint.textContent = "默认会同步调整所有页面、控件和弹窗；勾选“锁定控件大小及位置”后只改变画布，内容本身不会缩放或重新定位。";
    readProjectCanvasSize();
    syncProjectAspectLockUi(false);
  }
  setStatusMessage(projectMessage, "");
  projectDialog.showModal();
}
function readProjectCanvasSize() {
  const numeric = Number(projectCanvasWidth.value);
  const number = Number(projectCanvasHeight.value);
  if (!Number.isInteger(numeric) || !Number.isInteger(number) || numeric <= 0 || number <= 0) {
    projectAspectRatio.textContent = "等待输入有效分辨率";
    return;
  }
  const value = !selectedProjectTemplateId && projectAspectLocked ? lockedAspectWidth : numeric;
  const chosen = !selectedProjectTemplateId && projectAspectLocked ? lockedAspectHeight : number;
  const temp = greatestCommonDivisor(value, chosen);
  projectAspectRatio.textContent = value / temp + " : " + chosen / temp;
}
function syncProjectAspectLockUi(param = !!selectedProjectTemplateId) {
  const numeric = param || projectAspectLocked;
  projectAspectLock.disabled = param;
  projectAspectLock.setAttribute("aria-pressed", String(numeric));
  projectAspectLock.classList.toggle("locked", numeric);
  projectAspectLockLabel.textContent = param ? "固定" : numeric ? "已锁定" : "锁定";
  projectAspectLock.title = param ? "栖光画布使用固定比例" : numeric ? "点击解锁画布比例" : "锁定当前画布比例";
}
function applyLockedAspectRatio(value) {
  if (selectedProjectTemplateId || !projectAspectLocked) {
    return;
  }
  const temp = Number(lockedAspectWidth);
  const number = Number(lockedAspectHeight);
  if (!!temp && !!number) {
    if (value === "width") {
      let number2 = Number(projectCanvasWidth.value);
      if (!Number.isInteger(number2) || number2 < 320 || number2 > 7680) {
        return;
      }
      let temp2 = Math.round(number2 * number / temp);
      if (temp2 < 240 || temp2 > 4320) {
        temp2 = Math.max(240, Math.min(4320, temp2));
        number2 = Math.max(320, Math.min(7680, Math.round(temp2 * temp / number)));
        projectCanvasWidth.value = String(number2);
      }
      projectCanvasHeight.value = String(temp2);
    } else {
      let number2 = Number(projectCanvasHeight.value);
      if (!Number.isInteger(number2) || number2 < 240 || number2 > 4320) {
        return;
      }
      let temp2 = Math.round(number2 * temp / number);
      if (temp2 < 320 || temp2 > 7680) {
        temp2 = Math.max(320, Math.min(7680, temp2));
        number2 = Math.max(240, Math.min(4320, Math.round(temp2 * number / temp)));
        projectCanvasHeight.value = String(number2);
      }
      projectCanvasWidth.value = String(temp2);
    }
  }
}
function openDialog2(value, param, param2) {
  projectResizeWarningText.textContent = "当前分辨率为 " + param + " × " + param2 + "，预计有 " + value + " 个控件会部分或全部位于画布范围之外。";
  return new Promise(item => {
    projectResizeWarningResolve = item;
    projectResizeWarningDialog.showModal();
  });
}
function resolveProjectResizeWarning(param) {
  const flag = projectResizeWarningResolve;
  projectResizeWarningResolve = null;
  if (projectResizeWarningDialog.open) {
    projectResizeWarningDialog.close();
  }
  flag?.(param);
}
function openPageDialog(param = "create") {
  if (!currentProject) {
    return;
  }
  pageDialogMode = param;
  const flag = param === "rename";
  pageForm.reset();
  pageDialogKicker.textContent = flag ? "EDIT PAGE" : "NEW PAGE";
  pageDialogTitle.textContent = flag ? "重命名页面" : "新建页面";
  pageSubmitBtn.textContent = flag ? "保存修改" : "创建页面";
  pageForm.elements.name.value = flag && currentPage()?.name || "";
  setStatusMessage(pageMessage, "");
  pageDialog.showModal();
}
function blockIfUnsavedChanges() {
  if (documentDirty) {
    onError(new Error("当前有未保存修改，请先点击顶部的“保存”。"));
    return true;
  } else {
    return false;
  }
}
function licenseStatusLabel(element) {
  const value = {
    UNACTIVATED: "尚未激活",
    ACTIVE: "授权有效",
    CONNECTION_WARNING: "授权连接异常",
    STARTUP_VALIDATION_REQUIRED: "等待启动校验",
    LEASE_EXPIRED: "租约已到期",
    INSTANCE_MISMATCH: "实例不匹配",
    INVALID: "租约无效",
    DEACTIVATED: "后台已释放",
    REVOKED: "授权已撤销",
    CLOCK_ROLLBACK: "系统时间异常"
  };
  const hbFloorplanAutoDiagramLoading = element?.status || "UNACTIVATED";
  const temp = hbFloorplanAutoDiagramLoading === "ACTIVE";
  const includesValue = ["CONNECTION_WARNING", "STARTUP_VALIDATION_REQUIRED"].includes(hbFloorplanAutoDiagramLoading);
  const includesValue2 = ["LEASE_EXPIRED", "INSTANCE_MISMATCH", "INVALID", "REVOKED", "CLOCK_ROLLBACK"].includes(hbFloorplanAutoDiagramLoading);
  licenseOpenBtn.classList.toggle("connected", temp);
  licenseOpenBtn.classList.toggle("warning", includesValue);
  licenseOpenBtn.classList.toggle("error", includesValue2);
  licenseOpenBtn.querySelector("span").textContent = !element?.required && hbFloorplanAutoDiagramLoading === "UNACTIVATED" ? "授权 · 开发模式" : value[hbFloorplanAutoDiagramLoading] || "授权状态";
  licenseDetailIndicator.className = temp ? "connected" : includesValue ? "warning" : includesValue2 ? "error" : "";
  licenseDetailStatus.textContent = value[hbFloorplanAutoDiagramLoading] || hbFloorplanAutoDiagramLoading;
  licenseDetailEdition.textContent = element?.activationCodeId ? "当前编辑器的授权与附加包" : element?.required ? "尚未激活" : "开发模式";
  licenseCard.render(element);
  licenseDetailError.hidden = !element?.lastError;
  licenseDetailError.textContent = element?.lastError || "";
  licenseForm.hidden = !["UNACTIVATED", "DEACTIVATED", "INVALID", "INSTANCE_MISMATCH", "REVOKED"].includes(hbFloorplanAutoDiagramLoading);
}
async function loadLicenseStatus() {
  const value = await apiFetch("/license/status");
  if (value?.required && !value.allowed) {
    window.location.replace("/license");
    return value;
  }
  const temp = JSON.stringify([...(value?.features || [])].sort());
  const flag = svPointerCapture !== null && svPointerCapture !== temp;
  svPointerCapture = temp;
  const chosen = currentProject ? currentUiPack(currentUiPackId(currentProject.document)) : null;
  const allowed = new Set(Array.isArray(value?.features) ? value.features : []);
  if (value?.required && chosen?.featureCode && !allowed.has(chosen.featureCode)) {
    const number = "当前授权已不再包含“" + chosen.name + "”，该仪表盘已停止显示和编辑。";
    editorRenderer?.destroy();
    editorRenderer = null;
    destroyDashboardPreview();
    currentProject = null;
    clearSelection();
    setWorkspaceEmpty(false);
    const div2 = document.createElement("div");
    div2.className = "canvas-message";
    const element = document.createElement("strong");
    element.textContent = number;
    div2.append(element);
    editorCanvas.replaceChildren(div2);
    if (colorPickerDraftHex !== chosen.id) {
      colorPickerDraftHex = chosen.id;
      onError(new Error(number));
    }
  }
  if (flag) {
    await Promise.all([loadAssets({
      refreshInspector: false
    }), loadUiPacks()]);
  }
  licenseStatusLabel(value);
  return value;
}
licenseOpenBtn.addEventListener("click", async () => {
  setStatusMessage(licenseMessage, "");
  try {
    const value = await loadLicenseStatus();
    if (!value?.required || value.allowed) {
      licenseDialog.showModal();
    }
  } catch (temp) {
    onError(temp);
  }
});
licenseCloseBtn.addEventListener("click", () => licenseDialog.close());
licenseDialog.addEventListener("click", target6 => {
  if (target6.target === licenseDialog) {
    licenseDialog.close();
  }
});
licenseForm.addEventListener("submit", async value => {
  value.preventDefault();
  const disabled2 = licenseForm.querySelector("button[type=\"submit\"]");
  const activationCode = String(new FormData(licenseForm).get("activationCode") || "").trim();
  const email = String(new FormData(licenseForm).get("email") || "").trim();
  disabled2.disabled = true;
  setStatusMessage(licenseMessage, "正在绑定实例并获取签名租约…");
  try {
    const asyncResult = await apiFetch("/license/activate", {
      method: "POST",
      body: JSON.stringify({
        activationCode,
        email
      })
    });
    licenseForm.reset();
    licenseStatusLabel(asyncResult);
    setStatusMessage(licenseMessage, "当前实例已成功激活。", "success");
  } catch (message2) {
    setStatusMessage(licenseMessage, message2.message, "error");
  } finally {
    disabled2.disabled = false;
  }
});
haOpenBtn.addEventListener("click", async () => {
  haFormEditing = false;
  setStatusMessage(haMessage, "");
  await ensureHaBootstrap({
    preserveForm: false
  });
  haDialog.showModal();
});
haCloseBtn.addEventListener("click", () => {
  haFormEditing = false;
  haDialog.close();
});
haDialog.addEventListener("click", event => {
  if (event.target === haDialog) {
    haFormEditing = false;
    haDialog.close();
  }
});
haForm.addEventListener("input", () => {
  if (!haForm.hidden) {
    haFormEditing = true;
  }
});
haTestBtn.addEventListener("click", async () => {
  setStatusMessage(haMessage, "正在测试地址、Token 和版本…");
  haTestBtn.disabled = true;
  try {
    const locationName = await apiFetch("/ha/test", {
      method: "POST",
      body: JSON.stringify(readHaFormPayload(true))
    });
    setStatusMessage(haMessage, "连接成功：" + (locationName.locationName || "Home Assistant") + " · " + (locationName.version || "未知版本"), "success");
  } catch (message3) {
    setStatusMessage(haMessage, message3.message, "error");
  } finally {
    haTestBtn.disabled = false;
  }
});
haForm.addEventListener("submit", async event => {
  event.preventDefault();
  const disabled3 = haForm.querySelector("button[type=\"submit\"]");
  disabled3.disabled = true;
  setStatusMessage(haMessage, "正在验证并加密保存连接…");
  try {
    haConnection = await apiFetch("/ha/connection", {
      method: "PUT",
      body: JSON.stringify(readHaFormPayload(false))
    });
    haFormEditing = false;
    syncHaConnectionPanels();
    if (!(await waitForHaConnection()) && !haConnection?.lastError && haSyncStatus?.status !== "error") {
      haDetailStatus.textContent = "后台仍在建立实时连接";
    }
  } catch (message4) {
    haFormEditing = true;
    syncHaConnectionPanels();
    setStatusMessage(haMessage, message4.message, "error");
  } finally {
    disabled3.disabled = false;
  }
});
haEditBtn.addEventListener("click", startHaFormEdit);
haEditCancelBtn.addEventListener("click", cancelHaFormEdit);
haDeleteBtn.addEventListener("click", () => {
  deleteHaForm.reset();
  setStatusMessage(deleteHaMessage, "");
  haDialog.close();
  deleteHaDialog.showModal();
});
deleteHaCloseBtn.addEventListener("click", () => deleteHaDialog.close());
deleteHaCancelBtn.addEventListener("click", () => deleteHaDialog.close());
deleteHaDialog.addEventListener("click", target7 => {
  if (target7.target === deleteHaDialog) {
    deleteHaDialog.close();
  }
});
deleteHaForm.addEventListener("submit", async preventDefault2 => {
  preventDefault2.preventDefault();
  if (String(new FormData(deleteHaForm).get("confirmation") || "").trim() !== "删除连接") {
    setStatusMessage(deleteHaMessage, "请输入“删除连接”确认。", "error");
    return;
  }
  const disabled4 = deleteHaForm.querySelector("button[type=\"submit\"]");
  disabled4.disabled = true;
  setStatusMessage(deleteHaMessage, "正在断开连接并清除同步目录…");
  try {
    await apiFetch("/ha/connection", {
      method: "DELETE"
    });
    deleteHaDialog.close();
    haConnection = null;
    haSyncStatus = null;
    haFormEditing = false;
    await ensureHaBootstrap({
      preserveForm: false
    });
  } catch (message5) {
    setStatusMessage(deleteHaMessage, message5.message, "error");
  } finally {
    disabled4.disabled = false;
  }
});
projectNewBtn.addEventListener("click", async () => {
  if (!blockIfUnsavedChanges()) {
    try {
      if (!uiPacks.length) {
        await loadUiPacks();
      }
      openProjectDialog("create");
    } catch (temp) {
      onError(temp);
    }
  }
});
uiPackOpenBtn.addEventListener("click", async () => {
  if (currentProject) {
    setStatusMessage(uiPackMessage, "");
    try {
      await loadUiPacks();
      renderUiPackDialog();
      uiPackDialog.showModal();
    } catch (temp) {
      onError(temp);
    }
  }
});
uiPackCloseBtn.addEventListener("click", () => uiPackDialog.close());
uiPackDialog.addEventListener("click", target8 => {
  if (target8.target === uiPackDialog) {
    uiPackDialog.close();
  }
});
uiPackList.addEventListener("click", async value => {
  const disabled5 = value.target.closest("[data-ui-pack-id]");
  if (!disabled5 || disabled5.disabled || !currentProject) {
    return;
  }
  const allowed = uiPacks.find(component => component.id === disabled5.dataset.uiPackId);
  if (!allowed?.allowed) {
    setStatusMessage(uiPackMessage, "当前授权尚未解锁该 UI 方案。", "error");
    return;
  }
  disabled5.disabled = true;
  setStatusMessage(uiPackMessage, "正在加载并应用整套 UI…");
  try {
    await ensureUiPackRuntime(allowed);
    await mutateDocument(param => applyUiPackToDocument(param, allowed));
    uiPackDialog.close();
  } catch (message6) {
    setStatusMessage(uiPackMessage, message6.message, "error");
    disabled5.disabled = false;
  }
});
projectCloseBtn.addEventListener("click", () => projectDialog.close());
projectCancelBtn.addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("click", target9 => {
  if (target9.target === projectDialog) {
    projectDialog.close();
  }
});
projectTemplateOptions.addEventListener("click", target10 => {
  const dataset10 = target10.target.closest("[data-project-template-id]");
  if (!dataset10 || projectDialogMode !== "create") {
    return;
  }
  const temp = target10.target.closest("[data-project-preview-action]")?.dataset.projectPreviewAction;
  if (temp) {
    target10.stopPropagation();
    if (temp === "open" && (dataset10.dataset.projectTemplateId || "") !== selectedProjectTemplateId) {
      selectedProjectTemplateId = dataset10.dataset.projectTemplateId || "";
      selectProjectTemplate(selectedProjectTemplateId);
    } else if (temp === "open") {
      openDialog(dataset10);
    } else {
      showTemplatePreviewAt(dataset10, Number(dataset10.dataset.previewIndex || 0) + (temp === "next" ? 1 : -1));
    }
    return;
  }
  selectedProjectTemplateId = dataset10.dataset.projectTemplateId || "";
  selectProjectTemplate(selectedProjectTemplateId);
});
projectTemplateOptions.addEventListener("keydown", target11 => {
  if (!["Enter", " "].includes(target11.key) || target11.target.closest("button")) {
    return;
  }
  const dataset11 = target11.target.closest("[data-project-template-id]");
  if (!!dataset11 && projectDialogMode === "create") {
    target11.preventDefault();
    selectedProjectTemplateId = dataset11.dataset.projectTemplateId || "";
    selectProjectTemplate(selectedProjectTemplateId);
  }
});
projectPreviewCloseBtn.addEventListener("click", () => projectPreviewDialog.close());
projectPreviewPreviousBtn.addEventListener("click", () => {
  projectPreviewIndex -= 1;
  syncProjectPreviewCarousel();
});
projectPreviewNextBtn.addEventListener("click", () => {
  projectPreviewIndex += 1;
  syncProjectPreviewCarousel();
});
projectPreviewDialog.addEventListener("click", target12 => {
  if (target12.target === projectPreviewDialog) {
    projectPreviewDialog.close();
  }
});
projectPreviewDialog.addEventListener("keydown", value => {
  if (value.key === "ArrowLeft") {
    projectPreviewIndex -= 1;
    syncProjectPreviewCarousel();
  }
  if (value.key === "ArrowRight") {
    projectPreviewIndex += 1;
    syncProjectPreviewCarousel();
  }
});
projectCanvasWidth.addEventListener("input", () => {
  applyLockedAspectRatio("width");
  if (!selectedProjectTemplateId) {
    defaultCanvasWidth = Number(projectCanvasWidth.value) || 2778;
    defaultCanvasHeight = Number(projectCanvasHeight.value) || 1940;
  }
  readProjectCanvasSize();
});
projectCanvasHeight.addEventListener("input", () => {
  applyLockedAspectRatio("height");
  if (!selectedProjectTemplateId) {
    defaultCanvasWidth = Number(projectCanvasWidth.value) || 2778;
    defaultCanvasHeight = Number(projectCanvasHeight.value) || 1940;
  }
  readProjectCanvasSize();
});
projectAspectLock.addEventListener("click", () => {
  if (selectedProjectTemplateId || !["create", "resize"].includes(projectDialogMode)) {
    return;
  }
  const number = Number(projectCanvasWidth.value);
  const number2 = Number(projectCanvasHeight.value);
  if (!Number.isInteger(number) || !Number.isInteger(number2) || number < 320 || number > 7680 || number2 < 240 || number2 > 4320) {
    setStatusMessage(projectMessage, "请先输入有效的宽度和高度后再锁定比例。", "error");
    return;
  }
  projectAspectLocked = !projectAspectLocked;
  if (projectAspectLocked) {
    lockedAspectWidth = number;
    lockedAspectHeight = number2;
  }
  setStatusMessage(projectMessage, "");
  syncProjectAspectLockUi(false);
});
projectResizeWarningCloseBtn.addEventListener("click", () => resolveProjectResizeWarning(false));
projectResizeWarningCancelBtn.addEventListener("click", () => resolveProjectResizeWarning(false));
projectResizeWarningConfirmBtn.addEventListener("click", () => resolveProjectResizeWarning(true));
projectResizeWarningDialog.addEventListener("cancel", preventDefault3 => {
  preventDefault3.preventDefault();
  resolveProjectResizeWarning(false);
});
projectForm.addEventListener("submit", async value => {
  value.preventDefault();
  const projectAction = new FormData(projectForm);
  const name15 = String(projectAction.get("name") || "").trim();
  const canvasWidth = Number(projectAction.get("canvasWidth"));
  const canvasHeight = Number(projectAction.get("canvasHeight"));
  const lockContent = projectDialogMode === "resize" && projectContentLock.checked;
  if (projectDialogMode === "resize" && lockContent) {
    const number = Number(currentProject?.document?.canvas?.width || 2778);
    const canvasHeight2 = Number(currentProject?.document?.canvas?.height || 1940);
    const chosen = canvasWidth !== number || canvasHeight !== canvasHeight2 ? countComponentsOutsideCanvas(currentProject.document, canvasWidth, canvasHeight) : 0;
    if (chosen > 0 && !(await openDialog2(chosen, canvasWidth, canvasHeight))) {
      return;
    }
  }
  projectSubmitBtn.disabled = true;
  setStatusMessage(projectMessage, projectDialogMode === "resize" ? "正在调整整个仪表盘…" : projectDialogMode === "edit" ? "正在保存仪表盘名称…" : selectedProjectTemplateId ? "正在套用栖光整套模板…" : "正在创建空白仪表盘…");
  try {
    if (projectDialogMode === "resize") {
      const name8 = resizeDashboardDocument(currentProject.document, canvasWidth, canvasHeight, {
        lockContent
      });
      name8.name = name15;
      await commitDocumentEdit(name8);
      projectDialog.close();
    } else if (projectDialogMode === "edit") {
      const name7 = cloneValue(currentProject.document);
      name7.name = name15;
      await commitDocumentEdit(name7);
      projectDialog.close();
    } else {
      const templateId = {
        name: name15,
        canvasWidth,
        canvasHeight,
        uiPackId: "ui.base"
      };
      if (selectedProjectTemplateId) {
        templateId.templateId = selectedProjectTemplateId;
      }
      const asyncResult = await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify(templateId)
      });
      projectDialog.close();
      await loadProjectList(asyncResult.id);
    }
  } catch (message7) {
    setStatusMessage(projectMessage, message7.message, "error");
  } finally {
    projectSubmitBtn.disabled = false;
  }
});
projectActionsButton.addEventListener("click", () => {
  const hidden = projectActionsMenu.hidden;
  closeMenuState();
  closeProjectActionsMenu();
  closePageActionsMenu();
  projectActionsMenu.hidden = !hidden;
  projectActionsButton.setAttribute("aria-expanded", String(hidden));
});
projectFloorplanOpenBtn.addEventListener("click", () => {
  if (!blockIfUnsavedChanges()) {
    window.location.assign("/3d-studio");
  }
});
projectActionsMenu.addEventListener("click", async value => {
  const temp = value.target.closest("[data-project-action]")?.dataset.projectAction;
  if (!!temp && !!currentProject && (closeProjectActionsMenu(), !blockIfUnsavedChanges())) {
    if (temp === "edit") {
      openProjectDialog("edit");
      return;
    }
    if (temp === "resize") {
      openProjectDialog("resize");
      return;
    }
    if (temp === "duplicate") {
      const name = currentProject.document.name;
      const idSet = new Set(projectList.map(name4 => name4.name));
      let name9 = name + " 副本";
      let number = 2;
      while (idSet.has(name9)) {
        name9 = name + " 副本 " + number++;
      }
      try {
        const asyncResult = await apiFetch("/projects/" + currentProject.projectId + "/duplicate", {
          method: "POST",
          body: JSON.stringify({
            name: name9
          })
        });
        await loadProjectList(asyncResult.id);
      } catch (temp2) {
        onError(temp2);
      }
      return;
    }
    if (temp === "delete") {
      const name10 = projectList.find(component => component.id === currentProject.projectId);
      if (!name10) {
        return;
      }
      deleteProjectForm.reset();
      deleteProjectName.textContent = "“" + name10.name + "”";
      deleteProjectDialog.dataset.projectId = name10.id;
      deleteProjectDialog.dataset.projectName = name10.name;
      setStatusMessage(deleteProjectMessage, "");
      deleteProjectDialog.showModal();
    }
  }
});
deleteProjectCloseBtn.addEventListener("click", () => deleteProjectDialog.close());
deleteProjectCancelBtn.addEventListener("click", () => deleteProjectDialog.close());
deleteProjectDialog.addEventListener("click", target13 => {
  if (target13.target === deleteProjectDialog) {
    deleteProjectDialog.close();
  }
});
deleteProjectForm.addEventListener("submit", async preventDefault4 => {
  preventDefault4.preventDefault();
  const disabled6 = deleteProjectForm.querySelector("button[type=\"submit\"]");
  const confirmation = String(new FormData(deleteProjectForm).get("confirmation") || "");
  const temp = deleteProjectDialog.dataset.projectId;
  const temp2 = deleteProjectDialog.dataset.projectName;
  if (confirmation !== temp2) {
    setStatusMessage(deleteProjectMessage, "请输入与项目名称完全一致的确认文字。", "error");
    return;
  }
  disabled6.disabled = true;
  setStatusMessage(deleteProjectMessage, "正在删除项目和草稿…");
  try {
    await apiFetch("/projects/" + temp, {
      method: "DELETE",
      body: JSON.stringify({
        confirmation
      })
    });
    readRecoveredDraft(temp);
    deleteProjectDialog.close();
    editorRenderer?.destroy();
    editorRenderer = null;
    currentProject = null;
    clearSelection();
    await loadProjectList();
  } catch (message8) {
    setStatusMessage(deleteProjectMessage, message8.message, "error");
  } finally {
    disabled6.disabled = false;
  }
});
pageNewBtn.addEventListener("click", () => openPageDialog("create"));
pageCloseBtn.addEventListener("click", () => pageDialog.close());
pageCancelBtn.addEventListener("click", () => pageDialog.close());
pageDialog.addEventListener("click", target14 => {
  if (target14.target === pageDialog) {
    pageDialog.close();
  }
});
pageForm.addEventListener("submit", async value => {
  value.preventDefault();
  const name16 = String(new FormData(pageForm).get("name") || "").trim();
  const pages3 = cloneValue(currentProject.document);
  const inputValue = pageSelect.value;
  pageSubmitBtn.disabled = true;
  setStatusMessage(pageMessage, pageDialogMode === "rename" ? "正在保存页面名称…" : "正在创建页面…");
  try {
    if (pageDialogMode === "rename") {
      const name11 = pages3.pages.find(path4 => path4.path === inputValue);
      name11.name = name16;
      await commitDocumentEdit(pages3, inputValue);
    } else {
      const path5 = {
        id: newId("page"),
        name: name16,
        path: uniquePagePath(currentProject?.document?.pages, name16),
        sharedComponentIds: pages3.sharedComponents.map(component2 => component2.id),
        components: []
      };
      const maxValue = Math.max(0, pages3.pages.findIndex(path => path.path === inputValue));
      pages3.pages.splice(maxValue + 1, 0, path5);
      await commitDocumentEdit(pages3, path5.path);
    }
    pageDialog.close();
  } catch (message9) {
    setStatusMessage(pageMessage, message9.message, "error");
  } finally {
    pageSubmitBtn.disabled = false;
  }
});
componentGroupRenameCloseBtn.addEventListener("click", () => componentGroupRenameDialog.close());
componentGroupRenameCancelBtn.addEventListener("click", () => componentGroupRenameDialog.close());
componentGroupRenameDialog.addEventListener("click", value => {
  if (value.target === componentGroupRenameDialog) {
    componentGroupRenameDialog.close();
  }
});
componentGroupRenameForm.addEventListener("submit", preventDefault5 => {
  preventDefault5.preventDefault();
  const flag = componentGroupRenameDialog.dataset.groupId || "";
  const temp2 = findComponent(currentProject?.document, flag)?.component;
  if (!temp2 || temp2.type !== "group") {
    componentGroupRenameDialog.close();
    return;
  }
  const temp = componentLabel(temp2);
  const label2 = String(new FormData(componentGroupRenameForm).get("name") || "").trim().slice(0, 128);
  if (!label2) {
    setStatusMessage(componentGroupRenameMessage, "请输入组合名称。", "error");
    return;
  }
  if (label2 === temp) {
    componentGroupRenameDialog.close();
    return;
  }
  mutateDocument(param => {
    const properties30 = findComponent(param, flag)?.component;
    if (properties30?.type === "group") {
      properties30.properties = {
        ...(properties30.properties || {}),
        label: label2
      };
    }
  });
  componentGroupRenameDialog.close();
});
pageActionsButton.addEventListener("click", () => {
  const hidden = pageActionsMenu.hidden;
  closeMenuState();
  closeProjectActionsMenu();
  closePageActionsMenu();
  pageActionsMenu.hidden = !hidden;
  pageActionsButton.setAttribute("aria-expanded", String(hidden));
});
pageActionsMenu.addEventListener("click", async value => {
  const temp = value.target.closest("[data-page-action]")?.dataset.pageAction;
  const path10 = currentPage();
  if (!temp || !path10 || !currentProject) {
    return;
  }
  closePageActionsMenu();
  if (temp === "rename") {
    openPageDialog("rename");
    return;
  }
  const pages4 = cloneValue(currentProject.document);
  const temp2 = pages4.pages.findIndex(path6 => path6.path === path10.path);
  if (temp === "default") {
    if (pages4.defaultPagePath === path10.path) {
      return;
    }
    pages4.defaultPagePath = path10.path;
    try {
      await commitDocumentEdit(pages4, path10.path);
      await autosaveDocument();
    } catch (temp3) {
      onError(temp3);
    }
    return;
  }
  if (temp === "duplicate") {
    const path9 = clonePageWithFreshIds(path10, path10.name + " 副本", currentProject.document.pages);
    pages4.pages.splice(temp2 + 1, 0, path9);
    try {
      await commitDocumentEdit(pages4, path9.path);
    } catch (temp3) {
      onError(temp3);
    }
    return;
  }
  if (temp === "delete") {
    deletePageDialog.dataset.pagePath = path10.path;
    deletePageName.textContent = "“" + path10.name + "”";
    setStatusMessage(deletePageMessage, "");
    deletePageDialog.showModal();
  }
});
deletePageCloseBtn.addEventListener("click", () => deletePageDialog.close());
deletePageCancelBtn.addEventListener("click", () => deletePageDialog.close());
deletePageDialog.addEventListener("click", target15 => {
  if (target15.target === deletePageDialog) {
    deletePageDialog.close();
  }
});
deletePageConfirmBtn.addEventListener("click", async () => {
  const temp = deletePageDialog.dataset.pagePath;
  const pages5 = cloneValue(currentProject.document);
  const temp2 = pages5.pages.findIndex(path7 => path7.path === temp);
  if (temp2 < 0) {
    setStatusMessage(deletePageMessage, "页面已经不存在，请刷新后重试。", "error");
    return;
  }
  const name17 = pages5.pages[temp2];
  pages5.pages.splice(temp2, 1);
  const target16 = pages5.pages[Math.max(0, temp2 - 1)]?.path || pages5.pages[0]?.path || null;
  const name18 = pages5.pages.find(path8 => path8.path === target16);
  if (pages5.defaultPagePath === temp) {
    pages5.defaultPagePath = target16;
  }
  const callback = param => {
    for (const properties12 of param || []) {
      properties12.properties = {
        ...(properties12.properties || {})
      };
      if (properties12.type === "navigation-button" && properties12.properties.targetPage === temp) {
        if (!properties12.properties.mainText || properties12.properties.mainText === "页面导航" || properties12.properties.mainText === name17?.name) {
          properties12.properties.mainText = name18?.name || "页面导航";
        }
        const temp3 = String(temp).replace(/[-_]+/g, " ").toUpperCase();
        if (!properties12.properties.secondaryText || properties12.properties.secondaryText === "NAVIGATION" || properties12.properties.secondaryText === temp3) {
          properties12.properties.secondaryText = target16 ? String(target16).replace(/[-_]+/g, " ").toUpperCase() : "NAVIGATION";
        }
        if (target16) {
          properties12.properties.targetPage = target16;
        } else {
          delete properties12.properties.targetPage;
        }
      }
      properties12.actions = {
        ...(properties12.actions || {})
      };
      for (const temp3 of ["tap", "doubleTap", "hold"]) {
        if (properties12.actions[temp3]?.type === "navigate" && properties12.actions[temp3]?.target === temp) {
          if (properties12.type === "navigation-button" && target16) {
            properties12.actions[temp3] = {
              type: "navigate",
              target: target16
            };
          } else {
            delete properties12.actions[temp3];
          }
        }
      }
      callback(properties12.children);
    }
  };
  callback(pages5.sharedComponents);
  for (const components5 of pages5.pages) {
    callback(components5.components);
  }
  deletePageConfirmBtn.disabled = true;
  setStatusMessage(deletePageMessage, "正在删除页面…");
  try {
    await commitDocumentEdit(pages5, target16);
    deletePageDialog.close();
  } catch (message10) {
    setStatusMessage(deletePageMessage, message10.message, "error");
  } finally {
    deletePageConfirmBtn.disabled = false;
  }
});
componentContextMenu.addEventListener("click", value => {
  const alias = contextMenuComponentId;
  const temp = value.target.closest("[data-component-action]")?.dataset.componentAction;
  const dataset12 = value.target.closest("[data-label-color]");
  if (!alias || !temp && !dataset12) {
    return;
  }
  const map = selectedComponentIds.has(alias) ? [...selectedComponentIds] : [alias];
  closeComponentContextMenu();
  if (temp === "copy") {
    bringComponentsToFront(map, alias);
    return;
  }
  if (temp === "group") {
    groupSelectedComponents(map);
    return;
  }
  if (temp === "ungroup") {
    ungroupComponent(alias);
    return;
  }
  if (temp === "rename-group") {
    enterGroupEdit(alias);
    return;
  }
  if (temp === "copy-to-page") {
    copySelectedComponents(map);
    return;
  }
  if (temp === "visibility") {
    const length5 = map.map(item => findComponent(currentProject?.document, item)?.component).filter(Boolean).map(style2 => style2.style?.visible !== false);
    if (length5.length !== map.length || !length5.length || !length5.every(item => item === length5[0])) {
      return;
    }
    setComponentsVisible(map, !length5[0]);
    return;
  }
  if (temp === "delete") {
    deleteSelectedComponents(map);
    return;
  }
  if (dataset12) {
    setSelectedComponentsColor(map, dataset12.dataset.labelColor);
  }
});
deleteComponentCloseBtn.addEventListener("click", () => deleteComponentDialog.close());
deleteComponentCancelBtn.addEventListener("click", () => deleteComponentDialog.close());
deleteComponentDialog.addEventListener("click", value => {
  if (value.target === deleteComponentDialog) {
    deleteComponentDialog.close();
  }
});
copyComponentPageCloseBtn.addEventListener("click", () => copyComponentPageDialog.close());
copyComponentPageCancelBtn.addEventListener("click", () => copyComponentPageDialog.close());
copyComponentPageDialog.addEventListener("click", value => {
  if (value.target === copyComponentPageDialog) {
    copyComponentPageDialog.close();
  }
});
copyComponentSuccessStayBtn.addEventListener("click", () => {
  copySuccessPayload = null;
  copyComponentSuccessDialog.close();
});
copyComponentSuccessGoBtn.addEventListener("click", () => {
  confirmCopySuccess().catch(onError);
});
copyComponentSuccessDialog.addEventListener("click", event => {
  if (event.target === copyComponentSuccessDialog) {
    copySuccessPayload = null;
    copyComponentSuccessDialog.close();
  }
});
copyComponentPageScope.addEventListener("change", () => {
  loadCopyPageOptions();
});
copyComponentPageProject.addEventListener("change", () => {
  if (copyComponentPageScope.value === "other") {
    loadCopyPageOptions();
  }
});
copyComponentPageForm.addEventListener("submit", async event => {
  event.preventDefault();
  let length7 = [];
  try {
    length7 = JSON.parse(copyComponentPageDialog.dataset.componentIds || "[]");
  } catch {
    length7 = [];
  }
  const replace = copyComponentPageTarget.value;
  const flag = copyComponentPageScope.value === "other";
  if (!!currentProject && !!length7.length && !!replace) {
    copyComponentPageSubmitBtn.disabled = true;
    setStatusMessage(copyComponentPageMessage, "正在复制控件…");
    try {
      if (flag) {
        const projectId = copyComponentPageProject.value;
        if (!projectId || !copyTargetProject || copyTargetProject.projectId !== projectId) {
          throw new Error("目标仪表盘尚未加载完成，请稍后重试。");
        }
        const document = cloneValue(copyTargetProject.document);
        const scaleMode = copyComponentScaleOptions.hidden ? "none" : copyComponentPageForm.elements.copyScaleMode.value;
        let number = 0;
        const length2 = copyComponentsAcrossDocuments(currentProject.document, document, length7, replace, {
          cloneValue,
          createId: () => newId("component"),
          componentLabel,
          scaleMode,
          onInvalidAction: () => {
            number += 1;
          }
        });
        if (!length2.length) {
          throw new Error("目标页面或源控件已发生变化，请重新操作。");
        }
        const revision = await apiFetch("/projects/" + encodeURIComponent(projectId) + "/draft", {
          method: "PUT",
          body: JSON.stringify({
            revision: copyTargetProject.revision,
            globalPopupRevision: copyTargetProject.globalPopupRevision,
            globalPopupsDirty: false,
            document
          })
        });
        copyTargetProject = revision;
        const draftRevision = projectList.find(component => component.id === projectId);
        if (draftRevision) {
          draftRevision.draftRevision = revision.revision;
        }
        const text3 = draftRevision?.name || "目标仪表盘";
        const text4 = copyComponentPageTarget.selectedOptions[0]?.textContent || "目标区域";
        const chosen = number ? "（已清理 " + number + " 个目标仪表盘不存在的跳转或弹窗动作）" : "";
        copyComponentPageDialog.close();
        showCopySuccessDialog("已复制 " + length2.length + " 个控件到“" + text3 + "”的“" + text4 + "”，并已保存" + chosen + "。", {
          projectId,
          pagePath: replace === "shared" ? copyTargetProject.document.pages?.[0]?.path : replace.replace(/^page:/, ""),
          scope: replace === "shared" ? "shared" : "page"
        });
        return;
      }
      const cloned = cloneValue(currentProject.document);
      const length4 = copyComponentsToTarget(cloned, length7, replace, {
        cloneValue,
        createId: () => newId("component"),
        componentLabel
      });
      if (!length4.length) {
        throw new Error("目标页面或源控件已发生变化，请重新操作。");
      }
      componentId = length4[0].id;
      selectedComponentIds = new Set(length4.map(sharedComponentIds => sharedComponentIds.id));
      rangeSelectAnchorId = length4[0].id;
      const pagePath = replace === "shared" ? pageSelect.value : replace.replace(/^page:/, "");
      const text2 = copyComponentPageTarget.selectedOptions[0]?.textContent || "目标区域";
      await commitDocumentEdit(cloned, pagePath);
      copyComponentPageDialog.close();
      showCopySuccessDialog("已复制 " + length4.length + " 个控件到“" + text2 + "”，并已保存。", {
        projectId: currentProject.projectId,
        pagePath,
        scope: replace === "shared" ? "shared" : "page"
      });
    } catch (message) {
      setStatusMessage(copyComponentPageMessage, message.message, "error");
    } finally {
      if (!flag || !copyComponentPageMessage.classList.contains("success")) {
        copyComponentPageSubmitBtn.disabled = false;
      }
    }
  }
});
deleteComponentConfirmBtn.addEventListener("click", () => {
  let length8 = [];
  try {
    length8 = JSON.parse(deleteComponentDialog.dataset.componentIds || "[]");
  } catch {
    length8 = [];
  }
  if (!length8.length) {
    return;
  }
  deleteComponentDialog.close();
  const idSet = new Set(length8);
  selectedComponentIds = new Set([...selectedComponentIds].filter(item => !idSet.has(item)));
  if (idSet.has(componentId)) {
    componentId = selectedComponentIds.values().next().value || null;
  }
  if (idSet.has(rangeSelectAnchorId)) {
    rangeSelectAnchorId = componentId;
  }
  mutateDocument(param => {
    for (const temp of length8) {
      detachComponentById(param, temp);
    }
  });
});
imageInspector.addEventListener("submit", event => event.preventDefault());
iconButtonEffectInspector.addEventListener("submit", event => event.preventDefault());
titleButtonInspector.addEventListener("submit", event => event.preventDefault());
lightStatisticsInspector.addEventListener("submit", event => event.preventDefault());
iconButtonInspector.addEventListener("submit", event => event.preventDefault());
vacuumMapInspector.addEventListener("submit", event => event.preventDefault());
cameraInspector.addEventListener("submit", event => event.preventDefault());
airConditionerInspector.addEventListener("submit", event => event.preventDefault());
timeInspector.addEventListener("submit", event => event.preventDefault());
dateInspector.addEventListener("submit", event => event.preventDefault());
weatherInspector.addEventListener("submit", event => event.preventDefault());
lineChartInspector.addEventListener("submit", preventDefault6 => preventDefault6.preventDefault());
panelFrameInspector.addEventListener("submit", value => value.preventDefault());
navigationInspector.addEventListener("submit", value => value.preventDefault());
const labelFieldBindings = new Map([[imageLabel, {
  componentType: "image",
  property: "label",
  trim: true
}], [ibeLabel, {
  componentType: "icon-button-effect",
  property: "label",
  trim: true
}], [titleButtonLabel, {
  componentType: "title-button",
  property: "label",
  trim: true
}], [titleButtonMainText, {
  componentType: "title-button",
  property: "mainText",
  trim: false
}], [titleButtonSecondaryLine1, {
  componentType: "title-button",
  property: "secondaryText",
  trim: false,
  getValue: () => titleButtonSecondaryLine1.value + "\n" + titleButtonSecondaryLine2.value
}], [titleButtonSecondaryLine2, {
  componentType: "title-button",
  property: "secondaryText",
  trim: false,
  getValue: () => titleButtonSecondaryLine1.value + "\n" + titleButtonSecondaryLine2.value
}], [lightStatisticsLabel, {
  componentType: "light-statistics",
  property: "label",
  trim: true
}], [lightStatisticsTitle, {
  componentType: "light-statistics",
  property: "title",
  trim: false
}], [iconButtonLabel, {
  componentType: "icon-button",
  componentTypes: ["icon-button", "device-button", "presence-sensor"],
  property: "label",
  trim: true
}], [iconButtonMainText, {
  componentType: "icon-button",
  componentTypes: ["icon-button", "device-button", "presence-sensor"],
  property: "mainText",
  trim: false
}], [iconButtonSecondaryText, {
  componentType: "icon-button",
  componentTypes: ["icon-button", "device-button", "presence-sensor"],
  property: "secondaryText",
  trim: false
}], [vacuumMapLabel, {
  componentType: "vacuum-map",
  property: "label",
  trim: true
}], [cameraLabel, {
  componentType: "camera",
  property: "label",
  trim: true
}], [airConditionerLabel, {
  componentType: "air-conditioner",
  property: "label",
  trim: true
}], [airConditionerMainText, {
  componentType: "air-conditioner",
  property: "mainText",
  trim: false
}], [airConditionerSecondaryText, {
  componentType: "air-conditioner",
  property: "secondaryText",
  trim: false
}], [timeLabel, {
  componentType: "time",
  property: "label",
  trim: true
}], [dateLabel, {
  componentType: "date",
  property: "label",
  trim: true
}], [weatherLabel, {
  componentType: "weather",
  property: "label",
  trim: true
}], [lineChartLabel, {
  componentType: "line-chart",
  property: "label",
  trim: true
}], [panelFrameLabel, {
  componentType: "panel-frame",
  property: "label",
  trim: true
}], [panelFrameMainText, {
  componentType: "panel-frame",
  property: "mainText",
  trim: false
}], [panelFrameSecondaryText, {
  componentType: "panel-frame",
  property: "secondaryText",
  trim: false
}], [navigationLabel, {
  componentType: "navigation-button",
  property: "label",
  trim: true
}], [navigationMainText, {
  componentType: "navigation-button",
  property: "mainText",
  trim: false
}], [navigationSecondaryText, {
  componentType: "navigation-button",
  property: "secondaryText",
  trim: false
}]]);
const pointerSessionByEl = new WeakMap();
for (const [temp2, temp3] of labelFieldBindings) {
  temp2.addEventListener("focus", () => {
    if (!!currentProject && !!componentId) {
      pointerSessionByEl.set(temp2, {
        componentId,
        before: captureHistorySnapshot(),
        historyRecorded: false
      });
    }
  });
  temp2.addEventListener("input", () => {
    if (!currentProject || !componentId) {
      return;
    }
    const value = findComponent(currentProject.document, componentId);
    const flag = temp3.componentTypes || [temp3.componentType];
    if (!value?.component || !flag.includes(value.component.type)) {
      return;
    }
    const chosen = temp3.getValue ? temp3.getValue() : temp2.value;
    const label = temp3.trim ? chosen.trim() : chosen;
    if (String(value.component.properties?.[temp3.property] || "") === label) {
      return;
    }
    let temp = pointerSessionByEl.get(temp2);
    if (!temp || temp.componentId !== componentId) {
      temp = {
        componentId,
        before: captureHistorySnapshot(),
        historyRecorded: false
      };
      pointerSessionByEl.set(temp2, temp);
    }
    if (!temp.historyRecorded) {
      pushHistoryEntry(historyState.undo, temp.before);
      historyState.redo = [];
      temp.historyRecorded = true;
    }
    value.component.properties = {
      ...(value.component.properties || {}),
      [temp3.property]: label
    };
    if (temp3.property === "label") {
      renderComponentTree();
      editorRenderer?.previewComponentProperties(value.component.id, {
        label
      });
      dashboardPreviewRenderer?.previewComponentProperties(value.component.id, {
        label
      });
    }
    if (temp3.componentType === "navigation-button" && temp3.property !== "label") {
      editorRenderer?.previewComponentProperties(value.component.id, {
        [temp3.property]: label
      });
    }
    if (temp3.componentType === "panel-frame" && temp3.property !== "label") {
      editorRenderer?.previewComponentProperties(value.component.id, {
        [temp3.property]: label
      });
    }
    if (temp3.componentType === "icon-button-effect" && temp3.property !== "label") {
      editorRenderer?.previewComponentProperties(value.component.id, {
        [temp3.property]: label
      });
    }
    if (["title-button", "light-statistics", "icon-button", "air-conditioner"].includes(temp3.componentType) && temp3.property !== "label") {
      editorRenderer?.previewComponentProperties(value.component.id, {
        [temp3.property]: label
      });
    }
    syncDocumentDirtyState();
    syncHistoryButtons();
  });
  temp2.addEventListener("blur", () => pointerSessionByEl.delete(temp2));
}
syncMoreInfoActionLabels();
for (const temp2 of document.querySelectorAll(".component-action-controls")) {
  temp2.addEventListener("click", value => {
    const ancestorEl = value.target.closest("[data-hidden-content-clickable]");
    if (ancestorEl && componentId) {
      mutateDocument(item => {
        const component = findComponent(item, componentId)?.component;
        if (!!component && !!["title-button", "device-button", "icon-button-effect"].includes(component.type)) {
          component.properties = {
            ...(component.properties || {}),
            hiddenContentClickable: ancestorEl.dataset.hiddenContentClickable === "on"
          };
        }
      });
      return;
    }
    const ancestorEl2 = value.target.closest("[data-action-type]");
    const temp = ancestorEl2?.closest("[data-action-trigger]");
    const alias = componentId;
    if (!ancestorEl2 || !temp || !alias || ancestorEl2.disabled) {
      return;
    }
    const type = ACTION_TYPES.includes(ancestorEl2.dataset.actionType) ? ancestorEl2.dataset.actionType : "none";
    const actionTrigger = temp.dataset.actionTrigger;
    if (["tap", "doubleTap", "hold"].includes(actionTrigger)) {
      mutateDocument(doc => {
        const component = findComponent(doc, alias)?.component;
        if (!component) {
          return;
        }
        const entityId = component.bindings?.entity?.entityId;
        const flag = component.type === "light-statistics";
        const temp3 = actionPopupData(component.actions?.[actionTrigger]);
        const popupSource = type === "more-info" && !entityId && temp3.source === "current" ? (doc.customPopups || []).length ? "custom" : "entity" : temp3.source;
        const data = type === "more-info" ? {
          popupSource,
          ...(popupSource === "entity" ? {
            entityId: temp3.entityId || entityCatalog[0]?.entityId || ""
          } : {}),
          ...(popupSource === "custom" ? {
            popupId: temp3.popupId || doc.customPopups?.[0]?.id || ""
          } : {})
        } : {};
        const flag2 = component.actions?.[actionTrigger]?.type === "more-info";
        const target = component.actions?.[actionTrigger]?.target;
        const chosen = component.type === "navigation-button" ? component.properties?.targetPage : "";
        const pagePaths = new Set(doc.pages.map(item2 => item2.path));
        const target2 = pagePaths.has(target) ? target : pagePaths.has(chosen) ? chosen : pageSelect.value || doc.pages[0]?.path;
        const chosen2 = type === "none" || componentActionIsSupported(component, type === "navigate" ? {
          type: "navigate",
          target: target2
        } : type === "more-info" ? {
          type: "more-info",
          data
        } : {
          type
        }, {
          pagePaths,
          popupIds: new Set((doc.customPopups || []).map(popupIds => popupIds.id))
        }) ? type : "none";
        component.actions = {
          ...(component.actions || {})
        };
        if (chosen2 === "none") {
          if (component.type === "camera" && actionTrigger === "tap") {
            component.actions[actionTrigger] = {
              type: "none"
            };
          } else {
            delete component.actions[actionTrigger];
          }
        } else if (chosen2 === "navigate") {
          component.actions[actionTrigger] = {
            type: "navigate",
            target: target2
          };
        } else if (chosen2 === "more-info") {
          component.actions[actionTrigger] = {
            type: "more-info",
            data: component.actions?.[actionTrigger]?.type === "more-info" ? {
              ...cloneValue(component.actions[actionTrigger].data || {}),
              ...data
            } : data
          };
        } else {
          component.actions[actionTrigger] = {
            type: chosen2
          };
        }
        if (!flag && chosen2 === "more-info" && !flag2 && !component.properties?.relatedEntities && relatedPopupContext(component, entityCatalogById(), deviceCatalogById())) {
          component.properties = {
            ...(component.properties || {}),
            relatedEntities: manualRelatedEntityConfig([])
          };
        }
      });
    }
  });
  temp2.addEventListener("change", value => {
    const ancestorEl = value.target.closest("[data-popup-source], [data-popup-entity], [data-popup-custom]");
    const temp = ancestorEl?.closest("[data-action-trigger]");
    if (ancestorEl && temp && componentId) {
      const actionTrigger2 = temp.dataset.actionTrigger;
      mutateDocument(item => {
        const component = findComponent(item, componentId)?.component;
        if (!component || !["tap", "doubleTap", "hold"].includes(actionTrigger2)) {
          return;
        }
        const popupSource = temp.querySelector("[data-popup-source]").value;
        const data = {
          popupSource
        };
        if (popupSource === "entity") {
          data.entityId = temp.querySelector("[data-popup-entity]").value;
        }
        if (popupSource === "custom") {
          data.popupId = temp.querySelector("[data-popup-custom]").value;
        }
        component.actions = {
          ...(component.actions || {}),
          [actionTrigger2]: {
            type: "more-info",
            data
          }
        };
      });
      return;
    }
    const element = value.target.closest("[data-action-target]");
    const temp2 = element?.closest("[data-action-trigger]");
    const alias = componentId;
    if (!element || !temp2 || !alias) {
      return;
    }
    const actionTrigger = temp2.dataset.actionTrigger;
    if (["tap", "doubleTap", "hold"].includes(actionTrigger)) {
      mutateDocument(doc => {
        const component = findComponent(doc, alias)?.component;
        if (!!component && !!doc.pages.some(item2 => item2.path === element.value)) {
          component.actions = {
            ...(component.actions || {}),
            [actionTrigger]: {
              type: "navigate",
              target: element.value
            }
          };
          if (component.type === "navigation-button") {
            component.properties = {
              ...(component.properties || {}),
              targetPage: element.value
            };
          }
        }
      });
    }
  });
  temp2.addEventListener("click", value => {
    const ancestorEl = value.target.closest("[data-popup-preview]");
    const temp = ancestorEl?.closest("[data-action-trigger]");
    const component2 = selectedComponent();
    if (!ancestorEl || !temp || !component2 || ancestorEl.disabled) {
      return;
    }
    if (editorMode !== "edit") {
      onError(new Error("请切换到编辑模式后再预览弹窗。"));
      return;
    }
    const popupSource = temp.querySelector("[data-popup-source]").value;
    const data = {
      popupSource
    };
    if (popupSource === "entity") {
      data.entityId = temp.querySelector("[data-popup-entity]").value;
    }
    if (popupSource === "custom") {
      data.popupId = temp.querySelector("[data-popup-custom]").value;
    }
    try {
      createPanelRenderer().previewAction(component2, {
        type: "more-info",
        data
      });
    } catch (error) {
      onError(error);
    }
  });
}
document.addEventListener("click", target17 => {
  const component = target17.target.closest("[data-popup-entity-button]");
  if (component) {
    const querySelector = component.closest("[data-action-trigger]");
    const hidden = querySelector?.querySelector("[data-popup-entity-menu]");
    if (!querySelector || !hidden) {
      return;
    }
    const hidden2 = hidden.hidden;
    closePopupEntityMenus(hidden2 ? querySelector : null);
    hidden.hidden = !hidden2;
    component.setAttribute("aria-expanded", String(hidden2));
    if (hidden2) {
      const el4 = querySelector.querySelector("[data-popup-entity-search]");
      el4.value = "";
      renderPopupEntityOptions(querySelector, "");
      syncPopupEntityButton(querySelector);
      window.requestAnimationFrame(() => el4.focus({
        preventScroll: true
      }));
    }
    return;
  }
  const value = target17.target.closest("[data-popup-action-entity-id]");
  if (!value) {
    return;
  }
  const querySelector2 = value.closest("[data-action-trigger]");
  const el3 = querySelector2?.querySelector("[data-popup-entity]");
  if (!!querySelector2 && !!el3) {
    el3.value = value.dataset.popupActionEntityId;
    popupEntityIdFromRow(querySelector2);
    closePopupEntityMenus();
    el3.dispatchEvent(new Event("change", {
      bubbles: true
    }));
  }
});
document.addEventListener("input", value => {
  const ancestorEl = value.target.closest("[data-popup-entity-search]");
  const temp = ancestorEl?.closest("[data-action-trigger]");
  if (!!ancestorEl && !!temp) {
    renderPopupEntityOptions(temp, ancestorEl.value);
    syncPopupEntityButton(temp);
  }
});
iconButtonPreviewDetails.addEventListener("click", () => {
  const temp = selectedComponent();
  const target = temp?.bindings?.entity?.entityId || "";
  if (temp?.type === "icon-button" && !!target) {
    try {
      createPanelRenderer().showEntityDetails(temp, {
        preview: true
      });
    } catch (temp2) {
      onError(temp2);
    }
  }
});
airConditionerPreviewDetails.addEventListener("click", () => {
  const target = selectedComponent();
  const temp = target?.bindings?.entity?.entityId || "";
  if (target?.type === "air-conditioner" && !!temp) {
    try {
      createPanelRenderer().showEntityDetails(target, {
        preview: true
      });
    } catch (temp2) {
      onError(temp2);
    }
  }
});
imageLayoutOptions.addEventListener("click", value => {
  const temp = value.target.closest("[data-image-layout]");
  const target = componentId;
  if (!temp || !target) {
    return;
  }
  const numeric = temp.dataset.imageLayout === "fill" ? "fill" : "free";
  const component2 = selectedComponent();
  const chosen = component2?.properties?.layoutMode === "fill" ? "fill" : "free";
  if (!!component2 && component2.type === "image" && chosen !== numeric) {
    mutateDocument(canvas2 => {
      const properties13 = findComponent(canvas2, target)?.component;
      if (!properties13 || properties13.type !== "image") {
        return;
      }
      properties13.properties = {
        ...(properties13.properties || {}),
        fit: "contain"
      };
      properties13.style = {
        ...(properties13.style || {})
      };
      if (numeric === "fill") {
        properties13.properties.freeLayout = {
          position: cloneValue(properties13.position || {}),
          scale: clampNumber(Number(properties13.style.scale || 1), 0.01, 5)
        };
        properties13.properties.layoutMode = "fill";
        properties13.position = {
          ...(properties13.position || {}),
          x: 0,
          y: 0,
          width: Number(canvas2.canvas?.width || 2778),
          height: Number(canvas2.canvas?.height || 1940),
          rotation: 0
        };
        properties13.style.scale = 1;
        return;
      }
      const position5 = properties13.properties.freeLayout;
      properties13.properties.layoutMode = "free";
      if (position5?.position) {
        properties13.position = cloneValue(position5.position);
        properties13.style.scale = clampNumber(Number(position5.scale || 1), 0.01, 5);
      } else {
        const width2 = Number(properties13.properties.naturalWidth || properties13.position?.width || 100);
        const height2 = Number(properties13.properties.naturalHeight || properties13.position?.height || 100);
        const number = Number(canvas2.canvas?.width || 2778);
        const canvasHeight = Number(canvas2.canvas?.height || 1940);
        properties13.position = {
          ...(properties13.position || {}),
          x: (number - width2) / 2,
          y: (canvasHeight - height2) / 2,
          width: width2,
          height: height2,
          rotation: 0
        };
        properties13.style.scale = 1;
      }
      delete properties13.properties.freeLayout;
    });
  }
});
imageInspector.addEventListener("input", value => {
  const target = selectedComponent();
  if (!target || target.type !== "image") {
    return;
  }
  const temp = value.target;
  if (String(temp.value).trim() === "") {
    return;
  }
  const number = Number(temp.value);
  if (!Number.isFinite(number)) {
    return;
  }
  const canvasWidth = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number4 = Number(target.position?.width || 100);
  const number5 = Number(target.position?.height || 100);
  if (temp === imageOpacity) {
    const clamped = clampNumber(number, 0, 100);
    editorRenderer?.previewComponentProperties(target.id, {
      opacity: clamped / 100
    });
  } else if (temp === imageLeft) {
    const clamped = clampNumber(number, 0, 100);
    editorRenderer?.previewComponentTransform(target.id, {
      x: canvasWidth * clamped / 100 - number4 / 2
    });
  } else if (temp === imageTop) {
    const clamped = clampNumber(number, 0, 100);
    editorRenderer?.previewComponentTransform(target.id, {
      y: canvasHeight * clamped / 100 - number5 / 2
    });
  } else if (temp === imageScale) {
    const clamped = clampNumber(number, 1, 500);
    editorRenderer?.previewComponentTransform(target.id, {
      scale: clamped / 100
    });
  } else if (temp === imageRotation) {
    const rotation3 = clampNumber(number, -360, 360);
    editorRenderer?.previewComponentTransform(target.id, {
      rotation: rotation3
    });
  }
});
imageInspector.addEventListener("change", value => {
  const ancestorEl = value.target;
  const alias = componentId;
  if (!!alias && !![imageLabel, imageOpacity, imageLeft, imageTop, imageScale, imageRotation].includes(ancestorEl)) {
    if ([imageOpacity, imageLeft, imageTop, imageScale, imageRotation].includes(ancestorEl) && (String(ancestorEl.value).trim() === "" || !Number.isFinite(Number(ancestorEl.value)))) {
      refreshInspector();
      return;
    }
    mutateDocument(item => {
      const component = findComponent(item, alias)?.component;
      if (!component || component.type !== "image") {
        return;
      }
      component.properties = {
        ...(component.properties || {})
      };
      component.position = {
        ...(component.position || {})
      };
      component.style = {
        ...(component.style || {})
      };
      component.bindings = {
        ...(component.bindings || {})
      };
      component.actions = {
        ...(component.actions || {})
      };
      component.properties.fit = "contain";
      const number = Number(item.canvas.width || 2778);
      const canvasHeight = Number(item.canvas.height || 1940);
      const number3 = Number(ancestorEl.value);
      if (ancestorEl === imageLabel) {
        component.properties.label = ancestorEl.value.trim();
      } else if (ancestorEl === imageOpacity) {
        component.properties.opacity = clampNumber(number3, 0, 100) / 100;
      } else if (ancestorEl === imageLeft) {
        component.position.x = number * clampNumber(number3, 0, 100) / 100 - Number(component.position.width || 100) / 2;
      } else if (ancestorEl === imageTop) {
        component.position.y = canvasHeight * clampNumber(number3, 0, 100) / 100 - Number(component.position.height || 100) / 2;
      } else if (ancestorEl === imageScale) {
        component.style.scale = clampNumber(number3, 1, 500) / 100;
      } else if (ancestorEl === imageRotation) {
        setComponentsRotation(item, alias, clampNumber(number3, -360, 360));
      }
    });
  }
});
const floorplanAutoDiagramFields = new Set([floorplanAutoDiagramLeft, floorplanAutoDiagramTop, floorplanAutoDiagramWidth, floorplanAutoDiagramHeight, floorplanAutoDiagramScale, floorplanAutoDiagramRotation]);
floorplanAutoDiagramInspector.addEventListener("input", value => {
  const component2 = selectedComponent();
  const eventTarget = value.target;
  if (!component2 || component2.type !== "floorplan-auto-diagram" || !floorplanAutoDiagramFields.has(eventTarget)) {
    return;
  }
  const number = Number(eventTarget.value);
  if (!Number.isFinite(number)) {
    return;
  }
  const canvasWidth = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number4 = Number(component2.position?.width || 100);
  const number5 = Number(component2.position?.height || 100);
  if (eventTarget === floorplanAutoDiagramLeft) {
    editorRenderer?.previewComponentTransform(component2.id, {
      x: canvasWidth * clampNumber(number, 0, 100) / 100 - number4 / 2
    });
  } else if (eventTarget === floorplanAutoDiagramTop) {
    editorRenderer?.previewComponentTransform(component2.id, {
      y: canvasHeight * clampNumber(number, 0, 100) / 100 - number5 / 2
    });
  } else if (eventTarget === floorplanAutoDiagramWidth) {
    editorRenderer?.previewComponentTransform(component2.id, {
      width: canvasWidth * clampNumber(number, 0.1, 100) / 100
    });
  } else if (eventTarget === floorplanAutoDiagramHeight) {
    editorRenderer?.previewComponentTransform(component2.id, {
      height: canvasHeight * clampNumber(number, 0.1, 100) / 100
    });
  } else if (eventTarget === floorplanAutoDiagramScale) {
    editorRenderer?.previewComponentTransform(component2.id, {
      scale: clampNumber(number, 1, 500) / 100
    });
  } else if (eventTarget === floorplanAutoDiagramRotation) {
    editorRenderer?.previewComponentTransform(component2.id, {
      rotation: clampNumber(number, -360, 360)
    });
  }
});
floorplanAutoDiagramInspector.addEventListener("change", value => {
  const ancestorEl = value.target;
  const temp = componentId;
  if (!!temp && !![floorplanAutoDiagramLabel, floorplanAutoDiagramFolder, ...floorplanAutoDiagramFields].includes(ancestorEl)) {
    if (floorplanAutoDiagramFields.has(ancestorEl) && !Number.isFinite(Number(ancestorEl.value))) {
      refreshInspector();
      return;
    }
    mutateDocument(canvas3 => {
      const position6 = findComponent(canvas3, temp)?.component;
      if (!!position6 && position6.type === "floorplan-auto-diagram") {
        position6.properties = {
          ...(position6.properties || {})
        };
        position6.position = {
          ...(position6.position || {})
        };
        position6.style = {
          ...(position6.style || {})
        };
        if (ancestorEl === floorplanAutoDiagramLabel) {
          position6.properties.label = ancestorEl.value.trim();
        } else if (ancestorEl === floorplanAutoDiagramFolder) {
          position6.properties.exportFolder = ancestorEl.value.trim();
        } else {
          const number = Number(canvas3.canvas.width || 2778);
          const canvasHeight = Number(canvas3.canvas.height || 1940);
          const number3 = Number(ancestorEl.value);
          if (ancestorEl === floorplanAutoDiagramLeft) {
            position6.position.x = number * clampNumber(number3, 0, 100) / 100 - Number(position6.position.width || 100) / 2;
          } else if (ancestorEl === floorplanAutoDiagramTop) {
            position6.position.y = canvasHeight * clampNumber(number3, 0, 100) / 100 - Number(position6.position.height || 100) / 2;
          } else if (ancestorEl === floorplanAutoDiagramWidth) {
            position6.position.width = number * clampNumber(number3, 0.1, 100) / 100;
          } else if (ancestorEl === floorplanAutoDiagramHeight) {
            position6.position.height = canvasHeight * clampNumber(number3, 0.1, 100) / 100;
          } else if (ancestorEl === floorplanAutoDiagramScale) {
            position6.style.scale = clampNumber(number3, 1, 500) / 100;
          } else if (ancestorEl === floorplanAutoDiagramRotation) {
            setComponentsRotation(canvas3, temp, clampNumber(number3, -360, 360));
          }
        }
      }
    });
  }
});
floorplanAutoDiagramLayout.addEventListener("click", target18 => {
  const value = target18.target.closest("[data-floorplan-layout]");
  const alias = componentId;
  if (!!value && !!alias) {
    mutateDocument(item => {
      const temp2 = findComponent(item, alias)?.component;
      if (temp2?.type === "floorplan-auto-diagram") {
        temp2.properties = {
          ...(temp2.properties || {}),
          layoutMode: value.dataset.floorplanLayout === "fill" ? "fill" : "free"
        };
      }
    });
  }
});
function postMessageToFloorplanComponent(componentId, command, value = null) {
  const element = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(componentId) + "\"] .hb-floorplan-auto-diagram-preview");
  if (element?.contentWindow) {
    element.contentWindow.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-camera",
      componentId,
      command,
      value
    }, window.location.origin);
    return true;
  } else {
    return false;
  }
}
function setFloorplanAutoDiagramStatus(componentId, value) {
  const element = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(componentId) + "\"] .hb-floorplan-auto-diagram-preview");
  if (element?.contentWindow) {
    element.contentWindow.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-floor",
      componentId,
      command: "set-floor",
      value
    }, window.location.origin);
    return true;
  } else {
    return false;
  }
}
function refreshFloorplanAutoDiagramFrame(el3) {
  if (!el3?.isConnected) {
    return;
  }
  const querySelector3 = el3.closest(".hb-floorplan-auto-diagram");
  if (!querySelector3) {
    return;
  }
  el3.classList.remove("is-ready");
  let className9 = querySelector3.querySelector(".hb-floorplan-auto-diagram-loading");
  if (!className9) {
    className9 = document.createElement("div");
    className9.className = "hb-floorplan-auto-diagram-loading";
    className9.innerHTML = "<i aria-hidden=\"true\"></i><strong>正在重新载入3D户型…</strong>";
    querySelector3.append(className9);
  }
  const searchParams = new URL(el3.src, window.location.origin);
  searchParams.searchParams.set("auto-diagram-refresh", String(Date.now()));
  el3.src = searchParams.toString();
}
window.addEventListener("pageshow", value => {
  if (value.persisted) {
    for (const temp of document.querySelectorAll(".hb-floorplan-auto-diagram-preview")) {
      refreshFloorplanAutoDiagramFrame(temp);
    }
  }
});
floorplanAutoDiagramCameraView.addEventListener("click", target19 => {
  const value = target19.target.closest("[data-floorplan-camera-view]");
  const alias = componentId;
  if (!value || !alias) {
    return;
  }
  const cameraFocalLength = value.dataset.floorplanCameraView === "top" ? "top" : "free";
  mutateDocument(item => {
    const component = findComponent(item, alias)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      component.properties = {
        ...(component.properties || {}),
        cameraView: cameraFocalLength
      };
    }
  });
  postMessageToFloorplanComponent(alias, "set-view", cameraFocalLength);
});
floorplanAutoDiagramFloor.addEventListener("change", () => {
  const value = componentId;
  const floorSelection2 = String(floorplanAutoDiagramFloor.value || "");
  const properties50 = selectedComponent();
  if (!!value && !!floorSelection2 && properties50?.type === "floorplan-auto-diagram") {
    mutateDocument(item => {
      const component = findComponent(item, value)?.component;
      if (component?.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {}),
          floorSelection: floorSelection2
        };
      }
    });
    setFloorplanAutoDiagramStatus(value, floorSelection2);
    postMessageToFloorplanComponent(value, "restore", {
      view: properties50.properties?.cameraView || "free",
      mode: properties50.properties?.cameraMode || "orthographic",
      topRotation: Number(properties50.properties?.cameraTopRotation || 0),
      focalLength: Number(properties50.properties?.cameraFocalLength || 50)
    });
  }
});
floorplanAutoDiagramCameraMode.addEventListener("click", target20 => {
  const dataset13 = target20.target.closest("[data-floorplan-camera-mode]");
  const alias = componentId;
  if (!dataset13 || !alias) {
    return;
  }
  const cameraMode = dataset13.dataset.floorplanCameraMode === "perspective" ? "perspective" : "orthographic";
  mutateDocument(param => {
    const properties31 = findComponent(param, alias)?.component;
    if (properties31?.type === "floorplan-auto-diagram") {
      properties31.properties = {
        ...(properties31.properties || {}),
        cameraMode
      };
    }
  });
  postMessageToFloorplanComponent(alias, "set-mode", cameraMode);
});
floorplanAutoDiagramFocalLength.addEventListener("change", () => {
  const alias = componentId;
  if (!alias || String(floorplanAutoDiagramFocalLength.value).trim() === "") {
    return refreshInspector();
  }
  const cameraFocalLength = clampNumber(Number(floorplanAutoDiagramFocalLength.value), 18, 120);
  mutateDocument(param => {
    const properties32 = findComponent(param, alias)?.component;
    if (properties32?.type === "floorplan-auto-diagram") {
      properties32.properties = {
        ...(properties32.properties || {}),
        cameraFocalLength
      };
    }
  });
  postMessageToFloorplanComponent(alias, "set-focal-length", cameraFocalLength);
});
floorplanAutoDiagramRotateTop.addEventListener("click", () => {
  const alias = componentId;
  if (alias) {
    mutateDocument(param => {
      const properties14 = findComponent(param, alias)?.component;
      if (properties14?.type === "floorplan-auto-diagram") {
        properties14.properties = {
          ...(properties14.properties || {}),
          cameraView: "top",
          cameraTopRotation: (Number(properties14.properties?.cameraTopRotation || 0) + 90) % 360
        };
      }
    });
    postMessageToFloorplanComponent(alias, "rotate-top");
  }
});
function floorplanAutoLightingIframe(param = autoLightingComponentId) {
  if (param) {
    return document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(param) + "\"] .hb-floorplan-auto-diagram-preview");
  } else {
    return null;
  }
}
function postFloorplanAutoLightingCommand(command, lighting = null) {
  const value = floorplanAutoLightingIframe();
  if (value?.contentWindow) {
    value.contentWindow.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-base-lighting",
      componentId: autoLightingComponentId,
      command,
      ...(lighting ? {
        lighting
      } : {})
    }, window.location.origin);
    return true;
  } else {
    return false;
  }
}
function applyBaseLightingFields(param) {
  const temp = normalizeBaseLighting(param);
  for (const dataset14 of floorplanBaseLightFields) {
    const toFixed = temp[dataset14.dataset.floorplanBaseLight];
    dataset14.value = dataset14.step === "5" ? String(Math.round(toFixed)) : String(Number(toFixed.toFixed(2)));
  }
  return temp;
}
function readBaseLightingFields() {
  const value = {};
  for (const element of floorplanBaseLightFields) {
    value[element.dataset.floorplanBaseLight] = Number(element.value);
  }
  return normalizeBaseLighting(value);
}
function closeAutoLightingPanel({
  cancelPreview: param = true
} = {}) {
  if (!floorplanAutoLightingPanel.hidden) {
    if (param) {
      postFloorplanAutoLightingCommand("cancel");
    }
    floorplanAutoLightingPanel.hidden = true;
    floorplanAutoLightingPanel.setAttribute("aria-busy", "false");
    autoLightingComponentId = "";
    autoLightingDragState = null;
  }
}
function mutateSelection(value) {
  const temp = floorplanAutoLightingIframe(value);
  if (!value || !temp?.contentWindow) {
    return;
  }
  autoLightingComponentId = value;
  temp.classList.remove("is-position-mode");
  temp.classList.add("is-view-mode");
  mutateDocument(param => {
    const properties49 = findComponent(param, value)?.component;
    if (properties49?.type === "floorplan-auto-diagram") {
      properties49.properties = {
        ...(properties49.properties || {}),
        interactionMode: "view"
      };
    }
  });
  applyBaseLightingFields(baseLightingState);
  floorplanAutoLightingStatus.textContent = "正在读取当前光照设置…";
  floorplanAutoLightingPanel.hidden = false;
  floorplanAutoLightingPanel.setAttribute("aria-busy", "true");
  const rect2 = floorplanAutoLightingPanel.getBoundingClientRect();
  if (rect2.right > window.innerWidth - 8 || rect2.bottom > window.innerHeight - 8 || rect2.left < 8 || rect2.top < 8) {
    floorplanAutoLightingPanel.style.right = "auto";
    floorplanAutoLightingPanel.style.left = clampNumber(rect2.left, 8, Math.max(8, window.innerWidth - rect2.width - 8)) + "px";
    floorplanAutoLightingPanel.style.top = clampNumber(rect2.top, 8, Math.max(8, window.innerHeight - rect2.height - 8)) + "px";
  }
  postFloorplanAutoLightingCommand("request-state");
}
floorplanAutoDiagramOpenBaseLighting.addEventListener("click", () => {
  mutateSelection(componentId);
});
for (const temp2 of floorplanBaseLightFields) {
  temp2.addEventListener("input", () => {
    if (!floorplanAutoLightingPanel.hidden) {
      floorplanAutoLightingStatus.textContent = "修改已实时预览，保存后同步到全部3D入口。";
      postFloorplanAutoLightingCommand("preview", readBaseLightingFields());
    }
  });
}
floorplanAutoLightingReset.addEventListener("click", () => {
  applyBaseLightingFields(DEFAULT_BASE_LIGHTING);
  floorplanAutoLightingStatus.textContent = "已预览默认光照，点击保存后生效。";
  postFloorplanAutoLightingCommand("reset");
});
floorplanAutoLightingSave.addEventListener("click", () => {
  floorplanAutoLightingStatus.textContent = "正在保存并同步…";
  floorplanAutoLightingPanel.setAttribute("aria-busy", "true");
  postFloorplanAutoLightingCommand("save", readBaseLightingFields());
});
floorplanAutoLightingCloseBtn.addEventListener("click", () => closeAutoLightingPanel());
floorplanAutoLightingHandle.addEventListener("pointerdown", pointerId => {
  if (pointerId.button !== 0 || pointerId.target.closest("button")) {
    return;
  }
  const left = floorplanAutoLightingPanel.getBoundingClientRect();
  autoLightingDragState = {
    pointerId: pointerId.pointerId,
    startX: pointerId.clientX,
    startY: pointerId.clientY,
    startLeft: left.left,
    startTop: left.top
  };
  try {
    floorplanAutoLightingHandle.setPointerCapture(pointerId.pointerId);
  } catch {}
});
floorplanAutoLightingHandle.addEventListener("pointermove", pointerId2 => {
  if (!autoLightingDragState || pointerId2.pointerId !== autoLightingDragState.pointerId) {
    return;
  }
  pointerId2.preventDefault();
  const component = floorplanAutoLightingPanel.getBoundingClientRect();
  const element = Math.max(8, window.innerWidth - component.width - 8);
  const folderName = Math.max(8, window.innerHeight - component.height - 8);
  floorplanAutoLightingPanel.style.right = "auto";
  floorplanAutoLightingPanel.style.left = clampNumber(autoLightingDragState.startLeft + pointerId2.clientX - autoLightingDragState.startX, 8, element) + "px";
  floorplanAutoLightingPanel.style.top = clampNumber(autoLightingDragState.startTop + pointerId2.clientY - autoLightingDragState.startY, 8, folderName) + "px";
});
const onAutoLightingPointerUp = pointerId3 => {
  if (!!autoLightingDragState && pointerId3.pointerId === autoLightingDragState.pointerId) {
    autoLightingDragState = null;
  }
};
floorplanAutoLightingHandle.addEventListener("pointerup", onAutoLightingPointerUp);
floorplanAutoLightingHandle.addEventListener("pointercancel", onAutoLightingPointerUp);
function resetFloorplanAutoDiagramDialog() {
  if (floorplanAutoDiagramDialog.open) {
    floorplanAutoDiagramDialog.close();
  }
  floorplanAutoDiagramDialog.dataset.componentId = "";
  floorplanAutoDiagramDialog.dataset.cancelRemovesComponent = "false";
  floorplanAutoDiagramGuide.hidden = false;
}
function openFloorplanAutoDiagramDialog(value, {
  cancelRemovesComponent: item = false
} = {}) {
  if (value) {
    floorplanAutoDiagramDialog.dataset.componentId = value;
    floorplanAutoDiagramDialog.dataset.cancelRemovesComponent = String(item);
    floorplanAutoDiagramGuide.hidden = false;
    if (!floorplanAutoDiagramDialog.open) {
      floorplanAutoDiagramDialog.showModal();
    }
  }
}
function closeFloorplanAutoDiagramDialog() {
  const removedId = floorplanAutoDiagramDialog.dataset.componentId;
  const cancelRemovesComponent = floorplanAutoDiagramDialog.dataset.cancelRemovesComponent === "true";
  resetFloorplanAutoDiagramDialog();
  if (!!cancelRemovesComponent && !!removedId) {
    selectedComponentIds.delete(removedId);
    if (componentId === removedId) {
      componentId = selectedComponentIds.values().next().value || null;
    }
    if (rangeSelectAnchorId === removedId) {
      rangeSelectAnchorId = componentId;
    }
    mutateDocument(item => {
      detachComponentById(item, removedId);
    });
  }
}
floorplanAutoDiagramOpenStudio.addEventListener("click", () => {
  const component2 = selectedComponent();
  if (component2?.type !== "floorplan-auto-diagram") {
    return;
  }
  if (component2.properties?.generated === true && component2.properties?.previewing !== true) {
    mutateDocument(param => {
      const properties15 = findComponent(param, component2.id)?.component;
      if (properties15?.type === "floorplan-auto-diagram") {
        properties15.properties = {
          ...(properties15.properties || {}),
          previewReady: true,
          previewing: true,
          interactionMode: "position"
        };
      }
    });
    return;
  }
  const contentWindow6 = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(component2.id) + "\"] .hb-floorplan-auto-diagram-preview");
  if (!contentWindow6?.contentWindow) {
    openFloorplanAutoDiagramDialog(component2.id);
    return;
  }
  const startsWith = String(component2.properties?.exportFolder || "").trim();
  if (!startsWith || /[<>:"/\\|?*\x00-\x1f\x7f]/.test(startsWith) || startsWith.startsWith(".") || /[. ]$/.test(startsWith)) {
    floorplanAutoDiagramStatus.textContent = "请先填写有效的导图文件夹名称。";
    floorplanAutoDiagramFolder.focus();
    return;
  }
  const width9 = component2.position || {};
  const width10 = currentProject.document.canvas || {};
  floorplanAutoDiagramStatus.textContent = "正在后台生成底图和灯组效果，请稍候…";
  floorplanAutoDiagramOpenStudio.disabled = true;
  floorplanAutoDiagramFloor.disabled = true;
  floorplanAutoDiagramOpenStudio.textContent = "正在后台生成…";
  contentWindow6.contentWindow.postMessage({
    type: "ha-bridge-floorplan-auto-diagram-generate",
    componentId: component2.id,
    width: Math.max(320, Math.round(Number(width10.width || width9.width || 2778))),
    height: Math.max(320, Math.round(Number(width10.height || width9.height || 1940))),
    folderName: startsWith
  }, window.location.origin);
});
floorplanAutoDiagramViewToggle.addEventListener("click", () => {
  const alias = componentId;
  if (alias) {
    mutateDocument(param => {
      const properties16 = findComponent(param, alias)?.component;
      if (properties16?.type === "floorplan-auto-diagram") {
        properties16.properties = {
          ...(properties16.properties || {}),
          interactionMode: properties16.properties?.interactionMode === "view" ? "position" : "view"
        };
      }
    });
  }
});
floorplanAutoDiagramCloseBtn.addEventListener("click", closeFloorplanAutoDiagramDialog);
floorplanAutoDiagramLater.addEventListener("click", closeFloorplanAutoDiagramDialog);
floorplanAutoDiagramDialog.addEventListener("cancel", value => {
  value.preventDefault();
  closeFloorplanAutoDiagramDialog();
});
floorplanAutoDiagramContinue.addEventListener("click", () => {
  const temp = floorplanAutoDiagramDialog.dataset.componentId;
  if (temp) {
    mutateDocument(param => {
      const properties17 = findComponent(param, temp)?.component;
      if (properties17?.type === "floorplan-auto-diagram") {
        properties17.properties = {
          ...(properties17.properties || {}),
          previewReady: true,
          previewing: true,
          interactionMode: "position"
        };
      }
    });
    resetFloorplanAutoDiagramDialog();
  }
});
floorplanAutoDiagramBindingList.addEventListener("change", value => {
  const ancestorEl = value.target.closest("[data-floorplan-light-group-id]");
  const alias = componentId;
  if (!ancestorEl || !alias) {
    return;
  }
  const temp2 = ancestorEl.dataset.floorplanLightGroupId;
  mutateDocument(doc => {
    const component = findComponent(doc, alias)?.component;
    if (!component || component.type !== "floorplan-auto-diagram") {
      return;
    }
    component.bindings = {
      ...(component.bindings || {})
    };
    const numeric = "lightGroup:" + temp2;
    if (ancestorEl.value) {
      component.bindings[numeric] = {
        entityId: ancestorEl.value
      };
    } else {
      delete component.bindings[numeric];
    }
  });
});
window.addEventListener("message", value => {
  if (value.origin !== window.location.origin) {
    return;
  }
  const ancestorEl = value.data;
  if (ancestorEl?.type === "ha-bridge-floorplan-auto-diagram-base-lighting-state") {
    const text = String(ancestorEl.componentId || "");
    const contentWindow = floorplanAutoLightingIframe(text);
    if (!contentWindow || value.source !== contentWindow.contentWindow || text !== autoLightingComponentId) {
      return;
    }
    if (ancestorEl.status === "ready" || ancestorEl.status === "saved") {
      baseLightingState = normalizeBaseLighting(ancestorEl.savedLighting || ancestorEl.lighting);
      applyBaseLightingFields(ancestorEl.lighting || baseLightingState);
    }
    floorplanAutoLightingPanel.setAttribute("aria-busy", "false");
    if (ancestorEl.status === "saved") {
      floorplanAutoLightingStatus.textContent = "已保存，并同步到实时预览、手动导图和自动导图。";
    } else if (ancestorEl.status === "ready") {
      floorplanAutoLightingStatus.textContent = "修改会实时同步到当前3D预览。";
    }
    return;
  }
  if (ancestorEl?.type === "ha-bridge-floorplan-auto-diagram-ready") {
    const componentId2 = String(ancestorEl.componentId || "");
    const contentWindow2 = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(componentId2) + "\"] .hb-floorplan-auto-diagram-preview");
    if (!contentWindow2 || value.source !== contentWindow2.contentWindow) {
      return;
    }
    contentWindow2.classList.add("is-ready");
    contentWindow2.parentElement?.querySelector(".hb-floorplan-auto-diagram-loading")?.remove();
    const properties48 = findComponent(currentProject?.document, componentId2)?.component;
    if (properties48?.type === "floorplan-auto-diagram") {
      const floors = (Array.isArray(ancestorEl.floors) ? ancestorEl.floors : []).map(item2 => ({
        id: String(item2?.id || ""),
        name: String(item2?.name || "")
      })).filter(event => event.id);
      const selected = String(ancestorEl.floorSelection || "");
      floorplanPreviewById.set(componentId2, {
        floors,
        selected
      });
      const floorSelection = properties48.properties || {};
      if (Object.prototype.hasOwnProperty.call(floorSelection, "floorSelection") && selected && floorSelection.floorSelection !== selected) {
        mutateDocument(param => {
          const properties8 = findComponent(param, componentId2)?.component;
          if (properties8?.type === "floorplan-auto-diagram") {
            properties8.properties = {
              ...(properties8.properties || {}),
              floorSelection: selected
            };
          }
        });
      }
      refreshInspector();
      contentWindow2.contentWindow.postMessage({
        type: "ha-bridge-floorplan-auto-diagram-camera",
        componentId: componentId2,
        command: "restore",
        value: {
          view: properties48.properties?.cameraView || "free",
          mode: properties48.properties?.cameraMode || "orthographic",
          topRotation: Number(properties48.properties?.cameraTopRotation || 0),
          focalLength: Number(properties48.properties?.cameraFocalLength || 50)
        }
      }, window.location.origin);
    }
    return;
  }
  if (ancestorEl?.type === "ha-bridge-floorplan-auto-diagram-floor-state") {
    const text = String(ancestorEl.componentId || "");
    const contentWindow3 = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(text) + "\"] .hb-floorplan-auto-diagram-preview");
    if (!contentWindow3 || value.source !== contentWindow3.contentWindow) {
      return;
    }
    const floors2 = (Array.isArray(ancestorEl.floors) ? ancestorEl.floors : []).map(item2 => ({
      id: String(item2?.id || ""),
      name: String(item2?.name || "")
    })).filter(component2 => component2.id);
    const selected2 = String(ancestorEl.floorSelection || "");
    floorplanPreviewById.set(text, {
      floors: floors2,
      selected: selected2
    });
    const temp2 = findComponent(currentProject?.document, text)?.component;
    if (temp2?.type === "floorplan-auto-diagram" && selected2 && temp2.properties?.floorSelection !== selected2) {
      mutateDocument(param => {
        const properties10 = findComponent(param, text)?.component;
        if (properties10?.type === "floorplan-auto-diagram") {
          properties10.properties = {
            ...(properties10.properties || {}),
            floorSelection: selected2
          };
        }
      });
    }
    if (text === componentId) {
      refreshInspector();
    }
    return;
  }
  if (ancestorEl?.type === "ha-bridge-floorplan-auto-diagram-stopped") {
    const text = String(ancestorEl.componentId || "");
    const contentWindow4 = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(text) + "\"] .hb-floorplan-auto-diagram-preview");
    if (!contentWindow4 || value.source !== contentWindow4.contentWindow) {
      return;
    }
    floorplanAutoDiagramOpenStudio.disabled = false;
    if (text === componentId) {
      floorplanAutoDiagramFloor.disabled = false;
    }
    floorplanAutoDiagramOpenStudio.textContent = "确定位置大小并后台生成";
    floorplanAutoDiagramStatus.textContent = ancestorEl.message || "已停止本次生成。";
    if (ancestorEl.reason === "rename") {
      floorplanAutoDiagramFolder.focus();
    }
    return;
  }
  if (ancestorEl?.type === "ha-bridge-floorplan-auto-diagram-error") {
    const text = String(ancestorEl.componentId || "");
    const contentWindow5 = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(text) + "\"] .hb-floorplan-auto-diagram-preview");
    if (!contentWindow5 || value.source !== contentWindow5.contentWindow) {
      return;
    }
    floorplanAutoDiagramOpenStudio.disabled = false;
    if (text === componentId) {
      floorplanAutoDiagramFloor.disabled = false;
    }
    floorplanAutoDiagramOpenStudio.textContent = "确定位置大小并后台生成";
    floorplanAutoDiagramStatus.textContent = ancestorEl.message || "后台生成失败，请重试。";
    return;
  }
  if (!ancestorEl || ancestorEl.type !== "ha-bridge-floorplan-auto-diagram-export") {
    return;
  }
  const temp = String(ancestorEl.componentId || "");
  const contentWindow7 = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(temp) + "\"] .hb-floorplan-auto-diagram-preview");
  if (!contentWindow7 || value.source !== contentWindow7.contentWindow) {
    return;
  }
  const resolution = ancestorEl.manifest;
  const autoDiagramFolder = String(ancestorEl.folderName || resolution?.exportName || "").trim();
  if (!temp || !resolution || !autoDiagramFolder) {
    return;
  }
  floorplanAutoDiagramOpenStudio.disabled = false;
  floorplanAutoDiagramOpenStudio.textContent = "确定位置大小并后台生成";
  floorplanAutoDiagramStatus.textContent = "已生成，正在置换到仪表盘…";
  const hidden2 = contentWindow7.closest(".hb-component");
  if (hidden2) {
    hidden2.hidden = true;
  }
  mutateDocument(canvas => {
    let page = findComponentLocation(canvas, temp);
    const position4 = page?.component;
    if (!position4 || position4.type !== "floorplan-auto-diagram" || !page.page) {
      return null;
    }
    const components2 = page.page;
    const filter = [];
    const callback = param => {
      for (const properties of param || []) {
        if (properties?.properties?.autoDiagramFolder === autoDiagramFolder) {
          filter.push(properties);
        }
        callback(properties?.children);
      }
    };
    callback(components2.components);
    const imageAutoDiagramRoleById = new Map(filter.filter(type => type.type === "image").map(properties2 => [properties2.properties?.autoDiagramRole === "base" ? "background-with-plan" : String(properties2.properties?.autoDiagramRole || ""), properties2]));
    const idMap = new Map(filter.filter(component2 => component2.type === "icon-button-effect").map(properties3 => {
      const text = String(properties3.properties?.autoDiagramRole || "light-group");
      const text2 = String(properties3.properties?.autoDiagramLayerId || properties3.properties?.autoDiagramGroupId || "");
      return [text + ":" + text2, properties3];
    }));
    for (const temp3 of filter) {
      detachComponentById(canvas, temp3.id);
    }
    page = findComponentLocation(canvas, temp);
    if (!page) {
      return null;
    }
    const number = Number(canvas.canvas?.width || 2778);
    const canvasHeight = Number(canvas.canvas?.height || 1940);
    const naturalWidth = Math.max(1, Number(resolution.resolution?.width || position4.position?.width || 1));
    const naturalHeight = Math.max(1, Number(resolution.resolution?.height || position4.position?.height || 1));
    const layoutMode = position4.properties?.layoutMode === "fill" ? "fill" : "free";
    const width3 = position4.position || {};
    const chosen = layoutMode === "fill" ? 1 : Math.max(0.01, Math.min(5, Number(position4.style?.scale || 1)));
    const chosen2 = layoutMode === "fill" ? number : Number(width3.width || 100);
    const chosen3 = layoutMode === "fill" ? canvasHeight : Number(width3.height || 100);
    const width4 = chosen2 * chosen;
    const height3 = chosen3 * chosen;
    const chosen4 = layoutMode === "fill" ? 0 : Number(width3.x || 0) - (width4 - chosen2) / 2;
    const chosen5 = layoutMode === "fill" ? 0 : Number(width3.y || 0) - (height3 - chosen3) / 2;
    const rotation = layoutMode === "fill" ? 0 : Number(width3.rotation || 0);
    const find = [{
      role: "background",
      file: resolution.backgroundImage,
      label: "00底图",
      visible: true
    }, {
      role: "floor-plan",
      file: resolution.floorPlanImage,
      label: "00户型图",
      visible: true
    }, {
      role: "background-with-plan",
      file: resolution.baseImage,
      label: "00底图带户型",
      visible: false
    }].filter(file => file.file).map(label => {
      const style = imageAutoDiagramRoleById.get(label.role);
      const position = style ? cloneValue(style) : createComponentFromTemplate("image", {
        id: newId("component"),
        instanceName: label.label,
        canvas: canvas.canvas
      });
      position.position = {
        ...(position.position || {}),
        x: chosen4,
        y: chosen5,
        width: width4,
        height: height3,
        rotation
      };
      position.style = {
        ...(position.style || {}),
        scale: 1,
        visible: style ? style.style?.visible !== false : label.visible
      };
      position.bindings = {};
      position.actions = {};
      position.properties = {
        ...(position.properties || {}),
        instanceName: label.label,
        label: label.label,
        assetId: "studio3d:" + autoDiagramFolder + "/" + label.file,
        naturalWidth,
        naturalHeight,
        opacity: 1,
        fit: "contain",
        layoutMode,
        autoDiagramFolder,
        autoDiagramRole: label.role,
        autoDiagramCamera: resolution.camera || null
      };
      return position;
    });
    const found = find.find(properties4 => properties4.properties?.autoDiagramRole === "background");
    const found2 = find.find(properties5 => properties5.properties?.autoDiagramRole === "floor-plan");
    const found3 = find.find(properties6 => properties6.properties?.autoDiagramRole === "background-with-plan");
    const flag2 = found3 || found2 || found;
    const mapped = (Array.isArray(resolution.groups) ? resolution.groups : []).filter(item2 => String(item2?.id || item2?.groupId || "") && item2?.file).map(name => ({
      role: "light-group",
      id: String(name.id || name.groupId || ""),
      name: String(name.name || name.note || "灯组"),
      note: String(name.note || name.name || "灯组"),
      file: name.file,
      icon: "mdi:lightbulb-outline",
      anchor: name.anchor
    }));
    const mapped2 = (Array.isArray(resolution.screens) ? resolution.screens : []).filter(item2 => String(item2?.id || item2?.itemId || "") && item2?.file).map(name2 => ({
      role: "television",
      id: String(name2.id || name2.itemId || ""),
      name: String(name2.name || "电视画面"),
      note: String(name2.name || "电视画面"),
      file: name2.file,
      icon: "mdi:television",
      anchor: name2.anchor
    }));
    const mapped3 = (Array.isArray(resolution.vehicles) ? resolution.vehicles : []).filter(item2 => String(item2?.id || item2?.itemId || "") && item2?.file).map(name3 => ({
      role: "vehicle",
      id: String(name3.id || name3.itemId || ""),
      name: String(name3.name || "汽车充电"),
      note: String(name3.name || "汽车充电"),
      file: name3.file,
      icon: "mdi:car-electric",
      anchor: name3.anchor
    }));
    const length = [...mapped2, ...mapped3, ...mapped];
    const number3 = chosen4 + width4 / 2;
    const number4 = chosen5 + height3 / 2;
    const number5 = rotation * Math.PI / 180;
    const minValue = Math.min(width4 / naturalWidth, height3 / naturalHeight);
    const number6 = naturalWidth * minValue;
    const number7 = naturalHeight * minValue;
    const push2 = [];
    const callback2 = (anchor, param, param2, param3) => {
      const number8 = Number(anchor.anchor?.x);
      const number9 = Number(anchor.anchor?.y);
      const options2 = {
        x: length.length > 1 ? (param + 1) / (length.length + 1) : 0.5,
        y: 0.9
      };
      const chosen6 = Number.isFinite(number8) && Number.isFinite(number9) ? {
        x: number8,
        number9
      } : options2;
      const spacingX = Math.max(0.035, param2 / Math.max(number6, 1) * 1.08);
      const spacingY = Math.max(0.045, param3 / Math.max(number7, 1) * 1.08);
      const push = [[0, 0]];
      for (let number8 = 1; number8 <= 4; number8 += 1) {
        push.push([0, -spacingY * number8], [spacingX * number8, 0], [0, spacingY * number8], [-spacingX * number8, 0], [spacingX * number8, -spacingY * number8], [spacingX * number8, spacingY * number8], [-spacingX * number8, spacingY * number8], [-spacingX * number8, -spacingY * number8]);
      }
      let alias = null;
      for (const [temp3, temp4] of push) {
        const clamped = {
          x: clampNumber(chosen6.x + temp3, spacingX / 2, 1 - spacingX / 2),
          y: clampNumber(chosen6.y + temp4, spacingY / 2, 1 - spacingY / 2)
        };
        if (!push2.some(item => Math.abs(clamped.x - item.x) < (spacingX + item.spacingX) / 2 && Math.abs(clamped.y - item.y) < (spacingY + item.spacingY) / 2)) {
          alias = clamped;
          break;
        }
      }
      alias ||= {
        x: clampNumber(options2.x, spacingX / 2, 1 - spacingX / 2),
        y: clampNumber(options2.y, spacingY / 2, 1 - spacingY / 2)
      };
      push2.push({
        ...alias,
        spacingX,
        spacingY
      });
      return alias;
    };
    const cloned = length.map((role, index) => {
      const properties7 = idMap.get(role.role + ":" + role.id);
      const position2 = properties7 ? cloneValue(properties7) : createComponentFromTemplate("icon-button-effect", {
        id: newId("component"),
        instanceName: role.name,
        canvas: canvas.canvas
      });
      const temp3 = properties7?.properties?.autoDiagramSceneAnchor;
      const flag = !temp3 || Math.abs(Number(temp3.x) - Number(role.anchor?.x)) > 0.002 || Math.abs(Number(temp3.y) - Number(role.anchor?.y)) > 0.002;
      const flag2 = !!properties7 && Number(properties7.properties?.autoDiagramLayoutVersion || 0) < EDITOR_LAYOUT_GAP;
      const flag3 = !properties7 || flag2 || role.role === "light-group" && flag;
      let flag4 = properties7?.properties?.autoDiagramButtonAnchor || null;
      if (flag3) {
        const number8 = Number(position2.position?.width || number * 0.075);
        const number9 = Number(position2.position?.height || number8);
        const maxValue = Math.max(0.01, Math.min(5, Number(position2.style?.scale || 1)));
        flag4 = callback2(role, index, number8 * maxValue, number9 * maxValue);
        const number10 = -number6 / 2 + flag4.x * number6;
        const number11 = -number7 / 2 + flag4.y * number7;
        const number12 = number10 * Math.cos(number5) - number11 * Math.sin(number5);
        const number13 = number10 * Math.sin(number5) + number11 * Math.cos(number5);
        position2.position = {
          ...(position2.position || {}),
          x: number3 + number12 - number8 / 2,
          y: number4 + number13 - number9 / 2,
          rotation
        };
      } else if (Number.isFinite(Number(flag4?.x)) && Number.isFinite(Number(flag4?.y))) {
        const number8 = Number(position2.position?.width || number * 0.075);
        const number9 = Number(position2.position?.height || number8);
        const maxValue = Math.max(0.01, Math.min(5, Number(position2.style?.scale || 1)));
        push2.push({
          x: Number(flag4.x),
          y: Number(flag4.y),
          spacingX: Math.max(0.035, number8 * maxValue / Math.max(number6, 1) * 1.08),
          spacingY: Math.max(0.045, number9 * maxValue / Math.max(number7, 1) * 1.08)
        });
      }
      position2.style = {
        ...(position2.style || {}),
        visible: true
      };
      position2.bindings = {
        ...(position2.bindings || {})
      };
      if (!properties7 && role.role === "light-group") {
        const entityId = position4.bindings?.["lightGroup:" + role.id];
        if (entityId?.entityId) {
          position2.bindings.entity = {
            entityId: entityId.entityId
          };
        }
      }
      position2.actions = Object.keys(position2.actions || {}).length ? {
        ...(position2.actions || {})
      } : {
        tap: {
          type: "toggle"
        }
      };
      position2.properties = {
        ...(position2.properties || {}),
        instanceName: role.name,
        label: role.name,
        note: role.note,
        icon: properties7?.properties?.icon || role.icon,
        effectAssetId: "studio3d:" + autoDiagramFolder + "/" + role.file,
        effectNaturalWidth: naturalWidth,
        effectNaturalHeight: naturalHeight,
        effectReferenceImageId: flag2?.id || "",
        effectLayoutMode: layoutMode,
        effectLeft: number3 / number * 100,
        effectTop: number4 / canvasHeight * 100,
        effectScale: 1,
        effectRotation: rotation,
        autoDiagramFolder,
        autoDiagramRole: role.role,
        autoDiagramLayerId: role.id,
        autoDiagramSceneAnchor: role.anchor || null,
        autoDiagramButtonAnchor: flag4,
        autoDiagramLayoutVersion: EDITOR_LAYOUT_GAP,
        ...(role.role === "light-group" ? {
          autoDiagramGroupId: role.id
        } : {})
      };
      return position2;
    });
    const filtered = [found2, found, found3].filter(Boolean);
    const temp2 = page.index;
    detachComponentById(canvas, temp);
    page.collection.splice(temp2, 0, ...cloned, ...filtered);
    applyCollectionLayerOrder(page.collection);
    return {
      removed: true,
      selectedId: (found || found2 || found3 || cloned[0])?.id || null
    };
  }).then(removed => {
    if (!removed?.removed) {
      if (hidden2?.isConnected) {
        hidden2.hidden = false;
      }
      return;
    }
    const temp2 = removed.selectedId;
    componentId = temp2;
    selectedComponentIds = temp2 ? new Set([temp2]) : new Set();
    rangeSelectAnchorId = temp2;
    editorRenderer?.setSelectedComponents(temp2 ? [temp2] : [], temp2);
    renderComponentTree();
    refreshInspector();
  }).catch(onError);
});
const ibeRealtimeFieldMap = new Map([[ibeColorTemperatureRealtime, {
  property: "effectColorTemperatureRealtime",
  type: "boolean"
}], [ibeBrightnessRealtime, {
  property: "effectBrightnessRealtime",
  type: "boolean"
}], [ibeIconOffColor, {
  property: "iconOffColor"
}], [ibeIconOnColor, {
  property: "iconOnColor"
}], [ibeIconSize, {
  property: "iconSize",
  min: 1,
  max: 100
}], [ibeButtonOffColor, {
  property: "buttonOffColor"
}], [ibeButtonOnColor, {
  property: "buttonOnColor"
}], [ibeButtonOpacity, {
  property: "buttonOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [ibeFrameColor, {
  property: "frameColor"
}], [ibeFrameWidth, {
  property: "frameWidth",
  min: 0,
  max: 20
}], [ibeFrameOpacity, {
  property: "frameOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [ibeRadius, {
  property: "radius",
  min: 0,
  max: 50
}], [ibeGlowColor, {
  property: "glowColor"
}], [ibeGlowOffStrength, {
  property: "glowOffStrength",
  min: 0,
  max: 300,
  divisor: 100
}], [ibeGlowOnStrength, {
  property: "glowOnStrength",
  min: 0,
  max: 300,
  divisor: 100
}], [ibeEffectOpacity, {
  property: "effectOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [ibeEffectFadeDuration, {
  property: "effectFadeDuration",
  min: 0,
  max: 3
}], [ibeEffectLeft, {
  property: "effectLeft",
  min: -100,
  max: 200
}], [ibeEffectTop, {
  property: "effectTop",
  min: -100,
  max: 200
}], [ibeEffectScale, {
  property: "effectScale",
  min: 1,
  max: 500,
  divisor: 100
}], [ibeEffectRotation, {
  property: "effectRotation",
  min: -360,
  max: 360
}]]);
const ibeOffPropertyMap = new Map([[ibeIconOffColor, "off"], [ibeButtonOffColor, "off"], [ibeGlowOffStrength, "off"], [ibeIconOnColor, "on"], [ibeButtonOnColor, "on"], [ibeGlowOnStrength, "on"]]);
const ibeTransformFields = new Set([ibeLeft, ibeTop, ibeWidth, ibeHeight, ibeScale, ibeRotation]);
function ibeTemplateOptions2(value) {
  const list = ibeOffPropertyMap.get(value);
  const callback = selectedComponent();
  if (!!list && callback?.type === "icon-button-effect") {
    ibePreviewStateById.set(callback.id, list);
    editorRenderer?.setComponentPreviewState(callback.id, list);
    for (const dataset6 of ibePreviewState.querySelectorAll("[data-ibe-preview]")) {
      const flag = dataset6.dataset.ibePreview === list;
      dataset6.classList.toggle("active", flag);
      dataset6.setAttribute("aria-pressed", String(flag));
    }
  }
}
for (const temp2 of ["focusin", "pointerdown"]) {
  iconButtonEffectInspector.addEventListener(temp2, value => ibeTemplateOptions2(value.target));
}
iconButtonEffectInspector.addEventListener("input", target21 => {
  const component2 = selectedComponent();
  if (!component2 || component2.type !== "icon-button-effect") {
    return;
  }
  ibeTemplateOptions2(target21.target);
  const temp2 = ibeRealtimeFieldMap.get(target21.target);
  if (temp2) {
    let chosen = temp2.type === "boolean" ? target21.target.checked : target21.target.type === "color" ? target21.target.value : Number(target21.target.value);
    if (temp2.type !== "boolean" && target21.target.type !== "color") {
      if (!Number.isFinite(chosen)) {
        return;
      }
      chosen = clampNumber(chosen, temp2.min, temp2.max) / (temp2.divisor || 1);
    }
    editorRenderer?.previewComponentProperties(component2.id, {
      [temp2.property]: chosen
    });
    return;
  }
  if (!ibeTransformFields.has(target21.target) || !Number.isFinite(Number(target21.target.value))) {
    return;
  }
  const number = Number(target21.target.value);
  const canvasWidth = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number4 = Number(component2.position?.width || 100);
  const number5 = Number(component2.position?.height || 100);
  if (target21.target === ibeLeft) {
    editorRenderer?.previewComponentTransform(component2.id, {
      x: canvasWidth * clampNumber(number, 0, 100) / 100 - number4 / 2
    });
  } else if (target21.target === ibeTop) {
    editorRenderer?.previewComponentTransform(component2.id, {
      y: canvasHeight * clampNumber(number, 0, 100) / 100 - number5 / 2
    });
  } else if (target21.target === ibeWidth) {
    editorRenderer?.previewComponentTransform(component2.id, {
      width: canvasWidth * clampNumber(number, 0.1, 100) / 100
    });
  } else if (target21.target === ibeHeight) {
    editorRenderer?.previewComponentTransform(component2.id, {
      height: canvasHeight * clampNumber(number, 0.1, 100) / 100
    });
  } else if (target21.target === ibeScale) {
    editorRenderer?.previewComponentTransform(component2.id, {
      scale: clampNumber(number, 1, 500) / 100
    });
  } else if (target21.target === ibeRotation) {
    editorRenderer?.previewComponentTransform(component2.id, {
      rotation: clampNumber(number, -360, 360)
    });
  }
});
iconButtonEffectInspector.addEventListener("change", target22 => {
  const eventTarget = target22.target;
  const property = ibeRealtimeFieldMap.get(eventTarget);
  if (!property && !ibeTransformFields.has(eventTarget)) {
    return;
  }
  if (eventTarget.type === "number" && !Number.isFinite(Number(eventTarget.value))) {
    refreshInspector();
    return;
  }
  const alias = componentId;
  mutateDocument(canvas10 => {
    const position14 = findComponent(canvas10, alias)?.component;
    if (!position14 || position14.type !== "icon-button-effect") {
      return;
    }
    position14.properties = {
      ...(position14.properties || {})
    };
    position14.position = {
      ...(position14.position || {})
    };
    position14.style = {
      ...(position14.style || {})
    };
    if (property) {
      position14.properties[property.property] = property.type === "boolean" ? eventTarget.checked : eventTarget.type === "color" ? eventTarget.value : clampNumber(Number(eventTarget.value), property.min, property.max) / (property.divisor || 1);
      return;
    }
    const number = Number(canvas10.canvas.width || 2778);
    const canvasHeight = Number(canvas10.canvas.height || 1940);
    const number3 = Number(eventTarget.value);
    if (eventTarget === ibeLeft) {
      position14.position.x = number * clampNumber(number3, 0, 100) / 100 - Number(position14.position.width || 100) / 2;
    } else if (eventTarget === ibeTop) {
      position14.position.y = canvasHeight * clampNumber(number3, 0, 100) / 100 - Number(position14.position.height || 100) / 2;
    } else if (eventTarget === ibeWidth) {
      position14.position.width = number * clampNumber(number3, 0.1, 100) / 100;
    } else if (eventTarget === ibeHeight) {
      position14.position.height = canvasHeight * clampNumber(number3, 0.1, 100) / 100;
    } else if (eventTarget === ibeScale) {
      position14.style.scale = clampNumber(number3, 1, 500) / 100;
    } else if (eventTarget === ibeRotation) {
      setComponentsRotation(canvas10, alias, clampNumber(number3, -360, 360));
    }
  });
});
ibeEffectLayoutOptions.addEventListener("click", target23 => {
  const dataset15 = target23.target.closest("[data-ibe-layout]");
  const alias = componentId;
  if (!!dataset15 && !!alias) {
    mutateDocument(param => {
      const properties18 = findComponent(param, alias)?.component;
      if (!!properties18 && properties18.type === "icon-button-effect") {
        properties18.properties = {
          ...(properties18.properties || {}),
          effectLayoutMode: dataset15.dataset.ibeLayout === "fill" ? "fill" : "free"
        };
      }
    });
  }
});
function collectImageComponents(value) {
  const push4 = [];
  const callback = param => {
    for (const temp2 of param || []) {
      if (temp2.type === "image") {
        push4.push(temp2);
      }
      callback(temp2.children);
    }
  };
  callback(value?.components);
  return push4;
}
function createEffectImageAlignOption(component, value) {
  const temp = document.createElement("label");
  temp.className = "effect-image-align-option";
  const element = document.createElement("input");
  element.type = "radio";
  element.name = "effect-image-align-target";
  element.value = component.id;
  element.checked = value;
  const span = document.createElement("span");
  span.className = "effect-image-align-option-preview";
  const temp2 = findAssetById(component.properties?.assetId || "");
  const temp3 = toText(temp2);
  if (temp3) {
    const img = document.createElement("img");
    img.src = temp3;
    img.alt = "";
    span.append(img);
  } else {
    span.textContent = "无预览";
  }
  const span2 = document.createElement("span");
  span2.className = "effect-image-align-option-copy";
  const el3 = document.createElement("strong");
  el3.textContent = componentLabel(component);
  const el4 = document.createElement("small");
  const flag = component.properties?.layoutMode === "fill";
  const chosen = component.style?.visible === false ? "隐藏" : "显示";
  const numeric = Number(currentProject?.document?.canvas?.width || 2778);
  const canvasHeight = Number(currentProject?.document?.canvas?.height || 1940);
  const flag2 = component.position || {};
  const number = Number(flag2.width || 100);
  const number2 = Number(flag2.height || 100);
  const temp5 = roundField((Number(flag2.x || 0) + number / 2) / numeric * 100);
  const temp6 = roundField((Number(flag2.y || 0) + number2 / 2) / canvasHeight * 100);
  const temp7 = roundField(Number(component.style?.scale || 1) * 100);
  const temp8 = roundField(Number(flag2.rotation || 0));
  el4.textContent = flag ? "铺满 · 覆盖整个画布" : "自由 · 左 " + temp5 + "% · 上 " + temp6 + "%";
  const el5 = document.createElement("small");
  el5.textContent = flag ? chosen : "缩放 " + temp7 + "% · 旋转 " + temp8 + "° · " + chosen;
  span2.append(el3, el4, el5);
  temp.append(element, span, span2);
  return temp;
}
function renderList3() {
  const component = selectedComponent();
  const value = currentPage();
  if (!component || component.type !== "icon-button-effect" || !value) {
    return;
  }
  const temp = collectImageComponents(value);
  const text = String(component.properties?.effectReferenceImageId || "");
  effectImageAlignOptions.replaceChildren(...temp.map((component2, index) => createEffectImageAlignOption(component2, component2.id === text || !text && index === 0)));
  effectImageAlignSourceId = component.id;
  effectImageAlignMessage.hidden = temp.length > 0;
  effectImageAlignMessage.textContent = temp.length ? "" : "本页面没有可以对齐的普通图片。";
  effectImageAlignConfirmBtn.disabled = temp.length === 0;
  effectImageAlignDialog.showModal();
}
ibeEffectAlignImage.addEventListener("click", renderList3);
effectImageAlignCloseBtn.addEventListener("click", () => effectImageAlignDialog.close());
effectImageAlignCancelBtn.addEventListener("click", () => effectImageAlignDialog.close());
effectImageAlignDialog.addEventListener("click", value => {
  if (value.target === effectImageAlignDialog) {
    effectImageAlignDialog.close();
  }
});
effectImageAlignDialog.addEventListener("close", () => {
  effectImageAlignSourceId = null;
});
effectImageAlignConfirmBtn.addEventListener("click", () => {
  const value = effectImageAlignOptions.querySelector("input[name=\"effect-image-align-target\"]:checked")?.value;
  const alias = effectImageAlignSourceId;
  if (!alias || !value) {
    effectImageAlignMessage.textContent = "请选择一张本页面图片。";
    effectImageAlignMessage.hidden = false;
    return;
  }
  effectImageAlignDialog.close();
  mutateDocument(pages2 => {
    const properties33 = findComponent(pages2, alias)?.component;
    const components4 = pages2.pages?.find(path2 => path2.path === pageSelect.value) || pages2.pages?.[0];
    const temp2 = findComponentInItems(components4?.components, value);
    if (!properties33 || properties33.type !== "icon-button-effect" || !temp2 || temp2.type !== "image") {
      return;
    }
    const number = Number(pages2.canvas?.width || 2778);
    const canvasHeight = Number(pages2.canvas?.height || 1940);
    const width8 = temp2.position || {};
    const number3 = Number(width8.width || 100);
    const number4 = Number(width8.height || 100);
    const flag = temp2.properties?.layoutMode === "fill";
    properties33.properties = {
      ...(properties33.properties || {}),
      effectReferenceImageId: temp2.id,
      effectLayoutMode: flag ? "fill" : "free",
      ...(flag ? {} : {
        effectLeft: (Number(width8.x || 0) + number3 / 2) / number * 100,
        effectTop: (Number(width8.y || 0) + number4 / 2) / canvasHeight * 100,
        effectScale: clampNumber(Number(temp2.style?.scale || 1), 0.01, 5),
        effectRotation: Number(width8.rotation || 0)
      })
    };
  });
});
ibePreviewState.addEventListener("click", target24 => {
  const value = target24.target.closest("[data-ibe-preview]");
  const alias = componentId;
  if (!value || !alias) {
    return;
  }
  const chosen = ["on", "off"].includes(value.dataset.ibePreview) ? value.dataset.ibePreview : "auto";
  ibePreviewStateById.set(alias, chosen);
  editorRenderer?.setComponentPreviewState(alias, chosen);
  refreshInspector();
});
ibeLayerOptions.addEventListener("click", target25 => {
  const dataset16 = target25.target.closest("[data-ibe-layer]");
  const alias = componentId;
  if (!dataset16 || !alias) {
    return;
  }
  const chosen = dataset16.dataset.ibeLayer === "effect" ? "effect" : "button";
  const chosen2 = chosen === "effect" ? "on" : "off";
  ibeLayerById.set(alias, chosen);
  ibePreviewStateById.set(alias, chosen2);
  editorRenderer?.setComponentPreviewState(alias, chosen2);
  editorRenderer?.setComponentSelectionLayer(alias, chosen);
  closeOtherPickerPanels();
  refreshInspector();
});
ibeButtonVisible.addEventListener("click", () => {
  const alias = componentId;
  if (alias) {
    mutateDocument(param => {
      const properties19 = findComponent(param, alias)?.component;
      if (!!properties19 && properties19.type === "icon-button-effect") {
        properties19.properties = {
          ...(properties19.properties || {}),
          buttonVisible: properties19.properties?.buttonVisible === false
        };
      }
    });
  }
});
ibeEffectVisible.addEventListener("click", () => {
  const alias = componentId;
  if (alias) {
    mutateDocument(param => {
      const properties20 = findComponent(param, alias)?.component;
      if (!!properties20 && properties20.type === "icon-button-effect") {
        properties20.properties = {
          ...(properties20.properties || {}),
          effectVisible: properties20.properties?.effectVisible === false
        };
      }
    });
  }
});
const titleButtonColorFieldMap = new Map([[titleButtonMainColor, {
  property: "mainColor"
}], [titleButtonSecondaryColor, {
  property: "secondaryColor"
}], [titleButtonMainSize, {
  property: "mainSize",
  min: 8,
  max: 200
}], [titleButtonSecondarySize, {
  property: "secondarySize",
  min: 6,
  max: 100
}], [titleButtonMainWeight, {
  property: "mainWeight",
  min: 0,
  max: 1
}], [titleButtonSecondaryWeight, {
  property: "secondaryWeight",
  min: 0,
  max: 1
}], [titleButtonMainSpacing, {
  property: "mainSpacing",
  min: -20,
  max: 100
}], [titleButtonSecondarySpacing, {
  property: "secondarySpacing",
  min: -20,
  max: 100
}], [titleButtonSecondaryLineGap, {
  property: "secondaryLineGap",
  min: 0,
  max: 100
}], [titleButtonMainLeft, {
  property: "mainTextLeft",
  min: -100,
  max: 200
}], [titleButtonMainTop, {
  property: "mainTextTop",
  min: -100,
  max: 200
}], [titleButtonSecondaryLeft, {
  property: "secondaryTextLeft",
  min: -100,
  max: 200
}], [titleButtonSecondaryTop, {
  property: "secondaryTextTop",
  min: -100,
  max: 200
}], [titleButtonIconColor, {
  property: "iconColor"
}], [titleButtonIconSize, {
  property: "iconSize",
  min: 1,
  max: 100
}], [titleButtonIconLeft, {
  property: "iconLeft",
  min: -100,
  max: 200
}], [titleButtonIconTop, {
  property: "iconTop",
  min: -100,
  max: 200
}], [titleButtonFrameColor, {
  property: "frameColor"
}], [titleButtonFrameWidth, {
  property: "frameWidth",
  min: 0,
  max: 12
}], [titleButtonFrameSize, {
  property: "frameSize",
  min: 10,
  max: 300
}], [titleButtonFrameSpacing, {
  property: "frameSpacing",
  min: 0,
  max: 300
}], [titleButtonFrameOffsetX, {
  property: "frameOffsetX",
  min: -100,
  max: 100
}], [titleButtonFrameOffsetY, {
  property: "frameOffsetY",
  min: -100,
  max: 100
}], [titleButtonMarkerColor, {
  property: "markerColor"
}], [titleButtonMarkerSize, {
  property: "markerSize",
  min: 2,
  max: 60
}], [titleButtonMarkerLeft, {
  property: "markerLeft",
  min: -100,
  max: 200
}], [titleButtonMarkerTop, {
  property: "markerTop",
  min: -100,
  max: 200
}]]);
const titleButtonTransformMap = new Map([[titleButtonLeft, "left"], [titleButtonTop, "top"], [titleButtonWidth, "width"], [titleButtonHeight, "height"], [titleButtonScale, "scale"], [titleButtonRotation, "rotation"]]);
const lightStatisticsColorFieldMap = new Map([[lightStatisticsIconColor, {
  property: "iconColor"
}], [lightStatisticsIconActiveColor, {
  property: "iconActiveColor"
}], [lightStatisticsIconSize, {
  property: "iconSize",
  min: 8,
  max: 100
}], [lightStatisticsTitleColor, {
  property: "titleColor"
}], [lightStatisticsTitleSize, {
  property: "titleSize",
  min: 8,
  max: 100
}], [lightStatisticsTitleWeight, {
  property: "titleWeight",
  min: 0,
  max: 1
}], [lightStatisticsTitleSpacing, {
  property: "titleSpacing",
  min: -20,
  max: 100
}], [lightStatisticsCountColor, {
  property: "countColor"
}], [lightStatisticsCountActiveColor, {
  property: "countActiveColor"
}], [lightStatisticsCountSize, {
  property: "countSize",
  min: 8,
  max: 140
}], [lightStatisticsCountWeight, {
  property: "countWeight",
  min: 0,
  max: 1
}], [lightStatisticsCountSpacing, {
  property: "countSpacing",
  min: -20,
  max: 100
}], [lightStatisticsIconGap, {
  property: "iconGap",
  min: 0,
  max: 40
}], [lightStatisticsCountGap, {
  property: "countGap",
  min: 0,
  max: 40
}]]);
const lightStatisticsTransformMap = new Map([[lightStatisticsLeft, "left"], [lightStatisticsTop, "top"], [lightStatisticsWidth, "width"], [lightStatisticsHeight, "height"], [lightStatisticsScale, "scale"], [lightStatisticsRotation, "rotation"]]);
const presenceHaloFieldMap = new Map([[presenceHaloScaleX, {
  property: "haloScaleX",
  min: 20,
  max: 300,
  divisor: 100
}], [presenceHaloScaleY, {
  property: "haloScaleY",
  min: 20,
  max: 300,
  divisor: 100
}], [presenceHaloRotation, {
  property: "haloRotation",
  min: -360,
  max: 360
}], [presenceHaloOpacity, {
  property: "haloOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [presencePersonScale, {
  property: "personScale",
  min: 20,
  max: 300,
  divisor: 100
}], [presencePersonRotation, {
  property: "personRotation",
  min: -360,
  max: 360
}], [presencePersonOpacity, {
  property: "personOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [presenceOrbitDuration, {
  property: "orbitDuration",
  min: 2,
  max: 60
}], [iconButtonIconColor, {
  property: "iconColor"
}], [deviceButtonIconOnColor, {
  property: properties29 => properties29.type !== "presence-sensor" ? "iconOnColor" : properties29.properties?.sensorKind === "water-leak" ? "waterLeakColor" : properties29.properties?.sensorKind === "smoke" ? "smokeColor" : properties29.properties?.sensorKind === "natural-gas" ? "naturalGasColor" : "iconOnColor"
}], [deviceButtonBadgeColor, {
  property: "badgeColor"
}], [deviceButtonBadgeOpacity, {
  property: "badgeOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [deviceButtonSymbolSize, {
  property: "symbolSize",
  min: 1,
  max: 100
}], [deviceButtonBadgeSize, {
  property: "badgeSize",
  min: 1,
  max: 100
}], [iconButtonIconSize, {
  property: "iconSize",
  min: 1,
  max: 100
}], [iconButtonIconOffOpacity, {
  property: "iconOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [iconButtonIconOnOpacity, {
  property: "iconOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [iconButtonIconLeft, {
  property: "iconLeft",
  min: -100,
  max: 200
}], [iconButtonIconTop, {
  property: "iconTop",
  min: -100,
  max: 200
}], [iconButtonMainColor, {
  property: "mainColor"
}], [iconButtonSecondaryColor, {
  property: "secondaryColor"
}], [iconButtonMainOffOpacity, {
  property: "mainOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [iconButtonMainOnOpacity, {
  property: "mainOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [iconButtonSecondaryOffOpacity, {
  property: "secondaryOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [iconButtonSecondaryOnOpacity, {
  property: "secondaryOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [iconButtonMainSize, {
  property: "mainSize",
  min: 6,
  max: 120
}], [iconButtonSecondarySize, {
  property: "secondarySize",
  min: 5,
  max: 80
}], [iconButtonMainWeight, {
  property: "mainWeight",
  min: 0,
  max: 1
}], [iconButtonSecondaryWeight, {
  property: "secondaryWeight",
  min: 0,
  max: 1
}], [iconButtonMainSpacing, {
  property: "mainSpacing",
  min: -20,
  max: 100
}], [iconButtonSecondarySpacing, {
  property: "secondarySpacing",
  min: -20,
  max: 100
}], [iconButtonMainLeft, {
  property: "mainTextLeft",
  min: -100,
  max: 200
}], [iconButtonMainTop, {
  property: "mainTextTop",
  min: -100,
  max: 200
}], [iconButtonSecondaryLeft, {
  property: "secondaryTextLeft",
  min: -100,
  max: 200
}], [iconButtonSecondaryTop, {
  property: "secondaryTextTop",
  min: -100,
  max: 200
}], [iconButtonOnFillColor, {
  property: "onFillColor"
}], [iconButtonOnFillStrength, {
  property: "onFillStrength",
  min: 0,
  max: 100,
  divisor: 100
}], [iconButtonOnFillFadeDuration, {
  property: "onFillFadeDuration",
  min: 0,
  max: 3
}], [iconButtonFrameWidth, {
  property: "frameWidth",
  min: 0,
  max: 12
}], [iconButtonFrameAngle, {
  property: "frameAngle",
  min: 0,
  max: 360
}], [iconButtonFrameOffOpacity, {
  property: "frameOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [iconButtonFrameOnOpacity, {
  property: "frameOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [iconButtonCutCorner, {
  property: "cutCorner",
  min: 0,
  max: 50
}], [iconButtonSoftLightColor, {
  property: "softLightColor"
}], [iconButtonSoftLightStrength, {
  property: "softLightStrength",
  min: 0,
  max: 500,
  divisor: 100
}], [iconButtonSoftLightSize, {
  property: "softLightSize",
  min: 0,
  max: 300,
  divisor: 100
}], [iconButtonSoftLightAngle, {
  property: "softLightAngle",
  min: 0,
  max: 360
}], [iconButtonGlowColor, {
  property: "glowColor"
}], [iconButtonGlowStrength, {
  property: "glowStrength",
  min: 0,
  max: 500,
  divisor: 100
}], [iconButtonGlowSize, {
  property: "glowSize",
  min: 0,
  max: 300,
  divisor: 100
}], [iconButtonGlowAngle, {
  property: "glowAngle",
  min: 0,
  max: 360
}]]);
const iconButtonTransformMap = new Map([[iconButtonLeft, "left"], [iconButtonTop, "top"], [iconButtonWidth, "width"], [iconButtonHeight, "height"], [iconButtonScale, "scale"], [iconButtonRotation, "rotation"]]);
const airConditionerColorFieldMap = new Map([[airConditionerIconOffColor, {
  property: "iconOffColor"
}], [airConditionerIconOnColor, {
  property: "iconOnColor"
}], [airConditionerBadgeColor, {
  property: "badgeColor"
}], [airConditionerBadgeOpacity, {
  property: "badgeOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [airConditionerSymbolSize, {
  property: "symbolSize",
  min: 1,
  max: 100
}], [airConditionerBadgeSize, {
  property: "badgeSize",
  min: 1,
  max: 100
}], [airConditionerIconLeft, {
  property: "iconLeft",
  min: -100,
  max: 200
}], [airConditionerIconTop, {
  property: "iconTop",
  min: -100,
  max: 200
}], [airConditionerMainColor, {
  property: "mainColor"
}], [airConditionerMainSize, {
  property: "mainSize",
  min: 6,
  max: 120
}], [airConditionerMainWeight, {
  property: "mainWeight",
  min: 0,
  max: 1
}], [airConditionerMainSpacing, {
  property: "mainSpacing",
  min: -20,
  max: 100
}], [airConditionerMainLeft, {
  property: "mainTextLeft",
  min: -100,
  max: 200
}], [airConditionerMainTop, {
  property: "mainTextTop",
  min: -100,
  max: 200
}], [airConditionerSecondaryColor, {
  property: "secondaryColor"
}], [airConditionerSecondarySize, {
  property: "secondarySize",
  min: 5,
  max: 80
}], [airConditionerSecondaryWeight, {
  property: "secondaryWeight",
  min: 0,
  max: 1
}], [airConditionerSecondarySpacing, {
  property: "secondarySpacing",
  min: -20,
  max: 100
}], [airConditionerSecondaryLeft, {
  property: "secondaryTextLeft",
  min: -100,
  max: 200
}], [airConditionerSecondaryTop, {
  property: "secondaryTextTop",
  min: -100,
  max: 200
}], [airConditionerAirflowCoolColor, {
  property: "airflowCoolColor"
}], [airConditionerAirflowHeatColor, {
  property: "airflowHeatColor"
}], [airConditionerAirflowOtherColor, {
  property: "airflowOtherColor"
}], [airConditionerAirflowAngle, {
  property: "airflowAngle",
  min: -360,
  max: 360
}], [airConditionerAirflowCurve, {
  property: "airflowCurve",
  min: -200,
  max: 200
}], [airConditionerAirflowLength, {
  property: "airflowLength",
  min: 10,
  max: 300
}], [airConditionerAirflowFade, {
  property: "airflowFadePosition",
  min: 15,
  max: 100
}], [airConditionerAirflowSpread, {
  property: "airflowSpread",
  min: 10,
  max: 300
}], [airConditionerAirflowDensity, {
  property: "airflowDensity",
  min: 20,
  max: 200
}], [airConditionerAirflowIrregularity, {
  property: "airflowIrregularity",
  min: 0,
  max: 200
}], [airConditionerAirflowThickness, {
  property: "airflowThickness",
  min: 5,
  max: 300
}], [airConditionerAirflowStrength, {
  property: "airflowStrength",
  min: 0,
  max: 500
}], [airConditionerAirflowBlur, {
  property: "airflowBlur",
  min: 0,
  max: 30
}], [airConditionerAirflowSpeed, {
  property: "airflowSpeed",
  min: 0.3,
  max: 12
}], [airConditionerAirflowOffsetX, {
  property: "airflowOffsetX",
  limits: (param, canvas8) => {
    const minX = airflowCanvasOffsetBounds(param, canvas8.canvas);
    return {
      min: minX.minX,
      max: minX.maxX
    };
  }
}], [airConditionerAirflowOffsetY, {
  property: "airflowOffsetY",
  limits: (param, canvas9) => {
    const minY = airflowCanvasOffsetBounds(param, canvas9.canvas);
    return {
      min: minY.minY,
      max: minY.maxY
    };
  }
}], [airConditionerAirflowWidth, {
  property: "airflowWidth",
  min: 1,
  max: 500
}], [airConditionerAirflowHeight, {
  property: "airflowHeight",
  min: 1,
  max: 500
}], [airConditionerAirflowScale, {
  property: "airflowScale",
  min: 1,
  max: 500,
  divisor: 100
}], [airConditionerAirflowRotation, {
  property: "airflowRotation",
  min: -360,
  max: 360
}]]);
const airConditionerTransformMap = new Map([[airConditionerLeft, "left"], [airConditionerTop, "top"], [airConditionerWidth, "width"], [airConditionerHeight, "height"], [airConditionerScale, "scale"], [airConditionerRotation, "rotation"]]);
const cameraFrameFieldMap = new Map([[cameraFrameColor, {
  property: "frameColor"
}], [cameraFrameWidth, {
  property: "frameWidth",
  min: 0,
  max: 20
}], [cameraRadius, {
  property: "radius",
  min: 0,
  max: 50,
  divisor: 100
}], [cameraFrameAngle, {
  property: "frameAngle",
  min: 0,
  max: 360
}], [cameraFrameOpacity, {
  property: "frameOpacity",
  min: 0,
  max: 100,
  divisor: 100
}]]);
const vacuumMapFieldMap = new Map([[vacuumMapOpacity, {
  property: "opacity",
  min: 0,
  max: 100,
  divisor: 100
}]]);
const vacuumMapTransformMap = new Map([[vacuumMapLeft, "left"], [vacuumMapTop, "top"], [vacuumMapScale, "scale"], [vacuumMapRotation, "rotation"]]);
const cameraTransformMap = new Map([[cameraLeft, "left"], [cameraTop, "top"], [cameraWidth, "width"], [cameraHeight, "height"], [cameraScale, "scale"], [cameraRotation, "rotation"]]);
function withSelectedComponent2(value, param, param2, param3) {
  const list = Array.isArray(param) ? param : [param];
  value.addEventListener("input", event2 => {
    const temp = selectedComponent();
    if (!temp || !list.includes(temp.type)) {
      return;
    }
    const temp2 = param2.get(event2.target);
    if (temp2) {
      const chosen = typeof temp2.property == "function" ? temp2.property(temp) : temp2.property;
      let chosen2 = event2.target.type === "color" ? event2.target.value : Number(event2.target.value);
      if (event2.target.type !== "color") {
        if (!Number.isFinite(chosen2)) {
          return;
        }
        const flag = temp2.limits?.(temp, currentProject.document) || temp2;
        chosen2 = clampNumber(chosen2, flag.min, flag.max) / (temp2.divisor || 1);
      }
      editorRenderer?.previewComponentProperties(temp.id, {
        [chosen]: chosen2
      });
      return;
    }
    const temp3 = param3.get(event2.target);
    const numeric = Number(event2.target.value);
    if (!temp3 || !Number.isFinite(numeric)) {
      return;
    }
    const canvasWidth = Number(currentProject.document.canvas.width || 2778);
    const canvasHeight = Number(currentProject.document.canvas.height || 1940);
    const number = Number(temp.position?.width || 100);
    const number2 = Number(temp.position?.height || 100);
    if (temp3 === "left") {
      editorRenderer?.previewComponentTransform(temp.id, {
        x: canvasWidth * clampNumber(numeric, 0, 100) / 100 - number / 2
      });
    } else if (temp3 === "top") {
      editorRenderer?.previewComponentTransform(temp.id, {
        y: canvasHeight * clampNumber(numeric, 0, 100) / 100 - number2 / 2
      });
    } else if (temp3 === "width") {
      editorRenderer?.previewComponentTransform(temp.id, {
        width: canvasWidth * clampNumber(numeric, 0.1, 100) / 100
      });
    } else if (temp3 === "height") {
      editorRenderer?.previewComponentTransform(temp.id, {
        height: canvasHeight * clampNumber(numeric, 0.1, 100) / 100
      });
    } else if (temp3 === "scale") {
      editorRenderer?.previewComponentTransform(temp.id, {
        scale: clampNumber(numeric, 1, 500) / 100
      });
    } else if (temp3 === "rotation" && selectedElementItemIds().length < 2) {
      editorRenderer?.previewComponentTransform(temp.id, {
        rotation: clampNumber(numeric, -360, 360)
      });
    }
  });
  value.addEventListener("change", event2 => {
    const temp = param2.get(event2.target);
    const temp2 = param3.get(event2.target);
    if (!temp && !temp2) {
      return;
    }
    if (event2.target.type === "number" && !Number.isFinite(Number(event2.target.value))) {
      refreshInspector();
      return;
    }
    const alias = componentId;
    const chosen = temp2 === "rotation" ? selectedElementItemIds() : [];
    mutateDocument(doc => {
      const component = findComponent(doc, alias)?.component;
      if (!component || !list.includes(component.type)) {
        return;
      }
      component.properties = {
        ...(component.properties || {})
      };
      component.position = {
        ...(component.position || {})
      };
      component.style = {
        ...(component.style || {})
      };
      if (temp) {
        const chosen2 = typeof temp.property == "function" ? temp.property(component) : temp.property;
        const flag = temp.limits?.(component, doc) || temp;
        component.properties[chosen2] = event2.target.type === "color" ? event2.target.value : clampNumber(Number(event2.target.value), flag.min, flag.max) / (temp.divisor || 1);
        return;
      }
      const numeric = Number(doc.canvas.width || 2778);
      const canvasHeight = Number(doc.canvas.height || 1940);
      const number = Number(event2.target.value);
      if (temp2 === "left") {
        component.position.x = numeric * clampNumber(number, 0, 100) / 100 - Number(component.position.width || 100) / 2;
      } else if (temp2 === "top") {
        component.position.y = canvasHeight * clampNumber(number, 0, 100) / 100 - Number(component.position.height || 100) / 2;
      } else if (temp2 === "width") {
        component.position.width = numeric * clampNumber(number, 0.1, 100) / 100;
      } else if (temp2 === "height") {
        component.position.height = canvasHeight * clampNumber(number, 0.1, 100) / 100;
      } else if (temp2 === "scale") {
        component.style.scale = clampNumber(number, 1, 500) / 100;
      } else if (temp2 === "rotation") {
        setComponentsRotation(doc, alias, clampNumber(number, -360, 360), chosen);
      }
    });
  });
}
withSelectedComponent2(titleButtonInspector, "title-button", titleButtonColorFieldMap, titleButtonTransformMap);
withSelectedComponent2(lightStatisticsInspector, "light-statistics", lightStatisticsColorFieldMap, lightStatisticsTransformMap);
withSelectedComponent2(iconButtonInspector, ["icon-button", "device-button", "presence-sensor"], presenceHaloFieldMap, iconButtonTransformMap);
withSelectedComponent2(airConditionerInspector, "air-conditioner", airConditionerColorFieldMap, airConditionerTransformMap);
withSelectedComponent2(vacuumMapInspector, "vacuum-map", vacuumMapFieldMap, vacuumMapTransformMap);
withSelectedComponent2(cameraInspector, "camera", cameraFrameFieldMap, cameraTransformMap);
deviceButtonStatePrecision.addEventListener("change", () => {
  const component = componentId;
  if (component) {
    mutateDocument(param => {
      const properties21 = findComponent(param, component)?.component;
      if (!properties21 || properties21.type !== "device-button") {
        return;
      }
      const statePrecision = ["0", "1", "2", "3", "4"].includes(deviceButtonStatePrecision.value) ? Number(deviceButtonStatePrecision.value) : "auto";
      properties21.properties = {
        ...(properties21.properties || {}),
        statePrecision
      };
    });
  }
});
presenceSensorKind.addEventListener("change", () => {
  const value = componentId;
  if (value) {
    mutateDocument(item => {
      const component = findComponent(item, value)?.component;
      if (!component || component.type !== "presence-sensor") {
        return;
      }
      const sensorKind = ["presence", "door-window", "water-leak", "smoke", "natural-gas"].includes(presenceSensorKind.value) ? presenceSensorKind.value : "presence";
      component.properties = {
        ...(component.properties || {}),
        sensorKind
      };
      if (sensorKind !== "door-window") {
        presencePreviewExpandedIds.delete(value);
        editorRenderer?.setComponentSelectionLayer(value, "button");
      }
    });
  }
});
doorWindowPerspectiveEditBtn.addEventListener("click", () => {
  const ancestorEl = selectedComponent();
  if (!!ancestorEl && ancestorEl.type === "presence-sensor" && ancestorEl.properties?.sensorKind === "door-window") {
    presencePreviewExpandedIds.add(ancestorEl.id);
    doorWindowPerspectiveEditBtn.classList.add("active");
    doorWindowPerspectiveEditBtn.setAttribute("aria-pressed", "true");
    doorWindowPerspectiveSave.disabled = false;
    editorRenderer?.setComponentSelectionLayer(ancestorEl.id, "perspective");
  }
});
doorWindowPerspectiveSave.addEventListener("click", () => {
  const ancestorEl = selectedComponent();
  if (!!ancestorEl && ancestorEl.type === "presence-sensor" && ancestorEl.properties?.sensorKind === "door-window") {
    presencePreviewExpandedIds.delete(ancestorEl.id);
    doorWindowPerspectiveEditBtn.classList.remove("active");
    doorWindowPerspectiveEditBtn.setAttribute("aria-pressed", "false");
    doorWindowPerspectiveSave.disabled = true;
    editorRenderer?.setComponentSelectionLayer(ancestorEl.id, "button");
  }
});
doorWindowPerspectiveReset.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    mutateDocument(param => {
      const properties22 = findComponent(param, value)?.component;
      if (!!properties22 && properties22.type === "presence-sensor" && properties22.properties?.sensorKind === "door-window") {
        properties22.properties = {
          ...(properties22.properties || {}),
          perspectiveCorners: [...unitQuadUv]
        };
      }
    });
  }
});
cameraFitOptions.addEventListener("click", target26 => {
  const value = target26.target.closest("[data-camera-fit]");
  const alias = componentId;
  if (!value || !alias) {
    return;
  }
  const fit = value.dataset.cameraFit === "contain" ? "contain" : "fill";
  mutateDocument(param => {
    const properties34 = findComponent(param, alias)?.component;
    if (!!properties34 && properties34.type === "camera") {
      properties34.properties = {
        ...(properties34.properties || {}),
        fit
      };
    }
  });
});
cameraDisplayModeOptions.addEventListener("click", target27 => {
  const value = target27.target.closest("[data-camera-display-mode]");
  const alias = componentId;
  if (!value || !alias) {
    return;
  }
  const displayMode = value.dataset.cameraDisplayMode === "snapshot" ? "snapshot" : "live";
  mutateDocument(param => {
    const properties35 = findComponent(param, alias)?.component;
    if (!!properties35 && properties35.type === "camera") {
      properties35.properties = {
        ...(properties35.properties || {}),
        displayMode
      };
    }
  });
});
cameraRefreshInterval.addEventListener("change", () => {
  const ancestorEl = componentId;
  if (!ancestorEl) {
    return;
  }
  const number = Number(cameraRefreshInterval.value);
  const refreshInterval = Number.isFinite(number) ? Math.max(6, Math.round(number)) : 10;
  cameraRefreshInterval.value = String(refreshInterval);
  mutateDocument(param => {
    const properties36 = findComponent(param, ancestorEl)?.component;
    if (!!properties36 && properties36.type === "camera") {
      properties36.properties = {
        ...(properties36.properties || {}),
        refreshInterval
      };
    }
  });
});
cameraMediaVisible.addEventListener("click", () => {
  const ancestorEl = componentId;
  if (ancestorEl) {
    mutateDocument(param => {
      const properties23 = findComponent(param, ancestorEl)?.component;
      if (!!properties23 && properties23.type === "camera") {
        properties23.properties = {
          ...(properties23.properties || {}),
          mediaVisible: properties23.properties?.mediaVisible === false
        };
      }
    });
  }
});
cameraFrameVisible.addEventListener("click", () => {
  const ancestorEl = componentId;
  if (ancestorEl) {
    mutateDocument(param => {
      const properties24 = findComponent(param, ancestorEl)?.component;
      if (!!properties24 && properties24.type === "camera") {
        properties24.properties = {
          ...(properties24.properties || {}),
          frameVisible: properties24.properties?.frameVisible === false
        };
      }
    });
  }
});
function setAirConditionerPreviewState(value, param = "auto") {
  if (!value) {
    return;
  }
  const chosen = ["on", "off"].includes(param) ? param : "auto";
  airConditionerPreviewStateById.set(value, chosen);
  editorRenderer?.setComponentPreviewState(value, chosen);
}
airConditionerPreviewState.addEventListener("click", target28 => {
  const value = target28.target.closest("[data-air-conditioner-preview]");
  if (!!value && !!componentId) {
    setAirConditionerPreviewState(componentId, value.dataset.airConditionerPreview);
    refreshInspector();
  }
});
airConditionerDeviceType.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-air-conditioner-device-type]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const deviceType = ["air-conditioner", "bath-heater"].includes(ancestorEl.dataset.airConditionerDeviceType) ? ancestorEl.dataset.airConditionerDeviceType : "auto";
  mutateDocument(param => {
    const properties37 = findComponent(param, temp)?.component;
    if (!!properties37 && properties37.type === "air-conditioner") {
      properties37.properties = {
        ...(properties37.properties || {}),
        deviceType
      };
    }
  });
});
airConditionerLayerOptions.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-air-conditioner-layer]");
  if (!ancestorEl || !componentId) {
    return;
  }
  const temp = ancestorEl.dataset.airConditionerLayer === "airflow" ? "airflow" : "button";
  airConditionerLayerById.set(componentId, temp);
  setAirConditionerPreviewState(componentId, temp === "airflow" ? "on" : "off");
  editorRenderer?.setComponentSelectionLayer(componentId, temp);
  closeOtherPickerPanels();
  refreshInspector();
});
airConditionerAirflowVisible.addEventListener("click", () => {
  const ancestorEl = componentId;
  if (ancestorEl) {
    setAirConditionerPreviewState(ancestorEl, "on");
    mutateDocument(param => {
      const properties25 = findComponent(param, ancestorEl)?.component;
      if (!!properties25 && properties25.type === "air-conditioner") {
        properties25.properties = {
          ...(properties25.properties || {}),
          airflowVisible: properties25.properties?.airflowVisible === false
        };
      }
    });
  }
});
for (const [temp2, temp3] of [[airConditionerIconVisible, "iconVisible"], [airConditionerMainVisible, "mainTextVisible"], [airConditionerSecondaryVisible, "secondaryTextVisible"]]) {
  temp2.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      mutateDocument(item => {
        const component = findComponent(item, value)?.component;
        if (!!component && component.type === "air-conditioner") {
          component.properties = {
            ...(component.properties || {}),
            [temp3]: component.properties?.[temp3] === false
          };
        }
      });
    }
  });
}
airConditionerAirflowMotion.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-airflow-motion]");
  const temp = componentId;
  if (!!ancestorEl && !!temp) {
    setAirConditionerPreviewState(temp, "on");
    mutateDocument(param => {
      const properties26 = findComponent(param, temp)?.component;
      if (!!properties26 && properties26.type === "air-conditioner") {
        properties26.properties = {
          ...(properties26.properties || {}),
          airflowMotion: ancestorEl.dataset.airflowMotion === "static" ? "static" : "dynamic"
        };
      }
    });
  }
});
for (const temp2 of ["focusin", "pointerdown", "input"]) {
  airConditionerAirflowSection.addEventListener(temp2, value => {
    if (airConditionerColorFieldMap.has(value.target) && selectedComponent()?.type === "air-conditioner") {
      setAirConditionerPreviewState(componentId, "on");
    }
  });
}
const iconButtonOpacityModeMap = new Map([[iconButtonIconOffOpacity, "off"], [iconButtonMainOffOpacity, "off"], [iconButtonSecondaryOffOpacity, "off"], [iconButtonFrameOffOpacity, "off"], [iconButtonOnFillVisible, "on"], [iconButtonIconOnOpacity, "on"], [iconButtonMainOnOpacity, "on"], [iconButtonSecondaryOnOpacity, "on"], [iconButtonOnFillColor, "on"], [iconButtonOnFillStrength, "on"], [iconButtonFrameOnOpacity, "on"], [deviceButtonIconOnColor, "on"]]);
function syncIconButtonPreviewButtons(value) {
  for (const dataset17 of iconButtonPreviewState.querySelectorAll("[data-icon-button-preview]")) {
    const flag = dataset17.dataset.iconButtonPreview === value;
    dataset17.classList.toggle("active", flag);
    dataset17.setAttribute("aria-pressed", String(flag));
  }
}
function setPresencePreviewState(value, param = "auto") {
  if (!value) {
    return;
  }
  const chosen = ["on", "off"].includes(param) ? param : "auto";
  if (chosen === "auto") {
    presencePreviewStateById.delete(value);
  } else {
    presencePreviewStateById.set(value, chosen);
  }
  editorRenderer?.setComponentPreviewState(value, chosen);
  if (value === componentId) {
    syncIconButtonPreviewButtons(chosen);
  }
}
function syncIconButtonIcon3(value) {
  const temp = selectedComponent();
  const flag = iconButtonOpacityModeMap.get(value) || (temp?.type === "device-button" && value === iconButtonIconColor ? "off" : null);
  if (!!flag && !!["icon-button", "device-button", "presence-sensor"].includes(temp?.type)) {
    setPresencePreviewState(temp.id, flag);
  }
}
function syncIconButtonIcon4(value) {
  const component2 = selectedComponent();
  if (!!iconButtonOpacityModeMap.has(value) || component2?.type === "device-button" && value === iconButtonIconColor) {
    if (["icon-button", "device-button", "presence-sensor"].includes(component2?.type)) {
      setPresencePreviewState(component2.id, "auto");
    }
  }
}
for (const temp2 of ["focusin", "pointerdown", "input"]) {
  iconButtonInspector.addEventListener(temp2, value => syncIconButtonIcon3(value.target));
}
coverSettingsKind.addEventListener("click", value => {
  const temp = value.target.closest("[data-cover-kind]");
  const alias = componentId;
  if (!temp || !alias) {
    return;
  }
  const coverKind = ["standard", "dream", "airer"].includes(temp.dataset.coverKind) ? temp.dataset.coverKind : "auto";
  mutateDocument(param => {
    const properties38 = findComponent(param, alias)?.component;
    if (properties38 && String(properties38.bindings?.entity?.entityId || "").startsWith("cover.")) {
      properties38.properties = {
        ...(properties38.properties || {}),
        coverKind
      };
    }
  });
});
coverSettingsDirection.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-cover-direction]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const chosen = ["left", "right"].includes(ancestorEl.dataset.coverDirection) ? ancestorEl.dataset.coverDirection : "split";
  mutateDocument(param => {
    const properties39 = findComponent(param, temp)?.component;
    if (properties39 && String(properties39.bindings?.entity?.entityId || "").startsWith("cover.")) {
      properties39.properties = {
        ...(properties39.properties || {}),
        coverDirection: chosen
      };
    }
  });
});
coverSettingsMotorDirection.addEventListener("click", value => {
  const component = value.target.closest("[data-cover-motor-direction]");
  const target = componentId;
  if (!component || !target) {
    return;
  }
  const temp = ["normal", "reversed"].includes(component.dataset.coverMotorDirection) ? component.dataset.coverMotorDirection : "auto";
  mutateDocument(param => {
    const properties40 = findComponent(param, target)?.component;
    if (properties40 && String(properties40.bindings?.entity?.entityId || "").startsWith("cover.")) {
      properties40.properties = {
        ...(properties40.properties || {}),
        coverMotorDirection: temp
      };
    }
  });
});
iconButtonInspector.addEventListener("focusout", value => {
  const target = selectedComponent();
  if ((!!iconButtonOpacityModeMap.has(value.target) || target?.type === "device-button" && value.target === iconButtonIconColor) && (!(value.relatedTarget instanceof Node) || !iconButtonPreviewState.contains(value.relatedTarget))) {
    window.requestAnimationFrame(() => {
      if (activeColorInput === value.target && !globalColorPicker.hidden) {
        return;
      }
      if (iconButtonOpacityModeMap.get(document.activeElement) || (selectedComponent()?.type === "device-button" && document.activeElement === iconButtonIconColor ? "off" : null)) {
        syncIconButtonIcon3(document.activeElement);
      } else {
        syncIconButtonIcon4(value.target);
      }
    });
  }
});
for (const [temp2, temp3] of [[titleButtonMainVisible, "mainTextVisible"], [titleButtonSecondaryVisible, "secondaryTextVisible"], [titleButtonIconVisible, "iconVisible"], [titleButtonFrameVisible, "frameVisible"], [titleButtonMarkerVisible, "markerVisible"]]) {
  temp2.addEventListener("click", () => {
    const value = componentId;
    mutateDocument(item => {
      const component = findComponent(item, value)?.component;
      if (!!component && component.type === "title-button") {
        component.properties = {
          ...(component.properties || {}),
          [temp3]: component.properties?.[temp3] === false
        };
      }
    });
  });
}
for (const [temp2, temp3] of [[lightStatisticsIconVisible, "iconVisible"], [lightStatisticsTitleVisible, "titleVisible"], [lightStatisticsCountVisible, "countVisible"]]) {
  temp2.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      mutateDocument(item => {
        const component = findComponent(item, value)?.component;
        if (!!component && component.type === "light-statistics") {
          component.properties = {
            ...(component.properties || {}),
            [temp3]: component.properties?.[temp3] === false
          };
        }
      });
    }
  });
}
for (const [temp2, temp3] of [[deviceButtonIconVisible, "iconVisible"], [deviceButtonMainVisible, "mainTextVisible"], [deviceButtonSecondaryVisible, "secondaryTextVisible"], [iconButtonOnFillVisible, "onFillVisible"], [iconButtonFrameVisible, "frameVisible"], [iconButtonSoftLightVisible, "softLightVisible"], [iconButtonGlowVisible, "glowVisible"], [presenceHaloVisible, "haloVisible"], [presencePersonVisible, "personVisible"]]) {
  temp2.addEventListener("click", () => {
    const value = componentId;
    mutateDocument(item => {
      const component = findComponent(item, value)?.component;
      if (!!component && !!["icon-button", "device-button", "presence-sensor"].includes(component.type) && (!temp3.endsWith("Visible") || !["iconVisible", "mainTextVisible", "secondaryTextVisible"].includes(temp3) || component.type === "device-button") && (!["haloVisible", "personVisible"].includes(temp3) || component.type === "presence-sensor")) {
        component.properties = {
          ...(component.properties || {}),
          [temp3]: component.properties?.[temp3] === false
        };
      }
    });
  });
}
iconButtonPreviewState.addEventListener("click", value => {
  const component = value.target.closest("[data-icon-button-preview]");
  const target = componentId;
  if (!component || !target) {
    return;
  }
  const temp = ["on", "off"].includes(component.dataset.iconButtonPreview) ? component.dataset.iconButtonPreview : "auto";
  setPresencePreviewState(target, temp);
});
const timeColorFieldMap = new Map([[timeColor, "color"]]);
const timeSizeFieldMap = new Map([[timeFontSize, {
  property: "fontSize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [timeFontWeight, {
  property: "fontWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}], [timeLetterSpacing, {
  property: "letterSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}], [timeOpacity, {
  property: "opacity",
  minimum: 0,
  maximum: 100,
  divisor: 100,
  resizes: false
}]]);
const timeTransformFields = new Set([timeLeft, timeTop, timeScale, timeRotation]);
function fitTimeComponentToContent(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const number3 = Number(value.position?.height || 100);
  const number = Number(value.position?.x || 0) + numeric / 2;
  const number2 = Number(value.position?.y || 0) + number3 / 2;
  const {
    width,
    height
  } = timeComponentDimensions(fallback);
  editorRenderer?.previewComponentTransform(value.id, {
    x: number - width / 2,
    y: number2 - height / 2,
    width,
    height
  });
}
timeInspector.addEventListener("input", value => {
  const target = selectedComponent();
  if (!target || target.type !== "time") {
    return;
  }
  const eventTarget = value.target;
  const temp2 = timeColorFieldMap.get(eventTarget);
  if (temp2) {
    editorRenderer?.previewComponentProperties(target.id, {
      [temp2]: eventTarget.value
    });
    return;
  }
  const temp3 = timeSizeFieldMap.get(eventTarget);
  if (temp3) {
    if (String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value))) {
      return;
    }
    const clamped = clampNumber(Number(eventTarget.value), temp3.minimum, temp3.maximum) / temp3.divisor;
    const options = {
      ...(target.properties || {}),
      [temp3.property]: clamped
    };
    editorRenderer?.previewComponentProperties(target.id, {
      [temp3.property]: clamped
    });
    if (temp3.resizes) {
      fitTimeComponentToContent(target, options);
    }
    return;
  }
  if (!timeTransformFields.has(eventTarget) || String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value))) {
    return;
  }
  const number = Number(eventTarget.value);
  const canvasWidth = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number4 = Number(target.position?.width || 100);
  const number5 = Number(target.position?.height || 100);
  if (eventTarget === timeLeft) {
    const clamped = clampNumber(number, 0, 100);
    editorRenderer?.previewComponentTransform(target.id, {
      x: canvasWidth * clamped / 100 - number4 / 2
    });
  } else if (eventTarget === timeTop) {
    const clamped = clampNumber(number, 0, 100);
    editorRenderer?.previewComponentTransform(target.id, {
      y: canvasHeight * clamped / 100 - number5 / 2
    });
  } else if (eventTarget === timeScale) {
    const clamped = clampNumber(number, 1, 500);
    editorRenderer?.previewComponentTransform(target.id, {
      scale: clamped / 100
    });
  } else if (eventTarget === timeRotation) {
    const rotation4 = clampNumber(number, -360, 360);
    editorRenderer?.previewComponentTransform(target.id, {
      rotation: rotation4
    });
  }
});
timeInspector.addEventListener("change", value => {
  const eventTarget = value.target;
  const target = componentId;
  if (!target) {
    return;
  }
  const temp = timeColorFieldMap.get(eventTarget);
  const temp2 = timeSizeFieldMap.get(eventTarget);
  if (!!temp || !!temp2 || !!timeTransformFields.has(eventTarget)) {
    if ((temp2 || timeTransformFields.has(eventTarget)) && (String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value)))) {
      refreshInspector();
      return;
    }
    mutateDocument(canvas4 => {
      const position7 = findComponent(canvas4, target)?.component;
      if (!position7 || position7.type !== "time") {
        return;
      }
      position7.properties = {
        ...(position7.properties || {})
      };
      position7.position = {
        ...(position7.position || {})
      };
      position7.style = {
        ...(position7.style || {})
      };
      const number = Number(canvas4.canvas.width || 2778);
      const canvasHeight = Number(canvas4.canvas.height || 1940);
      const number3 = Number(eventTarget.value);
      if (temp) {
        position7.properties[temp] = eventTarget.value;
      } else if (temp2) {
        position7.properties[temp2.property] = clampNumber(number3, temp2.minimum, temp2.maximum) / temp2.divisor;
        if (temp2.resizes) {
          fitTimeComponent(position7, position7.properties);
        }
      } else if (eventTarget === timeLeft) {
        position7.position.x = number * clampNumber(number3, 0, 100) / 100 - Number(position7.position.width || 100) / 2;
      } else if (eventTarget === timeTop) {
        position7.position.y = canvasHeight * clampNumber(number3, 0, 100) / 100 - Number(position7.position.height || 100) / 2;
      } else if (eventTarget === timeScale) {
        position7.style.scale = clampNumber(number3, 1, 500) / 100;
      } else if (eventTarget === timeRotation) {
        setComponentsRotation(canvas4, target, clampNumber(number3, -360, 360));
      }
    });
  }
});
for (const temp2 of [timeHourFormat, timeSeconds]) {
  temp2.addEventListener("click", value => {
    const temp = componentId;
    const ancestorEl = value.target.closest("[data-time-hour-format]");
    const ancestorEl2 = value.target.closest("[data-time-seconds]");
    if (!!temp && (!!ancestorEl || !!ancestorEl2)) {
      mutateDocument(item => {
        const component = findComponent(item, temp)?.component;
        if (!!component && component.type === "time") {
          component.properties = {
            ...(component.properties || {})
          };
          if (ancestorEl) {
            component.properties.hour12 = ancestorEl.dataset.timeHourFormat === "12";
          }
          if (ancestorEl2) {
            component.properties.showSeconds = ancestorEl2.dataset.timeSeconds === "on";
          }
          fitTimeComponent(component, component.properties);
        }
      });
    }
  });
}
const dateColorFieldMap = new Map([[datePrimaryColor, "primaryColor"], [dateLunarColor, "lunarColor"]]);
const dateSizeFieldMap = new Map([[datePrimarySize, {
  property: "primarySize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [datePrimaryWeight, {
  property: "primaryWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}], [datePrimarySpacing, {
  property: "primarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}], [dateLunarSize, {
  property: "lunarSize",
  minimum: 10,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [dateLunarWeight, {
  property: "lunarWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}], [dateLunarSpacing, {
  property: "lunarSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}], [dateLineGap, {
  property: "lineGap",
  minimum: 0,
  maximum: 200,
  divisor: 1,
  resizes: true
}], [dateOpacity, {
  property: "opacity",
  minimum: 0,
  maximum: 100,
  divisor: 100,
  resizes: false
}]]);
const dateTransformFields = new Set([dateLeft, dateTop, dateScale, dateRotation]);
function fitDateComponentToContent(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const number3 = Number(value.position?.height || 100);
  const number = Number(value.position?.x || 0) + numeric / 2;
  const number2 = Number(value.position?.y || 0) + number3 / 2;
  const {
    width,
    height
  } = dateComponentDimensions(fallback);
  editorRenderer?.previewComponentTransform(value.id, {
    x: number - width / 2,
    y: number2 - height / 2,
    width,
    height
  });
}
dateInspector.addEventListener("input", value => {
  const target = selectedComponent();
  if (!target || target.type !== "date") {
    return;
  }
  const eventTarget = value.target;
  const temp2 = dateColorFieldMap.get(eventTarget);
  if (temp2) {
    editorRenderer?.previewComponentProperties(target.id, {
      [temp2]: eventTarget.value
    });
    return;
  }
  const temp3 = dateSizeFieldMap.get(eventTarget);
  if (temp3) {
    if (String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value))) {
      return;
    }
    const clamped = clampNumber(Number(eventTarget.value), temp3.minimum, temp3.maximum) / temp3.divisor;
    const options = {
      ...(target.properties || {}),
      [temp3.property]: clamped
    };
    editorRenderer?.previewComponentProperties(target.id, {
      [temp3.property]: clamped
    });
    if (temp3.resizes) {
      fitDateComponentToContent(target, options);
    }
    return;
  }
  if (!dateTransformFields.has(eventTarget) || String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value))) {
    return;
  }
  const number = Number(eventTarget.value);
  const canvasWidth = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number4 = Number(target.position?.width || 100);
  const number5 = Number(target.position?.height || 100);
  if (eventTarget === dateLeft) {
    const clamped = clampNumber(number, 0, 100);
    editorRenderer?.previewComponentTransform(target.id, {
      x: canvasWidth * clamped / 100 - number4 / 2
    });
  } else if (eventTarget === dateTop) {
    const clamped = clampNumber(number, 0, 100);
    editorRenderer?.previewComponentTransform(target.id, {
      y: canvasHeight * clamped / 100 - number5 / 2
    });
  } else if (eventTarget === dateScale) {
    const clamped = clampNumber(number, 1, 500);
    editorRenderer?.previewComponentTransform(target.id, {
      scale: clamped / 100
    });
  } else if (eventTarget === dateRotation) {
    const rotation5 = clampNumber(number, -360, 360);
    editorRenderer?.previewComponentTransform(target.id, {
      rotation: rotation5
    });
  }
});
dateInspector.addEventListener("change", value => {
  const eventTarget = value.target;
  const target = componentId;
  if (!target) {
    return;
  }
  const temp2 = dateColorFieldMap.get(eventTarget);
  const temp3 = dateSizeFieldMap.get(eventTarget);
  if (!!temp2 || !!temp3 || !!dateTransformFields.has(eventTarget)) {
    if ((temp3 || dateTransformFields.has(eventTarget)) && (String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value)))) {
      refreshInspector();
      return;
    }
    mutateDocument(canvas5 => {
      const position8 = findComponent(canvas5, target)?.component;
      if (!position8 || position8.type !== "date") {
        return;
      }
      position8.properties = {
        ...(position8.properties || {})
      };
      position8.position = {
        ...(position8.position || {})
      };
      position8.style = {
        ...(position8.style || {})
      };
      const number = Number(canvas5.canvas.width || 2778);
      const canvasHeight = Number(canvas5.canvas.height || 1940);
      const number3 = Number(eventTarget.value);
      if (temp2) {
        position8.properties[temp2] = eventTarget.value;
      } else if (temp3) {
        position8.properties[temp3.property] = clampNumber(number3, temp3.minimum, temp3.maximum) / temp3.divisor;
        if (temp3.resizes) {
          fitDateComponent(position8, position8.properties);
        }
      } else if (eventTarget === dateLeft) {
        position8.position.x = number * clampNumber(number3, 0, 100) / 100 - Number(position8.position.width || 100) / 2;
      } else if (eventTarget === dateTop) {
        position8.position.y = canvasHeight * clampNumber(number3, 0, 100) / 100 - Number(position8.position.height || 100) / 2;
      } else if (eventTarget === dateScale) {
        position8.style.scale = clampNumber(number3, 1, 500) / 100;
      } else if (eventTarget === dateRotation) {
        setComponentsRotation(canvas5, target, clampNumber(number3, -360, 360));
      }
    });
  }
});
for (const temp2 of [dateWeekday, dateLunar]) {
  temp2.addEventListener("click", value => {
    const temp = componentId;
    const ancestorEl = value.target.closest("[data-date-weekday]");
    const ancestorEl2 = value.target.closest("[data-date-lunar]");
    if (!!temp && (!!ancestorEl || !!ancestorEl2)) {
      mutateDocument(item => {
        const component = findComponent(item, temp)?.component;
        if (!!component && component.type === "date") {
          component.properties = {
            ...(component.properties || {})
          };
          if (ancestorEl) {
            component.properties.showWeekday = ancestorEl.dataset.dateWeekday === "on";
          }
          if (ancestorEl2) {
            component.properties.showLunar = ancestorEl2.dataset.dateLunar === "on";
          }
          fitDateComponent(component, component.properties);
        }
      });
    }
  });
}
const weatherColorFieldMap = new Map([[weatherTemperatureColor, "temperatureColor"], [weatherSecondaryColor, "secondaryColor"]]);
const weatherSizeFieldMap = new Map([[weatherIconSize, {
  property: "iconSize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [weatherIconGap, {
  property: "iconGap",
  minimum: 0,
  maximum: 300,
  divisor: 1,
  resizes: true
}], [weatherTemperatureSize, {
  property: "temperatureSize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [weatherTemperatureWeight, {
  property: "temperatureWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}], [weatherTemperatureSpacing, {
  property: "temperatureSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}], [weatherSecondarySize, {
  property: "secondarySize",
  minimum: 10,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [weatherSecondaryWeight, {
  property: "secondaryWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}], [weatherSecondarySpacing, {
  property: "secondarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}], [weatherLineGap, {
  property: "lineGap",
  minimum: 0,
  maximum: 200,
  divisor: 1,
  resizes: true
}], [weatherOpacity, {
  property: "opacity",
  minimum: 0,
  maximum: 100,
  divisor: 100,
  resizes: false
}]]);
const weatherTransformFields = new Set([weatherLeft, weatherTop, weatherScale, weatherRotation]);
function fitWeatherComponentToContent(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const number3 = Number(value.position?.height || 100);
  const number = Number(value.position?.x || 0) + numeric / 2;
  const number2 = Number(value.position?.y || 0) + number3 / 2;
  const {
    width,
    height
  } = weatherComponentDimensions(fallback);
  editorRenderer?.previewComponentTransform(value.id, {
    x: number - width / 2,
    y: number2 - height / 2,
    width,
    height
  });
}
weatherInspector.addEventListener("input", value => {
  const target = selectedComponent();
  if (!target || target.type !== "weather") {
    return;
  }
  const eventTarget = value.target;
  const temp2 = weatherColorFieldMap.get(eventTarget);
  if (temp2) {
    editorRenderer?.previewComponentProperties(target.id, {
      [temp2]: eventTarget.value
    });
    return;
  }
  const temp3 = weatherSizeFieldMap.get(eventTarget);
  if (temp3) {
    if (String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value))) {
      return;
    }
    const clamped = clampNumber(Number(eventTarget.value), temp3.minimum, temp3.maximum) / temp3.divisor;
    const options = {
      ...(target.properties || {}),
      [temp3.property]: clamped
    };
    editorRenderer?.previewComponentProperties(target.id, {
      [temp3.property]: clamped
    });
    if (temp3.resizes) {
      fitWeatherComponentToContent(target, options);
    }
    return;
  }
  if (!weatherTransformFields.has(eventTarget) || String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value))) {
    return;
  }
  const number5 = Number(eventTarget.value);
  const number = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number3 = Number(target.position?.width || 100);
  const number4 = Number(target.position?.height || 100);
  if (eventTarget === weatherLeft) {
    const clamped = clampNumber(number5, 0, 100);
    editorRenderer?.previewComponentTransform(target.id, {
      x: number * clamped / 100 - number3 / 2
    });
  } else if (eventTarget === weatherTop) {
    const clamped = clampNumber(number5, 0, 100);
    editorRenderer?.previewComponentTransform(target.id, {
      y: canvasHeight * clamped / 100 - number4 / 2
    });
  } else if (eventTarget === weatherScale) {
    const clamped = clampNumber(number5, 1, 500);
    editorRenderer?.previewComponentTransform(target.id, {
      scale: clamped / 100
    });
  } else if (eventTarget === weatherRotation) {
    const rotation6 = clampNumber(number5, -360, 360);
    editorRenderer?.previewComponentTransform(target.id, {
      rotation: rotation6
    });
  }
});
weatherInspector.addEventListener("change", value => {
  const ancestorEl = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const temp2 = weatherColorFieldMap.get(ancestorEl);
  const property2 = weatherSizeFieldMap.get(ancestorEl);
  if (!!temp2 || !!property2 || !!weatherTransformFields.has(ancestorEl)) {
    if ((property2 || weatherTransformFields.has(ancestorEl)) && (String(ancestorEl.value).trim() === "" || !Number.isFinite(Number(ancestorEl.value)))) {
      refreshInspector();
      return;
    }
    mutateDocument(canvas6 => {
      const position9 = findComponent(canvas6, temp)?.component;
      if (!position9 || position9.type !== "weather") {
        return;
      }
      position9.properties = {
        ...(position9.properties || {})
      };
      position9.position = {
        ...(position9.position || {})
      };
      position9.style = {
        ...(position9.style || {})
      };
      const number = Number(canvas6.canvas.width || 2778);
      const canvasHeight = Number(canvas6.canvas.height || 1940);
      const number3 = Number(ancestorEl.value);
      if (temp2) {
        position9.properties[temp2] = ancestorEl.value;
      } else if (property2) {
        position9.properties[property2.property] = clampNumber(number3, property2.minimum, property2.maximum) / property2.divisor;
        if (property2.resizes) {
          fitWeatherComponent(position9, position9.properties);
        }
      } else if (ancestorEl === weatherLeft) {
        position9.position.x = number * clampNumber(number3, 0, 100) / 100 - Number(position9.position.width || 100) / 2;
      } else if (ancestorEl === weatherTop) {
        position9.position.y = canvasHeight * clampNumber(number3, 0, 100) / 100 - Number(position9.position.height || 100) / 2;
      } else if (ancestorEl === weatherScale) {
        position9.style.scale = clampNumber(number3, 1, 500) / 100;
      } else if (ancestorEl === weatherRotation) {
        setComponentsRotation(canvas6, temp, clampNumber(number3, -360, 360));
      }
    });
  }
});
for (const temp2 of [weatherIconVisible, weatherTemperatureVisible, weatherConditionVisible, weatherHumidityVisible]) {
  temp2.addEventListener("click", value => {
    const temp = componentId;
    const ancestorEl = value.target.closest("button");
    if (!temp || !ancestorEl) {
      return;
    }
    const found = [["weatherIconVisible", "iconVisible"], ["weatherTemperatureVisible", "temperatureVisible"], ["weatherConditionVisible", "conditionVisible"], ["weatherHumidityVisible", "humidityVisible"]].find(([item]) => ancestorEl.dataset[item] !== undefined);
    if (!found) {
      return;
    }
    const [alias, alias2] = found;
    mutateDocument(item => {
      const component = findComponent(item, temp)?.component;
      if (!!component && component.type === "weather") {
        component.properties = {
          ...(component.properties || {}),
          [alias2]: ancestorEl.dataset[alias] === "on"
        };
        fitWeatherComponent(component, component.properties);
      }
    });
  });
}
const lineChartColorFieldMap = new Map([[lineChartValueColor, "valueColor"], [lineChartStatePrecision, "statePrecision"], [lineChartThresholdMode, "thresholdMode"]]);
const lineChartSizeFieldMap = new Map([[lineChartValueScale, {
  property: "valueScale",
  minimum: 10,
  maximum: 500,
  divisor: 1
}], [lineChartValueOffsetX, {
  property: "valueOffsetX",
  minimum: -100,
  maximum: 100,
  divisor: 1
}], [lineChartValueOffsetY, {
  property: "valueOffsetY",
  minimum: -100,
  maximum: 100,
  divisor: 1
}], [lineChartUpdateInterval, {
  property: "updateInterval",
  minimum: 30,
  maximum: 86400,
  divisor: 1
}], [lineChartHours, {
  property: "hours",
  minimum: 1,
  maximum: 168,
  divisor: 1
}], [lineChartCurveRadius, {
  property: "cornerRadius",
  minimum: 0,
  maximum: 50,
  divisor: 1
}]]);
const lineChartTransformFields = new Set([lineChartLeft, lineChartTop, lineChartWidth, lineChartHeight, lineChartScale, lineChartRotation]);
lineChartInspector.addEventListener("input", value => {
  const temp = selectedComponent();
  if (!temp || temp.type !== "line-chart") {
    return;
  }
  const target = value.target;
  const temp2 = lineChartColorFieldMap.get(target);
  const temp3 = lineChartSizeFieldMap.get(target);
  if (temp2) {
    editorRenderer?.previewComponentProperties(temp.id, {
      [temp2]: target.value
    });
    return;
  }
  if (temp3) {
    if (String(target.value).trim() === "" || !Number.isFinite(Number(target.value))) {
      return;
    }
    const clamped = clampNumber(Number(target.value), temp3.minimum, temp3.maximum);
    if (!["updateInterval", "hours"].includes(temp3.property)) {
      editorRenderer?.previewComponentProperties(temp.id, {
        [temp3.property]: clamped / temp3.divisor
      });
    }
    return;
  }
  if (lineChartThresholdFields.findIndex(el3 => el3.value === target || el3.color === target) >= 0) {
    const every = lineChartThresholdFields.map(el3 => ({
      value: Number(el3.value.value),
      color: el3.color.value
    }));
    if (every.every(el3 => Number.isFinite(el3.value))) {
      editorRenderer?.previewComponentProperties(temp.id, {
        thresholdMode: "manual",
        thresholds: every
      });
    }
    return;
  }
  if (!lineChartTransformFields.has(target) || String(target.value).trim() === "" || !Number.isFinite(Number(target.value))) {
    return;
  }
  const numeric = Number(target.value);
  const canvasWidth = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number3 = Number(temp.position?.width || 100);
  const number4 = Number(temp.position?.height || 100);
  const number = Number(temp.position?.x || 0) + number3 / 2;
  const number2 = Number(temp.position?.y || 0) + number4 / 2;
  if (target === lineChartLeft) {
    editorRenderer?.previewComponentTransform(temp.id, {
      x: canvasWidth * clampNumber(numeric, 0, 100) / 100 - number3 / 2
    });
  } else if (target === lineChartTop) {
    editorRenderer?.previewComponentTransform(temp.id, {
      y: canvasHeight * clampNumber(numeric, 0, 100) / 100 - number4 / 2
    });
  } else if (target === lineChartWidth) {
    const width5 = canvasWidth * clampNumber(numeric, 0.1, 100) / 100;
    editorRenderer?.previewComponentTransform(temp.id, {
      x: number - width5 / 2,
      width: width5
    });
  } else if (target === lineChartHeight) {
    const height4 = canvasHeight * clampNumber(numeric, 0.1, 100) / 100;
    editorRenderer?.previewComponentTransform(temp.id, {
      y: number2 - height4 / 2,
      height: height4
    });
  } else if (target === lineChartScale) {
    editorRenderer?.previewComponentTransform(temp.id, {
      scale: clampNumber(numeric, 1, 500) / 100
    });
  } else if (target === lineChartRotation) {
    editorRenderer?.previewComponentTransform(temp.id, {
      rotation: clampNumber(numeric, -360, 360)
    });
  }
});
lineChartInspector.addEventListener("change", value => {
  const target = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const temp2 = lineChartColorFieldMap.get(target);
  const temp3 = lineChartSizeFieldMap.get(target);
  const target2 = lineChartThresholdFields.findIndex(el3 => el3.value === target || el3.color === target);
  if (!!temp2 || !!temp3 || !(target2 < 0) || !!lineChartTransformFields.has(target)) {
    if ((temp3 || lineChartTransformFields.has(target) || target2 >= 0 && target.type === "number") && (String(target.value).trim() === "" || !Number.isFinite(Number(target.value)))) {
      refreshInspector();
      return;
    }
    mutateDocument(doc => {
      const component = findComponent(doc, temp)?.component;
      if (!component || component.type !== "line-chart") {
        return;
      }
      component.properties = {
        ...(component.properties || {})
      };
      component.position = {
        ...(component.position || {})
      };
      component.style = {
        ...(component.style || {})
      };
      const number = Number(doc.canvas.width || 2778);
      const canvasHeight = Number(doc.canvas.height || 1940);
      const number3 = Number(component.position.width || 100);
      const number5 = Number(component.position.height || 100);
      const number4 = Number(component.position.x || 0) + number3 / 2;
      const number2 = Number(component.position.y || 0) + number5 / 2;
      const number6 = Number(target.value);
      if (temp2) {
        component.properties[temp2] = target.value;
        if (target === lineChartThresholdMode && target.value === "manual" && (!Array.isArray(component.properties.thresholds) || !component.properties.thresholds.some(item => Number.isFinite(Number(item?.value))))) {
          component.properties.thresholds = lineChartThresholdFields.map(el3 => ({
            value: Number(el3.value.value),
            color: el3.color.value
          }));
        }
      } else if (temp3) {
        component.properties[temp3.property] = clampNumber(number6, temp3.minimum, temp3.maximum) / temp3.divisor;
      } else if (target2 >= 0) {
        component.properties.thresholdMode = "manual";
        component.properties.thresholds = lineChartThresholdFields.map(el3 => ({
          value: Number(el3.value.value),
          color: el3.color.value
        }));
      } else if (target === lineChartLeft) {
        component.position.x = number * clampNumber(number6, 0, 100) / 100 - number3 / 2;
      } else if (target === lineChartTop) {
        component.position.y = canvasHeight * clampNumber(number6, 0, 100) / 100 - number5 / 2;
      } else if (target === lineChartWidth) {
        component.position.width = number * clampNumber(number6, 0.1, 100) / 100;
        component.position.x = number4 - component.position.width / 2;
      } else if (target === lineChartHeight) {
        component.position.height = canvasHeight * clampNumber(number6, 0.1, 100) / 100;
        component.position.y = number2 - component.position.height / 2;
      } else if (target === lineChartScale) {
        component.style.scale = clampNumber(number6, 1, 500) / 100;
      } else if (target === lineChartRotation) {
        setComponentsRotation(doc, temp, clampNumber(number6, -360, 360));
      }
    });
  }
});
lineChartValueVisible.addEventListener("click", value => {
  const temp = value.target.closest("[data-line-chart-value-visible]");
  const target = componentId;
  if (!!temp && !!target) {
    mutateDocument(param => {
      const properties27 = findComponent(param, target)?.component;
      if (!!properties27 && properties27.type === "line-chart") {
        properties27.properties = {
          ...(properties27.properties || {}),
          valueVisible: temp.dataset.lineChartValueVisible === "on"
        };
      }
    });
  }
});
const panelFrameColorFieldMap = new Map([[panelFrameMainColor, "mainColor"], [panelFrameSecondaryColor, "secondaryColor"], [panelFrameEdgeColor, "edgeColor"], [panelFrameGlowColor, "glowColor"]]);
const panelFrameSizeFieldMap = new Map([[panelFrameMainSize, {
  property: "mainSize",
  minimum: 8,
  maximum: 500,
  divisor: 1
}], [panelFrameMainWeight, {
  property: "mainWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}], [panelFrameMainOpacity, {
  property: "mainOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [panelFrameMainSpacing, {
  property: "mainSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}], [panelFrameMainLeft, {
  property: "mainTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [panelFrameMainTop, {
  property: "mainTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [panelFrameSecondarySize, {
  property: "secondarySize",
  minimum: 6,
  maximum: 500,
  divisor: 1
}], [panelFrameSecondaryWeight, {
  property: "secondaryWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}], [panelFrameSecondaryOpacity, {
  property: "secondaryOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [panelFrameSecondarySpacing, {
  property: "secondarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}], [panelFrameSecondaryLeft, {
  property: "secondaryTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [panelFrameSecondaryTop, {
  property: "secondaryTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [panelFrameEdgeWidth, {
  property: "edgeWidth",
  minimum: 0,
  maximum: 20,
  divisor: 1
}], [panelFrameEdgeOpacity, {
  property: "edgeOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [panelFrameRadius, {
  property: "radius",
  minimum: 0,
  maximum: 50,
  divisor: 100
}], [panelFrameEdgeAngle, {
  property: "edgeAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}], [panelFrameGlowStrength, {
  property: "glowStrength",
  minimum: 0,
  maximum: 500,
  divisor: 100
}], [panelFrameGlowSize, {
  property: "glowSize",
  minimum: 0,
  maximum: 300,
  divisor: 100
}], [panelFrameGlowAngle, {
  property: "glowAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}]]);
const panelFrameTransformFields = new Set([panelFrameLeft, panelFrameTop, panelFrameWidth, panelFrameHeight, panelFrameScale, panelFrameRotation]);
panelFrameInspector.addEventListener("input", value => {
  const component2 = selectedComponent();
  if (!component2 || component2.type !== "panel-frame") {
    return;
  }
  const eventTarget = value.target;
  const temp = panelFrameColorFieldMap.get(eventTarget);
  const minimum = panelFrameSizeFieldMap.get(eventTarget);
  if (temp) {
    editorRenderer?.previewComponentProperties(component2.id, {
      [temp]: eventTarget.value
    });
    return;
  }
  if (minimum) {
    if (String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value))) {
      return;
    }
    const clamped = clampNumber(Number(eventTarget.value), minimum.minimum, minimum.maximum);
    editorRenderer?.previewComponentProperties(component2.id, {
      [minimum.property]: clamped / minimum.divisor
    });
    return;
  }
  if (!panelFrameTransformFields.has(eventTarget) || String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value))) {
    return;
  }
  const number = Number(eventTarget.value);
  const canvasWidth = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number4 = Number(component2.position?.width || 100);
  const number5 = Number(component2.position?.height || 100);
  const number6 = Number(component2.position?.x || 0) + number4 / 2;
  const number7 = Number(component2.position?.y || 0) + number5 / 2;
  if (eventTarget === panelFrameLeft) {
    editorRenderer?.previewComponentTransform(component2.id, {
      x: canvasWidth * clampNumber(number, 0, 100) / 100 - number4 / 2
    });
  } else if (eventTarget === panelFrameTop) {
    editorRenderer?.previewComponentTransform(component2.id, {
      y: canvasHeight * clampNumber(number, 0, 100) / 100 - number5 / 2
    });
  } else if (eventTarget === panelFrameWidth) {
    const width6 = canvasWidth * clampNumber(number, 0.1, 100) / 100;
    editorRenderer?.previewComponentTransform(component2.id, {
      x: number6 - width6 / 2,
      width: width6
    });
  } else if (eventTarget === panelFrameHeight) {
    const height5 = canvasHeight * clampNumber(number, 0.1, 100) / 100;
    editorRenderer?.previewComponentTransform(component2.id, {
      y: number7 - height5 / 2,
      height: height5
    });
  } else if (eventTarget === panelFrameScale) {
    editorRenderer?.previewComponentTransform(component2.id, {
      scale: clampNumber(number, 1, 500) / 100
    });
  } else if (eventTarget === panelFrameRotation) {
    editorRenderer?.previewComponentTransform(component2.id, {
      rotation: clampNumber(number, -360, 360)
    });
  }
});
panelFrameInspector.addEventListener("change", value => {
  const target = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const temp2 = panelFrameColorFieldMap.get(target);
  const property3 = panelFrameSizeFieldMap.get(target);
  if (!!temp2 || !!property3 || !!panelFrameTransformFields.has(target)) {
    if ((property3 || panelFrameTransformFields.has(target)) && (String(target.value).trim() === "" || !Number.isFinite(Number(target.value)))) {
      refreshInspector();
      return;
    }
    mutateDocument(doc => {
      const position10 = findComponent(doc, temp)?.component;
      if (!position10 || position10.type !== "panel-frame") {
        return;
      }
      position10.properties = {
        ...(position10.properties || {})
      };
      position10.position = {
        ...(position10.position || {})
      };
      position10.style = {
        ...(position10.style || {})
      };
      const chosen = Number(doc.canvas.width || 2778);
      const numeric = Number(doc.canvas.height || 1940);
      const number3 = Number(position10.position.width || 100);
      const number4 = Number(position10.position.height || 100);
      const number = Number(position10.position.x || 0) + number3 / 2;
      const number2 = Number(position10.position.y || 0) + number4 / 2;
      const number5 = Number(target.value);
      if (temp2) {
        position10.properties[temp2] = target.value;
      } else if (property3) {
        position10.properties[property3.property] = clampNumber(number5, property3.minimum, property3.maximum) / property3.divisor;
      } else if (target === panelFrameLeft) {
        position10.position.x = chosen * clampNumber(number5, 0, 100) / 100 - number3 / 2;
      } else if (target === panelFrameTop) {
        position10.position.y = numeric * clampNumber(number5, 0, 100) / 100 - number4 / 2;
      } else if (target === panelFrameWidth) {
        position10.position.width = chosen * clampNumber(number5, 0.1, 100) / 100;
        position10.position.x = number - position10.position.width / 2;
      } else if (target === panelFrameHeight) {
        position10.position.height = numeric * clampNumber(number5, 0.1, 100) / 100;
        position10.position.y = number2 - position10.position.height / 2;
      } else if (target === panelFrameScale) {
        position10.style.scale = clampNumber(number5, 1, 500) / 100;
      } else if (target === panelFrameRotation) {
        setComponentsRotation(doc, temp, clampNumber(number5, -360, 360));
      }
    });
  }
});
for (const [temp2, temp3] of [[panelFrameMainVisible, "mainTextVisible"], [panelFrameSecondaryVisible, "secondaryTextVisible"], [panelFrameEdgeVisible, "edgeVisible"], [panelFrameGlowVisible, "glowVisible"]]) {
  temp2.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      mutateDocument(item => {
        const component = findComponent(item, value)?.component;
        if (!!component && component.type === "panel-frame") {
          component.properties = {
            ...(component.properties || {}),
            [temp3]: component.properties?.[temp3] === false
          };
        }
      });
    }
  });
}
const navigationTextFieldMap = new Map([[navigationMainText, "mainText"], [navigationSecondaryText, "secondaryText"], [navigationMainColor, "mainColor"], [navigationSecondaryColor, "secondaryColor"], [navigationIconColor, "iconColor"], [navigationFrameColor, "frameColor"], [navigationGlowColor, "glowColor"]]);
const navigationSizeFieldMap = new Map([[navigationMainSize, {
  property: "mainSize",
  minimum: 1,
  maximum: 500,
  divisor: 1
}], [navigationSecondarySize, {
  property: "secondarySize",
  minimum: 1,
  maximum: 500,
  divisor: 1
}], [navigationMainWeight, {
  property: "mainWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}], [navigationSecondaryWeight, {
  property: "secondaryWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}], [navigationMainSpacing, {
  property: "mainSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}], [navigationSecondarySpacing, {
  property: "secondarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}], [navigationMainTextLeft, {
  property: "mainTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [navigationMainTextTop, {
  property: "mainTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [navigationSecondaryTextLeft, {
  property: "secondaryTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [navigationSecondaryTextTop, {
  property: "secondaryTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [navigationTextIdleOpacity, {
  property: "textIdleOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [navigationTextActiveOpacity, {
  property: "textActiveOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [navigationIconSize, {
  property: "iconSize",
  minimum: 1,
  maximum: 500,
  divisor: 1
}], [navigationIconLeft, {
  property: "iconLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [navigationIconTop, {
  property: "iconTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [navigationIconIdleOpacity, {
  property: "iconIdleOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [navigationIconActiveOpacity, {
  property: "iconActiveOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [navigationFrameWidth, {
  property: "frameWidth",
  minimum: 0,
  maximum: 20,
  divisor: 1
}], [navigationFrameIdleOpacity, {
  property: "frameIdleOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [navigationFrameActiveOpacity, {
  property: "frameActiveOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [navigationRadius, {
  property: "radius",
  minimum: 0,
  maximum: 50,
  divisor: 100
}], [navigationFrameAngle, {
  property: "frameAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}], [navigationGlowAngle, {
  property: "glowAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}], [navigationGlowIdleStrength, {
  property: "glowIdleStrength",
  minimum: 0,
  maximum: 500,
  divisor: 100
}], [navigationGlowIdleSize, {
  property: "glowIdleSize",
  minimum: 0,
  maximum: 300,
  divisor: 100
}], [navigationGlowActiveStrength, {
  property: "glowActiveStrength",
  minimum: 0,
  maximum: 500,
  divisor: 100
}], [navigationGlowActiveSize, {
  property: "glowActiveSize",
  minimum: 0,
  maximum: 300,
  divisor: 100
}]]);
const navigationOpacityModeMap = new Map([[navigationTextIdleOpacity, "off"], [navigationIconIdleOpacity, "off"], [navigationFrameIdleOpacity, "off"], [navigationGlowIdleStrength, "off"], [navigationGlowIdleSize, "off"], [navigationTextActiveOpacity, "on"], [navigationIconActiveOpacity, "on"], [navigationFrameActiveOpacity, "on"], [navigationGlowActiveStrength, "on"], [navigationGlowActiveSize, "on"]]);
function syncNavigationPreviewButtons(value) {
  if (value) {
    for (const classList2 of navigationPreviewState.querySelectorAll("[data-navigation-preview]")) {
      classList2.classList.toggle("active", classList2.dataset.navigationPreview === value);
    }
  }
}
function setNavigationPreviewState(value, param) {
  if (!value) {
    return;
  }
  const chosen = ["on", "off"].includes(param) ? param : "auto";
  if (chosen === "auto") {
    imagePreviewStateById.delete(value);
  } else {
    imagePreviewStateById.set(value, chosen);
  }
  editorRenderer?.setComponentPreviewState(value, chosen);
  if (value === componentId) {
    syncNavigationPreviewButtons(chosen);
  }
}
function withSelectedComponent3(value) {
  const temp = navigationOpacityModeMap.get(value);
  const property = selectedComponent();
  if (!temp || property?.type !== "navigation-button") {
    return null;
  } else {
    setNavigationPreviewState(property.id, temp);
    return temp;
  }
}
const navigationTransformFields = new Set([navigationLeft, navigationTop, navigationWidth, navigationHeight, navigationScale, navigationRotation]);
function navigationPropertyKeyForInput(value) {
  const temp = navigationTextFieldMap.get(value);
  if (temp && airConditionerPropertyMeta[temp]) {
    return temp;
  }
  const temp2 = navigationSizeFieldMap.get(value)?.property;
  if (temp2 && airConditionerPropertyMeta[temp2]) {
    return temp2;
  } else if (value === navigationWidth) {
    return "width";
  } else if (value === navigationHeight) {
    return "height";
  } else if (value === navigationScale) {
    return "scale";
  } else if (value === navigationRotation) {
    return "rotation";
  } else {
    return "";
  }
}
navigationInspector.addEventListener("input", value => {
  const ancestorEl = selectedComponent();
  if (!ancestorEl || ancestorEl.type !== "navigation-button") {
    return;
  }
  const temp = value.target;
  const chosen = navigationTextFieldMap.get(temp);
  if (chosen) {
    if (!labelFieldBindings.has(temp)) {
      editorRenderer?.previewComponentProperties(ancestorEl.id, {
        [chosen]: temp.value
      });
    }
    return;
  }
  const minimum2 = navigationSizeFieldMap.get(temp);
  if (minimum2) {
    if (String(temp.value).trim() === "" || !Number.isFinite(Number(temp.value))) {
      return;
    }
    const clamped = clampNumber(Number(temp.value), minimum2.minimum, minimum2.maximum);
    withSelectedComponent3(temp);
    editorRenderer?.previewComponentProperties(ancestorEl.id, {
      [minimum2.property]: clamped / minimum2.divisor
    });
    return;
  }
  if (!navigationTransformFields.has(temp) || String(temp.value).trim() === "" || !Number.isFinite(Number(temp.value))) {
    return;
  }
  const number = Number(temp.value);
  const canvasWidth = Number(currentProject.document.canvas.width || 2778);
  const canvasHeight = Number(currentProject.document.canvas.height || 1940);
  const number4 = Number(ancestorEl.position?.width || 100);
  const number5 = Number(ancestorEl.position?.height || 100);
  if (temp === navigationLeft) {
    const clamped = clampNumber(number, 0, 100);
    editorRenderer?.previewComponentTransform(ancestorEl.id, {
      x: canvasWidth * clamped / 100 - number4 / 2
    });
  } else if (temp === navigationTop) {
    const clamped = clampNumber(number, 0, 100);
    editorRenderer?.previewComponentTransform(ancestorEl.id, {
      y: canvasHeight * clamped / 100 - number5 / 2
    });
  } else if (temp === navigationWidth) {
    const clamped = clampNumber(number, 0.1, 100);
    const width7 = canvasWidth * clamped / 100;
    const number6 = Number(ancestorEl.position?.x || 0) + number4 / 2;
    editorRenderer?.previewComponentTransform(ancestorEl.id, {
      x: number6 - width7 / 2,
      width: width7
    });
  } else if (temp === navigationHeight) {
    const clamped = clampNumber(number, 0.1, 100);
    const height6 = canvasHeight * clamped / 100;
    const number6 = Number(ancestorEl.position?.y || 0) + number5 / 2;
    editorRenderer?.previewComponentTransform(ancestorEl.id, {
      y: number6 - height6 / 2,
      height: height6
    });
  } else if (temp === navigationScale) {
    const clamped = clampNumber(number, 1, 500);
    editorRenderer?.previewComponentTransform(ancestorEl.id, {
      scale: clamped / 100
    });
  } else if (temp === navigationRotation) {
    const rotation2 = clampNumber(number, -360, 360);
    editorRenderer?.previewComponentTransform(ancestorEl.id, {
      rotation: rotation2
    });
  }
});
navigationInspector.addEventListener("focusin", target29 => {
  withSelectedComponent3(target29.target);
});
navigationInspector.addEventListener("change", target30 => {
  const eventTarget = target30.target;
  const alias = componentId;
  if (!alias) {
    return;
  }
  const temp = navigationTextFieldMap.get(eventTarget);
  const property4 = navigationSizeFieldMap.get(eventTarget);
  const temp2 = navigationOpacityModeMap.get(eventTarget);
  const temp3 = navigationPropertyKeyForInput(eventTarget);
  if (eventTarget === navigationLabel || !!temp || !!property4 || !!navigationTransformFields.has(eventTarget)) {
    if ((property4 || navigationTransformFields.has(eventTarget)) && (String(eventTarget.value).trim() === "" || !Number.isFinite(Number(eventTarget.value)))) {
      refreshInspector();
      return;
    }
    if (temp2) {
      withSelectedComponent3(eventTarget);
    }
    mutateDocument(canvas7 => {
      const position11 = findComponent(canvas7, alias)?.component;
      if (!position11 || position11.type !== "navigation-button") {
        return;
      }
      position11.properties = {
        ...(position11.properties || {})
      };
      position11.position = {
        ...(position11.position || {})
      };
      position11.style = {
        ...(position11.style || {})
      };
      position11.actions = {
        ...(position11.actions || {})
      };
      const chosen = temp3 ? readAirConditionerProperty(position11, temp3) : undefined;
      const number = Number(canvas7.canvas.width || 2778);
      const canvasHeight = Number(canvas7.canvas.height || 1940);
      const number3 = Number(eventTarget.value);
      if (eventTarget === navigationLabel) {
        position11.properties.label = eventTarget.value.trim();
      } else if (temp) {
        position11.properties[temp] = eventTarget.value;
      } else if (property4) {
        position11.properties[property4.property] = clampNumber(number3, property4.minimum, property4.maximum) / property4.divisor;
      } else if (eventTarget === navigationLeft) {
        position11.position.x = number * clampNumber(number3, 0, 100) / 100 - Number(position11.position.width || 100) / 2;
      } else if (eventTarget === navigationTop) {
        position11.position.y = canvasHeight * clampNumber(number3, 0, 100) / 100 - Number(position11.position.height || 100) / 2;
      } else if (eventTarget === navigationWidth) {
        const width = number * clampNumber(number3, 0.1, 100) / 100;
        const number4 = Number(position11.position.x || 0) + Number(position11.position.width || 100) / 2;
        position11.position.x = number4 - width / 2;
        position11.position.width = width;
      } else if (eventTarget === navigationHeight) {
        const height = canvasHeight * clampNumber(number3, 0.1, 100) / 100;
        const number4 = Number(position11.position.y || 0) + Number(position11.position.height || 100) / 2;
        position11.position.y = number4 - height / 2;
        position11.position.height = height;
      } else if (eventTarget === navigationScale) {
        position11.style.scale = clampNumber(number3, 1, 500) / 100;
      } else if (eventTarget === navigationRotation) {
        setComponentsRotation(canvas7, alias, clampNumber(number3, -360, 360));
      }
      if (temp3) {
        buildIdMap2(alias, temp3, chosen, readAirConditionerProperty(position11, temp3));
      }
    });
  }
});
const navigationVisibilityMap = new Map([[navigationMainVisible, "mainTextVisible"], [navigationSecondaryVisible, "secondaryTextVisible"], [navigationIconVisible, "iconVisible"], [navigationFrameVisible, "frameVisible"], [navigationGlowVisible, "glowVisible"]]);
for (const [temp2, temp3] of navigationVisibilityMap) {
  temp2.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      mutateDocument(item => {
        const component = findComponent(item, value)?.component;
        if (!component || component.type !== "navigation-button") {
          return;
        }
        const temp = readAirConditionerProperty(component, temp3);
        component.properties = {
          ...(component.properties || {}),
          [temp3]: component.properties?.[temp3] === false
        };
        buildIdMap2(value, temp3, temp, readAirConditionerProperty(component, temp3));
      });
    }
  });
}
navigationPreviewState.addEventListener("click", target31 => {
  const dataset18 = target31.target.closest("[data-navigation-preview]");
  const alias = componentId;
  if (!dataset18 || !alias) {
    return;
  }
  const chosen = ["off", "on"].includes(dataset18.dataset.navigationPreview) ? dataset18.dataset.navigationPreview : "auto";
  setNavigationPreviewState(alias, chosen);
});
const lineChartDefaultProperties = {
  valueVisible: true,
  statePrecision: "auto",
  valueScale: 100,
  valueColor: "#dce1e5",
  valueOffsetX: 0,
  valueOffsetY: 0,
  updateInterval: 600,
  hours: 24,
  cornerRadius: 10,
  thresholdMode: "auto"
};
const lineChartPropertyMeta = {
  valueVisible: {
    group: "当前数值",
    label: "当前数值显示"
  },
  statePrecision: {
    group: "当前数值",
    label: "数值小数位"
  },
  valueScale: {
    group: "当前数值",
    label: "当前数值大小"
  },
  valueColor: {
    group: "当前数值",
    label: "当前数值颜色"
  },
  valueOffsetX: {
    group: "当前数值",
    label: "当前数值左右位置"
  },
  valueOffsetY: {
    group: "当前数值",
    label: "当前数值上下位置"
  },
  updateInterval: {
    group: "历史数据",
    label: "刷新间隔"
  },
  hours: {
    group: "历史数据",
    label: "历史范围"
  },
  cornerRadius: {
    group: "折线",
    label: "圆角大小"
  },
  thresholdMode: {
    group: "折线",
    label: "阈值模式"
  },
  thresholds: {
    group: "折线",
    label: "阈值与折线颜色"
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度"
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度"
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放"
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转"
  }
};
function readNavigationProperty(component, value) {
  if (component) {
    if (value === "width" || value === "height") {
      return Number(component.position?.[value] || 100);
    } else if (value === "scale") {
      return Number(component.style?.scale || 1);
    } else if (value === "rotation") {
      return Number(component.position?.rotation || 0);
    } else {
      return component.properties?.[value] ?? cloneValue(lineChartDefaultProperties[value]);
    }
  }
}
function collectList(value) {
  if (!value || value.type !== "line-chart") {
    return [];
  }
  let flag = iconOptionCache.get(value.id);
  if (!flag) {
    flag = cloneValue(findComponent(autosaveTimer, value.id)?.component || value);
    iconOptionCache.set(value.id, flag);
  }
  return Object.keys(lineChartPropertyMeta).filter(item => JSON.stringify(readNavigationProperty(value, item)) !== JSON.stringify(readNavigationProperty(flag, item)));
}
function formatNavigationPropertyValue(value, param, param2 = currentProject?.document) {
  if (typeof param == "boolean") {
    if (param) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(param2?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(param || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(param || 0)) + "°";
  } else if (["valueScale", "valueOffsetX", "valueOffsetY", "cornerRadius"].includes(value)) {
    return roundField(Number(param || 0)) + "%";
  } else if (value === "updateInterval") {
    return roundField(Number(param || 0)) + " 秒";
  } else if (value === "hours") {
    return roundField(Number(param || 0)) + " 小时";
  } else if (value === "thresholds") {
    return (Array.isArray(param) ? param.length : 0) + " 段配色";
  } else {
    return String(param ?? "");
  }
}
const panelFrameDefaultProperties = {
  mainTextVisible: true,
  secondaryTextVisible: true,
  mainColor: "#b9bbc0",
  secondaryColor: "#70737b",
  mainSize: 34,
  secondarySize: 12,
  mainWeight: 0.3,
  secondaryWeight: 0.2,
  mainSpacing: 1,
  secondarySpacing: 2,
  secondaryLineGap: 2,
  mainTextLeft: 5.5,
  mainTextTop: 45,
  secondaryTextLeft: 54,
  secondaryTextTop: 43,
  iconVisible: true,
  iconColor: "#b9bbc0",
  iconSize: 30,
  iconLeft: 50,
  iconTop: 45,
  frameVisible: true,
  frameColor: "#60636a",
  frameWidth: 1.5,
  frameSize: 100,
  frameSpacing: 100,
  frameOffsetX: 0,
  frameOffsetY: 0,
  markerVisible: true,
  markerColor: "#f2a20d",
  markerSize: 10,
  markerLeft: 1.8,
  markerTop: 84
};
const panelFramePropertyMeta = {
  mainTextVisible: {
    group: "中文标题",
    label: "中文标题显示"
  },
  mainColor: {
    group: "中文标题",
    label: "中文题色"
  },
  mainSize: {
    group: "中文标题",
    label: "中文大小"
  },
  mainWeight: {
    group: "中文标题",
    label: "中文粗细"
  },
  mainSpacing: {
    group: "中文标题",
    label: "中文字间距"
  },
  mainTextLeft: {
    group: "中文标题",
    label: "中文左右位置"
  },
  mainTextTop: {
    group: "中文标题",
    label: "中文上下位置"
  },
  secondaryTextVisible: {
    group: "英文标题",
    label: "英文标题显示"
  },
  secondaryColor: {
    group: "英文标题",
    label: "英文颜色"
  },
  secondarySize: {
    group: "英文标题",
    label: "英文大小"
  },
  secondaryWeight: {
    group: "英文标题",
    label: "英文粗细"
  },
  secondarySpacing: {
    group: "英文标题",
    label: "英文字间距"
  },
  secondaryLineGap: {
    group: "英文标题",
    label: "英文行间距"
  },
  secondaryTextLeft: {
    group: "英文标题",
    label: "英文左右位置"
  },
  secondaryTextTop: {
    group: "英文标题",
    label: "英文上下位置"
  },
  iconVisible: {
    group: "图标",
    label: "图标显示"
  },
  iconColor: {
    group: "图标",
    label: "图标颜色"
  },
  iconSize: {
    group: "图标",
    label: "图标大小"
  },
  iconLeft: {
    group: "图标",
    label: "图标左右位置"
  },
  iconTop: {
    group: "图标",
    label: "图标上下位置"
  },
  frameVisible: {
    group: "括号",
    label: "括号显示"
  },
  frameColor: {
    group: "括号",
    label: "括号颜色"
  },
  frameWidth: {
    group: "括号",
    label: "括号粗细"
  },
  frameSize: {
    group: "括号",
    label: "括号大小"
  },
  frameSpacing: {
    group: "括号",
    label: "括号间距"
  },
  frameOffsetX: {
    group: "括号",
    label: "括号左右位置"
  },
  frameOffsetY: {
    group: "括号",
    label: "括号上下位置"
  },
  markerVisible: {
    group: "三角指示",
    label: "三角指示显示"
  },
  markerColor: {
    group: "三角指示",
    label: "三角指示颜色"
  },
  markerSize: {
    group: "三角指示",
    label: "三角指示大小"
  },
  markerLeft: {
    group: "三角指示",
    label: "三角指示左右位置"
  },
  markerTop: {
    group: "三角指示",
    label: "三角指示上下位置"
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度"
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度"
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放"
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转"
  }
};
function readPanelFrameProperty(component, value) {
  if (component) {
    if (value === "width" || value === "height") {
      return Number(component.position?.[value] || 100);
    } else if (value === "scale") {
      return Number(component.style?.scale || 1);
    } else if (value === "rotation") {
      return Number(component.position?.rotation || 0);
    } else {
      return component.properties?.[value] ?? panelFrameDefaultProperties[value];
    }
  }
}
function collectList2(value) {
  if (!value || value.type !== "title-button") {
    return [];
  }
  const temp = findComponent(autosaveTimer, value.id)?.component || value;
  return Object.keys(panelFramePropertyMeta).filter(item => JSON.stringify(readPanelFrameProperty(value, item)) !== JSON.stringify(readPanelFrameProperty(temp, item)));
}
function formatPanelFramePropertyValue(value, param, param2 = currentProject?.document) {
  if (typeof param == "boolean") {
    if (param) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(param2?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(param || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(param || 0)) + "°";
  } else if (["mainSize", "secondarySize", "mainSpacing", "secondarySpacing", "secondaryLineGap", "mainTextLeft", "mainTextTop", "secondaryTextLeft", "secondaryTextTop", "iconSize", "iconLeft", "iconTop", "frameSize", "frameSpacing", "frameOffsetX", "frameOffsetY", "markerSize", "markerLeft", "markerTop"].includes(value)) {
    return roundField(Number(param || 0)) + "%";
  } else {
    return String(param ?? "");
  }
}
const ibeDefaultProperties = {
  buttonVisible: true,
  effectVisible: true,
  icon: "mdi:lightbulb-outline",
  iconOffColor: "#9aa5ad",
  iconOnColor: "#ffffff",
  iconSize: 44,
  buttonOffColor: "#17242d",
  buttonOnColor: "#1f91b8",
  buttonOpacity: 0.92,
  frameColor: "#dcebf2",
  frameWidth: 1.5,
  frameOpacity: 0.72,
  radius: 50,
  glowColor: "#43c8f0",
  glowOffStrength: 0,
  glowOnStrength: 1,
  effectColorTemperatureRealtime: true,
  effectBrightnessRealtime: true,
  effectOpacity: 1,
  effectFadeDuration: 0.52,
  effectLayoutMode: "free",
  effectLeft: 50,
  effectTop: 50,
  effectScale: 1,
  effectRotation: 0
};
const titleButtonDefaultProperties = {
  iconVisible: true,
  mainTextVisible: true,
  secondaryTextVisible: true,
  iconOffColor: "#9aa5ad",
  iconOnColor: "#73c8ff",
  badgeColor: "#5b5e66",
  badgeOpacity: 0.58,
  symbolSize: 14,
  badgeSize: 28,
  iconLeft: 20,
  iconTop: 50,
  mainColor: "#c7c8cb",
  mainSize: 21,
  mainWeight: 0.24,
  mainSpacing: 0.5,
  mainTextLeft: 39,
  mainTextTop: 40,
  secondaryColor: "#75777d",
  secondarySize: 12,
  secondaryWeight: 0.12,
  secondarySpacing: 0.3,
  secondaryTextLeft: 39,
  secondaryTextTop: 67,
  airflowVisible: true,
  airflowMotion: "dynamic",
  airflowCoolColor: "#73c8ff",
  airflowHeatColor: "#ff8a65",
  airflowOtherColor: "#dce2e6",
  airflowAngle: 7,
  airflowCurve: 20,
  airflowLength: 200,
  airflowFadePosition: 50,
  airflowSpread: 100,
  airflowDensity: 60,
  airflowIrregularity: 50,
  airflowThickness: 40,
  airflowStrength: 200,
  airflowBlur: 6,
  airflowSpeed: 1,
  airflowOffsetX: -75,
  airflowOffsetY: 34,
  airflowWidth: 64,
  airflowHeight: 125,
  airflowScale: 1,
  airflowRotation: -3
};
const titleButtonPropertyMeta = {
  iconVisible: {
    group: "图标",
    label: "图标显示"
  },
  iconOffColor: {
    group: "图标",
    label: "关闭颜色"
  },
  iconOnColor: {
    group: "图标",
    label: "开启颜色"
  },
  badgeColor: {
    group: "图标",
    label: "底座颜色"
  },
  badgeOpacity: {
    group: "图标",
    label: "底座透明度"
  },
  symbolSize: {
    group: "图标",
    label: "图标大小"
  },
  badgeSize: {
    group: "图标",
    label: "底座大小"
  },
  iconLeft: {
    group: "图标",
    label: "图标左右位置"
  },
  iconTop: {
    group: "图标",
    label: "图标上下位置"
  },
  mainTextVisible: {
    group: "标题",
    label: "标题显示"
  },
  mainColor: {
    group: "标题",
    label: "颜色"
  },
  mainSize: {
    group: "标题",
    label: "大小"
  },
  mainWeight: {
    group: "标题",
    label: "粗细"
  },
  mainSpacing: {
    group: "标题",
    label: "字间距"
  },
  mainTextLeft: {
    group: "标题",
    label: "左右位置"
  },
  mainTextTop: {
    group: "标题",
    label: "上下位置"
  },
  secondaryTextVisible: {
    group: "状态",
    label: "状态显示"
  },
  secondaryColor: {
    group: "状态",
    label: "颜色"
  },
  secondarySize: {
    group: "状态",
    label: "大小"
  },
  secondaryWeight: {
    group: "状态",
    label: "粗细"
  },
  secondarySpacing: {
    group: "状态",
    label: "字间距"
  },
  secondaryTextLeft: {
    group: "状态",
    label: "左右位置"
  },
  secondaryTextTop: {
    group: "状态",
    label: "上下位置"
  },
  airflowVisible: {
    group: "出风效果",
    label: "显示"
  },
  airflowMotion: {
    group: "出风效果",
    label: "效果模式"
  },
  airflowCoolColor: {
    group: "出风颜色",
    label: "制冷"
  },
  airflowHeatColor: {
    group: "出风颜色",
    label: "制热"
  },
  airflowOtherColor: {
    group: "出风颜色",
    label: "其它"
  },
  airflowAngle: {
    group: "出风效果",
    label: "整体方向"
  },
  airflowCurve: {
    group: "出风效果",
    label: "弯曲程度"
  },
  airflowLength: {
    group: "出风效果",
    label: "单股长度"
  },
  airflowFadePosition: {
    group: "出风效果",
    label: "渐变消失位置"
  },
  airflowSpread: {
    group: "出风效果",
    label: "扩散宽度"
  },
  airflowDensity: {
    group: "出风效果",
    label: "气流密度"
  },
  airflowIrregularity: {
    group: "出风效果",
    label: "错落程度"
  },
  airflowThickness: {
    group: "出风效果",
    label: "整体粗细"
  },
  airflowStrength: {
    group: "出风效果",
    label: "显示强度"
  },
  airflowBlur: {
    group: "出风效果",
    label: "模糊大小"
  },
  airflowSpeed: {
    group: "出风效果",
    label: "动画速度"
  },
  airflowOffsetX: {
    group: "出风位置",
    label: "左右偏移"
  },
  airflowOffsetY: {
    group: "出风位置",
    label: "上下偏移"
  },
  airflowWidth: {
    group: "出风位置",
    label: "宽度"
  },
  airflowHeight: {
    group: "出风位置",
    label: "高度"
  },
  airflowScale: {
    group: "出风位置",
    label: "缩放"
  },
  airflowRotation: {
    group: "出风位置",
    label: "旋转"
  },
  width: {
    group: "按钮尺寸",
    label: "宽度"
  },
  height: {
    group: "按钮尺寸",
    label: "高度"
  },
  scale: {
    group: "按钮变换",
    label: "缩放"
  },
  rotation: {
    group: "按钮变换",
    label: "旋转"
  }
};
function readIbeProperty(component, value) {
  if (component) {
    if (value === "width" || value === "height") {
      return Number(component.position?.[value] || 100);
    } else if (value === "scale") {
      return Number(component.style?.scale || 1);
    } else if (value === "rotation") {
      return Number(component.position?.rotation || 0);
    } else {
      return component.properties?.[value] ?? titleButtonDefaultProperties[value];
    }
  }
}
function collectList3(value) {
  if (!value || value.type !== "air-conditioner") {
    return [];
  }
  let temp = relatedEntityOptionCache.get(value.id);
  if (!temp) {
    temp = cloneValue(findComponent(autosaveTimer, value.id)?.component || value);
    relatedEntityOptionCache.set(value.id, temp);
  }
  return Object.keys(titleButtonPropertyMeta).filter(item => JSON.stringify(readIbeProperty(value, item)) !== JSON.stringify(readIbeProperty(temp, item)));
}
function formatIbePropertyValue(value, param, param2 = currentProject?.document) {
  if (typeof param == "boolean") {
    if (param) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(param2?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(param || 0) / numeric * 100) + "%";
  }
  if (["scale", "airflowScale", "badgeOpacity"].includes(value)) {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (["rotation", "airflowRotation", "airflowAngle"].includes(value)) {
    return roundField(Number(param || 0)) + "°";
  } else if (value === "airflowMotion") {
    if (param === "static") {
      return "静态";
    } else {
      return "动态";
    }
  } else if (typeof param == "number") {
    return roundField(param);
  } else {
    return String(param ?? "");
  }
}
const ibePropertyMeta = {
  buttonVisible: {
    group: "图层显示",
    label: "按钮层"
  },
  effectVisible: {
    group: "图层显示",
    label: "效果图层"
  },
  icon: {
    group: "按钮图标",
    label: "图标"
  },
  iconOffColor: {
    group: "按钮图标",
    label: "关闭后颜色"
  },
  iconOnColor: {
    group: "按钮图标",
    label: "关闭前颜色"
  },
  iconSize: {
    group: "按钮图标",
    label: "图标大小"
  },
  buttonOffColor: {
    group: "按钮背景",
    label: "关闭后颜色"
  },
  buttonOnColor: {
    group: "按钮背景",
    label: "关闭前颜色"
  },
  buttonOpacity: {
    group: "按钮背景",
    label: "透明度"
  },
  frameColor: {
    group: "外框",
    label: "颜色"
  },
  frameWidth: {
    group: "外框",
    label: "粗细"
  },
  frameOpacity: {
    group: "外框",
    label: "透明度"
  },
  radius: {
    group: "外框",
    label: "圆角"
  },
  glowColor: {
    group: "光晕",
    label: "颜色"
  },
  glowOffStrength: {
    group: "光晕",
    label: "关闭后强度"
  },
  glowOnStrength: {
    group: "光晕",
    label: "关闭前强度"
  },
  effectColorTemperatureRealtime: {
    group: "灯光实时反馈",
    label: "色温实时"
  },
  effectBrightnessRealtime: {
    group: "灯光实时反馈",
    label: "亮度实时"
  },
  effectOpacity: {
    group: "效果图层",
    label: "透明度"
  },
  effectFadeDuration: {
    group: "效果图层",
    label: "淡入淡出时间"
  },
  effectLayoutMode: {
    group: "效果图层",
    label: "图片布局"
  },
  effectLeft: {
    group: "效果图层",
    label: "左右位置"
  },
  effectTop: {
    group: "效果图层",
    label: "上下位置"
  },
  effectScale: {
    group: "效果图层",
    label: "缩放"
  },
  effectRotation: {
    group: "效果图层",
    label: "旋转"
  },
  width: {
    group: "按钮尺寸",
    label: "宽度"
  },
  height: {
    group: "按钮尺寸",
    label: "高度"
  },
  scale: {
    group: "按钮变换",
    label: "缩放"
  },
  rotation: {
    group: "按钮变换",
    label: "旋转"
  }
};
function readTitleButtonProperty(component, value) {
  if (component) {
    if (value === "width" || value === "height") {
      return Number(component.position?.[value] || 100);
    } else if (value === "scale") {
      return Number(component.style?.scale || 1);
    } else if (value === "rotation") {
      return Number(component.position?.rotation || 0);
    } else {
      return component.properties?.[value] ?? ibeDefaultProperties[value];
    }
  }
}
function ibeTemplateOptions3(component) {
  if (!component || component.type !== "icon-button-effect") {
    return [];
  }
  let sensorKind = assetOptionCache.get(component.id);
  if (!sensorKind) {
    sensorKind = cloneValue(findComponent(autosaveTimer, component.id)?.component || component);
    assetOptionCache.set(component.id, sensorKind);
  }
  return Object.keys(ibePropertyMeta).filter(item => JSON.stringify(readTitleButtonProperty(component, item)) !== JSON.stringify(readTitleButtonProperty(sensorKind, item)));
}
function formatTitleButtonPropertyValue(value, param, param2 = currentProject?.document) {
  if (typeof param == "boolean") {
    if (param) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(param2?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(param || 0) / numeric * 100) + "%";
  }
  if (["buttonOpacity", "frameOpacity", "glowOffStrength", "glowOnStrength", "effectOpacity", "effectScale", "scale"].includes(value)) {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (["iconSize", "radius", "effectLeft", "effectTop"].includes(value)) {
    return roundField(Number(param || 0)) + "%";
  } else if (["effectRotation", "rotation"].includes(value)) {
    return roundField(Number(param || 0)) + "°";
  } else if (["effectFadeDuration", "onFillFadeDuration"].includes(value)) {
    return roundField(Number(param || 0)) + " 秒";
  } else if (value === "effectLayoutMode") {
    if (param === "fill") {
      return "铺满";
    } else {
      return "自由";
    }
  } else {
    return String(param || "不使用");
  }
}
const iconButtonDefaultProperties = {
  iconColor: "#d7d8da",
  iconSize: 42,
  iconOffOpacity: 1,
  iconOnOpacity: 1,
  iconLeft: 50,
  iconTop: 34,
  iconOnColor: "#379bff",
  badgeColor: "#5b5e66",
  badgeOpacity: 0.58,
  symbolSize: 14,
  badgeSize: 28,
  mainColor: "#c7c8cb",
  mainSize: 25,
  mainWeight: 0.25,
  mainSpacing: 1,
  mainTextLeft: 9,
  mainTextTop: 78,
  mainOffOpacity: 1,
  mainOnOpacity: 1,
  secondaryColor: "#75777d",
  secondarySize: 10,
  secondaryWeight: 0.18,
  secondarySpacing: 0.7,
  secondaryTextLeft: 9,
  secondaryTextTop: 91,
  secondaryOffOpacity: 1,
  secondaryOnOpacity: 1,
  onFillVisible: true,
  onFillColor: "#dfb64f",
  onFillStrength: 1,
  onFillFadeDuration: 0.3,
  frameVisible: true,
  frameWidth: 1,
  frameAngle: 45,
  frameOffOpacity: 0.8,
  frameOnOpacity: 1,
  cutCorner: 20,
  softLightVisible: true,
  softLightColor: "#ffffff",
  softLightStrength: 1,
  softLightSize: 1,
  softLightAngle: 45,
  glowVisible: true,
  glowColor: "#ffffff",
  glowStrength: 1,
  glowSize: 1,
  glowAngle: 220,
  haloVisible: true,
  haloScaleX: 1,
  haloScaleY: 1,
  haloRotation: 0,
  haloOpacity: 1,
  personVisible: true,
  personScale: 1,
  personRotation: 0,
  personOpacity: 1,
  orbitDuration: 8,
  perspectiveCorners: unitQuadUv,
  waterLeakColor: "#42c8ff",
  smokeColor: "#ffffff",
  naturalGasColor: "#ffb347"
};
const iconButtonPropertyMeta = {
  iconColor: {
    group: "图标",
    label: "图标颜色"
  },
  iconOnColor: {
    group: "图标",
    label: "开启颜色"
  },
  badgeColor: {
    group: "图标",
    label: "底座颜色"
  },
  badgeOpacity: {
    group: "图标",
    label: "底座透明度"
  },
  symbolSize: {
    group: "图标",
    label: "图标大小"
  },
  badgeSize: {
    group: "图标",
    label: "底座大小"
  },
  iconSize: {
    group: "图标",
    label: "图标大小"
  },
  iconLeft: {
    group: "图标",
    label: "图标左右位置"
  },
  iconTop: {
    group: "图标",
    label: "图标上下位置"
  },
  iconOffOpacity: {
    group: "图标",
    label: "图标关闭后透明度"
  },
  iconOnOpacity: {
    group: "图标",
    label: "图标关闭前透明度"
  },
  mainColor: {
    group: "中文标题",
    label: "中文颜色"
  },
  mainSize: {
    group: "中文标题",
    label: "中文大小"
  },
  mainWeight: {
    group: "中文标题",
    label: "中文粗细"
  },
  mainSpacing: {
    group: "中文标题",
    label: "中文字间距"
  },
  mainTextLeft: {
    group: "中文标题",
    label: "中文左右位置"
  },
  mainTextTop: {
    group: "中文标题",
    label: "中文上下位置"
  },
  mainOffOpacity: {
    group: "中文标题",
    label: "中文关闭后透明度"
  },
  mainOnOpacity: {
    group: "中文标题",
    label: "中文关闭前透明度"
  },
  secondaryColor: {
    group: "英文标题",
    label: "英文颜色"
  },
  secondarySize: {
    group: "英文标题",
    label: "英文大小"
  },
  secondaryWeight: {
    group: "英文标题",
    label: "英文粗细"
  },
  secondarySpacing: {
    group: "英文标题",
    label: "英文字间距"
  },
  secondaryTextLeft: {
    group: "英文标题",
    label: "英文左右位置"
  },
  secondaryTextTop: {
    group: "英文标题",
    label: "英文上下位置"
  },
  secondaryOffOpacity: {
    group: "英文标题",
    label: "英文关闭后透明度"
  },
  secondaryOnOpacity: {
    group: "英文标题",
    label: "英文关闭前透明度"
  },
  onFillVisible: {
    group: "状态填充",
    label: "状态填充显示"
  },
  onFillColor: {
    group: "状态填充",
    label: "关闭前填充颜色"
  },
  onFillStrength: {
    group: "状态填充",
    label: "关闭前填充强度"
  },
  onFillFadeDuration: {
    group: "状态填充",
    label: "淡入淡出时间"
  },
  frameVisible: {
    group: "外框",
    label: "外框显示"
  },
  frameWidth: {
    group: "外框",
    label: "外框粗细"
  },
  frameAngle: {
    group: "外框",
    label: "外框渐变角度"
  },
  frameOffOpacity: {
    group: "外框",
    label: "外框关闭后透明度"
  },
  frameOnOpacity: {
    group: "外框",
    label: "外框关闭前透明度"
  },
  cutCorner: {
    group: "外框",
    label: "切角大小"
  },
  softLightVisible: {
    group: "柔光",
    label: "柔光显示"
  },
  softLightColor: {
    group: "柔光",
    label: "柔光颜色"
  },
  softLightSize: {
    group: "柔光",
    label: "柔光大小"
  },
  softLightStrength: {
    group: "柔光",
    label: "柔光强度"
  },
  softLightAngle: {
    group: "柔光",
    label: "柔光角度"
  },
  glowVisible: {
    group: "泛光",
    label: "泛光显示"
  },
  glowColor: {
    group: "泛光",
    label: "泛光颜色"
  },
  glowSize: {
    group: "泛光",
    label: "泛光大小"
  },
  glowStrength: {
    group: "泛光",
    label: "泛光强度"
  },
  glowAngle: {
    group: "泛光",
    label: "泛光角度"
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度"
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度"
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放"
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转"
  }
};
const presencePropertyMeta = {
  iconColor: {
    group: "显示颜色",
    label: "无人颜色"
  },
  iconOnColor: {
    group: "显示颜色",
    label: "有人颜色"
  },
  waterLeakColor: {
    group: "显示颜色",
    label: "水浸颜色"
  },
  smokeColor: {
    group: "显示颜色",
    label: "烟雾颜色"
  },
  naturalGasColor: {
    group: "显示颜色",
    label: "天然气颜色"
  },
  haloVisible: {
    group: "运动路径",
    label: "光环显示"
  },
  haloScaleX: {
    group: "运动路径",
    label: "光环宽度"
  },
  haloScaleY: {
    group: "运动路径",
    label: "光环高度"
  },
  haloRotation: {
    group: "运动路径",
    label: "光环旋转"
  },
  haloOpacity: {
    group: "运动路径",
    label: "光环透明度"
  },
  personVisible: {
    group: "运动路径",
    label: "小人显示"
  },
  personScale: {
    group: "运动路径",
    label: "小人缩放"
  },
  personRotation: {
    group: "运动路径",
    label: "小人旋转"
  },
  personOpacity: {
    group: "运动路径",
    label: "小人透明度"
  },
  orbitDuration: {
    group: "运动路径",
    label: "循环一周"
  },
  perspectiveCorners: {
    group: "透视",
    label: "四角透视"
  },
  width: iconButtonPropertyMeta.width,
  height: iconButtonPropertyMeta.height,
  scale: iconButtonPropertyMeta.scale,
  rotation: iconButtonPropertyMeta.rotation
};
function presenceSensorKind2(value) {
  const temp = value?.properties?.sensorKind;
  if (["presence", "door-window", "water-leak", "smoke", "natural-gas"].includes(temp)) {
    return temp;
  } else {
    return "presence";
  }
}
function presenceSensorKindLabel2(value) {
  return {
    presence: "人体/人在传感器",
    "door-window": "门窗传感器",
    "water-leak": "水浸传感器",
    smoke: "烟雾传感器",
    "natural-gas": "天然气传感器"
  }[presenceSensorKind2(value)];
}
function collectList4(value) {
  const temp = ["width", "height", "scale", "rotation"];
  const temp2 = presenceSensorKind2(value);
  if (temp2 === "presence") {
    return ["iconColor", "iconOnColor", "haloVisible", "haloScaleX", "haloScaleY", "haloRotation", "haloOpacity", "personVisible", "personScale", "personRotation", "personOpacity", "orbitDuration", ...temp];
  } else if (temp2 === "door-window") {
    return ["iconOnColor", "perspectiveCorners", ...temp];
  } else if (temp2 === "water-leak") {
    return ["waterLeakColor", ...temp];
  } else if (temp2 === "smoke") {
    return ["smokeColor", ...temp];
  } else {
    return ["naturalGasColor", ...temp];
  }
}
function readPresenceProperty(component, value) {
  if (!component) {
    return;
  }
  if (value === "width" || value === "height") {
    return Number(component.position?.[value] || 100);
  }
  if (value === "scale") {
    return Number(component.style?.scale || 1);
  }
  if (value === "rotation") {
    return Number(component.position?.rotation || 0);
  }
  const flag = component.properties || {};
  if (value === "iconColor") {
    return flag.iconColor ?? flag.clearColor ?? flag.iconOffColor ?? flag.iconOnColor ?? iconButtonDefaultProperties.iconColor;
  } else if (value === "iconOnColor") {
    return flag.iconOnColor ?? flag.occupiedColor ?? iconButtonDefaultProperties.iconOnColor;
  } else if (value === "mainColor") {
    return flag.mainColor ?? flag.mainOffColor ?? flag.mainOnColor ?? iconButtonDefaultProperties.mainColor;
  } else if (value === "secondaryColor") {
    return flag.secondaryColor ?? flag.secondaryOffColor ?? flag.secondaryOnColor ?? iconButtonDefaultProperties.secondaryColor;
  } else {
    return flag[value] ?? iconButtonDefaultProperties[value];
  }
}
function syncIconButtonIcon5(value) {
  if (!value || !["icon-button", "device-button", "presence-sensor"].includes(value.type)) {
    return [];
  }
  let flag = popupEntityOptionCache.get(value.id);
  if (!flag) {
    flag = cloneValue(findComponent(autosaveTimer, value.id)?.component || value);
    popupEntityOptionCache.set(value.id, flag);
  }
  return (value.type === "presence-sensor" ? collectList4(value) : value.type === "device-button" ? ["iconColor", "iconOnColor", "badgeColor", "badgeOpacity", "symbolSize", "badgeSize", "iconLeft", "iconTop", "mainColor", "mainSize", "mainWeight", "mainSpacing", "mainTextLeft", "mainTextTop", "secondaryColor", "secondarySize", "secondaryWeight", "secondarySpacing", "secondaryTextLeft", "secondaryTextTop", "width", "height", "scale", "rotation"] : Object.keys(iconButtonPropertyMeta)).filter(item => JSON.stringify(readPresenceProperty(value, item)) !== JSON.stringify(readPresenceProperty(flag, item)));
}
function presenceOrDevicePropertyMeta(value, param) {
  if (value?.type === "presence-sensor") {
    return presencePropertyMeta[param];
  } else if (value?.type !== "device-button") {
    return iconButtonPropertyMeta[param];
  } else if (param.startsWith("main")) {
    return {
      group: "标题",
      label: param === "mainOnOpacity" ? "透明度" : iconButtonPropertyMeta[param]?.label?.replace("中文", "")
    };
  } else if (param.startsWith("secondary")) {
    return {
      group: "状态",
      label: param === "secondaryOnOpacity" ? "透明度" : iconButtonPropertyMeta[param]?.label?.replace("英文", "")
    };
  } else {
    return iconButtonPropertyMeta[param];
  }
}
function formatPresencePropertyValue(value, param, param2 = currentProject?.document) {
  if (typeof param == "boolean") {
    if (param) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(param2?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(param || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (value === "perspectiveCorners") {
    if (JSON.stringify(param) === JSON.stringify(unitQuadUv)) {
      return "默认透视";
    } else {
      return "自定义透视";
    }
  } else if (value === "orbitDuration") {
    return roundField(Number(param || 0)) + " 秒";
  } else if (value === "onFillFadeDuration") {
    return roundField(Number(param || 0)) + " 秒";
  } else if (["rotation", "frameAngle", "softLightAngle", "glowAngle", "haloRotation", "personRotation"].includes(value)) {
    return roundField(Number(param || 0)) + "°";
  } else if (["iconOffOpacity", "iconOnOpacity", "mainOffOpacity", "mainOnOpacity", "secondaryOffOpacity", "secondaryOnOpacity", "badgeOpacity", "onFillStrength", "frameOffOpacity", "frameOnOpacity", "softLightStrength", "softLightSize", "glowStrength", "glowSize", "haloScaleX", "haloScaleY", "haloOpacity", "personScale", "personOpacity"].includes(value)) {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (["iconSize", "symbolSize", "badgeSize", "iconLeft", "iconTop", "mainTextLeft", "mainTextTop", "secondaryTextLeft", "secondaryTextTop", "cutCorner"].includes(value)) {
    return roundField(Number(param || 0)) + "%";
  } else {
    return String(param ?? "");
  }
}
const cameraDefaultProperties = {
  mediaVisible: true,
  displayMode: "live",
  refreshInterval: 10,
  fit: "fill",
  frameVisible: true,
  frameColor: "#d4d4d4",
  frameWidth: 1,
  radius: 0.04,
  frameAngle: 45,
  frameOpacity: 0.9
};
const cameraPropertyMeta = {
  mediaVisible: {
    group: "画面",
    label: "画面显示"
  },
  displayMode: {
    group: "画面",
    label: "显示方式"
  },
  refreshInterval: {
    group: "画面",
    label: "快照更新时间"
  },
  fit: {
    group: "画面",
    label: "画面比例"
  },
  frameVisible: {
    group: "外框",
    label: "外框显示"
  },
  frameColor: {
    group: "外框",
    label: "外框颜色"
  },
  frameWidth: {
    group: "外框",
    label: "外框粗细"
  },
  radius: {
    group: "外框",
    label: "圆角大小"
  },
  frameAngle: {
    group: "外框",
    label: "渐变角度"
  },
  frameOpacity: {
    group: "外框",
    label: "外框透明度"
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度"
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度"
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放"
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转"
  }
};
function readCameraProperty(component, value) {
  if (!component) {
    return;
  }
  if (value === "width" || value === "height") {
    return Number(component.position?.[value] || 100);
  }
  if (value === "scale") {
    return Number(component.style?.scale || 1);
  }
  if (value === "rotation") {
    return Number(component.position?.rotation || 0);
  }
  const flag = component.properties || {};
  if (value === "displayMode") {
    if (flag.displayMode === "snapshot") {
      return "snapshot";
    } else {
      return "live";
    }
  }
  if (value === "refreshInterval") {
    const numeric = Number(flag.refreshInterval);
    if (Number.isFinite(numeric)) {
      return Math.max(6, Math.round(numeric));
    } else {
      return 10;
    }
  }
  if (value === "fit") {
    if (flag.fit === "contain") {
      return "contain";
    } else {
      return "fill";
    }
  }
  if (value === "radius") {
    const numeric = Number(flag.radius ?? cameraDefaultProperties.radius);
    return Math.max(0, Math.min(0.5, numeric > 0.5 ? numeric / 100 : numeric));
  }
  return flag[value] ?? cameraDefaultProperties[value];
}
function collectList5(value) {
  if (!value || value.type !== "camera") {
    return [];
  }
  const temp = findComponent(autosaveTimer, value.id)?.component || value;
  return Object.keys(cameraPropertyMeta).filter(item => JSON.stringify(readCameraProperty(value, item)) !== JSON.stringify(readCameraProperty(temp, item)));
}
function formatCameraPropertyValue(value, param, param2 = currentProject?.document) {
  if (typeof param == "boolean") {
    if (param) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "displayMode") {
    if (param === "snapshot") {
      return "快照";
    } else {
      return "实时";
    }
  }
  if (value === "refreshInterval") {
    return roundField(Number(param || 10)) + " 秒";
  }
  if (value === "fit") {
    if (param === "contain") {
      return "原始比例";
    } else {
      return "压缩 16:9";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(param2?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(param || 0) / numeric * 100) + "%";
  }
  if (value === "scale" || value === "radius" || value === "frameOpacity") {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (value === "rotation" || value === "frameAngle") {
    return roundField(Number(param || 0)) + "°";
  } else {
    return String(param ?? "");
  }
}
const navigationDefaultProperties = {
  mainTextVisible: true,
  mainColor: "#ffffff",
  mainSize: 30,
  mainWeight: 0,
  mainOpacity: 0.72,
  mainSpacing: 2,
  mainTextLeft: 5.2,
  mainTextTop: 20,
  secondaryTextVisible: true,
  secondaryColor: "#ffffff",
  secondarySize: 15,
  secondaryWeight: 0,
  secondaryOpacity: 0.36,
  secondarySpacing: 2.1,
  secondaryTextLeft: 5.2,
  secondaryTextTop: 28,
  edgeVisible: true,
  edgeColor: "#d4d4d4",
  edgeWidth: 0.9,
  edgeOpacity: 1,
  radius: 0.195,
  edgeAngle: 45,
  glowVisible: true,
  glowColor: "#ffffff",
  glowStrength: 0.5,
  glowSize: 1.5,
  glowAngle: 242
};
const navigationPropertyMeta = {
  mainTextVisible: {
    group: "主文字",
    label: "主文字显示"
  },
  mainColor: {
    group: "主文字",
    label: "主文字颜色"
  },
  mainSize: {
    group: "主文字",
    label: "主文字大小"
  },
  mainWeight: {
    group: "主文字",
    label: "主文字笔画粗细"
  },
  mainOpacity: {
    group: "主文字",
    label: "主文字透明度"
  },
  mainSpacing: {
    group: "主文字",
    label: "主文字字间距"
  },
  mainTextLeft: {
    group: "主文字",
    label: "主文字左右位置"
  },
  mainTextTop: {
    group: "主文字",
    label: "主文字上下位置"
  },
  secondaryTextVisible: {
    group: "副文字",
    label: "副文字显示"
  },
  secondaryColor: {
    group: "副文字",
    label: "副文字颜色"
  },
  secondarySize: {
    group: "副文字",
    label: "副文字大小"
  },
  secondaryWeight: {
    group: "副文字",
    label: "副文字笔画粗细"
  },
  secondaryOpacity: {
    group: "副文字",
    label: "副文字透明度"
  },
  secondarySpacing: {
    group: "副文字",
    label: "副文字字间距"
  },
  secondaryTextLeft: {
    group: "副文字",
    label: "副文字左右位置"
  },
  secondaryTextTop: {
    group: "副文字",
    label: "副文字上下位置"
  },
  edgeVisible: {
    group: "外框",
    label: "外框显示"
  },
  edgeColor: {
    group: "外框",
    label: "外框颜色"
  },
  edgeWidth: {
    group: "外框",
    label: "外框粗细"
  },
  edgeOpacity: {
    group: "外框",
    label: "外框透明度"
  },
  radius: {
    group: "外框",
    label: "外框圆角"
  },
  edgeAngle: {
    group: "外框",
    label: "外框渐变角度"
  },
  glowVisible: {
    group: "柔光",
    label: "柔光显示"
  },
  glowColor: {
    group: "柔光",
    label: "柔光颜色"
  },
  glowStrength: {
    group: "柔光",
    label: "柔光强度"
  },
  glowSize: {
    group: "柔光",
    label: "柔光大小"
  },
  glowAngle: {
    group: "柔光",
    label: "柔光角度"
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度"
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度"
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放"
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转"
  }
};
function readVacuumMapProperty(component, value) {
  if (!component) {
    return;
  }
  if (value === "width" || value === "height") {
    return Number(component.position?.[value] || 100);
  }
  if (value === "scale") {
    return Number(component.style?.scale || 1);
  }
  if (value === "rotation") {
    return Number(component.position?.rotation || 0);
  }
  const flag = component.properties || {};
  if (value === "mainTextLeft" || value === "secondaryTextLeft") {
    return flag[value] ?? flag.textLeft ?? navigationDefaultProperties[value];
  }
  if (value === "mainTextTop") {
    const count = Math.max(1, Number(component.position?.height || 100));
    return flag.mainTextTop ?? Number(flag.textTop ?? 28) - Number(flag.lineGap ?? 24) / count * 100;
  }
  if (value === "secondaryTextTop") {
    return flag.secondaryTextTop ?? flag.textTop ?? navigationDefaultProperties.secondaryTextTop;
  } else {
    return flag[value] ?? navigationDefaultProperties[value];
  }
}
function collectList6(value) {
  if (!value || value.type !== "panel-frame") {
    return [];
  }
  let temp = entityOptionCache.get(value.id);
  if (!temp) {
    temp = cloneValue(findComponent(autosaveTimer, value.id)?.component || value);
    entityOptionCache.set(value.id, temp);
  }
  return Object.keys(navigationPropertyMeta).filter(item => !temp || temp.type !== "panel-frame" ? true : JSON.stringify(readVacuumMapProperty(value, item)) !== JSON.stringify(readVacuumMapProperty(temp, item)));
}
function formatVacuumMapPropertyValue(value, param, param2 = currentProject?.document) {
  if (typeof param == "boolean") {
    if (param) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(param2?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(param || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (value === "rotation" || value === "edgeAngle" || value === "glowAngle") {
    return roundField(Number(param || 0)) + "°";
  } else if (["mainOpacity", "secondaryOpacity", "edgeOpacity", "radius", "glowStrength", "glowSize"].includes(value)) {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (["mainTextLeft", "mainTextTop", "secondaryTextLeft", "secondaryTextTop"].includes(value)) {
    return roundField(Number(param || 0)) + "%";
  } else {
    return String(param ?? "");
  }
}
const airConditionerDefaultProperties = {
  mainTextVisible: true,
  secondaryTextVisible: true,
  iconVisible: true,
  frameVisible: true,
  glowVisible: true,
  mainColor: "#ffffff",
  secondaryColor: "#e9edf0",
  mainSize: 30,
  secondarySize: 10,
  mainWeight: 0.5,
  secondaryWeight: 0.4,
  mainSpacing: 4,
  secondarySpacing: 3,
  mainTextLeft: 29.9,
  mainTextTop: 53.83,
  secondaryTextLeft: 29.9,
  secondaryTextTop: 81.8,
  textIdleOpacity: 0.4,
  textActiveOpacity: 0.9,
  icon: "mdi:home-outline",
  iconColor: "#fcfcfc",
  iconSize: 54,
  iconLeft: 16.5,
  iconTop: 50,
  iconIdleOpacity: 0.9,
  iconActiveOpacity: 0.9,
  frameColor: "#d9e0e6",
  frameWidth: 1.5,
  frameIdleOpacity: 1,
  frameActiveOpacity: 1,
  radius: 0.5,
  frameAngle: 45,
  glowColor: "#f2f6fa",
  glowAngle: 90,
  glowIdleStrength: 1,
  glowIdleSize: 1.5,
  glowActiveStrength: 2.4,
  glowActiveSize: 2.2
};
const airConditionerPropertyMeta = {
  mainTextVisible: {
    group: "文字",
    label: "主文字显示"
  },
  secondaryTextVisible: {
    group: "文字",
    label: "副文字显示"
  },
  mainColor: {
    group: "文字",
    label: "主文字颜色"
  },
  secondaryColor: {
    group: "文字",
    label: "副文字颜色"
  },
  mainSize: {
    group: "文字",
    label: "主文字大小"
  },
  secondarySize: {
    group: "文字",
    label: "副文字大小"
  },
  mainWeight: {
    group: "文字",
    label: "主文字笔画粗细"
  },
  secondaryWeight: {
    group: "文字",
    label: "副文字笔画粗细"
  },
  mainSpacing: {
    group: "文字",
    label: "主文字字间距"
  },
  secondarySpacing: {
    group: "文字",
    label: "副文字字间距"
  },
  mainTextLeft: {
    group: "文字",
    label: "主文字左右位置"
  },
  mainTextTop: {
    group: "文字",
    label: "主文字上下位置"
  },
  secondaryTextLeft: {
    group: "文字",
    label: "副文字左右位置"
  },
  secondaryTextTop: {
    group: "文字",
    label: "副文字上下位置"
  },
  textIdleOpacity: {
    group: "文字",
    label: "文字选择前透明度"
  },
  textActiveOpacity: {
    group: "文字",
    label: "文字选择后透明度"
  },
  iconVisible: {
    group: "图标",
    label: "图标显示"
  },
  iconColor: {
    group: "图标",
    label: "图标颜色"
  },
  iconSize: {
    group: "图标",
    label: "图标大小"
  },
  iconLeft: {
    group: "图标",
    label: "图标左右位置"
  },
  iconTop: {
    group: "图标",
    label: "图标上下位置"
  },
  iconIdleOpacity: {
    group: "图标",
    label: "图标选择前透明度"
  },
  iconActiveOpacity: {
    group: "图标",
    label: "图标选择后透明度"
  },
  frameVisible: {
    group: "外框",
    label: "外框显示"
  },
  frameColor: {
    group: "外框",
    label: "外框颜色"
  },
  frameWidth: {
    group: "外框",
    label: "外框粗细"
  },
  frameIdleOpacity: {
    group: "外框",
    label: "外框选择前透明度"
  },
  frameActiveOpacity: {
    group: "外框",
    label: "外框选择后透明度"
  },
  radius: {
    group: "外框",
    label: "外框圆角"
  },
  frameAngle: {
    group: "外框",
    label: "外框渐变角度"
  },
  glowVisible: {
    group: "背景光晕",
    label: "背景光晕显示"
  },
  glowColor: {
    group: "背景光晕",
    label: "背景光晕颜色"
  },
  glowAngle: {
    group: "背景光晕",
    label: "背景光晕角度"
  },
  glowIdleStrength: {
    group: "背景光晕",
    label: "选择前光晕强度"
  },
  glowIdleSize: {
    group: "背景光晕",
    label: "选择前光晕大小"
  },
  glowActiveStrength: {
    group: "背景光晕",
    label: "选择后光晕强度"
  },
  glowActiveSize: {
    group: "背景光晕",
    label: "选择后光晕大小"
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度"
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度"
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放"
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转"
  }
};
function readAirConditionerProperty(component, value) {
  if (!component) {
    return;
  }
  if (value === "width" || value === "height") {
    return Number(component.position?.[value] || 100);
  }
  if (value === "scale") {
    return Number(component.style?.scale || 1);
  }
  if (value === "rotation") {
    return Number(component.position?.rotation || 0);
  }
  const flag = component.properties || {};
  const temp = airConditionerDefaultProperties[value];
  if (value === "textIdleOpacity") {
    return flag[value] ?? flag.idleOpacity ?? temp;
  } else if (value === "textActiveOpacity") {
    return flag[value] ?? flag.activeOpacity ?? temp;
  } else if (value === "iconIdleOpacity") {
    return flag[value] ?? flag.idleOpacity ?? temp;
  } else if (value === "iconActiveOpacity") {
    return flag[value] ?? flag.activeOpacity ?? temp;
  } else if (value === "mainTextLeft" || value === "secondaryTextLeft") {
    return flag[value] ?? flag.textLeft ?? temp;
  } else if (value === "mainTextTop") {
    return flag[value] ?? Number(flag.textTop ?? 81.5) - 1800 / 64.36;
  } else if (value === "secondaryTextTop") {
    return flag[value] ?? flag.textTop ?? temp;
  } else {
    return flag[value] ?? temp;
  }
}
function deepEqualJson(value, param) {
  return JSON.stringify(value) === JSON.stringify(param);
}
function buildIdMap2(value, param, param2, param3) {
  if (!value || !airConditionerPropertyMeta[param]) {
    return;
  }
  let temp = componentBoundsCache.get(value);
  if (!!temp || !deepEqualJson(param2, param3)) {
    if (!temp) {
      temp = new Map();
      componentBoundsCache.set(value, temp);
    }
    if (!temp.has(param)) {
      temp.set(param, cloneValue(param2));
    }
  }
}
function unusedAirConditionerPropertyKeys(value) {
  const keys = componentBoundsCache.get(value?.id);
  if (keys) {
    for (const temp of keys.keys()) {
      if (!airConditionerPropertyMeta[temp]) {
        keys.delete(temp);
      }
    }
    if (!keys.size) {
      componentBoundsCache.delete(value.id);
    }
  }
}
function collectList7(param) {
  unusedAirConditionerPropertyKeys(param);
  return [...(componentBoundsCache.get(param?.id)?.entries() || [])].filter(([param, param2]) => !deepEqualJson(readAirConditionerProperty(param, param), param2)).map(([param]) => param);
}
function formatAirConditionerPropertyValue(value, param, param2 = currentProject?.document) {
  if (typeof param == "boolean") {
    if (param) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(param2?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(param || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(param || 0)) + "°";
  } else if (["textIdleOpacity", "textActiveOpacity", "iconIdleOpacity", "iconActiveOpacity", "frameIdleOpacity", "frameActiveOpacity", "radius", "glowIdleStrength", "glowIdleSize", "glowActiveStrength", "glowActiveSize"].includes(value)) {
    return roundField(Number(param || 0) * 100) + "%";
  } else if (["mainTextLeft", "mainTextTop", "secondaryTextLeft", "secondaryTextTop", "iconLeft", "iconTop"].includes(value)) {
    return roundField(Number(param || 0)) + "%";
  } else if (value === "frameAngle" || value === "glowAngle") {
    return roundField(Number(param || 0)) + "°";
  } else {
    return String(param ?? "");
  }
}
function createNavigationTargetOption({
  value: navigationTargetId,
  label: param2,
  detail: param3,
  target: param = false
}) {
  const className10 = document.createElement("label");
  className10.className = "navigation-style-apply-option";
  const dataset30 = document.createElement("input");
  dataset30.type = "checkbox";
  dataset30.checked = true;
  if (param) {
    dataset30.dataset.navigationTargetId = navigationTargetId;
  } else {
    dataset30.dataset.navigationStyleProperty = navigationTargetId;
  }
  const textContent7 = document.createElement("span");
  textContent7.textContent = param2;
  if (param3) {
    const textContent6 = document.createElement("small");
    textContent6.textContent = param3;
    textContent7.append(textContent6);
  }
  className10.append(dataset30, textContent7);
  return className10;
}
function renderList4(param) {
  navigationStyleApplyTargets.classList.remove("grouped-by-page");
  navigationStyleApplyTargets.replaceChildren(...param);
}
function buildIdMap3(value, detail) {
  const index = new Map();
  value.forEach(({
    component: item,
    page
  }) => {
    const flag = page?.id || page?.path || page?.name || "unknown-page";
    if (!index.has(flag)) {
      index.set(flag, {
        page,
        components: []
      });
    }
    index.get(flag).components.push(item);
  });
  const list = [...index.values()].map(({
    page: item,
    components: param
  }) => {
    const temp = document.createElement("section");
    temp.className = "navigation-style-apply-page-group";
    const div2 = document.createElement("div");
    div2.className = "navigation-style-apply-page-heading";
    const element = document.createElement("strong");
    element.textContent = item?.name || "未命名页面";
    const textContent = element.textContent;
    const div3 = document.createElement("div");
    div3.className = "navigation-style-apply-page-controls";
    const span = document.createElement("span");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "navigation-style-apply-page-toggle";
    const div4 = document.createElement("div");
    div4.className = "navigation-style-apply-page-options";
    div4.replaceChildren(...param.map(component => createNavigationTargetOption({
      value: component.id,
      label: componentLabel(component),
      detail,
      target: true
    })));
    const elements = [...div4.querySelectorAll("[data-navigation-target-id]")];
    const callback = () => {
      const length = elements.filter(el3 => el3.checked).length;
      const flag = length === elements.length;
      span.textContent = length + "/" + elements.length + " 个控件";
      button.textContent = flag ? "取消全选" : "全选";
      button.setAttribute("aria-label", (flag ? "取消选择" : "全选") + "“" + textContent + "”中的控件");
    };
    button.addEventListener("click", () => {
      const flag = !elements.every(el3 => el3.checked);
      elements.forEach(el3 => {
        el3.checked = flag;
      });
      callback();
    });
    div4.addEventListener("change", callback);
    div3.append(span, button);
    div2.append(element, div3);
    temp.append(div2, div4);
    callback();
    return temp;
  });
  navigationStyleApplyTargets.classList.add("grouped-by-page");
  navigationStyleApplyTargets.replaceChildren(...list);
}
function withSelectedComponent4() {
  const value = selectedComponent();
  if (!value || value.type !== "navigation-button") {
    return;
  }
  const temp = collectList7(value);
  const filtered = collectComponentsByType(currentProject.document.sharedComponents, "navigation-button").filter(component => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    navigationStyleApplyTitle.textContent = "应用导航按钮设置";
    navigationStyleApplyTargetHeading.textContent = "应用到导航按钮";
    navigationStyleApplyTargetScope.textContent = "侧边栏通用";
    navigationStyleApplySummary.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的侧边栏导航按钮。图标名称、文字内容、目标页面、备注和位置不会改变。";
    navigationStyleApplyProperties.replaceChildren(...temp.map(component => {
      const temp2 = airConditionerPropertyMeta[component];
      const temp3 = readAirConditionerProperty(value, component);
      return createNavigationTargetOption({
        value: component,
        label: temp2.label,
        detail: temp2.group + " · " + formatAirConditionerPropertyValue(component, temp3)
      });
    }));
    renderList4(filtered.map(component => {
      const flag = component.properties?.targetPage || component.actions?.tap?.target || "";
      const found = currentProject.document.pages.find(item2 => item2.path === flag);
      return createNavigationTargetOption({
        value: component.id,
        label: componentLabel(component),
        detail: found ? "跳转到：" + found.name : "未设置目标页面",
        target: true
      });
    }));
    navigationStyleApplyMessage.hidden = true;
    navigationStyleApplyMessage.textContent = "";
    styleApplyPending = {
      sourceId: value.id,
      type: "navigation-button"
    };
    navigationStyleApplyDialog.showModal();
  }
}
function withSelectedComponent5() {
  const value = selectedComponent();
  if (!value || value.type !== "panel-frame") {
    return;
  }
  const temp = collectList6(value);
  const flag = findComponent(currentProject.document, value.id)?.scope === "page";
  const chosen = flag ? findComponentsByType("panel-frame").filter(({
    component
  }) => component.id !== value.id) : collectComponentsByType(currentProject.document.sharedComponents, "panel-frame").filter(component => component.id !== value.id).map(component => ({
    component
  }));
  if (!!temp.length && !!chosen.length) {
    navigationStyleApplyTitle.textContent = "应用底图框设置";
    navigationStyleApplyTargetHeading.textContent = flag ? "应用到主页面底图框" : "应用到侧边栏底图框";
    navigationStyleApplyTargetScope.textContent = flag ? "按页面区分" : "侧边栏通用";
    navigationStyleApplySummary.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的" + (flag ? "主页面" : "侧边栏") + "底图框。文字内容、备注和位置不会改变。";
    navigationStyleApplyProperties.replaceChildren(...temp.map(item => {
      const temp2 = navigationPropertyMeta[item];
      const temp3 = readVacuumMapProperty(value, item);
      return createNavigationTargetOption({
        value: item,
        label: temp2.label,
        detail: temp2.group + " · " + formatVacuumMapPropertyValue(item, temp3)
      });
    }));
    if (flag) {
      buildIdMap3(chosen, "主页面底图框");
    } else {
      renderList4(chosen.map(({
        component
      }) => createNavigationTargetOption({
        value: component.id,
        label: componentLabel(component),
        detail: "侧边栏共享控件",
        target: true
      })));
    }
    navigationStyleApplyMessage.hidden = true;
    navigationStyleApplyMessage.textContent = "";
    styleApplyPending = {
      sourceId: value.id,
      type: "panel-frame"
    };
    navigationStyleApplyDialog.showModal();
  }
}
function withSelectedComponent6() {
  const value = selectedComponent();
  if (!value || value.type !== "camera") {
    return;
  }
  const temp = collectList5(value);
  const filtered = findComponentsByType("camera").filter(({
    component
  }) => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    navigationStyleApplyTitle.textContent = "应用摄像头实时预览设置";
    navigationStyleApplyTargetHeading.textContent = "应用到主页面摄像头实时预览";
    navigationStyleApplyTargetScope.textContent = "按页面区分";
    navigationStyleApplySummary.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的主页面摄像头实时预览。实体、备注、动作和控件位置不会改变。";
    navigationStyleApplyProperties.replaceChildren(...temp.map(item => {
      const temp2 = cameraPropertyMeta[item];
      const temp3 = readCameraProperty(value, item);
      return createNavigationTargetOption({
        value: item,
        label: temp2.label,
        detail: temp2.group + " · " + formatCameraPropertyValue(item, temp3)
      });
    }));
    buildIdMap3(filtered, "摄像头实时预览");
    navigationStyleApplyMessage.hidden = true;
    navigationStyleApplyMessage.textContent = "";
    styleApplyPending = {
      sourceId: value.id,
      type: "camera"
    };
    navigationStyleApplyDialog.showModal();
  }
}
function withSelectedComponent7() {
  const value = selectedComponent();
  if (!value || value.type !== "title-button") {
    return;
  }
  const temp = collectList2(value);
  const filtered = findComponentsByType("title-button").filter(({
    component
  }) => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    navigationStyleApplyTitle.textContent = "应用标题按钮设置";
    navigationStyleApplyTargetHeading.textContent = "应用到主页面标题按钮";
    navigationStyleApplyTargetScope.textContent = "按页面区分";
    navigationStyleApplySummary.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的标题按钮。文字内容、图标名称、备注、动作和控件中心位置不会改变。";
    navigationStyleApplyProperties.replaceChildren(...temp.map(item => {
      const temp2 = panelFramePropertyMeta[item];
      const temp3 = readPanelFrameProperty(value, item);
      return createNavigationTargetOption({
        value: item,
        label: temp2.label,
        detail: temp2.group + " · " + formatPanelFramePropertyValue(item, temp3)
      });
    }));
    buildIdMap3(filtered, "标题按钮");
    navigationStyleApplyMessage.hidden = true;
    navigationStyleApplyMessage.textContent = "";
    styleApplyPending = {
      sourceId: value.id,
      type: "title-button"
    };
    navigationStyleApplyDialog.showModal();
  }
}
function ibeTemplateOptions4() {
  const value = selectedComponent();
  if (!value || value.type !== "icon-button-effect") {
    return;
  }
  const temp = ibeTemplateOptions3(value);
  const filtered = findComponentsByType("icon-button-effect").filter(({
    component
  }) => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    navigationStyleApplyTitle.textContent = "应用图标按钮（效果）设置";
    navigationStyleApplyTargetHeading.textContent = "应用到主页面同类型控件";
    navigationStyleApplyTargetScope.textContent = "按页面区分";
    navigationStyleApplySummary.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的主页面图标按钮（效果）。实体、备注、动作和按钮位置不会改变。";
    navigationStyleApplyProperties.replaceChildren(...temp.map(item => {
      const temp2 = ibePropertyMeta[item];
      const temp3 = readTitleButtonProperty(value, item);
      return createNavigationTargetOption({
        value: item,
        label: temp2.label,
        detail: temp2.group + " · " + formatTitleButtonPropertyValue(item, temp3)
      });
    }));
    buildIdMap3(filtered, "图标按钮（效果）");
    navigationStyleApplyMessage.hidden = true;
    navigationStyleApplyMessage.textContent = "";
    styleApplyPending = {
      sourceId: value.id,
      type: "icon-button-effect"
    };
    navigationStyleApplyDialog.showModal();
  }
}
function withSelectedComponent8() {
  const value = selectedComponent();
  if (!value || value.type !== "air-conditioner") {
    return;
  }
  const temp = collectList3(value);
  const filtered = findComponentsByType("air-conditioner").filter(({
    component
  }) => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    navigationStyleApplyTitle.textContent = "应用空调设置";
    navigationStyleApplyTargetHeading.textContent = "应用到主页面同类型控件";
    navigationStyleApplyTargetScope.textContent = "按页面区分";
    navigationStyleApplySummary.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的空调控件。实体、备注、文字内容、动作和按钮位置不会改变。";
    navigationStyleApplyProperties.replaceChildren(...temp.map(item => {
      const temp2 = titleButtonPropertyMeta[item];
      const temp3 = readIbeProperty(value, item);
      return createNavigationTargetOption({
        value: item,
        label: temp2.label,
        detail: temp2.group + " · " + formatIbePropertyValue(item, temp3)
      });
    }));
    buildIdMap3(filtered, "空调");
    navigationStyleApplyMessage.hidden = true;
    navigationStyleApplyMessage.textContent = "";
    styleApplyPending = {
      sourceId: value.id,
      type: "air-conditioner"
    };
    navigationStyleApplyDialog.showModal();
  }
}
function syncIconButtonIcon6() {
  const value = selectedComponent();
  if (!value || !["icon-button", "device-button", "presence-sensor"].includes(value.type)) {
    return;
  }
  const chosen = value.type === "presence-sensor" ? presenceSensorKindLabel2(value) : value.type === "device-button" ? "设备按钮" : "图标按钮";
  const temp = syncIconButtonIcon5(value);
  const temp2 = presenceSensorKind2(value);
  const filtered = findComponentsByType(value.type).filter(({
    component
  }) => component.id !== value.id && (value.type !== "presence-sensor" || presenceSensorKind2(component) === temp2));
  if (!!temp.length && !!filtered.length) {
    navigationStyleApplyTitle.textContent = "应用" + chosen + "设置";
    navigationStyleApplyTargetHeading.textContent = "应用到主页面同类型控件";
    navigationStyleApplyTargetScope.textContent = "按页面区分";
    navigationStyleApplySummary.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的主页面" + chosen + "。实体、备注、图标名称、文字内容和位置不会改变。";
    navigationStyleApplyProperties.replaceChildren(...temp.map(item => {
      const temp3 = presenceOrDevicePropertyMeta(value, item);
      const temp4 = readPresenceProperty(value, item);
      return createNavigationTargetOption({
        value: item,
        label: temp3.label,
        detail: temp3.group + " · " + formatPresencePropertyValue(item, temp4)
      });
    }));
    buildIdMap3(filtered, chosen);
    navigationStyleApplyMessage.hidden = true;
    navigationStyleApplyMessage.textContent = "";
    styleApplyPending = {
      sourceId: value.id,
      type: value.type
    };
    navigationStyleApplyDialog.showModal();
  }
}
function withSelectedComponent9() {
  const value = selectedComponent();
  if (!value || value.type !== "line-chart") {
    return;
  }
  const temp = collectList(value);
  const filtered = collectComponentsByType(currentProject.document.sharedComponents, "line-chart").filter(component => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    navigationStyleApplyTitle.textContent = "应用折线图设置";
    navigationStyleApplyTargetHeading.textContent = "应用到折线图";
    navigationStyleApplyTargetScope.textContent = "侧边栏通用";
    navigationStyleApplySummary.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的侧边栏折线图。数值实体、备注、动作和位置不会改变。";
    navigationStyleApplyProperties.replaceChildren(...temp.map(item => {
      const temp2 = lineChartPropertyMeta[item];
      const temp3 = readNavigationProperty(value, item);
      return createNavigationTargetOption({
        value: item,
        label: temp2.label,
        detail: temp2.group + " · " + formatNavigationPropertyValue(item, temp3)
      });
    }));
    renderList4(filtered.map(component => createNavigationTargetOption({
      value: component.id,
      label: componentLabel(component),
      detail: component.bindings?.entity?.entityId || "未设置数值实体",
      target: true
    })));
    navigationStyleApplyMessage.hidden = true;
    navigationStyleApplyMessage.textContent = "";
    styleApplyPending = {
      sourceId: value.id,
      type: "line-chart"
    };
    navigationStyleApplyDialog.showModal();
  }
}
function scaleAirConditionerProperty(value, component, param) {
  const temp = cloneValue(readAirConditionerProperty(value, param));
  if (param === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (param === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (param === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (param === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [param]: temp
  };
}
function scaleVacuumMapProperty(value, component, param) {
  const temp = cloneValue(readVacuumMapProperty(value, param));
  if (param === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (param === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (param === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (param === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [param]: temp
  };
}
function scaleCameraProperty(value, component, param) {
  const temp = cloneValue(readCameraProperty(value, param));
  if (param === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (param === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (param === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (param === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [param]: temp
  };
}
function scaleNavigationProperty(value, component, param) {
  const temp = cloneValue(readNavigationProperty(value, param));
  if (param === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (param === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (param === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (param === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [param]: temp
  };
}
function scaleTitleButtonProperty(value, component, param) {
  const temp = cloneValue(readTitleButtonProperty(value, param));
  if (param === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (param === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (param === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (param === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [param]: temp
  };
}
function scalePanelFrameProperty(value, component, param) {
  const temp = cloneValue(readPanelFrameProperty(value, param));
  if (param === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (param === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (param === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (param === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [param]: temp
  };
}
function scalePresenceProperty(value, component, param) {
  const temp = cloneValue(readPresenceProperty(value, param));
  if (param === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (param === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (param === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (param === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [param]: temp
  };
}
function scaleIbeProperty(value, component, param) {
  const temp = cloneValue(readIbeProperty(value, param));
  if (param === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (param === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (param === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (param === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [param]: temp
  };
}
navigationApplyStyle.addEventListener("click", withSelectedComponent4);
panelFrameApplyStyle.addEventListener("click", withSelectedComponent5);
cameraApplyStyle.addEventListener("click", withSelectedComponent6);
titleButtonApplyStyle.addEventListener("click", withSelectedComponent7);
lineChartApplyStyle.addEventListener("click", withSelectedComponent9);
ibeApplyStyle.addEventListener("click", ibeTemplateOptions4);
iconButtonApplyStyle.addEventListener("click", syncIconButtonIcon6);
airConditionerApplyStyle.addEventListener("click", withSelectedComponent8);
navigationStyleApplyCloseBtn.addEventListener("click", () => navigationStyleApplyDialog.close());
navigationStyleApplyCancelBtn.addEventListener("click", () => navigationStyleApplyDialog.close());
navigationStyleApplyDialog.addEventListener("click", target32 => {
  if (target32.target === navigationStyleApplyDialog) {
    navigationStyleApplyDialog.close();
  }
});
navigationStyleApplyDialog.addEventListener("close", () => {
  styleApplyPending = null;
});
navigationStyleApplyConfirmBtn.addEventListener("click", () => {
  const temp = styleApplyPending?.sourceId;
  const temp2 = styleApplyPending?.type;
  const length9 = [...navigationStyleApplyProperties.querySelectorAll("[data-navigation-style-property]:checked")].map(dataset2 => dataset2.dataset.navigationStyleProperty);
  const length10 = [...navigationStyleApplyTargets.querySelectorAll("[data-navigation-target-id]:checked")].map(dataset3 => dataset3.dataset.navigationTargetId);
  if (!temp || !length9.length || !length10.length) {
    const chosen = temp2 === "panel-frame" ? "底图框" : temp2 === "camera" ? "摄像头实时预览" : temp2 === "title-button" ? "标题按钮" : temp2 === "air-conditioner" ? "空调" : temp2 === "line-chart" ? "折线图" : temp2 === "icon-button-effect" ? "图标按钮（效果）" : temp2 === "icon-button" ? "图标按钮" : temp2 === "device-button" ? "设备按钮" : temp2 === "presence-sensor" ? "传感器" : "导航按钮";
    navigationStyleApplyMessage.textContent = "请至少选择一项修改和一个目标" + chosen + "。";
    navigationStyleApplyMessage.hidden = false;
    return;
  }
  navigationStyleApplyDialog.close();
  mutateDocument(param => {
    const temp3 = findComponent(param, temp)?.component;
    if (!!temp3 && temp3.type === temp2) {
      for (const temp3 of length10) {
        const temp4 = findComponent(param, temp3)?.component;
        if (!!temp4 && temp4.type === temp2 && (temp2 !== "presence-sensor" || presenceSensorKind2(temp4) === presenceSensorKind2(temp3))) {
          for (const temp4 of length9) {
            if (temp2 === "panel-frame") {
              scaleVacuumMapProperty(temp3, temp4, temp4);
            } else if (temp2 === "camera") {
              scaleCameraProperty(temp3, temp4, temp4);
            } else if (temp2 === "title-button") {
              scalePanelFrameProperty(temp3, temp4, temp4);
            } else if (temp2 === "line-chart") {
              scaleNavigationProperty(temp3, temp4, temp4);
            } else if (temp2 === "icon-button-effect") {
              scaleTitleButtonProperty(temp3, temp4, temp4);
            } else if (temp2 === "air-conditioner") {
              scaleIbeProperty(temp3, temp4, temp4);
            } else if (["icon-button", "device-button", "presence-sensor"].includes(temp2)) {
              scalePresenceProperty(temp3, temp4, temp4);
            } else {
              scaleAirConditionerProperty(temp3, temp4, temp4);
            }
          }
        }
      }
    }
  }).then(() => {
    const classList = temp2 === "panel-frame" ? panelFrameApplyStyle : temp2 === "camera" ? cameraApplyStyle : temp2 === "title-button" ? titleButtonApplyStyle : temp2 === "air-conditioner" ? airConditionerApplyStyle : temp2 === "line-chart" ? lineChartApplyStyle : temp2 === "icon-button-effect" ? ibeApplyStyle : ["icon-button", "device-button", "presence-sensor"].includes(temp2) ? iconButtonApplyStyle : navigationApplyStyle;
    if (temp2 === "panel-frame") {
      window.clearTimeout(panelFrameStyleApplyResetTimer);
    } else if (temp2 === "camera") {
      window.clearTimeout(cameraStyleApplyResetTimer);
    } else if (temp2 === "title-button") {
      window.clearTimeout(titleButtonStyleApplyResetTimer);
    } else if (temp2 === "air-conditioner") {
      window.clearTimeout(airConditionerStyleApplyResetTimer);
    } else if (temp2 === "line-chart") {
      window.clearTimeout(lineChartStyleApplyResetTimer);
    } else if (temp2 === "icon-button-effect") {
      window.clearTimeout(ibeStyleApplyResetTimer);
    } else if (["icon-button", "device-button", "presence-sensor"].includes(temp2)) {
      window.clearTimeout(iconButtonStyleApplyResetTimer);
    } else {
      window.clearTimeout(defaultStyleApplyResetTimer);
    }
    classList.classList.add("applied");
    const timerId = window.setTimeout(() => {
      classList.classList.remove("applied");
      if (componentId === temp) {
        refreshInspector();
      }
    }, 1800);
    if (temp2 === "panel-frame") {
      panelFrameStyleApplyResetTimer = timerId;
    } else if (temp2 === "camera") {
      cameraStyleApplyResetTimer = timerId;
    } else if (temp2 === "title-button") {
      titleButtonStyleApplyResetTimer = timerId;
    } else if (temp2 === "air-conditioner") {
      airConditionerStyleApplyResetTimer = timerId;
    } else if (temp2 === "line-chart") {
      lineChartStyleApplyResetTimer = timerId;
    } else if (temp2 === "icon-button-effect") {
      ibeStyleApplyResetTimer = timerId;
    } else if (["icon-button", "device-button", "presence-sensor"].includes(temp2)) {
      iconButtonStyleApplyResetTimer = timerId;
    } else {
      defaultStyleApplyResetTimer = timerId;
    }
  });
});
navigationIconButton.addEventListener("click", () => {
  const ancestorEl = navigationIconMenu.hidden;
  closeOtherPickerPanels(ancestorEl ? "navigation-icon" : null);
  navigationIconMenu.hidden = !ancestorEl;
  navigationIconButton.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    loadIconPickerOptions2(navigationIconSearch.value).then(() => {
      positionNavigationIconMenu();
      navigationIconSearch.focus({
        preventScroll: true
      });
    }).catch(onError);
  }
});
navigationIconCopyBtn.addEventListener("click", async () => {
  const hidden = selectedComponent()?.properties?.icon || "";
  if (hidden) {
    try {
      await copyTextToClipboard(hidden);
      window.clearTimeout(navigationIconCopyResetTimer);
      navigationIconCopyBtn.classList.add("copied");
      navigationIconCopyResetTimer = window.setTimeout(() => navigationIconCopyBtn.classList.remove("copied"), 1200);
    } catch (temp) {
      onError(temp);
    }
  }
});
navigationIconSearch.addEventListener("input", () => {
  window.clearTimeout(navigationIconSearchTimer);
  navigationIconSearchTimer = window.setTimeout(() => {
    loadIconPickerOptions2(navigationIconSearch.value).catch(onError);
  }, 160);
});
navigationIconOptions.addEventListener("click", target33 => {
  const dataset19 = target33.target.closest("[data-icon-name]");
  const alias = componentId;
  if (!dataset19 || !alias) {
    return;
  }
  const icon = dataset19.dataset.iconName;
  closeOtherPickerPanels();
  mutateDocument(param => {
    const properties41 = findComponent(param, alias)?.component;
    if (!properties41 || properties41.type !== "navigation-button") {
      return;
    }
    const temp = readAirConditionerProperty(properties41, "icon");
    const temp2 = readAirConditionerProperty(properties41, "iconVisible");
    properties41.properties = {
      ...(properties41.properties || {}),
      icon,
      iconVisible: !!icon
    };
    buildIdMap2(alias, "icon", temp, readAirConditionerProperty(properties41, "icon"));
    buildIdMap2(alias, "iconVisible", temp2, readAirConditionerProperty(properties41, "iconVisible"));
  });
});
ibeIconButton.addEventListener("click", () => {
  const ancestorEl = ibeIconMenu.hidden;
  closeOtherPickerPanels(ancestorEl ? "ibe-icon" : null);
  ibeIconMenu.hidden = !ancestorEl;
  ibeIconButton.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    loadIconPickerOptions3(ibeIconSearch.value).then(() => {
      positionIbeIconMenu();
      ibeIconSearch.focus({
        preventScroll: true
      });
    }).catch(onError);
  }
});
ibeIconCopyBtn.addEventListener("click", async () => {
  const hidden = selectedComponent()?.properties?.icon || "";
  if (hidden) {
    try {
      await copyTextToClipboard(hidden);
      window.clearTimeout(ibeIconCopyResetTimer);
      ibeIconCopyBtn.classList.add("copied");
      ibeIconCopyResetTimer = window.setTimeout(() => ibeIconCopyBtn.classList.remove("copied"), 1200);
    } catch (temp) {
      onError(temp);
    }
  }
});
ibeIconSearch.addEventListener("input", () => {
  window.clearTimeout(ibeIconSearchTimer);
  ibeIconSearchTimer = window.setTimeout(() => loadIconPickerOptions3(ibeIconSearch.value).catch(onError), 160);
});
ibeIconOptions.addEventListener("click", target34 => {
  const dataset20 = target34.target.closest("[data-icon-name]");
  const alias = componentId;
  if (!dataset20 || !alias) {
    return;
  }
  const icon2 = dataset20.dataset.iconName;
  closeOtherPickerPanels();
  mutateDocument(param => {
    const properties42 = findComponent(param, alias)?.component;
    if (!!properties42 && properties42.type === "icon-button-effect") {
      properties42.properties = {
        ...(properties42.properties || {}),
        icon: icon2
      };
    }
  });
});
iconButtonIconButton.addEventListener("click", () => {
  const ancestorEl = iconButtonIconMenu.hidden;
  closeOtherPickerPanels(ancestorEl ? "icon-button-icon" : null);
  iconButtonIconMenu.hidden = !ancestorEl;
  iconButtonIconButton.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    loadIconPickerOptions4(iconButtonIconSearch.value).then(() => {
      syncIconButtonIcon2();
      iconButtonIconSearch.focus({
        preventScroll: true
      });
    }).catch(onError);
  }
});
iconButtonIconCopyBtn.addEventListener("click", async () => {
  const hidden = selectedComponent()?.properties?.icon || "";
  if (hidden) {
    try {
      await copyTextToClipboard(hidden);
      window.clearTimeout(iconButtonIconCopyResetTimer);
      iconButtonIconCopyBtn.classList.add("copied");
      iconButtonIconCopyResetTimer = window.setTimeout(() => iconButtonIconCopyBtn.classList.remove("copied"), 1200);
    } catch (temp) {
      onError(temp);
    }
  }
});
iconButtonIconSearch.addEventListener("input", () => {
  window.clearTimeout(iconButtonIconSearchTimer);
  iconButtonIconSearchTimer = window.setTimeout(() => loadIconPickerOptions4(iconButtonIconSearch.value).catch(onError), 160);
});
iconButtonIconOptions.addEventListener("click", target35 => {
  const dataset21 = target35.target.closest("[data-icon-name]");
  const alias = componentId;
  if (!dataset21 || !alias) {
    return;
  }
  const icon3 = dataset21.dataset.iconName;
  closeOtherPickerPanels();
  mutateDocument(param => {
    const properties43 = findComponent(param, alias)?.component;
    if (!!properties43 && !!["icon-button", "device-button", "presence-sensor"].includes(properties43.type)) {
      properties43.properties = {
        ...(properties43.properties || {}),
        icon: icon3
      };
    }
  });
});
titleButtonIconButton.addEventListener("click", value => {
  value.preventDefault();
  value.stopPropagation();
  const ancestorEl = titleButtonIconMenu.hidden;
  closeOtherPickerPanels(ancestorEl ? "title-button-icon" : null);
  if (ancestorEl && titleButtonIconMenu.parentElement !== document.body) {
    document.body.append(titleButtonIconMenu);
  }
  titleButtonIconMenu.hidden = !ancestorEl;
  titleButtonIconMenu.style.position = "fixed";
  titleButtonIconMenu.style.zIndex = "760";
  titleButtonIconButton.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    syncTitleButtonIcon2();
    loadIconPickerOptions5(titleButtonIconSearch.value).then(() => {
      syncTitleButtonIcon2();
      titleButtonIconSearch.focus({
        preventScroll: true
      });
    }).catch(onError);
  }
});
titleButtonIconCopyBtn.addEventListener("click", async () => {
  const hidden = selectedComponent()?.properties?.icon || "";
  if (hidden) {
    try {
      await copyTextToClipboard(hidden);
      window.clearTimeout(titleButtonIconCopyResetTimer);
      titleButtonIconCopyBtn.classList.add("copied");
      titleButtonIconCopyResetTimer = window.setTimeout(() => titleButtonIconCopyBtn.classList.remove("copied"), 1200);
    } catch (temp) {
      onError(temp);
    }
  }
});
titleButtonIconSearch.addEventListener("input", () => {
  window.clearTimeout(titleButtonIconSearchTimer);
  titleButtonIconSearchTimer = window.setTimeout(() => loadIconPickerOptions5(titleButtonIconSearch.value).catch(onError), 160);
});
titleButtonIconOptions.addEventListener("click", target36 => {
  const dataset22 = target36.target.closest("[data-icon-name]");
  const alias = componentId;
  if (!dataset22 || !alias) {
    return;
  }
  const icon4 = dataset22.dataset.iconName;
  closeOtherPickerPanels();
  mutateDocument(param => {
    const properties44 = findComponent(param, alias)?.component;
    if (!!properties44 && properties44.type === "title-button") {
      properties44.properties = {
        ...(properties44.properties || {}),
        icon: icon4,
        iconVisible: !!icon4
      };
    }
  });
});
lightStatisticsIconButton.addEventListener("click", value => {
  value.preventDefault();
  value.stopPropagation();
  const ancestorEl = lightStatisticsIconMenu.hidden;
  closeOtherPickerPanels(ancestorEl ? "light-statistics-icon" : null);
  if (ancestorEl && lightStatisticsIconMenu.parentElement !== document.body) {
    document.body.append(lightStatisticsIconMenu);
  }
  lightStatisticsIconMenu.hidden = !ancestorEl;
  lightStatisticsIconMenu.style.position = "fixed";
  lightStatisticsIconMenu.style.zIndex = "760";
  lightStatisticsIconButton.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    syncLightStatisticsIcon2();
    loadIconPickerOptions6(lightStatisticsIconSearch.value).then(() => {
      syncLightStatisticsIcon2();
      lightStatisticsIconSearch.focus({
        preventScroll: true
      });
    }).catch(onError);
  }
});
lightStatisticsIconCopyBtn.addEventListener("click", async () => {
  const hidden = selectedComponent()?.properties?.icon || "";
  if (hidden) {
    try {
      await copyTextToClipboard(hidden);
      window.clearTimeout(lightStatisticsIconCopyResetTimer);
      lightStatisticsIconCopyBtn.classList.add("copied");
      lightStatisticsIconCopyResetTimer = window.setTimeout(() => lightStatisticsIconCopyBtn.classList.remove("copied"), 1200);
    } catch (temp) {
      onError(temp);
    }
  }
});
lightStatisticsIconSearch.addEventListener("input", () => {
  window.clearTimeout(lightStatisticsIconSearchTimer);
  lightStatisticsIconSearchTimer = window.setTimeout(() => loadIconPickerOptions6(lightStatisticsIconSearch.value).catch(onError), 160);
});
lightStatisticsIconOptions.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-light-statistics-icon-name]");
  const alias = componentId;
  if (!ancestorEl || !alias) {
    return;
  }
  const icon5 = ancestorEl.dataset.lightStatisticsIconName;
  closeOtherPickerPanels();
  mutateDocument(param => {
    const properties45 = findComponent(param, alias)?.component;
    if (!!properties45 && properties45.type === "light-statistics") {
      properties45.properties = {
        ...(properties45.properties || {}),
        icon: icon5
      };
    }
  });
});
lightStatisticsEntityButton.addEventListener("click", preventDefault7 => {
  preventDefault7.preventDefault();
  preventDefault7.stopPropagation();
  const hidden = lightStatisticsEntityMenu.hidden;
  closeOtherPickerPanels(hidden ? "light-statistics-entity" : null);
  if (hidden && lightStatisticsEntityMenu.parentElement !== document.body) {
    document.body.append(lightStatisticsEntityMenu);
  }
  lightStatisticsEntityMenu.hidden = !hidden;
  lightStatisticsEntityMenu.style.position = "fixed";
  lightStatisticsEntityMenu.style.zIndex = "760";
  lightStatisticsEntityButton.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    filterLightStatisticsEntities(lightStatisticsEntitySearch.value);
    positionLightStatisticsEntityMenu();
    window.requestAnimationFrame(() => {
      positionLightStatisticsEntityMenu();
      lightStatisticsEntitySearch.focus({
        preventScroll: true
      });
    });
  }
});
lightStatisticsEntitySearch.addEventListener("input", () => filterLightStatisticsEntities(lightStatisticsEntitySearch.value));
lightStatisticsEntityOptions.addEventListener("click", target37 => {
  const hidden = target37.target.closest("[data-light-statistics-entity-id]");
  if (hidden) {
    closePickerPanel(lightStatisticsEntityMenu, lightStatisticsEntityButton);
    highlightLightStatisticsEntityOption(hidden.dataset.lightStatisticsEntityId);
  }
});
lightStatisticsEntityConfirmBtn.addEventListener("click", () => confirmLightStatisticsEntityPick());
lightStatisticsEntityList.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-light-statistics-replace-index]");
  const temp = value.target.closest("[data-light-statistics-remove-index]");
  if (temp) {
    removeLightStatisticsEntityAt(Number(temp.dataset.lightStatisticsRemoveIndex));
    return;
  }
  if (ancestorEl) {
    lightStatisticsSelectedEntityId = "";
    lightStatisticsReplaceIndex = Number(ancestorEl.dataset.lightStatisticsReplaceIndex);
    lightStatisticsEditingComponentId = componentId || "";
    lightStatisticsEntityPending.hidden = true;
    setLightStatisticsEntityMessage("请选择新的实体。");
    setPickerButtonLabel(lightStatisticsEntityButton, "选择替换实体");
    lightStatisticsEntityButton.click();
  }
});
imageEntityButton.addEventListener("click", () => {
  const hidden = imageEntityMenu.hidden;
  closeOtherPickerPanels(hidden ? "entity" : null);
  imageEntityMenu.hidden = !hidden;
  imageEntityButton.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    renderEntityPickerOptions(imageEntitySearch.value);
    positionImageEntityPickerMenu();
    window.requestAnimationFrame(() => {
      positionImageEntityPickerMenu();
      imageEntitySearch.focus({
        preventScroll: true
      });
    });
  }
});
imageEntitySearch.addEventListener("input", () => renderEntityPickerOptions(imageEntitySearch.value));
imageEntityOptions.addEventListener("click", target38 => {
  const dataset23 = target38.target.closest("[data-entity-id]");
  if (!dataset23 || !componentId) {
    return;
  }
  const alias = componentId;
  const entityId5 = dataset23.dataset.entityId;
  closeOtherPickerPanels();
  mutateDocument(param => {
    const bindings = findComponent(param, alias)?.component;
    if (!bindings || bindings.type !== "image") {
      return;
    }
    const text = String(bindings.bindings?.entity?.entityId || "");
    bindings.bindings = {
      ...(bindings.bindings || {})
    };
    bindings.properties = {
      ...(bindings.properties || {}),
      fit: "contain"
    };
    if (entityId5) {
      bindings.bindings.entity = {
        entityId: entityId5
      };
    } else {
      delete bindings.bindings.entity;
      for (const temp of ["tap", "doubleTap", "hold"]) {
        if (actionNeedsCurrentEntity(bindings.actions?.[temp])) {
          delete bindings.actions[temp];
        }
      }
    }
    if (entityId5 !== text) {
      if (entityId5 ? relatedPopupContext(bindings, entityCatalogById(), deviceCatalogById()) : null) {
        bindings.properties.relatedEntities = manualRelatedEntityConfig([]);
      } else {
        delete bindings.properties.relatedEntities;
      }
    }
  });
});
function withSelectedComponent10(value, param = [value]) {
  const temp = entityPickerConfig(value);
  temp.button.addEventListener("click", () => {
    const chosen = param.includes(selectedComponent()?.type) ? selectedComponent().type : value;
    const temp2 = entityPickerConfig(chosen);
    const hidden = temp.menu.hidden;
    closeOtherPickerPanels(hidden ? temp2.except : null);
    temp.menu.hidden = !hidden;
    temp.button.setAttribute("aria-expanded", String(hidden));
    if (hidden) {
      renderEntityPickerOptions(temp.search.value, chosen);
      positionEntityPickerMenu(chosen);
      window.requestAnimationFrame(() => {
        positionEntityPickerMenu(chosen);
        temp.search.focus({
          preventScroll: true
        });
      });
    }
  });
  temp.search.addEventListener("input", () => {
    const chosen = param.includes(selectedComponent()?.type) ? selectedComponent().type : value;
    renderEntityPickerOptions(temp.search.value, chosen);
  });
  temp.options.addEventListener("click", event2 => {
    const ancestorEl = event2.target.closest("[data-entity-id]");
    const alias = componentId;
    if (!ancestorEl || !alias) {
      return;
    }
    const entityId = ancestorEl.dataset.entityId;
    closeOtherPickerPanels();
    mutateDocument(doc => {
      const component = findComponent(doc, alias)?.component;
      if (!component || !param.includes(component.type)) {
        return;
      }
      const text = String(component.bindings?.entity?.entityId || "");
      component.bindings = {
        ...(component.bindings || {})
      };
      component.actions = {
        ...(component.actions || {})
      };
      if (entityId) {
        component.bindings.entity = {
          entityId
        };
        if (component.type === "light-statistics") {
          for (const temp3 of ["tap", "doubleTap", "hold"]) {
            const temp4 = component.actions?.[temp3];
            if (temp4?.type === "toggle" && !entityIdSupportsToggle(entityId) || temp4 && !ACTION_TYPES.includes(temp4.type)) {
              delete component.actions[temp3];
            }
          }
        }
        if (component.type === "air-conditioner" && !Object.keys(component.actions || {}).length) {
          component.actions = {
            tap: {
              type: "more-info"
            },
            doubleTap: {
              type: "toggle"
            }
          };
        }
      } else {
        delete component.bindings.entity;
        if (component.type === "light-statistics") {
          component.actions = Object.fromEntries(Object.entries(component.actions || {}).filter(([, item]) => !actionNeedsCurrentEntity(item)));
        }
        let flag2 = false;
        for (const temp4 of ["tap", "doubleTap", "hold"]) {
          if (actionNeedsCurrentEntity(component.actions?.[temp4])) {
            delete component.actions[temp4];
            flag2 = true;
          }
        }
        if (component.type === "navigation-button" && flag2 && !component.actions.tap) {
          const target = new Set(doc.pages.map(item2 => item2.path)).has(component.properties?.targetPage) ? component.properties.targetPage : pageSelect.value || doc.pages[0]?.path || "";
          if (target) {
            component.actions.tap = {
              type: "navigate",
              target
            };
          }
        }
      }
      if (value === "weather") {
        const entityId2 = entityCatalog.find(item => item.entityId === "sun.sun")?.entityId;
        if (entityId2) {
          component.bindings.sun = {
            entityId: entityId2
          };
        } else {
          delete component.bindings.sun;
        }
      }
      if (entityId !== text) {
        component.properties = {
          ...(component.properties || {})
        };
        if (component.type === "light-statistics") {
          delete component.properties.relatedEntities;
          return;
        }
        if (entityId ? relatedPopupContext(component, entityCatalogById(), deviceCatalogById()) : null) {
          component.properties.relatedEntities = manualRelatedEntityConfig([]);
        } else {
          delete component.properties.relatedEntities;
        }
      }
    });
  });
}
withSelectedComponent10("weather");
withSelectedComponent10("line-chart");
withSelectedComponent10("title-button");
withSelectedComponent10("light-statistics");
withSelectedComponent10("icon-button-effect");
withSelectedComponent10("icon-button", ["icon-button", "device-button", "presence-sensor"]);
withSelectedComponent10("vacuum-map");
withSelectedComponent10("camera");
withSelectedComponent10("air-conditioner");
withSelectedComponent10("navigation-button");
const entityPickerHintText = "推荐去 HA 复制实体 ID，粘贴搜索。可精准选择。";
let interaction3dEditorPickers = null;
const {
  deferUntilEntitiesLoaded: editorPickerLifecycle
} = createEditorPickerLifecycle({
  getEntitiesLoaded: () => entitiesLoaded,
  getEntityLoadPromise: () => entityLoadPromise,
  loadEntities: ensureEntitiesLoaded,
  reportError: onError
});
function closeInteraction3dPickers() {
  interaction3dEditorPickers?.close();
}
function openEditorPicker({
  kind,
  title: param14,
  subtitle: param15 = "",
  searchPlaceholder: placeholder,
  triggerButton: setAttribute,
  pageSize,
  initialPage: param = 1,
  selectedText = "",
  emptyText: param16,
  itemClass: param2 = "",
  getPage: param3,
  renderItem: param4,
  renderLeadingItems: param5 = null,
  renderTrailingItems: param6 = null,
  buildToolbar: param7 = null,
  onSelect: param8,
  onDelete: param9 = null,
  onItemHover: param10 = null,
  closeLegacyPickers: param11 = true,
  renderSelectedActions: param12 = null,
  renderSelectedContent: param13 = null
}) {
  closeInteraction3dPickers();
  if (param11) {
    closeOtherPickerPanels();
  }
  const component = document.createElement("dialog");
  component.className = "editor-paged-picker-dialog";
  component.dataset.editorPickerKind = kind;
  const value = document.createElement("div");
  value.className = "editor-paged-picker-card" + (param7 ? " with-toolbar" : "");
  const temp = document.createElement("div");
  temp.className = "editor-paged-picker-heading";
  const append = document.createElement("div");
  append.className = param15 ? "editor-paged-picker-heading-copy has-subtitle" : "editor-paged-picker-heading-copy";
  const textContent8 = document.createElement("strong");
  textContent8.textContent = param14;
  const textContent9 = document.createElement("span");
  textContent9.textContent = param15;
  append.append(textContent8);
  if (param15) {
    append.append(textContent9);
  }
  const button = document.createElement("button");
  button.type = "button";
  button.className = "editor-paged-picker-close";
  button.setAttribute("aria-label", "关闭");
  button.textContent = "×";
  temp.append(append, button);
  const hidden3 = document.createElement("div");
  hidden3.className = "editor-paged-picker-toolbar";
  hidden3.hidden = !param7;
  const className11 = document.createElement("label");
  className11.className = "editor-paged-picker-search";
  const el4 = document.createElement("input");
  el4.type = "search";
  el4.placeholder = placeholder;
  el4.autocomplete = "off";
  className11.append(el4);
  const append2 = document.createElement("div");
  append2.className = "editor-paged-picker-selected";
  const selectedValueText = selectedText || (kind === "entity" ? "不使用实体" : "");
  append2.hidden = !selectedValueText;
  if (selectedValueText) {
    const className5 = document.createElement("span");
    className5.className = "editor-paged-picker-current-label";
    className5.textContent = "当前选择";
    append2.append(className5);
    if (param13) {
      append2.append(...(param13({
        selectedText,
        selectedValueText
      }) || []));
    } else {
      const textContent5 = document.createElement("strong");
      textContent5.textContent = selectedValueText;
      textContent5.title = selectedValueText;
      append2.append(textContent5);
    }
  }
  if (param12) {
    const length6 = param12({
      controller: null
    });
    if (length6?.length) {
      append2.classList.add("has-actions");
      append2.hidden = false;
      append2.append(...length6);
    }
  }
  const addEventListener = document.createElement("div");
  addEventListener.className = ("editor-paged-picker-items " + param2).trim();
  addEventListener.setAttribute("role", "listbox");
  const className12 = document.createElement("div");
  className12.className = "editor-paged-picker-footer";
  const textContent10 = document.createElement("span");
  textContent10.className = "editor-paged-picker-status";
  const className13 = document.createElement("div");
  className13.className = "editor-paged-picker-pagination";
  const disabled7 = document.createElement("button");
  disabled7.type = "button";
  disabled7.textContent = "上一页";
  const el3 = document.createElement("input");
  el3.type = "text";
  el3.inputMode = "numeric";
  el3.setAttribute("aria-label", "页码");
  const textContent11 = document.createElement("span");
  const disabled8 = document.createElement("button");
  disabled8.type = "button";
  disabled8.textContent = "下一页";
  className13.append(disabled7, el3, textContent11, disabled8);
  className12.append(textContent10, className13);
  value.append(temp, hidden3, className11, append2, addEventListener, className12);
  component.append(value);
  document.body.append(component);
  let timerId = null;
  let number = 0;
  let flag = false;
  const page4 = {
    page: Math.max(1, Number(param) || 1),
    total: 0,
    pageCount: 1,
    query: ""
  };
  const close = {
    kind,
    dialog: component,
    triggerButton: setAttribute,
    state: page4,
    refresh({
      resetPage: param14 = false
    } = {}) {
      if (param14) {
        page4.page = 1;
      }
      return loadPickerPage();
    },
    rebuildToolbar() {
      if (!!param7 && !flag) {
        hidden3.replaceChildren();
        param7({
          toolbar: hidden3,
          controller: close
        });
        hidden3.hidden = !hidden3.childElementCount;
      }
    },
    close() {
      if (!flag) {
        if (component.open) {
          component.close();
        } else {
          teardownPickerPanel();
        }
      }
    }
  };
  function teardownPickerPanel() {
    if (!flag) {
      flag = true;
      window.clearTimeout(timerId);
      number += 1;
      setAttribute?.setAttribute("aria-expanded", "false");
      addEventListener.replaceChildren();
      hidden3.replaceChildren();
      if (component.contains(imageAssetLargePreview)) {
        document.body.append(imageAssetLargePreview);
      }
      component.remove();
      if (interaction3dEditorPickers === close) {
        interaction3dEditorPickers = null;
      }
      hideImageLargePreview();
    }
  }
  async function loadPickerPage() {
    const temp2 = ++number;
    addEventListener.setAttribute("aria-busy", "true");
    textContent10.textContent = "正在加载…";
    disabled7.disabled = true;
    disabled8.disabled = true;
    try {
      const total = await param3({
        query: page4.query,
        page: page4.page,
        pageSize
      });
      if (flag || temp2 !== number) {
        return;
      }
      page4.total = Math.max(0, Number(total.total) || 0);
      page4.pageCount = Math.max(1, Math.ceil(page4.total / pageSize));
      if (page4.page > page4.pageCount) {
        page4.page = page4.pageCount;
        await loadPickerPage();
        return;
      }
      const chosen = param5 ? param5(page4) : [];
      const push3 = (total.items || []).map(item => param4(item));
      if (!push3.length) {
        const className2 = document.createElement("div");
        className2.className = "editor-paged-picker-empty";
        className2.textContent = param16;
        push3.push(className2);
      }
      if (param6 && page4.page === page4.pageCount) {
        push3.push(...(param6(page4) || []));
      }
      addEventListener.replaceChildren(...chosen, ...push3);
      addEventListener.scrollTop = 0;
      el3.value = String(page4.page);
      textContent11.textContent = "/ " + page4.pageCount;
      textContent10.textContent = "第 " + page4.page + " / " + page4.pageCount + " 页 · 共 " + page4.total + " 项";
      disabled7.disabled = page4.page <= 1;
      disabled8.disabled = page4.page >= page4.pageCount;
    } catch (temp3) {
      if (flag || temp2 !== number) {
        return;
      }
      const className4 = document.createElement("div");
      className4.className = "editor-paged-picker-empty error";
      className4.textContent = "加载失败，请稍后重试";
      addEventListener.replaceChildren(className4);
      textContent10.textContent = "加载失败";
      onError(temp3);
    } finally {
      if (!flag && temp2 === number) {
        addEventListener.removeAttribute("aria-busy");
      }
    }
  }
  button.addEventListener("click", () => close.close());
  component.addEventListener("cancel", preventDefault => {
    preventDefault.preventDefault();
    close.close();
  });
  component.addEventListener("click", target2 => {
    if (target2.target === component) {
      close.close();
    }
  });
  component.addEventListener("close", teardownPickerPanel, {
    once: true
  });
  el4.addEventListener("input", () => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      page4.query = el4.value.trim();
      page4.page = 1;
      loadPickerPage();
    }, 160);
  });
  disabled7.addEventListener("click", () => {
    if (!(page4.page <= 1)) {
      page4.page -= 1;
      loadPickerPage();
    }
  });
  disabled8.addEventListener("click", () => {
    if (!(page4.page >= page4.pageCount)) {
      page4.page += 1;
      loadPickerPage();
    }
  });
  el3.addEventListener("change", () => {
    const temp2 = Math.trunc(Number(el3.value));
    page4.page = clampNumber(Number.isFinite(temp2) ? temp2 : page4.page, 1, page4.pageCount);
    loadPickerPage();
  });
  addEventListener.addEventListener("pointerover", target3 => {
    const contains = target3.target.closest("[data-editor-picker-value]");
    if (!!contains && !contains.contains(target3.relatedTarget)) {
      param10?.(contains.dataset.editorPickerValue, contains);
    }
  });
  addEventListener.addEventListener("pointerleave", hideImageLargePreview);
  addEventListener.addEventListener("scroll", hideImageLargePreview);
  addEventListener.addEventListener("click", target4 => {
    const dataset7 = target4.target.closest("[data-delete-user-asset]");
    if (dataset7 && param9) {
      target4.preventDefault();
      target4.stopPropagation();
      const temp3 = dataset7.dataset.deleteUserAsset;
      close.close();
      param9(temp3);
      return;
    }
    const dataset8 = target4.target.closest("[data-editor-picker-value]");
    if (!dataset8 || !addEventListener.contains(dataset8)) {
      return;
    }
    const temp2 = dataset8.dataset.editorPickerValue;
    close.close();
    param8(temp2);
  });
  append2.addEventListener("click", target5 => {
    const dataset9 = target5.target.closest("[data-editor-picker-value]");
    if (!dataset9 || !append2.contains(dataset9)) {
      return;
    }
    const temp2 = dataset9.dataset.editorPickerValue;
    close.close();
    param8(temp2);
  });
  interaction3dEditorPickers = close;
  setAttribute?.setAttribute("aria-expanded", "true");
  close.rebuildToolbar();
  component.showModal();
  loadPickerPage();
  window.requestAnimationFrame(() => el4.focus({
    preventScroll: true
  }));
  return close;
}
function renderList5(value, param, param2) {
  const temp = document.createElement("button");
  temp.type = "button";
  temp.dataset[param] = param2;
  value.replaceChildren(temp);
  temp.click();
  value.replaceChildren();
}
function loadNavigationIconOptions(triggerButton) {
  const component = selectedComponent();
  const value = [{
    button: navigationIconButton,
    title: "选择导航图标",
    options: navigationIconOptions,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: "不使用图标"
  }, {
    button: ibeIconButton,
    title: "选择效果按钮图标",
    options: ibeIconOptions,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: "不使用图标"
  }, {
    button: iconButtonIconButton,
    title: "选择按钮图标",
    options: iconButtonIconOptions,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: component?.type === "device-button" ? "跟随实体图标" : "不使用图标"
  }, {
    button: titleButtonIconButton,
    title: "选择标题图标",
    options: titleButtonIconOptions,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: "不使用图标"
  }, {
    button: lightStatisticsIconButton,
    title: "选择统计图标",
    options: lightStatisticsIconOptions,
    datasetKey: "lightStatisticsIconName",
    current: String(Object.hasOwn(component?.properties || {}, "icon") ? component?.properties?.icon || "" : "mdi:lightbulb-group-outline"),
    clear: "不使用图标"
  }].find(button => button.button === triggerButton);
  if (!value) {
    return false;
  }
  const temp = openEditorPicker({
    kind: "icon",
    title: value.title,
    searchPlaceholder: "搜索图标名称",
    triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.icon,
    selectedText: "",
    emptyText: "没有匹配的图标",
    itemClass: "icon-grid",
    async getPage({
      query: param,
      page: param2,
      pageSize: param3
    }) {
      const number = (param2 - 1) * param3;
      const items = await apiFetch("/icons?query=" + encodeURIComponent(param) + "&limit=" + param3 + "&offset=" + number);
      return {
        items: items.items || [],
        total: Number(items.total) || 0
      };
    },
    renderLeadingItems: () => [],
    renderSelectedActions: () => [Object.assign(document.createElement("span"), {
      className: "editor-paged-picker-current-label",
      textContent: "当前选择"
    }), createEditorPickerCurrentIcon(value.current, value.clear), editorPickerClearAction(value.clear, !value.current)],
    renderItem(name13) {
      const dataset5 = createIconPickerOption(name13, value.current, "editorPickerValue");
      dataset5.dataset.editorPickerValue = name13.name;
      return dataset5;
    },
    onSelect: param => renderList5(value.options, value.datasetKey, param)
  });
  return true;
}
function openEntityPickerForButton(triggerButton) {
  const value = selectedComponent();
  const chosen = triggerButton === imageEntityButton ? "image" : triggerButton === iconButtonEntityButton && ["icon-button", "device-button", "presence-sensor"].includes(value?.type) ? value.type : ["weather", "line-chart", "title-button", "light-statistics", "icon-button-effect", "vacuum-map", "camera", "air-conditioner", "navigation-button"].find(item => entityPickerConfig(item).button === triggerButton);
  if (!chosen) {
    return false;
  }
  const alias = componentId;
  if (editorPickerLifecycle(triggerButton, () => openEntityPickerForButton(triggerButton), () => componentId === alias)) {
    return true;
  }
  const flag = entityPickerConfig(chosen);
  const text2 = value?.bindings?.entity?.entityId || "";
  const flag3 = pickerEntitiesForComponentType(chosen).find(entityId2 => entityId2.entityId === text2) || null;
  const flag4 = ibeTemplateOptions()[0] || null;
  const temp = readEntityId(chosen, "").findIndex(item => item.entityId === text2);
  openEditorPicker({
    kind: "entity",
    title: "选择实体",
    subtitle: editorPickerComponentTypeLabel(chosen) + " · " + entityPickerHintText,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(temp, flag4),
    selectedText: text2 || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({
      query: item,
      page: param
    }) {
      const temp2 = readEntityId(chosen, item);
      return editorEntityPickerPage(temp2, param, flag4);
    },
    renderLeadingItems: renderItem => renderItem.page === 1 && flag4 ? [createEditorEntityPickerOption(flag4, text2)] : [],
    renderSelectedContent: () => [createEditorPickerCurrentEntity(flag3)],
    renderSelectedActions: () => [editorPickerClearAction("不使用实体", !text2)],
    renderItem: param => createEditorEntityPickerOption(param, text2),
    onSelect: param => renderList5(flag.options, "entityId", param)
  });
  return true;
}
function openLightStatisticsEntityPicker() {
  if (selectedComponent()?.type !== "light-statistics") {
    return false;
  }
  const value = componentId;
  if (editorPickerLifecycle(lightStatisticsEntityButton, openLightStatisticsEntityPicker, () => componentId === value && selectedComponent()?.type === "light-statistics")) {
    return true;
  }
  const callback = item => {
    const temp3 = String(item || "").trim().toLocaleLowerCase("zh-CN");
    return pickerEntitiesForComponentType("light-statistics").map((entity, index) => ({
      entity,
      index,
      support: lightStatisticsEntitySupport(entity)
    })).filter(({
      entity: param
    }) => !temp3 || (entityPickerText(param) + " " + entityDomain(param)).toLocaleLowerCase("zh-CN").includes(temp3)).sort((left, right) => Number(right.support.supported) - Number(left.support.supported) || +(entityDomain(right.entity) === "light") - +(entityDomain(left.entity) === "light") || left.index - right.index).map(({
      entity: param
    }) => param);
  };
  const temp = callback("").findIndex(item => item.entityId === lightStatisticsSelectedEntityId);
  const flag = ibeTemplateOptions()[0] || null;
  const temp2 = openEditorPicker({
    kind: "entity",
    title: lightStatisticsReplaceIndex >= 0 ? "选择替换实体" : "添加统计实体",
    subtitle: entityPickerHintText,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: lightStatisticsEntityButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(temp, flag),
    selectedText: lightStatisticsSelectedEntityId || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    closeLegacyPickers: false,
    getPage({
      query: item,
      page: param
    }) {
      const temp3 = callback(item);
      return editorEntityPickerPage(temp3, param, flag);
    },
    renderLeadingItems: renderLeadingItems => renderLeadingItems.page === 1 && flag ? [createEditorEntityPickerOption(flag, lightStatisticsSelectedEntityId)] : [],
    renderItem: renderItem => createEditorEntityPickerOption(renderItem, lightStatisticsSelectedEntityId),
    onSelect: onSelect => renderList5(lightStatisticsEntityOptions, "lightStatisticsEntityId", onSelect)
  });
  return true;
}
function openPopupEntityPickerForTrigger(triggerButton) {
  const value = triggerButton.closest("[data-action-trigger]");
  const flag = value?.querySelector("[data-popup-entity]");
  const component = value?.querySelector("[data-popup-entity-options]");
  if (!value || !flag || !component) {
    return false;
  }
  if (editorPickerLifecycle(triggerButton, () => openPopupEntityPickerForTrigger(triggerButton), () => value.isConnected)) {
    return true;
  }
  const chosen = flag.value || "";
  const temp = entityCatalog.find(entityId3 => entityId3.entityId === chosen) || null;
  const flag2 = ibeTemplateOptions()[0] || null;
  const callback = param => {
    const temp4 = String(param || "").trim().toLocaleLowerCase("zh-CN");
    return entityCatalog.filter(virtual => !virtual.virtual && (!temp4 || (entityPickerText(virtual) + " " + virtual.entityId).toLocaleLowerCase("zh-CN").includes(temp4)));
  };
  const temp3 = callback("").findIndex(entityId4 => entityId4.entityId === chosen);
  openEditorPicker({
    kind: "entity",
    title: "选择弹窗实体",
    subtitle: entityPickerHintText,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(temp3, flag2),
    selectedText: chosen || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({
      query: param,
      page: param2
    }) {
      const temp4 = callback(param);
      return editorEntityPickerPage(temp4, param2, flag2);
    },
    renderItem: param => createEditorEntityPickerOption(param, chosen),
    renderLeadingItems: page3 => page3.page === 1 && flag2 ? [createEditorEntityPickerOption(flag2, chosen)] : [],
    renderSelectedContent: () => [createEditorPickerCurrentEntity(temp)],
    renderSelectedActions: () => [editorPickerClearAction("不使用实体", !chosen)],
    onSelect: param => renderList5(component, "popupActionEntityId", param)
  });
  return true;
}
function openPopupModuleEntityPicker() {
  if (!popupModuleDialog.open) {
    return false;
  }
  if (editorPickerLifecycle(popupModuleEntityButton, openPopupModuleEntityPicker, () => popupModuleDialog.open)) {
    return true;
  }
  const value = popupModuleForm.elements.entityId.value || "";
  const flag = entityCatalog.find(item => item.entityId === value) || null;
  const flag2 = ibeTemplateOptions()[0] || null;
  const readEntityId = item => {
    const temp2 = String(item || "").trim().toLocaleLowerCase("zh-CN");
    return entityCatalog.map((entity, index) => ({
      entity,
      index
    })).filter(({
      entity: param
    }) => !param.virtual && (!temp2 || (entityPickerText(param) + " " + param.entityId).toLocaleLowerCase("zh-CN").includes(temp2))).sort((left, right) => Number(popupModuleEntityRecommended(right.entity, popupModuleForm.elements.type.value)) - Number(popupModuleEntityRecommended(left.entity, popupModuleForm.elements.type.value)) || left.index - right.index).map(({
      entity: param
    }) => param);
  };
  const temp = readEntityId("").findIndex(item => item.entityId === value);
  openEditorPicker({
    kind: "entity",
    title: "选择模块实体",
    subtitle: entityPickerHintText,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: popupModuleEntityButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(temp, flag2),
    selectedText: value || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({
      query: item,
      page: param
    }) {
      const temp2 = readEntityId(item);
      return editorEntityPickerPage(temp2, param, flag2);
    },
    renderItem: renderItem => createEditorEntityPickerOption(renderItem, value),
    renderLeadingItems: renderLeadingItems => renderLeadingItems.page === 1 && flag2 ? [createEditorEntityPickerOption(flag2, value)] : [],
    renderSelectedContent: () => [createEditorPickerCurrentEntity(flag)],
    renderSelectedActions: () => [editorPickerClearAction("不使用实体", !value)],
    onSelect: onSelect => renderList5(popupModuleEntityOptions, "popupModuleEntityId", onSelect)
  });
  return true;
}
function withSelectedComponent11(value) {
  const temp = value === imageAssetButton ? "image" : value === ibeAssetButton ? "ibe" : "";
  if (!temp) {
    return false;
  }
  const callback = temp === "image";
  const properties51 = selectedComponent();
  const chosen = callback ? properties51?.properties?.assetId || "" : properties51?.properties?.effectAssetId || "";
  const name19 = findAssetById(chosen);
  loadAssets({
    refreshInspector: false
  }).then(() => {
    if (interaction3dEditorPickers?.triggerButton === value) {
      interaction3dEditorPickers.syncAssetToolbar?.();
      interaction3dEditorPickers.refresh();
    }
  }).catch(onError);
  const temp2 = editorAssetMatcher(temp).findIndex(item => assetMatchesId(item, chosen));
  openEditorPicker({
    kind: temp + "-asset",
    title: callback ? "选择控件图片" : "选择效果图片",
    subtitle: "我的图片与栖光素材 · 固定分页加载",
    searchPlaceholder: "搜索图片名称",
    triggerButton: value,
    pageSize: EDITOR_PICKER_PAGE_SIZES.asset,
    initialPage: temp2 < 0 ? 1 : Math.floor(temp2 / EDITOR_PICKER_PAGE_SIZES.asset) + 1,
    selectedText: name19?.name || chosen || "不使用图片",
    emptyText: "没有匹配的图片",
    itemClass: "asset-grid",
    getPage({
      query: param,
      page: param2,
      pageSize: param3
    }) {
      const slice = editorAssetMatcher(temp, param);
      const number = (param2 - 1) * param3;
      return {
        items: slice.slice(number, number + param3),
        total: slice.length
      };
    },
    renderSelectedContent: () => [createEditorPickerCurrentAsset(name19)],
    renderSelectedActions: () => [editorPickerClearAction("不使用图片", !chosen)],
    renderItem(assetId) {
      const matches = createAssetOptionButton(assetId, chosen);
      const dataset = matches.matches?.("[data-asset-id]") ? matches : matches.querySelector("[data-asset-id]");
      if (dataset) {
        dataset.dataset.editorPickerValue = assetId.assetId;
      }
      return matches;
    },
    buildToolbar: param => editorAssetToolbar(temp, param),
    onItemHover: (param, param2) => scheduleImageLargePreview(findAssetById(param), param2, interaction3dEditorPickers?.dialog),
    onDelete: confirmDeleteUserAsset,
    onSelect: param => renderList5(callback ? imageAssetOptions : ibeAssetOptions, "assetId", param)
  })?.dialog.append(imageAssetLargePreview);
  return true;
}
function setAssetSourceAndRefresh(value, param) {
  const chosen = param === "user" ? "user" : "builtin";
  if (value === "image") {
    imageAssetSource = chosen;
    imageAssetSearch.value = "";
    syncAssetFolderMenu("image");
    syncAssetSourceMenu("image");
    if (interaction3dEditorPickers?.kind === "image-asset") {
      interaction3dEditorPickers.rebuildToolbar();
      interaction3dEditorPickers.refresh({
        resetPage: true
      });
    } else {
      renderImageAssetOptions();
      positionImageAssetMenu();
    }
  } else {
    ibeAssetSource = chosen;
    ibeAssetSearch.value = "";
    syncAssetFolderMenu("ibe");
    syncAssetSourceMenu("ibe");
    if (interaction3dEditorPickers?.kind === "ibe-asset") {
      interaction3dEditorPickers.rebuildToolbar();
      interaction3dEditorPickers.refresh({
        resetPage: true
      });
    } else {
      renderIbeAssetOptions();
      positionIbeAssetMenu();
    }
  }
}
async function uploadUserAssets(value, param) {
  const list = [...(value || [])];
  if (!list.length) {
    return;
  }
  const chosen = param === "image" ? imageAssetUpload : ibeAssetUpload;
  chosen.disabled = true;
  const list2 = [];
  try {
    for (const body of list) {
      if (!/\.(png|jpe?g|webp|svg)$/i.test(body.name)) {
        list2.push(body.name + "：仅支持 PNG、JPG、JPEG、WebP 和 SVG");
        continue;
      }
      try {
        await apiFetch("/assets/user", {
          method: "POST",
          body,
          headers: {
            "Content-Type": body.type || "application/octet-stream",
            "X-File-Name": encodeURIComponent(body.name)
          }
        });
      } catch (error) {
        list2.push(body.name + "：" + error.message);
      }
    }
    await loadAssets({
      refreshInspector: false
    });
    setAssetSourceAndRefresh(param, "user");
    if (list2.length) {
      onError(new Error(list2.join("\n")));
    }
  } finally {
    chosen.disabled = false;
  }
}
function confirmDeleteUserAsset(param) {
  const temp = findAssetById(param);
  if (!temp || temp.source !== "user") {
    return;
  }
  const callback = some => Array.isArray(some) ? some.some(callback) : some && typeof some == "object" ? Object.values(some).some(callback) : some === temp.assetId;
  if (callback(currentProject?.document)) {
    closeOtherPickerPanels();
    onError(new Error("这张图片正在被当前仪表盘或弹窗使用，请先替换或移除后再删除。"));
    return;
  }
  pendingDeleteAssetId = temp.assetId;
  deleteAssetName.textContent = "“" + temp.name + "”";
  closeOtherPickerPanels();
  deleteAssetDialog.showModal();
}
function confirmDeleteStudioExportFolder(kind, folderName) {
  if (!isStudioExportFolder(kind === "image" ? imageAssetSource : ibeAssetSource, folderName)) {
    return;
  }
  const value = studioExportAssetsInFolder(folderName);
  const number = "studio3d:" + folderName + "/";
  const callback = component => Array.isArray(component) ? component.some(callback) : component && typeof component == "object" ? Object.values(component).some(callback) : typeof component == "string" && component.startsWith(number);
  if (callback(currentProject?.document)) {
    onError(new Error("这个文件夹中的图片正在被当前仪表盘或弹窗使用，请先替换或移除后再删除。"));
    return;
  }
  pendingDeleteAssetFolder = {
    kind,
    folderName
  };
  deleteAssetFolderName.textContent = "“" + folderName + "”";
  deleteAssetFolderCount.textContent = String(value.length);
  deleteAssetFolderDialog.showModal();
}
function refreshAssetMenus() {
  syncAssetFolderMenu("image");
  syncAssetFolderMenu("ibe");
  renderImageAssetOptions(imageAssetSearch.value);
  renderIbeAssetOptions(ibeAssetSearch.value);
  if (interaction3dEditorPickers?.kind === "image-asset" || interaction3dEditorPickers?.kind === "ibe-asset") {
    interaction3dEditorPickers.syncAssetToolbar?.();
    interaction3dEditorPickers.refresh({
      resetPage: true
    });
  }
  if (!imageAssetMenu.hidden) {
    positionImageAssetMenu();
  }
  if (!ibeAssetMenu.hidden) {
    positionIbeAssetMenu();
  }
}
imageAssetMenu.addEventListener("click", target39 => {
  const dataset24 = target39.target.closest("[data-image-asset-source]");
  if (dataset24) {
    setAssetSourceAndRefresh("image", dataset24.dataset.imageAssetSource);
  }
});
ibeAssetMenu.addEventListener("click", target40 => {
  const dataset25 = target40.target.closest("[data-ibe-asset-source]");
  if (dataset25) {
    setAssetSourceAndRefresh("ibe", dataset25.dataset.ibeAssetSource);
  }
});
imageAssetUpload.addEventListener("click", () => imageAssetUploadInput.click());
ibeAssetUpload.addEventListener("click", () => ibeAssetUploadInput.click());
imageAssetUploadInput.addEventListener("change", async () => {
  await uploadUserAssets(imageAssetUploadInput.files, "image");
  imageAssetUploadInput.value = "";
});
ibeAssetUploadInput.addEventListener("change", async () => {
  await uploadUserAssets(ibeAssetUploadInput.files, "ibe");
  ibeAssetUploadInput.value = "";
});
for (const temp2 of [imageAssetOptions, ibeAssetOptions]) {
  temp2.addEventListener("click", event => {
    const value = event.target.closest("[data-delete-user-asset]");
    if (value) {
      event.preventDefault();
      event.stopPropagation();
      confirmDeleteUserAsset(value.dataset.deleteUserAsset);
    }
  });
}
deleteAssetCloseBtn.addEventListener("click", () => deleteAssetDialog.close());
deleteAssetCancelBtn.addEventListener("click", () => deleteAssetDialog.close());
deleteAssetDialog.addEventListener("click", target41 => {
  if (target41.target === deleteAssetDialog) {
    deleteAssetDialog.close();
  }
});
deleteAssetConfirmBtn.addEventListener("click", async () => {
  const replaced = String(pendingDeleteAssetId || "").replace(/^user:/, "");
  if (/^[0-9a-f]{32}$/.test(replaced)) {
    deleteAssetConfirmBtn.disabled = true;
    try {
      await apiFetch("/assets/user/" + replaced, {
        method: "DELETE"
      });
      pendingDeleteAssetId = null;
      deleteAssetDialog.close();
      await loadAssets();
    } catch (code) {
      if (code?.code === "ASSET_IN_USE") {
        onError(new Error("这张图片仍被户型图绘制或仪表盘使用，请先移除引用后再删除。"));
      } else {
        onError(code);
      }
    } finally {
      deleteAssetConfirmBtn.disabled = false;
    }
  }
});
deleteAssetFolderCloseBtn.addEventListener("click", () => deleteAssetFolderDialog.close());
deleteAssetFolderCancelBtn.addEventListener("click", () => deleteAssetFolderDialog.close());
deleteAssetFolderDialog.addEventListener("click", target42 => {
  if (target42.target === deleteAssetFolderDialog) {
    deleteAssetFolderDialog.close();
  }
});
deleteAssetFolderDialog.addEventListener("close", () => {
  if (!deleteAssetFolderConfirmBtn.disabled) {
    pendingDeleteAssetFolder = null;
  }
});
deleteAssetFolderConfirmBtn.addEventListener("click", async () => {
  const folderName = pendingDeleteAssetFolder;
  if (folderName?.folderName) {
    deleteAssetFolderConfirmBtn.disabled = true;
    try {
      await apiFetch("/studio3d/exports", {
        method: "DELETE",
        headers: {
          "X-Export-Folder": encodeURIComponent(folderName.folderName)
        }
      });
      pendingDeleteAssetFolder = null;
      deleteAssetFolderDialog.close();
      await loadAssets({
        refreshInspector: false
      });
      refreshAssetMenus();
    } catch (code2) {
      if (code2?.code === "STUDIO3D_EXPORT_IN_USE") {
        onError(new Error("这个文件夹中的图片仍被仪表盘、弹窗或户型图绘制使用，请先移除引用后再删除。"));
      } else {
        onError(code2);
      }
    } finally {
      deleteAssetFolderConfirmBtn.disabled = false;
    }
  }
});
imageAssetButton.addEventListener("click", async () => {
  const ancestorEl = imageAssetMenu.hidden;
  closeOtherPickerPanels(ancestorEl ? "asset" : null);
  imageAssetMenu.hidden = !ancestorEl;
  imageAssetButton.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    try {
      await loadAssets({
        refreshInspector: false
      });
      syncAssetFolderMenu("image");
    } catch (temp) {
      onError(temp);
    }
    renderImageAssetOptions(imageAssetSearch.value);
    positionImageAssetMenu();
    window.requestAnimationFrame(() => {
      positionImageAssetMenu();
      imageAssetSearch.focus({
        preventScroll: true
      });
    });
  }
});
imageAssetFolder.addEventListener("change", () => {
  imageAssetFolderFilter = imageAssetFolder.value;
  imageAssetSearch.value = "";
  syncAssetSourceMenu("image");
  renderImageAssetOptions();
});
imageAssetSearch.addEventListener("input", () => renderImageAssetOptions(imageAssetSearch.value));
imageAssetOptions.addEventListener("pointerover", value => {
  const ancestorEl = value.target.closest("[data-asset-id]");
  if (!ancestorEl || ancestorEl.contains(value.relatedTarget)) {
    return;
  }
  const temp = findAssetById(ancestorEl.dataset.assetId);
  scheduleImageLargePreview(temp, ancestorEl);
});
imageAssetOptions.addEventListener("pointerleave", hideImageLargePreview);
imageAssetOptions.addEventListener("scroll", hideImageLargePreview);
imageAssetOptions.addEventListener("click", async target43 => {
  const dataset26 = target43.target.closest("[data-asset-id]");
  if (!dataset26 || !componentId) {
    return;
  }
  const alias = componentId;
  const temp = dataset26.dataset.assetId;
  hideImageLargePreview();
  closeOtherPickerPanels();
  if (!temp) {
    mutateDocument(param => {
      const properties28 = findComponent(param, alias)?.component;
      if (!!properties28 && properties28.type === "image") {
        properties28.properties = {
          ...(properties28.properties || {}),
          fit: "contain"
        };
        delete properties28.properties.assetId;
        delete properties28.properties.naturalWidth;
        delete properties28.properties.naturalHeight;
      }
    });
    return;
  }
  const temp2 = findAssetById(temp);
  if (temp2) {
    try {
      const asyncResult = await ensureAssetDimensions(temp2);
      mutateDocument(param => {
        const temp3 = findComponent(param, alias)?.component;
        if (!!temp3 && temp3.type === "image") {
          applyAssetToComponent(temp3, temp, asyncResult);
        }
      });
    } catch (temp3) {
      onError(temp3);
    }
  }
});
ibeAssetButton.addEventListener("click", async () => {
  const ancestorEl = ibeAssetMenu.hidden;
  closeOtherPickerPanels(ancestorEl ? "ibe-asset" : null);
  ibeAssetMenu.hidden = !ancestorEl;
  ibeAssetButton.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    try {
      await loadAssets({
        refreshInspector: false
      });
      syncAssetFolderMenu("ibe");
    } catch (temp) {
      onError(temp);
    }
    renderIbeAssetOptions(ibeAssetSearch.value);
    positionIbeAssetMenu();
    window.requestAnimationFrame(() => {
      positionIbeAssetMenu();
      ibeAssetSearch.focus({
        preventScroll: true
      });
    });
  }
});
ibeAssetFolder.addEventListener("change", () => {
  ibeAssetFolderFilter = ibeAssetFolder.value;
  ibeAssetSearch.value = "";
  syncAssetSourceMenu("ibe");
  renderIbeAssetOptions();
});
ibeAssetSearch.addEventListener("input", () => renderIbeAssetOptions(ibeAssetSearch.value));
ibeAssetOptions.addEventListener("pointerover", value => {
  const ancestorEl = value.target.closest("[data-asset-id]");
  if (!!ancestorEl && !ancestorEl.contains(value.relatedTarget)) {
    scheduleImageLargePreview(findAssetById(ancestorEl.dataset.assetId), ancestorEl, ibeAssetMenu);
  }
});
ibeAssetOptions.addEventListener("pointerleave", hideImageLargePreview);
ibeAssetOptions.addEventListener("scroll", hideImageLargePreview);
ibeAssetOptions.addEventListener("click", async target44 => {
  const dataset27 = target44.target.closest("[data-asset-id]");
  const list = componentId;
  if (!dataset27 || !list) {
    return;
  }
  const effectAssetId = dataset27.dataset.assetId;
  hideImageLargePreview();
  closeOtherPickerPanels();
  const chosen = effectAssetId ? findAssetById(effectAssetId) : null;
  let width11 = null;
  if (chosen) {
    try {
      width11 = await ensureAssetDimensions(chosen);
    } catch (temp) {
      onError(temp);
      return;
    }
  }
  mutateDocument(param => {
    const properties46 = findComponent(param, list)?.component;
    if (!!properties46 && properties46.type === "icon-button-effect") {
      properties46.properties = {
        ...(properties46.properties || {})
      };
      if (effectAssetId && width11) {
        properties46.properties.effectAssetId = effectAssetId;
        properties46.properties.effectNaturalWidth = width11.width;
        properties46.properties.effectNaturalHeight = width11.height;
        delete properties46.properties.effectWidth;
        delete properties46.properties.effectHeight;
      } else {
        delete properties46.properties.effectAssetId;
        delete properties46.properties.effectNaturalWidth;
        delete properties46.properties.effectNaturalHeight;
      }
    }
  });
});
undoBtn.addEventListener("click", () => mutateDocument2("undo"));
redoBtn.addEventListener("click", () => mutateDocument2("redo"));
recoveryRestoreBtn.addEventListener("click", () => {
  if (!recoveredDraft || !currentProject) {
    recoveryDialog.close();
    return;
  }
  const selectedComponentId = recoveredDraft;
  recoveredDraft = null;
  currentProject = {
    ...currentProject,
    document: cloneValue(selectedComponentId.document)
  };
  componentId = findComponent(currentProject.document, selectedComponentId.selectedComponentId) ? selectedComponentId.selectedComponentId : null;
  const length11 = Array.isArray(selectedComponentId.selectedComponentIds) ? selectedComponentId.selectedComponentIds.filter(item => findComponent(currentProject.document, item)) : [];
  selectedComponentIds = new Set(length11.length ? length11 : componentId ? [componentId] : []);
  rangeSelectAnchorId = componentId;
  historyState.undo = Array.isArray(selectedComponentId.undo) ? cloneValue(selectedComponentId.undo) : [];
  historyState.redo = Array.isArray(selectedComponentId.redo) ? cloneValue(selectedComponentId.redo) : [];
  recoveryDialog.close();
  refreshEditorChrome(selectedComponentId.selectedPath || null);
  syncDocumentDirtyState();
  syncHistoryButtons();
});
recoveryDiscardBtn.addEventListener("click", () => {
  readRecoveredDraft(currentProject?.projectId);
  recoveredDraft = null;
  recoveryDialog.close();
  syncDocumentDirtyState();
  syncHistoryButtons();
});
recoveryDialog.addEventListener("cancel", value => value.preventDefault());
errorDialogCloseBtn.addEventListener("click", () => errorDialog.close());
errorDialogConfirmBtn.addEventListener("click", () => errorDialog.close());
errorDialog.addEventListener("click", target45 => {
  if (target45.target === errorDialog) {
    errorDialog.close();
  }
});
showSharedComponents.addEventListener("click", () => setComponentTemplateScope("shared"));
showPageComponents.addEventListener("click", () => setComponentTemplateScope("page"));
addComponentButton.addEventListener("click", () => {
  if (!addComponentButton.disabled) {
    listAllComponentTemplates();
    componentTemplateDialog.showModal();
  }
});
componentTemplateCloseBtn.addEventListener("click", () => componentTemplateDialog.close());
componentTemplateDialog.addEventListener("click", target46 => {
  if (target46.target === componentTemplateDialog) {
    componentTemplateDialog.close();
  }
});
componentTemplateList.addEventListener("click", target47 => {
  const value = target47.target.closest("[data-template-id]");
  const inputValue = pageSelect.value;
  if (!value || value.disabled || !inputValue) {
    return;
  }
  const alias = componentAddScope;
  const chosen2 = activeGroupId ? findComponent(currentProject?.document, activeGroupId) : null;
  const chosen3 = chosen2?.component?.type === "group" ? chosen2.component : null;
  const chosen = chosen3 ? chosen2.scope : alias;
  const generatedId = newId("component");
  componentTemplateDialog.close();
  componentId = generatedId;
  selectedComponentIds = new Set([generatedId]);
  rangeSelectAnchorId = generatedId;
  const then = mutateDocument(pages => {
    const components3 = pages.pages.find(path3 => path3.path === inputValue);
    if (!components3) {
      throw new Error("当前页面不存在。");
    }
    const component = chosen3 ? findComponent(pages, chosen3.id) : null;
    const position12 = component?.component?.type === "group" ? component.component : null;
    const mode2 = alias === "shared" ? pages.sharedComponents : components3.components;
    const unshift = position12 ? position12.children ||= [] : mode2;
    const chosen3 = value.dataset.templateId === "navigation-button" ? "导航按钮" : value.dataset.templateId === "interaction3d" ? "3D 交互" : value.dataset.templateId === "floorplan-auto-diagram" ? "户型图自动导图" : value.dataset.templateId === "icon-button-effect" ? "图标按钮（效果）" : value.dataset.templateId === "title-button" ? "标题按钮" : value.dataset.templateId === "light-statistics" ? "数量统计" : value.dataset.templateId === "icon-button" ? "图标按钮" : value.dataset.templateId === "device-button" ? "设备按钮" : value.dataset.templateId === "presence-sensor" ? "传感器" : value.dataset.templateId === "air-conditioner" ? "空调 / 浴霸" : value.dataset.templateId === "vacuum-map" ? "扫地机器人实时地图" : value.dataset.templateId === "camera" ? "摄像头实时预览" : value.dataset.templateId === "time" ? "时间" : value.dataset.templateId === "date" ? "日期" : value.dataset.templateId === "weather" ? "天气" : value.dataset.templateId === "line-chart" ? "折线图" : value.dataset.templateId === "panel-frame" ? "底图框" : "图片";
    const instanceName = nextTemplateInstanceName(unshift, chosen3);
    const position13 = createComponentFromTemplate(value.dataset.templateId, {
      id: generatedId,
      instanceName,
      canvas: pages.canvas,
      uiPackId: currentUiPackId(pages)
    });
    if (position12) {
      const number = Number(position12.position?.width || 100);
      const number2 = Number(position12.position?.height || 100);
      const number3 = Number(position13.position?.width || 100);
      const number4 = Number(position13.position?.height || 100);
      position13.position = {
        ...(position13.position || {}),
        x: (number - number3) / 2,
        y: (number2 - number4) / 2
      };
    }
    unshift.unshift(position13);
    applyCollectionLayerOrder(unshift);
    if (chosen === "shared" && !position12) {
      for (const sharedComponentIds of pages.pages) {
        sharedComponentIds.sharedComponentIds = [position13.id, ...(sharedComponentIds.sharedComponentIds || []).filter(item => item !== position13.id)];
      }
      syncSharedComponentReferenceOrder(pages);
    }
  }, inputValue);
  if (value.dataset.templateId === "floorplan-auto-diagram") {
    then.then(() => openFloorplanAutoDiagramDialog(generatedId, {
      cancelRemovesComponent: true
    }));
  }
});
showEditorPreview.addEventListener("click", () => setEditorMode("edit"));
showDashboardPreview.addEventListener("click", () => setEditorMode("dashboard"));
dashboardSoundToggleBtn.addEventListener("click", async () => {
  if (!currentProject) {
    return;
  }
  const soundEnabled = cloneValue(currentProject.document);
  soundEnabled.soundEnabled = currentProject.document.soundEnabled === false;
  try {
    await commitDocumentEdit(soundEnabled);
    await autosaveDocument();
  } catch (temp) {
    onError(temp);
  }
});
openHomeAssistant.addEventListener("click", haBaseUrlOrigin);
showPageEditor.addEventListener("click", () => setEditorMode("edit"));
showPopupEditor.addEventListener("click", () => setEditorMode("popup"));
projectSelect.addEventListener("change", () => {
  closeProjectActionsMenu();
  if (documentDirty && currentProject && projectSelect.value !== currentProject.projectId) {
    projectSelect.value = currentProject.projectId;
    syncCustomSelect(projectSelect);
    blockIfUnsavedChanges();
    return;
  }
  if (projectSelect.value) {
    loadProjectDraft(projectSelect.value).catch(onError);
  }
});
pageSelect.addEventListener("change", () => {
  closePageActionsMenu();
  syncDefaultPageAction();
  activeGroupId = null;
  if (editorMode === "popup") {
    setEditorMode("edit");
  }
  editorRenderer?.navigate(pageSelect.value);
  dashboardPreviewRenderer?.navigate(pageSelect.value);
  const scope = findComponent(currentProject?.document, componentId);
  if (scope?.scope === "page" && scope.page?.path !== pageSelect.value) {
    selectComponent(null);
  }
  renderComponentTree();
  refreshInspector();
});
function openDialog3(param) {
  popupNameDialogMode = param;
  const name20 = findCustomPopup(currentProject?.document, selectedPopupId);
  popupNameDialogTitle.textContent = param === "rename" ? "重命名组合弹窗" : "新建组合弹窗";
  popupNameForm.elements.name.value = param === "rename" ? name20?.name || "" : "新建组合弹窗";
  popupNameDialog.showModal();
  popupNameForm.elements.name.select();
}
popupNewBtn.addEventListener("click", () => openDialog3("create"));
popupNameCloseBtn.addEventListener("click", () => popupNameDialog.close());
popupNameCancelBtn.addEventListener("click", () => popupNameDialog.close());
popupNameForm.addEventListener("submit", event => {
  event.preventDefault();
  const value = popupNameForm.elements.name.value.trim();
  if (!value) {
    return;
  }
  const rect = popupNameDialogMode === "create" ? newId("custom-popup") : selectedPopupId;
  popupNameDialog.close();
  mutateDocument(customPopups3 => {
    customPopups3.customPopups = customPopups3.customPopups || [];
    if (popupNameDialogMode === "rename") {
      const name6 = customPopups3.customPopups.find(component => component.id === selectedPopupId);
      if (name6) {
        name6.name = value;
      }
      return;
    }
    customPopups3.customPopups.push({
      id: rect,
      name: value,
      templateRef: {
        uiPackId: currentUiPackId(customPopups3),
        templateId: "custom-popup",
        version: 1
      },
      layout: {
        columns: 3
      },
      modules: []
    });
    selectedPopupId = rect;
    setEditorMode("popup");
  });
});
popupSelect.addEventListener("change", () => {
  closePopupActionsMenu();
  selectedPopupId = popupSelect.value || null;
  setEditorMode("popup");
});
popupList.addEventListener("click", value => {
  const popupAction = value.target.closest("[data-popup-id]");
  if (popupAction) {
    closePopupActionsMenu();
    selectedPopupId = popupAction.dataset.popupId;
    popupSelect.value = selectedPopupId;
    renderPopupList(currentProject.document, selectedPopupId);
    setEditorMode("popup");
  }
});
popupList.addEventListener("contextmenu", target48 => {
  const dataset28 = target48.target.closest("[data-popup-id]");
  if (!dataset28) {
    return;
  }
  target48.preventDefault();
  selectedPopupId = dataset28.dataset.popupId;
  popupSelect.value = selectedPopupId;
  renderPopupList(currentProject.document, selectedPopupId);
  setEditorMode("popup");
  popupActionPending = selectedPopupId;
  popupActionsMenu.hidden = false;
  popupActionsMenu.style.left = "0px";
  popupActionsMenu.style.top = "0px";
  const width12 = popupActionsMenu.getBoundingClientRect();
  popupActionsMenu.style.left = clampNumber(target48.clientX, 8, window.innerWidth - width12.width - 8) + "px";
  popupActionsMenu.style.top = clampNumber(target48.clientY, 8, window.innerHeight - width12.height - 8) + "px";
});
popupActionsButton.addEventListener("click", () => {
  if (popupActionsButton.disabled) {
    return;
  }
  const hidden = popupActionsMenu.hidden;
  closeProjectActionsMenu();
  closePageActionsMenu();
  popupActionsMenu.hidden = !hidden;
  popupActionsButton.setAttribute("aria-expanded", String(hidden));
});
popupActionsMenu.addEventListener("click", target49 => {
  const temp = target49.target.closest("[data-popup-action]")?.dataset.popupAction;
  const flag = popupActionPending || selectedPopupId;
  closePopupActionsMenu();
  if (!!temp && !!flag) {
    if (temp === "rename") {
      openDialog3("rename");
      return;
    }
    if (temp === "duplicate") {
      const element = newId("custom-popup");
      selectedPopupId = element;
      mutateDocument(customPopups => {
        const name5 = (customPopups.customPopups || []).find(component => component.id === flag);
        if (!name5) {
          return;
        }
        const modules = cloneValue(name5);
        modules.id = element;
        modules.name = name5.name + "_副本";
        modules.modules = (modules.modules || []).map(item => ({
          ...item,
          id: newId("popup-module")
        }));
        customPopups.customPopups.push(modules);
      });
      return;
    }
    if (temp === "delete") {
      const name12 = (currentProject?.document?.customPopups || []).find(component => component.id === flag);
      if (!name12) {
        return;
      }
      pendingDeletePopupId = flag;
      deletePopupName.textContent = name12.name;
      deletePopupDialog.showModal();
    }
  }
});
function closeDeletePopupDialog() {
  pendingDeletePopupId = null;
  deletePopupDialog.close();
}
deletePopupCloseBtn.addEventListener("click", closeDeletePopupDialog);
deletePopupCancelBtn.addEventListener("click", closeDeletePopupDialog);
deletePopupDialog.addEventListener("close", () => {
  pendingDeletePopupId = null;
});
deletePopupConfirmBtn.addEventListener("click", () => {
  const hidden = pendingDeletePopupId;
  if (hidden) {
    pendingDeletePopupId = null;
    deletePopupDialog.close();
    deletePopupConfirmBtn.disabled = true;
    mutateDocument(customPopups2 => {
      customPopups2.customPopups = (customPopups2.customPopups || []).filter(component => component.id !== hidden);
      const callback = param => {
        for (const actions of param || []) {
          for (const [value, data] of Object.entries(actions.actions || {})) {
            if (data.type === "more-info" && data.data?.popupSource === "custom" && data.data?.popupId === hidden) {
              actions.actions[value] = {
                type: "none",
                data: {}
              };
            }
          }
          callback(actions.children);
        }
      };
      callback(customPopups2.sharedComponents);
      for (const components of customPopups2.pages || []) {
        callback(components.components);
      }
      selectedPopupId = customPopups2.customPopups[0]?.id || null;
      if (!selectedPopupId) {
        setEditorMode("edit");
      }
    }).finally(() => {
      deletePopupConfirmBtn.disabled = false;
    });
  }
});
popupModuleCloseBtn.addEventListener("click", () => {
  closePopupModuleEntityMenu();
  popupModuleDialog.close();
});
popupModuleCancelBtn.addEventListener("click", () => {
  closePopupModuleEntityMenu();
  popupModuleDialog.close();
});
popupModuleEntityButton.addEventListener("click", () => {
  const ancestorEl = popupModuleEntityMenu.hidden;
  popupModuleEntityMenu.hidden = !ancestorEl;
  popupModuleEntityButton.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    filterPopupModuleEntities();
    window.requestAnimationFrame(() => popupModuleEntitySearch.focus({
      preventScroll: true
    }));
  }
});
popupModuleEntitySearch.addEventListener("input", () => filterPopupModuleEntities());
popupModuleEntityOptions.addEventListener("click", event => {
  const value = event.target.closest("[data-popup-module-entity-id]");
  if (value) {
    popupModuleForm.elements.entityId.value = value.dataset.popupModuleEntityId;
    syncPopupModuleEntityButton();
    closePopupModuleEntityMenu();
  }
});
popupModuleClimateDeviceType.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-popup-module-device-type]");
  if (!!ancestorEl && popupModuleForm.elements.type.value === "climate") {
    syncPopupModuleClimateFields(ancestorEl.dataset.popupModuleDeviceType);
  }
});
popupModuleForm.elements.type.addEventListener("change", () => {
  syncPopupModuleClimateFields();
  popupModuleEntityOptions.replaceChildren();
});
popupModuleForm.addEventListener("submit", event => {
  event.preventDefault();
  const numeric = selectedPopupId;
  const allowed = popupModuleForm.elements.type.value;
  const value = popupModuleForm.elements.entityId.value;
  const title = popupModuleForm.elements.title.value.trim();
  const deviceType2 = normalizedPopupClimateDeviceType(popupModuleForm.elements.deviceType.value);
  if (!numeric || !value) {
    return;
  }
  const modules3 = findCustomPopup(currentProject?.document, selectedPopupId);
  const options = {
    id: editingPopupModuleId || "candidate",
    type: allowed,
    entityId: value,
    ...(title ? {
      title
    } : {}),
    ...(allowed === "climate" ? {
      properties: {
        deviceType: deviceType2
      }
    } : {})
  };
  const chosen = editingPopupModuleId ? (modules3?.modules || []).map(component2 => component2.id === editingPopupModuleId ? {
    ...component2,
    ...options
  } : component2) : [...(modules3?.modules || []), options];
  if (!modules3 || !packPopupModules(chosen, modules3.layout).fits) {
    onError(new Error("当前布局已超过 3 行，可增加列数或删除其它模块。"));
    return;
  }
  closePopupModuleEntityMenu();
  popupModuleDialog.close();
  mutateDocument(customPopups4 => {
    const modules2 = (customPopups4.customPopups || []).find(component2 => component2.id === numeric);
    if (!modules2) {
      return;
    }
    const properties47 = modules2.modules.find(component2 => component2.id === editingPopupModuleId);
    if (properties47) {
      properties47.type = allowed;
      properties47.entityId = value;
      if (title) {
        properties47.title = title;
      } else {
        delete properties47.title;
      }
      if (allowed === "climate") {
        properties47.properties = {
          ...(properties47.properties || {}),
          deviceType: deviceType2
        };
      } else if (properties47.properties?.deviceType) {
        const {
          deviceType: properties,
          ...properties9
        } = properties47.properties;
        if (Object.keys(properties9).length) {
          properties47.properties = properties9;
        } else {
          delete properties47.properties;
        }
      }
      delete properties47.deviceType;
      return;
    }
    modules2.modules.push({
      id: newId("popup-module"),
      type: allowed,
      entityId: value,
      ...(title ? {
        title
      } : {}),
      ...(allowed === "climate" ? {
        properties: {
          deviceType: deviceType2
        }
      } : {})
    });
  });
});
document.addEventListener("pointerdown", event => {
  const value = event.target.closest("#delete-asset-folder-dialog");
  if (!componentContextMenu.contains(event.target)) {
    closeComponentContextMenu();
  }
  if (!value && openMenuState && !openMenuState.button.contains(event.target) && !openMenuState.menu.contains(event.target)) {
    closeMenuState();
  }
  if (!event.target.closest(".dashboard-select-row")) {
    closeProjectActionsMenu();
  }
  if (!event.target.closest(".page-control .page-select-row")) {
    closePageActionsMenu();
  }
  if (!event.target.closest("#popup-list") && !event.target.closest("#popup-actions-menu")) {
    closePopupActionsMenu();
  }
  if (!event.target.closest("#popup-module-entity-picker")) {
    closePopupModuleEntityMenu();
  }
  if (!event.target.closest(".component-popup-entity-picker")) {
    closePopupEntityMenus();
  }
  if (!event.target.closest("#image-entity-picker")) {
    closePickerPanel(imageEntityMenu, imageEntityButton);
  }
  if (!event.target.closest("#weather-entity-picker")) {
    closePickerPanel(weatherEntityMenu, weatherEntityButton);
  }
  if (!event.target.closest("#line-chart-entity-picker")) {
    closePickerPanel(lineChartEntityMenu, lineChartEntityButton);
  }
  if (!event.target.closest("#ibe-entity-picker")) {
    closePickerPanel(ibeEntityMenu, ibeEntityButton);
  }
  if (!event.target.closest("#icon-button-entity-picker")) {
    closePickerPanel(iconButtonEntityMenu, iconButtonEntityButton);
  }
  if (!event.target.closest("#vacuum-map-entity-picker")) {
    closePickerPanel(vacuumMapEntityMenu, vacuumMapEntityButton);
  }
  if (!event.target.closest("#camera-entity-picker")) {
    closePickerPanel(cameraEntityMenu, cameraEntityButton);
  }
  if (!event.target.closest("#air-conditioner-entity-picker")) {
    closePickerPanel(airConditionerEntityMenu, airConditionerEntityButton);
  }
  if (!event.target.closest("#title-button-entity-picker")) {
    closePickerPanel(titleButtonEntityMenu, titleButtonEntityButton);
  }
  if (!lightStatisticsEntityMenu.hidden && !event.target.closest("#light-statistics-entity-picker") && !lightStatisticsEntityMenu.contains(event.target)) {
    closePickerPanel(lightStatisticsEntityMenu, lightStatisticsEntityButton);
    resetLightStatisticsEntityPicker();
  }
  if (!event.target.closest("#light-statistics-action-entity-picker")) {
    closePickerPanel(lightStatisticsActionEntityMenu, lightStatisticsActionEntityButton);
  }
  if (!event.target.closest("#navigation-entity-picker")) {
    closePickerPanel(navigationEntityMenu, navigationEntityButton);
  }
  const options = customSelectStateByEl.get(imageAssetFolder)?.menu;
  if (!value && !event.target.closest("#image-asset-picker") && !options?.contains(event.target)) {
    closePickerPanel(imageAssetMenu, imageAssetButton);
  }
  const ancestorEl = customSelectStateByEl.get(ibeAssetFolder)?.menu;
  if (!value && !event.target.closest("#ibe-asset-picker") && !ancestorEl?.contains(event.target)) {
    closePickerPanel(ibeAssetMenu, ibeAssetButton);
  }
  if (!event.target.closest("#ibe-icon-picker") && !ibeIconMenu.contains(event.target)) {
    closePickerPanel(ibeIconMenu, ibeIconButton);
  }
  if (!event.target.closest("#icon-button-icon-picker") && !iconButtonIconMenu.contains(event.target)) {
    closePickerPanel(iconButtonIconMenu, iconButtonIconButton);
  }
  if (!event.target.closest("#title-button-icon-picker") && !titleButtonIconMenu.contains(event.target)) {
    closePickerPanel(titleButtonIconMenu, titleButtonIconButton);
  }
  if (!event.target.closest("#light-statistics-icon-picker") && !lightStatisticsIconMenu.contains(event.target)) {
    closePickerPanel(lightStatisticsIconMenu, lightStatisticsIconButton);
  }
  if (!event.target.closest("#navigation-icon-picker") && !navigationIconMenu.contains(event.target)) {
    closePickerPanel(navigationIconMenu, navigationIconButton);
  }
});
const scaleOnlyFields = new Set([imageScale, ibeScale, titleButtonScale, lightStatisticsScale, iconButtonScale, airConditionerScale, vacuumMapScale, cameraScale, timeScale, dateScale, weatherScale, lineChartScale, panelFrameScale, navigationScale]);
document.addEventListener("input", target50 => {
  if (selectedComponentIds.size < 2 || !scaleOnlyFields.has(target50.target)) {
    return;
  }
  target50.stopPropagation();
  const number = Number(target50.target.value);
  if (!Number.isFinite(number)) {
    return;
  }
  const length12 = selectionRelativeOffsets(clampNumber(number, 1, 500) / 100);
  if (length12.length) {
    editorRenderer?.previewComponentsTransform(length12, componentId);
  }
}, true);
document.addEventListener("change", target51 => {
  if (selectedComponentIds.size < 2 || !scaleOnlyFields.has(target51.target)) {
    return;
  }
  target51.stopPropagation();
  const number = Number(target51.target.value);
  if (!Number.isFinite(number)) {
    refreshInspector();
    return;
  }
  const idSet = new Set(selectedComponentIds);
  const length13 = selectionRelativeOffsets(clampNumber(number, 1, 500) / 100);
  if (length13.length) {
    mutateDocument(param => {
      for (const componentId2 of length13) {
        if (!idSet.has(componentId2.componentId)) {
          continue;
        }
        const position3 = findComponent(param, componentId2.componentId)?.component;
        if (position3) {
          position3.position = {
            ...(position3.position || {}),
            x: componentId2.x,
            y: componentId2.y
          };
          position3.style = {
            ...(position3.style || {}),
            scale: componentId2.scale
          };
        }
      }
    });
  }
}, true);
document.addEventListener("keydown", event2 => {
  const ancestorEl = event2.target.closest("input, textarea, select, button, [contenteditable=\"true\"], dialog");
  if (editorMode === "edit" && selectedComponentIds.size && !ancestorEl) {
    if ((event2.metaKey || event2.ctrlKey) && !event2.altKey && !event2.shiftKey && event2.key.toLowerCase() === "d") {
      event2.preventDefault();
      bringComponentsToFront([...selectedComponentIds], componentId);
      return;
    }
    if (!event2.metaKey && !event2.ctrlKey && !event2.altKey && (event2.key === "Delete" || event2.key === "Backspace")) {
      event2.preventDefault();
      deleteSelectedComponents([...selectedComponentIds]);
      return;
    }
  }
  const options = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1]
  };
  if (options[event2.key] && editorMode === "edit" && selectedComponentIds.size && !event2.metaKey && !event2.ctrlKey && !event2.altKey && !ancestorEl) {
    event2.preventDefault();
    const chosen = event2.shiftKey ? 10 : 1;
    const [temp, temp2] = options[event2.key];
    nudgeSelectedComponents(temp * chosen, temp2 * chosen);
    return;
  }
  if (event2.key !== "Enter" || event2.isComposing) {
    return;
  }
  const blur = event2.target.closest("input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"button\"]):not([type=\"submit\"])");
  if (blur) {
    event2.preventDefault();
    blur.blur();
  }
});
inspector.addEventListener("scroll", () => {
  hideImageLargePreview();
  positionImageEntityPickerMenu();
  positionEntityPickerMenu("weather");
  positionEntityPickerMenu("line-chart");
  positionEntityPickerMenu("icon-button-effect");
  positionEntityPickerMenu("icon-button");
  positionEntityPickerMenu("vacuum-map");
  positionEntityPickerMenu("camera");
  positionEntityPickerMenu("air-conditioner");
  positionEntityPickerMenu("title-button");
  positionEntityPickerMenu("light-statistics");
  positionLightStatisticsEntityMenu();
  positionImageAssetMenu();
  positionIbeAssetMenu();
  positionIbeIconMenu();
  syncIconButtonIcon2();
  syncTitleButtonIcon2();
  syncLightStatisticsIcon2();
  positionNavigationIconMenu();
  positionGlobalColorPicker();
  for (const closest of document.querySelectorAll("[data-popup-entity-menu]:not([hidden])")) {
    syncPopupEntityButton(closest.closest("[data-action-trigger]"));
  }
});
window.addEventListener("resize", () => {
  syncEditorViewportFit();
  syncComponentTemplateDialogScale();
  closeComponentContextMenu();
  closeMenuState();
  closeOtherPickerPanels();
  closePopupEntityMenus();
  positionGlobalColorPicker();
});
saveBtn.addEventListener("click", async () => {
  await documentMutationQueue.catch(() => {});
  await autosaveDocument();
});
displayDevicesOpenBtn.addEventListener("click", openDisplayDevicesDialog);
displayDevicesCloseBtn.addEventListener("click", () => displayDevicesDialog.close());
displayPairingCustomCode.addEventListener("input", () => {
  displayPairingCustomCode.value = displayPairingCustomCode.value.replace(/\D/g, "").slice(0, 6);
});
displayPairingForm.addEventListener("submit", generateDisplayPairingCode);
logoutBtn.addEventListener("click", async () => {
  if (!blockIfUnsavedChanges()) {
    await apiFetch("/auth/logout", {
      method: "POST"
    });
    window.location.assign("/login");
  }
});
enhanceSelectsIn();
bindColorInputsIn(document);
bindNumberInputsIn(document);
const onColorPickerSvPointerMove = clientX => {
  const left2 = globalColorPickerSv.getBoundingClientRect();
  colorPickerSaturation = clampNumber((clientX.clientX - left2.left) / Math.max(1, left2.width), 0, 1);
  colorPickerValue = 1 - clampNumber((clientX.clientY - left2.top) / Math.max(1, left2.height), 0, 1);
  syncColorPickerFromHsv();
};
globalColorPickerSv.addEventListener("pointerdown", pointerId4 => {
  if (activeColorInput) {
    pointerId4.preventDefault();
    colorPickerPointerId = pointerId4.pointerId;
    globalColorPickerSv.setPointerCapture(pointerId4.pointerId);
    onColorPickerSvPointerMove(pointerId4);
  }
});
globalColorPickerSv.addEventListener("pointermove", value => {
  if (value.pointerId === colorPickerPointerId) {
    onColorPickerSvPointerMove(value);
  }
});
globalColorPickerSv.addEventListener("pointerup", pointerId5 => {
  if (pointerId5.pointerId === colorPickerPointerId) {
    colorPickerPointerId = null;
    globalColorPickerSv.releasePointerCapture(pointerId5.pointerId);
  }
});
globalColorPickerHue.addEventListener("input", () => {
  if (activeColorInput) {
    colorPickerHue = clampNumber(Number(globalColorPickerHue.value), 0, 360);
    syncColorPickerFromHsv();
  }
});
globalColorPickerHex.addEventListener("input", () => {
  const hex2 = normalizedHexColor(globalColorPickerHex.value);
  if (hex2) {
    applyColorPickerHex(hex2, true);
  }
});
globalColorPickerHex.addEventListener("change", () => {
  const value = normalizedHexColor(globalColorPickerHex.value);
  if (value) {
    applyColorPickerHex(value, true);
  } else if (activeColorInput) {
    globalColorPickerHex.value = String(activeColorInput.value || "").toUpperCase();
  }
});
const syncColorPickerRgbInputs = () => {
  if (!activeColorInput) {
    return;
  }
  const clamped = clampNumber(Number(globalColorPickerR.value), 0, 255);
  const clamped2 = clampNumber(Number(globalColorPickerG.value), 0, 255);
  const clamped3 = clampNumber(Number(globalColorPickerB.value), 0, 255);
  if ([clamped, clamped2, clamped3].every(Number.isFinite)) {
    applyColorPickerHex(rgbToHex(clamped, clamped2, clamped3), true);
  }
};
for (const temp2 of [globalColorPickerR, globalColorPickerG, globalColorPickerB]) {
  temp2.addEventListener("input", syncColorPickerRgbInputs);
  temp2.addEventListener("change", syncColorPickerRgbInputs);
}
globalColorPickerCopyBtn.addEventListener("click", async () => {
  if (activeColorInput) {
    try {
      await copyTextToClipboard(String(activeColorInput.value || "").toUpperCase());
      window.clearTimeout(colorCopyResetTimer);
      globalColorPickerCopyBtn.classList.add("copied");
      colorCopyResetTimer = window.setTimeout(() => globalColorPickerCopyBtn.classList.remove("copied"), 1200);
    } catch (temp) {
      onError(temp);
    }
  }
});
globalColorPickerPasteBtn.addEventListener("click", async () => {
  if (activeColorInput) {
    try {
      const asyncResult = await navigator.clipboard.readText();
      const toUpperCase = normalizedHexColor(asyncResult);
      if (!toUpperCase) {
        throw new Error("剪贴板中没有可用的十六进制颜色值。");
      }
      globalColorPickerHex.value = toUpperCase.toUpperCase();
      applyColorPickerHex(toUpperCase, true);
      globalColorPickerPasteBtn.classList.add("copied");
      window.setTimeout(() => globalColorPickerPasteBtn.classList.remove("copied"), 1200);
    } catch (temp) {
      onError(temp);
    }
  }
});
document.addEventListener("click", target52 => {
  const matches2 = target52.target.closest("button");
  if (!matches2) {
    return;
  }
  let flag = false;
  if ([navigationIconButton, ibeIconButton, iconButtonIconButton, titleButtonIconButton, lightStatisticsIconButton].includes(matches2)) {
    flag = loadNavigationIconOptions(matches2);
  } else if (matches2 === lightStatisticsEntityButton) {
    flag = openLightStatisticsEntityPicker();
  } else if (matches2.matches("[data-popup-entity-button]")) {
    flag = openPopupEntityPickerForTrigger(matches2);
  } else if (matches2 === popupModuleEntityButton) {
    flag = openPopupModuleEntityPicker();
  } else if ([imageAssetButton, ibeAssetButton].includes(matches2)) {
    flag = withSelectedComponent11(matches2);
  } else {
    flag = openEntityPickerForButton(matches2);
  }
  if (flag) {
    target52.preventDefault();
    target52.stopImmediatePropagation();
  }
}, true);
document.addEventListener("pointerdown", target53 => {
  if (!globalColorPicker.hidden && !globalColorPicker.contains(target53.target) && target53.target !== activeColorInput) {
    closeGlobalColorPicker();
  }
});
new MutationObserver(param => {
  for (const addedNodes of param) {
    for (const temp of addedNodes.addedNodes) {
      if (temp instanceof HTMLElement) {
        enhanceSelectsIn(temp);
        bindColorInputsIn(temp);
        bindNumberInputsIn(temp);
      }
    }
  }
}).observe(document.body, {
  childList: true,
  subtree: true
});
deferHiddenEditorDialogs();
setEditorMode("edit");
window.setInterval(() => {
  if (document.visibilityState === "visible") {
    ensureHaBootstrap().catch(() => {});
    loadLicenseStatus().catch(() => {});
  }
}, 15000);
window.setInterval(() => {
  if (document.visibilityState === "visible") {
    refreshAssetsIfChanged().catch(() => {});
  }
}, 30000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    ensureHaBootstrap().catch(() => {});
    refreshAssetsIfChanged().catch(() => {});
    loadLicenseStatus().catch(() => {});
  }
});
Promise.all([fetchAuthMe(), loadLicenseStatus(), loadUiPacks(), ensureHaBootstrap({
  preserveForm: false
}), loadProjectList(), loadAssets(), ensureEntitiesLoaded()]).then(() => renderComponentTree()).catch(onError);
