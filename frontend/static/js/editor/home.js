import {
  PanelRenderer,
  airflowCanvasOffsetBounds,
  setBuiltinAssetVersions,
  syncedLineChartProperties } from
"../../renderer/renderer.js?v=20260821-electric-bed-load-v20-generic-popup-v1-color-picker-v3-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-realtime-capabilities-v2-20260822-line-chart-performance-v6-20260822-button-hit-area-v2-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-airflow-canvas-drag-v1-20260823-effect-light-visual-v1-20260823-effect-variant-v1-20260823-touch-popup-motion-v12-20260823-navigation-current-page-v1-20260824-light-statistics-v5-20260825-effect-load-queue-v2-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-bath-heater-primary-v1-20260825-editor-media-preview-v1-20260825-history-mode-switch-v1-20260826-button-sound-v2-20260826-line-chart-initial-state-v1-20260827-dashboard-live-scope-v1-20260827-light-preset-settle-v1-20260827-runtime-placeholder-retry-v2-20260828-legacy-group-compat-v2-vacuum-dialog-layout-v1-20260830-light-statistics-selection-v1-20260830-editor-local-refresh-v4-20260831-background-media-v1-20260831-bound-entity-v1-20260831-vacuum-map-background-v1-20260831-action-rules-v1-20260831-sensor-popup-v1-20260901-renderer-transform-geometry-v1-20260901-renderer-effect-geometry-v2-20260901-renderer-light-runtime-v1-20260901-renderer-vacuum-runtime-v1-20260901-renderer-cover-runtime-v1-20260901-renderer-dialog-motion-v1-20260901-renderer-runtime-caches-v1-20260901-renderer-presence-runtime-v1-20260901-renderer-light-statistics-runtime-v1-20260901-renderer-line-chart-runtime-v1-20260901-renderer-door-window-runtime-v1-20260901-renderer-weather-chart-runtime-v2-20260901-renderer-date-time-runtime-v1-20260901-renderer-runtime-document-v1-20260901-camera-prewarm-v1-20260901-hidden-selection-bounds-v2-20260901-effect-state-stability-v1-20260901-vacuum-map-retry-v1-20260901-light-effect-first-frame-v1-20260901-light-effect-toggle-confirm-v1-20260901-popup-module-note-v1-20260901-runtime-dialog-layout-v8-20260901-light-effect-layering-v2-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-climate-capability-options-v3-20260904-auto-diagram-floor-v1-20260904-climate-option-fit-v3-20260905-client-log-v1-20260907-interaction3d-v1-v2-20260907-i3d-align-v1-20260910-tdz-listcomponents-v1";
import {
  lightStatisticsEntityStateStatus,
  lightStatisticsEntitySupport } from
"../../renderer/registry.js?v=20260814-tablet-resolution-v84-20260818-airer-v1-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-line-chart-performance-v3-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-effect-variant-v1-20260823-navigation-current-page-v1-20260824-light-statistics-v6-20260825-effect-load-queue-v1-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-editor-media-preview-v1-20260828-count-statistics-v1-20260831-background-media-v1-20260831-vacuum-map-background-v1-20260901-renderer-presence-runtime-v1-20260901-renderer-light-statistics-runtime-v1-20260901-renderer-line-chart-runtime-v1-20260901-renderer-door-window-runtime-v1-20260901-renderer-weather-chart-v2-20260901-renderer-date-time-runtime-v1-20260901-camera-prewarm-v1-20260901-vacuum-map-retry-v1-20260901-light-effect-first-frame-v1-20260901-light-effect-toggle-confirm-v1-20260901-light-effect-layering-v2-20260901-light-effect-color-cache-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260905-client-log-v1-20260907-interaction3d-v1-20260907-i3d-align-v1";
import {
  applyUiPackToDocument,
  createComponentFromTemplate,
  dateComponentDimensions,
  ensureUiPackRuntime,
  listComponentTemplates,
  timeComponentDimensions,
  weatherComponentDimensions } from
"../ui-packs/loader.js?v=20260811-water-heater-popup-v44-20260815-component-thumbnails-v2-20260822-light-feedback-controls-v1-20260824-light-statistics-v6-20260828-count-statistics-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260907-interaction3d-v1";
import {
  clone,
  newId,
  normalizedHexColor,
  hexToRgb,
  rgbToHex,
  rgbToHsv,
  hsvToRgb,
  roundField,
  clampNumber,
  normalizedFontWeight } from
"./editor-utils.js?v=20260831-editor-utils-v1";
import {
  packPopupModules,
  popupLayoutColumns,
  popupLayoutMetrics } from
"./popup-layout.js?v=20260821-electric-bed-combo-v2";
import {
  countComponentsOutsideCanvas,
  resizeDashboardDocument } from
"./dashboard-resize.js?v=20260820-dashboard-resize-v439";
import {
  copyComponentsAcrossDocuments,
  copyComponentTargets,
  copyComponentsToTarget } from
"./component-page-copy.js?v=20260826-cross-dashboard-copy-v4";
import {
  RELATED_ENTITY_DOMAIN_LABELS,
  legacyRelatedEntityIds,
  manualRelatedEntityConfig,
  relatedEntityIsAvailable,
  relatedEntityLabel,
  relatedEntityNeedsConfirmation,
  relatedPopupCandidates,
  relatedPopupContext,
  relatedPopupSelectionLimit,
  selectedRelatedEntityIds } from
"./related-entities.js?v=20260825-bath-heater-primary-v1";
import { createIconVisibilityVirtualEntity } from "./virtual-entities.js?v=20260822-icon-visibility-v1";
import { createButtonSound } from "../shared/sound-effects.js?v=20260826-button-sound-v2";
import {
  deferHiddenEditorDialogs,
  installSettingsDialogBackdropGuard } from
"./editor-dialogs.js?v=20260830-editor-dialogs-v1";
import { createEditorPickerElements } from "./editor-picker-elements.js?v=20260902-asset-display-name-v1";
import {
  EDITOR_PICKER_PAGE_SIZES,
  editorEntityPickerInitialPage,
  editorEntityPickerPage } from
"./editor-picker-pagination.js?v=20260830-editor-picker-pagination-v1";
import { createEditorPickerQueries } from "./editor-picker-queries.js?v=20260830-editor-picker-queries-v1";
import { createEditorAssetMatcher } from "./editor-asset-queries.js?v=20260830-editor-asset-queries-v1";
import { createEditorPickerLifecycle } from "./editor-picker-lifecycle.js?v=20260831-editor-picker-lifecycle-v1";
import { createEditorAssetToolbar } from "./editor-asset-toolbar.js?v=20260902-asset-folder-delete-v1";
import {
  ACTION_TYPES,
  TOGGLE_ENTITY_DOMAINS,
  actionNeedsCurrentEntity,
  actionPopupData,
  componentActionIsSupported,
  entityIdSupportsToggle } from
"./action-rules.js?v=20260831-action-rules-v1";
import {
  componentDirectLocation,
  findComponent,
  findComponentInItems,
  findComponentLocation } from
"./component-tree.js?v=20260831-component-tree-v1";
import {
  applyCollectionLayerOrder,
  componentLabel,
  copiedComponentLabel,
  ensureSharedComponentReference,
  groupNameForCollection,
  nextTemplateInstanceName,
  refreshComponentIds,
  syncSharedComponentReferenceOrder } from
"./editor-component-collections.js?v=20260831-editor-component-collections-v1-20260907-interaction3d-v1";
import {
  fitInspectorComponentToDimensions,
  iconButtonEffectInspectorLayer,
  inspectorComponentMetrics,
  setInspectorToggle } from
"./editor-basic-inspectors.js?v=20260901-editor-basic-inspectors-v4";
import { createInteraction3dEditorPickers } from "../../modules/interaction3d/editor-pickers.js?v=20260906-i3d-buttons-v1";
import {
  guardInteraction3dChanges,
  renderInteraction3dInspector,
  renderInteraction3dThumbnail,
  updateInteraction3dCard } from
"../../modules/interaction3d/editor.js?v=20260907-browser-compat-v1";
import {
  clonePageWithFreshIds,
  findCustomPopup,
  greatestCommonDivisor,
  normalizedPopupClimateDeviceType,
  popupModuleDropPosition,
  popupModuleEntityRecommended,
  popupModuleTypeLabel,
  reorderedPopupModules,
  uniquePagePath } from
"./editor-document-management.js?v=20260901-editor-document-management-v1";
import {
  documentSignature,
  editorComponentEntries,
  editorComponentStructure,
  editorDocumentFrameSignature,
  recoveryStorageKey } from
"./editor-history.js?v=20260901-editor-history-v1";
import {
  DEFAULT_BASE_LIGHTING,
  normalizeBaseLighting } from
"../../3d-studio/studio-normalization.js?v=20260903-studio-normalization-v2";
const r = (selector) => document.querySelector(selector);
installSettingsDialogBackdropGuard();
const WC = 1020;
const hm = 2;
const RC = 1920;
const HC = 1080;
const jC = 1.1;
const qC = r(".editor-header");
const GC = r(".editor-shell");
function bm() {
  const count = Math.max(1, qC.offsetHeight + GC.offsetHeight);
  const value = Math.min(1, window.innerWidth / WC, window.innerHeight / count);
  const needsViewportFit = value < 0.999;
  document.documentElement.classList.toggle("editor-viewport-fit", needsViewportFit);
  document.documentElement.style.setProperty(
    "--editor-layout-height",
    count + "px"
  );
  document.documentElement.style.setProperty(
    "--editor-viewport-scale",
    String(value)
  );
}
function ym() {
  const count = Math.max(
    0.1,
    jC * Math.min(window.innerWidth / RC, window.innerHeight / HC)
  );
  document.documentElement.style.setProperty(
    "--component-template-dialog-scale",
    String(count)
  );
}
bm();
ym();
const UC = r("#logout");
const vm = r("#save");
const Ji = r("#license-open");
const Zi = r("#license-dialog");
const _C = r("#license-close");
const _o = r("#license-form");
const ds = r("#license-message");
const YC = r("#license-detail-indicator");
const XC = r("#license-detail-status");
const KC = r("#license-detail-edition");
const wm = r("#license-detail-error");
const us = r("#ha-open");
const to = r("#ha-dialog");
const JC = r("#ha-close");
const ut = r("#ha-form");
const gl = r("#ha-test");
const no = r("#ha-message");
const ZC = r("#ha-sync-state");
const QC = r("#ha-sync-detail");
const eS = r("#ha-sync-overview");
const tS = r("#ha-connection-view");
const Cm = r("#ha-detail-indicator");
const nS = r("#ha-detail-name");
const Sm = r("#ha-detail-status");
const xm = r("#ha-detail-url");
const oS = r("#ha-detail-version");
const iS = r("#ha-detail-counts");
const Nm = r("#ha-detail-error");
const aS = r("#ha-edit");
const rS = r("#ha-delete");
const Em = r("#ha-edit-cancel");
const oo = r("#delete-ha-dialog");
const sS = r("#delete-ha-close");
const cS = r("#delete-ha-cancel");
const ps = r("#delete-ha-form");
const ms = r("#delete-ha-message");
const lS = r("#project-new");
const Le = r("#project-select");
const fs = r("#project-actions-button");
const gs = r("#project-actions-menu");
const dS = r("#project-floorplan-open");
const Lm = r("#ui-pack-open");
const uS = r("#ui-pack-current-name");
const pS = r("#ui-pack-current-version");
const io = r("#ui-pack-dialog");
const mS = r("#ui-pack-close");
const hl = r("#ui-pack-list");
const hs = r("#ui-pack-message");
const fS = r("#navigator-content");
const gS = r(".page-control");
const hS = r(".popup-control");
const bl = r("#show-page-editor");
const yl = r("#show-popup-editor");
const Im = r("#page-new");
const W = r("#page-select");
const bs = r("#page-actions-button");
const ys = r("#page-actions-menu");
const vl = r("#default-page-action");
const Tm = r("#popup-new");
const We = r("#popup-select");
const Yo = r("#popup-list");
const ao = r("#popup-actions-button");
const Ft = r("#popup-actions-menu");
const Am = r("#show-shared-components");
const Pm = r("#show-page-components");
const vs = r("#add-component-button");
const Xo = r("#component-template-dialog");
const bS = r("#component-template-close");
const yS = r("#component-template-scope");
const wl = r("#component-template-list");
const Cl = r("#shared-component-list");
const Sl = r("#page-component-list");
const Pe = r("#component-context-menu");
const Yt = r("#project-dialog");
const vS = r("#project-dialog-kicker");
const wS = r("#project-dialog-title");
const CS = r("#project-close");
const SS = r("#project-cancel");
const Qi = r("#project-form");
const xl = r("#project-submit");
const ea = r("#project-message");
const xS = r("#project-template-fields");
const Nl = r("#project-template-options");
const Ko = r("#project-preview-dialog");
const NS = r("#project-preview-title");
const ES = r("#project-preview-count");
const km = r("#project-preview-image");
const LS = r("#project-preview-previous");
const IS = r("#project-preview-next");
const TS = r("#project-preview-close");
const ro = r("#project-canvas-fields");
const ot = r("#project-canvas-width");
const it = r("#project-canvas-height");
const Mm = r("#project-aspect-ratio");
const ta = r("#project-aspect-lock");
const AS = r("#project-aspect-lock-label");
const Om = r("#project-canvas-hint");
const PS = r("#project-content-lock-fields");
const Bm = r("#project-content-lock");
const ws = r("#project-resize-warning-dialog");
const kS = r("#project-resize-warning-text");
const MS = r("#project-resize-warning-close");
const OS = r("#project-resize-warning-cancel");
const BS = r("#project-resize-warning-confirm");
const so = r("#page-dialog");
const $S = r("#page-dialog-kicker");
const FS = r("#page-dialog-title");
const DS = r("#page-close");
const zS = r("#page-cancel");
const Cs = r("#page-form");
const El = r("#page-submit");
const Ll = r("#page-message");
const Ct = r("#component-group-rename-dialog");
const VS = r("#component-group-rename-close");
const WS = r("#component-group-rename-cancel");
const $m = r("#component-group-rename-form");
const Fm = r("#component-group-rename-input");
const Dm = r("#component-group-rename-message");
const Dt = r("#editor-canvas");
const Jo = r(".workspace");
const RS = r("#workspace-title");
const Il = r("#workspace-resolution");
const Be = document.createElement("button");
Be.id = "dashboard-sound-toggle";
Be.className = "workspace-sound-toggle";
Be.type = "button";
Be.setAttribute("aria-pressed", "true");
Be.setAttribute("aria-label", "关闭仪表盘音效");
Be.title = "关闭仪表盘音效";
Be.innerHTML =
'<svg class="sound-icon sound-icon-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M16 9.5a4 4 0 0 1 0 5"/><path d="M18.5 7a7.5 7.5 0 0 1 0 10"/></svg><svg class="sound-icon sound-icon-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="m17 9 5 6M22 9l-5 6"/></svg><span class="sound-label">按键音效</span>';
Il.after(Be);
const HS = r("#dashboard-display-hint");
const na = r("#dashboard-display-link");
const jS = r("#display-devices-open");
const Tl = r("#display-devices-dialog");
const qS = r("#display-devices-close");
const zm = r("#display-pairing-form");
const GS = r("#display-pairing-name");
const Ss = r("#display-pairing-custom-code");
const Vm = r("#display-pairing-generate");
const US = r("#display-device-count");
const Al = r("#display-device-list");
const Zo = r("#display-devices-message");
const Wm = r("#show-editor-preview");
const Rm = r("#show-dashboard-preview");
const Hm = r("#open-home-assistant");
const oa = r("#dashboard-preview");
const yn = r("#custom-popup-editor");
const Qo = createButtonSound();
function Pl() {
  if (!Be) {
    return;
  }
  const value = Te === "edit";
  Be.hidden = !value;
  Be.disabled = !h;
  if (
  h &&
  typeof h.document?.soundEnabled == "boolean" &&
  Qo.isEnabled() !== h.document.soundEnabled)
  {
    Qo.setEnabled(h.document.soundEnabled);
  }
  Be.setAttribute("aria-pressed", String(Qo.isEnabled()));
  Be.title = Qo.isEnabled() ? "关闭仪表盘音效" : "开启仪表盘音效";
  Be.setAttribute("aria-label", Be.title);
  Be.classList.toggle("is-muted", !Qo.isEnabled());
}
const St = r("#delete-project-dialog");
const _S = r("#delete-project-close");
const YS = r("#delete-project-cancel");
const xs = r("#delete-project-form");
const XS = r("#delete-project-name");
const Ns = r("#delete-project-message");
const Xt = r("#delete-page-dialog");
const KS = r("#delete-page-close");
const JS = r("#delete-page-cancel");
const kl = r("#delete-page-confirm");
const ZS = r("#delete-page-name");
const Es = r("#delete-page-message");
const Kt = r("#delete-component-dialog");
const QS = r("#delete-component-close");
const e1 = r("#delete-component-cancel");
const t1 = r("#delete-component-confirm");
const jm = r("#delete-component-name");
const at = r("#copy-component-page-dialog");
const n1 = r("#copy-component-page-close");
const o1 = r("#copy-component-page-cancel");
const Ml = r("#copy-component-page-form");
const i1 = r("#copy-component-page-name");
const vn = r("#copy-component-page-scope");
const a1 = r("#copy-component-page-project-field");
const ei = r("#copy-component-page-project");
const TI = r("#copy-component-page-target-field");
const r1 = r("#copy-component-page-target-label");
const co = r("#copy-component-page-target");
const Ls = r("#copy-component-scale-options");
const qm = r("#copy-component-resolution-summary");
const wn = r("#copy-component-page-message");
const lo = r("#copy-component-page-submit");
const ti = r("#copy-component-success-dialog");
const s1 = r("#copy-component-success-message");
const c1 = r("#copy-component-success-stay");
const l1 = r("#copy-component-success-go");
const uo = r("#error-dialog");
const d1 = r("#error-dialog-close");
const u1 = r("#error-dialog-confirm");
const p1 = r("#error-dialog-message");
const ni = r("#recovery-dialog");
const m1 = r("#recovery-discard");
const f1 = r("#recovery-restore");
const Gm = r("#undo");
const Um = r("#redo");
const Ol = r("#inspector-empty");
const g1 = r(".inspector");
const ia = r("#image-inspector");
const h1 = r("#image-type");
const Is = r("#image-label");
const AI = r("#image-entity-picker");
const oi = r("#image-entity-button");
const aa = r("#image-entity-menu");
const ra = r("#image-entity-search");
const _m = r("#image-entity-options");
const PI = r("#image-asset-picker");
const Cn = r("#image-asset-button");
const Re = r("#image-asset-menu");
const po = r("#image-asset-folder");
const Sn = r("#image-asset-search");
const zt = r("#image-asset-options");
const Ym = r("#image-asset-upload");
const sa = r("#image-asset-upload-input");
const b1 = r("#image-asset-upload-hint");
const Jt = r("#image-asset-large-preview");
const Bl = r("#image-asset-large-preview-image");
const y1 = r("#image-asset-large-preview-name");
const pt = r("#global-color-picker");
const ii = r("#global-color-picker-sv");
const Xm = r("#global-color-picker-marker");
const $l = r("#global-color-picker-hue");
const v1 = r("#global-color-picker-swatch");
const xn = r("#global-color-picker-hex");
const Fl = r("#global-color-picker-copy");
const Dl = r("#global-color-picker-paste");
const zl = r("#global-color-picker-r");
const Vl = r("#global-color-picker-g");
const Wl = r("#global-color-picker-b");
const ca = r("#image-opacity");
const Km = r("#image-layout-options");
const mo = r("#image-left");
const fo = r("#image-top");
const Nn = r("#image-scale");
const go = r("#image-rotation");
const Rl = r("#floorplan-auto-diagram-inspector");
const ai = r("#floorplan-auto-diagram-status");
const xt = r("#floorplan-auto-diagram-open-studio");
const la = r("#floorplan-auto-diagram-view-toggle");
const Hl = r("#floorplan-auto-diagram-label");
const da = r("#floorplan-auto-diagram-folder");
const Jm = r("#floorplan-auto-diagram-layout");
const ua = r("#floorplan-auto-diagram-left");
const pa = r("#floorplan-auto-diagram-top");
const ma = r("#floorplan-auto-diagram-width");
const fa = r("#floorplan-auto-diagram-height");
const ga = r("#floorplan-auto-diagram-scale");
const ha = r("#floorplan-auto-diagram-rotation");
const Zt = r("#floorplan-auto-diagram-floor");
const Zm = r("#floorplan-auto-diagram-camera-view");
const Qm = r("#floorplan-auto-diagram-camera-mode");
const ba = r("#floorplan-auto-diagram-focal-length");
const ef = r("#floorplan-auto-diagram-rotate-top");
const tf = r("#floorplan-auto-diagram-open-base-lighting");
const w1 = r("#floorplan-auto-diagram-bindings");
const nf = r("#floorplan-auto-diagram-binding-list");
const $e = r("#floorplan-auto-lighting-panel");
const ya = r("#floorplan-auto-lighting-handle");
const C1 = r("#floorplan-auto-lighting-close");
const S1 = r("#floorplan-auto-lighting-reset");
const x1 = r("#floorplan-auto-lighting-save");
const ri = r("#floorplan-auto-lighting-status");
const jl = [...document.querySelectorAll("[data-floorplan-base-light]")];
let va = "";
let ql = normalizeBaseLighting(DEFAULT_BASE_LIGHTING);
let Nt = null;
const N1 = r("#component-action-controls");
const mt = r("#floorplan-auto-diagram-dialog");
const E1 = r("#floorplan-auto-diagram-close");
const of = r("#floorplan-auto-diagram-guide");
const L1 = r("#floorplan-auto-diagram-later");
const I1 = r("#floorplan-auto-diagram-continue");
const si = r("#icon-button-effect-inspector");
const af = r("#ibe-label");
const Gl = r("#ibe-entity-button");
const Ts = r("#ibe-entity-menu");
const T1 = r("#ibe-entity-search");
const A1 = r("#ibe-entity-options");
const Ul = r("#ibe-color-temperature-realtime");
const _l = r("#ibe-brightness-realtime");
const Yl = r("#ibe-preview-state");
const rf = r("#ibe-layer-options");
const P1 = r("#ibe-button-section");
const k1 = r("#ibe-effect-section");
const sf = r("#ibe-button-visible");
const cf = r("#ibe-effect-visible");
const M1 = r("#ibe-button-transform-section");
const O1 = r("#ibe-action-section");
const Qt = r("#ibe-icon-button");
const wa = r("#ibe-icon-copy");
const Et = r("#ibe-icon-menu");
const Ca = r("#ibe-icon-search");
const Sa = r("#ibe-icon-options");
const Xl = r("#ibe-icon-off-color");
const Kl = r("#ibe-icon-on-color");
const lf = r("#ibe-icon-size");
const Jl = r("#ibe-button-off-color");
const Zl = r("#ibe-button-on-color");
const df = r("#ibe-button-opacity");
const uf = r("#ibe-frame-color");
const pf = r("#ibe-frame-width");
const mf = r("#ibe-frame-opacity");
const ff = r("#ibe-radius");
const gf = r("#ibe-glow-color");
const Ql = r("#ibe-glow-off-strength");
const ed = r("#ibe-glow-on-strength");
const En = r("#ibe-asset-button");
const He = r("#ibe-asset-menu");
const ho = r("#ibe-asset-folder");
const Ln = r("#ibe-asset-search");
const en = r("#ibe-asset-options");
const hf = r("#ibe-asset-upload");
const xa = r("#ibe-asset-upload-input");
const B1 = r("#ibe-asset-upload-hint");
const bf = r("#ibe-effect-opacity");
const yf = r("#ibe-effect-fade-duration");
const vf = r("#ibe-effect-layout-options");
const $1 = r("#ibe-effect-align-image");
const td = r("#ibe-effect-left");
const nd = r("#ibe-effect-top");
const od = r("#ibe-effect-scale");
const id = r("#ibe-effect-rotation");
const F1 = r("#ibe-effect-size-hint");
const In = r("#effect-image-align-dialog");
const D1 = r("#effect-image-align-close");
const z1 = r("#effect-image-align-cancel");
const wf = r("#effect-image-align-confirm");
const Cf = r("#effect-image-align-options");
const As = r("#effect-image-align-message");
const Na = r("#ibe-left");
const Ea = r("#ibe-top");
const ci = r("#ibe-width");
const li = r("#ibe-height");
const bo = r("#ibe-scale");
const di = r("#ibe-rotation");
const V1 = r("#ibe-action-controls");
const Ps = r("#ibe-apply-style");
const W1 = r("#ibe-apply-count");
const ks = r("#title-button-inspector");
const Sf = r("#title-button-label");
const ad = r("#title-button-entity-button");
const Ms = r("#title-button-entity-menu");
const R1 = r("#title-button-entity-search");
const H1 = r("#title-button-entity-options");
const xf = r("#title-button-main-visible");
const Nf = r("#title-button-secondary-visible");
const Ef = r("#title-button-main-text");
const Os = r("#title-button-secondary-line-1");
const Bs = r("#title-button-secondary-line-2");
const Lf = r("#title-button-main-color");
const If = r("#title-button-secondary-color");
const Tf = r("#title-button-main-size");
const Af = r("#title-button-secondary-size");
const Pf = r("#title-button-main-weight");
const kf = r("#title-button-secondary-weight");
const Mf = r("#title-button-main-spacing");
const Of = r("#title-button-secondary-spacing");
const Bf = r("#title-button-secondary-line-gap");
const $f = r("#title-button-main-left");
const Ff = r("#title-button-main-top");
const Df = r("#title-button-secondary-left");
const zf = r("#title-button-secondary-top");
const Vf = r("#title-button-icon-visible");
const tn = r("#title-button-icon-button");
const La = r("#title-button-icon-copy");
const je = r("#title-button-icon-menu");
const Ia = r("#title-button-icon-search");
const Ta = r("#title-button-icon-options");
const Wf = r("#title-button-icon-color");
const Rf = r("#title-button-icon-size");
const Hf = r("#title-button-icon-left");
const jf = r("#title-button-icon-top");
const qf = r("#title-button-frame-color");
const Gf = r("#title-button-frame-visible");
const Uf = r("#title-button-frame-width");
const _f = r("#title-button-frame-size");
const Yf = r("#title-button-frame-spacing");
const Xf = r("#title-button-frame-offset-x");
const Kf = r("#title-button-frame-offset-y");
const Jf = r("#title-button-marker-visible");
const Zf = r("#title-button-marker-color");
const Qf = r("#title-button-marker-size");
const eg = r("#title-button-marker-left");
const tg = r("#title-button-marker-top");
const rd = r("#title-button-left");
const sd = r("#title-button-top");
const $s = r("#title-button-width");
const Fs = r("#title-button-height");
const Aa = r("#title-button-scale");
const Ds = r("#title-button-rotation");
const j1 = r("#title-button-action-controls");
const zs = r("#title-button-apply-style");
const q1 = r("#title-button-apply-count");
const cd = r("#light-statistics-inspector");
const ng = r("#light-statistics-label");
const og = r("#light-statistics-title");
const rt = r("#light-statistics-entity-button");
const Ie = r("#light-statistics-entity-menu");
const Pa = r("#light-statistics-entity-search");
const ka = r("#light-statistics-entity-options");
const ig = r("#light-statistics-entity-pending");
const kI = r("#light-statistics-pending-name");
const MI = r("#light-statistics-pending-detail");
const G1 = r("#light-statistics-entity-confirm");
const ld = r("#light-statistics-entity-message");
const ag = r("#light-statistics-entity-list");
const U1 = r("#light-statistics-entity-count");
const dd = r("#light-statistics-action-entity-button");
const Vs = r("#light-statistics-action-entity-menu");
const _1 = r("#light-statistics-action-entity-search");
const Y1 = r("#light-statistics-action-entity-options");
const X1 = r("#light-statistics-action-note");
const K1 = r("#light-statistics-action-controls");
const nn = r("#light-statistics-icon-button");
const Ma = r("#light-statistics-icon-copy");
const qe = r("#light-statistics-icon-menu");
const Oa = r("#light-statistics-icon-search");
const Ba = r("#light-statistics-icon-options");
const rg = r("#light-statistics-icon-visible");
const sg = r("#light-statistics-icon-color");
const cg = r("#light-statistics-icon-active-color");
const lg = r("#light-statistics-icon-size");
const dg = r("#light-statistics-title-visible");
const ug = r("#light-statistics-title-color");
const pg = r("#light-statistics-title-size");
const mg = r("#light-statistics-title-weight");
const fg = r("#light-statistics-title-spacing");
const gg = r("#light-statistics-count-visible");
const hg = r("#light-statistics-count-color");
const bg = r("#light-statistics-count-active-color");
const yg = r("#light-statistics-count-size");
const vg = r("#light-statistics-count-weight");
const wg = r("#light-statistics-count-spacing");
const Cg = r("#light-statistics-icon-gap");
const Sg = r("#light-statistics-count-gap");
const ud = r("#light-statistics-left");
const pd = r("#light-statistics-top");
const Ws = r("#light-statistics-width");
const Rs = r("#light-statistics-height");
const $a = r("#light-statistics-scale");
const Hs = r("#light-statistics-rotation");
const ui = r("#icon-button-inspector");
const J1 = r("#icon-button-type-label");
const Z1 = r("#icon-button-type");
const xg = r("#icon-button-label");
const Ng = r("#presence-sensor-kind-label");
const Fa = r("#presence-sensor-kind");
const pi = r("#icon-button-entity-button");
const mi = r("#icon-button-entity-menu");
const md = r("#icon-button-entity-search");
const fd = r("#icon-button-entity-options");
const gd = r("#cover-settings-inspector");
const Eg = r("#cover-settings-kind");
const Lg = r("#cover-settings-direction");
const Ig = r("#cover-settings-motor-direction");
const js = r("#icon-button-preview-state");
const Q1 = r("#icon-button-preview-control");
const Lt = r("#icon-button-icon-button");
const Da = r("#icon-button-icon-copy");
const It = r("#icon-button-icon-menu");
const za = r("#icon-button-icon-search");
const Va = r("#icon-button-icon-options");
const fi = r("#icon-button-icon-color");
const Tg = r("#icon-button-icon-color-label");
const hd = r("#device-button-icon-visible");
const bd = r("#device-button-icon-on-color");
const Ag = r("#device-button-icon-on-color-label");
const Pg = r("#device-button-badge-color");
const ex = r("#device-button-badge-color-label");
const kg = r("#device-button-badge-opacity");
const tx = r("#device-button-badge-opacity-label");
const Mg = r("#icon-button-icon-size");
const nx = r("#icon-button-icon-size-label");
const Og = r("#device-button-symbol-size");
const ox = r("#device-button-symbol-size-label");
const Bg = r("#device-button-badge-size");
const ix = r("#device-button-badge-size-label");
const qs = r("#device-button-state-precision");
const ax = r("#device-button-state-precision-label");
const yd = r("#icon-button-icon-off-opacity");
const vd = r("#icon-button-icon-on-opacity");
const rx = r("#icon-button-icon-off-opacity-label");
const sx = r("#icon-button-icon-on-opacity-label");
const wd = r("#icon-button-icon-left");
const Cd = r("#icon-button-icon-top");
const Sd = r("#icon-button-main-text");
const xd = r("#icon-button-secondary-text");
const $g = r("#icon-button-main-heading");
const Nd = r("#device-button-main-visible");
const cx = r("#icon-button-secondary-heading");
const Ed = r("#device-button-secondary-visible");
const lx = r("#icon-button-main-content-label");
const dx = r("#icon-button-secondary-content-label");
const Fg = r("#icon-button-main-color");
const Dg = r("#icon-button-secondary-color");
const Ld = r("#icon-button-main-off-opacity");
const Id = r("#icon-button-main-on-opacity");
const Td = r("#icon-button-secondary-off-opacity");
const Ad = r("#icon-button-secondary-on-opacity");
const ux = r("#icon-button-main-off-opacity-label");
const px = r("#icon-button-main-on-opacity-label");
const mx = r("#icon-button-secondary-off-opacity-label");
const fx = r("#icon-button-secondary-on-opacity-label");
const zg = r("#icon-button-main-size");
const Vg = r("#icon-button-secondary-size");
const Wg = r("#icon-button-main-weight");
const Rg = r("#icon-button-secondary-weight");
const Hg = r("#icon-button-main-spacing");
const jg = r("#icon-button-secondary-spacing");
const qg = r("#icon-button-main-left");
const Gg = r("#icon-button-main-top");
const Ug = r("#icon-button-secondary-left");
const _g = r("#icon-button-secondary-top");
const Pd = r("#icon-button-on-fill-visible");
const gx = r("#icon-button-fill-section");
const kd = r("#icon-button-on-fill-color");
const Md = r("#icon-button-on-fill-strength");
const Yg = r("#icon-button-on-fill-fade-duration");
const Xg = r("#icon-button-frame-visible");
const hx = r("#icon-button-frame-section");
const Kg = r("#icon-button-frame-width");
const Jg = r("#icon-button-frame-angle");
const Od = r("#icon-button-frame-off-opacity");
const Bd = r("#icon-button-frame-on-opacity");
const Zg = r("#icon-button-cut-corner");
const Qg = r("#icon-button-soft-light-visible");
const bx = r("#icon-button-soft-light-section");
const eh = r("#icon-button-soft-light-color");
const th = r("#icon-button-soft-light-strength");
const nh = r("#icon-button-soft-light-size");
const oh = r("#icon-button-soft-light-angle");
const ih = r("#icon-button-glow-visible");
const yx = r("#icon-button-glow-section");
const ah = r("#icon-button-glow-color");
const rh = r("#icon-button-glow-strength");
const sh = r("#icon-button-glow-size");
const ch = r("#icon-button-glow-angle");
const $d = r("#icon-button-left");
const Fd = r("#icon-button-top");
const Gs = r("#icon-button-width");
const Us = r("#icon-button-height");
const Wa = r("#icon-button-scale");
const _s = r("#icon-button-rotation");
const vx = r("#icon-button-action-controls");
const wx = r("#icon-button-action-section");
const lh = r("#icon-button-preview-details");
const Ys = r("#icon-button-apply-style");
const Cx = r("#icon-button-apply-count");
const Sx = r("#presence-motion-section");
const xx = r("#door-window-perspective-section");
const Tn = r("#door-window-perspective-edit");
const Nx = r("#door-window-perspective-reset");
const Xs = r("#door-window-perspective-save");
const dh = r("#presence-halo-visible");
const uh = r("#presence-halo-scale-x");
const ph = r("#presence-halo-scale-y");
const mh = r("#presence-halo-rotation");
const fh = r("#presence-halo-opacity");
const gh = r("#presence-person-visible");
const hh = r("#presence-person-scale");
const bh = r("#presence-person-rotation");
const yh = r("#presence-person-opacity");
const vh = r("#presence-orbit-duration");
const Ks = r("#air-conditioner-inspector");
const wh = r("#air-conditioner-label");
const Ch = r("#air-conditioner-device-type");
const Dd = r("#air-conditioner-entity-button");
const Js = r("#air-conditioner-entity-menu");
const Ex = r("#air-conditioner-entity-search");
const Lx = r("#air-conditioner-entity-options");
const Sh = r("#air-conditioner-preview-state");
const xh = r("#air-conditioner-layer-options");
const Ix = r("#air-conditioner-button-section");
const Nh = r("#air-conditioner-airflow-section");
const Tx = r("#air-conditioner-transform-section");
const Ax = r("#air-conditioner-action-section");
const Eh = r("#air-conditioner-icon-visible");
const Lh = r("#air-conditioner-icon-off-color");
const Ih = r("#air-conditioner-icon-on-color");
const Th = r("#air-conditioner-badge-color");
const Ah = r("#air-conditioner-badge-opacity");
const Ph = r("#air-conditioner-symbol-size");
const kh = r("#air-conditioner-badge-size");
const Mh = r("#air-conditioner-icon-left");
const Oh = r("#air-conditioner-icon-top");
const Bh = r("#air-conditioner-main-visible");
const $h = r("#air-conditioner-main-text");
const Fh = r("#air-conditioner-main-color");
const Dh = r("#air-conditioner-main-size");
const zh = r("#air-conditioner-main-weight");
const Vh = r("#air-conditioner-main-spacing");
const Wh = r("#air-conditioner-main-left");
const Rh = r("#air-conditioner-main-top");
const Hh = r("#air-conditioner-secondary-visible");
const jh = r("#air-conditioner-secondary-text");
const qh = r("#air-conditioner-secondary-color");
const Gh = r("#air-conditioner-secondary-size");
const Uh = r("#air-conditioner-secondary-weight");
const _h = r("#air-conditioner-secondary-spacing");
const Yh = r("#air-conditioner-secondary-left");
const Xh = r("#air-conditioner-secondary-top");
const Kh = r("#air-conditioner-airflow-visible");
const Jh = r("#air-conditioner-airflow-motion");
const Zh = r("#air-conditioner-airflow-cool-color");
const Qh = r("#air-conditioner-airflow-heat-color");
const eb = r("#air-conditioner-airflow-other-color");
const tb = r("#air-conditioner-airflow-angle");
const nb = r("#air-conditioner-airflow-curve");
const ob = r("#air-conditioner-airflow-length");
const ib = r("#air-conditioner-airflow-fade");
const ab = r("#air-conditioner-airflow-spread");
const rb = r("#air-conditioner-airflow-density");
const sb = r("#air-conditioner-airflow-irregularity");
const cb = r("#air-conditioner-airflow-thickness");
const lb = r("#air-conditioner-airflow-strength");
const db = r("#air-conditioner-airflow-blur");
const zd = r("#air-conditioner-airflow-speed");
const Ra = r("#air-conditioner-airflow-offset-x");
const Ha = r("#air-conditioner-airflow-offset-y");
const ub = r("#air-conditioner-airflow-width");
const pb = r("#air-conditioner-airflow-height");
const Vd = r("#air-conditioner-airflow-scale");
const Wd = r("#air-conditioner-airflow-rotation");
const Rd = r("#air-conditioner-left");
const Hd = r("#air-conditioner-top");
const Zs = r("#air-conditioner-width");
const Qs = r("#air-conditioner-height");
const ja = r("#air-conditioner-scale");
const ec = r("#air-conditioner-rotation");
const Px = r("#air-conditioner-action-controls");
const jd = r("#air-conditioner-preview-details");
const qd = r("#air-conditioner-apply-style");
const kx = r("#air-conditioner-apply-count");
const tc = r("#vacuum-map-inspector");
const mb = r("#vacuum-map-label");
const Gd = r("#vacuum-map-entity-button");
const nc = r("#vacuum-map-entity-menu");
const Mx = r("#vacuum-map-entity-search");
const Ox = r("#vacuum-map-entity-options");
const fb = r("#vacuum-map-opacity");
const Ud = r("#vacuum-map-left");
const _d = r("#vacuum-map-top");
const qa = r("#vacuum-map-scale");
const oc = r("#vacuum-map-rotation");
const ic = r("#camera-inspector");
const gb = r("#camera-label");
const Yd = r("#camera-entity-button");
const ac = r("#camera-entity-menu");
const Bx = r("#camera-entity-search");
const $x = r("#camera-entity-options");
const hb = r("#camera-fit-options");
const bb = r("#camera-display-mode-options");
const Fx = r("#camera-refresh-interval-field");
const Ga = r("#camera-refresh-interval");
const yb = r("#camera-media-visible");
const vb = r("#camera-frame-visible");
const wb = r("#camera-frame-color");
const Cb = r("#camera-frame-width");
const Sb = r("#camera-radius");
const xb = r("#camera-frame-angle");
const Nb = r("#camera-frame-opacity");
const Xd = r("#camera-left");
const Kd = r("#camera-top");
const rc = r("#camera-width");
const sc = r("#camera-height");
const Ua = r("#camera-scale");
const cc = r("#camera-rotation");
const Dx = r("#camera-action-controls");
const lc = r("#camera-apply-style");
const zx = r("#camera-apply-count");
const _a = r("#time-inspector");
const Vx = r("#time-type");
const Eb = r("#time-label");
const Lb = r("#time-hour-format");
const Ib = r("#time-seconds");
const Tb = r("#time-color");
const Ab = r("#time-font-size");
const Pb = r("#time-font-weight");
const kb = r("#time-letter-spacing");
const Mb = r("#time-opacity");
const Ya = r("#time-left");
const Xa = r("#time-top");
const yo = r("#time-scale");
const gi = r("#time-rotation");
const Ka = r("#date-inspector");
const Wx = r("#date-type");
const Ob = r("#date-label");
const Bb = r("#date-weekday");
const $b = r("#date-lunar");
const Fb = r("#date-primary-color");
const Db = r("#date-primary-size");
const zb = r("#date-primary-weight");
const Vb = r("#date-primary-spacing");
const Wb = r("#date-lunar-color");
const Rb = r("#date-lunar-size");
const Hb = r("#date-lunar-weight");
const jb = r("#date-lunar-spacing");
const qb = r("#date-line-gap");
const Gb = r("#date-opacity");
const Ja = r("#date-left");
const Za = r("#date-top");
const vo = r("#date-scale");
const hi = r("#date-rotation");
const Qa = r("#weather-inspector");
const Rx = r("#weather-type");
const Ub = r("#weather-label");
const OI = r("#weather-entity-picker");
const Jd = r("#weather-entity-button");
const Zd = r("#weather-entity-menu");
const Hx = r("#weather-entity-search");
const jx = r("#weather-entity-options");
const _b = r("#weather-icon-visible");
const Yb = r("#weather-temperature-visible");
const Xb = r("#weather-condition-visible");
const Kb = r("#weather-humidity-visible");
const Jb = r("#weather-icon-size");
const Zb = r("#weather-icon-gap");
const Qb = r("#weather-temperature-color");
const ey = r("#weather-temperature-size");
const ty = r("#weather-temperature-weight");
const ny = r("#weather-temperature-spacing");
const oy = r("#weather-secondary-color");
const iy = r("#weather-secondary-size");
const ay = r("#weather-secondary-weight");
const ry = r("#weather-secondary-spacing");
const sy = r("#weather-line-gap");
const cy = r("#weather-opacity");
const er = r("#weather-left");
const tr = r("#weather-top");
const wo = r("#weather-scale");
const bi = r("#weather-rotation");
const nr = r("#line-chart-inspector");
const qx = r("#line-chart-type");
const ly = r("#line-chart-label");
const BI = r("#line-chart-entity-picker");
const Qd = r("#line-chart-entity-button");
const eu = r("#line-chart-entity-menu");
const Gx = r("#line-chart-entity-search");
const Ux = r("#line-chart-entity-options");
const dy = r("#line-chart-value-visible");
const uy = r("#line-chart-value-scale");
const py = r("#line-chart-value-color");
const my = r("#line-chart-state-precision");
const fy = r("#line-chart-value-offset-x");
const gy = r("#line-chart-value-offset-y");
const hy = r("#line-chart-update-interval");
const by = r("#line-chart-hours");
const yy = r("#line-chart-curve-radius");
const tu = r("#line-chart-threshold-mode");
const yi = [1, 2, 3, 4].map((value) => ({
  value: r("#line-chart-threshold-" + value + "-value"),
  color: r("#line-chart-threshold-" + value + "-color")
}));
const or = r("#line-chart-left");
const ir = r("#line-chart-top");
const vi = r("#line-chart-width");
const wi = r("#line-chart-height");
const Co = r("#line-chart-scale");
const Ci = r("#line-chart-rotation");
const _x = r("#line-chart-action-controls");
const dc = r("#line-chart-apply-style");
const Yx = r("#line-chart-apply-count");
const ar = r("#panel-frame-inspector");
const Xx = r("#panel-frame-type");
const vy = r("#panel-frame-label");
const wy = r("#panel-frame-main-visible");
const Cy = r("#panel-frame-main-text");
const Sy = r("#panel-frame-main-color");
const xy = r("#panel-frame-main-size");
const Ny = r("#panel-frame-main-weight");
const Ey = r("#panel-frame-main-opacity");
const Ly = r("#panel-frame-main-spacing");
const Iy = r("#panel-frame-main-left");
const Ty = r("#panel-frame-main-top");
const Ay = r("#panel-frame-secondary-visible");
const Py = r("#panel-frame-secondary-text");
const ky = r("#panel-frame-secondary-color");
const My = r("#panel-frame-secondary-size");
const Oy = r("#panel-frame-secondary-weight");
const By = r("#panel-frame-secondary-opacity");
const $y = r("#panel-frame-secondary-spacing");
const Fy = r("#panel-frame-secondary-left");
const Dy = r("#panel-frame-secondary-top");
const zy = r("#panel-frame-edge-visible");
const Vy = r("#panel-frame-edge-color");
const Wy = r("#panel-frame-edge-width");
const Ry = r("#panel-frame-edge-opacity");
const Hy = r("#panel-frame-radius");
const jy = r("#panel-frame-edge-angle");
const qy = r("#panel-frame-glow-visible");
const Gy = r("#panel-frame-glow-color");
const Uy = r("#panel-frame-glow-strength");
const _y = r("#panel-frame-glow-size");
const Yy = r("#panel-frame-glow-angle");
const rr = r("#panel-frame-left");
const sr = r("#panel-frame-top");
const Si = r("#panel-frame-width");
const xi = r("#panel-frame-height");
const So = r("#panel-frame-scale");
const Ni = r("#panel-frame-rotation");
const uc = r("#panel-frame-apply-style");
const Kx = r("#panel-frame-apply-count");
const Ei = r("#navigation-inspector");
const Jx = r("#navigation-type");
const pc = r("#navigation-label");
const nu = r("#navigation-preview-state");
const ou = r("#navigation-entity-button");
const iu = r("#navigation-entity-menu");
const Zx = r("#navigation-entity-search");
const Qx = r("#navigation-entity-options");
const au = r("#navigation-main-text");
const ru = r("#navigation-secondary-text");
const Xy = r("#navigation-main-visible");
const Ky = r("#navigation-secondary-visible");
const Jy = r("#navigation-icon-visible");
const Zy = r("#navigation-frame-visible");
const Qy = r("#navigation-glow-visible");
const on = r("#navigation-icon-button");
const cr = r("#navigation-icon-copy");
const Tt = r("#navigation-icon-menu");
const lr = r("#navigation-icon-search");
const dr = r("#navigation-icon-options");
const ev = r("#navigation-main-color");
const tv = r("#navigation-secondary-color");
const nv = r("#navigation-main-size");
const ov = r("#navigation-secondary-size");
const iv = r("#navigation-main-weight");
const av = r("#navigation-secondary-weight");
const rv = r("#navigation-main-spacing");
const sv = r("#navigation-secondary-spacing");
const cv = r("#navigation-main-text-left");
const lv = r("#navigation-main-text-top");
const dv = r("#navigation-secondary-text-left");
const uv = r("#navigation-secondary-text-top");
const su = r("#navigation-text-idle-opacity");
const cu = r("#navigation-text-active-opacity");
const pv = r("#navigation-icon-color");
const mv = r("#navigation-icon-size");
const fv = r("#navigation-icon-left");
const gv = r("#navigation-icon-top");
const lu = r("#navigation-icon-idle-opacity");
const du = r("#navigation-icon-active-opacity");
const hv = r("#navigation-frame-color");
const bv = r("#navigation-frame-width");
const uu = r("#navigation-frame-idle-opacity");
const pu = r("#navigation-frame-active-opacity");
const yv = r("#navigation-frame-angle");
const vv = r("#navigation-glow-color");
const wv = r("#navigation-glow-angle");
const mu = r("#navigation-glow-idle-strength");
const fu = r("#navigation-glow-idle-size");
const gu = r("#navigation-glow-active-strength");
const hu = r("#navigation-glow-active-size");
const Cv = r("#navigation-radius");
const ur = r("#navigation-left");
const pr = r("#navigation-top");
const xo = r("#navigation-width");
const No = r("#navigation-height");
const An = r("#navigation-scale");
const Eo = r("#navigation-rotation");
const eN = r("#navigation-action-controls");
const mc = r("#navigation-apply-style");
const tN = r("#navigation-apply-count");
const Ge = r("#navigation-style-apply-dialog");
const nN = r("#navigation-style-apply-close");
const Pn = r("#navigation-style-apply-title");
const kn = r("#navigation-style-apply-summary");
const an = r("#navigation-style-apply-properties");
const Mn = r("#navigation-style-apply-target-heading");
const On = r("#navigation-style-apply-target-scope");
const mr = r("#navigation-style-apply-targets");
const ke = r("#navigation-style-apply-message");
const oN = r("#navigation-style-apply-cancel");
const iN = r("#navigation-style-apply-confirm");
const fc = r("#popup-name-dialog");
const aN = r("#popup-name-dialog-title");
const gc = r("#popup-name-form");
const rN = r("#popup-name-close");
const sN = r("#popup-name-cancel");
const Li = r("#popup-module-dialog");
const cN = r("#popup-module-dialog-title");
const he = r("#popup-module-form");
const lN = r("#popup-module-close");
const dN = r("#popup-module-cancel");
const rn = r("#popup-module-entity-button");
const bu = r("#popup-module-entity-menu");
const hc = r("#popup-module-entity-search");
const Ii = r("#popup-module-entity-options");
const yu = r("#popup-module-climate-device-type");
const bc = r("#delete-popup-dialog");
const uN = r("#delete-popup-close");
const pN = r("#delete-popup-cancel");
const vu = r("#delete-popup-confirm");
const mN = r("#delete-popup-name");
const Lo = r("#delete-asset-dialog");
const fN = r("#delete-asset-close");
const gN = r("#delete-asset-cancel");
const wu = r("#delete-asset-confirm");
const hN = r("#delete-asset-name");
const Bn = r("#delete-asset-folder-dialog");
const bN = r("#delete-asset-folder-close");
const yN = r("#delete-asset-folder-cancel");
const yc = r("#delete-asset-folder-confirm");
const vN = r("#delete-asset-folder-name");
const wN = r("#delete-asset-folder-count");
let ie = null;
let Io = null;
let x = null;
let Ue = null;
const Sv = new Map();
const xv = new Map();
const Nv = new Map();
let Te = "edit";
let ft = [];
let h = null;
let vc = "shared";
let At = "create";
let Cu = null;
let be = "";
let fr = 2778;
let gr = 1940;
let sn = false;
let hr = 2778;
let br = 1940;
let To = [];
let Su = [];
let gt = 0;
let xu = "create";
let Xe = false;
let yr = null;
let componentId = null;
let De = null;
let wc = {
  componentId: null,
  at: 0
};
let se = null;
let Nu = "create";
let vr = null;
let Eu = null;
let wr = null;
let Lu = null;
let Cc = null;
let $n = [];
let ht = [];
let Ev = null;
let Fn = [];
let le = [];
let cn = [];
let Iu = new Map();
let Ao = {};
let Po = null;
let Tu = false;
let Ti = null;
let Cr = Promise.resolve();
let ln = "";
let dn = "";
let Vt = "builtin";
let Wt = "builtin";
let Sc = null;
let Lv = null;
let Iv = null;
let Tv = null;
let Av = null;
let Pv = null;
let kv = null;
let Mv = null;
let Ov = null;
let Bv = null;
let $v = null;
let Rt = "";
let ko = -1;
let Sr = "";
let Fv = null;
let Dv = null;
let zv = null;
let Vv = null;
let Wv = null;
let Rv = null;
let Hv = null;
let jv = null;
let Pt = null;
let Au = null;
const Pu = new Set();
let selectedComponentIds = new Set();
let we = null;
const pe = {
  undo: [],
  redo: [],
  busy: false
};
const ku = 10;
const xc = "ha-bridge:unsaved:";
let Ai = "";
let Ke = null;
let Dn = false;
let kt = null;
let Mu = 0;
let xr = null;
let Nc = false;
let bt = null;
let Ou = null;
const Pi = new Map();
const un = new Map();
const zn = new Map();
const Ec = new Set();
const Bu = Object.freeze([0, 0, 1, 0, 1, 1, 0, 1]);
const qv = new Map();
const Mo = new Map();
const $u = new Map();
const Fu = new Map();
const Oo = new Map();
const ki = new Map();
const Mi = new Map();
const Oi = new Map();
const Bi = new Map();
const $i = new Map();
const Vn = new Map();
const Gv = new Map();
const Uv = new WeakSet();
let Bo = null;
let me = null;
let Lc = "";
let $o = 0;
let Nr = 0;
let Er = 1;
let Lr = null;
let _v = null;
let Du = "";
let zu = null;
async function J(value, fetchOptions = {}) {
  const response = await fetch("/api/v1" + value, {
    cache: "no-store",
    ...fetchOptions,
    headers: fetchOptions.body ?
    {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {})
    } :
    fetchOptions.headers
  });
  const responseText = response.status === 204 ? "" : await response.text();
  let temp = null;
  if (responseText) {
    try {
      temp = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error(
          "接口返回格式异常：" +
          value.split("?")[0] +
          "（HTTP " +
          response.status +
          "）"
        );
      }
    }
  }
  if (response.status === 401) {
    window.location.assign("/login");
    const error = new Error("登录状态已失效。");
    throw window.HABridgeLog?.linkError(error, response) || error;
  }
  if (
  response.status === 403 &&
  temp?.detail?.code === "LICENSE_RESTRICTED")
  {
    window.location.replace("/license");
    const error = new Error("授权已失效，请重新激活。");
    throw window.HABridgeLog?.linkError(error, response) || error;
  }
  if (!response.ok) {
    const detail = temp?.detail;
    const temp2 = responseText.trim().slice(0, 240);
    const error = new Error(
      typeof detail == "string" ?
      detail :
      detail?.message ||
      "请求失败：" +
      value.split("?")[0] +
      "（HTTP " +
      response.status +
      "）" + (
      temp2 ? " · " + temp2 : "")
    );
    if (detail && typeof detail == "object" && detail.code) {
      error.code = detail.code;
    }
    throw window.HABridgeLog?.linkError(error, response) || error;
  }
  return temp;
}
function D(element, value, className = "") {
  element.hidden = !value;
  element.textContent = value;
  element.className = ("settings-message " + className).trim();
}
function onError(value) {
  window.HABridgeLog?.error(value, {
    projectId: h?.projectId || "",
    componentId: componentId || "",
    phase: "editor-operation"
  });
  p1.textContent = value?.message || "操作失败。";
  if (!uo.open) {
    uo.showModal();
  }
}
function Wn() {
  gs.hidden = true;
  fs.setAttribute("aria-expanded", "false");
}
function pn() {
  ys.hidden = true;
  bs.setAttribute("aria-expanded", "false");
}
function Ic() {
  Ft.hidden = true;
  ao.setAttribute("aria-expanded", "false");
  Eu = null;
}
function Ht(value = Bo) {
  if (value) {
    value.menu.hidden = true;
    value.button.setAttribute("aria-expanded", "false");
    if (Bo === value) {
      Bo = null;
    }
  }
}
function Yv(value) {
  if (value.menu.hidden) {
    return;
  }
  const rect = value.button.getBoundingClientRect();
  const count = Math.max(80, Math.min(320, window.innerHeight - 16));
  value.menu.style.width = rect.width + "px";
  value.menu.style.maxHeight = count + "px";
  const minValue = Math.min(value.menu.scrollHeight, count);
  const count2 = Math.max(
    8,
    Math.min(window.innerWidth - rect.width - 8, rect.left)
  );
  const number = rect.bottom + 4;
  const chosen =
  number + minValue <= window.innerHeight - 8 ?
  number :
  Math.max(8, rect.top - minValue - 4);
  value.menu.style.left = count2 + "px";
  value.menu.style.top = chosen + "px";
}
function oe(element) {
  const value = Vn.get(element);
  if (!value) {
    return;
  }
  const element2 = element.selectedOptions[0];
  const flag =
  element.id === "page-select" && element2?.dataset.defaultPage === "true";
  value.button.textContent = flag ?
  "★ " + element2.textContent :
  element2?.textContent || (
  element.id === "project-select" ?
  "暂无仪表盘" :
  element.id === "popup-select" ?
  "暂无组合弹窗" :
  element.id === "image-asset-folder" ?
  "暂无图片文件夹" :
  "暂无页面");
  value.button.disabled = element.disabled;
  const chosen = element === po ? "image" : element === ho ? "ibe" : "";
  const chosen2 = chosen === "image" ? Vt : chosen === "ibe" ? Wt : "";
  value.menu.replaceChildren(
    ...[...element.options].map((element3) => {
      const element4 = document.createElement("button");
      element4.type = "button";
      element4.className = "custom-select-option";
      element4.dataset.value = element3.value;
      if (
      element.id === "page-select" &&
      element3.dataset.defaultPage === "true")
      {
        const element6 = document.createElement("span");
        element6.className = "custom-select-default-marker";
        element6.textContent = "★";
        element6.setAttribute("aria-hidden", "true");
        const element7 = document.createElement("span");
        element7.textContent = element3.textContent;
        element4.append(element6, element7);
      } else {
        element4.textContent = element3.textContent;
      }
      element4.classList.toggle("active", element3.value === element.value);
      element4.disabled = element3.disabled;
      if (!chosen || !fp(chosen2, element3.value)) {
        return element4;
      }
      const temp = document.createElement("div");
      temp.className = "custom-select-option-row";
      const element5 = document.createElement("button");
      element5.type = "button";
      element5.className = "custom-select-option-delete";
      element5.dataset.deleteStudio3dFolder = element3.value;
      element5.dataset.assetFolderKind = chosen;
      element5.title = "删除 " + element3.textContent;
      element5.setAttribute(
        "aria-label",
        "删除自动导图文件夹 " + element3.textContent
      );
      element5.textContent = "×";
      temp.append(element4, element5);
      return temp;
    })
  );
  if (element.disabled) {
    Ht(value);
  } else if (!value.menu.hidden) {
    window.requestAnimationFrame(() => Yv(value));
  }
}
function Xv(select) {
  if (!select || Vn.has(select) || select.dataset.nativeSelect === "true") {
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
  button.setAttribute(
    "aria-label",
    select.getAttribute("aria-label") || "打开选择菜单"
  );
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
    select: select,
    wrapper: wrapper,
    button: button,
    menu: menu
  };
  Vn.set(select, value);
  oe(select);
  button.addEventListener("click", () => {
    const hidden = menu.hidden;
    Ht();
    Wn();
    pn();
    if (hidden) {
      oe(select);
      menu.hidden = false;
      button.setAttribute("aria-expanded", "true");
      Bo = value;
      window.requestAnimationFrame(() => Yv(value));
    }
  });
  menu.addEventListener("click", (event) => {
    const ancestorEl = event.target.closest("[data-delete-studio3d-folder]");
    if (ancestorEl) {
      event.preventDefault();
      event.stopPropagation();
      eC(ancestorEl.dataset.assetFolderKind, ancestorEl.dataset.deleteStudio3dFolder);
      return;
    }
    const ancestorEl2 = event.target.closest(".custom-select-option");
    if (!ancestorEl2 || ancestorEl2.disabled) {
      return;
    }
    const inputValue = select.value;
    select.value = ancestorEl2.dataset.value;
    oe(select);
    Ht(value);
    if (select.value !== inputValue) {
      select.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );
    }
  });
  select.addEventListener("change", () => oe(select));
  new MutationObserver(() => oe(select)).observe(select, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["disabled", "label", "selected"]
  });
}
function Kv(value = document) {
  if (value instanceof HTMLSelectElement) {
    Xv(value);
  }
  value.querySelectorAll?.("select").forEach((arg) => Xv(arg));
}
function Fo(value, skipPreview = false) {
  const temp = normalizedHexColor(value);
  if (!temp || !me) {
    return;
  }
  const temp2 = hexToRgb(temp);
  const temp3 = rgbToHsv(temp2);
  $o = temp3.s > 0 ? temp3.h : $o;
  Nr = temp3.s;
  Er = temp3.v;
  pt.style.setProperty("--picker-hue", "hsl(" + $o + " 100% 50%)");
  pt.style.setProperty("--picker-color", temp);
  Xm.style.left = Nr * 100 + "%";
  Xm.style.top = (1 - Er) * 100 + "%";
  $l.value = String(Math.round($o));
  if (document.activeElement !== xn) {
    xn.value = temp.toUpperCase();
  }
  zl.value = String(Math.round(temp2.r));
  Vl.value = String(Math.round(temp2.g));
  Wl.value = String(Math.round(temp2.b));
  v1.style.background = temp;
  if (me.value !== temp) {
    me.value = temp;
    if (skipPreview) {
      me.dispatchEvent(
        new Event("input", {
          bubbles: true
        })
      );
    }
  }
}
function Jv() {
  const value = hsvToRgb($o, Nr, Er);
  Fo(rgbToHex(value.r, value.g, value.b), true);
}
function Vu() {
  if (pt.hidden || !me) {
    return;
  }
  const value = me.getBoundingClientRect();
  const rect = pt.getBoundingClientRect();
  const temp = 9;
  const temp2 = 8;
  const number = value.left - rect.width - temp;
  const chosen =
  number >= temp2 ?
  number :
  Math.min(
    window.innerWidth - rect.width - temp2,
    value.right + temp
  );
  const clamped = clampNumber(
    value.top,
    temp2,
    Math.max(temp2, window.innerHeight - rect.height - temp2)
  );
  pt.style.left = Math.max(temp2, chosen) + "px";
  pt.style.top = clamped + "px";
}
function Zv(element) {
  if (!element || element.disabled) {
    return;
  }
  if (me && me !== element) {
    Qv();
  }
  me = element;
  Lc = normalizedHexColor(element.value) || "#000000";
  const value = rgbToHsv(hexToRgb(Lc));
  $o = value.h;
  Nr = value.s;
  Er = value.v;
  pt.hidden = false;
  Fo(Lc);
  window.requestAnimationFrame(Vu);
}
function Qv() {
  if (!me) {
    return;
  }
  const element = me;
  const value = normalizedHexColor(element.value) !== Lc;
  pt.hidden = true;
  me = null;
  Lr = null;
  if (value) {
    element.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );
  }
  vw(element);
}
function CN() {
  if (!pt.hidden && me?.isConnected) {
    Fo(me.value);
  }
}
function e0(value = document) {
  (value instanceof HTMLInputElement && value.type === "color" ?
  [value] :
  [...(value.querySelectorAll?.('input[type="color"]') || [])]).
  forEach((el2) => {
    if (!Gv.has(el2)) {
      Gv.set(el2, true);
      el2.title = "打开颜色选择器";
      el2.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        Zv(el2);
      });
      el2.addEventListener("click", (event) => event.preventDefault());
      el2.addEventListener("keydown", (event) => {
        if (["Enter", " "].includes(event.key)) {
          event.preventDefault();
          Zv(el2);
        }
      });
    }
  });
}
function Wu(element, value) {
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
    const flag = Number(element.step) || 1;
    const flag2 = Number(element.value) || 0;
    const chosen = element.min === "" ? -Infinity : Number(element.min);
    const chosen2 = element.max === "" ? Infinity : Number(element.max);
    element.value = String(
      clampNumber(flag2 + flag * value, chosen, chosen2)
    );
  }
  if (element.value === inputValue) {
    return false;
  } else {
    element.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
    return true;
  }
}
function t0(value = document) {
  const elements =
  value instanceof HTMLInputElement && value.type === "number" ?
  [value] :
  [
  ...(value.querySelectorAll?.(
    '.inspector-form input[type="number"]'
  ) || [])];

  for (const temp of elements) {
    if (Uv.has(temp)) {
      continue;
    }
    Uv.add(temp);
    const temp2 = document.createElement("span");
    temp2.className = "inspector-number-control";
    const temp3 = document.createElement("span");
    temp3.className = "inspector-number-steppers";
    const createControl = (arg, arg2, arg3) => {
      const element = document.createElement("button");
      element.type = "button";
      element.tabIndex = -1;
      element.className = "inspector-number-stepper";
      element.setAttribute("aria-label", arg2);
      element.innerHTML =
      '<svg viewBox="0 0 10 6" aria-hidden="true"><path d="' +
      arg3 +
      '"></path></svg>';
      element.addEventListener("click", (event) => event.preventDefault());
      element.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || temp.disabled || temp.readOnly) {
          return;
        }
        event.preventDefault();
        temp.focus({
          preventScroll: true
        });
        let temp5 = Wu(temp, arg);
        let temp6 = false;
        let temp7 = window.setTimeout(() => {
          temp7 = window.setInterval(() => {
            temp5 = Wu(temp, arg) || temp5;
          }, 55);
        }, 320);
        const callback = () => {
          if (!temp6) {
            temp6 = true;
            window.clearTimeout(temp7);
            window.clearInterval(temp7);
            element.removeEventListener("pointerup", callback);
            element.removeEventListener("pointercancel", callback);
            element.removeEventListener("lostpointercapture", callback);
            if (temp5) {
              temp.dispatchEvent(
                new Event("change", {
                  bubbles: true
                })
              );
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
    temp3.append(
      createControl(1, "增加数值", "M1 5 5 1l4 4"),
      createControl(-1, "减少数值", "M1 1 5 5l4-4")
    );
    temp.before(temp2);
    temp2.append(temp, temp3);
    let temp4 = false;
    temp.addEventListener("keydown", (event) => {
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        temp4 = Wu(temp, event.key === "ArrowUp" ? 1 : -1) || temp4;
      }
    });
    temp.addEventListener("keyup", (event2) => {
      if (!!["ArrowUp", "ArrowDown"].includes(event2.key) && !!temp4) {
        temp4 = false;
        temp.dispatchEvent(
          new Event("change", {
            bubbles: true
          })
        );
      }
    });
  }
}
function Ru(value) {
  Jo.classList.toggle("empty", !value);
  Dt.classList.toggle("workspace-empty-state", !value);
  Dt.classList.toggle("canvas-placeholder", value);
  fs.disabled = !value;
  Lm.disabled = !value;
  Im.disabled = !value;
  Tm.disabled = !value;
  if (!value) {
    Dt.removeAttribute("style");
    Dt.innerHTML =
    '<div class="canvas-message"><strong>请从左侧新建仪表盘。</strong></div>';
    Wn();
    pn();
  }
  ju();
  o0();
  Pl();
}
function jt(value = h?.document) {
  return value?.uiPack?.id || "ui.base";
}
function Tc(value = jt()) {
  return (
    Fn.find((component) => component.id === value) || (
    value === "ui.base" ?
    {
      id: "ui.base",
      name: "默认",
      englishName: "DWELL LIGHT",
      version: "1.0.0",
      featureCode: "ui.base",
      description: "黑色界面与橙色高亮，包含现有控件、弹窗和示例素材。",
      includes: ["components", "popups", "assets"],
      allowed: true
    } :
    null));

}
function Hu() {
  const value = Tc();
  uS.textContent = value?.name || "未知 UI";
  pS.textContent = value ?
  (value.englishName || value.id) + " · " + value.version :
  jt();
}
function n0() {
  const value = jt();
  const options = {
    dashboards: "仪表盘",
    components: "控件",
    popups: "弹窗",
    assets: "素材"
  };
  if (!Fn.length) {
    const element = document.createElement("div");
    element.className = "component-template-empty";
    element.textContent = "暂无可用 UI 方案。";
    hl.replaceChildren(element);
    return;
  }
  hl.replaceChildren(
    ...Fn.map((component) => {
      const temp = document.createElement("article");
      const flag = component.id === value;
      temp.className = "ui-pack-card" + (flag ? " current" : "");
      const element = document.createElement("div");
      element.className = "ui-pack-preview";
      if (component.previewUrl) {
        element.classList.add("has-cover");
        const temp4 = document.createElement("img");
        temp4.src = component.previewUrl;
        temp4.alt = component.name + " 仪表盘预览";
        element.append(temp4);
      }
      const temp2 = document.createElement("div");
      temp2.className = "ui-pack-card-copy";
      const element2 = document.createElement("span");
      element2.textContent =
      (component.englishName || component.id) + " · " + component.version;
      const element3 = document.createElement("strong");
      element3.textContent = component.name;
      const element4 = document.createElement("p");
      element4.textContent = component.description;
      const temp3 = document.createElement("div");
      temp3.className = "ui-pack-includes";
      for (const temp4 of component.includes || []) {
        const element6 = document.createElement("i");
        element6.textContent = options[temp4] || temp4;
        temp3.append(element6);
      }
      const element5 = document.createElement("button");
      element5.type = "button";
      element5.dataset.uiPackId = component.id;
      element5.disabled = flag || !component.allowed;
      element5.textContent = flag ?
      "当前使用" :
      component.allowed ?
      "应用到当前仪表盘" :
      "尚未解锁";
      if (!flag && component.allowed) {
        element5.className = "primary";
      }
      temp2.append(element2, element3, element4, temp3, element5);
      temp.append(element, temp2);
      return temp;
    })
  );
}
async function Ir() {
  Fn = (await J("/ui-packs?_=" + Date.now())).items || [];
  Hu();
  if (io.open) {
    n0();
  }
  return Fn;
}
function Do() {
  Ue?.destroy();
  Ue = null;
}
function Ac(value = W.value) {
  if (Te !== "dashboard") {
    Do();
    return;
  }
  if (!h?.document?.pages?.length) {
    Do();
    oa.innerHTML =
    '<div class="canvas-message"><strong>' + (
    h ? "请从左侧新建页面。" : "请从左侧新建仪表盘。") +
    "</strong></div>";
    return;
  }
  if (!Ue) {
    Ue = new PanelRenderer(oa, {
      editable: false,
      historySeriesCache: Sv,
      runtimeStateCache: xv,
      virtualEntityStateCache: Nv,
      onError: onError,
      onRuntimeButtonPress() {
        Qo.play();
      },
      onPageChange(arg) {
        W.value = arg.path;
        oe(W);
      }
    });
    Ue.setEntityCatalog(le, Ao, cn);
  }
  Ue.setDocument(h.document, value);
}
function o0() {
  const value = String(h?.document?.name || "").trim();
  const flag = Te === "dashboard" && !!value;
  HS.hidden = !flag;
  if (!flag) {
    na.removeAttribute("href");
    na.textContent = "";
    return;
  }
  const temp = new URL(
    "/habridge/" + encodeURIComponent(value),
    window.location.origin
  );
  na.href = temp.href;
  na.textContent = decodeURI(temp.href);
  na.title = temp.href;
}
function SN(value) {
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
async function Pc() {
  if (!h) {
    return;
  }
  const value =
  (
  await J(
    "/displays/pairing-codes?projectId=" + encodeURIComponent(h.projectId)
  )).
  items || [];
  US.textContent = value.length + " 个";
  Al.replaceChildren();
  if (!value.length) {
    const element = document.createElement("p");
    element.textContent = "暂无配对码";
    Al.append(element);
    return;
  }
  for (const temp of value) {
    const temp2 = document.createElement("div");
    temp2.className =
    "display-device-item" + (temp.enabled ? "" : " is-disabled");
    const temp3 = document.createElement("div");
    temp3.className = "display-device-copy";
    const element = document.createElement("strong");
    element.textContent = temp.name;
    const element2 = document.createElement("span");
    const chosen = temp.device ?
    "已绑定 · 最后在线 " + SN(temp.device.lastSeenAt) :
    "等待设备配对";
    element2.textContent =
    (temp.enabled ? "已启用" : "已停用") + " · " + chosen;
    const element3 = document.createElement("strong");
    element3.className = "display-device-code";
    element3.textContent = temp.code || "——";
    const temp4 = document.createElement("div");
    temp4.className = "display-device-actions";
    const element4 = document.createElement("button");
    element4.type = "button";
    element4.textContent = temp.enabled ? "停用" : "启用";
    element4.addEventListener("click", async () => {
      element4.disabled = true;
      try {
        await J("/displays/pairing-codes/" + encodeURIComponent(temp.id), {
          method: "PATCH",
          body: JSON.stringify({
            enabled: !temp.enabled
          })
        });
        await Pc();
      } catch (error) {
        D(Zo, error.message, "error");
        element4.disabled = false;
      }
    });
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.className = "danger";
    element5.textContent = "删除";
    element5.addEventListener("click", async () => {
      if (
      window.confirm(
        "确认删除“" + temp.name + "”的固定配对码？绑定设备会立即失效。"
      ))
      {
        element5.disabled = true;
        try {
          await J("/displays/pairing-codes/" + encodeURIComponent(temp.id), {
            method: "DELETE"
          });
          await Pc();
        } catch (error) {
          D(Zo, error.message, "error");
          element5.disabled = false;
        }
      }
    });
    temp3.append(element, element2);
    temp4.append(element4, element5);
    temp2.append(temp3, element3, temp4);
    Al.append(temp2);
  }
}
async function xN() {
  if (h) {
    D(Zo, "");
    if (!Tl.open) {
      Tl.showModal();
    }
    try {
      await Pc();
    } catch (error) {
      D(Zo, error.message, "error");
    }
  }
}
async function NN(event) {
  event?.preventDefault();
  if (h) {
    Vm.disabled = true;
    D(Zo, "");
    try {
      const value = await J("/displays/pairing-code", {
        method: "POST",
        body: JSON.stringify({
          projectId: h.projectId,
          name: GS.value,
          code: Ss.value
        })
      });
      zm.reset();
      await Pc();
    } catch (error) {
      D(Zo, error.message, "error");
    } finally {
      Vm.disabled = false;
    }
  }
}
function ju() {
  const canvas = h?.document?.canvas;
  const numeric = Number(canvas?.width);
  const numeric2 = Number(canvas?.height);
  const value =
  Te !== "popup" &&
  Number.isFinite(numeric) &&
  numeric > 0 &&
  Number.isFinite(numeric2) &&
  numeric2 > 0;
  Il.hidden = !value;
  Il.textContent = value ?
  Math.round(numeric) + " × " + Math.round(numeric2) :
  "";
}
function Mt(value) {
  Te = ["edit", "dashboard", "popup"].includes(value) ? value : "edit";
  const flag = Te === "edit";
  const flag2 = Te === "dashboard";
  const flag3 = Te === "popup";
  gS.hidden = flag3;
  hS.hidden = !flag3;
  fS.classList.toggle("popup-mode", flag3);
  bl.classList.toggle("active", !flag3);
  bl.setAttribute("aria-selected", String(!flag3));
  yl.classList.toggle("active", flag3);
  yl.setAttribute("aria-selected", String(flag3));
  if (!flag) {
    s0();
  }
  Dt.hidden = !flag;
  oa.hidden = !flag2;
  yn.hidden = !flag3;
  Jo.classList.toggle("empty", !h);
  RS.textContent = flag2 ? "仪表盘" : flag3 ? "组合弹窗" : "页面画布";
  ju();
  o0();
  Pl();
  for (const [element, temp] of [
  [Wm, flag],
  [Rm, flag2]])
  {
    element.classList.toggle("active", temp);
    element.setAttribute("aria-selected", String(temp));
  }
  if (flag) {
    Do();
    if (h?.document?.pages?.length) {
      jr().setDocument(h.document, W.value);
      x.setSelectedComponents([...selectedComponentIds], componentId);
    }
    window.requestAnimationFrame(qu);
  } else if (flag2) {
    x?.destroy();
    x = null;
    Ac();
    window.requestAnimationFrame(() => Ue?.resize());
  } else if (flag3) {
    qt();
    _e();
    Z();
    x?.destroy();
    x = null;
    Do();
    Sp();
  }
}
function EN() {
  const value = String(ie?.baseUrl || "").trim();
  try {
    const payload = new URL(value);
    if (
    !["http:", "https:"].includes(payload.protocol) ||
    payload.username ||
    payload.password)
    {
      throw new Error();
    }
    window.open(payload.href, "_blank", "noopener,noreferrer");
  } catch {
    onError(new Error("请先配置有效的 Home Assistant 地址。"));
  }
}
function i0(value = !!h?.document?.pages?.length) {
  if (vl) {
    const currentPage = Je();
    const flag = !!currentPage && h?.document?.defaultPagePath === currentPage.path;
    vl.textContent = flag ? "已是默认首屏" : "设为默认首屏";
    vl.disabled = !value || flag;
  }
}
function a0(value) {
  W.disabled = !value;
  bs.disabled = !value;
  i0(value);
  y0();
  oe(W);
  if (!value) {
    pn();
  }
}
function qu() {
  if (!h) {
    return;
  }
  const value = getComputedStyle(Jo);
  const contentWidth =
  Jo.clientWidth -
  Number.parseFloat(value.paddingLeft) -
  Number.parseFloat(value.paddingRight);
  const contentHeight =
  Jo.clientHeight -
  Number.parseFloat(value.paddingTop) -
  Number.parseFloat(value.paddingBottom);
  const canvasWidth = h.document.canvas.width || 2778;
  const canvasHeight = h.document.canvas.height || 1940;
  const number = canvasWidth / canvasHeight;
  const flag = contentWidth / contentHeight > number;
  const chosen = flag ? contentHeight * number : contentWidth;
  const chosen2 = flag ? contentHeight : contentWidth / number;
  Dt.style.width = Math.max(1, chosen) + "px";
  Dt.style.height = Math.max(1, chosen2) + "px";
  oa.style.width = Math.max(1, chosen) + "px";
  oa.style.height = Math.max(1, chosen2) + "px";
  window.requestAnimationFrame(() => {
    x?.resize();
    Ue?.resize();
  });
}
const LN = new ResizeObserver(() => {
  qu();
  K0();
  Ue?.resize();
});
LN.observe(Jo);
function Je() {
  return (
    h?.document?.pages?.find((value) => value.path === W.value) ||
    h?.document?.pages?.[0] ||
    null);

}
function r0(value, doc = h?.document) {
  const idSet = [...new Set(value || [])];
  if (idSet.length < 2 || !doc) {
    return false;
  }
  const mapped = idSet.map((arg) =>
  componentDirectLocation(doc, arg)
  );
  if (mapped.some((arg) => !arg || arg.component.type === "group")) {
    return false;
  }
  const temp = mapped[0];
  return mapped.every(
    (arg) =>
    arg.scope === temp.scope &&
    arg.page?.path === temp.page?.path &&
    arg.collection === temp.collection &&
    arg.component.properties?.layoutMode !== "fill"
  );
}
function IN(value) {
  const idSet = [...new Set(value || [])];
  if (!r0(idSet)) {
    onError(
      new Error("请选择同一页面或同一侧边栏中的两个或更多控件后再成组。")
    );
    return;
  }
  const id2 = newId("group");
  componentId = id2;
  selectedComponentIds = new Set([id2]);
  we = id2;
  De = null;
  return L((doc) => {
    const mapped = idSet.map((arg) =>
    componentDirectLocation(doc, arg)
    );
    if (mapped.some((arg) => !arg)) {
      return;
    }
    const collection = mapped[0].collection;
    const temp = mapped.
    map((arg) => arg.component).
    sort(
      (arg, arg2) =>
      collection.indexOf(arg) - collection.indexOf(arg2)
    );
    const mapped2 = temp.map((arg) => c0(arg));
    const minValue = Math.min(...mapped2.map((arg) => arg.left));
    const minValue2 = Math.min(...mapped2.map((arg) => arg.top));
    const count = Math.max(...mapped2.map((arg) => arg.right));
    const count2 = Math.max(...mapped2.map((arg) => arg.bottom));
    const minValue3 = Math.min(
      ...temp.map((arg) => collection.indexOf(arg))
    );
    const children = temp.map((component) => ({
      ...component,
      position: {
        ...(component.position || {}),
        x: Number(component.position?.x || 0) - minValue,
        y: Number(component.position?.y || 0) - minValue2
      }
    }));
    const options = {
      id: id2,
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
      children: children
    };
    const allowed = new Set(idSet);
    const filtered = collection.filter((component) => !allowed.has(component.id));
    filtered.splice(Math.min(minValue3, filtered.length), 0, options);
    collection.splice(0, collection.length, ...filtered);
    applyCollectionLayerOrder(collection);
    if (mapped[0].scope === "shared") {
      for (const temp2 of doc.pages || []) {
        const flag = temp2.sharedComponentIds || [];
        const filtered2 = flag.
        map((arg, arg2) => allowed.has(arg) ? arg2 : -1).
        filter((arg) => arg >= 0);
        if (!filtered2.length) {
          continue;
        }
        const minValue4 = Math.min(...filtered2);
        const filtered3 = flag.filter((arg) => !allowed.has(arg));
        filtered3.splice(Math.min(minValue4, filtered3.length), 0, id2);
        temp2.sharedComponentIds = [...new Set(filtered3)];
      }
      syncSharedComponentReferenceOrder(doc);
    }
  });
}
function TN(value) {
  const temp = findComponentLocation(h?.document, value);
  if (!temp || temp.component.type !== "group") {
    return;
  }
  const mapped = (temp.component.children || []).map((component) => component.id);
  componentId = mapped[0] || null;
  selectedComponentIds = new Set(mapped);
  we = componentId;
  De = null;
  L((doc) => {
    const temp2 = findComponentLocation(doc, value);
    if (!temp2 || temp2.component.type !== "group") {
      return;
    }
    const flag = temp2.component.position || {};
    const flag2 = temp2.component.style || {};
    const numeric = Number(flag.rotation || 0);
    const count = Math.max(0.01, Math.min(5, Number(flag2.scale || 1)));
    const number = numeric * Math.PI / 180;
    const temp3 = Math.cos(number);
    const temp4 = Math.sin(number);
    const numeric2 = Number(flag.width || 100);
    const numeric3 = Number(flag.height || 100);
    const number2 = Number(flag.x || 0) + numeric2 / 2;
    const number3 = Number(flag.y || 0) + numeric3 / 2;
    const mapped2 = (temp2.component.children || []).map((component) => {
      const flag3 = component.position || {};
      const numeric4 = Number(flag3.width || 100);
      const numeric5 = Number(flag3.height || 100);
      const number4 = Number(flag3.x || 0) + numeric4 / 2 - numeric2 / 2;
      const number5 = Number(flag3.y || 0) + numeric5 / 2 - numeric3 / 2;
      const number6 = number4 * count;
      const number7 = number5 * count;
      const number8 = number2 + number6 * temp3 - number7 * temp4;
      const number9 = number3 + number6 * temp4 + number7 * temp3;
      const style = {
        ...(component.style || {})
      };
      const count2 = Math.max(
        0.01,
        Math.min(5, Number(style.scale || 1) * count)
      );
      if (flag2.visible === false) {
        style.visible = false;
      }
      style.scale = count2;
      return {
        ...component,
        position: {
          ...flag3,
          x: number8 - numeric4 / 2,
          y: number9 - numeric5 / 2,
          rotation: Number(flag3.rotation || 0) + numeric
        },
        style: style
      };
    });
    temp2.collection.splice(temp2.index, 1, ...mapped2);
    applyCollectionLayerOrder(temp2.collection);
    if (temp2.scope === "shared" && temp2.root) {
      for (const temp5 of doc.pages || []) {
        const flag3 = temp5.sharedComponentIds || [];
        const foundIndex = flag3.indexOf(value);
        if (!(foundIndex < 0)) {
          flag3.splice(foundIndex, 1, ...mapped2.map((component) => component.id));
          temp5.sharedComponentIds = [...new Set(flag3)];
        }
      }
      syncSharedComponentReferenceOrder(doc);
    }
  });
}
function AN(value) {
  const component = findComponent(h?.document, value)?.component;
  if (!!component && component.type === "group") {
    Ct.dataset.groupId = value;
    Fm.value = componentLabel(component);
    D(Dm, "");
    Ct.showModal();
    window.setTimeout(() => Fm.focus(), 0);
  }
}
function Gu(value, arg2, arg3 = null, arg4 = false) {
  const temp = findComponentLocation(value, arg2);
  if (!temp) {
    return null;
  }
  const component = arg3 ?
  clone(arg3) :
  refreshComponentIds(clone(temp.component));
  component.properties = {
    ...(component.properties || {}),
    label: copiedComponentLabel(temp.component, temp.collection)
  };
  delete component.properties.previewState;
  if (arg4) {
    const numeric = Number(value.canvas?.width || 2778);
    const numeric2 = Number(value.canvas?.height || 1940);
    const numeric3 = Number(component.position?.width || 100);
    const numeric4 = Number(component.position?.height || 100);
    component.position = {
      ...(component.position || {}),
      x: clampNumber(
        Number(component.position?.x || 0) + 24,
        -numeric3 / 2,
        numeric - numeric3 / 2
      ),
      y: clampNumber(
        Number(component.position?.y || 0) + 24,
        -numeric4 / 2,
        numeric2 - numeric4 / 2
      )
    };
  }
  temp.collection.splice(temp.index, 0, component);
  applyCollectionLayerOrder(temp.collection);
  if (temp.scope === "shared" && temp.root) {
    for (const temp2 of value.pages || []) {
      const foundIndex = (temp2.sharedComponentIds || []).indexOf(arg2);
      if (foundIndex >= 0) {
        temp2.sharedComponentIds.splice(foundIndex, 0, component.id);
      }
    }
    syncSharedComponentReferenceOrder(value);
  }
  return component;
}
function kc(value, arg2) {
  const temp = findComponentLocation(value, arg2);
  if (!temp) {
    return null;
  }
  const [temp2] = temp.collection.splice(temp.index, 1);
  applyCollectionLayerOrder(temp.collection);
  if (temp.scope === "shared" && temp.root) {
    for (const temp3 of value.pages || []) {
      temp3.sharedComponentIds = (temp3.sharedComponentIds || []).filter(
        (arg) => arg !== arg2
      );
    }
    syncSharedComponentReferenceOrder(value);
  }
  return temp2;
}
function Uu(value) {
  const temp = String(value || "").
  trim().
  toLowerCase();
  if (/^#[\da-f]{6}$/.test(temp)) {
    return temp;
  } else {
    return "";
  }
}
function O() {
  return findComponent(h?.document, componentId)?.component || null;
}
function PN(value) {
  if (De) {
    const component = findComponent(h?.document, De)?.component;
    if (component?.type === "group") {
      return component.children || [];
    }
  }
  if (value === "shared") {
    return h?.document?.sharedComponents || [];
  } else {
    return Je()?.components || [];
  }
}
function Rn(value, arg2, arg3 = []) {
  for (const temp of value || []) {
    if (temp?.type === arg2) {
      arg3.push(temp);
    }
    Rn(temp?.children, arg2, arg3);
  }
  return arg3;
}
function st(value) {
  return (h?.document?.pages || []).flatMap((page) =>
  Rn(page.components, value).map((component) => ({
    component: component,
    page: page
  }))
  );
}
function Mc() {
  x?.setActiveGroup(De);
  x?.setSelectedComponents([...selectedComponentIds], componentId);
}
function qt() {
  s0();
  componentId = null;
  selectedComponentIds = new Set();
  we = null;
}
function s0() {
  for (const value of [Pi, un, zn, Mo]) {
    for (const temp of value.keys()) {
      x?.setComponentPreviewState(temp, "auto");
    }
    value.clear();
  }
}
function Oc(
value,
{
  toggle: arg = false,
  range: arg2 = false,
  preserveGroup: arg3 = false
} = {})
{
  const temp = findComponent(h?.document, value);
  if (!temp) {
    qt();
    Mc();
    _e();
    Z();
    return;
  }
  const temp2 = findComponent(h?.document, componentId);
  const flag =
  temp2?.scope === temp.scope && (
  temp.scope !== "page" || temp2.page?.path === temp.page?.path);
  if (arg3 && selectedComponentIds.has(value)) {
    componentId = value;
  } else if (arg2 && flag && we) {
    const temp3 = PN(temp.scope);
    const temp4 = temp3.findIndex((component) => component.id === we);
    const temp5 = temp3.findIndex((component) => component.id === value);
    if (temp4 >= 0 && temp5 >= 0) {
      const [chosen, chosen2] =
      temp4 <= temp5 ? [temp4, temp5] : [temp5, temp4];
      selectedComponentIds = new Set(
        temp3.slice(chosen, chosen2 + 1).map((component) => component.id)
      );
      componentId = value;
    } else {
      selectedComponentIds = new Set([value]);
      componentId = value;
      we = value;
    }
  } else if (arg && flag) {
    const allowed = new Set(selectedComponentIds);
    if (allowed.has(value)) {
      allowed.delete(value);
    } else {
      allowed.add(value);
    }
    selectedComponentIds = allowed;
    componentId = allowed.has(value) ?
    value :
    allowed.values().next().value || null;
    we = value;
  } else if (!arg && !arg2 && selectedComponentIds.size === 1 && selectedComponentIds.has(value)) {
    qt();
  } else {
    selectedComponentIds = new Set([value]);
    componentId = value;
    we = value;
  }
  if (temp.scope === "shared" && Je()?.path) {
    const temp3 = clone(h.document);
    if (ensureSharedComponentReference(temp3, value, Je().path)) {
      vt(temp3, Je().path).catch(onError);
    }
  }
  if (componentId) {
    $c(temp.scope);
  }
  Mc();
  _e();
  Z();
}
function L(mutate, value = W.value, { throwOnError = false } = {}) {
  const pending = Cr.catch(() => {}).then(async () => {
    if (!h) {
      throw new Error("请先选择仪表盘。");
    }
    const temp = clone(h.document);
    const temp2 = await mutate(temp);
    await vt(temp, value);
    return temp2;
  });
  Cr = pending.catch(onError);
  return throwOnError ? pending : Cr;
}
function kN(value, arg2) {
  const list = [...selectedComponentIds];
  if (!!list.length && (!!value || !!arg2)) {
    L((doc) => {
      const filtered = list.
      map((arg) => findComponent(doc, arg)?.component).
      filter(Boolean);
      if (
      !filtered.length ||
      filtered.some(
        (component2) => component2.properties?.layoutMode === "fill"
      ))
      {
        return;
      }
      const component =
      filtered.length === 1 && filtered[0].type === "air-conditioner" ?
      filtered[0] :
      null;
      if (component && Fu.get(component.id) === "airflow") {
        const count3 = Math.max(1, Number(component.position?.width || 100));
        const count4 = Math.max(1, Number(component.position?.height || 100));
        const temp = airflowCanvasOffsetBounds(component, doc.canvas);
        component.properties = {
          ...(component.properties || {}),
          airflowOffsetX: clampNumber(
            Number(component.properties?.airflowOffsetX ?? -75) +
            value / count3 * 100,
            temp.minX,
            temp.maxX
          ),
          airflowOffsetY: clampNumber(
            Number(component.properties?.airflowOffsetY ?? 34) +
            arg2 / count4 * 100,
            temp.minY,
            temp.maxY
          )
        };
        return;
      }
      const numeric = Number(doc.canvas?.width || 2778);
      const numeric2 = Number(doc.canvas?.height || 1940);
      const count = Math.max(
        ...filtered.map(
          (component2) =>
          -Number(component2.position?.width || 100) / 2 -
          Number(component2.position?.x || 0)
        )
      );
      const minValue = Math.min(
        ...filtered.map(
          (component2) =>
          numeric -
          Number(component2.position?.width || 100) / 2 -
          Number(component2.position?.x || 0)
        )
      );
      const count2 = Math.max(
        ...filtered.map(
          (component2) =>
          -Number(component2.position?.height || 100) / 2 -
          Number(component2.position?.y || 0)
        )
      );
      const minValue2 = Math.min(
        ...filtered.map(
          (component2) =>
          numeric2 -
          Number(component2.position?.height || 100) / 2 -
          Number(component2.position?.y || 0)
        )
      );
      const clamped = clampNumber(value, count, minValue);
      const clamped2 = clampNumber(arg2, count2, minValue2);
      for (const component2 of filtered) {
        if (component) {
          const count3 = Math.max(1, Number(component2.position?.width || 100));
          const count4 = Math.max(
            1,
            Number(component2.position?.height || 100)
          );
          const position = {
            ...(component2.position || {}),
            x: Number(component2.position?.x || 0) + clamped,
            y: Number(component2.position?.y || 0) + clamped2
          };
          const temp = airflowCanvasOffsetBounds(
            {
              ...component2,
              position: position
            },
            doc.canvas
          );
          component2.properties = {
            ...(component2.properties || {}),
            airflowOffsetX: clampNumber(
              Number(component2.properties?.airflowOffsetX ?? -75) -
              clamped / count3 * 100,
              temp.minX,
              temp.maxX
            ),
            airflowOffsetY: clampNumber(
              Number(component2.properties?.airflowOffsetY ?? 34) -
              clamped2 / count4 * 100,
              temp.minY,
              temp.maxY
            )
          };
        }
        component2.position = {
          ...(component2.position || {}),
          x: Number(component2.position?.x || 0) + clamped,
          y: Number(component2.position?.y || 0) + clamped2
        };
      }
    });
  }
}
function c0(value) {
  const flag = value.position || {};
  const count = Math.max(0.01, Number(flag.width || 100));
  const count2 = Math.max(0.01, Number(flag.height || 100));
  const count3 = Math.max(0.01, Math.min(5, Number(value.style?.scale || 1)));
  const number = Number(flag.rotation || 0) * Math.PI / 180;
  const number2 =
  (Math.abs(Math.cos(number)) * count * count3 +
  Math.abs(Math.sin(number)) * count2 * count3) /
  2;
  const number3 =
  (Math.abs(Math.sin(number)) * count * count3 +
  Math.abs(Math.cos(number)) * count2 * count3) /
  2;
  const number4 = Number(flag.x || 0) + count / 2;
  const number5 = Number(flag.y || 0) + count2 / 2;
  return {
    left: number4 - number2,
    top: number5 - number3,
    right: number4 + number2,
    bottom: number5 + number3
  };
}
function l0(value) {
  if (selectedComponentIds.size < 2 || !h || !componentId) {
    return [];
  }
  const list = [...selectedComponentIds].
  map((arg) => findComponent(h.document, arg)?.component).
  filter(Boolean);
  const found = list.find((component) => component.id === componentId);
  if (
  !found ||
  list.length !== selectedComponentIds.size ||
  list.some((component) => component.properties?.layoutMode === "fill"))
  {
    return [];
  }
  const count = Math.max(0.01, Math.min(5, Number(found.style?.scale || 1)));
  const number = Math.max(0.01, Math.min(5, Number(value))) / count;
  const count2 = Math.max(
    ...list.map(
      (el2) => 0.01 / Math.max(0.01, Number(el2.style?.scale || 1))
    )
  );
  const minValue = Math.min(
    ...list.map(
      (el2) => 5 / Math.max(0.01, Number(el2.style?.scale || 1))
    )
  );
  const clamped = clampNumber(number, count2, minValue);
  const mapped = list.map(c0);
  const number2 =
  (Math.min(...mapped.map((arg) => arg.left)) +
  Math.max(...mapped.map((arg) => arg.right))) /
  2;
  const number3 =
  (Math.min(...mapped.map((arg) => arg.top)) +
  Math.max(...mapped.map((arg) => arg.bottom))) /
  2;
  return list.map((component) => {
    const flag = component.position || {};
    const numeric = Number(flag.width || 100);
    const numeric2 = Number(flag.height || 100);
    const number4 = Number(flag.x || 0) + numeric / 2;
    const number5 = Number(flag.y || 0) + numeric2 / 2;
    return {
      componentId: component.id,
      x: number2 + (number4 - number2) * clamped - numeric / 2,
      y: number3 + (number5 - number3) * clamped - numeric2 / 2,
      scale: Math.max(
        0.01,
        Math.min(5, Number(component.style?.scale || 1) * clamped)
      )
    };
  });
}
function d0() {
  const value = [
  ...document.querySelectorAll(".element-item.selected[data-component-id]")].

  map((el2) => el2.dataset.componentId).
  filter(Boolean);
  if (selectedComponentIds.size > 1) {
    return [...selectedComponentIds];
  } else {
    return value;
  }
}
function Gt(value, arg2, rotation, arg4 = []) {
  const chosen = arg4.length > 1 ? arg4 : [arg2];
  for (const temp of chosen) {
    const component = findComponent(value, temp)?.component;
    if (component) {
      component.position = {
        ...(component.position || {}),
        rotation: rotation
      };
    }
  }
}
function MN(value) {
  if (value) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.8"/></svg>';
  } else {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 16 16M2.5 12s3.5-6 9.5-6c2 0 3.7.7 5.1 1.6M21.5 12s-3.5 6-9.5 6c-2 0-3.7-.7-5.1-1.6"/></svg>';
  }
}
function u0(value, visible) {
  const idSet = [...new Set(value || [])];
  if (idSet.length) {
    L((arg) => {
      for (const temp of idSet) {
        const component = findComponent(arg, temp)?.component;
        if (component) {
          component.style = {
            ...(component.style || {}),
            visible: visible
          };
        }
      }
    });
  }
}
function _u() {
  Pe.hidden = true;
  Ou = null;
}
function ON(event, value) {
  event.preventDefault();
  event.stopPropagation();
  Oc(value, {
    preserveGroup: true
  });
  Ou = value;
  const chosen = selectedComponentIds.has(value) ? [...selectedComponentIds] : [value];
  const length = chosen.length;
  const element = Pe.querySelector('[data-component-action="copy"]');
  const element2 = Pe.querySelector('[data-component-action="copy-to-page"]');
  const element3 = Pe.querySelector('[data-component-action="visibility"]');
  const element4 = Pe.querySelector('[data-component-action="delete"]');
  const element5 = Pe.querySelector('[data-component-action="group"]');
  const element6 = Pe.querySelector('[data-component-action="ungroup"]');
  const element7 = Pe.querySelector('[data-component-action="rename-group"]');
  const element8 = Pe.querySelector(":scope > strong");
  element.textContent = length > 1 ? "复制 " + length + " 个控件" : "复制控件";
  const component = findComponent(h?.document, value)?.component;
  const mapped = chosen.
  map((arg) => findComponent(h?.document, arg)?.component).
  filter(Boolean).
  map((el2) => el2.style?.visible !== false);
  const flag =
  mapped.length === chosen.length &&
  mapped.every((arg) => arg === mapped[0]);
  element3.disabled = !flag;
  element3.textContent = flag ?
  mapped[0] ?
  length > 1 ?
  "批量隐藏 " + length + " 个" :
  "隐藏控件" :
  length > 1 ?
  "批量显示 " + length + " 个" :
  "显示控件" :
  "批量隐藏/显示";
  element3.title = flag ? "" : "选中的控件包含隐藏和显示状态，无法批量处理";
  const temp = r0(chosen);
  element5.hidden = !temp;
  element6.hidden = component?.type !== "group" || length !== 1;
  element7.hidden = component?.type !== "group" || length !== 1;
  element2.textContent = "复制到其他区域";
  const hasMatch = ft.some((component2) => component2.id !== h?.projectId);
  const temp2 = p0(h?.document, chosen);
  element2.disabled = temp2.length === 0 && !hasMatch;
  element2.title = element2.disabled ?
  "当前没有可复制的目标区域" :
  length > 1 ?
  "完整复制选中的 " + length + " 个控件到其他页面、侧边栏或其他仪表盘" :
  "完整复制当前控件到其他页面、侧边栏或其他仪表盘";
  element4.textContent = length > 1 ? "删除 " + length + " 个控件" : "删除控件";
  element8.textContent =
  length > 1 ? "颜色标签（" + length + " 个控件）" : "颜色标签";
  const mapped2 = chosen.map((arg) => {
    const component2 = findComponent(h?.document, arg)?.component;
    return Uu(component2?.style?.editorLabelColor);
  });
  const chosen2 = mapped2.every((arg) => arg === mapped2[0]) ?
  mapped2[0] :
  null;
  for (const element9 of Pe.querySelectorAll("[data-label-color]")) {
    element9.classList.toggle(
      "active",
      chosen2 !== null && element9.dataset.labelColor === chosen2
    );
  }
  Pe.hidden = false;
  Pe.style.left = "0px";
  Pe.style.top = "0px";
  window.requestAnimationFrame(() => {
    const rect = Pe.getBoundingClientRect();
    const clamped = clampNumber(
      event.clientX,
      8,
      Math.max(8, window.innerWidth - rect.width - 8)
    );
    const clamped2 = clampNumber(
      event.clientY,
      8,
      Math.max(8, window.innerHeight - rect.height - 8)
    );
    Pe.style.left = clamped + "px";
    Pe.style.top = clamped2 + "px";
  });
}
function p0(value, arg2) {
  const idSet = [...new Set(arg2 || [])].filter(Boolean);
  if (!value || !idSet.length) {
    return [];
  }
  const idSet2 = idSet.map(
    (arg) =>
    new Set(copyComponentTargets(value, arg).map((event2) => event2.key))
  );
  const list = [...(idSet2[0] || [])].filter((arg) =>
  idSet2.every((arg3) => arg3.has(arg))
  );
  const temp = copyComponentTargets(value, idSet[0]);
  return list.
  map((arg) => temp.find((event2) => event2.key === arg)).
  filter(Boolean);
}
function m0(value, arg2) {
  xr = arg2 || null;
  s1.textContent = value;
  ti.showModal();
}
async function BN() {
  const value = xr;
  xr = null;
  ti.close();
  if (value) {
    if (value.projectId && value.projectId !== h?.projectId) {
      await xp(value.projectId, value.pagePath);
    } else if (value.pagePath && value.pagePath !== W.value) {
      W.value = value.pagePath;
      oe(W);
      x?.navigate(value.pagePath);
      Ue?.navigate(value.pagePath);
      _e();
      Z();
    }
    $c(value.scope);
  }
}
function f0(value, arg2 = componentId) {
  const idSet = [...new Set(value || [])];
  if (idSet.length) {
    L((arg) => {
      const index = new Map(
        idSet.map((arg3) => [arg3, findComponentLocation(arg, arg3)])
      );
      const temp = idSet.
      filter((arg3) => index.get(arg3)).
      sort((arg3, arg22) => {
        const temp2 = index.get(arg3);
        const temp3 = index.get(arg22);
        if (temp2.collection === temp3.collection) {
          return temp2.index - temp3.index;
        } else {
          return 0;
        }
      });
      const list = [];
      const idByKey = new Map();
      for (const temp2 of temp) {
        const temp3 = Gu(arg, temp2);
        if (temp3) {
          list.push(temp3.id);
          idByKey.set(temp2, temp3.id);
        }
      }
      if (list.length) {
        componentId = idByKey.get(arg2) || list[0];
        selectedComponentIds = new Set(list);
        we = componentId;
      }
    });
  }
}
function $N(
value,
{ includeShared: arg = true, sourceComponentId: arg2 = null } = {})
{
  if (!value) {
    return [];
  }
  if (arg2) {
    return copyComponentTargets(value, arg2);
  }
  const mapped = (value.pages || []).map((page) => ({
    key: "page:" + page.path,
    name: page.name,
    scope: "page",
    page: page
  }));
  if (arg) {
    return [
    {
      key: "shared",
      name: "侧边栏",
      scope: "shared"
    },
    ...mapped];

  } else {
    return mapped;
  }
}
function Bc(value) {
  co.replaceChildren(
    ...value.map((event2) => new Option(event2.name, event2.key))
  );
  co.disabled = !value.length;
  co.value = value[0]?.key || "";
  oe(co);
}
function g0(value) {
  return {
    width: Number(value?.canvas?.width || 2778),
    height: Number(value?.canvas?.height || 1940)
  };
}
function FN() {
  if (vn.value !== "other" || !kt) {
    Ls.hidden = true;
    qm.textContent = "";
    return;
  }
  const value = g0(h?.document);
  const temp = g0(kt.document);
  const flag = value.width !== temp.width || value.height !== temp.height;
  Ls.hidden = !flag;
  qm.textContent = flag ?
  value.width +
  " × " +
  value.height +
  " → " +
  temp.width +
  " × " +
  temp.height :
  "";
}
async function Yu() {
  const value = vn.value === "other";
  let list = [];
  try {
    list = JSON.parse(at.dataset.componentIds || "[]");
  } catch {
    list = [];
  }
  const temp = findComponent(h?.document, list[0]);
  const length = list.length;
  const element = at.querySelector("[data-copy-component-description]");
  a1.hidden = !value;
  r1.textContent = value ? "其他仪表盘目标页面" : "本仪表盘目标页面";
  lo.textContent = value ? "复制到目标仪表盘" : "复制并前往";
  element.textContent = value ?
  "将选中的 " +
  length +
  " 个控件完整复制到其他仪表盘的目标页面或侧边栏，源控件不受影响。" :
  temp?.scope === "shared" ?
  "将选中的 " +
  length +
  " 个侧边栏控件完整复制到指定主页面，复制后为该页面的独立控件。" :
  "将选中的 " +
  length +
  " 个控件完整复制到侧边栏或其他主页面，保留位置、尺寸、样式、实体绑定和动作配置。";
  kt = null;
  Ls.hidden = true;
  D(wn, "");
  if (!value) {
    const temp3 = p0(h?.document, list);
    Bc(temp3);
    lo.disabled = !temp3.length;
    return;
  }
  const inputValue = ei.value;
  if (!inputValue) {
    Bc([]);
    lo.disabled = true;
    D(wn, "当前没有其他仪表盘可以复制。");
    return;
  }
  const temp2 = ++Mu;
  Bc([]);
  lo.disabled = true;
  D(wn, "正在读取目标仪表盘…");
  try {
    const temp3 = await J(
      "/projects/" + encodeURIComponent(inputValue) + "/draft"
    );
    if (temp2 !== Mu || vn.value !== "other") {
      return;
    }
    kt = temp3;
    const temp4 = $N(temp3.document);
    Bc(temp4);
    FN();
    D(wn, temp4.length ? "" : "目标仪表盘还没有可复制到的区域。");
    lo.disabled = !temp4.length;
  } catch (error) {
    if (temp2 !== Mu) {
      return;
    }
    D(wn, error.message, "error");
  }
}
function DN(value) {
  const document = h?.document;
  const idSet = [...new Set(value || [])].filter((arg) =>
  findComponent(document, arg)
  );
  const temp = findComponent(document, idSet[0]);
  if (!temp || !idSet.length) {
    onError(new Error("没有找到要复制的控件。"));
    return;
  }
  at.dataset.componentIds = JSON.stringify(idSet);
  i1.textContent =
  idSet.length > 1 ?
  "已选择 " + idSet.length + " 个控件" :
  "“" + componentLabel(temp.component) + "”";
  at.querySelector("[data-copy-component-description]").textContent =
  idSet.length > 1 ?
  "将选中的 " + idSet.length + " 个控件完整复制到目标区域。" :
  temp.scope === "shared" ?
  "将侧边栏控件完整复制到指定主页面，复制后为该页面的独立控件。" :
  "将当前控件完整复制到侧边栏或其他主页面，保留位置、尺寸、样式、实体绑定和动作配置。";
  vn.value = "current";
  oe(vn);
  const filtered = ft.filter((component) => component.id !== h.projectId);
  ei.replaceChildren(
    ...filtered.map((component) => new Option(component.name, component.id))
  );
  ei.disabled = !filtered.length;
  oe(ei);
  Ml.elements.copyScaleMode.value = "proportional";
  at.showModal();
  Yu();
}
function h0(value) {
  const idSet = [...new Set(value || [])].filter((arg) =>
  findComponent(h?.document, arg)
  );
  if (idSet.length) {
    Kt.dataset.componentIds = JSON.stringify(idSet);
    if (idSet.length > 1) {
      jm.textContent = "“已选择的 " + idSet.length + " 个控件”";
    } else {
      const component = findComponent(h?.document, idSet[0])?.component;
      jm.textContent =
      "“" +
      componentLabel(
        component || {
          type: "控件"
        }
      ) +
      "”";
    }
    Kt.showModal();
  }
}
function zN(value, arg2) {
  const idSet = [...new Set(value || [])];
  if (!idSet.length) {
    return;
  }
  const temp = Uu(arg2);
  L((arg) => {
    for (const temp2 of idSet) {
      const component = findComponent(arg, temp2)?.component;
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
function b0(value, arg2, arg3, scope) {
  value.replaceChildren();
  if (!arg2.length) {
    const element = document.createElement("div");
    element.className = "element-list-empty";
    element.textContent = arg3;
    value.append(element);
    return;
  }
  for (const temp of arg2) {
    const element = document.createElement("div");
    element.className = "element-item";
    element.dataset.componentId = temp.id;
    element.dataset.scope = scope;
    element.draggable = !De;
    element.classList.toggle("selected", selectedComponentIds.has(temp.id));
    element.classList.toggle("selection-primary", temp.id === componentId);
    element.classList.toggle("group-item", temp.type === "group");
    const temp2 = Uu(temp.style?.editorLabelColor);
    element.classList.toggle("has-color-label", !!temp2);
    if (temp2) {
      element.style.setProperty("--element-label-color", temp2);
    }
    const element2 = document.createElement("i");
    element2.className =
    temp.type === "group" ? "element-group-icon" : "element-label-color";
    element2.setAttribute("aria-hidden", "true");
    if (temp.type === "group") {
      element2.innerHTML =
      '<svg viewBox="0 0 24 24" focusable="false"><path d="M3.5 7.5h6l1.8 2h9.2v9.5h-17z"/><path d="M3.5 7.5v-1h6l1.8 2"/></svg>';
    }
    const element3 = document.createElement("span");
    element3.textContent = componentLabel(temp);
    const flag = temp.style?.visible !== false;
    const element4 = document.createElement("button");
    element4.type = "button";
    element4.className =
    "element-visibility" + (flag ? "" : " hidden-element");
    element4.setAttribute(
      "aria-label",
      flag ?
      "隐藏" + componentLabel(temp) :
      "显示" + componentLabel(temp)
    );
    element4.innerHTML = MN(flag);
    const callback = (event) => {
      wc = {
        componentId: temp.id,
        at: Date.now()
      };
      event.stopPropagation();
    };
    element4.addEventListener("pointerdown", callback);
    element4.addEventListener("click", (event) => {
      wc = {
        componentId: temp.id,
        at: Date.now()
      };
      event.stopPropagation();
      Oc(temp.id, {
        preserveGroup: true
      });
      u0([temp.id], !flag);
    });
    element4.addEventListener("dblclick", callback);
    element.append(element2, element3, element4);
    element.addEventListener("click", (event2) => {
      Oc(temp.id, {
        toggle: event2.metaKey || event2.ctrlKey,
        range: event2.shiftKey
      });
    });
    element.addEventListener("dblclick", (event) => {
      if (
      temp.type !== "group" ||
      event.target.closest(".element-visibility"))
      {
        return;
      }
      if (wc.componentId === temp.id && Date.now() - wc.at < 600) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      De = temp.id;
      qt();
      _e();
      Mc();
      Z();
    });
    element.addEventListener("contextmenu", (arg) => ON(arg, temp.id));
    element.addEventListener("dragstart", (arg) => {
      if (selectedComponentIds.has(temp.id)) {
        componentId = temp.id;
      } else {
        selectedComponentIds = new Set([temp.id]);
        componentId = temp.id;
        we = temp.id;
      }
      const movingIds = [...selectedComponentIds];
      arg.dataTransfer.effectAllowed = "move";
      arg.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          scope: scope,
          sourceId: temp.id,
          movingIds: movingIds
        })
      );
      value.querySelectorAll(".element-item").forEach((element5) => {
        element5.classList.toggle(
          "dragging",
          movingIds.includes(element5.dataset.componentId)
        );
      });
    });
    element.addEventListener("dragend", () => {
      value.
      querySelectorAll(".dragging").
      forEach((element5) => element5.classList.remove("dragging"));
      value.
      querySelectorAll(".drop-before, .drop-after").
      forEach((element5) =>
      element5.classList.remove("drop-before", "drop-after")
      );
    });
    element.addEventListener("dragover", (event) => {
      if (!event.dataTransfer.types.includes("text/plain")) {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const rect =
      event.clientY >=
      element.getBoundingClientRect().top +
      element.getBoundingClientRect().height / 2;
      element.classList.toggle("drop-before", !rect);
      element.classList.toggle("drop-after", rect);
    });
    element.addEventListener("dragleave", () =>
    element.classList.remove("drop-before", "drop-after")
    );
    element.addEventListener("drop", (event) => {
      event.preventDefault();
      let temp3;
      try {
        temp3 = JSON.parse(event.dataTransfer.getData("text/plain"));
      } catch {
        return;
      }
      const { scope: temp4, sourceId: temp5 } = temp3;
      const list = Array.isArray(temp3.movingIds) ?
      temp3.movingIds :
      [temp5];
      const temp6 = element.classList.contains("drop-after");
      element.classList.remove("drop-before", "drop-after");
      if (temp4 === scope && !!temp5 && !list.includes(temp.id)) {
        componentId = temp5;
        selectedComponentIds = new Set(list);
        L((document) => {
          const chosen =
          scope === "shared" ?
          document.sharedComponents :
          document.pages.find((arg) => arg.path === W.value)?.
          components;
          if (!chosen) {
            return;
          }
          const allowed = new Set(list);
          const filtered = chosen.filter((component) => allowed.has(component.id));
          if (!filtered.length) {
            return;
          }
          const filtered2 = chosen.filter((component) => !allowed.has(component.id));
          const temp7 = filtered2.findIndex(
            (component) => component.id === temp.id
          );
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
function VN(value, arg2) {
  if (!arg2) {
    return;
  }
  const element = document.createElement("button");
  element.type = "button";
  element.className = "element-group-back";
  element.textContent = "← 返回" + componentLabel(arg2);
  element.addEventListener("click", () => {
    De = null;
    qt();
    _e();
    Mc();
    Z();
  });
  value.prepend(element);
}
function _e() {
  const value = Je();
  const chosen = De ? findComponent(h?.document, De) : null;
  const chosen2 = chosen?.component?.type === "group" ? chosen.component : null;
  if (De && !chosen2) {
    De = null;
  }
  const chosen3 =
  chosen2 && chosen.scope === "shared" ?
  chosen2.children || [] :
  h?.document?.sharedComponents || [];
  const chosen4 =
  chosen2 && chosen.scope === "page" ?
  chosen2.children || [] :
  value?.components || [];
  b0(Cl, chosen3, "暂无侧边栏控件", "shared");
  b0(Sl, chosen4, "暂无主页面控件", "page");
  if (chosen2) {
    VN(chosen.scope === "shared" ? Cl : Sl, chosen2);
  }
}
function $c(value) {
  vc = value === "page" ? "page" : "shared";
  const flag = vc === "shared";
  Am.classList.toggle("active", flag);
  Pm.classList.toggle("active", !flag);
  Cl.hidden = !flag;
  Sl.hidden = flag;
  y0();
}
function y0() {
  const value = !!Je();
  const doc = jt();
  const hasMatch = ["shared", "page"].some(
    (arg) => listComponentTemplates(arg, doc).length > 0
  );
  vs.disabled = !value || !hasMatch;
  vs.title = value ?
  hasMatch ?
  "从模板库添加控件" :
  "该区域暂无可用控件模板" :
  "请先新建页面";
}
function WN() {
  const value = jt();
  const list = [
  ...listComponentTemplates("shared", value),
  ...listComponentTemplates("page", value)].
  filter(
    (component, arg2, arg3) =>
    arg3.findIndex((component2) => component2.id === component.id) === arg2
  );
  yS.textContent =
  vc === "shared" ?
  "当前添加到侧边栏，添加后会在所有页面显示。" :
  "当前添加到主页面，仅在“" + (Je()?.name || "当前页面") + "”显示。";
  if (!list.length) {
    const element = document.createElement("div");
    element.className = "component-template-empty";
    element.textContent = "当前 UI 方案暂无可用控件模板。";
    wl.replaceChildren(element);
    return;
  }
  wl.replaceChildren(
    ...list.map((component) => {
      const temp = document.createElement("button");
      temp.type = "button";
      temp.className = "component-template-card";
      temp.dataset.templateId = component.id;
      const temp2 = document.createElement("span");
      temp2.className = "component-template-preview";
      temp2.setAttribute("aria-hidden", "true");
      if (component.id === "interaction3d") {
        renderInteraction3dThumbnail(temp2);
      } else {
        const temp4 = document.createElement("img");
        const flag = component.thumbnailId || component.id;
        temp4.src =
        "/bridge-static/component-thumbnails/" +
        encodeURIComponent(flag) +
        ".jpg?v=20260902-component-thumbnails-v3";
        temp4.alt = "";
        temp2.append(temp4);
      }
      const temp3 = document.createElement("span");
      temp3.className = "component-template-copy";
      const element = document.createElement("strong");
      element.textContent = component.name;
      const element2 = document.createElement("span");
      element2.textContent = component.description;
      temp3.append(element, element2);
      temp.append(temp2, temp3);
      if (component.id === "interaction3d") {
        updateInteraction3dCard(temp);
      }
      return temp;
    })
  );
}
const RN = new Set([
"input_boolean",
"input_button",
"input_datetime",
"input_number",
"input_select",
"input_text",
"counter",
"timer",
"schedule"]
);
const HN = {
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
function fe(metadata) {
  return metadata?.domain || String(metadata?.entityId || "").split(".")[0];
}
function Hn(value) {
  const temp = fe(value);
  if (value?.virtual) {
    return "虚拟实体";
  } else if (RN.has(temp)) {
    return "辅助元素";
  } else {
    return HN[temp] || temp || "实体";
  }
}
function Tr(value) {
  return String(value || "").
  replace(/\s+/g, " ").
  trim();
}
function v0(value) {
  return Tr(Iu.get(String(value?.deviceId || "")));
}
function jN(value, arg2 = v0(value)) {
  const temp = Tr(value?.name);
  const temp2 = Tr(value?.originalName);
  if (!arg2) {
    return temp || temp2 || value?.entityId || "";
  }
  const chosen =
  temp === arg2 ?
  "" :
  temp.startsWith(arg2 + " ") ?
  temp.slice(arg2.length).trim() :
  temp.startsWith(arg2 + "·") ?
  temp.slice(arg2.length + 1).trim() :
  temp;
  if (chosen && chosen !== arg2) {
    return chosen;
  } else if (temp2 && temp2 !== arg2) {
    return temp2;
  } else {
    return "";
  }
}
function Ot(value, arg2 = "") {
  if (value?.virtual) {
    return value.name || value.entityId || "";
  }
  const temp = v0(value);
  const flag = Tr(arg2) || jN(value, temp);
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
function ct(value) {
  const temp = Ot(value);
  const flag = value?.entityId || "";
  return (
    "[" +
    Hn(value) +
    "] " +
    temp + (
    temp && temp !== flag ? " · " + flag : ""));

}
function Ar(component = O()) {
  return [
  ...new Set(
    (Array.isArray(component?.properties?.entityIds) ?
    component.properties.entityIds :
    []).

    map((value) => String(value || "").trim()).
    filter(Boolean)
  )];

}
function qN(value, arg2 = null) {
  if (!arg2) {
    return {
      label: "实体已删除",
      tone: "missing"
    };
  }
  const temp = x?.states?.get?.(value);
  const flag = temp?.newState || temp;
  const temp2 = String(flag?.state ?? "").
  trim().
  toLowerCase();
  const temp3 = lightStatisticsEntityStateStatus(arg2, flag);
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
function jn(value = "", arg2 = false) {
  ld.textContent = value;
  ld.hidden = !value;
  ld.classList.toggle("error", !!arg2);
}
const Fc = 100;
function Pr({ clearMessage: value = true } = {}) {
  Rt = "";
  ko = -1;
  Sr = "";
  ig.hidden = true;
  Mr(rt, "选择一个实体");
  if (value) {
    jn("");
  }
}
function Xu(value = "") {
  if (O()?.type !== "light-statistics") {
    return;
  }
  const temp = value.trim().toLocaleLowerCase("zh-CN");
  const mapped = qn("light-statistics").
  map((entity, index) => ({
    entity: entity,
    index: index,
    support: lightStatisticsEntitySupport(entity)
  })).
  filter(
    ({ entity: arg }) =>
    !temp ||
    (ct(arg) + " " + fe(arg)).
    toLocaleLowerCase("zh-CN").
    includes(temp)
  ).
  sort(
    (arg, arg2) =>
    Number(arg2.support.supported) - Number(arg.support.supported) ||
    +(fe(arg2.entity) === "light") - +(fe(arg.entity) === "light") ||
    arg.index - arg2.index
  ).
  map(({ entity: arg, support: _ }) => {
    const temp2 = document.createElement("button");
    temp2.type = "button";
    temp2.className =
    "inspector-entity-option" + (arg.entityId === Rt ? " selected" : "");
    temp2.dataset.lightStatisticsEntityId = arg.entityId;
    temp2.setAttribute("role", "option");
    temp2.setAttribute("aria-selected", String(arg.entityId === Rt));
    const temp3 = document.createElement("span");
    temp3.className = "inspector-entity-option-content";
    temp3.title = ct(arg);
    const temp4 = document.createElement("span");
    temp4.className =
    "inspector-entity-option-line inspector-entity-name-line";
    const element = document.createElement("span");
    element.className = "inspector-entity-kind";
    element.textContent = "[" + Hn(arg) + "] ";
    const element2 = document.createElement("span");
    element2.className = "inspector-entity-name";
    element2.textContent = Ot(arg);
    temp4.append(element, element2);
    const element3 = document.createElement("span");
    element3.className = "inspector-entity-option-line inspector-entity-id";
    element3.textContent = arg.entityId;
    element3.title = arg.entityId;
    temp3.append(temp4, element3);
    Gn(temp2, temp4);
    temp2.append(temp3);
    return temp2;
  });
  if (!mapped.length) {
    const element = document.createElement("div");
    element.className = "inspector-picker-empty";
    element.textContent = "没有匹配的实体";
    mapped.push(element);
  }
  ka.replaceChildren(...mapped);
  ka.scrollTop = 0;
}
function GN(value, arg2 = ko) {
  const temp = O();
  if (
  temp?.type !== "light-statistics" ||
  !qn("light-statistics").find((arg) => arg.entityId === value))
  {
    return;
  }
  const foundIndex = Ar(temp).indexOf(value);
  if (foundIndex >= 0 && foundIndex !== arg2) {
    jn("该实体已添加，请选择其它实体。", true);
    return;
  }
  Rt = value;
  ko = Number.isInteger(arg2) ? arg2 : -1;
  Sr = temp.id;
  return w0();
}
function w0() {
  const value = componentId;
  const temp = Rt;
  const temp2 = ko;
  const found = le.find((arg) => arg.entityId === temp);
  if (!value || !temp || !found) {
    return;
  }
  const temp3 = O();
  if (temp2 < 0 && Ar(temp3).length >= Fc) {
    jn("每个统计控件最多添加 " + Fc + " 个实体。", true);
    return;
  }
  return L((arg) => {
    const component = findComponent(arg, value)?.component;
    if (!component || component.type !== "light-statistics") {
      return "component-invalid";
    }
    const entityIds = Ar(component);
    const foundIndex = entityIds.indexOf(temp);
    if (foundIndex >= 0 && foundIndex !== temp2) {
      return "duplicate";
    }
    const chosen =
    temp2 >= 0 && temp2 < entityIds.length ? entityIds[temp2] : "";
    if (!chosen && entityIds.length >= Fc) {
      return "limit-reached";
    }
    if (temp2 >= 0 && !chosen) {
      return "component-invalid";
    }
    if (chosen) {
      entityIds.splice(temp2, 1, temp);
    } else {
      entityIds.push(temp);
    }
    const entityLabels = {
      ...(component.properties?.entityLabels || {})
    };
    if (chosen && chosen !== temp) {
      delete entityLabels[chosen];
    }
    entityLabels[temp] = Ot(found);
    component.properties = {
      ...(component.properties || {}),
      entityIds: entityIds,
      entityLabels: entityLabels
    };
    if (chosen) {
      return "replaced";
    } else {
      return "added";
    }
  }).then((arg) =>
  arg === "limit-reached" ? (
  jn("每个统计控件最多添加 " + Fc + " 个实体。", true), arg) :
  arg === "duplicate" ? (
  jn("该实体已添加，请选择其它实体。", true), arg) :
  arg === "component-invalid" ? (
  jn("当前统计控件已发生变化，请重新选择。", true), arg) : (
  arg !== "added" && arg !== "replaced" || (
  Pr({
    clearMessage: false
  }),
  jn(
    arg === "replaced" ? "已更换统计实体。" : "已加入统计列表。"
  )),
  arg)
  );
}
function UN(value) {
  const temp = componentId;
  if (!!temp && !!Number.isInteger(value) && !(value < 0)) {
    L((arg) => {
      const component = findComponent(arg, temp)?.component;
      if (!component || component.type !== "light-statistics") {
        return;
      }
      const entityIds = Ar(component);
      const [temp2] = entityIds.splice(value, 1);
      const entityLabels = {
        ...(component.properties?.entityLabels || {})
      };
      if (temp2) {
        delete entityLabels[temp2];
      }
      component.properties = {
        ...(component.properties || {}),
        entityIds: entityIds,
        entityLabels: entityLabels
      };
    });
    Pr();
  }
}
function C0(component = O()) {
  if (component?.type !== "light-statistics") {
    return;
  }
  const value = Ar(component);
  const flag = component.properties?.entityLabels || {};
  U1.textContent = value.length + " 个";
  const mapped = value.map((arg, arg2) => {
    const flag2 =
    qn("light-statistics").find((arg3) => arg3.entityId === arg) ||
    null;
    const temp = qN(arg, flag2);
    const temp2 = document.createElement("div");
    temp2.className =
    "light-statistics-entity-row " + temp.tone + (flag2 ? "" : " missing");
    const temp3 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = flag2 ? Ot(flag2) : flag[arg] || arg;
    const element2 = document.createElement("small");
    element2.textContent = arg + " · " + temp.label;
    temp3.append(element, element2);
    const temp4 = document.createElement("span");
    temp4.className = "light-statistics-entity-actions";
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.dataset.lightStatisticsReplaceIndex = String(arg2);
    element3.textContent = "更换";
    const element4 = document.createElement("button");
    element4.type = "button";
    element4.dataset.lightStatisticsRemoveIndex = String(arg2);
    element4.textContent = "删除";
    temp4.append(element3, element4);
    temp2.append(temp3, temp4);
    return temp2;
  });
  ag.replaceChildren(...mapped);
}
function S0(value, arg2 = []) {
  for (const temp of value || []) {
    arg2.push(temp);
    S0(temp.children, arg2);
  }
  return arg2;
}
function _N(value = Je()) {
  if (!value || !h?.document) {
    return [];
  }
  const index = new Map(
    (h.document.sharedComponents || []).map((component) => [component.id, component])
  );
  const filtered = (value.sharedComponentIds || []).
  map((arg) => index.get(arg)).
  filter(Boolean);
  return S0([...(value.components || []), ...filtered]);
}
function kr(value = Je()) {
  if (_N(value).some((component) => component.type === "icon-button-effect")) {
    return [createIconVisibilityVirtualEntity(value?.path)];
  } else {
    return [];
  }
}
function qn(_ = "image") {
  return [...le, ...kr()];
}
const Dc = new WeakMap();
const x0 = new WeakMap();
const YN =
"[data-overflow-scroll-preview], .inspector-picker-value, .inspector-entity-name-line";
function Gn(value, arg2) {
  const filtered = (Array.isArray(arg2) ? arg2 : [arg2]).filter(Boolean);
  for (const temp of filtered) {
    temp.dataset.overflowScrollPreview = "true";
  }
  if (value && filtered.length) {
    value.dataset.overflowScrollPreviewRow = "true";
    x0.set(value, filtered);
  }
}
function N0(value) {
  const temp = value.closest?.(YN);
  if (temp) {
    return temp;
  }
  const temp2 = value.closest?.("[data-overflow-scroll-preview-row]");
  return x0.get(temp2)?.[0] || null;
}
function E0(value) {
  return value?.closest?.("[data-overflow-scroll-preview-row]") || value;
}
function L0(element) {
  const value = Dc.get(element);
  if (value) {
    window.clearTimeout(value.timer);
    window.cancelAnimationFrame(value.frame);
    Dc.delete(element);
  }
  element.scrollLeft = 0;
  element.classList.remove("hover-scrolling");
}
function I0(element) {
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
  Gn(element, inspectorPickerValue);
  return inspectorPickerValue;
}
function Mr(value, arg2, arg3 = "") {
  const element = I0(value);
  if (element) {
    element.textContent = arg2;
    element.title = arg3 || arg2;
    value.title = arg3 || arg2;
  }
}
document.addEventListener("pointerover", (value) => {
  const element = N0(value.target);
  const temp = E0(element);
  const flag =
  value.relatedTarget instanceof Node &&
  temp?.contains(value.relatedTarget);
  if (!element || flag || Dc.has(element)) {
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
  Dc.set(element, options);
  options.timer = window.setTimeout(() => {
    if (!element.isConnected) {
      L0(element);
      return;
    }
    element.classList.add("hover-scrolling");
    const temp2 = performance.now();
    const callback = (arg) => {
      const number = (arg - temp2) * 0.04;
      element.scrollLeft = Math.min(count, number);
      if (number < count) {
        options.frame = window.requestAnimationFrame(callback);
      }
    };
    options.frame = window.requestAnimationFrame(callback);
  }, 350);
});
document.addEventListener("pointerout", (value) => {
  const temp = N0(value.target);
  const temp2 = E0(temp);
  const flag =
  value.relatedTarget instanceof Node &&
  temp2?.contains(value.relatedTarget);
  if (!!temp && !flag) {
    L0(temp);
  }
});
function closePickerPanel(panel, toggleButton) {
  panel.hidden = true;
  toggleButton.setAttribute("aria-expanded", "false");
  if (panel === Re) {
    Qe();
    Ht(Vn.get(po));
  }
  if (panel === He) {
    Qe();
    Ht(Vn.get(ho));
  }
}
function closeOtherPickerPanels(keepKind = null) {
  if (keepKind !== "entity") {
    closePickerPanel(aa, oi);
  }
  if (keepKind !== "weather-entity") {
    closePickerPanel(Zd, Jd);
  }
  if (keepKind !== "line-chart-entity") {
    closePickerPanel(eu, Qd);
  }
  if (keepKind !== "ibe-entity") {
    closePickerPanel(Ts, Gl);
  }
  if (keepKind !== "icon-button-entity") {
    closePickerPanel(mi, pi);
  }
  if (keepKind !== "vacuum-map-entity") {
    closePickerPanel(nc, Gd);
  }
  if (keepKind !== "camera-entity") {
    closePickerPanel(ac, Yd);
  }
  if (keepKind !== "air-conditioner-entity") {
    closePickerPanel(Js, Dd);
  }
  if (keepKind !== "title-button-entity") {
    closePickerPanel(Ms, ad);
  }
  if (keepKind !== "light-statistics-entity") {
    const flag = !Ie.hidden;
    closePickerPanel(Ie, rt);
    if (flag) {
      Pr();
    }
  }
  if (keepKind !== "light-statistics-action-entity") {
    closePickerPanel(Vs, dd);
  }
  if (keepKind !== "navigation-entity") {
    closePickerPanel(iu, ou);
  }
  if (keepKind !== "asset") {
    closePickerPanel(Re, Cn);
  }
  if (keepKind !== "ibe-asset") {
    closePickerPanel(He, En);
  }
  if (keepKind !== "ibe-icon") {
    closePickerPanel(Et, Qt);
  }
  if (keepKind !== "icon-button-icon") {
    closePickerPanel(It, Lt);
  }
  if (keepKind !== "title-button-icon") {
    closePickerPanel(je, tn);
  }
  if (keepKind !== "light-statistics-icon") {
    closePickerPanel(qe, nn);
  }
  if (keepKind !== "navigation-icon") {
    closePickerPanel(Tt, on);
  }
}
function Fi(value) {
  const temp = String(value || "").
  trim().
  replace(/^mdi:/, "");
  if (/^[a-z0-9-]+$/.test(temp)) {
    return "/bridge-static/vendor/mdi/7.4.47/svg/" + temp + ".svg";
  } else {
    return "";
  }
}
function XN(value) {
  const text = String(value || "");
  const element = on.querySelector("i");
  const element2 = on.querySelector("span");
  const temp = Fi(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? 'url("' + temp + '")' : "";
  element.style.webkitMaskImage = temp ? 'url("' + temp + '")' : "";
  element2.textContent = text || "不使用图标";
  cr.disabled = !text;
  cr.title = text ? "复制 " + text : "当前未使用图标";
}
function KN(value) {
  const text = String(value || "");
  const element = Qt.querySelector("i");
  const element2 = Qt.querySelector("span");
  const temp = Fi(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? 'url("' + temp + '")' : "";
  element.style.webkitMaskImage = temp ? 'url("' + temp + '")' : "";
  element2.textContent = text || "不使用图标";
  wa.disabled = !text;
  wa.title = text ? "复制 " + text : "当前未使用图标";
}
function JN(value) {
  const text = String(value || "");
  const includesValue = ["device-button", "presence-sensor"].includes(O()?.type);
  const element = Lt.querySelector("i");
  const element2 = Lt.querySelector("span");
  const temp = Fi(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? 'url("' + temp + '")' : "";
  element.style.webkitMaskImage = temp ? 'url("' + temp + '")' : "";
  element2.textContent = text || (includesValue ? "跟随实体图标" : "不使用图标");
  Da.disabled = !text;
  Da.title = text ? "复制 " + text : "当前未使用图标";
}
function ZN(value) {
  const text = String(value || "");
  const element = tn.querySelector("i");
  const element2 = tn.querySelector("span");
  const temp = Fi(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? 'url("' + temp + '")' : "";
  element.style.webkitMaskImage = temp ? 'url("' + temp + '")' : "";
  element2.textContent = text || "不使用图标";
  La.disabled = !text;
  La.title = text ? "复制 " + text : "当前未使用图标";
}
function QN(value) {
  const text = String(value ?? "mdi:lightbulb-group-outline");
  const element = nn.querySelector("i");
  const element2 = nn.querySelector("span");
  const temp = Fi(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? 'url("' + temp + '")' : "";
  element.style.webkitMaskImage = temp ? 'url("' + temp + '")' : "";
  element2.textContent = text || "不使用图标";
  Ma.disabled = !text;
  Ma.title = text ? "复制 " + text : "当前未使用图标";
}
async function zo(value) {
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
function T0(value, arg2 = () => value.dataset.entityId || "") {
  if (!value || value.dataset.entityCopyReady === "true") {
    return value._entityCopySync;
  }
  I0(value);
  const temp = document.createElement("div");
  temp.className = "entity-picker-field-row";
  const element = document.createElement("button");
  element.type = "button";
  element.className = "navigation-icon-copy entity-picker-copy";
  element.title = "复制实体 ID";
  element.setAttribute("aria-label", "复制实体 ID");
  element.disabled = true;
  element.innerHTML =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8" height="8" rx="1.3"></rect><path d="M10.5 5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9A1.5 1.5 0 0 0 3.5 10.5H5"></path></svg><span aria-hidden="true">✓</span>';
  const readEntityId = () => {
    const text = String(arg2() || "");
    element.dataset.entityId = text;
    element.disabled = !text;
    element.title = text ? "复制 " + text : "当前未选择实体";
  };
  element.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const flag = element.dataset.entityId || "";
    if (flag) {
      try {
        await zo(flag);
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
function eE() {
  for (const value of [
  "image-entity-button",
  "ibe-entity-button",
  "icon-button-entity-button",
  "air-conditioner-entity-button",
  "vacuum-map-entity-button",
  "camera-entity-button",
  "weather-entity-button",
  "line-chart-entity-button",
  "navigation-entity-button",
  "popup-module-entity-button"])
  {
    const temp = document.getElementById(value);
    if (temp) {
      T0(temp);
    }
  }
}
eE();
const tE = 160;
const A0 = new WeakMap();
function nE(value) {
  let temp = A0.get(value);
  if (!temp) {
    temp = {
      query: "",
      offset: 0,
      total: 0,
      loading: false,
      complete: false,
      generation: 0
    };
    A0.set(value, temp);
  }
  return temp;
}
let Ku = null;
function Ju() {
  Ku?.remove();
  Ku = null;
}
function P0(element, value) {
  Ju();
  const ancestorEl = element.closest("dialog");
  if (!ancestorEl?.open || !value) {
    return;
  }
  const element2 = document.createElement("div");
  element2.className = "editor-icon-name-tooltip";
  element2.textContent = value;
  ancestorEl.append(element2);
  const rect = element.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();
  const minValue = Math.min(
    window.innerWidth - rect2.width - 8,
    Math.max(8, rect.left + (rect.width - rect2.width) / 2)
  );
  let number = rect.top - rect2.height - 8;
  if (number < 8) {
    number = rect.bottom + 8;
  }
  element2.style.left = minValue + "px";
  element2.style.top = number + "px";
  Ku = element2;
}
function oE(value, arg2) {
  value.addEventListener("pointerenter", () => P0(value, arg2));
  value.addEventListener("pointerleave", Ju);
  value.addEventListener("focus", () => P0(value, arg2));
  value.addEventListener("blur", Ju);
}
async function Or({
  optionsElement: value,
  query: arg = "",
  currentIcon: arg2 = "",
  clearLabel: arg3 = "不使用图标",
  datasetKey: arg4 = "iconName",
  append: arg5 = false
}) {
  const trimmed = String(arg || "").trim();
  const temp = nE(value);
  if (!arg5 || temp.query !== trimmed) {
    temp.query = trimmed;
    temp.offset = 0;
    temp.total = 0;
    temp.loading = false;
    temp.complete = false;
    temp.generation += 1;
    const element2 = document.createElement("div");
    element2.className = "navigation-icon-load-state";
    element2.textContent = "正在加载图标…";
    value.replaceChildren(rE(arg2, arg3, arg4), element2);
    value.scrollTop = 0;
  }
  if (temp.loading || temp.complete) {
    return;
  }
  const generation = temp.generation;
  const navigationIconLoadState = value.querySelector(
    ".navigation-icon-load-state"
  );
  temp.loading = true;
  if (navigationIconLoadState) {
    navigationIconLoadState.textContent = temp.offset ?
    "正在加载更多图标…" :
    "正在加载图标…";
  }
  try {
    const temp2 = await J(
      "/icons?query=" +
      encodeURIComponent(temp.query) +
      "&limit=" +
      tE +
      "&offset=" +
      temp.offset
    );
    if (generation !== temp.generation) {
      return;
    }
    const flag = temp2.items || [];
    const mapped = flag.map((arg6) => B0(arg6, arg2, arg4));
    if (navigationIconLoadState && mapped.length) {
      navigationIconLoadState.before(...mapped);
    }
    temp.offset += flag.length;
    temp.total = Math.max(Number(temp2.total) || 0, temp.offset);
    temp.complete = !flag.length || temp.offset >= temp.total;
    temp.loading = false;
    if (navigationIconLoadState) {
      navigationIconLoadState.textContent = temp.total ?
      temp.complete ?
      "已显示全部 " + temp.total + " 个图标" :
      "已加载 " + temp.offset + " / " + temp.total + " · 继续向下滚动" :
      "没有匹配的图标";
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
function Br(value, arg2) {
  value.addEventListener("scroll", () => {
    if (!(value.scrollHeight - value.scrollTop - value.clientHeight > 120)) {
      arg2().catch(onError);
    }
  });
}
async function Zu(query = "", { append = false } = {}) {
  return Or({
    optionsElement: dr,
    query: query,
    currentIcon: O()?.properties?.icon || "",
    append: append
  });
}
async function Qu(query = "", { append = false } = {}) {
  return Or({
    optionsElement: Sa,
    query: query,
    currentIcon: O()?.properties?.icon || "",
    append: append
  });
}
async function ep(query = "", { append = false } = {}) {
  const component = O();
  return Or({
    optionsElement: Va,
    query: query,
    currentIcon: component?.properties?.icon || "",
    clearLabel:
    component?.type === "device-button" ? "跟随实体图标" : "不使用图标",
    append: append
  });
}
async function tp(query = "", { append = false } = {}) {
  return Or({
    optionsElement: Ta,
    query: query,
    currentIcon: O()?.properties?.icon || "",
    append: append
  });
}
async function np(query = "", { append = false } = {}) {
  const value = O()?.properties || {};
  const currentIcon = String(
    Object.hasOwn(value, "icon") ?
    value.icon || "" :
    "mdi:lightbulb-group-outline"
  );
  return Or({
    optionsElement: Ba,
    query: query,
    currentIcon: currentIcon,
    datasetKey: "lightStatisticsIconName",
    append: append
  });
}
Br(dr, () =>
Zu(lr.value, {
  append: true
})
);
Br(Sa, () =>
Qu(Ca.value, {
  append: true
})
);
Br(Va, () =>
ep(za.value, {
  append: true
})
);
Br(Ta, () =>
tp(Ia.value, {
  append: true
})
);
Br(Ba, () =>
np(Oa.value, {
  append: true
})
);
function k0() {
  if (Tt.hidden) {
    return;
  }
  const value = on.parentElement.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  Tt.style.left =
  clampNumber(
    value.left,
    temp2,
    Math.max(temp2, window.innerWidth - value.width - temp2)
  ) + "px";
  Tt.style.top = flag ?
  value.bottom + temp + "px" :
  Math.max(temp2, value.top - count - temp) + "px";
  Tt.style.width = value.width + "px";
  Tt.style.maxHeight = count + "px";
  dr.style.maxHeight = Math.max(90, count - 57) + "px";
}
function M0() {
  if (Et.hidden) {
    return;
  }
  const value = Qt.parentElement.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  Et.style.left =
  clampNumber(
    value.left,
    temp2,
    Math.max(temp2, window.innerWidth - value.width - temp2)
  ) + "px";
  Et.style.top = flag ?
  value.bottom + temp + "px" :
  Math.max(temp2, value.top - count - temp) + "px";
  Et.style.width = value.width + "px";
  Et.style.maxHeight = count + "px";
  Sa.style.maxHeight = Math.max(90, count - 57) + "px";
}
function O0() {
  if (It.hidden) {
    return;
  }
  const value = Lt.parentElement.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  It.style.left =
  clampNumber(
    value.left,
    temp2,
    Math.max(temp2, window.innerWidth - value.width - temp2)
  ) + "px";
  It.style.top = flag ?
  value.bottom + temp + "px" :
  Math.max(temp2, value.top - count - temp) + "px";
  It.style.width = value.width + "px";
  It.style.maxHeight = count + "px";
  Va.style.maxHeight = Math.max(90, count - 57) + "px";
}
function op() {
  if (je.hidden) {
    return;
  }
  const value = tn.parentElement.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  je.style.left =
  clampNumber(
    value.left,
    temp2,
    Math.max(temp2, window.innerWidth - value.width - temp2)
  ) + "px";
  je.style.top = flag ?
  value.bottom + temp + "px" :
  Math.max(temp2, value.top - count - temp) + "px";
  je.style.width = value.width + "px";
  je.style.maxHeight = count + "px";
  Ta.style.maxHeight = Math.max(90, count - 57) + "px";
}
function ip() {
  if (qe.hidden) {
    return;
  }
  const value = nn.parentElement.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  qe.style.left =
  clampNumber(
    value.left,
    temp2,
    Math.max(temp2, window.innerWidth - value.width - temp2)
  ) + "px";
  qe.style.top = flag ?
  value.bottom + temp + "px" :
  Math.max(temp2, value.top - count - temp) + "px";
  qe.style.width = value.width + "px";
  qe.style.maxHeight = count + "px";
  Ba.style.maxHeight = Math.max(90, count - 57) + "px";
}
function ap() {
  if (Ie.hidden) {
    return;
  }
  const value = rt.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const minValue = Math.min(value.width, window.innerWidth - temp2 * 2);
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(430, flag ? number : number2));
  Ie.style.left =
  clampNumber(
    value.left,
    temp2,
    Math.max(temp2, window.innerWidth - minValue - temp2)
  ) + "px";
  Ie.style.top = flag ?
  value.bottom + temp + "px" :
  Math.max(temp2, value.top - count - temp) + "px";
  Ie.style.width = minValue + "px";
  Ie.style.maxHeight = count + "px";
  ka.style.maxHeight = Math.max(90, count - 58) + "px";
}
function Un(componentType = "image") {
  if (componentType === "light-statistics") {
    return {
      componentType: componentType,
      button: dd,
      menu: Vs,
      search: _1,
      options: Y1,
      except: "light-statistics-action-entity",
      relatedSettings: false,
      recommended: (recommended) =>
      TOGGLE_ENTITY_DOMAINS.has(fe(recommended)) ? 2 : 0
    };
  } else if (componentType === "navigation-button") {
    return {
      componentType: componentType,
      button: ou,
      menu: iu,
      search: Zx,
      options: Qx,
      except: "navigation-entity",
      recommended: (recommended) =>
      recommended?.virtual ?
      3 :
      TOGGLE_ENTITY_DOMAINS.has(fe(recommended)) ?
      2 :
      0
    };
  } else if (componentType === "title-button") {
    return {
      componentType: componentType,
      button: ad,
      menu: Ms,
      search: R1,
      options: H1,
      except: "title-button-entity",
      recommended: (recommended) =>
      recommended?.virtual ?
      3 :
      TOGGLE_ENTITY_DOMAINS.has(fe(recommended)) ?
      2 :
      0
    };
  } else if (componentType === "vacuum-map") {
    return {
      componentType: componentType,
      button: Gd,
      menu: nc,
      search: Mx,
      options: Ox,
      except: "vacuum-map-entity",
      recommended: (recommended) =>
      ["camera", "image"].includes(fe(recommended)) ?
      /(?:^|[_.\s-])map(?:$|[_.\s-])|地图/i.test(
        (recommended.entityId || "") + " " + (recommended.name || "")
      ) ?
      2 :
      1 :
      0
    };
  } else if (componentType === "camera") {
    return {
      componentType: componentType,
      button: Yd,
      menu: ac,
      search: Bx,
      options: $x,
      except: "camera-entity",
      recommended: (recommended) => fe(recommended) === "camera"
    };
  } else if (componentType === "air-conditioner") {
    return {
      componentType: componentType,
      button: Dd,
      menu: Js,
      search: Ex,
      options: Lx,
      except: "air-conditioner-entity",
      recommended: (recommended) =>
      fe(recommended) === "climate" ? 2 : fe(recommended) === "fan" ? 1 : 0
    };
  } else if (componentType === "device-button") {
    return {
      componentType: componentType,
      button: pi,
      menu: mi,
      search: md,
      options: fd,
      except: "icon-button-entity",
      recommended: (recommended) => TOGGLE_ENTITY_DOMAINS.has(fe(recommended))
    };
  } else if (componentType === "presence-sensor") {
    return {
      componentType: componentType,
      button: pi,
      menu: mi,
      search: md,
      options: fd,
      except: "icon-button-entity",
      recommended: (recommended) => {
        const recommended2 =
        (recommended.entityId || "") +
        " " + (
        recommended.name || "") +
        " " + (
        recommended.originalName || "") +
        " " + (
        recommended.translationKey || "");
        const recommended3 = O()?.properties?.sensorKind || "presence";
        const recommended4 = fe(recommended);
        if (recommended4 === "event") {
          if (
          recommended3 === "presence" &&
          /motion|occupancy|presence|pir|moving|移动|运动|人体|有人/i.test(
            recommended2
          ))
          {
            return 4;
          } else {
            return 0;
          }
        } else if (recommended4 !== "binary_sensor") {
          return 0;
        } else if (recommended3 === "water-leak") {
          if (
          /moisture|water|leak|flood|wet|水浸|漏水|积水|湿/i.test(
            recommended2
          ))
          {
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
          if (
          /natural[_ -]?gas|combustible|gas|燃气|天然气|可燃气/i.test(
            recommended2
          ))
          {
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
        } else if (
        /presence|occupancy|人在|有人|存在|人体/i.test(recommended2))
        {
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
      componentType: componentType,
      button: pi,
      menu: mi,
      search: md,
      options: fd,
      except: "icon-button-entity",
      recommended: (recommended) => fe(recommended) === "light"
    };
  } else if (componentType === "icon-button-effect") {
    return {
      componentType: componentType,
      button: Gl,
      menu: Ts,
      search: T1,
      options: A1,
      except: "ibe-entity",
      recommended: (recommended) => fe(recommended) === "light"
    };
  } else if (componentType === "weather") {
    return {
      componentType: componentType,
      button: Jd,
      menu: Zd,
      search: Hx,
      options: jx,
      except: "weather-entity",
      recommended: (recommended) => fe(recommended) === "weather"
    };
  } else if (componentType === "line-chart") {
    return {
      componentType: componentType,
      button: Qd,
      menu: eu,
      search: Gx,
      options: Ux,
      except: "line-chart-entity",
      recommended: (recommended) => fe(recommended) === "sensor"
    };
  } else {
    return {
      componentType: "image",
      button: oi,
      menu: aa,
      search: ra,
      options: _m,
      except: "entity",
      recommended: (recommended) =>
      ["image", "camera"].includes(fe(recommended))
    };
  }
}
function $r(value = "", arg2 = "image") {
  const temp = Un(arg2);
  const flag = O()?.bindings?.entity?.entityId || "";
  const temp2 = value.trim().toLocaleLowerCase("zh-CN");
  const mapped = qn(arg2).
  map((entity, index) => ({
    entity: entity,
    index: index
  })).
  filter(
    ({ entity: arg }) =>
    !temp2 ||
    (ct(arg) + " " + fe(arg)).
    toLocaleLowerCase("zh-CN").
    includes(temp2)
  ).
  sort((arg, arg22) => {
    const callback = (arg3) =>
    arg3?.virtual ? 100 : Number(temp.recommended(arg3));
    return (
      callback(arg22.entity) - callback(arg.entity) || arg.index - arg22.index);

  }).
  map(({ entity: arg }) => arg);
  const element = document.createElement("button");
  element.type = "button";
  element.className =
  "inspector-entity-option inspector-entity-clear" + (
  flag ? "" : " selected");
  element.dataset.entityId = "";
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(!flag));
  element.textContent = "不使用实体";
  const mapped2 = mapped.map((arg) => {
    const temp3 = document.createElement("button");
    temp3.type = "button";
    temp3.className =
    "inspector-entity-option" + (
    arg.entityId === flag ? " selected" : "");
    temp3.dataset.entityId = arg.entityId;
    temp3.setAttribute("role", "option");
    temp3.setAttribute("aria-selected", String(arg.entityId === flag));
    const temp4 = document.createElement("span");
    temp4.className = "inspector-entity-option-content";
    temp4.title = ct(arg);
    const temp5 = document.createElement("span");
    temp5.className =
    "inspector-entity-option-line inspector-entity-name-line";
    const element3 = document.createElement("span");
    element3.className = "inspector-entity-kind";
    element3.textContent = "[" + Hn(arg) + "] ";
    const element4 = document.createElement("span");
    element4.className = "inspector-entity-name";
    element4.textContent = Ot(arg);
    temp5.append(element3, element4);
    const element5 = document.createElement("span");
    element5.className = "inspector-entity-option-line inspector-entity-id";
    element5.textContent = arg.entityId;
    element5.title = arg.entityId;
    temp4.append(temp5, element5);
    Gn(temp3, temp5);
    temp3.append(temp4);
    return temp3;
  });
  const element2 = document.createElement("div");
  element2.className = "inspector-picker-empty";
  if (!mapped.length) {
    element2.textContent = "没有匹配的实体";
  }
  temp.options.replaceChildren(
    element,
    ...mapped2,
    ...(element2.textContent ? [element2] : [])
  );
  temp.options.scrollTop = 0;
}
function Bt(component) {
  const value = Un(component.type);
  const flag = component.bindings?.entity?.entityId || "";
  const found = qn(component.type).find(
    (arg) => arg.entityId === flag
  );
  const chosen = found ? ct(found) : flag || "不使用实体";
  let inspectorPickerValue = value.button.querySelector(
    ".inspector-picker-value"
  );
  if (!inspectorPickerValue) {
    inspectorPickerValue = document.createElement("span");
    inspectorPickerValue.className = "inspector-picker-value";
    value.button.replaceChildren(inspectorPickerValue);
    Gn(value.button, inspectorPickerValue);
  }
  inspectorPickerValue.textContent = chosen;
  inspectorPickerValue.title = chosen;
  value.button.dataset.entityId = flag;
  value.button._entityCopySync?.();
  value.search.value = "";
  if (!value.menu.hidden) {
    $r("", component.type);
  }
  aE(
    component,
    value.relatedSettings === false ?
    null :
    value.button.closest(".inspector-picker")
  );
}
let Vo = null;
let rp = null;
let zc = null;
let sp = null;
let Wo = null;
let Di = null;
let Ze = null;
let cp = null;
let mn = null;
function Fr() {
  return new Map(
    le.
    map((value) => [String(value.entityId || ""), value]).
    filter(([value]) => value)
  );
}
function Dr() {
  return new Map(
    cn.
    map((value) => [String(value.deviceId || ""), value]).
    filter(([value]) => value)
  );
}
function lp() {
  const value = String(mn?.value || "").
  trim().
  toLocaleLowerCase("zh-CN");
  let temp = 0;
  for (const temp2 of Wo?.querySelectorAll("[data-related-entity-id]") || []) {
    const flag =
    !value ||
    String(temp2.dataset.relatedEntitySearch || "").includes(value);
    temp2.hidden = !flag;
    if (flag) {
      temp += 1;
    }
  }
  const el2 = Wo?.querySelector(".popup-related-entity-filter-empty");
  if (el2) {
    el2.hidden = temp > 0;
  }
}
function iE() {
  if (Vo) {
    return Vo;
  }
  Vo = document.createElement("div");
  Vo.id = "popup-related-entity-settings";
  Vo.className = "popup-related-entity-settings";
  rp = document.createElement("strong");
  zc = document.createElement("span");
  Di = document.createElement("button");
  Di.type = "button";
  Di.className = "popup-related-entity-open";
  const element = document.createElement("i");
  element.setAttribute("aria-hidden", "true");
  element.textContent = "›";
  Di.append(zc, element);
  sp = document.createElement("p");
  Vo.append(rp, Di, sp);
  Ze = document.createElement("dialog");
  Ze.id = "popup-related-entity-dialog";
  Ze.className = "popup-related-entity-dialog";
  const value = document.createElement("div");
  value.className = "popup-related-entity-dialog-card";
  const temp = document.createElement("div");
  temp.className = "popup-related-entity-dialog-heading";
  const temp2 = document.createElement("div");
  cp = document.createElement("strong");
  const element2 = document.createElement("span");
  element2.textContent = "选择要放进设备弹窗的功能";
  temp2.append(cp, element2);
  const element3 = document.createElement("button");
  element3.type = "button";
  element3.setAttribute("aria-label", "关闭关联功能选择");
  element3.textContent = "×";
  temp.append(temp2, element3);
  const temp3 = document.createElement("label");
  temp3.className = "popup-related-entity-dialog-search";
  mn = document.createElement("input");
  mn.type = "search";
  mn.placeholder = "搜索功能名称或实体 ID";
  mn.autocomplete = "off";
  temp3.append(mn);
  Wo = document.createElement("div");
  Wo.className = "popup-related-entity-list";
  const temp4 = document.createElement("div");
  temp4.className = "popup-related-entity-dialog-footer";
  const element4 = document.createElement("button");
  element4.type = "button";
  element4.textContent = "完成";
  temp4.append(element4);
  value.append(temp, temp3, Wo, temp4);
  Ze.append(value);
  document.body.append(Ze);
  Di.addEventListener("click", () => {
    if (!Ze.open) {
      mn.value = "";
      lp();
      Ze.showModal();
      window.requestAnimationFrame(() =>
      mn.focus({
        preventScroll: true
      })
      );
    }
  });
  mn.addEventListener("input", lp);
  element3.addEventListener("click", () => Ze.close());
  element4.addEventListener("click", () => Ze.close());
  Ze.addEventListener("click", (event2) => {
    if (event2.target === Ze) {
      Ze.close();
    }
  });
  Wo.addEventListener("click", (event2) => {
    const ancestorEl = event2.target.closest("[data-related-entity-id]");
    const temp5 = componentId;
    if (!ancestorEl || !temp5 || ancestorEl.disabled) {
      return;
    }
    const text = String(ancestorEl.dataset.relatedEntityId || "");
    const temp6 = O();
    const temp7 = Fr();
    const temp8 = Dr();
    if (!relatedPopupContext(temp6, temp7, temp8)) {
      return;
    }
    const temp9 = selectedRelatedEntityIds(temp6);
    const allowed = new Set(
      temp9 === null ?
      legacyRelatedEntityIds(temp6, temp7, temp8) :
      temp9
    );
    const temp10 = relatedPopupContext(temp6, temp7, temp8);
    const temp11 = relatedPopupSelectionLimit(temp10);
    if (allowed.has(text)) {
      allowed.delete(text);
    } else if (!temp11 || allowed.size < temp11) {
      allowed.add(text);
    } else {
      return;
    }
    L((arg) => {
      const component = findComponent(arg, temp5)?.component;
      if (component) {
        component.properties = {
          ...(component.properties || {}),
          relatedEntities: manualRelatedEntityConfig([...allowed])
        };
      }
    });
  });
  return Vo;
}
function aE(value, arg2) {
  const temp = iE();
  const temp2 = Fr();
  const temp3 = Dr();
  const temp4 = relatedPopupContext(value, temp2, temp3);
  if (!temp4 || !arg2) {
    temp.hidden = true;
    if (Ze?.open) {
      Ze.close();
    }
    return;
  }
  if (temp.previousElementSibling !== arg2) {
    arg2.insertAdjacentElement("afterend", temp);
  }
  temp.hidden = false;
  const temp5 = selectedRelatedEntityIds(value);
  const flag = temp5 === null;
  const allowed = new Set(
    flag ? legacyRelatedEntityIds(value, temp2, temp3) : temp5
  );
  const temp6 = relatedPopupSelectionLimit(temp4);
  const flag2 = temp6 > 0 && allowed.size >= temp6;
  const temp7 = relatedPopupCandidates(value, temp2, temp3);
  const allowed2 = new Set(temp7.map((arg) => arg.entityId));
  for (const name of allowed) {
    if (!allowed2.has(name)) {
      temp7.push({
        entityId: name,
        domain: String(name).split(".", 1)[0],
        name: name,
        status: "missing"
      });
    }
  }
  rp.textContent = temp4.deviceLabel + "弹窗功能";
  zc.textContent = flag ?
  "自动适配" :
  "已选 " + allowed.size + (temp6 ? " / " + temp6 : "") + " 项";
  zc.classList.toggle("is-automatic", flag);
  sp.textContent = flag ?
  "当前沿用原来的自动适配，点击可改为手动选择。" :
  "只显示已勾选的关联功能" + (
  temp6 ? "，最多 " + temp6 + " 项" : "") +
  "。";
  cp.textContent =
  temp4.deviceLabel +
  "弹窗功能 · " + (
  flag ?
  "自动适配" :
  "已选 " + allowed.size + (temp6 ? " / " + temp6 : "") + " 项");
  const mapped = temp7.map((metadata) => {
    const temp8 = allowed.has(metadata.entityId);
    const temp9 = relatedEntityIsAvailable(metadata);
    const temp10 = document.createElement("button");
    temp10.type = "button";
    const flag3 = flag2 && !temp8;
    temp10.className =
    "popup-related-entity-option" + (
    temp8 ? " selected" : "") + (
    temp9 ? "" : " unavailable") + (
    flag3 ? " limit-reached" : "");
    temp10.dataset.relatedEntityId = metadata.entityId;
    temp10.setAttribute("aria-pressed", String(temp8));
    temp10.disabled = !temp9 && !temp8 || flag3;
    const temp11 = document.createElement("i");
    temp11.setAttribute("aria-hidden", "true");
    const temp12 = document.createElement("span");
    const element = document.createElement("strong");
    const temp13 = relatedEntityLabel(temp4, metadata);
    element.textContent = Ot(metadata, temp13);
    const element2 = document.createElement("small");
    const list = [
    RELATED_ENTITY_DOMAIN_LABELS[
    String(metadata.domain || metadata.entityId || "").split(".", 1)[0]] ||
    "实体",
    metadata.entityId];

    if (temp9) {
      if (flag3) {
        list.push("最多选择 " + temp6 + " 项");
      } else if (relatedEntityNeedsConfirmation(metadata)) {
        list.push("点击时需确认");
      }
    } else {
      list.push("暂时不可用");
    }
    element2.textContent = list.join(" · ");
    temp10.dataset.relatedEntitySearch = (
    element.textContent +
    " " + (
    metadata.name || "") +
    " " + (
    metadata.originalName || "") +
    " " +
    element2.textContent).
    toLocaleLowerCase("zh-CN");
    Gn(temp10, element);
    temp12.append(element, element2);
    temp10.append(temp11, temp12);
    return temp10;
  });
  if (mapped.length) {
    const element = document.createElement("div");
    element.className =
    "popup-related-entity-empty popup-related-entity-filter-empty";
    element.textContent = "没有匹配的关联功能。";
    element.hidden = true;
    mapped.push(element);
  } else {
    const element = document.createElement("div");
    element.className = "popup-related-entity-empty";
    element.textContent = "这个 HA 设备暂时没有可选择的关联实体。";
    mapped.push(element);
  }
  Wo.replaceChildren(...mapped);
  lp();
}
function yt(value = "image") {
  const temp = Un(value);
  if (temp.menu.hidden) {
    return;
  }
  const rect = temp.button.getBoundingClientRect();
  const temp2 = 5;
  const temp3 = 8;
  const minValue = Math.min(rect.width, window.innerWidth - temp3 * 2);
  const number = window.innerHeight - rect.bottom - temp2 - temp3;
  const number2 = rect.top - temp2 - temp3;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(430, flag ? number : number2));
  const left = rect.left;
  temp.menu.style.left =
  clampNumber(
    left,
    temp3,
    Math.max(temp3, window.innerWidth - minValue - temp3)
  ) + "px";
  temp.menu.style.width = minValue + "px";
  temp.menu.style.maxHeight = count + "px";
  temp.options.style.maxHeight = Math.max(90, count - 58) + "px";
  temp.menu.style.top = flag ?
  rect.bottom + temp2 + "px" :
  Math.max(temp3, rect.top - count - temp2) + "px";
}
function dp() {
  yt("image");
}
function up(value) {
  if (value?.url) {
    return String(value.url);
  }
  const text = String(value?.assetId || "");
  if (text.startsWith("user:")) {
    const temp3 = text.slice(5);
    if (/^[0-9a-f]{32}$/.test(temp3)) {
      return "/api/v1/assets/user/" + temp3;
    } else {
      return "";
    }
  }
  const temp = String(value?.relativePath || text).replace(/^builtin:/, "");
  const temp2 = (
  temp.startsWith("v1/2D/") || temp.startsWith("v1/3D/") ?
  temp.replace(/^v1\//, "v1/户型图示例/") :
  temp).

  split("/").
  filter(Boolean).
  map((arg) => encodeURIComponent(arg)).
  join("/");
  if (!temp2) {
    return "";
  }
  const text2 = String(value?.version || "");
  return (
    "/assets/builtin/" +
    temp2 + (
    text2 ? "?v=" + encodeURIComponent(text2) : ""));

}
function pp(value) {
  const url = value?.effectVariant?.url;
  if (
  typeof url == "string" &&
  url.startsWith("/api/v1/assets/effect-variant?"))
  {
    return url;
  } else {
    return up(value);
  }
}
const {
  createIconPickerClearOption: rE,
  createIconPickerOption: B0,
  createEditorPickerCurrentIcon: sE,
  createEditorEntityPickerOption: _n,
  editorPickerClearOption: $I,
  editorPickerClearAction: zr,
  editorPickerEntityAction: FI,
  createEditorPickerCurrentEntity: mp,
  createEditorPickerCurrentAsset: cE
} = createEditorPickerElements({
  entityKindLabel: Hn,
  entityPickerPrimaryName: Ot,
  entityPickerText: ct,
  enableEntityTextHoverScroll: Gn,
  assetDisplayName: z0,
  assetPreviewUrl: pp,
  bindEditorIconNameTooltip: oE,
  mdiIconUrl: Fi
});
const i3dEditorPickers = createInteraction3dEditorPickers({
  openPicker: (opts) => qi(opts),
  fetchIcons: (query, limit, offset) =>
  J(
    "/icons?query=" +
    encodeURIComponent(query) +
    "&limit=" +
    limit +
    "&offset=" +
    offset
  ),
  getEntities: () => le,
  ensureEntities: () => Tu ? Promise.resolve() : Po || jc(),
  entityPickerText: ct,
  elements: {
    createEditorPickerCurrentIcon: sE,
    createIconPickerOption: B0,
    createEditorPickerCurrentEntity: mp,
    createEditorEntityPickerOption: _n,
    editorPickerClearAction: zr
  }
});
const { editorEntityMatches: $0, editorPickerComponentTypeLabel: lE } =
createEditorPickerQueries({
  entityPickerConfig: Un,
  pickerEntitiesForComponentType: qn,
  entityPickerText: ct,
  entityDomain: fe
});
const F0 = createEditorAssetMatcher({
  getImageSource: () => Vt,
  getImageFolder: () => ln,
  getIbeSource: () => Wt,
  getIbeFolder: () => dn,
  getUserAssets: () => ht,
  getBuiltinAssets: () => $n
});
const dE = createEditorAssetToolbar({
  documentObject: document,
  getSource: (getSource) => getSource === "image" ? Vt : Wt,
  setSource: (setSource, setSource2) => {
    if (setSource === "image") {
      Vt = setSource2;
    } else {
      Wt = setSource2;
    }
  },
  getFolder: (getFolder) => getFolder === "image" ? ln : dn,
  setFolder: (setFolder, setFolder2) => {
    if (setFolder === "image") {
      ln = setFolder2;
    } else {
      dn = setFolder2;
    }
  },
  getAssets: (getAssets) => getAssets === "user" ? ht : $n,
  getUploadInput: (getUploadInput) => getUploadInput === "image" ? sa : xa,
  canDeleteFolder: (canDeleteFolder, canDeleteFolder2) =>
  fp(canDeleteFolder, canDeleteFolder2),
  onDeleteFolder: (onDeleteFolder, onDeleteFolder2) =>
  eC(onDeleteFolder, onDeleteFolder2)
});
function Vc(value, arg2) {
  return (
    value?.assetId === arg2 || (value?.legacyAssetIds || []).includes(arg2));

}
function D0() {
  return [...$n, ...ht];
}
function Ut(value) {
  return D0().find((arg) => Vc(arg, value));
}
function z0(value) {
  return String(
    value?.name || value?.relativePath || value?.assetId || ""
  ).replace(/\.(?:png|jpe?g|webp|gif|svg)$/i, "");
}
function uE(value) {
  return ht.filter(
    (arg) => arg.folder === value && arg.source === "studio3d-export"
  );
}
function fp(value, arg2) {
  if (value !== "user" || !arg2) {
    return false;
  }
  const filtered = ht.filter((arg) => arg.folder === arg2);
  return (
    filtered.length > 0 &&
    filtered.every((arg) => arg.source === "studio3d-export"));

}
function Ro(value) {
  const flag = value === "image";
  const chosen = flag ? Vt : Wt;
  const chosen2 = flag ? Re : He;
  const chosen3 = flag ? po : ho;
  const chosen4 = flag ? b1 : B1;
  const chosen5 = flag ?
  "[data-image-asset-source]" :
  "[data-ibe-asset-source]";
  for (const element of chosen2.querySelectorAll(chosen5)) {
    element.classList.toggle(
      "active",
      element.dataset[flag ? "imageAssetSource" : "ibeAssetSource"] ===
      chosen
    );
  }
  const temp = Vn.get(chosen3);
  if (temp) {
    const chosen6 = chosen === "user" ? ht : $n;
    temp.wrapper.hidden = !chosen6.some((arg) => arg.folder);
    if (temp.wrapper.hidden) {
      Ht(temp);
    }
  }
  chosen4.hidden = chosen !== "user";
}
function Yn(value) {
  const flag = value === "image";
  const chosen = flag ? Vt : Wt;
  const element = flag ? po : ho;
  const chosen2 = chosen === "user" ? ht : $n;
  const idSet = [
  ...new Set(chosen2.map((arg) => arg.folder).filter(Boolean))].
  sort((arg, arg2) => arg.localeCompare(arg2, "zh-CN"));
  const chosen3 = flag ? ln : dn;
  const chosen4 = idSet.includes(chosen3) ? chosen3 : idSet[0] || "";
  if (flag) {
    ln = chosen4;
  } else {
    dn = chosen4;
  }
  element.replaceChildren(
    ...idSet.map(
      (arg) => new Option(arg === "." ? "根目录" : arg, arg)
    )
  );
  element.value = chosen4;
  oe(element);
  Ro(value);
}
function gp(value) {
  if (Number(value?.width) > 0 && Number(value?.height) > 0) {
    return Promise.resolve({
      width: Number(value.width),
      height: Number(value.height)
    });
  } else {
    return new Promise((arg, arg2) => {
      const temp = new Image();
      temp.decoding = "async";
      temp.addEventListener(
        "load",
        () => {
          value.width = temp.naturalWidth;
          value.height = temp.naturalHeight;
          arg({
            width: value.width,
            height: value.height
          });
        },
        {
          once: true
        }
      );
      temp.addEventListener(
        "error",
        () => arg2(new Error("无法读取图片尺寸：" + (value?.name || ""))),
        {
          once: true
        }
      );
      temp.src = up(value);
    });
  }
}
function V0(component, assetId, value) {
  const callback = (arg, fallback) => {
    const numeric = Number(arg?.width || value.width);
    const numeric2 = Number(arg?.height || value.height);
    const clamped = clampNumber(Number(fallback || 1), 0.01, 5);
    const number = Number(arg?.x || 0) + numeric / 2;
    const number2 = Number(arg?.y || 0) + numeric2 / 2;
    return {
      position: {
        ...(arg || {}),
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
    assetId: assetId,
    fit: "contain",
    naturalWidth: value.width,
    naturalHeight: value.height
  };
}
function pE(value, fallback = null) {
  const width = Number(value?.effectNaturalWidth || fallback?.width || 0);
  const height = Number(value?.effectNaturalHeight || fallback?.height || 0);
  if (width > 0 && height > 0) {
    return {
      width: width,
      height: height
    };
  } else {
    return null;
  }
}
function mE(value, arg2) {
  if (!value || !arg2) {
    return;
  }
  const number = value.id + ":" + arg2.assetId;
  if (!Pu.has(number)) {
    Pu.add(number);
    gp(arg2).
    then((arg) => {
      const component = findComponent(h?.document, value.id)?.component;
      if (
      !!component &&
      component.properties?.assetId === arg2.assetId && (
      component.properties?.layoutMode !== "fill" && (
      Number(component.position?.width) !== arg.width ||
      Number(component.position?.height) !== arg.height) ||
      Number(component.properties?.naturalWidth) !== arg.width ||
      Number(component.properties?.naturalHeight) !== arg.height))
      {
        L((arg3) => {
          const component2 = findComponent(arg3, value.id)?.component;
          if (
          !!component2 &&
          component2.properties?.assetId === arg2.assetId)
          {
            V0(component2, arg2.assetId, arg);
          }
        });
      }
    }).
    catch(onError).
    finally(() => Pu.delete(number));
  }
}
function Vr() {
  if (Re.hidden) {
    return;
  }
  const value = Cn.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 260 || number >= number2;
  const count = Math.max(150, Math.min(470, flag ? number : number2));
  Re.style.left =
  clampNumber(
    value.left,
    temp2,
    Math.max(temp2, window.innerWidth - value.width - temp2)
  ) + "px";
  Re.style.width = value.width + "px";
  Re.style.maxHeight = count + "px";
  zt.style.maxHeight = Math.max(80, count - 150) + "px";
  Re.style.top = flag ?
  value.bottom + temp + "px" :
  Math.max(temp2, value.top - count - temp) + "px";
}
function W0(element, element2 = Re) {
  if (Jt.hidden || !element?.isConnected) {
    return;
  }
  const value = element.getBoundingClientRect();
  const rect = element2.getBoundingClientRect();
  const rect2 = Jt.getBoundingClientRect();
  const temp = 18;
  const chosen =
  rect.left < window.innerWidth / 2 ?
  rect.right + temp :
  rect.left - rect2.width - temp;
  Jt.style.left =
  clampNumber(
    chosen,
    12,
    Math.max(12, window.innerWidth - rect2.width - 12)
  ) + "px";
  Jt.style.top =
  clampNumber(
    value.top,
    12,
    Math.max(12, window.innerHeight - rect2.height - 12)
  ) + "px";
}
function hp(value, arg2, el2 = Re) {
  if (!!value && !!arg2) {
    clearTimeout(Sc);
    Sc = window.setTimeout(() => {
      const temp = pp(value);
      if (!!temp && !el2.hidden && !!arg2.isConnected) {
        Bl.onload = () => W0(arg2, el2);
        Bl.src = temp;
        y1.textContent = value.name || value.relativePath;
        Jt.hidden = false;
        window.requestAnimationFrame(() => W0(arg2, el2));
      }
    }, 300);
  }
}
function Qe() {
  clearTimeout(Sc);
  Sc = null;
  Jt.hidden = true;
  Bl.onload = null;
}
function bp(value, arg2) {
  const element = document.createElement("button");
  element.type = "button";
  element.className =
  "inspector-asset-option" + (Vc(value, arg2) ? " selected" : "");
  element.dataset.assetId = value.assetId;
  element.title = value.name;
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(Vc(value, arg2)));
  const temp = document.createElement("img");
  temp.src = pp(value);
  temp.alt = value.name;
  temp.loading = "lazy";
  temp.addEventListener("error", () =>
  element.classList.add("image-load-error")
  );
  const element2 = document.createElement("span");
  element2.textContent = z0(value);
  element.append(temp, element2);
  if (value.source === "studio3d-export" || value.source !== "user") {
    return element;
  }
  const temp2 = document.createElement("div");
  temp2.className = "user-asset-option-wrap";
  const element3 = document.createElement("button");
  element3.type = "button";
  element3.className = "user-asset-delete";
  element3.dataset.deleteUserAsset = value.assetId;
  element3.title = "删除 " + value.name;
  element3.setAttribute("aria-label", "删除 " + value.name);
  element3.textContent = "×";
  temp2.append(element, element3);
  return temp2;
}
function Wr(value = "") {
  Qe();
  const flag = O()?.properties?.assetId || "";
  const temp = value.trim().toLocaleLowerCase("zh-CN");
  const filtered = (Vt === "user" ? ht : $n).filter((arg) => {
    const flag2 =
    !temp ||
    (arg.name + " " + arg.relativePath).
    toLocaleLowerCase("zh-CN").
    includes(temp);
    const flag3 = !!temp || arg.folder === ln;
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
    const element2 = document.createElement("div");
    element2.className = "inspector-picker-empty";
    element2.textContent = "没有匹配的图片";
    zt.replaceChildren(element, element2);
    return;
  }
  zt.replaceChildren(element, ...filtered.map((arg) => bp(arg, flag)));
}
function fE(component) {
  const value = component.properties?.assetId || "";
  const temp = Ut(value);
  Vt =
  ["user", "studio3d-export"].includes(temp?.source) ||
  ht.length && !temp ?
  "user" :
  "builtin";
  ln = temp?.folder || "" || ln;
  Yn("image");
  Ro("image");
  Cn.textContent = temp?.name || value || "不使用图片";
  Sn.value = "";
  zt.replaceChildren();
  mE(component, temp);
}
function Rr() {
  if (He.hidden) {
    return;
  }
  const value = En.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 260 || number >= number2;
  const count = Math.max(150, Math.min(470, flag ? number : number2));
  He.style.left =
  clampNumber(
    value.left,
    temp2,
    Math.max(temp2, window.innerWidth - value.width - temp2)
  ) + "px";
  He.style.width = value.width + "px";
  He.style.maxHeight = count + "px";
  en.style.maxHeight = Math.max(80, count - 150) + "px";
  He.style.top = flag ?
  value.bottom + temp + "px" :
  Math.max(temp2, value.top - count - temp) + "px";
}
function Hr(value = "") {
  Qe();
  const flag = O()?.properties?.effectAssetId || "";
  const temp = value.trim().toLocaleLowerCase("zh-CN");
  const filtered = (Wt === "user" ? ht : $n).filter(
    (arg) =>
    (!temp ||
    (arg.name + " " + arg.relativePath).
    toLocaleLowerCase("zh-CN").
    includes(temp)) && (
    !!temp || arg.folder === dn)
  );
  const element = document.createElement("button");
  element.type = "button";
  element.className = "inspector-asset-clear" + (flag ? "" : " selected");
  element.dataset.assetId = "";
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(!flag));
  element.textContent = "不使用图片";
  const mapped = filtered.map((arg) => bp(arg, flag));
  const element2 = document.createElement("div");
  element2.className = "inspector-picker-empty";
  if (!mapped.length) {
    element2.textContent = "没有匹配的图片";
  }
  en.replaceChildren(
    element,
    ...mapped,
    ...(element2.textContent ? [element2] : [])
  );
}
function gE(component) {
  const value = component.properties?.effectAssetId || "";
  const temp = Ut(value);
  Wt =
  ["user", "studio3d-export"].includes(temp?.source) ||
  ht.length && !temp ?
  "user" :
  "builtin";
  dn = temp?.folder || dn;
  Yn("ibe");
  Ro("ibe");
  En.textContent = temp?.name || value || "不使用图片";
  Ln.value = "";
  en.replaceChildren();
}
function R0(value) {
  const flag = value.closest(".inspector-form[id]")?.id || "component-action";
  const temp = String(value.dataset.actionTrigger || "action").replace(
    /[^a-zA-Z0-9_-]/g,
    "-"
  );
  const list = [
  ["[data-action-target]", "target"],
  ["[data-popup-source]", "popup-source"],
  ["[data-popup-entity-search]", "popup-entity-search"],
  ["[data-popup-entity]", "popup-entity"],
  ["[data-popup-custom]", "popup-custom"]];

  for (const [selector, temp2] of list) {
    const element = value.querySelector(selector);
    if (element && !element.id && !element.name) {
      element.id = flag + "-" + temp + "-" + temp2;
    }
  }
}
function H0() {
  for (const element of document.querySelectorAll(
    '[data-action-type="more-info"]'
  )) {
    element.textContent = "打开弹窗";
  }
  for (const value of document.querySelectorAll(
    ".component-action-control[data-action-trigger]"
  )) {
    R0(value);
    if (value.querySelector(".component-popup-config")) {
      continue;
    }
    const element = document.createElement("div");
    element.className = "component-popup-config";
    element.hidden = true;
    element.innerHTML =
    '\n      <label class="component-popup-config-row"><span>弹窗来源</span><select data-popup-source><option value="current">当前实体</option><option value="entity">其它实体</option><option value="custom">组合弹窗</option></select></label>\n      <div class="component-popup-config-row" data-popup-entity-row><span>选择实体</span><div class="component-popup-entity-picker"><button class="inspector-picker-button" type="button" data-popup-entity-button aria-haspopup="listbox" aria-expanded="false">选择实体</button><div class="inspector-picker-menu component-popup-entity-menu" data-popup-entity-menu hidden><input type="search" data-popup-entity-search placeholder="搜索实体名称或 ID" autocomplete="off"><div class="inspector-entity-options" data-popup-entity-options role="listbox"></div></div><input type="hidden" data-popup-entity></div></div>\n      <label class="component-popup-config-row" data-popup-custom-row><span>选择弹窗</span><select data-popup-custom></select></label>\n      <button class="component-popup-preview" type="button" data-popup-preview>预览弹窗</button>';
    value.append(element);
    R0(value);
    const element2 = element.querySelector("[data-popup-entity-button]");
    const element3 = element.querySelector("[data-popup-entity]");
    T0(element2, () => element3?.value || "");
  }
}
function Wc(value = null) {
  for (const temp of document.querySelectorAll("[data-popup-entity-menu]")) {
    const ancestorEl = temp.closest("[data-action-trigger]");
    if (ancestorEl !== value) {
      temp.hidden = true;
      ancestorEl?.
      querySelector("[data-popup-entity-button]")?.
      setAttribute("aria-expanded", "false");
    }
  }
}
function yp(value) {
  const el2 = value?.querySelector("[data-popup-entity]")?.value || "";
  const found = le.find((arg) => arg.entityId === el2);
  const el3 = value?.querySelector("[data-popup-entity-button]");
  if (!el3) {
    return;
  }
  const chosen = found ?
  "[" + Hn(found) + "] " + Ot(found) :
  el2 || "选择实体";
  Mr(el3, chosen, el2 || chosen);
  el3.dataset.entityId = el2;
  el3._entityCopySync?.();
}
function Rc(value, arg2 = "") {
  const el2 = value?.querySelector("[data-popup-entity-options]");
  const el3 = value?.querySelector("[data-popup-entity]")?.value || "";
  if (!el2) {
    return;
  }
  const temp = String(arg2 || "").
  trim().
  toLocaleLowerCase("zh-CN");
  const filtered = le.filter(
    (arg) =>
    !temp ||
    (ct(arg) + " " + arg.entityId).
    toLocaleLowerCase("zh-CN").
    includes(temp)
  );
  el2.replaceChildren(
    ...filtered.map((arg) => {
      const temp2 = document.createElement("button");
      temp2.type = "button";
      temp2.className =
      "inspector-entity-option" + (
      arg.entityId === el3 ? " selected" : "");
      temp2.dataset.popupActionEntityId = arg.entityId;
      temp2.setAttribute("role", "option");
      temp2.setAttribute("aria-selected", String(arg.entityId === el3));
      const temp3 = document.createElement("span");
      temp3.className = "inspector-entity-option-content";
      const element = document.createElement("span");
      element.className =
      "inspector-entity-option-line inspector-entity-name-line";
      element.textContent = "[" + Hn(arg) + "] " + Ot(arg);
      const element2 = document.createElement("span");
      element2.className = "inspector-entity-option-line inspector-entity-id";
      element2.textContent = arg.entityId;
      temp3.append(element, element2);
      Gn(temp2, element);
      temp2.append(temp3);
      return temp2;
    })
  );
  if (!filtered.length) {
    const element = document.createElement("div");
    element.className = "inspector-picker-empty";
    element.textContent = "没有匹配的实体";
    el2.append(element);
  }
}
function Hc(value) {
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
  const element2 = el2.querySelector("[data-popup-entity-options]");
  if (element2) {
    element2.style.maxHeight = Math.max(120, minValue2 - 58) + "px";
  }
  const clamped = clampNumber(rect.left, 8, window.innerWidth - minValue - 8);
  const minValue3 = Math.min(el2.scrollHeight, minValue2);
  const number = rect.bottom + 5;
  const chosen =
  number + minValue3 <= window.innerHeight - 8 ?
  number :
  Math.max(8, rect.top - minValue3 - 5);
  el2.style.left = clamped + "px";
  el2.style.top = chosen + "px";
}
function syncComponentActionControls(component, value) {
  H0();
  const flag = component.bindings?.entity?.entityId || "";
  const flag2 = component.type === "light-statistics";
  if (flag2) {
    X1.textContent = flag ?
    "切换和“当前实体”弹窗作用于绑定实体；其它实体弹窗、组合弹窗和跳转页面无需绑定动作实体。" :
    "未绑定动作实体时仍可使用其它实体弹窗、组合弹窗和跳转页面。";
    value.setAttribute("aria-disabled", "false");
  }
  const flag3 = h.document.pages || [];
  const pagePaths = new Set(flag3.map((arg) => arg.path));
  const popupIds = new Set(
    (h.document.customPopups || []).map((component2) => component2.id)
  );
  const element = value.querySelector(
    "[data-hidden-content-clickable-control]"
  );
  if (element) {
    const includesValue = [
    "title-button",
    "device-button",
    "icon-button-effect"].
    includes(component.type);
    element.hidden = !includesValue;
    for (const element2 of element.querySelectorAll(
      "[data-hidden-content-clickable]"
    )) {
      const flag4 =
      element2.dataset.hiddenContentClickable === (
      component.properties?.hiddenContentClickable === true ? "on" : "off");
      element2.classList.toggle("active", flag4);
      element2.setAttribute("aria-pressed", String(flag4));
    }
  }
  for (const temp of value.querySelectorAll("[data-action-trigger]")) {
    const actionTrigger = temp.dataset.actionTrigger;
    const temp2 = component.actions?.[actionTrigger];
    const chosen = componentActionIsSupported(component, temp2, {
      pagePaths: pagePaths,
      popupIds: popupIds
    }) ?
    temp2.type :
    "none";
    for (const element13 of temp.querySelectorAll("[data-action-type]")) {
      const flag5 = element13.dataset.actionType === chosen;
      element13.classList.toggle("active", flag5);
      element13.setAttribute("aria-pressed", String(flag5));
      element13.disabled =
      element13.dataset.actionType === "toggle" && (
      !flag || !entityIdSupportsToggle(flag)) ||
      flag2 &&
      !["none", "toggle", "more-info", "navigate"].includes(
        element13.dataset.actionType
      );
    }
    const componentActionTarget = temp.querySelector(
      ".component-action-target"
    );
    const element3 = temp.querySelector("[data-action-target]");
    const target = component.actions?.[actionTrigger]?.target;
    element3.replaceChildren(
      ...flag3.map((arg) => new Option(arg.name, arg.path))
    );
    element3.value = pagePaths.has(target) ?
    target :
    W.value || flag3[0]?.path || "";
    oe(element3);
    componentActionTarget.hidden = chosen !== "navigate";
    const componentPopupConfig = temp.querySelector(
      ".component-popup-config"
    );
    const element5 = temp.querySelector("[data-popup-source]");
    const element6 = temp.querySelector("[data-popup-entity]");
    const element7 = temp.querySelector("[data-popup-custom]");
    const element8 = temp.querySelector("[data-popup-entity-row]");
    const element9 = temp.querySelector("[data-popup-custom-row]");
    const element10 = temp.querySelector("[data-popup-preview]");
    const temp3 = actionPopupData(component.actions?.[actionTrigger]);
    element5.value = temp3.source;
    const element11 = element5.querySelector('option[value="current"]');
    if (element11) {
      element11.disabled = !flag;
    }
    element6.value = temp3.entityId || le[0]?.entityId || "";
    const flag4 = h.document.customPopups || [];
    element7.replaceChildren(
      ...flag4.map((component2) => new Option(component2.name, component2.id))
    );
    element7.value = flag4.some((component2) => component2.id === temp3.popupId) ?
    temp3.popupId :
    flag4[0]?.id || "";
    oe(element5);
    oe(element7);
    yp(temp);
    const element12 = temp.querySelector("[data-popup-entity-menu]");
    if (element12 && !element12.hidden) {
      Rc(
        temp,
        temp.querySelector("[data-popup-entity-search]")?.value || ""
      );
      window.requestAnimationFrame(() => Hc(temp));
    }
    componentPopupConfig.hidden = chosen !== "more-info";
    element8.hidden = temp3.source !== "entity";
    element9.hidden = temp3.source !== "custom";
    element10.disabled =
    temp3.source === "current" ?
    !flag :
    temp3.source === "entity" ?
    !element6.value :
    !element7.value;
  }
}
function j0(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(component, value, timeComponentDimensions);
}
function hE(component) {
  const value = component.properties || {};
  const {
    left: temp,
    top: temp2,
    scale: temp3,
    rotation: temp4
  } = inspectorComponentMetrics(component, h.document);
  Vx.value = "时间";
  Eb.value = value.label || "";
  for (const element of Lb.querySelectorAll("[data-time-hour-format]")) {
    element.classList.toggle(
      "active",
      element.dataset.timeHourFormat === (value.hour12 === true ? "12" : "24")
    );
  }
  for (const element of Ib.querySelectorAll("[data-time-seconds]")) {
    element.classList.toggle(
      "active",
      element.dataset.timeSeconds === (
      value.showSeconds === true ? "on" : "off")
    );
  }
  Tb.value = value.color || "#248eb2";
  Ab.value = roundField(clampNumber(Number(value.fontSize ?? 96), 12, 500));
  Pb.value = roundField(normalizedFontWeight(value.fontWeight));
  kb.value = roundField(
    clampNumber(Number(value.letterSpacing ?? 2.2), -20, 100)
  );
  Mb.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  Ya.value = temp;
  Xa.value = temp2;
  yo.value = temp3;
  gi.value = temp4;
  yo.disabled = false;
  gi.disabled = false;
}
function q0(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(component, value, dateComponentDimensions);
}
function bE(component) {
  const value = component.properties || {};
  const {
    left: temp,
    top: temp2,
    scale: temp3,
    rotation: temp4
  } = inspectorComponentMetrics(component, h.document);
  Wx.value = "日期";
  Ob.value = value.label || "";
  for (const element of Bb.querySelectorAll("[data-date-weekday]")) {
    element.classList.toggle(
      "active",
      element.dataset.dateWeekday === (
      value.showWeekday === false ? "off" : "on")
    );
  }
  for (const element of $b.querySelectorAll("[data-date-lunar]")) {
    element.classList.toggle(
      "active",
      element.dataset.dateLunar === (value.showLunar === true ? "on" : "off")
    );
  }
  Fb.value = value.primaryColor || "#8d9296";
  Db.value = roundField(clampNumber(Number(value.primarySize ?? 36), 12, 500));
  zb.value = roundField(normalizedFontWeight(value.primaryWeight));
  Vb.value = roundField(
    clampNumber(Number(value.primarySpacing ?? 1), -20, 100)
  );
  Wb.value = value.lunarColor || "#7f878c";
  Rb.value = roundField(clampNumber(Number(value.lunarSize ?? 24), 10, 500));
  Hb.value = roundField(normalizedFontWeight(value.lunarWeight));
  jb.value = roundField(clampNumber(Number(value.lunarSpacing ?? 1), -20, 100));
  qb.value = roundField(clampNumber(Number(value.lineGap ?? 8), 0, 200));
  Gb.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  Ja.value = temp;
  Za.value = temp2;
  vo.value = temp3;
  hi.value = temp4;
  vo.disabled = false;
  hi.disabled = false;
}
function G0(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(
    component,
    value,
    weatherComponentDimensions
  );
}
function yE(component) {
  const value = component.properties || {};
  const {
    left: temp,
    top: temp2,
    scale: temp3,
    rotation: temp4
  } = inspectorComponentMetrics(component, h.document);
  Bt(component);
  Rx.value = "天气";
  Ub.value = value.label || "";
  const list = [
  [_b, "weatherIconVisible", value.iconVisible !== false],
  [Yb, "weatherTemperatureVisible", value.temperatureVisible !== false],
  [Xb, "weatherConditionVisible", value.conditionVisible !== false],
  [Kb, "weatherHumidityVisible", value.humidityVisible !== false]];

  for (const [temp5, temp6, temp7] of list) {
    for (const element of temp5.querySelectorAll(
      "[data-" +
      temp6.replace(/[A-Z]/g, (arg) => "-" + arg.toLowerCase()) +
      "]"
    )) {
      const temp8 = element.dataset[temp6];
      element.classList.toggle("active", temp8 === (temp7 ? "on" : "off"));
      element.setAttribute(
        "aria-pressed",
        String(temp8 === (temp7 ? "on" : "off"))
      );
    }
  }
  Jb.value = roundField(clampNumber(Number(value.iconSize ?? 64), 12, 500));
  Zb.value = roundField(clampNumber(Number(value.iconGap ?? 22), 0, 300));
  Qb.value = value.temperatureColor || "#aeb3b7";
  ey.value = roundField(
    clampNumber(Number(value.temperatureSize ?? 32), 12, 500)
  );
  ty.value = roundField(normalizedFontWeight(value.temperatureWeight));
  ny.value = roundField(
    clampNumber(Number(value.temperatureSpacing ?? 1), -20, 100)
  );
  oy.value = value.secondaryColor || "#8d9296";
  iy.value = roundField(
    clampNumber(Number(value.secondarySize ?? 18), 10, 500)
  );
  ay.value = roundField(normalizedFontWeight(value.secondaryWeight));
  ry.value = roundField(
    clampNumber(Number(value.secondarySpacing ?? 1), -20, 100)
  );
  sy.value = roundField(clampNumber(Number(value.lineGap ?? 7), 0, 200));
  cy.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  er.value = temp;
  tr.value = temp2;
  wo.value = temp3;
  bi.value = temp4;
  wo.disabled = false;
  bi.disabled = false;
}
function vE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  Bt(component);
  qx.value = "折线图";
  ly.value = value.label || "";
  for (const element of dy.querySelectorAll(
    "[data-line-chart-value-visible]"
  )) {
    const flag3 =
    element.dataset.lineChartValueVisible === (
    value.valueVisible === false ? "off" : "on");
    element.classList.toggle("active", flag3);
    element.setAttribute("aria-pressed", String(flag3));
  }
  uy.value = roundField(clampNumber(Number(value.valueScale ?? 100), 10, 500));
  py.value = value.valueColor || "#dce1e5";
  my.value = ["0", "1", "2", "3", "4"].includes(String(value.statePrecision)) ?
  String(value.statePrecision) :
  "auto";
  fy.value = roundField(
    clampNumber(Number(value.valueOffsetX ?? 0), -100, 100)
  );
  gy.value = roundField(
    clampNumber(Number(value.valueOffsetY ?? 0), -100, 100)
  );
  hy.value = roundField(
    clampNumber(Number(value.updateInterval ?? 600), 30, 86400)
  );
  by.value = roundField(clampNumber(Number(value.hours ?? 24), 1, 168));
  yy.value = roundField(clampNumber(Number(value.cornerRadius ?? 10), 0, 50));
  const list = [
  {
    value: 0,
    color: "#ddffc2"
  },
  {
    value: 13,
    color: "#68cc3e"
  },
  {
    value: 27,
    color: "#ff8e52"
  },
  {
    value: 40,
    color: "#ff1a1a"
  }];

  const flag2 =
  Array.isArray(value.thresholds) &&
  value.thresholds.some((element) => Number.isFinite(Number(element?.value)));
  const chosen =
  value.thresholdMode === "auto" ||
  !flag2 && value.thresholdMode !== "manual" ?
  "auto" :
  "manual";
  tu.value = chosen;
  const chosen2 = flag2 ? value.thresholds : list;
  yi.forEach((element, arg2) => {
    element.value.value = roundField(
      Number(chosen2[arg2]?.value ?? list[arg2].value)
    );
    element.color.value = chosen2[arg2]?.color || list[arg2].color;
    element.value.disabled = chosen === "auto";
    element.color.disabled = chosen === "auto";
  });
  or.value = roundField(
    clampNumber(
      (Number(flag.x || 0) + numeric3 / 2) / numeric * 100,
      0,
      100
    )
  );
  ir.value = roundField(
    clampNumber(
      (Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100,
      0,
      100
    )
  );
  vi.value = roundField(clampNumber(numeric3 / numeric * 100, 0.1, 100));
  wi.value = roundField(clampNumber(numeric4 / numeric2 * 100, 0.1, 100));
  Co.value = roundField(
    clampNumber(Number(component.style?.scale || 1) * 100, 1, 500)
  );
  Ci.value = roundField(clampNumber(Number(flag.rotation || 0), -360, 360));
  const isMultiSelect = selectedComponentIds.size > 1;
  vi.disabled = isMultiSelect;
  wi.disabled = isMultiSelect;
  Co.disabled = false;
  Ci.disabled = false;
  const length = Rn(h.document.sharedComponents, "line-chart").length;
  const length2 = Ow(component).length;
  dc.disabled = length < 2 || !length2;
  Yx.textContent = length2 + " 项修改";
  dc.textContent = "一键应用到同类型控件";
  syncComponentActionControls(component, _x);
}
function wE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  Xx.value = "底图框";
  vy.value = value.label || "";
  setInspectorToggle(wy, value.mainTextVisible !== false);
  Cy.value = value.mainText || "";
  Sy.value = value.mainColor || "#ffffff";
  xy.value = roundField(clampNumber(Number(value.mainSize ?? 30), 8, 500));
  Ny.value = roundField(clampNumber(Number(value.mainWeight ?? 0), 0, 3));
  Ey.value = roundField(
    clampNumber(Number(value.mainOpacity ?? 0.72) * 100, 0, 100)
  );
  Ly.value = roundField(clampNumber(Number(value.mainSpacing ?? 2), -20, 100));
  const numeric5 = Number(value.textLeft ?? 5.2);
  const numeric6 = Number(value.textTop ?? 28);
  Iy.value = roundField(
    clampNumber(Number(value.mainTextLeft ?? numeric5), -100, 200)
  );
  Ty.value = roundField(
    clampNumber(
      Number(
        value.mainTextTop ??
        numeric6 - Number(value.lineGap ?? 24) / numeric4 * 100
      ),
      -100,
      200
    )
  );
  setInspectorToggle(Ay, value.secondaryTextVisible !== false);
  Py.value = value.secondaryText || "";
  ky.value = value.secondaryColor || "#ffffff";
  My.value = roundField(clampNumber(Number(value.secondarySize ?? 15), 6, 500));
  Oy.value = roundField(clampNumber(Number(value.secondaryWeight ?? 0), 0, 3));
  By.value = roundField(
    clampNumber(Number(value.secondaryOpacity ?? 0.36) * 100, 0, 100)
  );
  $y.value = roundField(
    clampNumber(Number(value.secondarySpacing ?? 2.1), -20, 100)
  );
  Fy.value = roundField(
    clampNumber(Number(value.secondaryTextLeft ?? numeric5), -100, 200)
  );
  Dy.value = roundField(
    clampNumber(Number(value.secondaryTextTop ?? numeric6), -100, 200)
  );
  setInspectorToggle(zy, value.edgeVisible !== false);
  Vy.value = value.edgeColor || "#d4d4d4";
  Wy.value = roundField(clampNumber(Number(value.edgeWidth ?? 0.9), 0, 20));
  Ry.value = roundField(
    clampNumber(Number(value.edgeOpacity ?? 1) * 100, 0, 100)
  );
  Hy.value = roundField(
    clampNumber(Number(value.radius ?? 0.195) * 100, 0, 50)
  );
  jy.value = roundField(clampNumber(Number(value.edgeAngle ?? 45), 0, 360));
  setInspectorToggle(qy, value.glowVisible !== false);
  Gy.value = value.glowColor || "#ffffff";
  Uy.value = roundField(
    clampNumber(Number(value.glowStrength ?? 0.5) * 100, 0, 500)
  );
  _y.value = roundField(
    clampNumber(Number(value.glowSize ?? 1.5) * 100, 0, 300)
  );
  Yy.value = roundField(clampNumber(Number(value.glowAngle ?? 242), 0, 360));
  rr.value = roundField(
    clampNumber(
      (Number(flag.x || 0) + numeric3 / 2) / numeric * 100,
      0,
      100
    )
  );
  sr.value = roundField(
    clampNumber(
      (Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100,
      0,
      100
    )
  );
  Si.value = roundField(clampNumber(numeric3 / numeric * 100, 0.1, 100));
  xi.value = roundField(clampNumber(numeric4 / numeric2 * 100, 0.1, 100));
  So.value = roundField(
    clampNumber(Number(component.style?.scale || 1) * 100, 1, 500)
  );
  Ni.value = roundField(clampNumber(Number(flag.rotation || 0), -360, 360));
  const isMultiSelect = selectedComponentIds.size > 1;
  Si.disabled = isMultiSelect;
  xi.disabled = isMultiSelect;
  So.disabled = false;
  Ni.disabled = false;
  const chosen =
  findComponent(h.document, component.id)?.scope === "page" ?
  st("panel-frame").length :
  Rn(h.document.sharedComponents, "panel-frame").length;
  const length = Gw(component).length;
  uc.disabled = chosen < 2 || !length;
  Kx.textContent = length + " 项修改";
  uc.textContent = "一键应用到同类型控件";
}
function CE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const flag2 = h.document.pages || [];
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  Jx.value = "导航按钮";
  pc.value = value.label || "";
  Bt(component);
  const flag3 = Pi.get(component.id) || "auto";
  for (const element of nu.querySelectorAll("[data-navigation-preview]")) {
    element.classList.toggle(
      "active",
      element.dataset.navigationPreview === flag3
    );
  }
  au.value = value.mainText || "页面导航";
  ru.value = value.secondaryText || "NAVIGATION";
  setInspectorToggle(Xy, value.mainTextVisible !== false);
  setInspectorToggle(Ky, value.secondaryTextVisible !== false);
  setInspectorToggle(Jy, value.iconVisible !== false);
  setInspectorToggle(Zy, value.frameVisible !== false);
  setInspectorToggle(Qy, value.glowVisible !== false);
  XN(value.icon || "");
  ev.value = value.mainColor || "#e9edf0";
  tv.value = value.secondaryColor || "#e9edf0";
  nv.value = roundField(Number(value.mainSize ?? 30));
  ov.value = roundField(Number(value.secondarySize ?? 11));
  iv.value = roundField(Number(value.mainWeight ?? 0));
  av.value = roundField(Number(value.secondaryWeight ?? 0));
  rv.value = roundField(Number(value.mainSpacing ?? 8));
  sv.value = roundField(Number(value.secondarySpacing ?? 3));
  const numeric5 = Number(value.textLeft ?? 27.5);
  const numeric6 = Number(value.textTop ?? 81.5);
  cv.value = roundField(Number(value.mainTextLeft ?? numeric5));
  lv.value = roundField(Number(value.mainTextTop ?? numeric6 - 1800 / 64.36));
  dv.value = roundField(Number(value.secondaryTextLeft ?? numeric5));
  uv.value = roundField(Number(value.secondaryTextTop ?? numeric6));
  su.value = roundField(
    clampNumber(
      Number(value.textIdleOpacity ?? value.idleOpacity ?? 0.3) * 100,
      0,
      100
    )
  );
  cu.value = roundField(
    clampNumber(
      Number(value.textActiveOpacity ?? value.activeOpacity ?? 0.96) * 100,
      0,
      100
    )
  );
  pv.value = value.iconColor || "#e9edf0";
  mv.value = roundField(Number(value.iconSize ?? 50));
  fv.value = roundField(Number(value.iconLeft ?? 14));
  gv.value = roundField(Number(value.iconTop ?? 50));
  lu.value = roundField(
    clampNumber(
      Number(value.iconIdleOpacity ?? value.idleOpacity ?? 0.3) * 100,
      0,
      100
    )
  );
  du.value = roundField(
    clampNumber(
      Number(value.iconActiveOpacity ?? value.activeOpacity ?? 0.96) * 100,
      0,
      100
    )
  );
  hv.value = value.frameColor || "#d9e0e6";
  bv.value = roundField(Number(value.frameWidth ?? 2));
  uu.value = roundField(
    clampNumber(Number(value.frameIdleOpacity ?? 0.48) * 100, 0, 100)
  );
  pu.value = roundField(
    clampNumber(Number(value.frameActiveOpacity ?? 0.98) * 100, 0, 100)
  );
  yv.value = roundField(clampNumber(Number(value.frameAngle ?? 45), 0, 360));
  vv.value = value.glowColor || "#f2f6fa";
  wv.value = roundField(clampNumber(Number(value.glowAngle ?? 45), 0, 360));
  mu.value = roundField(
    clampNumber(Number(value.glowIdleStrength ?? 0.5) * 100, 0, 500)
  );
  fu.value = roundField(
    clampNumber(Number(value.glowIdleSize ?? 1.5) * 100, 0, 300)
  );
  gu.value = roundField(
    clampNumber(Number(value.glowActiveStrength ?? 2.2) * 100, 0, 500)
  );
  hu.value = roundField(
    clampNumber(Number(value.glowActiveSize ?? 3) * 100, 0, 300)
  );
  Cv.value = roundField(clampNumber(Number(value.radius ?? 0.5) * 100, 0, 50));
  ur.value = roundField(
    clampNumber(
      (Number(flag.x || 0) + numeric3 / 2) / numeric * 100,
      0,
      100
    )
  );
  pr.value = roundField(
    clampNumber(
      (Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100,
      0,
      100
    )
  );
  xo.value = roundField(clampNumber(numeric3 / numeric * 100, 0.1, 100));
  No.value = roundField(clampNumber(numeric4 / numeric2 * 100, 0.1, 100));
  An.value = roundField(
    clampNumber(Number(component.style?.scale || 1) * 100, 1, 500)
  );
  Eo.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  xo.disabled = isMultiSelect;
  No.disabled = isMultiSelect;
  An.disabled = false;
  Eo.disabled = false;
  const length = Rn(h.document.sharedComponents, "navigation-button").length;
  const length2 = _w(component).length;
  mc.disabled = length < 2 || !length2;
  tN.textContent = length2 + " 项修改";
  mc.textContent = "一键应用到同类型控件";
  syncComponentActionControls(component, eN);
}
function SE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  Sf.value = value.label || "";
  Bt(component);
  setInspectorToggle(xf, value.mainTextVisible !== false);
  setInspectorToggle(Nf, value.secondaryTextVisible !== false);
  setInspectorToggle(Gf, value.frameVisible !== false);
  setInspectorToggle(Vf, value.iconVisible !== false);
  Ef.value = value.mainText || "";
  const temp = String(value.secondaryText || "").
  split(/\r?\n/).
  slice(0, 2);
  Os.value = temp[0] || "";
  Bs.value = temp[1] || "";
  Lf.value = value.mainColor || "#b9bbc0";
  If.value = value.secondaryColor || "#70737b";
  Tf.value = roundField(Number(value.mainSize ?? 34));
  Af.value = roundField(Number(value.secondarySize ?? 12));
  Pf.value = roundField(normalizedFontWeight(value.mainWeight, 0.3));
  kf.value = roundField(normalizedFontWeight(value.secondaryWeight, 0.2));
  Mf.value = roundField(Number(value.mainSpacing ?? 1));
  Of.value = roundField(Number(value.secondarySpacing ?? 2));
  Bf.value = roundField(Number(value.secondaryLineGap ?? 2));
  $f.value = roundField(Number(value.mainTextLeft ?? 5.5));
  Ff.value = roundField(Number(value.mainTextTop ?? 45));
  Df.value = roundField(Number(value.secondaryTextLeft ?? 54));
  zf.value = roundField(Number(value.secondaryTextTop ?? 43));
  ZN(value.icon || "");
  Wf.value = value.iconColor || "#b9bbc0";
  Rf.value = roundField(Number(value.iconSize ?? 30));
  Hf.value = roundField(Number(value.iconLeft ?? 50));
  jf.value = roundField(Number(value.iconTop ?? 45));
  qf.value = value.frameColor || "#60636a";
  Uf.value = roundField(Number(value.frameWidth ?? 1.5));
  _f.value = roundField(Number(value.frameSize ?? 100));
  Yf.value = roundField(Number(value.frameSpacing ?? 100));
  Xf.value = roundField(Number(value.frameOffsetX ?? 0));
  Kf.value = roundField(Number(value.frameOffsetY ?? 0));
  Zf.value = value.markerColor || "#f2a20d";
  Qf.value = roundField(Number(value.markerSize ?? 10));
  eg.value = roundField(Number(value.markerLeft ?? 1.8));
  tg.value = roundField(Number(value.markerTop ?? 84));
  const flag2 = value.markerVisible !== false;
  setInspectorToggle(Jf, flag2);
  rd.value = roundField(
    clampNumber(
      (Number(flag.x || 0) + numeric3 / 2) / numeric * 100,
      0,
      100
    )
  );
  sd.value = roundField(
    clampNumber(
      (Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100,
      0,
      100
    )
  );
  $s.value = roundField(numeric3 / numeric * 100);
  Fs.value = roundField(numeric4 / numeric2 * 100);
  Aa.value = roundField(Number(component.style?.scale || 1) * 100);
  Ds.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  for (const temp2 of [$s, Fs]) {
    temp2.disabled = isMultiSelect;
  }
  Ds.disabled = false;
  Aa.disabled = false;
  const length = st("title-button").length;
  const length2 = $w(component).length;
  zs.disabled = length < 2 || !length2;
  q1.textContent = length2 + " 项修改";
  zs.textContent = "一键应用到同类型控件";
  syncComponentActionControls(component, j1);
}
function xE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  if (Sr && Sr !== component.id) {
    Pr();
  }
  ng.value = value.label || "";
  og.value = value.title || "数量";
  Bt(component);
  setInspectorToggle(rg, value.iconVisible !== false);
  setInspectorToggle(dg, value.titleVisible !== false);
  setInspectorToggle(gg, value.countVisible !== false);
  QN(value.icon ?? "mdi:lightbulb-group-outline");
  sg.value = value.iconColor || "#8b9298";
  cg.value = value.iconActiveColor || "#f2a20d";
  lg.value = roundField(Number(value.iconSize ?? 42));
  ug.value = value.titleColor || "#b9bbc0";
  pg.value = roundField(Number(value.titleSize ?? 32));
  mg.value = roundField(normalizedFontWeight(value.titleWeight, 0.3));
  fg.value = roundField(Number(value.titleSpacing ?? 1.2));
  hg.value = value.countColor || "#b9bbc0";
  bg.value = value.countActiveColor || "#f2a20d";
  yg.value = roundField(Number(value.countSize ?? 34));
  vg.value = roundField(normalizedFontWeight(value.countWeight, 0.35));
  wg.value = roundField(Number(value.countSpacing ?? 0));
  Cg.value = roundField(Number(value.iconGap ?? 4.5));
  Sg.value = roundField(Number(value.countGap ?? 4.5));
  ud.value = roundField(
    clampNumber(
      (Number(flag.x || 0) + numeric3 / 2) / numeric * 100,
      0,
      100
    )
  );
  pd.value = roundField(
    clampNumber(
      (Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100,
      0,
      100
    )
  );
  Ws.value = roundField(numeric3 / numeric * 100);
  Rs.value = roundField(numeric4 / numeric2 * 100);
  $a.value = roundField(Number(component.style?.scale || 1) * 100);
  Hs.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  Ws.disabled = isMultiSelect;
  Rs.disabled = isMultiSelect;
  $a.disabled = false;
  Hs.disabled = false;
  Mr(rt, ko >= 0 ? "选择替换实体" : "选择一个实体");
  C0(component);
  if (!Ie.hidden) {
    Xu(Pa.value);
  }
  syncComponentActionControls(component, K1);
}
function NE(component) {
  const value = component.properties || {};
  const flag = component.type === "presence-sensor";
  const chosen = [
  "presence",
  "door-window",
  "water-leak",
  "smoke",
  "natural-gas"].
  includes(value.sensorKind) ?
  value.sensorKind :
  "presence";
  const temp = {
    presence: "人体/人在传感器",
    "door-window": "门窗传感器",
    "water-leak": "水浸传感器",
    smoke: "烟雾传感器",
    "natural-gas": "天然气传感器"
  }[chosen];
  const flag2 = component.type === "device-button" || flag;
  const flag3 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag3.width || 100);
  const numeric4 = Number(flag3.height || 100);
  Z1.value = flag ? temp : flag2 ? "设备按钮" : "图标按钮";
  J1.classList.remove("inspector-full-row");
  Ng.hidden = !flag;
  Ng.classList.toggle("inspector-full-row", flag);
  Fa.value = chosen;
  oe(Fa);
  $g.textContent = flag2 ? "标题" : "中文标题";
  cx.textContent = flag2 ? "状态" : "英文标题";
  lx.textContent = flag2 ? "自定义标题" : "内容";
  dx.textContent = flag2 ? "自定义状态" : "内容";
  Sd.placeholder = flag2 ? "留空跟随实体名称" : "";
  xd.placeholder = flag2 ? "留空跟随实体状态" : "";
  Q1.hidden = flag2;
  wx.hidden = flag;
  lh.hidden = true;
  Sx.hidden = !flag || chosen !== "presence";
  xx.hidden = !flag || chosen !== "door-window";
  const temp2 = Ec.has(component.id);
  Tn.classList.toggle("active", temp2);
  Tn.setAttribute("aria-pressed", String(temp2));
  Tn.textContent = "编辑透视";
  Xs.disabled = !temp2;
  $g.closest(".inspector-section").hidden = flag;
  const ancestorEl = Lt.closest(".inspector-section");
  ancestorEl.querySelector("h3").textContent = flag ? "显示颜色" : "图标";
  const ancestorEl2 = Lt.closest(".inspector-picker");
  ancestorEl2.hidden = flag;
  ancestorEl2.style.display = flag ? "none" : "";
  gx.hidden = flag2;
  hx.hidden = flag2;
  bx.hidden = flag2;
  yx.hidden = flag2;
  Tg.hidden = flag;
  Tg.firstChild.textContent = flag2 ? "关闭颜色" : "颜色";
  hd.hidden = !flag2 || flag;
  Nd.hidden = !flag2;
  Ed.hidden = !flag2;
  Ag.hidden = !flag2;
  Ag.firstChild.textContent = flag ?
  {
    presence: "有人颜色",
    "door-window": "打开颜色",
    "water-leak": "水浸颜色",
    smoke: "烟雾颜色",
    "natural-gas": "天然气颜色"
  }[chosen] :
  "开启颜色";
  ex.hidden = !flag2 || flag;
  tx.hidden = !flag2 || flag;
  nx.hidden = flag2;
  ox.hidden = !flag2 || flag;
  ix.hidden = !flag2 || flag;
  ax.hidden = !flag2 || flag;
  wd.closest("label").hidden = flag;
  Cd.closest("label").hidden = flag;
  rx.hidden = flag2;
  sx.hidden = flag2;
  ux.hidden = flag2;
  px.hidden = flag2;
  mx.hidden = flag2;
  fx.hidden = flag2;
  xg.value = value.label || "";
  Bt(component);
  JN(value.icon || "");
  fi.value =
  value.iconColor || (
  flag ? value.clearColor : "") ||
  value.iconOffColor ||
  value.iconOnColor ||
  "#d7d8da";
  setInspectorToggle(hd, value.iconVisible !== false);
  bd.value =
  chosen === "water-leak" ?
  value.waterLeakColor || "#42c8ff" :
  chosen === "smoke" ?
  value.smokeColor || "#ffffff" :
  chosen === "natural-gas" ?
  value.naturalGasColor || "#ffb347" :
  value.iconOnColor || (
  flag ? value.occupiedColor : "") ||
  "#379bff";
  Pg.value = value.badgeColor || "#5b5e66";
  kg.value = roundField(Number(value.badgeOpacity ?? 0.58) * 100);
  Bg.value = roundField(Number(value.badgeSize ?? value.iconSize ?? 28));
  Og.value = roundField(
    Number(value.symbolSize ?? Number(value.iconSize ?? 28) * 0.5)
  );
  qs.value = ["0", "1", "2", "3", "4"].includes(String(value.statePrecision)) ?
  String(value.statePrecision) :
  "auto";
  uh.value = roundField(Number(value.haloScaleX ?? value.haloScale ?? 1) * 100);
  ph.value = roundField(Number(value.haloScaleY ?? value.haloScale ?? 1) * 100);
  mh.value = roundField(Number(value.haloRotation ?? 0));
  fh.value = roundField(Number(value.haloOpacity ?? 1) * 100);
  hh.value = roundField(Number(value.personScale ?? 1) * 100);
  bh.value = roundField(Number(value.personRotation ?? 0));
  yh.value = roundField(Number(value.personOpacity ?? 1) * 100);
  vh.value = roundField(Number(value.orbitDuration ?? 8));
  setInspectorToggle(dh, value.haloVisible !== false);
  setInspectorToggle(gh, value.personVisible !== false);
  Mg.value = roundField(Number(value.iconSize ?? 42));
  yd.value = roundField(Number(value.iconOffOpacity ?? 1) * 100);
  vd.value = roundField(Number(value.iconOnOpacity ?? 1) * 100);
  wd.value = roundField(Number(value.iconLeft ?? 50));
  Cd.value = roundField(Number(value.iconTop ?? 34));
  Sd.value = value.mainText || "";
  setInspectorToggle(Nd, value.mainTextVisible !== false);
  xd.value = value.secondaryText || "";
  setInspectorToggle(Ed, value.secondaryTextVisible !== false);
  Fg.value =
  value.mainColor || value.mainOffColor || value.mainOnColor || "#c7c8cb";
  Dg.value =
  value.secondaryColor ||
  value.secondaryOffColor ||
  value.secondaryOnColor ||
  "#75777d";
  Ld.value = roundField(Number(value.mainOffOpacity ?? 1) * 100);
  Id.value = roundField(Number(value.mainOnOpacity ?? 1) * 100);
  Td.value = roundField(Number(value.secondaryOffOpacity ?? 1) * 100);
  Ad.value = roundField(Number(value.secondaryOnOpacity ?? 1) * 100);
  zg.value = roundField(Number(value.mainSize ?? 25));
  Vg.value = roundField(Number(value.secondarySize ?? 10));
  Wg.value = roundField(normalizedFontWeight(value.mainWeight, 0.25));
  Rg.value = roundField(normalizedFontWeight(value.secondaryWeight, 0.18));
  Hg.value = roundField(Number(value.mainSpacing ?? 1));
  jg.value = roundField(Number(value.secondarySpacing ?? 0.7));
  qg.value = roundField(Number(value.mainTextLeft ?? 9));
  Gg.value = roundField(Number(value.mainTextTop ?? 78));
  Ug.value = roundField(Number(value.secondaryTextLeft ?? 9));
  _g.value = roundField(Number(value.secondaryTextTop ?? 91));
  setInspectorToggle(Pd, value.onFillVisible !== false);
  kd.value = value.onFillColor || "#dfb64f";
  Md.value = roundField(Number(value.onFillStrength ?? 1) * 100);
  Yg.value = roundField(Number(value.onFillFadeDuration ?? 0.3));
  setInspectorToggle(Xg, value.frameVisible !== false);
  Kg.value = roundField(Number(value.frameWidth ?? 1));
  Jg.value = roundField(Number(value.frameAngle ?? 45));
  Od.value = roundField(Number(value.frameOffOpacity ?? 0.8) * 100);
  Bd.value = roundField(Number(value.frameOnOpacity ?? 1) * 100);
  Zg.value = roundField(Number(value.cutCorner ?? 20));
  setInspectorToggle(Qg, value.softLightVisible !== false);
  eh.value = value.softLightColor || "#ffffff";
  th.value = roundField(Number(value.softLightStrength ?? 1) * 100);
  nh.value = roundField(Number(value.softLightSize ?? 1) * 100);
  oh.value = roundField(Number(value.softLightAngle ?? 45));
  setInspectorToggle(ih, value.glowVisible !== false);
  ah.value = value.glowColor || "#ffffff";
  rh.value = roundField(Number(value.glowStrength ?? 1) * 100);
  sh.value = roundField(Number(value.glowSize ?? 1) * 100);
  ch.value = roundField(Number(value.glowAngle ?? 220));
  $d.value = roundField(
    clampNumber(
      (Number(flag3.x || 0) + numeric3 / 2) / numeric * 100,
      0,
      100
    )
  );
  Fd.value = roundField(
    clampNumber(
      (Number(flag3.y || 0) + numeric4 / 2) / numeric2 * 100,
      0,
      100
    )
  );
  Gs.value = roundField(numeric3 / numeric * 100);
  Us.value = roundField(numeric4 / numeric2 * 100);
  Wa.value = roundField(Number(component.style?.scale || 1) * 100);
  _s.value = roundField(Number(flag3.rotation || 0));
  if (flag && !zn.has(component.id)) {
    zn.set(component.id, "on");
    x?.setComponentPreviewState(component.id, "on");
  }
  const flag4 = zn.get(component.id) || "auto";
  for (const element of js.querySelectorAll("[data-icon-button-preview]")) {
    const flag5 = element.dataset.iconButtonPreview === flag4;
    element.classList.toggle("active", flag5);
    element.setAttribute("aria-pressed", String(flag5));
  }
  const isMultiSelect = selectedComponentIds.size > 1;
  for (const temp3 of [Gs, Us]) {
    temp3.disabled = isMultiSelect;
  }
  _s.disabled = false;
  Wa.disabled = false;
  const chosen2 =
  component.type === "presence-sensor" ?
  st(component.type).filter(
    ({ component: arg }) => Ho(arg) === chosen
  ).length :
  st(component.type).length;
  const length = Ww(component).length;
  Ys.disabled = chosen2 < 2 || !length;
  Cx.textContent = length + " 项修改";
  Ys.textContent = "一键应用到同类型控件";
  syncComponentActionControls(component, vx);
}
function EE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  gb.value = value.label || "";
  Bt(component);
  setInspectorToggle(yb, value.mediaVisible !== false);
  const chosen = value.displayMode === "snapshot" ? "snapshot" : "live";
  for (const element of bb.querySelectorAll("[data-camera-display-mode]")) {
    const flag2 = element.dataset.cameraDisplayMode === chosen;
    element.classList.toggle("active", flag2);
    element.setAttribute("aria-pressed", String(flag2));
  }
  const numeric5 = Number(value.refreshInterval);
  const chosen2 = Number.isFinite(numeric5) ?
  Math.max(6, Math.round(numeric5)) :
  10;
  Ga.value = String(chosen2);
  Fx.hidden = chosen !== "snapshot";
  Ga.disabled = chosen !== "snapshot";
  const chosen3 = value.fit === "contain" ? "contain" : "fill";
  for (const element of hb.querySelectorAll("[data-camera-fit]")) {
    const flag2 = element.dataset.cameraFit === chosen3;
    element.classList.toggle("active", flag2);
    element.setAttribute("aria-pressed", String(flag2));
  }
  setInspectorToggle(vb, value.frameVisible !== false);
  wb.value = value.frameColor || "#d4d4d4";
  Cb.value = roundField(Number(value.frameWidth ?? 1));
  const numeric6 = Number(value.radius ?? 0.04);
  Sb.value = roundField(
    clampNumber(numeric6 > 0.5 ? numeric6 : numeric6 * 100, 0, 50)
  );
  xb.value = roundField(Number(value.frameAngle ?? 45));
  Nb.value = roundField(Number(value.frameOpacity ?? 0.9) * 100);
  Xd.value = roundField(
    clampNumber(
      (Number(flag.x || 0) + numeric3 / 2) / numeric * 100,
      0,
      100
    )
  );
  Kd.value = roundField(
    clampNumber(
      (Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100,
      0,
      100
    )
  );
  rc.value = roundField(numeric3 / numeric * 100);
  sc.value = roundField(numeric4 / numeric2 * 100);
  Ua.value = roundField(Number(component.style?.scale || 1) * 100);
  cc.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  rc.disabled = isMultiSelect;
  sc.disabled = isMultiSelect;
  cc.disabled = false;
  Ua.disabled = false;
  const length = st("camera").length;
  const length2 = jw(component).length;
  lc.disabled = length < 2 || !length2;
  zx.textContent = length2 + " 项修改";
  lc.textContent = "一键应用到同类型控件";
  const chosen4 = Object.prototype.hasOwnProperty.call(
    component.actions || {},
    "tap"
  ) ?
  component :
  {
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
  syncComponentActionControls(chosen4, Dx);
}
function LE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  wh.value = value.label || "";
  const chosen = ["air-conditioner", "bath-heater"].includes(value.deviceType) ?
  value.deviceType :
  "auto";
  for (const element of Ch.querySelectorAll(
    "[data-air-conditioner-device-type]"
  )) {
    const flag4 = element.dataset.airConditionerDeviceType === chosen;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  jd.textContent =
  chosen === "bath-heater" ? "预览浴霸详情" : "预览空调 / 浴霸详情";
  Bt(component);
  jd.disabled = !component.bindings?.entity?.entityId;
  Lh.value = value.iconOffColor || "#9aa5ad";
  Ih.value = value.iconOnColor || "#73c8ff";
  Th.value = value.badgeColor || "#5b5e66";
  Ah.value = roundField(Number(value.badgeOpacity ?? 0.58) * 100);
  Ph.value = roundField(Number(value.symbolSize ?? 14));
  kh.value = roundField(Number(value.badgeSize ?? 28));
  Mh.value = roundField(Number(value.iconLeft ?? 20));
  Oh.value = roundField(Number(value.iconTop ?? 50));
  setInspectorToggle(Eh, value.iconVisible !== false);
  $h.value = value.mainText || "";
  Fh.value = value.mainColor || "#c7c8cb";
  Dh.value = roundField(Number(value.mainSize ?? 21));
  zh.value = roundField(normalizedFontWeight(value.mainWeight, 0.24));
  Vh.value = roundField(Number(value.mainSpacing ?? 0.5));
  Wh.value = roundField(Number(value.mainTextLeft ?? 39));
  Rh.value = roundField(Number(value.mainTextTop ?? 40));
  setInspectorToggle(Bh, value.mainTextVisible !== false);
  jh.value = value.secondaryText || "";
  qh.value = value.secondaryColor || "#75777d";
  Gh.value = roundField(Number(value.secondarySize ?? 12));
  Uh.value = roundField(normalizedFontWeight(value.secondaryWeight, 0.12));
  _h.value = roundField(Number(value.secondarySpacing ?? 0.3));
  Yh.value = roundField(Number(value.secondaryTextLeft ?? 39));
  Xh.value = roundField(Number(value.secondaryTextTop ?? 67));
  setInspectorToggle(Hh, value.secondaryTextVisible !== false);
  setInspectorToggle(Kh, value.airflowVisible !== false);
  const chosen2 = value.airflowMotion === "static" ? "static" : "dynamic";
  for (const element of Jh.querySelectorAll("[data-airflow-motion]")) {
    const flag4 = element.dataset.airflowMotion === chosen2;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  Zh.value = value.airflowCoolColor || "#73c8ff";
  Qh.value = value.airflowHeatColor || "#ff8a65";
  eb.value = value.airflowOtherColor || "#dce2e6";
  tb.value = roundField(Number(value.airflowAngle ?? 7));
  nb.value = roundField(Number(value.airflowCurve ?? 20));
  ob.value = roundField(Number(value.airflowLength ?? 200));
  ib.value = roundField(Number(value.airflowFadePosition ?? 50));
  ab.value = roundField(Number(value.airflowSpread ?? 100));
  rb.value = roundField(Number(value.airflowDensity ?? 60));
  sb.value = roundField(Number(value.airflowIrregularity ?? 50));
  cb.value = roundField(Number(value.airflowThickness ?? 40));
  lb.value = roundField(Number(value.airflowStrength ?? 200));
  db.value = roundField(Number(value.airflowBlur ?? 6));
  zd.value = roundField(Number(value.airflowSpeed ?? 1));
  zd.disabled = chosen2 === "static";
  const temp = airflowCanvasOffsetBounds(component, h.document.canvas);
  Ra.min = String(roundField(temp.minX));
  Ra.max = String(roundField(temp.maxX));
  Ha.min = String(roundField(temp.minY));
  Ha.max = String(roundField(temp.maxY));
  Ra.value = roundField(Number(value.airflowOffsetX ?? -75));
  Ha.value = roundField(Number(value.airflowOffsetY ?? 34));
  ub.value = roundField(Number(value.airflowWidth ?? 64));
  pb.value = roundField(Number(value.airflowHeight ?? 125));
  Vd.value = roundField(Number(value.airflowScale ?? 1) * 100);
  Wd.value = roundField(Number(value.airflowRotation ?? -3));
  Rd.value = roundField(
    clampNumber(
      (Number(flag.x || 0) + numeric3 / 2) / numeric * 100,
      0,
      100
    )
  );
  Hd.value = roundField(
    clampNumber(
      (Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100,
      0,
      100
    )
  );
  Zs.value = roundField(numeric3 / numeric * 100);
  Qs.value = roundField(numeric4 / numeric2 * 100);
  ja.value = roundField(Number(component.style?.scale || 1) * 100);
  ec.value = roundField(Number(flag.rotation || 0));
  const chosen3 = Fu.get(component.id) === "airflow" ? "airflow" : "button";
  if (!Mo.has(component.id)) {
    const chosen4 = chosen3 === "airflow" ? "on" : "off";
    Mo.set(component.id, chosen4);
    x?.setComponentPreviewState(component.id, chosen4);
  }
  const flag2 = Mo.get(component.id) || "auto";
  for (const element of Sh.querySelectorAll("[data-air-conditioner-preview]")) {
    const flag4 = element.dataset.airConditionerPreview === flag2;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  x?.setComponentSelectionLayer(component.id, chosen3);
  for (const element of xh.querySelectorAll("[data-air-conditioner-layer]")) {
    const flag4 = element.dataset.airConditionerLayer === chosen3;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  const flag3 = chosen3 === "airflow";
  Ix.hidden = flag3;
  Tx.hidden = flag3;
  Ax.hidden = flag3;
  Nh.hidden = !flag3;
  const isMultiSelect = selectedComponentIds.size > 1;
  for (const temp2 of [Zs, Qs]) {
    temp2.disabled = isMultiSelect;
  }
  ec.disabled = false;
  ja.disabled = false;
  const length = st("air-conditioner").length;
  const length2 = Dw(component).length;
  qd.disabled = length < 2 || !length2;
  kx.textContent = length2 + " 项修改";
  syncComponentActionControls(component, Px);
}
function IE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  mb.value = value.label || "";
  Bt(component);
  fb.value = roundField(Number(value.opacity ?? 0.5) * 100);
  Ud.value = roundField(
    clampNumber(
      (Number(flag.x || 0) + numeric3 / 2) / numeric * 100,
      0,
      100
    )
  );
  _d.value = roundField(
    clampNumber(
      (Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100,
      0,
      100
    )
  );
  qa.value = roundField(Number(component.style?.scale || 1) * 100);
  oc.value = roundField(Number(flag.rotation || 0));
  oc.disabled = false;
  qa.disabled = false;
}
function TE(component) {
  const value = [ia, si, ks, ui, tc, ic, Ks, _a, Ka, Qa, nr, ar, Ei].
  find((el2) => el2 && !el2.hidden)?.
  querySelector(":scope > .inspector-section");
  if (value && value.nextElementSibling !== gd) {
    value.insertAdjacentElement("afterend", gd);
  }
  const coverProps = component.properties || {};
  const coverKind = ["standard", "dream", "airer"].includes(coverProps.coverKind) ?
  coverProps.coverKind :
  "auto";
  for (const element of Eg.querySelectorAll("[data-cover-kind]")) {
    const coverKind2 = element.dataset.coverKind === coverKind;
    element.classList.toggle("active", coverKind2);
    element.setAttribute("aria-pressed", String(coverKind2));
  }
  const coverDirection = ["left", "right"].includes(coverProps.coverDirection) ?
  coverProps.coverDirection :
  "split";
  for (const element of Lg.querySelectorAll("[data-cover-direction]")) {
    const coverDirection2 = element.dataset.coverDirection === coverDirection;
    element.classList.toggle("active", coverDirection2);
    element.setAttribute("aria-pressed", String(coverDirection2));
  }
  const motorDirection = ["normal", "reversed"].includes(coverProps.coverMotorDirection) ?
  coverProps.coverMotorDirection :
  "auto";
  for (const element of Ig.querySelectorAll("[data-cover-motor-direction]")) {
    const motorDirection2 = element.dataset.coverMotorDirection === motorDirection;
    element.classList.toggle("active", motorDirection2);
    element.setAttribute("aria-pressed", String(motorDirection2));
  }
}
function Z() {
  window.requestAnimationFrame(CN);
  const component = O();
  renderInteraction3dInspector(g1, component, {
    document: h?.document,
    entities: le,
    states: x?.states,
    pickers: i3dEditorPickers,
    prepareCanvas: () => {
      if (!component) {
        throw new Error("3D 控件已不存在。");
      }
      const loc = findComponent(h?.document, component.id);
      if (!loc) {
        throw new Error("3D 控件已不存在。");
      }
      const path = loc.page?.path || W.value;
      const needSwitch = Te !== "edit" || x?.page?.path !== path;
      W.value = path;
      oe(W);
      if (needSwitch) {
        Mt("edit");
      }
      _e();
      Ac();
    },
    onError: onError,
    onChange: (patch, { replaceProperties = false } = {}) =>
    L(
      (doc) => {
        const c = findComponent(doc, component.id)?.component;
        if (!c || c.type !== "interaction3d") {
          throw new Error("3D 控件已不存在。");
        }
        for (const [k, v] of Object.entries(patch)) {
          c[k] =
          k === "properties" && replaceProperties ? v : { ...c[k], ...v };
        }
      },
      W.value,
      { throwOnError: true }
    )
  });
  const value = component?.type === "image";
  const flag = component?.type === "floorplan-auto-diagram";
  const flag2 = component?.type === "icon-button-effect";
  const flag3 = component?.type === "title-button";
  const flag4 = component?.type === "light-statistics";
  const includesValue = ["icon-button", "device-button", "presence-sensor"].includes(
    component?.type
  );
  const flag5 = component?.type === "vacuum-map";
  const flag6 = component?.type === "camera";
  const flag7 = component?.type === "air-conditioner";
  const flag8 = component?.type === "time";
  const flag9 = component?.type === "date";
  const flag10 = component?.type === "weather";
  const flag11 = component?.type === "line-chart";
  const flag12 = component?.type === "panel-frame";
  const flag13 = component?.type === "navigation-button";
  const flag14 = component?.type === "group";
  const valueI3d = component?.type === "interaction3d";
  for (const temp2 of [...Pi.keys()]) {
    if (!flag13 || temp2 !== component.id) {
      Pi.delete(temp2);
      x?.setComponentPreviewState(temp2, "auto");
    }
  }
  for (const temp2 of [...un.keys()]) {
    if (!flag2 || temp2 !== component.id) {
      un.delete(temp2);
      x?.setComponentPreviewState(temp2, "auto");
    }
  }
  for (const temp2 of [...zn.keys()]) {
    if (!includesValue || temp2 !== component.id) {
      zn.delete(temp2);
      x?.setComponentPreviewState(temp2, "auto");
    }
  }
  for (const temp2 of [...Mo.keys()]) {
    if (!flag7 || temp2 !== component.id) {
      Mo.delete(temp2);
      x?.setComponentPreviewState(temp2, "auto");
    }
  }
  const flag15 =
  flag14 ||
  value ||
  flag ||
  flag2 ||
  flag3 ||
  flag4 ||
  includesValue ||
  flag5 ||
  flag6 ||
  flag7 ||
  flag8 ||
  flag9 ||
  flag10 ||
  flag11 ||
  flag12 ||
  flag13 ||
  valueI3d;
  Ol.hidden = flag15;
  if (flag14) {
    Ol.querySelector("p").textContent =
    "组合支持整体移动、复制、旋转和缩放；双击组合可进入组内编辑。";
  }
  ia.hidden = !value;
  Rl.hidden = !flag;
  si.hidden = !flag2;
  ks.hidden = !flag3;
  cd.hidden = !flag4;
  ui.hidden = !includesValue;
  tc.hidden = !flag5;
  ic.hidden = !flag6;
  Ks.hidden = !flag7;
  _a.hidden = !flag8;
  Ka.hidden = !flag9;
  Qa.hidden = !flag10;
  nr.hidden = !flag11;
  ar.hidden = !flag12;
  Ei.hidden = !flag13;
  const temp = String(
    component?.bindings?.entity?.entityId || ""
  ).startsWith("cover.");
  gd.hidden = !flag15 || !temp;
  if (!flag15) {
    closeOtherPickerPanels();
    Ol.querySelector("p").textContent = component ?
    "“" + componentLabel(component) + "”的专属属性尚未实现。" :
    "选择一个控件开始编辑。";
    return;
  }
  if (temp) {
    TE(component);
  }
  if (flag) {
    const flag19 = component.properties || {};
    const flag20 = component.position || {};
    const numeric5 = Number(h.document.canvas.width || 2778);
    const numeric6 = Number(h.document.canvas.height || 1940);
    const numeric7 = Number(flag20.width || 100);
    const numeric8 = Number(flag20.height || 100);
    const list = Array.isArray(flag19.lightLayers) ?
    flag19.lightLayers.length :
    0;
    const flag21 =
    flag19.previewReady === true && (
    flag19.generated !== true || flag19.previewing === true);
    ai.textContent = flag19.generating ?
    "正在后台生成底图和灯组效果，请稍候…" :
    flag19.generated && list ?
    "已生成导图，包含 " + list + " 个灯组。" :
    flag21 ?
    "3D画面已置入仪表盘，请先确定位置、大小和视角。" :
    "尚未载入3D画面。";
    la.hidden = !flag21;
    const flag22 = flag19.interactionMode === "view";
    la.classList.toggle("active", flag22);
    la.setAttribute("aria-pressed", String(flag22));
    la.textContent = flag22 ? "完成3D视角调整" : "调整3D视角";
    Hl.value = flag19.label || flag19.instanceName || "";
    da.value = flag19.exportFolder || "";
    const chosen2 = flag19.layoutMode === "fill" ? "fill" : "free";
    for (const element of Jm.querySelectorAll("[data-floorplan-layout]")) {
      const flag24 = element.dataset.floorplanLayout === chosen2;
      element.classList.toggle("active", flag24);
      element.setAttribute("aria-pressed", String(flag24));
    }
    ua.value = roundField(
      clampNumber(
        (Number(flag20.x || 0) + numeric7 / 2) / numeric5 * 100,
        0,
        100
      )
    );
    pa.value = roundField(
      clampNumber(
        (Number(flag20.y || 0) + numeric8 / 2) / numeric6 * 100,
        0,
        100
      )
    );
    ma.value = roundField(numeric7 / numeric5 * 100);
    fa.value = roundField(numeric8 / numeric6 * 100);
    ga.value = roundField(Number(component.style?.scale || 1) * 100);
    ha.value = roundField(Number(flag20.rotation || 0));
    const temp2 = $u.get(component.id);
    const list2 = Array.isArray(temp2?.floors) ? temp2.floors : [];
    const flag23 =
    String(flag19.floorSelection || "") || String(temp2?.selected || "");
    if (list2.length) {
      const mapped2 = list2.map((component2) =>
      Object.assign(document.createElement("option"), {
        value: component2.id,
        textContent: component2.name
      })
      );
      if (list2.length > 1) {
        mapped2.unshift(
          Object.assign(document.createElement("option"), {
            value: "all",
            textContent: "全楼"
          })
        );
      }
      Zt.replaceChildren(...mapped2);
      Zt.value = mapped2.some((element) => element.value === flag23) ?
      flag23 :
      mapped2[0].value;
    } else {
      Zt.replaceChildren(
        Object.assign(document.createElement("option"), {
          value: "",
          textContent: flag21 ? "正在读取楼层…" : "载入3D画面后选择"
        })
      );
    }
    Zt.disabled = !flag21 || list2.length === 0 || flag19.generating === true;
    const chosen3 = flag19.cameraView === "top" ? "top" : "free";
    const chosen4 =
    flag19.cameraMode === "perspective" ? "perspective" : "orthographic";
    for (const element of Zm.querySelectorAll("[data-floorplan-camera-view]")) {
      const flag24 = element.dataset.floorplanCameraView === chosen3;
      element.classList.toggle("active", flag24);
      element.setAttribute("aria-pressed", String(flag24));
    }
    for (const element of Qm.querySelectorAll("[data-floorplan-camera-mode]")) {
      const flag24 = element.dataset.floorplanCameraMode === chosen4;
      element.classList.toggle("active", flag24);
      element.setAttribute("aria-pressed", String(flag24));
    }
    ba.value = roundField(
      clampNumber(Number(flag19.cameraFocalLength || 50), 18, 120)
    );
    ba.disabled = chosen4 !== "perspective" || !flag21;
    ef.disabled = chosen3 !== "top" || !flag21;
    tf.disabled = !flag21;
    for (const temp3 of [ua, pa, ma, fa, ga, ha]) {
      temp3.disabled = chosen2 === "fill";
    }
    xt.disabled = flag19.generating === true;
    xt.textContent =
    flag19.generated && !flag19.previewing ?
    "重新调整位置和视角" :
    flag19.generating ?
    "正在后台生成…" :
    flag21 ?
    "确定位置大小并后台生成" :
    "载入3D画面";
    w1.hidden = list === 0;
    const filtered = le.filter((arg) => fe(arg) === "light");
    const mapped = (flag19.lightLayers || []).map((component2) => {
      const element = document.createElement("label");
      element.textContent = component2.note || component2.name || "灯组";
      const element2 = document.createElement("select");
      element2.dataset.floorplanLightGroupId = component2.id;
      const flag24 =
      component.bindings?.["lightGroup:" + component2.id]?.entityId || "";
      const element3 = document.createElement("option");
      element3.value = "";
      element3.textContent = "选择实体";
      element2.append(element3);
      for (const temp3 of filtered) {
        const element4 = document.createElement("option");
        element4.value = temp3.entityId;
        element4.textContent = ct(temp3);
        element2.append(element4);
      }
      if (flag24 && !filtered.some((arg) => arg.entityId === flag24)) {
        const element4 = document.createElement("option");
        element4.value = flag24;
        element4.textContent = flag24;
        element2.append(element4);
      }
      element2.value = flag24;
      element.append(element2);
      return element;
    });
    nf.replaceChildren(...mapped);
    return;
  }
  if (flag2) {
    const chosen2 = Ts.hidden ?
    He.hidden ?
    Et.hidden ?
    null :
    "ibe-icon" :
    "ibe-asset" :
    "ibe-entity";
    closeOtherPickerPanels(chosen2);
    const flag19 = component.properties || {};
    const flag20 = component.position || {};
    const numeric5 = Number(h.document.canvas.width || 2778);
    const numeric6 = Number(h.document.canvas.height || 1940);
    const numeric7 = Number(flag20.width || 100);
    const numeric8 = Number(flag20.height || 100);
    af.value = flag19.label || "";
    setInspectorToggle(sf, flag19.buttonVisible !== false);
    setInspectorToggle(cf, flag19.effectVisible !== false);
    Ul.checked = flag19.effectColorTemperatureRealtime !== false;
    _l.checked = flag19.effectBrightnessRealtime !== false;
    for (const temp4 of [Ul, _l]) {
      temp4.disabled = false;
      temp4.title = "";
      temp4.closest(".check-row")?.classList.remove("is-disabled");
    }
    Bt(component);
    gE(component);
    KN(flag19.icon || "");
    Xl.value = flag19.iconOffColor || "#9aa5ad";
    Kl.value = flag19.iconOnColor || "#ffffff";
    lf.value = roundField(Number(flag19.iconSize ?? 44));
    Jl.value = flag19.buttonOffColor || "#17242d";
    Zl.value = flag19.buttonOnColor || "#1f91b8";
    df.value = roundField(Number(flag19.buttonOpacity ?? 0.92) * 100);
    uf.value = flag19.frameColor || "#dcebf2";
    pf.value = roundField(Number(flag19.frameWidth ?? 1.5));
    mf.value = roundField(Number(flag19.frameOpacity ?? 0.72) * 100);
    ff.value = roundField(Number(flag19.radius ?? 50));
    gf.value = flag19.glowColor || "#43c8f0";
    Ql.value = roundField(Number(flag19.glowOffStrength ?? 0) * 100);
    ed.value = roundField(Number(flag19.glowOnStrength ?? 1) * 100);
    bf.value = roundField(Number(flag19.effectOpacity ?? 1) * 100);
    yf.value = roundField(Number(flag19.effectFadeDuration ?? 0.52));
    td.value = roundField(Number(flag19.effectLeft ?? 50));
    nd.value = roundField(Number(flag19.effectTop ?? 50));
    od.value = roundField(Number(flag19.effectScale ?? 1) * 100);
    id.value = roundField(Number(flag19.effectRotation ?? 0));
    Na.value = roundField(
      clampNumber(
        (Number(flag20.x || 0) + numeric7 / 2) / numeric5 * 100,
        0,
        100
      )
    );
    Ea.value = roundField(
      clampNumber(
        (Number(flag20.y || 0) + numeric8 / 2) / numeric6 * 100,
        0,
        100
      )
    );
    ci.value = roundField(numeric7 / numeric5 * 100);
    li.value = roundField(numeric8 / numeric6 * 100);
    bo.value = roundField(Number(component.style?.scale || 1) * 100);
    di.value = roundField(Number(flag20.rotation || 0));
    const isMultiSelect2 = selectedComponentIds.size > 1;
    ci.disabled = isMultiSelect2;
    li.disabled = isMultiSelect2;
    bo.disabled = false;
    di.disabled = false;
    const chosen3 = flag19.effectLayoutMode === "fill" ? "fill" : "free";
    for (const element of vf.querySelectorAll("[data-ibe-layout]")) {
      const flag23 = element.dataset.ibeLayout === chosen3;
      element.classList.toggle("active", flag23);
      element.setAttribute("aria-pressed", String(flag23));
    }
    for (const temp4 of [td, nd, od, id]) {
      temp4.disabled = chosen3 === "fill";
    }
    const temp2 = pE(flag19);
    F1.textContent = temp2 ?
    "原始尺寸：" +
    roundField(temp2.width) +
    " × " +
    roundField(temp2.height) +
    "；仅支持等比缩放。" :
    "效果图片将按原始尺寸等比缩放。";
    const temp3 = iconButtonEffectInspectorLayer(
      component,
      qv.get(component.id)
    );
    x?.setComponentSelectionLayer(component.id, temp3);
    if (!un.has(component.id)) {
      un.set(component.id, "on");
      x?.setComponentPreviewState(component.id, "on");
    }
    const flag21 = un.get(component.id) || "auto";
    for (const element of Yl.querySelectorAll("[data-ibe-preview]")) {
      const flag23 = element.dataset.ibePreview === flag21;
      element.classList.toggle("active", flag23);
      element.setAttribute("aria-pressed", String(flag23));
    }
    for (const element of rf.querySelectorAll("[data-ibe-layer]")) {
      const flag23 = element.dataset.ibeLayer === temp3;
      element.classList.toggle("active", flag23);
      element.setAttribute("aria-pressed", String(flag23));
    }
    const flag22 = temp3 === "effect";
    P1.hidden = flag22;
    M1.hidden = flag22;
    O1.hidden = flag22;
    k1.hidden = !flag22;
    const length = st("icon-button-effect").length;
    const length2 = Vw(component).length;
    Ps.disabled = length < 2 || !length2;
    W1.textContent = length2 + " 项修改";
    Ps.textContent = "一键应用到同类型控件";
    syncComponentActionControls(component, V1);
    return;
  }
  if (flag7) {
    closeOtherPickerPanels(Js.hidden ? null : "air-conditioner-entity");
    LE(component);
    return;
  }
  if (flag3) {
    const chosen2 = Ms.hidden ?
    je.hidden ?
    null :
    "title-button-icon" :
    "title-button-entity";
    closeOtherPickerPanels(chosen2);
    SE(component);
    return;
  }
  if (flag4) {
    const chosen2 = Ie.hidden ?
    Vs.hidden ?
    qe.hidden ?
    null :
    "light-statistics-icon" :
    "light-statistics-action-entity" :
    "light-statistics-entity";
    closeOtherPickerPanels(chosen2);
    xE(component);
    return;
  }
  if (includesValue) {
    const chosen2 = mi.hidden ?
    It.hidden ?
    null :
    "icon-button-icon" :
    "icon-button-entity";
    closeOtherPickerPanels(chosen2);
    NE(component);
    return;
  }
  if (flag6) {
    closeOtherPickerPanels(ac.hidden ? null : "camera-entity");
    EE(component);
    return;
  }
  if (flag5) {
    closeOtherPickerPanels(nc.hidden ? null : "vacuum-map-entity");
    IE(component);
    return;
  }
  if (flag13) {
    closeOtherPickerPanels(Tt.hidden ? null : "navigation-icon");
    CE(component);
    return;
  }
  if (flag8) {
    closeOtherPickerPanels();
    hE(component);
    return;
  }
  if (flag9) {
    closeOtherPickerPanels();
    bE(component);
    return;
  }
  if (flag10) {
    closeOtherPickerPanels();
    yE(component);
    return;
  }
  if (flag11) {
    closeOtherPickerPanels();
    vE(component);
    return;
  }
  if (flag12) {
    closeOtherPickerPanels();
    wE(component);
    return;
  }
  const flag16 = component.properties || {};
  const flag17 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag17.width || 100);
  const numeric4 = Number(flag17.height || 100);
  h1.value = "图片";
  Is.value = flag16.label || "";
  Bt(component);
  fE(component);
  ca.value = roundField(Number(flag16.opacity ?? 1) * 100);
  mo.value = roundField(
    clampNumber(
      (Number(flag17.x || 0) + numeric3 / 2) / numeric * 100,
      0,
      100
    )
  );
  fo.value = roundField(
    clampNumber(
      (Number(flag17.y || 0) + numeric4 / 2) / numeric2 * 100,
      0,
      100
    )
  );
  Nn.value = roundField(
    clampNumber(Number(component.style?.scale || 1) * 100, 1, 500)
  );
  go.value = roundField(Number(flag17.rotation || 0));
  const chosen = flag16.layoutMode === "fill" ? "fill" : "free";
  for (const element of Km.querySelectorAll("[data-image-layout]")) {
    const flag19 = element.dataset.imageLayout === chosen;
    element.classList.toggle("active", flag19);
    element.setAttribute("aria-pressed", String(flag19));
  }
  const flag18 = chosen === "fill";
  const isMultiSelect = selectedComponentIds.size > 1;
  mo.disabled = flag18;
  fo.disabled = flag18;
  Nn.disabled = flag18;
  go.disabled = flag18;
  syncComponentActionControls(component, N1);
}
async function gn({ refreshInspector: value = true } = {}) {
  const [temp, temp2] = await Promise.all([
  J("/assets/builtin?_=" + Date.now()),
  J("/assets/user?_=" + Date.now())]
  );
  $n = temp.items || [];
  ht = temp2.items || [];
  Ev = (temp.catalogVersion || "") + ":" + (temp2.catalogVersion || "");
  const temp3 = setBuiltinAssetVersions(D0());
  if (temp3) {
    x?.renderComponents(true);
    Ue?.renderComponents(true);
  }
  if (value) {
    Z();
  }
  return temp3;
}
async function U0() {
  const value = await J("/assets/version");
  const number = (value.builtin || "") + ":" + (value.user || "");
  if (Ev !== number) {
    await gn({
      refreshInspector: true
    });
  }
}
async function jc({ afterCurrent: value = false } = {}) {
  if (Po) {
    if (value) {
      await Po;
      return jc();
    } else {
      return Po;
    }
  } else {
    Po = (async () => {
      const list = [];
      let temp = 0;
      let temp2 = 0;
      do {
        const temp5 = await J("/ha/entities?limit=500&offset=" + temp);
        list.push(...(temp5.items || []));
        temp2 = Number(temp5.total || 0);
        temp += Number(temp5.limit || 500);
      } while (list.length < temp2);
      le = list.filter((arg) => arg.status !== "missing");
      const [temp3, temp4] = await Promise.all([
      J("/ha/devices").catch(() => ({
        items: []
      })),
      J("/ha/translations").catch(() => ({
        resources: {}
      }))]
      );
      cn = temp3?.items || [];
      Iu = new Map(
        cn.
        map((arg) => [String(arg.deviceId || ""), Tr(arg.name)]).
        filter(([arg, arg2]) => arg && arg2)
      );
      Ao = temp4?.resources || {};
      Tu = true;
      x?.setEntityCatalog(le, Ao, cn);
      Ue?.setEntityCatalog(le, Ao, cn);
      _0();
      if (!document.activeElement?.closest?.(".inspector-form")) {
        Z();
      }
    })().finally(() => {
      Po = null;
    });
    return Po;
  }
}
function vp(value, arg2 = se) {
  const flag = value?.customPopups || [];
  We.replaceChildren();
  Yo.replaceChildren();
  if (!flag.length) {
    se = null;
    We.append(new Option("暂无组合弹窗", ""));
    We.disabled = true;
    ao.disabled = true;
    oe(We);
    const element = document.createElement("div");
    element.className = "popup-list-empty";
    element.textContent = "还没有组合弹窗";
    Yo.append(element);
    return;
  }
  for (const temp of flag) {
    We.append(new Option(temp.name, temp.id));
  }
  se = flag.some((component) => component.id === arg2) ? arg2 : flag[0].id;
  We.value = se;
  We.disabled = false;
  ao.disabled = false;
  oe(We);
  for (const temp of flag) {
    const temp2 = document.createElement("button");
    temp2.type = "button";
    temp2.className =
    "popup-list-item" + (temp.id === se ? " selected" : "");
    temp2.dataset.popupId = temp.id;
    temp2.setAttribute("role", "option");
    temp2.setAttribute("aria-selected", String(temp.id === se));
    const element = document.createElement("span");
    element.textContent = temp.name;
    const element2 = document.createElement("small");
    element2.textContent = (temp.modules || []).length + " 个模块";
    temp2.append(element, element2);
    Yo.append(temp2);
  }
}
function _0() {
  for (const element of document.querySelectorAll("[data-popup-entity]")) {
    const value = element.closest("[data-action-trigger]");
    if (!element.value && le[0]?.entityId) {
      element.value = le[0].entityId;
    }
    yp(value);
    const el2 = value?.querySelector("[data-popup-entity-menu]");
    if (el2 && !el2.hidden) {
      Rc(value, value.querySelector("[data-popup-entity-search]")?.value || "");
    }
  }
}
function wp(value = he.elements.deviceType.value) {
  const flag = he.elements.type.value === "climate";
  const temp = normalizedPopupClimateDeviceType(value);
  yu.hidden = !flag;
  he.elements.deviceType.value = temp;
  for (const element of yu.querySelectorAll(
    "[data-popup-module-device-type]"
  )) {
    const flag2 = element.dataset.popupModuleDeviceType === temp;
    element.classList.toggle("active", flag2);
    element.setAttribute("aria-pressed", String(flag2));
  }
}
function Cp(value) {
  return (
    le.find((arg) => arg.entityId === value)?.name ||
    value ||
    "未选择实体");

}
function Y0() {
  const value = he.elements.entityId.value;
  const found = le.find((arg) => arg.entityId === value);
  const chosen = found ?
  "[" + Hn(found) + "] " + Ot(found) :
  value || "选择实体";
  Mr(rn, chosen, value || chosen);
  rn.dataset.entityId = value;
  rn._entityCopySync?.();
}
function X0(value = hc.value) {
  const inputValue = he.elements.entityId.value;
  const temp = String(value || "").
  trim().
  toLocaleLowerCase("zh-CN");
  const mapped = le.
  map((entity, index) => ({
    entity: entity,
    index: index
  })).
  filter(
    ({ entity: arg }) =>
    !temp ||
    (ct(arg) + " " + arg.entityId).
    toLocaleLowerCase("zh-CN").
    includes(temp)
  ).
  sort(
    (arg, arg2) =>
    Number(
      popupModuleEntityRecommended(arg2.entity, he.elements.type.value)
    ) -
    Number(
      popupModuleEntityRecommended(arg.entity, he.elements.type.value)
    ) || arg.index - arg2.index
  ).
  map(({ entity: arg }) => arg);
  Ii.replaceChildren(
    ...mapped.map((arg) => {
      const temp2 = document.createElement("button");
      temp2.type = "button";
      temp2.className =
      "inspector-entity-option" + (
      arg.entityId === inputValue ? " selected" : "");
      temp2.dataset.popupModuleEntityId = arg.entityId;
      temp2.setAttribute("role", "option");
      temp2.setAttribute("aria-selected", String(arg.entityId === inputValue));
      const temp3 = document.createElement("span");
      temp3.className = "inspector-entity-option-content";
      const element = document.createElement("span");
      element.className =
      "inspector-entity-option-line inspector-entity-name-line";
      element.textContent = "[" + Hn(arg) + "] " + Ot(arg);
      const element2 = document.createElement("span");
      element2.className = "inspector-entity-option-line inspector-entity-id";
      element2.textContent = arg.entityId;
      temp3.append(element, element2);
      Gn(temp2, element);
      temp2.append(temp3);
      return temp2;
    })
  );
  if (!mapped.length) {
    const element = document.createElement("div");
    element.className = "inspector-picker-empty";
    element.textContent = "没有匹配的实体";
    Ii.append(element);
  }
}
function zi() {
  bu.hidden = true;
  rn.setAttribute("aria-expanded", "false");
}
function K0() {
  if (Te !== "popup") {
    return;
  }
  const value = findCustomPopup(h?.document, se);
  const customPopupStageWrap = yn.querySelector(".custom-popup-stage-wrap");
  const customPopupViewport = yn.querySelector(".custom-popup-viewport");
  const customPopupStage = yn.querySelector(".custom-popup-stage");
  const customPopupEditorToolbar = yn.querySelector(
    ".custom-popup-editor-toolbar"
  );
  if (
  !value ||
  !customPopupStageWrap ||
  !customPopupViewport ||
  !customPopupStage ||
  !customPopupEditorToolbar)
  {
    return;
  }
  const temp = popupLayoutMetrics(value.modules || [], value.layout);
  const gridWidth = temp.gridWidth;
  const gridHeight = temp.gridHeight;
  const count = Math.max(
    0.2,
    Math.min(
      customPopupStageWrap.clientWidth / gridWidth,
      customPopupStageWrap.clientHeight / gridHeight
    )
  );
  const count2 = Math.max(1, gridWidth * count);
  const count3 = Math.max(1, gridHeight * count);
  customPopupViewport.style.width = count2 + "px";
  customPopupViewport.style.height = count3 + "px";
  customPopupStage.style.width = gridWidth + "px";
  customPopupStage.style.height = gridHeight + "px";
  customPopupStage.style.transform = "scale(" + count + ")";
  customPopupEditorToolbar.style.width =
  customPopupStageWrap.clientWidth + "px";
}
function J0(value, arg2, arg3 = null, arg4 = false) {
  const found = (h?.document?.customPopups || []).find(
    (component) => component.id === value
  );
  if (!found) {
    return;
  }
  const temp = reorderedPopupModules(found.modules, arg2, arg3, arg4);
  if (
  temp.length !== (found.modules || []).length ||
  !temp.every((component, arg22) => component.id === found.modules[arg22]?.id))
  {
    if (!packPopupModules(temp, found.layout).fits) {
      onError(new Error("这个排序会使当前布局超过 3 行。"));
      return;
    }
    L((doc) => {
      const found2 = (doc.customPopups || []).find(
        (component) => component.id === value
      );
      if (found2) {
        found2.modules = reorderedPopupModules(
          found2.modules,
          arg2,
          arg3,
          arg4
        );
      }
    });
  }
}
function AE(value, component) {
  const temp = document.createElement("div");
  temp.className = "popup-cover-settings";
  const coverDirection = [
  {
    label: "窗帘类型",
    property: "coverKind",
    fallback: "auto",
    allowed: ["auto", "standard", "dream", "airer"],
    options: [
    ["auto", "自动识别"],
    ["standard", "普通窗帘"],
    ["dream", "梦幻帘"],
    ["airer", "晾衣机"]]

  },
  {
    label: "开合方向",
    property: "coverDirection",
    fallback: "split",
    allowed: ["split", "left", "right"],
    options: [
    ["split", "双开"],
    ["left", "向左"],
    ["right", "向右"]]

  },
  {
    label: "电机方向",
    property: "coverMotorDirection",
    fallback: "auto",
    allowed: ["auto", "normal", "reversed"],
    options: [
    ["auto", "跟随 HA"],
    ["normal", "正常"],
    ["reversed", "反向"]]

  }];

  for (const temp2 of coverDirection) {
    const temp3 = document.createElement("div");
    temp3.className = "popup-cover-setting-row";
    const element = document.createElement("span");
    element.textContent = temp2.label;
    const temp4 = document.createElement("div");
    temp4.className = "popup-cover-setting-options";
    temp4.setAttribute("role", "group");
    temp4.setAttribute("aria-label", temp2.label);
    const temp5 = component.properties?.[temp2.property];
    const chosen = temp2.allowed.includes(temp5) ? temp5 : temp2.fallback;
    for (const [temp6, temp7] of temp2.options) {
      const element2 = document.createElement("button");
      element2.type = "button";
      element2.textContent = temp7;
      element2.classList.toggle("active", temp6 === chosen);
      element2.setAttribute("aria-pressed", String(temp6 === chosen));
      element2.addEventListener("click", (event) => {
        event.stopPropagation();
        if (temp6 !== chosen) {
          L((doc) => {
            const component2 = (doc.customPopups || []).
            find((component3) => component3.id === value)?.
            modules?.find((component3) => component3.id === component.id);
            if (!!component2 && component2.type === "cover") {
              component2.properties = {
                ...(component2.properties || {}),
                [temp2.property]: temp6
              };
            }
          });
        }
      });
      temp4.append(element2);
    }
    temp3.append(element, temp4);
    temp.append(temp3);
  }
  return temp;
}
function PE(value, component) {
  const temp = document.createElement("div");
  temp.className = "popup-climate-settings";
  const temp2 = document.createElement("div");
  temp2.className = "popup-cover-setting-row";
  const element = document.createElement("span");
  element.textContent = "设备类型";
  const temp3 = document.createElement("div");
  temp3.className = "popup-cover-setting-options";
  temp3.setAttribute("role", "group");
  temp3.setAttribute("aria-label", "设备类型");
  const flag = component.properties?.deviceType || component.deviceType;
  const temp4 = normalizedPopupClimateDeviceType(flag);
  for (const [deviceType, temp5] of [
  ["auto", "自动识别"],
  ["air-conditioner", "空调"],
  ["bath-heater", "浴霸"]])
  {
    const element2 = document.createElement("button");
    element2.type = "button";
    element2.textContent = temp5;
    element2.classList.toggle("active", deviceType === temp4);
    element2.setAttribute("aria-pressed", String(deviceType === temp4));
    element2.addEventListener("click", (event) => {
      event.stopPropagation();
      if (deviceType !== temp4) {
        L((doc) => {
          const component2 = (doc.customPopups || []).
          find((component3) => component3.id === value)?.
          modules?.find((component3) => component3.id === component.id);
          if (!!component2 && component2.type === "climate") {
            component2.properties = {
              ...(component2.properties || {}),
              deviceType: deviceType
            };
            delete component2.deviceType;
          }
        });
      }
    });
    temp3.append(element2);
  }
  temp2.append(element, temp3);
  temp.append(temp2);
  return temp;
}
function qc(component) {
  const value = [
  {
    value: 0,
    color: "#ddffc2"
  },
  {
    value: 13,
    color: "#68cc3e"
  },
  {
    value: 27,
    color: "#ff8e52"
  },
  {
    value: 40,
    color: "#ff1a1a"
  }];

  const list = Array.isArray(component.properties?.thresholds) ?
  component.properties.thresholds :
  [];
  return value.map((element, arg2) => ({
    value: Number.isFinite(Number(list[arg2]?.value)) ?
    Number(list[arg2].value) :
    element.value,
    color: String(list[arg2]?.color || element.color)
  }));
}
function kE(value, component) {
  const temp = document.createElement("div");
  temp.className = "popup-line-chart-settings";
  const temp2 = document.createElement("div");
  temp2.className = "popup-line-chart-setting-row";
  const element = document.createElement("span");
  element.textContent = "数值小数位";
  const element2 = document.createElement("select");
  element2.setAttribute("aria-label", "组合弹窗折线图数值小数位");
  for (const [temp8, temp9] of [
  ["auto", "自动"],
  ["0", "0 位"],
  ["1", "1 位"],
  ["2", "2 位"],
  ["3", "3 位"],
  ["4", "4 位"]])
  {
    element2.append(new Option(temp9, temp8));
  }
  const temp3 = syncedLineChartProperties(
    h?.document,
    Je(),
    component.entityId,
    component.properties
  );
  element2.value = ["0", "1", "2", "3", "4"].includes(
    String(temp3.statePrecision)
  ) ?
  String(temp3.statePrecision) :
  "auto";
  element2.addEventListener("pointerdown", (event) => event.stopPropagation());
  element2.addEventListener("click", (event) => event.stopPropagation());
  element2.addEventListener("change", (event) => {
    event.stopPropagation();
    const statePrecision = ["0", "1", "2", "3", "4"].includes(element2.value) ?
    element2.value :
    "auto";
    L((doc) => {
      const component2 = (doc.customPopups || []).
      find((component3) => component3.id === value)?.
      modules?.find((component3) => component3.id === component.id);
      if (!!component2 && component2.type === "line-chart") {
        component2.properties = {
          ...(component2.properties || {}),
          statePrecision: statePrecision
        };
      }
    });
  });
  temp2.append(element, element2);
  temp.append(temp2);
  const createControl = (arg, arg2, arg3, arg4 = false) => {
    const temp8 = document.createElement("div");
    temp8.className = "popup-line-chart-setting-row";
    const element6 = document.createElement("span");
    element6.textContent = arg;
    const temp9 = document.createElement("div");
    temp9.className = "popup-line-chart-colors";
    arg2.forEach((arg5, arg22) => {
      const element7 = document.createElement("input");
      element7.type = "color";
      element7.value = arg5;
      element7.disabled = arg4;
      element7.setAttribute(
        "aria-label",
        "" + arg + (arg2.length > 1 ? " " + (arg22 + 1) : "")
      );
      element7.addEventListener("pointerdown", (event) =>
      event.stopPropagation()
      );
      element7.addEventListener("click", (event) => event.stopPropagation());
      element7.addEventListener("change", (event) => {
        event.stopPropagation();
        arg3(element7.value, arg22);
      });
      temp9.append(element7);
    });
    temp8.append(element6, temp9);
    temp.append(temp8);
  };
  createControl(
    "数值颜色",
    [String(component.properties?.valueColor || "#dce1e5")],
    (valueColor) => {
      L((doc) => {
        const component2 = (doc.customPopups || []).
        find((component3) => component3.id === value)?.
        modules?.find((component3) => component3.id === component.id);
        if (!!component2 && component2.type === "line-chart") {
          component2.properties = {
            ...(component2.properties || {}),
            valueColor: valueColor
          };
        }
      });
    }
  );
  const temp4 = document.createElement("div");
  temp4.className = "popup-line-chart-setting-row";
  const element3 = document.createElement("span");
  element3.textContent = "阈值模式";
  const element4 = document.createElement("select");
  element4.setAttribute("aria-label", "组合弹窗折线图阈值模式");
  element4.append(
    new Option("自动（按历史范围）", "auto"),
    new Option("手动设置", "manual")
  );
  const flag =
  Array.isArray(component.properties?.thresholds) &&
  component.properties.thresholds.some((element6) =>
  Number.isFinite(Number(element6?.value))
  );
  element4.value =
  component.properties?.thresholdMode === "auto" ||
  !flag && component.properties?.thresholdMode !== "manual" ?
  "auto" :
  "manual";
  element4.addEventListener("pointerdown", (event) => event.stopPropagation());
  element4.addEventListener("click", (event) => event.stopPropagation());
  element4.addEventListener("change", (event) => {
    event.stopPropagation();
    const thresholdMode = element4.value === "manual" ? "manual" : "auto";
    L((doc) => {
      const component2 = (doc.customPopups || []).
      find((component3) => component3.id === value)?.
      modules?.find((component3) => component3.id === component.id);
      if (!component2 || component2.type !== "line-chart") {
        return;
      }
      const options = {
        ...(component2.properties || {}),
        thresholdMode: thresholdMode
      };
      if (thresholdMode === "manual" && !Array.isArray(options.thresholds)) {
        options.thresholds = qc(component2);
      }
      component2.properties = options;
    });
  });
  temp4.append(element3, element4);
  temp.append(temp4);
  const temp5 = qc(component);
  const temp6 = document.createElement("div");
  temp6.className = "popup-line-chart-setting-row";
  const element5 = document.createElement("span");
  element5.textContent = "阈值";
  const temp7 = document.createElement("div");
  temp7.className = "popup-line-chart-threshold-values";
  temp5.forEach((element6, arg2) => {
    const element7 = document.createElement("input");
    element7.type = "number";
    element7.step = "any";
    element7.value = roundField(element6.value);
    element7.disabled = element4.value === "auto";
    element7.setAttribute("aria-label", "折线阈值 " + (arg2 + 1));
    element7.addEventListener("pointerdown", (event) =>
    event.stopPropagation()
    );
    element7.addEventListener("click", (event) => event.stopPropagation());
    element7.addEventListener("change", (event) => {
      event.stopPropagation();
      const number = Number(element7.value);
      if (Number.isFinite(number)) {
        element7.value = roundField(number);
        L((doc) => {
          const component2 = (doc.customPopups || []).
          find((component3) => component3.id === value)?.
          modules?.find((component3) => component3.id === component.id);
          if (!component2 || component2.type !== "line-chart") {
            return;
          }
          const thresholds = qc(component2);
          thresholds[arg2] = {
            ...thresholds[arg2],
            value: number
          };
          component2.properties = {
            ...(component2.properties || {}),
            thresholdMode: "manual",
            thresholds: thresholds
          };
        });
      }
    });
    temp7.append(element7);
  });
  temp6.append(element5, temp7);
  temp.append(temp6);
  createControl(
    "折线颜色",
    temp5.map((arg) => arg.color),
    (color, arg2) => {
      L((doc) => {
        const component2 = (doc.customPopups || []).
        find((component3) => component3.id === value)?.
        modules?.find((component3) => component3.id === component.id);
        if (!component2 || component2.type !== "line-chart") {
          return;
        }
        const thresholds = qc(component2);
        thresholds[arg2] = {
          ...thresholds[arg2],
          color: color
        };
        component2.properties = {
          ...(component2.properties || {}),
          thresholdMode: "manual",
          thresholds: thresholds
        };
      });
    },
    element4.value === "auto"
  );
  return temp;
}
function Sp() {
  if (Te !== "popup") {
    return;
  }
  const value = findCustomPopup(h?.document, se);
  yn.replaceChildren();
  if (!value) {
    const element5 = document.createElement("div");
    element5.className = "custom-popup-empty";
    element5.innerHTML =
    "<div><strong>还没有组合弹窗</strong><p>从左侧新建后，可以混合添加灯光、空调、空气净化器、窗帘、摄像头和折线图。</p></div>";
    yn.append(element5);
    return;
  }
  const temp = document.createElement("div");
  temp.className = "custom-popup-editor-shell";
  const temp2 = document.createElement("div");
  temp2.className = "custom-popup-editor-toolbar";
  const temp3 = document.createElement("div");
  const element = document.createElement("strong");
  element.textContent = value.name;
  const element2 = document.createElement("span");
  const temp4 = popupLayoutMetrics(value.modules || [], value.layout);
  element2.textContent =
  temp4.columns + " 列 × " + temp4.rows + " 行·行数自适应";
  temp3.append(element, element2);
  const temp5 = document.createElement("div");
  temp5.className = "custom-popup-toolbar-actions";
  const temp6 = document.createElement("span");
  temp6.className = "custom-popup-layout-toggle";
  for (const columns of [2, 3, 4]) {
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.textContent = columns + " 列";
    element5.classList.toggle(
      "active",
      popupLayoutColumns(value.layout) === columns
    );
    element5.addEventListener("click", () => {
      if (popupLayoutColumns(value.layout) === columns) {
        return;
      }
      const options = {
        ...(value.layout || {}),
        columns: columns
      };
      if (!packPopupModules(value.modules || [], options).fits) {
        onError(new Error("当前模块在 " + columns + " 列布局中会超过 3 行。"));
        return;
      }
      L((doc) => {
        const found = (doc.customPopups || []).find(
          (component) => component.id === value.id
        );
        if (found) {
          found.layout = {
            ...(found.layout || {}),
            columns: columns
          };
        }
      });
    });
    temp6.append(element5);
  }
  const element3 = document.createElement("button");
  element3.type = "button";
  element3.textContent = "＋ 添加模块";
  element3.addEventListener("click", () => Z0());
  temp5.append(temp6, element3);
  temp2.append(temp3, temp5);
  const temp7 = document.createElement("div");
  temp7.className = "custom-popup-stage-wrap";
  const temp8 = document.createElement("div");
  temp8.className = "custom-popup-viewport";
  const element4 = document.createElement("div");
  element4.className = "custom-popup-stage";
  element4.style.width = temp4.gridWidth + "px";
  element4.style.height = temp4.gridHeight + "px";
  element4.style.setProperty("--popup-columns", temp4.columns);
  element4.style.setProperty("--popup-rows", temp4.rows);
  element4.style.gridTemplateColumns =
  "repeat(" + temp4.columns + ", minmax(0, 1fr))";
  element4.style.gridTemplateRows =
  "repeat(" + temp4.rows + ", minmax(0, 1fr))";
  let temp9 = null;
  const elements = () => {
    element4.classList.remove("popup-module-append-target");
    for (const element5 of element4.querySelectorAll(
      ".popup-module-drop-top,.popup-module-drop-right,.popup-module-drop-bottom,.popup-module-drop-left"
    )) {
      element5.classList.remove(
        "popup-module-drop-top",
        "popup-module-drop-right",
        "popup-module-drop-bottom",
        "popup-module-drop-left"
      );
    }
  };
  element4.addEventListener("dragover", (event) => {
    if (!!temp9 && !event.target.closest(".popup-module-card")) {
      event.preventDefault();
      elements();
      element4.classList.add("popup-module-append-target");
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    }
  });
  element4.addEventListener("drop", (event) => {
    if (!temp9 || event.target.closest(".popup-module-card")) {
      return;
    }
    event.preventDefault();
    const temp10 = temp9;
    elements();
    J0(value.id, temp10);
  });
  for (const [temp10, temp11] of (value.modules || []).entries()) {
    const flag = temp4.placements[temp10] || {
      x: 0,
      y: temp10,
      width: 1,
      height: 1
    };
    const chosen = [
    "climate",
    "air-purifier",
    "water-heater",
    "media-player",
    "camera",
    "line-chart"].
    includes(temp11.type) ?
    2 :
    flag.width;
    const element5 = document.createElement("article");
    element5.className = "popup-module-card";
    element5.dataset.popupModuleId = temp11.id;
    element5.draggable = true;
    element5.setAttribute(
      "aria-label",
      (temp11.title || Cp(temp11.entityId)) + "，可拖动排序"
    );
    element5.style.gridColumn = flag.x + 1 + " / span " + chosen;
    element5.style.gridRow = flag.y + 1 + " / span " + flag.height;
    const temp12 = document.createElement("div");
    temp12.className = "popup-module-card-heading";
    const temp13 = document.createElement("div");
    const element6 = document.createElement("strong");
    element6.textContent = temp11.title || Cp(temp11.entityId);
    temp13.append(element6);
    const temp14 = document.createElement("span");
    temp14.className = "popup-module-card-actions";
    const element7 = document.createElement("button");
    element7.type = "button";
    element7.textContent = "✎";
    element7.title = "编辑模块";
    element7.addEventListener("click", () => Z0(temp11));
    const element8 = document.createElement("button");
    element8.type = "button";
    element8.textContent = "⎘";
    element8.title = "复制模块";
    element8.addEventListener("click", () => {
      const list = [
      ...(value.modules || []),
      {
        ...clone(temp11),
        id: "candidate"
      }];

      if (!packPopupModules(list, value.layout).fits) {
        onError(new Error("当前布局已放不下这个复制模块。"));
        return;
      }
      L((doc) => {
        const found = (doc.customPopups || []).find(
          (component) => component.id === value.id
        );
        const temp16 = found?.modules?.find(
          (component) => component.id === temp11.id
        );
        if (temp16) {
          found.modules.push({
            ...clone(temp16),
            id: newId("popup-module")
          });
        }
      });
    });
    const element9 = document.createElement("button");
    element9.type = "button";
    element9.textContent = "×";
    element9.title = "删除模块";
    element9.addEventListener("click", () =>
    L((doc) => {
      const found = (doc.customPopups || []).find(
        (component) => component.id === value.id
      );
      if (found) {
        found.modules = found.modules.filter(
          (component) => component.id !== temp11.id
        );
      }
    })
    );
    temp14.append(element7, element8, element9);
    element5.addEventListener("pointerdown", (event2) => {
      element5.dataset.dragBlocked = String(
        !!event2.target.closest(
          ".popup-module-card-actions,.popup-cover-settings,.popup-climate-settings,.popup-line-chart-settings"
        )
      );
    });
    element5.addEventListener("pointerup", () => {
      delete element5.dataset.dragBlocked;
    });
    element5.addEventListener("pointercancel", () => {
      delete element5.dataset.dragBlocked;
    });
    element5.addEventListener("dragstart", (event) => {
      if (element5.dataset.dragBlocked === "true") {
        event.preventDefault();
        delete element5.dataset.dragBlocked;
        return;
      }
      temp9 = temp11.id;
      element5.classList.add("popup-module-dragging");
      element5.setAttribute("aria-grabbed", "true");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", temp11.id);
      }
    });
    element5.addEventListener("dragover", (event) => {
      if (!temp9 || temp9 === temp11.id) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      elements();
      const { edge: temp16 } = popupModuleDropPosition(element5, event);
      element5.classList.add("popup-module-drop-" + temp16);
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    });
    element5.addEventListener("drop", (event) => {
      if (!temp9 || temp9 === temp11.id) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const temp16 = temp9;
      const { placeAfter: temp17 } = popupModuleDropPosition(element5, event);
      elements();
      J0(value.id, temp16, temp11.id, temp17);
    });
    element5.addEventListener("dragend", () => {
      temp9 = null;
      delete element5.dataset.dragBlocked;
      element5.classList.remove("popup-module-dragging");
      element5.removeAttribute("aria-grabbed");
      elements();
    });
    temp12.append(temp13, temp14);
    const temp15 = document.createElement("div");
    temp15.className = "popup-module-placeholder";
    const element10 = document.createElement("strong");
    element10.textContent = popupModuleTypeLabel(temp11.type) + "交互模块";
    const element11 = document.createElement("span");
    element11.textContent = Cp(temp11.entityId);
    const element12 = document.createElement("small");
    element12.textContent = temp11.entityId;
    temp15.append(element10, element11, element12);
    if (temp11.type === "cover") {
      temp15.append(AE(value.id, temp11));
    }
    if (temp11.type === "climate") {
      temp15.append(PE(value.id, temp11));
    }
    if (temp11.type === "line-chart") {
      temp15.append(kE(value.id, temp11));
    }
    element5.append(temp12, temp15);
    element4.append(element5);
  }
  if (!(value.modules || []).length) {
    const element5 = document.createElement("div");
    element5.className = "custom-popup-empty";
    element5.style.gridColumn = "1 / -1";
    element5.style.gridRow = "1 / -1";
    element5.textContent = "点击“添加模块”开始组合弹窗";
    element4.append(element5);
  }
  temp8.append(element4);
  temp7.append(temp8);
  temp.append(temp2, temp7);
  yn.append(temp);
  window.requestAnimationFrame(K0);
}
function Z0(component = null) {
  if (!findCustomPopup(h?.document, se)) {
    return;
  }
  vr = component?.id || null;
  cN.textContent = component ? "编辑弹窗模块" : "添加弹窗模块";
  const value =
  component?.type === "capability-device" ? "generic" : component?.type;
  he.elements.type.value = [
  "light",
  "climate",
  "air-purifier",
  "water-heater",
  "media-player",
  "electric-bed",
  "switch",
  "cover",
  "camera",
  "line-chart",
  "generic"].
  includes(value) ?
  value :
  "light";
  oe(he.elements.type);
  const flag =
  le.find((arg) =>
  popupModuleEntityRecommended(arg, he.elements.type.value)
  ) || le[0];
  he.elements.entityId.value = component?.entityId || flag?.entityId || "";
  he.elements.title.value = component?.title || "";
  wp(component?.properties?.deviceType || component?.deviceType || "auto");
  hc.value = "";
  Y0();
  Ii.replaceChildren();
  zi();
  Li.showModal();
}
function ME(value, arg2 = null) {
  W.replaceChildren();
  if (!value.pages.length) {
    W.append(new Option("暂无页面", ""));
    W.disabled = true;
    oe(W);
    return false;
  }
  const chosen = value.pages.some(
    (arg) => arg.path === value.defaultPagePath
  ) ?
  value.defaultPagePath :
  null;
  for (const temp of value.pages) {
    const temp2 = new Option(temp.name, temp.path);
    temp2.dataset.defaultPage = String(temp.path === chosen);
    W.append(temp2);
  }
  W.disabled = false;
  W.value =
  arg2 && value.pages.some((arg) => arg.path === arg2) ?
  arg2 :
  chosen || value.pages[0].path;
  oe(W);
  return true;
}
function Q0(value, arg2) {
  const chosen = selectedComponentIds.size ? [...selectedComponentIds] : componentId ? [componentId] : [];
  selectedComponentIds = new Set(
    chosen.filter((arg) => {
      const temp = findComponent(value, arg);
      return (
        temp && (temp.scope !== "page" || temp.page?.path === arg2));

    })
  );
  if (!selectedComponentIds.has(componentId)) {
    componentId = selectedComponentIds.values().next().value || null;
  }
  if (!componentId) {
    we = null;
  }
}
const OE = new Set();
function BE(value, arg2, arg3) {
  if (
  Te !== "edit" ||
  !x ||
  x.page?.path !== arg3 ||
  editorDocumentFrameSignature(value) !== editorDocumentFrameSignature(arg2))
  {
    return null;
  }
  const temp = editorComponentEntries(value);
  const temp2 = editorComponentEntries(arg2);
  if (
  temp.order.length !== temp2.order.length ||
  temp.order.some((arg, arg22) => arg !== temp2.order[arg22]) ||
  temp.entries.size !== temp2.entries.size)
  {
    return null;
  }
  const list = [];
  for (const [componentId, temp3] of temp.entries) {
    const temp4 = temp2.entries.get(componentId);
    if (
    !temp4 ||
    temp3.scope !== temp4.scope ||
    temp3.pagePath !== temp4.pagePath ||
    temp3.parentId !== temp4.parentId ||
    OE.has(temp3.component.type) ||
    editorComponentStructure(temp3.component) !==
    editorComponentStructure(temp4.component))
    {
      return null;
    }
    if (JSON.stringify(temp3.component) !== JSON.stringify(temp4.component)) {
      if (!x.componentHosts.has(componentId)) {
        return null;
      }
      list.push({
        componentId: componentId,
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
function ew(value, fallback) {
  const component = findComponent(h?.document, value)?.component;
  if (!component || value !== componentId) {
    return;
  }
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(component.position?.width || 100);
  const numeric4 = Number(component.position?.height || 100);
  const chosen = Number.isFinite(fallback.width) ? fallback.width : numeric3;
  const chosen2 = Number.isFinite(fallback.height) ? fallback.height : numeric4;
  const includesValue = ["icon-button", "device-button", "presence-sensor"].includes(
    component.type
  );
  const element =
  component.type === "title-button" ?
  rd :
  component.type === "light-statistics" ?
  ud :
  includesValue ?
  $d :
  component.type === "air-conditioner" ?
  Rd :
  component.type === "vacuum-map" ?
  Ud :
  component.type === "camera" ?
  Xd :
  component.type === "icon-button-effect" ?
  Na :
  component.type === "navigation-button" ?
  ur :
  component.type === "time" ?
  Ya :
  component.type === "date" ?
  Ja :
  component.type === "weather" ?
  er :
  component.type === "line-chart" ?
  or :
  component.type === "panel-frame" ?
  rr :
  mo;
  const element2 =
  component.type === "title-button" ?
  sd :
  component.type === "light-statistics" ?
  pd :
  includesValue ?
  Fd :
  component.type === "air-conditioner" ?
  Hd :
  component.type === "vacuum-map" ?
  _d :
  component.type === "camera" ?
  Kd :
  component.type === "icon-button-effect" ?
  Ea :
  component.type === "navigation-button" ?
  pr :
  component.type === "time" ?
  Xa :
  component.type === "date" ?
  Za :
  component.type === "weather" ?
  tr :
  component.type === "line-chart" ?
  ir :
  component.type === "panel-frame" ?
  sr :
  fo;
  const element3 =
  component.type === "title-button" ?
  Aa :
  component.type === "light-statistics" ?
  $a :
  includesValue ?
  Wa :
  component.type === "air-conditioner" ?
  ja :
  component.type === "vacuum-map" ?
  qa :
  component.type === "camera" ?
  Ua :
  component.type === "icon-button-effect" ?
  bo :
  component.type === "navigation-button" ?
  An :
  component.type === "time" ?
  yo :
  component.type === "date" ?
  vo :
  component.type === "weather" ?
  wo :
  component.type === "line-chart" ?
  Co :
  component.type === "panel-frame" ?
  So :
  Nn;
  const element4 =
  component.type === "title-button" ?
  Ds :
  component.type === "light-statistics" ?
  Hs :
  includesValue ?
  _s :
  component.type === "air-conditioner" ?
  ec :
  component.type === "vacuum-map" ?
  oc :
  component.type === "camera" ?
  cc :
  component.type === "icon-button-effect" ?
  di :
  component.type === "navigation-button" ?
  Eo :
  component.type === "time" ?
  gi :
  component.type === "date" ?
  hi :
  component.type === "weather" ?
  bi :
  component.type === "line-chart" ?
  Ci :
  component.type === "panel-frame" ?
  Ni :
  go;
  if (Number.isFinite(fallback.x)) {
    element.value = roundField(
      clampNumber((fallback.x + chosen / 2) / numeric * 100, 0, 100)
    );
  }
  if (Number.isFinite(fallback.y)) {
    element2.value = roundField(
      clampNumber((fallback.y + chosen2 / 2) / numeric2 * 100, 0, 100)
    );
  }
  if (
  component.type === "navigation-button" &&
  Number.isFinite(fallback.width))
  {
    xo.value = roundField(
      clampNumber(fallback.width / numeric * 100, 0.1, 100)
    );
  }
  if (
  component.type === "navigation-button" &&
  Number.isFinite(fallback.height))
  {
    No.value = roundField(
      clampNumber(fallback.height / numeric2 * 100, 0.1, 100)
    );
  }
  if (
  component.type === "icon-button-effect" &&
  Number.isFinite(fallback.width))
  {
    ci.value = roundField(
      clampNumber(fallback.width / numeric * 100, 0.1, 100)
    );
  }
  if (
  component.type === "icon-button-effect" &&
  Number.isFinite(fallback.height))
  {
    li.value = roundField(
      clampNumber(fallback.height / numeric2 * 100, 0.1, 100)
    );
  }
  if (component.type === "title-button" && Number.isFinite(fallback.width)) {
    $s.value = roundField(
      clampNumber(fallback.width / numeric * 100, 0.1, 100)
    );
  }
  if (component.type === "title-button" && Number.isFinite(fallback.height)) {
    Fs.value = roundField(
      clampNumber(fallback.height / numeric2 * 100, 0.1, 100)
    );
  }
  if (
  component.type === "light-statistics" &&
  Number.isFinite(fallback.width))
  {
    Ws.value = roundField(
      clampNumber(fallback.width / numeric * 100, 0.1, 100)
    );
  }
  if (
  component.type === "light-statistics" &&
  Number.isFinite(fallback.height))
  {
    Rs.value = roundField(
      clampNumber(fallback.height / numeric2 * 100, 0.1, 100)
    );
  }
  if (includesValue && Number.isFinite(fallback.width)) {
    Gs.value = roundField(
      clampNumber(fallback.width / numeric * 100, 0.1, 100)
    );
  }
  if (includesValue && Number.isFinite(fallback.height)) {
    Us.value = roundField(
      clampNumber(fallback.height / numeric2 * 100, 0.1, 100)
    );
  }
  if (component.type === "camera" && Number.isFinite(fallback.width)) {
    rc.value = roundField(
      clampNumber(fallback.width / numeric * 100, 0.1, 100)
    );
  }
  if (component.type === "camera" && Number.isFinite(fallback.height)) {
    sc.value = roundField(
      clampNumber(fallback.height / numeric2 * 100, 0.1, 100)
    );
  }
  if (component.type === "air-conditioner" && Number.isFinite(fallback.width)) {
    Zs.value = roundField(
      clampNumber(fallback.width / numeric * 100, 0.1, 100)
    );
  }
  if (
  component.type === "air-conditioner" &&
  Number.isFinite(fallback.height))
  {
    Qs.value = roundField(
      clampNumber(fallback.height / numeric2 * 100, 0.1, 100)
    );
  }
  if (component.type === "line-chart" && Number.isFinite(fallback.width)) {
    vi.value = roundField(
      clampNumber(fallback.width / numeric * 100, 0.1, 100)
    );
  }
  if (component.type === "line-chart" && Number.isFinite(fallback.height)) {
    wi.value = roundField(
      clampNumber(fallback.height / numeric2 * 100, 0.1, 100)
    );
  }
  if (component.type === "panel-frame" && Number.isFinite(fallback.width)) {
    Si.value = roundField(
      clampNumber(fallback.width / numeric * 100, 0.1, 100)
    );
  }
  if (component.type === "panel-frame" && Number.isFinite(fallback.height)) {
    xi.value = roundField(
      clampNumber(fallback.height / numeric2 * 100, 0.1, 100)
    );
  }
  if (Number.isFinite(fallback.scale)) {
    element3.value = roundField(fallback.scale * 100);
  }
  if (Number.isFinite(fallback.rotation)) {
    element4.value = roundField(fallback.rotation);
  }
}
function jr() {
  return (
    x || (
    x = new PanelRenderer(Dt, {
      editable: true,
      historySeriesCache: Sv,
      runtimeStateCache: xv,
      virtualEntityStateCache: Nv,
      onComponentTransform(value, arg2) {
        componentId = value;
        selectedComponentIds = new Set([value]);
        L((arg) => {
          const component = findComponent(arg, value)?.component;
          if (!component) {
            return;
          }
          const temp = Ae(component, "width");
          const temp2 = Ae(component, "height");
          const temp3 = Ae(component, "scale");
          const temp4 = Ae(component, "rotation");
          const {
            scale: scale,
            airflowOffsetX: airflowOffsetX,
            airflowOffsetY: airflowOffsetY,
            ...temp5
          } = arg2;
          component.position = {
            ...(component.position || {}),
            ...temp5
          };
          if (Number.isFinite(scale)) {
            component.style = {
              ...(component.style || {}),
              scale: scale
            };
          }
          if (
          component.type === "air-conditioner" && (
          Number.isFinite(airflowOffsetX) || Number.isFinite(airflowOffsetY)))
          {
            component.properties = {
              ...(component.properties || {}),
              ...(Number.isFinite(airflowOffsetX) ?
              {
                airflowOffsetX: airflowOffsetX
              } :
              {}),
              ...(Number.isFinite(airflowOffsetY) ?
              {
                airflowOffsetY: airflowOffsetY
              } :
              {})
            };
          }
          if (
          component.type === "navigation-button" &&
          Number.isFinite(arg2.width))
          {
            Kn(value, "width", temp, Ae(component, "width"));
          }
          if (
          component.type === "navigation-button" &&
          Number.isFinite(arg2.height))
          {
            Kn(value, "height", temp2, Ae(component, "height"));
          }
          if (
          component.type === "navigation-button" &&
          Number.isFinite(arg2.scale))
          {
            Kn(value, "scale", temp3, Ae(component, "scale"));
          }
          if (
          component.type === "navigation-button" &&
          Number.isFinite(arg2.rotation))
          {
            Kn(value, "rotation", temp4, Ae(component, "rotation"));
          }
        });
      },
      onComponentsTransform(value, arg2) {
        componentId = arg2;
        L((arg) => {
          for (const temp of value) {
            const component = findComponent(
              arg,
              temp.componentId
            )?.component;
            if (component) {
              component.position = {
                ...(component.position || {}),
                ...(Number.isFinite(temp.x) ?
                {
                  x: temp.x
                } :
                {}),
                ...(Number.isFinite(temp.y) ?
                {
                  y: temp.y
                } :
                {}),
                ...(Number.isFinite(temp.rotation) ?
                {
                  rotation: temp.rotation
                } :
                {})
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
        we = component.id;
        L((arg) => {
          Gu(arg, value, component, false);
        });
      },
      onComponentsDuplicate(value, _, arg3) {
        const mapped = value.map((arg) => arg.copiedComponent.id);
        componentId = arg3 || mapped[0] || null;
        selectedComponentIds = new Set(mapped);
        we = componentId;
        L((arg) => {
          for (const temp of value) {
            Gu(arg, temp.sourceComponentId, temp.copiedComponent, false);
          }
        });
      },
      onComponentTransformPreview(value, arg2) {
        ew(value, arg2);
      },
      onComponentProperties(value, arg2) {
        L((arg) => {
          const component = findComponent(arg, value)?.component;
          if (
          !!component &&
          !!["air-conditioner", "presence-sensor"].includes(component.type) && (
          component.type !== "presence-sensor" ||
          component.properties?.sensorKind === "door-window"))
          {
            component.properties = {
              ...(component.properties || {}),
              ...arg2
            };
          }
        });
      },
      onComponentPropertiesPreview(value, arg2) {
        if (value === componentId) {
          if (Number.isFinite(arg2.airflowScale)) {
            Vd.value = roundField(arg2.airflowScale * 100);
          }
          if (Number.isFinite(arg2.airflowRotation)) {
            Wd.value = roundField(arg2.airflowRotation);
          }
          if (Number.isFinite(arg2.airflowOffsetX)) {
            Ra.value = roundField(arg2.airflowOffsetX);
          }
          if (Number.isFinite(arg2.airflowOffsetY)) {
            Ha.value = roundField(arg2.airflowOffsetY);
          }
        }
      },
      onComponentsTransformPreview(value, arg2) {
        componentId = arg2;
        const found = value.find((arg) => arg.componentId === arg2);
        if (found) {
          ew(arg2, found);
        }
      },
      onError: onError,
      onRuntimeStateChange() {
        const value = O();
        if (value?.type === "light-statistics") {
          C0(value);
        }
      },
      onPageChange(value) {
        W.value = value.path;
        oe(W);
        Q0(h?.document, value.path);
        x?.setSelectedComponents([...selectedComponentIds], componentId);
        _e();
        Z();
      }
    }),
    x.setEntityCatalog(le, Ao, cn),
    x));

}
function qr(value = null) {
  Hu();
  Pl();
  ju();
  vp(h.document, se);
  const temp = ME(h.document, value);
  a0(temp);
  qu();
  if (!temp) {
    qt();
    x?.destroy();
    x = null;
    Dt.innerHTML =
    '<div class="canvas-message"><strong>请从左侧新建页面。</strong></div>';
    _e();
    Z();
    Ac(value);
    if (Te === "popup") {
      Sp();
    }
    return;
  }
  Q0(h.document, W.value);
  if (Te === "edit") {
    jr().setDocument(h.document, W.value);
    x.setActiveGroup(De);
    x.setSelectedComponents([...selectedComponentIds], componentId);
  } else {
    x?.destroy();
    x = null;
  }
  _e();
  Z();
  if (Te === "dashboard") {
    Ac(W.value);
  } else if (Te === "popup") {
    Sp();
  } else {
    Do();
  }
}
function Xn() {
  Gm.disabled = pe.busy || !pe.undo.length || !h;
  Um.disabled = pe.busy || !pe.redo.length || !h;
}
function Gc(value = h?.projectId) {
  if (value) {
    try {
      sessionStorage.removeItem(recoveryStorageKey(xc, value));
    } catch {}
  }
}
function $E(value) {
  try {
    const temp = sessionStorage.getItem(recoveryStorageKey(xc, value));
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
function tw() {
  if (!h || !Dn) {
    return;
  }
  const value = {
    projectId: h.projectId,
    revision: h.revision,
    document: h.document,
    selectedPath: W.value,
    selectedComponentId: componentId,
    selectedComponentIds: [...selectedComponentIds],
    undo: pe.undo,
    redo: pe.redo,
    savedAt: new Date().toISOString()
  };
  try {
    sessionStorage.setItem(
      recoveryStorageKey(xc, h.projectId),
      JSON.stringify(value)
    );
  } catch {
    try {
      sessionStorage.setItem(
        recoveryStorageKey(xc, h.projectId),
        JSON.stringify({
          projectId: value.projectId,
          revision: value.revision,
          document: value.document,
          selectedPath: value.selectedPath,
          selectedComponentId: value.selectedComponentId,
          selectedComponentIds: value.selectedComponentIds,
          undo: [],
          redo: [],
          savedAt: value.savedAt
        })
      );
    } catch {}
  }
}
function hn({ preserveRecovery: value = false } = {}) {
  Dn = !!h && documentSignature(h.document) !== Ai;
  vm.disabled = !h || !Dn || Nc;
  if (Dn) {
    tw();
  } else if (!value) {
    Gc();
  }
}
function nw() {
  pe.undo = [];
  pe.redo = [];
  pe.busy = false;
  Xn();
}
function Vi(value, arg2) {
  for (
  value.push(arg2);
  value.filter((arg) => arg.kind !== "save").length > ku;)
  {
    const temp = value.findIndex((arg) => arg.kind !== "save");
    if (temp < 0) {
      break;
    }
    value.splice(temp, 1);
  }
  if (value.length > ku * 2) {
    value.splice(0, value.length - ku * 2);
  }
}
function Uc() {
  return {
    kind: "edit",
    document: clone(h.document),
    selectedPath: W.value,
    selectedComponentId: componentId,
    selectedComponentIds: [...selectedComponentIds]
  };
}
async function xp(projectId, value = null) {
  window.HABridgeLog?.setContext({
    projectId: projectId
  });
  h = await J("/projects/" + projectId + "/draft");
  Du = "";
  let temp = Tc(jt(h.document));
  if (!temp) {
    await Ir();
    temp = Tc(jt(h.document));
  }
  if (!temp?.allowed) {
    throw new Error("当前授权尚未解锁该 UI 方案。");
  }
  await ensureUiPackRuntime(temp);
  Oo.clear();
  ki.clear();
  Mi.clear();
  Oi.clear();
  Bi.clear();
  $i.clear();
  Ke = clone(h.document);
  Ai = documentSignature(h.document);
  bt = $E(projectId);
  if (
  bt && (
  bt.revision !== h.revision || documentSignature(bt.document) === Ai))
  {
    Gc(projectId);
    bt = null;
  }
  qt();
  nw();
  hn({
    preserveRecovery: !!bt
  });
  Ru(true);
  Le.value = projectId;
  oe(Le);
  qr(value);
  if (bt && !ni.open) {
    ni.showModal();
  }
}
async function _c(value = null) {
  ft = (await J("/projects")).items || [];
  Le.replaceChildren();
  if (!ft.length) {
    x?.destroy();
    x = null;
    Do();
    h = null;
    Hu();
    Oo.clear();
    ki.clear();
    Mi.clear();
    Oi.clear();
    Bi.clear();
    $i.clear();
    qt();
    Ke = null;
    Ai = "";
    bt = null;
    nw();
    hn();
    Ru(false);
    a0(false);
    Le.append(new Option("暂无仪表盘", ""));
    W.replaceChildren(new Option("暂无页面", ""));
    We.replaceChildren(new Option("暂无组合弹窗", ""));
    Yo.innerHTML = '<div class="popup-list-empty">还没有组合弹窗</div>';
    Le.disabled = true;
    W.disabled = true;
    We.disabled = true;
    ao.disabled = true;
    oe(Le);
    oe(W);
    oe(We);
    _e();
    Ac();
    return;
  }
  for (const temp of ft) {
    Le.append(new Option(temp.name, temp.id));
  }
  Le.disabled = false;
  oe(Le);
  const chosen =
  value && ft.some((component) => component.id === value) ? value : ft[0].id;
  await xp(chosen);
}
async function vt(
value,
arg2 = W.value,
{ recordHistory: arg = true } = {})
{
  if (!h) {
    throw new Error("请先选择仪表盘。");
  }
  const document = h.document;
  await guardInteraction3dChanges(document, value);
  const temp = BE(document, value, arg2);
  const temp2 = Uc();
  if (documentSignature(temp2.document) === documentSignature(value)) {
    return h;
  }
  h = {
    ...h,
    document: clone(value)
  };
  if (arg) {
    Vi(pe.undo, temp2);
    pe.redo = [];
  }
  const found = ft.find((component) => component.id === h.projectId);
  if (found) {
    found.name = h.document.name;
  }
  const element = Le.selectedOptions[0];
  if (element) {
    element.textContent = h.document.name;
  }
  oe(Le);
  if (temp && x?.applyEditorComponentUpdates(h.document, arg2, temp)) {
    _e();
    Z();
  } else {
    qr(arg2);
  }
  hn();
  Xn();
  return h;
}
async function Np() {
  if (!h || !Dn || Nc) {
    return;
  }
  const beforeSavedDocument = clone(Ke);
  const value = clone(h.document);
  const temp = documentSignature(value);
  const globalPopupsDirty =
  documentSignature(value.customPopups || []) !==
  documentSignature(Ke.customPopups || []);
  Nc = true;
  hn();
  try {
    const temp2 = await J("/projects/" + h.projectId + "/draft", {
      method: "PUT",
      hbLogContext: {
        projectId: h.projectId,
        phase: "save-draft"
      },
      body: JSON.stringify({
        revision: h.revision,
        globalPopupRevision: h.globalPopupRevision,
        globalPopupsDirty: globalPopupsDirty,
        document: h.document
      })
    });
    h = temp2;
    Ke = clone(temp2.document);
    Ai = documentSignature(temp2.document);
    ki.clear();
    Mi.clear();
    Oi.clear();
    Bi.clear();
    $i.clear();
    Vi(pe.undo, {
      kind: "save",
      beforeSavedDocument: beforeSavedDocument,
      afterSavedDocument: clone(temp2.document)
    });
    pe.redo = [];
    const found = ft.find((component) => component.id === h.projectId);
    if (found) {
      found.name = h.document.name;
    }
    const element = Le.selectedOptions[0];
    if (element) {
      element.textContent = h.document.name;
    }
    oe(Le);
    if (documentSignature(temp2.document) !== temp) {
      qr(W.value);
    }
  } catch (error) {
    onError(error);
  } finally {
    Nc = false;
    hn();
    Xn();
  }
}
async function FE(value, arg2) {
  const document =
  arg2 === "undo" ? value.beforeSavedDocument : value.afterSavedDocument;
  const globalPopupsDirty =
  documentSignature(document.customPopups || []) !==
  documentSignature(Ke.customPopups || []);
  const document2 = clone(h.document);
  const inputValue = W.value;
  const temp = await J("/projects/" + h.projectId + "/draft", {
    method: "PUT",
    body: JSON.stringify({
      revision: h.revision,
      globalPopupRevision: h.globalPopupRevision,
      globalPopupsDirty: globalPopupsDirty,
      document: document
    })
  });
  Ke = clone(temp.document);
  Ai = documentSignature(temp.document);
  if (!globalPopupsDirty) {
    document2.customPopups = clone(temp.document.customPopups || []);
  }
  h = {
    ...temp,
    document: document2
  };
  qr(inputValue);
  hn();
}
async function ow(value) {
  await Cr.catch(() => {});
  if (pe.busy || !h) {
    return;
  }
  const chosen = value === "undo" ? pe.undo : pe.redo;
  const chosen2 = value === "undo" ? pe.redo : pe.undo;
  const temp = chosen.pop();
  if (temp) {
    pe.busy = true;
    Xn();
    ki.clear();
    Mi.clear();
    Oi.clear();
    Bi.clear();
    $i.clear();
    try {
      if (temp.kind === "save") {
        await FE(temp, value);
        Vi(chosen2, temp);
      } else {
        const temp2 = Uc();
        const list = Array.isArray(temp.selectedComponentIds) ?
        temp.selectedComponentIds.filter((arg) =>
        findComponent(temp.document, arg)
        ) :
        [];
        componentId = findComponent(temp.document, temp.selectedComponentId) ?
        temp.selectedComponentId :
        list[0] || null;
        selectedComponentIds = new Set(list.length ? list : componentId ? [componentId] : []);
        we = componentId;
        await vt(temp.document, temp.selectedPath, {
          recordHistory: false
        });
        Vi(chosen2, temp2);
      }
    } catch (error) {
      Vi(chosen, temp);
      onError(error);
    } finally {
      pe.busy = false;
      Xn();
      if (Dn) {
        tw();
      }
    }
  }
}
async function DE() {
  const value = await J("/auth/me");
}
async function zE({ preserveForm: value = false } = {}) {
  ie = await J("/ha/connection");
  const flag = to.open && !ut.hidden;
  if (!value || !Xe && !flag) {
    ut.elements.name.value = ie.name || "Home Assistant";
    ut.elements.baseUrl.value = ie.baseUrl || "";
    ut.elements.accessToken.value = "";
    ut.elements.accessToken.placeholder = ie.hasToken ?
    "已加密保存，留空则保留原 Token" :
    "输入 Long-Lived Access Token";
    ut.elements.verifyTls.checked = ie.verifyTls !== false;
  }
  const flag2 = !ie.connected && !!ie.lastError;
  us.classList.toggle("connected", ie.connected);
  us.classList.toggle("error", flag2);
  us.querySelector("span").textContent = ie.connected ?
  ("HA 已连接 · " + (ie.version || "")).trim() :
  ie.lastError ?
  "HA 连接异常" :
  ie.configured ?
  "HA 重连中" :
  "HA 未配置";
  Hm.disabled = !ie.configured || !ie.baseUrl;
  Wi();
}
async function VE() {
  const value = await J("/ha/sync/status");
  Io = value;
  const flag = value.counts || {
    entities: 0,
    devices: 0,
    areas: 0
  };
  ZC.textContent = value.configured ?
  value.connected ?
  "已连接并实时同步" :
  value.status === "error" ?
  "连接异常" :
  "正在连接或同步" :
  "尚未配置";
  QC.textContent =
  "实体 " +
  flag.entities +
  " · 设备 " +
  flag.devices +
  " · 区域 " +
  flag.areas;
  Wi();
  if (!value.configured) {
    Ti = null;
    Tu = false;
    if (le.length || cn.length || Object.keys(Ao).length) {
      le = [];
      cn = [];
      Iu = new Map();
      Ao = {};
      x?.setEntityCatalog([], {}, []);
      Ue?.setEntityCatalog([], {}, []);
      _0();
      if (!document.activeElement?.closest?.(".inspector-form")) {
        Z();
      }
    }
    return;
  }
  const temp = JSON.stringify([
  Number.isFinite(Number(value.catalogRevision)) ?
  Number(value.catalogRevision) :
  value.lastFullSyncAt || "",
  Number(flag.entities || 0),
  Number(flag.devices || 0),
  Number(flag.areas || 0)]
  );
  if ((value.connected || value.status === "connected") && temp !== Ti) {
    const temp2 = Ti;
    Ti = temp;
    try {
      await jc({
        afterCurrent: true
      });
    } catch (error) {
      if (Ti === temp) {
        Ti = temp2;
      }
      throw error;
    }
  }
}
function Wi() {
  const value = !!ie?.configured;
  tS.hidden = !value || Xe;
  ut.hidden = value && !Xe;
  eS.hidden = value && !Xe;
  Em.hidden = !value || !Xe;
  if (!value) {
    return;
  }
  const flag = Io?.counts || {
    entities: 0,
    devices: 0,
    areas: 0
  };
  const flag2 = !!ie.connected || !!Io?.connected;
  const flag3 = !flag2 && (!!ie.lastError || !!Io?.lastError);
  Cm.classList.toggle("connected", flag2);
  Cm.classList.toggle("error", flag3);
  nS.textContent = ie.name || "Home Assistant";
  Sm.textContent = flag2 ?
  "已连接并实时同步" :
  flag3 ?
  "连接异常" :
  "正在重连";
  xm.textContent = ie.baseUrl || "—";
  xm.title = ie.baseUrl || "";
  oS.textContent = ie.version || "未知";
  iS.textContent =
  "实体 " +
  flag.entities +
  " · 设备 " +
  flag.devices +
  " · 区域 " +
  flag.areas;
  Nm.hidden = !flag3;
  Nm.textContent = flag3 && (ie.lastError || Io?.lastError) || "";
}
function WE() {
  Xe = true;
  Wi();
  D(no, "");
}
function RE() {
  Xe = false;
  Wi();
}
function HE(value) {
  return new Promise((arg) => window.setTimeout(arg, value));
}
async function Ri({ preserveForm = true } = {}) {
  return (
    yr || (
    yr = Promise.all([
    zE({
      preserveForm: preserveForm
    }),
    VE()]
    ).finally(() => {
      yr = null;
    }),
    yr));

}
async function jE(value = 30000) {
  const number = Date.now() + value;
  while (Date.now() < number) {
    await Ri({
      preserveForm: false
    });
    if (ie?.connected) {
      return true;
    }
    if (ie?.lastError) {
      return false;
    }
    await HE(500);
  }
  return !!ie?.connected;
}
function iw(value = false) {
  const temp = new FormData(ut);
  const trimmed = String(temp.get("accessToken") || "").trim();
  if (value && !trimmed) {
    throw new Error("测试连接时请输入 Home Assistant Token。");
  }
  return {
    name: String(temp.get("name") || "").trim(),
    baseUrl: String(temp.get("baseUrl") || "").trim(),
    accessToken: trimmed || null,
    verifyTls: temp.get("verifyTls") === "on"
  };
}
function Yc(value = be) {
  const flag =
  Fn.find((component) => component.id === "ui.base")?.dashboardTemplates || [];
  be =
  value === "" || flag.some((component) => component.id === value) ?
  value :
  flag[0]?.id || "";
  const list = [
  {
    id: "",
    name: "空白仪表盘",
    description: "使用默认 UI 创建空白画布，不预置页面、控件或弹窗。",
    previewUrls: [],
    previewLabels: [],
    canvasWidth: null,
    canvasHeight: null
  },
  ...flag.map((component) => ({
    id: component.id,
    name: component.name,
    description: component.description + " · v" + component.version,
    previewUrls: component.previewUrls || [],
    previewLabels: component.previewLabels || [],
    canvasWidth: Number(component.canvasWidth || 2778),
    canvasHeight: Number(component.canvasHeight || 1940)
  }))];

  Nl.replaceChildren(
    ...list.map((component) => {
      const temp = document.createElement("div");
      temp.className =
      "project-template-option" + (component.id === be ? " active" : "");
      temp.dataset.projectTemplateId = component.id;
      temp.dataset.previewUrls = JSON.stringify(component.previewUrls);
      temp.dataset.previewLabels = JSON.stringify(component.previewLabels);
      temp.dataset.previewIndex = "0";
      temp.setAttribute("role", "radio");
      temp.setAttribute("aria-checked", String(component.id === be));
      temp.tabIndex = 0;
      const temp2 = document.createElement("div");
      temp2.className =
      "project-template-carousel" + (
      component.previewUrls.length ? "" : " blank");
      if (component.previewUrls.length) {
        const temp3 = document.createElement("button");
        temp3.type = "button";
        temp3.className = "project-template-preview-open";
        temp3.dataset.projectPreviewAction = "open";
        temp3.title = "点击放大预览";
        const temp4 = document.createElement("img");
        temp4.src = component.previewUrls[0];
        temp4.alt = component.previewLabels[0] || component.name + "预览 1";
        temp4.loading = "eager";
        temp3.append(temp4);
        const element3 = document.createElement("button");
        element3.type = "button";
        element3.className = "project-template-carousel-arrow previous";
        element3.dataset.projectPreviewAction = "previous";
        element3.setAttribute("aria-label", "上一张预览");
        element3.textContent = "‹";
        const element4 = document.createElement("button");
        element4.type = "button";
        element4.className = "project-template-carousel-arrow next";
        element4.dataset.projectPreviewAction = "next";
        element4.setAttribute("aria-label", "下一张预览");
        element4.textContent = "›";
        const temp5 = document.createElement("div");
        temp5.className = "project-template-carousel-meta";
        const element5 = document.createElement("strong");
        element5.textContent = component.previewLabels[0] || "默认预览";
        const element6 = document.createElement("span");
        element6.textContent = "1 / " + component.previewUrls.length;
        temp5.append(element5, element6);
        temp2.append(temp3, element3, element4, temp5);
      } else {
        temp2.replaceChildren(
          ...Array.from(
            {
              length: 4
            },
            () => document.createElement("i")
          )
        );
      }
      const element = document.createElement("strong");
      element.textContent = component.name;
      const element2 = document.createElement("span");
      element2.textContent = component.description;
      temp.append(temp2, element, element2);
      return temp;
    })
  );
  ro.hidden = false;
  if (At === "create") {
    const found = list.find((component) => component.id === be);
    Qi.elements.name.value = found?.id ? found.name : "我的仪表盘";
    const flag2 = !!found?.id;
    ot.readOnly = flag2;
    it.readOnly = flag2;
    ot.value = String(flag2 ? found.canvasWidth : fr);
    it.value = String(flag2 ? found.canvasHeight : gr);
    ro.classList.toggle("fixed", flag2);
    ro.classList.remove("name-only");
    Om.textContent = flag2 ?
    "默认使用固定画布分辨率，创建时会完整保留页面布局与比例。" :
    "编辑器和仪表盘将共用该分辨率与比例，显示时只做等比缩放。";
    Ur();
    Lp(flag2);
  }
}
function aw(value) {
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
function qE(value, arg2) {
  const { urls: temp, labels: temp2 } = aw(value);
  if (!temp.length) {
    return;
  }
  const number =
  (Number(arg2) % temp.length + temp.length) % temp.length;
  value.dataset.previewIndex = String(number);
  const element = value.querySelector(".project-template-preview-open img");
  const element2 = value.querySelector(
    ".project-template-carousel-meta strong"
  );
  const element3 = value.querySelector(".project-template-carousel-meta span");
  if (element) {
    element.src = temp[number];
    element.alt = temp2[number] || "默认预览 " + (number + 1);
  }
  if (element2) {
    element2.textContent = temp2[number] || "默认预览";
  }
  if (element3) {
    element3.textContent = number + 1 + " / " + temp.length;
  }
}
function Gr() {
  if (To.length) {
    gt = (gt % To.length + To.length) % To.length;
    km.src = To[gt];
    km.alt = Su[gt] || "默认预览 " + (gt + 1);
    NS.textContent = Su[gt] || "默认预览";
    ES.textContent = gt + 1 + " / " + To.length;
  }
}
function GE(value) {
  const { urls: temp, labels: temp2 } = aw(value);
  if (temp.length) {
    To = temp;
    Su = temp2;
    gt = Number(value.dataset.previewIndex || 0);
    Gr();
    Ko.showModal();
  }
}
function Ep(value = "create") {
  At = value;
  const flag = value === "edit";
  const flag2 = value === "resize";
  Qi.reset();
  vS.textContent = flag2 ?
  "RESIZE DASHBOARD" :
  flag ?
  "EDIT PROJECT" :
  "NEW PROJECT";
  wS.textContent = flag2 ?
  "修改仪表盘分辨率" :
  flag ?
  "修改仪表盘" :
  "创建仪表盘项目";
  xl.textContent = flag2 ? "应用修改" : flag ? "保存修改" : "创建项目";
  Qi.elements.name.value =
  flag || flag2 ? h?.document?.name || "" : "我的仪表盘";
  xS.hidden = flag || flag2;
  ot.readOnly = false;
  it.readOnly = false;
  Bm.checked = false;
  PS.hidden = !flag2;
  ro.classList.remove("fixed", "name-only");
  if (!flag && !flag2) {
    fr = 2778;
    gr = 1940;
    sn = false;
    hr = 2778;
    br = 1940;
    ot.value = "2778";
    it.value = "1940";
    Ur();
    Yc("");
  } else if (flag) {
    ro.hidden = false;
    ro.classList.add("name-only");
  } else {
    be = "";
    const numeric = Number(h?.document?.canvas?.width || 2778);
    const numeric2 = Number(h?.document?.canvas?.height || 1940);
    fr = numeric;
    gr = numeric2;
    sn = true;
    hr = numeric;
    br = numeric2;
    ro.hidden = false;
    ot.value = String(numeric);
    it.value = String(numeric2);
    Om.textContent =
    "默认会同步调整所有页面、控件和弹窗；勾选“锁定控件大小及位置”后只改变画布，内容本身不会缩放或重新定位。";
    Ur();
    Lp(false);
  }
  D(ea, "");
  Yt.showModal();
}
function Ur() {
  const numeric = Number(ot.value);
  const numeric2 = Number(it.value);
  if (
  !Number.isInteger(numeric) ||
  !Number.isInteger(numeric2) ||
  numeric <= 0 ||
  numeric2 <= 0)
  {
    Mm.textContent = "等待输入有效分辨率";
    return;
  }
  const value = !be && sn ? hr : numeric;
  const chosen = !be && sn ? br : numeric2;
  const temp = greatestCommonDivisor(value, chosen);
  Mm.textContent = value / temp + " : " + chosen / temp;
}
function Lp(value = !!be) {
  const flag = value || sn;
  ta.disabled = value;
  ta.setAttribute("aria-pressed", String(flag));
  ta.classList.toggle("locked", flag);
  AS.textContent = value ? "固定" : flag ? "已锁定" : "锁定";
  ta.title = value ?
  "默认画布使用固定比例" :
  flag ?
  "点击解锁画布比例" :
  "锁定当前画布比例";
}
function rw(value) {
  if (be || !sn) {
    return;
  }
  const numeric = Number(hr);
  const numeric2 = Number(br);
  if (!!numeric && !!numeric2) {
    if (value === "width") {
      let numeric3 = Number(ot.value);
      if (!Number.isInteger(numeric3) || numeric3 < 320 || numeric3 > 7680) {
        return;
      }
      let rounded = Math.round(numeric3 * numeric2 / numeric);
      if (rounded < 240 || rounded > 4320) {
        rounded = Math.max(240, Math.min(4320, rounded));
        numeric3 = Math.max(
          320,
          Math.min(7680, Math.round(rounded * numeric / numeric2))
        );
        ot.value = String(numeric3);
      }
      it.value = String(rounded);
    } else {
      let numeric3 = Number(it.value);
      if (!Number.isInteger(numeric3) || numeric3 < 240 || numeric3 > 4320) {
        return;
      }
      let rounded = Math.round(numeric3 * numeric / numeric2);
      if (rounded < 320 || rounded > 7680) {
        rounded = Math.max(320, Math.min(7680, rounded));
        numeric3 = Math.max(
          240,
          Math.min(4320, Math.round(rounded * numeric2 / numeric))
        );
        it.value = String(numeric3);
      }
      ot.value = String(rounded);
    }
  }
}
function UE(value, arg2, arg3) {
  kS.textContent =
  "当前分辨率为 " +
  arg2 +
  " × " +
  arg3 +
  "，预计有 " +
  value +
  " 个控件会部分或全部位于画布范围之外。";
  return new Promise((arg) => {
    Cu = arg;
    ws.showModal();
  });
}
function Xc(value) {
  const temp = Cu;
  Cu = null;
  if (ws.open) {
    ws.close();
  }
  temp?.(value);
}
function sw(value = "create") {
  if (!h) {
    return;
  }
  xu = value;
  const flag = value === "rename";
  Cs.reset();
  $S.textContent = flag ? "EDIT PAGE" : "NEW PAGE";
  FS.textContent = flag ? "重命名页面" : "新建页面";
  El.textContent = flag ? "保存修改" : "创建页面";
  Cs.elements.name.value = flag && Je()?.name || "";
  D(Ll, "");
  so.showModal();
}
function _r() {
  if (Dn) {
    onError(new Error("当前有未保存修改，请先点击顶部的“保存”。"));
    return true;
  } else {
    return false;
  }
}
function cw(value) {
  const options = {
    UNACTIVATED: "尚未激活",
    ACTIVE: "授权有效",
    CONNECTION_WARNING: "授权连接异常",
    STARTUP_VALIDATION_REQUIRED: "授权店未连接",
    LEASE_EXPIRED: "租约已到期",
    INSTANCE_MISMATCH: "实例不匹配",
    INVALID: "租约无效",
    DEACTIVATED: "授权已停用",
    REVOKED: "授权已撤销"
  };
  const flag = value?.status || "UNACTIVATED";
  const flag2 = flag === "ACTIVE";
  const includesValue = ["CONNECTION_WARNING", "STARTUP_VALIDATION_REQUIRED"].includes(
    flag
  );
  const includesValue2 = [
  "LEASE_EXPIRED",
  "INSTANCE_MISMATCH",
  "INVALID",
  "REVOKED"].
  includes(flag);
  Ji.classList.toggle("connected", flag2);
  Ji.classList.toggle("warning", includesValue);
  Ji.classList.toggle("error", includesValue2);
  Ji.querySelector("span").textContent =
  !value?.required && flag === "UNACTIVATED" ?
  "授权 · 开发模式" :
  options[flag] || "授权状态";
  YC.className = flag2 ?
  "connected" :
  includesValue ?
  "warning" :
  includesValue2 ?
  "error" :
  "";
  XC.textContent = options[flag] || flag;
  const list = Array.isArray(value?.products) ?
  value.products.
  map((arg) => String(arg?.name || "").trim()).
  filter(Boolean) :
  [];
  KC.textContent = value?.activationCodeId ?
  list.length ?
  list.join(" · ") :
  "基础版" :
  value?.required ?
  "尚未激活" :
  "开发模式";
  wm.hidden = !value?.lastError;
  wm.textContent = value?.lastError || "";
  _o.hidden = ![
  "UNACTIVATED",
  "DEACTIVATED",
  "INVALID",
  "INSTANCE_MISMATCH",
  "REVOKED"].
  includes(flag);
}
async function Kc() {
  const value = await J("/license/status");
  if (value?.required && !value.allowed) {
    window.location.replace("/license");
    return value;
  }
  const temp = JSON.stringify([...(value?.features || [])].sort());
  const flag = zu !== null && zu !== temp;
  zu = temp;
  const chosen = h ? Tc(jt(h.document)) : null;
  const allowed = new Set(Array.isArray(value?.features) ? value.features : []);
  if (
  value?.required &&
  chosen?.featureCode &&
  !allowed.has(chosen.featureCode))
  {
    const number =
    "当前授权已不再包含“" + chosen.name + "”，该仪表盘已停止显示和编辑。";
    x?.destroy();
    x = null;
    Do();
    h = null;
    qt();
    Ru(false);
    const temp2 = document.createElement("div");
    temp2.className = "canvas-message";
    const element = document.createElement("strong");
    element.textContent = number;
    temp2.append(element);
    Dt.replaceChildren(temp2);
    if (Du !== chosen.id) {
      Du = chosen.id;
      onError(new Error(number));
    }
  }
  if (flag) {
    await Promise.all([
    gn({
      refreshInspector: false
    }),
    Ir()]
    );
  }
  cw(value);
  return value;
}
Ji.addEventListener("click", async () => {
  D(ds, "");
  await Kc();
  Zi.showModal();
});
_C.addEventListener("click", () => Zi.close());
Zi.addEventListener("click", (value) => {
  if (value.target === Zi) {
    Zi.close();
  }
});
_o.addEventListener("submit", async (event) => {
  event.preventDefault();
  const element = _o.querySelector('button[type="submit"]');
  const activationCode = String(
    new FormData(_o).get("activationCode") || ""
  ).trim();
  const email = String(new FormData(_o).get("email") || "").trim();
  element.disabled = true;
  D(ds, "正在绑定实例并获取签名租约…");
  try {
    const value = await J("/license/activate", {
      method: "POST",
      body: JSON.stringify({
        activationCode: activationCode,
        email: email
      })
    });
    _o.reset();
    cw(value);
    D(ds, "当前实例已成功激活。", "success");
  } catch (error) {
    D(ds, error.message, "error");
  } finally {
    element.disabled = false;
  }
});
us.addEventListener("click", async () => {
  Xe = false;
  D(no, "");
  await Ri({
    preserveForm: false
  });
  to.showModal();
});
JC.addEventListener("click", () => {
  Xe = false;
  to.close();
});
to.addEventListener("click", (value) => {
  if (value.target === to) {
    Xe = false;
    to.close();
  }
});
ut.addEventListener("input", () => {
  if (!ut.hidden) {
    Xe = true;
  }
});
gl.addEventListener("click", async () => {
  D(no, "正在测试地址、Token 和版本…");
  gl.disabled = true;
  try {
    const value = await J("/ha/test", {
      method: "POST",
      body: JSON.stringify(iw(true))
    });
    D(
      no,
      "连接成功：" + (
      value.locationName || "Home Assistant") +
      " · " + (
      value.version || "未知版本"),
      "success"
    );
  } catch (error) {
    D(no, error.message, "error");
  } finally {
    gl.disabled = false;
  }
});
ut.addEventListener("submit", async (event) => {
  event.preventDefault();
  const element = ut.querySelector('button[type="submit"]');
  element.disabled = true;
  D(no, "正在验证并加密保存连接…");
  try {
    ie = await J("/ha/connection", {
      method: "PUT",
      body: JSON.stringify(iw(false))
    });
    Xe = false;
    Wi();
    if (!(await jE()) && !ie?.lastError && Io?.status !== "error") {
      Sm.textContent = "后台仍在建立实时连接";
    }
  } catch (error) {
    Xe = true;
    Wi();
    D(no, error.message, "error");
  } finally {
    element.disabled = false;
  }
});
aS.addEventListener("click", WE);
Em.addEventListener("click", RE);
rS.addEventListener("click", () => {
  ps.reset();
  D(ms, "");
  to.close();
  oo.showModal();
});
sS.addEventListener("click", () => oo.close());
cS.addEventListener("click", () => oo.close());
oo.addEventListener("click", (value) => {
  if (value.target === oo) {
    oo.close();
  }
});
ps.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (
  String(new FormData(ps).get("confirmation") || "").trim() !== "删除连接")
  {
    D(ms, "请输入“删除连接”确认。", "error");
    return;
  }
  const element = ps.querySelector('button[type="submit"]');
  element.disabled = true;
  D(ms, "正在断开连接并清除同步目录…");
  try {
    await J("/ha/connection", {
      method: "DELETE"
    });
    oo.close();
    ie = null;
    Io = null;
    Xe = false;
    await Ri({
      preserveForm: false
    });
  } catch (error) {
    D(ms, error.message, "error");
  } finally {
    element.disabled = false;
  }
});
lS.addEventListener("click", async () => {
  if (!_r()) {
    try {
      if (!Fn.length) {
        await Ir();
      }
      Ep("create");
    } catch (error) {
      onError(error);
    }
  }
});
Lm.addEventListener("click", async () => {
  if (h) {
    D(hs, "");
    try {
      await Ir();
      n0();
      io.showModal();
    } catch (error) {
      onError(error);
    }
  }
});
mS.addEventListener("click", () => io.close());
io.addEventListener("click", (value) => {
  if (value.target === io) {
    io.close();
  }
});
hl.addEventListener("click", async (value) => {
  const ancestorEl = value.target.closest("[data-ui-pack-id]");
  if (!ancestorEl || ancestorEl.disabled || !h) {
    return;
  }
  const found = Fn.find((component) => component.id === ancestorEl.dataset.uiPackId);
  if (!found?.allowed) {
    D(hs, "当前授权尚未解锁该 UI 方案。", "error");
    return;
  }
  ancestorEl.disabled = true;
  D(hs, "正在加载并应用整套 UI…");
  try {
    await ensureUiPackRuntime(found);
    await L((arg) => applyUiPackToDocument(arg, found));
    io.close();
  } catch (error) {
    D(hs, error.message, "error");
    ancestorEl.disabled = false;
  }
});
CS.addEventListener("click", () => Yt.close());
SS.addEventListener("click", () => Yt.close());
Yt.addEventListener("click", (value) => {
  if (value.target === Yt) {
    Yt.close();
  }
});
Nl.addEventListener("click", (event) => {
  const value = event.target.closest("[data-project-template-id]");
  if (!value || At !== "create") {
    return;
  }
  const projectPreviewAction = event.target.closest(
    "[data-project-preview-action]"
  )?.dataset.projectPreviewAction;
  if (projectPreviewAction) {
    event.stopPropagation();
    if (
    projectPreviewAction === "open" &&
    (value.dataset.projectTemplateId || "") !== be)
    {
      be = value.dataset.projectTemplateId || "";
      Yc(be);
    } else if (projectPreviewAction === "open") {
      GE(value);
    } else {
      qE(
        value,
        Number(value.dataset.previewIndex || 0) + (
        projectPreviewAction === "next" ? 1 : -1)
      );
    }
    return;
  }
  be = value.dataset.projectTemplateId || "";
  Yc(be);
});
Nl.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key) || event.target.closest("button")) {
    return;
  }
  const value = event.target.closest("[data-project-template-id]");
  if (!!value && At === "create") {
    event.preventDefault();
    be = value.dataset.projectTemplateId || "";
    Yc(be);
  }
});
TS.addEventListener("click", () => Ko.close());
LS.addEventListener("click", () => {
  gt -= 1;
  Gr();
});
IS.addEventListener("click", () => {
  gt += 1;
  Gr();
});
Ko.addEventListener("click", (value) => {
  if (value.target === Ko) {
    Ko.close();
  }
});
Ko.addEventListener("keydown", (value) => {
  if (value.key === "ArrowLeft") {
    gt -= 1;
    Gr();
  }
  if (value.key === "ArrowRight") {
    gt += 1;
    Gr();
  }
});
ot.addEventListener("input", () => {
  rw("width");
  if (!be) {
    fr = Number(ot.value) || 2778;
    gr = Number(it.value) || 1940;
  }
  Ur();
});
it.addEventListener("input", () => {
  rw("height");
  if (!be) {
    fr = Number(ot.value) || 2778;
    gr = Number(it.value) || 1940;
  }
  Ur();
});
ta.addEventListener("click", () => {
  if (be || !["create", "resize"].includes(At)) {
    return;
  }
  const numeric = Number(ot.value);
  const numeric2 = Number(it.value);
  if (
  !Number.isInteger(numeric) ||
  !Number.isInteger(numeric2) ||
  numeric < 320 ||
  numeric > 7680 ||
  numeric2 < 240 ||
  numeric2 > 4320)
  {
    D(ea, "请先输入有效的宽度和高度后再锁定比例。", "error");
    return;
  }
  sn = !sn;
  if (sn) {
    hr = numeric;
    br = numeric2;
  }
  D(ea, "");
  Lp(false);
});
MS.addEventListener("click", () => Xc(false));
OS.addEventListener("click", () => Xc(false));
BS.addEventListener("click", () => Xc(true));
ws.addEventListener("cancel", (event) => {
  event.preventDefault();
  Xc(false);
});
Qi.addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = new FormData(Qi);
  const name = String(value.get("name") || "").trim();
  const canvasWidth = Number(value.get("canvasWidth"));
  const canvasHeight = Number(value.get("canvasHeight"));
  const lockContent = At === "resize" && Bm.checked;
  if (At === "resize" && lockContent) {
    const numeric = Number(h?.document?.canvas?.width || 2778);
    const numeric2 = Number(h?.document?.canvas?.height || 1940);
    const chosen =
    canvasWidth !== numeric || canvasHeight !== numeric2 ?
    countComponentsOutsideCanvas(h.document, canvasWidth, canvasHeight) :
    0;
    if (chosen > 0 && !(await UE(chosen, canvasWidth, canvasHeight))) {
      return;
    }
  }
  xl.disabled = true;
  D(
    ea,
    At === "resize" ?
    "正在调整整个仪表盘…" :
    At === "edit" ?
    "正在保存仪表盘名称…" :
    be ?
    "正在套用默认整套模板…" :
    "正在创建空白仪表盘…"
  );
  try {
    if (At === "resize") {
      const temp = resizeDashboardDocument(
        h.document,
        canvasWidth,
        canvasHeight,
        {
          lockContent: lockContent
        }
      );
      temp.name = name;
      await vt(temp);
      Yt.close();
    } else if (At === "edit") {
      const temp = clone(h.document);
      temp.name = name;
      await vt(temp);
      Yt.close();
    } else {
      const options = {
        name: name,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        uiPackId: "ui.base"
      };
      if (be) {
        options.templateId = be;
      }
      const temp = await J("/projects", {
        method: "POST",
        body: JSON.stringify(options)
      });
      Yt.close();
      await _c(temp.id);
    }
  } catch (error) {
    D(ea, error.message, "error");
  } finally {
    xl.disabled = false;
  }
});
fs.addEventListener("click", () => {
  const hidden = gs.hidden;
  Ht();
  Wn();
  pn();
  gs.hidden = !hidden;
  fs.setAttribute("aria-expanded", String(hidden));
});
dS.addEventListener("click", () => {
  if (!_r()) {
    window.location.assign("/3d-studio");
  }
});
gs.addEventListener("click", async (value) => {
  const projectAction = value.target.closest("[data-project-action]")?.dataset.
  projectAction;
  if (!!projectAction && !!h && (Wn(), !_r())) {
    if (projectAction === "edit") {
      Ep("edit");
      return;
    }
    if (projectAction === "resize") {
      Ep("resize");
      return;
    }
    if (projectAction === "duplicate") {
      const name = h.document.name;
      const allowed = new Set(ft.map((arg) => arg.name));
      let name2 = name + " 副本";
      let temp = 2;
      while (allowed.has(name2)) {
        name2 = name + " 副本 " + temp++;
      }
      try {
        const temp2 = await J("/projects/" + h.projectId + "/duplicate", {
          method: "POST",
          body: JSON.stringify({
            name: name2
          })
        });
        await _c(temp2.id);
      } catch (error) {
        onError(error);
      }
      return;
    }
    if (projectAction === "delete") {
      const found = ft.find((component) => component.id === h.projectId);
      if (!found) {
        return;
      }
      xs.reset();
      XS.textContent = "“" + found.name + "”";
      St.dataset.projectId = found.id;
      St.dataset.projectName = found.name;
      D(Ns, "");
      St.showModal();
    }
  }
});
_S.addEventListener("click", () => St.close());
YS.addEventListener("click", () => St.close());
St.addEventListener("click", (value) => {
  if (value.target === St) {
    St.close();
  }
});
xs.addEventListener("submit", async (event) => {
  event.preventDefault();
  const element = xs.querySelector('button[type="submit"]');
  const confirmation = String(new FormData(xs).get("confirmation") || "");
  const projectId = St.dataset.projectId;
  const projectName = St.dataset.projectName;
  if (confirmation !== projectName) {
    D(Ns, "请输入与项目名称完全一致的确认文字。", "error");
    return;
  }
  element.disabled = true;
  D(Ns, "正在删除项目和草稿…");
  try {
    await J("/projects/" + projectId, {
      method: "DELETE",
      body: JSON.stringify({
        confirmation: confirmation
      })
    });
    Gc(projectId);
    St.close();
    x?.destroy();
    x = null;
    h = null;
    qt();
    await _c();
  } catch (error) {
    D(Ns, error.message, "error");
  } finally {
    element.disabled = false;
  }
});
Im.addEventListener("click", () => sw("create"));
DS.addEventListener("click", () => so.close());
zS.addEventListener("click", () => so.close());
so.addEventListener("click", (value) => {
  if (value.target === so) {
    so.close();
  }
});
Cs.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = String(new FormData(Cs).get("name") || "").trim();
  const document = clone(h.document);
  const inputValue = W.value;
  El.disabled = true;
  D(Ll, xu === "rename" ? "正在保存页面名称…" : "正在创建页面…");
  try {
    if (xu === "rename") {
      const found = document.pages.find((arg) => arg.path === inputValue);
      found.name = name;
      await vt(document, inputValue);
    } else {
      const options = {
        id: newId("page"),
        name: name,
        path: uniquePagePath(h?.document?.pages, name),
        sharedComponentIds: document.sharedComponents.map(
          (sharedComponentIds) => sharedComponentIds.id
        ),
        components: []
      };
      const count = Math.max(
        0,
        document.pages.findIndex((arg) => arg.path === inputValue)
      );
      document.pages.splice(count + 1, 0, options);
      await vt(document, options.path);
    }
    so.close();
  } catch (error) {
    D(Ll, error.message, "error");
  } finally {
    El.disabled = false;
  }
});
VS.addEventListener("click", () => Ct.close());
WS.addEventListener("click", () => Ct.close());
Ct.addEventListener("click", (value) => {
  if (value.target === Ct) {
    Ct.close();
  }
});
$m.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = Ct.dataset.groupId || "";
  const component = findComponent(h?.document, value)?.component;
  if (!component || component.type !== "group") {
    Ct.close();
    return;
  }
  const temp = componentLabel(component);
  const label = String(new FormData($m).get("name") || "").
  trim().
  slice(0, 128);
  if (!label) {
    D(Dm, "请输入组合名称。", "error");
    return;
  }
  if (label === temp) {
    Ct.close();
    return;
  }
  L((arg) => {
    const component2 = findComponent(arg, value)?.component;
    if (component2?.type === "group") {
      component2.properties = {
        ...(component2.properties || {}),
        label: label
      };
    }
  });
  Ct.close();
});
bs.addEventListener("click", () => {
  const hidden = ys.hidden;
  Ht();
  Wn();
  pn();
  ys.hidden = !hidden;
  bs.setAttribute("aria-expanded", String(hidden));
});
ys.addEventListener("click", async (value) => {
  const pageAction =
  value.target.closest("[data-page-action]")?.dataset.pageAction;
  const currentPage = Je();
  if (!pageAction || !currentPage || !h) {
    return;
  }
  pn();
  if (pageAction === "rename") {
    sw("rename");
    return;
  }
  const temp = clone(h.document);
  const temp2 = temp.pages.findIndex(
    (arg) => arg.path === currentPage.path
  );
  if (pageAction === "default") {
    if (temp.defaultPagePath === currentPage.path) {
      return;
    }
    temp.defaultPagePath = currentPage.path;
    try {
      await vt(temp, currentPage.path);
      await Np();
    } catch (error) {
      onError(error);
    }
    return;
  }
  if (pageAction === "duplicate") {
    const temp3 = clonePageWithFreshIds(
      currentPage,
      currentPage.name + " 副本",
      h.document.pages
    );
    temp.pages.splice(temp2 + 1, 0, temp3);
    try {
      await vt(temp, temp3.path);
    } catch (error) {
      onError(error);
    }
    return;
  }
  if (pageAction === "delete") {
    Xt.dataset.pagePath = currentPage.path;
    ZS.textContent = "“" + currentPage.name + "”";
    D(Es, "");
    Xt.showModal();
  }
});
KS.addEventListener("click", () => Xt.close());
JS.addEventListener("click", () => Xt.close());
Xt.addEventListener("click", (value) => {
  if (value.target === Xt) {
    Xt.close();
  }
});
kl.addEventListener("click", async () => {
  const pagePath = Xt.dataset.pagePath;
  const document = clone(h.document);
  const temp = document.pages.findIndex((arg) => arg.path === pagePath);
  if (temp < 0) {
    D(Es, "页面已经不存在，请刷新后重试。", "error");
    return;
  }
  const temp2 = document.pages[temp];
  document.pages.splice(temp, 1);
  const target =
  document.pages[Math.max(0, temp - 1)]?.path ||
  document.pages[0]?.path ||
  null;
  const found = document.pages.find((arg) => arg.path === target);
  if (document.defaultPagePath === pagePath) {
    document.defaultPagePath = target;
  }
  const callback = (arg) => {
    for (const component of arg || []) {
      component.properties = {
        ...(component.properties || {})
      };
      if (
      component.type === "navigation-button" &&
      component.properties.targetPage === pagePath)
      {
        if (
        !component.properties.mainText ||
        component.properties.mainText === "页面导航" ||
        component.properties.mainText === temp2?.name)
        {
          component.properties.mainText = found?.name || "页面导航";
        }
        const temp3 = String(pagePath).replace(/[-_]+/g, " ").toUpperCase();
        if (
        !component.properties.secondaryText ||
        component.properties.secondaryText === "NAVIGATION" ||
        component.properties.secondaryText === temp3)
        {
          component.properties.secondaryText = target ?
          String(target).replace(/[-_]+/g, " ").toUpperCase() :
          "NAVIGATION";
        }
        if (target) {
          component.properties.targetPage = target;
        } else {
          delete component.properties.targetPage;
        }
      }
      component.actions = {
        ...(component.actions || {})
      };
      for (const temp3 of ["tap", "doubleTap", "hold"]) {
        if (
        component.actions[temp3]?.type === "navigate" &&
        component.actions[temp3]?.target === pagePath)
        {
          if (component.type === "navigation-button" && target) {
            component.actions[temp3] = {
              type: "navigate",
              target: target
            };
          } else {
            delete component.actions[temp3];
          }
        }
      }
      callback(component.children);
    }
  };
  callback(document.sharedComponents);
  for (const temp3 of document.pages) {
    callback(temp3.components);
  }
  kl.disabled = true;
  D(Es, "正在删除页面…");
  try {
    await vt(document, target);
    Xt.close();
  } catch (error) {
    D(Es, error.message, "error");
  } finally {
    kl.disabled = false;
  }
});
Pe.addEventListener("click", (value) => {
  const temp = Ou;
  const componentAction = value.target.closest("[data-component-action]")?.
  dataset.componentAction;
  const ancestorEl = value.target.closest("[data-label-color]");
  if (!temp || !componentAction && !ancestorEl) {
    return;
  }
  const chosen = selectedComponentIds.has(temp) ? [...selectedComponentIds] : [temp];
  _u();
  if (componentAction === "copy") {
    f0(chosen, temp);
    return;
  }
  if (componentAction === "group") {
    IN(chosen);
    return;
  }
  if (componentAction === "ungroup") {
    TN(temp);
    return;
  }
  if (componentAction === "rename-group") {
    AN(temp);
    return;
  }
  if (componentAction === "copy-to-page") {
    DN(chosen);
    return;
  }
  if (componentAction === "visibility") {
    const mapped = chosen.
    map((arg) => findComponent(h?.document, arg)?.component).
    filter(Boolean).
    map((el2) => el2.style?.visible !== false);
    if (
    mapped.length !== chosen.length ||
    !mapped.length ||
    !mapped.every((arg) => arg === mapped[0]))
    {
      return;
    }
    u0(chosen, !mapped[0]);
    return;
  }
  if (componentAction === "delete") {
    h0(chosen);
    return;
  }
  if (ancestorEl) {
    zN(chosen, ancestorEl.dataset.labelColor);
  }
});
QS.addEventListener("click", () => Kt.close());
e1.addEventListener("click", () => Kt.close());
Kt.addEventListener("click", (value) => {
  if (value.target === Kt) {
    Kt.close();
  }
});
n1.addEventListener("click", () => at.close());
o1.addEventListener("click", () => at.close());
at.addEventListener("click", (value) => {
  if (value.target === at) {
    at.close();
  }
});
c1.addEventListener("click", () => {
  xr = null;
  ti.close();
});
l1.addEventListener("click", () => {
  BN().catch(onError);
});
ti.addEventListener("click", (value) => {
  if (value.target === ti) {
    xr = null;
    ti.close();
  }
});
vn.addEventListener("change", () => {
  Yu();
});
ei.addEventListener("change", () => {
  if (vn.value === "other") {
    Yu();
  }
});
Ml.addEventListener("submit", async (event) => {
  event.preventDefault();
  let value = [];
  try {
    value = JSON.parse(at.dataset.componentIds || "[]");
  } catch {
    value = [];
  }
  const inputValue = co.value;
  const flag = vn.value === "other";
  if (!!h && !!value.length && !!inputValue) {
    lo.disabled = true;
    D(wn, "正在复制控件…");
    try {
      if (flag) {
        const projectId = ei.value;
        if (!projectId || !kt || kt.projectId !== projectId) {
          throw new Error("目标仪表盘尚未加载完成，请稍后重试。");
        }
        const document = clone(kt.document);
        const scaleMode = Ls.hidden ? "none" : Ml.elements.copyScaleMode.value;
        let temp3 = 0;
        const temp4 = copyComponentsAcrossDocuments(
          h.document,
          document,
          value,
          inputValue,
          {
            cloneValue: clone,
            createId: () => newId("component"),
            componentLabel: componentLabel,
            scaleMode: scaleMode,
            onInvalidAction: () => {
              temp3 += 1;
            }
          }
        );
        if (!temp4.length) {
          throw new Error("目标页面或源控件已发生变化，请重新操作。");
        }
        const temp5 = await J(
          "/projects/" + encodeURIComponent(projectId) + "/draft",
          {
            method: "PUT",
            body: JSON.stringify({
              revision: kt.revision,
              globalPopupRevision: kt.globalPopupRevision,
              globalPopupsDirty: false,
              document: document
            })
          }
        );
        kt = temp5;
        const found = ft.find((component) => component.id === projectId);
        if (found) {
          found.draftRevision = temp5.revision;
        }
        const flag3 = found?.name || "目标仪表盘";
        const flag4 = co.selectedOptions[0]?.textContent || "目标区域";
        const chosen = temp3 ?
        "（已清理 " + temp3 + " 个目标仪表盘不存在的跳转或弹窗动作）" :
        "";
        at.close();
        m0(
          "已复制 " +
          temp4.length +
          " 个控件到“" +
          flag3 +
          "”的“" +
          flag4 +
          "”，并已保存" +
          chosen +
          "。",
          {
            projectId: projectId,
            pagePath:
            inputValue === "shared" ?
            kt.document.pages?.[0]?.path :
            inputValue.replace(/^page:/, ""),
            scope: inputValue === "shared" ? "shared" : "page"
          }
        );
        return;
      }
      const temp = clone(h.document);
      const temp2 = copyComponentsToTarget(temp, value, inputValue, {
        cloneValue: clone,
        createId: () => newId("component"),
        componentLabel: componentLabel
      });
      if (!temp2.length) {
        throw new Error("目标页面或源控件已发生变化，请重新操作。");
      }
      componentId = temp2[0].id;
      selectedComponentIds = new Set(temp2.map((component) => component.id));
      we = temp2[0].id;
      const pagePath =
      inputValue === "shared" ? W.value : inputValue.replace(/^page:/, "");
      const flag2 = co.selectedOptions[0]?.textContent || "目标区域";
      await vt(temp, pagePath);
      at.close();
      m0("已复制 " + temp2.length + " 个控件到“" + flag2 + "”，并已保存。", {
        projectId: h.projectId,
        pagePath: pagePath,
        scope: inputValue === "shared" ? "shared" : "page"
      });
    } catch (error) {
      D(wn, error.message, "error");
    } finally {
      if (!flag || !wn.classList.contains("success")) {
        lo.disabled = false;
      }
    }
  }
});
t1.addEventListener("click", () => {
  let value = [];
  try {
    value = JSON.parse(Kt.dataset.componentIds || "[]");
  } catch {
    value = [];
  }
  if (!value.length) {
    return;
  }
  Kt.close();
  const allowed = new Set(value);
  selectedComponentIds = new Set([...selectedComponentIds].filter((arg) => !allowed.has(arg)));
  if (allowed.has(componentId)) {
    componentId = selectedComponentIds.values().next().value || null;
  }
  if (allowed.has(we)) {
    we = componentId;
  }
  L((arg) => {
    for (const temp of value) {
      kc(arg, temp);
    }
  });
});
ia.addEventListener("submit", (event) => event.preventDefault());
si.addEventListener("submit", (event) => event.preventDefault());
ks.addEventListener("submit", (event) => event.preventDefault());
cd.addEventListener("submit", (event) => event.preventDefault());
ui.addEventListener("submit", (event) => event.preventDefault());
tc.addEventListener("submit", (event) => event.preventDefault());
ic.addEventListener("submit", (event) => event.preventDefault());
Ks.addEventListener("submit", (event) => event.preventDefault());
_a.addEventListener("submit", (event) => event.preventDefault());
Ka.addEventListener("submit", (event) => event.preventDefault());
Qa.addEventListener("submit", (event) => event.preventDefault());
nr.addEventListener("submit", (event) => event.preventDefault());
ar.addEventListener("submit", (event) => event.preventDefault());
Ei.addEventListener("submit", (event) => event.preventDefault());
const lw = new Map([
[
Is,
{
  componentType: "image",
  property: "label",
  trim: true
}],

[
af,
{
  componentType: "icon-button-effect",
  property: "label",
  trim: true
}],

[
Sf,
{
  componentType: "title-button",
  property: "label",
  trim: true
}],

[
Ef,
{
  componentType: "title-button",
  property: "mainText",
  trim: false
}],

[
Os,
{
  componentType: "title-button",
  property: "secondaryText",
  trim: false,
  getValue: () => Os.value + "\n" + Bs.value
}],

[
Bs,
{
  componentType: "title-button",
  property: "secondaryText",
  trim: false,
  getValue: () => Os.value + "\n" + Bs.value
}],

[
ng,
{
  componentType: "light-statistics",
  property: "label",
  trim: true
}],

[
og,
{
  componentType: "light-statistics",
  property: "title",
  trim: false
}],

[
xg,
{
  componentType: "icon-button",
  componentTypes: ["icon-button", "device-button", "presence-sensor"],
  property: "label",
  trim: true
}],

[
Sd,
{
  componentType: "icon-button",
  componentTypes: ["icon-button", "device-button", "presence-sensor"],
  property: "mainText",
  trim: false
}],

[
xd,
{
  componentType: "icon-button",
  componentTypes: ["icon-button", "device-button", "presence-sensor"],
  property: "secondaryText",
  trim: false
}],

[
mb,
{
  componentType: "vacuum-map",
  property: "label",
  trim: true
}],

[
gb,
{
  componentType: "camera",
  property: "label",
  trim: true
}],

[
wh,
{
  componentType: "air-conditioner",
  property: "label",
  trim: true
}],

[
$h,
{
  componentType: "air-conditioner",
  property: "mainText",
  trim: false
}],

[
jh,
{
  componentType: "air-conditioner",
  property: "secondaryText",
  trim: false
}],

[
Eb,
{
  componentType: "time",
  property: "label",
  trim: true
}],

[
Ob,
{
  componentType: "date",
  property: "label",
  trim: true
}],

[
Ub,
{
  componentType: "weather",
  property: "label",
  trim: true
}],

[
ly,
{
  componentType: "line-chart",
  property: "label",
  trim: true
}],

[
vy,
{
  componentType: "panel-frame",
  property: "label",
  trim: true
}],

[
Cy,
{
  componentType: "panel-frame",
  property: "mainText",
  trim: false
}],

[
Py,
{
  componentType: "panel-frame",
  property: "secondaryText",
  trim: false
}],

[
pc,
{
  componentType: "navigation-button",
  property: "label",
  trim: true
}],

[
au,
{
  componentType: "navigation-button",
  property: "mainText",
  trim: false
}],

[
ru,
{
  componentType: "navigation-button",
  property: "secondaryText",
  trim: false
}]]

);
const Jc = new WeakMap();
for (const [t, e] of lw) {
  t.addEventListener("focus", () => {
    if (!!h && !!componentId) {
      Jc.set(t, {
        componentId: componentId,
        before: Uc(),
        historyRecorded: false
      });
    }
  });
  t.addEventListener("input", () => {
    if (!h || !componentId) {
      return;
    }
    const value = findComponent(h.document, componentId);
    const flag = e.componentTypes || [e.componentType];
    if (!value?.component || !flag.includes(value.component.type)) {
      return;
    }
    const chosen = e.getValue ? e.getValue() : t.value;
    const label = e.trim ? chosen.trim() : chosen;
    if (String(value.component.properties?.[e.property] || "") === label) {
      return;
    }
    let temp = Jc.get(t);
    if (!temp || temp.componentId !== componentId) {
      temp = {
        componentId: componentId,
        before: Uc(),
        historyRecorded: false
      };
      Jc.set(t, temp);
    }
    if (!temp.historyRecorded) {
      Vi(pe.undo, temp.before);
      pe.redo = [];
      temp.historyRecorded = true;
    }
    value.component.properties = {
      ...(value.component.properties || {}),
      [e.property]: label
    };
    if (e.property === "label") {
      _e();
      x?.previewComponentProperties(value.component.id, {
        label: label
      });
      Ue?.previewComponentProperties(value.component.id, {
        label: label
      });
    }
    if (e.componentType === "navigation-button" && e.property !== "label") {
      x?.previewComponentProperties(value.component.id, {
        [e.property]: label
      });
    }
    if (e.componentType === "panel-frame" && e.property !== "label") {
      x?.previewComponentProperties(value.component.id, {
        [e.property]: label
      });
    }
    if (e.componentType === "icon-button-effect" && e.property !== "label") {
      x?.previewComponentProperties(value.component.id, {
        [e.property]: label
      });
    }
    if (
    [
    "title-button",
    "light-statistics",
    "icon-button",
    "air-conditioner"].
    includes(e.componentType) &&
    e.property !== "label")
    {
      x?.previewComponentProperties(value.component.id, {
        [e.property]: label
      });
    }
    hn();
    Xn();
  });
  t.addEventListener("blur", () => Jc.delete(t));
}
H0();
for (const t of document.querySelectorAll(".component-action-controls")) {
  t.addEventListener("click", (value) => {
    const ancestorEl = value.target.closest("[data-hidden-content-clickable]");
    if (ancestorEl && componentId) {
      L((arg) => {
        const component = findComponent(arg, componentId)?.component;
        if (
        !!component &&
        !!["title-button", "device-button", "icon-button-effect"].includes(
          component.type
        ))
        {
          component.properties = {
            ...(component.properties || {}),
            hiddenContentClickable:
            ancestorEl.dataset.hiddenContentClickable === "on"
          };
        }
      });
      return;
    }
    const ancestorEl2 = value.target.closest("[data-action-type]");
    const temp = ancestorEl2?.closest("[data-action-trigger]");
    const temp2 = componentId;
    if (!ancestorEl2 || !temp || !temp2 || ancestorEl2.disabled) {
      return;
    }
    const type = ACTION_TYPES.includes(ancestorEl2.dataset.actionType) ?
    ancestorEl2.dataset.actionType :
    "none";
    const actionTrigger = temp.dataset.actionTrigger;
    if (["tap", "doubleTap", "hold"].includes(actionTrigger)) {
      L((doc) => {
        const component = findComponent(doc, temp2)?.component;
        if (!component) {
          return;
        }
        const entityId = component.bindings?.entity?.entityId;
        const flag = component.type === "light-statistics";
        const temp3 = actionPopupData(component.actions?.[actionTrigger]);
        const popupSource =
        type === "more-info" && !entityId && temp3.source === "current" ?
        (doc.customPopups || []).length ?
        "custom" :
        "entity" :
        temp3.source;
        const data =
        type === "more-info" ?
        {
          popupSource: popupSource,
          ...(popupSource === "entity" ?
          {
            entityId: temp3.entityId || le[0]?.entityId || ""
          } :
          {}),
          ...(popupSource === "custom" ?
          {
            popupId:
            temp3.popupId || doc.customPopups?.[0]?.id || ""
          } :
          {})
        } :
        {};
        const flag2 = component.actions?.[actionTrigger]?.type === "more-info";
        const target = component.actions?.[actionTrigger]?.target;
        const chosen =
        component.type === "navigation-button" ?
        component.properties?.targetPage :
        "";
        const pagePaths = new Set(doc.pages.map((arg) => arg.path));
        const target2 = pagePaths.has(target) ?
        target :
        pagePaths.has(chosen) ?
        chosen :
        W.value || doc.pages[0]?.path;
        const type2 =
        type === "none" ||
        componentActionIsSupported(
          component,
          type === "navigate" ?
          {
            type: "navigate",
            target: target2
          } :
          type === "more-info" ?
          {
            type: "more-info",
            data: data
          } :
          {
            type: type
          },
          {
            pagePaths: pagePaths,
            popupIds: new Set(
              (doc.customPopups || []).map((popupIds) => popupIds.id)
            )
          }
        ) ?
        type :
        "none";
        component.actions = {
          ...(component.actions || {})
        };
        if (type2 === "none") {
          if (component.type === "camera" && actionTrigger === "tap") {
            component.actions[actionTrigger] = {
              type: "none"
            };
          } else {
            delete component.actions[actionTrigger];
          }
        } else if (type2 === "navigate") {
          component.actions[actionTrigger] = {
            type: "navigate",
            target: target2
          };
        } else if (type2 === "more-info") {
          component.actions[actionTrigger] = {
            type: "more-info",
            data:
            component.actions?.[actionTrigger]?.type === "more-info" ?
            {
              ...clone(component.actions[actionTrigger].data || {}),
              ...data
            } :
            data
          };
        } else {
          component.actions[actionTrigger] = {
            type: type2
          };
        }
        if (
        !flag &&
        type2 === "more-info" &&
        !flag2 &&
        !component.properties?.relatedEntities &&
        relatedPopupContext(component, Fr(), Dr()))
        {
          component.properties = {
            ...(component.properties || {}),
            relatedEntities: manualRelatedEntityConfig([])
          };
        }
      });
    }
  });
  t.addEventListener("change", (value) => {
    const ancestorEl = value.target.closest(
      "[data-popup-source], [data-popup-entity], [data-popup-custom]"
    );
    const temp = ancestorEl?.closest("[data-action-trigger]");
    if (ancestorEl && temp && componentId) {
      const actionTrigger2 = temp.dataset.actionTrigger;
      L((arg) => {
        const component = findComponent(arg, componentId)?.component;
        if (
        !component ||
        !["tap", "doubleTap", "hold"].includes(actionTrigger2))
        {
          return;
        }
        const popupSource = temp.querySelector("[data-popup-source]").value;
        const data = {
          popupSource: popupSource
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
            data: data
          }
        };
      });
      return;
    }
    const element = value.target.closest("[data-action-target]");
    const temp2 = element?.closest("[data-action-trigger]");
    const temp3 = componentId;
    if (!element || !temp2 || !temp3) {
      return;
    }
    const actionTrigger = temp2.dataset.actionTrigger;
    if (["tap", "doubleTap", "hold"].includes(actionTrigger)) {
      L((doc) => {
        const component = findComponent(doc, temp3)?.component;
        if (
        !!component &&
        !!doc.pages.some((arg) => arg.path === element.value))
        {
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
  t.addEventListener("click", (value) => {
    const ancestorEl = value.target.closest("[data-popup-preview]");
    const temp = ancestorEl?.closest("[data-action-trigger]");
    const temp2 = O();
    if (!ancestorEl || !temp || !temp2 || ancestorEl.disabled) {
      return;
    }
    if (Te !== "edit") {
      onError(new Error("请切换到编辑模式后再预览弹窗。"));
      return;
    }
    const popupSource = temp.querySelector("[data-popup-source]").value;
    const data = {
      popupSource: popupSource
    };
    if (popupSource === "entity") {
      data.entityId = temp.querySelector("[data-popup-entity]").value;
    }
    if (popupSource === "custom") {
      data.popupId = temp.querySelector("[data-popup-custom]").value;
    }
    try {
      jr().previewAction(temp2, {
        type: "more-info",
        data: data
      });
    } catch (error) {
      onError(error);
    }
  });
}
document.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-popup-entity-button]");
  if (ancestorEl) {
    const ancestorEl4 = ancestorEl.closest("[data-action-trigger]");
    const el2 = ancestorEl4?.querySelector("[data-popup-entity-menu]");
    if (!ancestorEl4 || !el2) {
      return;
    }
    const hidden = el2.hidden;
    Wc(hidden ? ancestorEl4 : null);
    el2.hidden = !hidden;
    ancestorEl.setAttribute("aria-expanded", String(hidden));
    if (hidden) {
      const element2 = ancestorEl4.querySelector("[data-popup-entity-search]");
      element2.value = "";
      Rc(ancestorEl4, "");
      Hc(ancestorEl4);
      window.requestAnimationFrame(() =>
      element2.focus({
        preventScroll: true
      })
      );
    }
    return;
  }
  const ancestorEl2 = value.target.closest("[data-popup-action-entity-id]");
  if (!ancestorEl2) {
    return;
  }
  const ancestorEl3 = ancestorEl2.closest("[data-action-trigger]");
  const element = ancestorEl3?.querySelector("[data-popup-entity]");
  if (!!ancestorEl3 && !!element) {
    element.value = ancestorEl2.dataset.popupActionEntityId;
    yp(ancestorEl3);
    Wc();
    element.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );
  }
});
document.addEventListener("input", (value) => {
  const element = value.target.closest("[data-popup-entity-search]");
  const temp = element?.closest("[data-action-trigger]");
  if (!!element && !!temp) {
    Rc(temp, element.value);
    Hc(temp);
  }
});
lh.addEventListener("click", () => {
  const component = O();
  const value = component?.bindings?.entity?.entityId || "";
  if (component?.type === "icon-button" && !!value) {
    try {
      jr().showEntityDetails(component, {
        preview: true
      });
    } catch (error) {
      onError(error);
    }
  }
});
jd.addEventListener("click", () => {
  const component = O();
  const value = component?.bindings?.entity?.entityId || "";
  if (component?.type === "air-conditioner" && !!value) {
    try {
      jr().showEntityDetails(component, {
        preview: true
      });
    } catch (error) {
      onError(error);
    }
  }
});
Km.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-image-layout]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const chosen = ancestorEl.dataset.imageLayout === "fill" ? "fill" : "free";
  const component = O();
  const chosen2 = component?.properties?.layoutMode === "fill" ? "fill" : "free";
  if (!!component && component.type === "image" && chosen2 !== chosen) {
    L((doc) => {
      const component2 = findComponent(doc, temp)?.component;
      if (!component2 || component2.type !== "image") {
        return;
      }
      component2.properties = {
        ...(component2.properties || {}),
        fit: "contain"
      };
      component2.style = {
        ...(component2.style || {})
      };
      if (chosen === "fill") {
        component2.properties.freeLayout = {
          position: clone(component2.position || {}),
          scale: clampNumber(Number(component2.style.scale || 1), 0.01, 5)
        };
        component2.properties.layoutMode = "fill";
        component2.position = {
          ...(component2.position || {}),
          x: 0,
          y: 0,
          width: Number(doc.canvas?.width || 2778),
          height: Number(doc.canvas?.height || 1940),
          rotation: 0
        };
        component2.style.scale = 1;
        return;
      }
      const freeLayout = component2.properties.freeLayout;
      component2.properties.layoutMode = "free";
      if (freeLayout?.position) {
        component2.position = clone(freeLayout.position);
        component2.style.scale = clampNumber(
          Number(freeLayout.scale || 1),
          0.01,
          5
        );
      } else {
        const width = Number(
          component2.properties.naturalWidth ||
          component2.position?.width ||
          100
        );
        const height = Number(
          component2.properties.naturalHeight ||
          component2.position?.height ||
          100
        );
        const numeric = Number(doc.canvas?.width || 2778);
        const numeric2 = Number(doc.canvas?.height || 1940);
        component2.position = {
          ...(component2.position || {}),
          x: (numeric - width) / 2,
          y: (numeric2 - height) / 2,
          width: width,
          height: height,
          rotation: 0
        };
        component2.style.scale = 1;
      }
      delete component2.properties.freeLayout;
    });
  }
});
ia.addEventListener("input", (value) => {
  const temp = O();
  if (!temp || temp.type !== "image") {
    return;
  }
  const target = value.target;
  if (String(target.value).trim() === "") {
    return;
  }
  const numeric = Number(target.value);
  if (!Number.isFinite(numeric)) {
    return;
  }
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(temp.position?.width || 100);
  const numeric5 = Number(temp.position?.height || 100);
  if (target === ca) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentProperties(temp.id, {
      opacity: clamped / 100
    });
  } else if (target === mo) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(temp.id, {
      x: numeric2 * clamped / 100 - numeric4 / 2
    });
  } else if (target === fo) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(temp.id, {
      y: numeric3 * clamped / 100 - numeric5 / 2
    });
  } else if (target === Nn) {
    const clamped = clampNumber(numeric, 1, 500);
    x?.previewComponentTransform(temp.id, {
      scale: clamped / 100
    });
  } else if (target === go) {
    const rotation = clampNumber(numeric, -360, 360);
    x?.previewComponentTransform(temp.id, {
      rotation: rotation
    });
  }
});
ia.addEventListener("change", (value) => {
  const target = value.target;
  const temp = componentId;
  if (!!temp && !![Is, ca, mo, fo, Nn, go].includes(target)) {
    if (
    [ca, mo, fo, Nn, go].includes(target) && (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))))
    {
      Z();
      return;
    }
    L((doc) => {
      const component = findComponent(doc, temp)?.component;
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
      const numeric = Number(doc.canvas.width || 2778);
      const numeric2 = Number(doc.canvas.height || 1940);
      const numeric3 = Number(target.value);
      if (target === Is) {
        component.properties.label = target.value.trim();
      } else if (target === ca) {
        component.properties.opacity = clampNumber(numeric3, 0, 100) / 100;
      } else if (target === mo) {
        component.position.x =
        numeric * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.width || 100) / 2;
      } else if (target === fo) {
        component.position.y =
        numeric2 * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.height || 100) / 2;
      } else if (target === Nn) {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (target === go) {
        Gt(doc, temp, clampNumber(numeric3, -360, 360));
      }
    });
  }
});
const Ip = new Set([ua, pa, ma, fa, ga, ha]);
Rl.addEventListener("input", (value) => {
  const temp = O();
  const target = value.target;
  if (!temp || temp.type !== "floorplan-auto-diagram" || !Ip.has(target)) {
    return;
  }
  const numeric = Number(target.value);
  if (!Number.isFinite(numeric)) {
    return;
  }
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(temp.position?.width || 100);
  const numeric5 = Number(temp.position?.height || 100);
  if (target === ua) {
    x?.previewComponentTransform(temp.id, {
      x: numeric2 * clampNumber(numeric, 0, 100) / 100 - numeric4 / 2
    });
  } else if (target === pa) {
    x?.previewComponentTransform(temp.id, {
      y: numeric3 * clampNumber(numeric, 0, 100) / 100 - numeric5 / 2
    });
  } else if (target === ma) {
    x?.previewComponentTransform(temp.id, {
      width: numeric2 * clampNumber(numeric, 0.1, 100) / 100
    });
  } else if (target === fa) {
    x?.previewComponentTransform(temp.id, {
      height: numeric3 * clampNumber(numeric, 0.1, 100) / 100
    });
  } else if (target === ga) {
    x?.previewComponentTransform(temp.id, {
      scale: clampNumber(numeric, 1, 500) / 100
    });
  } else if (target === ha) {
    x?.previewComponentTransform(temp.id, {
      rotation: clampNumber(numeric, -360, 360)
    });
  }
});
Rl.addEventListener("change", (value) => {
  const target = value.target;
  const temp = componentId;
  if (!!temp && !![Hl, da, ...Ip].includes(target)) {
    if (Ip.has(target) && !Number.isFinite(Number(target.value))) {
      Z();
      return;
    }
    L((doc) => {
      const component = findComponent(doc, temp)?.component;
      if (!!component && component.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {})
        };
        component.position = {
          ...(component.position || {})
        };
        component.style = {
          ...(component.style || {})
        };
        if (target === Hl) {
          component.properties.label = target.value.trim();
        } else if (target === da) {
          component.properties.exportFolder = target.value.trim();
        } else {
          const numeric = Number(doc.canvas.width || 2778);
          const numeric2 = Number(doc.canvas.height || 1940);
          const numeric3 = Number(target.value);
          if (target === ua) {
            component.position.x =
            numeric * clampNumber(numeric3, 0, 100) / 100 -
            Number(component.position.width || 100) / 2;
          } else if (target === pa) {
            component.position.y =
            numeric2 * clampNumber(numeric3, 0, 100) / 100 -
            Number(component.position.height || 100) / 2;
          } else if (target === ma) {
            component.position.width =
            numeric * clampNumber(numeric3, 0.1, 100) / 100;
          } else if (target === fa) {
            component.position.height =
            numeric2 * clampNumber(numeric3, 0.1, 100) / 100;
          } else if (target === ga) {
            component.style.scale = clampNumber(numeric3, 1, 500) / 100;
          } else if (target === ha) {
            Gt(doc, temp, clampNumber(numeric3, -360, 360));
          }
        }
      }
    });
  }
});
Jm.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-floorplan-layout]");
  const temp = componentId;
  if (!!ancestorEl && !!temp) {
    L((arg) => {
      const component = findComponent(arg, temp)?.component;
      if (component?.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {}),
          layoutMode:
          ancestorEl.dataset.floorplanLayout === "fill" ? "fill" : "free"
        };
      }
    });
  }
});
function Yr(componentId, command, value = null) {
  const element = document.querySelector(
    '.hb-component[data-component-id="' +
    CSS.escape(componentId) +
    '"] .hb-floorplan-auto-diagram-preview'
  );
  if (element?.contentWindow) {
    element.contentWindow.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-camera",
        componentId: componentId,
        command: command,
        value: value
      },
      window.location.origin
    );
    return true;
  } else {
    return false;
  }
}
function _E(componentId, value) {
  const element = document.querySelector(
    '.hb-component[data-component-id="' +
    CSS.escape(componentId) +
    '"] .hb-floorplan-auto-diagram-preview'
  );
  if (element?.contentWindow) {
    element.contentWindow.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-floor",
        componentId: componentId,
        command: "set-floor",
        value: value
      },
      window.location.origin
    );
    return true;
  } else {
    return false;
  }
}
function YE(element) {
  if (!element?.isConnected) {
    return;
  }
  const value = element.closest(".hb-floorplan-auto-diagram");
  if (!value) {
    return;
  }
  element.classList.remove("is-ready");
  let hbFloorplanAutoDiagramLoading = value.querySelector(
    ".hb-floorplan-auto-diagram-loading"
  );
  if (!hbFloorplanAutoDiagramLoading) {
    hbFloorplanAutoDiagramLoading = document.createElement("div");
    hbFloorplanAutoDiagramLoading.className =
    "hb-floorplan-auto-diagram-loading";
    hbFloorplanAutoDiagramLoading.innerHTML =
    '<i aria-hidden="true"></i><strong>正在重新载入3D户型…</strong>';
    value.append(hbFloorplanAutoDiagramLoading);
  }
  const temp = new URL(element.src, window.location.origin);
  temp.searchParams.set("auto-diagram-refresh", String(Date.now()));
  element.src = temp.toString();
}
window.addEventListener("pageshow", (value) => {
  if (value.persisted) {
    for (const temp of document.querySelectorAll(
      ".hb-floorplan-auto-diagram-preview"
    )) {
      YE(temp);
    }
  }
});
Zm.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-floorplan-camera-view]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const cameraView =
  ancestorEl.dataset.floorplanCameraView === "top" ? "top" : "free";
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      component.properties = {
        ...(component.properties || {}),
        cameraView: cameraView
      };
    }
  });
  Yr(temp, "set-view", cameraView);
});
Zt.addEventListener("change", () => {
  const value = componentId;
  const floorSelection = String(Zt.value || "");
  const component = O();
  if (
  !!value &&
  !!floorSelection &&
  component?.type === "floorplan-auto-diagram")
  {
    L((arg) => {
      const component2 = findComponent(arg, value)?.component;
      if (component2?.type === "floorplan-auto-diagram") {
        component2.properties = {
          ...(component2.properties || {}),
          floorSelection: floorSelection
        };
      }
    });
    _E(value, floorSelection);
    Yr(value, "restore", {
      view: component.properties?.cameraView || "free",
      mode: component.properties?.cameraMode || "orthographic",
      topRotation: Number(component.properties?.cameraTopRotation || 0),
      focalLength: Number(component.properties?.cameraFocalLength || 50)
    });
  }
});
Qm.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-floorplan-camera-mode]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const cameraMode =
  ancestorEl.dataset.floorplanCameraMode === "perspective" ?
  "perspective" :
  "orthographic";
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      component.properties = {
        ...(component.properties || {}),
        cameraMode: cameraMode
      };
    }
  });
  Yr(temp, "set-mode", cameraMode);
});
ba.addEventListener("change", () => {
  const value = componentId;
  if (!value || String(ba.value).trim() === "") {
    return Z();
  }
  const cameraFocalLength = clampNumber(Number(ba.value), 18, 120);
  L((arg) => {
    const component = findComponent(arg, value)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      component.properties = {
        ...(component.properties || {}),
        cameraFocalLength: cameraFocalLength
      };
    }
  });
  Yr(value, "set-focal-length", cameraFocalLength);
});
ef.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (component?.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {}),
          cameraView: "top",
          cameraTopRotation:
          (Number(component.properties?.cameraTopRotation || 0) + 90) % 360
        };
      }
    });
    Yr(value, "rotate-top");
  }
});
function Tp(value = va) {
  if (value) {
    return document.querySelector(
      '.hb-component[data-component-id="' +
      CSS.escape(value) +
      '"] .hb-floorplan-auto-diagram-preview'
    );
  } else {
    return null;
  }
}
function Xr(command, lighting = null) {
  const value = Tp();
  if (value?.contentWindow) {
    value.contentWindow.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-base-lighting",
        componentId: va,
        command: command,
        ...(lighting ?
        {
          lighting: lighting
        } :
        {})
      },
      window.location.origin
    );
    return true;
  } else {
    return false;
  }
}
function Ap(value) {
  const baseLighting = normalizeBaseLighting(value);
  for (const element of jl) {
    const temp = baseLighting[element.dataset.floorplanBaseLight];
    element.value =
    element.step === "5" ?
    String(Math.round(temp)) :
    String(Number(temp.toFixed(2)));
  }
  return baseLighting;
}
function dw() {
  const value = {};
  for (const element of jl) {
    value[element.dataset.floorplanBaseLight] = Number(element.value);
  }
  return normalizeBaseLighting(value);
}
function XE({ cancelPreview: value = true } = {}) {
  if (!$e.hidden) {
    if (value) {
      Xr("cancel");
    }
    $e.hidden = true;
    $e.setAttribute("aria-busy", "false");
    va = "";
    Nt = null;
  }
}
function KE(value) {
  const element = Tp(value);
  if (!value || !element?.contentWindow) {
    return;
  }
  va = value;
  element.classList.remove("is-position-mode");
  element.classList.add("is-view-mode");
  L((arg) => {
    const component = findComponent(arg, value)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      component.properties = {
        ...(component.properties || {}),
        interactionMode: "view"
      };
    }
  });
  Ap(ql);
  ri.textContent = "正在读取当前光照设置…";
  $e.hidden = false;
  $e.setAttribute("aria-busy", "true");
  const rect = $e.getBoundingClientRect();
  if (
  rect.right > window.innerWidth - 8 ||
  rect.bottom > window.innerHeight - 8 ||
  rect.left < 8 ||
  rect.top < 8)
  {
    $e.style.right = "auto";
    $e.style.left =
    clampNumber(
      rect.left,
      8,
      Math.max(8, window.innerWidth - rect.width - 8)
    ) + "px";
    $e.style.top =
    clampNumber(
      rect.top,
      8,
      Math.max(8, window.innerHeight - rect.height - 8)
    ) + "px";
  }
  Xr("request-state");
}
tf.addEventListener("click", () => {
  KE(componentId);
});
for (const t of jl) {
  t.addEventListener("input", () => {
    if (!$e.hidden) {
      ri.textContent = "修改已实时预览，保存后同步到全部3D入口。";
      Xr("preview", dw());
    }
  });
}
S1.addEventListener("click", () => {
  Ap(DEFAULT_BASE_LIGHTING);
  ri.textContent = "已预览默认光照，点击保存后生效。";
  Xr("reset");
});
x1.addEventListener("click", () => {
  ri.textContent = "正在保存并同步…";
  $e.setAttribute("aria-busy", "true");
  Xr("save", dw());
});
C1.addEventListener("click", () => XE());
ya.addEventListener("pointerdown", (value) => {
  if (value.button !== 0 || value.target.closest("button")) {
    return;
  }
  const rect = $e.getBoundingClientRect();
  Nt = {
    pointerId: value.pointerId,
    startX: value.clientX,
    startY: value.clientY,
    startLeft: rect.left,
    startTop: rect.top
  };
  try {
    ya.setPointerCapture(value.pointerId);
  } catch {}
});
ya.addEventListener("pointermove", (event) => {
  if (!Nt || event.pointerId !== Nt.pointerId) {
    return;
  }
  event.preventDefault();
  const value = $e.getBoundingClientRect();
  const count = Math.max(8, window.innerWidth - value.width - 8);
  const count2 = Math.max(8, window.innerHeight - value.height - 8);
  $e.style.right = "auto";
  $e.style.left =
  clampNumber(Nt.startLeft + event.clientX - Nt.startX, 8, count) + "px";
  $e.style.top =
  clampNumber(Nt.startTop + event.clientY - Nt.startY, 8, count2) + "px";
});
const uw = (value) => {
  if (!!Nt && value.pointerId === Nt.pointerId) {
    Nt = null;
  }
};
ya.addEventListener("pointerup", uw);
ya.addEventListener("pointercancel", uw);
function pw() {
  if (mt.open) {
    mt.close();
  }
  mt.dataset.componentId = "";
  mt.dataset.cancelRemovesComponent = "false";
  of.hidden = false;
}
function mw(value, { cancelRemovesComponent: arg = false } = {}) {
  if (value) {
    mt.dataset.componentId = value;
    mt.dataset.cancelRemovesComponent = String(arg);
    of.hidden = false;
    if (!mt.open) {
      mt.showModal();
    }
  }
}
function Pp() {
  const componentId = mt.dataset.componentId;
  const value = mt.dataset.cancelRemovesComponent === "true";
  pw();
  if (!!value && !!componentId) {
    selectedComponentIds.delete(componentId);
    if (componentId === componentId) {
      componentId = selectedComponentIds.values().next().value || null;
    }
    if (we === componentId) {
      we = componentId;
    }
    L((arg) => {
      kc(arg, componentId);
    });
  }
}
xt.addEventListener("click", () => {
  const component = O();
  if (component?.type !== "floorplan-auto-diagram") {
    return;
  }
  if (
  component.properties?.generated === true &&
  component.properties?.previewing !== true)
  {
    L((arg) => {
      const component2 = findComponent(arg, component.id)?.component;
      if (component2?.type === "floorplan-auto-diagram") {
        component2.properties = {
          ...(component2.properties || {}),
          previewReady: true,
          previewing: true,
          interactionMode: "position"
        };
      }
    });
    return;
  }
  const element = document.querySelector(
    '.hb-component[data-component-id="' +
    CSS.escape(component.id) +
    '"] .hb-floorplan-auto-diagram-preview'
  );
  if (!element?.contentWindow) {
    mw(component.id);
    return;
  }
  const folderName = String(component.properties?.exportFolder || "").trim();
  if (
  !folderName ||
  /[<>:"/\\|?*\x00-\x1f\x7f]/.test(folderName) ||
  folderName.startsWith(".") ||
  /[. ]$/.test(folderName))
  {
    ai.textContent = "请先填写有效的导图文件夹名称。";
    da.focus();
    return;
  }
  const value = component.position || {};
  const flag = h.document.canvas || {};
  ai.textContent = "正在后台生成底图和灯组效果，请稍候…";
  xt.disabled = true;
  Zt.disabled = true;
  xt.textContent = "正在后台生成…";
  element.contentWindow.postMessage(
    {
      type: "ha-bridge-floorplan-auto-diagram-generate",
      componentId: component.id,
      width: Math.max(
        320,
        Math.round(Number(flag.width || value.width || 2778))
      ),
      height: Math.max(
        320,
        Math.round(Number(flag.height || value.height || 1940))
      ),
      folderName: folderName
    },
    window.location.origin
  );
});
la.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (component?.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {}),
          interactionMode:
          component.properties?.interactionMode === "view" ?
          "position" :
          "view"
        };
      }
    });
  }
});
E1.addEventListener("click", Pp);
L1.addEventListener("click", Pp);
mt.addEventListener("cancel", (event) => {
  event.preventDefault();
  Pp();
});
I1.addEventListener("click", () => {
  const componentId = mt.dataset.componentId;
  if (componentId) {
    L((value) => {
      const component = findComponent(value, componentId)?.component;
      if (component?.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {}),
          previewReady: true,
          previewing: true,
          interactionMode: "position"
        };
      }
    });
    pw();
  }
});
nf.addEventListener("change", (value) => {
  const element = value.target.closest("[data-floorplan-light-group-id]");
  const temp = componentId;
  if (!element || !temp) {
    return;
  }
  const floorplanLightGroupId = element.dataset.floorplanLightGroupId;
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (!component || component.type !== "floorplan-auto-diagram") {
      return;
    }
    component.bindings = {
      ...(component.bindings || {})
    };
    const number = "lightGroup:" + floorplanLightGroupId;
    if (element.value) {
      component.bindings[number] = {
        entityId: element.value
      };
    } else {
      delete component.bindings[number];
    }
  });
});
window.addEventListener("message", (value) => {
  if (value.origin !== window.location.origin) {
    return;
  }
  const data = value.data;
  if (data?.type === "ha-bridge-floorplan-auto-diagram-base-lighting-state") {
    const text2 = String(data.componentId || "");
    const temp = Tp(text2);
    if (!temp || value.source !== temp.contentWindow || text2 !== va) {
      return;
    }
    if (data.status === "ready" || data.status === "saved") {
      ql = normalizeBaseLighting(data.savedLighting || data.lighting);
      Ap(data.lighting || ql);
    }
    $e.setAttribute("aria-busy", "false");
    if (data.status === "saved") {
      ri.textContent = "已保存，并同步到实时预览、手动导图和自动导图。";
    } else if (data.status === "ready") {
      ri.textContent = "修改会实时同步到当前3D预览。";
    }
    return;
  }
  if (data?.type === "ha-bridge-floorplan-auto-diagram-ready") {
    const componentId = String(data.componentId || "");
    const element2 = document.querySelector(
      '.hb-component[data-component-id="' +
      CSS.escape(componentId) +
      '"] .hb-floorplan-auto-diagram-preview'
    );
    if (!element2 || value.source !== element2.contentWindow) {
      return;
    }
    element2.classList.add("is-ready");
    element2.parentElement?.
    querySelector(".hb-floorplan-auto-diagram-loading")?.
    remove();
    const component = findComponent(h?.document, componentId)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      const floors = (Array.isArray(data.floors) ? data.floors : []).
      map((arg) => ({
        id: String(arg?.id || ""),
        name: String(arg?.name || "")
      })).
      filter((component2) => component2.id);
      const selected = String(data.floorSelection || "");
      $u.set(componentId, {
        floors: floors,
        selected: selected
      });
      const flag = component.properties || {};
      if (
      Object.prototype.hasOwnProperty.call(flag, "floorSelection") &&
      selected &&
      flag.floorSelection !== selected)
      {
        L((arg) => {
          const component2 = findComponent(arg, componentId)?.component;
          if (component2?.type === "floorplan-auto-diagram") {
            component2.properties = {
              ...(component2.properties || {}),
              floorSelection: selected
            };
          }
        });
      }
      Z();
      element2.contentWindow.postMessage(
        {
          type: "ha-bridge-floorplan-auto-diagram-camera",
          componentId: componentId,
          command: "restore",
          value: {
            view: component.properties?.cameraView || "free",
            mode: component.properties?.cameraMode || "orthographic",
            topRotation: Number(component.properties?.cameraTopRotation || 0),
            focalLength: Number(component.properties?.cameraFocalLength || 50)
          }
        },
        window.location.origin
      );
    }
    return;
  }
  if (data?.type === "ha-bridge-floorplan-auto-diagram-floor-state") {
    const text2 = String(data.componentId || "");
    const element2 = document.querySelector(
      '.hb-component[data-component-id="' +
      CSS.escape(text2) +
      '"] .hb-floorplan-auto-diagram-preview'
    );
    if (!element2 || value.source !== element2.contentWindow) {
      return;
    }
    const floors = (Array.isArray(data.floors) ? data.floors : []).
    map((arg) => ({
      id: String(arg?.id || ""),
      name: String(arg?.name || "")
    })).
    filter((component2) => component2.id);
    const selected = String(data.floorSelection || "");
    $u.set(text2, {
      floors: floors,
      selected: selected
    });
    const component = findComponent(h?.document, text2)?.component;
    if (
    component?.type === "floorplan-auto-diagram" &&
    selected &&
    component.properties?.floorSelection !== selected)
    {
      L((arg) => {
        const component2 = findComponent(arg, text2)?.component;
        if (component2?.type === "floorplan-auto-diagram") {
          component2.properties = {
            ...(component2.properties || {}),
            floorSelection: selected
          };
        }
      });
    }
    if (text2 === componentId) {
      Z();
    }
    return;
  }
  if (data?.type === "ha-bridge-floorplan-auto-diagram-stopped") {
    const text2 = String(data.componentId || "");
    const element2 = document.querySelector(
      '.hb-component[data-component-id="' +
      CSS.escape(text2) +
      '"] .hb-floorplan-auto-diagram-preview'
    );
    if (!element2 || value.source !== element2.contentWindow) {
      return;
    }
    xt.disabled = false;
    if (text2 === componentId) {
      Zt.disabled = false;
    }
    xt.textContent = "确定位置大小并后台生成";
    ai.textContent = data.message || "已停止本次生成。";
    if (data.reason === "rename") {
      da.focus();
    }
    return;
  }
  if (data?.type === "ha-bridge-floorplan-auto-diagram-error") {
    const text2 = String(data.componentId || "");
    const element2 = document.querySelector(
      '.hb-component[data-component-id="' +
      CSS.escape(text2) +
      '"] .hb-floorplan-auto-diagram-preview'
    );
    if (!element2 || value.source !== element2.contentWindow) {
      return;
    }
    xt.disabled = false;
    if (text2 === componentId) {
      Zt.disabled = false;
    }
    xt.textContent = "确定位置大小并后台生成";
    ai.textContent = data.message || "后台生成失败，请重试。";
    return;
  }
  if (!data || data.type !== "ha-bridge-floorplan-auto-diagram-export") {
    return;
  }
  const text = String(data.componentId || "");
  const element = document.querySelector(
    '.hb-component[data-component-id="' +
    CSS.escape(text) +
    '"] .hb-floorplan-auto-diagram-preview'
  );
  if (!element || value.source !== element.contentWindow) {
    return;
  }
  const manifest = data.manifest;
  const autoDiagramFolder = String(
    data.folderName || manifest?.exportName || ""
  ).trim();
  if (!text || !manifest || !autoDiagramFolder) {
    return;
  }
  xt.disabled = false;
  xt.textContent = "确定位置大小并后台生成";
  ai.textContent = "已生成，正在置换到仪表盘…";
  const ancestorEl = element.closest(".hb-component");
  if (ancestorEl) {
    ancestorEl.hidden = true;
  }
  L((doc) => {
    let temp = findComponentLocation(doc, text);
    const component = temp?.component;
    if (
    !component ||
    component.type !== "floorplan-auto-diagram" ||
    !temp.page)
    {
      return null;
    }
    const page = temp.page;
    const list = [];
    const callback = (arg) => {
      for (const component2 of arg || []) {
        if (component2?.properties?.autoDiagramFolder === autoDiagramFolder) {
          list.push(component2);
        }
        callback(component2?.children);
      }
    };
    callback(page.components);
    const idByKey = new Map(
      list.
      filter((component2) => component2.type === "image").
      map((component2) => [
      component2.properties?.autoDiagramRole === "base" ?
      "background-with-plan" :
      String(component2.properties?.autoDiagramRole || ""),
      component2]
      )
    );
    const idByKey2 = new Map(
      list.
      filter((component2) => component2.type === "icon-button-effect").
      map((component2) => {
        const text2 = String(
          component2.properties?.autoDiagramRole || "light-group"
        );
        const text3 = String(
          component2.properties?.autoDiagramLayerId ||
          component2.properties?.autoDiagramGroupId ||
          ""
        );
        return [text2 + ":" + text3, component2];
      })
    );
    for (const temp2 of list) {
      kc(doc, temp2.id);
    }
    temp = findComponentLocation(doc, text);
    if (!temp) {
      return null;
    }
    const numeric = Number(doc.canvas?.width || 2778);
    const numeric2 = Number(doc.canvas?.height || 1940);
    const naturalWidth = Math.max(
      1,
      Number(manifest.resolution?.width || component.position?.width || 1)
    );
    const naturalHeight = Math.max(
      1,
      Number(manifest.resolution?.height || component.position?.height || 1)
    );
    const layoutMode =
    component.properties?.layoutMode === "fill" ? "fill" : "free";
    const flag = component.position || {};
    const chosen =
    layoutMode === "fill" ?
    1 :
    Math.max(0.01, Math.min(5, Number(component.style?.scale || 1)));
    const chosen2 =
    layoutMode === "fill" ? numeric : Number(flag.width || 100);
    const chosen3 =
    layoutMode === "fill" ? numeric2 : Number(flag.height || 100);
    const width = chosen2 * chosen;
    const height = chosen3 * chosen;
    const chosen4 =
    layoutMode === "fill" ? 0 : Number(flag.x || 0) - (width - chosen2) / 2;
    const chosen5 =
    layoutMode === "fill" ?
    0 :
    Number(flag.y || 0) - (height - chosen3) / 2;
    const rotation = layoutMode === "fill" ? 0 : Number(flag.rotation || 0);
    const mapped = [
    {
      role: "background",
      file: manifest.backgroundImage,
      label: "00底图",
      visible: true
    },
    {
      role: "floor-plan",
      file: manifest.floorPlanImage,
      label: "00户型图",
      visible: true
    },
    {
      role: "background-with-plan",
      file: manifest.baseImage,
      label: "00底图带户型",
      visible: false
    }].

    filter((arg) => arg.file).
    map((arg) => {
      const temp2 = idByKey.get(arg.role);
      const component2 = temp2 ?
      clone(temp2) :
      createComponentFromTemplate("image", {
        id: newId("component"),
        instanceName: arg.label,
        canvas: doc.canvas
      });
      component2.position = {
        ...(component2.position || {}),
        x: chosen4,
        y: chosen5,
        width: width,
        height: height,
        rotation: rotation
      };
      component2.style = {
        ...(component2.style || {}),
        scale: 1,
        visible: temp2 ? temp2.style?.visible !== false : arg.visible
      };
      component2.bindings = {};
      component2.actions = {};
      component2.properties = {
        ...(component2.properties || {}),
        instanceName: arg.label,
        label: arg.label,
        assetId: "studio3d:" + autoDiagramFolder + "/" + arg.file,
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        opacity: 1,
        fit: "contain",
        layoutMode: layoutMode,
        autoDiagramFolder: autoDiagramFolder,
        autoDiagramRole: arg.role,
        autoDiagramCamera: manifest.camera || null
      };
      return component2;
    });
    const found = mapped.find(
      (component2) => component2.properties?.autoDiagramRole === "background"
    );
    const found2 = mapped.find(
      (component2) => component2.properties?.autoDiagramRole === "floor-plan"
    );
    const found3 = mapped.find(
      (component2) =>
      component2.properties?.autoDiagramRole === "background-with-plan"
    );
    const flag2 = found3 || found2 || found;
    const mapped2 = (Array.isArray(manifest.groups) ? manifest.groups : []).
    filter(
      (arg) =>
      String(arg?.id || arg?.groupId || "") && arg?.file
    ).
    map((component2) => ({
      role: "light-group",
      id: String(component2.id || component2.groupId || ""),
      name: String(component2.name || component2.note || "灯组"),
      note: String(component2.note || component2.name || "灯组"),
      file: component2.file,
      icon: "mdi:lightbulb-outline",
      anchor: component2.anchor
    }));
    const mapped3 = (Array.isArray(manifest.screens) ? manifest.screens : []).
    filter(
      (arg) =>
      String(arg?.id || arg?.itemId || "") && arg?.file
    ).
    map((component2) => ({
      role: "television",
      id: String(component2.id || component2.itemId || ""),
      name: String(component2.name || "电视画面"),
      note: String(component2.name || "电视画面"),
      file: component2.file,
      icon: "mdi:television",
      anchor: component2.anchor
    }));
    const mapped4 = (Array.isArray(manifest.vehicles) ? manifest.vehicles : []).
    filter(
      (arg) =>
      String(arg?.id || arg?.itemId || "") && arg?.file
    ).
    map((component2) => ({
      role: "vehicle",
      id: String(component2.id || component2.itemId || ""),
      name: String(component2.name || "汽车充电"),
      note: String(component2.name || "汽车充电"),
      file: component2.file,
      icon: "mdi:car-electric",
      anchor: component2.anchor
    }));
    const list2 = [...mapped3, ...mapped4, ...mapped2];
    const number = chosen4 + width / 2;
    const number2 = chosen5 + height / 2;
    const number3 = rotation * Math.PI / 180;
    const minValue = Math.min(width / naturalWidth, height / naturalHeight);
    const number4 = naturalWidth * minValue;
    const number5 = naturalHeight * minValue;
    const list3 = [];
    const callback2 = (arg, arg2, arg3, arg4) => {
      const numeric3 = Number(arg.anchor?.x);
      const numeric4 = Number(arg.anchor?.y);
      const options = {
        x: list2.length > 1 ? (arg2 + 1) / (list2.length + 1) : 0.5,
        y: 0.9
      };
      const chosen6 =
      Number.isFinite(numeric3) && Number.isFinite(numeric4) ?
      {
        x: numeric3,
        y: numeric4
      } :
      options;
      const spacingX = Math.max(0.035, arg3 / Math.max(number4, 1) * 1.08);
      const spacingY = Math.max(0.045, arg4 / Math.max(number5, 1) * 1.08);
      const list4 = [[0, 0]];
      for (let temp3 = 1; temp3 <= 4; temp3 += 1) {
        list4.push(
          [0, -spacingY * temp3],
          [spacingX * temp3, 0],
          [0, spacingY * temp3],
          [-spacingX * temp3, 0],
          [spacingX * temp3, -spacingY * temp3],
          [spacingX * temp3, spacingY * temp3],
          [-spacingX * temp3, spacingY * temp3],
          [-spacingX * temp3, -spacingY * temp3]
        );
      }
      let temp2 = null;
      for (const [temp3, temp4] of list4) {
        const options2 = {
          x: clampNumber(chosen6.x + temp3, spacingX / 2, 1 - spacingX / 2),
          y: clampNumber(chosen6.y + temp4, spacingY / 2, 1 - spacingY / 2)
        };
        if (
        !list3.some(
          (arg5) =>
          Math.abs(options2.x - arg5.x) <
          (spacingX + arg5.spacingX) / 2 &&
          Math.abs(options2.y - arg5.y) <
          (spacingY + arg5.spacingY) / 2
        ))
        {
          temp2 = options2;
          break;
        }
      }
      temp2 ||= {
        x: clampNumber(options.x, spacingX / 2, 1 - spacingX / 2),
        y: clampNumber(options.y, spacingY / 2, 1 - spacingY / 2)
      };
      list3.push({
        ...temp2,
        spacingX: spacingX,
        spacingY: spacingY
      });
      return temp2;
    };
    const mapped5 = list2.map((component4, arg2) => {
      const component2 = idByKey2.get(component4.role + ":" + component4.id);
      const component3 = component2 ?
      clone(component2) :
      createComponentFromTemplate("icon-button-effect", {
        id: newId("component"),
        instanceName: component4.name,
        canvas: doc.canvas
      });
      const autoDiagramSceneAnchor =
      component2?.properties?.autoDiagramSceneAnchor;
      const flag3 =
      !autoDiagramSceneAnchor ||
      Math.abs(Number(autoDiagramSceneAnchor.x) - Number(component4.anchor?.x)) >
      0.002 ||
      Math.abs(Number(autoDiagramSceneAnchor.y) - Number(component4.anchor?.y)) >
      0.002;
      const flag4 =
      !!component2 &&
      Number(component2.properties?.autoDiagramLayoutVersion || 0) < hm;
      const flag5 =
      !component2 || flag4 || component4.role === "light-group" && flag3;
      let autoDiagramButtonAnchor =
      component2?.properties?.autoDiagramButtonAnchor || null;
      if (flag5) {
        const numeric3 = Number(component3.position?.width || numeric * 0.075);
        const numeric4 = Number(component3.position?.height || numeric3);
        const count = Math.max(
          0.01,
          Math.min(5, Number(component3.style?.scale || 1))
        );
        autoDiagramButtonAnchor = callback2(
          component4,
          arg2,
          numeric3 * count,
          numeric4 * count
        );
        const number6 = -number4 / 2 + autoDiagramButtonAnchor.x * number4;
        const number7 = -number5 / 2 + autoDiagramButtonAnchor.y * number5;
        const number8 =
        number6 * Math.cos(number3) - number7 * Math.sin(number3);
        const number9 =
        number6 * Math.sin(number3) + number7 * Math.cos(number3);
        component3.position = {
          ...(component3.position || {}),
          x: number + number8 - numeric3 / 2,
          y: number2 + number9 - numeric4 / 2,
          rotation: rotation
        };
      } else if (
      Number.isFinite(Number(autoDiagramButtonAnchor?.x)) &&
      Number.isFinite(Number(autoDiagramButtonAnchor?.y)))
      {
        const numeric3 = Number(component3.position?.width || numeric * 0.075);
        const numeric4 = Number(component3.position?.height || numeric3);
        const count = Math.max(
          0.01,
          Math.min(5, Number(component3.style?.scale || 1))
        );
        list3.push({
          x: Number(autoDiagramButtonAnchor.x),
          y: Number(autoDiagramButtonAnchor.y),
          spacingX: Math.max(
            0.035,
            numeric3 * count / Math.max(number4, 1) * 1.08
          ),
          spacingY: Math.max(
            0.045,
            numeric4 * count / Math.max(number5, 1) * 1.08
          )
        });
      }
      component3.style = {
        ...(component3.style || {}),
        visible: true
      };
      component3.bindings = {
        ...(component3.bindings || {})
      };
      if (!component2 && component4.role === "light-group") {
        const temp2 = component.bindings?.["lightGroup:" + component4.id];
        if (temp2?.entityId) {
          component3.bindings.entity = {
            entityId: temp2.entityId
          };
        }
      }
      component3.actions = Object.keys(component3.actions || {}).length ?
      {
        ...(component3.actions || {})
      } :
      {
        tap: {
          type: "toggle"
        }
      };
      component3.properties = {
        ...(component3.properties || {}),
        instanceName: component4.name,
        label: component4.name,
        note: component4.note,
        icon: component2?.properties?.icon || component4.icon,
        effectAssetId: "studio3d:" + autoDiagramFolder + "/" + component4.file,
        effectNaturalWidth: naturalWidth,
        effectNaturalHeight: naturalHeight,
        effectReferenceImageId: flag2?.id || "",
        effectLayoutMode: layoutMode,
        effectLeft: number / numeric * 100,
        effectTop: number2 / numeric2 * 100,
        effectScale: 1,
        effectRotation: rotation,
        autoDiagramFolder: autoDiagramFolder,
        autoDiagramRole: component4.role,
        autoDiagramLayerId: component4.id,
        autoDiagramSceneAnchor: component4.anchor || null,
        autoDiagramButtonAnchor: autoDiagramButtonAnchor,
        autoDiagramLayoutVersion: hm,
        ...(component4.role === "light-group" ?
        {
          autoDiagramGroupId: component4.id
        } :
        {})
      };
      return component3;
    });
    const filtered = [found2, found, found3].filter(Boolean);
    const index = temp.index;
    kc(doc, text);
    temp.collection.splice(index, 0, ...mapped5, ...filtered);
    applyCollectionLayerOrder(temp.collection);
    return {
      removed: true,
      selectedId: (found || found2 || found3 || mapped5[0])?.id || null
    };
  }).
  then((arg) => {
    if (!arg?.removed) {
      if (ancestorEl?.isConnected) {
        ancestorEl.hidden = false;
      }
      return;
    }
    const selectedId = arg.selectedId;
    componentId = selectedId;
    selectedComponentIds = selectedId ? new Set([selectedId]) : new Set();
    we = selectedId;
    x?.setSelectedComponents(selectedId ? [selectedId] : [], selectedId);
    _e();
    Z();
  }).
  catch(onError);
});
const fw = new Map([
[
Ul,
{
  property: "effectColorTemperatureRealtime",
  type: "boolean"
}],

[
_l,
{
  property: "effectBrightnessRealtime",
  type: "boolean"
}],

[
Xl,
{
  property: "iconOffColor"
}],

[
Kl,
{
  property: "iconOnColor"
}],

[
lf,
{
  property: "iconSize",
  min: 1,
  max: 100
}],

[
Jl,
{
  property: "buttonOffColor"
}],

[
Zl,
{
  property: "buttonOnColor"
}],

[
df,
{
  property: "buttonOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
uf,
{
  property: "frameColor"
}],

[
pf,
{
  property: "frameWidth",
  min: 0,
  max: 20
}],

[
mf,
{
  property: "frameOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
ff,
{
  property: "radius",
  min: 0,
  max: 50
}],

[
gf,
{
  property: "glowColor"
}],

[
Ql,
{
  property: "glowOffStrength",
  min: 0,
  max: 300,
  divisor: 100
}],

[
ed,
{
  property: "glowOnStrength",
  min: 0,
  max: 300,
  divisor: 100
}],

[
bf,
{
  property: "effectOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
yf,
{
  property: "effectFadeDuration",
  min: 0,
  max: 3
}],

[
td,
{
  property: "effectLeft",
  min: -100,
  max: 200
}],

[
nd,
{
  property: "effectTop",
  min: -100,
  max: 200
}],

[
od,
{
  property: "effectScale",
  min: 1,
  max: 500,
  divisor: 100
}],

[
id,
{
  property: "effectRotation",
  min: -360,
  max: 360
}]]

);
const JE = new Map([
[Xl, "off"],
[Jl, "off"],
[Ql, "off"],
[Kl, "on"],
[Zl, "on"],
[ed, "on"]]
);
const gw = new Set([Na, Ea, ci, li, bo, di]);
function hw(value) {
  const temp = JE.get(value);
  const temp2 = O();
  if (!!temp && temp2?.type === "icon-button-effect") {
    un.set(temp2.id, temp);
    x?.setComponentPreviewState(temp2.id, temp);
    for (const element of Yl.querySelectorAll("[data-ibe-preview]")) {
      const flag = element.dataset.ibePreview === temp;
      element.classList.toggle("active", flag);
      element.setAttribute("aria-pressed", String(flag));
    }
  }
}
for (const t of ["focusin", "pointerdown"]) {
  si.addEventListener(t, (value) => hw(value.target));
}
si.addEventListener("input", (value) => {
  const temp = O();
  if (!temp || temp.type !== "icon-button-effect") {
    return;
  }
  hw(value.target);
  const temp2 = fw.get(value.target);
  if (temp2) {
    let chosen =
    temp2.type === "boolean" ?
    value.target.checked :
    value.target.type === "color" ?
    value.target.value :
    Number(value.target.value);
    if (temp2.type !== "boolean" && value.target.type !== "color") {
      if (!Number.isFinite(chosen)) {
        return;
      }
      chosen =
      clampNumber(chosen, temp2.min, temp2.max) / (temp2.divisor || 1);
    }
    x?.previewComponentProperties(temp.id, {
      [temp2.property]: chosen
    });
    return;
  }
  if (!gw.has(value.target) || !Number.isFinite(Number(value.target.value))) {
    return;
  }
  const numeric = Number(value.target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(temp.position?.width || 100);
  const numeric5 = Number(temp.position?.height || 100);
  if (value.target === Na) {
    x?.previewComponentTransform(temp.id, {
      x: numeric2 * clampNumber(numeric, 0, 100) / 100 - numeric4 / 2
    });
  } else if (value.target === Ea) {
    x?.previewComponentTransform(temp.id, {
      y: numeric3 * clampNumber(numeric, 0, 100) / 100 - numeric5 / 2
    });
  } else if (value.target === ci) {
    x?.previewComponentTransform(temp.id, {
      width: numeric2 * clampNumber(numeric, 0.1, 100) / 100
    });
  } else if (value.target === li) {
    x?.previewComponentTransform(temp.id, {
      height: numeric3 * clampNumber(numeric, 0.1, 100) / 100
    });
  } else if (value.target === bo) {
    x?.previewComponentTransform(temp.id, {
      scale: clampNumber(numeric, 1, 500) / 100
    });
  } else if (value.target === di) {
    x?.previewComponentTransform(temp.id, {
      rotation: clampNumber(numeric, -360, 360)
    });
  }
});
si.addEventListener("change", (value) => {
  const target = value.target;
  const temp = fw.get(target);
  if (!temp && !gw.has(target)) {
    return;
  }
  if (target.type === "number" && !Number.isFinite(Number(target.value))) {
    Z();
    return;
  }
  const temp2 = componentId;
  L((doc) => {
    const component = findComponent(doc, temp2)?.component;
    if (!component || component.type !== "icon-button-effect") {
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
      component.properties[temp.property] =
      temp.type === "boolean" ?
      target.checked :
      target.type === "color" ?
      target.value :
      clampNumber(Number(target.value), temp.min, temp.max) / (
      temp.divisor || 1);
      return;
    }
    const numeric = Number(doc.canvas.width || 2778);
    const numeric2 = Number(doc.canvas.height || 1940);
    const numeric3 = Number(target.value);
    if (target === Na) {
      component.position.x =
      numeric * clampNumber(numeric3, 0, 100) / 100 -
      Number(component.position.width || 100) / 2;
    } else if (target === Ea) {
      component.position.y =
      numeric2 * clampNumber(numeric3, 0, 100) / 100 -
      Number(component.position.height || 100) / 2;
    } else if (target === ci) {
      component.position.width =
      numeric * clampNumber(numeric3, 0.1, 100) / 100;
    } else if (target === li) {
      component.position.height =
      numeric2 * clampNumber(numeric3, 0.1, 100) / 100;
    } else if (target === bo) {
      component.style.scale = clampNumber(numeric3, 1, 500) / 100;
    } else if (target === di) {
      Gt(doc, temp2, clampNumber(numeric3, -360, 360));
    }
  });
});
vf.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-ibe-layout]");
  const temp = componentId;
  if (!!ancestorEl && !!temp) {
    L((arg) => {
      const component = findComponent(arg, temp)?.component;
      if (!!component && component.type === "icon-button-effect") {
        component.properties = {
          ...(component.properties || {}),
          effectLayoutMode:
          ancestorEl.dataset.ibeLayout === "fill" ? "fill" : "free"
        };
      }
    });
  }
});
function ZE(value) {
  const list = [];
  const callback = (arg) => {
    for (const temp of arg || []) {
      if (temp.type === "image") {
        list.push(temp);
      }
      callback(temp.children);
    }
  };
  callback(value?.components);
  return list;
}
function QE(component, value) {
  const temp = document.createElement("label");
  temp.className = "effect-image-align-option";
  const element = document.createElement("input");
  element.type = "radio";
  element.name = "effect-image-align-target";
  element.value = component.id;
  element.checked = value;
  const element2 = document.createElement("span");
  element2.className = "effect-image-align-option-preview";
  const temp2 = Ut(component.properties?.assetId || "");
  const temp3 = up(temp2);
  if (temp3) {
    const temp9 = document.createElement("img");
    temp9.src = temp3;
    temp9.alt = "";
    element2.append(temp9);
  } else {
    element2.textContent = "无预览";
  }
  const temp4 = document.createElement("span");
  temp4.className = "effect-image-align-option-copy";
  const element3 = document.createElement("strong");
  element3.textContent = componentLabel(component);
  const element4 = document.createElement("small");
  const flag = component.properties?.layoutMode === "fill";
  const chosen = component.style?.visible === false ? "隐藏" : "显示";
  const numeric = Number(h?.document?.canvas?.width || 2778);
  const numeric2 = Number(h?.document?.canvas?.height || 1940);
  const flag2 = component.position || {};
  const numeric3 = Number(flag2.width || 100);
  const numeric4 = Number(flag2.height || 100);
  const temp5 = roundField(
    (Number(flag2.x || 0) + numeric3 / 2) / numeric * 100
  );
  const temp6 = roundField(
    (Number(flag2.y || 0) + numeric4 / 2) / numeric2 * 100
  );
  const temp7 = roundField(Number(component.style?.scale || 1) * 100);
  const temp8 = roundField(Number(flag2.rotation || 0));
  element4.textContent = flag ?
  "铺满 · 覆盖整个画布" :
  "自由 · 左 " + temp5 + "% · 上 " + temp6 + "%";
  const element5 = document.createElement("small");
  element5.textContent = flag ?
  chosen :
  "缩放 " + temp7 + "% · 旋转 " + temp8 + "° · " + chosen;
  temp4.append(element3, element4, element5);
  temp.append(element, element2, temp4);
  return temp;
}
function eL() {
  const component = O();
  const value = Je();
  if (!component || component.type !== "icon-button-effect" || !value) {
    return;
  }
  const temp = ZE(value);
  const text = String(component.properties?.effectReferenceImageId || "");
  Cf.replaceChildren(
    ...temp.map((component2, arg2) =>
    QE(component2, component2.id === text || !text && arg2 === 0)
    )
  );
  Au = component.id;
  As.hidden = temp.length > 0;
  As.textContent = temp.length ? "" : "本页面没有可以对齐的普通图片。";
  wf.disabled = temp.length === 0;
  In.showModal();
}
$1.addEventListener("click", eL);
D1.addEventListener("click", () => In.close());
z1.addEventListener("click", () => In.close());
In.addEventListener("click", (value) => {
  if (value.target === In) {
    In.close();
  }
});
In.addEventListener("close", () => {
  Au = null;
});
wf.addEventListener("click", () => {
  const value = Cf.querySelector(
    'input[name="effect-image-align-target"]:checked'
  )?.value;
  const temp = Au;
  if (!temp || !value) {
    As.textContent = "请选择一张本页面图片。";
    As.hidden = false;
    return;
  }
  In.close();
  L((doc) => {
    const component = findComponent(doc, temp)?.component;
    const flag =
    doc.pages?.find((arg) => arg.path === W.value) ||
    doc.pages?.[0];
    const component2 = findComponentInItems(flag?.components, value);
    if (
    !component ||
    component.type !== "icon-button-effect" ||
    !component2 ||
    component2.type !== "image")
    {
      return;
    }
    const numeric = Number(doc.canvas?.width || 2778);
    const numeric2 = Number(doc.canvas?.height || 1940);
    const flag2 = component2.position || {};
    const numeric3 = Number(flag2.width || 100);
    const numeric4 = Number(flag2.height || 100);
    const flag3 = component2.properties?.layoutMode === "fill";
    component.properties = {
      ...(component.properties || {}),
      effectReferenceImageId: component2.id,
      effectLayoutMode: flag3 ? "fill" : "free",
      ...(flag3 ?
      {} :
      {
        effectLeft:
        (Number(flag2.x || 0) + numeric3 / 2) / numeric * 100,
        effectTop:
        (Number(flag2.y || 0) + numeric4 / 2) / numeric2 * 100,
        effectScale: clampNumber(
          Number(component2.style?.scale || 1),
          0.01,
          5
        ),
        effectRotation: Number(flag2.rotation || 0)
      })
    };
  });
});
Yl.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-ibe-preview]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const chosen = ["on", "off"].includes(ancestorEl.dataset.ibePreview) ?
  ancestorEl.dataset.ibePreview :
  "auto";
  un.set(temp, chosen);
  x?.setComponentPreviewState(temp, chosen);
  Z();
});
rf.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-ibe-layer]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const chosen = ancestorEl.dataset.ibeLayer === "effect" ? "effect" : "button";
  const chosen2 = chosen === "effect" ? "on" : "off";
  qv.set(temp, chosen);
  un.set(temp, chosen2);
  x?.setComponentPreviewState(temp, chosen2);
  x?.setComponentSelectionLayer(temp, chosen);
  closeOtherPickerPanels();
  Z();
});
sf.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (!!component && component.type === "icon-button-effect") {
        component.properties = {
          ...(component.properties || {}),
          buttonVisible: component.properties?.buttonVisible === false
        };
      }
    });
  }
});
cf.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (!!component && component.type === "icon-button-effect") {
        component.properties = {
          ...(component.properties || {}),
          effectVisible: component.properties?.effectVisible === false
        };
      }
    });
  }
});
const tL = new Map([
[
Lf,
{
  property: "mainColor"
}],

[
If,
{
  property: "secondaryColor"
}],

[
Tf,
{
  property: "mainSize",
  min: 8,
  max: 200
}],

[
Af,
{
  property: "secondarySize",
  min: 6,
  max: 100
}],

[
Pf,
{
  property: "mainWeight",
  min: 0,
  max: 1
}],

[
kf,
{
  property: "secondaryWeight",
  min: 0,
  max: 1
}],

[
Mf,
{
  property: "mainSpacing",
  min: -20,
  max: 100
}],

[
Of,
{
  property: "secondarySpacing",
  min: -20,
  max: 100
}],

[
Bf,
{
  property: "secondaryLineGap",
  min: 0,
  max: 100
}],

[
$f,
{
  property: "mainTextLeft",
  min: -100,
  max: 200
}],

[
Ff,
{
  property: "mainTextTop",
  min: -100,
  max: 200
}],

[
Df,
{
  property: "secondaryTextLeft",
  min: -100,
  max: 200
}],

[
zf,
{
  property: "secondaryTextTop",
  min: -100,
  max: 200
}],

[
Wf,
{
  property: "iconColor"
}],

[
Rf,
{
  property: "iconSize",
  min: 1,
  max: 100
}],

[
Hf,
{
  property: "iconLeft",
  min: -100,
  max: 200
}],

[
jf,
{
  property: "iconTop",
  min: -100,
  max: 200
}],

[
qf,
{
  property: "frameColor"
}],

[
Uf,
{
  property: "frameWidth",
  min: 0,
  max: 12
}],

[
_f,
{
  property: "frameSize",
  min: 10,
  max: 300
}],

[
Yf,
{
  property: "frameSpacing",
  min: 0,
  max: 300
}],

[
Xf,
{
  property: "frameOffsetX",
  min: -100,
  max: 100
}],

[
Kf,
{
  property: "frameOffsetY",
  min: -100,
  max: 100
}],

[
Zf,
{
  property: "markerColor"
}],

[
Qf,
{
  property: "markerSize",
  min: 2,
  max: 60
}],

[
eg,
{
  property: "markerLeft",
  min: -100,
  max: 200
}],

[
tg,
{
  property: "markerTop",
  min: -100,
  max: 200
}]]

);
const nL = new Map([
[rd, "left"],
[sd, "top"],
[$s, "width"],
[Fs, "height"],
[Aa, "scale"],
[Ds, "rotation"]]
);
const oL = new Map([
[
sg,
{
  property: "iconColor"
}],

[
cg,
{
  property: "iconActiveColor"
}],

[
lg,
{
  property: "iconSize",
  min: 8,
  max: 100
}],

[
ug,
{
  property: "titleColor"
}],

[
pg,
{
  property: "titleSize",
  min: 8,
  max: 100
}],

[
mg,
{
  property: "titleWeight",
  min: 0,
  max: 1
}],

[
fg,
{
  property: "titleSpacing",
  min: -20,
  max: 100
}],

[
hg,
{
  property: "countColor"
}],

[
bg,
{
  property: "countActiveColor"
}],

[
yg,
{
  property: "countSize",
  min: 8,
  max: 140
}],

[
vg,
{
  property: "countWeight",
  min: 0,
  max: 1
}],

[
wg,
{
  property: "countSpacing",
  min: -20,
  max: 100
}],

[
Cg,
{
  property: "iconGap",
  min: 0,
  max: 40
}],

[
Sg,
{
  property: "countGap",
  min: 0,
  max: 40
}]]

);
const iL = new Map([
[ud, "left"],
[pd, "top"],
[Ws, "width"],
[Rs, "height"],
[$a, "scale"],
[Hs, "rotation"]]
);
const aL = new Map([
[
uh,
{
  property: "haloScaleX",
  min: 20,
  max: 300,
  divisor: 100
}],

[
ph,
{
  property: "haloScaleY",
  min: 20,
  max: 300,
  divisor: 100
}],

[
mh,
{
  property: "haloRotation",
  min: -360,
  max: 360
}],

[
fh,
{
  property: "haloOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
hh,
{
  property: "personScale",
  min: 20,
  max: 300,
  divisor: 100
}],

[
bh,
{
  property: "personRotation",
  min: -360,
  max: 360
}],

[
yh,
{
  property: "personOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
vh,
{
  property: "orbitDuration",
  min: 2,
  max: 60
}],

[
fi,
{
  property: "iconColor"
}],

[
bd,
{
  property: (property) =>
  property.type !== "presence-sensor" ?
  "iconOnColor" :
  property.properties?.sensorKind === "water-leak" ?
  "waterLeakColor" :
  property.properties?.sensorKind === "smoke" ?
  "smokeColor" :
  property.properties?.sensorKind === "natural-gas" ?
  "naturalGasColor" :
  "iconOnColor"
}],

[
Pg,
{
  property: "badgeColor"
}],

[
kg,
{
  property: "badgeOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
Og,
{
  property: "symbolSize",
  min: 1,
  max: 100
}],

[
Bg,
{
  property: "badgeSize",
  min: 1,
  max: 100
}],

[
Mg,
{
  property: "iconSize",
  min: 1,
  max: 100
}],

[
yd,
{
  property: "iconOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
vd,
{
  property: "iconOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
wd,
{
  property: "iconLeft",
  min: -100,
  max: 200
}],

[
Cd,
{
  property: "iconTop",
  min: -100,
  max: 200
}],

[
Fg,
{
  property: "mainColor"
}],

[
Dg,
{
  property: "secondaryColor"
}],

[
Ld,
{
  property: "mainOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
Id,
{
  property: "mainOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
Td,
{
  property: "secondaryOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
Ad,
{
  property: "secondaryOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
zg,
{
  property: "mainSize",
  min: 6,
  max: 120
}],

[
Vg,
{
  property: "secondarySize",
  min: 5,
  max: 80
}],

[
Wg,
{
  property: "mainWeight",
  min: 0,
  max: 1
}],

[
Rg,
{
  property: "secondaryWeight",
  min: 0,
  max: 1
}],

[
Hg,
{
  property: "mainSpacing",
  min: -20,
  max: 100
}],

[
jg,
{
  property: "secondarySpacing",
  min: -20,
  max: 100
}],

[
qg,
{
  property: "mainTextLeft",
  min: -100,
  max: 200
}],

[
Gg,
{
  property: "mainTextTop",
  min: -100,
  max: 200
}],

[
Ug,
{
  property: "secondaryTextLeft",
  min: -100,
  max: 200
}],

[
_g,
{
  property: "secondaryTextTop",
  min: -100,
  max: 200
}],

[
kd,
{
  property: "onFillColor"
}],

[
Md,
{
  property: "onFillStrength",
  min: 0,
  max: 100,
  divisor: 100
}],

[
Yg,
{
  property: "onFillFadeDuration",
  min: 0,
  max: 3
}],

[
Kg,
{
  property: "frameWidth",
  min: 0,
  max: 12
}],

[
Jg,
{
  property: "frameAngle",
  min: 0,
  max: 360
}],

[
Od,
{
  property: "frameOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
Bd,
{
  property: "frameOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
Zg,
{
  property: "cutCorner",
  min: 0,
  max: 50
}],

[
eh,
{
  property: "softLightColor"
}],

[
th,
{
  property: "softLightStrength",
  min: 0,
  max: 500,
  divisor: 100
}],

[
nh,
{
  property: "softLightSize",
  min: 0,
  max: 300,
  divisor: 100
}],

[
oh,
{
  property: "softLightAngle",
  min: 0,
  max: 360
}],

[
ah,
{
  property: "glowColor"
}],

[
rh,
{
  property: "glowStrength",
  min: 0,
  max: 500,
  divisor: 100
}],

[
sh,
{
  property: "glowSize",
  min: 0,
  max: 300,
  divisor: 100
}],

[
ch,
{
  property: "glowAngle",
  min: 0,
  max: 360
}]]

);
const rL = new Map([
[$d, "left"],
[Fd, "top"],
[Gs, "width"],
[Us, "height"],
[Wa, "scale"],
[_s, "rotation"]]
);
const bw = new Map([
[
Lh,
{
  property: "iconOffColor"
}],

[
Ih,
{
  property: "iconOnColor"
}],

[
Th,
{
  property: "badgeColor"
}],

[
Ah,
{
  property: "badgeOpacity",
  min: 0,
  max: 100,
  divisor: 100
}],

[
Ph,
{
  property: "symbolSize",
  min: 1,
  max: 100
}],

[
kh,
{
  property: "badgeSize",
  min: 1,
  max: 100
}],

[
Mh,
{
  property: "iconLeft",
  min: -100,
  max: 200
}],

[
Oh,
{
  property: "iconTop",
  min: -100,
  max: 200
}],

[
Fh,
{
  property: "mainColor"
}],

[
Dh,
{
  property: "mainSize",
  min: 6,
  max: 120
}],

[
zh,
{
  property: "mainWeight",
  min: 0,
  max: 1
}],

[
Vh,
{
  property: "mainSpacing",
  min: -20,
  max: 100
}],

[
Wh,
{
  property: "mainTextLeft",
  min: -100,
  max: 200
}],

[
Rh,
{
  property: "mainTextTop",
  min: -100,
  max: 200
}],

[
qh,
{
  property: "secondaryColor"
}],

[
Gh,
{
  property: "secondarySize",
  min: 5,
  max: 80
}],

[
Uh,
{
  property: "secondaryWeight",
  min: 0,
  max: 1
}],

[
_h,
{
  property: "secondarySpacing",
  min: -20,
  max: 100
}],

[
Yh,
{
  property: "secondaryTextLeft",
  min: -100,
  max: 200
}],

[
Xh,
{
  property: "secondaryTextTop",
  min: -100,
  max: 200
}],

[
Zh,
{
  property: "airflowCoolColor"
}],

[
Qh,
{
  property: "airflowHeatColor"
}],

[
eb,
{
  property: "airflowOtherColor"
}],

[
tb,
{
  property: "airflowAngle",
  min: -360,
  max: 360
}],

[
nb,
{
  property: "airflowCurve",
  min: -200,
  max: 200
}],

[
ob,
{
  property: "airflowLength",
  min: 10,
  max: 300
}],

[
ib,
{
  property: "airflowFadePosition",
  min: 15,
  max: 100
}],

[
ab,
{
  property: "airflowSpread",
  min: 10,
  max: 300
}],

[
rb,
{
  property: "airflowDensity",
  min: 20,
  max: 200
}],

[
sb,
{
  property: "airflowIrregularity",
  min: 0,
  max: 200
}],

[
cb,
{
  property: "airflowThickness",
  min: 5,
  max: 300
}],

[
lb,
{
  property: "airflowStrength",
  min: 0,
  max: 500
}],

[
db,
{
  property: "airflowBlur",
  min: 0,
  max: 30
}],

[
zd,
{
  property: "airflowSpeed",
  min: 0.3,
  max: 12
}],

[
Ra,
{
  property: "airflowOffsetX",
  limits: (limits, limits2) => {
    const limits3 = airflowCanvasOffsetBounds(limits, limits2.canvas);
    return {
      min: limits3.minX,
      max: limits3.maxX
    };
  }
}],

[
Ha,
{
  property: "airflowOffsetY",
  limits: (limits, limits2) => {
    const limits3 = airflowCanvasOffsetBounds(limits, limits2.canvas);
    return {
      min: limits3.minY,
      max: limits3.maxY
    };
  }
}],

[
ub,
{
  property: "airflowWidth",
  min: 1,
  max: 500
}],

[
pb,
{
  property: "airflowHeight",
  min: 1,
  max: 500
}],

[
Vd,
{
  property: "airflowScale",
  min: 1,
  max: 500,
  divisor: 100
}],

[
Wd,
{
  property: "airflowRotation",
  min: -360,
  max: 360
}]]

);
const sL = new Map([
[Rd, "left"],
[Hd, "top"],
[Zs, "width"],
[Qs, "height"],
[ja, "scale"],
[ec, "rotation"]]
);
const cL = new Map([
[
wb,
{
  property: "frameColor"
}],

[
Cb,
{
  property: "frameWidth",
  min: 0,
  max: 20
}],

[
Sb,
{
  property: "radius",
  min: 0,
  max: 50,
  divisor: 100
}],

[
xb,
{
  property: "frameAngle",
  min: 0,
  max: 360
}],

[
Nb,
{
  property: "frameOpacity",
  min: 0,
  max: 100,
  divisor: 100
}]]

);
const lL = new Map([
[
fb,
{
  property: "opacity",
  min: 0,
  max: 100,
  divisor: 100
}]]

);
const dL = new Map([
[Ud, "left"],
[_d, "top"],
[qa, "scale"],
[oc, "rotation"]]
);
const uL = new Map([
[Xd, "left"],
[Kd, "top"],
[rc, "width"],
[sc, "height"],
[Ua, "scale"],
[cc, "rotation"]]
);
function Hi(value, arg2, arg3, arg4) {
  const list = Array.isArray(arg2) ? arg2 : [arg2];
  value.addEventListener("input", (event2) => {
    const temp = O();
    if (!temp || !list.includes(temp.type)) {
      return;
    }
    const temp2 = arg3.get(event2.target);
    if (temp2) {
      const chosen =
      typeof temp2.property == "function" ?
      temp2.property(temp) :
      temp2.property;
      let chosen2 =
      event2.target.type === "color" ?
      event2.target.value :
      Number(event2.target.value);
      if (event2.target.type !== "color") {
        if (!Number.isFinite(chosen2)) {
          return;
        }
        const flag = temp2.limits?.(temp, h.document) || temp2;
        chosen2 =
        clampNumber(chosen2, flag.min, flag.max) / (
        temp2.divisor || 1);
      }
      x?.previewComponentProperties(temp.id, {
        [chosen]: chosen2
      });
      return;
    }
    const temp3 = arg4.get(event2.target);
    const numeric = Number(event2.target.value);
    if (!temp3 || !Number.isFinite(numeric)) {
      return;
    }
    const numeric2 = Number(h.document.canvas.width || 2778);
    const numeric3 = Number(h.document.canvas.height || 1940);
    const numeric4 = Number(temp.position?.width || 100);
    const numeric5 = Number(temp.position?.height || 100);
    if (temp3 === "left") {
      x?.previewComponentTransform(temp.id, {
        x: numeric2 * clampNumber(numeric, 0, 100) / 100 - numeric4 / 2
      });
    } else if (temp3 === "top") {
      x?.previewComponentTransform(temp.id, {
        y: numeric3 * clampNumber(numeric, 0, 100) / 100 - numeric5 / 2
      });
    } else if (temp3 === "width") {
      x?.previewComponentTransform(temp.id, {
        width: numeric2 * clampNumber(numeric, 0.1, 100) / 100
      });
    } else if (temp3 === "height") {
      x?.previewComponentTransform(temp.id, {
        height: numeric3 * clampNumber(numeric, 0.1, 100) / 100
      });
    } else if (temp3 === "scale") {
      x?.previewComponentTransform(temp.id, {
        scale: clampNumber(numeric, 1, 500) / 100
      });
    } else if (temp3 === "rotation" && d0().length < 2) {
      x?.previewComponentTransform(temp.id, {
        rotation: clampNumber(numeric, -360, 360)
      });
    }
  });
  value.addEventListener("change", (event2) => {
    const temp = arg3.get(event2.target);
    const temp2 = arg4.get(event2.target);
    if (!temp && !temp2) {
      return;
    }
    if (
    event2.target.type === "number" &&
    !Number.isFinite(Number(event2.target.value)))
    {
      Z();
      return;
    }
    const temp3 = componentId;
    const chosen = temp2 === "rotation" ? d0() : [];
    L((doc) => {
      const component = findComponent(doc, temp3)?.component;
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
        const chosen2 =
        typeof temp.property == "function" ?
        temp.property(component) :
        temp.property;
        const flag = temp.limits?.(component, doc) || temp;
        component.properties[chosen2] =
        event2.target.type === "color" ?
        event2.target.value :
        clampNumber(
          Number(event2.target.value),
          flag.min,
          flag.max
        ) / (temp.divisor || 1);
        return;
      }
      const numeric = Number(doc.canvas.width || 2778);
      const numeric2 = Number(doc.canvas.height || 1940);
      const numeric3 = Number(event2.target.value);
      if (temp2 === "left") {
        component.position.x =
        numeric * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.width || 100) / 2;
      } else if (temp2 === "top") {
        component.position.y =
        numeric2 * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.height || 100) / 2;
      } else if (temp2 === "width") {
        component.position.width =
        numeric * clampNumber(numeric3, 0.1, 100) / 100;
      } else if (temp2 === "height") {
        component.position.height =
        numeric2 * clampNumber(numeric3, 0.1, 100) / 100;
      } else if (temp2 === "scale") {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (temp2 === "rotation") {
        Gt(doc, temp3, clampNumber(numeric3, -360, 360), chosen);
      }
    });
  });
}
Hi(ks, "title-button", tL, nL);
Hi(cd, "light-statistics", oL, iL);
Hi(ui, ["icon-button", "device-button", "presence-sensor"], aL, rL);
Hi(Ks, "air-conditioner", bw, sL);
Hi(tc, "vacuum-map", lL, dL);
Hi(ic, "camera", cL, uL);
qs.addEventListener("change", () => {
  const value = componentId;
  if (value) {
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (!component || component.type !== "device-button") {
        return;
      }
      const statePrecision = ["0", "1", "2", "3", "4"].includes(qs.value) ?
      Number(qs.value) :
      "auto";
      component.properties = {
        ...(component.properties || {}),
        statePrecision: statePrecision
      };
    });
  }
});
Fa.addEventListener("change", () => {
  const value = componentId;
  if (value) {
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (!component || component.type !== "presence-sensor") {
        return;
      }
      const sensorKind = [
      "presence",
      "door-window",
      "water-leak",
      "smoke",
      "natural-gas"].
      includes(Fa.value) ?
      Fa.value :
      "presence";
      component.properties = {
        ...(component.properties || {}),
        sensorKind: sensorKind
      };
      if (sensorKind !== "door-window") {
        Ec.delete(value);
        x?.setComponentSelectionLayer(value, "button");
      }
    });
  }
});
Tn.addEventListener("click", () => {
  const component = O();
  if (
  !!component &&
  component.type === "presence-sensor" &&
  component.properties?.sensorKind === "door-window")
  {
    Ec.add(component.id);
    Tn.classList.add("active");
    Tn.setAttribute("aria-pressed", "true");
    Xs.disabled = false;
    x?.setComponentSelectionLayer(component.id, "perspective");
  }
});
Xs.addEventListener("click", () => {
  const component = O();
  if (
  !!component &&
  component.type === "presence-sensor" &&
  component.properties?.sensorKind === "door-window")
  {
    Ec.delete(component.id);
    Tn.classList.remove("active");
    Tn.setAttribute("aria-pressed", "false");
    Xs.disabled = true;
    x?.setComponentSelectionLayer(component.id, "button");
  }
});
Nx.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (
      !!component &&
      component.type === "presence-sensor" &&
      component.properties?.sensorKind === "door-window")
      {
        component.properties = {
          ...(component.properties || {}),
          perspectiveCorners: [...Bu]
        };
      }
    });
  }
});
hb.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-camera-fit]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const fit = ancestorEl.dataset.cameraFit === "contain" ? "contain" : "fill";
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (!!component && component.type === "camera") {
      component.properties = {
        ...(component.properties || {}),
        fit: fit
      };
    }
  });
});
bb.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-camera-display-mode]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const displayMode =
  ancestorEl.dataset.cameraDisplayMode === "snapshot" ? "snapshot" : "live";
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (!!component && component.type === "camera") {
      component.properties = {
        ...(component.properties || {}),
        displayMode: displayMode
      };
    }
  });
});
Ga.addEventListener("change", () => {
  const value = componentId;
  if (!value) {
    return;
  }
  const numeric = Number(Ga.value);
  const refreshInterval = Number.isFinite(numeric) ?
  Math.max(6, Math.round(numeric)) :
  10;
  Ga.value = String(refreshInterval);
  L((arg) => {
    const component = findComponent(arg, value)?.component;
    if (!!component && component.type === "camera") {
      component.properties = {
        ...(component.properties || {}),
        refreshInterval: refreshInterval
      };
    }
  });
});
yb.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (!!component && component.type === "camera") {
        component.properties = {
          ...(component.properties || {}),
          mediaVisible: component.properties?.mediaVisible === false
        };
      }
    });
  }
});
vb.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (!!component && component.type === "camera") {
        component.properties = {
          ...(component.properties || {}),
          frameVisible: component.properties?.frameVisible === false
        };
      }
    });
  }
});
function Kr(value, arg2 = "auto") {
  if (!value) {
    return;
  }
  const chosen = ["on", "off"].includes(arg2) ? arg2 : "auto";
  Mo.set(value, chosen);
  x?.setComponentPreviewState(value, chosen);
}
Sh.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-air-conditioner-preview]");
  if (!!ancestorEl && !!componentId) {
    Kr(componentId, ancestorEl.dataset.airConditionerPreview);
    Z();
  }
});
Ch.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-air-conditioner-device-type]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const deviceType = ["air-conditioner", "bath-heater"].includes(
    ancestorEl.dataset.airConditionerDeviceType
  ) ?
  ancestorEl.dataset.airConditionerDeviceType :
  "auto";
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (!!component && component.type === "air-conditioner") {
      component.properties = {
        ...(component.properties || {}),
        deviceType: deviceType
      };
    }
  });
});
xh.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-air-conditioner-layer]");
  if (!ancestorEl || !componentId) {
    return;
  }
  const chosen =
  ancestorEl.dataset.airConditionerLayer === "airflow" ? "airflow" : "button";
  Fu.set(componentId, chosen);
  Kr(componentId, chosen === "airflow" ? "on" : "off");
  x?.setComponentSelectionLayer(componentId, chosen);
  closeOtherPickerPanels();
  Z();
});
Kh.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    Kr(value, "on");
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (!!component && component.type === "air-conditioner") {
        component.properties = {
          ...(component.properties || {}),
          airflowVisible: component.properties?.airflowVisible === false
        };
      }
    });
  }
});
for (const [t, e] of [
[Eh, "iconVisible"],
[Bh, "mainTextVisible"],
[Hh, "secondaryTextVisible"]])
{
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L((arg) => {
        const component = findComponent(arg, value)?.component;
        if (!!component && component.type === "air-conditioner") {
          component.properties = {
            ...(component.properties || {}),
            [e]: component.properties?.[e] === false
          };
        }
      });
    }
  });
}
Jh.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-airflow-motion]");
  const temp = componentId;
  if (!!ancestorEl && !!temp) {
    Kr(temp, "on");
    L((arg) => {
      const component = findComponent(arg, temp)?.component;
      if (!!component && component.type === "air-conditioner") {
        component.properties = {
          ...(component.properties || {}),
          airflowMotion:
          ancestorEl.dataset.airflowMotion === "static" ? "static" : "dynamic"
        };
      }
    });
  }
});
for (const t of ["focusin", "pointerdown", "input"]) {
  Nh.addEventListener(t, (value) => {
    if (bw.has(value.target) && O()?.type === "air-conditioner") {
      Kr(componentId, "on");
    }
  });
}
const Zc = new Map([
[yd, "off"],
[Ld, "off"],
[Td, "off"],
[Od, "off"],
[Pd, "on"],
[vd, "on"],
[Id, "on"],
[Ad, "on"],
[kd, "on"],
[Md, "on"],
[Bd, "on"],
[bd, "on"]]
);
function pL(value) {
  for (const element of js.querySelectorAll("[data-icon-button-preview]")) {
    const flag = element.dataset.iconButtonPreview === value;
    element.classList.toggle("active", flag);
    element.setAttribute("aria-pressed", String(flag));
  }
}
function kp(value, arg2 = "auto") {
  if (!value) {
    return;
  }
  const chosen = ["on", "off"].includes(arg2) ? arg2 : "auto";
  if (chosen === "auto") {
    zn.delete(value);
  } else {
    zn.set(value, chosen);
  }
  x?.setComponentPreviewState(value, chosen);
  if (value === componentId) {
    pL(chosen);
  }
}
function yw(value) {
  const temp = O();
  const flag =
  Zc.get(value) || (
  temp?.type === "device-button" && value === fi ? "off" : null);
  if (
  !!flag &&
  !!["icon-button", "device-button", "presence-sensor"].includes(temp?.type))
  {
    kp(temp.id, flag);
  }
}
function vw(value) {
  const temp = O();
  if (!!Zc.has(value) || temp?.type === "device-button" && value === fi) {
    if (
    ["icon-button", "device-button", "presence-sensor"].includes(temp?.type))
    {
      kp(temp.id, "auto");
    }
  }
}
for (const t of ["focusin", "pointerdown", "input"]) {
  ui.addEventListener(t, (value) => yw(value.target));
}
Eg.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-cover-kind]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const coverKind = ["standard", "dream", "airer"].includes(
    ancestorEl.dataset.coverKind
  ) ?
  ancestorEl.dataset.coverKind :
  "auto";
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (
    component &&
    String(component.bindings?.entity?.entityId || "").startsWith("cover."))
    {
      component.properties = {
        ...(component.properties || {}),
        coverKind: coverKind
      };
    }
  });
});
Lg.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-cover-direction]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const coverDirection = ["left", "right"].includes(
    ancestorEl.dataset.coverDirection
  ) ?
  ancestorEl.dataset.coverDirection :
  "split";
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (
    component &&
    String(component.bindings?.entity?.entityId || "").startsWith("cover."))
    {
      component.properties = {
        ...(component.properties || {}),
        coverDirection: coverDirection
      };
    }
  });
});
Ig.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-cover-motor-direction]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const coverMotorDirection = ["normal", "reversed"].includes(
    ancestorEl.dataset.coverMotorDirection
  ) ?
  ancestorEl.dataset.coverMotorDirection :
  "auto";
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (
    component &&
    String(component.bindings?.entity?.entityId || "").startsWith("cover."))
    {
      component.properties = {
        ...(component.properties || {}),
        coverMotorDirection: coverMotorDirection
      };
    }
  });
});
ui.addEventListener("focusout", (value) => {
  const temp = O();
  if (
  (!!Zc.has(value.target) ||
  temp?.type === "device-button" && value.target === fi) && (
  !(value.relatedTarget instanceof Node) ||
  !js.contains(value.relatedTarget)))
  {
    window.requestAnimationFrame(() => {
      if (me === value.target && !pt.hidden) {
        return;
      }
      if (
      Zc.get(document.activeElement) || (
      O()?.type === "device-button" && document.activeElement === fi ?
      "off" :
      null))
      {
        yw(document.activeElement);
      } else {
        vw(value.target);
      }
    });
  }
});
for (const [t, e] of [
[xf, "mainTextVisible"],
[Nf, "secondaryTextVisible"],
[Vf, "iconVisible"],
[Gf, "frameVisible"],
[Jf, "markerVisible"]])
{
  t.addEventListener("click", () => {
    const value = componentId;
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (!!component && component.type === "title-button") {
        component.properties = {
          ...(component.properties || {}),
          [e]: component.properties?.[e] === false
        };
      }
    });
  });
}
for (const [t, e] of [
[rg, "iconVisible"],
[dg, "titleVisible"],
[gg, "countVisible"]])
{
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L((arg) => {
        const component = findComponent(arg, value)?.component;
        if (!!component && component.type === "light-statistics") {
          component.properties = {
            ...(component.properties || {}),
            [e]: component.properties?.[e] === false
          };
        }
      });
    }
  });
}
for (const [t, e] of [
[hd, "iconVisible"],
[Nd, "mainTextVisible"],
[Ed, "secondaryTextVisible"],
[Pd, "onFillVisible"],
[Xg, "frameVisible"],
[Qg, "softLightVisible"],
[ih, "glowVisible"],
[dh, "haloVisible"],
[gh, "personVisible"]])
{
  t.addEventListener("click", () => {
    const value = componentId;
    L((arg) => {
      const component = findComponent(arg, value)?.component;
      if (
      !!component &&
      !!["icon-button", "device-button", "presence-sensor"].includes(
        component.type
      ) && (
      !e.endsWith("Visible") ||
      !["iconVisible", "mainTextVisible", "secondaryTextVisible"].includes(
        e
      ) ||
      component.type === "device-button") && (
      !["haloVisible", "personVisible"].includes(e) ||
      component.type === "presence-sensor"))
      {
        component.properties = {
          ...(component.properties || {}),
          [e]: component.properties?.[e] === false
        };
      }
    });
  });
}
js.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-icon-button-preview]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const chosen = ["on", "off"].includes(ancestorEl.dataset.iconButtonPreview) ?
  ancestorEl.dataset.iconButtonPreview :
  "auto";
  kp(temp, chosen);
});
const ww = new Map([[Tb, "color"]]);
const Cw = new Map([
[
Ab,
{
  property: "fontSize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}],

[
Pb,
{
  property: "fontWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}],

[
kb,
{
  property: "letterSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}],

[
Mb,
{
  property: "opacity",
  minimum: 0,
  maximum: 100,
  divisor: 100,
  resizes: false
}]]

);
const Mp = new Set([Ya, Xa, yo, gi]);
function mL(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const numeric2 = Number(value.position?.height || 100);
  const number = Number(value.position?.x || 0) + numeric / 2;
  const number2 = Number(value.position?.y || 0) + numeric2 / 2;
  const { width: width, height: height } = timeComponentDimensions(fallback);
  x?.previewComponentTransform(value.id, {
    x: number - width / 2,
    y: number2 - height / 2,
    width: width,
    height: height
  });
}
_a.addEventListener("input", (value) => {
  const component = O();
  if (!component || component.type !== "time") {
    return;
  }
  const target = value.target;
  const temp = ww.get(target);
  if (temp) {
    x?.previewComponentProperties(component.id, {
      [temp]: target.value
    });
    return;
  }
  const temp2 = Cw.get(target);
  if (temp2) {
    if (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value)))
    {
      return;
    }
    const number =
    clampNumber(Number(target.value), temp2.minimum, temp2.maximum) /
    temp2.divisor;
    const options = {
      ...(component.properties || {}),
      [temp2.property]: number
    };
    x?.previewComponentProperties(component.id, {
      [temp2.property]: number
    });
    if (temp2.resizes) {
      mL(component, options);
    }
    return;
  }
  if (
  !Mp.has(target) ||
  String(target.value).trim() === "" ||
  !Number.isFinite(Number(target.value)))
  {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(component.position?.width || 100);
  const numeric5 = Number(component.position?.height || 100);
  if (target === Ya) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      x: numeric2 * clamped / 100 - numeric4 / 2
    });
  } else if (target === Xa) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      y: numeric3 * clamped / 100 - numeric5 / 2
    });
  } else if (target === yo) {
    const clamped = clampNumber(numeric, 1, 500);
    x?.previewComponentTransform(component.id, {
      scale: clamped / 100
    });
  } else if (target === gi) {
    const rotation = clampNumber(numeric, -360, 360);
    x?.previewComponentTransform(component.id, {
      rotation: rotation
    });
  }
});
_a.addEventListener("change", (value) => {
  const target = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const temp2 = ww.get(target);
  const temp3 = Cw.get(target);
  if (!!temp2 || !!temp3 || !!Mp.has(target)) {
    if (
    (temp3 || Mp.has(target)) && (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))))
    {
      Z();
      return;
    }
    L((doc) => {
      const component = findComponent(doc, temp)?.component;
      if (!component || component.type !== "time") {
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
      const numeric = Number(doc.canvas.width || 2778);
      const numeric2 = Number(doc.canvas.height || 1940);
      const numeric3 = Number(target.value);
      if (temp2) {
        component.properties[temp2] = target.value;
      } else if (temp3) {
        component.properties[temp3.property] =
        clampNumber(numeric3, temp3.minimum, temp3.maximum) /
        temp3.divisor;
        if (temp3.resizes) {
          j0(component, component.properties);
        }
      } else if (target === Ya) {
        component.position.x =
        numeric * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.width || 100) / 2;
      } else if (target === Xa) {
        component.position.y =
        numeric2 * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.height || 100) / 2;
      } else if (target === yo) {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (target === gi) {
        Gt(doc, temp, clampNumber(numeric3, -360, 360));
      }
    });
  }
});
for (const t of [Lb, Ib]) {
  t.addEventListener("click", (value) => {
    const temp = componentId;
    const ancestorEl = value.target.closest("[data-time-hour-format]");
    const ancestorEl2 = value.target.closest("[data-time-seconds]");
    if (!!temp && (!!ancestorEl || !!ancestorEl2)) {
      L((arg) => {
        const component = findComponent(arg, temp)?.component;
        if (!!component && component.type === "time") {
          component.properties = {
            ...(component.properties || {})
          };
          if (ancestorEl) {
            component.properties.hour12 =
            ancestorEl.dataset.timeHourFormat === "12";
          }
          if (ancestorEl2) {
            component.properties.showSeconds =
            ancestorEl2.dataset.timeSeconds === "on";
          }
          j0(component, component.properties);
        }
      });
    }
  });
}
const Sw = new Map([
[Fb, "primaryColor"],
[Wb, "lunarColor"]]
);
const xw = new Map([
[
Db,
{
  property: "primarySize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}],

[
zb,
{
  property: "primaryWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}],

[
Vb,
{
  property: "primarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}],

[
Rb,
{
  property: "lunarSize",
  minimum: 10,
  maximum: 500,
  divisor: 1,
  resizes: true
}],

[
Hb,
{
  property: "lunarWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}],

[
jb,
{
  property: "lunarSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}],

[
qb,
{
  property: "lineGap",
  minimum: 0,
  maximum: 200,
  divisor: 1,
  resizes: true
}],

[
Gb,
{
  property: "opacity",
  minimum: 0,
  maximum: 100,
  divisor: 100,
  resizes: false
}]]

);
const Op = new Set([Ja, Za, vo, hi]);
function fL(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const numeric2 = Number(value.position?.height || 100);
  const number = Number(value.position?.x || 0) + numeric / 2;
  const number2 = Number(value.position?.y || 0) + numeric2 / 2;
  const { width: width, height: height } = dateComponentDimensions(fallback);
  x?.previewComponentTransform(value.id, {
    x: number - width / 2,
    y: number2 - height / 2,
    width: width,
    height: height
  });
}
Ka.addEventListener("input", (value) => {
  const component = O();
  if (!component || component.type !== "date") {
    return;
  }
  const target = value.target;
  const temp = Sw.get(target);
  if (temp) {
    x?.previewComponentProperties(component.id, {
      [temp]: target.value
    });
    return;
  }
  const temp2 = xw.get(target);
  if (temp2) {
    if (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value)))
    {
      return;
    }
    const number =
    clampNumber(Number(target.value), temp2.minimum, temp2.maximum) /
    temp2.divisor;
    const options = {
      ...(component.properties || {}),
      [temp2.property]: number
    };
    x?.previewComponentProperties(component.id, {
      [temp2.property]: number
    });
    if (temp2.resizes) {
      fL(component, options);
    }
    return;
  }
  if (
  !Op.has(target) ||
  String(target.value).trim() === "" ||
  !Number.isFinite(Number(target.value)))
  {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(component.position?.width || 100);
  const numeric5 = Number(component.position?.height || 100);
  if (target === Ja) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      x: numeric2 * clamped / 100 - numeric4 / 2
    });
  } else if (target === Za) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      y: numeric3 * clamped / 100 - numeric5 / 2
    });
  } else if (target === vo) {
    const clamped = clampNumber(numeric, 1, 500);
    x?.previewComponentTransform(component.id, {
      scale: clamped / 100
    });
  } else if (target === hi) {
    const rotation = clampNumber(numeric, -360, 360);
    x?.previewComponentTransform(component.id, {
      rotation: rotation
    });
  }
});
Ka.addEventListener("change", (value) => {
  const target = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const temp2 = Sw.get(target);
  const temp3 = xw.get(target);
  if (!!temp2 || !!temp3 || !!Op.has(target)) {
    if (
    (temp3 || Op.has(target)) && (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))))
    {
      Z();
      return;
    }
    L((doc) => {
      const component = findComponent(doc, temp)?.component;
      if (!component || component.type !== "date") {
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
      const numeric = Number(doc.canvas.width || 2778);
      const numeric2 = Number(doc.canvas.height || 1940);
      const numeric3 = Number(target.value);
      if (temp2) {
        component.properties[temp2] = target.value;
      } else if (temp3) {
        component.properties[temp3.property] =
        clampNumber(numeric3, temp3.minimum, temp3.maximum) /
        temp3.divisor;
        if (temp3.resizes) {
          q0(component, component.properties);
        }
      } else if (target === Ja) {
        component.position.x =
        numeric * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.width || 100) / 2;
      } else if (target === Za) {
        component.position.y =
        numeric2 * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.height || 100) / 2;
      } else if (target === vo) {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (target === hi) {
        Gt(doc, temp, clampNumber(numeric3, -360, 360));
      }
    });
  }
});
for (const t of [Bb, $b]) {
  t.addEventListener("click", (value) => {
    const temp = componentId;
    const ancestorEl = value.target.closest("[data-date-weekday]");
    const ancestorEl2 = value.target.closest("[data-date-lunar]");
    if (!!temp && (!!ancestorEl || !!ancestorEl2)) {
      L((arg) => {
        const component = findComponent(arg, temp)?.component;
        if (!!component && component.type === "date") {
          component.properties = {
            ...(component.properties || {})
          };
          if (ancestorEl) {
            component.properties.showWeekday =
            ancestorEl.dataset.dateWeekday === "on";
          }
          if (ancestorEl2) {
            component.properties.showLunar = ancestorEl2.dataset.dateLunar === "on";
          }
          q0(component, component.properties);
        }
      });
    }
  });
}
const Nw = new Map([
[Qb, "temperatureColor"],
[oy, "secondaryColor"]]
);
const Ew = new Map([
[
Jb,
{
  property: "iconSize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}],

[
Zb,
{
  property: "iconGap",
  minimum: 0,
  maximum: 300,
  divisor: 1,
  resizes: true
}],

[
ey,
{
  property: "temperatureSize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}],

[
ty,
{
  property: "temperatureWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}],

[
ny,
{
  property: "temperatureSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}],

[
iy,
{
  property: "secondarySize",
  minimum: 10,
  maximum: 500,
  divisor: 1,
  resizes: true
}],

[
ay,
{
  property: "secondaryWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}],

[
ry,
{
  property: "secondarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}],

[
sy,
{
  property: "lineGap",
  minimum: 0,
  maximum: 200,
  divisor: 1,
  resizes: true
}],

[
cy,
{
  property: "opacity",
  minimum: 0,
  maximum: 100,
  divisor: 100,
  resizes: false
}]]

);
const Bp = new Set([er, tr, wo, bi]);
function gL(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const numeric2 = Number(value.position?.height || 100);
  const number = Number(value.position?.x || 0) + numeric / 2;
  const number2 = Number(value.position?.y || 0) + numeric2 / 2;
  const { width: width, height: height } = weatherComponentDimensions(fallback);
  x?.previewComponentTransform(value.id, {
    x: number - width / 2,
    y: number2 - height / 2,
    width: width,
    height: height
  });
}
Qa.addEventListener("input", (value) => {
  const component = O();
  if (!component || component.type !== "weather") {
    return;
  }
  const target = value.target;
  const temp = Nw.get(target);
  if (temp) {
    x?.previewComponentProperties(component.id, {
      [temp]: target.value
    });
    return;
  }
  const temp2 = Ew.get(target);
  if (temp2) {
    if (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value)))
    {
      return;
    }
    const number =
    clampNumber(Number(target.value), temp2.minimum, temp2.maximum) /
    temp2.divisor;
    const options = {
      ...(component.properties || {}),
      [temp2.property]: number
    };
    x?.previewComponentProperties(component.id, {
      [temp2.property]: number
    });
    if (temp2.resizes) {
      gL(component, options);
    }
    return;
  }
  if (
  !Bp.has(target) ||
  String(target.value).trim() === "" ||
  !Number.isFinite(Number(target.value)))
  {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(component.position?.width || 100);
  const numeric5 = Number(component.position?.height || 100);
  if (target === er) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      x: numeric2 * clamped / 100 - numeric4 / 2
    });
  } else if (target === tr) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      y: numeric3 * clamped / 100 - numeric5 / 2
    });
  } else if (target === wo) {
    const clamped = clampNumber(numeric, 1, 500);
    x?.previewComponentTransform(component.id, {
      scale: clamped / 100
    });
  } else if (target === bi) {
    const rotation = clampNumber(numeric, -360, 360);
    x?.previewComponentTransform(component.id, {
      rotation: rotation
    });
  }
});
Qa.addEventListener("change", (value) => {
  const target = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const temp2 = Nw.get(target);
  const temp3 = Ew.get(target);
  if (!!temp2 || !!temp3 || !!Bp.has(target)) {
    if (
    (temp3 || Bp.has(target)) && (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))))
    {
      Z();
      return;
    }
    L((doc) => {
      const component = findComponent(doc, temp)?.component;
      if (!component || component.type !== "weather") {
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
      const numeric = Number(doc.canvas.width || 2778);
      const numeric2 = Number(doc.canvas.height || 1940);
      const numeric3 = Number(target.value);
      if (temp2) {
        component.properties[temp2] = target.value;
      } else if (temp3) {
        component.properties[temp3.property] =
        clampNumber(numeric3, temp3.minimum, temp3.maximum) /
        temp3.divisor;
        if (temp3.resizes) {
          G0(component, component.properties);
        }
      } else if (target === er) {
        component.position.x =
        numeric * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.width || 100) / 2;
      } else if (target === tr) {
        component.position.y =
        numeric2 * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.height || 100) / 2;
      } else if (target === wo) {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (target === bi) {
        Gt(doc, temp, clampNumber(numeric3, -360, 360));
      }
    });
  }
});
for (const t of [_b, Yb, Xb, Kb]) {
  t.addEventListener("click", (value) => {
    const temp = componentId;
    const ancestorEl = value.target.closest("button");
    if (!temp || !ancestorEl) {
      return;
    }
    const found = [
    ["weatherIconVisible", "iconVisible"],
    ["weatherTemperatureVisible", "temperatureVisible"],
    ["weatherConditionVisible", "conditionVisible"],
    ["weatherHumidityVisible", "humidityVisible"]].
    find(([arg]) => ancestorEl.dataset[arg] !== undefined);
    if (!found) {
      return;
    }
    const [temp2, temp3] = found;
    L((arg) => {
      const component = findComponent(arg, temp)?.component;
      if (!!component && component.type === "weather") {
        component.properties = {
          ...(component.properties || {}),
          [temp3]: ancestorEl.dataset[temp2] === "on"
        };
        G0(component, component.properties);
      }
    });
  });
}
const Lw = new Map([
[py, "valueColor"],
[my, "statePrecision"],
[tu, "thresholdMode"]]
);
const Iw = new Map([
[
uy,
{
  property: "valueScale",
  minimum: 10,
  maximum: 500,
  divisor: 1
}],

[
fy,
{
  property: "valueOffsetX",
  minimum: -100,
  maximum: 100,
  divisor: 1
}],

[
gy,
{
  property: "valueOffsetY",
  minimum: -100,
  maximum: 100,
  divisor: 1
}],

[
hy,
{
  property: "updateInterval",
  minimum: 30,
  maximum: 86400,
  divisor: 1
}],

[
by,
{
  property: "hours",
  minimum: 1,
  maximum: 168,
  divisor: 1
}],

[
yy,
{
  property: "cornerRadius",
  minimum: 0,
  maximum: 50,
  divisor: 1
}]]

);
const $p = new Set([or, ir, vi, wi, Co, Ci]);
nr.addEventListener("input", (value) => {
  const temp = O();
  if (!temp || temp.type !== "line-chart") {
    return;
  }
  const target = value.target;
  const temp2 = Lw.get(target);
  const temp3 = Iw.get(target);
  if (temp2) {
    x?.previewComponentProperties(temp.id, {
      [temp2]: target.value
    });
    return;
  }
  if (temp3) {
    if (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value)))
    {
      return;
    }
    const clamped = clampNumber(
      Number(target.value),
      temp3.minimum,
      temp3.maximum
    );
    if (!["updateInterval", "hours"].includes(temp3.property)) {
      x?.previewComponentProperties(temp.id, {
        [temp3.property]: clamped / temp3.divisor
      });
    }
    return;
  }
  if (
  yi.findIndex(
    (element) => element.value === target || element.color === target
  ) >= 0)
  {
    const thresholds = yi.map((element) => ({
      value: Number(element.value.value),
      color: element.color.value
    }));
    if (thresholds.every((element) => Number.isFinite(element.value))) {
      x?.previewComponentProperties(temp.id, {
        thresholdMode: "manual",
        thresholds: thresholds
      });
    }
    return;
  }
  if (
  !$p.has(target) ||
  String(target.value).trim() === "" ||
  !Number.isFinite(Number(target.value)))
  {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(temp.position?.width || 100);
  const numeric5 = Number(temp.position?.height || 100);
  const number = Number(temp.position?.x || 0) + numeric4 / 2;
  const number2 = Number(temp.position?.y || 0) + numeric5 / 2;
  if (target === or) {
    x?.previewComponentTransform(temp.id, {
      x: numeric2 * clampNumber(numeric, 0, 100) / 100 - numeric4 / 2
    });
  } else if (target === ir) {
    x?.previewComponentTransform(temp.id, {
      y: numeric3 * clampNumber(numeric, 0, 100) / 100 - numeric5 / 2
    });
  } else if (target === vi) {
    const width = numeric2 * clampNumber(numeric, 0.1, 100) / 100;
    x?.previewComponentTransform(temp.id, {
      x: number - width / 2,
      width: width
    });
  } else if (target === wi) {
    const height = numeric3 * clampNumber(numeric, 0.1, 100) / 100;
    x?.previewComponentTransform(temp.id, {
      y: number2 - height / 2,
      height: height
    });
  } else if (target === Co) {
    x?.previewComponentTransform(temp.id, {
      scale: clampNumber(numeric, 1, 500) / 100
    });
  } else if (target === Ci) {
    x?.previewComponentTransform(temp.id, {
      rotation: clampNumber(numeric, -360, 360)
    });
  }
});
nr.addEventListener("change", (value) => {
  const target = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const temp2 = Lw.get(target);
  const temp3 = Iw.get(target);
  const temp4 = yi.findIndex(
    (element) => element.value === target || element.color === target
  );
  if (!!temp2 || !!temp3 || !(temp4 < 0) || !!$p.has(target)) {
    if (
    (temp3 || $p.has(target) || temp4 >= 0 && target.type === "number") && (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))))
    {
      Z();
      return;
    }
    L((doc) => {
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
      const numeric = Number(doc.canvas.width || 2778);
      const numeric2 = Number(doc.canvas.height || 1940);
      const numeric3 = Number(component.position.width || 100);
      const numeric4 = Number(component.position.height || 100);
      const number = Number(component.position.x || 0) + numeric3 / 2;
      const number2 = Number(component.position.y || 0) + numeric4 / 2;
      const numeric5 = Number(target.value);
      if (temp2) {
        component.properties[temp2] = target.value;
        if (
        target === tu &&
        target.value === "manual" && (
        !Array.isArray(component.properties.thresholds) ||
        !component.properties.thresholds.some((element) =>
        Number.isFinite(Number(element?.value))
        )))
        {
          component.properties.thresholds = yi.map((element) => ({
            value: Number(element.value.value),
            color: element.color.value
          }));
        }
      } else if (temp3) {
        component.properties[temp3.property] =
        clampNumber(numeric5, temp3.minimum, temp3.maximum) /
        temp3.divisor;
      } else if (temp4 >= 0) {
        component.properties.thresholdMode = "manual";
        component.properties.thresholds = yi.map((element) => ({
          value: Number(element.value.value),
          color: element.color.value
        }));
      } else if (target === or) {
        component.position.x =
        numeric * clampNumber(numeric5, 0, 100) / 100 - numeric3 / 2;
      } else if (target === ir) {
        component.position.y =
        numeric2 * clampNumber(numeric5, 0, 100) / 100 - numeric4 / 2;
      } else if (target === vi) {
        component.position.width =
        numeric * clampNumber(numeric5, 0.1, 100) / 100;
        component.position.x = number - component.position.width / 2;
      } else if (target === wi) {
        component.position.height =
        numeric2 * clampNumber(numeric5, 0.1, 100) / 100;
        component.position.y = number2 - component.position.height / 2;
      } else if (target === Co) {
        component.style.scale = clampNumber(numeric5, 1, 500) / 100;
      } else if (target === Ci) {
        Gt(doc, temp, clampNumber(numeric5, -360, 360));
      }
    });
  }
});
dy.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-line-chart-value-visible]");
  const temp = componentId;
  if (!!ancestorEl && !!temp) {
    L((arg) => {
      const component = findComponent(arg, temp)?.component;
      if (!!component && component.type === "line-chart") {
        component.properties = {
          ...(component.properties || {}),
          valueVisible: ancestorEl.dataset.lineChartValueVisible === "on"
        };
      }
    });
  }
});
const Tw = new Map([
[Sy, "mainColor"],
[ky, "secondaryColor"],
[Vy, "edgeColor"],
[Gy, "glowColor"]]
);
const Aw = new Map([
[
xy,
{
  property: "mainSize",
  minimum: 8,
  maximum: 500,
  divisor: 1
}],

[
Ny,
{
  property: "mainWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}],

[
Ey,
{
  property: "mainOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}],

[
Ly,
{
  property: "mainSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}],

[
Iy,
{
  property: "mainTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}],

[
Ty,
{
  property: "mainTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}],

[
My,
{
  property: "secondarySize",
  minimum: 6,
  maximum: 500,
  divisor: 1
}],

[
Oy,
{
  property: "secondaryWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}],

[
By,
{
  property: "secondaryOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}],

[
$y,
{
  property: "secondarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}],

[
Fy,
{
  property: "secondaryTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}],

[
Dy,
{
  property: "secondaryTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}],

[
Wy,
{
  property: "edgeWidth",
  minimum: 0,
  maximum: 20,
  divisor: 1
}],

[
Ry,
{
  property: "edgeOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}],

[
Hy,
{
  property: "radius",
  minimum: 0,
  maximum: 50,
  divisor: 100
}],

[
jy,
{
  property: "edgeAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}],

[
Uy,
{
  property: "glowStrength",
  minimum: 0,
  maximum: 500,
  divisor: 100
}],

[
_y,
{
  property: "glowSize",
  minimum: 0,
  maximum: 300,
  divisor: 100
}],

[
Yy,
{
  property: "glowAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}]]

);
const Fp = new Set([rr, sr, Si, xi, So, Ni]);
ar.addEventListener("input", (value) => {
  const temp = O();
  if (!temp || temp.type !== "panel-frame") {
    return;
  }
  const target = value.target;
  const temp2 = Tw.get(target);
  const temp3 = Aw.get(target);
  if (temp2) {
    x?.previewComponentProperties(temp.id, {
      [temp2]: target.value
    });
    return;
  }
  if (temp3) {
    if (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value)))
    {
      return;
    }
    const clamped = clampNumber(
      Number(target.value),
      temp3.minimum,
      temp3.maximum
    );
    x?.previewComponentProperties(temp.id, {
      [temp3.property]: clamped / temp3.divisor
    });
    return;
  }
  if (
  !Fp.has(target) ||
  String(target.value).trim() === "" ||
  !Number.isFinite(Number(target.value)))
  {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(temp.position?.width || 100);
  const numeric5 = Number(temp.position?.height || 100);
  const number = Number(temp.position?.x || 0) + numeric4 / 2;
  const number2 = Number(temp.position?.y || 0) + numeric5 / 2;
  if (target === rr) {
    x?.previewComponentTransform(temp.id, {
      x: numeric2 * clampNumber(numeric, 0, 100) / 100 - numeric4 / 2
    });
  } else if (target === sr) {
    x?.previewComponentTransform(temp.id, {
      y: numeric3 * clampNumber(numeric, 0, 100) / 100 - numeric5 / 2
    });
  } else if (target === Si) {
    const width = numeric2 * clampNumber(numeric, 0.1, 100) / 100;
    x?.previewComponentTransform(temp.id, {
      x: number - width / 2,
      width: width
    });
  } else if (target === xi) {
    const height = numeric3 * clampNumber(numeric, 0.1, 100) / 100;
    x?.previewComponentTransform(temp.id, {
      y: number2 - height / 2,
      height: height
    });
  } else if (target === So) {
    x?.previewComponentTransform(temp.id, {
      scale: clampNumber(numeric, 1, 500) / 100
    });
  } else if (target === Ni) {
    x?.previewComponentTransform(temp.id, {
      rotation: clampNumber(numeric, -360, 360)
    });
  }
});
ar.addEventListener("change", (value) => {
  const target = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const temp2 = Tw.get(target);
  const temp3 = Aw.get(target);
  if (!!temp2 || !!temp3 || !!Fp.has(target)) {
    if (
    (temp3 || Fp.has(target)) && (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))))
    {
      Z();
      return;
    }
    L((doc) => {
      const component = findComponent(doc, temp)?.component;
      if (!component || component.type !== "panel-frame") {
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
      const numeric = Number(doc.canvas.width || 2778);
      const numeric2 = Number(doc.canvas.height || 1940);
      const numeric3 = Number(component.position.width || 100);
      const numeric4 = Number(component.position.height || 100);
      const number = Number(component.position.x || 0) + numeric3 / 2;
      const number2 = Number(component.position.y || 0) + numeric4 / 2;
      const numeric5 = Number(target.value);
      if (temp2) {
        component.properties[temp2] = target.value;
      } else if (temp3) {
        component.properties[temp3.property] =
        clampNumber(numeric5, temp3.minimum, temp3.maximum) /
        temp3.divisor;
      } else if (target === rr) {
        component.position.x =
        numeric * clampNumber(numeric5, 0, 100) / 100 - numeric3 / 2;
      } else if (target === sr) {
        component.position.y =
        numeric2 * clampNumber(numeric5, 0, 100) / 100 - numeric4 / 2;
      } else if (target === Si) {
        component.position.width =
        numeric * clampNumber(numeric5, 0.1, 100) / 100;
        component.position.x = number - component.position.width / 2;
      } else if (target === xi) {
        component.position.height =
        numeric2 * clampNumber(numeric5, 0.1, 100) / 100;
        component.position.y = number2 - component.position.height / 2;
      } else if (target === So) {
        component.style.scale = clampNumber(numeric5, 1, 500) / 100;
      } else if (target === Ni) {
        Gt(doc, temp, clampNumber(numeric5, -360, 360));
      }
    });
  }
});
for (const [t, e] of [
[wy, "mainTextVisible"],
[Ay, "secondaryTextVisible"],
[zy, "edgeVisible"],
[qy, "glowVisible"]])
{
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L((arg) => {
        const component = findComponent(arg, value)?.component;
        if (!!component && component.type === "panel-frame") {
          component.properties = {
            ...(component.properties || {}),
            [e]: component.properties?.[e] === false
          };
        }
      });
    }
  });
}
const Dp = new Map([
[au, "mainText"],
[ru, "secondaryText"],
[ev, "mainColor"],
[tv, "secondaryColor"],
[pv, "iconColor"],
[hv, "frameColor"],
[vv, "glowColor"]]
);
const zp = new Map([
[
nv,
{
  property: "mainSize",
  minimum: 1,
  maximum: 500,
  divisor: 1
}],

[
ov,
{
  property: "secondarySize",
  minimum: 1,
  maximum: 500,
  divisor: 1
}],

[
iv,
{
  property: "mainWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}],

[
av,
{
  property: "secondaryWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}],

[
rv,
{
  property: "mainSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}],

[
sv,
{
  property: "secondarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}],

[
cv,
{
  property: "mainTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}],

[
lv,
{
  property: "mainTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}],

[
dv,
{
  property: "secondaryTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}],

[
uv,
{
  property: "secondaryTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}],

[
su,
{
  property: "textIdleOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}],

[
cu,
{
  property: "textActiveOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}],

[
mv,
{
  property: "iconSize",
  minimum: 1,
  maximum: 500,
  divisor: 1
}],

[
fv,
{
  property: "iconLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}],

[
gv,
{
  property: "iconTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}],

[
lu,
{
  property: "iconIdleOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}],

[
du,
{
  property: "iconActiveOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}],

[
bv,
{
  property: "frameWidth",
  minimum: 0,
  maximum: 20,
  divisor: 1
}],

[
uu,
{
  property: "frameIdleOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}],

[
pu,
{
  property: "frameActiveOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}],

[
Cv,
{
  property: "radius",
  minimum: 0,
  maximum: 50,
  divisor: 100
}],

[
yv,
{
  property: "frameAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}],

[
wv,
{
  property: "glowAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}],

[
mu,
{
  property: "glowIdleStrength",
  minimum: 0,
  maximum: 500,
  divisor: 100
}],

[
fu,
{
  property: "glowIdleSize",
  minimum: 0,
  maximum: 300,
  divisor: 100
}],

[
gu,
{
  property: "glowActiveStrength",
  minimum: 0,
  maximum: 500,
  divisor: 100
}],

[
hu,
{
  property: "glowActiveSize",
  minimum: 0,
  maximum: 300,
  divisor: 100
}]]

);
const Pw = new Map([
[su, "off"],
[lu, "off"],
[uu, "off"],
[mu, "off"],
[fu, "off"],
[cu, "on"],
[du, "on"],
[pu, "on"],
[gu, "on"],
[hu, "on"]]
);
function hL(value) {
  if (value) {
    for (const element of nu.querySelectorAll("[data-navigation-preview]")) {
      element.classList.toggle(
        "active",
        element.dataset.navigationPreview === value
      );
    }
  }
}
function kw(value, arg2) {
  if (!value) {
    return;
  }
  const chosen = ["on", "off"].includes(arg2) ? arg2 : "auto";
  if (chosen === "auto") {
    Pi.delete(value);
  } else {
    Pi.set(value, chosen);
  }
  x?.setComponentPreviewState(value, chosen);
  if (value === componentId) {
    hL(chosen);
  }
}
function Vp(value) {
  const temp = Pw.get(value);
  const temp2 = O();
  if (!temp || temp2?.type !== "navigation-button") {
    return null;
  } else {
    kw(temp2.id, temp);
    return temp;
  }
}
const Wp = new Set([ur, pr, xo, No, An, Eo]);
function bL(value) {
  const temp = Dp.get(value);
  if (temp && Zr[temp]) {
    return temp;
  }
  const property = zp.get(value)?.property;
  if (property && Zr[property]) {
    return property;
  } else if (value === xo) {
    return "width";
  } else if (value === No) {
    return "height";
  } else if (value === An) {
    return "scale";
  } else if (value === Eo) {
    return "rotation";
  } else {
    return "";
  }
}
Ei.addEventListener("input", (value) => {
  const temp = O();
  if (!temp || temp.type !== "navigation-button") {
    return;
  }
  const target = value.target;
  const temp2 = Dp.get(target);
  if (temp2) {
    if (!lw.has(target)) {
      x?.previewComponentProperties(temp.id, {
        [temp2]: target.value
      });
    }
    return;
  }
  const temp3 = zp.get(target);
  if (temp3) {
    if (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value)))
    {
      return;
    }
    const clamped = clampNumber(
      Number(target.value),
      temp3.minimum,
      temp3.maximum
    );
    Vp(target);
    x?.previewComponentProperties(temp.id, {
      [temp3.property]: clamped / temp3.divisor
    });
    return;
  }
  if (
  !Wp.has(target) ||
  String(target.value).trim() === "" ||
  !Number.isFinite(Number(target.value)))
  {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(temp.position?.width || 100);
  const numeric5 = Number(temp.position?.height || 100);
  if (target === ur) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(temp.id, {
      x: numeric2 * clamped / 100 - numeric4 / 2
    });
  } else if (target === pr) {
    const clamped = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(temp.id, {
      y: numeric3 * clamped / 100 - numeric5 / 2
    });
  } else if (target === xo) {
    const clamped = clampNumber(numeric, 0.1, 100);
    const width = numeric2 * clamped / 100;
    const number = Number(temp.position?.x || 0) + numeric4 / 2;
    x?.previewComponentTransform(temp.id, {
      x: number - width / 2,
      width: width
    });
  } else if (target === No) {
    const clamped = clampNumber(numeric, 0.1, 100);
    const height = numeric3 * clamped / 100;
    const number = Number(temp.position?.y || 0) + numeric5 / 2;
    x?.previewComponentTransform(temp.id, {
      y: number - height / 2,
      height: height
    });
  } else if (target === An) {
    const clamped = clampNumber(numeric, 1, 500);
    x?.previewComponentTransform(temp.id, {
      scale: clamped / 100
    });
  } else if (target === Eo) {
    const rotation = clampNumber(numeric, -360, 360);
    x?.previewComponentTransform(temp.id, {
      rotation: rotation
    });
  }
});
Ei.addEventListener("focusin", (value) => {
  Vp(value.target);
});
Ei.addEventListener("change", (value) => {
  const target = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const temp2 = Dp.get(target);
  const temp3 = zp.get(target);
  const temp4 = Pw.get(target);
  const temp5 = bL(target);
  if (target === pc || !!temp2 || !!temp3 || !!Wp.has(target)) {
    if (
    (temp3 || Wp.has(target)) && (
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))))
    {
      Z();
      return;
    }
    if (temp4) {
      Vp(target);
    }
    L((doc) => {
      const component = findComponent(doc, temp)?.component;
      if (!component || component.type !== "navigation-button") {
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
      component.actions = {
        ...(component.actions || {})
      };
      const chosen = temp5 ? Ae(component, temp5) : undefined;
      const numeric = Number(doc.canvas.width || 2778);
      const numeric2 = Number(doc.canvas.height || 1940);
      const numeric3 = Number(target.value);
      if (target === pc) {
        component.properties.label = target.value.trim();
      } else if (temp2) {
        component.properties[temp2] = target.value;
      } else if (temp3) {
        component.properties[temp3.property] =
        clampNumber(numeric3, temp3.minimum, temp3.maximum) /
        temp3.divisor;
      } else if (target === ur) {
        component.position.x =
        numeric * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.width || 100) / 2;
      } else if (target === pr) {
        component.position.y =
        numeric2 * clampNumber(numeric3, 0, 100) / 100 -
        Number(component.position.height || 100) / 2;
      } else if (target === xo) {
        const number = numeric * clampNumber(numeric3, 0.1, 100) / 100;
        const number2 =
        Number(component.position.x || 0) +
        Number(component.position.width || 100) / 2;
        component.position.x = number2 - number / 2;
        component.position.width = number;
      } else if (target === No) {
        const number = numeric2 * clampNumber(numeric3, 0.1, 100) / 100;
        const number2 =
        Number(component.position.y || 0) +
        Number(component.position.height || 100) / 2;
        component.position.y = number2 - number / 2;
        component.position.height = number;
      } else if (target === An) {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (target === Eo) {
        Gt(doc, temp, clampNumber(numeric3, -360, 360));
      }
      if (temp5) {
        Kn(temp, temp5, chosen, Ae(component, temp5));
      }
    });
  }
});
const yL = new Map([
[Xy, "mainTextVisible"],
[Ky, "secondaryTextVisible"],
[Jy, "iconVisible"],
[Zy, "frameVisible"],
[Qy, "glowVisible"]]
);
for (const [t, e] of yL) {
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L((arg) => {
        const component = findComponent(arg, value)?.component;
        if (!component || component.type !== "navigation-button") {
          return;
        }
        const temp = Ae(component, e);
        component.properties = {
          ...(component.properties || {}),
          [e]: component.properties?.[e] === false
        };
        Kn(value, e, temp, Ae(component, e));
      });
    }
  });
}
nu.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-navigation-preview]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const chosen = ["off", "on"].includes(ancestorEl.dataset.navigationPreview) ?
  ancestorEl.dataset.navigationPreview :
  "auto";
  kw(temp, chosen);
});
const vL = {
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
const Mw = {
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
function Qc(component, value) {
  if (component) {
    if (value === "width" || value === "height") {
      return Number(component.position?.[value] || 100);
    } else if (value === "scale") {
      return Number(component.style?.scale || 1);
    } else if (value === "rotation") {
      return Number(component.position?.rotation || 0);
    } else {
      return component.properties?.[value] ?? clone(vL[value]);
    }
  }
}
function Ow(value) {
  if (!value || value.type !== "line-chart") {
    return [];
  }
  let temp = Mi.get(value.id);
  if (!temp) {
    temp = clone(findComponent(Ke, value.id)?.component || value);
    Mi.set(value.id, temp);
  }
  return Object.keys(Mw).filter(
    (arg) =>
    JSON.stringify(Qc(value, arg)) !== JSON.stringify(Qc(temp, arg))
  );
}
function wL(value, arg2, arg3 = h?.document) {
  if (typeof arg2 == "boolean") {
    if (arg2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940)
    );
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (
  ["valueScale", "valueOffsetX", "valueOffsetY", "cornerRadius"].includes(
    value
  ))
  {
    return roundField(Number(arg2 || 0)) + "%";
  } else if (value === "updateInterval") {
    return roundField(Number(arg2 || 0)) + " 秒";
  } else if (value === "hours") {
    return roundField(Number(arg2 || 0)) + " 小时";
  } else if (value === "thresholds") {
    return (Array.isArray(arg2) ? arg2.length : 0) + " 段配色";
  } else {
    return String(arg2 ?? "");
  }
}
const CL = {
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
const Bw = {
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
function el(component, value) {
  if (component) {
    if (value === "width" || value === "height") {
      return Number(component.position?.[value] || 100);
    } else if (value === "scale") {
      return Number(component.style?.scale || 1);
    } else if (value === "rotation") {
      return Number(component.position?.rotation || 0);
    } else {
      return component.properties?.[value] ?? CL[value];
    }
  }
}
function $w(value) {
  if (!value || value.type !== "title-button") {
    return [];
  }
  const flag = findComponent(Ke, value.id)?.component || value;
  return Object.keys(Bw).filter(
    (arg) =>
    JSON.stringify(el(value, arg)) !== JSON.stringify(el(flag, arg))
  );
}
function SL(value, arg2, arg3 = h?.document) {
  if (typeof arg2 == "boolean") {
    if (arg2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940)
    );
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (
  [
  "mainSize",
  "secondarySize",
  "mainSpacing",
  "secondarySpacing",
  "secondaryLineGap",
  "mainTextLeft",
  "mainTextTop",
  "secondaryTextLeft",
  "secondaryTextTop",
  "iconSize",
  "iconLeft",
  "iconTop",
  "frameSize",
  "frameSpacing",
  "frameOffsetX",
  "frameOffsetY",
  "markerSize",
  "markerLeft",
  "markerTop"].
  includes(value))
  {
    return roundField(Number(arg2 || 0)) + "%";
  } else {
    return String(arg2 ?? "");
  }
}
const xL = {
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
const NL = {
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
const Fw = {
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
function tl(component, value) {
  if (component) {
    if (value === "width" || value === "height") {
      return Number(component.position?.[value] || 100);
    } else if (value === "scale") {
      return Number(component.style?.scale || 1);
    } else if (value === "rotation") {
      return Number(component.position?.rotation || 0);
    } else {
      return component.properties?.[value] ?? NL[value];
    }
  }
}
function Dw(value) {
  if (!value || value.type !== "air-conditioner") {
    return [];
  }
  let temp = $i.get(value.id);
  if (!temp) {
    temp = clone(findComponent(Ke, value.id)?.component || value);
    $i.set(value.id, temp);
  }
  return Object.keys(Fw).filter(
    (arg) =>
    JSON.stringify(tl(value, arg)) !== JSON.stringify(tl(temp, arg))
  );
}
function EL(value, arg2, arg3 = h?.document) {
  if (typeof arg2 == "boolean") {
    if (arg2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940)
    );
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (["scale", "airflowScale", "badgeOpacity"].includes(value)) {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (["rotation", "airflowRotation", "airflowAngle"].includes(value)) {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (value === "airflowMotion") {
    if (arg2 === "static") {
      return "静态";
    } else {
      return "动态";
    }
  } else if (typeof arg2 == "number") {
    return roundField(arg2);
  } else {
    return String(arg2 ?? "");
  }
}
const zw = {
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
function nl(component, value) {
  if (component) {
    if (value === "width" || value === "height") {
      return Number(component.position?.[value] || 100);
    } else if (value === "scale") {
      return Number(component.style?.scale || 1);
    } else if (value === "rotation") {
      return Number(component.position?.rotation || 0);
    } else {
      return component.properties?.[value] ?? xL[value];
    }
  }
}
function Vw(value) {
  if (!value || value.type !== "icon-button-effect") {
    return [];
  }
  let temp = Oi.get(value.id);
  if (!temp) {
    temp = clone(findComponent(Ke, value.id)?.component || value);
    Oi.set(value.id, temp);
  }
  return Object.keys(zw).filter(
    (arg) =>
    JSON.stringify(nl(value, arg)) !== JSON.stringify(nl(temp, arg))
  );
}
function LL(value, arg2, arg3 = h?.document) {
  if (typeof arg2 == "boolean") {
    if (arg2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940)
    );
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (
  [
  "buttonOpacity",
  "frameOpacity",
  "glowOffStrength",
  "glowOnStrength",
  "effectOpacity",
  "effectScale",
  "scale"].
  includes(value))
  {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (
  ["iconSize", "radius", "effectLeft", "effectTop"].includes(value))
  {
    return roundField(Number(arg2 || 0)) + "%";
  } else if (["effectRotation", "rotation"].includes(value)) {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (["effectFadeDuration", "onFillFadeDuration"].includes(value)) {
    return roundField(Number(arg2 || 0)) + " 秒";
  } else if (value === "effectLayoutMode") {
    if (arg2 === "fill") {
      return "铺满";
    } else {
      return "自由";
    }
  } else {
    return String(arg2 || "不使用");
  }
}
const Jr = {
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
  perspectiveCorners: Bu,
  waterLeakColor: "#42c8ff",
  smokeColor: "#ffffff",
  naturalGasColor: "#ffb347"
};
const bn = {
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
const IL = {
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
  width: bn.width,
  height: bn.height,
  scale: bn.scale,
  rotation: bn.rotation
};
function Ho(component) {
  const sensorKind = component?.properties?.sensorKind;
  if (
  ["presence", "door-window", "water-leak", "smoke", "natural-gas"].includes(
    sensorKind
  ))
  {
    return sensorKind;
  } else {
    return "presence";
  }
}
function TL(value) {
  return {
    presence: "人体/人在传感器",
    "door-window": "门窗传感器",
    "water-leak": "水浸传感器",
    smoke: "烟雾传感器",
    "natural-gas": "天然气传感器"
  }[Ho(value)];
}
function AL(value) {
  const list = ["width", "height", "scale", "rotation"];
  const temp = Ho(value);
  if (temp === "presence") {
    return [
    "iconColor",
    "iconOnColor",
    "haloVisible",
    "haloScaleX",
    "haloScaleY",
    "haloRotation",
    "haloOpacity",
    "personVisible",
    "personScale",
    "personRotation",
    "personOpacity",
    "orbitDuration",
    ...list];

  } else if (temp === "door-window") {
    return ["iconOnColor", "perspectiveCorners", ...list];
  } else if (temp === "water-leak") {
    return ["waterLeakColor", ...list];
  } else if (temp === "smoke") {
    return ["smokeColor", ...list];
  } else {
    return ["naturalGasColor", ...list];
  }
}
function ol(component, value) {
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
    return (
      flag.iconColor ??
      flag.clearColor ??
      flag.iconOffColor ??
      flag.iconOnColor ??
      Jr.iconColor);

  } else if (value === "iconOnColor") {
    return flag.iconOnColor ?? flag.occupiedColor ?? Jr.iconOnColor;
  } else if (value === "mainColor") {
    return (
      flag.mainColor ??
      flag.mainOffColor ??
      flag.mainOnColor ??
      Jr.mainColor);

  } else if (value === "secondaryColor") {
    return (
      flag.secondaryColor ??
      flag.secondaryOffColor ??
      flag.secondaryOnColor ??
      Jr.secondaryColor);

  } else {
    return flag[value] ?? Jr[value];
  }
}
function Ww(value) {
  if (
  !value ||
  !["icon-button", "device-button", "presence-sensor"].includes(value.type))
  {
    return [];
  }
  let temp = Bi.get(value.id);
  if (!temp) {
    temp = clone(findComponent(Ke, value.id)?.component || value);
    Bi.set(value.id, temp);
  }
  return (
  value.type === "presence-sensor" ?
  AL(value) :
  value.type === "device-button" ?
  [
  "iconColor",
  "iconOnColor",
  "badgeColor",
  "badgeOpacity",
  "symbolSize",
  "badgeSize",
  "iconLeft",
  "iconTop",
  "mainColor",
  "mainSize",
  "mainWeight",
  "mainSpacing",
  "mainTextLeft",
  "mainTextTop",
  "secondaryColor",
  "secondarySize",
  "secondaryWeight",
  "secondarySpacing",
  "secondaryTextLeft",
  "secondaryTextTop",
  "width",
  "height",
  "scale",
  "rotation"] :

  Object.keys(bn)).
  filter(
    (arg) =>
    JSON.stringify(ol(value, arg)) !== JSON.stringify(ol(temp, arg))
  );
}
function PL(value, arg2) {
  if (value?.type === "presence-sensor") {
    return IL[arg2];
  } else if (value?.type !== "device-button") {
    return bn[arg2];
  } else if (arg2.startsWith("main")) {
    return {
      group: "标题",
      label:
      arg2 === "mainOnOpacity" ?
      "透明度" :
      bn[arg2]?.label?.replace("中文", "")
    };
  } else if (arg2.startsWith("secondary")) {
    return {
      group: "状态",
      label:
      arg2 === "secondaryOnOpacity" ?
      "透明度" :
      bn[arg2]?.label?.replace("英文", "")
    };
  } else {
    return bn[arg2];
  }
}
function kL(value, arg2, arg3 = h?.document) {
  if (typeof arg2 == "boolean") {
    if (arg2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940)
    );
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (value === "perspectiveCorners") {
    if (JSON.stringify(arg2) === JSON.stringify(Bu)) {
      return "默认透视";
    } else {
      return "自定义透视";
    }
  } else if (value === "orbitDuration") {
    return roundField(Number(arg2 || 0)) + " 秒";
  } else if (value === "onFillFadeDuration") {
    return roundField(Number(arg2 || 0)) + " 秒";
  } else if (
  [
  "rotation",
  "frameAngle",
  "softLightAngle",
  "glowAngle",
  "haloRotation",
  "personRotation"].
  includes(value))
  {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (
  [
  "iconOffOpacity",
  "iconOnOpacity",
  "mainOffOpacity",
  "mainOnOpacity",
  "secondaryOffOpacity",
  "secondaryOnOpacity",
  "badgeOpacity",
  "onFillStrength",
  "frameOffOpacity",
  "frameOnOpacity",
  "softLightStrength",
  "softLightSize",
  "glowStrength",
  "glowSize",
  "haloScaleX",
  "haloScaleY",
  "haloOpacity",
  "personScale",
  "personOpacity"].
  includes(value))
  {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (
  [
  "iconSize",
  "symbolSize",
  "badgeSize",
  "iconLeft",
  "iconTop",
  "mainTextLeft",
  "mainTextTop",
  "secondaryTextLeft",
  "secondaryTextTop",
  "cutCorner"].
  includes(value))
  {
    return roundField(Number(arg2 || 0)) + "%";
  } else {
    return String(arg2 ?? "");
  }
}
const Rw = {
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
const Hw = {
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
function il(component, value) {
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
    const numeric = Number(flag.radius ?? Rw.radius);
    return Math.max(0, Math.min(0.5, numeric > 0.5 ? numeric / 100 : numeric));
  }
  return flag[value] ?? Rw[value];
}
function jw(value) {
  if (!value || value.type !== "camera") {
    return [];
  }
  const flag = findComponent(Ke, value.id)?.component || value;
  return Object.keys(Hw).filter(
    (arg) =>
    JSON.stringify(il(value, arg)) !== JSON.stringify(il(flag, arg))
  );
}
function ML(value, arg2, arg3 = h?.document) {
  if (typeof arg2 == "boolean") {
    if (arg2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "displayMode") {
    if (arg2 === "snapshot") {
      return "快照";
    } else {
      return "实时";
    }
  }
  if (value === "refreshInterval") {
    return roundField(Number(arg2 || 10)) + " 秒";
  }
  if (value === "fit") {
    if (arg2 === "contain") {
      return "原始比例";
    } else {
      return "压缩 16:9";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940)
    );
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale" || value === "radius" || value === "frameOpacity") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (value === "rotation" || value === "frameAngle") {
    return roundField(Number(arg2 || 0)) + "°";
  } else {
    return String(arg2 ?? "");
  }
}
const Rp = {
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
const qw = {
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
function al(component, value) {
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
    return flag[value] ?? flag.textLeft ?? Rp[value];
  }
  if (value === "mainTextTop") {
    const count = Math.max(1, Number(component.position?.height || 100));
    return (
      flag.mainTextTop ??
      Number(flag.textTop ?? 28) -
      Number(flag.lineGap ?? 24) / count * 100);

  }
  if (value === "secondaryTextTop") {
    return flag.secondaryTextTop ?? flag.textTop ?? Rp.secondaryTextTop;
  } else {
    return flag[value] ?? Rp[value];
  }
}
function Gw(value) {
  if (!value || value.type !== "panel-frame") {
    return [];
  }
  let temp = ki.get(value.id);
  if (!temp) {
    temp = clone(findComponent(Ke, value.id)?.component || value);
    ki.set(value.id, temp);
  }
  return Object.keys(qw).filter((arg) =>
  !temp || temp.type !== "panel-frame" ?
  true :
  JSON.stringify(al(value, arg)) !==
  JSON.stringify(al(temp, arg))
  );
}
function OL(value, arg2, arg3 = h?.document) {
  if (typeof arg2 == "boolean") {
    if (arg2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940)
    );
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (
  value === "rotation" ||
  value === "edgeAngle" ||
  value === "glowAngle")
  {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (
  [
  "mainOpacity",
  "secondaryOpacity",
  "edgeOpacity",
  "radius",
  "glowStrength",
  "glowSize"].
  includes(value))
  {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (
  [
  "mainTextLeft",
  "mainTextTop",
  "secondaryTextLeft",
  "secondaryTextTop"].
  includes(value))
  {
    return roundField(Number(arg2 || 0)) + "%";
  } else {
    return String(arg2 ?? "");
  }
}
const BL = {
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
const Zr = {
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
function Ae(component, value) {
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
  const temp = BL[value];
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
function Uw(value, arg2) {
  return JSON.stringify(value) === JSON.stringify(arg2);
}
function Kn(value, arg2, arg3, arg4) {
  if (!value || !Zr[arg2]) {
    return;
  }
  let temp = Oo.get(value);
  if (!!temp || !Uw(arg3, arg4)) {
    if (!temp) {
      temp = new Map();
      Oo.set(value, temp);
    }
    if (!temp.has(arg2)) {
      temp.set(arg2, clone(arg3));
    }
  }
}
function $L(value) {
  const temp = Oo.get(value?.id);
  if (temp) {
    for (const temp2 of temp.keys()) {
      if (!Zr[temp2]) {
        temp.delete(temp2);
      }
    }
    if (!temp.size) {
      Oo.delete(value.id);
    }
  }
}
function _w(value) {
  $L(value);
  return [...(Oo.get(value?.id)?.entries() || [])].
  filter(([arg, arg2]) => !Uw(Ae(value, arg), arg2)).
  map(([arg]) => arg);
}
function FL(value, arg2, arg3 = h?.document) {
  if (typeof arg2 == "boolean") {
    if (arg2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940)
    );
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (
  [
  "textIdleOpacity",
  "textActiveOpacity",
  "iconIdleOpacity",
  "iconActiveOpacity",
  "frameIdleOpacity",
  "frameActiveOpacity",
  "radius",
  "glowIdleStrength",
  "glowIdleSize",
  "glowActiveStrength",
  "glowActiveSize"].
  includes(value))
  {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (
  [
  "mainTextLeft",
  "mainTextTop",
  "secondaryTextLeft",
  "secondaryTextTop",
  "iconLeft",
  "iconTop"].
  includes(value))
  {
    return roundField(Number(arg2 || 0)) + "%";
  } else if (value === "frameAngle" || value === "glowAngle") {
    return roundField(Number(arg2 || 0)) + "°";
  } else {
    return String(arg2 ?? "");
  }
}
function wt({
  value: value,
  label: arg,
  detail: arg2,
  target: arg3 = false
}) {
  const temp = document.createElement("label");
  temp.className = "navigation-style-apply-option";
  const temp2 = document.createElement("input");
  temp2.type = "checkbox";
  temp2.checked = true;
  if (arg3) {
    temp2.dataset.navigationTargetId = value;
  } else {
    temp2.dataset.navigationStyleProperty = value;
  }
  const element = document.createElement("span");
  element.textContent = arg;
  if (arg2) {
    const element2 = document.createElement("small");
    element2.textContent = arg2;
    element.append(element2);
  }
  temp.append(temp2, element);
  return temp;
}
function Hp(value) {
  mr.classList.remove("grouped-by-page");
  mr.replaceChildren(...value);
}
function ji(value, detail) {
  const index = new Map();
  value.forEach(({ component: arg, page: page }) => {
    const flag = page?.id || page?.path || page?.name || "unknown-page";
    if (!index.has(flag)) {
      index.set(flag, {
        page: page,
        components: []
      });
    }
    index.get(flag).components.push(arg);
  });
  const list = [...index.values()].map(
    ({ page: arg, components: arg2 }) => {
      const temp = document.createElement("section");
      temp.className = "navigation-style-apply-page-group";
      const temp2 = document.createElement("div");
      temp2.className = "navigation-style-apply-page-heading";
      const element = document.createElement("strong");
      element.textContent = arg?.name || "未命名页面";
      const textContent = element.textContent;
      const temp3 = document.createElement("div");
      temp3.className = "navigation-style-apply-page-controls";
      const element2 = document.createElement("span");
      const element3 = document.createElement("button");
      element3.type = "button";
      element3.className = "navigation-style-apply-page-toggle";
      const temp4 = document.createElement("div");
      temp4.className = "navigation-style-apply-page-options";
      temp4.replaceChildren(
        ...arg2.map((component) =>
        wt({
          value: component.id,
          label: componentLabel(component),
          detail: detail,
          target: true
        })
        )
      );
      const elements = [
      ...temp4.querySelectorAll("[data-navigation-target-id]")];

      const callback = () => {
        const length = elements.filter((arg3) => arg3.checked).length;
        const flag = length === elements.length;
        element2.textContent = length + "/" + elements.length + " 个控件";
        element3.textContent = flag ? "取消全选" : "全选";
        element3.setAttribute(
          "aria-label",
          (flag ? "取消选择" : "全选") + "“" + textContent + "”中的控件"
        );
      };
      element3.addEventListener("click", () => {
        const flag = !elements.every((arg3) => arg3.checked);
        elements.forEach((arg3) => {
          arg3.checked = flag;
        });
        callback();
      });
      temp4.addEventListener("change", callback);
      temp3.append(element2, element3);
      temp2.append(element, temp3);
      temp.append(temp2, temp4);
      callback();
      return temp;
    }
  );
  mr.classList.add("grouped-by-page");
  mr.replaceChildren(...list);
}
function DL() {
  const value = O();
  if (!value || value.type !== "navigation-button") {
    return;
  }
  const temp = _w(value);
  const filtered = Rn(h.document.sharedComponents, "navigation-button").filter(
    (component) => component.id !== value.id
  );
  if (!!temp.length && !!filtered.length) {
    Pn.textContent = "应用导航按钮设置";
    Mn.textContent = "应用到导航按钮";
    On.textContent = "侧边栏通用";
    kn.textContent =
    "将“" +
    componentLabel(value) +
    "”中选定的修改应用到选中的侧边栏导航按钮。图标名称、文字内容、目标页面、备注和位置不会改变。";
    an.replaceChildren(
      ...temp.map((arg) => {
        const temp2 = Zr[arg];
        const temp3 = Ae(value, arg);
        return wt({
          value: arg,
          label: temp2.label,
          detail: temp2.group + " · " + FL(arg, temp3)
        });
      })
    );
    Hp(
      filtered.map((component) => {
        const flag =
        component.properties?.targetPage ||
        component.actions?.tap?.target ||
        "";
        const found = h.document.pages.find(
          (arg) => arg.path === flag
        );
        return wt({
          value: component.id,
          label: componentLabel(component),
          detail: found ? "跳转到：" + found.name : "未设置目标页面",
          target: true
        });
      })
    );
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "navigation-button"
    };
    Ge.showModal();
  }
}
function zL() {
  const value = O();
  if (!value || value.type !== "panel-frame") {
    return;
  }
  const temp = Gw(value);
  const flag = findComponent(h.document, value.id)?.scope === "page";
  const chosen = flag ?
  st("panel-frame").filter(
    ({ component: component }) => component.id !== value.id
  ) :
  Rn(h.document.sharedComponents, "panel-frame").
  filter((component) => component.id !== value.id).
  map((component) => ({
    component: component
  }));
  if (!!temp.length && !!chosen.length) {
    Pn.textContent = "应用底图框设置";
    Mn.textContent = flag ? "应用到主页面底图框" : "应用到侧边栏底图框";
    On.textContent = flag ? "按页面区分" : "侧边栏通用";
    kn.textContent =
    "将“" +
    componentLabel(value) +
    "”中选定的修改应用到选中的" + (
    flag ? "主页面" : "侧边栏") +
    "底图框。文字内容、备注和位置不会改变。";
    an.replaceChildren(
      ...temp.map((arg) => {
        const temp2 = qw[arg];
        const temp3 = al(value, arg);
        return wt({
          value: arg,
          label: temp2.label,
          detail: temp2.group + " · " + OL(arg, temp3)
        });
      })
    );
    if (flag) {
      ji(chosen, "主页面底图框");
    } else {
      Hp(
        chosen.map(({ component: component }) =>
        wt({
          value: component.id,
          label: componentLabel(component),
          detail: "侧边栏共享控件",
          target: true
        })
        )
      );
    }
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "panel-frame"
    };
    Ge.showModal();
  }
}
function VL() {
  const value = O();
  if (!value || value.type !== "camera") {
    return;
  }
  const temp = jw(value);
  const filtered = st("camera").filter(
    ({ component: component }) => component.id !== value.id
  );
  if (!!temp.length && !!filtered.length) {
    Pn.textContent = "应用摄像头实时预览设置";
    Mn.textContent = "应用到主页面摄像头实时预览";
    On.textContent = "按页面区分";
    kn.textContent =
    "将“" +
    componentLabel(value) +
    "”中选定的修改应用到选中的主页面摄像头实时预览。实体、备注、动作和控件位置不会改变。";
    an.replaceChildren(
      ...temp.map((arg) => {
        const temp2 = Hw[arg];
        const temp3 = il(value, arg);
        return wt({
          value: arg,
          label: temp2.label,
          detail: temp2.group + " · " + ML(arg, temp3)
        });
      })
    );
    ji(filtered, "摄像头实时预览");
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "camera"
    };
    Ge.showModal();
  }
}
function WL() {
  const value = O();
  if (!value || value.type !== "title-button") {
    return;
  }
  const temp = $w(value);
  const filtered = st("title-button").filter(
    ({ component: component }) => component.id !== value.id
  );
  if (!!temp.length && !!filtered.length) {
    Pn.textContent = "应用标题按钮设置";
    Mn.textContent = "应用到主页面标题按钮";
    On.textContent = "按页面区分";
    kn.textContent =
    "将“" +
    componentLabel(value) +
    "”中选定的修改应用到选中的标题按钮。文字内容、图标名称、备注、动作和控件中心位置不会改变。";
    an.replaceChildren(
      ...temp.map((arg) => {
        const temp2 = Bw[arg];
        const temp3 = el(value, arg);
        return wt({
          value: arg,
          label: temp2.label,
          detail: temp2.group + " · " + SL(arg, temp3)
        });
      })
    );
    ji(filtered, "标题按钮");
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "title-button"
    };
    Ge.showModal();
  }
}
function RL() {
  const value = O();
  if (!value || value.type !== "icon-button-effect") {
    return;
  }
  const temp = Vw(value);
  const filtered = st("icon-button-effect").filter(
    ({ component: component }) => component.id !== value.id
  );
  if (!!temp.length && !!filtered.length) {
    Pn.textContent = "应用图标按钮（效果）设置";
    Mn.textContent = "应用到主页面同类型控件";
    On.textContent = "按页面区分";
    kn.textContent =
    "将“" +
    componentLabel(value) +
    "”中选定的修改应用到选中的主页面图标按钮（效果）。实体、备注、动作和按钮位置不会改变。";
    an.replaceChildren(
      ...temp.map((arg) => {
        const temp2 = zw[arg];
        const temp3 = nl(value, arg);
        return wt({
          value: arg,
          label: temp2.label,
          detail: temp2.group + " · " + LL(arg, temp3)
        });
      })
    );
    ji(filtered, "图标按钮（效果）");
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "icon-button-effect"
    };
    Ge.showModal();
  }
}
function HL() {
  const value = O();
  if (!value || value.type !== "air-conditioner") {
    return;
  }
  const temp = Dw(value);
  const filtered = st("air-conditioner").filter(
    ({ component: component }) => component.id !== value.id
  );
  if (!!temp.length && !!filtered.length) {
    Pn.textContent = "应用空调设置";
    Mn.textContent = "应用到主页面同类型控件";
    On.textContent = "按页面区分";
    kn.textContent =
    "将“" +
    componentLabel(value) +
    "”中选定的修改应用到选中的空调控件。实体、备注、文字内容、动作和按钮位置不会改变。";
    an.replaceChildren(
      ...temp.map((arg) => {
        const temp2 = Fw[arg];
        const temp3 = tl(value, arg);
        return wt({
          value: arg,
          label: temp2.label,
          detail: temp2.group + " · " + EL(arg, temp3)
        });
      })
    );
    ji(filtered, "空调");
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "air-conditioner"
    };
    Ge.showModal();
  }
}
function jL() {
  const value = O();
  if (
  !value ||
  !["icon-button", "device-button", "presence-sensor"].includes(value.type))
  {
    return;
  }
  const chosen =
  value.type === "presence-sensor" ?
  TL(value) :
  value.type === "device-button" ?
  "设备按钮" :
  "图标按钮";
  const temp = Ww(value);
  const temp2 = Ho(value);
  const filtered = st(value.type).filter(
    ({ component: component }) =>
    component.id !== value.id && (
    value.type !== "presence-sensor" || Ho(component) === temp2)
  );
  if (!!temp.length && !!filtered.length) {
    Pn.textContent = "应用" + chosen + "设置";
    Mn.textContent = "应用到主页面同类型控件";
    On.textContent = "按页面区分";
    kn.textContent =
    "将“" +
    componentLabel(value) +
    "”中选定的修改应用到选中的主页面" +
    chosen +
    "。实体、备注、图标名称、文字内容和位置不会改变。";
    an.replaceChildren(
      ...temp.map((arg) => {
        const temp3 = PL(value, arg);
        const temp4 = ol(value, arg);
        return wt({
          value: arg,
          label: temp3.label,
          detail: temp3.group + " · " + kL(arg, temp4)
        });
      })
    );
    ji(filtered, chosen);
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: value.type
    };
    Ge.showModal();
  }
}
function qL() {
  const value = O();
  if (!value || value.type !== "line-chart") {
    return;
  }
  const temp = Ow(value);
  const filtered = Rn(h.document.sharedComponents, "line-chart").filter(
    (component) => component.id !== value.id
  );
  if (!!temp.length && !!filtered.length) {
    Pn.textContent = "应用折线图设置";
    Mn.textContent = "应用到折线图";
    On.textContent = "侧边栏通用";
    kn.textContent =
    "将“" +
    componentLabel(value) +
    "”中选定的修改应用到选中的侧边栏折线图。数值实体、备注、动作和位置不会改变。";
    an.replaceChildren(
      ...temp.map((arg) => {
        const temp2 = Mw[arg];
        const temp3 = Qc(value, arg);
        return wt({
          value: arg,
          label: temp2.label,
          detail: temp2.group + " · " + wL(arg, temp3)
        });
      })
    );
    Hp(
      filtered.map((component) =>
      wt({
        value: component.id,
        label: componentLabel(component),
        detail: component.bindings?.entity?.entityId || "未设置数值实体",
        target: true
      })
      )
    );
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "line-chart"
    };
    Ge.showModal();
  }
}
function GL(value, component, arg3) {
  const temp = clone(Ae(value, arg3));
  if (arg3 === "width") {
    const number =
    Number(component.position?.x || 0) +
    Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number =
    Number(component.position?.y || 0) +
    Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (arg3 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (arg3 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [arg3]: temp
  };
}
function UL(value, component, arg3) {
  const temp = clone(al(value, arg3));
  if (arg3 === "width") {
    const number =
    Number(component.position?.x || 0) +
    Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number =
    Number(component.position?.y || 0) +
    Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (arg3 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (arg3 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [arg3]: temp
  };
}
function _L(value, component, arg3) {
  const temp = clone(il(value, arg3));
  if (arg3 === "width") {
    const number =
    Number(component.position?.x || 0) +
    Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number =
    Number(component.position?.y || 0) +
    Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (arg3 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (arg3 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [arg3]: temp
  };
}
function YL(value, component, arg3) {
  const temp = clone(Qc(value, arg3));
  if (arg3 === "width") {
    const number =
    Number(component.position?.x || 0) +
    Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number =
    Number(component.position?.y || 0) +
    Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (arg3 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (arg3 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [arg3]: temp
  };
}
function XL(value, component, arg3) {
  const temp = clone(nl(value, arg3));
  if (arg3 === "width") {
    const number =
    Number(component.position?.x || 0) +
    Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number =
    Number(component.position?.y || 0) +
    Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (arg3 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (arg3 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [arg3]: temp
  };
}
function KL(value, component, arg3) {
  const temp = clone(el(value, arg3));
  if (arg3 === "width") {
    const number =
    Number(component.position?.x || 0) +
    Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number =
    Number(component.position?.y || 0) +
    Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (arg3 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (arg3 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [arg3]: temp
  };
}
function JL(value, component, arg3) {
  const temp = clone(ol(value, arg3));
  if (arg3 === "width") {
    const number =
    Number(component.position?.x || 0) +
    Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number =
    Number(component.position?.y || 0) +
    Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (arg3 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (arg3 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [arg3]: temp
  };
}
function ZL(value, component, arg3) {
  const temp = clone(tl(value, arg3));
  if (arg3 === "width") {
    const number =
    Number(component.position?.x || 0) +
    Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number =
    Number(component.position?.y || 0) +
    Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: number - Number(temp) / 2,
      height: Number(temp)
    };
    return;
  }
  if (arg3 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(temp)
    };
    return;
  }
  if (arg3 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(temp)
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [arg3]: temp
  };
}
mc.addEventListener("click", DL);
uc.addEventListener("click", zL);
lc.addEventListener("click", VL);
zs.addEventListener("click", WL);
dc.addEventListener("click", qL);
Ps.addEventListener("click", RL);
Ys.addEventListener("click", jL);
qd.addEventListener("click", HL);
nN.addEventListener("click", () => Ge.close());
oN.addEventListener("click", () => Ge.close());
Ge.addEventListener("click", (value) => {
  if (value.target === Ge) {
    Ge.close();
  }
});
Ge.addEventListener("close", () => {
  Pt = null;
});
iN.addEventListener("click", () => {
  const sourceId = Pt?.sourceId;
  const type = Pt?.type;
  const value = [
  ...an.querySelectorAll("[data-navigation-style-property]:checked")].
  map((el2) => el2.dataset.navigationStyleProperty);
  const elements = [
  ...mr.querySelectorAll("[data-navigation-target-id]:checked")].
  map((el2) => el2.dataset.navigationTargetId);
  if (!sourceId || !value.length || !elements.length) {
    const chosen =
    type === "panel-frame" ?
    "底图框" :
    type === "camera" ?
    "摄像头实时预览" :
    type === "title-button" ?
    "标题按钮" :
    type === "air-conditioner" ?
    "空调" :
    type === "line-chart" ?
    "折线图" :
    type === "icon-button-effect" ?
    "图标按钮（效果）" :
    type === "icon-button" ?
    "图标按钮" :
    type === "device-button" ?
    "设备按钮" :
    type === "presence-sensor" ?
    "传感器" :
    "导航按钮";
    ke.textContent = "请至少选择一项修改和一个目标" + chosen + "。";
    ke.hidden = false;
    return;
  }
  Ge.close();
  L((arg) => {
    const component = findComponent(arg, sourceId)?.component;
    if (!!component && component.type === type) {
      for (const temp of elements) {
        const component2 = findComponent(arg, temp)?.component;
        if (
        !!component2 &&
        component2.type === type && (
        type !== "presence-sensor" || Ho(component2) === Ho(component)))
        {
          for (const temp2 of value) {
            if (type === "panel-frame") {
              UL(component, component2, temp2);
            } else if (type === "camera") {
              _L(component, component2, temp2);
            } else if (type === "title-button") {
              KL(component, component2, temp2);
            } else if (type === "line-chart") {
              YL(component, component2, temp2);
            } else if (type === "icon-button-effect") {
              XL(component, component2, temp2);
            } else if (type === "air-conditioner") {
              ZL(component, component2, temp2);
            } else if (
            ["icon-button", "device-button", "presence-sensor"].includes(type))
            {
              JL(component, component2, temp2);
            } else {
              GL(component, component2, temp2);
            }
          }
        }
      }
    }
  }).then(() => {
    const element =
    type === "panel-frame" ?
    uc :
    type === "camera" ?
    lc :
    type === "title-button" ?
    zs :
    type === "air-conditioner" ?
    qd :
    type === "line-chart" ?
    dc :
    type === "icon-button-effect" ?
    Ps :
    [
    "icon-button",
    "device-button",
    "presence-sensor"].
    includes(type) ?
    Ys :
    mc;
    if (type === "panel-frame") {
      window.clearTimeout(Dv);
    } else if (type === "camera") {
      window.clearTimeout(Hv);
    } else if (type === "title-button") {
      window.clearTimeout(Wv);
    } else if (type === "air-conditioner") {
      window.clearTimeout(jv);
    } else if (type === "line-chart") {
      window.clearTimeout(zv);
    } else if (type === "icon-button-effect") {
      window.clearTimeout(Vv);
    } else if (
    ["icon-button", "device-button", "presence-sensor"].includes(type))
    {
      window.clearTimeout(Rv);
    } else {
      window.clearTimeout(Fv);
    }
    element.classList.add("applied");
    const temp = window.setTimeout(() => {
      element.classList.remove("applied");
      if (componentId === sourceId) {
        Z();
      }
    }, 1800);
    if (type === "panel-frame") {
      Dv = temp;
    } else if (type === "camera") {
      Hv = temp;
    } else if (type === "title-button") {
      Wv = temp;
    } else if (type === "air-conditioner") {
      jv = temp;
    } else if (type === "line-chart") {
      zv = temp;
    } else if (type === "icon-button-effect") {
      Vv = temp;
    } else if (
    ["icon-button", "device-button", "presence-sensor"].includes(type))
    {
      Rv = temp;
    } else {
      Fv = temp;
    }
  });
});
on.addEventListener("click", () => {
  const hidden = Tt.hidden;
  closeOtherPickerPanels(hidden ? "navigation-icon" : null);
  Tt.hidden = !hidden;
  on.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    Zu(lr.value).
    then(() => {
      k0();
      lr.focus({
        preventScroll: true
      });
    }).
    catch(onError);
  }
});
cr.addEventListener("click", async () => {
  const value = O()?.properties?.icon || "";
  if (value) {
    try {
      await zo(value);
      window.clearTimeout(Iv);
      cr.classList.add("copied");
      Iv = window.setTimeout(() => cr.classList.remove("copied"), 1200);
    } catch (error) {
      onError(error);
    }
  }
});
lr.addEventListener("input", () => {
  window.clearTimeout(Lv);
  Lv = window.setTimeout(() => {
    Zu(lr.value).catch(onError);
  }, 160);
});
dr.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-icon-name]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const icon = ancestorEl.dataset.iconName;
  closeOtherPickerPanels();
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (!component || component.type !== "navigation-button") {
      return;
    }
    const temp2 = Ae(component, "icon");
    const temp3 = Ae(component, "iconVisible");
    component.properties = {
      ...(component.properties || {}),
      icon: icon,
      iconVisible: !!icon
    };
    Kn(temp, "icon", temp2, Ae(component, "icon"));
    Kn(temp, "iconVisible", temp3, Ae(component, "iconVisible"));
  });
});
Qt.addEventListener("click", () => {
  const hidden = Et.hidden;
  closeOtherPickerPanels(hidden ? "ibe-icon" : null);
  Et.hidden = !hidden;
  Qt.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    Qu(Ca.value).
    then(() => {
      M0();
      Ca.focus({
        preventScroll: true
      });
    }).
    catch(onError);
  }
});
wa.addEventListener("click", async () => {
  const value = O()?.properties?.icon || "";
  if (value) {
    try {
      await zo(value);
      window.clearTimeout(Av);
      wa.classList.add("copied");
      Av = window.setTimeout(() => wa.classList.remove("copied"), 1200);
    } catch (error) {
      onError(error);
    }
  }
});
Ca.addEventListener("input", () => {
  window.clearTimeout(Tv);
  Tv = window.setTimeout(() => Qu(Ca.value).catch(onError), 160);
});
Sa.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-icon-name]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const icon = ancestorEl.dataset.iconName;
  closeOtherPickerPanels();
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (!!component && component.type === "icon-button-effect") {
      component.properties = {
        ...(component.properties || {}),
        icon: icon
      };
    }
  });
});
Lt.addEventListener("click", () => {
  const hidden = It.hidden;
  closeOtherPickerPanels(hidden ? "icon-button-icon" : null);
  It.hidden = !hidden;
  Lt.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    ep(za.value).
    then(() => {
      O0();
      za.focus({
        preventScroll: true
      });
    }).
    catch(onError);
  }
});
Da.addEventListener("click", async () => {
  const value = O()?.properties?.icon || "";
  if (value) {
    try {
      await zo(value);
      window.clearTimeout(kv);
      Da.classList.add("copied");
      kv = window.setTimeout(() => Da.classList.remove("copied"), 1200);
    } catch (error) {
      onError(error);
    }
  }
});
za.addEventListener("input", () => {
  window.clearTimeout(Pv);
  Pv = window.setTimeout(() => ep(za.value).catch(onError), 160);
});
Va.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-icon-name]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const icon = ancestorEl.dataset.iconName;
  closeOtherPickerPanels();
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (
    !!component &&
    !!["icon-button", "device-button", "presence-sensor"].includes(
      component.type
    ))
    {
      component.properties = {
        ...(component.properties || {}),
        icon: icon
      };
    }
  });
});
tn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const hidden = je.hidden;
  closeOtherPickerPanels(hidden ? "title-button-icon" : null);
  if (hidden && je.parentElement !== document.body) {
    document.body.append(je);
  }
  je.hidden = !hidden;
  je.style.position = "fixed";
  je.style.zIndex = "760";
  tn.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    op();
    tp(Ia.value).
    then(() => {
      op();
      Ia.focus({
        preventScroll: true
      });
    }).
    catch(onError);
  }
});
La.addEventListener("click", async () => {
  const value = O()?.properties?.icon || "";
  if (value) {
    try {
      await zo(value);
      window.clearTimeout(Ov);
      La.classList.add("copied");
      Ov = window.setTimeout(() => La.classList.remove("copied"), 1200);
    } catch (error) {
      onError(error);
    }
  }
});
Ia.addEventListener("input", () => {
  window.clearTimeout(Mv);
  Mv = window.setTimeout(() => tp(Ia.value).catch(onError), 160);
});
Ta.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-icon-name]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const icon = ancestorEl.dataset.iconName;
  closeOtherPickerPanels();
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (!!component && component.type === "title-button") {
      component.properties = {
        ...(component.properties || {}),
        icon: icon,
        iconVisible: !!icon
      };
    }
  });
});
nn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const hidden = qe.hidden;
  closeOtherPickerPanels(hidden ? "light-statistics-icon" : null);
  if (hidden && qe.parentElement !== document.body) {
    document.body.append(qe);
  }
  qe.hidden = !hidden;
  qe.style.position = "fixed";
  qe.style.zIndex = "760";
  nn.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    ip();
    np(Oa.value).
    then(() => {
      ip();
      Oa.focus({
        preventScroll: true
      });
    }).
    catch(onError);
  }
});
Ma.addEventListener("click", async () => {
  const value = O()?.properties?.icon || "";
  if (value) {
    try {
      await zo(value);
      window.clearTimeout($v);
      Ma.classList.add("copied");
      $v = window.setTimeout(() => Ma.classList.remove("copied"), 1200);
    } catch (error) {
      onError(error);
    }
  }
});
Oa.addEventListener("input", () => {
  window.clearTimeout(Bv);
  Bv = window.setTimeout(() => np(Oa.value).catch(onError), 160);
});
Ba.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-light-statistics-icon-name]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const icon = ancestorEl.dataset.lightStatisticsIconName;
  closeOtherPickerPanels();
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (!!component && component.type === "light-statistics") {
      component.properties = {
        ...(component.properties || {}),
        icon: icon
      };
    }
  });
});
rt.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const hidden = Ie.hidden;
  closeOtherPickerPanels(hidden ? "light-statistics-entity" : null);
  if (hidden && Ie.parentElement !== document.body) {
    document.body.append(Ie);
  }
  Ie.hidden = !hidden;
  Ie.style.position = "fixed";
  Ie.style.zIndex = "760";
  rt.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    Xu(Pa.value);
    ap();
    window.requestAnimationFrame(() => {
      ap();
      Pa.focus({
        preventScroll: true
      });
    });
  }
});
Pa.addEventListener("input", () => Xu(Pa.value));
ka.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-light-statistics-entity-id]");
  if (ancestorEl) {
    closePickerPanel(Ie, rt);
    GN(ancestorEl.dataset.lightStatisticsEntityId);
  }
});
G1.addEventListener("click", () => w0());
ag.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-light-statistics-replace-index]");
  const ancestorEl2 = value.target.closest("[data-light-statistics-remove-index]");
  if (ancestorEl2) {
    UN(Number(ancestorEl2.dataset.lightStatisticsRemoveIndex));
    return;
  }
  if (ancestorEl) {
    Rt = "";
    ko = Number(ancestorEl.dataset.lightStatisticsReplaceIndex);
    Sr = componentId || "";
    ig.hidden = true;
    jn("请选择新的实体。");
    Mr(rt, "选择替换实体");
    rt.click();
  }
});
oi.addEventListener("click", () => {
  const hidden = aa.hidden;
  closeOtherPickerPanels(hidden ? "entity" : null);
  aa.hidden = !hidden;
  oi.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    $r(ra.value);
    dp();
    window.requestAnimationFrame(() => {
      dp();
      ra.focus({
        preventScroll: true
      });
    });
  }
});
ra.addEventListener("input", () => $r(ra.value));
_m.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-entity-id]");
  if (!ancestorEl || !componentId) {
    return;
  }
  const temp = componentId;
  const entityId = ancestorEl.dataset.entityId;
  closeOtherPickerPanels();
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (!component || component.type !== "image") {
      return;
    }
    const text = String(component.bindings?.entity?.entityId || "");
    component.bindings = {
      ...(component.bindings || {})
    };
    component.properties = {
      ...(component.properties || {}),
      fit: "contain"
    };
    if (entityId) {
      component.bindings.entity = {
        entityId: entityId
      };
    } else {
      delete component.bindings.entity;
      for (const temp2 of ["tap", "doubleTap", "hold"]) {
        if (actionNeedsCurrentEntity(component.actions?.[temp2])) {
          delete component.actions[temp2];
        }
      }
    }
    if (entityId !== text) {
      if (entityId ? relatedPopupContext(component, Fr(), Dr()) : null) {
        component.properties.relatedEntities = manualRelatedEntityConfig([]);
      } else {
        delete component.properties.relatedEntities;
      }
    }
  });
});
function _t(value, arg2 = [value]) {
  const temp = Un(value);
  temp.button.addEventListener("click", () => {
    const chosen = arg2.includes(O()?.type) ? O().type : value;
    const temp2 = Un(chosen);
    const hidden = temp.menu.hidden;
    closeOtherPickerPanels(hidden ? temp2.except : null);
    temp.menu.hidden = !hidden;
    temp.button.setAttribute("aria-expanded", String(hidden));
    if (hidden) {
      $r(temp.search.value, chosen);
      yt(chosen);
      window.requestAnimationFrame(() => {
        yt(chosen);
        temp.search.focus({
          preventScroll: true
        });
      });
    }
  });
  temp.search.addEventListener("input", () => {
    const chosen = arg2.includes(O()?.type) ? O().type : value;
    $r(temp.search.value, chosen);
  });
  temp.options.addEventListener("click", (event2) => {
    const ancestorEl = event2.target.closest("[data-entity-id]");
    const temp2 = componentId;
    if (!ancestorEl || !temp2) {
      return;
    }
    const entityId = ancestorEl.dataset.entityId;
    closeOtherPickerPanels();
    L((doc) => {
      const component = findComponent(doc, temp2)?.component;
      if (!component || !arg2.includes(component.type)) {
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
          entityId: entityId
        };
        if (component.type === "light-statistics") {
          for (const temp3 of ["tap", "doubleTap", "hold"]) {
            const temp4 = component.actions?.[temp3];
            if (
            temp4?.type === "toggle" &&
            !entityIdSupportsToggle(entityId) ||
            temp4 && !ACTION_TYPES.includes(temp4.type))
            {
              delete component.actions[temp3];
            }
          }
        }
        if (
        component.type === "air-conditioner" &&
        !Object.keys(component.actions || {}).length)
        {
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
          component.actions = Object.fromEntries(
            Object.entries(component.actions || {}).filter(
              ([, arg]) => !actionNeedsCurrentEntity(arg)
            )
          );
        }
        let temp3 = false;
        for (const temp4 of ["tap", "doubleTap", "hold"]) {
          if (actionNeedsCurrentEntity(component.actions?.[temp4])) {
            delete component.actions[temp4];
            temp3 = true;
          }
        }
        if (
        component.type === "navigation-button" &&
        temp3 &&
        !component.actions.tap)
        {
          const target = new Set(doc.pages.map((arg) => arg.path)).has(
            component.properties?.targetPage
          ) ?
          component.properties.targetPage :
          W.value || doc.pages[0]?.path || "";
          if (target) {
            component.actions.tap = {
              type: "navigate",
              target: target
            };
          }
        }
      }
      if (value === "weather") {
        const entityId2 = le.find(
          (arg) => arg.entityId === "sun.sun"
        )?.entityId;
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
        if (entityId ? relatedPopupContext(component, Fr(), Dr()) : null) {
          component.properties.relatedEntities = manualRelatedEntityConfig([]);
        } else {
          delete component.properties.relatedEntities;
        }
      }
    });
  });
}
_t("weather");
_t("line-chart");
_t("title-button");
_t("light-statistics");
_t("icon-button-effect");
_t("icon-button", ["icon-button", "device-button", "presence-sensor"]);
_t("vacuum-map");
_t("camera");
_t("air-conditioner");
_t("navigation-button");
const rl = "推荐去 HA 复制实体 ID，粘贴搜索。可精准选择。";
let Me = null;
const { deferUntilEntitiesLoaded: sl } = createEditorPickerLifecycle({
  getEntitiesLoaded: () => Tu,
  getEntityLoadPromise: () => Po,
  loadEntities: jc,
  reportError: onError
});
function QL() {
  Me?.close();
}
function qi({
  kind: kind,
  title: value,
  subtitle: arg = "",
  searchPlaceholder: arg2,
  triggerButton: triggerButton,
  pageSize: pageSize,
  initialPage: arg3 = 1,
  selectedText = "",
  emptyText: arg4,
  itemClass: arg5 = "",
  getPage: arg6,
  renderItem: arg7,
  renderLeadingItems: arg8 = null,
  renderTrailingItems: arg9 = null,
  buildToolbar: arg10 = null,
  onSelect: arg11,
  onDelete: arg12 = null,
  onItemHover: arg13 = null,
  closeLegacyPickers: arg14 = true,
  renderSelectedActions: arg15 = null,
  renderSelectedContent: arg16 = null
}) {
  QL();
  if (arg14) {
    closeOtherPickerPanels();
  }
  const dialog = document.createElement("dialog");
  dialog.className = "editor-paged-picker-dialog";
  dialog.dataset.editorPickerKind = kind;
  const temp = document.createElement("div");
  temp.className = "editor-paged-picker-card" + (arg10 ? " with-toolbar" : "");
  const temp2 = document.createElement("div");
  temp2.className = "editor-paged-picker-heading";
  const temp3 = document.createElement("div");
  temp3.className = arg ?
  "editor-paged-picker-heading-copy has-subtitle" :
  "editor-paged-picker-heading-copy";
  const element = document.createElement("strong");
  element.textContent = value;
  const element2 = document.createElement("span");
  element2.textContent = arg;
  temp3.append(element);
  if (arg) {
    temp3.append(element2);
  }
  const element3 = document.createElement("button");
  element3.type = "button";
  element3.className = "editor-paged-picker-close";
  element3.setAttribute("aria-label", "关闭");
  element3.textContent = "×";
  temp2.append(temp3, element3);
  const toolbar = document.createElement("div");
  toolbar.className = "editor-paged-picker-toolbar";
  toolbar.hidden = !arg10;
  const temp4 = document.createElement("label");
  temp4.className = "editor-paged-picker-search";
  const element4 = document.createElement("input");
  element4.type = "search";
  element4.placeholder = arg2;
  element4.autocomplete = "off";
  temp4.append(element4);
  const element5 = document.createElement("div");
  element5.className = "editor-paged-picker-selected";
  const selectedValueText =
  selectedText || (kind === "entity" ? "不使用实体" : "");
  element5.hidden = !selectedValueText;
  if (selectedValueText) {
    const element11 = document.createElement("span");
    element11.className = "editor-paged-picker-current-label";
    element11.textContent = "当前选择";
    element5.append(element11);
    if (arg16) {
      element5.append(
        ...(arg16({
          selectedText: selectedText,
          selectedValueText: selectedValueText
        }) || [])
      );
    } else {
      const element12 = document.createElement("strong");
      element12.textContent = selectedValueText;
      element12.title = selectedValueText;
      element5.append(element12);
    }
  }
  if (arg15) {
    const temp11 = arg15({
      controller: null
    });
    if (temp11?.length) {
      element5.classList.add("has-actions");
      element5.hidden = false;
      element5.append(...temp11);
    }
  }
  const temp5 = document.createElement("div");
  temp5.className = ("editor-paged-picker-items " + arg5).trim();
  temp5.setAttribute("role", "listbox");
  const temp6 = document.createElement("div");
  temp6.className = "editor-paged-picker-footer";
  const element6 = document.createElement("span");
  element6.className = "editor-paged-picker-status";
  const temp7 = document.createElement("div");
  temp7.className = "editor-paged-picker-pagination";
  const element7 = document.createElement("button");
  element7.type = "button";
  element7.textContent = "上一页";
  const element8 = document.createElement("input");
  element8.type = "text";
  element8.inputMode = "numeric";
  element8.setAttribute("aria-label", "页码");
  const element9 = document.createElement("span");
  const element10 = document.createElement("button");
  element10.type = "button";
  element10.textContent = "下一页";
  temp7.append(element7, element8, element9, element10);
  temp6.append(element6, temp7);
  temp.append(temp2, toolbar, temp4, element5, temp5, temp6);
  dialog.append(temp);
  document.body.append(dialog);
  let temp8 = null;
  let temp9 = 0;
  let temp10 = false;
  const state = {
    page: Math.max(1, Number(arg3) || 1),
    total: 0,
    pageCount: 1,
    query: ""
  };
  const controller = {
    kind: kind,
    dialog: dialog,
    triggerButton: triggerButton,
    state: state,
    refresh({ resetPage: arg17 = false } = {}) {
      if (arg17) {
        state.page = 1;
      }
      return loadPickerPage();
    },
    rebuildToolbar() {
      if (!!arg10 && !temp10) {
        toolbar.replaceChildren();
        arg10({
          toolbar: toolbar,
          controller: controller
        });
        toolbar.hidden = !toolbar.childElementCount;
      }
    },
    close() {
      if (!temp10) {
        if (dialog.open) {
          dialog.close();
        } else {
          helper();
        }
      }
    }
  };
  function helper() {
    if (!temp10) {
      temp10 = true;
      window.clearTimeout(temp8);
      temp9 += 1;
      triggerButton?.setAttribute("aria-expanded", "false");
      temp5.replaceChildren();
      toolbar.replaceChildren();
      if (dialog.contains(Jt)) {
        document.body.append(Jt);
      }
      dialog.remove();
      if (Me === controller) {
        Me = null;
      }
      Qe();
    }
  }
  async function loadPickerPage() {
    const temp11 = ++temp9;
    temp5.setAttribute("aria-busy", "true");
    element6.textContent = "正在加载…";
    element7.disabled = true;
    element10.disabled = true;
    try {
      const temp12 = await arg6({
        query: state.query,
        page: state.page,
        pageSize: pageSize
      });
      if (temp10 || temp11 !== temp9) {
        return;
      }
      state.total = Math.max(0, Number(temp12.total) || 0);
      state.pageCount = Math.max(1, Math.ceil(state.total / pageSize));
      if (state.page > state.pageCount) {
        state.page = state.pageCount;
        await loadPickerPage();
        return;
      }
      const chosen = arg8 ? arg8(state) : [];
      const mapped = (temp12.items || []).map((arg17) => arg7(arg17));
      if (!mapped.length) {
        const element11 = document.createElement("div");
        element11.className = "editor-paged-picker-empty";
        element11.textContent = arg4;
        mapped.push(element11);
      }
      if (arg9 && state.page === state.pageCount) {
        mapped.push(...(arg9(state) || []));
      }
      temp5.replaceChildren(...chosen, ...mapped);
      temp5.scrollTop = 0;
      element8.value = String(state.page);
      element9.textContent = "/ " + state.pageCount;
      element6.textContent =
      "第 " +
      state.page +
      " / " +
      state.pageCount +
      " 页 · 共 " +
      state.total +
      " 项";
      element7.disabled = state.page <= 1;
      element10.disabled = state.page >= state.pageCount;
    } catch (error) {
      if (temp10 || temp11 !== temp9) {
        return;
      }
      const element11 = document.createElement("div");
      element11.className = "editor-paged-picker-empty error";
      element11.textContent = "加载失败，请稍后重试";
      temp5.replaceChildren(element11);
      element6.textContent = "加载失败";
      onError(error);
    } finally {
      if (!temp10 && temp11 === temp9) {
        temp5.removeAttribute("aria-busy");
      }
    }
  }
  element3.addEventListener("click", () => controller.close());
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    controller.close();
  });
  dialog.addEventListener("click", (event2) => {
    if (event2.target === dialog) {
      controller.close();
    }
  });
  dialog.addEventListener("close", helper, {
    once: true
  });
  element4.addEventListener("input", () => {
    window.clearTimeout(temp8);
    temp8 = window.setTimeout(() => {
      state.query = element4.value.trim();
      state.page = 1;
      loadPickerPage();
    }, 160);
  });
  element7.addEventListener("click", () => {
    if (!(state.page <= 1)) {
      state.page -= 1;
      loadPickerPage();
    }
  });
  element10.addEventListener("click", () => {
    if (!(state.page >= state.pageCount)) {
      state.page += 1;
      loadPickerPage();
    }
  });
  element8.addEventListener("change", () => {
    const temp11 = Math.trunc(Number(element8.value));
    state.page = clampNumber(
      Number.isFinite(temp11) ? temp11 : state.page,
      1,
      state.pageCount
    );
    loadPickerPage();
  });
  temp5.addEventListener("pointerover", (event2) => {
    const ancestorEl = event2.target.closest("[data-editor-picker-value]");
    if (!!ancestorEl && !ancestorEl.contains(event2.relatedTarget)) {
      arg13?.(ancestorEl.dataset.editorPickerValue, ancestorEl);
    }
  });
  temp5.addEventListener("pointerleave", Qe);
  temp5.addEventListener("scroll", Qe);
  temp5.addEventListener("click", (event) => {
    const ancestorEl = event.target.closest("[data-delete-user-asset]");
    if (ancestorEl && arg12) {
      event.preventDefault();
      event.stopPropagation();
      const deleteUserAsset = ancestorEl.dataset.deleteUserAsset;
      controller.close();
      arg12(deleteUserAsset);
      return;
    }
    const ancestorEl2 = event.target.closest("[data-editor-picker-value]");
    if (!ancestorEl2 || !temp5.contains(ancestorEl2)) {
      return;
    }
    const editorPickerValue = ancestorEl2.dataset.editorPickerValue;
    controller.close();
    arg11(editorPickerValue);
  });
  element5.addEventListener("click", (event2) => {
    const ancestorEl = event2.target.closest("[data-editor-picker-value]");
    if (!ancestorEl || !element5.contains(ancestorEl)) {
      return;
    }
    const editorPickerValue = ancestorEl.dataset.editorPickerValue;
    controller.close();
    arg11(editorPickerValue);
  });
  Me = controller;
  triggerButton?.setAttribute("aria-expanded", "true");
  controller.rebuildToolbar();
  dialog.showModal();
  loadPickerPage();
  window.requestAnimationFrame(() =>
  element4.focus({
    preventScroll: true
  })
  );
  return controller;
}
function Gi(value, arg2, arg3) {
  const temp = document.createElement("button");
  temp.type = "button";
  temp.dataset[arg2] = arg3;
  value.replaceChildren(temp);
  temp.click();
  value.replaceChildren();
}
function eI(triggerButton) {
  const component = O();
  const value = [
  {
    button: on,
    title: "选择导航图标",
    options: dr,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: "不使用图标"
  },
  {
    button: Qt,
    title: "选择效果按钮图标",
    options: Sa,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: "不使用图标"
  },
  {
    button: Lt,
    title: "选择按钮图标",
    options: Va,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear:
    component?.type === "device-button" ? "跟随实体图标" : "不使用图标"
  },
  {
    button: tn,
    title: "选择标题图标",
    options: Ta,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: "不使用图标"
  },
  {
    button: nn,
    title: "选择统计图标",
    options: Ba,
    datasetKey: "lightStatisticsIconName",
    current: String(
      Object.hasOwn(component?.properties || {}, "icon") ?
      component?.properties?.icon || "" :
      "mdi:lightbulb-group-outline"
    ),
    clear: "不使用图标"
  }].
  find((event2) => event2.button === triggerButton);
  if (!value) {
    return false;
  }
  const temp = qi({
    kind: "icon",
    title: value.title,
    searchPlaceholder: "搜索图标名称",
    triggerButton: triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.icon,
    selectedText: "",
    emptyText: "没有匹配的图标",
    itemClass: "icon-grid",
    async getPage({ query: arg, page: arg2, pageSize: arg3 }) {
      const number = (arg2 - 1) * arg3;
      const temp2 = await J(
        "/icons?query=" +
        encodeURIComponent(arg) +
        "&limit=" +
        arg3 +
        "&offset=" +
        number
      );
      return {
        items: temp2.items || [],
        total: Number(temp2.total) || 0
      };
    },
    renderLeadingItems: () => [],
    renderSelectedActions: () => [
    Object.assign(document.createElement("span"), {
      className: "editor-paged-picker-current-label",
      textContent: "当前选择"
    }),
    sE(value.current, value.clear),
    zr(value.clear, !value.current)],

    renderItem(arg) {
      const temp2 = B0(arg, value.current, "editorPickerValue");
      temp2.dataset.editorPickerValue = arg.name;
      return temp2;
    },
    onSelect: (onSelect) => Gi(value.options, value.datasetKey, onSelect)
  });
  return true;
}
function Yw(triggerButton) {
  const component = O();
  const value =
  triggerButton === oi ?
  "image" :
  triggerButton === pi &&
  ["icon-button", "device-button", "presence-sensor"].includes(
    component?.type
  ) ?
  component.type :
  [
  "weather",
  "line-chart",
  "title-button",
  "light-statistics",
  "icon-button-effect",
  "vacuum-map",
  "camera",
  "air-conditioner",
  "navigation-button"].
  find((arg) => Un(arg).button === triggerButton);
  if (!value) {
    return false;
  }
  const temp = componentId;
  if (
  sl(
    triggerButton,
    () => Yw(triggerButton),
    () => componentId === temp
  ))
  {
    return true;
  }
  const temp2 = Un(value);
  const flag = component?.bindings?.entity?.entityId || "";
  const flag2 = qn(value).find((arg) => arg.entityId === flag) || null;
  const flag3 = kr()[0] || null;
  const temp3 = $0(value, "").findIndex(
    (arg) => arg.entityId === flag
  );
  qi({
    kind: "entity",
    title: "选择实体",
    subtitle: lE(value) + " · " + rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(temp3, flag3),
    selectedText: flag || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({ query: arg, page: arg2 }) {
      const temp4 = $0(value, arg);
      return editorEntityPickerPage(temp4, arg2, flag3);
    },
    renderLeadingItems: (renderLeadingItems) =>
    renderLeadingItems.page === 1 && flag3 ? [_n(flag3, flag)] : [],
    renderSelectedContent: () => [mp(flag2)],
    renderSelectedActions: () => [zr("不使用实体", !flag)],
    renderItem: (renderItem) => _n(renderItem, flag),
    onSelect: (onSelect) => Gi(temp2.options, "entityId", onSelect)
  });
  return true;
}
function Xw() {
  if (O()?.type !== "light-statistics") {
    return false;
  }
  const value = componentId;
  if (
  sl(rt, Xw, () => componentId === value && O()?.type === "light-statistics"))
  {
    return true;
  }
  const callback = (arg) => {
    const temp3 = String(arg || "").
    trim().
    toLocaleLowerCase("zh-CN");
    return qn("light-statistics").
    map((entity, index) => ({
      entity: entity,
      index: index,
      support: lightStatisticsEntitySupport(entity)
    })).
    filter(
      ({ entity: arg2 }) =>
      !temp3 ||
      (ct(arg2) + " " + fe(arg2)).
      toLocaleLowerCase("zh-CN").
      includes(temp3)
    ).
    sort(
      (arg2, arg22) =>
      Number(arg22.support.supported) - Number(arg2.support.supported) ||
      +(fe(arg22.entity) === "light") - +(fe(arg2.entity) === "light") ||
      arg2.index - arg22.index
    ).
    map(({ entity: arg2 }) => arg2);
  };
  const temp = callback("").findIndex((arg) => arg.entityId === Rt);
  const flag = kr()[0] || null;
  const temp2 = qi({
    kind: "entity",
    title: ko >= 0 ? "选择替换实体" : "添加统计实体",
    subtitle: rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: rt,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(temp, flag),
    selectedText: Rt || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    closeLegacyPickers: false,
    getPage({ query: arg, page: arg2 }) {
      const temp3 = callback(arg);
      return editorEntityPickerPage(temp3, arg2, flag);
    },
    renderLeadingItems: (renderLeadingItems) =>
    renderLeadingItems.page === 1 && flag ? [_n(flag, Rt)] : [],
    renderItem: (renderItem) => _n(renderItem, Rt),
    onSelect: (onSelect) => Gi(ka, "lightStatisticsEntityId", onSelect)
  });
  return true;
}
function Kw(triggerButton) {
  const value = triggerButton.closest("[data-action-trigger]");
  const element = value?.querySelector("[data-popup-entity]");
  const el2 = value?.querySelector("[data-popup-entity-options]");
  if (!value || !element || !el2) {
    return false;
  }
  if (
  sl(
    triggerButton,
    () => Kw(triggerButton),
    () => value.isConnected
  ))
  {
    return true;
  }
  const flag = element.value || "";
  const flag2 = le.find((arg) => arg.entityId === flag) || null;
  const flag3 = kr()[0] || null;
  const readEntityId = (arg) => {
    const temp2 = String(arg || "").
    trim().
    toLocaleLowerCase("zh-CN");
    return le.filter(
      (arg2) =>
      !arg2.virtual && (
      !temp2 ||
      (ct(arg2) + " " + arg2.entityId).
      toLocaleLowerCase("zh-CN").
      includes(temp2))
    );
  };
  const temp = readEntityId("").findIndex((arg) => arg.entityId === flag);
  qi({
    kind: "entity",
    title: "选择弹窗实体",
    subtitle: rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(temp, flag3),
    selectedText: flag || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({ query: arg, page: arg2 }) {
      const temp2 = readEntityId(arg);
      return editorEntityPickerPage(temp2, arg2, flag3);
    },
    renderItem: (renderItem) => _n(renderItem, flag),
    renderLeadingItems: (renderLeadingItems) =>
    renderLeadingItems.page === 1 && flag3 ? [_n(flag3, flag)] : [],
    renderSelectedContent: () => [mp(flag2)],
    renderSelectedActions: () => [zr("不使用实体", !flag)],
    onSelect: (onSelect) => Gi(el2, "popupActionEntityId", onSelect)
  });
  return true;
}
function Jw() {
  if (!Li.open) {
    return false;
  }
  if (sl(rn, Jw, () => Li.open)) {
    return true;
  }
  const value = he.elements.entityId.value || "";
  const flag = le.find((arg) => arg.entityId === value) || null;
  const flag2 = kr()[0] || null;
  const readEntityId = (arg) => {
    const temp2 = String(arg || "").
    trim().
    toLocaleLowerCase("zh-CN");
    return le.
    map((entity, index) => ({
      entity: entity,
      index: index
    })).
    filter(
      ({ entity: arg2 }) =>
      !arg2.virtual && (
      !temp2 ||
      (ct(arg2) + " " + arg2.entityId).
      toLocaleLowerCase("zh-CN").
      includes(temp2))
    ).
    sort(
      (arg2, arg22) =>
      Number(
        popupModuleEntityRecommended(arg22.entity, he.elements.type.value)
      ) -
      Number(
        popupModuleEntityRecommended(
          arg2.entity,
          he.elements.type.value
        )
      ) || arg2.index - arg22.index
    ).
    map(({ entity: arg2 }) => arg2);
  };
  const temp = readEntityId("").findIndex((arg) => arg.entityId === value);
  qi({
    kind: "entity",
    title: "选择模块实体",
    subtitle: rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: rn,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(temp, flag2),
    selectedText: value || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({ query: arg, page: arg2 }) {
      const temp2 = readEntityId(arg);
      return editorEntityPickerPage(temp2, arg2, flag2);
    },
    renderItem: (renderItem) => _n(renderItem, value),
    renderLeadingItems: (renderLeadingItems) =>
    renderLeadingItems.page === 1 && flag2 ? [_n(flag2, value)] : [],
    renderSelectedContent: () => [mp(flag)],
    renderSelectedActions: () => [zr("不使用实体", !value)],
    onSelect: (onSelect) => Gi(Ii, "popupModuleEntityId", onSelect)
  });
  return true;
}
function tI(triggerButton) {
  const value =
  triggerButton === Cn ? "image" : triggerButton === En ? "ibe" : "";
  if (!value) {
    return false;
  }
  const flag = value === "image";
  const component = O();
  const chosen = flag ?
  component?.properties?.assetId || "" :
  component?.properties?.effectAssetId || "";
  const temp = Ut(chosen);
  gn({
    refreshInspector: false
  }).
  then(() => {
    if (Me?.triggerButton === triggerButton) {
      Me.syncAssetToolbar?.();
      Me.refresh();
    }
  }).
  catch(onError);
  const temp2 = F0(value).findIndex((arg) => Vc(arg, chosen));
  qi({
    kind: value + "-asset",
    title: flag ? "选择控件图片" : "选择效果图片",
    subtitle: "我的图片与默认素材 · 固定分页加载",
    searchPlaceholder: "搜索图片名称",
    triggerButton: triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.asset,
    initialPage:
    temp2 < 0 ? 1 : Math.floor(temp2 / EDITOR_PICKER_PAGE_SIZES.asset) + 1,
    selectedText: temp?.name || chosen || "不使用图片",
    emptyText: "没有匹配的图片",
    itemClass: "asset-grid",
    getPage({ query: arg, page: arg2, pageSize: arg3 }) {
      const temp3 = F0(value, arg);
      const number = (arg2 - 1) * arg3;
      return {
        items: temp3.slice(number, number + arg3),
        total: temp3.length
      };
    },
    renderSelectedContent: () => [cE(temp)],
    renderSelectedActions: () => [zr("不使用图片", !chosen)],
    renderItem(arg) {
      const temp3 = bp(arg, chosen);
      const el2 = temp3.matches?.("[data-asset-id]") ?
      temp3 :
      temp3.querySelector("[data-asset-id]");
      if (el2) {
        el2.dataset.editorPickerValue = arg.assetId;
      }
      return temp3;
    },
    buildToolbar: (buildToolbar) => dE(value, buildToolbar),
    onItemHover: (onItemHover, onItemHover2) =>
    hp(Ut(onItemHover), onItemHover2, Me?.dialog),
    onDelete: Qw,
    onSelect: (onSelect) => Gi(flag ? zt : en, "assetId", onSelect)
  })?.dialog.append(Jt);
  return true;
}
function jp(value, arg2) {
  const chosen = arg2 === "user" ? "user" : "builtin";
  if (value === "image") {
    Vt = chosen;
    Sn.value = "";
    Yn("image");
    Ro("image");
    if (Me?.kind === "image-asset") {
      Me.rebuildToolbar();
      Me.refresh({
        resetPage: true
      });
    } else {
      Wr();
      Vr();
    }
  } else {
    Wt = chosen;
    Ln.value = "";
    Yn("ibe");
    Ro("ibe");
    if (Me?.kind === "ibe-asset") {
      Me.rebuildToolbar();
      Me.refresh({
        resetPage: true
      });
    } else {
      Hr();
      Rr();
    }
  }
}
async function Zw(value, arg2) {
  const list = [...(value || [])];
  if (!list.length) {
    return;
  }
  const chosen = arg2 === "image" ? Ym : hf;
  chosen.disabled = true;
  const list2 = [];
  try {
    for (const body of list) {
      if (!/\.(png|jpe?g|webp|svg)$/i.test(body.name)) {
        list2.push(body.name + "：仅支持 PNG、JPG、JPEG、WebP 和 SVG");
        continue;
      }
      try {
        await J("/assets/user", {
          method: "POST",
          body: body,
          headers: {
            "Content-Type": body.type || "application/octet-stream",
            "X-File-Name": encodeURIComponent(body.name)
          }
        });
      } catch (error) {
        list2.push(body.name + "：" + error.message);
      }
    }
    await gn({
      refreshInspector: false
    });
    jp(arg2, "user");
    if (list2.length) {
      onError(new Error(list2.join("\n")));
    }
  } finally {
    chosen.disabled = false;
  }
}
function Qw(value) {
  const temp = Ut(value);
  if (!temp || temp.source !== "user") {
    return;
  }
  const callback = (arg) =>
  Array.isArray(arg) ?
  arg.some(callback) :
  arg && typeof arg == "object" ?
  Object.values(arg).some(callback) :
  arg === temp.assetId;
  if (callback(h?.document)) {
    closeOtherPickerPanels();
    onError(
      new Error("这张图片正在被当前仪表盘或弹窗使用，请先替换或移除后再删除。")
    );
    return;
  }
  Lu = temp.assetId;
  hN.textContent = "“" + temp.name + "”";
  closeOtherPickerPanels();
  Lo.showModal();
}
function eC(kind, folderName) {
  if (!fp(kind === "image" ? Vt : Wt, folderName)) {
    return;
  }
  const value = uE(folderName);
  const number = "studio3d:" + folderName + "/";
  const callback = (arg) =>
  Array.isArray(arg) ?
  arg.some(callback) :
  arg && typeof arg == "object" ?
  Object.values(arg).some(callback) :
  typeof arg == "string" && arg.startsWith(number);
  if (callback(h?.document)) {
    onError(
      new Error(
        "这个文件夹中的图片正在被当前仪表盘或弹窗使用，请先替换或移除后再删除。"
      )
    );
    return;
  }
  Cc = {
    kind: kind,
    folderName: folderName
  };
  vN.textContent = "“" + folderName + "”";
  wN.textContent = String(value.length);
  Bn.showModal();
}
function nI() {
  Yn("image");
  Yn("ibe");
  Wr(Sn.value);
  Hr(Ln.value);
  if (Me?.kind === "image-asset" || Me?.kind === "ibe-asset") {
    Me.syncAssetToolbar?.();
    Me.refresh({
      resetPage: true
    });
  }
  if (!Re.hidden) {
    Vr();
  }
  if (!He.hidden) {
    Rr();
  }
}
Re.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-image-asset-source]");
  if (ancestorEl) {
    jp("image", ancestorEl.dataset.imageAssetSource);
  }
});
He.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-ibe-asset-source]");
  if (ancestorEl) {
    jp("ibe", ancestorEl.dataset.ibeAssetSource);
  }
});
Ym.addEventListener("click", () => sa.click());
hf.addEventListener("click", () => xa.click());
sa.addEventListener("change", async () => {
  await Zw(sa.files, "image");
  sa.value = "";
});
xa.addEventListener("change", async () => {
  await Zw(xa.files, "ibe");
  xa.value = "";
});
for (const t of [zt, en]) {
  t.addEventListener("click", (event) => {
    const value = event.target.closest("[data-delete-user-asset]");
    if (value) {
      event.preventDefault();
      event.stopPropagation();
      Qw(value.dataset.deleteUserAsset);
    }
  });
}
fN.addEventListener("click", () => Lo.close());
gN.addEventListener("click", () => Lo.close());
Lo.addEventListener("click", (value) => {
  if (value.target === Lo) {
    Lo.close();
  }
});
wu.addEventListener("click", async () => {
  const value = String(Lu || "").replace(/^user:/, "");
  if (/^[0-9a-f]{32}$/.test(value)) {
    wu.disabled = true;
    try {
      await J("/assets/user/" + value, {
        method: "DELETE"
      });
      Lu = null;
      Lo.close();
      await gn();
    } catch (error) {
      if (error?.code === "ASSET_IN_USE") {
        onError(
          new Error(
            "这张图片仍被户型图绘制或仪表盘使用，请先移除引用后再删除。"
          )
        );
      } else {
        onError(error);
      }
    } finally {
      wu.disabled = false;
    }
  }
});
bN.addEventListener("click", () => Bn.close());
yN.addEventListener("click", () => Bn.close());
Bn.addEventListener("click", (value) => {
  if (value.target === Bn) {
    Bn.close();
  }
});
Bn.addEventListener("close", () => {
  if (!yc.disabled) {
    Cc = null;
  }
});
yc.addEventListener("click", async () => {
  const value = Cc;
  if (value?.folderName) {
    yc.disabled = true;
    try {
      await J("/studio3d/exports", {
        method: "DELETE",
        headers: {
          "X-Export-Folder": encodeURIComponent(value.folderName)
        }
      });
      Cc = null;
      Bn.close();
      await gn({
        refreshInspector: false
      });
      nI();
    } catch (error) {
      if (error?.code === "STUDIO3D_EXPORT_IN_USE") {
        onError(
          new Error(
            "这个文件夹中的图片仍被仪表盘、弹窗或户型图绘制使用，请先移除引用后再删除。"
          )
        );
      } else {
        onError(error);
      }
    } finally {
      yc.disabled = false;
    }
  }
});
Cn.addEventListener("click", async () => {
  const hidden = Re.hidden;
  closeOtherPickerPanels(hidden ? "asset" : null);
  Re.hidden = !hidden;
  Cn.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    try {
      await gn({
        refreshInspector: false
      });
      Yn("image");
    } catch (error) {
      onError(error);
    }
    Wr(Sn.value);
    Vr();
    window.requestAnimationFrame(() => {
      Vr();
      Sn.focus({
        preventScroll: true
      });
    });
  }
});
po.addEventListener("change", () => {
  ln = po.value;
  Sn.value = "";
  Ro("image");
  Wr();
});
Sn.addEventListener("input", () => Wr(Sn.value));
zt.addEventListener("pointerover", (value) => {
  const ancestorEl = value.target.closest("[data-asset-id]");
  if (!ancestorEl || ancestorEl.contains(value.relatedTarget)) {
    return;
  }
  const temp = Ut(ancestorEl.dataset.assetId);
  hp(temp, ancestorEl);
});
zt.addEventListener("pointerleave", Qe);
zt.addEventListener("scroll", Qe);
zt.addEventListener("click", async (value) => {
  const ancestorEl = value.target.closest("[data-asset-id]");
  if (!ancestorEl || !componentId) {
    return;
  }
  const temp = componentId;
  const assetId = ancestorEl.dataset.assetId;
  Qe();
  closeOtherPickerPanels();
  if (!assetId) {
    L((arg) => {
      const component = findComponent(arg, temp)?.component;
      if (!!component && component.type === "image") {
        component.properties = {
          ...(component.properties || {}),
          fit: "contain"
        };
        delete component.properties.assetId;
        delete component.properties.naturalWidth;
        delete component.properties.naturalHeight;
      }
    });
    return;
  }
  const temp2 = Ut(assetId);
  if (temp2) {
    try {
      const temp3 = await gp(temp2);
      L((arg) => {
        const component = findComponent(arg, temp)?.component;
        if (!!component && component.type === "image") {
          V0(component, assetId, temp3);
        }
      });
    } catch (error) {
      onError(error);
    }
  }
});
En.addEventListener("click", async () => {
  const hidden = He.hidden;
  closeOtherPickerPanels(hidden ? "ibe-asset" : null);
  He.hidden = !hidden;
  En.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    try {
      await gn({
        refreshInspector: false
      });
      Yn("ibe");
    } catch (error) {
      onError(error);
    }
    Hr(Ln.value);
    Rr();
    window.requestAnimationFrame(() => {
      Rr();
      Ln.focus({
        preventScroll: true
      });
    });
  }
});
ho.addEventListener("change", () => {
  dn = ho.value;
  Ln.value = "";
  Ro("ibe");
  Hr();
});
Ln.addEventListener("input", () => Hr(Ln.value));
en.addEventListener("pointerover", (value) => {
  const ancestorEl = value.target.closest("[data-asset-id]");
  if (!!ancestorEl && !ancestorEl.contains(value.relatedTarget)) {
    hp(Ut(ancestorEl.dataset.assetId), ancestorEl, He);
  }
});
en.addEventListener("pointerleave", Qe);
en.addEventListener("scroll", Qe);
en.addEventListener("click", async (value) => {
  const ancestorEl = value.target.closest("[data-asset-id]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const assetId = ancestorEl.dataset.assetId;
  Qe();
  closeOtherPickerPanels();
  const chosen = assetId ? Ut(assetId) : null;
  let temp2 = null;
  if (chosen) {
    try {
      temp2 = await gp(chosen);
    } catch (error) {
      onError(error);
      return;
    }
  }
  L((arg) => {
    const component = findComponent(arg, temp)?.component;
    if (!!component && component.type === "icon-button-effect") {
      component.properties = {
        ...(component.properties || {})
      };
      if (assetId && temp2) {
        component.properties.effectAssetId = assetId;
        component.properties.effectNaturalWidth = temp2.width;
        component.properties.effectNaturalHeight = temp2.height;
        delete component.properties.effectWidth;
        delete component.properties.effectHeight;
      } else {
        delete component.properties.effectAssetId;
        delete component.properties.effectNaturalWidth;
        delete component.properties.effectNaturalHeight;
      }
    }
  });
});
Gm.addEventListener("click", () => ow("undo"));
Um.addEventListener("click", () => ow("redo"));
f1.addEventListener("click", () => {
  if (!bt || !h) {
    ni.close();
    return;
  }
  const value = bt;
  bt = null;
  h = {
    ...h,
    document: clone(value.document)
  };
  componentId = findComponent(h.document, value.selectedComponentId) ?
  value.selectedComponentId :
  null;
  const list = Array.isArray(value.selectedComponentIds) ?
  value.selectedComponentIds.filter((arg) =>
  findComponent(h.document, arg)
  ) :
  [];
  selectedComponentIds = new Set(list.length ? list : componentId ? [componentId] : []);
  we = componentId;
  pe.undo = Array.isArray(value.undo) ? clone(value.undo) : [];
  pe.redo = Array.isArray(value.redo) ? clone(value.redo) : [];
  ni.close();
  qr(value.selectedPath || null);
  hn();
  Xn();
});
m1.addEventListener("click", () => {
  Gc(h?.projectId);
  bt = null;
  ni.close();
  hn();
  Xn();
});
ni.addEventListener("cancel", (event) => event.preventDefault());
d1.addEventListener("click", () => uo.close());
u1.addEventListener("click", () => uo.close());
uo.addEventListener("click", (value) => {
  if (value.target === uo) {
    uo.close();
  }
});
Am.addEventListener("click", () => $c("shared"));
Pm.addEventListener("click", () => $c("page"));
vs.addEventListener("click", () => {
  if (!vs.disabled) {
    WN();
    Xo.showModal();
  }
});
bS.addEventListener("click", () => Xo.close());
Xo.addEventListener("click", (value) => {
  if (value.target === Xo) {
    Xo.close();
  }
});
wl.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-template-id]");
  const inputValue = W.value;
  if (!ancestorEl || !inputValue) {
    return;
  }
  const temp = vc;
  const chosen = De ? findComponent(h?.document, De) : null;
  const chosen2 = chosen?.component?.type === "group" ? chosen.component : null;
  const chosen3 = chosen2 ? chosen.scope : temp;
  const id2 = newId("component");
  Xo.close();
  componentId = id2;
  selectedComponentIds = new Set([id2]);
  we = id2;
  const error = L((document) => {
    const found = document.pages.find((arg) => arg.path === inputValue);
    if (!found) {
      throw new Error("当前页面不存在。");
    }
    const chosen4 = chosen2 ? findComponent(document, chosen2.id) : null;
    const chosen5 =
    chosen4?.component?.type === "group" ? chosen4.component : null;
    const chosen6 =
    temp === "shared" ? document.sharedComponents : found.components;
    const chosen7 = chosen5 ? chosen5.children ||= [] : chosen6;
    const chosen8 =
    ancestorEl.dataset.templateId === "navigation-button" ?
    "导航按钮" :
    ancestorEl.dataset.templateId === "floorplan-auto-diagram" ?
    "户型图自动导图" :
    ancestorEl.dataset.templateId === "icon-button-effect" ?
    "图标按钮（效果）" :
    ancestorEl.dataset.templateId === "title-button" ?
    "标题按钮" :
    ancestorEl.dataset.templateId === "light-statistics" ?
    "数量统计" :
    ancestorEl.dataset.templateId === "icon-button" ?
    "图标按钮" :
    ancestorEl.dataset.templateId === "device-button" ?
    "设备按钮" :
    ancestorEl.dataset.templateId === "presence-sensor" ?
    "传感器" :
    ancestorEl.dataset.templateId === "air-conditioner" ?
    "空调 / 浴霸" :
    ancestorEl.dataset.templateId === "vacuum-map" ?
    "扫地机器人实时地图" :
    ancestorEl.dataset.templateId === "camera" ?
    "摄像头实时预览" :
    ancestorEl.dataset.templateId === "time" ?
    "时间" :
    ancestorEl.dataset.templateId === "date" ?
    "日期" :
    ancestorEl.dataset.templateId === "weather" ?
    "天气" :
    ancestorEl.dataset.templateId === "line-chart" ?
    "折线图" :
    ancestorEl.dataset.templateId ===
    "panel-frame" ?
    "底图框" :
    ancestorEl.dataset.templateId ===
    "interaction3d" ?
    "3D 交互" :
    "图片";
    const instanceName = nextTemplateInstanceName(chosen7, chosen8);
    const temp2 = createComponentFromTemplate(ancestorEl.dataset.templateId, {
      id: id2,
      instanceName: instanceName,
      canvas: document.canvas,
      uiPackId: jt(document)
    });
    if (chosen5) {
      const numeric = Number(chosen5.position?.width || 100);
      const numeric2 = Number(chosen5.position?.height || 100);
      const numeric3 = Number(temp2.position?.width || 100);
      const numeric4 = Number(temp2.position?.height || 100);
      temp2.position = {
        ...(temp2.position || {}),
        x: (numeric - numeric3) / 2,
        y: (numeric2 - numeric4) / 2
      };
    }
    chosen7.unshift(temp2);
    applyCollectionLayerOrder(chosen7);
    if (chosen3 === "shared" && !chosen5) {
      for (const temp3 of document.pages) {
        temp3.sharedComponentIds = [
        temp2.id,
        ...(temp3.sharedComponentIds || []).filter(
          (arg) => arg !== temp2.id
        )];

      }
      syncSharedComponentReferenceOrder(document);
    }
  }, inputValue);
  if (ancestorEl.dataset.templateId === "floorplan-auto-diagram") {
    error.then(() =>
    mw(id2, {
      cancelRemovesComponent: true
    })
    );
  }
});
Wm.addEventListener("click", () => Mt("edit"));
Rm.addEventListener("click", () => Mt("dashboard"));
Be.addEventListener("click", async () => {
  if (!h) {
    return;
  }
  const value = clone(h.document);
  value.soundEnabled = h.document.soundEnabled === false;
  try {
    await vt(value);
    await Np();
  } catch (error) {
    onError(error);
  }
});
Hm.addEventListener("click", EN);
bl.addEventListener("click", () => Mt("edit"));
yl.addEventListener("click", () => Mt("popup"));
Le.addEventListener("change", () => {
  Wn();
  if (Dn && h && Le.value !== h.projectId) {
    Le.value = h.projectId;
    oe(Le);
    _r();
    return;
  }
  if (Le.value) {
    xp(Le.value).catch(onError);
  }
});
W.addEventListener("change", () => {
  pn();
  i0();
  De = null;
  if (Te === "popup") {
    Mt("edit");
  }
  x?.navigate(W.value);
  Ue?.navigate(W.value);
  const value = findComponent(h?.document, componentId);
  if (value?.scope === "page" && value.page?.path !== W.value) {
    Oc(null);
  }
  _e();
  Z();
});
function tC(value) {
  Nu = value;
  const temp = findCustomPopup(h?.document, se);
  aN.textContent = value === "rename" ? "重命名组合弹窗" : "新建组合弹窗";
  gc.elements.name.value =
  value === "rename" ? temp?.name || "" : "新建组合弹窗";
  fc.showModal();
  gc.elements.name.select();
}
Tm.addEventListener("click", () => tC("create"));
rN.addEventListener("click", () => fc.close());
sN.addEventListener("click", () => fc.close());
gc.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = gc.elements.name.value.trim();
  if (!name) {
    return;
  }
  const id2 = Nu === "create" ? newId("custom-popup") : se;
  fc.close();
  L((value) => {
    value.customPopups = value.customPopups || [];
    if (Nu === "rename") {
      const found = value.customPopups.find((component) => component.id === se);
      if (found) {
        found.name = name;
      }
      return;
    }
    value.customPopups.push({
      id: id2,
      name: name,
      templateRef: {
        uiPackId: jt(value),
        templateId: "custom-popup",
        version: 1
      },
      layout: {
        columns: 3
      },
      modules: []
    });
    se = id2;
    Mt("popup");
  });
});
We.addEventListener("change", () => {
  Ic();
  se = We.value || null;
  Mt("popup");
});
Yo.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-popup-id]");
  if (ancestorEl) {
    Ic();
    se = ancestorEl.dataset.popupId;
    We.value = se;
    vp(h.document, se);
    Mt("popup");
  }
});
Yo.addEventListener("contextmenu", (event) => {
  const value = event.target.closest("[data-popup-id]");
  if (!value) {
    return;
  }
  event.preventDefault();
  se = value.dataset.popupId;
  We.value = se;
  vp(h.document, se);
  Mt("popup");
  Eu = se;
  Ft.hidden = false;
  Ft.style.left = "0px";
  Ft.style.top = "0px";
  const rect = Ft.getBoundingClientRect();
  Ft.style.left =
  clampNumber(event.clientX, 8, window.innerWidth - rect.width - 8) + "px";
  Ft.style.top =
  clampNumber(event.clientY, 8, window.innerHeight - rect.height - 8) +
  "px";
});
ao.addEventListener("click", () => {
  if (ao.disabled) {
    return;
  }
  const hidden = Ft.hidden;
  Wn();
  pn();
  Ft.hidden = !hidden;
  ao.setAttribute("aria-expanded", String(hidden));
});
Ft.addEventListener("click", (value) => {
  const popupAction = value.target.closest("[data-popup-action]")?.dataset.
  popupAction;
  const flag = Eu || se;
  Ic();
  if (!!popupAction && !!flag) {
    if (popupAction === "rename") {
      tC("rename");
      return;
    }
    if (popupAction === "duplicate") {
      const generatedId = newId("custom-popup");
      se = generatedId;
      L((doc) => {
        const found = (doc.customPopups || []).find(
          (component) => component.id === flag
        );
        if (!found) {
          return;
        }
        const temp = clone(found);
        temp.id = generatedId;
        temp.name = found.name + "_副本";
        temp.modules = (temp.modules || []).map((arg) => ({
          ...arg,
          id: newId("popup-module")
        }));
        doc.customPopups.push(temp);
      });
      return;
    }
    if (popupAction === "delete") {
      const found = (h?.document?.customPopups || []).find(
        (component) => component.id === flag
      );
      if (!found) {
        return;
      }
      wr = flag;
      mN.textContent = found.name;
      bc.showModal();
    }
  }
});
function nC() {
  wr = null;
  bc.close();
}
uN.addEventListener("click", nC);
pN.addEventListener("click", nC);
bc.addEventListener("close", () => {
  wr = null;
});
vu.addEventListener("click", () => {
  const value = wr;
  if (value) {
    wr = null;
    bc.close();
    vu.disabled = true;
    L((document) => {
      document.customPopups = (document.customPopups || []).filter(
        (component) => component.id !== value
      );
      const callback = (arg) => {
        for (const temp of arg || []) {
          for (const [temp2, temp3] of Object.entries(temp.actions || {})) {
            if (
            temp3.type === "more-info" &&
            temp3.data?.popupSource === "custom" &&
            temp3.data?.popupId === value)
            {
              temp.actions[temp2] = {
                type: "none",
                data: {}
              };
            }
          }
          callback(temp.children);
        }
      };
      callback(document.sharedComponents);
      for (const temp of document.pages || []) {
        callback(temp.components);
      }
      se = document.customPopups[0]?.id || null;
      if (!se) {
        Mt("edit");
      }
    }).finally(() => {
      vu.disabled = false;
    });
  }
});
lN.addEventListener("click", () => {
  zi();
  Li.close();
});
dN.addEventListener("click", () => {
  zi();
  Li.close();
});
rn.addEventListener("click", () => {
  const hidden = bu.hidden;
  bu.hidden = !hidden;
  rn.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    X0();
    window.requestAnimationFrame(() =>
    hc.focus({
      preventScroll: true
    })
    );
  }
});
hc.addEventListener("input", () => X0());
Ii.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-popup-module-entity-id]");
  if (ancestorEl) {
    he.elements.entityId.value = ancestorEl.dataset.popupModuleEntityId;
    Y0();
    zi();
  }
});
yu.addEventListener("click", (value) => {
  const ancestorEl = value.target.closest("[data-popup-module-device-type]");
  if (!!ancestorEl && he.elements.type.value === "climate") {
    wp(ancestorEl.dataset.popupModuleDeviceType);
  }
});
he.elements.type.addEventListener("change", () => {
  wp();
  Ii.replaceChildren();
});
he.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = se;
  const type = he.elements.type.value;
  const entityId = he.elements.entityId.value;
  const title = he.elements.title.value.trim();
  const deviceType = normalizedPopupClimateDeviceType(
    he.elements.deviceType.value
  );
  if (!value || !entityId) {
    return;
  }
  const temp = findCustomPopup(h?.document, se);
  const options = {
    id: vr || "candidate",
    type: type,
    entityId: entityId,
    ...(title ?
    {
      title: title
    } :
    {}),
    ...(type === "climate" ?
    {
      properties: {
        deviceType: deviceType
      }
    } :
    {})
  };
  const chosen = vr ?
  (temp?.modules || []).map((component) =>
  component.id === vr ?
  {
    ...component,
    ...options
  } :
  component
  ) :
  [...(temp?.modules || []), options];
  if (!temp || !packPopupModules(chosen, temp.layout).fits) {
    onError(new Error("当前布局已超过 3 行，可增加列数或删除其它模块。"));
    return;
  }
  zi();
  Li.close();
  L((doc) => {
    const found = (doc.customPopups || []).find(
      (component2) => component2.id === value
    );
    if (!found) {
      return;
    }
    const component = found.modules.find((component2) => component2.id === vr);
    if (component) {
      component.type = type;
      component.entityId = entityId;
      if (title) {
        component.title = title;
      } else {
        delete component.title;
      }
      if (type === "climate") {
        component.properties = {
          ...(component.properties || {}),
          deviceType: deviceType
        };
      } else if (component.properties?.deviceType) {
        const { deviceType: properties, ...properties2 } = component.properties;
        if (Object.keys(properties2).length) {
          component.properties = properties2;
        } else {
          delete component.properties;
        }
      }
      delete component.deviceType;
      return;
    }
    found.modules.push({
      id: newId("popup-module"),
      type: type,
      entityId: entityId,
      ...(title ?
      {
        title: title
      } :
      {}),
      ...(type === "climate" ?
      {
        properties: {
          deviceType: deviceType
        }
      } :
      {})
    });
  });
});
document.addEventListener("pointerdown", (value) => {
  const ancestorEl = value.target.closest("#delete-asset-folder-dialog");
  if (!Pe.contains(value.target)) {
    _u();
  }
  if (
  !ancestorEl &&
  Bo &&
  !Bo.button.contains(value.target) &&
  !Bo.menu.contains(value.target))
  {
    Ht();
  }
  if (!value.target.closest(".dashboard-select-row")) {
    Wn();
  }
  if (!value.target.closest(".page-control .page-select-row")) {
    pn();
  }
  if (
  !value.target.closest("#popup-list") &&
  !value.target.closest("#popup-actions-menu"))
  {
    Ic();
  }
  if (!value.target.closest("#popup-module-entity-picker")) {
    zi();
  }
  if (!value.target.closest(".component-popup-entity-picker")) {
    Wc();
  }
  if (!value.target.closest("#image-entity-picker")) {
    closePickerPanel(aa, oi);
  }
  if (!value.target.closest("#weather-entity-picker")) {
    closePickerPanel(Zd, Jd);
  }
  if (!value.target.closest("#line-chart-entity-picker")) {
    closePickerPanel(eu, Qd);
  }
  if (!value.target.closest("#ibe-entity-picker")) {
    closePickerPanel(Ts, Gl);
  }
  if (!value.target.closest("#icon-button-entity-picker")) {
    closePickerPanel(mi, pi);
  }
  if (!value.target.closest("#vacuum-map-entity-picker")) {
    closePickerPanel(nc, Gd);
  }
  if (!value.target.closest("#camera-entity-picker")) {
    closePickerPanel(ac, Yd);
  }
  if (!value.target.closest("#air-conditioner-entity-picker")) {
    closePickerPanel(Js, Dd);
  }
  if (!value.target.closest("#title-button-entity-picker")) {
    closePickerPanel(Ms, ad);
  }
  if (
  !Ie.hidden &&
  !value.target.closest("#light-statistics-entity-picker") &&
  !Ie.contains(value.target))
  {
    closePickerPanel(Ie, rt);
    Pr();
  }
  if (!value.target.closest("#light-statistics-action-entity-picker")) {
    closePickerPanel(Vs, dd);
  }
  if (!value.target.closest("#navigation-entity-picker")) {
    closePickerPanel(iu, ou);
  }
  const menu = Vn.get(po)?.menu;
  if (
  !ancestorEl &&
  !value.target.closest("#image-asset-picker") &&
  !menu?.contains(value.target))
  {
    closePickerPanel(Re, Cn);
  }
  const menu2 = Vn.get(ho)?.menu;
  if (
  !ancestorEl &&
  !value.target.closest("#ibe-asset-picker") &&
  !menu2?.contains(value.target))
  {
    closePickerPanel(He, En);
  }
  if (!value.target.closest("#ibe-icon-picker") && !Et.contains(value.target)) {
    closePickerPanel(Et, Qt);
  }
  if (
  !value.target.closest("#icon-button-icon-picker") &&
  !It.contains(value.target))
  {
    closePickerPanel(It, Lt);
  }
  if (
  !value.target.closest("#title-button-icon-picker") &&
  !je.contains(value.target))
  {
    closePickerPanel(je, tn);
  }
  if (
  !value.target.closest("#light-statistics-icon-picker") &&
  !qe.contains(value.target))
  {
    closePickerPanel(qe, nn);
  }
  if (
  !value.target.closest("#navigation-icon-picker") &&
  !Tt.contains(value.target))
  {
    closePickerPanel(Tt, on);
  }
});
const oC = new Set([Nn, bo, Aa, $a, Wa, ja, qa, Ua, yo, vo, wo, Co, So, An]);
document.addEventListener(
  "input",
  (event) => {
    if (selectedComponentIds.size < 2 || !oC.has(event.target)) {
      return;
    }
    event.stopPropagation();
    const numeric = Number(event.target.value);
    if (!Number.isFinite(numeric)) {
      return;
    }
    const value = l0(clampNumber(numeric, 1, 500) / 100);
    if (value.length) {
      x?.previewComponentsTransform(value, componentId);
    }
  },
  true
);
document.addEventListener(
  "change",
  (event) => {
    if (selectedComponentIds.size < 2 || !oC.has(event.target)) {
      return;
    }
    event.stopPropagation();
    const numeric = Number(event.target.value);
    if (!Number.isFinite(numeric)) {
      Z();
      return;
    }
    const allowed = new Set(selectedComponentIds);
    const value = l0(clampNumber(numeric, 1, 500) / 100);
    if (value.length) {
      L((arg) => {
        for (const temp of value) {
          if (!allowed.has(temp.componentId)) {
            continue;
          }
          const component = findComponent(
            arg,
            temp.componentId
          )?.component;
          if (component) {
            component.position = {
              ...(component.position || {}),
              x: temp.x,
              y: temp.y
            };
            component.style = {
              ...(component.style || {}),
              scale: temp.scale
            };
          }
        }
      });
    }
  },
  true
);
document.addEventListener("keydown", (event) => {
  const value = event.target.closest(
    'input, textarea, select, button, [contenteditable="true"], dialog'
  );
  if (Te === "edit" && selectedComponentIds.size && !value) {
    if (
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "d")
    {
      event.preventDefault();
      f0([...selectedComponentIds], componentId);
      return;
    }
    if (
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey && (
    event.key === "Delete" || event.key === "Backspace"))
    {
      event.preventDefault();
      h0([...selectedComponentIds]);
      return;
    }
  }
  const options = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1]
  };
  if (
  options[event.key] &&
  Te === "edit" &&
  selectedComponentIds.size &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.altKey &&
  !value)
  {
    event.preventDefault();
    const chosen = event.shiftKey ? 10 : 1;
    const [temp, temp2] = options[event.key];
    kN(temp * chosen, temp2 * chosen);
    return;
  }
  if (event.key !== "Enter" || event.isComposing) {
    return;
  }
  const ancestorEl = event.target.closest(
    'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"])'
  );
  if (ancestorEl) {
    event.preventDefault();
    ancestorEl.blur();
  }
});
g1.addEventListener("scroll", () => {
  Qe();
  dp();
  yt("weather");
  yt("line-chart");
  yt("icon-button-effect");
  yt("icon-button");
  yt("vacuum-map");
  yt("camera");
  yt("air-conditioner");
  yt("title-button");
  yt("light-statistics");
  ap();
  Vr();
  Rr();
  M0();
  O0();
  op();
  ip();
  k0();
  Vu();
  for (const value of document.querySelectorAll(
    "[data-popup-entity-menu]:not([hidden])"
  )) {
    Hc(value.closest("[data-action-trigger]"));
  }
});
window.addEventListener("resize", () => {
  bm();
  ym();
  _u();
  Ht();
  closeOtherPickerPanels();
  Wc();
  Vu();
});
vm.addEventListener("click", async () => {
  await Cr.catch(() => {});
  await Np();
});
jS.addEventListener("click", xN);
qS.addEventListener("click", () => Tl.close());
Ss.addEventListener("input", () => {
  Ss.value = Ss.value.replace(/\D/g, "").slice(0, 6);
});
zm.addEventListener("submit", NN);
UC.addEventListener("click", async () => {
  if (!_r()) {
    await J("/auth/logout", {
      method: "POST"
    });
    window.location.assign("/login");
  }
});
Kv();
e0(document);
t0(document);
const iC = (value) => {
  const rect = ii.getBoundingClientRect();
  Nr = clampNumber(
    (value.clientX - rect.left) / Math.max(1, rect.width),
    0,
    1
  );
  Er =
  1 -
  clampNumber(
    (value.clientY - rect.top) / Math.max(1, rect.height),
    0,
    1
  );
  Jv();
};
ii.addEventListener("pointerdown", (event) => {
  if (me) {
    event.preventDefault();
    Lr = event.pointerId;
    ii.setPointerCapture(event.pointerId);
    iC(event);
  }
});
ii.addEventListener("pointermove", (value) => {
  if (value.pointerId === Lr) {
    iC(value);
  }
});
ii.addEventListener("pointerup", (value) => {
  if (value.pointerId === Lr) {
    Lr = null;
    ii.releasePointerCapture(value.pointerId);
  }
});
$l.addEventListener("input", () => {
  if (me) {
    $o = clampNumber(Number($l.value), 0, 360);
    Jv();
  }
});
xn.addEventListener("input", () => {
  const value = normalizedHexColor(xn.value);
  if (value) {
    Fo(value, true);
  }
});
xn.addEventListener("change", () => {
  const value = normalizedHexColor(xn.value);
  if (value) {
    Fo(value, true);
  } else if (me) {
    xn.value = String(me.value || "").toUpperCase();
  }
});
const aC = () => {
  if (!me) {
    return;
  }
  const value = clampNumber(Number(zl.value), 0, 255);
  const clamped = clampNumber(Number(Vl.value), 0, 255);
  const clamped2 = clampNumber(Number(Wl.value), 0, 255);
  if ([value, clamped, clamped2].every(Number.isFinite)) {
    Fo(rgbToHex(value, clamped, clamped2), true);
  }
};
for (const t of [zl, Vl, Wl]) {
  t.addEventListener("input", aC);
  t.addEventListener("change", aC);
}
Fl.addEventListener("click", async () => {
  if (me) {
    try {
      await zo(String(me.value || "").toUpperCase());
      window.clearTimeout(_v);
      Fl.classList.add("copied");
      _v = window.setTimeout(() => Fl.classList.remove("copied"), 1200);
    } catch (error) {
      onError(error);
    }
  }
});
Dl.addEventListener("click", async () => {
  if (me) {
    try {
      const value = await navigator.clipboard.readText();
      const temp = normalizedHexColor(value);
      if (!temp) {
        throw new Error("剪贴板中没有可用的十六进制颜色值。");
      }
      xn.value = temp.toUpperCase();
      Fo(temp, true);
      Dl.classList.add("copied");
      window.setTimeout(() => Dl.classList.remove("copied"), 1200);
    } catch (error) {
      onError(error);
    }
  }
});
document.addEventListener(
  "click",
  (event) => {
    const value = event.target.closest("button");
    if (!value) {
      return;
    }
    let temp = false;
    if ([on, Qt, Lt, tn, nn].includes(value)) {
      temp = eI(value);
    } else if (value === rt) {
      temp = Xw();
    } else if (value.matches("[data-popup-entity-button]")) {
      temp = Kw(value);
    } else if (value === rn) {
      temp = Jw();
    } else if ([Cn, En].includes(value)) {
      temp = tI(value);
    } else {
      temp = Yw(value);
    }
    if (temp) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true
);
document.addEventListener("pointerdown", (value) => {
  if (!pt.hidden && !pt.contains(value.target) && value.target !== me) {
    Qv();
  }
});
new MutationObserver((value) => {
  for (const temp of value) {
    for (const temp2 of temp.addedNodes) {
      if (temp2 instanceof HTMLElement) {
        Kv(temp2);
        e0(temp2);
        t0(temp2);
      }
    }
  }
}).observe(document.body, {
  childList: true,
  subtree: true
});
deferHiddenEditorDialogs();
Mt("edit");
window.setInterval(() => {
  if (document.visibilityState === "visible") {
    Ri().catch(() => {});
    Kc().catch(() => {});
  }
}, 15000);
window.setInterval(() => {
  if (document.visibilityState === "visible") {
    U0().catch(() => {});
  }
}, 30000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    Ri().catch(() => {});
    U0().catch(() => {});
    Kc().catch(() => {});
  }
});
Promise.all([
DE(),
Kc(),
Ir(),
Ri({
  preserveForm: false
}),
_c(),
gn(),
jc()]
).
then(() => _e()).
catch(onError);