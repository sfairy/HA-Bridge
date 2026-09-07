import {
  PanelRenderer,
  airflowCanvasOffsetBounds,
  setBuiltinAssetVersions,
  syncedLineChartProperties,
} from "../../renderer/renderer.js?v=20260821-electric-bed-load-v20-generic-popup-v1-color-picker-v3-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-realtime-capabilities-v2-20260822-line-chart-performance-v6-20260822-button-hit-area-v2-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-airflow-canvas-drag-v1-20260823-effect-light-visual-v1-20260823-effect-variant-v1-20260823-touch-popup-motion-v12-20260823-navigation-current-page-v1-20260824-light-statistics-v5-20260825-effect-load-queue-v2-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-bath-heater-primary-v1-20260825-editor-media-preview-v1-20260825-history-mode-switch-v1-20260826-button-sound-v2-20260826-line-chart-initial-state-v1-20260827-dashboard-live-scope-v1-20260827-light-preset-settle-v1-20260827-runtime-placeholder-retry-v2-20260828-legacy-group-compat-v2-vacuum-dialog-layout-v1-20260830-light-statistics-selection-v1-20260830-editor-local-refresh-v4-20260831-background-media-v1-20260831-bound-entity-v1-20260831-vacuum-map-background-v1-20260831-action-rules-v1-20260831-sensor-popup-v1-20260901-renderer-transform-geometry-v1-20260901-renderer-effect-geometry-v2-20260901-renderer-light-runtime-v1-20260901-renderer-vacuum-runtime-v1-20260901-renderer-cover-runtime-v1-20260901-renderer-dialog-motion-v1-20260901-renderer-runtime-caches-v1-20260901-renderer-presence-runtime-v1-20260901-renderer-light-statistics-runtime-v1-20260901-renderer-line-chart-runtime-v1-20260901-renderer-door-window-runtime-v1-20260901-renderer-weather-chart-runtime-v2-20260901-renderer-date-time-runtime-v1-20260901-renderer-runtime-document-v1-20260901-camera-prewarm-v1-20260901-hidden-selection-bounds-v2-20260901-effect-state-stability-v1-20260901-vacuum-map-retry-v1-20260901-light-effect-first-frame-v1-20260901-light-effect-toggle-confirm-v1-20260901-popup-module-note-v1-20260901-runtime-dialog-layout-v8-20260901-light-effect-layering-v2-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-climate-capability-options-v3-20260904-auto-diagram-floor-v1-20260904-climate-option-fit-v3-20260905-client-log-v1-20260907-interaction3d-v1-v2-20260907-i3d-align-v1";
import {
  lightStatisticsEntityStateStatus,
  lightStatisticsEntitySupport,
} from "../../renderer/registry.js?v=20260814-tablet-resolution-v84-20260818-airer-v1-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-line-chart-performance-v3-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-effect-variant-v1-20260823-navigation-current-page-v1-20260824-light-statistics-v6-20260825-effect-load-queue-v1-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-editor-media-preview-v1-20260828-count-statistics-v1-20260831-background-media-v1-20260831-vacuum-map-background-v1-20260901-renderer-presence-runtime-v1-20260901-renderer-light-statistics-runtime-v1-20260901-renderer-line-chart-runtime-v1-20260901-renderer-door-window-runtime-v1-20260901-renderer-weather-chart-v2-20260901-renderer-date-time-runtime-v1-20260901-camera-prewarm-v1-20260901-vacuum-map-retry-v1-20260901-light-effect-first-frame-v1-20260901-light-effect-toggle-confirm-v1-20260901-light-effect-layering-v2-20260901-light-effect-color-cache-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260905-client-log-v1-20260907-interaction3d-v1-20260907-i3d-align-v1";
import {
  applyUiPackToDocument,
  createComponentFromTemplate,
  dateComponentDimensions,
  ensureUiPackRuntime,
  listComponentTemplates,
  timeComponentDimensions,
  weatherComponentDimensions,
} from "../ui-packs/loader.js?v=20260811-water-heater-popup-v44-20260815-component-thumbnails-v2-20260822-light-feedback-controls-v1-20260824-light-statistics-v6-20260828-count-statistics-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260907-interaction3d-v1";
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
  normalizedFontWeight,
} from "./editor-utils.js?v=20260831-editor-utils-v1";
import {
  packPopupModules,
  popupLayoutColumns,
  popupLayoutMetrics,
} from "./popup-layout.js?v=20260821-electric-bed-combo-v2";
import {
  countComponentsOutsideCanvas,
  resizeDashboardDocument,
} from "./dashboard-resize.js?v=20260820-dashboard-resize-v439";
import {
  copyComponentsAcrossDocuments,
  copyComponentTargets,
  copyComponentsToTarget,
} from "./component-page-copy.js?v=20260826-cross-dashboard-copy-v4";
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
  selectedRelatedEntityIds,
} from "./related-entities.js?v=20260825-bath-heater-primary-v1";
import { createIconVisibilityVirtualEntity } from "./virtual-entities.js?v=20260822-icon-visibility-v1";
import { createButtonSound } from "../shared/sound-effects.js?v=20260826-button-sound-v2";
import {
  deferHiddenEditorDialogs,
  installSettingsDialogBackdropGuard,
} from "./editor-dialogs.js?v=20260830-editor-dialogs-v1";
import { createEditorPickerElements } from "./editor-picker-elements.js?v=20260902-asset-display-name-v1";
import {
  EDITOR_PICKER_PAGE_SIZES,
  editorEntityPickerInitialPage,
  editorEntityPickerPage,
} from "./editor-picker-pagination.js?v=20260830-editor-picker-pagination-v1";
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
  entityIdSupportsToggle,
} from "./action-rules.js?v=20260831-action-rules-v1";
import {
  componentDirectLocation,
  findComponent,
  findComponentInItems,
  findComponentLocation,
} from "./component-tree.js?v=20260831-component-tree-v1";
import {
  applyCollectionLayerOrder,
  componentLabel,
  copiedComponentLabel,
  ensureSharedComponentReference,
  groupNameForCollection,
  nextTemplateInstanceName,
  refreshComponentIds,
  syncSharedComponentReferenceOrder,
} from "./editor-component-collections.js?v=20260831-editor-component-collections-v1-20260907-interaction3d-v1";
import {
  fitInspectorComponentToDimensions,
  iconButtonEffectInspectorLayer,
  inspectorComponentMetrics,
  setInspectorToggle,
} from "./editor-basic-inspectors.js?v=20260901-editor-basic-inspectors-v4";
import { createInteraction3dEditorPickers } from "../../modules/interaction3d/editor-pickers.js?v=20260906-i3d-buttons-v1";
import {
  guardInteraction3dChanges,
  renderInteraction3dInspector,
  renderInteraction3dThumbnail,
  updateInteraction3dCard,
} from "../../modules/interaction3d/editor.js?v=20260907-browser-compat-v1";
import {
  clonePageWithFreshIds,
  findCustomPopup,
  greatestCommonDivisor,
  normalizedPopupClimateDeviceType,
  popupModuleDropPosition,
  popupModuleEntityRecommended,
  popupModuleTypeLabel,
  reorderedPopupModules,
  uniquePagePath,
} from "./editor-document-management.js?v=20260901-editor-document-management-v1";
import {
  documentSignature,
  editorComponentEntries,
  editorComponentStructure,
  editorDocumentFrameSignature,
  recoveryStorageKey,
} from "./editor-history.js?v=20260901-editor-history-v1";
import {
  DEFAULT_BASE_LIGHTING,
  normalizeBaseLighting,
} from "../../3d-studio/studio-normalization.js?v=20260903-studio-normalization-v2";
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
  const value2 = value < 0.999;
  document.documentElement.classList.toggle("editor-viewport-fit", value2);
  document.documentElement.style.setProperty(
    "--editor-layout-height",
    count + "px",
  );
  document.documentElement.style.setProperty(
    "--editor-viewport-scale",
    String(value),
  );
}
function ym() {
  const count = Math.max(
    0.1,
    jC * Math.min(window.innerWidth / RC, window.innerHeight / HC),
  );
  document.documentElement.style.setProperty(
    "--component-template-dialog-scale",
    String(count),
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
    Qo.isEnabled() !== h.document.soundEnabled
  ) {
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
  color: r("#line-chart-threshold-" + value + "-color"),
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
let be = "dwell-light";
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
  at: 0,
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
let bag = new Set();
let we = null;
const pe = {
  undo: [],
  redo: [],
  busy: false,
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
async function J(value, value2 = {}) {
  const response = await fetch("/api/v1" + value, {
    cache: "no-store",
    ...value2,
    headers: value2.body
      ? {
          "Content-Type": "application/json",
          ...(value2.headers || {}),
        }
      : value2.headers,
  });
  const value3 = response.status === 204 ? "" : await response.text();
  let value4 = null;
  if (value3) {
    try {
      value4 = JSON.parse(value3);
    } catch {
      if (response.ok) {
        throw new Error(
          "接口返回格式异常：" +
            value.split("?")[0] +
            "（HTTP " +
            response.status +
            "）",
        );
      }
    }
  }
  if (response.status === 401) {
    window.location.assign("/login");
    const value5 = new Error("登录状态已失效。");
    throw window.HABridgeLog?.linkError(value5, response) || value5;
  }
  if (
    response.status === 403 &&
    value4?.detail?.code === "LICENSE_RESTRICTED"
  ) {
    window.location.replace("/license");
    const value5 = new Error("授权已失效，请重新激活。");
    throw window.HABridgeLog?.linkError(value5, response) || value5;
  }
  if (!response.ok) {
    const detail = value4?.detail;
    const value5 = value3.trim().slice(0, 240);
    const value6 = new Error(
      typeof detail == "string"
        ? detail
        : detail?.message ||
            "请求失败：" +
              value.split("?")[0] +
              "（HTTP " +
              response.status +
              "）" +
              (value5 ? " · " + value5 : ""),
    );
    if (detail && typeof detail == "object" && detail.code) {
      value6.code = detail.code;
    }
    throw window.HABridgeLog?.linkError(value6, response) || value6;
  }
  return value4;
}
function D(element, value, value2 = "") {
  element.hidden = !value;
  element.textContent = value;
  element.className = ("settings-message " + value2).trim();
}
function onError(value) {
  window.HABridgeLog?.error(value, {
    projectId: h?.projectId || "",
    componentId: componentId || "",
    phase: "editor-operation",
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
  const value2 = value.button.getBoundingClientRect();
  const count = Math.max(80, Math.min(320, window.innerHeight - 16));
  value.menu.style.width = value2.width + "px";
  value.menu.style.maxHeight = count + "px";
  const value3 = Math.min(value.menu.scrollHeight, count);
  const count2 = Math.max(
    8,
    Math.min(window.innerWidth - value2.width - 8, value2.left),
  );
  const value4 = value2.bottom + 4;
  const value5 =
    value4 + value3 <= window.innerHeight - 8
      ? value4
      : Math.max(8, value2.top - value3 - 4);
  value.menu.style.left = count2 + "px";
  value.menu.style.top = value5 + "px";
}
function oe(element) {
  const value = Vn.get(element);
  if (!value) {
    return;
  }
  const element2 = element.selectedOptions[0];
  const value2 =
    element.id === "page-select" && element2?.dataset.defaultPage === "true";
  value.button.textContent = value2
    ? "★ " + element2.textContent
    : element2?.textContent ||
      (element.id === "project-select"
        ? "暂无仪表盘"
        : element.id === "popup-select"
          ? "暂无组合弹窗"
          : element.id === "image-asset-folder"
            ? "暂无图片文件夹"
            : "暂无页面");
  value.button.disabled = element.disabled;
  const value3 = element === po ? "image" : element === ho ? "ibe" : "";
  const value4 = value3 === "image" ? Vt : value3 === "ibe" ? Wt : "";
  value.menu.replaceChildren(
    ...[...element.options].map((element3) => {
      const element4 = document.createElement("button");
      element4.type = "button";
      element4.className = "custom-select-option";
      element4.dataset.value = element3.value;
      if (
        element.id === "page-select" &&
        element3.dataset.defaultPage === "true"
      ) {
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
      if (!value3 || !fp(value4, element3.value)) {
        return element4;
      }
      const value5 = document.createElement("div");
      value5.className = "custom-select-option-row";
      const element5 = document.createElement("button");
      element5.type = "button";
      element5.className = "custom-select-option-delete";
      element5.dataset.deleteStudio3dFolder = element3.value;
      element5.dataset.assetFolderKind = value3;
      element5.title = "删除 " + element3.textContent;
      element5.setAttribute(
        "aria-label",
        "删除自动导图文件夹 " + element3.textContent,
      );
      element5.textContent = "×";
      value5.append(element4, element5);
      return value5;
    }),
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
    select.getAttribute("aria-label") || "打开选择菜单",
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
    menu: menu,
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
    const value2 = event.target.closest("[data-delete-studio3d-folder]");
    if (value2) {
      event.preventDefault();
      event.stopPropagation();
      eC(value2.dataset.assetFolderKind, value2.dataset.deleteStudio3dFolder);
      return;
    }
    const value3 = event.target.closest(".custom-select-option");
    if (!value3 || value3.disabled) {
      return;
    }
    const value4 = select.value;
    select.value = value3.dataset.value;
    oe(select);
    Ht(value);
    if (select.value !== value4) {
      select.dispatchEvent(
        new Event("change", {
          bubbles: true,
        }),
      );
    }
  });
  select.addEventListener("change", () => oe(select));
  new MutationObserver(() => oe(select)).observe(select, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["disabled", "label", "selected"],
  });
}
function Kv(value = document) {
  if (value instanceof HTMLSelectElement) {
    Xv(value);
  }
  value.querySelectorAll?.("select").forEach((value2) => Xv(value2));
}
function Fo(value, value2 = false) {
  const value3 = normalizedHexColor(value);
  if (!value3 || !me) {
    return;
  }
  const value4 = hexToRgb(value3);
  const value5 = rgbToHsv(value4);
  $o = value5.s > 0 ? value5.h : $o;
  Nr = value5.s;
  Er = value5.v;
  pt.style.setProperty("--picker-hue", "hsl(" + $o + " 100% 50%)");
  pt.style.setProperty("--picker-color", value3);
  Xm.style.left = Nr * 100 + "%";
  Xm.style.top = (1 - Er) * 100 + "%";
  $l.value = String(Math.round($o));
  if (document.activeElement !== xn) {
    xn.value = value3.toUpperCase();
  }
  zl.value = String(Math.round(value4.r));
  Vl.value = String(Math.round(value4.g));
  Wl.value = String(Math.round(value4.b));
  v1.style.background = value3;
  if (me.value !== value3) {
    me.value = value3;
    if (value2) {
      me.dispatchEvent(
        new Event("input", {
          bubbles: true,
        }),
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
  const value2 = pt.getBoundingClientRect();
  const value3 = 9;
  const value4 = 8;
  const value5 = value.left - value2.width - value3;
  const value6 =
    value5 >= value4
      ? value5
      : Math.min(
          window.innerWidth - value2.width - value4,
          value.right + value3,
        );
  const value7 = clampNumber(
    value.top,
    value4,
    Math.max(value4, window.innerHeight - value2.height - value4),
  );
  pt.style.left = Math.max(value4, value6) + "px";
  pt.style.top = value7 + "px";
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
        bubbles: true,
      }),
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
  (value instanceof HTMLInputElement && value.type === "color"
    ? [value]
    : [...(value.querySelectorAll?.('input[type="color"]') || [])]
  ).forEach((value2) => {
    if (!Gv.has(value2)) {
      Gv.set(value2, true);
      value2.title = "打开颜色选择器";
      value2.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        Zv(value2);
      });
      value2.addEventListener("click", (event) => event.preventDefault());
      value2.addEventListener("keydown", (event) => {
        if (["Enter", " "].includes(event.key)) {
          event.preventDefault();
          Zv(value2);
        }
      });
    }
  });
}
function Wu(element, value) {
  if (!element || element.disabled || element.readOnly) {
    return false;
  }
  const value2 = element.value;
  try {
    if (value > 0) {
      element.stepUp();
    } else {
      element.stepDown();
    }
  } catch {
    const value3 = Number(element.step) || 1;
    const value4 = Number(element.value) || 0;
    const value5 = element.min === "" ? -Infinity : Number(element.min);
    const value6 = element.max === "" ? Infinity : Number(element.max);
    element.value = String(
      clampNumber(value4 + value3 * value, value5, value6),
    );
  }
  if (element.value === value2) {
    return false;
  } else {
    element.dispatchEvent(
      new Event("input", {
        bubbles: true,
      }),
    );
    return true;
  }
}
function t0(value = document) {
  const value2 =
    value instanceof HTMLInputElement && value.type === "number"
      ? [value]
      : [
          ...(value.querySelectorAll?.(
            '.inspector-form input[type="number"]',
          ) || []),
        ];
  for (const value3 of value2) {
    if (Uv.has(value3)) {
      continue;
    }
    Uv.add(value3);
    const value4 = document.createElement("span");
    value4.className = "inspector-number-control";
    const value5 = document.createElement("span");
    value5.className = "inspector-number-steppers";
    const fn9 = (value7, value8, value9) => {
      const element = document.createElement("button");
      element.type = "button";
      element.tabIndex = -1;
      element.className = "inspector-number-stepper";
      element.setAttribute("aria-label", value8);
      element.innerHTML =
        '<svg viewBox="0 0 10 6" aria-hidden="true"><path d="' +
        value9 +
        '"></path></svg>';
      element.addEventListener("click", (event) => event.preventDefault());
      element.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || value3.disabled || value3.readOnly) {
          return;
        }
        event.preventDefault();
        value3.focus({
          preventScroll: true,
        });
        let value10 = Wu(value3, value7);
        let value11 = false;
        let value12 = window.setTimeout(() => {
          value12 = window.setInterval(() => {
            value10 = Wu(value3, value7) || value10;
          }, 55);
        }, 320);
        const value13 = () => {
          if (!value11) {
            value11 = true;
            window.clearTimeout(value12);
            window.clearInterval(value12);
            element.removeEventListener("pointerup", value13);
            element.removeEventListener("pointercancel", value13);
            element.removeEventListener("lostpointercapture", value13);
            if (value10) {
              value3.dispatchEvent(
                new Event("change", {
                  bubbles: true,
                }),
              );
            }
          }
        };
        element.addEventListener("pointerup", value13);
        element.addEventListener("pointercancel", value13);
        element.addEventListener("lostpointercapture", value13);
        try {
          element.setPointerCapture(event.pointerId);
        } catch {}
      });
      return element;
    };
    value5.append(
      fn9(1, "增加数值", "M1 5 5 1l4 4"),
      fn9(-1, "减少数值", "M1 1 5 5l4-4"),
    );
    value3.before(value4);
    value4.append(value3, value5);
    let value6 = false;
    value3.addEventListener("keydown", (event) => {
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        value6 = Wu(value3, event.key === "ArrowUp" ? 1 : -1) || value6;
      }
    });
    value3.addEventListener("keyup", (value7) => {
      if (!!["ArrowUp", "ArrowDown"].includes(value7.key) && !!value6) {
        value6 = false;
        value3.dispatchEvent(
          new Event("change", {
            bubbles: true,
          }),
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
    Fn.find((value2) => value2.id === value) ||
    (value === "ui.base"
      ? {
          id: "ui.base",
          name: "栖光",
          englishName: "DWELL LIGHT",
          version: "1.0.0",
          featureCode: "ui.base",
          description: "黑色界面与橙色高亮，包含现有控件、弹窗和示例素材。",
          includes: ["components", "popups", "assets"],
          allowed: true,
        }
      : null)
  );
}
function Hu() {
  const value = Tc();
  uS.textContent = value?.name || "未知 UI";
  pS.textContent = value
    ? (value.englishName || value.id) + " · " + value.version
    : jt();
}
function n0() {
  const value = jt();
  const value2 = {
    dashboards: "仪表盘",
    components: "控件",
    popups: "弹窗",
    assets: "素材",
  };
  if (!Fn.length) {
    const element = document.createElement("div");
    element.className = "component-template-empty";
    element.textContent = "暂无可用 UI 方案。";
    hl.replaceChildren(element);
    return;
  }
  hl.replaceChildren(
    ...Fn.map((value3) => {
      const value4 = document.createElement("article");
      const value5 = value3.id === value;
      value4.className = "ui-pack-card" + (value5 ? " current" : "");
      const element = document.createElement("div");
      element.className = "ui-pack-preview";
      if (value3.previewUrl) {
        element.classList.add("has-cover");
        const value8 = document.createElement("img");
        value8.src = value3.previewUrl;
        value8.alt = value3.name + " 仪表盘预览";
        element.append(value8);
      }
      const value6 = document.createElement("div");
      value6.className = "ui-pack-card-copy";
      const element2 = document.createElement("span");
      element2.textContent =
        (value3.englishName || value3.id) + " · " + value3.version;
      const element3 = document.createElement("strong");
      element3.textContent = value3.name;
      const element4 = document.createElement("p");
      element4.textContent = value3.description;
      const value7 = document.createElement("div");
      value7.className = "ui-pack-includes";
      for (const value8 of value3.includes || []) {
        const element6 = document.createElement("i");
        element6.textContent = value2[value8] || value8;
        value7.append(element6);
      }
      const element5 = document.createElement("button");
      element5.type = "button";
      element5.dataset.uiPackId = value3.id;
      element5.disabled = value5 || !value3.allowed;
      element5.textContent = value5
        ? "当前使用"
        : value3.allowed
          ? "应用到当前仪表盘"
          : "尚未解锁";
      if (!value5 && value3.allowed) {
        element5.className = "primary";
      }
      value6.append(element2, element3, element4, value7, element5);
      value4.append(element, value6);
      return value4;
    }),
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
      '<div class="canvas-message"><strong>' +
      (h ? "请从左侧新建页面。" : "请从左侧新建仪表盘。") +
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
      onPageChange(value2) {
        W.value = value2.path;
        oe(W);
      },
    });
    Ue.setEntityCatalog(le, Ao, cn);
  }
  Ue.setDocument(h.document, value);
}
function o0() {
  const value = String(h?.document?.name || "").trim();
  const value2 = Te === "dashboard" && !!value;
  HS.hidden = !value2;
  if (!value2) {
    na.removeAttribute("href");
    na.textContent = "";
    return;
  }
  const value3 = new URL(
    "/habridge/" + encodeURIComponent(value),
    window.location.origin,
  );
  na.href = value3.href;
  na.textContent = decodeURI(value3.href);
  na.title = value3.href;
}
function SN(value) {
  const value2 = new Date(value);
  if (Number.isFinite(value2.getTime())) {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(value2);
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
        "/displays/pairing-codes?projectId=" + encodeURIComponent(h.projectId),
      )
    ).items || [];
  US.textContent = value.length + " 个";
  Al.replaceChildren();
  if (!value.length) {
    const element = document.createElement("p");
    element.textContent = "暂无配对码";
    Al.append(element);
    return;
  }
  for (const value2 of value) {
    const value3 = document.createElement("div");
    value3.className =
      "display-device-item" + (value2.enabled ? "" : " is-disabled");
    const value4 = document.createElement("div");
    value4.className = "display-device-copy";
    const element = document.createElement("strong");
    element.textContent = value2.name;
    const element2 = document.createElement("span");
    const value5 = value2.device
      ? "已绑定 · 最后在线 " + SN(value2.device.lastSeenAt)
      : "等待设备配对";
    element2.textContent =
      (value2.enabled ? "已启用" : "已停用") + " · " + value5;
    const element3 = document.createElement("strong");
    element3.className = "display-device-code";
    element3.textContent = value2.code || "——";
    const value6 = document.createElement("div");
    value6.className = "display-device-actions";
    const element4 = document.createElement("button");
    element4.type = "button";
    element4.textContent = value2.enabled ? "停用" : "启用";
    element4.addEventListener("click", async () => {
      element4.disabled = true;
      try {
        await J("/displays/pairing-codes/" + encodeURIComponent(value2.id), {
          method: "PATCH",
          body: JSON.stringify({
            enabled: !value2.enabled,
          }),
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
          "确认删除“" + value2.name + "”的固定配对码？绑定设备会立即失效。",
        )
      ) {
        element5.disabled = true;
        try {
          await J("/displays/pairing-codes/" + encodeURIComponent(value2.id), {
            method: "DELETE",
          });
          await Pc();
        } catch (error) {
          D(Zo, error.message, "error");
          element5.disabled = false;
        }
      }
    });
    value4.append(element, element2);
    value6.append(element4, element5);
    value3.append(value4, element3, value6);
    Al.append(value3);
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
          code: Ss.value,
        }),
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
  Il.textContent = value
    ? Math.round(numeric) + " × " + Math.round(numeric2)
    : "";
}
function Mt(value) {
  Te = ["edit", "dashboard", "popup"].includes(value) ? value : "edit";
  const value2 = Te === "edit";
  const value3 = Te === "dashboard";
  const value4 = Te === "popup";
  gS.hidden = value4;
  hS.hidden = !value4;
  fS.classList.toggle("popup-mode", value4);
  bl.classList.toggle("active", !value4);
  bl.setAttribute("aria-selected", String(!value4));
  yl.classList.toggle("active", value4);
  yl.setAttribute("aria-selected", String(value4));
  if (!value2) {
    s0();
  }
  Dt.hidden = !value2;
  oa.hidden = !value3;
  yn.hidden = !value4;
  Jo.classList.toggle("empty", !h);
  RS.textContent = value3 ? "仪表盘" : value4 ? "组合弹窗" : "页面画布";
  ju();
  o0();
  Pl();
  for (const [element, value5] of [
    [Wm, value2],
    [Rm, value3],
  ]) {
    element.classList.toggle("active", value5);
    element.setAttribute("aria-selected", String(value5));
  }
  if (value2) {
    Do();
    if (h?.document?.pages?.length) {
      jr().setDocument(h.document, W.value);
      x.setSelectedComponents([...bag], componentId);
    }
    window.requestAnimationFrame(qu);
  } else if (value3) {
    x?.destroy();
    x = null;
    Ac();
    window.requestAnimationFrame(() => Ue?.resize());
  } else if (value4) {
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
      payload.password
    ) {
      throw new Error();
    }
    window.open(payload.href, "_blank", "noopener,noreferrer");
  } catch {
    onError(new Error("请先配置有效的 Home Assistant 地址。"));
  }
}
function i0(value = !!h?.document?.pages?.length) {
  if (vl) {
    const value2 = Je();
    const value3 = !!value2 && h?.document?.defaultPagePath === value2.path;
    vl.textContent = value3 ? "已是默认首屏" : "设为默认首屏";
    vl.disabled = !value || value3;
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
  const value2 =
    Jo.clientWidth -
    Number.parseFloat(value.paddingLeft) -
    Number.parseFloat(value.paddingRight);
  const value3 =
    Jo.clientHeight -
    Number.parseFloat(value.paddingTop) -
    Number.parseFloat(value.paddingBottom);
  const value4 = h.document.canvas.width || 2778;
  const value5 = h.document.canvas.height || 1940;
  const value6 = value4 / value5;
  const value7 = value2 / value3 > value6;
  const value8 = value7 ? value3 * value6 : value2;
  const value9 = value7 ? value3 : value2 / value6;
  Dt.style.width = Math.max(1, value8) + "px";
  Dt.style.height = Math.max(1, value9) + "px";
  oa.style.width = Math.max(1, value8) + "px";
  oa.style.height = Math.max(1, value9) + "px";
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
    null
  );
}
function r0(value, value2 = h?.document) {
  const value3 = [...new Set(value || [])];
  if (value3.length < 2 || !value2) {
    return false;
  }
  const value4 = value3.map((value6) =>
    componentDirectLocation(value2, value6),
  );
  if (value4.some((value6) => !value6 || value6.component.type === "group")) {
    return false;
  }
  const value5 = value4[0];
  return value4.every(
    (value6) =>
      value6.scope === value5.scope &&
      value6.page?.path === value5.page?.path &&
      value6.collection === value5.collection &&
      value6.component.properties?.layoutMode !== "fill",
  );
}
function IN(value) {
  const value2 = [...new Set(value || [])];
  if (!r0(value2)) {
    onError(
      new Error("请选择同一页面或同一侧边栏中的两个或更多控件后再成组。"),
    );
    return;
  }
  const id2 = newId("group");
  componentId = id2;
  bag = new Set([id2]);
  we = id2;
  De = null;
  return L((value3) => {
    const value4 = value2.map((value12) =>
      componentDirectLocation(value3, value12),
    );
    if (value4.some((value12) => !value12)) {
      return;
    }
    const collection = value4[0].collection;
    const value5 = value4
      .map((value12) => value12.component)
      .sort(
        (value12, value13) =>
          collection.indexOf(value12) - collection.indexOf(value13),
      );
    const value6 = value5.map((value12) => c0(value12));
    const value7 = Math.min(...value6.map((value12) => value12.left));
    const value8 = Math.min(...value6.map((value12) => value12.top));
    const count = Math.max(...value6.map((value12) => value12.right));
    const count2 = Math.max(...value6.map((value12) => value12.bottom));
    const value9 = Math.min(
      ...value5.map((value12) => collection.indexOf(value12)),
    );
    const children = value5.map((value12) => ({
      ...value12,
      position: {
        ...(value12.position || {}),
        x: Number(value12.position?.x || 0) - value7,
        y: Number(value12.position?.y || 0) - value8,
      },
    }));
    const value10 = {
      id: id2,
      type: "group",
      componentVersion: 1,
      position: {
        x: value7,
        y: value8,
        width: Math.max(1, count - value7),
        height: Math.max(1, count2 - value8),
        rotation: 0,
        zIndex: 1,
      },
      properties: {
        label: groupNameForCollection(collection),
      },
      bindings: {},
      actions: {},
      style: {},
      children: children,
    };
    const allowed = new Set(value2);
    const value11 = collection.filter((value12) => !allowed.has(value12.id));
    value11.splice(Math.min(value9, value11.length), 0, value10);
    collection.splice(0, collection.length, ...value11);
    applyCollectionLayerOrder(collection);
    if (value4[0].scope === "shared") {
      for (const value12 of value3.pages || []) {
        const value13 = value12.sharedComponentIds || [];
        const value14 = value13
          .map((value17, value18) => (allowed.has(value17) ? value18 : -1))
          .filter((value17) => value17 >= 0);
        if (!value14.length) {
          continue;
        }
        const value15 = Math.min(...value14);
        const value16 = value13.filter((value17) => !allowed.has(value17));
        value16.splice(Math.min(value15, value16.length), 0, id2);
        value12.sharedComponentIds = [...new Set(value16)];
      }
      syncSharedComponentReferenceOrder(value3);
    }
  });
}
function TN(value) {
  const value2 = findComponentLocation(h?.document, value);
  if (!value2 || value2.component.type !== "group") {
    return;
  }
  const value3 = (value2.component.children || []).map((value4) => value4.id);
  componentId = value3[0] || null;
  bag = new Set(value3);
  we = componentId;
  De = null;
  L((value4) => {
    const value5 = findComponentLocation(value4, value);
    if (!value5 || value5.component.type !== "group") {
      return;
    }
    const value6 = value5.component.position || {};
    const value7 = value5.component.style || {};
    const numeric = Number(value6.rotation || 0);
    const count = Math.max(0.01, Math.min(5, Number(value7.scale || 1)));
    const value8 = (numeric * Math.PI) / 180;
    const value9 = Math.cos(value8);
    const value10 = Math.sin(value8);
    const numeric2 = Number(value6.width || 100);
    const numeric3 = Number(value6.height || 100);
    const value11 = Number(value6.x || 0) + numeric2 / 2;
    const value12 = Number(value6.y || 0) + numeric3 / 2;
    const value13 = (value5.component.children || []).map((value14) => {
      const value15 = value14.position || {};
      const numeric4 = Number(value15.width || 100);
      const numeric5 = Number(value15.height || 100);
      const value16 = Number(value15.x || 0) + numeric4 / 2 - numeric2 / 2;
      const value17 = Number(value15.y || 0) + numeric5 / 2 - numeric3 / 2;
      const value18 = value16 * count;
      const value19 = value17 * count;
      const value20 = value11 + value18 * value9 - value19 * value10;
      const value21 = value12 + value18 * value10 + value19 * value9;
      const style = {
        ...(value14.style || {}),
      };
      const count2 = Math.max(
        0.01,
        Math.min(5, Number(style.scale || 1) * count),
      );
      if (value7.visible === false) {
        style.visible = false;
      }
      style.scale = count2;
      return {
        ...value14,
        position: {
          ...value15,
          x: value20 - numeric4 / 2,
          y: value21 - numeric5 / 2,
          rotation: Number(value15.rotation || 0) + numeric,
        },
        style: style,
      };
    });
    value5.collection.splice(value5.index, 1, ...value13);
    applyCollectionLayerOrder(value5.collection);
    if (value5.scope === "shared" && value5.root) {
      for (const value14 of value4.pages || []) {
        const value15 = value14.sharedComponentIds || [];
        const value16 = value15.indexOf(value);
        if (!(value16 < 0)) {
          value15.splice(value16, 1, ...value13.map((value17) => value17.id));
          value14.sharedComponentIds = [...new Set(value15)];
        }
      }
      syncSharedComponentReferenceOrder(value4);
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
function Gu(value, value2, value3 = null, value4 = false) {
  const value5 = findComponentLocation(value, value2);
  if (!value5) {
    return null;
  }
  const component = value3
    ? clone(value3)
    : refreshComponentIds(clone(value5.component));
  component.properties = {
    ...(component.properties || {}),
    label: copiedComponentLabel(value5.component, value5.collection),
  };
  delete component.properties.previewState;
  if (value4) {
    const numeric = Number(value.canvas?.width || 2778);
    const numeric2 = Number(value.canvas?.height || 1940);
    const numeric3 = Number(component.position?.width || 100);
    const numeric4 = Number(component.position?.height || 100);
    component.position = {
      ...(component.position || {}),
      x: clampNumber(
        Number(component.position?.x || 0) + 24,
        -numeric3 / 2,
        numeric - numeric3 / 2,
      ),
      y: clampNumber(
        Number(component.position?.y || 0) + 24,
        -numeric4 / 2,
        numeric2 - numeric4 / 2,
      ),
    };
  }
  value5.collection.splice(value5.index, 0, component);
  applyCollectionLayerOrder(value5.collection);
  if (value5.scope === "shared" && value5.root) {
    for (const value6 of value.pages || []) {
      const value7 = (value6.sharedComponentIds || []).indexOf(value2);
      if (value7 >= 0) {
        value6.sharedComponentIds.splice(value7, 0, component.id);
      }
    }
    syncSharedComponentReferenceOrder(value);
  }
  return component;
}
function kc(value, value2) {
  const value3 = findComponentLocation(value, value2);
  if (!value3) {
    return null;
  }
  const [value4] = value3.collection.splice(value3.index, 1);
  applyCollectionLayerOrder(value3.collection);
  if (value3.scope === "shared" && value3.root) {
    for (const value5 of value.pages || []) {
      value5.sharedComponentIds = (value5.sharedComponentIds || []).filter(
        (value6) => value6 !== value2,
      );
    }
    syncSharedComponentReferenceOrder(value);
  }
  return value4;
}
function Uu(value) {
  const value2 = String(value || "")
    .trim()
    .toLowerCase();
  if (/^#[\da-f]{6}$/.test(value2)) {
    return value2;
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
function Rn(value, value2, value3 = []) {
  for (const value4 of value || []) {
    if (value4?.type === value2) {
      value3.push(value4);
    }
    Rn(value4?.children, value2, value3);
  }
  return value3;
}
function st(value) {
  return (h?.document?.pages || []).flatMap((page) =>
    Rn(page.components, value).map((component) => ({
      component: component,
      page: page,
    })),
  );
}
function Mc() {
  x?.setActiveGroup(De);
  x?.setSelectedComponents([...bag], componentId);
}
function qt() {
  s0();
  componentId = null;
  bag = new Set();
  we = null;
}
function s0() {
  for (const value of [Pi, un, zn, Mo]) {
    for (const value2 of value.keys()) {
      x?.setComponentPreviewState(value2, "auto");
    }
    value.clear();
  }
}
function Oc(
  value,
  {
    toggle: value2 = false,
    range: value3 = false,
    preserveGroup: value4 = false,
  } = {},
) {
  const value5 = findComponent(h?.document, value);
  if (!value5) {
    qt();
    Mc();
    _e();
    Z();
    return;
  }
  const value6 = findComponent(h?.document, componentId);
  const value7 =
    value6?.scope === value5.scope &&
    (value5.scope !== "page" || value6.page?.path === value5.page?.path);
  if (value4 && bag.has(value)) {
    componentId = value;
  } else if (value3 && value7 && we) {
    const value8 = PN(value5.scope);
    const value9 = value8.findIndex((value11) => value11.id === we);
    const value10 = value8.findIndex((value11) => value11.id === value);
    if (value9 >= 0 && value10 >= 0) {
      const [value11, value12] =
        value9 <= value10 ? [value9, value10] : [value10, value9];
      bag = new Set(
        value8.slice(value11, value12 + 1).map((value13) => value13.id),
      );
      componentId = value;
    } else {
      bag = new Set([value]);
      componentId = value;
      we = value;
    }
  } else if (value2 && value7) {
    const allowed = new Set(bag);
    if (allowed.has(value)) {
      allowed.delete(value);
    } else {
      allowed.add(value);
    }
    bag = allowed;
    componentId = allowed.has(value)
      ? value
      : allowed.values().next().value || null;
    we = value;
  } else if (!value2 && !value3 && bag.size === 1 && bag.has(value)) {
    qt();
  } else {
    bag = new Set([value]);
    componentId = value;
    we = value;
  }
  if (value5.scope === "shared" && Je()?.path) {
    const value8 = clone(h.document);
    if (ensureSharedComponentReference(value8, value, Je().path)) {
      vt(value8, Je().path).catch(onError);
    }
  }
  if (componentId) {
    $c(value5.scope);
  }
  Mc();
  _e();
  Z();
}
function L(fn9, value = W.value, { throwOnError: throwOnError = false } = {}) {
  const pending = Cr.catch(() => {}).then(async () => {
    if (!h) {
      throw new Error("请先选择仪表盘。");
    }
    const value2 = clone(h.document);
    const value3 = await fn9(value2);
    await vt(value2, value);
    return value3;
  });
  Cr = pending.catch(onError);
  return throwOnError ? pending : Cr;
}
function kN(value, value2) {
  const value3 = [...bag];
  if (!!value3.length && (!!value || !!value2)) {
    L((value4) => {
      const value5 = value3
        .map((value10) => findComponent(value4, value10)?.component)
        .filter(Boolean);
      if (
        !value5.length ||
        value5.some(
          (component2) => component2.properties?.layoutMode === "fill",
        )
      ) {
        return;
      }
      const component =
        value5.length === 1 && value5[0].type === "air-conditioner"
          ? value5[0]
          : null;
      if (component && Fu.get(component.id) === "airflow") {
        const count3 = Math.max(1, Number(component.position?.width || 100));
        const count4 = Math.max(1, Number(component.position?.height || 100));
        const value10 = airflowCanvasOffsetBounds(component, value4.canvas);
        component.properties = {
          ...(component.properties || {}),
          airflowOffsetX: clampNumber(
            Number(component.properties?.airflowOffsetX ?? -75) +
              (value / count3) * 100,
            value10.minX,
            value10.maxX,
          ),
          airflowOffsetY: clampNumber(
            Number(component.properties?.airflowOffsetY ?? 34) +
              (value2 / count4) * 100,
            value10.minY,
            value10.maxY,
          ),
        };
        return;
      }
      const numeric = Number(value4.canvas?.width || 2778);
      const numeric2 = Number(value4.canvas?.height || 1940);
      const count = Math.max(
        ...value5.map(
          (value10) =>
            -Number(value10.position?.width || 100) / 2 -
            Number(value10.position?.x || 0),
        ),
      );
      const value6 = Math.min(
        ...value5.map(
          (value10) =>
            numeric -
            Number(value10.position?.width || 100) / 2 -
            Number(value10.position?.x || 0),
        ),
      );
      const count2 = Math.max(
        ...value5.map(
          (value10) =>
            -Number(value10.position?.height || 100) / 2 -
            Number(value10.position?.y || 0),
        ),
      );
      const value7 = Math.min(
        ...value5.map(
          (value10) =>
            numeric2 -
            Number(value10.position?.height || 100) / 2 -
            Number(value10.position?.y || 0),
        ),
      );
      const value8 = clampNumber(value, count, value6);
      const value9 = clampNumber(value2, count2, value7);
      for (const component2 of value5) {
        if (component) {
          const count3 = Math.max(1, Number(component2.position?.width || 100));
          const count4 = Math.max(
            1,
            Number(component2.position?.height || 100),
          );
          const position = {
            ...(component2.position || {}),
            x: Number(component2.position?.x || 0) + value8,
            y: Number(component2.position?.y || 0) + value9,
          };
          const value10 = airflowCanvasOffsetBounds(
            {
              ...component2,
              position: position,
            },
            value4.canvas,
          );
          component2.properties = {
            ...(component2.properties || {}),
            airflowOffsetX: clampNumber(
              Number(component2.properties?.airflowOffsetX ?? -75) -
                (value8 / count3) * 100,
              value10.minX,
              value10.maxX,
            ),
            airflowOffsetY: clampNumber(
              Number(component2.properties?.airflowOffsetY ?? 34) -
                (value9 / count4) * 100,
              value10.minY,
              value10.maxY,
            ),
          };
        }
        component2.position = {
          ...(component2.position || {}),
          x: Number(component2.position?.x || 0) + value8,
          y: Number(component2.position?.y || 0) + value9,
        };
      }
    });
  }
}
function c0(value) {
  const value2 = value.position || {};
  const count = Math.max(0.01, Number(value2.width || 100));
  const count2 = Math.max(0.01, Number(value2.height || 100));
  const count3 = Math.max(0.01, Math.min(5, Number(value.style?.scale || 1)));
  const value3 = (Number(value2.rotation || 0) * Math.PI) / 180;
  const value4 =
    (Math.abs(Math.cos(value3)) * count * count3 +
      Math.abs(Math.sin(value3)) * count2 * count3) /
    2;
  const value5 =
    (Math.abs(Math.sin(value3)) * count * count3 +
      Math.abs(Math.cos(value3)) * count2 * count3) /
    2;
  const value6 = Number(value2.x || 0) + count / 2;
  const value7 = Number(value2.y || 0) + count2 / 2;
  return {
    left: value6 - value4,
    top: value7 - value5,
    right: value6 + value4,
    bottom: value7 + value5,
  };
}
function l0(value) {
  if (bag.size < 2 || !h || !componentId) {
    return [];
  }
  const value2 = [...bag]
    .map((value10) => findComponent(h.document, value10)?.component)
    .filter(Boolean);
  const value3 = value2.find((value10) => value10.id === componentId);
  if (
    !value3 ||
    value2.length !== bag.size ||
    value2.some((component) => component.properties?.layoutMode === "fill")
  ) {
    return [];
  }
  const count = Math.max(0.01, Math.min(5, Number(value3.style?.scale || 1)));
  const value4 = Math.max(0.01, Math.min(5, Number(value))) / count;
  const count2 = Math.max(
    ...value2.map(
      (value10) => 0.01 / Math.max(0.01, Number(value10.style?.scale || 1)),
    ),
  );
  const value5 = Math.min(
    ...value2.map(
      (value10) => 5 / Math.max(0.01, Number(value10.style?.scale || 1)),
    ),
  );
  const value6 = clampNumber(value4, count2, value5);
  const value7 = value2.map(c0);
  const value8 =
    (Math.min(...value7.map((value10) => value10.left)) +
      Math.max(...value7.map((value10) => value10.right))) /
    2;
  const value9 =
    (Math.min(...value7.map((value10) => value10.top)) +
      Math.max(...value7.map((value10) => value10.bottom))) /
    2;
  return value2.map((value10) => {
    const value11 = value10.position || {};
    const numeric = Number(value11.width || 100);
    const numeric2 = Number(value11.height || 100);
    const value12 = Number(value11.x || 0) + numeric / 2;
    const value13 = Number(value11.y || 0) + numeric2 / 2;
    return {
      componentId: value10.id,
      x: value8 + (value12 - value8) * value6 - numeric / 2,
      y: value9 + (value13 - value9) * value6 - numeric2 / 2,
      scale: Math.max(
        0.01,
        Math.min(5, Number(value10.style?.scale || 1) * value6),
      ),
    };
  });
}
function d0() {
  const value = [
    ...document.querySelectorAll(".element-item.selected[data-component-id]"),
  ]
    .map((value2) => value2.dataset.componentId)
    .filter(Boolean);
  if (bag.size > 1) {
    return [...bag];
  } else {
    return value;
  }
}
function Gt(value, value2, rotation, value3 = []) {
  const value4 = value3.length > 1 ? value3 : [value2];
  for (const value5 of value4) {
    const component = findComponent(value, value5)?.component;
    if (component) {
      component.position = {
        ...(component.position || {}),
        rotation: rotation,
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
  const value2 = [...new Set(value || [])];
  if (value2.length) {
    L((value3) => {
      for (const value4 of value2) {
        const component = findComponent(value3, value4)?.component;
        if (component) {
          component.style = {
            ...(component.style || {}),
            visible: visible,
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
    preserveGroup: true,
  });
  Ou = value;
  const value2 = bag.has(value) ? [...bag] : [value];
  const length = value2.length;
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
  const value3 = value2
    .map((value10) => findComponent(h?.document, value10)?.component)
    .filter(Boolean)
    .map((value10) => value10.style?.visible !== false);
  const value4 =
    value3.length === value2.length &&
    value3.every((value10) => value10 === value3[0]);
  element3.disabled = !value4;
  element3.textContent = value4
    ? value3[0]
      ? length > 1
        ? "批量隐藏 " + length + " 个"
        : "隐藏控件"
      : length > 1
        ? "批量显示 " + length + " 个"
        : "显示控件"
    : "批量隐藏/显示";
  element3.title = value4 ? "" : "选中的控件包含隐藏和显示状态，无法批量处理";
  const value5 = r0(value2);
  element5.hidden = !value5;
  element6.hidden = component?.type !== "group" || length !== 1;
  element7.hidden = component?.type !== "group" || length !== 1;
  element2.textContent = "复制到其他区域";
  const value6 = ft.some((value10) => value10.id !== h?.projectId);
  const value7 = p0(h?.document, value2);
  element2.disabled = value7.length === 0 && !value6;
  element2.title = element2.disabled
    ? "当前没有可复制的目标区域"
    : length > 1
      ? "完整复制选中的 " + length + " 个控件到其他页面、侧边栏或其他仪表盘"
      : "完整复制当前控件到其他页面、侧边栏或其他仪表盘";
  element4.textContent = length > 1 ? "删除 " + length + " 个控件" : "删除控件";
  element8.textContent =
    length > 1 ? "颜色标签（" + length + " 个控件）" : "颜色标签";
  const value8 = value2.map((value10) => {
    const component2 = findComponent(h?.document, value10)?.component;
    return Uu(component2?.style?.editorLabelColor);
  });
  const value9 = value8.every((value10) => value10 === value8[0])
    ? value8[0]
    : null;
  for (const element9 of Pe.querySelectorAll("[data-label-color]")) {
    element9.classList.toggle(
      "active",
      value9 !== null && element9.dataset.labelColor === value9,
    );
  }
  Pe.hidden = false;
  Pe.style.left = "0px";
  Pe.style.top = "0px";
  window.requestAnimationFrame(() => {
    const value10 = Pe.getBoundingClientRect();
    const value11 = clampNumber(
      event.clientX,
      8,
      Math.max(8, window.innerWidth - value10.width - 8),
    );
    const value12 = clampNumber(
      event.clientY,
      8,
      Math.max(8, window.innerHeight - value10.height - 8),
    );
    Pe.style.left = value11 + "px";
    Pe.style.top = value12 + "px";
  });
}
function p0(value, value2) {
  const value3 = [...new Set(value2 || [])].filter(Boolean);
  if (!value || !value3.length) {
    return [];
  }
  const value4 = value3.map(
    (value7) =>
      new Set(copyComponentTargets(value, value7).map((value8) => value8.key)),
  );
  const value5 = [...(value4[0] || [])].filter((value7) =>
    value4.every((value8) => value8.has(value7)),
  );
  const value6 = copyComponentTargets(value, value3[0]);
  return value5
    .map((value7) => value6.find((value8) => value8.key === value7))
    .filter(Boolean);
}
function m0(value, value2) {
  xr = value2 || null;
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
function f0(value, value2 = componentId) {
  const value3 = [...new Set(value || [])];
  if (value3.length) {
    L((value4) => {
      const index = new Map(
        value3.map((value9) => [value9, findComponentLocation(value4, value9)]),
      );
      const value6 = value3
        .filter((value9) => index.get(value9))
        .sort((value9, value10) => {
          const value11 = index.get(value9);
          const value12 = index.get(value10);
          if (value11.collection === value12.collection) {
            return value11.index - value12.index;
          } else {
            return 0;
          }
        });
      const value7 = [];
      const index2 = new Map();
      for (const value9 of value6) {
        const value10 = Gu(value4, value9);
        if (value10) {
          value7.push(value10.id);
          index2.set(value9, value10.id);
        }
      }
      if (value7.length) {
        componentId = index2.get(value2) || value7[0];
        bag = new Set(value7);
        we = componentId;
      }
    });
  }
}
function $N(
  value,
  { includeShared: value2 = true, sourceComponentId: value3 = null } = {},
) {
  if (!value) {
    return [];
  }
  if (value3) {
    return copyComponentTargets(value, value3);
  }
  const value4 = (value.pages || []).map((page) => ({
    key: "page:" + page.path,
    name: page.name,
    scope: "page",
    page: page,
  }));
  if (value2) {
    return [
      {
        key: "shared",
        name: "侧边栏",
        scope: "shared",
      },
      ...value4,
    ];
  } else {
    return value4;
  }
}
function Bc(value) {
  co.replaceChildren(
    ...value.map((value2) => new Option(value2.name, value2.key)),
  );
  co.disabled = !value.length;
  co.value = value[0]?.key || "";
  oe(co);
}
function g0(value) {
  return {
    width: Number(value?.canvas?.width || 2778),
    height: Number(value?.canvas?.height || 1940),
  };
}
function FN() {
  if (vn.value !== "other" || !kt) {
    Ls.hidden = true;
    qm.textContent = "";
    return;
  }
  const value = g0(h?.document);
  const value2 = g0(kt.document);
  const value3 = value.width !== value2.width || value.height !== value2.height;
  Ls.hidden = !value3;
  qm.textContent = value3
    ? value.width +
      " × " +
      value.height +
      " → " +
      value2.width +
      " × " +
      value2.height
    : "";
}
async function Yu() {
  const value = vn.value === "other";
  let value2 = [];
  try {
    value2 = JSON.parse(at.dataset.componentIds || "[]");
  } catch {
    value2 = [];
  }
  const value3 = findComponent(h?.document, value2[0]);
  const length = value2.length;
  const element = at.querySelector("[data-copy-component-description]");
  a1.hidden = !value;
  r1.textContent = value ? "其他仪表盘目标页面" : "本仪表盘目标页面";
  lo.textContent = value ? "复制到目标仪表盘" : "复制并前往";
  element.textContent = value
    ? "将选中的 " +
      length +
      " 个控件完整复制到其他仪表盘的目标页面或侧边栏，源控件不受影响。"
    : value3?.scope === "shared"
      ? "将选中的 " +
        length +
        " 个侧边栏控件完整复制到指定主页面，复制后为该页面的独立控件。"
      : "将选中的 " +
        length +
        " 个控件完整复制到侧边栏或其他主页面，保留位置、尺寸、样式、实体绑定和动作配置。";
  kt = null;
  Ls.hidden = true;
  D(wn, "");
  if (!value) {
    const value6 = p0(h?.document, value2);
    Bc(value6);
    lo.disabled = !value6.length;
    return;
  }
  const value4 = ei.value;
  if (!value4) {
    Bc([]);
    lo.disabled = true;
    D(wn, "当前没有其他仪表盘可以复制。");
    return;
  }
  const value5 = ++Mu;
  Bc([]);
  lo.disabled = true;
  D(wn, "正在读取目标仪表盘…");
  try {
    const value6 = await J(
      "/projects/" + encodeURIComponent(value4) + "/draft",
    );
    if (value5 !== Mu || vn.value !== "other") {
      return;
    }
    kt = value6;
    const value7 = $N(value6.document);
    Bc(value7);
    FN();
    D(wn, value7.length ? "" : "目标仪表盘还没有可复制到的区域。");
    lo.disabled = !value7.length;
  } catch (error) {
    if (value5 !== Mu) {
      return;
    }
    D(wn, error.message, "error");
  }
}
function DN(value) {
  const document = h?.document;
  const value2 = [...new Set(value || [])].filter((value5) =>
    findComponent(document, value5),
  );
  const value3 = findComponent(document, value2[0]);
  if (!value3 || !value2.length) {
    onError(new Error("没有找到要复制的控件。"));
    return;
  }
  at.dataset.componentIds = JSON.stringify(value2);
  i1.textContent =
    value2.length > 1
      ? "已选择 " + value2.length + " 个控件"
      : "“" + componentLabel(value3.component) + "”";
  at.querySelector("[data-copy-component-description]").textContent =
    value2.length > 1
      ? "将选中的 " + value2.length + " 个控件完整复制到目标区域。"
      : value3.scope === "shared"
        ? "将侧边栏控件完整复制到指定主页面，复制后为该页面的独立控件。"
        : "将当前控件完整复制到侧边栏或其他主页面，保留位置、尺寸、样式、实体绑定和动作配置。";
  vn.value = "current";
  oe(vn);
  const value4 = ft.filter((value5) => value5.id !== h.projectId);
  ei.replaceChildren(
    ...value4.map((value5) => new Option(value5.name, value5.id)),
  );
  ei.disabled = !value4.length;
  oe(ei);
  Ml.elements.copyScaleMode.value = "proportional";
  at.showModal();
  Yu();
}
function h0(value) {
  const value2 = [...new Set(value || [])].filter((value3) =>
    findComponent(h?.document, value3),
  );
  if (value2.length) {
    Kt.dataset.componentIds = JSON.stringify(value2);
    if (value2.length > 1) {
      jm.textContent = "“已选择的 " + value2.length + " 个控件”";
    } else {
      const component = findComponent(h?.document, value2[0])?.component;
      jm.textContent =
        "“" +
        componentLabel(
          component || {
            type: "控件",
          },
        ) +
        "”";
    }
    Kt.showModal();
  }
}
function zN(value, value2) {
  const value3 = [...new Set(value || [])];
  if (!value3.length) {
    return;
  }
  const value4 = Uu(value2);
  L((value5) => {
    for (const value6 of value3) {
      const component = findComponent(value5, value6)?.component;
      if (component) {
        component.style = {
          ...(component.style || {}),
        };
        if (value4) {
          component.style.editorLabelColor = value4;
        } else {
          delete component.style.editorLabelColor;
        }
      }
    }
  });
}
function b0(value, value2, value3, scope) {
  value.replaceChildren();
  if (!value2.length) {
    const element = document.createElement("div");
    element.className = "element-list-empty";
    element.textContent = value3;
    value.append(element);
    return;
  }
  for (const value4 of value2) {
    const element = document.createElement("div");
    element.className = "element-item";
    element.dataset.componentId = value4.id;
    element.dataset.scope = scope;
    element.draggable = !De;
    element.classList.toggle("selected", bag.has(value4.id));
    element.classList.toggle("selection-primary", value4.id === componentId);
    element.classList.toggle("group-item", value4.type === "group");
    const value5 = Uu(value4.style?.editorLabelColor);
    element.classList.toggle("has-color-label", !!value5);
    if (value5) {
      element.style.setProperty("--element-label-color", value5);
    }
    const element2 = document.createElement("i");
    element2.className =
      value4.type === "group" ? "element-group-icon" : "element-label-color";
    element2.setAttribute("aria-hidden", "true");
    if (value4.type === "group") {
      element2.innerHTML =
        '<svg viewBox="0 0 24 24" focusable="false"><path d="M3.5 7.5h6l1.8 2h9.2v9.5h-17z"/><path d="M3.5 7.5v-1h6l1.8 2"/></svg>';
    }
    const element3 = document.createElement("span");
    element3.textContent = componentLabel(value4);
    const value6 = value4.style?.visible !== false;
    const element4 = document.createElement("button");
    element4.type = "button";
    element4.className =
      "element-visibility" + (value6 ? "" : " hidden-element");
    element4.setAttribute(
      "aria-label",
      value6
        ? "隐藏" + componentLabel(value4)
        : "显示" + componentLabel(value4),
    );
    element4.innerHTML = MN(value6);
    const value7 = (event) => {
      wc = {
        componentId: value4.id,
        at: Date.now(),
      };
      event.stopPropagation();
    };
    element4.addEventListener("pointerdown", value7);
    element4.addEventListener("click", (event) => {
      wc = {
        componentId: value4.id,
        at: Date.now(),
      };
      event.stopPropagation();
      Oc(value4.id, {
        preserveGroup: true,
      });
      u0([value4.id], !value6);
    });
    element4.addEventListener("dblclick", value7);
    element.append(element2, element3, element4);
    element.addEventListener("click", (value8) => {
      Oc(value4.id, {
        toggle: value8.metaKey || value8.ctrlKey,
        range: value8.shiftKey,
      });
    });
    element.addEventListener("dblclick", (event) => {
      if (
        value4.type !== "group" ||
        event.target.closest(".element-visibility")
      ) {
        return;
      }
      if (wc.componentId === value4.id && Date.now() - wc.at < 600) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      De = value4.id;
      qt();
      _e();
      Mc();
      Z();
    });
    element.addEventListener("contextmenu", (value8) => ON(value8, value4.id));
    element.addEventListener("dragstart", (value8) => {
      if (bag.has(value4.id)) {
        componentId = value4.id;
      } else {
        bag = new Set([value4.id]);
        componentId = value4.id;
        we = value4.id;
      }
      const movingIds = [...bag];
      value8.dataTransfer.effectAllowed = "move";
      value8.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          scope: scope,
          sourceId: value4.id,
          movingIds: movingIds,
        }),
      );
      value.querySelectorAll(".element-item").forEach((element5) => {
        element5.classList.toggle(
          "dragging",
          movingIds.includes(element5.dataset.componentId),
        );
      });
    });
    element.addEventListener("dragend", () => {
      value
        .querySelectorAll(".dragging")
        .forEach((element5) => element5.classList.remove("dragging"));
      value
        .querySelectorAll(".drop-before, .drop-after")
        .forEach((element5) =>
          element5.classList.remove("drop-before", "drop-after"),
        );
    });
    element.addEventListener("dragover", (event) => {
      if (!event.dataTransfer.types.includes("text/plain")) {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const value8 =
        event.clientY >=
        element.getBoundingClientRect().top +
          element.getBoundingClientRect().height / 2;
      element.classList.toggle("drop-before", !value8);
      element.classList.toggle("drop-after", value8);
    });
    element.addEventListener("dragleave", () =>
      element.classList.remove("drop-before", "drop-after"),
    );
    element.addEventListener("drop", (event) => {
      event.preventDefault();
      let value8;
      try {
        value8 = JSON.parse(event.dataTransfer.getData("text/plain"));
      } catch {
        return;
      }
      const { scope: value9, sourceId: value10 } = value8;
      const list = Array.isArray(value8.movingIds)
        ? value8.movingIds
        : [value10];
      const value11 = element.classList.contains("drop-after");
      element.classList.remove("drop-before", "drop-after");
      if (value9 === scope && !!value10 && !list.includes(value4.id)) {
        componentId = value10;
        bag = new Set(list);
        L((document) => {
          const value13 =
            scope === "shared"
              ? document.sharedComponents
              : document.pages.find((value17) => value17.path === W.value)
                  ?.components;
          if (!value13) {
            return;
          }
          const allowed = new Set(list);
          const value14 = value13.filter((value17) => allowed.has(value17.id));
          if (!value14.length) {
            return;
          }
          const value15 = value13.filter((value17) => !allowed.has(value17.id));
          const value16 = value15.findIndex(
            (value17) => value17.id === value4.id,
          );
          if (!(value16 < 0)) {
            value15.splice(value16 + (value11 ? 1 : 0), 0, ...value14);
            value13.splice(0, value13.length, ...value15);
            applyCollectionLayerOrder(value13);
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
function VN(value, value2) {
  if (!value2) {
    return;
  }
  const element = document.createElement("button");
  element.type = "button";
  element.className = "element-group-back";
  element.textContent = "← 返回" + componentLabel(value2);
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
  const value2 = De ? findComponent(h?.document, De) : null;
  const value3 = value2?.component?.type === "group" ? value2.component : null;
  if (De && !value3) {
    De = null;
  }
  const value4 =
    value3 && value2.scope === "shared"
      ? value3.children || []
      : h?.document?.sharedComponents || [];
  const value5 =
    value3 && value2.scope === "page"
      ? value3.children || []
      : value?.components || [];
  b0(Cl, value4, "暂无侧边栏控件", "shared");
  b0(Sl, value5, "暂无主页面控件", "page");
  if (value3) {
    VN(value2.scope === "shared" ? Cl : Sl, value3);
  }
}
function $c(value) {
  vc = value === "page" ? "page" : "shared";
  const value2 = vc === "shared";
  Am.classList.toggle("active", value2);
  Pm.classList.toggle("active", !value2);
  Cl.hidden = !value2;
  Sl.hidden = value2;
  y0();
}
function y0() {
  const value = !!Je();
  const value2 = jt();
  const value3 = ["shared", "page"].some(
    (value4) => listComponentTemplates(value4, value2).length > 0,
  );
  vs.disabled = !value || !value3;
  vs.title = value
    ? value3
      ? "从模板库添加控件"
      : "该区域暂无可用控件模板"
    : "请先新建页面";
}
function WN() {
  const value = jt();
  const value2 = [
    ...listComponentTemplates("shared", value),
    ...listComponentTemplates("page", value),
  ].filter(
    (value3, value4, value5) =>
      value5.findIndex((value6) => value6.id === value3.id) === value4,
  );
  yS.textContent =
    vc === "shared"
      ? "当前添加到侧边栏，添加后会在所有页面显示。"
      : "当前添加到主页面，仅在“" + (Je()?.name || "当前页面") + "”显示。";
  if (!value2.length) {
    const element = document.createElement("div");
    element.className = "component-template-empty";
    element.textContent = "当前 UI 方案暂无可用控件模板。";
    wl.replaceChildren(element);
    return;
  }
  wl.replaceChildren(
    ...value2.map((value3) => {
      const value4 = document.createElement("button");
      value4.type = "button";
      value4.className = "component-template-card";
      value4.dataset.templateId = value3.id;
      const value5 = document.createElement("span");
      value5.className = "component-template-preview";
      value5.setAttribute("aria-hidden", "true");
      if (value3.id === "interaction3d") {
        renderInteraction3dThumbnail(value5);
      } else {
        const value6 = document.createElement("img");
        const value7 = value3.thumbnailId || value3.id;
        value6.src =
          "/bridge-static/component-thumbnails/" +
          encodeURIComponent(value7) +
          ".jpg?v=20260902-component-thumbnails-v3";
        value6.alt = "";
        value5.append(value6);
      }
      const value8 = document.createElement("span");
      value8.className = "component-template-copy";
      const element = document.createElement("strong");
      element.textContent = value3.name;
      const element2 = document.createElement("span");
      element2.textContent = value3.description;
      value8.append(element, element2);
      value4.append(value5, value8);
      if (value3.id === "interaction3d") {
        updateInteraction3dCard(value4);
      }
      return value4;
    }),
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
  "schedule",
]);
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
  zone: "区域",
};
function fe(metadata) {
  return metadata?.domain || String(metadata?.entityId || "").split(".")[0];
}
function Hn(value) {
  const value2 = fe(value);
  if (value?.virtual) {
    return "虚拟实体";
  } else if (RN.has(value2)) {
    return "辅助元素";
  } else {
    return HN[value2] || value2 || "实体";
  }
}
function Tr(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}
function v0(value) {
  return Tr(Iu.get(String(value?.deviceId || "")));
}
function jN(value, value2 = v0(value)) {
  const value3 = Tr(value?.name);
  const value4 = Tr(value?.originalName);
  if (!value2) {
    return value3 || value4 || value?.entityId || "";
  }
  const value5 =
    value3 === value2
      ? ""
      : value3.startsWith(value2 + " ")
        ? value3.slice(value2.length).trim()
        : value3.startsWith(value2 + "·")
          ? value3.slice(value2.length + 1).trim()
          : value3;
  if (value5 && value5 !== value2) {
    return value5;
  } else if (value4 && value4 !== value2) {
    return value4;
  } else {
    return "";
  }
}
function Ot(value, value2 = "") {
  if (value?.virtual) {
    return value.name || value.entityId || "";
  }
  const value3 = v0(value);
  const value4 = Tr(value2) || jN(value, value3);
  if (value3) {
    if (value4 && value4 !== value3) {
      return value3 + " · " + value4;
    } else {
      return value3;
    }
  } else {
    return value4 || value?.entityId || "";
  }
}
function ct(value) {
  const value2 = Ot(value);
  const value3 = value?.entityId || "";
  return (
    "[" +
    Hn(value) +
    "] " +
    value2 +
    (value2 && value2 !== value3 ? " · " + value3 : "")
  );
}
function Ar(component = O()) {
  return [
    ...new Set(
      (Array.isArray(component?.properties?.entityIds)
        ? component.properties.entityIds
        : []
      )
        .map((value) => String(value || "").trim())
        .filter(Boolean),
    ),
  ];
}
function qN(value, value2 = null) {
  if (!value2) {
    return {
      label: "实体已删除",
      tone: "missing",
    };
  }
  const value3 = x?.states?.get?.(value);
  const value4 = value3?.newState || value3;
  const value5 = String(value4?.state ?? "")
    .trim()
    .toLowerCase();
  const value6 = lightStatisticsEntityStateStatus(value2, value4);
  if (value6 === "on") {
    return {
      label: "已开启/运行",
      tone: "on",
    };
  } else if (value6 === "off") {
    return {
      label: "已关闭",
      tone: "off",
    };
  } else if (value5 === "unavailable") {
    return {
      label: "暂时不可用",
      tone: "abnormal",
    };
  } else if (value5 === "unknown") {
    return {
      label: "状态未知",
      tone: "abnormal",
    };
  } else if (value5) {
    return {
      label: "无法判断：" + value5,
      tone: "abnormal",
    };
  } else {
    return {
      label: "等待状态",
      tone: "abnormal",
    };
  }
}
function jn(value = "", value2 = false) {
  ld.textContent = value;
  ld.hidden = !value;
  ld.classList.toggle("error", !!value2);
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
  const value2 = value.trim().toLocaleLowerCase("zh-CN");
  const value3 = qn("light-statistics")
    .map((entity, index) => ({
      entity: entity,
      index: index,
      support: lightStatisticsEntitySupport(entity),
    }))
    .filter(
      ({ entity: value4 }) =>
        !value2 ||
        (ct(value4) + " " + fe(value4))
          .toLocaleLowerCase("zh-CN")
          .includes(value2),
    )
    .sort(
      (value4, value5) =>
        Number(value5.support.supported) - Number(value4.support.supported) ||
        +(fe(value5.entity) === "light") - +(fe(value4.entity) === "light") ||
        value4.index - value5.index,
    )
    .map(({ entity: value4, support: _ }) => {
      const value5 = document.createElement("button");
      value5.type = "button";
      value5.className =
        "inspector-entity-option" + (value4.entityId === Rt ? " selected" : "");
      value5.dataset.lightStatisticsEntityId = value4.entityId;
      value5.setAttribute("role", "option");
      value5.setAttribute("aria-selected", String(value4.entityId === Rt));
      const value6 = document.createElement("span");
      value6.className = "inspector-entity-option-content";
      value6.title = ct(value4);
      const value7 = document.createElement("span");
      value7.className =
        "inspector-entity-option-line inspector-entity-name-line";
      const element = document.createElement("span");
      element.className = "inspector-entity-kind";
      element.textContent = "[" + Hn(value4) + "] ";
      const element2 = document.createElement("span");
      element2.className = "inspector-entity-name";
      element2.textContent = Ot(value4);
      value7.append(element, element2);
      const element3 = document.createElement("span");
      element3.className = "inspector-entity-option-line inspector-entity-id";
      element3.textContent = value4.entityId;
      element3.title = value4.entityId;
      value6.append(value7, element3);
      Gn(value5, value7);
      value5.append(value6);
      return value5;
    });
  if (!value3.length) {
    const element = document.createElement("div");
    element.className = "inspector-picker-empty";
    element.textContent = "没有匹配的实体";
    value3.push(element);
  }
  ka.replaceChildren(...value3);
  ka.scrollTop = 0;
}
function GN(value, value2 = ko) {
  const value3 = O();
  if (
    value3?.type !== "light-statistics" ||
    !qn("light-statistics").find((value5) => value5.entityId === value)
  ) {
    return;
  }
  const value4 = Ar(value3).indexOf(value);
  if (value4 >= 0 && value4 !== value2) {
    jn("该实体已添加，请选择其它实体。", true);
    return;
  }
  Rt = value;
  ko = Number.isInteger(value2) ? value2 : -1;
  Sr = value3.id;
  return w0();
}
function w0() {
  const value = componentId;
  const value2 = Rt;
  const value3 = ko;
  const value4 = le.find((value6) => value6.entityId === value2);
  if (!value || !value2 || !value4) {
    return;
  }
  const value5 = O();
  if (value3 < 0 && Ar(value5).length >= Fc) {
    jn("每个统计控件最多添加 " + Fc + " 个实体。", true);
    return;
  }
  return L((value6) => {
    const component = findComponent(value6, value)?.component;
    if (!component || component.type !== "light-statistics") {
      return "component-invalid";
    }
    const entityIds = Ar(component);
    const value7 = entityIds.indexOf(value2);
    if (value7 >= 0 && value7 !== value3) {
      return "duplicate";
    }
    const value8 =
      value3 >= 0 && value3 < entityIds.length ? entityIds[value3] : "";
    if (!value8 && entityIds.length >= Fc) {
      return "limit-reached";
    }
    if (value3 >= 0 && !value8) {
      return "component-invalid";
    }
    if (value8) {
      entityIds.splice(value3, 1, value2);
    } else {
      entityIds.push(value2);
    }
    const entityLabels = {
      ...(component.properties?.entityLabels || {}),
    };
    if (value8 && value8 !== value2) {
      delete entityLabels[value8];
    }
    entityLabels[value2] = Ot(value4);
    component.properties = {
      ...(component.properties || {}),
      entityIds: entityIds,
      entityLabels: entityLabels,
    };
    if (value8) {
      return "replaced";
    } else {
      return "added";
    }
  }).then((value6) =>
    value6 === "limit-reached"
      ? (jn("每个统计控件最多添加 " + Fc + " 个实体。", true), value6)
      : value6 === "duplicate"
        ? (jn("该实体已添加，请选择其它实体。", true), value6)
        : value6 === "component-invalid"
          ? (jn("当前统计控件已发生变化，请重新选择。", true), value6)
          : ((value6 !== "added" && value6 !== "replaced") ||
              (Pr({
                clearMessage: false,
              }),
              jn(
                value6 === "replaced" ? "已更换统计实体。" : "已加入统计列表。",
              )),
            value6),
  );
}
function UN(value) {
  const value2 = componentId;
  if (!!value2 && !!Number.isInteger(value) && !(value < 0)) {
    L((value3) => {
      const component = findComponent(value3, value2)?.component;
      if (!component || component.type !== "light-statistics") {
        return;
      }
      const entityIds = Ar(component);
      const [value4] = entityIds.splice(value, 1);
      const entityLabels = {
        ...(component.properties?.entityLabels || {}),
      };
      if (value4) {
        delete entityLabels[value4];
      }
      component.properties = {
        ...(component.properties || {}),
        entityIds: entityIds,
        entityLabels: entityLabels,
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
  const value2 = component.properties?.entityLabels || {};
  U1.textContent = value.length + " 个";
  const value3 = value.map((value4, value5) => {
    const value6 =
      qn("light-statistics").find((value11) => value11.entityId === value4) ||
      null;
    const value7 = qN(value4, value6);
    const value8 = document.createElement("div");
    value8.className =
      "light-statistics-entity-row " + value7.tone + (value6 ? "" : " missing");
    const value9 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = value6 ? Ot(value6) : value2[value4] || value4;
    const element2 = document.createElement("small");
    element2.textContent = value4 + " · " + value7.label;
    value9.append(element, element2);
    const value10 = document.createElement("span");
    value10.className = "light-statistics-entity-actions";
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.dataset.lightStatisticsReplaceIndex = String(value5);
    element3.textContent = "更换";
    const element4 = document.createElement("button");
    element4.type = "button";
    element4.dataset.lightStatisticsRemoveIndex = String(value5);
    element4.textContent = "删除";
    value10.append(element3, element4);
    value8.append(value9, value10);
    return value8;
  });
  ag.replaceChildren(...value3);
}
function S0(value, value2 = []) {
  for (const value3 of value || []) {
    value2.push(value3);
    S0(value3.children, value2);
  }
  return value2;
}
function _N(value = Je()) {
  if (!value || !h?.document) {
    return [];
  }
  const index = new Map(
    (h.document.sharedComponents || []).map((value4) => [value4.id, value4]),
  );
  const value3 = (value.sharedComponentIds || [])
    .map((value4) => index.get(value4))
    .filter(Boolean);
  return S0([...(value.components || []), ...value3]);
}
function kr(value = Je()) {
  if (_N(value).some((value2) => value2.type === "icon-button-effect")) {
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
function Gn(value, value2) {
  const value3 = (Array.isArray(value2) ? value2 : [value2]).filter(Boolean);
  for (const value4 of value3) {
    value4.dataset.overflowScrollPreview = "true";
  }
  if (value && value3.length) {
    value.dataset.overflowScrollPreviewRow = "true";
    x0.set(value, value3);
  }
}
function N0(value) {
  const value2 = value.closest?.(YN);
  if (value2) {
    return value2;
  }
  const value3 = value.closest?.("[data-overflow-scroll-preview-row]");
  return x0.get(value3)?.[0] || null;
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
function Mr(value, value2, value3 = "") {
  const element = I0(value);
  if (element) {
    element.textContent = value2;
    element.title = value3 || value2;
    value.title = value3 || value2;
  }
}
document.addEventListener("pointerover", (value) => {
  const element = N0(value.target);
  const value2 = E0(element);
  const value3 =
    value.relatedTarget instanceof Node &&
    value2?.contains(value.relatedTarget);
  if (!element || value3 || Dc.has(element)) {
    return;
  }
  const count = Math.max(0, element.scrollWidth - element.clientWidth);
  if (count <= 2) {
    return;
  }
  const value4 = {
    timer: null,
    frame: null,
  };
  Dc.set(element, value4);
  value4.timer = window.setTimeout(() => {
    if (!element.isConnected) {
      L0(element);
      return;
    }
    element.classList.add("hover-scrolling");
    const value5 = performance.now();
    const value6 = (value7) => {
      const value8 = (value7 - value5) * 0.04;
      element.scrollLeft = Math.min(count, value8);
      if (value8 < count) {
        value4.frame = window.requestAnimationFrame(value6);
      }
    };
    value4.frame = window.requestAnimationFrame(value6);
  }, 350);
});
document.addEventListener("pointerout", (value) => {
  const value2 = N0(value.target);
  const value3 = E0(value2);
  const value4 =
    value.relatedTarget instanceof Node &&
    value3?.contains(value.relatedTarget);
  if (!!value2 && !value4) {
    L0(value2);
  }
});
function fn7(value, value2) {
  value.hidden = true;
  value2.setAttribute("aria-expanded", "false");
  if (value === Re) {
    Qe();
    Ht(Vn.get(po));
  }
  if (value === He) {
    Qe();
    Ht(Vn.get(ho));
  }
}
function fn8(value = null) {
  if (value !== "entity") {
    fn7(aa, oi);
  }
  if (value !== "weather-entity") {
    fn7(Zd, Jd);
  }
  if (value !== "line-chart-entity") {
    fn7(eu, Qd);
  }
  if (value !== "ibe-entity") {
    fn7(Ts, Gl);
  }
  if (value !== "icon-button-entity") {
    fn7(mi, pi);
  }
  if (value !== "vacuum-map-entity") {
    fn7(nc, Gd);
  }
  if (value !== "camera-entity") {
    fn7(ac, Yd);
  }
  if (value !== "air-conditioner-entity") {
    fn7(Js, Dd);
  }
  if (value !== "title-button-entity") {
    fn7(Ms, ad);
  }
  if (value !== "light-statistics-entity") {
    const value2 = !Ie.hidden;
    fn7(Ie, rt);
    if (value2) {
      Pr();
    }
  }
  if (value !== "light-statistics-action-entity") {
    fn7(Vs, dd);
  }
  if (value !== "navigation-entity") {
    fn7(iu, ou);
  }
  if (value !== "asset") {
    fn7(Re, Cn);
  }
  if (value !== "ibe-asset") {
    fn7(He, En);
  }
  if (value !== "ibe-icon") {
    fn7(Et, Qt);
  }
  if (value !== "icon-button-icon") {
    fn7(It, Lt);
  }
  if (value !== "title-button-icon") {
    fn7(je, tn);
  }
  if (value !== "light-statistics-icon") {
    fn7(qe, nn);
  }
  if (value !== "navigation-icon") {
    fn7(Tt, on);
  }
}
function Fi(value) {
  const value2 = String(value || "")
    .trim()
    .replace(/^mdi:/, "");
  if (/^[a-z0-9-]+$/.test(value2)) {
    return "/bridge-static/vendor/mdi/7.4.47/svg/" + value2 + ".svg";
  } else {
    return "";
  }
}
function XN(value) {
  const text = String(value || "");
  const element = on.querySelector("i");
  const element2 = on.querySelector("span");
  const value2 = Fi(text);
  element.hidden = !value2;
  element.style.maskImage = value2 ? 'url("' + value2 + '")' : "";
  element.style.webkitMaskImage = value2 ? 'url("' + value2 + '")' : "";
  element2.textContent = text || "不使用图标";
  cr.disabled = !text;
  cr.title = text ? "复制 " + text : "当前未使用图标";
}
function KN(value) {
  const text = String(value || "");
  const element = Qt.querySelector("i");
  const element2 = Qt.querySelector("span");
  const value2 = Fi(text);
  element.hidden = !value2;
  element.style.maskImage = value2 ? 'url("' + value2 + '")' : "";
  element.style.webkitMaskImage = value2 ? 'url("' + value2 + '")' : "";
  element2.textContent = text || "不使用图标";
  wa.disabled = !text;
  wa.title = text ? "复制 " + text : "当前未使用图标";
}
function JN(value) {
  const text = String(value || "");
  const value2 = ["device-button", "presence-sensor"].includes(O()?.type);
  const element = Lt.querySelector("i");
  const element2 = Lt.querySelector("span");
  const value3 = Fi(text);
  element.hidden = !value3;
  element.style.maskImage = value3 ? 'url("' + value3 + '")' : "";
  element.style.webkitMaskImage = value3 ? 'url("' + value3 + '")' : "";
  element2.textContent = text || (value2 ? "跟随实体图标" : "不使用图标");
  Da.disabled = !text;
  Da.title = text ? "复制 " + text : "当前未使用图标";
}
function ZN(value) {
  const text = String(value || "");
  const element = tn.querySelector("i");
  const element2 = tn.querySelector("span");
  const value2 = Fi(text);
  element.hidden = !value2;
  element.style.maskImage = value2 ? 'url("' + value2 + '")' : "";
  element.style.webkitMaskImage = value2 ? 'url("' + value2 + '")' : "";
  element2.textContent = text || "不使用图标";
  La.disabled = !text;
  La.title = text ? "复制 " + text : "当前未使用图标";
}
function QN(value) {
  const text = String(value ?? "mdi:lightbulb-group-outline");
  const element = nn.querySelector("i");
  const element2 = nn.querySelector("span");
  const value2 = Fi(text);
  element.hidden = !value2;
  element.style.maskImage = value2 ? 'url("' + value2 + '")' : "";
  element.style.webkitMaskImage = value2 ? 'url("' + value2 + '")' : "";
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
  const value2 = document.execCommand("copy");
  element.remove();
  if (!value2) {
    throw new Error("复制失败。");
  }
}
function T0(value, fn9 = () => value.dataset.entityId || "") {
  if (!value || value.dataset.entityCopyReady === "true") {
    return value._entityCopySync;
  }
  I0(value);
  const value2 = document.createElement("div");
  value2.className = "entity-picker-field-row";
  const element = document.createElement("button");
  element.type = "button";
  element.className = "navigation-icon-copy entity-picker-copy";
  element.title = "复制实体 ID";
  element.setAttribute("aria-label", "复制实体 ID");
  element.disabled = true;
  element.innerHTML =
    '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8" height="8" rx="1.3"></rect><path d="M10.5 5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9A1.5 1.5 0 0 0 3.5 10.5H5"></path></svg><span aria-hidden="true">✓</span>';
  const fn10 = () => {
    const text = String(fn9() || "");
    element.dataset.entityId = text;
    element.disabled = !text;
    element.title = text ? "复制 " + text : "当前未选择实体";
  };
  element.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value3 = element.dataset.entityId || "";
    if (value3) {
      try {
        await zo(value3);
        element.classList.add("copied");
        window.setTimeout(() => element.classList.remove("copied"), 1000);
      } catch (error) {
        onError(error);
      }
    }
  });
  value.replaceWith(value2);
  value2.append(value, element);
  value.dataset.entityCopyReady = "true";
  value._entityCopySync = fn10;
  fn10();
  return fn10;
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
    "popup-module-entity-button",
  ]) {
    const value2 = document.getElementById(value);
    if (value2) {
      T0(value2);
    }
  }
}
eE();
const tE = 160;
const A0 = new WeakMap();
function nE(value) {
  let value2 = A0.get(value);
  if (!value2) {
    value2 = {
      query: "",
      offset: 0,
      total: 0,
      loading: false,
      complete: false,
      generation: 0,
    };
    A0.set(value, value2);
  }
  return value2;
}
let Ku = null;
function Ju() {
  Ku?.remove();
  Ku = null;
}
function P0(element, value) {
  Ju();
  const value2 = element.closest("dialog");
  if (!value2?.open || !value) {
    return;
  }
  const element2 = document.createElement("div");
  element2.className = "editor-icon-name-tooltip";
  element2.textContent = value;
  value2.append(element2);
  const value3 = element.getBoundingClientRect();
  const value4 = element2.getBoundingClientRect();
  const value5 = Math.min(
    window.innerWidth - value4.width - 8,
    Math.max(8, value3.left + (value3.width - value4.width) / 2),
  );
  let value6 = value3.top - value4.height - 8;
  if (value6 < 8) {
    value6 = value3.bottom + 8;
  }
  element2.style.left = value5 + "px";
  element2.style.top = value6 + "px";
  Ku = element2;
}
function oE(value, value2) {
  value.addEventListener("pointerenter", () => P0(value, value2));
  value.addEventListener("pointerleave", Ju);
  value.addEventListener("focus", () => P0(value, value2));
  value.addEventListener("blur", Ju);
}
async function Or({
  optionsElement: value,
  query: value2 = "",
  currentIcon: value3 = "",
  clearLabel: value4 = "不使用图标",
  datasetKey: value5 = "iconName",
  append: value6 = false,
}) {
  const value7 = String(value2 || "").trim();
  const value8 = nE(value);
  if (!value6 || value8.query !== value7) {
    value8.query = value7;
    value8.offset = 0;
    value8.total = 0;
    value8.loading = false;
    value8.complete = false;
    value8.generation += 1;
    const element2 = document.createElement("div");
    element2.className = "navigation-icon-load-state";
    element2.textContent = "正在加载图标…";
    value.replaceChildren(rE(value3, value4, value5), element2);
    value.scrollTop = 0;
  }
  if (value8.loading || value8.complete) {
    return;
  }
  const generation = value8.generation;
  const navigationIconLoadState = value.querySelector(
    ".navigation-icon-load-state",
  );
  value8.loading = true;
  if (navigationIconLoadState) {
    navigationIconLoadState.textContent = value8.offset
      ? "正在加载更多图标…"
      : "正在加载图标…";
  }
  try {
    const value9 = await J(
      "/icons?query=" +
        encodeURIComponent(value8.query) +
        "&limit=" +
        tE +
        "&offset=" +
        value8.offset,
    );
    if (generation !== value8.generation) {
      return;
    }
    const value10 = value9.items || [];
    const value11 = value10.map((value12) => B0(value12, value3, value5));
    if (navigationIconLoadState && value11.length) {
      navigationIconLoadState.before(...value11);
    }
    value8.offset += value10.length;
    value8.total = Math.max(Number(value9.total) || 0, value8.offset);
    value8.complete = !value10.length || value8.offset >= value8.total;
    value8.loading = false;
    if (navigationIconLoadState) {
      navigationIconLoadState.textContent = value8.total
        ? value8.complete
          ? "已显示全部 " + value8.total + " 个图标"
          : "已加载 " + value8.offset + " / " + value8.total + " · 继续向下滚动"
        : "没有匹配的图标";
    }
  } catch (error) {
    if (generation === value8.generation) {
      value8.loading = false;
      if (navigationIconLoadState) {
        navigationIconLoadState.textContent = "图标加载失败，请稍后重试";
      }
    }
    throw error;
  }
}
function Br(value, fn9) {
  value.addEventListener("scroll", () => {
    if (!(value.scrollHeight - value.scrollTop - value.clientHeight > 120)) {
      fn9().catch(onError);
    }
  });
}
async function Zu(query = "", { append = false } = {}) {
  return Or({
    optionsElement: dr,
    query: query,
    currentIcon: O()?.properties?.icon || "",
    append: append,
  });
}
async function Qu(query = "", { append = false } = {}) {
  return Or({
    optionsElement: Sa,
    query: query,
    currentIcon: O()?.properties?.icon || "",
    append: append,
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
    append: append,
  });
}
async function tp(query = "", { append = false } = {}) {
  return Or({
    optionsElement: Ta,
    query: query,
    currentIcon: O()?.properties?.icon || "",
    append: append,
  });
}
async function np(query = "", { append = false } = {}) {
  const value = O()?.properties || {};
  const currentIcon = String(
    Object.hasOwn(value, "icon")
      ? value.icon || ""
      : "mdi:lightbulb-group-outline",
  );
  return Or({
    optionsElement: Ba,
    query: query,
    currentIcon: currentIcon,
    datasetKey: "lightStatisticsIconName",
    append: append,
  });
}
Br(dr, () =>
  Zu(lr.value, {
    append: true,
  }),
);
Br(Sa, () =>
  Qu(Ca.value, {
    append: true,
  }),
);
Br(Va, () =>
  ep(za.value, {
    append: true,
  }),
);
Br(Ta, () =>
  tp(Ia.value, {
    append: true,
  }),
);
Br(Ba, () =>
  np(Oa.value, {
    append: true,
  }),
);
function k0() {
  if (Tt.hidden) {
    return;
  }
  const value = on.parentElement.getBoundingClientRect();
  const value2 = 5;
  const value3 = 8;
  const value4 = window.innerHeight - value.bottom - value2 - value3;
  const value5 = value.top - value2 - value3;
  const value6 = value4 >= 250 || value4 >= value5;
  const count = Math.max(150, Math.min(390, value6 ? value4 : value5));
  Tt.style.left =
    clampNumber(
      value.left,
      value3,
      Math.max(value3, window.innerWidth - value.width - value3),
    ) + "px";
  Tt.style.top = value6
    ? value.bottom + value2 + "px"
    : Math.max(value3, value.top - count - value2) + "px";
  Tt.style.width = value.width + "px";
  Tt.style.maxHeight = count + "px";
  dr.style.maxHeight = Math.max(90, count - 57) + "px";
}
function M0() {
  if (Et.hidden) {
    return;
  }
  const value = Qt.parentElement.getBoundingClientRect();
  const value2 = 5;
  const value3 = 8;
  const value4 = window.innerHeight - value.bottom - value2 - value3;
  const value5 = value.top - value2 - value3;
  const value6 = value4 >= 250 || value4 >= value5;
  const count = Math.max(150, Math.min(390, value6 ? value4 : value5));
  Et.style.left =
    clampNumber(
      value.left,
      value3,
      Math.max(value3, window.innerWidth - value.width - value3),
    ) + "px";
  Et.style.top = value6
    ? value.bottom + value2 + "px"
    : Math.max(value3, value.top - count - value2) + "px";
  Et.style.width = value.width + "px";
  Et.style.maxHeight = count + "px";
  Sa.style.maxHeight = Math.max(90, count - 57) + "px";
}
function O0() {
  if (It.hidden) {
    return;
  }
  const value = Lt.parentElement.getBoundingClientRect();
  const value2 = 5;
  const value3 = 8;
  const value4 = window.innerHeight - value.bottom - value2 - value3;
  const value5 = value.top - value2 - value3;
  const value6 = value4 >= 250 || value4 >= value5;
  const count = Math.max(150, Math.min(390, value6 ? value4 : value5));
  It.style.left =
    clampNumber(
      value.left,
      value3,
      Math.max(value3, window.innerWidth - value.width - value3),
    ) + "px";
  It.style.top = value6
    ? value.bottom + value2 + "px"
    : Math.max(value3, value.top - count - value2) + "px";
  It.style.width = value.width + "px";
  It.style.maxHeight = count + "px";
  Va.style.maxHeight = Math.max(90, count - 57) + "px";
}
function op() {
  if (je.hidden) {
    return;
  }
  const value = tn.parentElement.getBoundingClientRect();
  const value2 = 5;
  const value3 = 8;
  const value4 = window.innerHeight - value.bottom - value2 - value3;
  const value5 = value.top - value2 - value3;
  const value6 = value4 >= 250 || value4 >= value5;
  const count = Math.max(150, Math.min(390, value6 ? value4 : value5));
  je.style.left =
    clampNumber(
      value.left,
      value3,
      Math.max(value3, window.innerWidth - value.width - value3),
    ) + "px";
  je.style.top = value6
    ? value.bottom + value2 + "px"
    : Math.max(value3, value.top - count - value2) + "px";
  je.style.width = value.width + "px";
  je.style.maxHeight = count + "px";
  Ta.style.maxHeight = Math.max(90, count - 57) + "px";
}
function ip() {
  if (qe.hidden) {
    return;
  }
  const value = nn.parentElement.getBoundingClientRect();
  const value2 = 5;
  const value3 = 8;
  const value4 = window.innerHeight - value.bottom - value2 - value3;
  const value5 = value.top - value2 - value3;
  const value6 = value4 >= 250 || value4 >= value5;
  const count = Math.max(150, Math.min(390, value6 ? value4 : value5));
  qe.style.left =
    clampNumber(
      value.left,
      value3,
      Math.max(value3, window.innerWidth - value.width - value3),
    ) + "px";
  qe.style.top = value6
    ? value.bottom + value2 + "px"
    : Math.max(value3, value.top - count - value2) + "px";
  qe.style.width = value.width + "px";
  qe.style.maxHeight = count + "px";
  Ba.style.maxHeight = Math.max(90, count - 57) + "px";
}
function ap() {
  if (Ie.hidden) {
    return;
  }
  const value = rt.getBoundingClientRect();
  const value2 = 5;
  const value3 = 8;
  const value4 = Math.min(value.width, window.innerWidth - value3 * 2);
  const value5 = window.innerHeight - value.bottom - value2 - value3;
  const value6 = value.top - value2 - value3;
  const value7 = value5 >= 250 || value5 >= value6;
  const count = Math.max(150, Math.min(430, value7 ? value5 : value6));
  Ie.style.left =
    clampNumber(
      value.left,
      value3,
      Math.max(value3, window.innerWidth - value4 - value3),
    ) + "px";
  Ie.style.top = value7
    ? value.bottom + value2 + "px"
    : Math.max(value3, value.top - count - value2) + "px";
  Ie.style.width = value4 + "px";
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
        TOGGLE_ENTITY_DOMAINS.has(fe(recommended)) ? 2 : 0,
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
        recommended?.virtual
          ? 3
          : TOGGLE_ENTITY_DOMAINS.has(fe(recommended))
            ? 2
            : 0,
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
        recommended?.virtual
          ? 3
          : TOGGLE_ENTITY_DOMAINS.has(fe(recommended))
            ? 2
            : 0,
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
        ["camera", "image"].includes(fe(recommended))
          ? /(?:^|[_.\s-])map(?:$|[_.\s-])|地图/i.test(
              (recommended.entityId || "") + " " + (recommended.name || ""),
            )
            ? 2
            : 1
          : 0,
    };
  } else if (componentType === "camera") {
    return {
      componentType: componentType,
      button: Yd,
      menu: ac,
      search: Bx,
      options: $x,
      except: "camera-entity",
      recommended: (recommended) => fe(recommended) === "camera",
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
        fe(recommended) === "climate" ? 2 : fe(recommended) === "fan" ? 1 : 0,
    };
  } else if (componentType === "device-button") {
    return {
      componentType: componentType,
      button: pi,
      menu: mi,
      search: md,
      options: fd,
      except: "icon-button-entity",
      recommended: (recommended) => TOGGLE_ENTITY_DOMAINS.has(fe(recommended)),
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
          " " +
          (recommended.name || "") +
          " " +
          (recommended.originalName || "") +
          " " +
          (recommended.translationKey || "");
        const recommended3 = O()?.properties?.sensorKind || "presence";
        const recommended4 = fe(recommended);
        if (recommended4 === "event") {
          if (
            recommended3 === "presence" &&
            /motion|occupancy|presence|pir|moving|移动|运动|人体|有人/i.test(
              recommended2,
            )
          ) {
            return 4;
          } else {
            return 0;
          }
        } else if (recommended4 !== "binary_sensor") {
          return 0;
        } else if (recommended3 === "water-leak") {
          if (
            /moisture|water|leak|flood|wet|水浸|漏水|积水|湿/i.test(
              recommended2,
            )
          ) {
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
              recommended2,
            )
          ) {
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
          /presence|occupancy|人在|有人|存在|人体/i.test(recommended2)
        ) {
          return 3;
        } else if (/motion|移动|运动/i.test(recommended2)) {
          return 1;
        } else {
          return 2;
        }
      },
    };
  } else if (componentType === "icon-button") {
    return {
      componentType: componentType,
      button: pi,
      menu: mi,
      search: md,
      options: fd,
      except: "icon-button-entity",
      recommended: (recommended) => fe(recommended) === "light",
    };
  } else if (componentType === "icon-button-effect") {
    return {
      componentType: componentType,
      button: Gl,
      menu: Ts,
      search: T1,
      options: A1,
      except: "ibe-entity",
      recommended: (recommended) => fe(recommended) === "light",
    };
  } else if (componentType === "weather") {
    return {
      componentType: componentType,
      button: Jd,
      menu: Zd,
      search: Hx,
      options: jx,
      except: "weather-entity",
      recommended: (recommended) => fe(recommended) === "weather",
    };
  } else if (componentType === "line-chart") {
    return {
      componentType: componentType,
      button: Qd,
      menu: eu,
      search: Gx,
      options: Ux,
      except: "line-chart-entity",
      recommended: (recommended) => fe(recommended) === "sensor",
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
        ["image", "camera"].includes(fe(recommended)),
    };
  }
}
function $r(value = "", value2 = "image") {
  const value3 = Un(value2);
  const value4 = O()?.bindings?.entity?.entityId || "";
  const value5 = value.trim().toLocaleLowerCase("zh-CN");
  const value6 = qn(value2)
    .map((entity, index) => ({
      entity: entity,
      index: index,
    }))
    .filter(
      ({ entity: value8 }) =>
        !value5 ||
        (ct(value8) + " " + fe(value8))
          .toLocaleLowerCase("zh-CN")
          .includes(value5),
    )
    .sort((value8, value9) => {
      const fn9 = (value10) =>
        value10?.virtual ? 100 : Number(value3.recommended(value10));
      return (
        fn9(value9.entity) - fn9(value8.entity) || value8.index - value9.index
      );
    })
    .map(({ entity: value8 }) => value8);
  const element = document.createElement("button");
  element.type = "button";
  element.className =
    "inspector-entity-option inspector-entity-clear" +
    (value4 ? "" : " selected");
  element.dataset.entityId = "";
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(!value4));
  element.textContent = "不使用实体";
  const value7 = value6.map((value8) => {
    const value9 = document.createElement("button");
    value9.type = "button";
    value9.className =
      "inspector-entity-option" +
      (value8.entityId === value4 ? " selected" : "");
    value9.dataset.entityId = value8.entityId;
    value9.setAttribute("role", "option");
    value9.setAttribute("aria-selected", String(value8.entityId === value4));
    const value10 = document.createElement("span");
    value10.className = "inspector-entity-option-content";
    value10.title = ct(value8);
    const value11 = document.createElement("span");
    value11.className =
      "inspector-entity-option-line inspector-entity-name-line";
    const element3 = document.createElement("span");
    element3.className = "inspector-entity-kind";
    element3.textContent = "[" + Hn(value8) + "] ";
    const element4 = document.createElement("span");
    element4.className = "inspector-entity-name";
    element4.textContent = Ot(value8);
    value11.append(element3, element4);
    const element5 = document.createElement("span");
    element5.className = "inspector-entity-option-line inspector-entity-id";
    element5.textContent = value8.entityId;
    element5.title = value8.entityId;
    value10.append(value11, element5);
    Gn(value9, value11);
    value9.append(value10);
    return value9;
  });
  const element2 = document.createElement("div");
  element2.className = "inspector-picker-empty";
  if (!value6.length) {
    element2.textContent = "没有匹配的实体";
  }
  value3.options.replaceChildren(
    element,
    ...value7,
    ...(element2.textContent ? [element2] : []),
  );
  value3.options.scrollTop = 0;
}
function Bt(component) {
  const value = Un(component.type);
  const value2 = component.bindings?.entity?.entityId || "";
  const value3 = qn(component.type).find(
    (value5) => value5.entityId === value2,
  );
  const value4 = value3 ? ct(value3) : value2 || "不使用实体";
  let inspectorPickerValue = value.button.querySelector(
    ".inspector-picker-value",
  );
  if (!inspectorPickerValue) {
    inspectorPickerValue = document.createElement("span");
    inspectorPickerValue.className = "inspector-picker-value";
    value.button.replaceChildren(inspectorPickerValue);
    Gn(value.button, inspectorPickerValue);
  }
  inspectorPickerValue.textContent = value4;
  inspectorPickerValue.title = value4;
  value.button.dataset.entityId = value2;
  value.button._entityCopySync?.();
  value.search.value = "";
  if (!value.menu.hidden) {
    $r("", component.type);
  }
  aE(
    component,
    value.relatedSettings === false
      ? null
      : value.button.closest(".inspector-picker"),
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
    le
      .map((value) => [String(value.entityId || ""), value])
      .filter(([value]) => value),
  );
}
function Dr() {
  return new Map(
    cn
      .map((value) => [String(value.deviceId || ""), value])
      .filter(([value]) => value),
  );
}
function lp() {
  const value = String(mn?.value || "")
    .trim()
    .toLocaleLowerCase("zh-CN");
  let value2 = 0;
  for (const value4 of Wo?.querySelectorAll("[data-related-entity-id]") || []) {
    const value5 =
      !value ||
      String(value4.dataset.relatedEntitySearch || "").includes(value);
    value4.hidden = !value5;
    if (value5) {
      value2 += 1;
    }
  }
  const value3 = Wo?.querySelector(".popup-related-entity-filter-empty");
  if (value3) {
    value3.hidden = value2 > 0;
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
  const value2 = document.createElement("div");
  value2.className = "popup-related-entity-dialog-heading";
  const value3 = document.createElement("div");
  cp = document.createElement("strong");
  const element2 = document.createElement("span");
  element2.textContent = "选择要放进设备弹窗的功能";
  value3.append(cp, element2);
  const element3 = document.createElement("button");
  element3.type = "button";
  element3.setAttribute("aria-label", "关闭关联功能选择");
  element3.textContent = "×";
  value2.append(value3, element3);
  const value4 = document.createElement("label");
  value4.className = "popup-related-entity-dialog-search";
  mn = document.createElement("input");
  mn.type = "search";
  mn.placeholder = "搜索功能名称或实体 ID";
  mn.autocomplete = "off";
  value4.append(mn);
  Wo = document.createElement("div");
  Wo.className = "popup-related-entity-list";
  const value5 = document.createElement("div");
  value5.className = "popup-related-entity-dialog-footer";
  const element4 = document.createElement("button");
  element4.type = "button";
  element4.textContent = "完成";
  value5.append(element4);
  value.append(value2, value4, Wo, value5);
  Ze.append(value);
  document.body.append(Ze);
  Di.addEventListener("click", () => {
    if (!Ze.open) {
      mn.value = "";
      lp();
      Ze.showModal();
      window.requestAnimationFrame(() =>
        mn.focus({
          preventScroll: true,
        }),
      );
    }
  });
  mn.addEventListener("input", lp);
  element3.addEventListener("click", () => Ze.close());
  element4.addEventListener("click", () => Ze.close());
  Ze.addEventListener("click", (value6) => {
    if (value6.target === Ze) {
      Ze.close();
    }
  });
  Wo.addEventListener("click", (value6) => {
    const value7 = value6.target.closest("[data-related-entity-id]");
    const value8 = componentId;
    if (!value7 || !value8 || value7.disabled) {
      return;
    }
    const text = String(value7.dataset.relatedEntityId || "");
    const value9 = O();
    const value10 = Fr();
    const value11 = Dr();
    if (!relatedPopupContext(value9, value10, value11)) {
      return;
    }
    const value12 = selectedRelatedEntityIds(value9);
    const allowed = new Set(
      value12 === null
        ? legacyRelatedEntityIds(value9, value10, value11)
        : value12,
    );
    const value13 = relatedPopupContext(value9, value10, value11);
    const value14 = relatedPopupSelectionLimit(value13);
    if (allowed.has(text)) {
      allowed.delete(text);
    } else if (!value14 || allowed.size < value14) {
      allowed.add(text);
    } else {
      return;
    }
    L((value15) => {
      const component = findComponent(value15, value8)?.component;
      if (component) {
        component.properties = {
          ...(component.properties || {}),
          relatedEntities: manualRelatedEntityConfig([...allowed]),
        };
      }
    });
  });
  return Vo;
}
function aE(value, value2) {
  const value3 = iE();
  const value4 = Fr();
  const value5 = Dr();
  const value6 = relatedPopupContext(value, value4, value5);
  if (!value6 || !value2) {
    value3.hidden = true;
    if (Ze?.open) {
      Ze.close();
    }
    return;
  }
  if (value3.previousElementSibling !== value2) {
    value2.insertAdjacentElement("afterend", value3);
  }
  value3.hidden = false;
  const value7 = selectedRelatedEntityIds(value);
  const value8 = value7 === null;
  const allowed = new Set(
    value8 ? legacyRelatedEntityIds(value, value4, value5) : value7,
  );
  const value9 = relatedPopupSelectionLimit(value6);
  const value10 = value9 > 0 && allowed.size >= value9;
  const value11 = relatedPopupCandidates(value, value4, value5);
  const allowed2 = new Set(value11.map((value13) => value13.entityId));
  for (const name of allowed) {
    if (!allowed2.has(name)) {
      value11.push({
        entityId: name,
        domain: String(name).split(".", 1)[0],
        name: name,
        status: "missing",
      });
    }
  }
  rp.textContent = value6.deviceLabel + "弹窗功能";
  zc.textContent = value8
    ? "自动适配"
    : "已选 " + allowed.size + (value9 ? " / " + value9 : "") + " 项";
  zc.classList.toggle("is-automatic", value8);
  sp.textContent = value8
    ? "当前沿用原来的自动适配，点击可改为手动选择。"
    : "只显示已勾选的关联功能" +
      (value9 ? "，最多 " + value9 + " 项" : "") +
      "。";
  cp.textContent =
    value6.deviceLabel +
    "弹窗功能 · " +
    (value8
      ? "自动适配"
      : "已选 " + allowed.size + (value9 ? " / " + value9 : "") + " 项");
  const value12 = value11.map((metadata) => {
    const value14 = allowed.has(metadata.entityId);
    const value15 = relatedEntityIsAvailable(metadata);
    const value16 = document.createElement("button");
    value16.type = "button";
    const value17 = value10 && !value14;
    value16.className =
      "popup-related-entity-option" +
      (value14 ? " selected" : "") +
      (value15 ? "" : " unavailable") +
      (value17 ? " limit-reached" : "");
    value16.dataset.relatedEntityId = metadata.entityId;
    value16.setAttribute("aria-pressed", String(value14));
    value16.disabled = (!value15 && !value14) || value17;
    const value18 = document.createElement("i");
    value18.setAttribute("aria-hidden", "true");
    const value19 = document.createElement("span");
    const element = document.createElement("strong");
    const value20 = relatedEntityLabel(value6, metadata);
    element.textContent = Ot(metadata, value20);
    const element2 = document.createElement("small");
    const value21 = [
      RELATED_ENTITY_DOMAIN_LABELS[
        String(metadata.domain || metadata.entityId || "").split(".", 1)[0]
      ] || "实体",
      metadata.entityId,
    ];
    if (value15) {
      if (value17) {
        value21.push("最多选择 " + value9 + " 项");
      } else if (relatedEntityNeedsConfirmation(metadata)) {
        value21.push("点击时需确认");
      }
    } else {
      value21.push("暂时不可用");
    }
    element2.textContent = value21.join(" · ");
    value16.dataset.relatedEntitySearch = (
      element.textContent +
      " " +
      (metadata.name || "") +
      " " +
      (metadata.originalName || "") +
      " " +
      element2.textContent
    ).toLocaleLowerCase("zh-CN");
    Gn(value16, element);
    value19.append(element, element2);
    value16.append(value18, value19);
    return value16;
  });
  if (value12.length) {
    const element = document.createElement("div");
    element.className =
      "popup-related-entity-empty popup-related-entity-filter-empty";
    element.textContent = "没有匹配的关联功能。";
    element.hidden = true;
    value12.push(element);
  } else {
    const element = document.createElement("div");
    element.className = "popup-related-entity-empty";
    element.textContent = "这个 HA 设备暂时没有可选择的关联实体。";
    value12.push(element);
  }
  Wo.replaceChildren(...value12);
  lp();
}
function yt(value = "image") {
  const value2 = Un(value);
  if (value2.menu.hidden) {
    return;
  }
  const value3 = value2.button.getBoundingClientRect();
  const value4 = 5;
  const value5 = 8;
  const value6 = Math.min(value3.width, window.innerWidth - value5 * 2);
  const value7 = window.innerHeight - value3.bottom - value4 - value5;
  const value8 = value3.top - value4 - value5;
  const value9 = value7 >= 250 || value7 >= value8;
  const count = Math.max(150, Math.min(430, value9 ? value7 : value8));
  const left = value3.left;
  value2.menu.style.left =
    clampNumber(
      left,
      value5,
      Math.max(value5, window.innerWidth - value6 - value5),
    ) + "px";
  value2.menu.style.width = value6 + "px";
  value2.menu.style.maxHeight = count + "px";
  value2.options.style.maxHeight = Math.max(90, count - 58) + "px";
  value2.menu.style.top = value9
    ? value3.bottom + value4 + "px"
    : Math.max(value5, value3.top - count - value4) + "px";
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
    const value4 = text.slice(5);
    if (/^[0-9a-f]{32}$/.test(value4)) {
      return "/api/v1/assets/user/" + value4;
    } else {
      return "";
    }
  }
  const value2 = String(value?.relativePath || text).replace(/^builtin:/, "");
  const value3 = (
    value2.startsWith("v1/2D/") || value2.startsWith("v1/3D/")
      ? value2.replace(/^v1\//, "v1/户型图示例/")
      : value2
  )
    .split("/")
    .filter(Boolean)
    .map((value4) => encodeURIComponent(value4))
    .join("/");
  if (!value3) {
    return "";
  }
  const text2 = String(value?.version || "");
  return (
    "/assets/builtin/" +
    value3 +
    (text2 ? "?v=" + encodeURIComponent(text2) : "")
  );
}
function pp(value) {
  const url = value?.effectVariant?.url;
  if (
    typeof url == "string" &&
    url.startsWith("/api/v1/assets/effect-variant?")
  ) {
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
  createEditorPickerCurrentAsset: cE,
} = createEditorPickerElements({
  entityKindLabel: Hn,
  entityPickerPrimaryName: Ot,
  entityPickerText: ct,
  enableEntityTextHoverScroll: Gn,
  assetDisplayName: z0,
  assetPreviewUrl: pp,
  bindEditorIconNameTooltip: oE,
  mdiIconUrl: Fi,
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
        offset,
    ),
  getEntities: () => le,
  ensureEntities: () => (Tu ? Promise.resolve() : Po || jc()),
  entityPickerText: ct,
  elements: {
    createEditorPickerCurrentIcon: sE,
    createIconPickerOption: B0,
    createEditorPickerCurrentEntity: mp,
    createEditorEntityPickerOption: _n,
    editorPickerClearAction: zr,
  },
});
const { editorEntityMatches: $0, editorPickerComponentTypeLabel: lE } =
  createEditorPickerQueries({
    entityPickerConfig: Un,
    pickerEntitiesForComponentType: qn,
    entityPickerText: ct,
    entityDomain: fe,
  });
const F0 = createEditorAssetMatcher({
  getImageSource: () => Vt,
  getImageFolder: () => ln,
  getIbeSource: () => Wt,
  getIbeFolder: () => dn,
  getUserAssets: () => ht,
  getBuiltinAssets: () => $n,
});
const dE = createEditorAssetToolbar({
  documentObject: document,
  getSource: (getSource) => (getSource === "image" ? Vt : Wt),
  setSource: (setSource, setSource2) => {
    if (setSource === "image") {
      Vt = setSource2;
    } else {
      Wt = setSource2;
    }
  },
  getFolder: (getFolder) => (getFolder === "image" ? ln : dn),
  setFolder: (setFolder, setFolder2) => {
    if (setFolder === "image") {
      ln = setFolder2;
    } else {
      dn = setFolder2;
    }
  },
  getAssets: (getAssets) => (getAssets === "user" ? ht : $n),
  getUploadInput: (getUploadInput) => (getUploadInput === "image" ? sa : xa),
  canDeleteFolder: (canDeleteFolder, canDeleteFolder2) =>
    fp(canDeleteFolder, canDeleteFolder2),
  onDeleteFolder: (onDeleteFolder, onDeleteFolder2) =>
    eC(onDeleteFolder, onDeleteFolder2),
});
function Vc(value, value2) {
  return (
    value?.assetId === value2 || (value?.legacyAssetIds || []).includes(value2)
  );
}
function D0() {
  return [...$n, ...ht];
}
function Ut(value) {
  return D0().find((value2) => Vc(value2, value));
}
function z0(value) {
  return String(
    value?.name || value?.relativePath || value?.assetId || "",
  ).replace(/\.(?:png|jpe?g|webp|gif|svg)$/i, "");
}
function uE(value) {
  return ht.filter(
    (value2) => value2.folder === value && value2.source === "studio3d-export",
  );
}
function fp(value, value2) {
  if (value !== "user" || !value2) {
    return false;
  }
  const value3 = ht.filter((value4) => value4.folder === value2);
  return (
    value3.length > 0 &&
    value3.every((value4) => value4.source === "studio3d-export")
  );
}
function Ro(value) {
  const value2 = value === "image";
  const value3 = value2 ? Vt : Wt;
  const value4 = value2 ? Re : He;
  const value5 = value2 ? po : ho;
  const value6 = value2 ? b1 : B1;
  const value7 = value2
    ? "[data-image-asset-source]"
    : "[data-ibe-asset-source]";
  for (const element of value4.querySelectorAll(value7)) {
    element.classList.toggle(
      "active",
      element.dataset[value2 ? "imageAssetSource" : "ibeAssetSource"] ===
        value3,
    );
  }
  const value8 = Vn.get(value5);
  if (value8) {
    const value9 = value3 === "user" ? ht : $n;
    value8.wrapper.hidden = !value9.some((value10) => value10.folder);
    if (value8.wrapper.hidden) {
      Ht(value8);
    }
  }
  value6.hidden = value3 !== "user";
}
function Yn(value) {
  const value2 = value === "image";
  const value3 = value2 ? Vt : Wt;
  const element = value2 ? po : ho;
  const value4 = value3 === "user" ? ht : $n;
  const value5 = [
    ...new Set(value4.map((value8) => value8.folder).filter(Boolean)),
  ].sort((value8, value9) => value8.localeCompare(value9, "zh-CN"));
  const value6 = value2 ? ln : dn;
  const value7 = value5.includes(value6) ? value6 : value5[0] || "";
  if (value2) {
    ln = value7;
  } else {
    dn = value7;
  }
  element.replaceChildren(
    ...value5.map(
      (value8) => new Option(value8 === "." ? "根目录" : value8, value8),
    ),
  );
  element.value = value7;
  oe(element);
  Ro(value);
}
function gp(value) {
  if (Number(value?.width) > 0 && Number(value?.height) > 0) {
    return Promise.resolve({
      width: Number(value.width),
      height: Number(value.height),
    });
  } else {
    return new Promise((fn9, fn10) => {
      const value2 = new Image();
      value2.decoding = "async";
      value2.addEventListener(
        "load",
        () => {
          value.width = value2.naturalWidth;
          value.height = value2.naturalHeight;
          fn9({
            width: value.width,
            height: value.height,
          });
        },
        {
          once: true,
        },
      );
      value2.addEventListener(
        "error",
        () => fn10(new Error("无法读取图片尺寸：" + (value?.name || ""))),
        {
          once: true,
        },
      );
      value2.src = up(value);
    });
  }
}
function V0(component, assetId, value) {
  const fn9 = (value2, fallback) => {
    const numeric = Number(value2?.width || value.width);
    const numeric2 = Number(value2?.height || value.height);
    const value3 = clampNumber(Number(fallback || 1), 0.01, 5);
    const value4 = Number(value2?.x || 0) + numeric / 2;
    const value5 = Number(value2?.y || 0) + numeric2 / 2;
    return {
      position: {
        ...(value2 || {}),
        x: value4 - value.width / 2,
        y: value5 - value.height / 2,
        width: value.width,
        height: value.height,
      },
      scale: clampNumber((numeric * value3) / value.width, 0.01, 5),
    };
  };
  component.properties = {
    ...(component.properties || {}),
  };
  if (component.properties.layoutMode === "fill") {
    const freeLayout = component.properties.freeLayout;
    if (freeLayout?.position) {
      const value2 = fn9(freeLayout.position, freeLayout.scale);
      component.properties.freeLayout = value2;
    }
  } else {
    const value2 = fn9(component.position, component.style?.scale);
    component.position = value2.position;
    component.style = {
      ...(component.style || {}),
      scale: value2.scale,
    };
  }
  component.properties = {
    ...(component.properties || {}),
    assetId: assetId,
    fit: "contain",
    naturalWidth: value.width,
    naturalHeight: value.height,
  };
}
function pE(value, fallback = null) {
  const width = Number(value?.effectNaturalWidth || fallback?.width || 0);
  const height = Number(value?.effectNaturalHeight || fallback?.height || 0);
  if (width > 0 && height > 0) {
    return {
      width: width,
      height: height,
    };
  } else {
    return null;
  }
}
function mE(value, value2) {
  if (!value || !value2) {
    return;
  }
  const value3 = value.id + ":" + value2.assetId;
  if (!Pu.has(value3)) {
    Pu.add(value3);
    gp(value2)
      .then((value4) => {
        const component = findComponent(h?.document, value.id)?.component;
        if (
          !!component &&
          component.properties?.assetId === value2.assetId &&
          ((component.properties?.layoutMode !== "fill" &&
            (Number(component.position?.width) !== value4.width ||
              Number(component.position?.height) !== value4.height)) ||
            Number(component.properties?.naturalWidth) !== value4.width ||
            Number(component.properties?.naturalHeight) !== value4.height)
        ) {
          L((value5) => {
            const component2 = findComponent(value5, value.id)?.component;
            if (
              !!component2 &&
              component2.properties?.assetId === value2.assetId
            ) {
              V0(component2, value2.assetId, value4);
            }
          });
        }
      })
      .catch(onError)
      .finally(() => Pu.delete(value3));
  }
}
function Vr() {
  if (Re.hidden) {
    return;
  }
  const value = Cn.getBoundingClientRect();
  const value2 = 5;
  const value3 = 8;
  const value4 = window.innerHeight - value.bottom - value2 - value3;
  const value5 = value.top - value2 - value3;
  const value6 = value4 >= 260 || value4 >= value5;
  const count = Math.max(150, Math.min(470, value6 ? value4 : value5));
  Re.style.left =
    clampNumber(
      value.left,
      value3,
      Math.max(value3, window.innerWidth - value.width - value3),
    ) + "px";
  Re.style.width = value.width + "px";
  Re.style.maxHeight = count + "px";
  zt.style.maxHeight = Math.max(80, count - 150) + "px";
  Re.style.top = value6
    ? value.bottom + value2 + "px"
    : Math.max(value3, value.top - count - value2) + "px";
}
function W0(element, element2 = Re) {
  if (Jt.hidden || !element?.isConnected) {
    return;
  }
  const value = element.getBoundingClientRect();
  const value2 = element2.getBoundingClientRect();
  const value3 = Jt.getBoundingClientRect();
  const value4 = 18;
  const value5 =
    value2.left < window.innerWidth / 2
      ? value2.right + value4
      : value2.left - value3.width - value4;
  Jt.style.left =
    clampNumber(
      value5,
      12,
      Math.max(12, window.innerWidth - value3.width - 12),
    ) + "px";
  Jt.style.top =
    clampNumber(
      value.top,
      12,
      Math.max(12, window.innerHeight - value3.height - 12),
    ) + "px";
}
function hp(value, value2, value3 = Re) {
  if (!!value && !!value2) {
    clearTimeout(Sc);
    Sc = window.setTimeout(() => {
      const value4 = pp(value);
      if (!!value4 && !value3.hidden && !!value2.isConnected) {
        Bl.onload = () => W0(value2, value3);
        Bl.src = value4;
        y1.textContent = value.name || value.relativePath;
        Jt.hidden = false;
        window.requestAnimationFrame(() => W0(value2, value3));
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
function bp(value, value2) {
  const element = document.createElement("button");
  element.type = "button";
  element.className =
    "inspector-asset-option" + (Vc(value, value2) ? " selected" : "");
  element.dataset.assetId = value.assetId;
  element.title = value.name;
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(Vc(value, value2)));
  const value3 = document.createElement("img");
  value3.src = pp(value);
  value3.alt = value.name;
  value3.loading = "lazy";
  value3.addEventListener("error", () =>
    element.classList.add("image-load-error"),
  );
  const element2 = document.createElement("span");
  element2.textContent = z0(value);
  element.append(value3, element2);
  if (value.source === "studio3d-export" || value.source !== "user") {
    return element;
  }
  const value4 = document.createElement("div");
  value4.className = "user-asset-option-wrap";
  const element3 = document.createElement("button");
  element3.type = "button";
  element3.className = "user-asset-delete";
  element3.dataset.deleteUserAsset = value.assetId;
  element3.title = "删除 " + value.name;
  element3.setAttribute("aria-label", "删除 " + value.name);
  element3.textContent = "×";
  value4.append(element, element3);
  return value4;
}
function Wr(value = "") {
  Qe();
  const value2 = O()?.properties?.assetId || "";
  const value3 = value.trim().toLocaleLowerCase("zh-CN");
  const value4 = (Vt === "user" ? ht : $n).filter((value5) => {
    const value6 =
      !value3 ||
      (value5.name + " " + value5.relativePath)
        .toLocaleLowerCase("zh-CN")
        .includes(value3);
    const value7 = !!value3 || value5.folder === ln;
    return value6 && value7;
  });
  const element = document.createElement("button");
  element.type = "button";
  element.className = "inspector-asset-clear" + (value2 ? "" : " selected");
  element.dataset.assetId = "";
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(!value2));
  element.textContent = "不使用图片";
  if (!value4.length) {
    const element2 = document.createElement("div");
    element2.className = "inspector-picker-empty";
    element2.textContent = "没有匹配的图片";
    zt.replaceChildren(element, element2);
    return;
  }
  zt.replaceChildren(element, ...value4.map((value5) => bp(value5, value2)));
}
function fE(component) {
  const value = component.properties?.assetId || "";
  const value2 = Ut(value);
  Vt =
    ["user", "studio3d-export"].includes(value2?.source) ||
    (ht.length && !value2)
      ? "user"
      : "builtin";
  ln = value2?.folder || "" || ln;
  Yn("image");
  Ro("image");
  Cn.textContent = value2?.name || value || "不使用图片";
  Sn.value = "";
  zt.replaceChildren();
  mE(component, value2);
}
function Rr() {
  if (He.hidden) {
    return;
  }
  const value = En.getBoundingClientRect();
  const value2 = 5;
  const value3 = 8;
  const value4 = window.innerHeight - value.bottom - value2 - value3;
  const value5 = value.top - value2 - value3;
  const value6 = value4 >= 260 || value4 >= value5;
  const count = Math.max(150, Math.min(470, value6 ? value4 : value5));
  He.style.left =
    clampNumber(
      value.left,
      value3,
      Math.max(value3, window.innerWidth - value.width - value3),
    ) + "px";
  He.style.width = value.width + "px";
  He.style.maxHeight = count + "px";
  en.style.maxHeight = Math.max(80, count - 150) + "px";
  He.style.top = value6
    ? value.bottom + value2 + "px"
    : Math.max(value3, value.top - count - value2) + "px";
}
function Hr(value = "") {
  Qe();
  const value2 = O()?.properties?.effectAssetId || "";
  const value3 = value.trim().toLocaleLowerCase("zh-CN");
  const value4 = (Wt === "user" ? ht : $n).filter(
    (value6) =>
      (!value3 ||
        (value6.name + " " + value6.relativePath)
          .toLocaleLowerCase("zh-CN")
          .includes(value3)) &&
      (!!value3 || value6.folder === dn),
  );
  const element = document.createElement("button");
  element.type = "button";
  element.className = "inspector-asset-clear" + (value2 ? "" : " selected");
  element.dataset.assetId = "";
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(!value2));
  element.textContent = "不使用图片";
  const value5 = value4.map((value6) => bp(value6, value2));
  const element2 = document.createElement("div");
  element2.className = "inspector-picker-empty";
  if (!value5.length) {
    element2.textContent = "没有匹配的图片";
  }
  en.replaceChildren(
    element,
    ...value5,
    ...(element2.textContent ? [element2] : []),
  );
}
function gE(component) {
  const value = component.properties?.effectAssetId || "";
  const value2 = Ut(value);
  Wt =
    ["user", "studio3d-export"].includes(value2?.source) ||
    (ht.length && !value2)
      ? "user"
      : "builtin";
  dn = value2?.folder || dn;
  Yn("ibe");
  Ro("ibe");
  En.textContent = value2?.name || value || "不使用图片";
  Ln.value = "";
  en.replaceChildren();
}
function R0(value) {
  const value2 = value.closest(".inspector-form[id]")?.id || "component-action";
  const value3 = String(value.dataset.actionTrigger || "action").replace(
    /[^a-zA-Z0-9_-]/g,
    "-",
  );
  const value4 = [
    ["[data-action-target]", "target"],
    ["[data-popup-source]", "popup-source"],
    ["[data-popup-entity-search]", "popup-entity-search"],
    ["[data-popup-entity]", "popup-entity"],
    ["[data-popup-custom]", "popup-custom"],
  ];
  for (const [selector, value6] of value4) {
    const element = value.querySelector(selector);
    if (element && !element.id && !element.name) {
      element.id = value2 + "-" + value3 + "-" + value6;
    }
  }
}
function H0() {
  for (const element of document.querySelectorAll(
    '[data-action-type="more-info"]',
  )) {
    element.textContent = "打开弹窗";
  }
  for (const value of document.querySelectorAll(
    ".component-action-control[data-action-trigger]",
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
  for (const value2 of document.querySelectorAll("[data-popup-entity-menu]")) {
    const value3 = value2.closest("[data-action-trigger]");
    if (value3 !== value) {
      value2.hidden = true;
      value3
        ?.querySelector("[data-popup-entity-button]")
        ?.setAttribute("aria-expanded", "false");
    }
  }
}
function yp(value) {
  const value2 = value?.querySelector("[data-popup-entity]")?.value || "";
  const value3 = le.find((value6) => value6.entityId === value2);
  const value4 = value?.querySelector("[data-popup-entity-button]");
  if (!value4) {
    return;
  }
  const value5 = value3
    ? "[" + Hn(value3) + "] " + Ot(value3)
    : value2 || "选择实体";
  Mr(value4, value5, value2 || value5);
  value4.dataset.entityId = value2;
  value4._entityCopySync?.();
}
function Rc(value, value2 = "") {
  const value3 = value?.querySelector("[data-popup-entity-options]");
  const value4 = value?.querySelector("[data-popup-entity]")?.value || "";
  if (!value3) {
    return;
  }
  const value5 = String(value2 || "")
    .trim()
    .toLocaleLowerCase("zh-CN");
  const value6 = le.filter(
    (value7) =>
      !value5 ||
      (ct(value7) + " " + value7.entityId)
        .toLocaleLowerCase("zh-CN")
        .includes(value5),
  );
  value3.replaceChildren(
    ...value6.map((value7) => {
      const value8 = document.createElement("button");
      value8.type = "button";
      value8.className =
        "inspector-entity-option" +
        (value7.entityId === value4 ? " selected" : "");
      value8.dataset.popupActionEntityId = value7.entityId;
      value8.setAttribute("role", "option");
      value8.setAttribute("aria-selected", String(value7.entityId === value4));
      const value9 = document.createElement("span");
      value9.className = "inspector-entity-option-content";
      const element = document.createElement("span");
      element.className =
        "inspector-entity-option-line inspector-entity-name-line";
      element.textContent = "[" + Hn(value7) + "] " + Ot(value7);
      const element2 = document.createElement("span");
      element2.className = "inspector-entity-option-line inspector-entity-id";
      element2.textContent = value7.entityId;
      value9.append(element, element2);
      Gn(value8, element);
      value8.append(value9);
      return value8;
    }),
  );
  if (!value6.length) {
    const element = document.createElement("div");
    element.className = "inspector-picker-empty";
    element.textContent = "没有匹配的实体";
    value3.append(element);
  }
}
function Hc(value) {
  const element = value?.querySelector("[data-popup-entity-button]");
  const value2 = value?.querySelector("[data-popup-entity-menu]");
  if (!element || !value2 || value2.hidden) {
    return;
  }
  const value3 = element.getBoundingClientRect();
  const value4 = Math.min(value3.width, window.innerWidth - 16);
  const value5 = Math.min(340, window.innerHeight - 16);
  value2.style.width = value4 + "px";
  value2.style.maxHeight = value5 + "px";
  const element2 = value2.querySelector("[data-popup-entity-options]");
  if (element2) {
    element2.style.maxHeight = Math.max(120, value5 - 58) + "px";
  }
  const value6 = clampNumber(value3.left, 8, window.innerWidth - value4 - 8);
  const value7 = Math.min(value2.scrollHeight, value5);
  const value8 = value3.bottom + 5;
  const value9 =
    value8 + value7 <= window.innerHeight - 8
      ? value8
      : Math.max(8, value3.top - value7 - 5);
  value2.style.left = value6 + "px";
  value2.style.top = value9 + "px";
}
function fn(component, value) {
  H0();
  const value2 = component.bindings?.entity?.entityId || "";
  const value3 = component.type === "light-statistics";
  if (value3) {
    X1.textContent = value2
      ? "切换和“当前实体”弹窗作用于绑定实体；其它实体弹窗、组合弹窗和跳转页面无需绑定动作实体。"
      : "未绑定动作实体时仍可使用其它实体弹窗、组合弹窗和跳转页面。";
    value.setAttribute("aria-disabled", "false");
  }
  const value4 = h.document.pages || [];
  const pagePaths = new Set(value4.map((value5) => value5.path));
  const popupIds = new Set(
    (h.document.customPopups || []).map((value5) => value5.id),
  );
  const element = value.querySelector(
    "[data-hidden-content-clickable-control]",
  );
  if (element) {
    const value5 = [
      "title-button",
      "device-button",
      "icon-button-effect",
    ].includes(component.type);
    element.hidden = !value5;
    for (const element2 of element.querySelectorAll(
      "[data-hidden-content-clickable]",
    )) {
      const value6 =
        element2.dataset.hiddenContentClickable ===
        (component.properties?.hiddenContentClickable === true ? "on" : "off");
      element2.classList.toggle("active", value6);
      element2.setAttribute("aria-pressed", String(value6));
    }
  }
  for (const value5 of value.querySelectorAll("[data-action-trigger]")) {
    const actionTrigger = value5.dataset.actionTrigger;
    const value6 = component.actions?.[actionTrigger];
    const value7 = componentActionIsSupported(component, value6, {
      pagePaths: pagePaths,
      popupIds: popupIds,
    })
      ? value6.type
      : "none";
    for (const element13 of value5.querySelectorAll("[data-action-type]")) {
      const value10 = element13.dataset.actionType === value7;
      element13.classList.toggle("active", value10);
      element13.setAttribute("aria-pressed", String(value10));
      element13.disabled =
        (element13.dataset.actionType === "toggle" &&
          (!value2 || !entityIdSupportsToggle(value2))) ||
        (value3 &&
          !["none", "toggle", "more-info", "navigate"].includes(
            element13.dataset.actionType,
          ));
    }
    const componentActionTarget = value5.querySelector(
      ".component-action-target",
    );
    const element3 = value5.querySelector("[data-action-target]");
    const target = component.actions?.[actionTrigger]?.target;
    element3.replaceChildren(
      ...value4.map((value10) => new Option(value10.name, value10.path)),
    );
    element3.value = pagePaths.has(target)
      ? target
      : W.value || value4[0]?.path || "";
    oe(element3);
    componentActionTarget.hidden = value7 !== "navigate";
    const componentPopupConfig = value5.querySelector(
      ".component-popup-config",
    );
    const element5 = value5.querySelector("[data-popup-source]");
    const element6 = value5.querySelector("[data-popup-entity]");
    const element7 = value5.querySelector("[data-popup-custom]");
    const element8 = value5.querySelector("[data-popup-entity-row]");
    const element9 = value5.querySelector("[data-popup-custom-row]");
    const element10 = value5.querySelector("[data-popup-preview]");
    const value8 = actionPopupData(component.actions?.[actionTrigger]);
    element5.value = value8.source;
    const element11 = element5.querySelector('option[value="current"]');
    if (element11) {
      element11.disabled = !value2;
    }
    element6.value = value8.entityId || le[0]?.entityId || "";
    const value9 = h.document.customPopups || [];
    element7.replaceChildren(
      ...value9.map((value10) => new Option(value10.name, value10.id)),
    );
    element7.value = value9.some((value10) => value10.id === value8.popupId)
      ? value8.popupId
      : value9[0]?.id || "";
    oe(element5);
    oe(element7);
    yp(value5);
    const element12 = value5.querySelector("[data-popup-entity-menu]");
    if (element12 && !element12.hidden) {
      Rc(
        value5,
        value5.querySelector("[data-popup-entity-search]")?.value || "",
      );
      window.requestAnimationFrame(() => Hc(value5));
    }
    componentPopupConfig.hidden = value7 !== "more-info";
    element8.hidden = value8.source !== "entity";
    element9.hidden = value8.source !== "custom";
    element10.disabled =
      value8.source === "current"
        ? !value2
        : value8.source === "entity"
          ? !element6.value
          : !element7.value;
  }
}
function j0(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(component, value, timeComponentDimensions);
}
function hE(component) {
  const value = component.properties || {};
  const {
    left: value2,
    top: value3,
    scale: value4,
    rotation: value5,
  } = inspectorComponentMetrics(component, h.document);
  Vx.value = "时间";
  Eb.value = value.label || "";
  for (const element of Lb.querySelectorAll("[data-time-hour-format]")) {
    element.classList.toggle(
      "active",
      element.dataset.timeHourFormat === (value.hour12 === true ? "12" : "24"),
    );
  }
  for (const element of Ib.querySelectorAll("[data-time-seconds]")) {
    element.classList.toggle(
      "active",
      element.dataset.timeSeconds ===
        (value.showSeconds === true ? "on" : "off"),
    );
  }
  Tb.value = value.color || "#248eb2";
  Ab.value = roundField(clampNumber(Number(value.fontSize ?? 96), 12, 500));
  Pb.value = roundField(normalizedFontWeight(value.fontWeight));
  kb.value = roundField(
    clampNumber(Number(value.letterSpacing ?? 2.2), -20, 100),
  );
  Mb.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  Ya.value = value2;
  Xa.value = value3;
  yo.value = value4;
  gi.value = value5;
  yo.disabled = false;
  gi.disabled = false;
}
function q0(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(component, value, dateComponentDimensions);
}
function bE(component) {
  const value = component.properties || {};
  const {
    left: value2,
    top: value3,
    scale: value4,
    rotation: value5,
  } = inspectorComponentMetrics(component, h.document);
  Wx.value = "日期";
  Ob.value = value.label || "";
  for (const element of Bb.querySelectorAll("[data-date-weekday]")) {
    element.classList.toggle(
      "active",
      element.dataset.dateWeekday ===
        (value.showWeekday === false ? "off" : "on"),
    );
  }
  for (const element of $b.querySelectorAll("[data-date-lunar]")) {
    element.classList.toggle(
      "active",
      element.dataset.dateLunar === (value.showLunar === true ? "on" : "off"),
    );
  }
  Fb.value = value.primaryColor || "#8d9296";
  Db.value = roundField(clampNumber(Number(value.primarySize ?? 36), 12, 500));
  zb.value = roundField(normalizedFontWeight(value.primaryWeight));
  Vb.value = roundField(
    clampNumber(Number(value.primarySpacing ?? 1), -20, 100),
  );
  Wb.value = value.lunarColor || "#7f878c";
  Rb.value = roundField(clampNumber(Number(value.lunarSize ?? 24), 10, 500));
  Hb.value = roundField(normalizedFontWeight(value.lunarWeight));
  jb.value = roundField(clampNumber(Number(value.lunarSpacing ?? 1), -20, 100));
  qb.value = roundField(clampNumber(Number(value.lineGap ?? 8), 0, 200));
  Gb.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  Ja.value = value2;
  Za.value = value3;
  vo.value = value4;
  hi.value = value5;
  vo.disabled = false;
  hi.disabled = false;
}
function G0(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(
    component,
    value,
    weatherComponentDimensions,
  );
}
function yE(component) {
  const value = component.properties || {};
  const {
    left: value2,
    top: value3,
    scale: value4,
    rotation: value5,
  } = inspectorComponentMetrics(component, h.document);
  Bt(component);
  Rx.value = "天气";
  Ub.value = value.label || "";
  const value6 = [
    [_b, "weatherIconVisible", value.iconVisible !== false],
    [Yb, "weatherTemperatureVisible", value.temperatureVisible !== false],
    [Xb, "weatherConditionVisible", value.conditionVisible !== false],
    [Kb, "weatherHumidityVisible", value.humidityVisible !== false],
  ];
  for (const [value7, value8, value9] of value6) {
    for (const element of value7.querySelectorAll(
      "[data-" +
        value8.replace(/[A-Z]/g, (value10) => "-" + value10.toLowerCase()) +
        "]",
    )) {
      const value10 = element.dataset[value8];
      element.classList.toggle("active", value10 === (value9 ? "on" : "off"));
      element.setAttribute(
        "aria-pressed",
        String(value10 === (value9 ? "on" : "off")),
      );
    }
  }
  Jb.value = roundField(clampNumber(Number(value.iconSize ?? 64), 12, 500));
  Zb.value = roundField(clampNumber(Number(value.iconGap ?? 22), 0, 300));
  Qb.value = value.temperatureColor || "#aeb3b7";
  ey.value = roundField(
    clampNumber(Number(value.temperatureSize ?? 32), 12, 500),
  );
  ty.value = roundField(normalizedFontWeight(value.temperatureWeight));
  ny.value = roundField(
    clampNumber(Number(value.temperatureSpacing ?? 1), -20, 100),
  );
  oy.value = value.secondaryColor || "#8d9296";
  iy.value = roundField(
    clampNumber(Number(value.secondarySize ?? 18), 10, 500),
  );
  ay.value = roundField(normalizedFontWeight(value.secondaryWeight));
  ry.value = roundField(
    clampNumber(Number(value.secondarySpacing ?? 1), -20, 100),
  );
  sy.value = roundField(clampNumber(Number(value.lineGap ?? 7), 0, 200));
  cy.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  er.value = value2;
  tr.value = value3;
  wo.value = value4;
  bi.value = value5;
  wo.disabled = false;
  bi.disabled = false;
}
function vE(component) {
  const value = component.properties || {};
  const value2 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(value2.width || 100);
  const numeric4 = Number(value2.height || 100);
  Bt(component);
  qx.value = "折线图";
  ly.value = value.label || "";
  for (const element of dy.querySelectorAll(
    "[data-line-chart-value-visible]",
  )) {
    const value8 =
      element.dataset.lineChartValueVisible ===
      (value.valueVisible === false ? "off" : "on");
    element.classList.toggle("active", value8);
    element.setAttribute("aria-pressed", String(value8));
  }
  uy.value = roundField(clampNumber(Number(value.valueScale ?? 100), 10, 500));
  py.value = value.valueColor || "#dce1e5";
  my.value = ["0", "1", "2", "3", "4"].includes(String(value.statePrecision))
    ? String(value.statePrecision)
    : "auto";
  fy.value = roundField(
    clampNumber(Number(value.valueOffsetX ?? 0), -100, 100),
  );
  gy.value = roundField(
    clampNumber(Number(value.valueOffsetY ?? 0), -100, 100),
  );
  hy.value = roundField(
    clampNumber(Number(value.updateInterval ?? 600), 30, 86400),
  );
  by.value = roundField(clampNumber(Number(value.hours ?? 24), 1, 168));
  yy.value = roundField(clampNumber(Number(value.cornerRadius ?? 10), 0, 50));
  const value3 = [
    {
      value: 0,
      color: "#ddffc2",
    },
    {
      value: 13,
      color: "#68cc3e",
    },
    {
      value: 27,
      color: "#ff8e52",
    },
    {
      value: 40,
      color: "#ff1a1a",
    },
  ];
  const value4 =
    Array.isArray(value.thresholds) &&
    value.thresholds.some((element) => Number.isFinite(Number(element?.value)));
  const value5 =
    value.thresholdMode === "auto" ||
    (!value4 && value.thresholdMode !== "manual")
      ? "auto"
      : "manual";
  tu.value = value5;
  const value6 = value4 ? value.thresholds : value3;
  yi.forEach((element, value8) => {
    element.value.value = roundField(
      Number(value6[value8]?.value ?? value3[value8].value),
    );
    element.color.value = value6[value8]?.color || value3[value8].color;
    element.value.disabled = value5 === "auto";
    element.color.disabled = value5 === "auto";
  });
  or.value = roundField(
    clampNumber(
      ((Number(value2.x || 0) + numeric3 / 2) / numeric) * 100,
      0,
      100,
    ),
  );
  ir.value = roundField(
    clampNumber(
      ((Number(value2.y || 0) + numeric4 / 2) / numeric2) * 100,
      0,
      100,
    ),
  );
  vi.value = roundField(clampNumber((numeric3 / numeric) * 100, 0.1, 100));
  wi.value = roundField(clampNumber((numeric4 / numeric2) * 100, 0.1, 100));
  Co.value = roundField(
    clampNumber(Number(component.style?.scale || 1) * 100, 1, 500),
  );
  Ci.value = roundField(clampNumber(Number(value2.rotation || 0), -360, 360));
  const value7 = bag.size > 1;
  vi.disabled = value7;
  wi.disabled = value7;
  Co.disabled = false;
  Ci.disabled = false;
  const length = Rn(h.document.sharedComponents, "line-chart").length;
  const length2 = Ow(component).length;
  dc.disabled = length < 2 || !length2;
  Yx.textContent = length2 + " 项修改";
  dc.textContent = "一键应用到同类型控件";
  fn(component, _x);
}
function wE(component) {
  const value = component.properties || {};
  const value2 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(value2.width || 100);
  const numeric4 = Number(value2.height || 100);
  Xx.value = "底图框";
  vy.value = value.label || "";
  setInspectorToggle(wy, value.mainTextVisible !== false);
  Cy.value = value.mainText || "";
  Sy.value = value.mainColor || "#ffffff";
  xy.value = roundField(clampNumber(Number(value.mainSize ?? 30), 8, 500));
  Ny.value = roundField(clampNumber(Number(value.mainWeight ?? 0), 0, 3));
  Ey.value = roundField(
    clampNumber(Number(value.mainOpacity ?? 0.72) * 100, 0, 100),
  );
  Ly.value = roundField(clampNumber(Number(value.mainSpacing ?? 2), -20, 100));
  const numeric5 = Number(value.textLeft ?? 5.2);
  const numeric6 = Number(value.textTop ?? 28);
  Iy.value = roundField(
    clampNumber(Number(value.mainTextLeft ?? numeric5), -100, 200),
  );
  Ty.value = roundField(
    clampNumber(
      Number(
        value.mainTextTop ??
          numeric6 - (Number(value.lineGap ?? 24) / numeric4) * 100,
      ),
      -100,
      200,
    ),
  );
  setInspectorToggle(Ay, value.secondaryTextVisible !== false);
  Py.value = value.secondaryText || "";
  ky.value = value.secondaryColor || "#ffffff";
  My.value = roundField(clampNumber(Number(value.secondarySize ?? 15), 6, 500));
  Oy.value = roundField(clampNumber(Number(value.secondaryWeight ?? 0), 0, 3));
  By.value = roundField(
    clampNumber(Number(value.secondaryOpacity ?? 0.36) * 100, 0, 100),
  );
  $y.value = roundField(
    clampNumber(Number(value.secondarySpacing ?? 2.1), -20, 100),
  );
  Fy.value = roundField(
    clampNumber(Number(value.secondaryTextLeft ?? numeric5), -100, 200),
  );
  Dy.value = roundField(
    clampNumber(Number(value.secondaryTextTop ?? numeric6), -100, 200),
  );
  setInspectorToggle(zy, value.edgeVisible !== false);
  Vy.value = value.edgeColor || "#d4d4d4";
  Wy.value = roundField(clampNumber(Number(value.edgeWidth ?? 0.9), 0, 20));
  Ry.value = roundField(
    clampNumber(Number(value.edgeOpacity ?? 1) * 100, 0, 100),
  );
  Hy.value = roundField(
    clampNumber(Number(value.radius ?? 0.195) * 100, 0, 50),
  );
  jy.value = roundField(clampNumber(Number(value.edgeAngle ?? 45), 0, 360));
  setInspectorToggle(qy, value.glowVisible !== false);
  Gy.value = value.glowColor || "#ffffff";
  Uy.value = roundField(
    clampNumber(Number(value.glowStrength ?? 0.5) * 100, 0, 500),
  );
  _y.value = roundField(
    clampNumber(Number(value.glowSize ?? 1.5) * 100, 0, 300),
  );
  Yy.value = roundField(clampNumber(Number(value.glowAngle ?? 242), 0, 360));
  rr.value = roundField(
    clampNumber(
      ((Number(value2.x || 0) + numeric3 / 2) / numeric) * 100,
      0,
      100,
    ),
  );
  sr.value = roundField(
    clampNumber(
      ((Number(value2.y || 0) + numeric4 / 2) / numeric2) * 100,
      0,
      100,
    ),
  );
  Si.value = roundField(clampNumber((numeric3 / numeric) * 100, 0.1, 100));
  xi.value = roundField(clampNumber((numeric4 / numeric2) * 100, 0.1, 100));
  So.value = roundField(
    clampNumber(Number(component.style?.scale || 1) * 100, 1, 500),
  );
  Ni.value = roundField(clampNumber(Number(value2.rotation || 0), -360, 360));
  const value3 = bag.size > 1;
  Si.disabled = value3;
  xi.disabled = value3;
  So.disabled = false;
  Ni.disabled = false;
  const value4 =
    findComponent(h.document, component.id)?.scope === "page"
      ? st("panel-frame").length
      : Rn(h.document.sharedComponents, "panel-frame").length;
  const length = Gw(component).length;
  uc.disabled = value4 < 2 || !length;
  Kx.textContent = length + " 项修改";
  uc.textContent = "一键应用到同类型控件";
}
function CE(component) {
  const value = component.properties || {};
  const value2 = component.position || {};
  const value3 = h.document.pages || [];
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(value2.width || 100);
  const numeric4 = Number(value2.height || 100);
  Jx.value = "导航按钮";
  pc.value = value.label || "";
  Bt(component);
  const value4 = Pi.get(component.id) || "auto";
  for (const element of nu.querySelectorAll("[data-navigation-preview]")) {
    element.classList.toggle(
      "active",
      element.dataset.navigationPreview === value4,
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
      100,
    ),
  );
  cu.value = roundField(
    clampNumber(
      Number(value.textActiveOpacity ?? value.activeOpacity ?? 0.96) * 100,
      0,
      100,
    ),
  );
  pv.value = value.iconColor || "#e9edf0";
  mv.value = roundField(Number(value.iconSize ?? 50));
  fv.value = roundField(Number(value.iconLeft ?? 14));
  gv.value = roundField(Number(value.iconTop ?? 50));
  lu.value = roundField(
    clampNumber(
      Number(value.iconIdleOpacity ?? value.idleOpacity ?? 0.3) * 100,
      0,
      100,
    ),
  );
  du.value = roundField(
    clampNumber(
      Number(value.iconActiveOpacity ?? value.activeOpacity ?? 0.96) * 100,
      0,
      100,
    ),
  );
  hv.value = value.frameColor || "#d9e0e6";
  bv.value = roundField(Number(value.frameWidth ?? 2));
  uu.value = roundField(
    clampNumber(Number(value.frameIdleOpacity ?? 0.48) * 100, 0, 100),
  );
  pu.value = roundField(
    clampNumber(Number(value.frameActiveOpacity ?? 0.98) * 100, 0, 100),
  );
  yv.value = roundField(clampNumber(Number(value.frameAngle ?? 45), 0, 360));
  vv.value = value.glowColor || "#f2f6fa";
  wv.value = roundField(clampNumber(Number(value.glowAngle ?? 45), 0, 360));
  mu.value = roundField(
    clampNumber(Number(value.glowIdleStrength ?? 0.5) * 100, 0, 500),
  );
  fu.value = roundField(
    clampNumber(Number(value.glowIdleSize ?? 1.5) * 100, 0, 300),
  );
  gu.value = roundField(
    clampNumber(Number(value.glowActiveStrength ?? 2.2) * 100, 0, 500),
  );
  hu.value = roundField(
    clampNumber(Number(value.glowActiveSize ?? 3) * 100, 0, 300),
  );
  Cv.value = roundField(clampNumber(Number(value.radius ?? 0.5) * 100, 0, 50));
  ur.value = roundField(
    clampNumber(
      ((Number(value2.x || 0) + numeric3 / 2) / numeric) * 100,
      0,
      100,
    ),
  );
  pr.value = roundField(
    clampNumber(
      ((Number(value2.y || 0) + numeric4 / 2) / numeric2) * 100,
      0,
      100,
    ),
  );
  xo.value = roundField(clampNumber((numeric3 / numeric) * 100, 0.1, 100));
  No.value = roundField(clampNumber((numeric4 / numeric2) * 100, 0.1, 100));
  An.value = roundField(
    clampNumber(Number(component.style?.scale || 1) * 100, 1, 500),
  );
  Eo.value = roundField(Number(value2.rotation || 0));
  const value5 = bag.size > 1;
  xo.disabled = value5;
  No.disabled = value5;
  An.disabled = false;
  Eo.disabled = false;
  const length = Rn(h.document.sharedComponents, "navigation-button").length;
  const length2 = _w(component).length;
  mc.disabled = length < 2 || !length2;
  tN.textContent = length2 + " 项修改";
  mc.textContent = "一键应用到同类型控件";
  fn(component, eN);
}
function SE(component) {
  const value = component.properties || {};
  const value2 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(value2.width || 100);
  const numeric4 = Number(value2.height || 100);
  Sf.value = value.label || "";
  Bt(component);
  setInspectorToggle(xf, value.mainTextVisible !== false);
  setInspectorToggle(Nf, value.secondaryTextVisible !== false);
  setInspectorToggle(Gf, value.frameVisible !== false);
  setInspectorToggle(Vf, value.iconVisible !== false);
  Ef.value = value.mainText || "";
  const value3 = String(value.secondaryText || "")
    .split(/\r?\n/)
    .slice(0, 2);
  Os.value = value3[0] || "";
  Bs.value = value3[1] || "";
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
  const value4 = value.markerVisible !== false;
  setInspectorToggle(Jf, value4);
  rd.value = roundField(
    clampNumber(
      ((Number(value2.x || 0) + numeric3 / 2) / numeric) * 100,
      0,
      100,
    ),
  );
  sd.value = roundField(
    clampNumber(
      ((Number(value2.y || 0) + numeric4 / 2) / numeric2) * 100,
      0,
      100,
    ),
  );
  $s.value = roundField((numeric3 / numeric) * 100);
  Fs.value = roundField((numeric4 / numeric2) * 100);
  Aa.value = roundField(Number(component.style?.scale || 1) * 100);
  Ds.value = roundField(Number(value2.rotation || 0));
  const value5 = bag.size > 1;
  for (const value6 of [$s, Fs]) {
    value6.disabled = value5;
  }
  Ds.disabled = false;
  Aa.disabled = false;
  const length = st("title-button").length;
  const length2 = $w(component).length;
  zs.disabled = length < 2 || !length2;
  q1.textContent = length2 + " 项修改";
  zs.textContent = "一键应用到同类型控件";
  fn(component, j1);
}
function xE(component) {
  const value = component.properties || {};
  const value2 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(value2.width || 100);
  const numeric4 = Number(value2.height || 100);
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
      ((Number(value2.x || 0) + numeric3 / 2) / numeric) * 100,
      0,
      100,
    ),
  );
  pd.value = roundField(
    clampNumber(
      ((Number(value2.y || 0) + numeric4 / 2) / numeric2) * 100,
      0,
      100,
    ),
  );
  Ws.value = roundField((numeric3 / numeric) * 100);
  Rs.value = roundField((numeric4 / numeric2) * 100);
  $a.value = roundField(Number(component.style?.scale || 1) * 100);
  Hs.value = roundField(Number(value2.rotation || 0));
  const value3 = bag.size > 1;
  Ws.disabled = value3;
  Rs.disabled = value3;
  $a.disabled = false;
  Hs.disabled = false;
  Mr(rt, ko >= 0 ? "选择替换实体" : "选择一个实体");
  C0(component);
  if (!Ie.hidden) {
    Xu(Pa.value);
  }
  fn(component, K1);
}
function NE(component) {
  const value = component.properties || {};
  const value2 = component.type === "presence-sensor";
  const value3 = [
    "presence",
    "door-window",
    "water-leak",
    "smoke",
    "natural-gas",
  ].includes(value.sensorKind)
    ? value.sensorKind
    : "presence";
  const value4 = {
    presence: "人体/人在传感器",
    "door-window": "门窗传感器",
    "water-leak": "水浸传感器",
    smoke: "烟雾传感器",
    "natural-gas": "天然气传感器",
  }[value3];
  const value5 = component.type === "device-button" || value2;
  const value6 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(value6.width || 100);
  const numeric4 = Number(value6.height || 100);
  Z1.value = value2 ? value4 : value5 ? "设备按钮" : "图标按钮";
  J1.classList.remove("inspector-full-row");
  Ng.hidden = !value2;
  Ng.classList.toggle("inspector-full-row", value2);
  Fa.value = value3;
  oe(Fa);
  $g.textContent = value5 ? "标题" : "中文标题";
  cx.textContent = value5 ? "状态" : "英文标题";
  lx.textContent = value5 ? "自定义标题" : "内容";
  dx.textContent = value5 ? "自定义状态" : "内容";
  Sd.placeholder = value5 ? "留空跟随实体名称" : "";
  xd.placeholder = value5 ? "留空跟随实体状态" : "";
  Q1.hidden = value5;
  wx.hidden = value2;
  lh.hidden = true;
  Sx.hidden = !value2 || value3 !== "presence";
  xx.hidden = !value2 || value3 !== "door-window";
  const value7 = Ec.has(component.id);
  Tn.classList.toggle("active", value7);
  Tn.setAttribute("aria-pressed", String(value7));
  Tn.textContent = "编辑透视";
  Xs.disabled = !value7;
  $g.closest(".inspector-section").hidden = value2;
  const value8 = Lt.closest(".inspector-section");
  value8.querySelector("h3").textContent = value2 ? "显示颜色" : "图标";
  const value9 = Lt.closest(".inspector-picker");
  value9.hidden = value2;
  value9.style.display = value2 ? "none" : "";
  gx.hidden = value5;
  hx.hidden = value5;
  bx.hidden = value5;
  yx.hidden = value5;
  Tg.hidden = value2;
  Tg.firstChild.textContent = value5 ? "关闭颜色" : "颜色";
  hd.hidden = !value5 || value2;
  Nd.hidden = !value5;
  Ed.hidden = !value5;
  Ag.hidden = !value5;
  Ag.firstChild.textContent = value2
    ? {
        presence: "有人颜色",
        "door-window": "打开颜色",
        "water-leak": "水浸颜色",
        smoke: "烟雾颜色",
        "natural-gas": "天然气颜色",
      }[value3]
    : "开启颜色";
  ex.hidden = !value5 || value2;
  tx.hidden = !value5 || value2;
  nx.hidden = value5;
  ox.hidden = !value5 || value2;
  ix.hidden = !value5 || value2;
  ax.hidden = !value5 || value2;
  wd.closest("label").hidden = value2;
  Cd.closest("label").hidden = value2;
  rx.hidden = value5;
  sx.hidden = value5;
  ux.hidden = value5;
  px.hidden = value5;
  mx.hidden = value5;
  fx.hidden = value5;
  xg.value = value.label || "";
  Bt(component);
  JN(value.icon || "");
  fi.value =
    value.iconColor ||
    (value2 ? value.clearColor : "") ||
    value.iconOffColor ||
    value.iconOnColor ||
    "#d7d8da";
  setInspectorToggle(hd, value.iconVisible !== false);
  bd.value =
    value3 === "water-leak"
      ? value.waterLeakColor || "#42c8ff"
      : value3 === "smoke"
        ? value.smokeColor || "#ffffff"
        : value3 === "natural-gas"
          ? value.naturalGasColor || "#ffb347"
          : value.iconOnColor ||
            (value2 ? value.occupiedColor : "") ||
            "#379bff";
  Pg.value = value.badgeColor || "#5b5e66";
  kg.value = roundField(Number(value.badgeOpacity ?? 0.58) * 100);
  Bg.value = roundField(Number(value.badgeSize ?? value.iconSize ?? 28));
  Og.value = roundField(
    Number(value.symbolSize ?? Number(value.iconSize ?? 28) * 0.5),
  );
  qs.value = ["0", "1", "2", "3", "4"].includes(String(value.statePrecision))
    ? String(value.statePrecision)
    : "auto";
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
      ((Number(value6.x || 0) + numeric3 / 2) / numeric) * 100,
      0,
      100,
    ),
  );
  Fd.value = roundField(
    clampNumber(
      ((Number(value6.y || 0) + numeric4 / 2) / numeric2) * 100,
      0,
      100,
    ),
  );
  Gs.value = roundField((numeric3 / numeric) * 100);
  Us.value = roundField((numeric4 / numeric2) * 100);
  Wa.value = roundField(Number(component.style?.scale || 1) * 100);
  _s.value = roundField(Number(value6.rotation || 0));
  if (value2 && !zn.has(component.id)) {
    zn.set(component.id, "on");
    x?.setComponentPreviewState(component.id, "on");
  }
  const value10 = zn.get(component.id) || "auto";
  for (const element of js.querySelectorAll("[data-icon-button-preview]")) {
    const value13 = element.dataset.iconButtonPreview === value10;
    element.classList.toggle("active", value13);
    element.setAttribute("aria-pressed", String(value13));
  }
  const value11 = bag.size > 1;
  for (const value13 of [Gs, Us]) {
    value13.disabled = value11;
  }
  _s.disabled = false;
  Wa.disabled = false;
  const value12 =
    component.type === "presence-sensor"
      ? st(component.type).filter(
          ({ component: value13 }) => Ho(value13) === value3,
        ).length
      : st(component.type).length;
  const length = Ww(component).length;
  Ys.disabled = value12 < 2 || !length;
  Cx.textContent = length + " 项修改";
  Ys.textContent = "一键应用到同类型控件";
  fn(component, vx);
}
function EE(component) {
  const value = component.properties || {};
  const value2 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(value2.width || 100);
  const numeric4 = Number(value2.height || 100);
  gb.value = value.label || "";
  Bt(component);
  setInspectorToggle(yb, value.mediaVisible !== false);
  const value3 = value.displayMode === "snapshot" ? "snapshot" : "live";
  for (const element of bb.querySelectorAll("[data-camera-display-mode]")) {
    const value8 = element.dataset.cameraDisplayMode === value3;
    element.classList.toggle("active", value8);
    element.setAttribute("aria-pressed", String(value8));
  }
  const numeric5 = Number(value.refreshInterval);
  const value4 = Number.isFinite(numeric5)
    ? Math.max(6, Math.round(numeric5))
    : 10;
  Ga.value = String(value4);
  Fx.hidden = value3 !== "snapshot";
  Ga.disabled = value3 !== "snapshot";
  const value5 = value.fit === "contain" ? "contain" : "fill";
  for (const element of hb.querySelectorAll("[data-camera-fit]")) {
    const value8 = element.dataset.cameraFit === value5;
    element.classList.toggle("active", value8);
    element.setAttribute("aria-pressed", String(value8));
  }
  setInspectorToggle(vb, value.frameVisible !== false);
  wb.value = value.frameColor || "#d4d4d4";
  Cb.value = roundField(Number(value.frameWidth ?? 1));
  const numeric6 = Number(value.radius ?? 0.04);
  Sb.value = roundField(
    clampNumber(numeric6 > 0.5 ? numeric6 : numeric6 * 100, 0, 50),
  );
  xb.value = roundField(Number(value.frameAngle ?? 45));
  Nb.value = roundField(Number(value.frameOpacity ?? 0.9) * 100);
  Xd.value = roundField(
    clampNumber(
      ((Number(value2.x || 0) + numeric3 / 2) / numeric) * 100,
      0,
      100,
    ),
  );
  Kd.value = roundField(
    clampNumber(
      ((Number(value2.y || 0) + numeric4 / 2) / numeric2) * 100,
      0,
      100,
    ),
  );
  rc.value = roundField((numeric3 / numeric) * 100);
  sc.value = roundField((numeric4 / numeric2) * 100);
  Ua.value = roundField(Number(component.style?.scale || 1) * 100);
  cc.value = roundField(Number(value2.rotation || 0));
  const value6 = bag.size > 1;
  rc.disabled = value6;
  sc.disabled = value6;
  cc.disabled = false;
  Ua.disabled = false;
  const length = st("camera").length;
  const length2 = jw(component).length;
  lc.disabled = length < 2 || !length2;
  zx.textContent = length2 + " 项修改";
  lc.textContent = "一键应用到同类型控件";
  const value7 = Object.prototype.hasOwnProperty.call(
    component.actions || {},
    "tap",
  )
    ? component
    : {
        ...component,
        actions: {
          tap: {
            type: "more-info",
            data: {
              popupSource: "current",
            },
          },
          ...(component.actions || {}),
        },
      };
  fn(value7, Dx);
}
function LE(component) {
  const value = component.properties || {};
  const value2 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(value2.width || 100);
  const numeric4 = Number(value2.height || 100);
  wh.value = value.label || "";
  const value3 = ["air-conditioner", "bath-heater"].includes(value.deviceType)
    ? value.deviceType
    : "auto";
  for (const element of Ch.querySelectorAll(
    "[data-air-conditioner-device-type]",
  )) {
    const value10 = element.dataset.airConditionerDeviceType === value3;
    element.classList.toggle("active", value10);
    element.setAttribute("aria-pressed", String(value10));
  }
  jd.textContent =
    value3 === "bath-heater" ? "预览浴霸详情" : "预览空调 / 浴霸详情";
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
  const value4 = value.airflowMotion === "static" ? "static" : "dynamic";
  for (const element of Jh.querySelectorAll("[data-airflow-motion]")) {
    const value10 = element.dataset.airflowMotion === value4;
    element.classList.toggle("active", value10);
    element.setAttribute("aria-pressed", String(value10));
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
  zd.disabled = value4 === "static";
  const value5 = airflowCanvasOffsetBounds(component, h.document.canvas);
  Ra.min = String(roundField(value5.minX));
  Ra.max = String(roundField(value5.maxX));
  Ha.min = String(roundField(value5.minY));
  Ha.max = String(roundField(value5.maxY));
  Ra.value = roundField(Number(value.airflowOffsetX ?? -75));
  Ha.value = roundField(Number(value.airflowOffsetY ?? 34));
  ub.value = roundField(Number(value.airflowWidth ?? 64));
  pb.value = roundField(Number(value.airflowHeight ?? 125));
  Vd.value = roundField(Number(value.airflowScale ?? 1) * 100);
  Wd.value = roundField(Number(value.airflowRotation ?? -3));
  Rd.value = roundField(
    clampNumber(
      ((Number(value2.x || 0) + numeric3 / 2) / numeric) * 100,
      0,
      100,
    ),
  );
  Hd.value = roundField(
    clampNumber(
      ((Number(value2.y || 0) + numeric4 / 2) / numeric2) * 100,
      0,
      100,
    ),
  );
  Zs.value = roundField((numeric3 / numeric) * 100);
  Qs.value = roundField((numeric4 / numeric2) * 100);
  ja.value = roundField(Number(component.style?.scale || 1) * 100);
  ec.value = roundField(Number(value2.rotation || 0));
  const value6 = Fu.get(component.id) === "airflow" ? "airflow" : "button";
  if (!Mo.has(component.id)) {
    const value10 = value6 === "airflow" ? "on" : "off";
    Mo.set(component.id, value10);
    x?.setComponentPreviewState(component.id, value10);
  }
  const value7 = Mo.get(component.id) || "auto";
  for (const element of Sh.querySelectorAll("[data-air-conditioner-preview]")) {
    const value10 = element.dataset.airConditionerPreview === value7;
    element.classList.toggle("active", value10);
    element.setAttribute("aria-pressed", String(value10));
  }
  x?.setComponentSelectionLayer(component.id, value6);
  for (const element of xh.querySelectorAll("[data-air-conditioner-layer]")) {
    const value10 = element.dataset.airConditionerLayer === value6;
    element.classList.toggle("active", value10);
    element.setAttribute("aria-pressed", String(value10));
  }
  const value8 = value6 === "airflow";
  Ix.hidden = value8;
  Tx.hidden = value8;
  Ax.hidden = value8;
  Nh.hidden = !value8;
  const value9 = bag.size > 1;
  for (const value10 of [Zs, Qs]) {
    value10.disabled = value9;
  }
  ec.disabled = false;
  ja.disabled = false;
  const length = st("air-conditioner").length;
  const length2 = Dw(component).length;
  qd.disabled = length < 2 || !length2;
  kx.textContent = length2 + " 项修改";
  fn(component, Px);
}
function IE(component) {
  const value = component.properties || {};
  const value2 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(value2.width || 100);
  const numeric4 = Number(value2.height || 100);
  mb.value = value.label || "";
  Bt(component);
  fb.value = roundField(Number(value.opacity ?? 0.5) * 100);
  Ud.value = roundField(
    clampNumber(
      ((Number(value2.x || 0) + numeric3 / 2) / numeric) * 100,
      0,
      100,
    ),
  );
  _d.value = roundField(
    clampNumber(
      ((Number(value2.y || 0) + numeric4 / 2) / numeric2) * 100,
      0,
      100,
    ),
  );
  qa.value = roundField(Number(component.style?.scale || 1) * 100);
  oc.value = roundField(Number(value2.rotation || 0));
  oc.disabled = false;
  qa.disabled = false;
}
function TE(component) {
  const value = [ia, si, ks, ui, tc, ic, Ks, _a, Ka, Qa, nr, ar, Ei]
    .find((value6) => value6 && !value6.hidden)
    ?.querySelector(":scope > .inspector-section");
  if (value && value.nextElementSibling !== gd) {
    value.insertAdjacentElement("afterend", gd);
  }
  const value2 = component.properties || {};
  const value3 = ["standard", "dream", "airer"].includes(value2.coverKind)
    ? value2.coverKind
    : "auto";
  for (const element of Eg.querySelectorAll("[data-cover-kind]")) {
    const value6 = element.dataset.coverKind === value3;
    element.classList.toggle("active", value6);
    element.setAttribute("aria-pressed", String(value6));
  }
  const value4 = ["left", "right"].includes(value2.coverDirection)
    ? value2.coverDirection
    : "split";
  for (const element of Lg.querySelectorAll("[data-cover-direction]")) {
    const value6 = element.dataset.coverDirection === value4;
    element.classList.toggle("active", value6);
    element.setAttribute("aria-pressed", String(value6));
  }
  const value5 = ["normal", "reversed"].includes(value2.coverMotorDirection)
    ? value2.coverMotorDirection
    : "auto";
  for (const element of Ig.querySelectorAll("[data-cover-motor-direction]")) {
    const value6 = element.dataset.coverMotorDirection === value5;
    element.classList.toggle("active", value6);
    element.setAttribute("aria-pressed", String(value6));
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
        { throwOnError: true },
      ),
  });
  const value = component?.type === "image";
  const value2 = component?.type === "floorplan-auto-diagram";
  const value3 = component?.type === "icon-button-effect";
  const value4 = component?.type === "title-button";
  const value5 = component?.type === "light-statistics";
  const value6 = ["icon-button", "device-button", "presence-sensor"].includes(
    component?.type,
  );
  const value7 = component?.type === "vacuum-map";
  const value8 = component?.type === "camera";
  const value9 = component?.type === "air-conditioner";
  const value10 = component?.type === "time";
  const value11 = component?.type === "date";
  const value12 = component?.type === "weather";
  const value13 = component?.type === "line-chart";
  const value14 = component?.type === "panel-frame";
  const value15 = component?.type === "navigation-button";
  const value16 = component?.type === "group";
  const valueI3d = component?.type === "interaction3d";
  for (const value24 of [...Pi.keys()]) {
    if (!value15 || value24 !== component.id) {
      Pi.delete(value24);
      x?.setComponentPreviewState(value24, "auto");
    }
  }
  for (const value24 of [...un.keys()]) {
    if (!value3 || value24 !== component.id) {
      un.delete(value24);
      x?.setComponentPreviewState(value24, "auto");
    }
  }
  for (const value24 of [...zn.keys()]) {
    if (!value6 || value24 !== component.id) {
      zn.delete(value24);
      x?.setComponentPreviewState(value24, "auto");
    }
  }
  for (const value24 of [...Mo.keys()]) {
    if (!value9 || value24 !== component.id) {
      Mo.delete(value24);
      x?.setComponentPreviewState(value24, "auto");
    }
  }
  const value17 =
    value16 ||
    value ||
    value2 ||
    value3 ||
    value4 ||
    value5 ||
    value6 ||
    value7 ||
    value8 ||
    value9 ||
    value10 ||
    value11 ||
    value12 ||
    value13 ||
    value14 ||
    value15 ||
    valueI3d;
  Ol.hidden = value17;
  if (value16) {
    Ol.querySelector("p").textContent =
      "组合支持整体移动、复制、旋转和缩放；双击组合可进入组内编辑。";
  }
  ia.hidden = !value;
  Rl.hidden = !value2;
  si.hidden = !value3;
  ks.hidden = !value4;
  cd.hidden = !value5;
  ui.hidden = !value6;
  tc.hidden = !value7;
  ic.hidden = !value8;
  Ks.hidden = !value9;
  _a.hidden = !value10;
  Ka.hidden = !value11;
  Qa.hidden = !value12;
  nr.hidden = !value13;
  ar.hidden = !value14;
  Ei.hidden = !value15;
  const value18 = String(
    component?.bindings?.entity?.entityId || "",
  ).startsWith("cover.");
  gd.hidden = !value17 || !value18;
  if (!value17) {
    fn8();
    Ol.querySelector("p").textContent = component
      ? "“" + componentLabel(component) + "”的专属属性尚未实现。"
      : "选择一个控件开始编辑。";
    return;
  }
  if (value18) {
    TE(component);
  }
  if (value2) {
    const value24 = component.properties || {};
    const value25 = component.position || {};
    const numeric5 = Number(h.document.canvas.width || 2778);
    const numeric6 = Number(h.document.canvas.height || 1940);
    const numeric7 = Number(value25.width || 100);
    const numeric8 = Number(value25.height || 100);
    const list = Array.isArray(value24.lightLayers)
      ? value24.lightLayers.length
      : 0;
    const value26 =
      value24.previewReady === true &&
      (value24.generated !== true || value24.previewing === true);
    ai.textContent = value24.generating
      ? "正在后台生成底图和灯组效果，请稍候…"
      : value24.generated && list
        ? "已生成导图，包含 " + list + " 个灯组。"
        : value26
          ? "3D画面已置入仪表盘，请先确定位置、大小和视角。"
          : "尚未载入3D画面。";
    la.hidden = !value26;
    const value27 = value24.interactionMode === "view";
    la.classList.toggle("active", value27);
    la.setAttribute("aria-pressed", String(value27));
    la.textContent = value27 ? "完成3D视角调整" : "调整3D视角";
    Hl.value = value24.label || value24.instanceName || "";
    da.value = value24.exportFolder || "";
    const value28 = value24.layoutMode === "fill" ? "fill" : "free";
    for (const element of Jm.querySelectorAll("[data-floorplan-layout]")) {
      const value35 = element.dataset.floorplanLayout === value28;
      element.classList.toggle("active", value35);
      element.setAttribute("aria-pressed", String(value35));
    }
    ua.value = roundField(
      clampNumber(
        ((Number(value25.x || 0) + numeric7 / 2) / numeric5) * 100,
        0,
        100,
      ),
    );
    pa.value = roundField(
      clampNumber(
        ((Number(value25.y || 0) + numeric8 / 2) / numeric6) * 100,
        0,
        100,
      ),
    );
    ma.value = roundField((numeric7 / numeric5) * 100);
    fa.value = roundField((numeric8 / numeric6) * 100);
    ga.value = roundField(Number(component.style?.scale || 1) * 100);
    ha.value = roundField(Number(value25.rotation || 0));
    const value29 = $u.get(component.id);
    const list2 = Array.isArray(value29?.floors) ? value29.floors : [];
    const value30 =
      String(value24.floorSelection || "") || String(value29?.selected || "");
    if (list2.length) {
      const value35 = list2.map((value36) =>
        Object.assign(document.createElement("option"), {
          value: value36.id,
          textContent: value36.name,
        }),
      );
      if (list2.length > 1) {
        value35.unshift(
          Object.assign(document.createElement("option"), {
            value: "all",
            textContent: "全楼",
          }),
        );
      }
      Zt.replaceChildren(...value35);
      Zt.value = value35.some((element) => element.value === value30)
        ? value30
        : value35[0].value;
    } else {
      Zt.replaceChildren(
        Object.assign(document.createElement("option"), {
          value: "",
          textContent: value26 ? "正在读取楼层…" : "载入3D画面后选择",
        }),
      );
    }
    Zt.disabled = !value26 || list2.length === 0 || value24.generating === true;
    const value31 = value24.cameraView === "top" ? "top" : "free";
    const value32 =
      value24.cameraMode === "perspective" ? "perspective" : "orthographic";
    for (const element of Zm.querySelectorAll("[data-floorplan-camera-view]")) {
      const value35 = element.dataset.floorplanCameraView === value31;
      element.classList.toggle("active", value35);
      element.setAttribute("aria-pressed", String(value35));
    }
    for (const element of Qm.querySelectorAll("[data-floorplan-camera-mode]")) {
      const value35 = element.dataset.floorplanCameraMode === value32;
      element.classList.toggle("active", value35);
      element.setAttribute("aria-pressed", String(value35));
    }
    ba.value = roundField(
      clampNumber(Number(value24.cameraFocalLength || 50), 18, 120),
    );
    ba.disabled = value32 !== "perspective" || !value26;
    ef.disabled = value31 !== "top" || !value26;
    tf.disabled = !value26;
    for (const value35 of [ua, pa, ma, fa, ga, ha]) {
      value35.disabled = value28 === "fill";
    }
    xt.disabled = value24.generating === true;
    xt.textContent =
      value24.generated && !value24.previewing
        ? "重新调整位置和视角"
        : value24.generating
          ? "正在后台生成…"
          : value26
            ? "确定位置大小并后台生成"
            : "载入3D画面";
    w1.hidden = list === 0;
    const value33 = le.filter((value35) => fe(value35) === "light");
    const value34 = (value24.lightLayers || []).map((value35) => {
      const element = document.createElement("label");
      element.textContent = value35.note || value35.name || "灯组";
      const element2 = document.createElement("select");
      element2.dataset.floorplanLightGroupId = value35.id;
      const value36 =
        component.bindings?.["lightGroup:" + value35.id]?.entityId || "";
      const element3 = document.createElement("option");
      element3.value = "";
      element3.textContent = "选择实体";
      element2.append(element3);
      for (const value37 of value33) {
        const element4 = document.createElement("option");
        element4.value = value37.entityId;
        element4.textContent = ct(value37);
        element2.append(element4);
      }
      if (value36 && !value33.some((value37) => value37.entityId === value36)) {
        const element4 = document.createElement("option");
        element4.value = value36;
        element4.textContent = value36;
        element2.append(element4);
      }
      element2.value = value36;
      element.append(element2);
      return element;
    });
    nf.replaceChildren(...value34);
    return;
  }
  if (value3) {
    const value24 = Ts.hidden
      ? He.hidden
        ? Et.hidden
          ? null
          : "ibe-icon"
        : "ibe-asset"
      : "ibe-entity";
    fn8(value24);
    const value25 = component.properties || {};
    const value26 = component.position || {};
    const numeric5 = Number(h.document.canvas.width || 2778);
    const numeric6 = Number(h.document.canvas.height || 1940);
    const numeric7 = Number(value26.width || 100);
    const numeric8 = Number(value26.height || 100);
    af.value = value25.label || "";
    setInspectorToggle(sf, value25.buttonVisible !== false);
    setInspectorToggle(cf, value25.effectVisible !== false);
    Ul.checked = value25.effectColorTemperatureRealtime !== false;
    _l.checked = value25.effectBrightnessRealtime !== false;
    for (const value33 of [Ul, _l]) {
      value33.disabled = false;
      value33.title = "";
      value33.closest(".check-row")?.classList.remove("is-disabled");
    }
    Bt(component);
    gE(component);
    KN(value25.icon || "");
    Xl.value = value25.iconOffColor || "#9aa5ad";
    Kl.value = value25.iconOnColor || "#ffffff";
    lf.value = roundField(Number(value25.iconSize ?? 44));
    Jl.value = value25.buttonOffColor || "#17242d";
    Zl.value = value25.buttonOnColor || "#1f91b8";
    df.value = roundField(Number(value25.buttonOpacity ?? 0.92) * 100);
    uf.value = value25.frameColor || "#dcebf2";
    pf.value = roundField(Number(value25.frameWidth ?? 1.5));
    mf.value = roundField(Number(value25.frameOpacity ?? 0.72) * 100);
    ff.value = roundField(Number(value25.radius ?? 50));
    gf.value = value25.glowColor || "#43c8f0";
    Ql.value = roundField(Number(value25.glowOffStrength ?? 0) * 100);
    ed.value = roundField(Number(value25.glowOnStrength ?? 1) * 100);
    bf.value = roundField(Number(value25.effectOpacity ?? 1) * 100);
    yf.value = roundField(Number(value25.effectFadeDuration ?? 0.52));
    td.value = roundField(Number(value25.effectLeft ?? 50));
    nd.value = roundField(Number(value25.effectTop ?? 50));
    od.value = roundField(Number(value25.effectScale ?? 1) * 100);
    id.value = roundField(Number(value25.effectRotation ?? 0));
    Na.value = roundField(
      clampNumber(
        ((Number(value26.x || 0) + numeric7 / 2) / numeric5) * 100,
        0,
        100,
      ),
    );
    Ea.value = roundField(
      clampNumber(
        ((Number(value26.y || 0) + numeric8 / 2) / numeric6) * 100,
        0,
        100,
      ),
    );
    ci.value = roundField((numeric7 / numeric5) * 100);
    li.value = roundField((numeric8 / numeric6) * 100);
    bo.value = roundField(Number(component.style?.scale || 1) * 100);
    di.value = roundField(Number(value26.rotation || 0));
    const value27 = bag.size > 1;
    ci.disabled = value27;
    li.disabled = value27;
    bo.disabled = false;
    di.disabled = false;
    const value28 = value25.effectLayoutMode === "fill" ? "fill" : "free";
    for (const element of vf.querySelectorAll("[data-ibe-layout]")) {
      const value33 = element.dataset.ibeLayout === value28;
      element.classList.toggle("active", value33);
      element.setAttribute("aria-pressed", String(value33));
    }
    for (const value33 of [td, nd, od, id]) {
      value33.disabled = value28 === "fill";
    }
    const value29 = pE(value25);
    F1.textContent = value29
      ? "原始尺寸：" +
        roundField(value29.width) +
        " × " +
        roundField(value29.height) +
        "；仅支持等比缩放。"
      : "效果图片将按原始尺寸等比缩放。";
    const value30 = iconButtonEffectInspectorLayer(
      component,
      qv.get(component.id),
    );
    x?.setComponentSelectionLayer(component.id, value30);
    if (!un.has(component.id)) {
      un.set(component.id, "on");
      x?.setComponentPreviewState(component.id, "on");
    }
    const value31 = un.get(component.id) || "auto";
    for (const element of Yl.querySelectorAll("[data-ibe-preview]")) {
      const value33 = element.dataset.ibePreview === value31;
      element.classList.toggle("active", value33);
      element.setAttribute("aria-pressed", String(value33));
    }
    for (const element of rf.querySelectorAll("[data-ibe-layer]")) {
      const value33 = element.dataset.ibeLayer === value30;
      element.classList.toggle("active", value33);
      element.setAttribute("aria-pressed", String(value33));
    }
    const value32 = value30 === "effect";
    P1.hidden = value32;
    M1.hidden = value32;
    O1.hidden = value32;
    k1.hidden = !value32;
    const length = st("icon-button-effect").length;
    const length2 = Vw(component).length;
    Ps.disabled = length < 2 || !length2;
    W1.textContent = length2 + " 项修改";
    Ps.textContent = "一键应用到同类型控件";
    fn(component, V1);
    return;
  }
  if (value9) {
    fn8(Js.hidden ? null : "air-conditioner-entity");
    LE(component);
    return;
  }
  if (value4) {
    const value24 = Ms.hidden
      ? je.hidden
        ? null
        : "title-button-icon"
      : "title-button-entity";
    fn8(value24);
    SE(component);
    return;
  }
  if (value5) {
    const value24 = Ie.hidden
      ? Vs.hidden
        ? qe.hidden
          ? null
          : "light-statistics-icon"
        : "light-statistics-action-entity"
      : "light-statistics-entity";
    fn8(value24);
    xE(component);
    return;
  }
  if (value6) {
    const value24 = mi.hidden
      ? It.hidden
        ? null
        : "icon-button-icon"
      : "icon-button-entity";
    fn8(value24);
    NE(component);
    return;
  }
  if (value8) {
    fn8(ac.hidden ? null : "camera-entity");
    EE(component);
    return;
  }
  if (value7) {
    fn8(nc.hidden ? null : "vacuum-map-entity");
    IE(component);
    return;
  }
  if (value15) {
    fn8(Tt.hidden ? null : "navigation-icon");
    CE(component);
    return;
  }
  if (value10) {
    fn8();
    hE(component);
    return;
  }
  if (value11) {
    fn8();
    bE(component);
    return;
  }
  if (value12) {
    fn8();
    yE(component);
    return;
  }
  if (value13) {
    fn8();
    vE(component);
    return;
  }
  if (value14) {
    fn8();
    wE(component);
    return;
  }
  const value19 = component.properties || {};
  const value20 = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(value20.width || 100);
  const numeric4 = Number(value20.height || 100);
  h1.value = "图片";
  Is.value = value19.label || "";
  Bt(component);
  fE(component);
  ca.value = roundField(Number(value19.opacity ?? 1) * 100);
  mo.value = roundField(
    clampNumber(
      ((Number(value20.x || 0) + numeric3 / 2) / numeric) * 100,
      0,
      100,
    ),
  );
  fo.value = roundField(
    clampNumber(
      ((Number(value20.y || 0) + numeric4 / 2) / numeric2) * 100,
      0,
      100,
    ),
  );
  Nn.value = roundField(
    clampNumber(Number(component.style?.scale || 1) * 100, 1, 500),
  );
  go.value = roundField(Number(value20.rotation || 0));
  const value21 = value19.layoutMode === "fill" ? "fill" : "free";
  for (const element of Km.querySelectorAll("[data-image-layout]")) {
    const value24 = element.dataset.imageLayout === value21;
    element.classList.toggle("active", value24);
    element.setAttribute("aria-pressed", String(value24));
  }
  const value22 = value21 === "fill";
  const value23 = bag.size > 1;
  mo.disabled = value22;
  fo.disabled = value22;
  Nn.disabled = value22;
  go.disabled = value22;
  fn(component, N1);
}
async function gn({ refreshInspector: value = true } = {}) {
  const [value2, value3] = await Promise.all([
    J("/assets/builtin?_=" + Date.now()),
    J("/assets/user?_=" + Date.now()),
  ]);
  $n = value2.items || [];
  ht = value3.items || [];
  Ev = (value2.catalogVersion || "") + ":" + (value3.catalogVersion || "");
  const value4 = setBuiltinAssetVersions(D0());
  if (value4) {
    x?.renderComponents(true);
    Ue?.renderComponents(true);
  }
  if (value) {
    Z();
  }
  return value4;
}
async function U0() {
  const value = await J("/assets/version");
  const value2 = (value.builtin || "") + ":" + (value.user || "");
  if (Ev !== value2) {
    await gn({
      refreshInspector: true,
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
      const value2 = [];
      let value3 = 0;
      let value4 = 0;
      do {
        const value7 = await J("/ha/entities?limit=500&offset=" + value3);
        value2.push(...(value7.items || []));
        value4 = Number(value7.total || 0);
        value3 += Number(value7.limit || 500);
      } while (value2.length < value4);
      le = value2.filter((value7) => value7.status !== "missing");
      const [value5, value6] = await Promise.all([
        J("/ha/devices").catch(() => ({
          items: [],
        })),
        J("/ha/translations").catch(() => ({
          resources: {},
        })),
      ]);
      cn = value5?.items || [];
      Iu = new Map(
        cn
          .map((value7) => [String(value7.deviceId || ""), Tr(value7.name)])
          .filter(([value7, value8]) => value7 && value8),
      );
      Ao = value6?.resources || {};
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
function vp(value, value2 = se) {
  const value3 = value?.customPopups || [];
  We.replaceChildren();
  Yo.replaceChildren();
  if (!value3.length) {
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
  for (const value4 of value3) {
    We.append(new Option(value4.name, value4.id));
  }
  se = value3.some((value4) => value4.id === value2) ? value2 : value3[0].id;
  We.value = se;
  We.disabled = false;
  ao.disabled = false;
  oe(We);
  for (const value4 of value3) {
    const value5 = document.createElement("button");
    value5.type = "button";
    value5.className =
      "popup-list-item" + (value4.id === se ? " selected" : "");
    value5.dataset.popupId = value4.id;
    value5.setAttribute("role", "option");
    value5.setAttribute("aria-selected", String(value4.id === se));
    const element = document.createElement("span");
    element.textContent = value4.name;
    const element2 = document.createElement("small");
    element2.textContent = (value4.modules || []).length + " 个模块";
    value5.append(element, element2);
    Yo.append(value5);
  }
}
function _0() {
  for (const element of document.querySelectorAll("[data-popup-entity]")) {
    const value = element.closest("[data-action-trigger]");
    if (!element.value && le[0]?.entityId) {
      element.value = le[0].entityId;
    }
    yp(value);
    const value2 = value?.querySelector("[data-popup-entity-menu]");
    if (value2 && !value2.hidden) {
      Rc(value, value.querySelector("[data-popup-entity-search]")?.value || "");
    }
  }
}
function wp(value = he.elements.deviceType.value) {
  const value2 = he.elements.type.value === "climate";
  const value3 = normalizedPopupClimateDeviceType(value);
  yu.hidden = !value2;
  he.elements.deviceType.value = value3;
  for (const element of yu.querySelectorAll(
    "[data-popup-module-device-type]",
  )) {
    const value4 = element.dataset.popupModuleDeviceType === value3;
    element.classList.toggle("active", value4);
    element.setAttribute("aria-pressed", String(value4));
  }
}
function Cp(value) {
  return (
    le.find((value2) => value2.entityId === value)?.name ||
    value ||
    "未选择实体"
  );
}
function Y0() {
  const value = he.elements.entityId.value;
  const value2 = le.find((value4) => value4.entityId === value);
  const value3 = value2
    ? "[" + Hn(value2) + "] " + Ot(value2)
    : value || "选择实体";
  Mr(rn, value3, value || value3);
  rn.dataset.entityId = value;
  rn._entityCopySync?.();
}
function X0(value = hc.value) {
  const value2 = he.elements.entityId.value;
  const value3 = String(value || "")
    .trim()
    .toLocaleLowerCase("zh-CN");
  const value4 = le
    .map((entity, index) => ({
      entity: entity,
      index: index,
    }))
    .filter(
      ({ entity: value5 }) =>
        !value3 ||
        (ct(value5) + " " + value5.entityId)
          .toLocaleLowerCase("zh-CN")
          .includes(value3),
    )
    .sort(
      (value5, value6) =>
        Number(
          popupModuleEntityRecommended(value6.entity, he.elements.type.value),
        ) -
          Number(
            popupModuleEntityRecommended(value5.entity, he.elements.type.value),
          ) || value5.index - value6.index,
    )
    .map(({ entity: value5 }) => value5);
  Ii.replaceChildren(
    ...value4.map((value5) => {
      const value6 = document.createElement("button");
      value6.type = "button";
      value6.className =
        "inspector-entity-option" +
        (value5.entityId === value2 ? " selected" : "");
      value6.dataset.popupModuleEntityId = value5.entityId;
      value6.setAttribute("role", "option");
      value6.setAttribute("aria-selected", String(value5.entityId === value2));
      const value7 = document.createElement("span");
      value7.className = "inspector-entity-option-content";
      const element = document.createElement("span");
      element.className =
        "inspector-entity-option-line inspector-entity-name-line";
      element.textContent = "[" + Hn(value5) + "] " + Ot(value5);
      const element2 = document.createElement("span");
      element2.className = "inspector-entity-option-line inspector-entity-id";
      element2.textContent = value5.entityId;
      value7.append(element, element2);
      Gn(value6, element);
      value6.append(value7);
      return value6;
    }),
  );
  if (!value4.length) {
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
    ".custom-popup-editor-toolbar",
  );
  if (
    !value ||
    !customPopupStageWrap ||
    !customPopupViewport ||
    !customPopupStage ||
    !customPopupEditorToolbar
  ) {
    return;
  }
  const value2 = popupLayoutMetrics(value.modules || [], value.layout);
  const gridWidth = value2.gridWidth;
  const gridHeight = value2.gridHeight;
  const count = Math.max(
    0.2,
    Math.min(
      customPopupStageWrap.clientWidth / gridWidth,
      customPopupStageWrap.clientHeight / gridHeight,
    ),
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
function J0(value, value2, value3 = null, value4 = false) {
  const value5 = (h?.document?.customPopups || []).find(
    (value7) => value7.id === value,
  );
  if (!value5) {
    return;
  }
  const value6 = reorderedPopupModules(value5.modules, value2, value3, value4);
  if (
    value6.length !== (value5.modules || []).length ||
    !value6.every((value7, value8) => value7.id === value5.modules[value8]?.id)
  ) {
    if (!packPopupModules(value6, value5.layout).fits) {
      onError(new Error("这个排序会使当前布局超过 3 行。"));
      return;
    }
    L((value7) => {
      const value8 = (value7.customPopups || []).find(
        (value9) => value9.id === value,
      );
      if (value8) {
        value8.modules = reorderedPopupModules(
          value8.modules,
          value2,
          value3,
          value4,
        );
      }
    });
  }
}
function AE(value, component) {
  const value2 = document.createElement("div");
  value2.className = "popup-cover-settings";
  const value3 = [
    {
      label: "窗帘类型",
      property: "coverKind",
      fallback: "auto",
      allowed: ["auto", "standard", "dream", "airer"],
      options: [
        ["auto", "自动识别"],
        ["standard", "普通窗帘"],
        ["dream", "梦幻帘"],
        ["airer", "晾衣机"],
      ],
    },
    {
      label: "开合方向",
      property: "coverDirection",
      fallback: "split",
      allowed: ["split", "left", "right"],
      options: [
        ["split", "双开"],
        ["left", "向左"],
        ["right", "向右"],
      ],
    },
    {
      label: "电机方向",
      property: "coverMotorDirection",
      fallback: "auto",
      allowed: ["auto", "normal", "reversed"],
      options: [
        ["auto", "跟随 HA"],
        ["normal", "正常"],
        ["reversed", "反向"],
      ],
    },
  ];
  for (const value4 of value3) {
    const value5 = document.createElement("div");
    value5.className = "popup-cover-setting-row";
    const element = document.createElement("span");
    element.textContent = value4.label;
    const value6 = document.createElement("div");
    value6.className = "popup-cover-setting-options";
    value6.setAttribute("role", "group");
    value6.setAttribute("aria-label", value4.label);
    const value7 = component.properties?.[value4.property];
    const value8 = value4.allowed.includes(value7) ? value7 : value4.fallback;
    for (const [value9, value10] of value4.options) {
      const element2 = document.createElement("button");
      element2.type = "button";
      element2.textContent = value10;
      element2.classList.toggle("active", value9 === value8);
      element2.setAttribute("aria-pressed", String(value9 === value8));
      element2.addEventListener("click", (event) => {
        event.stopPropagation();
        if (value9 !== value8) {
          L((value11) => {
            const component2 = (value11.customPopups || [])
              .find((value12) => value12.id === value)
              ?.modules?.find((value12) => value12.id === component.id);
            if (!!component2 && component2.type === "cover") {
              component2.properties = {
                ...(component2.properties || {}),
                [value4.property]: value9,
              };
            }
          });
        }
      });
      value6.append(element2);
    }
    value5.append(element, value6);
    value2.append(value5);
  }
  return value2;
}
function PE(value, component) {
  const value2 = document.createElement("div");
  value2.className = "popup-climate-settings";
  const value3 = document.createElement("div");
  value3.className = "popup-cover-setting-row";
  const element = document.createElement("span");
  element.textContent = "设备类型";
  const value4 = document.createElement("div");
  value4.className = "popup-cover-setting-options";
  value4.setAttribute("role", "group");
  value4.setAttribute("aria-label", "设备类型");
  const value5 = component.properties?.deviceType || component.deviceType;
  const value6 = normalizedPopupClimateDeviceType(value5);
  for (const [deviceType, value7] of [
    ["auto", "自动识别"],
    ["air-conditioner", "空调"],
    ["bath-heater", "浴霸"],
  ]) {
    const element2 = document.createElement("button");
    element2.type = "button";
    element2.textContent = value7;
    element2.classList.toggle("active", deviceType === value6);
    element2.setAttribute("aria-pressed", String(deviceType === value6));
    element2.addEventListener("click", (event) => {
      event.stopPropagation();
      if (deviceType !== value6) {
        L((value8) => {
          const component2 = (value8.customPopups || [])
            .find((value9) => value9.id === value)
            ?.modules?.find((value9) => value9.id === component.id);
          if (!!component2 && component2.type === "climate") {
            component2.properties = {
              ...(component2.properties || {}),
              deviceType: deviceType,
            };
            delete component2.deviceType;
          }
        });
      }
    });
    value4.append(element2);
  }
  value3.append(element, value4);
  value2.append(value3);
  return value2;
}
function qc(component) {
  const value = [
    {
      value: 0,
      color: "#ddffc2",
    },
    {
      value: 13,
      color: "#68cc3e",
    },
    {
      value: 27,
      color: "#ff8e52",
    },
    {
      value: 40,
      color: "#ff1a1a",
    },
  ];
  const list = Array.isArray(component.properties?.thresholds)
    ? component.properties.thresholds
    : [];
  return value.map((element, value2) => ({
    value: Number.isFinite(Number(list[value2]?.value))
      ? Number(list[value2].value)
      : element.value,
    color: String(list[value2]?.color || element.color),
  }));
}
function kE(value, component) {
  const value2 = document.createElement("div");
  value2.className = "popup-line-chart-settings";
  const value3 = document.createElement("div");
  value3.className = "popup-line-chart-setting-row";
  const element = document.createElement("span");
  element.textContent = "数值小数位";
  const element2 = document.createElement("select");
  element2.setAttribute("aria-label", "组合弹窗折线图数值小数位");
  for (const [value10, value11] of [
    ["auto", "自动"],
    ["0", "0 位"],
    ["1", "1 位"],
    ["2", "2 位"],
    ["3", "3 位"],
    ["4", "4 位"],
  ]) {
    element2.append(new Option(value11, value10));
  }
  const value4 = syncedLineChartProperties(
    h?.document,
    Je(),
    component.entityId,
    component.properties,
  );
  element2.value = ["0", "1", "2", "3", "4"].includes(
    String(value4.statePrecision),
  )
    ? String(value4.statePrecision)
    : "auto";
  element2.addEventListener("pointerdown", (event) => event.stopPropagation());
  element2.addEventListener("click", (event) => event.stopPropagation());
  element2.addEventListener("change", (event) => {
    event.stopPropagation();
    const statePrecision = ["0", "1", "2", "3", "4"].includes(element2.value)
      ? element2.value
      : "auto";
    L((value10) => {
      const component2 = (value10.customPopups || [])
        .find((value11) => value11.id === value)
        ?.modules?.find((value11) => value11.id === component.id);
      if (!!component2 && component2.type === "line-chart") {
        component2.properties = {
          ...(component2.properties || {}),
          statePrecision: statePrecision,
        };
      }
    });
  });
  value3.append(element, element2);
  value2.append(value3);
  const fn9 = (value10, value11, fn10, value12 = false) => {
    const value13 = document.createElement("div");
    value13.className = "popup-line-chart-setting-row";
    const element6 = document.createElement("span");
    element6.textContent = value10;
    const value14 = document.createElement("div");
    value14.className = "popup-line-chart-colors";
    value11.forEach((value15, value16) => {
      const element7 = document.createElement("input");
      element7.type = "color";
      element7.value = value15;
      element7.disabled = value12;
      element7.setAttribute(
        "aria-label",
        "" + value10 + (value11.length > 1 ? " " + (value16 + 1) : ""),
      );
      element7.addEventListener("pointerdown", (event) =>
        event.stopPropagation(),
      );
      element7.addEventListener("click", (event) => event.stopPropagation());
      element7.addEventListener("change", (event) => {
        event.stopPropagation();
        fn10(element7.value, value16);
      });
      value14.append(element7);
    });
    value13.append(element6, value14);
    value2.append(value13);
  };
  fn9(
    "数值颜色",
    [String(component.properties?.valueColor || "#dce1e5")],
    (valueColor) => {
      L((value10) => {
        const component2 = (value10.customPopups || [])
          .find((value11) => value11.id === value)
          ?.modules?.find((value11) => value11.id === component.id);
        if (!!component2 && component2.type === "line-chart") {
          component2.properties = {
            ...(component2.properties || {}),
            valueColor: valueColor,
          };
        }
      });
    },
  );
  const value5 = document.createElement("div");
  value5.className = "popup-line-chart-setting-row";
  const element3 = document.createElement("span");
  element3.textContent = "阈值模式";
  const element4 = document.createElement("select");
  element4.setAttribute("aria-label", "组合弹窗折线图阈值模式");
  element4.append(
    new Option("自动（按历史范围）", "auto"),
    new Option("手动设置", "manual"),
  );
  const value6 =
    Array.isArray(component.properties?.thresholds) &&
    component.properties.thresholds.some((element6) =>
      Number.isFinite(Number(element6?.value)),
    );
  element4.value =
    component.properties?.thresholdMode === "auto" ||
    (!value6 && component.properties?.thresholdMode !== "manual")
      ? "auto"
      : "manual";
  element4.addEventListener("pointerdown", (event) => event.stopPropagation());
  element4.addEventListener("click", (event) => event.stopPropagation());
  element4.addEventListener("change", (event) => {
    event.stopPropagation();
    const thresholdMode = element4.value === "manual" ? "manual" : "auto";
    L((value10) => {
      const component2 = (value10.customPopups || [])
        .find((value12) => value12.id === value)
        ?.modules?.find((value12) => value12.id === component.id);
      if (!component2 || component2.type !== "line-chart") {
        return;
      }
      const value11 = {
        ...(component2.properties || {}),
        thresholdMode: thresholdMode,
      };
      if (thresholdMode === "manual" && !Array.isArray(value11.thresholds)) {
        value11.thresholds = qc(component2);
      }
      component2.properties = value11;
    });
  });
  value5.append(element3, element4);
  value2.append(value5);
  const value7 = qc(component);
  const value8 = document.createElement("div");
  value8.className = "popup-line-chart-setting-row";
  const element5 = document.createElement("span");
  element5.textContent = "阈值";
  const value9 = document.createElement("div");
  value9.className = "popup-line-chart-threshold-values";
  value7.forEach((element6, value10) => {
    const element7 = document.createElement("input");
    element7.type = "number";
    element7.step = "any";
    element7.value = roundField(element6.value);
    element7.disabled = element4.value === "auto";
    element7.setAttribute("aria-label", "折线阈值 " + (value10 + 1));
    element7.addEventListener("pointerdown", (event) =>
      event.stopPropagation(),
    );
    element7.addEventListener("click", (event) => event.stopPropagation());
    element7.addEventListener("change", (event) => {
      event.stopPropagation();
      const value11 = Number(element7.value);
      if (Number.isFinite(value11)) {
        element7.value = roundField(value11);
        L((value12) => {
          const component2 = (value12.customPopups || [])
            .find((value13) => value13.id === value)
            ?.modules?.find((value13) => value13.id === component.id);
          if (!component2 || component2.type !== "line-chart") {
            return;
          }
          const thresholds = qc(component2);
          thresholds[value10] = {
            ...thresholds[value10],
            value: value11,
          };
          component2.properties = {
            ...(component2.properties || {}),
            thresholdMode: "manual",
            thresholds: thresholds,
          };
        });
      }
    });
    value9.append(element7);
  });
  value8.append(element5, value9);
  value2.append(value8);
  fn9(
    "折线颜色",
    value7.map((value10) => value10.color),
    (color, value10) => {
      L((value11) => {
        const component2 = (value11.customPopups || [])
          .find((value12) => value12.id === value)
          ?.modules?.find((value12) => value12.id === component.id);
        if (!component2 || component2.type !== "line-chart") {
          return;
        }
        const thresholds = qc(component2);
        thresholds[value10] = {
          ...thresholds[value10],
          color: color,
        };
        component2.properties = {
          ...(component2.properties || {}),
          thresholdMode: "manual",
          thresholds: thresholds,
        };
      });
    },
    element4.value === "auto",
  );
  return value2;
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
  const value2 = document.createElement("div");
  value2.className = "custom-popup-editor-shell";
  const value3 = document.createElement("div");
  value3.className = "custom-popup-editor-toolbar";
  const value4 = document.createElement("div");
  const element = document.createElement("strong");
  element.textContent = value.name;
  const element2 = document.createElement("span");
  const value5 = popupLayoutMetrics(value.modules || [], value.layout);
  element2.textContent =
    value5.columns + " 列 × " + value5.rows + " 行·行数自适应";
  value4.append(element, element2);
  const value6 = document.createElement("div");
  value6.className = "custom-popup-toolbar-actions";
  const value7 = document.createElement("span");
  value7.className = "custom-popup-layout-toggle";
  for (const columns of [2, 3, 4]) {
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.textContent = columns + " 列";
    element5.classList.toggle(
      "active",
      popupLayoutColumns(value.layout) === columns,
    );
    element5.addEventListener("click", () => {
      if (popupLayoutColumns(value.layout) === columns) {
        return;
      }
      const value11 = {
        ...(value.layout || {}),
        columns: columns,
      };
      if (!packPopupModules(value.modules || [], value11).fits) {
        onError(new Error("当前模块在 " + columns + " 列布局中会超过 3 行。"));
        return;
      }
      L((value12) => {
        const value13 = (value12.customPopups || []).find(
          (value14) => value14.id === value.id,
        );
        if (value13) {
          value13.layout = {
            ...(value13.layout || {}),
            columns: columns,
          };
        }
      });
    });
    value7.append(element5);
  }
  const element3 = document.createElement("button");
  element3.type = "button";
  element3.textContent = "＋ 添加模块";
  element3.addEventListener("click", () => Z0());
  value6.append(value7, element3);
  value3.append(value4, value6);
  const value8 = document.createElement("div");
  value8.className = "custom-popup-stage-wrap";
  const value9 = document.createElement("div");
  value9.className = "custom-popup-viewport";
  const element4 = document.createElement("div");
  element4.className = "custom-popup-stage";
  element4.style.width = value5.gridWidth + "px";
  element4.style.height = value5.gridHeight + "px";
  element4.style.setProperty("--popup-columns", value5.columns);
  element4.style.setProperty("--popup-rows", value5.rows);
  element4.style.gridTemplateColumns =
    "repeat(" + value5.columns + ", minmax(0, 1fr))";
  element4.style.gridTemplateRows =
    "repeat(" + value5.rows + ", minmax(0, 1fr))";
  let value10 = null;
  const fn9 = () => {
    element4.classList.remove("popup-module-append-target");
    for (const element5 of element4.querySelectorAll(
      ".popup-module-drop-top,.popup-module-drop-right,.popup-module-drop-bottom,.popup-module-drop-left",
    )) {
      element5.classList.remove(
        "popup-module-drop-top",
        "popup-module-drop-right",
        "popup-module-drop-bottom",
        "popup-module-drop-left",
      );
    }
  };
  element4.addEventListener("dragover", (event) => {
    if (!!value10 && !event.target.closest(".popup-module-card")) {
      event.preventDefault();
      fn9();
      element4.classList.add("popup-module-append-target");
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    }
  });
  element4.addEventListener("drop", (event) => {
    if (!value10 || event.target.closest(".popup-module-card")) {
      return;
    }
    event.preventDefault();
    const value11 = value10;
    fn9();
    J0(value.id, value11);
  });
  for (const [value11, value12] of (value.modules || []).entries()) {
    const value13 = value5.placements[value11] || {
      x: 0,
      y: value11,
      width: 1,
      height: 1,
    };
    const value14 = [
      "climate",
      "air-purifier",
      "water-heater",
      "media-player",
      "camera",
      "line-chart",
    ].includes(value12.type)
      ? 2
      : value13.width;
    const element5 = document.createElement("article");
    element5.className = "popup-module-card";
    element5.dataset.popupModuleId = value12.id;
    element5.draggable = true;
    element5.setAttribute(
      "aria-label",
      (value12.title || Cp(value12.entityId)) + "，可拖动排序",
    );
    element5.style.gridColumn = value13.x + 1 + " / span " + value14;
    element5.style.gridRow = value13.y + 1 + " / span " + value13.height;
    const value15 = document.createElement("div");
    value15.className = "popup-module-card-heading";
    const value16 = document.createElement("div");
    const element6 = document.createElement("strong");
    element6.textContent = value12.title || Cp(value12.entityId);
    value16.append(element6);
    const value17 = document.createElement("span");
    value17.className = "popup-module-card-actions";
    const element7 = document.createElement("button");
    element7.type = "button";
    element7.textContent = "✎";
    element7.title = "编辑模块";
    element7.addEventListener("click", () => Z0(value12));
    const element8 = document.createElement("button");
    element8.type = "button";
    element8.textContent = "⎘";
    element8.title = "复制模块";
    element8.addEventListener("click", () => {
      const value19 = [
        ...(value.modules || []),
        {
          ...clone(value12),
          id: "candidate",
        },
      ];
      if (!packPopupModules(value19, value.layout).fits) {
        onError(new Error("当前布局已放不下这个复制模块。"));
        return;
      }
      L((value20) => {
        const value21 = (value20.customPopups || []).find(
          (value23) => value23.id === value.id,
        );
        const value22 = value21?.modules?.find(
          (value23) => value23.id === value12.id,
        );
        if (value22) {
          value21.modules.push({
            ...clone(value22),
            id: newId("popup-module"),
          });
        }
      });
    });
    const element9 = document.createElement("button");
    element9.type = "button";
    element9.textContent = "×";
    element9.title = "删除模块";
    element9.addEventListener("click", () =>
      L((value19) => {
        const value20 = (value19.customPopups || []).find(
          (value21) => value21.id === value.id,
        );
        if (value20) {
          value20.modules = value20.modules.filter(
            (value21) => value21.id !== value12.id,
          );
        }
      }),
    );
    value17.append(element7, element8, element9);
    element5.addEventListener("pointerdown", (value19) => {
      element5.dataset.dragBlocked = String(
        !!value19.target.closest(
          ".popup-module-card-actions,.popup-cover-settings,.popup-climate-settings,.popup-line-chart-settings",
        ),
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
      value10 = value12.id;
      element5.classList.add("popup-module-dragging");
      element5.setAttribute("aria-grabbed", "true");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", value12.id);
      }
    });
    element5.addEventListener("dragover", (event) => {
      if (!value10 || value10 === value12.id) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      fn9();
      const { edge: value19 } = popupModuleDropPosition(element5, event);
      element5.classList.add("popup-module-drop-" + value19);
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    });
    element5.addEventListener("drop", (event) => {
      if (!value10 || value10 === value12.id) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const value19 = value10;
      const { placeAfter: value20 } = popupModuleDropPosition(element5, event);
      fn9();
      J0(value.id, value19, value12.id, value20);
    });
    element5.addEventListener("dragend", () => {
      value10 = null;
      delete element5.dataset.dragBlocked;
      element5.classList.remove("popup-module-dragging");
      element5.removeAttribute("aria-grabbed");
      fn9();
    });
    value15.append(value16, value17);
    const value18 = document.createElement("div");
    value18.className = "popup-module-placeholder";
    const element10 = document.createElement("strong");
    element10.textContent = popupModuleTypeLabel(value12.type) + "交互模块";
    const element11 = document.createElement("span");
    element11.textContent = Cp(value12.entityId);
    const element12 = document.createElement("small");
    element12.textContent = value12.entityId;
    value18.append(element10, element11, element12);
    if (value12.type === "cover") {
      value18.append(AE(value.id, value12));
    }
    if (value12.type === "climate") {
      value18.append(PE(value.id, value12));
    }
    if (value12.type === "line-chart") {
      value18.append(kE(value.id, value12));
    }
    element5.append(value15, value18);
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
  value9.append(element4);
  value8.append(value9);
  value2.append(value3, value8);
  yn.append(value2);
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
    "generic",
  ].includes(value)
    ? value
    : "light";
  oe(he.elements.type);
  const value2 =
    le.find((value3) =>
      popupModuleEntityRecommended(value3, he.elements.type.value),
    ) || le[0];
  he.elements.entityId.value = component?.entityId || value2?.entityId || "";
  he.elements.title.value = component?.title || "";
  wp(component?.properties?.deviceType || component?.deviceType || "auto");
  hc.value = "";
  Y0();
  Ii.replaceChildren();
  zi();
  Li.showModal();
}
function ME(value, value2 = null) {
  W.replaceChildren();
  if (!value.pages.length) {
    W.append(new Option("暂无页面", ""));
    W.disabled = true;
    oe(W);
    return false;
  }
  const value3 = value.pages.some(
    (value4) => value4.path === value.defaultPagePath,
  )
    ? value.defaultPagePath
    : null;
  for (const value4 of value.pages) {
    const value5 = new Option(value4.name, value4.path);
    value5.dataset.defaultPage = String(value4.path === value3);
    W.append(value5);
  }
  W.disabled = false;
  W.value =
    value2 && value.pages.some((value4) => value4.path === value2)
      ? value2
      : value3 || value.pages[0].path;
  oe(W);
  return true;
}
function Q0(value, value2) {
  const value3 = bag.size ? [...bag] : componentId ? [componentId] : [];
  bag = new Set(
    value3.filter((value4) => {
      const value5 = findComponent(value, value4);
      return (
        value5 && (value5.scope !== "page" || value5.page?.path === value2)
      );
    }),
  );
  if (!bag.has(componentId)) {
    componentId = bag.values().next().value || null;
  }
  if (!componentId) {
    we = null;
  }
}
const OE = new Set();
function BE(value, value2, value3) {
  if (
    Te !== "edit" ||
    !x ||
    x.page?.path !== value3 ||
    editorDocumentFrameSignature(value) !== editorDocumentFrameSignature(value2)
  ) {
    return null;
  }
  const value4 = editorComponentEntries(value);
  const value5 = editorComponentEntries(value2);
  if (
    value4.order.length !== value5.order.length ||
    value4.order.some((value7, value8) => value7 !== value5.order[value8]) ||
    value4.entries.size !== value5.entries.size
  ) {
    return null;
  }
  const value6 = [];
  for (const [componentId, value7] of value4.entries) {
    const value8 = value5.entries.get(componentId);
    if (
      !value8 ||
      value7.scope !== value8.scope ||
      value7.pagePath !== value8.pagePath ||
      value7.parentId !== value8.parentId ||
      OE.has(value7.component.type) ||
      editorComponentStructure(value7.component) !==
        editorComponentStructure(value8.component)
    ) {
      return null;
    }
    if (JSON.stringify(value7.component) !== JSON.stringify(value8.component)) {
      if (!x.componentHosts.has(componentId)) {
        return null;
      }
      value6.push({
        componentId: componentId,
        component: value8.component,
      });
    }
  }
  if (value6.length) {
    return value6;
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
  const value2 = Number.isFinite(fallback.width) ? fallback.width : numeric3;
  const value3 = Number.isFinite(fallback.height) ? fallback.height : numeric4;
  const value4 = ["icon-button", "device-button", "presence-sensor"].includes(
    component.type,
  );
  const element =
    component.type === "title-button"
      ? rd
      : component.type === "light-statistics"
        ? ud
        : value4
          ? $d
          : component.type === "air-conditioner"
            ? Rd
            : component.type === "vacuum-map"
              ? Ud
              : component.type === "camera"
                ? Xd
                : component.type === "icon-button-effect"
                  ? Na
                  : component.type === "navigation-button"
                    ? ur
                    : component.type === "time"
                      ? Ya
                      : component.type === "date"
                        ? Ja
                        : component.type === "weather"
                          ? er
                          : component.type === "line-chart"
                            ? or
                            : component.type === "panel-frame"
                              ? rr
                              : mo;
  const element2 =
    component.type === "title-button"
      ? sd
      : component.type === "light-statistics"
        ? pd
        : value4
          ? Fd
          : component.type === "air-conditioner"
            ? Hd
            : component.type === "vacuum-map"
              ? _d
              : component.type === "camera"
                ? Kd
                : component.type === "icon-button-effect"
                  ? Ea
                  : component.type === "navigation-button"
                    ? pr
                    : component.type === "time"
                      ? Xa
                      : component.type === "date"
                        ? Za
                        : component.type === "weather"
                          ? tr
                          : component.type === "line-chart"
                            ? ir
                            : component.type === "panel-frame"
                              ? sr
                              : fo;
  const element3 =
    component.type === "title-button"
      ? Aa
      : component.type === "light-statistics"
        ? $a
        : value4
          ? Wa
          : component.type === "air-conditioner"
            ? ja
            : component.type === "vacuum-map"
              ? qa
              : component.type === "camera"
                ? Ua
                : component.type === "icon-button-effect"
                  ? bo
                  : component.type === "navigation-button"
                    ? An
                    : component.type === "time"
                      ? yo
                      : component.type === "date"
                        ? vo
                        : component.type === "weather"
                          ? wo
                          : component.type === "line-chart"
                            ? Co
                            : component.type === "panel-frame"
                              ? So
                              : Nn;
  const element4 =
    component.type === "title-button"
      ? Ds
      : component.type === "light-statistics"
        ? Hs
        : value4
          ? _s
          : component.type === "air-conditioner"
            ? ec
            : component.type === "vacuum-map"
              ? oc
              : component.type === "camera"
                ? cc
                : component.type === "icon-button-effect"
                  ? di
                  : component.type === "navigation-button"
                    ? Eo
                    : component.type === "time"
                      ? gi
                      : component.type === "date"
                        ? hi
                        : component.type === "weather"
                          ? bi
                          : component.type === "line-chart"
                            ? Ci
                            : component.type === "panel-frame"
                              ? Ni
                              : go;
  if (Number.isFinite(fallback.x)) {
    element.value = roundField(
      clampNumber(((fallback.x + value2 / 2) / numeric) * 100, 0, 100),
    );
  }
  if (Number.isFinite(fallback.y)) {
    element2.value = roundField(
      clampNumber(((fallback.y + value3 / 2) / numeric2) * 100, 0, 100),
    );
  }
  if (
    component.type === "navigation-button" &&
    Number.isFinite(fallback.width)
  ) {
    xo.value = roundField(
      clampNumber((fallback.width / numeric) * 100, 0.1, 100),
    );
  }
  if (
    component.type === "navigation-button" &&
    Number.isFinite(fallback.height)
  ) {
    No.value = roundField(
      clampNumber((fallback.height / numeric2) * 100, 0.1, 100),
    );
  }
  if (
    component.type === "icon-button-effect" &&
    Number.isFinite(fallback.width)
  ) {
    ci.value = roundField(
      clampNumber((fallback.width / numeric) * 100, 0.1, 100),
    );
  }
  if (
    component.type === "icon-button-effect" &&
    Number.isFinite(fallback.height)
  ) {
    li.value = roundField(
      clampNumber((fallback.height / numeric2) * 100, 0.1, 100),
    );
  }
  if (component.type === "title-button" && Number.isFinite(fallback.width)) {
    $s.value = roundField(
      clampNumber((fallback.width / numeric) * 100, 0.1, 100),
    );
  }
  if (component.type === "title-button" && Number.isFinite(fallback.height)) {
    Fs.value = roundField(
      clampNumber((fallback.height / numeric2) * 100, 0.1, 100),
    );
  }
  if (
    component.type === "light-statistics" &&
    Number.isFinite(fallback.width)
  ) {
    Ws.value = roundField(
      clampNumber((fallback.width / numeric) * 100, 0.1, 100),
    );
  }
  if (
    component.type === "light-statistics" &&
    Number.isFinite(fallback.height)
  ) {
    Rs.value = roundField(
      clampNumber((fallback.height / numeric2) * 100, 0.1, 100),
    );
  }
  if (value4 && Number.isFinite(fallback.width)) {
    Gs.value = roundField(
      clampNumber((fallback.width / numeric) * 100, 0.1, 100),
    );
  }
  if (value4 && Number.isFinite(fallback.height)) {
    Us.value = roundField(
      clampNumber((fallback.height / numeric2) * 100, 0.1, 100),
    );
  }
  if (component.type === "camera" && Number.isFinite(fallback.width)) {
    rc.value = roundField(
      clampNumber((fallback.width / numeric) * 100, 0.1, 100),
    );
  }
  if (component.type === "camera" && Number.isFinite(fallback.height)) {
    sc.value = roundField(
      clampNumber((fallback.height / numeric2) * 100, 0.1, 100),
    );
  }
  if (component.type === "air-conditioner" && Number.isFinite(fallback.width)) {
    Zs.value = roundField(
      clampNumber((fallback.width / numeric) * 100, 0.1, 100),
    );
  }
  if (
    component.type === "air-conditioner" &&
    Number.isFinite(fallback.height)
  ) {
    Qs.value = roundField(
      clampNumber((fallback.height / numeric2) * 100, 0.1, 100),
    );
  }
  if (component.type === "line-chart" && Number.isFinite(fallback.width)) {
    vi.value = roundField(
      clampNumber((fallback.width / numeric) * 100, 0.1, 100),
    );
  }
  if (component.type === "line-chart" && Number.isFinite(fallback.height)) {
    wi.value = roundField(
      clampNumber((fallback.height / numeric2) * 100, 0.1, 100),
    );
  }
  if (component.type === "panel-frame" && Number.isFinite(fallback.width)) {
    Si.value = roundField(
      clampNumber((fallback.width / numeric) * 100, 0.1, 100),
    );
  }
  if (component.type === "panel-frame" && Number.isFinite(fallback.height)) {
    xi.value = roundField(
      clampNumber((fallback.height / numeric2) * 100, 0.1, 100),
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
    x ||
    ((x = new PanelRenderer(Dt, {
      editable: true,
      historySeriesCache: Sv,
      runtimeStateCache: xv,
      virtualEntityStateCache: Nv,
      onComponentTransform(value, value2) {
        componentId = value;
        bag = new Set([value]);
        L((value3) => {
          const component = findComponent(value3, value)?.component;
          if (!component) {
            return;
          }
          const value4 = Ae(component, "width");
          const value5 = Ae(component, "height");
          const value6 = Ae(component, "scale");
          const value7 = Ae(component, "rotation");
          const {
            scale: scale,
            airflowOffsetX: airflowOffsetX,
            airflowOffsetY: airflowOffsetY,
            ...value8
          } = value2;
          component.position = {
            ...(component.position || {}),
            ...value8,
          };
          if (Number.isFinite(scale)) {
            component.style = {
              ...(component.style || {}),
              scale: scale,
            };
          }
          if (
            component.type === "air-conditioner" &&
            (Number.isFinite(airflowOffsetX) || Number.isFinite(airflowOffsetY))
          ) {
            component.properties = {
              ...(component.properties || {}),
              ...(Number.isFinite(airflowOffsetX)
                ? {
                    airflowOffsetX: airflowOffsetX,
                  }
                : {}),
              ...(Number.isFinite(airflowOffsetY)
                ? {
                    airflowOffsetY: airflowOffsetY,
                  }
                : {}),
            };
          }
          if (
            component.type === "navigation-button" &&
            Number.isFinite(value2.width)
          ) {
            Kn(value, "width", value4, Ae(component, "width"));
          }
          if (
            component.type === "navigation-button" &&
            Number.isFinite(value2.height)
          ) {
            Kn(value, "height", value5, Ae(component, "height"));
          }
          if (
            component.type === "navigation-button" &&
            Number.isFinite(value2.scale)
          ) {
            Kn(value, "scale", value6, Ae(component, "scale"));
          }
          if (
            component.type === "navigation-button" &&
            Number.isFinite(value2.rotation)
          ) {
            Kn(value, "rotation", value7, Ae(component, "rotation"));
          }
        });
      },
      onComponentsTransform(value, value2) {
        componentId = value2;
        L((value3) => {
          for (const value4 of value) {
            const component = findComponent(
              value3,
              value4.componentId,
            )?.component;
            if (component) {
              component.position = {
                ...(component.position || {}),
                ...(Number.isFinite(value4.x)
                  ? {
                      x: value4.x,
                    }
                  : {}),
                ...(Number.isFinite(value4.y)
                  ? {
                      y: value4.y,
                    }
                  : {}),
                ...(Number.isFinite(value4.rotation)
                  ? {
                      rotation: value4.rotation,
                    }
                  : {}),
              };
              if (Number.isFinite(value4.scale)) {
                component.style = {
                  ...(component.style || {}),
                  scale: value4.scale,
                };
              }
            }
          }
        });
      },
      onComponentDuplicate(value, value2) {
        componentId = value2.id;
        bag = new Set([value2.id]);
        we = value2.id;
        L((value3) => {
          Gu(value3, value, value2, false);
        });
      },
      onComponentsDuplicate(value, _, value2) {
        const value3 = value.map((value4) => value4.copiedComponent.id);
        componentId = value2 || value3[0] || null;
        bag = new Set(value3);
        we = componentId;
        L((value4) => {
          for (const value5 of value) {
            Gu(value4, value5.sourceComponentId, value5.copiedComponent, false);
          }
        });
      },
      onComponentTransformPreview(value, value2) {
        ew(value, value2);
      },
      onComponentProperties(value, value2) {
        L((value3) => {
          const component = findComponent(value3, value)?.component;
          if (
            !!component &&
            !!["air-conditioner", "presence-sensor"].includes(component.type) &&
            (component.type !== "presence-sensor" ||
              component.properties?.sensorKind === "door-window")
          ) {
            component.properties = {
              ...(component.properties || {}),
              ...value2,
            };
          }
        });
      },
      onComponentPropertiesPreview(value, value2) {
        if (value === componentId) {
          if (Number.isFinite(value2.airflowScale)) {
            Vd.value = roundField(value2.airflowScale * 100);
          }
          if (Number.isFinite(value2.airflowRotation)) {
            Wd.value = roundField(value2.airflowRotation);
          }
          if (Number.isFinite(value2.airflowOffsetX)) {
            Ra.value = roundField(value2.airflowOffsetX);
          }
          if (Number.isFinite(value2.airflowOffsetY)) {
            Ha.value = roundField(value2.airflowOffsetY);
          }
        }
      },
      onComponentsTransformPreview(value, value2) {
        componentId = value2;
        const value3 = value.find((value4) => value4.componentId === value2);
        if (value3) {
          ew(value2, value3);
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
        x?.setSelectedComponents([...bag], componentId);
        _e();
        Z();
      },
    })),
    x.setEntityCatalog(le, Ao, cn),
    x)
  );
}
function qr(value = null) {
  Hu();
  Pl();
  ju();
  vp(h.document, se);
  const value2 = ME(h.document, value);
  a0(value2);
  qu();
  if (!value2) {
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
    x.setSelectedComponents([...bag], componentId);
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
    const value2 = sessionStorage.getItem(recoveryStorageKey(xc, value));
    if (!value2) {
      return null;
    }
    const value3 = JSON.parse(value2);
    if (!value3?.document || value3.projectId !== value) {
      return null;
    } else {
      return value3;
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
    selectedComponentIds: [...bag],
    undo: pe.undo,
    redo: pe.redo,
    savedAt: new Date().toISOString(),
  };
  try {
    sessionStorage.setItem(
      recoveryStorageKey(xc, h.projectId),
      JSON.stringify(value),
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
          savedAt: value.savedAt,
        }),
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
function Vi(value, value2) {
  for (
    value.push(value2);
    value.filter((value3) => value3.kind !== "save").length > ku;
  ) {
    const value3 = value.findIndex((value4) => value4.kind !== "save");
    if (value3 < 0) {
      break;
    }
    value.splice(value3, 1);
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
    selectedComponentIds: [...bag],
  };
}
async function xp(projectId, value = null) {
  window.HABridgeLog?.setContext({
    projectId: projectId,
  });
  h = await J("/projects/" + projectId + "/draft");
  Du = "";
  let value2 = Tc(jt(h.document));
  if (!value2) {
    await Ir();
    value2 = Tc(jt(h.document));
  }
  if (!value2?.allowed) {
    throw new Error("当前授权尚未解锁该 UI 方案。");
  }
  await ensureUiPackRuntime(value2);
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
    bt &&
    (bt.revision !== h.revision || documentSignature(bt.document) === Ai)
  ) {
    Gc(projectId);
    bt = null;
  }
  qt();
  nw();
  hn({
    preserveRecovery: !!bt,
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
  for (const value3 of ft) {
    Le.append(new Option(value3.name, value3.id));
  }
  Le.disabled = false;
  oe(Le);
  const value2 =
    value && ft.some((value3) => value3.id === value) ? value : ft[0].id;
  await xp(value2);
}
async function vt(
  value,
  value2 = W.value,
  { recordHistory: value3 = true } = {},
) {
  if (!h) {
    throw new Error("请先选择仪表盘。");
  }
  const document = h.document;
  await guardInteraction3dChanges(document, value);
  const value4 = BE(document, value, value2);
  const value5 = Uc();
  if (documentSignature(value5.document) === documentSignature(value)) {
    return h;
  }
  h = {
    ...h,
    document: clone(value),
  };
  if (value3) {
    Vi(pe.undo, value5);
    pe.redo = [];
  }
  const value6 = ft.find((value7) => value7.id === h.projectId);
  if (value6) {
    value6.name = h.document.name;
  }
  const element = Le.selectedOptions[0];
  if (element) {
    element.textContent = h.document.name;
  }
  oe(Le);
  if (value4 && x?.applyEditorComponentUpdates(h.document, value2, value4)) {
    _e();
    Z();
  } else {
    qr(value2);
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
  const value2 = documentSignature(value);
  const globalPopupsDirty =
    documentSignature(value.customPopups || []) !==
    documentSignature(Ke.customPopups || []);
  Nc = true;
  hn();
  try {
    const value3 = await J("/projects/" + h.projectId + "/draft", {
      method: "PUT",
      hbLogContext: {
        projectId: h.projectId,
        phase: "save-draft",
      },
      body: JSON.stringify({
        revision: h.revision,
        globalPopupRevision: h.globalPopupRevision,
        globalPopupsDirty: globalPopupsDirty,
        document: h.document,
      }),
    });
    h = value3;
    Ke = clone(value3.document);
    Ai = documentSignature(value3.document);
    ki.clear();
    Mi.clear();
    Oi.clear();
    Bi.clear();
    $i.clear();
    Vi(pe.undo, {
      kind: "save",
      beforeSavedDocument: beforeSavedDocument,
      afterSavedDocument: clone(value3.document),
    });
    pe.redo = [];
    const value4 = ft.find((value5) => value5.id === h.projectId);
    if (value4) {
      value4.name = h.document.name;
    }
    const element = Le.selectedOptions[0];
    if (element) {
      element.textContent = h.document.name;
    }
    oe(Le);
    if (documentSignature(value3.document) !== value2) {
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
async function FE(value, value2) {
  const document =
    value2 === "undo" ? value.beforeSavedDocument : value.afterSavedDocument;
  const globalPopupsDirty =
    documentSignature(document.customPopups || []) !==
    documentSignature(Ke.customPopups || []);
  const document2 = clone(h.document);
  const value3 = W.value;
  const value4 = await J("/projects/" + h.projectId + "/draft", {
    method: "PUT",
    body: JSON.stringify({
      revision: h.revision,
      globalPopupRevision: h.globalPopupRevision,
      globalPopupsDirty: globalPopupsDirty,
      document: document,
    }),
  });
  Ke = clone(value4.document);
  Ai = documentSignature(value4.document);
  if (!globalPopupsDirty) {
    document2.customPopups = clone(value4.document.customPopups || []);
  }
  h = {
    ...value4,
    document: document2,
  };
  qr(value3);
  hn();
}
async function ow(value) {
  await Cr.catch(() => {});
  if (pe.busy || !h) {
    return;
  }
  const value2 = value === "undo" ? pe.undo : pe.redo;
  const value3 = value === "undo" ? pe.redo : pe.undo;
  const value4 = value2.pop();
  if (value4) {
    pe.busy = true;
    Xn();
    ki.clear();
    Mi.clear();
    Oi.clear();
    Bi.clear();
    $i.clear();
    try {
      if (value4.kind === "save") {
        await FE(value4, value);
        Vi(value3, value4);
      } else {
        const value5 = Uc();
        const list = Array.isArray(value4.selectedComponentIds)
          ? value4.selectedComponentIds.filter((value6) =>
              findComponent(value4.document, value6),
            )
          : [];
        componentId = findComponent(value4.document, value4.selectedComponentId)
          ? value4.selectedComponentId
          : list[0] || null;
        bag = new Set(list.length ? list : componentId ? [componentId] : []);
        we = componentId;
        await vt(value4.document, value4.selectedPath, {
          recordHistory: false,
        });
        Vi(value3, value5);
      }
    } catch (error) {
      Vi(value2, value4);
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
  const value2 = to.open && !ut.hidden;
  if (!value || (!Xe && !value2)) {
    ut.elements.name.value = ie.name || "Home Assistant";
    ut.elements.baseUrl.value = ie.baseUrl || "";
    ut.elements.accessToken.value = "";
    ut.elements.accessToken.placeholder = ie.hasToken
      ? "已加密保存，留空则保留原 Token"
      : "输入 Long-Lived Access Token";
    ut.elements.verifyTls.checked = ie.verifyTls !== false;
  }
  const value3 = !ie.connected && !!ie.lastError;
  us.classList.toggle("connected", ie.connected);
  us.classList.toggle("error", value3);
  us.querySelector("span").textContent = ie.connected
    ? ("HA 已连接 · " + (ie.version || "")).trim()
    : ie.lastError
      ? "HA 连接异常"
      : ie.configured
        ? "HA 重连中"
        : "HA 未配置";
  Hm.disabled = !ie.configured || !ie.baseUrl;
  Wi();
}
async function VE() {
  const value = await J("/ha/sync/status");
  Io = value;
  const value2 = value.counts || {
    entities: 0,
    devices: 0,
    areas: 0,
  };
  ZC.textContent = value.configured
    ? value.connected
      ? "已连接并实时同步"
      : value.status === "error"
        ? "连接异常"
        : "正在连接或同步"
    : "尚未配置";
  QC.textContent =
    "实体 " +
    value2.entities +
    " · 设备 " +
    value2.devices +
    " · 区域 " +
    value2.areas;
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
  const value3 = JSON.stringify([
    Number.isFinite(Number(value.catalogRevision))
      ? Number(value.catalogRevision)
      : value.lastFullSyncAt || "",
    Number(value2.entities || 0),
    Number(value2.devices || 0),
    Number(value2.areas || 0),
  ]);
  if ((value.connected || value.status === "connected") && value3 !== Ti) {
    const value4 = Ti;
    Ti = value3;
    try {
      await jc({
        afterCurrent: true,
      });
    } catch (error) {
      if (Ti === value3) {
        Ti = value4;
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
  const value2 = Io?.counts || {
    entities: 0,
    devices: 0,
    areas: 0,
  };
  const value3 = !!ie.connected || !!Io?.connected;
  const value4 = !value3 && (!!ie.lastError || !!Io?.lastError);
  Cm.classList.toggle("connected", value3);
  Cm.classList.toggle("error", value4);
  nS.textContent = ie.name || "Home Assistant";
  Sm.textContent = value3
    ? "已连接并实时同步"
    : value4
      ? "连接异常"
      : "正在重连";
  xm.textContent = ie.baseUrl || "—";
  xm.title = ie.baseUrl || "";
  oS.textContent = ie.version || "未知";
  iS.textContent =
    "实体 " +
    value2.entities +
    " · 设备 " +
    value2.devices +
    " · 区域 " +
    value2.areas;
  Nm.hidden = !value4;
  Nm.textContent = (value4 && (ie.lastError || Io?.lastError)) || "";
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
  return new Promise((value2) => window.setTimeout(value2, value));
}
async function Ri({ preserveForm = true } = {}) {
  return (
    yr ||
    ((yr = Promise.all([
      zE({
        preserveForm: preserveForm,
      }),
      VE(),
    ]).finally(() => {
      yr = null;
    })),
    yr)
  );
}
async function jE(value = 30000) {
  const value2 = Date.now() + value;
  while (Date.now() < value2) {
    await Ri({
      preserveForm: false,
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
  const value2 = new FormData(ut);
  const value3 = String(value2.get("accessToken") || "").trim();
  if (value && !value3) {
    throw new Error("测试连接时请输入 Home Assistant Token。");
  }
  return {
    name: String(value2.get("name") || "").trim(),
    baseUrl: String(value2.get("baseUrl") || "").trim(),
    accessToken: value3 || null,
    verifyTls: value2.get("verifyTls") === "on",
  };
}
function Yc(value = be) {
  const value2 =
    Fn.find((value4) => value4.id === "ui.base")?.dashboardTemplates || [];
  be =
    value === "" || value2.some((value4) => value4.id === value)
      ? value
      : value2[0]?.id || "";
  const value3 = [
    {
      id: "",
      name: "空白仪表盘",
      description: "使用栖光 UI 创建空白画布，不预置页面、控件或弹窗。",
      previewUrls: [],
      previewLabels: [],
      canvasWidth: null,
      canvasHeight: null,
    },
    ...value2.map((value4) => ({
      id: value4.id,
      name: value4.name,
      description: value4.description + " · v" + value4.version,
      previewUrls: value4.previewUrls || [],
      previewLabels: value4.previewLabels || [],
      canvasWidth: Number(value4.canvasWidth || 2778),
      canvasHeight: Number(value4.canvasHeight || 1940),
    })),
  ];
  Nl.replaceChildren(
    ...value3.map((value4) => {
      const value5 = document.createElement("div");
      value5.className =
        "project-template-option" + (value4.id === be ? " active" : "");
      value5.dataset.projectTemplateId = value4.id;
      value5.dataset.previewUrls = JSON.stringify(value4.previewUrls);
      value5.dataset.previewLabels = JSON.stringify(value4.previewLabels);
      value5.dataset.previewIndex = "0";
      value5.setAttribute("role", "radio");
      value5.setAttribute("aria-checked", String(value4.id === be));
      value5.tabIndex = 0;
      const value6 = document.createElement("div");
      value6.className =
        "project-template-carousel" +
        (value4.previewUrls.length ? "" : " blank");
      if (value4.previewUrls.length) {
        const value7 = document.createElement("button");
        value7.type = "button";
        value7.className = "project-template-preview-open";
        value7.dataset.projectPreviewAction = "open";
        value7.title = "点击放大预览";
        const value8 = document.createElement("img");
        value8.src = value4.previewUrls[0];
        value8.alt = value4.previewLabels[0] || value4.name + "预览 1";
        value8.loading = "eager";
        value7.append(value8);
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
        const value9 = document.createElement("div");
        value9.className = "project-template-carousel-meta";
        const element5 = document.createElement("strong");
        element5.textContent = value4.previewLabels[0] || "栖光预览";
        const element6 = document.createElement("span");
        element6.textContent = "1 / " + value4.previewUrls.length;
        value9.append(element5, element6);
        value6.append(value7, element3, element4, value9);
      } else {
        value6.replaceChildren(
          ...Array.from(
            {
              length: 4,
            },
            () => document.createElement("i"),
          ),
        );
      }
      const element = document.createElement("strong");
      element.textContent = value4.name;
      const element2 = document.createElement("span");
      element2.textContent = value4.description;
      value5.append(value6, element, element2);
      return value5;
    }),
  );
  ro.hidden = false;
  if (At === "create") {
    const value4 = value3.find((value6) => value6.id === be);
    Qi.elements.name.value = value4?.id ? value4.name : "我的仪表盘";
    const value5 = !!value4?.id;
    ot.readOnly = value5;
    it.readOnly = value5;
    ot.value = String(value5 ? value4.canvasWidth : fr);
    it.value = String(value5 ? value4.canvasHeight : gr);
    ro.classList.toggle("fixed", value5);
    ro.classList.remove("name-only");
    Om.textContent = value5
      ? "栖光使用固定画布分辨率，创建时会完整保留页面布局与比例。"
      : "编辑器和仪表盘将共用该分辨率与比例，显示时只做等比缩放。";
    Ur();
    Lp(value5);
  }
}
function aw(value) {
  try {
    return {
      urls: JSON.parse(value.dataset.previewUrls || "[]"),
      labels: JSON.parse(value.dataset.previewLabels || "[]"),
    };
  } catch {
    return {
      urls: [],
      labels: [],
    };
  }
}
function qE(value, value2) {
  const { urls: value3, labels: value4 } = aw(value);
  if (!value3.length) {
    return;
  }
  const value5 =
    ((Number(value2) % value3.length) + value3.length) % value3.length;
  value.dataset.previewIndex = String(value5);
  const element = value.querySelector(".project-template-preview-open img");
  const element2 = value.querySelector(
    ".project-template-carousel-meta strong",
  );
  const element3 = value.querySelector(".project-template-carousel-meta span");
  if (element) {
    element.src = value3[value5];
    element.alt = value4[value5] || "栖光预览 " + (value5 + 1);
  }
  if (element2) {
    element2.textContent = value4[value5] || "栖光预览";
  }
  if (element3) {
    element3.textContent = value5 + 1 + " / " + value3.length;
  }
}
function Gr() {
  if (To.length) {
    gt = ((gt % To.length) + To.length) % To.length;
    km.src = To[gt];
    km.alt = Su[gt] || "栖光预览 " + (gt + 1);
    NS.textContent = Su[gt] || "栖光预览";
    ES.textContent = gt + 1 + " / " + To.length;
  }
}
function GE(value) {
  const { urls: value2, labels: value3 } = aw(value);
  if (value2.length) {
    To = value2;
    Su = value3;
    gt = Number(value.dataset.previewIndex || 0);
    Gr();
    Ko.showModal();
  }
}
function Ep(value = "create") {
  At = value;
  const value2 = value === "edit";
  const value3 = value === "resize";
  Qi.reset();
  vS.textContent = value3
    ? "RESIZE DASHBOARD"
    : value2
      ? "EDIT PROJECT"
      : "NEW PROJECT";
  wS.textContent = value3
    ? "修改仪表盘分辨率"
    : value2
      ? "修改仪表盘"
      : "创建仪表盘项目";
  xl.textContent = value3 ? "应用修改" : value2 ? "保存修改" : "创建项目";
  Qi.elements.name.value =
    value2 || value3 ? h?.document?.name || "" : "我的仪表盘";
  xS.hidden = value2 || value3;
  ot.readOnly = false;
  it.readOnly = false;
  Bm.checked = false;
  PS.hidden = !value3;
  ro.classList.remove("fixed", "name-only");
  if (!value2 && !value3) {
    fr = 2778;
    gr = 1940;
    sn = false;
    hr = 2778;
    br = 1940;
    ot.value = "2778";
    it.value = "1940";
    Ur();
    Yc("dwell-light");
  } else if (value2) {
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
    numeric2 <= 0
  ) {
    Mm.textContent = "等待输入有效分辨率";
    return;
  }
  const value = !be && sn ? hr : numeric;
  const value2 = !be && sn ? br : numeric2;
  const value3 = greatestCommonDivisor(value, value2);
  Mm.textContent = value / value3 + " : " + value2 / value3;
}
function Lp(value = !!be) {
  const value2 = value || sn;
  ta.disabled = value;
  ta.setAttribute("aria-pressed", String(value2));
  ta.classList.toggle("locked", value2);
  AS.textContent = value ? "固定" : value2 ? "已锁定" : "锁定";
  ta.title = value
    ? "栖光画布使用固定比例"
    : value2
      ? "点击解锁画布比例"
      : "锁定当前画布比例";
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
      let rounded = Math.round((numeric3 * numeric2) / numeric);
      if (rounded < 240 || rounded > 4320) {
        rounded = Math.max(240, Math.min(4320, rounded));
        numeric3 = Math.max(
          320,
          Math.min(7680, Math.round((rounded * numeric) / numeric2)),
        );
        ot.value = String(numeric3);
      }
      it.value = String(rounded);
    } else {
      let numeric3 = Number(it.value);
      if (!Number.isInteger(numeric3) || numeric3 < 240 || numeric3 > 4320) {
        return;
      }
      let rounded = Math.round((numeric3 * numeric) / numeric2);
      if (rounded < 320 || rounded > 7680) {
        rounded = Math.max(320, Math.min(7680, rounded));
        numeric3 = Math.max(
          240,
          Math.min(4320, Math.round((rounded * numeric2) / numeric)),
        );
        it.value = String(numeric3);
      }
      ot.value = String(rounded);
    }
  }
}
function UE(value, value2, value3) {
  kS.textContent =
    "当前分辨率为 " +
    value2 +
    " × " +
    value3 +
    "，预计有 " +
    value +
    " 个控件会部分或全部位于画布范围之外。";
  return new Promise((value4) => {
    Cu = value4;
    ws.showModal();
  });
}
function Xc(value) {
  const value2 = Cu;
  Cu = null;
  if (ws.open) {
    ws.close();
  }
  value2?.(value);
}
function sw(value = "create") {
  if (!h) {
    return;
  }
  xu = value;
  const value2 = value === "rename";
  Cs.reset();
  $S.textContent = value2 ? "EDIT PAGE" : "NEW PAGE";
  FS.textContent = value2 ? "重命名页面" : "新建页面";
  El.textContent = value2 ? "保存修改" : "创建页面";
  Cs.elements.name.value = (value2 && Je()?.name) || "";
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
  const value2 = {
    UNACTIVATED: "尚未激活",
    ACTIVE: "授权有效",
    CONNECTION_WARNING: "授权连接异常",
    STARTUP_VALIDATION_REQUIRED: "授权店未连接",
    LEASE_EXPIRED: "租约已到期",
    INSTANCE_MISMATCH: "实例不匹配",
    INVALID: "租约无效",
    DEACTIVATED: "授权已停用",
    REVOKED: "授权已撤销",
  };
  const value3 = value?.status || "UNACTIVATED";
  const value4 = value3 === "ACTIVE";
  const value5 = ["CONNECTION_WARNING", "STARTUP_VALIDATION_REQUIRED"].includes(
    value3,
  );
  const value6 = [
    "LEASE_EXPIRED",
    "INSTANCE_MISMATCH",
    "INVALID",
    "REVOKED",
  ].includes(value3);
  Ji.classList.toggle("connected", value4);
  Ji.classList.toggle("warning", value5);
  Ji.classList.toggle("error", value6);
  Ji.querySelector("span").textContent =
    !value?.required && value3 === "UNACTIVATED"
      ? "授权 · 开发模式"
      : value2[value3] || "授权状态";
  YC.className = value4
    ? "connected"
    : value5
      ? "warning"
      : value6
        ? "error"
        : "";
  XC.textContent = value2[value3] || value3;
  const list = Array.isArray(value?.products)
    ? value.products
        .map((value7) => String(value7?.name || "").trim())
        .filter(Boolean)
    : [];
  KC.textContent = value?.activationCodeId
    ? list.length
      ? list.join(" · ")
      : "基础版"
    : value?.required
      ? "尚未激活"
      : "开发模式";
  wm.hidden = !value?.lastError;
  wm.textContent = value?.lastError || "";
  _o.hidden = ![
    "UNACTIVATED",
    "DEACTIVATED",
    "INVALID",
    "INSTANCE_MISMATCH",
    "REVOKED",
  ].includes(value3);
}
async function Kc() {
  const value = await J("/license/status");
  if (value?.required && !value.allowed) {
    window.location.replace("/license");
    return value;
  }
  const value2 = JSON.stringify([...(value?.features || [])].sort());
  const value3 = zu !== null && zu !== value2;
  zu = value2;
  const value4 = h ? Tc(jt(h.document)) : null;
  const allowed = new Set(Array.isArray(value?.features) ? value.features : []);
  if (
    value?.required &&
    value4?.featureCode &&
    !allowed.has(value4.featureCode)
  ) {
    const value5 =
      "当前授权已不再包含“" + value4.name + "”，该仪表盘已停止显示和编辑。";
    x?.destroy();
    x = null;
    Do();
    h = null;
    qt();
    Ru(false);
    const value6 = document.createElement("div");
    value6.className = "canvas-message";
    const element = document.createElement("strong");
    element.textContent = value5;
    value6.append(element);
    Dt.replaceChildren(value6);
    if (Du !== value4.id) {
      Du = value4.id;
      onError(new Error(value5));
    }
  }
  if (value3) {
    await Promise.all([
      gn({
        refreshInspector: false,
      }),
      Ir(),
    ]);
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
    new FormData(_o).get("activationCode") || "",
  ).trim();
  const email = String(new FormData(_o).get("email") || "").trim();
  element.disabled = true;
  D(ds, "正在绑定实例并获取签名租约…");
  try {
    const value = await J("/license/activate", {
      method: "POST",
      body: JSON.stringify({
        activationCode: activationCode,
        email: email,
      }),
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
    preserveForm: false,
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
      body: JSON.stringify(iw(true)),
    });
    D(
      no,
      "连接成功：" +
        (value.locationName || "Home Assistant") +
        " · " +
        (value.version || "未知版本"),
      "success",
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
      body: JSON.stringify(iw(false)),
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
    String(new FormData(ps).get("confirmation") || "").trim() !== "删除连接"
  ) {
    D(ms, "请输入“删除连接”确认。", "error");
    return;
  }
  const element = ps.querySelector('button[type="submit"]');
  element.disabled = true;
  D(ms, "正在断开连接并清除同步目录…");
  try {
    await J("/ha/connection", {
      method: "DELETE",
    });
    oo.close();
    ie = null;
    Io = null;
    Xe = false;
    await Ri({
      preserveForm: false,
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
  const value2 = value.target.closest("[data-ui-pack-id]");
  if (!value2 || value2.disabled || !h) {
    return;
  }
  const value3 = Fn.find((value4) => value4.id === value2.dataset.uiPackId);
  if (!value3?.allowed) {
    D(hs, "当前授权尚未解锁该 UI 方案。", "error");
    return;
  }
  value2.disabled = true;
  D(hs, "正在加载并应用整套 UI…");
  try {
    await ensureUiPackRuntime(value3);
    await L((value4) => applyUiPackToDocument(value4, value3));
    io.close();
  } catch (error) {
    D(hs, error.message, "error");
    value2.disabled = false;
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
    "[data-project-preview-action]",
  )?.dataset.projectPreviewAction;
  if (projectPreviewAction) {
    event.stopPropagation();
    if (
      projectPreviewAction === "open" &&
      (value.dataset.projectTemplateId || "") !== be
    ) {
      be = value.dataset.projectTemplateId || "";
      Yc(be);
    } else if (projectPreviewAction === "open") {
      GE(value);
    } else {
      qE(
        value,
        Number(value.dataset.previewIndex || 0) +
          (projectPreviewAction === "next" ? 1 : -1),
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
    numeric2 > 4320
  ) {
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
    const value2 =
      canvasWidth !== numeric || canvasHeight !== numeric2
        ? countComponentsOutsideCanvas(h.document, canvasWidth, canvasHeight)
        : 0;
    if (value2 > 0 && !(await UE(value2, canvasWidth, canvasHeight))) {
      return;
    }
  }
  xl.disabled = true;
  D(
    ea,
    At === "resize"
      ? "正在调整整个仪表盘…"
      : At === "edit"
        ? "正在保存仪表盘名称…"
        : be
          ? "正在套用栖光整套模板…"
          : "正在创建空白仪表盘…",
  );
  try {
    if (At === "resize") {
      const value2 = resizeDashboardDocument(
        h.document,
        canvasWidth,
        canvasHeight,
        {
          lockContent: lockContent,
        },
      );
      value2.name = name;
      await vt(value2);
      Yt.close();
    } else if (At === "edit") {
      const value2 = clone(h.document);
      value2.name = name;
      await vt(value2);
      Yt.close();
    } else {
      const value2 = {
        name: name,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        uiPackId: "ui.base",
      };
      if (be) {
        value2.templateId = be;
      }
      const value3 = await J("/projects", {
        method: "POST",
        body: JSON.stringify(value2),
      });
      Yt.close();
      await _c(value3.id);
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
  const projectAction = value.target.closest("[data-project-action]")?.dataset
    .projectAction;
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
      const allowed = new Set(ft.map((value3) => value3.name));
      let name2 = name + " 副本";
      let value2 = 2;
      while (allowed.has(name2)) {
        name2 = name + " 副本 " + value2++;
      }
      try {
        const value3 = await J("/projects/" + h.projectId + "/duplicate", {
          method: "POST",
          body: JSON.stringify({
            name: name2,
          }),
        });
        await _c(value3.id);
      } catch (error) {
        onError(error);
      }
      return;
    }
    if (projectAction === "delete") {
      const value2 = ft.find((value3) => value3.id === h.projectId);
      if (!value2) {
        return;
      }
      xs.reset();
      XS.textContent = "“" + value2.name + "”";
      St.dataset.projectId = value2.id;
      St.dataset.projectName = value2.name;
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
        confirmation: confirmation,
      }),
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
  const value2 = W.value;
  El.disabled = true;
  D(Ll, xu === "rename" ? "正在保存页面名称…" : "正在创建页面…");
  try {
    if (xu === "rename") {
      const value3 = document.pages.find((value4) => value4.path === value2);
      value3.name = name;
      await vt(document, value2);
    } else {
      const value3 = {
        id: newId("page"),
        name: name,
        path: uniquePagePath(h?.document?.pages, name),
        sharedComponentIds: document.sharedComponents.map(
          (sharedComponentIds) => sharedComponentIds.id,
        ),
        components: [],
      };
      const count = Math.max(
        0,
        document.pages.findIndex((value4) => value4.path === value2),
      );
      document.pages.splice(count + 1, 0, value3);
      await vt(document, value3.path);
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
  const value2 = componentLabel(component);
  const label = String(new FormData($m).get("name") || "")
    .trim()
    .slice(0, 128);
  if (!label) {
    D(Dm, "请输入组合名称。", "error");
    return;
  }
  if (label === value2) {
    Ct.close();
    return;
  }
  L((value3) => {
    const component2 = findComponent(value3, value)?.component;
    if (component2?.type === "group") {
      component2.properties = {
        ...(component2.properties || {}),
        label: label,
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
  const value2 = Je();
  if (!pageAction || !value2 || !h) {
    return;
  }
  pn();
  if (pageAction === "rename") {
    sw("rename");
    return;
  }
  const value3 = clone(h.document);
  const value4 = value3.pages.findIndex(
    (value5) => value5.path === value2.path,
  );
  if (pageAction === "default") {
    if (value3.defaultPagePath === value2.path) {
      return;
    }
    value3.defaultPagePath = value2.path;
    try {
      await vt(value3, value2.path);
      await Np();
    } catch (error) {
      onError(error);
    }
    return;
  }
  if (pageAction === "duplicate") {
    const value5 = clonePageWithFreshIds(
      value2,
      value2.name + " 副本",
      h.document.pages,
    );
    value3.pages.splice(value4 + 1, 0, value5);
    try {
      await vt(value3, value5.path);
    } catch (error) {
      onError(error);
    }
    return;
  }
  if (pageAction === "delete") {
    Xt.dataset.pagePath = value2.path;
    ZS.textContent = "“" + value2.name + "”";
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
  const value2 = document.pages.findIndex((value5) => value5.path === pagePath);
  if (value2 < 0) {
    D(Es, "页面已经不存在，请刷新后重试。", "error");
    return;
  }
  const value3 = document.pages[value2];
  document.pages.splice(value2, 1);
  const target =
    document.pages[Math.max(0, value2 - 1)]?.path ||
    document.pages[0]?.path ||
    null;
  const value4 = document.pages.find((value5) => value5.path === target);
  if (document.defaultPagePath === pagePath) {
    document.defaultPagePath = target;
  }
  const fn9 = (value5) => {
    for (const component of value5 || []) {
      component.properties = {
        ...(component.properties || {}),
      };
      if (
        component.type === "navigation-button" &&
        component.properties.targetPage === pagePath
      ) {
        if (
          !component.properties.mainText ||
          component.properties.mainText === "页面导航" ||
          component.properties.mainText === value3?.name
        ) {
          component.properties.mainText = value4?.name || "页面导航";
        }
        const value6 = String(pagePath).replace(/[-_]+/g, " ").toUpperCase();
        if (
          !component.properties.secondaryText ||
          component.properties.secondaryText === "NAVIGATION" ||
          component.properties.secondaryText === value6
        ) {
          component.properties.secondaryText = target
            ? String(target).replace(/[-_]+/g, " ").toUpperCase()
            : "NAVIGATION";
        }
        if (target) {
          component.properties.targetPage = target;
        } else {
          delete component.properties.targetPage;
        }
      }
      component.actions = {
        ...(component.actions || {}),
      };
      for (const value6 of ["tap", "doubleTap", "hold"]) {
        if (
          component.actions[value6]?.type === "navigate" &&
          component.actions[value6]?.target === pagePath
        ) {
          if (component.type === "navigation-button" && target) {
            component.actions[value6] = {
              type: "navigate",
              target: target,
            };
          } else {
            delete component.actions[value6];
          }
        }
      }
      fn9(component.children);
    }
  };
  fn9(document.sharedComponents);
  for (const value5 of document.pages) {
    fn9(value5.components);
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
  const value2 = Ou;
  const componentAction = value.target.closest("[data-component-action]")
    ?.dataset.componentAction;
  const value3 = value.target.closest("[data-label-color]");
  if (!value2 || (!componentAction && !value3)) {
    return;
  }
  const value4 = bag.has(value2) ? [...bag] : [value2];
  _u();
  if (componentAction === "copy") {
    f0(value4, value2);
    return;
  }
  if (componentAction === "group") {
    IN(value4);
    return;
  }
  if (componentAction === "ungroup") {
    TN(value2);
    return;
  }
  if (componentAction === "rename-group") {
    AN(value2);
    return;
  }
  if (componentAction === "copy-to-page") {
    DN(value4);
    return;
  }
  if (componentAction === "visibility") {
    const value5 = value4
      .map((value6) => findComponent(h?.document, value6)?.component)
      .filter(Boolean)
      .map((value6) => value6.style?.visible !== false);
    if (
      value5.length !== value4.length ||
      !value5.length ||
      !value5.every((value6) => value6 === value5[0])
    ) {
      return;
    }
    u0(value4, !value5[0]);
    return;
  }
  if (componentAction === "delete") {
    h0(value4);
    return;
  }
  if (value3) {
    zN(value4, value3.dataset.labelColor);
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
  const value2 = co.value;
  const value3 = vn.value === "other";
  if (!!h && !!value.length && !!value2) {
    lo.disabled = true;
    D(wn, "正在复制控件…");
    try {
      if (value3) {
        const projectId = ei.value;
        if (!projectId || !kt || kt.projectId !== projectId) {
          throw new Error("目标仪表盘尚未加载完成，请稍后重试。");
        }
        const document = clone(kt.document);
        const scaleMode = Ls.hidden ? "none" : Ml.elements.copyScaleMode.value;
        let value7 = 0;
        const value8 = copyComponentsAcrossDocuments(
          h.document,
          document,
          value,
          value2,
          {
            cloneValue: clone,
            createId: () => newId("component"),
            componentLabel: componentLabel,
            scaleMode: scaleMode,
            onInvalidAction: () => {
              value7 += 1;
            },
          },
        );
        if (!value8.length) {
          throw new Error("目标页面或源控件已发生变化，请重新操作。");
        }
        const value9 = await J(
          "/projects/" + encodeURIComponent(projectId) + "/draft",
          {
            method: "PUT",
            body: JSON.stringify({
              revision: kt.revision,
              globalPopupRevision: kt.globalPopupRevision,
              globalPopupsDirty: false,
              document: document,
            }),
          },
        );
        kt = value9;
        const value10 = ft.find((value14) => value14.id === projectId);
        if (value10) {
          value10.draftRevision = value9.revision;
        }
        const value11 = value10?.name || "目标仪表盘";
        const value12 = co.selectedOptions[0]?.textContent || "目标区域";
        const value13 = value7
          ? "（已清理 " + value7 + " 个目标仪表盘不存在的跳转或弹窗动作）"
          : "";
        at.close();
        m0(
          "已复制 " +
            value8.length +
            " 个控件到“" +
            value11 +
            "”的“" +
            value12 +
            "”，并已保存" +
            value13 +
            "。",
          {
            projectId: projectId,
            pagePath:
              value2 === "shared"
                ? kt.document.pages?.[0]?.path
                : value2.replace(/^page:/, ""),
            scope: value2 === "shared" ? "shared" : "page",
          },
        );
        return;
      }
      const value4 = clone(h.document);
      const value5 = copyComponentsToTarget(value4, value, value2, {
        cloneValue: clone,
        createId: () => newId("component"),
        componentLabel: componentLabel,
      });
      if (!value5.length) {
        throw new Error("目标页面或源控件已发生变化，请重新操作。");
      }
      componentId = value5[0].id;
      bag = new Set(value5.map((value7) => value7.id));
      we = value5[0].id;
      const pagePath =
        value2 === "shared" ? W.value : value2.replace(/^page:/, "");
      const value6 = co.selectedOptions[0]?.textContent || "目标区域";
      await vt(value4, pagePath);
      at.close();
      m0("已复制 " + value5.length + " 个控件到“" + value6 + "”，并已保存。", {
        projectId: h.projectId,
        pagePath: pagePath,
        scope: value2 === "shared" ? "shared" : "page",
      });
    } catch (error) {
      D(wn, error.message, "error");
    } finally {
      if (!value3 || !wn.classList.contains("success")) {
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
  bag = new Set([...bag].filter((value2) => !allowed.has(value2)));
  if (allowed.has(componentId)) {
    componentId = bag.values().next().value || null;
  }
  if (allowed.has(we)) {
    we = componentId;
  }
  L((value2) => {
    for (const value3 of value) {
      kc(value2, value3);
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
      trim: true,
    },
  ],
  [
    af,
    {
      componentType: "icon-button-effect",
      property: "label",
      trim: true,
    },
  ],
  [
    Sf,
    {
      componentType: "title-button",
      property: "label",
      trim: true,
    },
  ],
  [
    Ef,
    {
      componentType: "title-button",
      property: "mainText",
      trim: false,
    },
  ],
  [
    Os,
    {
      componentType: "title-button",
      property: "secondaryText",
      trim: false,
      getValue: () => Os.value + "\n" + Bs.value,
    },
  ],
  [
    Bs,
    {
      componentType: "title-button",
      property: "secondaryText",
      trim: false,
      getValue: () => Os.value + "\n" + Bs.value,
    },
  ],
  [
    ng,
    {
      componentType: "light-statistics",
      property: "label",
      trim: true,
    },
  ],
  [
    og,
    {
      componentType: "light-statistics",
      property: "title",
      trim: false,
    },
  ],
  [
    xg,
    {
      componentType: "icon-button",
      componentTypes: ["icon-button", "device-button", "presence-sensor"],
      property: "label",
      trim: true,
    },
  ],
  [
    Sd,
    {
      componentType: "icon-button",
      componentTypes: ["icon-button", "device-button", "presence-sensor"],
      property: "mainText",
      trim: false,
    },
  ],
  [
    xd,
    {
      componentType: "icon-button",
      componentTypes: ["icon-button", "device-button", "presence-sensor"],
      property: "secondaryText",
      trim: false,
    },
  ],
  [
    mb,
    {
      componentType: "vacuum-map",
      property: "label",
      trim: true,
    },
  ],
  [
    gb,
    {
      componentType: "camera",
      property: "label",
      trim: true,
    },
  ],
  [
    wh,
    {
      componentType: "air-conditioner",
      property: "label",
      trim: true,
    },
  ],
  [
    $h,
    {
      componentType: "air-conditioner",
      property: "mainText",
      trim: false,
    },
  ],
  [
    jh,
    {
      componentType: "air-conditioner",
      property: "secondaryText",
      trim: false,
    },
  ],
  [
    Eb,
    {
      componentType: "time",
      property: "label",
      trim: true,
    },
  ],
  [
    Ob,
    {
      componentType: "date",
      property: "label",
      trim: true,
    },
  ],
  [
    Ub,
    {
      componentType: "weather",
      property: "label",
      trim: true,
    },
  ],
  [
    ly,
    {
      componentType: "line-chart",
      property: "label",
      trim: true,
    },
  ],
  [
    vy,
    {
      componentType: "panel-frame",
      property: "label",
      trim: true,
    },
  ],
  [
    Cy,
    {
      componentType: "panel-frame",
      property: "mainText",
      trim: false,
    },
  ],
  [
    Py,
    {
      componentType: "panel-frame",
      property: "secondaryText",
      trim: false,
    },
  ],
  [
    pc,
    {
      componentType: "navigation-button",
      property: "label",
      trim: true,
    },
  ],
  [
    au,
    {
      componentType: "navigation-button",
      property: "mainText",
      trim: false,
    },
  ],
  [
    ru,
    {
      componentType: "navigation-button",
      property: "secondaryText",
      trim: false,
    },
  ],
]);
const Jc = new WeakMap();
for (const [t, e] of lw) {
  t.addEventListener("focus", () => {
    if (!!h && !!componentId) {
      Jc.set(t, {
        componentId: componentId,
        before: Uc(),
        historyRecorded: false,
      });
    }
  });
  t.addEventListener("input", () => {
    if (!h || !componentId) {
      return;
    }
    const value = findComponent(h.document, componentId);
    const value2 = e.componentTypes || [e.componentType];
    if (!value?.component || !value2.includes(value.component.type)) {
      return;
    }
    const value3 = e.getValue ? e.getValue() : t.value;
    const label = e.trim ? value3.trim() : value3;
    if (String(value.component.properties?.[e.property] || "") === label) {
      return;
    }
    let value4 = Jc.get(t);
    if (!value4 || value4.componentId !== componentId) {
      value4 = {
        componentId: componentId,
        before: Uc(),
        historyRecorded: false,
      };
      Jc.set(t, value4);
    }
    if (!value4.historyRecorded) {
      Vi(pe.undo, value4.before);
      pe.redo = [];
      value4.historyRecorded = true;
    }
    value.component.properties = {
      ...(value.component.properties || {}),
      [e.property]: label,
    };
    if (e.property === "label") {
      _e();
      x?.previewComponentProperties(value.component.id, {
        label: label,
      });
      Ue?.previewComponentProperties(value.component.id, {
        label: label,
      });
    }
    if (e.componentType === "navigation-button" && e.property !== "label") {
      x?.previewComponentProperties(value.component.id, {
        [e.property]: label,
      });
    }
    if (e.componentType === "panel-frame" && e.property !== "label") {
      x?.previewComponentProperties(value.component.id, {
        [e.property]: label,
      });
    }
    if (e.componentType === "icon-button-effect" && e.property !== "label") {
      x?.previewComponentProperties(value.component.id, {
        [e.property]: label,
      });
    }
    if (
      [
        "title-button",
        "light-statistics",
        "icon-button",
        "air-conditioner",
      ].includes(e.componentType) &&
      e.property !== "label"
    ) {
      x?.previewComponentProperties(value.component.id, {
        [e.property]: label,
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
    const value2 = value.target.closest("[data-hidden-content-clickable]");
    if (value2 && componentId) {
      L((value6) => {
        const component = findComponent(value6, componentId)?.component;
        if (
          !!component &&
          !!["title-button", "device-button", "icon-button-effect"].includes(
            component.type,
          )
        ) {
          component.properties = {
            ...(component.properties || {}),
            hiddenContentClickable:
              value2.dataset.hiddenContentClickable === "on",
          };
        }
      });
      return;
    }
    const value3 = value.target.closest("[data-action-type]");
    const value4 = value3?.closest("[data-action-trigger]");
    const value5 = componentId;
    if (!value3 || !value4 || !value5 || value3.disabled) {
      return;
    }
    const type = ACTION_TYPES.includes(value3.dataset.actionType)
      ? value3.dataset.actionType
      : "none";
    const actionTrigger = value4.dataset.actionTrigger;
    if (["tap", "doubleTap", "hold"].includes(actionTrigger)) {
      L((value6) => {
        const component = findComponent(value6, value5)?.component;
        if (!component) {
          return;
        }
        const entityId = component.bindings?.entity?.entityId;
        const value7 = component.type === "light-statistics";
        const value8 = actionPopupData(component.actions?.[actionTrigger]);
        const popupSource =
          type === "more-info" && !entityId && value8.source === "current"
            ? (value6.customPopups || []).length
              ? "custom"
              : "entity"
            : value8.source;
        const data =
          type === "more-info"
            ? {
                popupSource: popupSource,
                ...(popupSource === "entity"
                  ? {
                      entityId: value8.entityId || le[0]?.entityId || "",
                    }
                  : {}),
                ...(popupSource === "custom"
                  ? {
                      popupId:
                        value8.popupId || value6.customPopups?.[0]?.id || "",
                    }
                  : {}),
              }
            : {};
        const value9 = component.actions?.[actionTrigger]?.type === "more-info";
        const target = component.actions?.[actionTrigger]?.target;
        const value10 =
          component.type === "navigation-button"
            ? component.properties?.targetPage
            : "";
        const pagePaths = new Set(value6.pages.map((value11) => value11.path));
        const target2 = pagePaths.has(target)
          ? target
          : pagePaths.has(value10)
            ? value10
            : W.value || value6.pages[0]?.path;
        const type2 =
          type === "none" ||
          componentActionIsSupported(
            component,
            type === "navigate"
              ? {
                  type: "navigate",
                  target: target2,
                }
              : type === "more-info"
                ? {
                    type: "more-info",
                    data: data,
                  }
                : {
                    type: type,
                  },
            {
              pagePaths: pagePaths,
              popupIds: new Set(
                (value6.customPopups || []).map((popupIds) => popupIds.id),
              ),
            },
          )
            ? type
            : "none";
        component.actions = {
          ...(component.actions || {}),
        };
        if (type2 === "none") {
          if (component.type === "camera" && actionTrigger === "tap") {
            component.actions[actionTrigger] = {
              type: "none",
            };
          } else {
            delete component.actions[actionTrigger];
          }
        } else if (type2 === "navigate") {
          component.actions[actionTrigger] = {
            type: "navigate",
            target: target2,
          };
        } else if (type2 === "more-info") {
          component.actions[actionTrigger] = {
            type: "more-info",
            data:
              component.actions?.[actionTrigger]?.type === "more-info"
                ? {
                    ...clone(component.actions[actionTrigger].data || {}),
                    ...data,
                  }
                : data,
          };
        } else {
          component.actions[actionTrigger] = {
            type: type2,
          };
        }
        if (
          !value7 &&
          type2 === "more-info" &&
          !value9 &&
          !component.properties?.relatedEntities &&
          relatedPopupContext(component, Fr(), Dr())
        ) {
          component.properties = {
            ...(component.properties || {}),
            relatedEntities: manualRelatedEntityConfig([]),
          };
        }
      });
    }
  });
  t.addEventListener("change", (value) => {
    const value2 = value.target.closest(
      "[data-popup-source], [data-popup-entity], [data-popup-custom]",
    );
    const value3 = value2?.closest("[data-action-trigger]");
    if (value2 && value3 && componentId) {
      const actionTrigger2 = value3.dataset.actionTrigger;
      L((value6) => {
        const component = findComponent(value6, componentId)?.component;
        if (
          !component ||
          !["tap", "doubleTap", "hold"].includes(actionTrigger2)
        ) {
          return;
        }
        const popupSource = value3.querySelector("[data-popup-source]").value;
        const data = {
          popupSource: popupSource,
        };
        if (popupSource === "entity") {
          data.entityId = value3.querySelector("[data-popup-entity]").value;
        }
        if (popupSource === "custom") {
          data.popupId = value3.querySelector("[data-popup-custom]").value;
        }
        component.actions = {
          ...(component.actions || {}),
          [actionTrigger2]: {
            type: "more-info",
            data: data,
          },
        };
      });
      return;
    }
    const element = value.target.closest("[data-action-target]");
    const value4 = element?.closest("[data-action-trigger]");
    const value5 = componentId;
    if (!element || !value4 || !value5) {
      return;
    }
    const actionTrigger = value4.dataset.actionTrigger;
    if (["tap", "doubleTap", "hold"].includes(actionTrigger)) {
      L((value6) => {
        const component = findComponent(value6, value5)?.component;
        if (
          !!component &&
          !!value6.pages.some((value7) => value7.path === element.value)
        ) {
          component.actions = {
            ...(component.actions || {}),
            [actionTrigger]: {
              type: "navigate",
              target: element.value,
            },
          };
          if (component.type === "navigation-button") {
            component.properties = {
              ...(component.properties || {}),
              targetPage: element.value,
            };
          }
        }
      });
    }
  });
  t.addEventListener("click", (value) => {
    const value2 = value.target.closest("[data-popup-preview]");
    const value3 = value2?.closest("[data-action-trigger]");
    const value4 = O();
    if (!value2 || !value3 || !value4 || value2.disabled) {
      return;
    }
    if (Te !== "edit") {
      onError(new Error("请切换到编辑模式后再预览弹窗。"));
      return;
    }
    const popupSource = value3.querySelector("[data-popup-source]").value;
    const data = {
      popupSource: popupSource,
    };
    if (popupSource === "entity") {
      data.entityId = value3.querySelector("[data-popup-entity]").value;
    }
    if (popupSource === "custom") {
      data.popupId = value3.querySelector("[data-popup-custom]").value;
    }
    try {
      jr().previewAction(value4, {
        type: "more-info",
        data: data,
      });
    } catch (error) {
      onError(error);
    }
  });
}
document.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-popup-entity-button]");
  if (value2) {
    const value5 = value2.closest("[data-action-trigger]");
    const value6 = value5?.querySelector("[data-popup-entity-menu]");
    if (!value5 || !value6) {
      return;
    }
    const hidden = value6.hidden;
    Wc(hidden ? value5 : null);
    value6.hidden = !hidden;
    value2.setAttribute("aria-expanded", String(hidden));
    if (hidden) {
      const element2 = value5.querySelector("[data-popup-entity-search]");
      element2.value = "";
      Rc(value5, "");
      Hc(value5);
      window.requestAnimationFrame(() =>
        element2.focus({
          preventScroll: true,
        }),
      );
    }
    return;
  }
  const value3 = value.target.closest("[data-popup-action-entity-id]");
  if (!value3) {
    return;
  }
  const value4 = value3.closest("[data-action-trigger]");
  const element = value4?.querySelector("[data-popup-entity]");
  if (!!value4 && !!element) {
    element.value = value3.dataset.popupActionEntityId;
    yp(value4);
    Wc();
    element.dispatchEvent(
      new Event("change", {
        bubbles: true,
      }),
    );
  }
});
document.addEventListener("input", (value) => {
  const element = value.target.closest("[data-popup-entity-search]");
  const value2 = element?.closest("[data-action-trigger]");
  if (!!element && !!value2) {
    Rc(value2, element.value);
    Hc(value2);
  }
});
lh.addEventListener("click", () => {
  const component = O();
  const value = component?.bindings?.entity?.entityId || "";
  if (component?.type === "icon-button" && !!value) {
    try {
      jr().showEntityDetails(component, {
        preview: true,
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
        preview: true,
      });
    } catch (error) {
      onError(error);
    }
  }
});
Km.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-image-layout]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const value4 = value2.dataset.imageLayout === "fill" ? "fill" : "free";
  const component = O();
  const value5 = component?.properties?.layoutMode === "fill" ? "fill" : "free";
  if (!!component && component.type === "image" && value5 !== value4) {
    L((value6) => {
      const component2 = findComponent(value6, value3)?.component;
      if (!component2 || component2.type !== "image") {
        return;
      }
      component2.properties = {
        ...(component2.properties || {}),
        fit: "contain",
      };
      component2.style = {
        ...(component2.style || {}),
      };
      if (value4 === "fill") {
        component2.properties.freeLayout = {
          position: clone(component2.position || {}),
          scale: clampNumber(Number(component2.style.scale || 1), 0.01, 5),
        };
        component2.properties.layoutMode = "fill";
        component2.position = {
          ...(component2.position || {}),
          x: 0,
          y: 0,
          width: Number(value6.canvas?.width || 2778),
          height: Number(value6.canvas?.height || 1940),
          rotation: 0,
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
          5,
        );
      } else {
        const width = Number(
          component2.properties.naturalWidth ||
            component2.position?.width ||
            100,
        );
        const height = Number(
          component2.properties.naturalHeight ||
            component2.position?.height ||
            100,
        );
        const numeric = Number(value6.canvas?.width || 2778);
        const numeric2 = Number(value6.canvas?.height || 1940);
        component2.position = {
          ...(component2.position || {}),
          x: (numeric - width) / 2,
          y: (numeric2 - height) / 2,
          width: width,
          height: height,
          rotation: 0,
        };
        component2.style.scale = 1;
      }
      delete component2.properties.freeLayout;
    });
  }
});
ia.addEventListener("input", (value) => {
  const value2 = O();
  if (!value2 || value2.type !== "image") {
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
  const numeric4 = Number(value2.position?.width || 100);
  const numeric5 = Number(value2.position?.height || 100);
  if (target === ca) {
    const value3 = clampNumber(numeric, 0, 100);
    x?.previewComponentProperties(value2.id, {
      opacity: value3 / 100,
    });
  } else if (target === mo) {
    const value3 = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(value2.id, {
      x: (numeric2 * value3) / 100 - numeric4 / 2,
    });
  } else if (target === fo) {
    const value3 = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(value2.id, {
      y: (numeric3 * value3) / 100 - numeric5 / 2,
    });
  } else if (target === Nn) {
    const value3 = clampNumber(numeric, 1, 500);
    x?.previewComponentTransform(value2.id, {
      scale: value3 / 100,
    });
  } else if (target === go) {
    const rotation = clampNumber(numeric, -360, 360);
    x?.previewComponentTransform(value2.id, {
      rotation: rotation,
    });
  }
});
ia.addEventListener("change", (value) => {
  const target = value.target;
  const value2 = componentId;
  if (!!value2 && !![Is, ca, mo, fo, Nn, go].includes(target)) {
    if (
      [ca, mo, fo, Nn, go].includes(target) &&
      (String(target.value).trim() === "" ||
        !Number.isFinite(Number(target.value)))
    ) {
      Z();
      return;
    }
    L((value3) => {
      const component = findComponent(value3, value2)?.component;
      if (!component || component.type !== "image") {
        return;
      }
      component.properties = {
        ...(component.properties || {}),
      };
      component.position = {
        ...(component.position || {}),
      };
      component.style = {
        ...(component.style || {}),
      };
      component.bindings = {
        ...(component.bindings || {}),
      };
      component.actions = {
        ...(component.actions || {}),
      };
      component.properties.fit = "contain";
      const numeric = Number(value3.canvas.width || 2778);
      const numeric2 = Number(value3.canvas.height || 1940);
      const numeric3 = Number(target.value);
      if (target === Is) {
        component.properties.label = target.value.trim();
      } else if (target === ca) {
        component.properties.opacity = clampNumber(numeric3, 0, 100) / 100;
      } else if (target === mo) {
        component.position.x =
          (numeric * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.width || 100) / 2;
      } else if (target === fo) {
        component.position.y =
          (numeric2 * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.height || 100) / 2;
      } else if (target === Nn) {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (target === go) {
        Gt(value3, value2, clampNumber(numeric3, -360, 360));
      }
    });
  }
});
const Ip = new Set([ua, pa, ma, fa, ga, ha]);
Rl.addEventListener("input", (value) => {
  const value2 = O();
  const target = value.target;
  if (!value2 || value2.type !== "floorplan-auto-diagram" || !Ip.has(target)) {
    return;
  }
  const numeric = Number(target.value);
  if (!Number.isFinite(numeric)) {
    return;
  }
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(value2.position?.width || 100);
  const numeric5 = Number(value2.position?.height || 100);
  if (target === ua) {
    x?.previewComponentTransform(value2.id, {
      x: (numeric2 * clampNumber(numeric, 0, 100)) / 100 - numeric4 / 2,
    });
  } else if (target === pa) {
    x?.previewComponentTransform(value2.id, {
      y: (numeric3 * clampNumber(numeric, 0, 100)) / 100 - numeric5 / 2,
    });
  } else if (target === ma) {
    x?.previewComponentTransform(value2.id, {
      width: (numeric2 * clampNumber(numeric, 0.1, 100)) / 100,
    });
  } else if (target === fa) {
    x?.previewComponentTransform(value2.id, {
      height: (numeric3 * clampNumber(numeric, 0.1, 100)) / 100,
    });
  } else if (target === ga) {
    x?.previewComponentTransform(value2.id, {
      scale: clampNumber(numeric, 1, 500) / 100,
    });
  } else if (target === ha) {
    x?.previewComponentTransform(value2.id, {
      rotation: clampNumber(numeric, -360, 360),
    });
  }
});
Rl.addEventListener("change", (value) => {
  const target = value.target;
  const value2 = componentId;
  if (!!value2 && !![Hl, da, ...Ip].includes(target)) {
    if (Ip.has(target) && !Number.isFinite(Number(target.value))) {
      Z();
      return;
    }
    L((value3) => {
      const component = findComponent(value3, value2)?.component;
      if (!!component && component.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {}),
        };
        component.position = {
          ...(component.position || {}),
        };
        component.style = {
          ...(component.style || {}),
        };
        if (target === Hl) {
          component.properties.label = target.value.trim();
        } else if (target === da) {
          component.properties.exportFolder = target.value.trim();
        } else {
          const numeric = Number(value3.canvas.width || 2778);
          const numeric2 = Number(value3.canvas.height || 1940);
          const numeric3 = Number(target.value);
          if (target === ua) {
            component.position.x =
              (numeric * clampNumber(numeric3, 0, 100)) / 100 -
              Number(component.position.width || 100) / 2;
          } else if (target === pa) {
            component.position.y =
              (numeric2 * clampNumber(numeric3, 0, 100)) / 100 -
              Number(component.position.height || 100) / 2;
          } else if (target === ma) {
            component.position.width =
              (numeric * clampNumber(numeric3, 0.1, 100)) / 100;
          } else if (target === fa) {
            component.position.height =
              (numeric2 * clampNumber(numeric3, 0.1, 100)) / 100;
          } else if (target === ga) {
            component.style.scale = clampNumber(numeric3, 1, 500) / 100;
          } else if (target === ha) {
            Gt(value3, value2, clampNumber(numeric3, -360, 360));
          }
        }
      }
    });
  }
});
Jm.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-floorplan-layout]");
  const value3 = componentId;
  if (!!value2 && !!value3) {
    L((value4) => {
      const component = findComponent(value4, value3)?.component;
      if (component?.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {}),
          layoutMode:
            value2.dataset.floorplanLayout === "fill" ? "fill" : "free",
        };
      }
    });
  }
});
function Yr(componentId, command, value = null) {
  const element = document.querySelector(
    '.hb-component[data-component-id="' +
      CSS.escape(componentId) +
      '"] .hb-floorplan-auto-diagram-preview',
  );
  if (element?.contentWindow) {
    element.contentWindow.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-camera",
        componentId: componentId,
        command: command,
        value: value,
      },
      window.location.origin,
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
      '"] .hb-floorplan-auto-diagram-preview',
  );
  if (element?.contentWindow) {
    element.contentWindow.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-floor",
        componentId: componentId,
        command: "set-floor",
        value: value,
      },
      window.location.origin,
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
    ".hb-floorplan-auto-diagram-loading",
  );
  if (!hbFloorplanAutoDiagramLoading) {
    hbFloorplanAutoDiagramLoading = document.createElement("div");
    hbFloorplanAutoDiagramLoading.className =
      "hb-floorplan-auto-diagram-loading";
    hbFloorplanAutoDiagramLoading.innerHTML =
      '<i aria-hidden="true"></i><strong>正在重新载入3D户型…</strong>';
    value.append(hbFloorplanAutoDiagramLoading);
  }
  const value2 = new URL(element.src, window.location.origin);
  value2.searchParams.set("auto-diagram-refresh", String(Date.now()));
  element.src = value2.toString();
}
window.addEventListener("pageshow", (value) => {
  if (value.persisted) {
    for (const value2 of document.querySelectorAll(
      ".hb-floorplan-auto-diagram-preview",
    )) {
      YE(value2);
    }
  }
});
Zm.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-floorplan-camera-view]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const cameraView =
    value2.dataset.floorplanCameraView === "top" ? "top" : "free";
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      component.properties = {
        ...(component.properties || {}),
        cameraView: cameraView,
      };
    }
  });
  Yr(value3, "set-view", cameraView);
});
Zt.addEventListener("change", () => {
  const value = componentId;
  const floorSelection = String(Zt.value || "");
  const component = O();
  if (
    !!value &&
    !!floorSelection &&
    component?.type === "floorplan-auto-diagram"
  ) {
    L((value2) => {
      const component2 = findComponent(value2, value)?.component;
      if (component2?.type === "floorplan-auto-diagram") {
        component2.properties = {
          ...(component2.properties || {}),
          floorSelection: floorSelection,
        };
      }
    });
    _E(value, floorSelection);
    Yr(value, "restore", {
      view: component.properties?.cameraView || "free",
      mode: component.properties?.cameraMode || "orthographic",
      topRotation: Number(component.properties?.cameraTopRotation || 0),
      focalLength: Number(component.properties?.cameraFocalLength || 50),
    });
  }
});
Qm.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-floorplan-camera-mode]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const cameraMode =
    value2.dataset.floorplanCameraMode === "perspective"
      ? "perspective"
      : "orthographic";
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      component.properties = {
        ...(component.properties || {}),
        cameraMode: cameraMode,
      };
    }
  });
  Yr(value3, "set-mode", cameraMode);
});
ba.addEventListener("change", () => {
  const value = componentId;
  if (!value || String(ba.value).trim() === "") {
    return Z();
  }
  const cameraFocalLength = clampNumber(Number(ba.value), 18, 120);
  L((value2) => {
    const component = findComponent(value2, value)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      component.properties = {
        ...(component.properties || {}),
        cameraFocalLength: cameraFocalLength,
      };
    }
  });
  Yr(value, "set-focal-length", cameraFocalLength);
});
ef.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (component?.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {}),
          cameraView: "top",
          cameraTopRotation:
            (Number(component.properties?.cameraTopRotation || 0) + 90) % 360,
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
        '"] .hb-floorplan-auto-diagram-preview',
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
        ...(lighting
          ? {
              lighting: lighting,
            }
          : {}),
      },
      window.location.origin,
    );
    return true;
  } else {
    return false;
  }
}
function Ap(value) {
  const baseLighting = normalizeBaseLighting(value);
  for (const element of jl) {
    const value3 = baseLighting[element.dataset.floorplanBaseLight];
    element.value =
      element.step === "5"
        ? String(Math.round(value3))
        : String(Number(value3.toFixed(2)));
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
  L((value3) => {
    const component = findComponent(value3, value)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      component.properties = {
        ...(component.properties || {}),
        interactionMode: "view",
      };
    }
  });
  Ap(ql);
  ri.textContent = "正在读取当前光照设置…";
  $e.hidden = false;
  $e.setAttribute("aria-busy", "true");
  const value2 = $e.getBoundingClientRect();
  if (
    value2.right > window.innerWidth - 8 ||
    value2.bottom > window.innerHeight - 8 ||
    value2.left < 8 ||
    value2.top < 8
  ) {
    $e.style.right = "auto";
    $e.style.left =
      clampNumber(
        value2.left,
        8,
        Math.max(8, window.innerWidth - value2.width - 8),
      ) + "px";
    $e.style.top =
      clampNumber(
        value2.top,
        8,
        Math.max(8, window.innerHeight - value2.height - 8),
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
  const value2 = $e.getBoundingClientRect();
  Nt = {
    pointerId: value.pointerId,
    startX: value.clientX,
    startY: value.clientY,
    startLeft: value2.left,
    startTop: value2.top,
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
function mw(value, { cancelRemovesComponent: value2 = false } = {}) {
  if (value) {
    mt.dataset.componentId = value;
    mt.dataset.cancelRemovesComponent = String(value2);
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
    bag.delete(componentId);
    if (componentId === componentId) {
      componentId = bag.values().next().value || null;
    }
    if (we === componentId) {
      we = componentId;
    }
    L((value2) => {
      kc(value2, componentId);
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
    component.properties?.previewing !== true
  ) {
    L((value3) => {
      const component2 = findComponent(value3, component.id)?.component;
      if (component2?.type === "floorplan-auto-diagram") {
        component2.properties = {
          ...(component2.properties || {}),
          previewReady: true,
          previewing: true,
          interactionMode: "position",
        };
      }
    });
    return;
  }
  const element = document.querySelector(
    '.hb-component[data-component-id="' +
      CSS.escape(component.id) +
      '"] .hb-floorplan-auto-diagram-preview',
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
    /[. ]$/.test(folderName)
  ) {
    ai.textContent = "请先填写有效的导图文件夹名称。";
    da.focus();
    return;
  }
  const value = component.position || {};
  const value2 = h.document.canvas || {};
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
        Math.round(Number(value2.width || value.width || 2778)),
      ),
      height: Math.max(
        320,
        Math.round(Number(value2.height || value.height || 1940)),
      ),
      folderName: folderName,
    },
    window.location.origin,
  );
});
la.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (component?.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {}),
          interactionMode:
            component.properties?.interactionMode === "view"
              ? "position"
              : "view",
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
          interactionMode: "position",
        };
      }
    });
    pw();
  }
});
nf.addEventListener("change", (value) => {
  const element = value.target.closest("[data-floorplan-light-group-id]");
  const value2 = componentId;
  if (!element || !value2) {
    return;
  }
  const floorplanLightGroupId = element.dataset.floorplanLightGroupId;
  L((value3) => {
    const component = findComponent(value3, value2)?.component;
    if (!component || component.type !== "floorplan-auto-diagram") {
      return;
    }
    component.bindings = {
      ...(component.bindings || {}),
    };
    const value4 = "lightGroup:" + floorplanLightGroupId;
    if (element.value) {
      component.bindings[value4] = {
        entityId: element.value,
      };
    } else {
      delete component.bindings[value4];
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
    const value3 = Tp(text2);
    if (!value3 || value.source !== value3.contentWindow || text2 !== va) {
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
        '"] .hb-floorplan-auto-diagram-preview',
    );
    if (!element2 || value.source !== element2.contentWindow) {
      return;
    }
    element2.classList.add("is-ready");
    element2.parentElement
      ?.querySelector(".hb-floorplan-auto-diagram-loading")
      ?.remove();
    const component = findComponent(h?.document, componentId)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      const floors = (Array.isArray(data.floors) ? data.floors : [])
        .map((value4) => ({
          id: String(value4?.id || ""),
          name: String(value4?.name || ""),
        }))
        .filter((value4) => value4.id);
      const selected = String(data.floorSelection || "");
      $u.set(componentId, {
        floors: floors,
        selected: selected,
      });
      const value3 = component.properties || {};
      if (
        Object.prototype.hasOwnProperty.call(value3, "floorSelection") &&
        selected &&
        value3.floorSelection !== selected
      ) {
        L((value4) => {
          const component2 = findComponent(value4, componentId)?.component;
          if (component2?.type === "floorplan-auto-diagram") {
            component2.properties = {
              ...(component2.properties || {}),
              floorSelection: selected,
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
            focalLength: Number(component.properties?.cameraFocalLength || 50),
          },
        },
        window.location.origin,
      );
    }
    return;
  }
  if (data?.type === "ha-bridge-floorplan-auto-diagram-floor-state") {
    const text2 = String(data.componentId || "");
    const element2 = document.querySelector(
      '.hb-component[data-component-id="' +
        CSS.escape(text2) +
        '"] .hb-floorplan-auto-diagram-preview',
    );
    if (!element2 || value.source !== element2.contentWindow) {
      return;
    }
    const floors = (Array.isArray(data.floors) ? data.floors : [])
      .map((value3) => ({
        id: String(value3?.id || ""),
        name: String(value3?.name || ""),
      }))
      .filter((value3) => value3.id);
    const selected = String(data.floorSelection || "");
    $u.set(text2, {
      floors: floors,
      selected: selected,
    });
    const component = findComponent(h?.document, text2)?.component;
    if (
      component?.type === "floorplan-auto-diagram" &&
      selected &&
      component.properties?.floorSelection !== selected
    ) {
      L((value3) => {
        const component2 = findComponent(value3, text2)?.component;
        if (component2?.type === "floorplan-auto-diagram") {
          component2.properties = {
            ...(component2.properties || {}),
            floorSelection: selected,
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
        '"] .hb-floorplan-auto-diagram-preview',
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
        '"] .hb-floorplan-auto-diagram-preview',
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
      '"] .hb-floorplan-auto-diagram-preview',
  );
  if (!element || value.source !== element.contentWindow) {
    return;
  }
  const manifest = data.manifest;
  const autoDiagramFolder = String(
    data.folderName || manifest?.exportName || "",
  ).trim();
  if (!text || !manifest || !autoDiagramFolder) {
    return;
  }
  xt.disabled = false;
  xt.textContent = "确定位置大小并后台生成";
  ai.textContent = "已生成，正在置换到仪表盘…";
  const value2 = element.closest(".hb-component");
  if (value2) {
    value2.hidden = true;
  }
  L((value3) => {
    let value4 = findComponentLocation(value3, text);
    const component = value4?.component;
    if (
      !component ||
      component.type !== "floorplan-auto-diagram" ||
      !value4.page
    ) {
      return null;
    }
    const page = value4.page;
    const value5 = [];
    const fn9 = (value32) => {
      for (const component2 of value32 || []) {
        if (component2?.properties?.autoDiagramFolder === autoDiagramFolder) {
          value5.push(component2);
        }
        fn9(component2?.children);
      }
    };
    fn9(page.components);
    const index2 = new Map(
      value5
        .filter((value32) => value32.type === "image")
        .map((component2) => [
          component2.properties?.autoDiagramRole === "base"
            ? "background-with-plan"
            : String(component2.properties?.autoDiagramRole || ""),
          component2,
        ]),
    );
    const index3 = new Map(
      value5
        .filter((value32) => value32.type === "icon-button-effect")
        .map((component2) => {
          const text2 = String(
            component2.properties?.autoDiagramRole || "light-group",
          );
          const text3 = String(
            component2.properties?.autoDiagramLayerId ||
              component2.properties?.autoDiagramGroupId ||
              "",
          );
          return [text2 + ":" + text3, component2];
        }),
    );
    for (const value32 of value5) {
      kc(value3, value32.id);
    }
    value4 = findComponentLocation(value3, text);
    if (!value4) {
      return null;
    }
    const numeric = Number(value3.canvas?.width || 2778);
    const numeric2 = Number(value3.canvas?.height || 1940);
    const naturalWidth = Math.max(
      1,
      Number(manifest.resolution?.width || component.position?.width || 1),
    );
    const naturalHeight = Math.max(
      1,
      Number(manifest.resolution?.height || component.position?.height || 1),
    );
    const layoutMode =
      component.properties?.layoutMode === "fill" ? "fill" : "free";
    const value8 = component.position || {};
    const value9 =
      layoutMode === "fill"
        ? 1
        : Math.max(0.01, Math.min(5, Number(component.style?.scale || 1)));
    const value10 =
      layoutMode === "fill" ? numeric : Number(value8.width || 100);
    const value11 =
      layoutMode === "fill" ? numeric2 : Number(value8.height || 100);
    const width = value10 * value9;
    const height = value11 * value9;
    const value12 =
      layoutMode === "fill" ? 0 : Number(value8.x || 0) - (width - value10) / 2;
    const value13 =
      layoutMode === "fill"
        ? 0
        : Number(value8.y || 0) - (height - value11) / 2;
    const rotation = layoutMode === "fill" ? 0 : Number(value8.rotation || 0);
    const value14 = [
      {
        role: "background",
        file: manifest.backgroundImage,
        label: "00底图",
        visible: true,
      },
      {
        role: "floor-plan",
        file: manifest.floorPlanImage,
        label: "00户型图",
        visible: true,
      },
      {
        role: "background-with-plan",
        file: manifest.baseImage,
        label: "00底图带户型",
        visible: false,
      },
    ]
      .filter((value32) => value32.file)
      .map((value32) => {
        const value33 = index2.get(value32.role);
        const component2 = value33
          ? clone(value33)
          : createComponentFromTemplate("image", {
              id: newId("component"),
              instanceName: value32.label,
              canvas: value3.canvas,
            });
        component2.position = {
          ...(component2.position || {}),
          x: value12,
          y: value13,
          width: width,
          height: height,
          rotation: rotation,
        };
        component2.style = {
          ...(component2.style || {}),
          scale: 1,
          visible: value33 ? value33.style?.visible !== false : value32.visible,
        };
        component2.bindings = {};
        component2.actions = {};
        component2.properties = {
          ...(component2.properties || {}),
          instanceName: value32.label,
          label: value32.label,
          assetId: "studio3d:" + autoDiagramFolder + "/" + value32.file,
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight,
          opacity: 1,
          fit: "contain",
          layoutMode: layoutMode,
          autoDiagramFolder: autoDiagramFolder,
          autoDiagramRole: value32.role,
          autoDiagramCamera: manifest.camera || null,
        };
        return component2;
      });
    const value15 = value14.find(
      (component2) => component2.properties?.autoDiagramRole === "background",
    );
    const value16 = value14.find(
      (component2) => component2.properties?.autoDiagramRole === "floor-plan",
    );
    const value17 = value14.find(
      (component2) =>
        component2.properties?.autoDiagramRole === "background-with-plan",
    );
    const value18 = value17 || value16 || value15;
    const value19 = (Array.isArray(manifest.groups) ? manifest.groups : [])
      .filter(
        (value32) =>
          String(value32?.id || value32?.groupId || "") && value32?.file,
      )
      .map((value32) => ({
        role: "light-group",
        id: String(value32.id || value32.groupId || ""),
        name: String(value32.name || value32.note || "灯组"),
        note: String(value32.note || value32.name || "灯组"),
        file: value32.file,
        icon: "mdi:lightbulb-outline",
        anchor: value32.anchor,
      }));
    const value20 = (Array.isArray(manifest.screens) ? manifest.screens : [])
      .filter(
        (value32) =>
          String(value32?.id || value32?.itemId || "") && value32?.file,
      )
      .map((value32) => ({
        role: "television",
        id: String(value32.id || value32.itemId || ""),
        name: String(value32.name || "电视画面"),
        note: String(value32.name || "电视画面"),
        file: value32.file,
        icon: "mdi:television",
        anchor: value32.anchor,
      }));
    const value21 = (Array.isArray(manifest.vehicles) ? manifest.vehicles : [])
      .filter(
        (value32) =>
          String(value32?.id || value32?.itemId || "") && value32?.file,
      )
      .map((value32) => ({
        role: "vehicle",
        id: String(value32.id || value32.itemId || ""),
        name: String(value32.name || "汽车充电"),
        note: String(value32.name || "汽车充电"),
        file: value32.file,
        icon: "mdi:car-electric",
        anchor: value32.anchor,
      }));
    const value22 = [...value20, ...value21, ...value19];
    const value23 = value12 + width / 2;
    const value24 = value13 + height / 2;
    const value25 = (rotation * Math.PI) / 180;
    const value26 = Math.min(width / naturalWidth, height / naturalHeight);
    const value27 = naturalWidth * value26;
    const value28 = naturalHeight * value26;
    const value29 = [];
    const fn10 = (value32, value33, value34, value35) => {
      const numeric3 = Number(value32.anchor?.x);
      const numeric4 = Number(value32.anchor?.y);
      const value36 = {
        x: value22.length > 1 ? (value33 + 1) / (value22.length + 1) : 0.5,
        y: 0.9,
      };
      const value37 =
        Number.isFinite(numeric3) && Number.isFinite(numeric4)
          ? {
              x: numeric3,
              y: numeric4,
            }
          : value36;
      const spacingX = Math.max(0.035, (value34 / Math.max(value27, 1)) * 1.08);
      const spacingY = Math.max(0.045, (value35 / Math.max(value28, 1)) * 1.08);
      const value38 = [[0, 0]];
      for (let value40 = 1; value40 <= 4; value40 += 1) {
        value38.push(
          [0, -spacingY * value40],
          [spacingX * value40, 0],
          [0, spacingY * value40],
          [-spacingX * value40, 0],
          [spacingX * value40, -spacingY * value40],
          [spacingX * value40, spacingY * value40],
          [-spacingX * value40, spacingY * value40],
          [-spacingX * value40, -spacingY * value40],
        );
      }
      let value39 = null;
      for (const [value40, value41] of value38) {
        const value42 = {
          x: clampNumber(value37.x + value40, spacingX / 2, 1 - spacingX / 2),
          y: clampNumber(value37.y + value41, spacingY / 2, 1 - spacingY / 2),
        };
        if (
          !value29.some(
            (value43) =>
              Math.abs(value42.x - value43.x) <
                (spacingX + value43.spacingX) / 2 &&
              Math.abs(value42.y - value43.y) <
                (spacingY + value43.spacingY) / 2,
          )
        ) {
          value39 = value42;
          break;
        }
      }
      value39 ||= {
        x: clampNumber(value36.x, spacingX / 2, 1 - spacingX / 2),
        y: clampNumber(value36.y, spacingY / 2, 1 - spacingY / 2),
      };
      value29.push({
        ...value39,
        spacingX: spacingX,
        spacingY: spacingY,
      });
      return value39;
    };
    const value30 = value22.map((value32, value33) => {
      const component2 = index3.get(value32.role + ":" + value32.id);
      const component3 = component2
        ? clone(component2)
        : createComponentFromTemplate("icon-button-effect", {
            id: newId("component"),
            instanceName: value32.name,
            canvas: value3.canvas,
          });
      const autoDiagramSceneAnchor =
        component2?.properties?.autoDiagramSceneAnchor;
      const value34 =
        !autoDiagramSceneAnchor ||
        Math.abs(Number(autoDiagramSceneAnchor.x) - Number(value32.anchor?.x)) >
          0.002 ||
        Math.abs(Number(autoDiagramSceneAnchor.y) - Number(value32.anchor?.y)) >
          0.002;
      const value35 =
        !!component2 &&
        Number(component2.properties?.autoDiagramLayoutVersion || 0) < hm;
      const value36 =
        !component2 || value35 || (value32.role === "light-group" && value34);
      let autoDiagramButtonAnchor =
        component2?.properties?.autoDiagramButtonAnchor || null;
      if (value36) {
        const numeric3 = Number(component3.position?.width || numeric * 0.075);
        const numeric4 = Number(component3.position?.height || numeric3);
        const count = Math.max(
          0.01,
          Math.min(5, Number(component3.style?.scale || 1)),
        );
        autoDiagramButtonAnchor = fn10(
          value32,
          value33,
          numeric3 * count,
          numeric4 * count,
        );
        const value37 = -value27 / 2 + autoDiagramButtonAnchor.x * value27;
        const value38 = -value28 / 2 + autoDiagramButtonAnchor.y * value28;
        const value39 =
          value37 * Math.cos(value25) - value38 * Math.sin(value25);
        const value40 =
          value37 * Math.sin(value25) + value38 * Math.cos(value25);
        component3.position = {
          ...(component3.position || {}),
          x: value23 + value39 - numeric3 / 2,
          y: value24 + value40 - numeric4 / 2,
          rotation: rotation,
        };
      } else if (
        Number.isFinite(Number(autoDiagramButtonAnchor?.x)) &&
        Number.isFinite(Number(autoDiagramButtonAnchor?.y))
      ) {
        const numeric3 = Number(component3.position?.width || numeric * 0.075);
        const numeric4 = Number(component3.position?.height || numeric3);
        const count = Math.max(
          0.01,
          Math.min(5, Number(component3.style?.scale || 1)),
        );
        value29.push({
          x: Number(autoDiagramButtonAnchor.x),
          y: Number(autoDiagramButtonAnchor.y),
          spacingX: Math.max(
            0.035,
            ((numeric3 * count) / Math.max(value27, 1)) * 1.08,
          ),
          spacingY: Math.max(
            0.045,
            ((numeric4 * count) / Math.max(value28, 1)) * 1.08,
          ),
        });
      }
      component3.style = {
        ...(component3.style || {}),
        visible: true,
      };
      component3.bindings = {
        ...(component3.bindings || {}),
      };
      if (!component2 && value32.role === "light-group") {
        const value37 = component.bindings?.["lightGroup:" + value32.id];
        if (value37?.entityId) {
          component3.bindings.entity = {
            entityId: value37.entityId,
          };
        }
      }
      component3.actions = Object.keys(component3.actions || {}).length
        ? {
            ...(component3.actions || {}),
          }
        : {
            tap: {
              type: "toggle",
            },
          };
      component3.properties = {
        ...(component3.properties || {}),
        instanceName: value32.name,
        label: value32.name,
        note: value32.note,
        icon: component2?.properties?.icon || value32.icon,
        effectAssetId: "studio3d:" + autoDiagramFolder + "/" + value32.file,
        effectNaturalWidth: naturalWidth,
        effectNaturalHeight: naturalHeight,
        effectReferenceImageId: value18?.id || "",
        effectLayoutMode: layoutMode,
        effectLeft: (value23 / numeric) * 100,
        effectTop: (value24 / numeric2) * 100,
        effectScale: 1,
        effectRotation: rotation,
        autoDiagramFolder: autoDiagramFolder,
        autoDiagramRole: value32.role,
        autoDiagramLayerId: value32.id,
        autoDiagramSceneAnchor: value32.anchor || null,
        autoDiagramButtonAnchor: autoDiagramButtonAnchor,
        autoDiagramLayoutVersion: hm,
        ...(value32.role === "light-group"
          ? {
              autoDiagramGroupId: value32.id,
            }
          : {}),
      };
      return component3;
    });
    const value31 = [value16, value15, value17].filter(Boolean);
    const index = value4.index;
    kc(value3, text);
    value4.collection.splice(index, 0, ...value30, ...value31);
    applyCollectionLayerOrder(value4.collection);
    return {
      removed: true,
      selectedId: (value15 || value16 || value17 || value30[0])?.id || null,
    };
  })
    .then((value3) => {
      if (!value3?.removed) {
        if (value2?.isConnected) {
          value2.hidden = false;
        }
        return;
      }
      const selectedId = value3.selectedId;
      componentId = selectedId;
      bag = selectedId ? new Set([selectedId]) : new Set();
      we = selectedId;
      x?.setSelectedComponents(selectedId ? [selectedId] : [], selectedId);
      _e();
      Z();
    })
    .catch(onError);
});
const fw = new Map([
  [
    Ul,
    {
      property: "effectColorTemperatureRealtime",
      type: "boolean",
    },
  ],
  [
    _l,
    {
      property: "effectBrightnessRealtime",
      type: "boolean",
    },
  ],
  [
    Xl,
    {
      property: "iconOffColor",
    },
  ],
  [
    Kl,
    {
      property: "iconOnColor",
    },
  ],
  [
    lf,
    {
      property: "iconSize",
      min: 1,
      max: 100,
    },
  ],
  [
    Jl,
    {
      property: "buttonOffColor",
    },
  ],
  [
    Zl,
    {
      property: "buttonOnColor",
    },
  ],
  [
    df,
    {
      property: "buttonOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    uf,
    {
      property: "frameColor",
    },
  ],
  [
    pf,
    {
      property: "frameWidth",
      min: 0,
      max: 20,
    },
  ],
  [
    mf,
    {
      property: "frameOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    ff,
    {
      property: "radius",
      min: 0,
      max: 50,
    },
  ],
  [
    gf,
    {
      property: "glowColor",
    },
  ],
  [
    Ql,
    {
      property: "glowOffStrength",
      min: 0,
      max: 300,
      divisor: 100,
    },
  ],
  [
    ed,
    {
      property: "glowOnStrength",
      min: 0,
      max: 300,
      divisor: 100,
    },
  ],
  [
    bf,
    {
      property: "effectOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    yf,
    {
      property: "effectFadeDuration",
      min: 0,
      max: 3,
    },
  ],
  [
    td,
    {
      property: "effectLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    nd,
    {
      property: "effectTop",
      min: -100,
      max: 200,
    },
  ],
  [
    od,
    {
      property: "effectScale",
      min: 1,
      max: 500,
      divisor: 100,
    },
  ],
  [
    id,
    {
      property: "effectRotation",
      min: -360,
      max: 360,
    },
  ],
]);
const JE = new Map([
  [Xl, "off"],
  [Jl, "off"],
  [Ql, "off"],
  [Kl, "on"],
  [Zl, "on"],
  [ed, "on"],
]);
const gw = new Set([Na, Ea, ci, li, bo, di]);
function hw(value) {
  const value2 = JE.get(value);
  const value3 = O();
  if (!!value2 && value3?.type === "icon-button-effect") {
    un.set(value3.id, value2);
    x?.setComponentPreviewState(value3.id, value2);
    for (const element of Yl.querySelectorAll("[data-ibe-preview]")) {
      const value4 = element.dataset.ibePreview === value2;
      element.classList.toggle("active", value4);
      element.setAttribute("aria-pressed", String(value4));
    }
  }
}
for (const t of ["focusin", "pointerdown"]) {
  si.addEventListener(t, (value) => hw(value.target));
}
si.addEventListener("input", (value) => {
  const value2 = O();
  if (!value2 || value2.type !== "icon-button-effect") {
    return;
  }
  hw(value.target);
  const value3 = fw.get(value.target);
  if (value3) {
    let value4 =
      value3.type === "boolean"
        ? value.target.checked
        : value.target.type === "color"
          ? value.target.value
          : Number(value.target.value);
    if (value3.type !== "boolean" && value.target.type !== "color") {
      if (!Number.isFinite(value4)) {
        return;
      }
      value4 =
        clampNumber(value4, value3.min, value3.max) / (value3.divisor || 1);
    }
    x?.previewComponentProperties(value2.id, {
      [value3.property]: value4,
    });
    return;
  }
  if (!gw.has(value.target) || !Number.isFinite(Number(value.target.value))) {
    return;
  }
  const numeric = Number(value.target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(value2.position?.width || 100);
  const numeric5 = Number(value2.position?.height || 100);
  if (value.target === Na) {
    x?.previewComponentTransform(value2.id, {
      x: (numeric2 * clampNumber(numeric, 0, 100)) / 100 - numeric4 / 2,
    });
  } else if (value.target === Ea) {
    x?.previewComponentTransform(value2.id, {
      y: (numeric3 * clampNumber(numeric, 0, 100)) / 100 - numeric5 / 2,
    });
  } else if (value.target === ci) {
    x?.previewComponentTransform(value2.id, {
      width: (numeric2 * clampNumber(numeric, 0.1, 100)) / 100,
    });
  } else if (value.target === li) {
    x?.previewComponentTransform(value2.id, {
      height: (numeric3 * clampNumber(numeric, 0.1, 100)) / 100,
    });
  } else if (value.target === bo) {
    x?.previewComponentTransform(value2.id, {
      scale: clampNumber(numeric, 1, 500) / 100,
    });
  } else if (value.target === di) {
    x?.previewComponentTransform(value2.id, {
      rotation: clampNumber(numeric, -360, 360),
    });
  }
});
si.addEventListener("change", (value) => {
  const target = value.target;
  const value2 = fw.get(target);
  if (!value2 && !gw.has(target)) {
    return;
  }
  if (target.type === "number" && !Number.isFinite(Number(target.value))) {
    Z();
    return;
  }
  const value3 = componentId;
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (!component || component.type !== "icon-button-effect") {
      return;
    }
    component.properties = {
      ...(component.properties || {}),
    };
    component.position = {
      ...(component.position || {}),
    };
    component.style = {
      ...(component.style || {}),
    };
    if (value2) {
      component.properties[value2.property] =
        value2.type === "boolean"
          ? target.checked
          : target.type === "color"
            ? target.value
            : clampNumber(Number(target.value), value2.min, value2.max) /
              (value2.divisor || 1);
      return;
    }
    const numeric = Number(value4.canvas.width || 2778);
    const numeric2 = Number(value4.canvas.height || 1940);
    const numeric3 = Number(target.value);
    if (target === Na) {
      component.position.x =
        (numeric * clampNumber(numeric3, 0, 100)) / 100 -
        Number(component.position.width || 100) / 2;
    } else if (target === Ea) {
      component.position.y =
        (numeric2 * clampNumber(numeric3, 0, 100)) / 100 -
        Number(component.position.height || 100) / 2;
    } else if (target === ci) {
      component.position.width =
        (numeric * clampNumber(numeric3, 0.1, 100)) / 100;
    } else if (target === li) {
      component.position.height =
        (numeric2 * clampNumber(numeric3, 0.1, 100)) / 100;
    } else if (target === bo) {
      component.style.scale = clampNumber(numeric3, 1, 500) / 100;
    } else if (target === di) {
      Gt(value4, value3, clampNumber(numeric3, -360, 360));
    }
  });
});
vf.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-ibe-layout]");
  const value3 = componentId;
  if (!!value2 && !!value3) {
    L((value4) => {
      const component = findComponent(value4, value3)?.component;
      if (!!component && component.type === "icon-button-effect") {
        component.properties = {
          ...(component.properties || {}),
          effectLayoutMode:
            value2.dataset.ibeLayout === "fill" ? "fill" : "free",
        };
      }
    });
  }
});
function ZE(value) {
  const value2 = [];
  const fn9 = (value3) => {
    for (const value4 of value3 || []) {
      if (value4.type === "image") {
        value2.push(value4);
      }
      fn9(value4.children);
    }
  };
  fn9(value?.components);
  return value2;
}
function QE(component, value) {
  const value2 = document.createElement("label");
  value2.className = "effect-image-align-option";
  const element = document.createElement("input");
  element.type = "radio";
  element.name = "effect-image-align-target";
  element.value = component.id;
  element.checked = value;
  const element2 = document.createElement("span");
  element2.className = "effect-image-align-option-preview";
  const value3 = Ut(component.properties?.assetId || "");
  const value4 = up(value3);
  if (value4) {
    const value13 = document.createElement("img");
    value13.src = value4;
    value13.alt = "";
    element2.append(value13);
  } else {
    element2.textContent = "无预览";
  }
  const value5 = document.createElement("span");
  value5.className = "effect-image-align-option-copy";
  const element3 = document.createElement("strong");
  element3.textContent = componentLabel(component);
  const element4 = document.createElement("small");
  const value6 = component.properties?.layoutMode === "fill";
  const value7 = component.style?.visible === false ? "隐藏" : "显示";
  const numeric = Number(h?.document?.canvas?.width || 2778);
  const numeric2 = Number(h?.document?.canvas?.height || 1940);
  const value8 = component.position || {};
  const numeric3 = Number(value8.width || 100);
  const numeric4 = Number(value8.height || 100);
  const value9 = roundField(
    ((Number(value8.x || 0) + numeric3 / 2) / numeric) * 100,
  );
  const value10 = roundField(
    ((Number(value8.y || 0) + numeric4 / 2) / numeric2) * 100,
  );
  const value11 = roundField(Number(component.style?.scale || 1) * 100);
  const value12 = roundField(Number(value8.rotation || 0));
  element4.textContent = value6
    ? "铺满 · 覆盖整个画布"
    : "自由 · 左 " + value9 + "% · 上 " + value10 + "%";
  const element5 = document.createElement("small");
  element5.textContent = value6
    ? value7
    : "缩放 " + value11 + "% · 旋转 " + value12 + "° · " + value7;
  value5.append(element3, element4, element5);
  value2.append(element, element2, value5);
  return value2;
}
function eL() {
  const component = O();
  const value = Je();
  if (!component || component.type !== "icon-button-effect" || !value) {
    return;
  }
  const value2 = ZE(value);
  const text = String(component.properties?.effectReferenceImageId || "");
  Cf.replaceChildren(
    ...value2.map((value3, value4) =>
      QE(value3, value3.id === text || (!text && value4 === 0)),
    ),
  );
  Au = component.id;
  As.hidden = value2.length > 0;
  As.textContent = value2.length ? "" : "本页面没有可以对齐的普通图片。";
  wf.disabled = value2.length === 0;
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
    'input[name="effect-image-align-target"]:checked',
  )?.value;
  const value2 = Au;
  if (!value2 || !value) {
    As.textContent = "请选择一张本页面图片。";
    As.hidden = false;
    return;
  }
  In.close();
  L((value3) => {
    const component = findComponent(value3, value2)?.component;
    const value4 =
      value3.pages?.find((value7) => value7.path === W.value) ||
      value3.pages?.[0];
    const component2 = findComponentInItems(value4?.components, value);
    if (
      !component ||
      component.type !== "icon-button-effect" ||
      !component2 ||
      component2.type !== "image"
    ) {
      return;
    }
    const numeric = Number(value3.canvas?.width || 2778);
    const numeric2 = Number(value3.canvas?.height || 1940);
    const value5 = component2.position || {};
    const numeric3 = Number(value5.width || 100);
    const numeric4 = Number(value5.height || 100);
    const value6 = component2.properties?.layoutMode === "fill";
    component.properties = {
      ...(component.properties || {}),
      effectReferenceImageId: component2.id,
      effectLayoutMode: value6 ? "fill" : "free",
      ...(value6
        ? {}
        : {
            effectLeft:
              ((Number(value5.x || 0) + numeric3 / 2) / numeric) * 100,
            effectTop:
              ((Number(value5.y || 0) + numeric4 / 2) / numeric2) * 100,
            effectScale: clampNumber(
              Number(component2.style?.scale || 1),
              0.01,
              5,
            ),
            effectRotation: Number(value5.rotation || 0),
          }),
    };
  });
});
Yl.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-ibe-preview]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const value4 = ["on", "off"].includes(value2.dataset.ibePreview)
    ? value2.dataset.ibePreview
    : "auto";
  un.set(value3, value4);
  x?.setComponentPreviewState(value3, value4);
  Z();
});
rf.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-ibe-layer]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const value4 = value2.dataset.ibeLayer === "effect" ? "effect" : "button";
  const value5 = value4 === "effect" ? "on" : "off";
  qv.set(value3, value4);
  un.set(value3, value5);
  x?.setComponentPreviewState(value3, value5);
  x?.setComponentSelectionLayer(value3, value4);
  fn8();
  Z();
});
sf.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (!!component && component.type === "icon-button-effect") {
        component.properties = {
          ...(component.properties || {}),
          buttonVisible: component.properties?.buttonVisible === false,
        };
      }
    });
  }
});
cf.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (!!component && component.type === "icon-button-effect") {
        component.properties = {
          ...(component.properties || {}),
          effectVisible: component.properties?.effectVisible === false,
        };
      }
    });
  }
});
const tL = new Map([
  [
    Lf,
    {
      property: "mainColor",
    },
  ],
  [
    If,
    {
      property: "secondaryColor",
    },
  ],
  [
    Tf,
    {
      property: "mainSize",
      min: 8,
      max: 200,
    },
  ],
  [
    Af,
    {
      property: "secondarySize",
      min: 6,
      max: 100,
    },
  ],
  [
    Pf,
    {
      property: "mainWeight",
      min: 0,
      max: 1,
    },
  ],
  [
    kf,
    {
      property: "secondaryWeight",
      min: 0,
      max: 1,
    },
  ],
  [
    Mf,
    {
      property: "mainSpacing",
      min: -20,
      max: 100,
    },
  ],
  [
    Of,
    {
      property: "secondarySpacing",
      min: -20,
      max: 100,
    },
  ],
  [
    Bf,
    {
      property: "secondaryLineGap",
      min: 0,
      max: 100,
    },
  ],
  [
    $f,
    {
      property: "mainTextLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    Ff,
    {
      property: "mainTextTop",
      min: -100,
      max: 200,
    },
  ],
  [
    Df,
    {
      property: "secondaryTextLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    zf,
    {
      property: "secondaryTextTop",
      min: -100,
      max: 200,
    },
  ],
  [
    Wf,
    {
      property: "iconColor",
    },
  ],
  [
    Rf,
    {
      property: "iconSize",
      min: 1,
      max: 100,
    },
  ],
  [
    Hf,
    {
      property: "iconLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    jf,
    {
      property: "iconTop",
      min: -100,
      max: 200,
    },
  ],
  [
    qf,
    {
      property: "frameColor",
    },
  ],
  [
    Uf,
    {
      property: "frameWidth",
      min: 0,
      max: 12,
    },
  ],
  [
    _f,
    {
      property: "frameSize",
      min: 10,
      max: 300,
    },
  ],
  [
    Yf,
    {
      property: "frameSpacing",
      min: 0,
      max: 300,
    },
  ],
  [
    Xf,
    {
      property: "frameOffsetX",
      min: -100,
      max: 100,
    },
  ],
  [
    Kf,
    {
      property: "frameOffsetY",
      min: -100,
      max: 100,
    },
  ],
  [
    Zf,
    {
      property: "markerColor",
    },
  ],
  [
    Qf,
    {
      property: "markerSize",
      min: 2,
      max: 60,
    },
  ],
  [
    eg,
    {
      property: "markerLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    tg,
    {
      property: "markerTop",
      min: -100,
      max: 200,
    },
  ],
]);
const nL = new Map([
  [rd, "left"],
  [sd, "top"],
  [$s, "width"],
  [Fs, "height"],
  [Aa, "scale"],
  [Ds, "rotation"],
]);
const oL = new Map([
  [
    sg,
    {
      property: "iconColor",
    },
  ],
  [
    cg,
    {
      property: "iconActiveColor",
    },
  ],
  [
    lg,
    {
      property: "iconSize",
      min: 8,
      max: 100,
    },
  ],
  [
    ug,
    {
      property: "titleColor",
    },
  ],
  [
    pg,
    {
      property: "titleSize",
      min: 8,
      max: 100,
    },
  ],
  [
    mg,
    {
      property: "titleWeight",
      min: 0,
      max: 1,
    },
  ],
  [
    fg,
    {
      property: "titleSpacing",
      min: -20,
      max: 100,
    },
  ],
  [
    hg,
    {
      property: "countColor",
    },
  ],
  [
    bg,
    {
      property: "countActiveColor",
    },
  ],
  [
    yg,
    {
      property: "countSize",
      min: 8,
      max: 140,
    },
  ],
  [
    vg,
    {
      property: "countWeight",
      min: 0,
      max: 1,
    },
  ],
  [
    wg,
    {
      property: "countSpacing",
      min: -20,
      max: 100,
    },
  ],
  [
    Cg,
    {
      property: "iconGap",
      min: 0,
      max: 40,
    },
  ],
  [
    Sg,
    {
      property: "countGap",
      min: 0,
      max: 40,
    },
  ],
]);
const iL = new Map([
  [ud, "left"],
  [pd, "top"],
  [Ws, "width"],
  [Rs, "height"],
  [$a, "scale"],
  [Hs, "rotation"],
]);
const aL = new Map([
  [
    uh,
    {
      property: "haloScaleX",
      min: 20,
      max: 300,
      divisor: 100,
    },
  ],
  [
    ph,
    {
      property: "haloScaleY",
      min: 20,
      max: 300,
      divisor: 100,
    },
  ],
  [
    mh,
    {
      property: "haloRotation",
      min: -360,
      max: 360,
    },
  ],
  [
    fh,
    {
      property: "haloOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    hh,
    {
      property: "personScale",
      min: 20,
      max: 300,
      divisor: 100,
    },
  ],
  [
    bh,
    {
      property: "personRotation",
      min: -360,
      max: 360,
    },
  ],
  [
    yh,
    {
      property: "personOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    vh,
    {
      property: "orbitDuration",
      min: 2,
      max: 60,
    },
  ],
  [
    fi,
    {
      property: "iconColor",
    },
  ],
  [
    bd,
    {
      property: (property) =>
        property.type !== "presence-sensor"
          ? "iconOnColor"
          : property.properties?.sensorKind === "water-leak"
            ? "waterLeakColor"
            : property.properties?.sensorKind === "smoke"
              ? "smokeColor"
              : property.properties?.sensorKind === "natural-gas"
                ? "naturalGasColor"
                : "iconOnColor",
    },
  ],
  [
    Pg,
    {
      property: "badgeColor",
    },
  ],
  [
    kg,
    {
      property: "badgeOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    Og,
    {
      property: "symbolSize",
      min: 1,
      max: 100,
    },
  ],
  [
    Bg,
    {
      property: "badgeSize",
      min: 1,
      max: 100,
    },
  ],
  [
    Mg,
    {
      property: "iconSize",
      min: 1,
      max: 100,
    },
  ],
  [
    yd,
    {
      property: "iconOffOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    vd,
    {
      property: "iconOnOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    wd,
    {
      property: "iconLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    Cd,
    {
      property: "iconTop",
      min: -100,
      max: 200,
    },
  ],
  [
    Fg,
    {
      property: "mainColor",
    },
  ],
  [
    Dg,
    {
      property: "secondaryColor",
    },
  ],
  [
    Ld,
    {
      property: "mainOffOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    Id,
    {
      property: "mainOnOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    Td,
    {
      property: "secondaryOffOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    Ad,
    {
      property: "secondaryOnOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    zg,
    {
      property: "mainSize",
      min: 6,
      max: 120,
    },
  ],
  [
    Vg,
    {
      property: "secondarySize",
      min: 5,
      max: 80,
    },
  ],
  [
    Wg,
    {
      property: "mainWeight",
      min: 0,
      max: 1,
    },
  ],
  [
    Rg,
    {
      property: "secondaryWeight",
      min: 0,
      max: 1,
    },
  ],
  [
    Hg,
    {
      property: "mainSpacing",
      min: -20,
      max: 100,
    },
  ],
  [
    jg,
    {
      property: "secondarySpacing",
      min: -20,
      max: 100,
    },
  ],
  [
    qg,
    {
      property: "mainTextLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    Gg,
    {
      property: "mainTextTop",
      min: -100,
      max: 200,
    },
  ],
  [
    Ug,
    {
      property: "secondaryTextLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    _g,
    {
      property: "secondaryTextTop",
      min: -100,
      max: 200,
    },
  ],
  [
    kd,
    {
      property: "onFillColor",
    },
  ],
  [
    Md,
    {
      property: "onFillStrength",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    Yg,
    {
      property: "onFillFadeDuration",
      min: 0,
      max: 3,
    },
  ],
  [
    Kg,
    {
      property: "frameWidth",
      min: 0,
      max: 12,
    },
  ],
  [
    Jg,
    {
      property: "frameAngle",
      min: 0,
      max: 360,
    },
  ],
  [
    Od,
    {
      property: "frameOffOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    Bd,
    {
      property: "frameOnOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    Zg,
    {
      property: "cutCorner",
      min: 0,
      max: 50,
    },
  ],
  [
    eh,
    {
      property: "softLightColor",
    },
  ],
  [
    th,
    {
      property: "softLightStrength",
      min: 0,
      max: 500,
      divisor: 100,
    },
  ],
  [
    nh,
    {
      property: "softLightSize",
      min: 0,
      max: 300,
      divisor: 100,
    },
  ],
  [
    oh,
    {
      property: "softLightAngle",
      min: 0,
      max: 360,
    },
  ],
  [
    ah,
    {
      property: "glowColor",
    },
  ],
  [
    rh,
    {
      property: "glowStrength",
      min: 0,
      max: 500,
      divisor: 100,
    },
  ],
  [
    sh,
    {
      property: "glowSize",
      min: 0,
      max: 300,
      divisor: 100,
    },
  ],
  [
    ch,
    {
      property: "glowAngle",
      min: 0,
      max: 360,
    },
  ],
]);
const rL = new Map([
  [$d, "left"],
  [Fd, "top"],
  [Gs, "width"],
  [Us, "height"],
  [Wa, "scale"],
  [_s, "rotation"],
]);
const bw = new Map([
  [
    Lh,
    {
      property: "iconOffColor",
    },
  ],
  [
    Ih,
    {
      property: "iconOnColor",
    },
  ],
  [
    Th,
    {
      property: "badgeColor",
    },
  ],
  [
    Ah,
    {
      property: "badgeOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
  [
    Ph,
    {
      property: "symbolSize",
      min: 1,
      max: 100,
    },
  ],
  [
    kh,
    {
      property: "badgeSize",
      min: 1,
      max: 100,
    },
  ],
  [
    Mh,
    {
      property: "iconLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    Oh,
    {
      property: "iconTop",
      min: -100,
      max: 200,
    },
  ],
  [
    Fh,
    {
      property: "mainColor",
    },
  ],
  [
    Dh,
    {
      property: "mainSize",
      min: 6,
      max: 120,
    },
  ],
  [
    zh,
    {
      property: "mainWeight",
      min: 0,
      max: 1,
    },
  ],
  [
    Vh,
    {
      property: "mainSpacing",
      min: -20,
      max: 100,
    },
  ],
  [
    Wh,
    {
      property: "mainTextLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    Rh,
    {
      property: "mainTextTop",
      min: -100,
      max: 200,
    },
  ],
  [
    qh,
    {
      property: "secondaryColor",
    },
  ],
  [
    Gh,
    {
      property: "secondarySize",
      min: 5,
      max: 80,
    },
  ],
  [
    Uh,
    {
      property: "secondaryWeight",
      min: 0,
      max: 1,
    },
  ],
  [
    _h,
    {
      property: "secondarySpacing",
      min: -20,
      max: 100,
    },
  ],
  [
    Yh,
    {
      property: "secondaryTextLeft",
      min: -100,
      max: 200,
    },
  ],
  [
    Xh,
    {
      property: "secondaryTextTop",
      min: -100,
      max: 200,
    },
  ],
  [
    Zh,
    {
      property: "airflowCoolColor",
    },
  ],
  [
    Qh,
    {
      property: "airflowHeatColor",
    },
  ],
  [
    eb,
    {
      property: "airflowOtherColor",
    },
  ],
  [
    tb,
    {
      property: "airflowAngle",
      min: -360,
      max: 360,
    },
  ],
  [
    nb,
    {
      property: "airflowCurve",
      min: -200,
      max: 200,
    },
  ],
  [
    ob,
    {
      property: "airflowLength",
      min: 10,
      max: 300,
    },
  ],
  [
    ib,
    {
      property: "airflowFadePosition",
      min: 15,
      max: 100,
    },
  ],
  [
    ab,
    {
      property: "airflowSpread",
      min: 10,
      max: 300,
    },
  ],
  [
    rb,
    {
      property: "airflowDensity",
      min: 20,
      max: 200,
    },
  ],
  [
    sb,
    {
      property: "airflowIrregularity",
      min: 0,
      max: 200,
    },
  ],
  [
    cb,
    {
      property: "airflowThickness",
      min: 5,
      max: 300,
    },
  ],
  [
    lb,
    {
      property: "airflowStrength",
      min: 0,
      max: 500,
    },
  ],
  [
    db,
    {
      property: "airflowBlur",
      min: 0,
      max: 30,
    },
  ],
  [
    zd,
    {
      property: "airflowSpeed",
      min: 0.3,
      max: 12,
    },
  ],
  [
    Ra,
    {
      property: "airflowOffsetX",
      limits: (limits, limits2) => {
        const limits3 = airflowCanvasOffsetBounds(limits, limits2.canvas);
        return {
          min: limits3.minX,
          max: limits3.maxX,
        };
      },
    },
  ],
  [
    Ha,
    {
      property: "airflowOffsetY",
      limits: (limits, limits2) => {
        const limits3 = airflowCanvasOffsetBounds(limits, limits2.canvas);
        return {
          min: limits3.minY,
          max: limits3.maxY,
        };
      },
    },
  ],
  [
    ub,
    {
      property: "airflowWidth",
      min: 1,
      max: 500,
    },
  ],
  [
    pb,
    {
      property: "airflowHeight",
      min: 1,
      max: 500,
    },
  ],
  [
    Vd,
    {
      property: "airflowScale",
      min: 1,
      max: 500,
      divisor: 100,
    },
  ],
  [
    Wd,
    {
      property: "airflowRotation",
      min: -360,
      max: 360,
    },
  ],
]);
const sL = new Map([
  [Rd, "left"],
  [Hd, "top"],
  [Zs, "width"],
  [Qs, "height"],
  [ja, "scale"],
  [ec, "rotation"],
]);
const cL = new Map([
  [
    wb,
    {
      property: "frameColor",
    },
  ],
  [
    Cb,
    {
      property: "frameWidth",
      min: 0,
      max: 20,
    },
  ],
  [
    Sb,
    {
      property: "radius",
      min: 0,
      max: 50,
      divisor: 100,
    },
  ],
  [
    xb,
    {
      property: "frameAngle",
      min: 0,
      max: 360,
    },
  ],
  [
    Nb,
    {
      property: "frameOpacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
]);
const lL = new Map([
  [
    fb,
    {
      property: "opacity",
      min: 0,
      max: 100,
      divisor: 100,
    },
  ],
]);
const dL = new Map([
  [Ud, "left"],
  [_d, "top"],
  [qa, "scale"],
  [oc, "rotation"],
]);
const uL = new Map([
  [Xd, "left"],
  [Kd, "top"],
  [rc, "width"],
  [sc, "height"],
  [Ua, "scale"],
  [cc, "rotation"],
]);
function Hi(value, value2, value3, value4) {
  const list = Array.isArray(value2) ? value2 : [value2];
  value.addEventListener("input", (value5) => {
    const value6 = O();
    if (!value6 || !list.includes(value6.type)) {
      return;
    }
    const value7 = value3.get(value5.target);
    if (value7) {
      const value9 =
        typeof value7.property == "function"
          ? value7.property(value6)
          : value7.property;
      let value10 =
        value5.target.type === "color"
          ? value5.target.value
          : Number(value5.target.value);
      if (value5.target.type !== "color") {
        if (!Number.isFinite(value10)) {
          return;
        }
        const value11 = value7.limits?.(value6, h.document) || value7;
        value10 =
          clampNumber(value10, value11.min, value11.max) /
          (value7.divisor || 1);
      }
      x?.previewComponentProperties(value6.id, {
        [value9]: value10,
      });
      return;
    }
    const value8 = value4.get(value5.target);
    const numeric = Number(value5.target.value);
    if (!value8 || !Number.isFinite(numeric)) {
      return;
    }
    const numeric2 = Number(h.document.canvas.width || 2778);
    const numeric3 = Number(h.document.canvas.height || 1940);
    const numeric4 = Number(value6.position?.width || 100);
    const numeric5 = Number(value6.position?.height || 100);
    if (value8 === "left") {
      x?.previewComponentTransform(value6.id, {
        x: (numeric2 * clampNumber(numeric, 0, 100)) / 100 - numeric4 / 2,
      });
    } else if (value8 === "top") {
      x?.previewComponentTransform(value6.id, {
        y: (numeric3 * clampNumber(numeric, 0, 100)) / 100 - numeric5 / 2,
      });
    } else if (value8 === "width") {
      x?.previewComponentTransform(value6.id, {
        width: (numeric2 * clampNumber(numeric, 0.1, 100)) / 100,
      });
    } else if (value8 === "height") {
      x?.previewComponentTransform(value6.id, {
        height: (numeric3 * clampNumber(numeric, 0.1, 100)) / 100,
      });
    } else if (value8 === "scale") {
      x?.previewComponentTransform(value6.id, {
        scale: clampNumber(numeric, 1, 500) / 100,
      });
    } else if (value8 === "rotation" && d0().length < 2) {
      x?.previewComponentTransform(value6.id, {
        rotation: clampNumber(numeric, -360, 360),
      });
    }
  });
  value.addEventListener("change", (value5) => {
    const value6 = value3.get(value5.target);
    const value7 = value4.get(value5.target);
    if (!value6 && !value7) {
      return;
    }
    if (
      value5.target.type === "number" &&
      !Number.isFinite(Number(value5.target.value))
    ) {
      Z();
      return;
    }
    const value8 = componentId;
    const value9 = value7 === "rotation" ? d0() : [];
    L((value10) => {
      const component = findComponent(value10, value8)?.component;
      if (!component || !list.includes(component.type)) {
        return;
      }
      component.properties = {
        ...(component.properties || {}),
      };
      component.position = {
        ...(component.position || {}),
      };
      component.style = {
        ...(component.style || {}),
      };
      if (value6) {
        const value11 =
          typeof value6.property == "function"
            ? value6.property(component)
            : value6.property;
        const value12 = value6.limits?.(component, value10) || value6;
        component.properties[value11] =
          value5.target.type === "color"
            ? value5.target.value
            : clampNumber(
                Number(value5.target.value),
                value12.min,
                value12.max,
              ) / (value6.divisor || 1);
        return;
      }
      const numeric = Number(value10.canvas.width || 2778);
      const numeric2 = Number(value10.canvas.height || 1940);
      const numeric3 = Number(value5.target.value);
      if (value7 === "left") {
        component.position.x =
          (numeric * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.width || 100) / 2;
      } else if (value7 === "top") {
        component.position.y =
          (numeric2 * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.height || 100) / 2;
      } else if (value7 === "width") {
        component.position.width =
          (numeric * clampNumber(numeric3, 0.1, 100)) / 100;
      } else if (value7 === "height") {
        component.position.height =
          (numeric2 * clampNumber(numeric3, 0.1, 100)) / 100;
      } else if (value7 === "scale") {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (value7 === "rotation") {
        Gt(value10, value8, clampNumber(numeric3, -360, 360), value9);
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
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (!component || component.type !== "device-button") {
        return;
      }
      const statePrecision = ["0", "1", "2", "3", "4"].includes(qs.value)
        ? Number(qs.value)
        : "auto";
      component.properties = {
        ...(component.properties || {}),
        statePrecision: statePrecision,
      };
    });
  }
});
Fa.addEventListener("change", () => {
  const value = componentId;
  if (value) {
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (!component || component.type !== "presence-sensor") {
        return;
      }
      const sensorKind = [
        "presence",
        "door-window",
        "water-leak",
        "smoke",
        "natural-gas",
      ].includes(Fa.value)
        ? Fa.value
        : "presence";
      component.properties = {
        ...(component.properties || {}),
        sensorKind: sensorKind,
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
    component.properties?.sensorKind === "door-window"
  ) {
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
    component.properties?.sensorKind === "door-window"
  ) {
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
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (
        !!component &&
        component.type === "presence-sensor" &&
        component.properties?.sensorKind === "door-window"
      ) {
        component.properties = {
          ...(component.properties || {}),
          perspectiveCorners: [...Bu],
        };
      }
    });
  }
});
hb.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-camera-fit]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const fit = value2.dataset.cameraFit === "contain" ? "contain" : "fill";
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (!!component && component.type === "camera") {
      component.properties = {
        ...(component.properties || {}),
        fit: fit,
      };
    }
  });
});
bb.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-camera-display-mode]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const displayMode =
    value2.dataset.cameraDisplayMode === "snapshot" ? "snapshot" : "live";
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (!!component && component.type === "camera") {
      component.properties = {
        ...(component.properties || {}),
        displayMode: displayMode,
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
  const refreshInterval = Number.isFinite(numeric)
    ? Math.max(6, Math.round(numeric))
    : 10;
  Ga.value = String(refreshInterval);
  L((value2) => {
    const component = findComponent(value2, value)?.component;
    if (!!component && component.type === "camera") {
      component.properties = {
        ...(component.properties || {}),
        refreshInterval: refreshInterval,
      };
    }
  });
});
yb.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (!!component && component.type === "camera") {
        component.properties = {
          ...(component.properties || {}),
          mediaVisible: component.properties?.mediaVisible === false,
        };
      }
    });
  }
});
vb.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (!!component && component.type === "camera") {
        component.properties = {
          ...(component.properties || {}),
          frameVisible: component.properties?.frameVisible === false,
        };
      }
    });
  }
});
function Kr(value, value2 = "auto") {
  if (!value) {
    return;
  }
  const value3 = ["on", "off"].includes(value2) ? value2 : "auto";
  Mo.set(value, value3);
  x?.setComponentPreviewState(value, value3);
}
Sh.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-air-conditioner-preview]");
  if (!!value2 && !!componentId) {
    Kr(componentId, value2.dataset.airConditionerPreview);
    Z();
  }
});
Ch.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-air-conditioner-device-type]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const deviceType = ["air-conditioner", "bath-heater"].includes(
    value2.dataset.airConditionerDeviceType,
  )
    ? value2.dataset.airConditionerDeviceType
    : "auto";
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (!!component && component.type === "air-conditioner") {
      component.properties = {
        ...(component.properties || {}),
        deviceType: deviceType,
      };
    }
  });
});
xh.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-air-conditioner-layer]");
  if (!value2 || !componentId) {
    return;
  }
  const value3 =
    value2.dataset.airConditionerLayer === "airflow" ? "airflow" : "button";
  Fu.set(componentId, value3);
  Kr(componentId, value3 === "airflow" ? "on" : "off");
  x?.setComponentSelectionLayer(componentId, value3);
  fn8();
  Z();
});
Kh.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    Kr(value, "on");
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (!!component && component.type === "air-conditioner") {
        component.properties = {
          ...(component.properties || {}),
          airflowVisible: component.properties?.airflowVisible === false,
        };
      }
    });
  }
});
for (const [t, e] of [
  [Eh, "iconVisible"],
  [Bh, "mainTextVisible"],
  [Hh, "secondaryTextVisible"],
]) {
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L((value2) => {
        const component = findComponent(value2, value)?.component;
        if (!!component && component.type === "air-conditioner") {
          component.properties = {
            ...(component.properties || {}),
            [e]: component.properties?.[e] === false,
          };
        }
      });
    }
  });
}
Jh.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-airflow-motion]");
  const value3 = componentId;
  if (!!value2 && !!value3) {
    Kr(value3, "on");
    L((value4) => {
      const component = findComponent(value4, value3)?.component;
      if (!!component && component.type === "air-conditioner") {
        component.properties = {
          ...(component.properties || {}),
          airflowMotion:
            value2.dataset.airflowMotion === "static" ? "static" : "dynamic",
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
  [bd, "on"],
]);
function pL(value) {
  for (const element of js.querySelectorAll("[data-icon-button-preview]")) {
    const value2 = element.dataset.iconButtonPreview === value;
    element.classList.toggle("active", value2);
    element.setAttribute("aria-pressed", String(value2));
  }
}
function kp(value, value2 = "auto") {
  if (!value) {
    return;
  }
  const value3 = ["on", "off"].includes(value2) ? value2 : "auto";
  if (value3 === "auto") {
    zn.delete(value);
  } else {
    zn.set(value, value3);
  }
  x?.setComponentPreviewState(value, value3);
  if (value === componentId) {
    pL(value3);
  }
}
function yw(value) {
  const value2 = O();
  const value3 =
    Zc.get(value) ||
    (value2?.type === "device-button" && value === fi ? "off" : null);
  if (
    !!value3 &&
    !!["icon-button", "device-button", "presence-sensor"].includes(value2?.type)
  ) {
    kp(value2.id, value3);
  }
}
function vw(value) {
  const value2 = O();
  if (!!Zc.has(value) || (value2?.type === "device-button" && value === fi)) {
    if (
      ["icon-button", "device-button", "presence-sensor"].includes(value2?.type)
    ) {
      kp(value2.id, "auto");
    }
  }
}
for (const t of ["focusin", "pointerdown", "input"]) {
  ui.addEventListener(t, (value) => yw(value.target));
}
Eg.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-cover-kind]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const coverKind = ["standard", "dream", "airer"].includes(
    value2.dataset.coverKind,
  )
    ? value2.dataset.coverKind
    : "auto";
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (
      component &&
      String(component.bindings?.entity?.entityId || "").startsWith("cover.")
    ) {
      component.properties = {
        ...(component.properties || {}),
        coverKind: coverKind,
      };
    }
  });
});
Lg.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-cover-direction]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const coverDirection = ["left", "right"].includes(
    value2.dataset.coverDirection,
  )
    ? value2.dataset.coverDirection
    : "split";
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (
      component &&
      String(component.bindings?.entity?.entityId || "").startsWith("cover.")
    ) {
      component.properties = {
        ...(component.properties || {}),
        coverDirection: coverDirection,
      };
    }
  });
});
Ig.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-cover-motor-direction]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const coverMotorDirection = ["normal", "reversed"].includes(
    value2.dataset.coverMotorDirection,
  )
    ? value2.dataset.coverMotorDirection
    : "auto";
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (
      component &&
      String(component.bindings?.entity?.entityId || "").startsWith("cover.")
    ) {
      component.properties = {
        ...(component.properties || {}),
        coverMotorDirection: coverMotorDirection,
      };
    }
  });
});
ui.addEventListener("focusout", (value) => {
  const value2 = O();
  if (
    (!!Zc.has(value.target) ||
      (value2?.type === "device-button" && value.target === fi)) &&
    (!(value.relatedTarget instanceof Node) ||
      !js.contains(value.relatedTarget))
  ) {
    window.requestAnimationFrame(() => {
      if (me === value.target && !pt.hidden) {
        return;
      }
      if (
        Zc.get(document.activeElement) ||
        (O()?.type === "device-button" && document.activeElement === fi
          ? "off"
          : null)
      ) {
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
  [Jf, "markerVisible"],
]) {
  t.addEventListener("click", () => {
    const value = componentId;
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (!!component && component.type === "title-button") {
        component.properties = {
          ...(component.properties || {}),
          [e]: component.properties?.[e] === false,
        };
      }
    });
  });
}
for (const [t, e] of [
  [rg, "iconVisible"],
  [dg, "titleVisible"],
  [gg, "countVisible"],
]) {
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L((value2) => {
        const component = findComponent(value2, value)?.component;
        if (!!component && component.type === "light-statistics") {
          component.properties = {
            ...(component.properties || {}),
            [e]: component.properties?.[e] === false,
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
  [gh, "personVisible"],
]) {
  t.addEventListener("click", () => {
    const value = componentId;
    L((value2) => {
      const component = findComponent(value2, value)?.component;
      if (
        !!component &&
        !!["icon-button", "device-button", "presence-sensor"].includes(
          component.type,
        ) &&
        (!e.endsWith("Visible") ||
          !["iconVisible", "mainTextVisible", "secondaryTextVisible"].includes(
            e,
          ) ||
          component.type === "device-button") &&
        (!["haloVisible", "personVisible"].includes(e) ||
          component.type === "presence-sensor")
      ) {
        component.properties = {
          ...(component.properties || {}),
          [e]: component.properties?.[e] === false,
        };
      }
    });
  });
}
js.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-icon-button-preview]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const value4 = ["on", "off"].includes(value2.dataset.iconButtonPreview)
    ? value2.dataset.iconButtonPreview
    : "auto";
  kp(value3, value4);
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
      resizes: true,
    },
  ],
  [
    Pb,
    {
      property: "fontWeight",
      minimum: 0,
      maximum: 1,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    kb,
    {
      property: "letterSpacing",
      minimum: -20,
      maximum: 100,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    Mb,
    {
      property: "opacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
      resizes: false,
    },
  ],
]);
const Mp = new Set([Ya, Xa, yo, gi]);
function mL(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const numeric2 = Number(value.position?.height || 100);
  const value2 = Number(value.position?.x || 0) + numeric / 2;
  const value3 = Number(value.position?.y || 0) + numeric2 / 2;
  const { width: width, height: height } = timeComponentDimensions(fallback);
  x?.previewComponentTransform(value.id, {
    x: value2 - width / 2,
    y: value3 - height / 2,
    width: width,
    height: height,
  });
}
_a.addEventListener("input", (value) => {
  const component = O();
  if (!component || component.type !== "time") {
    return;
  }
  const target = value.target;
  const value2 = ww.get(target);
  if (value2) {
    x?.previewComponentProperties(component.id, {
      [value2]: target.value,
    });
    return;
  }
  const value3 = Cw.get(target);
  if (value3) {
    if (
      String(target.value).trim() === "" ||
      !Number.isFinite(Number(target.value))
    ) {
      return;
    }
    const value4 =
      clampNumber(Number(target.value), value3.minimum, value3.maximum) /
      value3.divisor;
    const value5 = {
      ...(component.properties || {}),
      [value3.property]: value4,
    };
    x?.previewComponentProperties(component.id, {
      [value3.property]: value4,
    });
    if (value3.resizes) {
      mL(component, value5);
    }
    return;
  }
  if (
    !Mp.has(target) ||
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))
  ) {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(component.position?.width || 100);
  const numeric5 = Number(component.position?.height || 100);
  if (target === Ya) {
    const value4 = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      x: (numeric2 * value4) / 100 - numeric4 / 2,
    });
  } else if (target === Xa) {
    const value4 = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      y: (numeric3 * value4) / 100 - numeric5 / 2,
    });
  } else if (target === yo) {
    const value4 = clampNumber(numeric, 1, 500);
    x?.previewComponentTransform(component.id, {
      scale: value4 / 100,
    });
  } else if (target === gi) {
    const rotation = clampNumber(numeric, -360, 360);
    x?.previewComponentTransform(component.id, {
      rotation: rotation,
    });
  }
});
_a.addEventListener("change", (value) => {
  const target = value.target;
  const value2 = componentId;
  if (!value2) {
    return;
  }
  const value3 = ww.get(target);
  const value4 = Cw.get(target);
  if (!!value3 || !!value4 || !!Mp.has(target)) {
    if (
      (value4 || Mp.has(target)) &&
      (String(target.value).trim() === "" ||
        !Number.isFinite(Number(target.value)))
    ) {
      Z();
      return;
    }
    L((value5) => {
      const component = findComponent(value5, value2)?.component;
      if (!component || component.type !== "time") {
        return;
      }
      component.properties = {
        ...(component.properties || {}),
      };
      component.position = {
        ...(component.position || {}),
      };
      component.style = {
        ...(component.style || {}),
      };
      const numeric = Number(value5.canvas.width || 2778);
      const numeric2 = Number(value5.canvas.height || 1940);
      const numeric3 = Number(target.value);
      if (value3) {
        component.properties[value3] = target.value;
      } else if (value4) {
        component.properties[value4.property] =
          clampNumber(numeric3, value4.minimum, value4.maximum) /
          value4.divisor;
        if (value4.resizes) {
          j0(component, component.properties);
        }
      } else if (target === Ya) {
        component.position.x =
          (numeric * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.width || 100) / 2;
      } else if (target === Xa) {
        component.position.y =
          (numeric2 * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.height || 100) / 2;
      } else if (target === yo) {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (target === gi) {
        Gt(value5, value2, clampNumber(numeric3, -360, 360));
      }
    });
  }
});
for (const t of [Lb, Ib]) {
  t.addEventListener("click", (value) => {
    const value2 = componentId;
    const value3 = value.target.closest("[data-time-hour-format]");
    const value4 = value.target.closest("[data-time-seconds]");
    if (!!value2 && (!!value3 || !!value4)) {
      L((value5) => {
        const component = findComponent(value5, value2)?.component;
        if (!!component && component.type === "time") {
          component.properties = {
            ...(component.properties || {}),
          };
          if (value3) {
            component.properties.hour12 =
              value3.dataset.timeHourFormat === "12";
          }
          if (value4) {
            component.properties.showSeconds =
              value4.dataset.timeSeconds === "on";
          }
          j0(component, component.properties);
        }
      });
    }
  });
}
const Sw = new Map([
  [Fb, "primaryColor"],
  [Wb, "lunarColor"],
]);
const xw = new Map([
  [
    Db,
    {
      property: "primarySize",
      minimum: 12,
      maximum: 500,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    zb,
    {
      property: "primaryWeight",
      minimum: 0,
      maximum: 1,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    Vb,
    {
      property: "primarySpacing",
      minimum: -20,
      maximum: 100,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    Rb,
    {
      property: "lunarSize",
      minimum: 10,
      maximum: 500,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    Hb,
    {
      property: "lunarWeight",
      minimum: 0,
      maximum: 1,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    jb,
    {
      property: "lunarSpacing",
      minimum: -20,
      maximum: 100,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    qb,
    {
      property: "lineGap",
      minimum: 0,
      maximum: 200,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    Gb,
    {
      property: "opacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
      resizes: false,
    },
  ],
]);
const Op = new Set([Ja, Za, vo, hi]);
function fL(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const numeric2 = Number(value.position?.height || 100);
  const value2 = Number(value.position?.x || 0) + numeric / 2;
  const value3 = Number(value.position?.y || 0) + numeric2 / 2;
  const { width: width, height: height } = dateComponentDimensions(fallback);
  x?.previewComponentTransform(value.id, {
    x: value2 - width / 2,
    y: value3 - height / 2,
    width: width,
    height: height,
  });
}
Ka.addEventListener("input", (value) => {
  const component = O();
  if (!component || component.type !== "date") {
    return;
  }
  const target = value.target;
  const value2 = Sw.get(target);
  if (value2) {
    x?.previewComponentProperties(component.id, {
      [value2]: target.value,
    });
    return;
  }
  const value3 = xw.get(target);
  if (value3) {
    if (
      String(target.value).trim() === "" ||
      !Number.isFinite(Number(target.value))
    ) {
      return;
    }
    const value4 =
      clampNumber(Number(target.value), value3.minimum, value3.maximum) /
      value3.divisor;
    const value5 = {
      ...(component.properties || {}),
      [value3.property]: value4,
    };
    x?.previewComponentProperties(component.id, {
      [value3.property]: value4,
    });
    if (value3.resizes) {
      fL(component, value5);
    }
    return;
  }
  if (
    !Op.has(target) ||
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))
  ) {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(component.position?.width || 100);
  const numeric5 = Number(component.position?.height || 100);
  if (target === Ja) {
    const value4 = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      x: (numeric2 * value4) / 100 - numeric4 / 2,
    });
  } else if (target === Za) {
    const value4 = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      y: (numeric3 * value4) / 100 - numeric5 / 2,
    });
  } else if (target === vo) {
    const value4 = clampNumber(numeric, 1, 500);
    x?.previewComponentTransform(component.id, {
      scale: value4 / 100,
    });
  } else if (target === hi) {
    const rotation = clampNumber(numeric, -360, 360);
    x?.previewComponentTransform(component.id, {
      rotation: rotation,
    });
  }
});
Ka.addEventListener("change", (value) => {
  const target = value.target;
  const value2 = componentId;
  if (!value2) {
    return;
  }
  const value3 = Sw.get(target);
  const value4 = xw.get(target);
  if (!!value3 || !!value4 || !!Op.has(target)) {
    if (
      (value4 || Op.has(target)) &&
      (String(target.value).trim() === "" ||
        !Number.isFinite(Number(target.value)))
    ) {
      Z();
      return;
    }
    L((value5) => {
      const component = findComponent(value5, value2)?.component;
      if (!component || component.type !== "date") {
        return;
      }
      component.properties = {
        ...(component.properties || {}),
      };
      component.position = {
        ...(component.position || {}),
      };
      component.style = {
        ...(component.style || {}),
      };
      const numeric = Number(value5.canvas.width || 2778);
      const numeric2 = Number(value5.canvas.height || 1940);
      const numeric3 = Number(target.value);
      if (value3) {
        component.properties[value3] = target.value;
      } else if (value4) {
        component.properties[value4.property] =
          clampNumber(numeric3, value4.minimum, value4.maximum) /
          value4.divisor;
        if (value4.resizes) {
          q0(component, component.properties);
        }
      } else if (target === Ja) {
        component.position.x =
          (numeric * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.width || 100) / 2;
      } else if (target === Za) {
        component.position.y =
          (numeric2 * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.height || 100) / 2;
      } else if (target === vo) {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (target === hi) {
        Gt(value5, value2, clampNumber(numeric3, -360, 360));
      }
    });
  }
});
for (const t of [Bb, $b]) {
  t.addEventListener("click", (value) => {
    const value2 = componentId;
    const value3 = value.target.closest("[data-date-weekday]");
    const value4 = value.target.closest("[data-date-lunar]");
    if (!!value2 && (!!value3 || !!value4)) {
      L((value5) => {
        const component = findComponent(value5, value2)?.component;
        if (!!component && component.type === "date") {
          component.properties = {
            ...(component.properties || {}),
          };
          if (value3) {
            component.properties.showWeekday =
              value3.dataset.dateWeekday === "on";
          }
          if (value4) {
            component.properties.showLunar = value4.dataset.dateLunar === "on";
          }
          q0(component, component.properties);
        }
      });
    }
  });
}
const Nw = new Map([
  [Qb, "temperatureColor"],
  [oy, "secondaryColor"],
]);
const Ew = new Map([
  [
    Jb,
    {
      property: "iconSize",
      minimum: 12,
      maximum: 500,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    Zb,
    {
      property: "iconGap",
      minimum: 0,
      maximum: 300,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    ey,
    {
      property: "temperatureSize",
      minimum: 12,
      maximum: 500,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    ty,
    {
      property: "temperatureWeight",
      minimum: 0,
      maximum: 1,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    ny,
    {
      property: "temperatureSpacing",
      minimum: -20,
      maximum: 100,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    iy,
    {
      property: "secondarySize",
      minimum: 10,
      maximum: 500,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    ay,
    {
      property: "secondaryWeight",
      minimum: 0,
      maximum: 1,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    ry,
    {
      property: "secondarySpacing",
      minimum: -20,
      maximum: 100,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    sy,
    {
      property: "lineGap",
      minimum: 0,
      maximum: 200,
      divisor: 1,
      resizes: true,
    },
  ],
  [
    cy,
    {
      property: "opacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
      resizes: false,
    },
  ],
]);
const Bp = new Set([er, tr, wo, bi]);
function gL(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const numeric2 = Number(value.position?.height || 100);
  const value2 = Number(value.position?.x || 0) + numeric / 2;
  const value3 = Number(value.position?.y || 0) + numeric2 / 2;
  const { width: width, height: height } = weatherComponentDimensions(fallback);
  x?.previewComponentTransform(value.id, {
    x: value2 - width / 2,
    y: value3 - height / 2,
    width: width,
    height: height,
  });
}
Qa.addEventListener("input", (value) => {
  const component = O();
  if (!component || component.type !== "weather") {
    return;
  }
  const target = value.target;
  const value2 = Nw.get(target);
  if (value2) {
    x?.previewComponentProperties(component.id, {
      [value2]: target.value,
    });
    return;
  }
  const value3 = Ew.get(target);
  if (value3) {
    if (
      String(target.value).trim() === "" ||
      !Number.isFinite(Number(target.value))
    ) {
      return;
    }
    const value4 =
      clampNumber(Number(target.value), value3.minimum, value3.maximum) /
      value3.divisor;
    const value5 = {
      ...(component.properties || {}),
      [value3.property]: value4,
    };
    x?.previewComponentProperties(component.id, {
      [value3.property]: value4,
    });
    if (value3.resizes) {
      gL(component, value5);
    }
    return;
  }
  if (
    !Bp.has(target) ||
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))
  ) {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(component.position?.width || 100);
  const numeric5 = Number(component.position?.height || 100);
  if (target === er) {
    const value4 = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      x: (numeric2 * value4) / 100 - numeric4 / 2,
    });
  } else if (target === tr) {
    const value4 = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(component.id, {
      y: (numeric3 * value4) / 100 - numeric5 / 2,
    });
  } else if (target === wo) {
    const value4 = clampNumber(numeric, 1, 500);
    x?.previewComponentTransform(component.id, {
      scale: value4 / 100,
    });
  } else if (target === bi) {
    const rotation = clampNumber(numeric, -360, 360);
    x?.previewComponentTransform(component.id, {
      rotation: rotation,
    });
  }
});
Qa.addEventListener("change", (value) => {
  const target = value.target;
  const value2 = componentId;
  if (!value2) {
    return;
  }
  const value3 = Nw.get(target);
  const value4 = Ew.get(target);
  if (!!value3 || !!value4 || !!Bp.has(target)) {
    if (
      (value4 || Bp.has(target)) &&
      (String(target.value).trim() === "" ||
        !Number.isFinite(Number(target.value)))
    ) {
      Z();
      return;
    }
    L((value5) => {
      const component = findComponent(value5, value2)?.component;
      if (!component || component.type !== "weather") {
        return;
      }
      component.properties = {
        ...(component.properties || {}),
      };
      component.position = {
        ...(component.position || {}),
      };
      component.style = {
        ...(component.style || {}),
      };
      const numeric = Number(value5.canvas.width || 2778);
      const numeric2 = Number(value5.canvas.height || 1940);
      const numeric3 = Number(target.value);
      if (value3) {
        component.properties[value3] = target.value;
      } else if (value4) {
        component.properties[value4.property] =
          clampNumber(numeric3, value4.minimum, value4.maximum) /
          value4.divisor;
        if (value4.resizes) {
          G0(component, component.properties);
        }
      } else if (target === er) {
        component.position.x =
          (numeric * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.width || 100) / 2;
      } else if (target === tr) {
        component.position.y =
          (numeric2 * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.height || 100) / 2;
      } else if (target === wo) {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (target === bi) {
        Gt(value5, value2, clampNumber(numeric3, -360, 360));
      }
    });
  }
});
for (const t of [_b, Yb, Xb, Kb]) {
  t.addEventListener("click", (value) => {
    const value2 = componentId;
    const value3 = value.target.closest("button");
    if (!value2 || !value3) {
      return;
    }
    const value4 = [
      ["weatherIconVisible", "iconVisible"],
      ["weatherTemperatureVisible", "temperatureVisible"],
      ["weatherConditionVisible", "conditionVisible"],
      ["weatherHumidityVisible", "humidityVisible"],
    ].find(([value7]) => value3.dataset[value7] !== undefined);
    if (!value4) {
      return;
    }
    const [value5, value6] = value4;
    L((value7) => {
      const component = findComponent(value7, value2)?.component;
      if (!!component && component.type === "weather") {
        component.properties = {
          ...(component.properties || {}),
          [value6]: value3.dataset[value5] === "on",
        };
        G0(component, component.properties);
      }
    });
  });
}
const Lw = new Map([
  [py, "valueColor"],
  [my, "statePrecision"],
  [tu, "thresholdMode"],
]);
const Iw = new Map([
  [
    uy,
    {
      property: "valueScale",
      minimum: 10,
      maximum: 500,
      divisor: 1,
    },
  ],
  [
    fy,
    {
      property: "valueOffsetX",
      minimum: -100,
      maximum: 100,
      divisor: 1,
    },
  ],
  [
    gy,
    {
      property: "valueOffsetY",
      minimum: -100,
      maximum: 100,
      divisor: 1,
    },
  ],
  [
    hy,
    {
      property: "updateInterval",
      minimum: 30,
      maximum: 86400,
      divisor: 1,
    },
  ],
  [
    by,
    {
      property: "hours",
      minimum: 1,
      maximum: 168,
      divisor: 1,
    },
  ],
  [
    yy,
    {
      property: "cornerRadius",
      minimum: 0,
      maximum: 50,
      divisor: 1,
    },
  ],
]);
const $p = new Set([or, ir, vi, wi, Co, Ci]);
nr.addEventListener("input", (value) => {
  const value2 = O();
  if (!value2 || value2.type !== "line-chart") {
    return;
  }
  const target = value.target;
  const value3 = Lw.get(target);
  const value4 = Iw.get(target);
  if (value3) {
    x?.previewComponentProperties(value2.id, {
      [value3]: target.value,
    });
    return;
  }
  if (value4) {
    if (
      String(target.value).trim() === "" ||
      !Number.isFinite(Number(target.value))
    ) {
      return;
    }
    const value7 = clampNumber(
      Number(target.value),
      value4.minimum,
      value4.maximum,
    );
    if (!["updateInterval", "hours"].includes(value4.property)) {
      x?.previewComponentProperties(value2.id, {
        [value4.property]: value7 / value4.divisor,
      });
    }
    return;
  }
  if (
    yi.findIndex(
      (element) => element.value === target || element.color === target,
    ) >= 0
  ) {
    const thresholds = yi.map((element) => ({
      value: Number(element.value.value),
      color: element.color.value,
    }));
    if (thresholds.every((element) => Number.isFinite(element.value))) {
      x?.previewComponentProperties(value2.id, {
        thresholdMode: "manual",
        thresholds: thresholds,
      });
    }
    return;
  }
  if (
    !$p.has(target) ||
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))
  ) {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(value2.position?.width || 100);
  const numeric5 = Number(value2.position?.height || 100);
  const value5 = Number(value2.position?.x || 0) + numeric4 / 2;
  const value6 = Number(value2.position?.y || 0) + numeric5 / 2;
  if (target === or) {
    x?.previewComponentTransform(value2.id, {
      x: (numeric2 * clampNumber(numeric, 0, 100)) / 100 - numeric4 / 2,
    });
  } else if (target === ir) {
    x?.previewComponentTransform(value2.id, {
      y: (numeric3 * clampNumber(numeric, 0, 100)) / 100 - numeric5 / 2,
    });
  } else if (target === vi) {
    const width = (numeric2 * clampNumber(numeric, 0.1, 100)) / 100;
    x?.previewComponentTransform(value2.id, {
      x: value5 - width / 2,
      width: width,
    });
  } else if (target === wi) {
    const height = (numeric3 * clampNumber(numeric, 0.1, 100)) / 100;
    x?.previewComponentTransform(value2.id, {
      y: value6 - height / 2,
      height: height,
    });
  } else if (target === Co) {
    x?.previewComponentTransform(value2.id, {
      scale: clampNumber(numeric, 1, 500) / 100,
    });
  } else if (target === Ci) {
    x?.previewComponentTransform(value2.id, {
      rotation: clampNumber(numeric, -360, 360),
    });
  }
});
nr.addEventListener("change", (value) => {
  const target = value.target;
  const value2 = componentId;
  if (!value2) {
    return;
  }
  const value3 = Lw.get(target);
  const value4 = Iw.get(target);
  const value5 = yi.findIndex(
    (element) => element.value === target || element.color === target,
  );
  if (!!value3 || !!value4 || !(value5 < 0) || !!$p.has(target)) {
    if (
      (value4 || $p.has(target) || (value5 >= 0 && target.type === "number")) &&
      (String(target.value).trim() === "" ||
        !Number.isFinite(Number(target.value)))
    ) {
      Z();
      return;
    }
    L((value6) => {
      const component = findComponent(value6, value2)?.component;
      if (!component || component.type !== "line-chart") {
        return;
      }
      component.properties = {
        ...(component.properties || {}),
      };
      component.position = {
        ...(component.position || {}),
      };
      component.style = {
        ...(component.style || {}),
      };
      const numeric = Number(value6.canvas.width || 2778);
      const numeric2 = Number(value6.canvas.height || 1940);
      const numeric3 = Number(component.position.width || 100);
      const numeric4 = Number(component.position.height || 100);
      const value7 = Number(component.position.x || 0) + numeric3 / 2;
      const value8 = Number(component.position.y || 0) + numeric4 / 2;
      const numeric5 = Number(target.value);
      if (value3) {
        component.properties[value3] = target.value;
        if (
          target === tu &&
          target.value === "manual" &&
          (!Array.isArray(component.properties.thresholds) ||
            !component.properties.thresholds.some((element) =>
              Number.isFinite(Number(element?.value)),
            ))
        ) {
          component.properties.thresholds = yi.map((element) => ({
            value: Number(element.value.value),
            color: element.color.value,
          }));
        }
      } else if (value4) {
        component.properties[value4.property] =
          clampNumber(numeric5, value4.minimum, value4.maximum) /
          value4.divisor;
      } else if (value5 >= 0) {
        component.properties.thresholdMode = "manual";
        component.properties.thresholds = yi.map((element) => ({
          value: Number(element.value.value),
          color: element.color.value,
        }));
      } else if (target === or) {
        component.position.x =
          (numeric * clampNumber(numeric5, 0, 100)) / 100 - numeric3 / 2;
      } else if (target === ir) {
        component.position.y =
          (numeric2 * clampNumber(numeric5, 0, 100)) / 100 - numeric4 / 2;
      } else if (target === vi) {
        component.position.width =
          (numeric * clampNumber(numeric5, 0.1, 100)) / 100;
        component.position.x = value7 - component.position.width / 2;
      } else if (target === wi) {
        component.position.height =
          (numeric2 * clampNumber(numeric5, 0.1, 100)) / 100;
        component.position.y = value8 - component.position.height / 2;
      } else if (target === Co) {
        component.style.scale = clampNumber(numeric5, 1, 500) / 100;
      } else if (target === Ci) {
        Gt(value6, value2, clampNumber(numeric5, -360, 360));
      }
    });
  }
});
dy.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-line-chart-value-visible]");
  const value3 = componentId;
  if (!!value2 && !!value3) {
    L((value4) => {
      const component = findComponent(value4, value3)?.component;
      if (!!component && component.type === "line-chart") {
        component.properties = {
          ...(component.properties || {}),
          valueVisible: value2.dataset.lineChartValueVisible === "on",
        };
      }
    });
  }
});
const Tw = new Map([
  [Sy, "mainColor"],
  [ky, "secondaryColor"],
  [Vy, "edgeColor"],
  [Gy, "glowColor"],
]);
const Aw = new Map([
  [
    xy,
    {
      property: "mainSize",
      minimum: 8,
      maximum: 500,
      divisor: 1,
    },
  ],
  [
    Ny,
    {
      property: "mainWeight",
      minimum: 0,
      maximum: 3,
      divisor: 1,
    },
  ],
  [
    Ey,
    {
      property: "mainOpacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
    },
  ],
  [
    Ly,
    {
      property: "mainSpacing",
      minimum: -20,
      maximum: 100,
      divisor: 1,
    },
  ],
  [
    Iy,
    {
      property: "mainTextLeft",
      minimum: -100,
      maximum: 200,
      divisor: 1,
    },
  ],
  [
    Ty,
    {
      property: "mainTextTop",
      minimum: -100,
      maximum: 200,
      divisor: 1,
    },
  ],
  [
    My,
    {
      property: "secondarySize",
      minimum: 6,
      maximum: 500,
      divisor: 1,
    },
  ],
  [
    Oy,
    {
      property: "secondaryWeight",
      minimum: 0,
      maximum: 3,
      divisor: 1,
    },
  ],
  [
    By,
    {
      property: "secondaryOpacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
    },
  ],
  [
    $y,
    {
      property: "secondarySpacing",
      minimum: -20,
      maximum: 100,
      divisor: 1,
    },
  ],
  [
    Fy,
    {
      property: "secondaryTextLeft",
      minimum: -100,
      maximum: 200,
      divisor: 1,
    },
  ],
  [
    Dy,
    {
      property: "secondaryTextTop",
      minimum: -100,
      maximum: 200,
      divisor: 1,
    },
  ],
  [
    Wy,
    {
      property: "edgeWidth",
      minimum: 0,
      maximum: 20,
      divisor: 1,
    },
  ],
  [
    Ry,
    {
      property: "edgeOpacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
    },
  ],
  [
    Hy,
    {
      property: "radius",
      minimum: 0,
      maximum: 50,
      divisor: 100,
    },
  ],
  [
    jy,
    {
      property: "edgeAngle",
      minimum: 0,
      maximum: 360,
      divisor: 1,
    },
  ],
  [
    Uy,
    {
      property: "glowStrength",
      minimum: 0,
      maximum: 500,
      divisor: 100,
    },
  ],
  [
    _y,
    {
      property: "glowSize",
      minimum: 0,
      maximum: 300,
      divisor: 100,
    },
  ],
  [
    Yy,
    {
      property: "glowAngle",
      minimum: 0,
      maximum: 360,
      divisor: 1,
    },
  ],
]);
const Fp = new Set([rr, sr, Si, xi, So, Ni]);
ar.addEventListener("input", (value) => {
  const value2 = O();
  if (!value2 || value2.type !== "panel-frame") {
    return;
  }
  const target = value.target;
  const value3 = Tw.get(target);
  const value4 = Aw.get(target);
  if (value3) {
    x?.previewComponentProperties(value2.id, {
      [value3]: target.value,
    });
    return;
  }
  if (value4) {
    if (
      String(target.value).trim() === "" ||
      !Number.isFinite(Number(target.value))
    ) {
      return;
    }
    const value7 = clampNumber(
      Number(target.value),
      value4.minimum,
      value4.maximum,
    );
    x?.previewComponentProperties(value2.id, {
      [value4.property]: value7 / value4.divisor,
    });
    return;
  }
  if (
    !Fp.has(target) ||
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))
  ) {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(value2.position?.width || 100);
  const numeric5 = Number(value2.position?.height || 100);
  const value5 = Number(value2.position?.x || 0) + numeric4 / 2;
  const value6 = Number(value2.position?.y || 0) + numeric5 / 2;
  if (target === rr) {
    x?.previewComponentTransform(value2.id, {
      x: (numeric2 * clampNumber(numeric, 0, 100)) / 100 - numeric4 / 2,
    });
  } else if (target === sr) {
    x?.previewComponentTransform(value2.id, {
      y: (numeric3 * clampNumber(numeric, 0, 100)) / 100 - numeric5 / 2,
    });
  } else if (target === Si) {
    const width = (numeric2 * clampNumber(numeric, 0.1, 100)) / 100;
    x?.previewComponentTransform(value2.id, {
      x: value5 - width / 2,
      width: width,
    });
  } else if (target === xi) {
    const height = (numeric3 * clampNumber(numeric, 0.1, 100)) / 100;
    x?.previewComponentTransform(value2.id, {
      y: value6 - height / 2,
      height: height,
    });
  } else if (target === So) {
    x?.previewComponentTransform(value2.id, {
      scale: clampNumber(numeric, 1, 500) / 100,
    });
  } else if (target === Ni) {
    x?.previewComponentTransform(value2.id, {
      rotation: clampNumber(numeric, -360, 360),
    });
  }
});
ar.addEventListener("change", (value) => {
  const target = value.target;
  const value2 = componentId;
  if (!value2) {
    return;
  }
  const value3 = Tw.get(target);
  const value4 = Aw.get(target);
  if (!!value3 || !!value4 || !!Fp.has(target)) {
    if (
      (value4 || Fp.has(target)) &&
      (String(target.value).trim() === "" ||
        !Number.isFinite(Number(target.value)))
    ) {
      Z();
      return;
    }
    L((value5) => {
      const component = findComponent(value5, value2)?.component;
      if (!component || component.type !== "panel-frame") {
        return;
      }
      component.properties = {
        ...(component.properties || {}),
      };
      component.position = {
        ...(component.position || {}),
      };
      component.style = {
        ...(component.style || {}),
      };
      const numeric = Number(value5.canvas.width || 2778);
      const numeric2 = Number(value5.canvas.height || 1940);
      const numeric3 = Number(component.position.width || 100);
      const numeric4 = Number(component.position.height || 100);
      const value6 = Number(component.position.x || 0) + numeric3 / 2;
      const value7 = Number(component.position.y || 0) + numeric4 / 2;
      const numeric5 = Number(target.value);
      if (value3) {
        component.properties[value3] = target.value;
      } else if (value4) {
        component.properties[value4.property] =
          clampNumber(numeric5, value4.minimum, value4.maximum) /
          value4.divisor;
      } else if (target === rr) {
        component.position.x =
          (numeric * clampNumber(numeric5, 0, 100)) / 100 - numeric3 / 2;
      } else if (target === sr) {
        component.position.y =
          (numeric2 * clampNumber(numeric5, 0, 100)) / 100 - numeric4 / 2;
      } else if (target === Si) {
        component.position.width =
          (numeric * clampNumber(numeric5, 0.1, 100)) / 100;
        component.position.x = value6 - component.position.width / 2;
      } else if (target === xi) {
        component.position.height =
          (numeric2 * clampNumber(numeric5, 0.1, 100)) / 100;
        component.position.y = value7 - component.position.height / 2;
      } else if (target === So) {
        component.style.scale = clampNumber(numeric5, 1, 500) / 100;
      } else if (target === Ni) {
        Gt(value5, value2, clampNumber(numeric5, -360, 360));
      }
    });
  }
});
for (const [t, e] of [
  [wy, "mainTextVisible"],
  [Ay, "secondaryTextVisible"],
  [zy, "edgeVisible"],
  [qy, "glowVisible"],
]) {
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L((value2) => {
        const component = findComponent(value2, value)?.component;
        if (!!component && component.type === "panel-frame") {
          component.properties = {
            ...(component.properties || {}),
            [e]: component.properties?.[e] === false,
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
  [vv, "glowColor"],
]);
const zp = new Map([
  [
    nv,
    {
      property: "mainSize",
      minimum: 1,
      maximum: 500,
      divisor: 1,
    },
  ],
  [
    ov,
    {
      property: "secondarySize",
      minimum: 1,
      maximum: 500,
      divisor: 1,
    },
  ],
  [
    iv,
    {
      property: "mainWeight",
      minimum: 0,
      maximum: 3,
      divisor: 1,
    },
  ],
  [
    av,
    {
      property: "secondaryWeight",
      minimum: 0,
      maximum: 3,
      divisor: 1,
    },
  ],
  [
    rv,
    {
      property: "mainSpacing",
      minimum: -20,
      maximum: 100,
      divisor: 1,
    },
  ],
  [
    sv,
    {
      property: "secondarySpacing",
      minimum: -20,
      maximum: 100,
      divisor: 1,
    },
  ],
  [
    cv,
    {
      property: "mainTextLeft",
      minimum: -100,
      maximum: 200,
      divisor: 1,
    },
  ],
  [
    lv,
    {
      property: "mainTextTop",
      minimum: -100,
      maximum: 200,
      divisor: 1,
    },
  ],
  [
    dv,
    {
      property: "secondaryTextLeft",
      minimum: -100,
      maximum: 200,
      divisor: 1,
    },
  ],
  [
    uv,
    {
      property: "secondaryTextTop",
      minimum: -100,
      maximum: 200,
      divisor: 1,
    },
  ],
  [
    su,
    {
      property: "textIdleOpacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
    },
  ],
  [
    cu,
    {
      property: "textActiveOpacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
    },
  ],
  [
    mv,
    {
      property: "iconSize",
      minimum: 1,
      maximum: 500,
      divisor: 1,
    },
  ],
  [
    fv,
    {
      property: "iconLeft",
      minimum: -100,
      maximum: 200,
      divisor: 1,
    },
  ],
  [
    gv,
    {
      property: "iconTop",
      minimum: -100,
      maximum: 200,
      divisor: 1,
    },
  ],
  [
    lu,
    {
      property: "iconIdleOpacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
    },
  ],
  [
    du,
    {
      property: "iconActiveOpacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
    },
  ],
  [
    bv,
    {
      property: "frameWidth",
      minimum: 0,
      maximum: 20,
      divisor: 1,
    },
  ],
  [
    uu,
    {
      property: "frameIdleOpacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
    },
  ],
  [
    pu,
    {
      property: "frameActiveOpacity",
      minimum: 0,
      maximum: 100,
      divisor: 100,
    },
  ],
  [
    Cv,
    {
      property: "radius",
      minimum: 0,
      maximum: 50,
      divisor: 100,
    },
  ],
  [
    yv,
    {
      property: "frameAngle",
      minimum: 0,
      maximum: 360,
      divisor: 1,
    },
  ],
  [
    wv,
    {
      property: "glowAngle",
      minimum: 0,
      maximum: 360,
      divisor: 1,
    },
  ],
  [
    mu,
    {
      property: "glowIdleStrength",
      minimum: 0,
      maximum: 500,
      divisor: 100,
    },
  ],
  [
    fu,
    {
      property: "glowIdleSize",
      minimum: 0,
      maximum: 300,
      divisor: 100,
    },
  ],
  [
    gu,
    {
      property: "glowActiveStrength",
      minimum: 0,
      maximum: 500,
      divisor: 100,
    },
  ],
  [
    hu,
    {
      property: "glowActiveSize",
      minimum: 0,
      maximum: 300,
      divisor: 100,
    },
  ],
]);
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
  [hu, "on"],
]);
function hL(value) {
  if (value) {
    for (const element of nu.querySelectorAll("[data-navigation-preview]")) {
      element.classList.toggle(
        "active",
        element.dataset.navigationPreview === value,
      );
    }
  }
}
function kw(value, value2) {
  if (!value) {
    return;
  }
  const value3 = ["on", "off"].includes(value2) ? value2 : "auto";
  if (value3 === "auto") {
    Pi.delete(value);
  } else {
    Pi.set(value, value3);
  }
  x?.setComponentPreviewState(value, value3);
  if (value === componentId) {
    hL(value3);
  }
}
function Vp(value) {
  const value2 = Pw.get(value);
  const value3 = O();
  if (!value2 || value3?.type !== "navigation-button") {
    return null;
  } else {
    kw(value3.id, value2);
    return value2;
  }
}
const Wp = new Set([ur, pr, xo, No, An, Eo]);
function bL(value) {
  const value2 = Dp.get(value);
  if (value2 && Zr[value2]) {
    return value2;
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
  const value2 = O();
  if (!value2 || value2.type !== "navigation-button") {
    return;
  }
  const target = value.target;
  const value3 = Dp.get(target);
  if (value3) {
    if (!lw.has(target)) {
      x?.previewComponentProperties(value2.id, {
        [value3]: target.value,
      });
    }
    return;
  }
  const value4 = zp.get(target);
  if (value4) {
    if (
      String(target.value).trim() === "" ||
      !Number.isFinite(Number(target.value))
    ) {
      return;
    }
    const value5 = clampNumber(
      Number(target.value),
      value4.minimum,
      value4.maximum,
    );
    Vp(target);
    x?.previewComponentProperties(value2.id, {
      [value4.property]: value5 / value4.divisor,
    });
    return;
  }
  if (
    !Wp.has(target) ||
    String(target.value).trim() === "" ||
    !Number.isFinite(Number(target.value))
  ) {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(value2.position?.width || 100);
  const numeric5 = Number(value2.position?.height || 100);
  if (target === ur) {
    const value5 = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(value2.id, {
      x: (numeric2 * value5) / 100 - numeric4 / 2,
    });
  } else if (target === pr) {
    const value5 = clampNumber(numeric, 0, 100);
    x?.previewComponentTransform(value2.id, {
      y: (numeric3 * value5) / 100 - numeric5 / 2,
    });
  } else if (target === xo) {
    const value5 = clampNumber(numeric, 0.1, 100);
    const width = (numeric2 * value5) / 100;
    const value6 = Number(value2.position?.x || 0) + numeric4 / 2;
    x?.previewComponentTransform(value2.id, {
      x: value6 - width / 2,
      width: width,
    });
  } else if (target === No) {
    const value5 = clampNumber(numeric, 0.1, 100);
    const height = (numeric3 * value5) / 100;
    const value6 = Number(value2.position?.y || 0) + numeric5 / 2;
    x?.previewComponentTransform(value2.id, {
      y: value6 - height / 2,
      height: height,
    });
  } else if (target === An) {
    const value5 = clampNumber(numeric, 1, 500);
    x?.previewComponentTransform(value2.id, {
      scale: value5 / 100,
    });
  } else if (target === Eo) {
    const rotation = clampNumber(numeric, -360, 360);
    x?.previewComponentTransform(value2.id, {
      rotation: rotation,
    });
  }
});
Ei.addEventListener("focusin", (value) => {
  Vp(value.target);
});
Ei.addEventListener("change", (value) => {
  const target = value.target;
  const value2 = componentId;
  if (!value2) {
    return;
  }
  const value3 = Dp.get(target);
  const value4 = zp.get(target);
  const value5 = Pw.get(target);
  const value6 = bL(target);
  if (target === pc || !!value3 || !!value4 || !!Wp.has(target)) {
    if (
      (value4 || Wp.has(target)) &&
      (String(target.value).trim() === "" ||
        !Number.isFinite(Number(target.value)))
    ) {
      Z();
      return;
    }
    if (value5) {
      Vp(target);
    }
    L((value7) => {
      const component = findComponent(value7, value2)?.component;
      if (!component || component.type !== "navigation-button") {
        return;
      }
      component.properties = {
        ...(component.properties || {}),
      };
      component.position = {
        ...(component.position || {}),
      };
      component.style = {
        ...(component.style || {}),
      };
      component.actions = {
        ...(component.actions || {}),
      };
      const value8 = value6 ? Ae(component, value6) : undefined;
      const numeric = Number(value7.canvas.width || 2778);
      const numeric2 = Number(value7.canvas.height || 1940);
      const numeric3 = Number(target.value);
      if (target === pc) {
        component.properties.label = target.value.trim();
      } else if (value3) {
        component.properties[value3] = target.value;
      } else if (value4) {
        component.properties[value4.property] =
          clampNumber(numeric3, value4.minimum, value4.maximum) /
          value4.divisor;
      } else if (target === ur) {
        component.position.x =
          (numeric * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.width || 100) / 2;
      } else if (target === pr) {
        component.position.y =
          (numeric2 * clampNumber(numeric3, 0, 100)) / 100 -
          Number(component.position.height || 100) / 2;
      } else if (target === xo) {
        const value9 = (numeric * clampNumber(numeric3, 0.1, 100)) / 100;
        const value10 =
          Number(component.position.x || 0) +
          Number(component.position.width || 100) / 2;
        component.position.x = value10 - value9 / 2;
        component.position.width = value9;
      } else if (target === No) {
        const value9 = (numeric2 * clampNumber(numeric3, 0.1, 100)) / 100;
        const value10 =
          Number(component.position.y || 0) +
          Number(component.position.height || 100) / 2;
        component.position.y = value10 - value9 / 2;
        component.position.height = value9;
      } else if (target === An) {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (target === Eo) {
        Gt(value7, value2, clampNumber(numeric3, -360, 360));
      }
      if (value6) {
        Kn(value2, value6, value8, Ae(component, value6));
      }
    });
  }
});
const yL = new Map([
  [Xy, "mainTextVisible"],
  [Ky, "secondaryTextVisible"],
  [Jy, "iconVisible"],
  [Zy, "frameVisible"],
  [Qy, "glowVisible"],
]);
for (const [t, e] of yL) {
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L((value2) => {
        const component = findComponent(value2, value)?.component;
        if (!component || component.type !== "navigation-button") {
          return;
        }
        const value3 = Ae(component, e);
        component.properties = {
          ...(component.properties || {}),
          [e]: component.properties?.[e] === false,
        };
        Kn(value, e, value3, Ae(component, e));
      });
    }
  });
}
nu.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-navigation-preview]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const value4 = ["off", "on"].includes(value2.dataset.navigationPreview)
    ? value2.dataset.navigationPreview
    : "auto";
  kw(value3, value4);
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
  thresholdMode: "auto",
};
const Mw = {
  valueVisible: {
    group: "当前数值",
    label: "当前数值显示",
  },
  statePrecision: {
    group: "当前数值",
    label: "数值小数位",
  },
  valueScale: {
    group: "当前数值",
    label: "当前数值大小",
  },
  valueColor: {
    group: "当前数值",
    label: "当前数值颜色",
  },
  valueOffsetX: {
    group: "当前数值",
    label: "当前数值左右位置",
  },
  valueOffsetY: {
    group: "当前数值",
    label: "当前数值上下位置",
  },
  updateInterval: {
    group: "历史数据",
    label: "刷新间隔",
  },
  hours: {
    group: "历史数据",
    label: "历史范围",
  },
  cornerRadius: {
    group: "折线",
    label: "圆角大小",
  },
  thresholdMode: {
    group: "折线",
    label: "阈值模式",
  },
  thresholds: {
    group: "折线",
    label: "阈值与折线颜色",
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度",
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度",
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放",
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转",
  },
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
  let value2 = Mi.get(value.id);
  if (!value2) {
    value2 = clone(findComponent(Ke, value.id)?.component || value);
    Mi.set(value.id, value2);
  }
  return Object.keys(Mw).filter(
    (value3) =>
      JSON.stringify(Qc(value, value3)) !== JSON.stringify(Qc(value2, value3)),
  );
}
function wL(value, value2, value3 = h?.document) {
  if (typeof value2 == "boolean") {
    if (value2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      value3?.canvas?.[value] || (value === "width" ? 2778 : 1940),
    );
    return roundField((Number(value2 || 0) / numeric) * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(value2 || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(value2 || 0)) + "°";
  } else if (
    ["valueScale", "valueOffsetX", "valueOffsetY", "cornerRadius"].includes(
      value,
    )
  ) {
    return roundField(Number(value2 || 0)) + "%";
  } else if (value === "updateInterval") {
    return roundField(Number(value2 || 0)) + " 秒";
  } else if (value === "hours") {
    return roundField(Number(value2 || 0)) + " 小时";
  } else if (value === "thresholds") {
    return (Array.isArray(value2) ? value2.length : 0) + " 段配色";
  } else {
    return String(value2 ?? "");
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
  markerTop: 84,
};
const Bw = {
  mainTextVisible: {
    group: "中文标题",
    label: "中文标题显示",
  },
  mainColor: {
    group: "中文标题",
    label: "中文题色",
  },
  mainSize: {
    group: "中文标题",
    label: "中文大小",
  },
  mainWeight: {
    group: "中文标题",
    label: "中文粗细",
  },
  mainSpacing: {
    group: "中文标题",
    label: "中文字间距",
  },
  mainTextLeft: {
    group: "中文标题",
    label: "中文左右位置",
  },
  mainTextTop: {
    group: "中文标题",
    label: "中文上下位置",
  },
  secondaryTextVisible: {
    group: "英文标题",
    label: "英文标题显示",
  },
  secondaryColor: {
    group: "英文标题",
    label: "英文颜色",
  },
  secondarySize: {
    group: "英文标题",
    label: "英文大小",
  },
  secondaryWeight: {
    group: "英文标题",
    label: "英文粗细",
  },
  secondarySpacing: {
    group: "英文标题",
    label: "英文字间距",
  },
  secondaryLineGap: {
    group: "英文标题",
    label: "英文行间距",
  },
  secondaryTextLeft: {
    group: "英文标题",
    label: "英文左右位置",
  },
  secondaryTextTop: {
    group: "英文标题",
    label: "英文上下位置",
  },
  iconVisible: {
    group: "图标",
    label: "图标显示",
  },
  iconColor: {
    group: "图标",
    label: "图标颜色",
  },
  iconSize: {
    group: "图标",
    label: "图标大小",
  },
  iconLeft: {
    group: "图标",
    label: "图标左右位置",
  },
  iconTop: {
    group: "图标",
    label: "图标上下位置",
  },
  frameVisible: {
    group: "括号",
    label: "括号显示",
  },
  frameColor: {
    group: "括号",
    label: "括号颜色",
  },
  frameWidth: {
    group: "括号",
    label: "括号粗细",
  },
  frameSize: {
    group: "括号",
    label: "括号大小",
  },
  frameSpacing: {
    group: "括号",
    label: "括号间距",
  },
  frameOffsetX: {
    group: "括号",
    label: "括号左右位置",
  },
  frameOffsetY: {
    group: "括号",
    label: "括号上下位置",
  },
  markerVisible: {
    group: "三角指示",
    label: "三角指示显示",
  },
  markerColor: {
    group: "三角指示",
    label: "三角指示颜色",
  },
  markerSize: {
    group: "三角指示",
    label: "三角指示大小",
  },
  markerLeft: {
    group: "三角指示",
    label: "三角指示左右位置",
  },
  markerTop: {
    group: "三角指示",
    label: "三角指示上下位置",
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度",
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度",
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放",
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转",
  },
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
  const value2 = findComponent(Ke, value.id)?.component || value;
  return Object.keys(Bw).filter(
    (value3) =>
      JSON.stringify(el(value, value3)) !== JSON.stringify(el(value2, value3)),
  );
}
function SL(value, value2, value3 = h?.document) {
  if (typeof value2 == "boolean") {
    if (value2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      value3?.canvas?.[value] || (value === "width" ? 2778 : 1940),
    );
    return roundField((Number(value2 || 0) / numeric) * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(value2 || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(value2 || 0)) + "°";
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
      "markerTop",
    ].includes(value)
  ) {
    return roundField(Number(value2 || 0)) + "%";
  } else {
    return String(value2 ?? "");
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
  effectRotation: 0,
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
  airflowRotation: -3,
};
const Fw = {
  iconVisible: {
    group: "图标",
    label: "图标显示",
  },
  iconOffColor: {
    group: "图标",
    label: "关闭颜色",
  },
  iconOnColor: {
    group: "图标",
    label: "开启颜色",
  },
  badgeColor: {
    group: "图标",
    label: "底座颜色",
  },
  badgeOpacity: {
    group: "图标",
    label: "底座透明度",
  },
  symbolSize: {
    group: "图标",
    label: "图标大小",
  },
  badgeSize: {
    group: "图标",
    label: "底座大小",
  },
  iconLeft: {
    group: "图标",
    label: "图标左右位置",
  },
  iconTop: {
    group: "图标",
    label: "图标上下位置",
  },
  mainTextVisible: {
    group: "标题",
    label: "标题显示",
  },
  mainColor: {
    group: "标题",
    label: "颜色",
  },
  mainSize: {
    group: "标题",
    label: "大小",
  },
  mainWeight: {
    group: "标题",
    label: "粗细",
  },
  mainSpacing: {
    group: "标题",
    label: "字间距",
  },
  mainTextLeft: {
    group: "标题",
    label: "左右位置",
  },
  mainTextTop: {
    group: "标题",
    label: "上下位置",
  },
  secondaryTextVisible: {
    group: "状态",
    label: "状态显示",
  },
  secondaryColor: {
    group: "状态",
    label: "颜色",
  },
  secondarySize: {
    group: "状态",
    label: "大小",
  },
  secondaryWeight: {
    group: "状态",
    label: "粗细",
  },
  secondarySpacing: {
    group: "状态",
    label: "字间距",
  },
  secondaryTextLeft: {
    group: "状态",
    label: "左右位置",
  },
  secondaryTextTop: {
    group: "状态",
    label: "上下位置",
  },
  airflowVisible: {
    group: "出风效果",
    label: "显示",
  },
  airflowMotion: {
    group: "出风效果",
    label: "效果模式",
  },
  airflowCoolColor: {
    group: "出风颜色",
    label: "制冷",
  },
  airflowHeatColor: {
    group: "出风颜色",
    label: "制热",
  },
  airflowOtherColor: {
    group: "出风颜色",
    label: "其它",
  },
  airflowAngle: {
    group: "出风效果",
    label: "整体方向",
  },
  airflowCurve: {
    group: "出风效果",
    label: "弯曲程度",
  },
  airflowLength: {
    group: "出风效果",
    label: "单股长度",
  },
  airflowFadePosition: {
    group: "出风效果",
    label: "渐变消失位置",
  },
  airflowSpread: {
    group: "出风效果",
    label: "扩散宽度",
  },
  airflowDensity: {
    group: "出风效果",
    label: "气流密度",
  },
  airflowIrregularity: {
    group: "出风效果",
    label: "错落程度",
  },
  airflowThickness: {
    group: "出风效果",
    label: "整体粗细",
  },
  airflowStrength: {
    group: "出风效果",
    label: "显示强度",
  },
  airflowBlur: {
    group: "出风效果",
    label: "模糊大小",
  },
  airflowSpeed: {
    group: "出风效果",
    label: "动画速度",
  },
  airflowOffsetX: {
    group: "出风位置",
    label: "左右偏移",
  },
  airflowOffsetY: {
    group: "出风位置",
    label: "上下偏移",
  },
  airflowWidth: {
    group: "出风位置",
    label: "宽度",
  },
  airflowHeight: {
    group: "出风位置",
    label: "高度",
  },
  airflowScale: {
    group: "出风位置",
    label: "缩放",
  },
  airflowRotation: {
    group: "出风位置",
    label: "旋转",
  },
  width: {
    group: "按钮尺寸",
    label: "宽度",
  },
  height: {
    group: "按钮尺寸",
    label: "高度",
  },
  scale: {
    group: "按钮变换",
    label: "缩放",
  },
  rotation: {
    group: "按钮变换",
    label: "旋转",
  },
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
  let value2 = $i.get(value.id);
  if (!value2) {
    value2 = clone(findComponent(Ke, value.id)?.component || value);
    $i.set(value.id, value2);
  }
  return Object.keys(Fw).filter(
    (value3) =>
      JSON.stringify(tl(value, value3)) !== JSON.stringify(tl(value2, value3)),
  );
}
function EL(value, value2, value3 = h?.document) {
  if (typeof value2 == "boolean") {
    if (value2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      value3?.canvas?.[value] || (value === "width" ? 2778 : 1940),
    );
    return roundField((Number(value2 || 0) / numeric) * 100) + "%";
  }
  if (["scale", "airflowScale", "badgeOpacity"].includes(value)) {
    return roundField(Number(value2 || 0) * 100) + "%";
  } else if (["rotation", "airflowRotation", "airflowAngle"].includes(value)) {
    return roundField(Number(value2 || 0)) + "°";
  } else if (value === "airflowMotion") {
    if (value2 === "static") {
      return "静态";
    } else {
      return "动态";
    }
  } else if (typeof value2 == "number") {
    return roundField(value2);
  } else {
    return String(value2 ?? "");
  }
}
const zw = {
  buttonVisible: {
    group: "图层显示",
    label: "按钮层",
  },
  effectVisible: {
    group: "图层显示",
    label: "效果图层",
  },
  icon: {
    group: "按钮图标",
    label: "图标",
  },
  iconOffColor: {
    group: "按钮图标",
    label: "关闭后颜色",
  },
  iconOnColor: {
    group: "按钮图标",
    label: "关闭前颜色",
  },
  iconSize: {
    group: "按钮图标",
    label: "图标大小",
  },
  buttonOffColor: {
    group: "按钮背景",
    label: "关闭后颜色",
  },
  buttonOnColor: {
    group: "按钮背景",
    label: "关闭前颜色",
  },
  buttonOpacity: {
    group: "按钮背景",
    label: "透明度",
  },
  frameColor: {
    group: "外框",
    label: "颜色",
  },
  frameWidth: {
    group: "外框",
    label: "粗细",
  },
  frameOpacity: {
    group: "外框",
    label: "透明度",
  },
  radius: {
    group: "外框",
    label: "圆角",
  },
  glowColor: {
    group: "光晕",
    label: "颜色",
  },
  glowOffStrength: {
    group: "光晕",
    label: "关闭后强度",
  },
  glowOnStrength: {
    group: "光晕",
    label: "关闭前强度",
  },
  effectColorTemperatureRealtime: {
    group: "灯光实时反馈",
    label: "色温实时",
  },
  effectBrightnessRealtime: {
    group: "灯光实时反馈",
    label: "亮度实时",
  },
  effectOpacity: {
    group: "效果图层",
    label: "透明度",
  },
  effectFadeDuration: {
    group: "效果图层",
    label: "淡入淡出时间",
  },
  effectLayoutMode: {
    group: "效果图层",
    label: "图片布局",
  },
  effectLeft: {
    group: "效果图层",
    label: "左右位置",
  },
  effectTop: {
    group: "效果图层",
    label: "上下位置",
  },
  effectScale: {
    group: "效果图层",
    label: "缩放",
  },
  effectRotation: {
    group: "效果图层",
    label: "旋转",
  },
  width: {
    group: "按钮尺寸",
    label: "宽度",
  },
  height: {
    group: "按钮尺寸",
    label: "高度",
  },
  scale: {
    group: "按钮变换",
    label: "缩放",
  },
  rotation: {
    group: "按钮变换",
    label: "旋转",
  },
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
  let value2 = Oi.get(value.id);
  if (!value2) {
    value2 = clone(findComponent(Ke, value.id)?.component || value);
    Oi.set(value.id, value2);
  }
  return Object.keys(zw).filter(
    (value3) =>
      JSON.stringify(nl(value, value3)) !== JSON.stringify(nl(value2, value3)),
  );
}
function LL(value, value2, value3 = h?.document) {
  if (typeof value2 == "boolean") {
    if (value2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      value3?.canvas?.[value] || (value === "width" ? 2778 : 1940),
    );
    return roundField((Number(value2 || 0) / numeric) * 100) + "%";
  }
  if (
    [
      "buttonOpacity",
      "frameOpacity",
      "glowOffStrength",
      "glowOnStrength",
      "effectOpacity",
      "effectScale",
      "scale",
    ].includes(value)
  ) {
    return roundField(Number(value2 || 0) * 100) + "%";
  } else if (
    ["iconSize", "radius", "effectLeft", "effectTop"].includes(value)
  ) {
    return roundField(Number(value2 || 0)) + "%";
  } else if (["effectRotation", "rotation"].includes(value)) {
    return roundField(Number(value2 || 0)) + "°";
  } else if (["effectFadeDuration", "onFillFadeDuration"].includes(value)) {
    return roundField(Number(value2 || 0)) + " 秒";
  } else if (value === "effectLayoutMode") {
    if (value2 === "fill") {
      return "铺满";
    } else {
      return "自由";
    }
  } else {
    return String(value2 || "不使用");
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
  naturalGasColor: "#ffb347",
};
const bn = {
  iconColor: {
    group: "图标",
    label: "图标颜色",
  },
  iconOnColor: {
    group: "图标",
    label: "开启颜色",
  },
  badgeColor: {
    group: "图标",
    label: "底座颜色",
  },
  badgeOpacity: {
    group: "图标",
    label: "底座透明度",
  },
  symbolSize: {
    group: "图标",
    label: "图标大小",
  },
  badgeSize: {
    group: "图标",
    label: "底座大小",
  },
  iconSize: {
    group: "图标",
    label: "图标大小",
  },
  iconLeft: {
    group: "图标",
    label: "图标左右位置",
  },
  iconTop: {
    group: "图标",
    label: "图标上下位置",
  },
  iconOffOpacity: {
    group: "图标",
    label: "图标关闭后透明度",
  },
  iconOnOpacity: {
    group: "图标",
    label: "图标关闭前透明度",
  },
  mainColor: {
    group: "中文标题",
    label: "中文颜色",
  },
  mainSize: {
    group: "中文标题",
    label: "中文大小",
  },
  mainWeight: {
    group: "中文标题",
    label: "中文粗细",
  },
  mainSpacing: {
    group: "中文标题",
    label: "中文字间距",
  },
  mainTextLeft: {
    group: "中文标题",
    label: "中文左右位置",
  },
  mainTextTop: {
    group: "中文标题",
    label: "中文上下位置",
  },
  mainOffOpacity: {
    group: "中文标题",
    label: "中文关闭后透明度",
  },
  mainOnOpacity: {
    group: "中文标题",
    label: "中文关闭前透明度",
  },
  secondaryColor: {
    group: "英文标题",
    label: "英文颜色",
  },
  secondarySize: {
    group: "英文标题",
    label: "英文大小",
  },
  secondaryWeight: {
    group: "英文标题",
    label: "英文粗细",
  },
  secondarySpacing: {
    group: "英文标题",
    label: "英文字间距",
  },
  secondaryTextLeft: {
    group: "英文标题",
    label: "英文左右位置",
  },
  secondaryTextTop: {
    group: "英文标题",
    label: "英文上下位置",
  },
  secondaryOffOpacity: {
    group: "英文标题",
    label: "英文关闭后透明度",
  },
  secondaryOnOpacity: {
    group: "英文标题",
    label: "英文关闭前透明度",
  },
  onFillVisible: {
    group: "状态填充",
    label: "状态填充显示",
  },
  onFillColor: {
    group: "状态填充",
    label: "关闭前填充颜色",
  },
  onFillStrength: {
    group: "状态填充",
    label: "关闭前填充强度",
  },
  onFillFadeDuration: {
    group: "状态填充",
    label: "淡入淡出时间",
  },
  frameVisible: {
    group: "外框",
    label: "外框显示",
  },
  frameWidth: {
    group: "外框",
    label: "外框粗细",
  },
  frameAngle: {
    group: "外框",
    label: "外框渐变角度",
  },
  frameOffOpacity: {
    group: "外框",
    label: "外框关闭后透明度",
  },
  frameOnOpacity: {
    group: "外框",
    label: "外框关闭前透明度",
  },
  cutCorner: {
    group: "外框",
    label: "切角大小",
  },
  softLightVisible: {
    group: "柔光",
    label: "柔光显示",
  },
  softLightColor: {
    group: "柔光",
    label: "柔光颜色",
  },
  softLightSize: {
    group: "柔光",
    label: "柔光大小",
  },
  softLightStrength: {
    group: "柔光",
    label: "柔光强度",
  },
  softLightAngle: {
    group: "柔光",
    label: "柔光角度",
  },
  glowVisible: {
    group: "泛光",
    label: "泛光显示",
  },
  glowColor: {
    group: "泛光",
    label: "泛光颜色",
  },
  glowSize: {
    group: "泛光",
    label: "泛光大小",
  },
  glowStrength: {
    group: "泛光",
    label: "泛光强度",
  },
  glowAngle: {
    group: "泛光",
    label: "泛光角度",
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度",
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度",
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放",
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转",
  },
};
const IL = {
  iconColor: {
    group: "显示颜色",
    label: "无人颜色",
  },
  iconOnColor: {
    group: "显示颜色",
    label: "有人颜色",
  },
  waterLeakColor: {
    group: "显示颜色",
    label: "水浸颜色",
  },
  smokeColor: {
    group: "显示颜色",
    label: "烟雾颜色",
  },
  naturalGasColor: {
    group: "显示颜色",
    label: "天然气颜色",
  },
  haloVisible: {
    group: "运动路径",
    label: "光环显示",
  },
  haloScaleX: {
    group: "运动路径",
    label: "光环宽度",
  },
  haloScaleY: {
    group: "运动路径",
    label: "光环高度",
  },
  haloRotation: {
    group: "运动路径",
    label: "光环旋转",
  },
  haloOpacity: {
    group: "运动路径",
    label: "光环透明度",
  },
  personVisible: {
    group: "运动路径",
    label: "小人显示",
  },
  personScale: {
    group: "运动路径",
    label: "小人缩放",
  },
  personRotation: {
    group: "运动路径",
    label: "小人旋转",
  },
  personOpacity: {
    group: "运动路径",
    label: "小人透明度",
  },
  orbitDuration: {
    group: "运动路径",
    label: "循环一周",
  },
  perspectiveCorners: {
    group: "透视",
    label: "四角透视",
  },
  width: bn.width,
  height: bn.height,
  scale: bn.scale,
  rotation: bn.rotation,
};
function Ho(component) {
  const sensorKind = component?.properties?.sensorKind;
  if (
    ["presence", "door-window", "water-leak", "smoke", "natural-gas"].includes(
      sensorKind,
    )
  ) {
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
    "natural-gas": "天然气传感器",
  }[Ho(value)];
}
function AL(value) {
  const value2 = ["width", "height", "scale", "rotation"];
  const value3 = Ho(value);
  if (value3 === "presence") {
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
      ...value2,
    ];
  } else if (value3 === "door-window") {
    return ["iconOnColor", "perspectiveCorners", ...value2];
  } else if (value3 === "water-leak") {
    return ["waterLeakColor", ...value2];
  } else if (value3 === "smoke") {
    return ["smokeColor", ...value2];
  } else {
    return ["naturalGasColor", ...value2];
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
  const value2 = component.properties || {};
  if (value === "iconColor") {
    return (
      value2.iconColor ??
      value2.clearColor ??
      value2.iconOffColor ??
      value2.iconOnColor ??
      Jr.iconColor
    );
  } else if (value === "iconOnColor") {
    return value2.iconOnColor ?? value2.occupiedColor ?? Jr.iconOnColor;
  } else if (value === "mainColor") {
    return (
      value2.mainColor ??
      value2.mainOffColor ??
      value2.mainOnColor ??
      Jr.mainColor
    );
  } else if (value === "secondaryColor") {
    return (
      value2.secondaryColor ??
      value2.secondaryOffColor ??
      value2.secondaryOnColor ??
      Jr.secondaryColor
    );
  } else {
    return value2[value] ?? Jr[value];
  }
}
function Ww(value) {
  if (
    !value ||
    !["icon-button", "device-button", "presence-sensor"].includes(value.type)
  ) {
    return [];
  }
  let value2 = Bi.get(value.id);
  if (!value2) {
    value2 = clone(findComponent(Ke, value.id)?.component || value);
    Bi.set(value.id, value2);
  }
  return (
    value.type === "presence-sensor"
      ? AL(value)
      : value.type === "device-button"
        ? [
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
            "rotation",
          ]
        : Object.keys(bn)
  ).filter(
    (value3) =>
      JSON.stringify(ol(value, value3)) !== JSON.stringify(ol(value2, value3)),
  );
}
function PL(value, value2) {
  if (value?.type === "presence-sensor") {
    return IL[value2];
  } else if (value?.type !== "device-button") {
    return bn[value2];
  } else if (value2.startsWith("main")) {
    return {
      group: "标题",
      label:
        value2 === "mainOnOpacity"
          ? "透明度"
          : bn[value2]?.label?.replace("中文", ""),
    };
  } else if (value2.startsWith("secondary")) {
    return {
      group: "状态",
      label:
        value2 === "secondaryOnOpacity"
          ? "透明度"
          : bn[value2]?.label?.replace("英文", ""),
    };
  } else {
    return bn[value2];
  }
}
function kL(value, value2, value3 = h?.document) {
  if (typeof value2 == "boolean") {
    if (value2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      value3?.canvas?.[value] || (value === "width" ? 2778 : 1940),
    );
    return roundField((Number(value2 || 0) / numeric) * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(value2 || 0) * 100) + "%";
  } else if (value === "perspectiveCorners") {
    if (JSON.stringify(value2) === JSON.stringify(Bu)) {
      return "默认透视";
    } else {
      return "自定义透视";
    }
  } else if (value === "orbitDuration") {
    return roundField(Number(value2 || 0)) + " 秒";
  } else if (value === "onFillFadeDuration") {
    return roundField(Number(value2 || 0)) + " 秒";
  } else if (
    [
      "rotation",
      "frameAngle",
      "softLightAngle",
      "glowAngle",
      "haloRotation",
      "personRotation",
    ].includes(value)
  ) {
    return roundField(Number(value2 || 0)) + "°";
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
      "personOpacity",
    ].includes(value)
  ) {
    return roundField(Number(value2 || 0) * 100) + "%";
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
      "cutCorner",
    ].includes(value)
  ) {
    return roundField(Number(value2 || 0)) + "%";
  } else {
    return String(value2 ?? "");
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
  frameOpacity: 0.9,
};
const Hw = {
  mediaVisible: {
    group: "画面",
    label: "画面显示",
  },
  displayMode: {
    group: "画面",
    label: "显示方式",
  },
  refreshInterval: {
    group: "画面",
    label: "快照更新时间",
  },
  fit: {
    group: "画面",
    label: "画面比例",
  },
  frameVisible: {
    group: "外框",
    label: "外框显示",
  },
  frameColor: {
    group: "外框",
    label: "外框颜色",
  },
  frameWidth: {
    group: "外框",
    label: "外框粗细",
  },
  radius: {
    group: "外框",
    label: "圆角大小",
  },
  frameAngle: {
    group: "外框",
    label: "渐变角度",
  },
  frameOpacity: {
    group: "外框",
    label: "外框透明度",
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度",
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度",
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放",
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转",
  },
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
  const value2 = component.properties || {};
  if (value === "displayMode") {
    if (value2.displayMode === "snapshot") {
      return "snapshot";
    } else {
      return "live";
    }
  }
  if (value === "refreshInterval") {
    const numeric = Number(value2.refreshInterval);
    if (Number.isFinite(numeric)) {
      return Math.max(6, Math.round(numeric));
    } else {
      return 10;
    }
  }
  if (value === "fit") {
    if (value2.fit === "contain") {
      return "contain";
    } else {
      return "fill";
    }
  }
  if (value === "radius") {
    const numeric = Number(value2.radius ?? Rw.radius);
    return Math.max(0, Math.min(0.5, numeric > 0.5 ? numeric / 100 : numeric));
  }
  return value2[value] ?? Rw[value];
}
function jw(value) {
  if (!value || value.type !== "camera") {
    return [];
  }
  const value2 = findComponent(Ke, value.id)?.component || value;
  return Object.keys(Hw).filter(
    (value3) =>
      JSON.stringify(il(value, value3)) !== JSON.stringify(il(value2, value3)),
  );
}
function ML(value, value2, value3 = h?.document) {
  if (typeof value2 == "boolean") {
    if (value2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "displayMode") {
    if (value2 === "snapshot") {
      return "快照";
    } else {
      return "实时";
    }
  }
  if (value === "refreshInterval") {
    return roundField(Number(value2 || 10)) + " 秒";
  }
  if (value === "fit") {
    if (value2 === "contain") {
      return "原始比例";
    } else {
      return "压缩 16:9";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      value3?.canvas?.[value] || (value === "width" ? 2778 : 1940),
    );
    return roundField((Number(value2 || 0) / numeric) * 100) + "%";
  }
  if (value === "scale" || value === "radius" || value === "frameOpacity") {
    return roundField(Number(value2 || 0) * 100) + "%";
  } else if (value === "rotation" || value === "frameAngle") {
    return roundField(Number(value2 || 0)) + "°";
  } else {
    return String(value2 ?? "");
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
  glowAngle: 242,
};
const qw = {
  mainTextVisible: {
    group: "主文字",
    label: "主文字显示",
  },
  mainColor: {
    group: "主文字",
    label: "主文字颜色",
  },
  mainSize: {
    group: "主文字",
    label: "主文字大小",
  },
  mainWeight: {
    group: "主文字",
    label: "主文字笔画粗细",
  },
  mainOpacity: {
    group: "主文字",
    label: "主文字透明度",
  },
  mainSpacing: {
    group: "主文字",
    label: "主文字字间距",
  },
  mainTextLeft: {
    group: "主文字",
    label: "主文字左右位置",
  },
  mainTextTop: {
    group: "主文字",
    label: "主文字上下位置",
  },
  secondaryTextVisible: {
    group: "副文字",
    label: "副文字显示",
  },
  secondaryColor: {
    group: "副文字",
    label: "副文字颜色",
  },
  secondarySize: {
    group: "副文字",
    label: "副文字大小",
  },
  secondaryWeight: {
    group: "副文字",
    label: "副文字笔画粗细",
  },
  secondaryOpacity: {
    group: "副文字",
    label: "副文字透明度",
  },
  secondarySpacing: {
    group: "副文字",
    label: "副文字字间距",
  },
  secondaryTextLeft: {
    group: "副文字",
    label: "副文字左右位置",
  },
  secondaryTextTop: {
    group: "副文字",
    label: "副文字上下位置",
  },
  edgeVisible: {
    group: "外框",
    label: "外框显示",
  },
  edgeColor: {
    group: "外框",
    label: "外框颜色",
  },
  edgeWidth: {
    group: "外框",
    label: "外框粗细",
  },
  edgeOpacity: {
    group: "外框",
    label: "外框透明度",
  },
  radius: {
    group: "外框",
    label: "外框圆角",
  },
  edgeAngle: {
    group: "外框",
    label: "外框渐变角度",
  },
  glowVisible: {
    group: "柔光",
    label: "柔光显示",
  },
  glowColor: {
    group: "柔光",
    label: "柔光颜色",
  },
  glowStrength: {
    group: "柔光",
    label: "柔光强度",
  },
  glowSize: {
    group: "柔光",
    label: "柔光大小",
  },
  glowAngle: {
    group: "柔光",
    label: "柔光角度",
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度",
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度",
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放",
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转",
  },
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
  const value2 = component.properties || {};
  if (value === "mainTextLeft" || value === "secondaryTextLeft") {
    return value2[value] ?? value2.textLeft ?? Rp[value];
  }
  if (value === "mainTextTop") {
    const count = Math.max(1, Number(component.position?.height || 100));
    return (
      value2.mainTextTop ??
      Number(value2.textTop ?? 28) -
        (Number(value2.lineGap ?? 24) / count) * 100
    );
  }
  if (value === "secondaryTextTop") {
    return value2.secondaryTextTop ?? value2.textTop ?? Rp.secondaryTextTop;
  } else {
    return value2[value] ?? Rp[value];
  }
}
function Gw(value) {
  if (!value || value.type !== "panel-frame") {
    return [];
  }
  let value2 = ki.get(value.id);
  if (!value2) {
    value2 = clone(findComponent(Ke, value.id)?.component || value);
    ki.set(value.id, value2);
  }
  return Object.keys(qw).filter((value3) =>
    !value2 || value2.type !== "panel-frame"
      ? true
      : JSON.stringify(al(value, value3)) !==
        JSON.stringify(al(value2, value3)),
  );
}
function OL(value, value2, value3 = h?.document) {
  if (typeof value2 == "boolean") {
    if (value2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      value3?.canvas?.[value] || (value === "width" ? 2778 : 1940),
    );
    return roundField((Number(value2 || 0) / numeric) * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(value2 || 0) * 100) + "%";
  } else if (
    value === "rotation" ||
    value === "edgeAngle" ||
    value === "glowAngle"
  ) {
    return roundField(Number(value2 || 0)) + "°";
  } else if (
    [
      "mainOpacity",
      "secondaryOpacity",
      "edgeOpacity",
      "radius",
      "glowStrength",
      "glowSize",
    ].includes(value)
  ) {
    return roundField(Number(value2 || 0) * 100) + "%";
  } else if (
    [
      "mainTextLeft",
      "mainTextTop",
      "secondaryTextLeft",
      "secondaryTextTop",
    ].includes(value)
  ) {
    return roundField(Number(value2 || 0)) + "%";
  } else {
    return String(value2 ?? "");
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
  glowActiveSize: 2.2,
};
const Zr = {
  mainTextVisible: {
    group: "文字",
    label: "主文字显示",
  },
  secondaryTextVisible: {
    group: "文字",
    label: "副文字显示",
  },
  mainColor: {
    group: "文字",
    label: "主文字颜色",
  },
  secondaryColor: {
    group: "文字",
    label: "副文字颜色",
  },
  mainSize: {
    group: "文字",
    label: "主文字大小",
  },
  secondarySize: {
    group: "文字",
    label: "副文字大小",
  },
  mainWeight: {
    group: "文字",
    label: "主文字笔画粗细",
  },
  secondaryWeight: {
    group: "文字",
    label: "副文字笔画粗细",
  },
  mainSpacing: {
    group: "文字",
    label: "主文字字间距",
  },
  secondarySpacing: {
    group: "文字",
    label: "副文字字间距",
  },
  mainTextLeft: {
    group: "文字",
    label: "主文字左右位置",
  },
  mainTextTop: {
    group: "文字",
    label: "主文字上下位置",
  },
  secondaryTextLeft: {
    group: "文字",
    label: "副文字左右位置",
  },
  secondaryTextTop: {
    group: "文字",
    label: "副文字上下位置",
  },
  textIdleOpacity: {
    group: "文字",
    label: "文字选择前透明度",
  },
  textActiveOpacity: {
    group: "文字",
    label: "文字选择后透明度",
  },
  iconVisible: {
    group: "图标",
    label: "图标显示",
  },
  iconColor: {
    group: "图标",
    label: "图标颜色",
  },
  iconSize: {
    group: "图标",
    label: "图标大小",
  },
  iconLeft: {
    group: "图标",
    label: "图标左右位置",
  },
  iconTop: {
    group: "图标",
    label: "图标上下位置",
  },
  iconIdleOpacity: {
    group: "图标",
    label: "图标选择前透明度",
  },
  iconActiveOpacity: {
    group: "图标",
    label: "图标选择后透明度",
  },
  frameVisible: {
    group: "外框",
    label: "外框显示",
  },
  frameColor: {
    group: "外框",
    label: "外框颜色",
  },
  frameWidth: {
    group: "外框",
    label: "外框粗细",
  },
  frameIdleOpacity: {
    group: "外框",
    label: "外框选择前透明度",
  },
  frameActiveOpacity: {
    group: "外框",
    label: "外框选择后透明度",
  },
  radius: {
    group: "外框",
    label: "外框圆角",
  },
  frameAngle: {
    group: "外框",
    label: "外框渐变角度",
  },
  glowVisible: {
    group: "背景光晕",
    label: "背景光晕显示",
  },
  glowColor: {
    group: "背景光晕",
    label: "背景光晕颜色",
  },
  glowAngle: {
    group: "背景光晕",
    label: "背景光晕角度",
  },
  glowIdleStrength: {
    group: "背景光晕",
    label: "选择前光晕强度",
  },
  glowIdleSize: {
    group: "背景光晕",
    label: "选择前光晕大小",
  },
  glowActiveStrength: {
    group: "背景光晕",
    label: "选择后光晕强度",
  },
  glowActiveSize: {
    group: "背景光晕",
    label: "选择后光晕大小",
  },
  width: {
    group: "尺寸与变换",
    label: "控件宽度",
  },
  height: {
    group: "尺寸与变换",
    label: "控件高度",
  },
  scale: {
    group: "尺寸与变换",
    label: "控件缩放",
  },
  rotation: {
    group: "尺寸与变换",
    label: "控件旋转",
  },
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
  const value2 = component.properties || {};
  const value3 = BL[value];
  if (value === "textIdleOpacity") {
    return value2[value] ?? value2.idleOpacity ?? value3;
  } else if (value === "textActiveOpacity") {
    return value2[value] ?? value2.activeOpacity ?? value3;
  } else if (value === "iconIdleOpacity") {
    return value2[value] ?? value2.idleOpacity ?? value3;
  } else if (value === "iconActiveOpacity") {
    return value2[value] ?? value2.activeOpacity ?? value3;
  } else if (value === "mainTextLeft" || value === "secondaryTextLeft") {
    return value2[value] ?? value2.textLeft ?? value3;
  } else if (value === "mainTextTop") {
    return value2[value] ?? Number(value2.textTop ?? 81.5) - 1800 / 64.36;
  } else if (value === "secondaryTextTop") {
    return value2[value] ?? value2.textTop ?? value3;
  } else {
    return value2[value] ?? value3;
  }
}
function Uw(value, value2) {
  return JSON.stringify(value) === JSON.stringify(value2);
}
function Kn(value, value2, value3, value4) {
  if (!value || !Zr[value2]) {
    return;
  }
  let value5 = Oo.get(value);
  if (!!value5 || !Uw(value3, value4)) {
    if (!value5) {
      value5 = new Map();
      Oo.set(value, value5);
    }
    if (!value5.has(value2)) {
      value5.set(value2, clone(value3));
    }
  }
}
function $L(value) {
  const value2 = Oo.get(value?.id);
  if (value2) {
    for (const value3 of value2.keys()) {
      if (!Zr[value3]) {
        value2.delete(value3);
      }
    }
    if (!value2.size) {
      Oo.delete(value.id);
    }
  }
}
function _w(value) {
  $L(value);
  return [...(Oo.get(value?.id)?.entries() || [])]
    .filter(([value2, value3]) => !Uw(Ae(value, value2), value3))
    .map(([value2]) => value2);
}
function FL(value, value2, value3 = h?.document) {
  if (typeof value2 == "boolean") {
    if (value2) {
      return "显示";
    } else {
      return "隐藏";
    }
  }
  if (value === "width" || value === "height") {
    const numeric = Number(
      value3?.canvas?.[value] || (value === "width" ? 2778 : 1940),
    );
    return roundField((Number(value2 || 0) / numeric) * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(value2 || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(value2 || 0)) + "°";
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
      "glowActiveSize",
    ].includes(value)
  ) {
    return roundField(Number(value2 || 0) * 100) + "%";
  } else if (
    [
      "mainTextLeft",
      "mainTextTop",
      "secondaryTextLeft",
      "secondaryTextTop",
      "iconLeft",
      "iconTop",
    ].includes(value)
  ) {
    return roundField(Number(value2 || 0)) + "%";
  } else if (value === "frameAngle" || value === "glowAngle") {
    return roundField(Number(value2 || 0)) + "°";
  } else {
    return String(value2 ?? "");
  }
}
function wt({
  value: value,
  label: value2,
  detail: value3,
  target: value4 = false,
}) {
  const value5 = document.createElement("label");
  value5.className = "navigation-style-apply-option";
  const value6 = document.createElement("input");
  value6.type = "checkbox";
  value6.checked = true;
  if (value4) {
    value6.dataset.navigationTargetId = value;
  } else {
    value6.dataset.navigationStyleProperty = value;
  }
  const element = document.createElement("span");
  element.textContent = value2;
  if (value3) {
    const element2 = document.createElement("small");
    element2.textContent = value3;
    element.append(element2);
  }
  value5.append(value6, element);
  return value5;
}
function Hp(value) {
  mr.classList.remove("grouped-by-page");
  mr.replaceChildren(...value);
}
function ji(value, detail) {
  const index = new Map();
  value.forEach(({ component: value4, page: page }) => {
    const value5 = page?.id || page?.path || page?.name || "unknown-page";
    if (!index.has(value5)) {
      index.set(value5, {
        page: page,
        components: [],
      });
    }
    index.get(value5).components.push(value4);
  });
  const value3 = [...index.values()].map(
    ({ page: value4, components: value5 }) => {
      const value6 = document.createElement("section");
      value6.className = "navigation-style-apply-page-group";
      const value7 = document.createElement("div");
      value7.className = "navigation-style-apply-page-heading";
      const element = document.createElement("strong");
      element.textContent = value4?.name || "未命名页面";
      const textContent = element.textContent;
      const value8 = document.createElement("div");
      value8.className = "navigation-style-apply-page-controls";
      const element2 = document.createElement("span");
      const element3 = document.createElement("button");
      element3.type = "button";
      element3.className = "navigation-style-apply-page-toggle";
      const value9 = document.createElement("div");
      value9.className = "navigation-style-apply-page-options";
      value9.replaceChildren(
        ...value5.map((value11) =>
          wt({
            value: value11.id,
            label: componentLabel(value11),
            detail: detail,
            target: true,
          }),
        ),
      );
      const value10 = [
        ...value9.querySelectorAll("[data-navigation-target-id]"),
      ];
      const fn9 = () => {
        const length = value10.filter((value12) => value12.checked).length;
        const value11 = length === value10.length;
        element2.textContent = length + "/" + value10.length + " 个控件";
        element3.textContent = value11 ? "取消全选" : "全选";
        element3.setAttribute(
          "aria-label",
          (value11 ? "取消选择" : "全选") + "“" + textContent + "”中的控件",
        );
      };
      element3.addEventListener("click", () => {
        const value11 = !value10.every((value12) => value12.checked);
        value10.forEach((value12) => {
          value12.checked = value11;
        });
        fn9();
      });
      value9.addEventListener("change", fn9);
      value8.append(element2, element3);
      value7.append(element, value8);
      value6.append(value7, value9);
      fn9();
      return value6;
    },
  );
  mr.classList.add("grouped-by-page");
  mr.replaceChildren(...value3);
}
function DL() {
  const value = O();
  if (!value || value.type !== "navigation-button") {
    return;
  }
  const value2 = _w(value);
  const value3 = Rn(h.document.sharedComponents, "navigation-button").filter(
    (value4) => value4.id !== value.id,
  );
  if (!!value2.length && !!value3.length) {
    Pn.textContent = "应用导航按钮设置";
    Mn.textContent = "应用到导航按钮";
    On.textContent = "侧边栏通用";
    kn.textContent =
      "将“" +
      componentLabel(value) +
      "”中选定的修改应用到选中的侧边栏导航按钮。图标名称、文字内容、目标页面、备注和位置不会改变。";
    an.replaceChildren(
      ...value2.map((value4) => {
        const value5 = Zr[value4];
        const value6 = Ae(value, value4);
        return wt({
          value: value4,
          label: value5.label,
          detail: value5.group + " · " + FL(value4, value6),
        });
      }),
    );
    Hp(
      value3.map((component) => {
        const value4 =
          component.properties?.targetPage ||
          component.actions?.tap?.target ||
          "";
        const value5 = h.document.pages.find(
          (value6) => value6.path === value4,
        );
        return wt({
          value: component.id,
          label: componentLabel(component),
          detail: value5 ? "跳转到：" + value5.name : "未设置目标页面",
          target: true,
        });
      }),
    );
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "navigation-button",
    };
    Ge.showModal();
  }
}
function zL() {
  const value = O();
  if (!value || value.type !== "panel-frame") {
    return;
  }
  const value2 = Gw(value);
  const value3 = findComponent(h.document, value.id)?.scope === "page";
  const value4 = value3
    ? st("panel-frame").filter(
        ({ component: value5 }) => value5.id !== value.id,
      )
    : Rn(h.document.sharedComponents, "panel-frame")
        .filter((value5) => value5.id !== value.id)
        .map((component) => ({
          component: component,
        }));
  if (!!value2.length && !!value4.length) {
    Pn.textContent = "应用底图框设置";
    Mn.textContent = value3 ? "应用到主页面底图框" : "应用到侧边栏底图框";
    On.textContent = value3 ? "按页面区分" : "侧边栏通用";
    kn.textContent =
      "将“" +
      componentLabel(value) +
      "”中选定的修改应用到选中的" +
      (value3 ? "主页面" : "侧边栏") +
      "底图框。文字内容、备注和位置不会改变。";
    an.replaceChildren(
      ...value2.map((value5) => {
        const value6 = qw[value5];
        const value7 = al(value, value5);
        return wt({
          value: value5,
          label: value6.label,
          detail: value6.group + " · " + OL(value5, value7),
        });
      }),
    );
    if (value3) {
      ji(value4, "主页面底图框");
    } else {
      Hp(
        value4.map(({ component: value5 }) =>
          wt({
            value: value5.id,
            label: componentLabel(value5),
            detail: "侧边栏共享控件",
            target: true,
          }),
        ),
      );
    }
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "panel-frame",
    };
    Ge.showModal();
  }
}
function VL() {
  const value = O();
  if (!value || value.type !== "camera") {
    return;
  }
  const value2 = jw(value);
  const value3 = st("camera").filter(
    ({ component: value4 }) => value4.id !== value.id,
  );
  if (!!value2.length && !!value3.length) {
    Pn.textContent = "应用摄像头实时预览设置";
    Mn.textContent = "应用到主页面摄像头实时预览";
    On.textContent = "按页面区分";
    kn.textContent =
      "将“" +
      componentLabel(value) +
      "”中选定的修改应用到选中的主页面摄像头实时预览。实体、备注、动作和控件位置不会改变。";
    an.replaceChildren(
      ...value2.map((value4) => {
        const value5 = Hw[value4];
        const value6 = il(value, value4);
        return wt({
          value: value4,
          label: value5.label,
          detail: value5.group + " · " + ML(value4, value6),
        });
      }),
    );
    ji(value3, "摄像头实时预览");
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "camera",
    };
    Ge.showModal();
  }
}
function WL() {
  const value = O();
  if (!value || value.type !== "title-button") {
    return;
  }
  const value2 = $w(value);
  const value3 = st("title-button").filter(
    ({ component: value4 }) => value4.id !== value.id,
  );
  if (!!value2.length && !!value3.length) {
    Pn.textContent = "应用标题按钮设置";
    Mn.textContent = "应用到主页面标题按钮";
    On.textContent = "按页面区分";
    kn.textContent =
      "将“" +
      componentLabel(value) +
      "”中选定的修改应用到选中的标题按钮。文字内容、图标名称、备注、动作和控件中心位置不会改变。";
    an.replaceChildren(
      ...value2.map((value4) => {
        const value5 = Bw[value4];
        const value6 = el(value, value4);
        return wt({
          value: value4,
          label: value5.label,
          detail: value5.group + " · " + SL(value4, value6),
        });
      }),
    );
    ji(value3, "标题按钮");
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "title-button",
    };
    Ge.showModal();
  }
}
function RL() {
  const value = O();
  if (!value || value.type !== "icon-button-effect") {
    return;
  }
  const value2 = Vw(value);
  const value3 = st("icon-button-effect").filter(
    ({ component: value4 }) => value4.id !== value.id,
  );
  if (!!value2.length && !!value3.length) {
    Pn.textContent = "应用图标按钮（效果）设置";
    Mn.textContent = "应用到主页面同类型控件";
    On.textContent = "按页面区分";
    kn.textContent =
      "将“" +
      componentLabel(value) +
      "”中选定的修改应用到选中的主页面图标按钮（效果）。实体、备注、动作和按钮位置不会改变。";
    an.replaceChildren(
      ...value2.map((value4) => {
        const value5 = zw[value4];
        const value6 = nl(value, value4);
        return wt({
          value: value4,
          label: value5.label,
          detail: value5.group + " · " + LL(value4, value6),
        });
      }),
    );
    ji(value3, "图标按钮（效果）");
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "icon-button-effect",
    };
    Ge.showModal();
  }
}
function HL() {
  const value = O();
  if (!value || value.type !== "air-conditioner") {
    return;
  }
  const value2 = Dw(value);
  const value3 = st("air-conditioner").filter(
    ({ component: value4 }) => value4.id !== value.id,
  );
  if (!!value2.length && !!value3.length) {
    Pn.textContent = "应用空调设置";
    Mn.textContent = "应用到主页面同类型控件";
    On.textContent = "按页面区分";
    kn.textContent =
      "将“" +
      componentLabel(value) +
      "”中选定的修改应用到选中的空调控件。实体、备注、文字内容、动作和按钮位置不会改变。";
    an.replaceChildren(
      ...value2.map((value4) => {
        const value5 = Fw[value4];
        const value6 = tl(value, value4);
        return wt({
          value: value4,
          label: value5.label,
          detail: value5.group + " · " + EL(value4, value6),
        });
      }),
    );
    ji(value3, "空调");
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "air-conditioner",
    };
    Ge.showModal();
  }
}
function jL() {
  const value = O();
  if (
    !value ||
    !["icon-button", "device-button", "presence-sensor"].includes(value.type)
  ) {
    return;
  }
  const value2 =
    value.type === "presence-sensor"
      ? TL(value)
      : value.type === "device-button"
        ? "设备按钮"
        : "图标按钮";
  const value3 = Ww(value);
  const value4 = Ho(value);
  const value5 = st(value.type).filter(
    ({ component: value6 }) =>
      value6.id !== value.id &&
      (value.type !== "presence-sensor" || Ho(value6) === value4),
  );
  if (!!value3.length && !!value5.length) {
    Pn.textContent = "应用" + value2 + "设置";
    Mn.textContent = "应用到主页面同类型控件";
    On.textContent = "按页面区分";
    kn.textContent =
      "将“" +
      componentLabel(value) +
      "”中选定的修改应用到选中的主页面" +
      value2 +
      "。实体、备注、图标名称、文字内容和位置不会改变。";
    an.replaceChildren(
      ...value3.map((value6) => {
        const value7 = PL(value, value6);
        const value8 = ol(value, value6);
        return wt({
          value: value6,
          label: value7.label,
          detail: value7.group + " · " + kL(value6, value8),
        });
      }),
    );
    ji(value5, value2);
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: value.type,
    };
    Ge.showModal();
  }
}
function qL() {
  const value = O();
  if (!value || value.type !== "line-chart") {
    return;
  }
  const value2 = Ow(value);
  const value3 = Rn(h.document.sharedComponents, "line-chart").filter(
    (value4) => value4.id !== value.id,
  );
  if (!!value2.length && !!value3.length) {
    Pn.textContent = "应用折线图设置";
    Mn.textContent = "应用到折线图";
    On.textContent = "侧边栏通用";
    kn.textContent =
      "将“" +
      componentLabel(value) +
      "”中选定的修改应用到选中的侧边栏折线图。数值实体、备注、动作和位置不会改变。";
    an.replaceChildren(
      ...value2.map((value4) => {
        const value5 = Mw[value4];
        const value6 = Qc(value, value4);
        return wt({
          value: value4,
          label: value5.label,
          detail: value5.group + " · " + wL(value4, value6),
        });
      }),
    );
    Hp(
      value3.map((component) =>
        wt({
          value: component.id,
          label: componentLabel(component),
          detail: component.bindings?.entity?.entityId || "未设置数值实体",
          target: true,
        }),
      ),
    );
    ke.hidden = true;
    ke.textContent = "";
    Pt = {
      sourceId: value.id,
      type: "line-chart",
    };
    Ge.showModal();
  }
}
function GL(value, component, value2) {
  const value3 = clone(Ae(value, value2));
  if (value2 === "width") {
    const value4 =
      Number(component.position?.x || 0) +
      Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: value4 - Number(value3) / 2,
      width: Number(value3),
    };
    return;
  }
  if (value2 === "height") {
    const value4 =
      Number(component.position?.y || 0) +
      Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: value4 - Number(value3) / 2,
      height: Number(value3),
    };
    return;
  }
  if (value2 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(value3),
    };
    return;
  }
  if (value2 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(value3),
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [value2]: value3,
  };
}
function UL(value, component, value2) {
  const value3 = clone(al(value, value2));
  if (value2 === "width") {
    const value4 =
      Number(component.position?.x || 0) +
      Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: value4 - Number(value3) / 2,
      width: Number(value3),
    };
    return;
  }
  if (value2 === "height") {
    const value4 =
      Number(component.position?.y || 0) +
      Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: value4 - Number(value3) / 2,
      height: Number(value3),
    };
    return;
  }
  if (value2 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(value3),
    };
    return;
  }
  if (value2 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(value3),
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [value2]: value3,
  };
}
function _L(value, component, value2) {
  const value3 = clone(il(value, value2));
  if (value2 === "width") {
    const value4 =
      Number(component.position?.x || 0) +
      Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: value4 - Number(value3) / 2,
      width: Number(value3),
    };
    return;
  }
  if (value2 === "height") {
    const value4 =
      Number(component.position?.y || 0) +
      Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: value4 - Number(value3) / 2,
      height: Number(value3),
    };
    return;
  }
  if (value2 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(value3),
    };
    return;
  }
  if (value2 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(value3),
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [value2]: value3,
  };
}
function YL(value, component, value2) {
  const value3 = clone(Qc(value, value2));
  if (value2 === "width") {
    const value4 =
      Number(component.position?.x || 0) +
      Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: value4 - Number(value3) / 2,
      width: Number(value3),
    };
    return;
  }
  if (value2 === "height") {
    const value4 =
      Number(component.position?.y || 0) +
      Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: value4 - Number(value3) / 2,
      height: Number(value3),
    };
    return;
  }
  if (value2 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(value3),
    };
    return;
  }
  if (value2 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(value3),
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [value2]: value3,
  };
}
function XL(value, component, value2) {
  const value3 = clone(nl(value, value2));
  if (value2 === "width") {
    const value4 =
      Number(component.position?.x || 0) +
      Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: value4 - Number(value3) / 2,
      width: Number(value3),
    };
    return;
  }
  if (value2 === "height") {
    const value4 =
      Number(component.position?.y || 0) +
      Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: value4 - Number(value3) / 2,
      height: Number(value3),
    };
    return;
  }
  if (value2 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(value3),
    };
    return;
  }
  if (value2 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(value3),
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [value2]: value3,
  };
}
function KL(value, component, value2) {
  const value3 = clone(el(value, value2));
  if (value2 === "width") {
    const value4 =
      Number(component.position?.x || 0) +
      Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: value4 - Number(value3) / 2,
      width: Number(value3),
    };
    return;
  }
  if (value2 === "height") {
    const value4 =
      Number(component.position?.y || 0) +
      Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: value4 - Number(value3) / 2,
      height: Number(value3),
    };
    return;
  }
  if (value2 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(value3),
    };
    return;
  }
  if (value2 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(value3),
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [value2]: value3,
  };
}
function JL(value, component, value2) {
  const value3 = clone(ol(value, value2));
  if (value2 === "width") {
    const value4 =
      Number(component.position?.x || 0) +
      Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: value4 - Number(value3) / 2,
      width: Number(value3),
    };
    return;
  }
  if (value2 === "height") {
    const value4 =
      Number(component.position?.y || 0) +
      Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: value4 - Number(value3) / 2,
      height: Number(value3),
    };
    return;
  }
  if (value2 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(value3),
    };
    return;
  }
  if (value2 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(value3),
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [value2]: value3,
  };
}
function ZL(value, component, value2) {
  const value3 = clone(tl(value, value2));
  if (value2 === "width") {
    const value4 =
      Number(component.position?.x || 0) +
      Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: value4 - Number(value3) / 2,
      width: Number(value3),
    };
    return;
  }
  if (value2 === "height") {
    const value4 =
      Number(component.position?.y || 0) +
      Number(component.position?.height || 100) / 2;
    component.position = {
      ...(component.position || {}),
      y: value4 - Number(value3) / 2,
      height: Number(value3),
    };
    return;
  }
  if (value2 === "scale") {
    component.style = {
      ...(component.style || {}),
      scale: Number(value3),
    };
    return;
  }
  if (value2 === "rotation") {
    component.position = {
      ...(component.position || {}),
      rotation: Number(value3),
    };
    return;
  }
  component.properties = {
    ...(component.properties || {}),
    [value2]: value3,
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
    ...an.querySelectorAll("[data-navigation-style-property]:checked"),
  ].map((value3) => value3.dataset.navigationStyleProperty);
  const value2 = [
    ...mr.querySelectorAll("[data-navigation-target-id]:checked"),
  ].map((value3) => value3.dataset.navigationTargetId);
  if (!sourceId || !value.length || !value2.length) {
    const value3 =
      type === "panel-frame"
        ? "底图框"
        : type === "camera"
          ? "摄像头实时预览"
          : type === "title-button"
            ? "标题按钮"
            : type === "air-conditioner"
              ? "空调"
              : type === "line-chart"
                ? "折线图"
                : type === "icon-button-effect"
                  ? "图标按钮（效果）"
                  : type === "icon-button"
                    ? "图标按钮"
                    : type === "device-button"
                      ? "设备按钮"
                      : type === "presence-sensor"
                        ? "传感器"
                        : "导航按钮";
    ke.textContent = "请至少选择一项修改和一个目标" + value3 + "。";
    ke.hidden = false;
    return;
  }
  Ge.close();
  L((value3) => {
    const component = findComponent(value3, sourceId)?.component;
    if (!!component && component.type === type) {
      for (const value4 of value2) {
        const component2 = findComponent(value3, value4)?.component;
        if (
          !!component2 &&
          component2.type === type &&
          (type !== "presence-sensor" || Ho(component2) === Ho(component))
        ) {
          for (const value5 of value) {
            if (type === "panel-frame") {
              UL(component, component2, value5);
            } else if (type === "camera") {
              _L(component, component2, value5);
            } else if (type === "title-button") {
              KL(component, component2, value5);
            } else if (type === "line-chart") {
              YL(component, component2, value5);
            } else if (type === "icon-button-effect") {
              XL(component, component2, value5);
            } else if (type === "air-conditioner") {
              ZL(component, component2, value5);
            } else if (
              ["icon-button", "device-button", "presence-sensor"].includes(type)
            ) {
              JL(component, component2, value5);
            } else {
              GL(component, component2, value5);
            }
          }
        }
      }
    }
  }).then(() => {
    const element =
      type === "panel-frame"
        ? uc
        : type === "camera"
          ? lc
          : type === "title-button"
            ? zs
            : type === "air-conditioner"
              ? qd
              : type === "line-chart"
                ? dc
                : type === "icon-button-effect"
                  ? Ps
                  : [
                        "icon-button",
                        "device-button",
                        "presence-sensor",
                      ].includes(type)
                    ? Ys
                    : mc;
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
      ["icon-button", "device-button", "presence-sensor"].includes(type)
    ) {
      window.clearTimeout(Rv);
    } else {
      window.clearTimeout(Fv);
    }
    element.classList.add("applied");
    const value3 = window.setTimeout(() => {
      element.classList.remove("applied");
      if (componentId === sourceId) {
        Z();
      }
    }, 1800);
    if (type === "panel-frame") {
      Dv = value3;
    } else if (type === "camera") {
      Hv = value3;
    } else if (type === "title-button") {
      Wv = value3;
    } else if (type === "air-conditioner") {
      jv = value3;
    } else if (type === "line-chart") {
      zv = value3;
    } else if (type === "icon-button-effect") {
      Vv = value3;
    } else if (
      ["icon-button", "device-button", "presence-sensor"].includes(type)
    ) {
      Rv = value3;
    } else {
      Fv = value3;
    }
  });
});
on.addEventListener("click", () => {
  const hidden = Tt.hidden;
  fn8(hidden ? "navigation-icon" : null);
  Tt.hidden = !hidden;
  on.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    Zu(lr.value)
      .then(() => {
        k0();
        lr.focus({
          preventScroll: true,
        });
      })
      .catch(onError);
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
  const value2 = value.target.closest("[data-icon-name]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const icon = value2.dataset.iconName;
  fn8();
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (!component || component.type !== "navigation-button") {
      return;
    }
    const value5 = Ae(component, "icon");
    const value6 = Ae(component, "iconVisible");
    component.properties = {
      ...(component.properties || {}),
      icon: icon,
      iconVisible: !!icon,
    };
    Kn(value3, "icon", value5, Ae(component, "icon"));
    Kn(value3, "iconVisible", value6, Ae(component, "iconVisible"));
  });
});
Qt.addEventListener("click", () => {
  const hidden = Et.hidden;
  fn8(hidden ? "ibe-icon" : null);
  Et.hidden = !hidden;
  Qt.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    Qu(Ca.value)
      .then(() => {
        M0();
        Ca.focus({
          preventScroll: true,
        });
      })
      .catch(onError);
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
  const value2 = value.target.closest("[data-icon-name]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const icon = value2.dataset.iconName;
  fn8();
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (!!component && component.type === "icon-button-effect") {
      component.properties = {
        ...(component.properties || {}),
        icon: icon,
      };
    }
  });
});
Lt.addEventListener("click", () => {
  const hidden = It.hidden;
  fn8(hidden ? "icon-button-icon" : null);
  It.hidden = !hidden;
  Lt.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    ep(za.value)
      .then(() => {
        O0();
        za.focus({
          preventScroll: true,
        });
      })
      .catch(onError);
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
  const value2 = value.target.closest("[data-icon-name]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const icon = value2.dataset.iconName;
  fn8();
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (
      !!component &&
      !!["icon-button", "device-button", "presence-sensor"].includes(
        component.type,
      )
    ) {
      component.properties = {
        ...(component.properties || {}),
        icon: icon,
      };
    }
  });
});
tn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const hidden = je.hidden;
  fn8(hidden ? "title-button-icon" : null);
  if (hidden && je.parentElement !== document.body) {
    document.body.append(je);
  }
  je.hidden = !hidden;
  je.style.position = "fixed";
  je.style.zIndex = "760";
  tn.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    op();
    tp(Ia.value)
      .then(() => {
        op();
        Ia.focus({
          preventScroll: true,
        });
      })
      .catch(onError);
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
  const value2 = value.target.closest("[data-icon-name]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const icon = value2.dataset.iconName;
  fn8();
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (!!component && component.type === "title-button") {
      component.properties = {
        ...(component.properties || {}),
        icon: icon,
        iconVisible: !!icon,
      };
    }
  });
});
nn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const hidden = qe.hidden;
  fn8(hidden ? "light-statistics-icon" : null);
  if (hidden && qe.parentElement !== document.body) {
    document.body.append(qe);
  }
  qe.hidden = !hidden;
  qe.style.position = "fixed";
  qe.style.zIndex = "760";
  nn.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    ip();
    np(Oa.value)
      .then(() => {
        ip();
        Oa.focus({
          preventScroll: true,
        });
      })
      .catch(onError);
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
  const value2 = value.target.closest("[data-light-statistics-icon-name]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const icon = value2.dataset.lightStatisticsIconName;
  fn8();
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (!!component && component.type === "light-statistics") {
      component.properties = {
        ...(component.properties || {}),
        icon: icon,
      };
    }
  });
});
rt.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const hidden = Ie.hidden;
  fn8(hidden ? "light-statistics-entity" : null);
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
        preventScroll: true,
      });
    });
  }
});
Pa.addEventListener("input", () => Xu(Pa.value));
ka.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-light-statistics-entity-id]");
  if (value2) {
    fn7(Ie, rt);
    GN(value2.dataset.lightStatisticsEntityId);
  }
});
G1.addEventListener("click", () => w0());
ag.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-light-statistics-replace-index]");
  const value3 = value.target.closest("[data-light-statistics-remove-index]");
  if (value3) {
    UN(Number(value3.dataset.lightStatisticsRemoveIndex));
    return;
  }
  if (value2) {
    Rt = "";
    ko = Number(value2.dataset.lightStatisticsReplaceIndex);
    Sr = componentId || "";
    ig.hidden = true;
    jn("请选择新的实体。");
    Mr(rt, "选择替换实体");
    rt.click();
  }
});
oi.addEventListener("click", () => {
  const hidden = aa.hidden;
  fn8(hidden ? "entity" : null);
  aa.hidden = !hidden;
  oi.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    $r(ra.value);
    dp();
    window.requestAnimationFrame(() => {
      dp();
      ra.focus({
        preventScroll: true,
      });
    });
  }
});
ra.addEventListener("input", () => $r(ra.value));
_m.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-entity-id]");
  if (!value2 || !componentId) {
    return;
  }
  const value3 = componentId;
  const entityId = value2.dataset.entityId;
  fn8();
  L((value4) => {
    const component = findComponent(value4, value3)?.component;
    if (!component || component.type !== "image") {
      return;
    }
    const text = String(component.bindings?.entity?.entityId || "");
    component.bindings = {
      ...(component.bindings || {}),
    };
    component.properties = {
      ...(component.properties || {}),
      fit: "contain",
    };
    if (entityId) {
      component.bindings.entity = {
        entityId: entityId,
      };
    } else {
      delete component.bindings.entity;
      for (const value5 of ["tap", "doubleTap", "hold"]) {
        if (actionNeedsCurrentEntity(component.actions?.[value5])) {
          delete component.actions[value5];
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
function _t(value, value2 = [value]) {
  const value3 = Un(value);
  value3.button.addEventListener("click", () => {
    const value4 = value2.includes(O()?.type) ? O().type : value;
    const value5 = Un(value4);
    const hidden = value3.menu.hidden;
    fn8(hidden ? value5.except : null);
    value3.menu.hidden = !hidden;
    value3.button.setAttribute("aria-expanded", String(hidden));
    if (hidden) {
      $r(value3.search.value, value4);
      yt(value4);
      window.requestAnimationFrame(() => {
        yt(value4);
        value3.search.focus({
          preventScroll: true,
        });
      });
    }
  });
  value3.search.addEventListener("input", () => {
    const value4 = value2.includes(O()?.type) ? O().type : value;
    $r(value3.search.value, value4);
  });
  value3.options.addEventListener("click", (value4) => {
    const value5 = value4.target.closest("[data-entity-id]");
    const value6 = componentId;
    if (!value5 || !value6) {
      return;
    }
    const entityId = value5.dataset.entityId;
    fn8();
    L((value7) => {
      const component = findComponent(value7, value6)?.component;
      if (!component || !value2.includes(component.type)) {
        return;
      }
      const text = String(component.bindings?.entity?.entityId || "");
      component.bindings = {
        ...(component.bindings || {}),
      };
      component.actions = {
        ...(component.actions || {}),
      };
      if (entityId) {
        component.bindings.entity = {
          entityId: entityId,
        };
        if (component.type === "light-statistics") {
          for (const value8 of ["tap", "doubleTap", "hold"]) {
            const value9 = component.actions?.[value8];
            if (
              (value9?.type === "toggle" &&
                !entityIdSupportsToggle(entityId)) ||
              (value9 && !ACTION_TYPES.includes(value9.type))
            ) {
              delete component.actions[value8];
            }
          }
        }
        if (
          component.type === "air-conditioner" &&
          !Object.keys(component.actions || {}).length
        ) {
          component.actions = {
            tap: {
              type: "more-info",
            },
            doubleTap: {
              type: "toggle",
            },
          };
        }
      } else {
        delete component.bindings.entity;
        if (component.type === "light-statistics") {
          component.actions = Object.fromEntries(
            Object.entries(component.actions || {}).filter(
              ([, value9]) => !actionNeedsCurrentEntity(value9),
            ),
          );
        }
        let value8 = false;
        for (const value9 of ["tap", "doubleTap", "hold"]) {
          if (actionNeedsCurrentEntity(component.actions?.[value9])) {
            delete component.actions[value9];
            value8 = true;
          }
        }
        if (
          component.type === "navigation-button" &&
          value8 &&
          !component.actions.tap
        ) {
          const target = new Set(value7.pages.map((value9) => value9.path)).has(
            component.properties?.targetPage,
          )
            ? component.properties.targetPage
            : W.value || value7.pages[0]?.path || "";
          if (target) {
            component.actions.tap = {
              type: "navigate",
              target: target,
            };
          }
        }
      }
      if (value === "weather") {
        const entityId2 = le.find(
          (value8) => value8.entityId === "sun.sun",
        )?.entityId;
        if (entityId2) {
          component.bindings.sun = {
            entityId: entityId2,
          };
        } else {
          delete component.bindings.sun;
        }
      }
      if (entityId !== text) {
        component.properties = {
          ...(component.properties || {}),
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
  reportError: onError,
});
function QL() {
  Me?.close();
}
function qi({
  kind: kind,
  title: value,
  subtitle: value4 = "",
  searchPlaceholder: value2,
  triggerButton: triggerButton,
  pageSize: pageSize,
  initialPage: value5 = 1,
  selectedText = "",
  emptyText: value3,
  itemClass: value6 = "",
  getPage: fn9,
  renderItem: fn10,
  renderLeadingItems: fn12 = null,
  renderTrailingItems: fn13 = null,
  buildToolbar: fn14 = null,
  onSelect: fn11,
  onDelete: fn15 = null,
  onItemHover: value7 = null,
  closeLegacyPickers: value8 = true,
  renderSelectedActions: fn16 = null,
  renderSelectedContent: fn17 = null,
}) {
  QL();
  if (value8) {
    fn8();
  }
  const dialog = document.createElement("dialog");
  dialog.className = "editor-paged-picker-dialog";
  dialog.dataset.editorPickerKind = kind;
  const value9 = document.createElement("div");
  value9.className = "editor-paged-picker-card" + (fn14 ? " with-toolbar" : "");
  const value10 = document.createElement("div");
  value10.className = "editor-paged-picker-heading";
  const value11 = document.createElement("div");
  value11.className = value4
    ? "editor-paged-picker-heading-copy has-subtitle"
    : "editor-paged-picker-heading-copy";
  const element = document.createElement("strong");
  element.textContent = value;
  const element2 = document.createElement("span");
  element2.textContent = value4;
  value11.append(element);
  if (value4) {
    value11.append(element2);
  }
  const element3 = document.createElement("button");
  element3.type = "button";
  element3.className = "editor-paged-picker-close";
  element3.setAttribute("aria-label", "关闭");
  element3.textContent = "×";
  value10.append(value11, element3);
  const toolbar = document.createElement("div");
  toolbar.className = "editor-paged-picker-toolbar";
  toolbar.hidden = !fn14;
  const value12 = document.createElement("label");
  value12.className = "editor-paged-picker-search";
  const element4 = document.createElement("input");
  element4.type = "search";
  element4.placeholder = value2;
  element4.autocomplete = "off";
  value12.append(element4);
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
    if (fn17) {
      element5.append(
        ...(fn17({
          selectedText: selectedText,
          selectedValueText: selectedValueText,
        }) || []),
      );
    } else {
      const element12 = document.createElement("strong");
      element12.textContent = selectedValueText;
      element12.title = selectedValueText;
      element5.append(element12);
    }
  }
  if (fn16) {
    const value19 = fn16({
      controller: null,
    });
    if (value19?.length) {
      element5.classList.add("has-actions");
      element5.hidden = false;
      element5.append(...value19);
    }
  }
  const value13 = document.createElement("div");
  value13.className = ("editor-paged-picker-items " + value6).trim();
  value13.setAttribute("role", "listbox");
  const value14 = document.createElement("div");
  value14.className = "editor-paged-picker-footer";
  const element6 = document.createElement("span");
  element6.className = "editor-paged-picker-status";
  const value15 = document.createElement("div");
  value15.className = "editor-paged-picker-pagination";
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
  value15.append(element7, element8, element9, element10);
  value14.append(element6, value15);
  value9.append(value10, toolbar, value12, element5, value13, value14);
  dialog.append(value9);
  document.body.append(dialog);
  let value16 = null;
  let value17 = 0;
  let value18 = false;
  const state = {
    page: Math.max(1, Number(value5) || 1),
    total: 0,
    pageCount: 1,
    query: "",
  };
  const controller = {
    kind: kind,
    dialog: dialog,
    triggerButton: triggerButton,
    state: state,
    refresh({ resetPage: value19 = false } = {}) {
      if (value19) {
        state.page = 1;
      }
      return fn19();
    },
    rebuildToolbar() {
      if (!!fn14 && !value18) {
        toolbar.replaceChildren();
        fn14({
          toolbar: toolbar,
          controller: controller,
        });
        toolbar.hidden = !toolbar.childElementCount;
      }
    },
    close() {
      if (!value18) {
        if (dialog.open) {
          dialog.close();
        } else {
          fn18();
        }
      }
    },
  };
  function fn18() {
    if (!value18) {
      value18 = true;
      window.clearTimeout(value16);
      value17 += 1;
      triggerButton?.setAttribute("aria-expanded", "false");
      value13.replaceChildren();
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
  async function fn19() {
    const value19 = ++value17;
    value13.setAttribute("aria-busy", "true");
    element6.textContent = "正在加载…";
    element7.disabled = true;
    element10.disabled = true;
    try {
      const value20 = await fn9({
        query: state.query,
        page: state.page,
        pageSize: pageSize,
      });
      if (value18 || value19 !== value17) {
        return;
      }
      state.total = Math.max(0, Number(value20.total) || 0);
      state.pageCount = Math.max(1, Math.ceil(state.total / pageSize));
      if (state.page > state.pageCount) {
        state.page = state.pageCount;
        await fn19();
        return;
      }
      const value21 = fn12 ? fn12(state) : [];
      const value22 = (value20.items || []).map((value23) => fn10(value23));
      if (!value22.length) {
        const element11 = document.createElement("div");
        element11.className = "editor-paged-picker-empty";
        element11.textContent = value3;
        value22.push(element11);
      }
      if (fn13 && state.page === state.pageCount) {
        value22.push(...(fn13(state) || []));
      }
      value13.replaceChildren(...value21, ...value22);
      value13.scrollTop = 0;
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
      if (value18 || value19 !== value17) {
        return;
      }
      const element11 = document.createElement("div");
      element11.className = "editor-paged-picker-empty error";
      element11.textContent = "加载失败，请稍后重试";
      value13.replaceChildren(element11);
      element6.textContent = "加载失败";
      onError(error);
    } finally {
      if (!value18 && value19 === value17) {
        value13.removeAttribute("aria-busy");
      }
    }
  }
  element3.addEventListener("click", () => controller.close());
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    controller.close();
  });
  dialog.addEventListener("click", (value19) => {
    if (value19.target === dialog) {
      controller.close();
    }
  });
  dialog.addEventListener("close", fn18, {
    once: true,
  });
  element4.addEventListener("input", () => {
    window.clearTimeout(value16);
    value16 = window.setTimeout(() => {
      state.query = element4.value.trim();
      state.page = 1;
      fn19();
    }, 160);
  });
  element7.addEventListener("click", () => {
    if (!(state.page <= 1)) {
      state.page -= 1;
      fn19();
    }
  });
  element10.addEventListener("click", () => {
    if (!(state.page >= state.pageCount)) {
      state.page += 1;
      fn19();
    }
  });
  element8.addEventListener("change", () => {
    const value19 = Math.trunc(Number(element8.value));
    state.page = clampNumber(
      Number.isFinite(value19) ? value19 : state.page,
      1,
      state.pageCount,
    );
    fn19();
  });
  value13.addEventListener("pointerover", (value19) => {
    const value20 = value19.target.closest("[data-editor-picker-value]");
    if (!!value20 && !value20.contains(value19.relatedTarget)) {
      value7?.(value20.dataset.editorPickerValue, value20);
    }
  });
  value13.addEventListener("pointerleave", Qe);
  value13.addEventListener("scroll", Qe);
  value13.addEventListener("click", (event) => {
    const value19 = event.target.closest("[data-delete-user-asset]");
    if (value19 && fn15) {
      event.preventDefault();
      event.stopPropagation();
      const deleteUserAsset = value19.dataset.deleteUserAsset;
      controller.close();
      fn15(deleteUserAsset);
      return;
    }
    const value20 = event.target.closest("[data-editor-picker-value]");
    if (!value20 || !value13.contains(value20)) {
      return;
    }
    const editorPickerValue = value20.dataset.editorPickerValue;
    controller.close();
    fn11(editorPickerValue);
  });
  element5.addEventListener("click", (value19) => {
    const value20 = value19.target.closest("[data-editor-picker-value]");
    if (!value20 || !element5.contains(value20)) {
      return;
    }
    const editorPickerValue = value20.dataset.editorPickerValue;
    controller.close();
    fn11(editorPickerValue);
  });
  Me = controller;
  triggerButton?.setAttribute("aria-expanded", "true");
  controller.rebuildToolbar();
  dialog.showModal();
  fn19();
  window.requestAnimationFrame(() =>
    element4.focus({
      preventScroll: true,
    }),
  );
  return controller;
}
function Gi(value, value2, value3) {
  const value4 = document.createElement("button");
  value4.type = "button";
  value4.dataset[value2] = value3;
  value.replaceChildren(value4);
  value4.click();
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
      clear: "不使用图标",
    },
    {
      button: Qt,
      title: "选择效果按钮图标",
      options: Sa,
      datasetKey: "iconName",
      current: component?.properties?.icon || "",
      clear: "不使用图标",
    },
    {
      button: Lt,
      title: "选择按钮图标",
      options: Va,
      datasetKey: "iconName",
      current: component?.properties?.icon || "",
      clear:
        component?.type === "device-button" ? "跟随实体图标" : "不使用图标",
    },
    {
      button: tn,
      title: "选择标题图标",
      options: Ta,
      datasetKey: "iconName",
      current: component?.properties?.icon || "",
      clear: "不使用图标",
    },
    {
      button: nn,
      title: "选择统计图标",
      options: Ba,
      datasetKey: "lightStatisticsIconName",
      current: String(
        Object.hasOwn(component?.properties || {}, "icon")
          ? component?.properties?.icon || ""
          : "mdi:lightbulb-group-outline",
      ),
      clear: "不使用图标",
    },
  ].find((value3) => value3.button === triggerButton);
  if (!value) {
    return false;
  }
  const value2 = qi({
    kind: "icon",
    title: value.title,
    searchPlaceholder: "搜索图标名称",
    triggerButton: triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.icon,
    selectedText: "",
    emptyText: "没有匹配的图标",
    itemClass: "icon-grid",
    async getPage({ query: value3, page: value4, pageSize: value5 }) {
      const value6 = (value4 - 1) * value5;
      const value7 = await J(
        "/icons?query=" +
          encodeURIComponent(value3) +
          "&limit=" +
          value5 +
          "&offset=" +
          value6,
      );
      return {
        items: value7.items || [],
        total: Number(value7.total) || 0,
      };
    },
    renderLeadingItems: () => [],
    renderSelectedActions: () => [
      Object.assign(document.createElement("span"), {
        className: "editor-paged-picker-current-label",
        textContent: "当前选择",
      }),
      sE(value.current, value.clear),
      zr(value.clear, !value.current),
    ],
    renderItem(value3) {
      const value4 = B0(value3, value.current, "editorPickerValue");
      value4.dataset.editorPickerValue = value3.name;
      return value4;
    },
    onSelect: (onSelect) => Gi(value.options, value.datasetKey, onSelect),
  });
  return true;
}
function Yw(triggerButton) {
  const component = O();
  const value =
    triggerButton === oi
      ? "image"
      : triggerButton === pi &&
          ["icon-button", "device-button", "presence-sensor"].includes(
            component?.type,
          )
        ? component.type
        : [
            "weather",
            "line-chart",
            "title-button",
            "light-statistics",
            "icon-button-effect",
            "vacuum-map",
            "camera",
            "air-conditioner",
            "navigation-button",
          ].find((value8) => Un(value8).button === triggerButton);
  if (!value) {
    return false;
  }
  const value2 = componentId;
  if (
    sl(
      triggerButton,
      () => Yw(triggerButton),
      () => componentId === value2,
    )
  ) {
    return true;
  }
  const value3 = Un(value);
  const value4 = component?.bindings?.entity?.entityId || "";
  const value5 = qn(value).find((value8) => value8.entityId === value4) || null;
  const value6 = kr()[0] || null;
  const value7 = $0(value, "").findIndex(
    (value8) => value8.entityId === value4,
  );
  qi({
    kind: "entity",
    title: "选择实体",
    subtitle: lE(value) + " · " + rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(value7, value6),
    selectedText: value4 || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({ query: value8, page: value9 }) {
      const value10 = $0(value, value8);
      return editorEntityPickerPage(value10, value9, value6);
    },
    renderLeadingItems: (renderLeadingItems) =>
      renderLeadingItems.page === 1 && value6 ? [_n(value6, value4)] : [],
    renderSelectedContent: () => [mp(value5)],
    renderSelectedActions: () => [zr("不使用实体", !value4)],
    renderItem: (renderItem) => _n(renderItem, value4),
    onSelect: (onSelect) => Gi(value3.options, "entityId", onSelect),
  });
  return true;
}
function Xw() {
  if (O()?.type !== "light-statistics") {
    return false;
  }
  const value = componentId;
  if (
    sl(rt, Xw, () => componentId === value && O()?.type === "light-statistics")
  ) {
    return true;
  }
  const fn9 = (value5) => {
    const value6 = String(value5 || "")
      .trim()
      .toLocaleLowerCase("zh-CN");
    return qn("light-statistics")
      .map((entity, index) => ({
        entity: entity,
        index: index,
        support: lightStatisticsEntitySupport(entity),
      }))
      .filter(
        ({ entity: value7 }) =>
          !value6 ||
          (ct(value7) + " " + fe(value7))
            .toLocaleLowerCase("zh-CN")
            .includes(value6),
      )
      .sort(
        (value7, value8) =>
          Number(value8.support.supported) - Number(value7.support.supported) ||
          +(fe(value8.entity) === "light") - +(fe(value7.entity) === "light") ||
          value7.index - value8.index,
      )
      .map(({ entity: value7 }) => value7);
  };
  const value2 = fn9("").findIndex((value5) => value5.entityId === Rt);
  const value3 = kr()[0] || null;
  const value4 = qi({
    kind: "entity",
    title: ko >= 0 ? "选择替换实体" : "添加统计实体",
    subtitle: rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: rt,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(value2, value3),
    selectedText: Rt || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    closeLegacyPickers: false,
    getPage({ query: value5, page: value6 }) {
      const value7 = fn9(value5);
      return editorEntityPickerPage(value7, value6, value3);
    },
    renderLeadingItems: (renderLeadingItems) =>
      renderLeadingItems.page === 1 && value3 ? [_n(value3, Rt)] : [],
    renderItem: (renderItem) => _n(renderItem, Rt),
    onSelect: (onSelect) => Gi(ka, "lightStatisticsEntityId", onSelect),
  });
  return true;
}
function Kw(triggerButton) {
  const value = triggerButton.closest("[data-action-trigger]");
  const element = value?.querySelector("[data-popup-entity]");
  const value2 = value?.querySelector("[data-popup-entity-options]");
  if (!value || !element || !value2) {
    return false;
  }
  if (
    sl(
      triggerButton,
      () => Kw(triggerButton),
      () => value.isConnected,
    )
  ) {
    return true;
  }
  const value3 = element.value || "";
  const value4 = le.find((value7) => value7.entityId === value3) || null;
  const value5 = kr()[0] || null;
  const fn9 = (value7) => {
    const value8 = String(value7 || "")
      .trim()
      .toLocaleLowerCase("zh-CN");
    return le.filter(
      (value9) =>
        !value9.virtual &&
        (!value8 ||
          (ct(value9) + " " + value9.entityId)
            .toLocaleLowerCase("zh-CN")
            .includes(value8)),
    );
  };
  const value6 = fn9("").findIndex((value7) => value7.entityId === value3);
  qi({
    kind: "entity",
    title: "选择弹窗实体",
    subtitle: rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(value6, value5),
    selectedText: value3 || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({ query: value7, page: value8 }) {
      const value9 = fn9(value7);
      return editorEntityPickerPage(value9, value8, value5);
    },
    renderItem: (renderItem) => _n(renderItem, value3),
    renderLeadingItems: (renderLeadingItems) =>
      renderLeadingItems.page === 1 && value5 ? [_n(value5, value3)] : [],
    renderSelectedContent: () => [mp(value4)],
    renderSelectedActions: () => [zr("不使用实体", !value3)],
    onSelect: (onSelect) => Gi(value2, "popupActionEntityId", onSelect),
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
  const value2 = le.find((value5) => value5.entityId === value) || null;
  const value3 = kr()[0] || null;
  const fn9 = (value5) => {
    const value6 = String(value5 || "")
      .trim()
      .toLocaleLowerCase("zh-CN");
    return le
      .map((entity, index) => ({
        entity: entity,
        index: index,
      }))
      .filter(
        ({ entity: value7 }) =>
          !value7.virtual &&
          (!value6 ||
            (ct(value7) + " " + value7.entityId)
              .toLocaleLowerCase("zh-CN")
              .includes(value6)),
      )
      .sort(
        (value7, value8) =>
          Number(
            popupModuleEntityRecommended(value8.entity, he.elements.type.value),
          ) -
            Number(
              popupModuleEntityRecommended(
                value7.entity,
                he.elements.type.value,
              ),
            ) || value7.index - value8.index,
      )
      .map(({ entity: value7 }) => value7);
  };
  const value4 = fn9("").findIndex((value5) => value5.entityId === value);
  qi({
    kind: "entity",
    title: "选择模块实体",
    subtitle: rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: rn,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(value4, value3),
    selectedText: value || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({ query: value5, page: value6 }) {
      const value7 = fn9(value5);
      return editorEntityPickerPage(value7, value6, value3);
    },
    renderItem: (renderItem) => _n(renderItem, value),
    renderLeadingItems: (renderLeadingItems) =>
      renderLeadingItems.page === 1 && value3 ? [_n(value3, value)] : [],
    renderSelectedContent: () => [mp(value2)],
    renderSelectedActions: () => [zr("不使用实体", !value)],
    onSelect: (onSelect) => Gi(Ii, "popupModuleEntityId", onSelect),
  });
  return true;
}
function tI(triggerButton) {
  const value =
    triggerButton === Cn ? "image" : triggerButton === En ? "ibe" : "";
  if (!value) {
    return false;
  }
  const value2 = value === "image";
  const component = O();
  const value3 = value2
    ? component?.properties?.assetId || ""
    : component?.properties?.effectAssetId || "";
  const value4 = Ut(value3);
  gn({
    refreshInspector: false,
  })
    .then(() => {
      if (Me?.triggerButton === triggerButton) {
        Me.syncAssetToolbar?.();
        Me.refresh();
      }
    })
    .catch(onError);
  const value5 = F0(value).findIndex((value6) => Vc(value6, value3));
  qi({
    kind: value + "-asset",
    title: value2 ? "选择控件图片" : "选择效果图片",
    subtitle: "我的图片与栖光素材 · 固定分页加载",
    searchPlaceholder: "搜索图片名称",
    triggerButton: triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.asset,
    initialPage:
      value5 < 0 ? 1 : Math.floor(value5 / EDITOR_PICKER_PAGE_SIZES.asset) + 1,
    selectedText: value4?.name || value3 || "不使用图片",
    emptyText: "没有匹配的图片",
    itemClass: "asset-grid",
    getPage({ query: value6, page: value7, pageSize: value8 }) {
      const value9 = F0(value, value6);
      const value10 = (value7 - 1) * value8;
      return {
        items: value9.slice(value10, value10 + value8),
        total: value9.length,
      };
    },
    renderSelectedContent: () => [cE(value4)],
    renderSelectedActions: () => [zr("不使用图片", !value3)],
    renderItem(value6) {
      const value7 = bp(value6, value3);
      const value8 = value7.matches?.("[data-asset-id]")
        ? value7
        : value7.querySelector("[data-asset-id]");
      if (value8) {
        value8.dataset.editorPickerValue = value6.assetId;
      }
      return value7;
    },
    buildToolbar: (buildToolbar) => dE(value, buildToolbar),
    onItemHover: (onItemHover, onItemHover2) =>
      hp(Ut(onItemHover), onItemHover2, Me?.dialog),
    onDelete: Qw,
    onSelect: (onSelect) => Gi(value2 ? zt : en, "assetId", onSelect),
  })?.dialog.append(Jt);
  return true;
}
function jp(value, value2) {
  const value3 = value2 === "user" ? "user" : "builtin";
  if (value === "image") {
    Vt = value3;
    Sn.value = "";
    Yn("image");
    Ro("image");
    if (Me?.kind === "image-asset") {
      Me.rebuildToolbar();
      Me.refresh({
        resetPage: true,
      });
    } else {
      Wr();
      Vr();
    }
  } else {
    Wt = value3;
    Ln.value = "";
    Yn("ibe");
    Ro("ibe");
    if (Me?.kind === "ibe-asset") {
      Me.rebuildToolbar();
      Me.refresh({
        resetPage: true,
      });
    } else {
      Hr();
      Rr();
    }
  }
}
async function Zw(value, value2) {
  const value3 = [...(value || [])];
  if (!value3.length) {
    return;
  }
  const value4 = value2 === "image" ? Ym : hf;
  value4.disabled = true;
  const value5 = [];
  try {
    for (const body of value3) {
      if (!/\.(png|jpe?g|webp|svg)$/i.test(body.name)) {
        value5.push(body.name + "：仅支持 PNG、JPG、JPEG、WebP 和 SVG");
        continue;
      }
      try {
        await J("/assets/user", {
          method: "POST",
          body: body,
          headers: {
            "Content-Type": body.type || "application/octet-stream",
            "X-File-Name": encodeURIComponent(body.name),
          },
        });
      } catch (error) {
        value5.push(body.name + "：" + error.message);
      }
    }
    await gn({
      refreshInspector: false,
    });
    jp(value2, "user");
    if (value5.length) {
      onError(new Error(value5.join("\n")));
    }
  } finally {
    value4.disabled = false;
  }
}
function Qw(value) {
  const value2 = Ut(value);
  if (!value2 || value2.source !== "user") {
    return;
  }
  const fn9 = (value3) =>
    Array.isArray(value3)
      ? value3.some(fn9)
      : value3 && typeof value3 == "object"
        ? Object.values(value3).some(fn9)
        : value3 === value2.assetId;
  if (fn9(h?.document)) {
    fn8();
    onError(
      new Error("这张图片正在被当前仪表盘或弹窗使用，请先替换或移除后再删除。"),
    );
    return;
  }
  Lu = value2.assetId;
  hN.textContent = "“" + value2.name + "”";
  fn8();
  Lo.showModal();
}
function eC(kind, folderName) {
  if (!fp(kind === "image" ? Vt : Wt, folderName)) {
    return;
  }
  const value = uE(folderName);
  const value2 = "studio3d:" + folderName + "/";
  const fn9 = (value3) =>
    Array.isArray(value3)
      ? value3.some(fn9)
      : value3 && typeof value3 == "object"
        ? Object.values(value3).some(fn9)
        : typeof value3 == "string" && value3.startsWith(value2);
  if (fn9(h?.document)) {
    onError(
      new Error(
        "这个文件夹中的图片正在被当前仪表盘或弹窗使用，请先替换或移除后再删除。",
      ),
    );
    return;
  }
  Cc = {
    kind: kind,
    folderName: folderName,
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
      resetPage: true,
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
  const value2 = value.target.closest("[data-image-asset-source]");
  if (value2) {
    jp("image", value2.dataset.imageAssetSource);
  }
});
He.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-ibe-asset-source]");
  if (value2) {
    jp("ibe", value2.dataset.ibeAssetSource);
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
        method: "DELETE",
      });
      Lu = null;
      Lo.close();
      await gn();
    } catch (error) {
      if (error?.code === "ASSET_IN_USE") {
        onError(
          new Error(
            "这张图片仍被户型图绘制或仪表盘使用，请先移除引用后再删除。",
          ),
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
          "X-Export-Folder": encodeURIComponent(value.folderName),
        },
      });
      Cc = null;
      Bn.close();
      await gn({
        refreshInspector: false,
      });
      nI();
    } catch (error) {
      if (error?.code === "STUDIO3D_EXPORT_IN_USE") {
        onError(
          new Error(
            "这个文件夹中的图片仍被仪表盘、弹窗或户型图绘制使用，请先移除引用后再删除。",
          ),
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
  fn8(hidden ? "asset" : null);
  Re.hidden = !hidden;
  Cn.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    try {
      await gn({
        refreshInspector: false,
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
        preventScroll: true,
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
  const value2 = value.target.closest("[data-asset-id]");
  if (!value2 || value2.contains(value.relatedTarget)) {
    return;
  }
  const value3 = Ut(value2.dataset.assetId);
  hp(value3, value2);
});
zt.addEventListener("pointerleave", Qe);
zt.addEventListener("scroll", Qe);
zt.addEventListener("click", async (value) => {
  const value2 = value.target.closest("[data-asset-id]");
  if (!value2 || !componentId) {
    return;
  }
  const value3 = componentId;
  const assetId = value2.dataset.assetId;
  Qe();
  fn8();
  if (!assetId) {
    L((value5) => {
      const component = findComponent(value5, value3)?.component;
      if (!!component && component.type === "image") {
        component.properties = {
          ...(component.properties || {}),
          fit: "contain",
        };
        delete component.properties.assetId;
        delete component.properties.naturalWidth;
        delete component.properties.naturalHeight;
      }
    });
    return;
  }
  const value4 = Ut(assetId);
  if (value4) {
    try {
      const value5 = await gp(value4);
      L((value6) => {
        const component = findComponent(value6, value3)?.component;
        if (!!component && component.type === "image") {
          V0(component, assetId, value5);
        }
      });
    } catch (error) {
      onError(error);
    }
  }
});
En.addEventListener("click", async () => {
  const hidden = He.hidden;
  fn8(hidden ? "ibe-asset" : null);
  He.hidden = !hidden;
  En.setAttribute("aria-expanded", String(hidden));
  if (hidden) {
    try {
      await gn({
        refreshInspector: false,
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
        preventScroll: true,
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
  const value2 = value.target.closest("[data-asset-id]");
  if (!!value2 && !value2.contains(value.relatedTarget)) {
    hp(Ut(value2.dataset.assetId), value2, He);
  }
});
en.addEventListener("pointerleave", Qe);
en.addEventListener("scroll", Qe);
en.addEventListener("click", async (value) => {
  const value2 = value.target.closest("[data-asset-id]");
  const value3 = componentId;
  if (!value2 || !value3) {
    return;
  }
  const assetId = value2.dataset.assetId;
  Qe();
  fn8();
  const value4 = assetId ? Ut(assetId) : null;
  let value5 = null;
  if (value4) {
    try {
      value5 = await gp(value4);
    } catch (error) {
      onError(error);
      return;
    }
  }
  L((value6) => {
    const component = findComponent(value6, value3)?.component;
    if (!!component && component.type === "icon-button-effect") {
      component.properties = {
        ...(component.properties || {}),
      };
      if (assetId && value5) {
        component.properties.effectAssetId = assetId;
        component.properties.effectNaturalWidth = value5.width;
        component.properties.effectNaturalHeight = value5.height;
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
    document: clone(value.document),
  };
  componentId = findComponent(h.document, value.selectedComponentId)
    ? value.selectedComponentId
    : null;
  const list = Array.isArray(value.selectedComponentIds)
    ? value.selectedComponentIds.filter((value2) =>
        findComponent(h.document, value2),
      )
    : [];
  bag = new Set(list.length ? list : componentId ? [componentId] : []);
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
  const value2 = value.target.closest("[data-template-id]");
  const value3 = W.value;
  if (!value2 || !value3) {
    return;
  }
  const value4 = vc;
  const value5 = De ? findComponent(h?.document, De) : null;
  const value6 = value5?.component?.type === "group" ? value5.component : null;
  const value7 = value6 ? value5.scope : value4;
  const id2 = newId("component");
  Xo.close();
  componentId = id2;
  bag = new Set([id2]);
  we = id2;
  const value8 = L((document) => {
    const value10 = document.pages.find((value17) => value17.path === value3);
    if (!value10) {
      throw new Error("当前页面不存在。");
    }
    const value11 = value6 ? findComponent(document, value6.id) : null;
    const value12 =
      value11?.component?.type === "group" ? value11.component : null;
    const value13 =
      value4 === "shared" ? document.sharedComponents : value10.components;
    const value14 = value12 ? (value12.children ||= []) : value13;
    const value15 =
      value2.dataset.templateId === "navigation-button"
        ? "导航按钮"
        : value2.dataset.templateId === "floorplan-auto-diagram"
          ? "户型图自动导图"
          : value2.dataset.templateId === "icon-button-effect"
            ? "图标按钮（效果）"
            : value2.dataset.templateId === "title-button"
              ? "标题按钮"
              : value2.dataset.templateId === "light-statistics"
                ? "数量统计"
                : value2.dataset.templateId === "icon-button"
                  ? "图标按钮"
                  : value2.dataset.templateId === "device-button"
                    ? "设备按钮"
                    : value2.dataset.templateId === "presence-sensor"
                      ? "传感器"
                      : value2.dataset.templateId === "air-conditioner"
                        ? "空调 / 浴霸"
                        : value2.dataset.templateId === "vacuum-map"
                          ? "扫地机器人实时地图"
                          : value2.dataset.templateId === "camera"
                            ? "摄像头实时预览"
                            : value2.dataset.templateId === "time"
                              ? "时间"
                              : value2.dataset.templateId === "date"
                                ? "日期"
                                : value2.dataset.templateId === "weather"
                                  ? "天气"
                                  : value2.dataset.templateId === "line-chart"
                                    ? "折线图"
                                    : value2.dataset.templateId ===
                                        "panel-frame"
                                      ? "底图框"
                                      : value2.dataset.templateId ===
                                          "interaction3d"
                                        ? "3D 交互"
                                        : "图片";
    const instanceName = nextTemplateInstanceName(value14, value15);
    const value16 = createComponentFromTemplate(value2.dataset.templateId, {
      id: id2,
      instanceName: instanceName,
      canvas: document.canvas,
      uiPackId: jt(document),
    });
    if (value12) {
      const numeric = Number(value12.position?.width || 100);
      const numeric2 = Number(value12.position?.height || 100);
      const numeric3 = Number(value16.position?.width || 100);
      const numeric4 = Number(value16.position?.height || 100);
      value16.position = {
        ...(value16.position || {}),
        x: (numeric - numeric3) / 2,
        y: (numeric2 - numeric4) / 2,
      };
    }
    value14.unshift(value16);
    applyCollectionLayerOrder(value14);
    if (value7 === "shared" && !value12) {
      for (const value17 of document.pages) {
        value17.sharedComponentIds = [
          value16.id,
          ...(value17.sharedComponentIds || []).filter(
            (value18) => value18 !== value16.id,
          ),
        ];
      }
      syncSharedComponentReferenceOrder(document);
    }
  }, value3);
  if (value2.dataset.templateId === "floorplan-auto-diagram") {
    value8.then(() =>
      mw(id2, {
        cancelRemovesComponent: true,
      }),
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
  const value2 = findCustomPopup(h?.document, se);
  aN.textContent = value === "rename" ? "重命名组合弹窗" : "新建组合弹窗";
  gc.elements.name.value =
    value === "rename" ? value2?.name || "" : "新建组合弹窗";
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
      const value2 = value.customPopups.find((value3) => value3.id === se);
      if (value2) {
        value2.name = name;
      }
      return;
    }
    value.customPopups.push({
      id: id2,
      name: name,
      templateRef: {
        uiPackId: jt(value),
        templateId: "custom-popup",
        version: 1,
      },
      layout: {
        columns: 3,
      },
      modules: [],
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
  const value2 = value.target.closest("[data-popup-id]");
  if (value2) {
    Ic();
    se = value2.dataset.popupId;
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
  const value2 = Ft.getBoundingClientRect();
  Ft.style.left =
    clampNumber(event.clientX, 8, window.innerWidth - value2.width - 8) + "px";
  Ft.style.top =
    clampNumber(event.clientY, 8, window.innerHeight - value2.height - 8) +
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
  const popupAction = value.target.closest("[data-popup-action]")?.dataset
    .popupAction;
  const value2 = Eu || se;
  Ic();
  if (!!popupAction && !!value2) {
    if (popupAction === "rename") {
      tC("rename");
      return;
    }
    if (popupAction === "duplicate") {
      const value3 = newId("custom-popup");
      se = value3;
      L((value4) => {
        const value5 = (value4.customPopups || []).find(
          (value7) => value7.id === value2,
        );
        if (!value5) {
          return;
        }
        const value6 = clone(value5);
        value6.id = value3;
        value6.name = value5.name + "_副本";
        value6.modules = (value6.modules || []).map((value7) => ({
          ...value7,
          id: newId("popup-module"),
        }));
        value4.customPopups.push(value6);
      });
      return;
    }
    if (popupAction === "delete") {
      const value3 = (h?.document?.customPopups || []).find(
        (value4) => value4.id === value2,
      );
      if (!value3) {
        return;
      }
      wr = value2;
      mN.textContent = value3.name;
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
        (value3) => value3.id !== value,
      );
      const fn9 = (value3) => {
        for (const value4 of value3 || []) {
          for (const [value5, value6] of Object.entries(value4.actions || {})) {
            if (
              value6.type === "more-info" &&
              value6.data?.popupSource === "custom" &&
              value6.data?.popupId === value
            ) {
              value4.actions[value5] = {
                type: "none",
                data: {},
              };
            }
          }
          fn9(value4.children);
        }
      };
      fn9(document.sharedComponents);
      for (const value3 of document.pages || []) {
        fn9(value3.components);
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
        preventScroll: true,
      }),
    );
  }
});
hc.addEventListener("input", () => X0());
Ii.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-popup-module-entity-id]");
  if (value2) {
    he.elements.entityId.value = value2.dataset.popupModuleEntityId;
    Y0();
    zi();
  }
});
yu.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-popup-module-device-type]");
  if (!!value2 && he.elements.type.value === "climate") {
    wp(value2.dataset.popupModuleDeviceType);
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
    he.elements.deviceType.value,
  );
  if (!value || !entityId) {
    return;
  }
  const value2 = findCustomPopup(h?.document, se);
  const value3 = {
    id: vr || "candidate",
    type: type,
    entityId: entityId,
    ...(title
      ? {
          title: title,
        }
      : {}),
    ...(type === "climate"
      ? {
          properties: {
            deviceType: deviceType,
          },
        }
      : {}),
  };
  const value4 = vr
    ? (value2?.modules || []).map((value5) =>
        value5.id === vr
          ? {
              ...value5,
              ...value3,
            }
          : value5,
      )
    : [...(value2?.modules || []), value3];
  if (!value2 || !packPopupModules(value4, value2.layout).fits) {
    onError(new Error("当前布局已超过 3 行，可增加列数或删除其它模块。"));
    return;
  }
  zi();
  Li.close();
  L((value5) => {
    const value6 = (value5.customPopups || []).find(
      (value7) => value7.id === value,
    );
    if (!value6) {
      return;
    }
    const component = value6.modules.find((value7) => value7.id === vr);
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
          deviceType: deviceType,
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
    value6.modules.push({
      id: newId("popup-module"),
      type: type,
      entityId: entityId,
      ...(title
        ? {
            title: title,
          }
        : {}),
      ...(type === "climate"
        ? {
            properties: {
              deviceType: deviceType,
            },
          }
        : {}),
    });
  });
});
document.addEventListener("pointerdown", (value) => {
  const value2 = value.target.closest("#delete-asset-folder-dialog");
  if (!Pe.contains(value.target)) {
    _u();
  }
  if (
    !value2 &&
    Bo &&
    !Bo.button.contains(value.target) &&
    !Bo.menu.contains(value.target)
  ) {
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
    !value.target.closest("#popup-actions-menu")
  ) {
    Ic();
  }
  if (!value.target.closest("#popup-module-entity-picker")) {
    zi();
  }
  if (!value.target.closest(".component-popup-entity-picker")) {
    Wc();
  }
  if (!value.target.closest("#image-entity-picker")) {
    fn7(aa, oi);
  }
  if (!value.target.closest("#weather-entity-picker")) {
    fn7(Zd, Jd);
  }
  if (!value.target.closest("#line-chart-entity-picker")) {
    fn7(eu, Qd);
  }
  if (!value.target.closest("#ibe-entity-picker")) {
    fn7(Ts, Gl);
  }
  if (!value.target.closest("#icon-button-entity-picker")) {
    fn7(mi, pi);
  }
  if (!value.target.closest("#vacuum-map-entity-picker")) {
    fn7(nc, Gd);
  }
  if (!value.target.closest("#camera-entity-picker")) {
    fn7(ac, Yd);
  }
  if (!value.target.closest("#air-conditioner-entity-picker")) {
    fn7(Js, Dd);
  }
  if (!value.target.closest("#title-button-entity-picker")) {
    fn7(Ms, ad);
  }
  if (
    !Ie.hidden &&
    !value.target.closest("#light-statistics-entity-picker") &&
    !Ie.contains(value.target)
  ) {
    fn7(Ie, rt);
    Pr();
  }
  if (!value.target.closest("#light-statistics-action-entity-picker")) {
    fn7(Vs, dd);
  }
  if (!value.target.closest("#navigation-entity-picker")) {
    fn7(iu, ou);
  }
  const menu = Vn.get(po)?.menu;
  if (
    !value2 &&
    !value.target.closest("#image-asset-picker") &&
    !menu?.contains(value.target)
  ) {
    fn7(Re, Cn);
  }
  const menu2 = Vn.get(ho)?.menu;
  if (
    !value2 &&
    !value.target.closest("#ibe-asset-picker") &&
    !menu2?.contains(value.target)
  ) {
    fn7(He, En);
  }
  if (!value.target.closest("#ibe-icon-picker") && !Et.contains(value.target)) {
    fn7(Et, Qt);
  }
  if (
    !value.target.closest("#icon-button-icon-picker") &&
    !It.contains(value.target)
  ) {
    fn7(It, Lt);
  }
  if (
    !value.target.closest("#title-button-icon-picker") &&
    !je.contains(value.target)
  ) {
    fn7(je, tn);
  }
  if (
    !value.target.closest("#light-statistics-icon-picker") &&
    !qe.contains(value.target)
  ) {
    fn7(qe, nn);
  }
  if (
    !value.target.closest("#navigation-icon-picker") &&
    !Tt.contains(value.target)
  ) {
    fn7(Tt, on);
  }
});
const oC = new Set([Nn, bo, Aa, $a, Wa, ja, qa, Ua, yo, vo, wo, Co, So, An]);
document.addEventListener(
  "input",
  (event) => {
    if (bag.size < 2 || !oC.has(event.target)) {
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
  true,
);
document.addEventListener(
  "change",
  (event) => {
    if (bag.size < 2 || !oC.has(event.target)) {
      return;
    }
    event.stopPropagation();
    const numeric = Number(event.target.value);
    if (!Number.isFinite(numeric)) {
      Z();
      return;
    }
    const allowed = new Set(bag);
    const value = l0(clampNumber(numeric, 1, 500) / 100);
    if (value.length) {
      L((value2) => {
        for (const value3 of value) {
          if (!allowed.has(value3.componentId)) {
            continue;
          }
          const component = findComponent(
            value2,
            value3.componentId,
          )?.component;
          if (component) {
            component.position = {
              ...(component.position || {}),
              x: value3.x,
              y: value3.y,
            };
            component.style = {
              ...(component.style || {}),
              scale: value3.scale,
            };
          }
        }
      });
    }
  },
  true,
);
document.addEventListener("keydown", (event) => {
  const value = event.target.closest(
    'input, textarea, select, button, [contenteditable="true"], dialog',
  );
  if (Te === "edit" && bag.size && !value) {
    if (
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      !event.shiftKey &&
      event.key.toLowerCase() === "d"
    ) {
      event.preventDefault();
      f0([...bag], componentId);
      return;
    }
    if (
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      (event.key === "Delete" || event.key === "Backspace")
    ) {
      event.preventDefault();
      h0([...bag]);
      return;
    }
  }
  const value2 = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
  };
  if (
    value2[event.key] &&
    Te === "edit" &&
    bag.size &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !value
  ) {
    event.preventDefault();
    const value4 = event.shiftKey ? 10 : 1;
    const [value5, value6] = value2[event.key];
    kN(value5 * value4, value6 * value4);
    return;
  }
  if (event.key !== "Enter" || event.isComposing) {
    return;
  }
  const value3 = event.target.closest(
    'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"])',
  );
  if (value3) {
    event.preventDefault();
    value3.blur();
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
    "[data-popup-entity-menu]:not([hidden])",
  )) {
    Hc(value.closest("[data-action-trigger]"));
  }
});
window.addEventListener("resize", () => {
  bm();
  ym();
  _u();
  Ht();
  fn8();
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
      method: "POST",
    });
    window.location.assign("/login");
  }
});
Kv();
e0(document);
t0(document);
const iC = (value) => {
  const value2 = ii.getBoundingClientRect();
  Nr = clampNumber(
    (value.clientX - value2.left) / Math.max(1, value2.width),
    0,
    1,
  );
  Er =
    1 -
    clampNumber(
      (value.clientY - value2.top) / Math.max(1, value2.height),
      0,
      1,
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
  const value2 = clampNumber(Number(Vl.value), 0, 255);
  const value3 = clampNumber(Number(Wl.value), 0, 255);
  if ([value, value2, value3].every(Number.isFinite)) {
    Fo(rgbToHex(value, value2, value3), true);
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
      const value2 = normalizedHexColor(value);
      if (!value2) {
        throw new Error("剪贴板中没有可用的十六进制颜色值。");
      }
      xn.value = value2.toUpperCase();
      Fo(value2, true);
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
    let value2 = false;
    if ([on, Qt, Lt, tn, nn].includes(value)) {
      value2 = eI(value);
    } else if (value === rt) {
      value2 = Xw();
    } else if (value.matches("[data-popup-entity-button]")) {
      value2 = Kw(value);
    } else if (value === rn) {
      value2 = Jw();
    } else if ([Cn, En].includes(value)) {
      value2 = tI(value);
    } else {
      value2 = Yw(value);
    }
    if (value2) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true,
);
document.addEventListener("pointerdown", (value) => {
  if (!pt.hidden && !pt.contains(value.target) && value.target !== me) {
    Qv();
  }
});
new MutationObserver((value) => {
  for (const value2 of value) {
    for (const value3 of value2.addedNodes) {
      if (value3 instanceof HTMLElement) {
        Kv(value3);
        e0(value3);
        t0(value3);
      }
    }
  }
}).observe(document.body, {
  childList: true,
  subtree: true,
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
    preserveForm: false,
  }),
  _c(),
  gn(),
  jc(),
])
  .then(() => _e())
  .catch(onError);
