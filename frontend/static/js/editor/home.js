import { PanelRenderer, airflowCanvasOffsetBounds, setBuiltinAssetVersions, syncedLineChartProperties } from "../../renderer/renderer.js?v=20260909-curtain-action-v15";
import { lightStatisticsEntityStateStatus, lightStatisticsEntitySupport } from "../../renderer/registry.js?v=20260814-tablet-resolution-v84-20260818-airer-v1-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-line-chart-performance-v3-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-effect-variant-v1-20260823-navigation-current-page-v1-20260824-light-statistics-v6-20260825-effect-load-queue-v1-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-editor-media-preview-v1-20260828-count-statistics-v1-20260831-background-media-v1-20260831-vacuum-map-background-v1-20260901-renderer-presence-runtime-v1-20260901-renderer-light-statistics-runtime-v1-20260901-renderer-line-chart-runtime-v1-20260901-renderer-door-window-runtime-v1-20260901-renderer-weather-chart-v2-20260901-renderer-date-time-runtime-v1-20260901-camera-prewarm-v1-20260901-vacuum-map-retry-v1-20260901-light-effect-first-frame-v1-20260901-light-effect-toggle-confirm-v1-20260901-light-effect-layering-v2-20260901-light-effect-color-cache-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260905-client-log-v1-20260906-i3d-complete-v6-20260827-runtime-hydration-retry-v1-20260908-access-lock-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1";
import { applyUiPackToDocument, createComponentFromTemplate, dateComponentDimensions, ensureUiPackRuntime, listComponentTemplates, timeComponentDimensions, weatherComponentDimensions } from "../ui-packs/loader.js?v=20260811-water-heater-popup-v44-20260815-component-thumbnails-v2-20260822-light-feedback-controls-v1-20260824-light-statistics-v6-20260828-count-statistics-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260908-environment-v1-20260908-lighting-mode-v1";
import { clone as cloneValue, newId, normalizedHexColor, hexToRgb, rgbToHex, rgbToHsv, hsvToRgb, roundField, clampNumber, normalizedFontWeight } from "./editor-utils.js?v=20260831-editor-utils-v1";
import { packPopupModules, popupLayoutColumns, popupLayoutMetrics } from "./popup-layout.js?v=20260821-electric-bed-combo-v2";
import { countComponentsOutsideCanvas, resizeDashboardDocument } from "./dashboard-resize.js?v=20260820-dashboard-resize-v439";
import { copyComponentsAcrossDocuments, copyComponentTargets, copyComponentsToTarget } from "./component-page-copy.js?v=20260826-cross-dashboard-copy-v4";
import { RELATED_ENTITY_DOMAIN_LABELS, legacyRelatedEntityIds, manualRelatedEntityConfig, relatedEntityIsAvailable, relatedEntityLabel, relatedEntityNeedsConfirmation, relatedPopupCandidates, relatedPopupContext, relatedPopupSelectionLimit, selectedRelatedEntityIds } from "./related-entities.js?v=20260825-bath-heater-primary-v1";
import { createIconVisibilityVirtualEntity } from "./virtual-entities.js?v=20260822-icon-visibility-v1";
import { createButtonSound } from "../shared/sound-effects.js?v=20260826-button-sound-v2";
import { deferHiddenEditorDialogs, installSettingsDialogBackdropGuard } from "./editor-dialogs.js?v=20260830-editor-dialogs-v1";
import { createEditorPickerElements as value386 } from "./editor-picker-elements.js?v=20260902-asset-display-name-v1";
import { EDITOR_PICKER_PAGE_SIZES, editorEntityPickerInitialPage, editorEntityPickerPage } from "./editor-picker-pagination.js?v=20260830-editor-picker-pagination-v1";
import { createEditorPickerQueries as value387 } from "./editor-picker-queries.js?v=20260830-editor-picker-queries-v1";
import { createEditorAssetMatcher } from "./editor-asset-queries.js?v=20260830-editor-asset-queries-v1";
import { createEditorPickerLifecycle } from "./editor-picker-lifecycle.js?v=20260831-editor-picker-lifecycle-v1";
import { createInteraction3dEditorPickers as value388 } from "../../modules/interaction3d/editor-pickers.js?v=20260910-presence-v9-20260906-i3d-buttons-v1-20260908-environment-v1-20260908-curtains-v1-20260908-nas-v1-20260908-devices-entry-v1-20260908-nas-status-panel-v1-television-v1-20260908-vacuum-v1";
import { createEditorAssetToolbar } from "./editor-asset-toolbar.js?v=20260902-asset-folder-delete-v1";
import { ACTION_TYPES, TOGGLE_ENTITY_DOMAINS, actionNeedsCurrentEntity, actionPopupData, componentActionIsSupported, entityIdSupportsToggle } from "./action-rules.js?v=20260831-action-rules-v1";
import { componentDirectLocation, findComponent, findComponentInItems, findComponentLocation } from "./component-tree.js?v=20260831-component-tree-v1";
import { applyCollectionLayerOrder, componentLabel, copiedComponentLabel, ensureSharedComponentReference, groupNameForCollection, nextTemplateInstanceName, refreshComponentIds, syncSharedComponentReferenceOrder } from "./editor-component-collections.js?v=20260831-editor-component-collections-v1";
import { fitInspectorComponentToDimensions, iconButtonEffectInspectorLayer, inspectorComponentMetrics, setInspectorToggle } from "./editor-basic-inspectors.js?v=20260901-editor-basic-inspectors-v4";
import { clonePageWithFreshIds, findCustomPopup, greatestCommonDivisor, normalizedPopupClimateDeviceType, popupModuleDropPosition, popupModuleEntityRecommended, popupModuleTypeLabel, reorderedPopupModules, uniquePagePath } from "./editor-document-management.js?v=20260901-editor-document-management-v1";
import { createRecoveryWriter, documentSignature as value389, editorComponentEntries, editorComponentStructure, editorDocumentFrameSignature, recoveryStorageKey } from "./editor-history.js?v=20260909-preview-sleep-v1";
import { DEFAULT_BASE_LIGHTING, normalizeBaseLighting } from "../../3d-studio/studio-normalization.js?v=20260903-studio-normalization-v2";
import { guardInteraction3dChanges, renderInteraction3dThumbnail, updateInteraction3dCard, renderInteraction3dInspector } from "../../modules/interaction3d/editor.js?v=20260909-preview-sleep-v1-20260910-presence-security-v9";
// Local builds keep the existing license dialog; skip the 0.5.0 in-editor license-card module.
const value390 = () => ({
  render() {}
});
const r = arg109 => document.querySelector(arg109);
installSettingsDialogBackdropGuard();
const KC = 1020;
const RC = 2;
const JC = 1920;
const ZC = 1080;
const QC = 1.1;
const eS = r(".editor-header");
const tS = r(".editor-shell");
function bm() {
  const count = Math.max(1, eS.offsetHeight + tS.offsetHeight);
  const value = Math.min(1, window.innerWidth / KC, window.innerHeight / count);
  const needsViewportFit = value < 0.999;
  document.documentElement.classList.toggle("editor-viewport-fit", needsViewportFit);
  document.documentElement.style.setProperty("--editor-layout-height", count + "px");
  document.documentElement.style.setProperty("--editor-viewport-scale", String(value));
}
function ym() {
  const count = Math.max(0.1, QC * Math.min(window.innerWidth / JC, window.innerHeight / ZC));
  document.documentElement.style.setProperty("--component-template-dialog-scale", String(count));
}
bm();
ym();
const vm = r("#logout");
const Nm = r("#save");
const ea = r("#license-open");
const Yo = r("#license-dialog");
const oS = r("#license-close");
const Xo = r("#license-form");
const ms = r("#license-message");
const XC = r("#license-detail-indicator");
const KC2 = r("#license-detail-status");
const wm = r("#license-detail-edition");
const us = r("#license-detail-error");
const to2 = value390({
  dialog: Yo
});
const fs = r("#ha-open");
const to = r("#ha-dialog");
const gl = r("#ha-close");
const dt = r("#ha-form");
const yl = r("#ha-test");
const no = r("#ha-message");
const lS = r("#ha-sync-state");
const dS = r("#ha-sync-detail");
const uS = r("#ha-sync-overview");
const pS = r("#ha-connection-view");
const Cm = r("#ha-detail-indicator");
const mS = r("#ha-detail-name");
const Im = r("#ha-detail-status");
const xm = r("#ha-detail-url");
const fS = r("#ha-detail-version");
const gS = r("#ha-detail-counts");
const Nm2 = r("#ha-detail-error");
const hS = r("#ha-edit");
const oo2 = r("#ha-delete");
const Pm = r("#ha-edit-cancel");
const oo = r("#delete-ha-dialog");
const ps = r("#delete-ha-close");
const vS = r("#delete-ha-cancel");
const gs = r("#delete-ha-form");
const Le2 = r("#delete-ha-message");
const wS = r("#project-new");
const Le3 = r("#project-select");
const fs2 = r("#project-actions-button");
const ys = r("#project-actions-menu");
const CS = r("#project-floorplan-open");
const km = r("#ui-pack-open");
const SS = r("#ui-pack-current-name");
const xS = r("#ui-pack-current-version");
const io = r("#ui-pack-dialog");
const NS = r("#ui-pack-close");
const hl = r("#ui-pack-list");
const gS2 = r("#ui-pack-message");
const ES = r("#navigator-content");
const LS = r(".page-control");
const IS = r(".popup-control");
const bl = r("#show-page-editor");
const yl2 = r("#show-popup-editor");
const Mm = r("#page-new");
const R = r("#page-select");
const bs = r("#page-actions-button");
const Cs = r("#page-actions-menu");
const vl = r("#default-page-action");
const Om = r("#popup-new");
const ao2 = r("#popup-select");
const Yo2 = r("#popup-list");
const ao = r("#popup-actions-button");
const $t = r("#popup-actions-menu");
const Bm = r("#show-shared-components");
const Xo2 = r("#show-page-components");
const vs = r("#add-component-button");
const Jo = r("#component-template-dialog");
const TS = r("#component-template-close");
const AS = r("#component-template-scope");
const wl = r("#component-template-list");
const Cl = r("#shared-component-list");
const Sl = r("#page-component-list");
const Pe = r("#component-context-menu");
const Yt = r("#project-dialog");
const CS2 = r("#project-dialog-kicker");
const kS = r("#project-dialog-title");
const MS = r("#project-close");
const OS = r("#project-cancel");
const ta = r("#project-form");
const Ll = r("#project-submit");
const Nl = r("#project-message");
const Ko = r("#project-template-fields");
const Il = r("#project-template-options");
const Zo = r("#project-preview-dialog");
const $S = r("#project-preview-title");
const FS = r("#project-preview-count");
const km2 = r("#project-preview-image");
const DS = r("#project-preview-previous");
const zS = r("#project-preview-next");
const VS = r("#project-preview-close");
const it2 = r("#project-canvas-fields");
const it = r("#project-canvas-width");
const at = r("#project-canvas-height");
const Mm2 = r("#project-aspect-ratio");
const oa = r("#project-aspect-lock");
const PS = r("#project-aspect-lock-label");
const Bm2 = r("#project-canvas-hint");
const ws = r("#project-content-lock-fields");
const kS2 = r("#project-content-lock");
const xs = r("#project-resize-warning-dialog");
const HS = r("#project-resize-warning-text");
const jS = r("#project-resize-warning-close");
const qS = r("#project-resize-warning-cancel");
const GS = r("#project-resize-warning-confirm");
const so = r("#page-dialog");
const DS2 = r("#page-dialog-kicker");
const zS2 = r("#page-dialog-title");
const Cs2 = r("#page-close");
const XS = r("#page-cancel");
const Ns = r("#page-form");
const Tl = r("#page-submit");
const VS2 = r("#page-message");
const Ct = r("#component-group-rename-dialog");
const $m = r("#component-group-rename-close");
const JS = r("#component-group-rename-cancel");
const Wm = r("#component-group-rename-form");
const Fm = r("#component-group-rename-input");
const Hm = r("#component-group-rename-message");
const Dt2 = r("#editor-canvas");
const Jo2 = r(".workspace");
const ZS = r("#workspace-title");
const Il2 = r("#workspace-resolution");
const Be = document.createElement("button");
Be.id = "dashboard-sound-toggle";
Be.className = "workspace-sound-toggle";
Be.type = "button";
Be.setAttribute("aria-pressed", "true");
Be.setAttribute("aria-label", "关闭仪表盘音效");
Be.title = "关闭仪表盘音效";
Be.innerHTML = "<svg class=\"sound-icon sound-icon-on\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 10v4h4l5 4V6l-5 4H4Z\"/><path d=\"M16 9.5a4 4 0 0 1 0 5\"/><path d=\"M18.5 7a7.5 7.5 0 0 1 0 10\"/></svg><svg class=\"sound-icon sound-icon-off\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 10v4h4l5 4V6l-5 4H4Z\"/><path d=\"m17 9 5 6M22 9l-5 6\"/></svg><span class=\"sound-label\">按键音效</span>";
Il2.after(Be);
const QS = r("#dashboard-display-hint");
const na = r("#dashboard-display-link");
const e1 = r("#display-devices-open");
const Tl2 = r("#display-devices-dialog");
const t1 = r("#display-devices-close");
const jm = r("#display-pairing-form");
const n1 = r("#display-pairing-name");
const Es = r("#display-pairing-custom-code");
const Vm = r("#display-pairing-generate");
const o1 = r("#display-device-count");
const Al = r("#display-device-list");
const Zo2 = r("#display-devices-message");
const Hm2 = r("#show-editor-preview");
const Um = r("#show-dashboard-preview");
const _m = r("#open-home-assistant");
const oa2 = r("#dashboard-preview");
const St2 = r("#custom-popup-editor");
const Qo = createButtonSound();
function Pl() {
  if (!Be) {
    return;
  }
  const value = Te === "edit";
  Be.hidden = !value;
  Be.disabled = !h;
  if (h && typeof h.document?.soundEnabled == "boolean" && Qo.isEnabled() !== h.document.soundEnabled) {
    Qo.setEnabled(h.document.soundEnabled);
  }
  Be.setAttribute("aria-pressed", String(Qo.isEnabled()));
  Be.title = Qo.isEnabled() ? "关闭仪表盘音效" : "开启仪表盘音效";
  Be.setAttribute("aria-label", Be.title);
  Be.classList.toggle("is-muted", !Qo.isEnabled());
}
const St = r("#delete-project-dialog");
const xs2 = r("#delete-project-close");
const a1 = r("#delete-project-cancel");
const Ls = r("#delete-project-form");
const Xt2 = r("#delete-project-name");
const KS = r("#delete-project-message");
const Xt = r("#delete-page-dialog");
const kl = r("#delete-page-close");
const c1 = r("#delete-page-cancel");
const Bl = r("#delete-page-confirm");
const Kt2 = r("#delete-page-name");
const QS2 = r("#delete-page-message");
const at2 = r("#delete-component-dialog");
const d1 = r("#delete-component-close");
const u1 = r("#delete-component-cancel");
const p1 = r("#delete-component-confirm");
const jm2 = r("#delete-component-name");
const at3 = r("#copy-component-page-dialog");
const m1 = r("#copy-component-page-close");
const f1 = r("#copy-component-page-cancel");
const $l = r("#copy-component-page-form");
const g1 = r("#copy-component-page-name");
const vn = r("#copy-component-page-scope");
const h1 = r("#copy-component-page-project-field");
const ei = r("#copy-component-page-project");
const co2 = r("#copy-component-page-target-field");
const b1 = r("#copy-component-page-target-label");
const qm = r("#copy-component-page-target");
const Ls2 = r("#copy-component-scale-options");
const qm2 = r("#copy-component-resolution-summary");
const ti = r("#copy-component-page-message");
const s1 = r("#copy-component-page-submit");
const ti2 = r("#copy-component-success-dialog");
const y1 = r("#copy-component-success-message");
const v1 = r("#copy-component-success-stay");
const w1 = r("#copy-component-success-go");
const uo = r("#error-dialog");
const C1 = r("#error-dialog-close");
const S1 = r("#error-dialog-confirm");
const x1 = r("#error-dialog-message");
const ni = r("#recovery-dialog");
const N1 = r("#recovery-discard");
const E1 = r("#recovery-restore");
const Km = r("#undo");
const Jm = r("#redo");
const Ol = r("#inspector-empty");
const Zm = r(".inspector");
const ia = r("#image-inspector");
const L1 = r("#image-type");
const Ps = r("#image-label");
const aa = r("#image-entity-picker");
const oi = r("#image-entity-button");
const aa2 = r("#image-entity-menu");
const ra = r("#image-entity-search");
const _m2 = r("#image-entity-options");
const Re2 = r("#image-asset-picker");
const Cn = r("#image-asset-button");
const Re = r("#image-asset-menu");
const zt2 = r("#image-asset-folder");
const Sn = r("#image-asset-search");
const zt3 = r("#image-asset-options");
const ef = r("#image-asset-upload");
const la = r("#image-asset-upload-input");
const I1 = r("#image-asset-upload-hint");
const y12 = r("#image-asset-large-preview");
const Bl2 = r("#image-asset-large-preview-image");
const T1 = r("#image-asset-large-preview-name");
const pt2 = r("#global-color-picker");
const ri = r("#global-color-picker-sv");
const Xm = r("#global-color-picker-marker");
const zl = r("#global-color-picker-hue");
const A1 = r("#global-color-picker-swatch");
const Dl = r("#global-color-picker-hex");
const Vl = r("#global-color-picker-copy");
const Vl2 = r("#global-color-picker-paste");
const zl2 = r("#global-color-picker-r");
const Vl3 = r("#global-color-picker-g");
const Wl = r("#global-color-picker-b");
const da = r("#image-opacity");
const nf = r("#image-layout-options");
const Nn2 = r("#image-left");
const go2 = r("#image-top");
const Rl = r("#image-scale");
const ai = r("#image-rotation");
const ql = r("#floorplan-auto-diagram-inspector");
const si = r("#floorplan-auto-diagram-status");
const xt = r("#floorplan-auto-diagram-open-studio");
const la2 = r("#floorplan-auto-diagram-view-toggle");
const Gl = r("#floorplan-auto-diagram-label");
const pa = r("#floorplan-auto-diagram-folder");
const of = r("#floorplan-auto-diagram-layout");
const ua = r("#floorplan-auto-diagram-left");
const pa2 = r("#floorplan-auto-diagram-top");
const ma = r("#floorplan-auto-diagram-width");
const fa = r("#floorplan-auto-diagram-height");
const ga = r("#floorplan-auto-diagram-scale");
const ha = r("#floorplan-auto-diagram-rotation");
const Zt = r("#floorplan-auto-diagram-floor");
const ba = r("#floorplan-auto-diagram-camera-view");
const rf = r("#floorplan-auto-diagram-camera-mode");
const ba2 = r("#floorplan-auto-diagram-focal-length");
const sf = r("#floorplan-auto-diagram-rotate-top");
const cf = r("#floorplan-auto-diagram-open-base-lighting");
const P1 = r("#floorplan-auto-diagram-bindings");
const lf = r("#floorplan-auto-diagram-binding-list");
const C12 = r("#floorplan-auto-lighting-panel");
const wa = r("#floorplan-auto-lighting-handle");
const k1 = r("#floorplan-auto-lighting-close");
const M1 = r("#floorplan-auto-lighting-reset");
const O1 = r("#floorplan-auto-lighting-save");
const ci = r("#floorplan-auto-lighting-status");
const jl = [...document.querySelectorAll("[data-floorplan-base-light]")];
let va = "";
let N12 = normalizeBaseLighting(DEFAULT_BASE_LIGHTING);
let mt2 = null;
const B1 = r("#component-action-controls");
const mt3 = r("#floorplan-auto-diagram-dialog");
const $1 = r("#floorplan-auto-diagram-close");
const of2 = r("#floorplan-auto-diagram-guide");
const F1 = r("#floorplan-auto-diagram-later");
const D1 = r("#floorplan-auto-diagram-continue");
const si2 = r("#icon-button-effect-inspector");
const uf = r("#ibe-label");
const Gl2 = r("#ibe-entity-button");
const Ts = r("#ibe-entity-menu");
const T12 = r("#ibe-entity-search");
const A12 = r("#ibe-entity-options");
const Ul = r("#ibe-color-temperature-realtime");
const _l = r("#ibe-brightness-realtime");
const Jl = r("#ibe-preview-state");
const pf = r("#ibe-layer-options");
const W1 = r("#ibe-button-section");
const R1 = r("#ibe-effect-section");
const mf = r("#ibe-button-visible");
const ff = r("#ibe-effect-visible");
const H1 = r("#ibe-button-transform-section");
const j1 = r("#ibe-action-section");
const Qt = r("#ibe-icon-button");
const wa2 = r("#ibe-icon-copy");
const Sa = r("#ibe-icon-menu");
const xa = r("#ibe-icon-search");
const Sa2 = r("#ibe-icon-options");
const Zl = r("#ibe-icon-off-color");
const Ql = r("#ibe-icon-on-color");
const gf = r("#ibe-icon-size");
const ed = r("#ibe-button-off-color");
const td = r("#ibe-button-on-color");
const hf = r("#ibe-button-opacity");
const bf = r("#ibe-frame-color");
const yf = r("#ibe-frame-width");
const vf = r("#ibe-frame-opacity");
const wf = r("#ibe-radius");
const Cf = r("#ibe-glow-color");
const nd = r("#ibe-glow-off-strength");
const od = r("#ibe-glow-on-strength");
const En = r("#ibe-asset-button");
const He = r("#ibe-asset-menu");
const en2 = r("#ibe-asset-folder");
const Ln = r("#ibe-asset-search");
const en = r("#ibe-asset-options");
const Sf = r("#ibe-asset-upload");
const Lo2 = r("#ibe-asset-upload-input");
const q1 = r("#ibe-asset-upload-hint");
const xf = r("#ibe-effect-opacity");
const Nf = r("#ibe-effect-fade-duration");
const Ef = r("#ibe-effect-layout-options");
const G1 = r("#ibe-effect-align-image");
const id = r("#ibe-effect-left");
const nd2 = r("#ibe-effect-top");
const od2 = r("#ibe-effect-scale");
const id2 = r("#ibe-effect-rotation");
const U1 = r("#ibe-effect-size-hint");
const In = r("#effect-image-align-dialog");
const _1 = r("#effect-image-align-close");
const Y1 = r("#effect-image-align-cancel");
const Lf = r("#effect-image-align-confirm");
const If = r("#effect-image-align-options");
const As = r("#effect-image-align-message");
const Na = r("#ibe-left");
const Ea = r("#ibe-top");
const ci2 = r("#ibe-width");
const ui = r("#ibe-height");
const V1 = r("#ibe-scale");
const pi = r("#ibe-rotation");
const X1 = r("#ibe-action-controls");
const Ps2 = r("#ibe-apply-style");
const K1 = r("#ibe-apply-count");
const ks = r("#title-button-inspector");
const Tf = r("#title-button-label");
const ad = r("#title-button-entity-button");
const Ms = r("#title-button-entity-menu");
const R12 = r("#title-button-entity-search");
const H12 = r("#title-button-entity-options");
const xf2 = r("#title-button-main-visible");
const Nf2 = r("#title-button-secondary-visible");
const kf = r("#title-button-main-text");
const Fs = r("#title-button-secondary-line-1");
const Ds = r("#title-button-secondary-line-2");
const Mf = r("#title-button-main-color");
const Of = r("#title-button-secondary-color");
const Bf = r("#title-button-main-size");
const $f = r("#title-button-secondary-size");
const Ff = r("#title-button-main-weight");
const Df = r("#title-button-secondary-weight");
const zf = r("#title-button-main-spacing");
const Vf = r("#title-button-secondary-spacing");
const Wf = r("#title-button-secondary-line-gap");
const Rf = r("#title-button-main-left");
const Hf = r("#title-button-main-top");
const jf = r("#title-button-secondary-left");
const qf = r("#title-button-secondary-top");
const Vf2 = r("#title-button-icon-visible");
const tn = r("#title-button-icon-button");
const La = r("#title-button-icon-copy");
const Ta = r("#title-button-icon-menu");
const Aa = r("#title-button-icon-search");
const Ta2 = r("#title-button-icon-options");
const Uf = r("#title-button-icon-color");
const _f = r("#title-button-icon-size");
const Yf = r("#title-button-icon-left");
const Xf = r("#title-button-icon-top");
const Kf = r("#title-button-frame-color");
const Gf = r("#title-button-frame-visible");
const Zf = r("#title-button-frame-width");
const Qf = r("#title-button-frame-size");
const eg = r("#title-button-frame-spacing");
const tg = r("#title-button-frame-offset-x");
const ng = r("#title-button-frame-offset-y");
const Jf = r("#title-button-marker-visible");
const ig = r("#title-button-marker-color");
const ag = r("#title-button-marker-size");
const rg = r("#title-button-marker-left");
const sg = r("#title-button-marker-top");
const rd = r("#title-button-left");
const sd = r("#title-button-top");
const $s = r("#title-button-width");
const Fs2 = r("#title-button-height");
const Aa2 = r("#title-button-scale");
const Ds2 = r("#title-button-rotation");
const Q1 = r("#title-button-action-controls");
const zs = r("#title-button-apply-style");
const ex = r("#title-button-apply-count");
const ud = r("#light-statistics-inspector");
const cg = r("#light-statistics-label");
const lg = r("#light-statistics-title");
const rt = r("#light-statistics-entity-button");
const Ie2 = r("#light-statistics-entity-menu");
const Ma = r("#light-statistics-entity-search");
const ka = r("#light-statistics-entity-options");
const dg = r("#light-statistics-entity-pending");
const G12 = r("#light-statistics-pending-name");
const ld = r("#light-statistics-pending-detail");
const tx = r("#light-statistics-entity-confirm");
const ld2 = r("#light-statistics-entity-message");
const ug = r("#light-statistics-entity-list");
const nx = r("#light-statistics-entity-count");
const dd = r("#light-statistics-action-entity-button");
const Vs = r("#light-statistics-action-entity-menu");
const _12 = r("#light-statistics-action-entity-search");
const Y12 = r("#light-statistics-action-entity-options");
const ax = r("#light-statistics-action-note");
const rx = r("#light-statistics-action-controls");
const nn = r("#light-statistics-icon-button");
const Ma2 = r("#light-statistics-icon-copy");
const Ba = r("#light-statistics-icon-menu");
const $a = r("#light-statistics-icon-search");
const Ba2 = r("#light-statistics-icon-options");
const rg2 = r("#light-statistics-icon-visible");
const mg = r("#light-statistics-icon-color");
const fg = r("#light-statistics-icon-active-color");
const gg = r("#light-statistics-icon-size");
const dg2 = r("#light-statistics-title-visible");
const bg = r("#light-statistics-title-color");
const yg = r("#light-statistics-title-size");
const vg = r("#light-statistics-title-weight");
const wg = r("#light-statistics-title-spacing");
const gg2 = r("#light-statistics-count-visible");
const Sg = r("#light-statistics-count-color");
const xg = r("#light-statistics-count-active-color");
const Ng = r("#light-statistics-count-size");
const Eg = r("#light-statistics-count-weight");
const Lg = r("#light-statistics-count-spacing");
const Ig = r("#light-statistics-icon-gap");
const Tg = r("#light-statistics-count-gap");
const ud2 = r("#light-statistics-left");
const pd = r("#light-statistics-top");
const Ws = r("#light-statistics-width");
const Rs = r("#light-statistics-height");
const $a2 = r("#light-statistics-scale");
const Hs = r("#light-statistics-rotation");
const ui2 = r("#icon-button-inspector");
const sx = r("#icon-button-type-label");
const cx = r("#icon-button-type");
const Ag = r("#icon-button-label");
const Ng2 = r("#presence-sensor-kind-label");
const Fa = r("#presence-sensor-kind");
const pi2 = r("#icon-button-entity-button");
const mi = r("#icon-button-entity-menu");
const md = r("#icon-button-entity-search");
const fd = r("#icon-button-entity-options");
const gd = r("#cover-settings-inspector");
const kg = r("#cover-settings-kind");
const js = r("#cover-settings-direction");
const Og = r("#cover-settings-motor-direction");
const Us = r("#icon-button-preview-state");
const lx = r("#icon-button-preview-control");
const Lt = r("#icon-button-icon-button");
const Da = r("#icon-button-icon-copy");
const Va = r("#icon-button-icon-menu");
const Wa = r("#icon-button-icon-search");
const Va2 = r("#icon-button-icon-options");
const hi = r("#icon-button-icon-color");
const Tg2 = r("#icon-button-icon-color-label");
const hd = r("#device-button-icon-visible");
const wd = r("#device-button-icon-on-color");
const Ag2 = r("#device-button-icon-on-color-label");
const Fg = r("#device-button-badge-color");
const dx = r("#device-button-badge-color-label");
const Dg = r("#device-button-badge-opacity");
const ux = r("#device-button-badge-opacity-label");
const zg = r("#icon-button-icon-size");
const px = r("#icon-button-icon-size-label");
const Vg = r("#device-button-symbol-size");
const mx = r("#device-button-symbol-size-label");
const Wg = r("#device-button-badge-size");
const fx = r("#device-button-badge-size-label");
const _s = r("#device-button-state-precision");
const gx = r("#device-button-state-precision-label");
const Cd = r("#icon-button-icon-off-opacity");
const Sd = r("#icon-button-icon-on-opacity");
const hx = r("#icon-button-icon-off-opacity-label");
const bx = r("#icon-button-icon-on-opacity-label");
const wd2 = r("#icon-button-icon-left");
const Cd2 = r("#icon-button-icon-top");
const Sd2 = r("#icon-button-main-text");
const xd = r("#icon-button-secondary-text");
const $g = r("#icon-button-main-heading");
const Nd = r("#device-button-main-visible");
const yx = r("#icon-button-secondary-heading");
const Ed = r("#device-button-secondary-visible");
const vx = r("#icon-button-main-content-label");
const wx = r("#icon-button-secondary-content-label");
const Hg = r("#icon-button-main-color");
const jg = r("#icon-button-secondary-color");
const Ad = r("#icon-button-main-off-opacity");
const Pd = r("#icon-button-main-on-opacity");
const kd = r("#icon-button-secondary-off-opacity");
const Md = r("#icon-button-secondary-on-opacity");
const Cx = r("#icon-button-main-off-opacity-label");
const Sx = r("#icon-button-main-on-opacity-label");
const xx = r("#icon-button-secondary-off-opacity-label");
const Nx = r("#icon-button-secondary-on-opacity-label");
const qg = r("#icon-button-main-size");
const Gg = r("#icon-button-secondary-size");
const Ug = r("#icon-button-main-weight");
const _g = r("#icon-button-secondary-weight");
const Yg = r("#icon-button-main-spacing");
const Xg = r("#icon-button-secondary-spacing");
const Kg = r("#icon-button-main-left");
const Jg = r("#icon-button-main-top");
const Zg = r("#icon-button-secondary-left");
const Qg = r("#icon-button-secondary-top");
const Pd2 = r("#icon-button-on-fill-visible");
const Ex = r("#icon-button-fill-section");
const Bd = r("#icon-button-on-fill-color");
const $d = r("#icon-button-on-fill-strength");
const eh = r("#icon-button-on-fill-fade-duration");
const Xg2 = r("#icon-button-frame-visible");
const Lx = r("#icon-button-frame-section");
const nh = r("#icon-button-frame-width");
const oh = r("#icon-button-frame-angle");
const Fd = r("#icon-button-frame-off-opacity");
const Dd = r("#icon-button-frame-on-opacity");
const ih = r("#icon-button-cut-corner");
const Qg2 = r("#icon-button-soft-light-visible");
const Ix = r("#icon-button-soft-light-section");
const rh = r("#icon-button-soft-light-color");
const sh = r("#icon-button-soft-light-strength");
const ch = r("#icon-button-soft-light-size");
const lh = r("#icon-button-soft-light-angle");
const ih2 = r("#icon-button-glow-visible");
const Tx = r("#icon-button-glow-section");
const uh = r("#icon-button-glow-color");
const ph = r("#icon-button-glow-strength");
const mh = r("#icon-button-glow-size");
const fh = r("#icon-button-glow-angle");
const $d2 = r("#icon-button-left");
const Fd2 = r("#icon-button-top");
const Gs = r("#icon-button-width");
const Us2 = r("#icon-button-height");
const Wa2 = r("#icon-button-scale");
const _s2 = r("#icon-button-rotation");
const Ax = r("#icon-button-action-controls");
const Px = r("#icon-button-action-section");
const gh = r("#icon-button-preview-details");
const Ys = r("#icon-button-apply-style");
const kx = r("#icon-button-apply-count");
const Mx = r("#presence-motion-section");
const Ox = r("#door-window-perspective-section");
const Tn = r("#door-window-perspective-edit");
const Bx = r("#door-window-perspective-reset");
const Zs = r("#door-window-perspective-save");
const dh = r("#presence-halo-visible");
const bh = r("#presence-halo-scale-x");
const yh = r("#presence-halo-scale-y");
const vh = r("#presence-halo-rotation");
const wh = r("#presence-halo-opacity");
const gh2 = r("#presence-person-visible");
const Sh = r("#presence-person-scale");
const xh = r("#presence-person-rotation");
const Nh = r("#presence-person-opacity");
const Eh = r("#presence-orbit-duration");
const Ks = r("#air-conditioner-inspector");
const Lh = r("#air-conditioner-label");
const Ih = r("#air-conditioner-device-type");
const Dd2 = r("#air-conditioner-entity-button");
const Js = r("#air-conditioner-entity-menu");
const Ex2 = r("#air-conditioner-entity-search");
const Lx2 = r("#air-conditioner-entity-options");
const Th = r("#air-conditioner-preview-state");
const Ah = r("#air-conditioner-layer-options");
const Dx = r("#air-conditioner-button-section");
const Nh2 = r("#air-conditioner-airflow-section");
const zx = r("#air-conditioner-transform-section");
const Vx = r("#air-conditioner-action-section");
const Eh2 = r("#air-conditioner-icon-visible");
const Mh = r("#air-conditioner-icon-off-color");
const Oh = r("#air-conditioner-icon-on-color");
const Bh = r("#air-conditioner-badge-color");
const $h = r("#air-conditioner-badge-opacity");
const Fh = r("#air-conditioner-symbol-size");
const Dh = r("#air-conditioner-badge-size");
const zh = r("#air-conditioner-icon-left");
const Vh = r("#air-conditioner-icon-top");
const Bh2 = r("#air-conditioner-main-visible");
const Rh = r("#air-conditioner-main-text");
const Hh = r("#air-conditioner-main-color");
const jh = r("#air-conditioner-main-size");
const qh = r("#air-conditioner-main-weight");
const Gh = r("#air-conditioner-main-spacing");
const Uh = r("#air-conditioner-main-left");
const _h = r("#air-conditioner-main-top");
const Hh2 = r("#air-conditioner-secondary-visible");
const Xh = r("#air-conditioner-secondary-text");
const Kh = r("#air-conditioner-secondary-color");
const Jh = r("#air-conditioner-secondary-size");
const Zh = r("#air-conditioner-secondary-weight");
const Qh = r("#air-conditioner-secondary-spacing");
const eb = r("#air-conditioner-secondary-left");
const tb = r("#air-conditioner-secondary-top");
const nb = r("#air-conditioner-airflow-visible");
const ob = r("#air-conditioner-airflow-motion");
const ib = r("#air-conditioner-airflow-cool-color");
const ab = r("#air-conditioner-airflow-heat-color");
const rb = r("#air-conditioner-airflow-other-color");
const sb = r("#air-conditioner-airflow-angle");
const cb = r("#air-conditioner-airflow-curve");
const lb = r("#air-conditioner-airflow-length");
const db = r("#air-conditioner-airflow-fade");
const ub = r("#air-conditioner-airflow-spread");
const pb = r("#air-conditioner-airflow-density");
const mb = r("#air-conditioner-airflow-irregularity");
const fb = r("#air-conditioner-airflow-thickness");
const gb = r("#air-conditioner-airflow-strength");
const hb = r("#air-conditioner-airflow-blur");
const zd = r("#air-conditioner-airflow-speed");
const Ra = r("#air-conditioner-airflow-offset-x");
const Ha = r("#air-conditioner-airflow-offset-y");
const bb = r("#air-conditioner-airflow-width");
const yb = r("#air-conditioner-airflow-height");
const Vd = r("#air-conditioner-airflow-scale");
const Wd = r("#air-conditioner-airflow-rotation");
const Rd = r("#air-conditioner-left");
const Hd = r("#air-conditioner-top");
const Zs2 = r("#air-conditioner-width");
const Qs = r("#air-conditioner-height");
const ja = r("#air-conditioner-scale");
const ec = r("#air-conditioner-rotation");
const Wx = r("#air-conditioner-action-controls");
const jd = r("#air-conditioner-preview-details");
const _d = r("#air-conditioner-apply-style");
const Rx = r("#air-conditioner-apply-count");
const tc = r("#vacuum-map-inspector");
const vb = r("#vacuum-map-label");
const Gd = r("#vacuum-map-entity-button");
const nc = r("#vacuum-map-entity-menu");
const Mx2 = r("#vacuum-map-entity-search");
const Ox2 = r("#vacuum-map-entity-options");
const wb = r("#vacuum-map-opacity");
const Ud = r("#vacuum-map-left");
const _d2 = r("#vacuum-map-top");
const qa = r("#vacuum-map-scale");
const oc = r("#vacuum-map-rotation");
const ic = r("#camera-inspector");
const Cb = r("#camera-label");
const Yd = r("#camera-entity-button");
const ac = r("#camera-entity-menu");
const Bx2 = r("#camera-entity-search");
const $x = r("#camera-entity-options");
const Sb = r("#camera-fit-options");
const xb = r("#camera-display-mode-options");
const Ux = r("#camera-refresh-interval-field");
const Ga = r("#camera-refresh-interval");
const Nb = r("#camera-media-visible");
const Eb = r("#camera-frame-visible");
const Lb = r("#camera-frame-color");
const Ib = r("#camera-frame-width");
const Tb = r("#camera-radius");
const Ab = r("#camera-frame-angle");
const Pb = r("#camera-frame-opacity");
const Xd = r("#camera-left");
const Kd = r("#camera-top");
const rc = r("#camera-width");
const sc = r("#camera-height");
const Ua = r("#camera-scale");
const cc = r("#camera-rotation");
const _x = r("#camera-action-controls");
const lc = r("#camera-apply-style");
const Yx = r("#camera-apply-count");
const _a = r("#time-inspector");
const Xx = r("#time-type");
const kb = r("#time-label");
const Lb2 = r("#time-hour-format");
const Ib2 = r("#time-seconds");
const Bb = r("#time-color");
const $b = r("#time-font-size");
const Fb = r("#time-font-weight");
const Db = r("#time-letter-spacing");
const zb = r("#time-opacity");
const Ya = r("#time-left");
const Xa = r("#time-top");
const yo = r("#time-scale");
const gi = r("#time-rotation");
const Ka = r("#date-inspector");
const Kx = r("#date-type");
const Vb = r("#date-label");
const Bb2 = r("#date-weekday");
const $b2 = r("#date-lunar");
const Hb = r("#date-primary-color");
const jb = r("#date-primary-size");
const qb = r("#date-primary-weight");
const Gb = r("#date-primary-spacing");
const Ub = r("#date-lunar-color");
const _b = r("#date-lunar-size");
const Yb = r("#date-lunar-weight");
const Xb = r("#date-lunar-spacing");
const Kb = r("#date-line-gap");
const Jb = r("#date-opacity");
const Ja = r("#date-left");
const Za = r("#date-top");
const vo = r("#date-scale");
const hi2 = r("#date-rotation");
const Qa = r("#weather-inspector");
const Jx = r("#weather-type");
const Zb = r("#weather-label");
const Zd = r("#weather-entity-picker");
const Jd = r("#weather-entity-button");
const Zd2 = r("#weather-entity-menu");
const Hx = r("#weather-entity-search");
const jx = r("#weather-entity-options");
const _b2 = r("#weather-icon-visible");
const Yb2 = r("#weather-temperature-visible");
const Xb2 = r("#weather-condition-visible");
const Kb2 = r("#weather-humidity-visible");
const oy = r("#weather-icon-size");
const iy = r("#weather-icon-gap");
const ay = r("#weather-temperature-color");
const ry = r("#weather-temperature-size");
const sy = r("#weather-temperature-weight");
const cy = r("#weather-temperature-spacing");
const ly = r("#weather-secondary-color");
const dy = r("#weather-secondary-size");
const uy = r("#weather-secondary-weight");
const py = r("#weather-secondary-spacing");
const my = r("#weather-line-gap");
const fy = r("#weather-opacity");
const er = r("#weather-left");
const or = r("#weather-top");
const wo = r("#weather-scale");
const bi = r("#weather-rotation");
const ir = r("#line-chart-inspector");
const eN = r("#line-chart-type");
const gy = r("#line-chart-label");
const eu = r("#line-chart-entity-picker");
const Qd = r("#line-chart-entity-button");
const eu2 = r("#line-chart-entity-menu");
const Gx = r("#line-chart-entity-search");
const Ux2 = r("#line-chart-entity-options");
const hy = r("#line-chart-value-visible");
const by = r("#line-chart-value-scale");
const yy = r("#line-chart-value-color");
const vy = r("#line-chart-state-precision");
const wy = r("#line-chart-value-offset-x");
const Cy = r("#line-chart-value-offset-y");
const Sy = r("#line-chart-update-interval");
const xy = r("#line-chart-hours");
const Ny = r("#line-chart-curve-radius");
const iu = r("#line-chart-threshold-mode");
const wi = [1, 2, 3, 4].map(arg108 => ({
  value: r("#line-chart-threshold-" + arg108 + "-value"),
  color: r("#line-chart-threshold-" + arg108 + "-color")
}));
const or2 = r("#line-chart-left");
const ir2 = r("#line-chart-top");
const vi = r("#line-chart-width");
const wi2 = r("#line-chart-height");
const Co = r("#line-chart-scale");
const Ci = r("#line-chart-rotation");
const oN = r("#line-chart-action-controls");
const dc = r("#line-chart-apply-style");
const iN = r("#line-chart-apply-count");
const sr = r("#panel-frame-inspector");
const aN = r("#panel-frame-type");
const Ey = r("#panel-frame-label");
const wy2 = r("#panel-frame-main-visible");
const Iy = r("#panel-frame-main-text");
const Ty = r("#panel-frame-main-color");
const Ay = r("#panel-frame-main-size");
const Py = r("#panel-frame-main-weight");
const ky = r("#panel-frame-main-opacity");
const My = r("#panel-frame-main-spacing");
const Oy = r("#panel-frame-main-left");
const By = r("#panel-frame-main-top");
const Ay2 = r("#panel-frame-secondary-visible");
const Fy = r("#panel-frame-secondary-text");
const Dy = r("#panel-frame-secondary-color");
const zy = r("#panel-frame-secondary-size");
const Vy = r("#panel-frame-secondary-weight");
const Wy = r("#panel-frame-secondary-opacity");
const Ry = r("#panel-frame-secondary-spacing");
const Hy = r("#panel-frame-secondary-left");
const jy = r("#panel-frame-secondary-top");
const zy2 = r("#panel-frame-edge-visible");
const Gy = r("#panel-frame-edge-color");
const Uy = r("#panel-frame-edge-width");
const _y = r("#panel-frame-edge-opacity");
const Yy = r("#panel-frame-radius");
const Xy = r("#panel-frame-edge-angle");
const qy = r("#panel-frame-glow-visible");
const Jy = r("#panel-frame-glow-color");
const Zy = r("#panel-frame-glow-strength");
const Qy = r("#panel-frame-glow-size");
const ev = r("#panel-frame-glow-angle");
const rr = r("#panel-frame-left");
const sr2 = r("#panel-frame-top");
const Si = r("#panel-frame-width");
const xi = r("#panel-frame-height");
const So = r("#panel-frame-scale");
const Ni = r("#panel-frame-rotation");
const uc = r("#panel-frame-apply-style");
const rN = r("#panel-frame-apply-count");
const Ei = r("#navigation-inspector");
const sN = r("#navigation-type");
const gc = r("#navigation-label");
const au = r("#navigation-preview-state");
const ou = r("#navigation-entity-button");
const iu2 = r("#navigation-entity-menu");
const Zx = r("#navigation-entity-search");
const Qx = r("#navigation-entity-options");
const cu = r("#navigation-main-text");
const lu = r("#navigation-secondary-text");
const tv = r("#navigation-main-visible");
const nv = r("#navigation-secondary-visible");
const ov = r("#navigation-icon-visible");
const iv = r("#navigation-frame-visible");
const av = r("#navigation-glow-visible");
const on = r("#navigation-icon-button");
const cr = r("#navigation-icon-copy");
const dr = r("#navigation-icon-menu");
const ur = r("#navigation-icon-search");
const dr2 = r("#navigation-icon-options");
const rv = r("#navigation-main-color");
const sv = r("#navigation-secondary-color");
const cv = r("#navigation-main-size");
const lv = r("#navigation-secondary-size");
const dv = r("#navigation-main-weight");
const uv = r("#navigation-secondary-weight");
const pv = r("#navigation-main-spacing");
const mv = r("#navigation-secondary-spacing");
const fv = r("#navigation-main-text-left");
const gv = r("#navigation-main-text-top");
const hv = r("#navigation-secondary-text-left");
const bv = r("#navigation-secondary-text-top");
const du = r("#navigation-text-idle-opacity");
const uu = r("#navigation-text-active-opacity");
const yv = r("#navigation-icon-color");
const vv = r("#navigation-icon-size");
const wv = r("#navigation-icon-left");
const Cv = r("#navigation-icon-top");
const pu = r("#navigation-icon-idle-opacity");
const mu = r("#navigation-icon-active-opacity");
const Sv = r("#navigation-frame-color");
const xv = r("#navigation-frame-width");
const fu = r("#navigation-frame-idle-opacity");
const gu = r("#navigation-frame-active-opacity");
const Nv = r("#navigation-frame-angle");
const Ev = r("#navigation-glow-color");
const Lv = r("#navigation-glow-angle");
const hu = r("#navigation-glow-idle-strength");
const bu = r("#navigation-glow-idle-size");
const yu = r("#navigation-glow-active-strength");
const vu = r("#navigation-glow-active-size");
const Iv = r("#navigation-radius");
const ur2 = r("#navigation-left");
const pr = r("#navigation-top");
const An2 = r("#navigation-width");
const Eo2 = r("#navigation-height");
const eN2 = r("#navigation-scale");
const mc = r("#navigation-rotation");
const dN = r("#navigation-action-controls");
const mc2 = r("#navigation-apply-style");
const uN = r("#navigation-apply-count");
const Ge = r("#navigation-style-apply-dialog");
const pN = r("#navigation-style-apply-close");
const an2 = r("#navigation-style-apply-title");
const Mn2 = r("#navigation-style-apply-summary");
const On2 = r("#navigation-style-apply-properties");
const mr = r("#navigation-style-apply-target-heading");
const ke2 = r("#navigation-style-apply-target-scope");
const mr2 = r("#navigation-style-apply-targets");
const iN2 = r("#navigation-style-apply-message");
const mN = r("#navigation-style-apply-cancel");
const fN = r("#navigation-style-apply-confirm");
const gc2 = r("#popup-name-dialog");
const rN2 = r("#popup-name-dialog-title");
const yc = r("#popup-name-form");
const hN = r("#popup-name-close");
const bN = r("#popup-name-cancel");
const Li = r("#popup-module-dialog");
const yN = r("#popup-module-dialog-title");
const he = r("#popup-module-form");
const vN = r("#popup-module-close");
const wN = r("#popup-module-cancel");
const rn = r("#popup-module-entity-button");
const wu = r("#popup-module-entity-menu");
const hc = r("#popup-module-entity-search");
const Ii = r("#popup-module-entity-options");
const yu2 = r("#popup-module-climate-device-type");
const wc = r("#delete-popup-dialog");
const vu2 = r("#delete-popup-close");
const SN = r("#delete-popup-cancel");
const Su = r("#delete-popup-confirm");
const fN2 = r("#delete-popup-name");
const Lo = r("#delete-asset-dialog");
const wu2 = r("#delete-asset-close");
const EN = r("#delete-asset-cancel");
const Bn2 = r("#delete-asset-confirm");
const LN = r("#delete-asset-name");
const Bn = r("#delete-asset-folder-dialog");
const IN = r("#delete-asset-folder-close");
const TN = r("#delete-asset-folder-cancel");
const Cc = r("#delete-asset-folder-confirm");
const AN = r("#delete-asset-folder-name");
const PN = r("#delete-asset-folder-count");
let ie = null;
let Ue2 = null;
let Sv2 = null;
let xv2 = null;
const Sv3 = new Map();
const xv3 = new Map();
const Nv2 = new Map();
let Te = "edit";
let ft2 = [];
let h = null;
let vc = "shared";
let be = "create";
let Nu = null;
let be2 = "dwell-light";
let sn2 = 2778;
let hr = 1940;
let br = false;
let yr = 2778;
let vr = 1940;
let To = [];
let Su2 = [];
let gt2 = 0;
let yr2 = "create";
let Xe2 = false;
let De2 = null;
let componentId = null;
let se2 = null;
let wc2 = {
  componentId: null,
  at: 0
};
let vr2 = null;
let Iu = "create";
let Cr = null;
let Tu = null;
let Cc2 = null;
let Au = null;
let Nc = null;
let Ev2 = [];
let ht2 = [];
let Ev3 = null;
let cn2 = [];
let le = [];
let Ao2 = [];
let Iu2 = new Map();
let Tu2 = {};
let Po2 = null;
let Tu3 = false;
let Ti = null;
let Cr2 = Promise.resolve();
let Vt2 = "";
let Wt2 = "";
let Vt3 = "builtin";
let Wt3 = "builtin";
let Sc = null;
let Tv = null;
let Av = null;
let Pv = null;
let kv = null;
let Mv = null;
let Ov = null;
let Bv = null;
let $v = null;
let Rt2 = null;
let ko2 = null;
let Rt3 = "";
let ko3 = -1;
let Sr = "";
let zv = null;
let Vv = null;
let Wv = null;
let Rv = null;
let Hv = null;
let jv = null;
let Pt2 = null;
let Au2 = null;
let Pu = null;
let ku = null;
const Pu2 = new Set();
let selectedComponentIds = new Set();
let ku2 = null;
const pe = {
  undo: [],
  redo: [],
  busy: false
};
const ku3 = 10;
const xc = "ha-bridge:unsaved:";
let Ai = "";
let Ke2 = null;
let Dn = false;
let xr = null;
let Mu = 0;
let xr2 = null;
let Nc2 = false;
let bt2 = null;
let Ou = null;
const Pi = new Map();
const Ec = new Map();
const zn = new Map();
const Ac = new Set();
const Fu = Object.freeze([0, 0, 1, 0, 1, 1, 0, 1]);
const Kv = new Map();
const Mo2 = new Map();
const Du = new Map();
const Fu2 = new Map();
const Oo2 = new Map();
const Oi = new Map();
const Bi = new Map();
const $i = new Map();
const Fi = new Map();
const Oi2 = new Map();
const Vn = new Map();
const Gv = new Map();
const Uv = new WeakSet();
let Bo2 = null;
let me = null;
let Lc = "";
let $o2 = 0;
let Nr = 0;
let Er = 1;
let Tr = null;
let zu = null;
let Du2 = "";
let zu2 = null;
async function Z(value, fetchOptions = {}) {
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
    const temp2 = responseText.trim().slice(0, 240);
    const error = new Error(typeof detail == "string" ? detail : detail?.message || "请求失败：" + value.split("?")[0] + "（HTTP " + response.status + "）" + (temp2 ? " · " + temp2 : ""));
    if (detail && typeof detail == "object" && detail.code) {
      error.code = detail.code;
    }
    throw window.HABridgeLog?.linkError(error, response) || error;
  }
  return temp;
}
function z(element, value, className = "") {
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
  x1.textContent = value?.message || "操作失败。";
  if (!uo.open) {
    uo.showModal();
  }
}
function Wn() {
  ys.hidden = true;
  fs2.setAttribute("aria-expanded", "false");
}
function pn() {
  Cs.hidden = true;
  bs.setAttribute("aria-expanded", "false");
}
function kc() {
  $t.hidden = true;
  ao.setAttribute("aria-expanded", "false");
  Tu = null;
}
function Ht2(value = Bo2) {
  if (value) {
    value.menu.hidden = true;
    value.button.setAttribute("aria-expanded", "false");
    if (Bo2 === value) {
      Bo2 = null;
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
  const count2 = Math.max(8, Math.min(window.innerWidth - rect.width - 8, rect.left));
  const number = rect.bottom + 4;
  const chosen = number + minValue <= window.innerHeight - 8 ? number : Math.max(8, rect.top - minValue - 4);
  value.menu.style.left = count2 + "px";
  value.menu.style.top = chosen + "px";
}
function oe(element) {
  const value = Vn.get(element);
  if (!value) {
    return;
  }
  const element2 = element.selectedOptions[0];
  const flag = element.id === "page-select" && element2?.dataset.defaultPage === "true";
  value.button.textContent = flag ? "★ " + element2.textContent : element2?.textContent || (element.id === "project-select" ? "暂无仪表盘" : element.id === "popup-select" ? "暂无组合弹窗" : element.id === "image-asset-folder" ? "暂无图片文件夹" : "暂无页面");
  value.button.disabled = element.disabled;
  const chosen = element === zt2 ? "image" : element === en2 ? "ibe" : "";
  const chosen2 = chosen === "image" ? Vt3 : chosen === "ibe" ? Wt3 : "";
  value.menu.replaceChildren(...[...element.options].map(element3 => {
    const element4 = document.createElement("button");
    element4.type = "button";
    element4.className = "custom-select-option";
    element4.dataset.value = element3.value;
    if (element.id === "page-select" && element3.dataset.defaultPage === "true") {
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
    element5.setAttribute("aria-label", "删除自动导图文件夹 " + element3.textContent);
    element5.textContent = "×";
    temp.append(element4, element5);
    return temp;
  }));
  if (element.disabled) {
    Ht2(value);
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
  Vn.set(select, value);
  oe(select);
  button.addEventListener("click", () => {
    const hidden = menu.hidden;
    Ht2();
    Wn();
    pn();
    if (hidden) {
      oe(select);
      menu.hidden = false;
      button.setAttribute("aria-expanded", "true");
      Bo2 = value;
      window.requestAnimationFrame(() => Yv(value));
    }
  });
  menu.addEventListener("click", event => {
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
    Ht2(value);
    if (select.value !== inputValue) {
      select.dispatchEvent(new Event("change", {
        bubbles: true
      }));
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
function Kv2(value = document) {
  if (value instanceof HTMLSelectElement) {
    Xv(value);
  }
  value.querySelectorAll?.("select").forEach(arg => Xv(arg));
}
function Fo2(value, skipPreview = false) {
  const temp = normalizedHexColor(value);
  if (!temp || !me) {
    return;
  }
  const temp2 = hexToRgb(temp);
  const temp3 = rgbToHsv(temp2);
  $o2 = temp3.s > 0 ? temp3.h : $o2;
  Nr = temp3.s;
  Er = temp3.v;
  pt2.style.setProperty("--picker-hue", "hsl(" + $o2 + " 100% 50%)");
  pt2.style.setProperty("--picker-color", temp);
  Xm.style.left = Nr * 100 + "%";
  Xm.style.top = (1 - Er) * 100 + "%";
  zl.value = String(Math.round($o2));
  if (document.activeElement !== Dl) {
    Dl.value = temp.toUpperCase();
  }
  zl2.value = String(Math.round(temp2.r));
  Vl3.value = String(Math.round(temp2.g));
  Wl.value = String(Math.round(temp2.b));
  A1.style.background = temp;
  if (me.value !== temp) {
    me.value = temp;
    if (skipPreview) {
      me.dispatchEvent(new Event("input", {
        bubbles: true
      }));
    }
  }
}
function Jv() {
  const value = hsvToRgb($o2, Nr, Er);
  Fo2(rgbToHex(value.r, value.g, value.b), true);
}
function Vu() {
  if (pt2.hidden || !me) {
    return;
  }
  const value = me.getBoundingClientRect();
  const rect = pt2.getBoundingClientRect();
  const temp = 9;
  const temp2 = 8;
  const number = value.left - rect.width - temp;
  const chosen = number >= temp2 ? number : Math.min(window.innerWidth - rect.width - temp2, value.right + temp);
  const clamped = clampNumber(value.top, temp2, Math.max(temp2, window.innerHeight - rect.height - temp2));
  pt2.style.left = Math.max(temp2, chosen) + "px";
  pt2.style.top = clamped + "px";
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
  $o2 = value.h;
  Nr = value.s;
  Er = value.v;
  pt2.hidden = false;
  Fo2(Lc);
  window.requestAnimationFrame(Vu);
}
function Qv() {
  if (!me) {
    return;
  }
  const element = me;
  const value = normalizedHexColor(element.value) !== Lc;
  pt2.hidden = true;
  me = null;
  Tr = null;
  if (value) {
    element.dispatchEvent(new Event("change", {
      bubbles: true
    }));
  }
  Sw(element);
}
function CN() {
  if (!pt2.hidden && me?.isConnected) {
    Fo2(me.value);
  }
}
function ju(value = document) {
  (value instanceof HTMLInputElement && value.type === "color" ? [value] : [...(value.querySelectorAll?.("input[type=\"color\"]") || [])]).forEach(el2 => {
    if (!Gv.has(el2)) {
      Gv.set(el2, true);
      el2.title = "打开颜色选择器";
      el2.addEventListener("pointerdown", event => {
        event.preventDefault();
        Zv(el2);
      });
      el2.addEventListener("click", event => event.preventDefault());
      el2.addEventListener("keydown", event => {
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
    const flag = Number(element.dataset?.numberStep) || Number(element.step) || 1;
    const flag2 = Number(element.value) || 0;
    const chosen = element.min === "" ? -Infinity : Number(element.min);
    const chosen2 = element.max === "" ? Infinity : Number(element.max);
    element.value = String(clampNumber(flag2 + flag * value, chosen, chosen2));
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
function Gu(value = document) {
  const elements = value instanceof HTMLInputElement && value.type === "number" ? [value] : [...(value.querySelectorAll?.(".inspector-form input[type=\"number\"], .i3d-editor input[type=\"number\"], .i3d-vacuum-map-editor input[type=\"number\"]") || [])];
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
      element.innerHTML = "<svg viewBox=\"0 0 10 6\" aria-hidden=\"true\"><path d=\"" + arg3 + "\"></path></svg>";
      element.addEventListener("click", event => event.preventDefault());
      element.addEventListener("pointerdown", event => {
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
    temp3.append(createControl(1, "增加数值", "M1 5 5 1l4 4"), createControl(-1, "减少数值", "M1 1 5 5l4-4"));
    temp.before(temp2);
    temp2.append(temp, temp3);
    let temp4 = false;
    temp.addEventListener("keydown", event => {
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        temp4 = Wu(temp, event.key === "ArrowUp" ? 1 : -1) || temp4;
      }
    });
    temp.addEventListener("keyup", event2 => {
      if (!!["ArrowUp", "ArrowDown"].includes(event2.key) && !!temp4) {
        temp4 = false;
        temp.dispatchEvent(new Event("change", {
          bubbles: true
        }));
      }
    });
  }
}
function Ru(value) {
  Jo2.classList.toggle("empty", !value);
  Dt2.classList.toggle("workspace-empty-state", !value);
  Dt2.classList.toggle("canvas-placeholder", value);
  fs2.disabled = !value;
  km.disabled = !value;
  Mm.disabled = !value;
  Om.disabled = !value;
  if (!value) {
    Dt2.removeAttribute("style");
    Dt2.innerHTML = "<div class=\"canvas-message\"><strong>请从左侧新建仪表盘。</strong></div>";
    Wn();
    pn();
  }
  ju2();
  o0();
  Pl();
}
function jt2(value = h?.document) {
  return value?.uiPack?.id || "ui.base";
}
function Tc(value = jt2()) {
  return cn2.find(component => component.id === value) || (value === "ui.base" ? {
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
function Hu() {
  const value = Tc();
  SS.textContent = value?.name || "未知 UI";
  xS.textContent = value ? (value.englishName || value.id) + " · " + value.version : jt2();
}
function n0() {
  const value = jt2();
  const options = {
    dashboards: "仪表盘",
    components: "控件",
    popups: "弹窗",
    assets: "素材"
  };
  if (!cn2.length) {
    const element = document.createElement("div");
    element.className = "component-template-empty";
    element.textContent = "暂无可用 UI 方案。";
    hl.replaceChildren(element);
    return;
  }
  hl.replaceChildren(...cn2.map(component => {
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
    element2.textContent = (component.englishName || component.id) + " · " + component.version;
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
    element5.textContent = flag ? "当前使用" : component.allowed ? "应用到当前仪表盘" : "尚未解锁";
    if (!flag && component.allowed) {
      element5.className = "primary";
    }
    temp2.append(element2, element3, element4, temp3, element5);
    temp.append(element, temp2);
    return temp;
  }));
}
async function Ir() {
  cn2 = (await Z("/ui-packs?_=" + Date.now())).items || [];
  Hu();
  if (io.open) {
    n0();
  }
  return cn2;
}
function Do2() {
  xv2?.destroy();
  xv2 = null;
}
function Ac2(value = R.value) {
  if (Te !== "dashboard") {
    Do2();
    return;
  }
  if (!h?.document?.pages?.length) {
    Do2();
    oa2.innerHTML = "<div class=\"canvas-message\"><strong>" + (h ? "请从左侧新建页面。" : "请从左侧新建仪表盘。") + "</strong></div>";
    return;
  }
  if (!xv2) {
    xv2 = new PanelRenderer(oa2, {
      editable: false,
      historySeriesCache: Sv3,
      runtimeStateCache: xv3,
      virtualEntityStateCache: Nv2,
      onError,
      onRuntimeButtonPress() {
        Qo.play();
      },
      onPageChange(arg) {
        R.value = arg.path;
        oe(R);
      }
    });
    xv2.setEntityCatalog(le, Tu2, Ao2);
  }
  xv2.setDocument(h.document, value);
}
function o0() {
  const value = String(h?.document?.name || "").trim();
  const flag = Te === "dashboard" && !!value;
  QS.hidden = !flag;
  if (!flag) {
    na.removeAttribute("href");
    na.textContent = "";
    return;
  }
  const temp = new URL("/habridge/" + encodeURIComponent(value), window.location.origin);
  na.href = temp.href;
  na.textContent = decodeURI(temp.href);
  na.title = temp.href;
}
function SN2(value) {
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
  const value = (await Z("/displays/pairing-codes?projectId=" + encodeURIComponent(h.projectId))).items || [];
  o1.textContent = value.length + " 个";
  Al.replaceChildren();
  if (!value.length) {
    const element = document.createElement("p");
    element.textContent = "暂无配对码";
    Al.append(element);
    return;
  }
  for (const temp of value) {
    const temp2 = document.createElement("div");
    temp2.className = "display-device-item" + (temp.enabled ? "" : " is-disabled");
    const temp3 = document.createElement("div");
    temp3.className = "display-device-copy";
    const element = document.createElement("strong");
    element.textContent = temp.name;
    const element2 = document.createElement("span");
    const chosen = temp.device ? "已绑定 · 最后在线 " + SN2(temp.device.lastSeenAt) : "等待设备配对";
    element2.textContent = (temp.enabled ? "已启用" : "已停用") + " · " + chosen;
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
        await Z("/displays/pairing-codes/" + encodeURIComponent(temp.id), {
          method: "PATCH",
          body: JSON.stringify({
            enabled: !temp.enabled
          })
        });
        await Pc();
      } catch (error) {
        z(Zo2, error.message, "error");
        element4.disabled = false;
      }
    });
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.className = "danger";
    element5.textContent = "删除";
    element5.addEventListener("click", async () => {
      if (window.confirm("确认删除“" + temp.name + "”的固定配对码？绑定设备会立即失效。")) {
        element5.disabled = true;
        try {
          await Z("/displays/pairing-codes/" + encodeURIComponent(temp.id), {
            method: "DELETE"
          });
          await Pc();
        } catch (error) {
          z(Zo2, error.message, "error");
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
async function ON() {
  if (h) {
    z(Zo2, "");
    if (!Tl2.open) {
      Tl2.showModal();
    }
    try {
      await Pc();
    } catch (error) {
      z(Zo2, error.message, "error");
    }
  }
}
async function BN(event) {
  event?.preventDefault();
  if (h) {
    Vm.disabled = true;
    z(Zo2, "");
    try {
      const value = await Z("/displays/pairing-code", {
        method: "POST",
        body: JSON.stringify({
          projectId: h.projectId,
          name: n1.value,
          code: Es.value
        })
      });
      jm.reset();
      await Pc();
    } catch (error) {
      z(Zo2, error.message, "error");
    } finally {
      Vm.disabled = false;
    }
  }
}
function ju2() {
  const canvas = h?.document?.canvas;
  const numeric = Number(canvas?.width);
  const numeric2 = Number(canvas?.height);
  const value = Te !== "popup" && Number.isFinite(numeric) && numeric > 0 && Number.isFinite(numeric2) && numeric2 > 0;
  Il2.hidden = !value;
  Il2.textContent = value ? Math.round(numeric) + " × " + Math.round(numeric2) : "";
}
function Mt2(value) {
  Te = ["edit", "dashboard", "popup"].includes(value) ? value : "edit";
  const flag = Te === "edit";
  const flag2 = Te === "dashboard";
  const flag3 = Te === "popup";
  LS.hidden = flag3;
  IS.hidden = !flag3;
  ES.classList.toggle("popup-mode", flag3);
  bl.classList.toggle("active", !flag3);
  bl.setAttribute("aria-selected", String(!flag3));
  yl2.classList.toggle("active", flag3);
  yl2.setAttribute("aria-selected", String(flag3));
  if (!flag) {
    s0();
  }
  Dt2.hidden = !flag;
  oa2.hidden = !flag2;
  St2.hidden = !flag3;
  Jo2.classList.toggle("empty", !h);
  ZS.textContent = flag2 ? "仪表盘" : flag3 ? "组合弹窗" : "页面画布";
  ju2();
  o0();
  Pl();
  for (const [element, temp] of [[Hm2, flag], [Um, flag2]]) {
    element.classList.toggle("active", temp);
    element.setAttribute("aria-selected", String(temp));
  }
  if (flag) {
    Do2();
    if (h?.document?.pages?.length) {
      jr().setDocument(h.document, R.value);
      Sv2.setSelectedComponents([...selectedComponentIds], componentId);
    }
    window.requestAnimationFrame(qu);
  } else if (flag2) {
    Sv2?.destroy();
    Sv2 = null;
    Ac2();
    window.requestAnimationFrame(() => xv2?.resize());
  } else if (flag3) {
    qt2();
    _e();
    ee();
    Sv2?.destroy();
    Sv2 = null;
    Do2();
    Sp();
  }
}
function EN2() {
  const value = String(ie?.baseUrl || "").trim();
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
function i0(value = !!h?.document?.pages?.length) {
  if (vl) {
    const currentPage = Je2();
    const flag = !!currentPage && h?.document?.defaultPagePath === currentPage.path;
    vl.textContent = flag ? "已是默认首屏" : "设为默认首屏";
    vl.disabled = !value || flag;
  }
}
function a0(value) {
  R.disabled = !value;
  bs.disabled = !value;
  i0(value);
  y0();
  oe(R);
  if (!value) {
    pn();
  }
}
function qu() {
  if (!h) {
    return;
  }
  const value = getComputedStyle(Jo2);
  const contentWidth = Jo2.clientWidth - Number.parseFloat(value.paddingLeft) - Number.parseFloat(value.paddingRight);
  const contentHeight = Jo2.clientHeight - Number.parseFloat(value.paddingTop) - Number.parseFloat(value.paddingBottom);
  const canvasWidth = h.document.canvas.width || 2778;
  const canvasHeight = h.document.canvas.height || 1940;
  const number = canvasWidth / canvasHeight;
  const flag = contentWidth / contentHeight > number;
  const chosen = flag ? contentHeight * number : contentWidth;
  const chosen2 = flag ? contentHeight : contentWidth / number;
  Dt2.style.width = Math.max(1, chosen) + "px";
  Dt2.style.height = Math.max(1, chosen2) + "px";
  oa2.style.width = Math.max(1, chosen) + "px";
  oa2.style.height = Math.max(1, chosen2) + "px";
  window.requestAnimationFrame(() => {
    Sv2?.resize();
    xv2?.resize();
  });
}
const FN = new ResizeObserver(() => {
  qu();
  K0();
  xv2?.resize();
});
FN.observe(Jo2);
function Je2() {
  return h?.document?.pages?.find(value => value.path === R.value) || h?.document?.pages?.[0] || null;
}
function r0(value, doc = h?.document) {
  const idSet = [...new Set(value || [])];
  if (idSet.length < 2 || !doc) {
    return false;
  }
  const mapped = idSet.map(arg => componentDirectLocation(doc, arg));
  if (mapped.some(arg => !arg || arg.component.type === "group")) {
    return false;
  }
  const temp = mapped[0];
  return mapped.every(arg => arg.scope === temp.scope && arg.page?.path === temp.page?.path && arg.collection === temp.collection && arg.component.properties?.layoutMode !== "fill");
}
function IN2(value) {
  const idSet = [...new Set(value || [])];
  if (!r0(idSet)) {
    onError(new Error("请选择同一页面或同一侧边栏中的两个或更多控件后再成组。"));
    return;
  }
  const id2 = newId("group");
  componentId = id2;
  selectedComponentIds = new Set([id2]);
  ku2 = id2;
  se2 = null;
  return L(doc => {
    const mapped = idSet.map(arg => componentDirectLocation(doc, arg));
    if (mapped.some(arg => !arg)) {
      return;
    }
    const collection = mapped[0].collection;
    const temp = mapped.map(arg => arg.component).sort((arg, arg2) => collection.indexOf(arg) - collection.indexOf(arg2));
    const mapped2 = temp.map(arg => c0(arg));
    const minValue = Math.min(...mapped2.map(arg => arg.left));
    const minValue2 = Math.min(...mapped2.map(arg => arg.top));
    const count = Math.max(...mapped2.map(arg => arg.right));
    const count2 = Math.max(...mapped2.map(arg => arg.bottom));
    const minValue3 = Math.min(...temp.map(arg => collection.indexOf(arg)));
    const children = temp.map(component => ({
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
      children
    };
    const allowed = new Set(idSet);
    const filtered = collection.filter(component => !allowed.has(component.id));
    filtered.splice(Math.min(minValue3, filtered.length), 0, options);
    collection.splice(0, collection.length, ...filtered);
    applyCollectionLayerOrder(collection);
    if (mapped[0].scope === "shared") {
      for (const temp2 of doc.pages || []) {
        const flag = temp2.sharedComponentIds || [];
        const filtered2 = flag.map((arg, arg2) => allowed.has(arg) ? arg2 : -1).filter(arg => arg >= 0);
        if (!filtered2.length) {
          continue;
        }
        const minValue4 = Math.min(...filtered2);
        const filtered3 = flag.filter(arg => !allowed.has(arg));
        filtered3.splice(Math.min(minValue4, filtered3.length), 0, id2);
        temp2.sharedComponentIds = [...new Set(filtered3)];
      }
      syncSharedComponentReferenceOrder(doc);
    }
  });
}
function TN2(value) {
  const temp = findComponentLocation(h?.document, value);
  if (!temp || temp.component.type !== "group") {
    return;
  }
  const mapped = (temp.component.children || []).map(component => component.id);
  componentId = mapped[0] || null;
  selectedComponentIds = new Set(mapped);
  ku2 = componentId;
  se2 = null;
  L(doc => {
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
    const mapped2 = (temp2.component.children || []).map(component => {
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
      const count2 = Math.max(0.01, Math.min(5, Number(style.scale || 1) * count));
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
        style
      };
    });
    temp2.collection.splice(temp2.index, 1, ...mapped2);
    applyCollectionLayerOrder(temp2.collection);
    if (temp2.scope === "shared" && temp2.root) {
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
function AN2(value) {
  const component = findComponent(h?.document, value)?.component;
  if (!!component && component.type === "group") {
    Ct.dataset.groupId = value;
    Fm.value = componentLabel(component);
    z(Hm, "");
    Ct.showModal();
    window.setTimeout(() => Fm.focus(), 0);
  }
}
function Gu2(value, arg2, arg3 = null, arg4 = false) {
  const temp = findComponentLocation(value, arg2);
  if (!temp) {
    return null;
  }
  const component = arg3 ? cloneValue(arg3) : refreshComponentIds(cloneValue(temp.component));
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
      x: clampNumber(Number(component.position?.x || 0) + 24, -numeric3 / 2, numeric - numeric3 / 2),
      y: clampNumber(Number(component.position?.y || 0) + 24, -numeric4 / 2, numeric2 - numeric4 / 2)
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
function kc2(value, arg2) {
  const temp = findComponentLocation(value, arg2);
  if (!temp) {
    return null;
  }
  const [temp2] = temp.collection.splice(temp.index, 1);
  applyCollectionLayerOrder(temp.collection);
  if (temp.scope === "shared" && temp.root) {
    for (const temp3 of value.pages || []) {
      temp3.sharedComponentIds = (temp3.sharedComponentIds || []).filter(arg => arg !== arg2);
    }
    syncSharedComponentReferenceOrder(value);
  }
  return temp2;
}
function Uu(value) {
  const temp = String(value || "").trim().toLowerCase();
  if (/^#[\da-f]{6}$/.test(temp)) {
    return temp;
  } else {
    return "";
  }
}
function Number2() {
  return findComponent(h?.document, componentId)?.component || null;
}
function PN2(value) {
  if (se2) {
    const component = findComponent(h?.document, se2)?.component;
    if (component?.type === "group") {
      return component.children || [];
    }
  }
  if (value === "shared") {
    return h?.document?.sharedComponents || [];
  } else {
    return Je2()?.components || [];
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
  return (h?.document?.pages || []).flatMap(page => Rn(page.components, value).map(component => ({
    component,
    page
  })));
}
function Mc() {
  Sv2?.setActiveGroup(se2);
  Sv2?.setSelectedComponents([...selectedComponentIds], componentId);
}
function qt2() {
  s0();
  componentId = null;
  selectedComponentIds = new Set();
  ku2 = null;
}
function s0() {
  for (const value of [Pi, Ec, zn, Mo2]) {
    for (const temp of value.keys()) {
      Sv2?.setComponentPreviewState(temp, "auto");
    }
    value.clear();
  }
}
function Oc(value, {
  toggle: arg = false,
  range: arg2 = false,
  preserveGroup: arg3 = false
} = {}) {
  const temp = findComponent(h?.document, value);
  if (!temp) {
    qt2();
    Mc();
    _e();
    ee();
    return;
  }
  const temp2 = findComponent(h?.document, componentId);
  const flag = temp2?.scope === temp.scope && (temp.scope !== "page" || temp2.page?.path === temp.page?.path);
  if (arg3 && selectedComponentIds.has(value)) {
    componentId = value;
  } else if (arg2 && flag && ku2) {
    const temp3 = PN2(temp.scope);
    const temp4 = temp3.findIndex(component => component.id === ku2);
    const temp5 = temp3.findIndex(component => component.id === value);
    if (temp4 >= 0 && temp5 >= 0) {
      const [chosen, chosen2] = temp4 <= temp5 ? [temp4, temp5] : [temp5, temp4];
      selectedComponentIds = new Set(temp3.slice(chosen, chosen2 + 1).map(component => component.id));
      componentId = value;
    } else {
      selectedComponentIds = new Set([value]);
      componentId = value;
      ku2 = value;
    }
  } else if (arg && flag) {
    const allowed = new Set(selectedComponentIds);
    if (allowed.has(value)) {
      allowed.delete(value);
    } else {
      allowed.add(value);
    }
    selectedComponentIds = allowed;
    componentId = allowed.has(value) ? value : allowed.values().next().value || null;
    ku2 = value;
  } else if (!arg && !arg2 && selectedComponentIds.size === 1 && selectedComponentIds.has(value)) {
    qt2();
  } else {
    selectedComponentIds = new Set([value]);
    componentId = value;
    ku2 = value;
  }
  if (temp.scope === "shared" && Je2()?.path) {
    const temp3 = cloneValue(h.document);
    if (ensureSharedComponentReference(temp3, value, Je2().path)) {
      vt(temp3, Je2().path).catch(onError);
    }
  }
  if (componentId) {
    $c(temp.scope);
  }
  Mc();
  _e();
  ee();
}
function L(mutate, value = R.value, {
  throwOnError = false
} = {}) {
  const pending = Cr2.catch(() => {}).then(async () => {
    if (!h) {
      throw new Error("请先选择仪表盘。");
    }
    const temp = cloneValue(h.document);
    const temp2 = await mutate(temp);
    await vt(temp, value);
    return temp2;
  });
  Cr2 = pending.catch(onError);
  if (throwOnError) {
    return pending;
  } else {
    return Cr2;
  }
}
function kN(value, arg2) {
  const list = [...selectedComponentIds];
  if (!!list.length && (!!value || !!arg2)) {
    L(doc => {
      const filtered = list.map(arg => findComponent(doc, arg)?.component).filter(Boolean);
      if (!filtered.length || filtered.some(component2 => component2.properties?.layoutMode === "fill")) {
        return;
      }
      const component = filtered.length === 1 && filtered[0].type === "air-conditioner" ? filtered[0] : null;
      if (component && Fu2.get(component.id) === "airflow") {
        const count3 = Math.max(1, Number(component.position?.width || 100));
        const count4 = Math.max(1, Number(component.position?.height || 100));
        const temp = airflowCanvasOffsetBounds(component, doc.canvas);
        component.properties = {
          ...(component.properties || {}),
          airflowOffsetX: clampNumber(Number(component.properties?.airflowOffsetX ?? -75) + value / count3 * 100, temp.minX, temp.maxX),
          airflowOffsetY: clampNumber(Number(component.properties?.airflowOffsetY ?? 34) + arg2 / count4 * 100, temp.minY, temp.maxY)
        };
        return;
      }
      const numeric = Number(doc.canvas?.width || 2778);
      const numeric2 = Number(doc.canvas?.height || 1940);
      const count = Math.max(...filtered.map(component2 => -Number(component2.position?.width || 100) / 2 - Number(component2.position?.x || 0)));
      const minValue = Math.min(...filtered.map(component2 => numeric - Number(component2.position?.width || 100) / 2 - Number(component2.position?.x || 0)));
      const count2 = Math.max(...filtered.map(component2 => -Number(component2.position?.height || 100) / 2 - Number(component2.position?.y || 0)));
      const minValue2 = Math.min(...filtered.map(component2 => numeric2 - Number(component2.position?.height || 100) / 2 - Number(component2.position?.y || 0)));
      const clamped = clampNumber(value, count, minValue);
      const clamped2 = clampNumber(arg2, count2, minValue2);
      for (const component2 of filtered) {
        if (component) {
          const count3 = Math.max(1, Number(component2.position?.width || 100));
          const count4 = Math.max(1, Number(component2.position?.height || 100));
          const position = {
            ...(component2.position || {}),
            x: Number(component2.position?.x || 0) + clamped,
            y: Number(component2.position?.y || 0) + clamped2
          };
          const temp = airflowCanvasOffsetBounds({
            ...component2,
            position
          }, doc.canvas);
          component2.properties = {
            ...(component2.properties || {}),
            airflowOffsetX: clampNumber(Number(component2.properties?.airflowOffsetX ?? -75) - clamped / count3 * 100, temp.minX, temp.maxX),
            airflowOffsetY: clampNumber(Number(component2.properties?.airflowOffsetY ?? 34) - clamped2 / count4 * 100, temp.minY, temp.maxY)
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
function l0(value) {
  if (selectedComponentIds.size < 2 || !h || !componentId) {
    return [];
  }
  const list = [...selectedComponentIds].map(arg => findComponent(h.document, arg)?.component).filter(Boolean);
  const found = list.find(component => component.id === componentId);
  if (!found || list.length !== selectedComponentIds.size || list.some(component => component.properties?.layoutMode === "fill")) {
    return [];
  }
  const count = Math.max(0.01, Math.min(5, Number(found.style?.scale || 1)));
  const number = Math.max(0.01, Math.min(5, Number(value))) / count;
  const count2 = Math.max(...list.map(el2 => 0.01 / Math.max(0.01, Number(el2.style?.scale || 1))));
  const minValue = Math.min(...list.map(el2 => 5 / Math.max(0.01, Number(el2.style?.scale || 1))));
  const clamped = clampNumber(number, count2, minValue);
  const mapped = list.map(c0);
  const number2 = (Math.min(...mapped.map(arg => arg.left)) + Math.max(...mapped.map(arg => arg.right))) / 2;
  const number3 = (Math.min(...mapped.map(arg => arg.top)) + Math.max(...mapped.map(arg => arg.bottom))) / 2;
  return list.map(component => {
    const flag = component.position || {};
    const numeric = Number(flag.width || 100);
    const numeric2 = Number(flag.height || 100);
    const number4 = Number(flag.x || 0) + numeric / 2;
    const number5 = Number(flag.y || 0) + numeric2 / 2;
    return {
      componentId: component.id,
      x: number2 + (number4 - number2) * clamped - numeric / 2,
      y: number3 + (number5 - number3) * clamped - numeric2 / 2,
      scale: Math.max(0.01, Math.min(5, Number(component.style?.scale || 1) * clamped))
    };
  });
}
function d0() {
  const value = [...document.querySelectorAll(".element-item.selected[data-component-id]")].map(el2 => el2.dataset.componentId).filter(Boolean);
  if (selectedComponentIds.size > 1) {
    return [...selectedComponentIds];
  } else {
    return value;
  }
}
function Gt2(value, arg2, rotation, arg4 = []) {
  const chosen = arg4.length > 1 ? arg4 : [arg2];
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
function MN(value) {
  if (value) {
    return "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z\"/><circle cx=\"12\" cy=\"12\" r=\"2.8\"/></svg>";
  } else {
    return "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m4 4 16 16M2.5 12s3.5-6 9.5-6c2 0 3.7.7 5.1 1.6M21.5 12s-3.5 6-9.5 6c-2 0-3.7-.7-5.1-1.6\"/></svg>";
  }
}
function u0(value, visible) {
  const idSet = [...new Set(value || [])];
  if (idSet.length) {
    L(arg => {
      for (const temp of idSet) {
        const component = findComponent(arg, temp)?.component;
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
function _u() {
  Pe.hidden = true;
  Ou = null;
}
function ON2(event, value) {
  event.preventDefault();
  event.stopPropagation();
  Oc(value, {
    preserveGroup: true
  });
  Ou = value;
  const chosen = selectedComponentIds.has(value) ? [...selectedComponentIds] : [value];
  const length = chosen.length;
  const element = Pe.querySelector("[data-component-action=\"copy\"]");
  const element2 = Pe.querySelector("[data-component-action=\"copy-to-page\"]");
  const element3 = Pe.querySelector("[data-component-action=\"visibility\"]");
  const element4 = Pe.querySelector("[data-component-action=\"delete\"]");
  const element5 = Pe.querySelector("[data-component-action=\"group\"]");
  const element6 = Pe.querySelector("[data-component-action=\"ungroup\"]");
  const element7 = Pe.querySelector("[data-component-action=\"rename-group\"]");
  const element8 = Pe.querySelector(":scope > strong");
  element.textContent = length > 1 ? "复制 " + length + " 个控件" : "复制控件";
  const component = findComponent(h?.document, value)?.component;
  const mapped = chosen.map(arg => findComponent(h?.document, arg)?.component).filter(Boolean).map(el2 => el2.style?.visible !== false);
  const flag = mapped.length === chosen.length && mapped.every(arg => arg === mapped[0]);
  element3.disabled = !flag;
  element3.textContent = flag ? mapped[0] ? length > 1 ? "批量隐藏 " + length + " 个" : "隐藏控件" : length > 1 ? "批量显示 " + length + " 个" : "显示控件" : "批量隐藏/显示";
  element3.title = flag ? "" : "选中的控件包含隐藏和显示状态，无法批量处理";
  const temp = r0(chosen);
  element5.hidden = !temp;
  element6.hidden = component?.type !== "group" || length !== 1;
  element7.hidden = component?.type !== "group" || length !== 1;
  element2.textContent = "复制到其他区域";
  const hasMatch = ft2.some(component2 => component2.id !== h?.projectId);
  const temp2 = p0(h?.document, chosen);
  element2.disabled = temp2.length === 0 && !hasMatch;
  element2.title = element2.disabled ? "当前没有可复制的目标区域" : length > 1 ? "完整复制选中的 " + length + " 个控件到其他页面、侧边栏或其他仪表盘" : "完整复制当前控件到其他页面、侧边栏或其他仪表盘";
  element4.textContent = length > 1 ? "删除 " + length + " 个控件" : "删除控件";
  element8.textContent = length > 1 ? "颜色标签（" + length + " 个控件）" : "颜色标签";
  const mapped2 = chosen.map(arg => {
    const component2 = findComponent(h?.document, arg)?.component;
    return Uu(component2?.style?.editorLabelColor);
  });
  const chosen2 = mapped2.every(arg => arg === mapped2[0]) ? mapped2[0] : null;
  for (const element9 of Pe.querySelectorAll("[data-label-color]")) {
    element9.classList.toggle("active", chosen2 !== null && element9.dataset.labelColor === chosen2);
  }
  Pe.hidden = false;
  Pe.style.left = "0px";
  Pe.style.top = "0px";
  window.requestAnimationFrame(() => {
    const rect = Pe.getBoundingClientRect();
    const clamped = clampNumber(event.clientX, 8, Math.max(8, window.innerWidth - rect.width - 8));
    const clamped2 = clampNumber(event.clientY, 8, Math.max(8, window.innerHeight - rect.height - 8));
    Pe.style.left = clamped + "px";
    Pe.style.top = clamped2 + "px";
  });
}
function p0(value, arg2) {
  const idSet = [...new Set(arg2 || [])].filter(Boolean);
  if (!value || !idSet.length) {
    return [];
  }
  const idSet2 = idSet.map(arg => new Set(copyComponentTargets(value, arg).map(event2 => event2.key)));
  const list = [...(idSet2[0] || [])].filter(arg => idSet2.every(arg3 => arg3.has(arg)));
  const temp = copyComponentTargets(value, idSet[0]);
  return list.map(arg => temp.find(event2 => event2.key === arg)).filter(Boolean);
}
function m0(value, arg2) {
  xr2 = arg2 || null;
  y1.textContent = value;
  ti2.showModal();
}
async function BN2() {
  const value = xr2;
  xr2 = null;
  ti2.close();
  if (value) {
    if (value.projectId && value.projectId !== h?.projectId) {
      await xp(value.projectId, value.pagePath);
    } else if (value.pagePath && value.pagePath !== R.value) {
      R.value = value.pagePath;
      oe(R);
      Sv2?.navigate(value.pagePath);
      xv2?.navigate(value.pagePath);
      _e();
      ee();
    }
    $c(value.scope);
  }
}
function f0(value, arg2 = componentId) {
  const idSet = [...new Set(value || [])];
  if (idSet.length) {
    L(arg => {
      const index = new Map(idSet.map(arg3 => [arg3, findComponentLocation(arg, arg3)]));
      const temp = idSet.filter(arg3 => index.get(arg3)).sort((arg3, arg22) => {
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
        const temp3 = Gu2(arg, temp2);
        if (temp3) {
          list.push(temp3.id);
          idByKey.set(temp2, temp3.id);
        }
      }
      if (list.length) {
        componentId = idByKey.get(arg2) || list[0];
        selectedComponentIds = new Set(list);
        ku2 = componentId;
      }
    });
  }
}
function $N(value, {
  includeShared: arg = true,
  sourceComponentId: arg2 = null
} = {}) {
  if (!value) {
    return [];
  }
  if (arg2) {
    return copyComponentTargets(value, arg2);
  }
  const mapped = (value.pages || []).map(page => ({
    key: "page:" + page.path,
    name: page.name,
    scope: "page",
    page
  }));
  if (arg) {
    return [{
      key: "shared",
      name: "侧边栏",
      scope: "shared"
    }, ...mapped];
  } else {
    return mapped;
  }
}
function Bc(value) {
  qm.replaceChildren(...value.map(event2 => new Option(event2.name, event2.key)));
  qm.disabled = !value.length;
  qm.value = value[0]?.key || "";
  oe(qm);
}
function g0(value) {
  return {
    width: Number(value?.canvas?.width || 2778),
    height: Number(value?.canvas?.height || 1940)
  };
}
function FN2() {
  if (vn.value !== "other" || !xr) {
    Ls2.hidden = true;
    qm2.textContent = "";
    return;
  }
  const value = g0(h?.document);
  const temp = g0(xr.document);
  const flag = value.width !== temp.width || value.height !== temp.height;
  Ls2.hidden = !flag;
  qm2.textContent = flag ? value.width + " × " + value.height + " → " + temp.width + " × " + temp.height : "";
}
async function Yu() {
  const value = vn.value === "other";
  let list = [];
  try {
    list = JSON.parse(at3.dataset.componentIds || "[]");
  } catch {
    list = [];
  }
  const temp = findComponent(h?.document, list[0]);
  const length = list.length;
  const element = at3.querySelector("[data-copy-component-description]");
  h1.hidden = !value;
  b1.textContent = value ? "其他仪表盘目标页面" : "本仪表盘目标页面";
  s1.textContent = value ? "复制到目标仪表盘" : "复制并前往";
  element.textContent = value ? "将选中的 " + length + " 个控件完整复制到其他仪表盘的目标页面或侧边栏，源控件不受影响。" : temp?.scope === "shared" ? "将选中的 " + length + " 个侧边栏控件完整复制到指定主页面，复制后为该页面的独立控件。" : "将选中的 " + length + " 个控件完整复制到侧边栏或其他主页面，保留位置、尺寸、样式、实体绑定和动作配置。";
  xr = null;
  Ls2.hidden = true;
  z(ti, "");
  if (!value) {
    const temp3 = p0(h?.document, list);
    Bc(temp3);
    s1.disabled = !temp3.length;
    return;
  }
  const inputValue = ei.value;
  if (!inputValue) {
    Bc([]);
    s1.disabled = true;
    z(ti, "当前没有其他仪表盘可以复制。");
    return;
  }
  const temp2 = ++Mu;
  Bc([]);
  s1.disabled = true;
  z(ti, "正在读取目标仪表盘…");
  try {
    const temp3 = await Z("/projects/" + encodeURIComponent(inputValue) + "/draft");
    if (temp2 !== Mu || vn.value !== "other") {
      return;
    }
    xr = temp3;
    const temp4 = $N(temp3.document);
    Bc(temp4);
    FN2();
    z(ti, temp4.length ? "" : "目标仪表盘还没有可复制到的区域。");
    s1.disabled = !temp4.length;
  } catch (error) {
    if (temp2 !== Mu) {
      return;
    }
    z(ti, error.message, "error");
  }
}
function DN(value) {
  const document = h?.document;
  const idSet = [...new Set(value || [])].filter(arg => findComponent(document, arg));
  const temp = findComponent(document, idSet[0]);
  if (!temp || !idSet.length) {
    onError(new Error("没有找到要复制的控件。"));
    return;
  }
  at3.dataset.componentIds = JSON.stringify(idSet);
  g1.textContent = idSet.length > 1 ? "已选择 " + idSet.length + " 个控件" : "“" + componentLabel(temp.component) + "”";
  at3.querySelector("[data-copy-component-description]").textContent = idSet.length > 1 ? "将选中的 " + idSet.length + " 个控件完整复制到目标区域。" : temp.scope === "shared" ? "将侧边栏控件完整复制到指定主页面，复制后为该页面的独立控件。" : "将当前控件完整复制到侧边栏或其他主页面，保留位置、尺寸、样式、实体绑定和动作配置。";
  vn.value = "current";
  oe(vn);
  const filtered = ft2.filter(component => component.id !== h.projectId);
  ei.replaceChildren(...filtered.map(component => new Option(component.name, component.id)));
  ei.disabled = !filtered.length;
  oe(ei);
  $l.elements.copyScaleMode.value = "proportional";
  at3.showModal();
  Yu();
}
function h0(value) {
  const idSet = [...new Set(value || [])].filter(arg => findComponent(h?.document, arg));
  if (idSet.length) {
    at2.dataset.componentIds = JSON.stringify(idSet);
    if (idSet.length > 1) {
      jm2.textContent = "“已选择的 " + idSet.length + " 个控件”";
    } else {
      const component = findComponent(h?.document, idSet[0])?.component;
      jm2.textContent = "“" + componentLabel(component || {
        type: "控件"
      }) + "”";
    }
    at2.showModal();
  }
}
function zN(value, arg2) {
  const idSet = [...new Set(value || [])];
  if (!idSet.length) {
    return;
  }
  const temp = Uu(arg2);
  L(arg => {
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
    element.draggable = !se2;
    element.classList.toggle("selected", selectedComponentIds.has(temp.id));
    element.classList.toggle("selection-primary", temp.id === componentId);
    element.classList.toggle("group-item", temp.type === "group");
    const temp2 = Uu(temp.style?.editorLabelColor);
    element.classList.toggle("has-color-label", !!temp2);
    if (temp2) {
      element.style.setProperty("--element-label-color", temp2);
    }
    const element2 = document.createElement("i");
    element2.className = temp.type === "group" ? "element-group-icon" : "element-label-color";
    element2.setAttribute("aria-hidden", "true");
    if (temp.type === "group") {
      element2.innerHTML = "<svg viewBox=\"0 0 24 24\" focusable=\"false\"><path d=\"M3.5 7.5h6l1.8 2h9.2v9.5h-17z\"/><path d=\"M3.5 7.5v-1h6l1.8 2\"/></svg>";
    }
    const element3 = document.createElement("span");
    element3.textContent = componentLabel(temp);
    const flag = temp.style?.visible !== false;
    const element4 = document.createElement("button");
    element4.type = "button";
    element4.className = "element-visibility" + (flag ? "" : " hidden-element");
    element4.setAttribute("aria-label", flag ? "隐藏" + componentLabel(temp) : "显示" + componentLabel(temp));
    element4.innerHTML = MN(flag);
    const callback = event => {
      wc2 = {
        componentId: temp.id,
        at: Date.now()
      };
      event.stopPropagation();
    };
    element4.addEventListener("pointerdown", callback);
    element4.addEventListener("click", event => {
      wc2 = {
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
    element.addEventListener("click", event2 => {
      Oc(temp.id, {
        toggle: event2.metaKey || event2.ctrlKey,
        range: event2.shiftKey
      });
    });
    element.addEventListener("dblclick", event => {
      if (temp.type !== "group" || event.target.closest(".element-visibility")) {
        return;
      }
      if (wc2.componentId === temp.id && Date.now() - wc2.at < 600) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      se2 = temp.id;
      qt2();
      _e();
      Mc();
      ee();
    });
    element.addEventListener("contextmenu", arg => ON2(arg, temp.id));
    element.addEventListener("dragstart", arg => {
      if (selectedComponentIds.has(temp.id)) {
        componentId = temp.id;
      } else {
        selectedComponentIds = new Set([temp.id]);
        componentId = temp.id;
        ku2 = temp.id;
      }
      const movingIds = [...selectedComponentIds];
      arg.dataTransfer.effectAllowed = "move";
      arg.dataTransfer.setData("text/plain", JSON.stringify({
        scope,
        sourceId: temp.id,
        movingIds
      }));
      value.querySelectorAll(".element-item").forEach(element5 => {
        element5.classList.toggle("dragging", movingIds.includes(element5.dataset.componentId));
      });
    });
    element.addEventListener("dragend", () => {
      value.querySelectorAll(".dragging").forEach(element5 => element5.classList.remove("dragging"));
      value.querySelectorAll(".drop-before, .drop-after").forEach(element5 => element5.classList.remove("drop-before", "drop-after"));
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
      let temp3;
      try {
        temp3 = JSON.parse(event.dataTransfer.getData("text/plain"));
      } catch {
        return;
      }
      const {
        scope: temp4,
        sourceId: temp5
      } = temp3;
      const list = Array.isArray(temp3.movingIds) ? temp3.movingIds : [temp5];
      const temp6 = element.classList.contains("drop-after");
      element.classList.remove("drop-before", "drop-after");
      if (temp4 === scope && !!temp5 && !list.includes(temp.id)) {
        componentId = temp5;
        selectedComponentIds = new Set(list);
        L(document => {
          const chosen = scope === "shared" ? document.sharedComponents : document.pages.find(arg => arg.path === R.value)?.components;
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
function VN(value, arg2) {
  if (!arg2) {
    return;
  }
  const element = document.createElement("button");
  element.type = "button";
  element.className = "element-group-back";
  element.textContent = "← 返回" + componentLabel(arg2);
  element.addEventListener("click", () => {
    se2 = null;
    qt2();
    _e();
    Mc();
    ee();
  });
  value.prepend(element);
}
function _e() {
  const value = Je2();
  const chosen = se2 ? findComponent(h?.document, se2) : null;
  const chosen2 = chosen?.component?.type === "group" ? chosen.component : null;
  if (se2 && !chosen2) {
    se2 = null;
  }
  const chosen3 = chosen2 && chosen.scope === "shared" ? chosen2.children || [] : h?.document?.sharedComponents || [];
  const chosen4 = chosen2 && chosen.scope === "page" ? chosen2.children || [] : value?.components || [];
  b0(Cl, chosen3, "暂无侧边栏控件", "shared");
  b0(Sl, chosen4, "暂无主页面控件", "page");
  if (chosen2) {
    VN(chosen.scope === "shared" ? Cl : Sl, chosen2);
  }
}
function $c(value) {
  vc = value === "page" ? "page" : "shared";
  const flag = vc === "shared";
  Bm.classList.toggle("active", flag);
  Xo2.classList.toggle("active", !flag);
  Cl.hidden = !flag;
  Sl.hidden = flag;
  y0();
}
function y0() {
  const value = !!Je2();
  const doc = jt2();
  const hasMatch = ["shared", "page"].some(arg => listComponentTemplates(arg, doc).length > 0);
  vs.disabled = !value || !hasMatch;
  vs.title = value ? hasMatch ? "从模板库添加控件" : "该区域暂无可用控件模板" : "请先新建页面";
}
function WN() {
  const value = jt2();
  const list = [...listComponentTemplates("shared", value), ...listComponentTemplates("page", value)].filter((component, arg2, arg3) => arg3.findIndex(component2 => component2.id === component.id) === arg2);
  AS.textContent = vc === "shared" ? "当前添加到侧边栏，添加后会在所有页面显示。" : "当前添加到主页面，仅在“" + (Je2()?.name || "当前页面") + "”显示。";
  if (!list.length) {
    const element = document.createElement("div");
    element.className = "component-template-empty";
    element.textContent = "当前 UI 方案暂无可用控件模板。";
    wl.replaceChildren(element);
    return;
  }
  wl.replaceChildren(...list.map(component => {
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
      temp4.src = "/bridge-static/component-thumbnails/" + encodeURIComponent(flag) + ".jpg?v=20260902-component-thumbnails-v3";
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
  }));
}
const JN = new Set(["input_boolean", "input_button", "input_datetime", "input_number", "input_select", "input_text", "counter", "timer", "schedule"]);
const ZN = {
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
  } else if (JN.has(temp)) {
    return "辅助元素";
  } else {
    return ZN[temp] || temp || "实体";
  }
}
function Tr2(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}
function v0(value) {
  return Tr2(Iu2.get(String(value?.deviceId || "")));
}
function jN(value, arg2 = v0(value)) {
  const temp = Tr2(value?.name);
  const temp2 = Tr2(value?.originalName);
  if (!arg2) {
    return temp || temp2 || value?.entityId || "";
  }
  const chosen = temp === arg2 ? "" : temp.startsWith(arg2 + " ") ? temp.slice(arg2.length).trim() : temp.startsWith(arg2 + "·") ? temp.slice(arg2.length + 1).trim() : temp;
  if (chosen && chosen !== arg2) {
    return chosen;
  } else if (temp2 && temp2 !== arg2) {
    return temp2;
  } else {
    return "";
  }
}
function Ot2(value, arg2 = "") {
  if (value?.virtual) {
    return value.name || value.entityId || "";
  }
  const temp = v0(value);
  const flag = Tr2(arg2) || jN(value, temp);
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
  const temp = Ot2(value);
  const flag = value?.entityId || "";
  return "[" + Hn(value) + "] " + temp + (temp && temp !== flag ? " · " + flag : "");
}
function Ar(component = Number2()) {
  return [...new Set((Array.isArray(component?.properties?.entityIds) ? component.properties.entityIds : []).map(value => String(value || "").trim()).filter(Boolean))];
}
function qN(value, arg2 = null) {
  if (!arg2) {
    return {
      label: "实体已删除",
      tone: "missing"
    };
  }
  const temp = Sv2?.states?.get?.(value);
  const flag = temp?.newState || temp;
  const temp2 = String(flag?.state ?? "").trim().toLowerCase();
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
  ld2.textContent = value;
  ld2.hidden = !value;
  ld2.classList.toggle("error", !!arg2);
}
const Fc = 100;
function Pr({
  clearMessage: value = true
} = {}) {
  Rt3 = "";
  ko3 = -1;
  Sr = "";
  dg.hidden = true;
  Mr(rt, "选择一个实体");
  if (value) {
    jn("");
  }
}
function Xu(value = "") {
  if (Number2()?.type !== "light-statistics") {
    return;
  }
  const temp = value.trim().toLocaleLowerCase("zh-CN");
  const mapped = qn("light-statistics").map((entity, index) => ({
    entity,
    index,
    support: lightStatisticsEntitySupport(entity)
  })).filter(({
    entity: arg
  }) => !temp || (ct(arg) + " " + fe(arg)).toLocaleLowerCase("zh-CN").includes(temp)).sort((arg, arg2) => Number(arg2.support.supported) - Number(arg.support.supported) || +(fe(arg2.entity) === "light") - +(fe(arg.entity) === "light") || arg.index - arg2.index).map(({
    entity: arg,
    support: arg81
  }) => {
    const temp2 = document.createElement("button");
    temp2.type = "button";
    temp2.className = "inspector-entity-option" + (arg.entityId === Rt3 ? " selected" : "");
    temp2.dataset.lightStatisticsEntityId = arg.entityId;
    temp2.setAttribute("role", "option");
    temp2.setAttribute("aria-selected", String(arg.entityId === Rt3));
    const temp3 = document.createElement("span");
    temp3.className = "inspector-entity-option-content";
    temp3.title = ct(arg);
    const temp4 = document.createElement("span");
    temp4.className = "inspector-entity-option-line inspector-entity-name-line";
    const element = document.createElement("span");
    element.className = "inspector-entity-kind";
    element.textContent = "[" + Hn(arg) + "] ";
    const element2 = document.createElement("span");
    element2.className = "inspector-entity-name";
    element2.textContent = Ot2(arg);
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
function tE(value, arg2 = ko3) {
  const temp = Number2();
  if (temp?.type !== "light-statistics" || !qn("light-statistics").find(arg => arg.entityId === value)) {
    return;
  }
  const foundIndex = Ar(temp).indexOf(value);
  if (foundIndex >= 0 && foundIndex !== arg2) {
    jn("该实体已添加，请选择其它实体。", true);
    return;
  }
  Rt3 = value;
  ko3 = Number.isInteger(arg2) ? arg2 : -1;
  Sr = temp.id;
  return w0();
}
function w0() {
  const value = componentId;
  const temp = Rt3;
  const temp2 = ko3;
  const found = le.find(arg => arg.entityId === temp);
  if (!value || !temp || !found) {
    return;
  }
  const temp3 = Number2();
  if (temp2 < 0 && Ar(temp3).length >= Fc) {
    jn("每个统计控件最多添加 " + Fc + " 个实体。", true);
    return;
  }
  return L(arg => {
    const component = findComponent(arg, value)?.component;
    if (!component || component.type !== "light-statistics") {
      return "component-invalid";
    }
    const entityIds = Ar(component);
    const foundIndex = entityIds.indexOf(temp);
    if (foundIndex >= 0 && foundIndex !== temp2) {
      return "duplicate";
    }
    const chosen = temp2 >= 0 && temp2 < entityIds.length ? entityIds[temp2] : "";
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
    entityLabels[temp] = Ot2(found);
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
  }).then(arg => arg === "limit-reached" ? (jn("每个统计控件最多添加 " + Fc + " 个实体。", true), arg) : arg === "duplicate" ? (jn("该实体已添加，请选择其它实体。", true), arg) : arg === "component-invalid" ? (jn("当前统计控件已发生变化，请重新选择。", true), arg) : (arg !== "added" && arg !== "replaced" || (Pr({
    clearMessage: false
  }), jn(arg === "replaced" ? "已更换统计实体。" : "已加入统计列表。")), arg));
}
function UN(value) {
  const temp = componentId;
  if (!!temp && !!Number.isInteger(value) && !(value < 0)) {
    L(arg => {
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
        entityIds,
        entityLabels
      };
    });
    Pr();
  }
}
function C0(component = Number2()) {
  if (component?.type !== "light-statistics") {
    return;
  }
  const value = Ar(component);
  const flag = component.properties?.entityLabels || {};
  nx.textContent = value.length + " 个";
  const mapped = value.map((arg, arg2) => {
    const flag2 = qn("light-statistics").find(arg3 => arg3.entityId === arg) || null;
    const temp = qN(arg, flag2);
    const temp2 = document.createElement("div");
    temp2.className = "light-statistics-entity-row " + temp.tone + (flag2 ? "" : " missing");
    const temp3 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = flag2 ? Ot2(flag2) : flag[arg] || arg;
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
  ug.replaceChildren(...mapped);
}
function S0(value, arg2 = []) {
  for (const temp of value || []) {
    arg2.push(temp);
    S0(temp.children, arg2);
  }
  return arg2;
}
function _N(value = Je2()) {
  if (!value || !h?.document) {
    return [];
  }
  const index = new Map((h.document.sharedComponents || []).map(component => [component.id, component]));
  const filtered = (value.sharedComponentIds || []).map(arg => index.get(arg)).filter(Boolean);
  return S0([...(value.components || []), ...filtered]);
}
function kr(value = Je2()) {
  if (_N(value).some(component => component.type === "icon-button-effect")) {
    return [createIconVisibilityVirtualEntity(value?.path)];
  } else {
    return [];
  }
}
function qn(arg110 = "image") {
  return [...le, ...kr()];
}
const Dc = new WeakMap();
const x0 = new WeakMap();
const iE = "[data-overflow-scroll-preview], .inspector-picker-value, .inspector-entity-name-line";
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
  const temp = value.closest?.(iE);
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
document.addEventListener("pointerover", value => {
  const element = N0(value.target);
  const temp = E0(element);
  const flag = value.relatedTarget instanceof Node && temp?.contains(value.relatedTarget);
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
    const callback = arg => {
      const number = (arg - temp2) * 0.04;
      element.scrollLeft = Math.min(count, number);
      if (number < count) {
        options.frame = window.requestAnimationFrame(callback);
      }
    };
    options.frame = window.requestAnimationFrame(callback);
  }, 350);
});
document.addEventListener("pointerout", value => {
  const temp = N0(value.target);
  const temp2 = E0(temp);
  const flag = value.relatedTarget instanceof Node && temp2?.contains(value.relatedTarget);
  if (!!temp && !flag) {
    L0(temp);
  }
});
function closePickerPanel(panel, toggleButton) {
  panel.hidden = true;
  toggleButton.setAttribute("aria-expanded", "false");
  if (panel === Re) {
    Qe();
    Ht2(Vn.get(zt2));
  }
  if (panel === He) {
    Qe();
    Ht2(Vn.get(en2));
  }
}
function closeOtherPickerPanels(keepKind = null) {
  if (keepKind !== "entity") {
    closePickerPanel(aa2, oi);
  }
  if (keepKind !== "weather-entity") {
    closePickerPanel(Zd2, Jd);
  }
  if (keepKind !== "line-chart-entity") {
    closePickerPanel(eu2, Qd);
  }
  if (keepKind !== "ibe-entity") {
    closePickerPanel(Ts, Gl2);
  }
  if (keepKind !== "icon-button-entity") {
    closePickerPanel(mi, pi2);
  }
  if (keepKind !== "vacuum-map-entity") {
    closePickerPanel(nc, Gd);
  }
  if (keepKind !== "camera-entity") {
    closePickerPanel(ac, Yd);
  }
  if (keepKind !== "air-conditioner-entity") {
    closePickerPanel(Js, Dd2);
  }
  if (keepKind !== "title-button-entity") {
    closePickerPanel(Ms, ad);
  }
  if (keepKind !== "light-statistics-entity") {
    const flag = !Ie2.hidden;
    closePickerPanel(Ie2, rt);
    if (flag) {
      Pr();
    }
  }
  if (keepKind !== "light-statistics-action-entity") {
    closePickerPanel(Vs, dd);
  }
  if (keepKind !== "navigation-entity") {
    closePickerPanel(iu2, ou);
  }
  if (keepKind !== "asset") {
    closePickerPanel(Re, Cn);
  }
  if (keepKind !== "ibe-asset") {
    closePickerPanel(He, En);
  }
  if (keepKind !== "ibe-icon") {
    closePickerPanel(Sa, Qt);
  }
  if (keepKind !== "icon-button-icon") {
    closePickerPanel(Va, Lt);
  }
  if (keepKind !== "title-button-icon") {
    closePickerPanel(Ta, tn);
  }
  if (keepKind !== "light-statistics-icon") {
    closePickerPanel(Ba, nn);
  }
  if (keepKind !== "navigation-icon") {
    closePickerPanel(dr, on);
  }
}
function Fi2(value) {
  const temp = String(value || "").trim().replace(/^mdi:/, "");
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
  const temp = Fi2(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? "url(\"" + temp + "\")" : "";
  element.style.webkitMaskImage = temp ? "url(\"" + temp + "\")" : "";
  element2.textContent = text || "不使用图标";
  cr.disabled = !text;
  cr.title = text ? "复制 " + text : "当前未使用图标";
}
function KN(value) {
  const text = String(value || "");
  const element = Qt.querySelector("i");
  const element2 = Qt.querySelector("span");
  const temp = Fi2(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? "url(\"" + temp + "\")" : "";
  element.style.webkitMaskImage = temp ? "url(\"" + temp + "\")" : "";
  element2.textContent = text || "不使用图标";
  wa2.disabled = !text;
  wa2.title = text ? "复制 " + text : "当前未使用图标";
}
function JN2(value) {
  const text = String(value || "");
  const includesValue = ["device-button", "presence-sensor"].includes(Number2()?.type);
  const element = Lt.querySelector("i");
  const element2 = Lt.querySelector("span");
  const temp = Fi2(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? "url(\"" + temp + "\")" : "";
  element.style.webkitMaskImage = temp ? "url(\"" + temp + "\")" : "";
  element2.textContent = text || (includesValue ? "跟随实体图标" : "不使用图标");
  Da.disabled = !text;
  Da.title = text ? "复制 " + text : "当前未使用图标";
}
function ZN2(value) {
  const text = String(value || "");
  const element = tn.querySelector("i");
  const element2 = tn.querySelector("span");
  const temp = Fi2(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? "url(\"" + temp + "\")" : "";
  element.style.webkitMaskImage = temp ? "url(\"" + temp + "\")" : "";
  element2.textContent = text || "不使用图标";
  La.disabled = !text;
  La.title = text ? "复制 " + text : "当前未使用图标";
}
function QN(value) {
  const text = String(value ?? "mdi:lightbulb-group-outline");
  const element = nn.querySelector("i");
  const element2 = nn.querySelector("span");
  const temp = Fi2(text);
  element.hidden = !temp;
  element.style.maskImage = temp ? "url(\"" + temp + "\")" : "";
  element.style.webkitMaskImage = temp ? "url(\"" + temp + "\")" : "";
  element2.textContent = text || "不使用图标";
  Ma2.disabled = !text;
  Ma2.title = text ? "复制 " + text : "当前未使用图标";
}
async function zo2(value) {
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
  element.innerHTML = "<svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><rect x=\"5\" y=\"5\" width=\"8\" height=\"8\" rx=\"1.3\"></rect><path d=\"M10.5 5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9A1.5 1.5 0 0 0 3.5 10.5H5\"></path></svg><span aria-hidden=\"true\">✓</span>";
  const readEntityId = () => {
    const text = String(arg2() || "");
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
        await zo2(flag);
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
  for (const value of ["image-entity-button", "ibe-entity-button", "icon-button-entity-button", "air-conditioner-entity-button", "vacuum-map-entity-button", "camera-entity-button", "weather-entity-button", "line-chart-entity-button", "navigation-entity-button", "popup-module-entity-button"]) {
    const temp = document.getElementById(value);
    if (temp) {
      T0(temp);
    }
  }
}
eE();
const uE = 160;
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
  const minValue = Math.min(window.innerWidth - rect2.width - 8, Math.max(8, rect.left + (rect.width - rect2.width) / 2));
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
    value.replaceChildren(hE(arg2, arg3, arg4), element2);
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
    const temp2 = await Z("/icons?query=" + encodeURIComponent(temp.query) + "&limit=" + uE + "&offset=" + temp.offset);
    if (generation !== temp.generation) {
      return;
    }
    const flag = temp2.items || [];
    const mapped = flag.map(arg6 => yp(arg6, arg2, arg4));
    if (navigationIconLoadState && mapped.length) {
      navigationIconLoadState.before(...mapped);
    }
    temp.offset += flag.length;
    temp.total = Math.max(Number(temp2.total) || 0, temp.offset);
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
function Br(value, arg2) {
  value.addEventListener("scroll", () => {
    if (!(value.scrollHeight - value.scrollTop - value.clientHeight > 120)) {
      arg2().catch(onError);
    }
  });
}
async function Zu(query = "", {
  append = false
} = {}) {
  return Or({
    optionsElement: dr2,
    query,
    currentIcon: Number2()?.properties?.icon || "",
    append
  });
}
async function Qu(query = "", {
  append = false
} = {}) {
  return Or({
    optionsElement: Sa2,
    query,
    currentIcon: Number2()?.properties?.icon || "",
    append
  });
}
async function ep(query = "", {
  append = false
} = {}) {
  const component = Number2();
  return Or({
    optionsElement: Va2,
    query,
    currentIcon: component?.properties?.icon || "",
    clearLabel: component?.type === "device-button" ? "跟随实体图标" : "不使用图标",
    append
  });
}
async function tp(query = "", {
  append = false
} = {}) {
  return Or({
    optionsElement: Ta2,
    query,
    currentIcon: Number2()?.properties?.icon || "",
    append
  });
}
async function np(query = "", {
  append = false
} = {}) {
  const value = Number2()?.properties || {};
  const currentIcon = String(Object.hasOwn(value, "icon") ? value.icon || "" : "mdi:lightbulb-group-outline");
  return Or({
    optionsElement: Ba2,
    query,
    currentIcon,
    datasetKey: "lightStatisticsIconName",
    append
  });
}
Br(dr2, () => Zu(ur.value, {
  append: true
}));
Br(Sa2, () => Qu(xa.value, {
  append: true
}));
Br(Va2, () => ep(Wa.value, {
  append: true
}));
Br(Ta2, () => tp(Aa.value, {
  append: true
}));
Br(Ba2, () => np($a.value, {
  append: true
}));
function k0() {
  if (dr.hidden) {
    return;
  }
  const value = on.parentElement.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  dr.style.left = clampNumber(value.left, temp2, Math.max(temp2, window.innerWidth - value.width - temp2)) + "px";
  dr.style.top = flag ? value.bottom + temp + "px" : Math.max(temp2, value.top - count - temp) + "px";
  dr.style.width = value.width + "px";
  dr.style.maxHeight = count + "px";
  dr2.style.maxHeight = Math.max(90, count - 57) + "px";
}
function M0() {
  if (Sa.hidden) {
    return;
  }
  const value = Qt.parentElement.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  Sa.style.left = clampNumber(value.left, temp2, Math.max(temp2, window.innerWidth - value.width - temp2)) + "px";
  Sa.style.top = flag ? value.bottom + temp + "px" : Math.max(temp2, value.top - count - temp) + "px";
  Sa.style.width = value.width + "px";
  Sa.style.maxHeight = count + "px";
  Sa2.style.maxHeight = Math.max(90, count - 57) + "px";
}
function O0() {
  if (Va.hidden) {
    return;
  }
  const value = Lt.parentElement.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  Va.style.left = clampNumber(value.left, temp2, Math.max(temp2, window.innerWidth - value.width - temp2)) + "px";
  Va.style.top = flag ? value.bottom + temp + "px" : Math.max(temp2, value.top - count - temp) + "px";
  Va.style.width = value.width + "px";
  Va.style.maxHeight = count + "px";
  Va2.style.maxHeight = Math.max(90, count - 57) + "px";
}
function op() {
  if (Ta.hidden) {
    return;
  }
  const value = tn.parentElement.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  Ta.style.left = clampNumber(value.left, temp2, Math.max(temp2, window.innerWidth - value.width - temp2)) + "px";
  Ta.style.top = flag ? value.bottom + temp + "px" : Math.max(temp2, value.top - count - temp) + "px";
  Ta.style.width = value.width + "px";
  Ta.style.maxHeight = count + "px";
  Ta2.style.maxHeight = Math.max(90, count - 57) + "px";
}
function ip() {
  if (Ba.hidden) {
    return;
  }
  const value = nn.parentElement.getBoundingClientRect();
  const temp = 5;
  const temp2 = 8;
  const number = window.innerHeight - value.bottom - temp - temp2;
  const number2 = value.top - temp - temp2;
  const flag = number >= 250 || number >= number2;
  const count = Math.max(150, Math.min(390, flag ? number : number2));
  Ba.style.left = clampNumber(value.left, temp2, Math.max(temp2, window.innerWidth - value.width - temp2)) + "px";
  Ba.style.top = flag ? value.bottom + temp + "px" : Math.max(temp2, value.top - count - temp) + "px";
  Ba.style.width = value.width + "px";
  Ba.style.maxHeight = count + "px";
  Ba2.style.maxHeight = Math.max(90, count - 57) + "px";
}
function ap() {
  if (Ie2.hidden) {
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
  Ie2.style.left = clampNumber(value.left, temp2, Math.max(temp2, window.innerWidth - minValue - temp2)) + "px";
  Ie2.style.top = flag ? value.bottom + temp + "px" : Math.max(temp2, value.top - count - temp) + "px";
  Ie2.style.width = minValue + "px";
  Ie2.style.maxHeight = count + "px";
  ka.style.maxHeight = Math.max(90, count - 58) + "px";
}
function Un(componentType = "image") {
  if (componentType === "light-statistics") {
    return {
      componentType,
      button: dd,
      menu: Vs,
      search: _12,
      options: Y12,
      except: "light-statistics-action-entity",
      relatedSettings: false,
      recommended: recommended => TOGGLE_ENTITY_DOMAINS.has(fe(recommended)) ? 2 : 0
    };
  } else if (componentType === "navigation-button") {
    return {
      componentType,
      button: ou,
      menu: iu2,
      search: Zx,
      options: Qx,
      except: "navigation-entity",
      recommended: recommended => recommended?.virtual ? 3 : TOGGLE_ENTITY_DOMAINS.has(fe(recommended)) ? 2 : 0
    };
  } else if (componentType === "title-button") {
    return {
      componentType,
      button: ad,
      menu: Ms,
      search: R12,
      options: H12,
      except: "title-button-entity",
      recommended: recommended => recommended?.virtual ? 3 : TOGGLE_ENTITY_DOMAINS.has(fe(recommended)) ? 2 : 0
    };
  } else if (componentType === "vacuum-map") {
    return {
      componentType,
      button: Gd,
      menu: nc,
      search: Mx2,
      options: Ox2,
      except: "vacuum-map-entity",
      recommended: recommended => ["camera", "image"].includes(fe(recommended)) ? /(?:^|[_.\s-])map(?:$|[_.\s-])|地图/i.test((recommended.entityId || "") + " " + (recommended.name || "")) ? 2 : 1 : 0
    };
  } else if (componentType === "camera") {
    return {
      componentType,
      button: Yd,
      menu: ac,
      search: Bx2,
      options: $x,
      except: "camera-entity",
      recommended: recommended => fe(recommended) === "camera"
    };
  } else if (componentType === "air-conditioner") {
    return {
      componentType,
      button: Dd2,
      menu: Js,
      search: Ex2,
      options: Lx2,
      except: "air-conditioner-entity",
      recommended: recommended => fe(recommended) === "climate" ? 2 : fe(recommended) === "fan" ? 1 : 0
    };
  } else if (componentType === "device-button") {
    return {
      componentType,
      button: pi2,
      menu: mi,
      search: md,
      options: fd,
      except: "icon-button-entity",
      recommended: recommended => TOGGLE_ENTITY_DOMAINS.has(fe(recommended))
    };
  } else if (componentType === "presence-sensor") {
    return {
      componentType,
      button: pi2,
      menu: mi,
      search: md,
      options: fd,
      except: "icon-button-entity",
      recommended: recommended => {
        const recommended2 = (recommended.entityId || "") + " " + (recommended.name || "") + " " + (recommended.originalName || "") + " " + (recommended.translationKey || "");
        const recommended3 = Number2()?.properties?.sensorKind || "presence";
        const recommended4 = fe(recommended);
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
      button: pi2,
      menu: mi,
      search: md,
      options: fd,
      except: "icon-button-entity",
      recommended: recommended => fe(recommended) === "light"
    };
  } else if (componentType === "icon-button-effect") {
    return {
      componentType,
      button: Gl2,
      menu: Ts,
      search: T12,
      options: A12,
      except: "ibe-entity",
      recommended: recommended => fe(recommended) === "light"
    };
  } else if (componentType === "weather") {
    return {
      componentType,
      button: Jd,
      menu: Zd2,
      search: Hx,
      options: jx,
      except: "weather-entity",
      recommended: recommended => fe(recommended) === "weather"
    };
  } else if (componentType === "line-chart") {
    return {
      componentType,
      button: Qd,
      menu: eu2,
      search: Gx,
      options: Ux2,
      except: "line-chart-entity",
      recommended: recommended => fe(recommended) === "sensor"
    };
  } else {
    return {
      componentType: "image",
      button: oi,
      menu: aa2,
      search: ra,
      options: _m2,
      except: "entity",
      recommended: recommended => ["image", "camera"].includes(fe(recommended))
    };
  }
}
function $r(value = "", arg2 = "image") {
  const temp = Un(arg2);
  const flag = Number2()?.bindings?.entity?.entityId || "";
  const temp2 = value.trim().toLocaleLowerCase("zh-CN");
  const mapped = qn(arg2).map((entity, index) => ({
    entity,
    index
  })).filter(({
    entity: arg
  }) => !temp2 || (ct(arg) + " " + fe(arg)).toLocaleLowerCase("zh-CN").includes(temp2)).sort((arg, arg22) => {
    const callback = arg3 => arg3?.virtual ? 100 : Number(temp.recommended(arg3));
    return callback(arg22.entity) - callback(arg.entity) || arg.index - arg22.index;
  }).map(({
    entity: arg
  }) => arg);
  const element = document.createElement("button");
  element.type = "button";
  element.className = "inspector-entity-option inspector-entity-clear" + (flag ? "" : " selected");
  element.dataset.entityId = "";
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(!flag));
  element.textContent = "不使用实体";
  const mapped2 = mapped.map(arg => {
    const temp3 = document.createElement("button");
    temp3.type = "button";
    temp3.className = "inspector-entity-option" + (arg.entityId === flag ? " selected" : "");
    temp3.dataset.entityId = arg.entityId;
    temp3.setAttribute("role", "option");
    temp3.setAttribute("aria-selected", String(arg.entityId === flag));
    const temp4 = document.createElement("span");
    temp4.className = "inspector-entity-option-content";
    temp4.title = ct(arg);
    const temp5 = document.createElement("span");
    temp5.className = "inspector-entity-option-line inspector-entity-name-line";
    const element3 = document.createElement("span");
    element3.className = "inspector-entity-kind";
    element3.textContent = "[" + Hn(arg) + "] ";
    const element4 = document.createElement("span");
    element4.className = "inspector-entity-name";
    element4.textContent = Ot2(arg);
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
  temp.options.replaceChildren(element, ...mapped2, ...(element2.textContent ? [element2] : []));
  temp.options.scrollTop = 0;
}
function Bt(component) {
  const value = Un(component.type);
  const flag = component.bindings?.entity?.entityId || "";
  const found = qn(component.type).find(arg => arg.entityId === flag);
  const chosen = found ? ct(found) : flag || "不使用实体";
  let inspectorPickerValue = value.button.querySelector(".inspector-picker-value");
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
  aE(component, value.relatedSettings === false ? null : value.button.closest(".inspector-picker"));
}
let Vo2 = null;
let up = null;
let zc = null;
let sp = null;
let Wo2 = null;
let Di = null;
let Ze = null;
let cp = null;
let mn2 = null;
function Fr() {
  return new Map(le.map(value => [String(value.entityId || ""), value]).filter(([value]) => value));
}
function Dr() {
  return new Map(Ao2.map(value => [String(value.deviceId || ""), value]).filter(([value]) => value));
}
function lp() {
  const value = String(mn2?.value || "").trim().toLocaleLowerCase("zh-CN");
  let temp = 0;
  for (const temp2 of Wo2?.querySelectorAll("[data-related-entity-id]") || []) {
    const flag = !value || String(temp2.dataset.relatedEntitySearch || "").includes(value);
    temp2.hidden = !flag;
    if (flag) {
      temp += 1;
    }
  }
  const el2 = Wo2?.querySelector(".popup-related-entity-filter-empty");
  if (el2) {
    el2.hidden = temp > 0;
  }
}
function iE2() {
  if (Vo2) {
    return Vo2;
  }
  Vo2 = document.createElement("div");
  Vo2.id = "popup-related-entity-settings";
  Vo2.className = "popup-related-entity-settings";
  up = document.createElement("strong");
  zc = document.createElement("span");
  Di = document.createElement("button");
  Di.type = "button";
  Di.className = "popup-related-entity-open";
  const element = document.createElement("i");
  element.setAttribute("aria-hidden", "true");
  element.textContent = "›";
  Di.append(zc, element);
  sp = document.createElement("p");
  Vo2.append(up, Di, sp);
  Ze = document.createElement("dialog");
  Ze.id = "popup-related-entity-dialog";
  Ze.className = "popup-related-entity-dialog";
  const className6 = document.createElement("div");
  className6.className = "popup-related-entity-dialog-card";
  const className7 = document.createElement("div");
  className7.className = "popup-related-entity-dialog-heading";
  const temp2 = document.createElement("div");
  cp = document.createElement("strong");
  const element2 = document.createElement("span");
  element2.textContent = "选择要放进设备弹窗的功能";
  temp2.append(cp, element2);
  const type15 = document.createElement("button");
  type15.type = "button";
  type15.setAttribute("aria-label", "关闭关联功能选择");
  type15.textContent = "×";
  className7.append(temp2, type15);
  const temp3 = document.createElement("label");
  temp3.className = "popup-related-entity-dialog-search";
  mn2 = document.createElement("input");
  mn2.type = "search";
  mn2.name = "popup-related-entity-search";
  mn2.placeholder = "搜索功能名称或实体 ID";
  mn2.autocomplete = "off";
  temp3.append(mn2);
  Wo2 = document.createElement("div");
  Wo2.className = "popup-related-entity-list";
  const className8 = document.createElement("div");
  className8.className = "popup-related-entity-dialog-footer";
  const type16 = document.createElement("button");
  type16.type = "button";
  type16.textContent = "完成";
  className8.append(type16);
  className6.append(className7, temp3, Wo2, className8);
  Ze.append(className6);
  document.body.append(Ze);
  Di.addEventListener("click", () => {
    if (!Ze.open) {
      mn2.value = "";
      lp();
      Ze.showModal();
      window.requestAnimationFrame(() => mn2.focus({
        preventScroll: true
      }));
    }
  });
  mn2.addEventListener("input", lp);
  type15.addEventListener("click", () => Ze.close());
  type16.addEventListener("click", () => Ze.close());
  Ze.addEventListener("click", event2 => {
    if (event2.target === Ze) {
      Ze.close();
    }
  });
  Wo2.addEventListener("click", target => {
    const disabled = target.target.closest("[data-related-entity-id]");
    const value194 = componentId;
    if (!disabled || !value194 || disabled.disabled) {
      return;
    }
    const value195 = String(disabled.dataset.relatedEntityId || "");
    const value196 = Number2();
    const value197 = Fr();
    const value198 = Dr();
    if (!relatedPopupContext(value196, value197, value198)) {
      return;
    }
    const value199 = selectedRelatedEntityIds(value196);
    const has2 = new Set(value199 === null ? legacyRelatedEntityIds(value196, value197, value198) : value199);
    const value200 = relatedPopupContext(value196, value197, value198);
    const value201 = relatedPopupSelectionLimit(value200);
    if (has2.has(value195)) {
      has2.delete(value195);
    } else if (!value201 || has2.size < value201) {
      has2.add(value195);
    } else {
      return;
    }
    L(arg21 => {
      const properties11 = findComponent(arg21, value194)?.component;
      if (properties11) {
        properties11.properties = {
          ...(properties11.properties || {}),
          relatedEntities: manualRelatedEntityConfig([...has2])
        };
      }
    });
  });
  return Vo2;
}
function aE(value, arg2) {
  const temp = iE2();
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
  const allowed = new Set(flag ? legacyRelatedEntityIds(value, temp2, temp3) : temp5);
  const temp6 = relatedPopupSelectionLimit(temp4);
  const flag2 = temp6 > 0 && allowed.size >= temp6;
  const temp7 = relatedPopupCandidates(value, temp2, temp3);
  const allowed2 = new Set(temp7.map(arg => arg.entityId));
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
  up.textContent = temp4.deviceLabel + "弹窗功能";
  zc.textContent = flag ? "自动适配" : "已选 " + allowed.size + (temp6 ? " / " + temp6 : "") + " 项";
  zc.classList.toggle("is-automatic", flag);
  sp.textContent = flag ? "当前沿用原来的自动适配，点击可改为手动选择。" : "只显示已勾选的关联功能" + (temp6 ? "，最多 " + temp6 + " 项" : "") + "。";
  cp.textContent = temp4.deviceLabel + "弹窗功能 · " + (flag ? "自动适配" : "已选 " + allowed.size + (temp6 ? " / " + temp6 : "") + " 项");
  const mapped = temp7.map(metadata => {
    const temp8 = allowed.has(metadata.entityId);
    const temp9 = relatedEntityIsAvailable(metadata);
    const temp10 = document.createElement("button");
    temp10.type = "button";
    const flag3 = flag2 && !temp8;
    temp10.className = "popup-related-entity-option" + (temp8 ? " selected" : "") + (temp9 ? "" : " unavailable") + (flag3 ? " limit-reached" : "");
    temp10.dataset.relatedEntityId = metadata.entityId;
    temp10.setAttribute("aria-pressed", String(temp8));
    temp10.disabled = !temp9 && !temp8 || flag3;
    const temp11 = document.createElement("i");
    temp11.setAttribute("aria-hidden", "true");
    const temp12 = document.createElement("span");
    const element = document.createElement("strong");
    const temp13 = relatedEntityLabel(temp4, metadata);
    element.textContent = Ot2(metadata, temp13);
    const element2 = document.createElement("small");
    const list = [RELATED_ENTITY_DOMAIN_LABELS[String(metadata.domain || metadata.entityId || "").split(".", 1)[0]] || "实体", metadata.entityId];
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
    temp10.dataset.relatedEntitySearch = (element.textContent + " " + (metadata.name || "") + " " + (metadata.originalName || "") + " " + element2.textContent).toLocaleLowerCase("zh-CN");
    Gn(temp10, element);
    temp12.append(element, element2);
    temp10.append(temp11, temp12);
    return temp10;
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
  Wo2.replaceChildren(...mapped);
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
  temp.menu.style.left = clampNumber(left, temp3, Math.max(temp3, window.innerWidth - minValue - temp3)) + "px";
  temp.menu.style.width = minValue + "px";
  temp.menu.style.maxHeight = count + "px";
  temp.options.style.maxHeight = Math.max(90, count - 58) + "px";
  temp.menu.style.top = flag ? rect.bottom + temp2 + "px" : Math.max(temp3, rect.top - count - temp2) + "px";
}
function dp() {
  yt("image");
}
function up2(value) {
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
  const temp2 = (temp.startsWith("v1/2D/") || temp.startsWith("v1/3D/") ? temp.replace(/^v1\//, "v1/户型图示例/") : temp).split("/").filter(Boolean).map(arg => encodeURIComponent(arg)).join("/");
  if (!temp2) {
    return "";
  }
  const text2 = String(value?.version || "");
  return "/assets/builtin/" + temp2 + (text2 ? "?v=" + encodeURIComponent(text2) : "");
}
function pp(value) {
  const url = value?.effectVariant?.url;
  if (typeof url == "string" && url.startsWith("/api/v1/assets/effect-variant?")) {
    return url;
  } else {
    return up2(value);
  }
}
const {
  createIconPickerClearOption: hE,
  createIconPickerOption: yp,
  createEditorPickerCurrentIcon: D0,
  createEditorEntityPickerOption: _n,
  editorPickerClearOption: XI,
  editorPickerClearAction: Wi,
  editorPickerEntityAction: KI,
  createEditorPickerCurrentEntity: mp,
  createEditorPickerCurrentAsset: bE
} = value386({
  entityKindLabel: Hn,
  entityPickerPrimaryName: Ot2,
  entityPickerText: ct,
  enableEntityTextHoverScroll: Gn,
  assetDisplayName: z0,
  assetPreviewUrl: pp,
  bindEditorIconNameTooltip: oE,
  mdiIconUrl: Fi2
});
const {
  editorEntityMatches: readEntityId,
  editorPickerComponentTypeLabel: yE
} = value387({
  entityPickerConfig: Un,
  pickerEntitiesForComponentType: qn,
  entityPickerText: ct,
  entityDomain: fe
});
const i3dEditorPickers = value388({
  getState: arg82 => Sv2?.states?.get(arg82),
  openPicker: getSource => qi(getSource),
  fetchIcons: (setSource, setSource2, arg83) => Z("/icons?query=" + encodeURIComponent(setSource) + "&limit=" + setSource2 + "&offset=" + arg83),
  getEntities: () => le,
  ensureEntities: () => Tu3 ? Promise.resolve() : Po2 || jc(),
  entityPickerText: ct,
  elements: {
    createEditorPickerCurrentIcon: D0,
    createIconPickerOption: yp,
    createEditorPickerCurrentEntity: mp,
    createEditorEntityPickerOption: _n,
    editorPickerClearAction: Wi
  }
});
const OE2 = createEditorAssetMatcher({
  getImageSource: () => Vt3,
  getImageFolder: () => Vt2,
  getIbeSource: () => Wt3,
  getIbeFolder: () => Wt2,
  getUserAssets: () => ht2,
  getBuiltinAssets: () => Ev2
});
const lw2 = createEditorAssetToolbar({
  documentObject: document,
  getSource: arg84 => arg84 === "image" ? Vt3 : Wt3,
  setSource: (arg85, arg86) => {
    if (arg85 === "image") {
      Vt3 = arg86;
    } else {
      Wt3 = arg86;
    }
  },
  getFolder: arg87 => arg87 === "image" ? Vt2 : Wt2,
  setFolder: (arg88, arg89) => {
    if (arg88 === "image") {
      Vt2 = arg89;
    } else {
      Wt2 = arg89;
    }
  },
  getAssets: arg90 => arg90 === "user" ? ht2 : Ev2,
  getUploadInput: arg91 => arg91 === "image" ? la : Lo2,
  canDeleteFolder: (arg92, arg93) => fp(arg92, arg93),
  onDeleteFolder: (arg94, arg95) => eC(arg94, arg95)
});
function Vc(value, arg2) {
  return value?.assetId === arg2 || (value?.legacyAssetIds || []).includes(arg2);
}
function D02() {
  return [...Ev2, ...ht2];
}
function findCustomPopup2(value) {
  return D02().find(arg => Vc(arg, value));
}
function z0(value) {
  return String(value?.name || value?.relativePath || value?.assetId || "").replace(/\.(?:png|jpe?g|webp|gif|svg)$/i, "");
}
function uE2(value) {
  return ht2.filter(arg => arg.folder === value && arg.source === "studio3d-export");
}
function fp(value, arg2) {
  if (value !== "user" || !arg2) {
    return false;
  }
  const filtered = ht2.filter(arg => arg.folder === arg2);
  return filtered.length > 0 && filtered.every(arg => arg.source === "studio3d-export");
}
function Ro2(value) {
  const flag = value === "image";
  const chosen = flag ? Vt3 : Wt3;
  const chosen2 = flag ? Re : He;
  const chosen3 = flag ? zt2 : en2;
  const chosen4 = flag ? I1 : q1;
  const chosen5 = flag ? "[data-image-asset-source]" : "[data-ibe-asset-source]";
  for (const element of chosen2.querySelectorAll(chosen5)) {
    element.classList.toggle("active", element.dataset[flag ? "imageAssetSource" : "ibeAssetSource"] === chosen);
  }
  const temp = Vn.get(chosen3);
  if (temp) {
    const chosen6 = chosen === "user" ? ht2 : Ev2;
    temp.wrapper.hidden = !chosen6.some(arg => arg.folder);
    if (temp.wrapper.hidden) {
      Ht2(temp);
    }
  }
  chosen4.hidden = chosen !== "user";
}
function Yn(value) {
  const flag = value === "image";
  const chosen = flag ? Vt3 : Wt3;
  const element = flag ? zt2 : en2;
  const chosen2 = chosen === "user" ? ht2 : Ev2;
  const idSet = [...new Set(chosen2.map(arg => arg.folder).filter(Boolean))].sort((arg, arg2) => arg.localeCompare(arg2, "zh-CN"));
  const chosen3 = flag ? Vt2 : Wt2;
  const chosen4 = idSet.includes(chosen3) ? chosen3 : idSet[0] || "";
  if (flag) {
    Vt2 = chosen4;
  } else {
    Wt2 = chosen4;
  }
  element.replaceChildren(...idSet.map(arg => new Option(arg === "." ? "根目录" : arg, arg)));
  element.value = chosen4;
  oe(element);
  Ro2(value);
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
      temp.addEventListener("load", () => {
        value.width = temp.naturalWidth;
        value.height = temp.naturalHeight;
        arg({
          width: value.width,
          height: value.height
        });
      }, {
        once: true
      });
      temp.addEventListener("error", () => arg2(new Error("无法读取图片尺寸：" + (value?.name || ""))), {
        once: true
      });
      temp.src = up2(value);
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
    assetId,
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
      width,
      height
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
  if (!Pu2.has(number)) {
    Pu2.add(number);
    gp(arg2).then(arg => {
      const component = findComponent(h?.document, value.id)?.component;
      if (!!component && component.properties?.assetId === arg2.assetId && (component.properties?.layoutMode !== "fill" && (Number(component.position?.width) !== arg.width || Number(component.position?.height) !== arg.height) || Number(component.properties?.naturalWidth) !== arg.width || Number(component.properties?.naturalHeight) !== arg.height)) {
        L(arg3 => {
          const component2 = findComponent(arg3, value.id)?.component;
          if (!!component2 && component2.properties?.assetId === arg2.assetId) {
            V0(component2, arg2.assetId, arg);
          }
        });
      }
    }).catch(onError).finally(() => Pu2.delete(number));
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
  Re.style.left = clampNumber(value.left, temp2, Math.max(temp2, window.innerWidth - value.width - temp2)) + "px";
  Re.style.width = value.width + "px";
  Re.style.maxHeight = count + "px";
  zt3.style.maxHeight = Math.max(80, count - 150) + "px";
  Re.style.top = flag ? value.bottom + temp + "px" : Math.max(temp2, value.top - count - temp) + "px";
}
function W0(element, element2 = Re) {
  if (y12.hidden || !element?.isConnected) {
    return;
  }
  const value = element.getBoundingClientRect();
  const rect = element2.getBoundingClientRect();
  const rect2 = y12.getBoundingClientRect();
  const temp = 18;
  const chosen = rect.left < window.innerWidth / 2 ? rect.right + temp : rect.left - rect2.width - temp;
  y12.style.left = clampNumber(chosen, 12, Math.max(12, window.innerWidth - rect2.width - 12)) + "px";
  y12.style.top = clampNumber(value.top, 12, Math.max(12, window.innerHeight - rect2.height - 12)) + "px";
}
function Cp(value, arg2, el2 = Re) {
  if (!!value && !!arg2) {
    clearTimeout(Sc);
    Sc = window.setTimeout(() => {
      const temp = pp(value);
      if (!!temp && !el2.hidden && !!arg2.isConnected) {
        Bl2.onload = () => W0(arg2, el2);
        Bl2.src = temp;
        T1.textContent = value.name || value.relativePath;
        y12.hidden = false;
        window.requestAnimationFrame(() => W0(arg2, el2));
      }
    }, 300);
  }
}
function Qe() {
  clearTimeout(Sc);
  Sc = null;
  y12.hidden = true;
  Bl2.onload = null;
}
function bp(value, arg2) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = "inspector-asset-option" + (Vc(value, arg2) ? " selected" : "");
  element.dataset.assetId = value.assetId;
  element.title = value.name;
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(Vc(value, arg2)));
  const temp = document.createElement("img");
  temp.src = pp(value);
  temp.alt = value.name;
  temp.loading = "lazy";
  temp.addEventListener("error", () => element.classList.add("image-load-error"));
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
  const flag = Number2()?.properties?.assetId || "";
  const temp = value.trim().toLocaleLowerCase("zh-CN");
  const filtered = (Vt3 === "user" ? ht2 : Ev2).filter(arg => {
    const flag2 = !temp || (arg.name + " " + arg.relativePath).toLocaleLowerCase("zh-CN").includes(temp);
    const flag3 = !!temp || arg.folder === Vt2;
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
    zt3.replaceChildren(element, element2);
    return;
  }
  zt3.replaceChildren(element, ...filtered.map(arg => bp(arg, flag)));
}
function fE(component) {
  const value = component.properties?.assetId || "";
  const temp = findCustomPopup2(value);
  Vt3 = ["user", "studio3d-export"].includes(temp?.source) || ht2.length && !temp ? "user" : "builtin";
  Vt2 = temp?.folder || "" || Vt2;
  Yn("image");
  Ro2("image");
  Cn.textContent = temp?.name || value || "不使用图片";
  Sn.value = "";
  zt3.replaceChildren();
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
  He.style.left = clampNumber(value.left, temp2, Math.max(temp2, window.innerWidth - value.width - temp2)) + "px";
  He.style.width = value.width + "px";
  He.style.maxHeight = count + "px";
  en.style.maxHeight = Math.max(80, count - 150) + "px";
  He.style.top = flag ? value.bottom + temp + "px" : Math.max(temp2, value.top - count - temp) + "px";
}
function Hr(value = "") {
  Qe();
  const flag = Number2()?.properties?.effectAssetId || "";
  const temp = value.trim().toLocaleLowerCase("zh-CN");
  const filtered = (Wt3 === "user" ? ht2 : Ev2).filter(arg => (!temp || (arg.name + " " + arg.relativePath).toLocaleLowerCase("zh-CN").includes(temp)) && (!!temp || arg.folder === Wt2));
  const element = document.createElement("button");
  element.type = "button";
  element.className = "inspector-asset-clear" + (flag ? "" : " selected");
  element.dataset.assetId = "";
  element.setAttribute("role", "option");
  element.setAttribute("aria-selected", String(!flag));
  element.textContent = "不使用图片";
  const mapped = filtered.map(arg => bp(arg, flag));
  const element2 = document.createElement("div");
  element2.className = "inspector-picker-empty";
  if (!mapped.length) {
    element2.textContent = "没有匹配的图片";
  }
  en.replaceChildren(element, ...mapped, ...(element2.textContent ? [element2] : []));
}
function gE(component) {
  const value = component.properties?.effectAssetId || "";
  const temp = findCustomPopup2(value);
  Wt3 = ["user", "studio3d-export"].includes(temp?.source) || ht2.length && !temp ? "user" : "builtin";
  Wt2 = temp?.folder || Wt2;
  Yn("ibe");
  Ro2("ibe");
  En.textContent = temp?.name || value || "不使用图片";
  Ln.value = "";
  en.replaceChildren();
}
function R0(value) {
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
function H0() {
  for (const element of document.querySelectorAll("[data-action-type=\"more-info\"]")) {
    element.textContent = "打开弹窗";
  }
  for (const value of document.querySelectorAll(".component-action-control[data-action-trigger]")) {
    R0(value);
    if (value.querySelector(".component-popup-config")) {
      continue;
    }
    const element = document.createElement("div");
    element.className = "component-popup-config";
    element.hidden = true;
    element.innerHTML = "\n      <label class=\"component-popup-config-row\"><span>弹窗来源</span><select data-popup-source><option value=\"current\">当前实体</option><option value=\"entity\">其它实体</option><option value=\"custom\">组合弹窗</option></select></label>\n      <div class=\"component-popup-config-row\" data-popup-entity-row><span>选择实体</span><div class=\"component-popup-entity-picker\"><button class=\"inspector-picker-button\" type=\"button\" data-popup-entity-button aria-haspopup=\"listbox\" aria-expanded=\"false\">选择实体</button><div class=\"inspector-picker-menu component-popup-entity-menu\" data-popup-entity-menu hidden><input type=\"search\" data-popup-entity-search placeholder=\"搜索实体名称或 ID\" autocomplete=\"off\"><div class=\"inspector-entity-options\" data-popup-entity-options role=\"listbox\"></div></div><input type=\"hidden\" data-popup-entity></div></div>\n      <label class=\"component-popup-config-row\" data-popup-custom-row><span>选择弹窗</span><select data-popup-custom></select></label>\n      <button class=\"component-popup-preview\" type=\"button\" data-popup-preview>预览弹窗</button>";
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
      ancestorEl?.querySelector("[data-popup-entity-button]")?.setAttribute("aria-expanded", "false");
    }
  }
}
function yp2(value) {
  const el2 = value?.querySelector("[data-popup-entity]")?.value || "";
  const found = le.find(arg => arg.entityId === el2);
  const el3 = value?.querySelector("[data-popup-entity-button]");
  if (!el3) {
    return;
  }
  const chosen = found ? "[" + Hn(found) + "] " + Ot2(found) : el2 || "选择实体";
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
  const temp = String(arg2 || "").trim().toLocaleLowerCase("zh-CN");
  const filtered = le.filter(arg => !temp || (ct(arg) + " " + arg.entityId).toLocaleLowerCase("zh-CN").includes(temp));
  el2.replaceChildren(...filtered.map(arg => {
    const temp2 = document.createElement("button");
    temp2.type = "button";
    temp2.className = "inspector-entity-option" + (arg.entityId === el3 ? " selected" : "");
    temp2.dataset.popupActionEntityId = arg.entityId;
    temp2.setAttribute("role", "option");
    temp2.setAttribute("aria-selected", String(arg.entityId === el3));
    const temp3 = document.createElement("span");
    temp3.className = "inspector-entity-option-content";
    const element = document.createElement("span");
    element.className = "inspector-entity-option-line inspector-entity-name-line";
    element.textContent = "[" + Hn(arg) + "] " + Ot2(arg);
    const element2 = document.createElement("span");
    element2.className = "inspector-entity-option-line inspector-entity-id";
    element2.textContent = arg.entityId;
    temp3.append(element, element2);
    Gn(temp2, element);
    temp2.append(temp3);
    return temp2;
  }));
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
  const chosen = number + minValue3 <= window.innerHeight - 8 ? number : Math.max(8, rect.top - minValue3 - 5);
  el2.style.left = clamped + "px";
  el2.style.top = chosen + "px";
}
function fn(component, value) {
  H0();
  const flag = component.bindings?.entity?.entityId || "";
  const flag2 = component.type === "light-statistics";
  if (flag2) {
    ax.textContent = flag ? "切换和“当前实体”弹窗作用于绑定实体；其它实体弹窗、组合弹窗和跳转页面无需绑定动作实体。" : "未绑定动作实体时仍可使用其它实体弹窗、组合弹窗和跳转页面。";
    value.setAttribute("aria-disabled", "false");
  }
  const flag3 = h.document.pages || [];
  const pagePaths = new Set(flag3.map(arg => arg.path));
  const popupIds = new Set((h.document.customPopups || []).map(component2 => component2.id));
  const element = value.querySelector("[data-hidden-content-clickable-control]");
  if (element) {
    const includesValue = ["title-button", "device-button", "icon-button-effect"].includes(component.type);
    element.hidden = !includesValue;
    for (const element2 of element.querySelectorAll("[data-hidden-content-clickable]")) {
      const flag4 = element2.dataset.hiddenContentClickable === (component.properties?.hiddenContentClickable === true ? "on" : "off");
      element2.classList.toggle("active", flag4);
      element2.setAttribute("aria-pressed", String(flag4));
    }
  }
  for (const temp of value.querySelectorAll("[data-action-trigger]")) {
    const actionTrigger = temp.dataset.actionTrigger;
    const temp2 = component.actions?.[actionTrigger];
    const chosen = componentActionIsSupported(component, temp2, {
      pagePaths,
      popupIds
    }) ? temp2.type : "none";
    for (const element13 of temp.querySelectorAll("[data-action-type]")) {
      const flag5 = element13.dataset.actionType === chosen;
      element13.classList.toggle("active", flag5);
      element13.setAttribute("aria-pressed", String(flag5));
      element13.disabled = element13.dataset.actionType === "toggle" && (!flag || !entityIdSupportsToggle(flag)) || flag2 && !["none", "toggle", "more-info", "navigate"].includes(element13.dataset.actionType);
    }
    const componentActionTarget = temp.querySelector(".component-action-target");
    const element3 = temp.querySelector("[data-action-target]");
    const target = component.actions?.[actionTrigger]?.target;
    element3.replaceChildren(...flag3.map(arg => new Option(arg.name, arg.path)));
    element3.value = pagePaths.has(target) ? target : R.value || flag3[0]?.path || "";
    oe(element3);
    componentActionTarget.hidden = chosen !== "navigate";
    const componentPopupConfig = temp.querySelector(".component-popup-config");
    const element5 = temp.querySelector("[data-popup-source]");
    const element6 = temp.querySelector("[data-popup-entity]");
    const element7 = temp.querySelector("[data-popup-custom]");
    const element8 = temp.querySelector("[data-popup-entity-row]");
    const element9 = temp.querySelector("[data-popup-custom-row]");
    const element10 = temp.querySelector("[data-popup-preview]");
    const temp3 = actionPopupData(component.actions?.[actionTrigger]);
    element5.value = temp3.source;
    const element11 = element5.querySelector("option[value=\"current\"]");
    if (element11) {
      element11.disabled = !flag;
    }
    element6.value = temp3.entityId || le[0]?.entityId || "";
    const flag4 = h.document.customPopups || [];
    element7.replaceChildren(...flag4.map(component2 => new Option(component2.name, component2.id)));
    element7.value = flag4.some(component2 => component2.id === temp3.popupId) ? temp3.popupId : flag4[0]?.id || "";
    oe(element5);
    oe(element7);
    yp2(temp);
    const element12 = temp.querySelector("[data-popup-entity-menu]");
    if (element12 && !element12.hidden) {
      Rc(temp, temp.querySelector("[data-popup-entity-search]")?.value || "");
      window.requestAnimationFrame(() => Hc(temp));
    }
    componentPopupConfig.hidden = chosen !== "more-info";
    element8.hidden = temp3.source !== "entity";
    element9.hidden = temp3.source !== "custom";
    element10.disabled = temp3.source === "current" ? !flag : temp3.source === "entity" ? !element6.value : !element7.value;
  }
}
function j0(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(component, value, timeComponentDimensions);
}
function hE2(component) {
  const value = component.properties || {};
  const {
    left: temp,
    top: temp2,
    scale: temp3,
    rotation: temp4
  } = inspectorComponentMetrics(component, h.document);
  Xx.value = "时间";
  kb.value = value.label || "";
  for (const element of Lb2.querySelectorAll("[data-time-hour-format]")) {
    element.classList.toggle("active", element.dataset.timeHourFormat === (value.hour12 === true ? "12" : "24"));
  }
  for (const element of Ib2.querySelectorAll("[data-time-seconds]")) {
    element.classList.toggle("active", element.dataset.timeSeconds === (value.showSeconds === true ? "on" : "off"));
  }
  Bb.value = value.color || "#248eb2";
  $b.value = roundField(clampNumber(Number(value.fontSize ?? 96), 12, 500));
  Fb.value = roundField(normalizedFontWeight(value.fontWeight));
  Db.value = roundField(clampNumber(Number(value.letterSpacing ?? 2.2), -20, 100));
  zb.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
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
function bE2(component) {
  const value = component.properties || {};
  const {
    left: temp,
    top: temp2,
    scale: temp3,
    rotation: temp4
  } = inspectorComponentMetrics(component, h.document);
  Kx.value = "日期";
  Vb.value = value.label || "";
  for (const element of Bb2.querySelectorAll("[data-date-weekday]")) {
    element.classList.toggle("active", element.dataset.dateWeekday === (value.showWeekday === false ? "off" : "on"));
  }
  for (const element of $b2.querySelectorAll("[data-date-lunar]")) {
    element.classList.toggle("active", element.dataset.dateLunar === (value.showLunar === true ? "on" : "off"));
  }
  Hb.value = value.primaryColor || "#8d9296";
  jb.value = roundField(clampNumber(Number(value.primarySize ?? 36), 12, 500));
  qb.value = roundField(normalizedFontWeight(value.primaryWeight));
  Gb.value = roundField(clampNumber(Number(value.primarySpacing ?? 1), -20, 100));
  Ub.value = value.lunarColor || "#7f878c";
  _b.value = roundField(clampNumber(Number(value.lunarSize ?? 24), 10, 500));
  Yb.value = roundField(normalizedFontWeight(value.lunarWeight));
  Xb.value = roundField(clampNumber(Number(value.lunarSpacing ?? 1), -20, 100));
  Kb.value = roundField(clampNumber(Number(value.lineGap ?? 8), 0, 200));
  Jb.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  Ja.value = temp;
  Za.value = temp2;
  vo.value = temp3;
  hi2.value = temp4;
  vo.disabled = false;
  hi2.disabled = false;
}
function G0(component, value = component?.properties || {}) {
  fitInspectorComponentToDimensions(component, value, weatherComponentDimensions);
}
function yE2(component) {
  const value = component.properties || {};
  const {
    left: temp,
    top: temp2,
    scale: temp3,
    rotation: temp4
  } = inspectorComponentMetrics(component, h.document);
  Bt(component);
  Jx.value = "天气";
  Zb.value = value.label || "";
  const list = [[_b2, "weatherIconVisible", value.iconVisible !== false], [Yb2, "weatherTemperatureVisible", value.temperatureVisible !== false], [Xb2, "weatherConditionVisible", value.conditionVisible !== false], [Kb2, "weatherHumidityVisible", value.humidityVisible !== false]];
  for (const [temp5, temp6, temp7] of list) {
    for (const element of temp5.querySelectorAll("[data-" + temp6.replace(/[A-Z]/g, arg => "-" + arg.toLowerCase()) + "]")) {
      const temp8 = element.dataset[temp6];
      element.classList.toggle("active", temp8 === (temp7 ? "on" : "off"));
      element.setAttribute("aria-pressed", String(temp8 === (temp7 ? "on" : "off")));
    }
  }
  oy.value = roundField(clampNumber(Number(value.iconSize ?? 64), 12, 500));
  iy.value = roundField(clampNumber(Number(value.iconGap ?? 22), 0, 300));
  ay.value = value.temperatureColor || "#aeb3b7";
  ry.value = roundField(clampNumber(Number(value.temperatureSize ?? 32), 12, 500));
  sy.value = roundField(normalizedFontWeight(value.temperatureWeight));
  cy.value = roundField(clampNumber(Number(value.temperatureSpacing ?? 1), -20, 100));
  ly.value = value.secondaryColor || "#8d9296";
  dy.value = roundField(clampNumber(Number(value.secondarySize ?? 18), 10, 500));
  uy.value = roundField(normalizedFontWeight(value.secondaryWeight));
  py.value = roundField(clampNumber(Number(value.secondarySpacing ?? 1), -20, 100));
  my.value = roundField(clampNumber(Number(value.lineGap ?? 7), 0, 200));
  fy.value = roundField(clampNumber(Number(value.opacity ?? 1) * 100, 0, 100));
  er.value = temp;
  or.value = temp2;
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
  eN.value = "折线图";
  gy.value = value.label || "";
  for (const element of hy.querySelectorAll("[data-line-chart-value-visible]")) {
    const flag3 = element.dataset.lineChartValueVisible === (value.valueVisible === false ? "off" : "on");
    element.classList.toggle("active", flag3);
    element.setAttribute("aria-pressed", String(flag3));
  }
  by.value = roundField(clampNumber(Number(value.valueScale ?? 100), 10, 500));
  yy.value = value.valueColor || "#dce1e5";
  vy.value = ["0", "1", "2", "3", "4"].includes(String(value.statePrecision)) ? String(value.statePrecision) : "auto";
  wy.value = roundField(clampNumber(Number(value.valueOffsetX ?? 0), -100, 100));
  Cy.value = roundField(clampNumber(Number(value.valueOffsetY ?? 0), -100, 100));
  Sy.value = roundField(clampNumber(Number(value.updateInterval ?? 600), 30, 86400));
  xy.value = roundField(clampNumber(Number(value.hours ?? 24), 1, 168));
  Ny.value = roundField(clampNumber(Number(value.cornerRadius ?? 10), 0, 50));
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
  iu.value = chosen;
  const chosen2 = flag2 ? value.thresholds : list;
  wi.forEach((element, arg2) => {
    element.value.value = roundField(Number(chosen2[arg2]?.value ?? list[arg2].value));
    element.color.value = chosen2[arg2]?.color || list[arg2].color;
    element.value.disabled = chosen === "auto";
    element.color.disabled = chosen === "auto";
  });
  or2.value = roundField(clampNumber((Number(flag.x || 0) + numeric3 / 2) / numeric * 100, 0, 100));
  ir2.value = roundField(clampNumber((Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100, 0, 100));
  vi.value = roundField(clampNumber(numeric3 / numeric * 100, 0.1, 100));
  wi2.value = roundField(clampNumber(numeric4 / numeric2 * 100, 0.1, 100));
  Co.value = roundField(clampNumber(Number(component.style?.scale || 1) * 100, 1, 500));
  Ci.value = roundField(clampNumber(Number(flag.rotation || 0), -360, 360));
  const isMultiSelect = selectedComponentIds.size > 1;
  vi.disabled = isMultiSelect;
  wi2.disabled = isMultiSelect;
  Co.disabled = false;
  Ci.disabled = false;
  const length = Rn(h.document.sharedComponents, "line-chart").length;
  const length2 = Ow3(component).length;
  dc.disabled = length < 2 || !length2;
  iN.textContent = length2 + " 项修改";
  dc.textContent = "一键应用到同类型控件";
  fn(component, oN);
}
function wE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  aN.value = "底图框";
  Ey.value = value.label || "";
  setInspectorToggle(wy2, value.mainTextVisible !== false);
  Iy.value = value.mainText || "";
  Ty.value = value.mainColor || "#ffffff";
  Ay.value = roundField(clampNumber(Number(value.mainSize ?? 30), 8, 500));
  Py.value = roundField(clampNumber(Number(value.mainWeight ?? 0), 0, 3));
  ky.value = roundField(clampNumber(Number(value.mainOpacity ?? 0.72) * 100, 0, 100));
  My.value = roundField(clampNumber(Number(value.mainSpacing ?? 2), -20, 100));
  const numeric5 = Number(value.textLeft ?? 5.2);
  const numeric6 = Number(value.textTop ?? 28);
  Oy.value = roundField(clampNumber(Number(value.mainTextLeft ?? numeric5), -100, 200));
  By.value = roundField(clampNumber(Number(value.mainTextTop ?? numeric6 - Number(value.lineGap ?? 24) / numeric4 * 100), -100, 200));
  setInspectorToggle(Ay2, value.secondaryTextVisible !== false);
  Fy.value = value.secondaryText || "";
  Dy.value = value.secondaryColor || "#ffffff";
  zy.value = roundField(clampNumber(Number(value.secondarySize ?? 15), 6, 500));
  Vy.value = roundField(clampNumber(Number(value.secondaryWeight ?? 0), 0, 3));
  Wy.value = roundField(clampNumber(Number(value.secondaryOpacity ?? 0.36) * 100, 0, 100));
  Ry.value = roundField(clampNumber(Number(value.secondarySpacing ?? 2.1), -20, 100));
  Hy.value = roundField(clampNumber(Number(value.secondaryTextLeft ?? numeric5), -100, 200));
  jy.value = roundField(clampNumber(Number(value.secondaryTextTop ?? numeric6), -100, 200));
  setInspectorToggle(zy2, value.edgeVisible !== false);
  Gy.value = value.edgeColor || "#d4d4d4";
  Uy.value = roundField(clampNumber(Number(value.edgeWidth ?? 0.9), 0, 20));
  _y.value = roundField(clampNumber(Number(value.edgeOpacity ?? 1) * 100, 0, 100));
  Yy.value = roundField(clampNumber(Number(value.radius ?? 0.195) * 100, 0, 50));
  Xy.value = roundField(clampNumber(Number(value.edgeAngle ?? 45), 0, 360));
  setInspectorToggle(qy, value.glowVisible !== false);
  Jy.value = value.glowColor || "#ffffff";
  Zy.value = roundField(clampNumber(Number(value.glowStrength ?? 0.5) * 100, 0, 500));
  Qy.value = roundField(clampNumber(Number(value.glowSize ?? 1.5) * 100, 0, 300));
  ev.value = roundField(clampNumber(Number(value.glowAngle ?? 242), 0, 360));
  rr.value = roundField(clampNumber((Number(flag.x || 0) + numeric3 / 2) / numeric * 100, 0, 100));
  sr2.value = roundField(clampNumber((Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100, 0, 100));
  Si.value = roundField(clampNumber(numeric3 / numeric * 100, 0.1, 100));
  xi.value = roundField(clampNumber(numeric4 / numeric2 * 100, 0.1, 100));
  So.value = roundField(clampNumber(Number(component.style?.scale || 1) * 100, 1, 500));
  Ni.value = roundField(clampNumber(Number(flag.rotation || 0), -360, 360));
  const isMultiSelect = selectedComponentIds.size > 1;
  Si.disabled = isMultiSelect;
  xi.disabled = isMultiSelect;
  So.disabled = false;
  Ni.disabled = false;
  const chosen = findComponent(h.document, component.id)?.scope === "page" ? st("panel-frame").length : Rn(h.document.sharedComponents, "panel-frame").length;
  const length = Gw2(component).length;
  uc.disabled = chosen < 2 || !length;
  rN.textContent = length + " 项修改";
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
  sN.value = "导航按钮";
  gc.value = value.label || "";
  Bt(component);
  const flag3 = Pi.get(component.id) || "auto";
  for (const element of au.querySelectorAll("[data-navigation-preview]")) {
    element.classList.toggle("active", element.dataset.navigationPreview === flag3);
  }
  cu.value = value.mainText || "页面导航";
  lu.value = value.secondaryText || "NAVIGATION";
  setInspectorToggle(tv, value.mainTextVisible !== false);
  setInspectorToggle(nv, value.secondaryTextVisible !== false);
  setInspectorToggle(ov, value.iconVisible !== false);
  setInspectorToggle(iv, value.frameVisible !== false);
  setInspectorToggle(av, value.glowVisible !== false);
  XN(value.icon || "");
  rv.value = value.mainColor || "#e9edf0";
  sv.value = value.secondaryColor || "#e9edf0";
  cv.value = roundField(Number(value.mainSize ?? 30));
  lv.value = roundField(Number(value.secondarySize ?? 11));
  dv.value = roundField(Number(value.mainWeight ?? 0));
  uv.value = roundField(Number(value.secondaryWeight ?? 0));
  pv.value = roundField(Number(value.mainSpacing ?? 8));
  mv.value = roundField(Number(value.secondarySpacing ?? 3));
  const numeric5 = Number(value.textLeft ?? 27.5);
  const numeric6 = Number(value.textTop ?? 81.5);
  fv.value = roundField(Number(value.mainTextLeft ?? numeric5));
  gv.value = roundField(Number(value.mainTextTop ?? numeric6 - 1800 / 64.36));
  hv.value = roundField(Number(value.secondaryTextLeft ?? numeric5));
  bv.value = roundField(Number(value.secondaryTextTop ?? numeric6));
  du.value = roundField(clampNumber(Number(value.textIdleOpacity ?? value.idleOpacity ?? 0.3) * 100, 0, 100));
  uu.value = roundField(clampNumber(Number(value.textActiveOpacity ?? value.activeOpacity ?? 0.96) * 100, 0, 100));
  yv.value = value.iconColor || "#e9edf0";
  vv.value = roundField(Number(value.iconSize ?? 50));
  wv.value = roundField(Number(value.iconLeft ?? 14));
  Cv.value = roundField(Number(value.iconTop ?? 50));
  pu.value = roundField(clampNumber(Number(value.iconIdleOpacity ?? value.idleOpacity ?? 0.3) * 100, 0, 100));
  mu.value = roundField(clampNumber(Number(value.iconActiveOpacity ?? value.activeOpacity ?? 0.96) * 100, 0, 100));
  Sv.value = value.frameColor || "#d9e0e6";
  xv.value = roundField(Number(value.frameWidth ?? 2));
  fu.value = roundField(clampNumber(Number(value.frameIdleOpacity ?? 0.48) * 100, 0, 100));
  gu.value = roundField(clampNumber(Number(value.frameActiveOpacity ?? 0.98) * 100, 0, 100));
  Nv.value = roundField(clampNumber(Number(value.frameAngle ?? 45), 0, 360));
  Ev.value = value.glowColor || "#f2f6fa";
  Lv.value = roundField(clampNumber(Number(value.glowAngle ?? 45), 0, 360));
  hu.value = roundField(clampNumber(Number(value.glowIdleStrength ?? 0.5) * 100, 0, 500));
  bu.value = roundField(clampNumber(Number(value.glowIdleSize ?? 1.5) * 100, 0, 300));
  yu.value = roundField(clampNumber(Number(value.glowActiveStrength ?? 2.2) * 100, 0, 500));
  vu.value = roundField(clampNumber(Number(value.glowActiveSize ?? 3) * 100, 0, 300));
  Iv.value = roundField(clampNumber(Number(value.radius ?? 0.5) * 100, 0, 50));
  ur2.value = roundField(clampNumber((Number(flag.x || 0) + numeric3 / 2) / numeric * 100, 0, 100));
  pr.value = roundField(clampNumber((Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100, 0, 100));
  An2.value = roundField(clampNumber(numeric3 / numeric * 100, 0.1, 100));
  Eo2.value = roundField(clampNumber(numeric4 / numeric2 * 100, 0.1, 100));
  eN2.value = roundField(clampNumber(Number(component.style?.scale || 1) * 100, 1, 500));
  mc.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  An2.disabled = isMultiSelect;
  Eo2.disabled = isMultiSelect;
  eN2.disabled = false;
  mc.disabled = false;
  const length = Rn(h.document.sharedComponents, "navigation-button").length;
  const length2 = _w3(component).length;
  mc2.disabled = length < 2 || !length2;
  uN.textContent = length2 + " 项修改";
  mc2.textContent = "一键应用到同类型控件";
  fn(component, dN);
}
function SE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  Tf.value = value.label || "";
  Bt(component);
  setInspectorToggle(xf2, value.mainTextVisible !== false);
  setInspectorToggle(Nf2, value.secondaryTextVisible !== false);
  setInspectorToggle(Gf, value.frameVisible !== false);
  setInspectorToggle(Vf2, value.iconVisible !== false);
  kf.value = value.mainText || "";
  const temp = String(value.secondaryText || "").split(/\r?\n/).slice(0, 2);
  Fs.value = temp[0] || "";
  Ds.value = temp[1] || "";
  Mf.value = value.mainColor || "#b9bbc0";
  Of.value = value.secondaryColor || "#70737b";
  Bf.value = roundField(Number(value.mainSize ?? 34));
  $f.value = roundField(Number(value.secondarySize ?? 12));
  Ff.value = roundField(normalizedFontWeight(value.mainWeight, 0.3));
  Df.value = roundField(normalizedFontWeight(value.secondaryWeight, 0.2));
  zf.value = roundField(Number(value.mainSpacing ?? 1));
  Vf.value = roundField(Number(value.secondarySpacing ?? 2));
  Wf.value = roundField(Number(value.secondaryLineGap ?? 2));
  Rf.value = roundField(Number(value.mainTextLeft ?? 5.5));
  Hf.value = roundField(Number(value.mainTextTop ?? 45));
  jf.value = roundField(Number(value.secondaryTextLeft ?? 54));
  qf.value = roundField(Number(value.secondaryTextTop ?? 43));
  ZN2(value.icon || "");
  Uf.value = value.iconColor || "#b9bbc0";
  _f.value = roundField(Number(value.iconSize ?? 30));
  Yf.value = roundField(Number(value.iconLeft ?? 50));
  Xf.value = roundField(Number(value.iconTop ?? 45));
  Kf.value = value.frameColor || "#60636a";
  Zf.value = roundField(Number(value.frameWidth ?? 1.5));
  Qf.value = roundField(Number(value.frameSize ?? 100));
  eg.value = roundField(Number(value.frameSpacing ?? 100));
  tg.value = roundField(Number(value.frameOffsetX ?? 0));
  ng.value = roundField(Number(value.frameOffsetY ?? 0));
  ig.value = value.markerColor || "#f2a20d";
  ag.value = roundField(Number(value.markerSize ?? 10));
  rg.value = roundField(Number(value.markerLeft ?? 1.8));
  sg.value = roundField(Number(value.markerTop ?? 84));
  const flag2 = value.markerVisible !== false;
  setInspectorToggle(Jf, flag2);
  rd.value = roundField(clampNumber((Number(flag.x || 0) + numeric3 / 2) / numeric * 100, 0, 100));
  sd.value = roundField(clampNumber((Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100, 0, 100));
  $s.value = roundField(numeric3 / numeric * 100);
  Fs2.value = roundField(numeric4 / numeric2 * 100);
  Aa2.value = roundField(Number(component.style?.scale || 1) * 100);
  Ds2.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  for (const temp2 of [$s, Fs2]) {
    temp2.disabled = isMultiSelect;
  }
  Ds2.disabled = false;
  Aa2.disabled = false;
  const length = st("title-button").length;
  const length2 = $w2(component).length;
  zs.disabled = length < 2 || !length2;
  ex.textContent = length2 + " 项修改";
  zs.textContent = "一键应用到同类型控件";
  fn(component, Q1);
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
  cg.value = value.label || "";
  lg.value = value.title || "数量";
  Bt(component);
  setInspectorToggle(rg2, value.iconVisible !== false);
  setInspectorToggle(dg2, value.titleVisible !== false);
  setInspectorToggle(gg2, value.countVisible !== false);
  QN(value.icon ?? "mdi:lightbulb-group-outline");
  mg.value = value.iconColor || "#8b9298";
  fg.value = value.iconActiveColor || "#f2a20d";
  gg.value = roundField(Number(value.iconSize ?? 42));
  bg.value = value.titleColor || "#b9bbc0";
  yg.value = roundField(Number(value.titleSize ?? 32));
  vg.value = roundField(normalizedFontWeight(value.titleWeight, 0.3));
  wg.value = roundField(Number(value.titleSpacing ?? 1.2));
  Sg.value = value.countColor || "#b9bbc0";
  xg.value = value.countActiveColor || "#f2a20d";
  Ng.value = roundField(Number(value.countSize ?? 34));
  Eg.value = roundField(normalizedFontWeight(value.countWeight, 0.35));
  Lg.value = roundField(Number(value.countSpacing ?? 0));
  Ig.value = roundField(Number(value.iconGap ?? 4.5));
  Tg.value = roundField(Number(value.countGap ?? 4.5));
  ud2.value = roundField(clampNumber((Number(flag.x || 0) + numeric3 / 2) / numeric * 100, 0, 100));
  pd.value = roundField(clampNumber((Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100, 0, 100));
  Ws.value = roundField(numeric3 / numeric * 100);
  Rs.value = roundField(numeric4 / numeric2 * 100);
  $a2.value = roundField(Number(component.style?.scale || 1) * 100);
  Hs.value = roundField(Number(flag.rotation || 0));
  const isMultiSelect = selectedComponentIds.size > 1;
  Ws.disabled = isMultiSelect;
  Rs.disabled = isMultiSelect;
  $a2.disabled = false;
  Hs.disabled = false;
  Mr(rt, ko3 >= 0 ? "选择替换实体" : "选择一个实体");
  C0(component);
  if (!Ie2.hidden) {
    Xu(Ma.value);
  }
  fn(component, rx);
}
function NE(component) {
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
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag3.width || 100);
  const numeric4 = Number(flag3.height || 100);
  cx.value = flag ? temp : flag2 ? "设备按钮" : "图标按钮";
  sx.classList.remove("inspector-full-row");
  Ng2.hidden = !flag;
  Ng2.classList.toggle("inspector-full-row", flag);
  Fa.value = chosen;
  oe(Fa);
  $g.textContent = flag2 ? "标题" : "中文标题";
  yx.textContent = flag2 ? "状态" : "英文标题";
  vx.textContent = flag2 ? "自定义标题" : "内容";
  wx.textContent = flag2 ? "自定义状态" : "内容";
  Sd2.placeholder = flag2 ? "留空跟随实体名称" : "";
  xd.placeholder = flag2 ? "留空跟随实体状态" : "";
  lx.hidden = flag2;
  Px.hidden = flag;
  gh.hidden = true;
  Mx.hidden = !flag || chosen !== "presence";
  Ox.hidden = !flag || chosen !== "door-window";
  const temp2 = Ac.has(component.id);
  Tn.classList.toggle("active", temp2);
  Tn.setAttribute("aria-pressed", String(temp2));
  Tn.textContent = "编辑透视";
  Zs.disabled = !temp2;
  $g.closest(".inspector-section").hidden = flag;
  const ancestorEl = Lt.closest(".inspector-section");
  ancestorEl.querySelector("h3").textContent = flag ? "显示颜色" : "图标";
  const ancestorEl2 = Lt.closest(".inspector-picker");
  ancestorEl2.hidden = flag;
  ancestorEl2.style.display = flag ? "none" : "";
  Ex.hidden = flag2;
  Lx.hidden = flag2;
  Ix.hidden = flag2;
  Tx.hidden = flag2;
  Tg2.hidden = flag;
  Tg2.firstChild.textContent = flag2 ? "关闭颜色" : "颜色";
  hd.hidden = !flag2 || flag;
  Nd.hidden = !flag2;
  Ed.hidden = !flag2;
  Ag2.hidden = !flag2;
  Ag2.firstChild.textContent = flag ? {
    presence: "有人颜色",
    "door-window": "打开颜色",
    "water-leak": "水浸颜色",
    smoke: "烟雾颜色",
    "natural-gas": "天然气颜色"
  }[chosen] : "开启颜色";
  dx.hidden = !flag2 || flag;
  ux.hidden = !flag2 || flag;
  px.hidden = flag2;
  mx.hidden = !flag2 || flag;
  fx.hidden = !flag2 || flag;
  gx.hidden = !flag2 || flag;
  wd2.closest("label").hidden = flag;
  Cd2.closest("label").hidden = flag;
  hx.hidden = flag2;
  bx.hidden = flag2;
  Cx.hidden = flag2;
  Sx.hidden = flag2;
  xx.hidden = flag2;
  Nx.hidden = flag2;
  Ag.value = value.label || "";
  Bt(component);
  JN2(value.icon || "");
  hi.value = value.iconColor || (flag ? value.clearColor : "") || value.iconOffColor || value.iconOnColor || "#d7d8da";
  setInspectorToggle(hd, value.iconVisible !== false);
  wd.value = chosen === "water-leak" ? value.waterLeakColor || "#42c8ff" : chosen === "smoke" ? value.smokeColor || "#ffffff" : chosen === "natural-gas" ? value.naturalGasColor || "#ffb347" : value.iconOnColor || (flag ? value.occupiedColor : "") || "#379bff";
  Fg.value = value.badgeColor || "#5b5e66";
  Dg.value = roundField(Number(value.badgeOpacity ?? 0.58) * 100);
  Wg.value = roundField(Number(value.badgeSize ?? value.iconSize ?? 28));
  Vg.value = roundField(Number(value.symbolSize ?? Number(value.iconSize ?? 28) * 0.5));
  _s.value = ["0", "1", "2", "3", "4"].includes(String(value.statePrecision)) ? String(value.statePrecision) : "auto";
  bh.value = roundField(Number(value.haloScaleX ?? value.haloScale ?? 1) * 100);
  yh.value = roundField(Number(value.haloScaleY ?? value.haloScale ?? 1) * 100);
  vh.value = roundField(Number(value.haloRotation ?? 0));
  wh.value = roundField(Number(value.haloOpacity ?? 1) * 100);
  Sh.value = roundField(Number(value.personScale ?? 1) * 100);
  xh.value = roundField(Number(value.personRotation ?? 0));
  Nh.value = roundField(Number(value.personOpacity ?? 1) * 100);
  Eh.value = roundField(Number(value.orbitDuration ?? 8));
  setInspectorToggle(dh, value.haloVisible !== false);
  setInspectorToggle(gh2, value.personVisible !== false);
  zg.value = roundField(Number(value.iconSize ?? 42));
  Cd.value = roundField(Number(value.iconOffOpacity ?? 1) * 100);
  Sd.value = roundField(Number(value.iconOnOpacity ?? 1) * 100);
  wd2.value = roundField(Number(value.iconLeft ?? 50));
  Cd2.value = roundField(Number(value.iconTop ?? 34));
  Sd2.value = value.mainText || "";
  setInspectorToggle(Nd, value.mainTextVisible !== false);
  xd.value = value.secondaryText || "";
  setInspectorToggle(Ed, value.secondaryTextVisible !== false);
  Hg.value = value.mainColor || value.mainOffColor || value.mainOnColor || "#c7c8cb";
  jg.value = value.secondaryColor || value.secondaryOffColor || value.secondaryOnColor || "#75777d";
  Ad.value = roundField(Number(value.mainOffOpacity ?? 1) * 100);
  Pd.value = roundField(Number(value.mainOnOpacity ?? 1) * 100);
  kd.value = roundField(Number(value.secondaryOffOpacity ?? 1) * 100);
  Md.value = roundField(Number(value.secondaryOnOpacity ?? 1) * 100);
  qg.value = roundField(Number(value.mainSize ?? 25));
  Gg.value = roundField(Number(value.secondarySize ?? 10));
  Ug.value = roundField(normalizedFontWeight(value.mainWeight, 0.25));
  _g.value = roundField(normalizedFontWeight(value.secondaryWeight, 0.18));
  Yg.value = roundField(Number(value.mainSpacing ?? 1));
  Xg.value = roundField(Number(value.secondarySpacing ?? 0.7));
  Kg.value = roundField(Number(value.mainTextLeft ?? 9));
  Jg.value = roundField(Number(value.mainTextTop ?? 78));
  Zg.value = roundField(Number(value.secondaryTextLeft ?? 9));
  Qg.value = roundField(Number(value.secondaryTextTop ?? 91));
  setInspectorToggle(Pd2, value.onFillVisible !== false);
  Bd.value = value.onFillColor || "#dfb64f";
  $d.value = roundField(Number(value.onFillStrength ?? 1) * 100);
  eh.value = roundField(Number(value.onFillFadeDuration ?? 0.3));
  setInspectorToggle(Xg2, value.frameVisible !== false);
  nh.value = roundField(Number(value.frameWidth ?? 1));
  oh.value = roundField(Number(value.frameAngle ?? 45));
  Fd.value = roundField(Number(value.frameOffOpacity ?? 0.8) * 100);
  Dd.value = roundField(Number(value.frameOnOpacity ?? 1) * 100);
  ih.value = roundField(Number(value.cutCorner ?? 20));
  setInspectorToggle(Qg2, value.softLightVisible !== false);
  rh.value = value.softLightColor || "#ffffff";
  sh.value = roundField(Number(value.softLightStrength ?? 1) * 100);
  ch.value = roundField(Number(value.softLightSize ?? 1) * 100);
  lh.value = roundField(Number(value.softLightAngle ?? 45));
  setInspectorToggle(ih2, value.glowVisible !== false);
  uh.value = value.glowColor || "#ffffff";
  ph.value = roundField(Number(value.glowStrength ?? 1) * 100);
  mh.value = roundField(Number(value.glowSize ?? 1) * 100);
  fh.value = roundField(Number(value.glowAngle ?? 220));
  $d2.value = roundField(clampNumber((Number(flag3.x || 0) + numeric3 / 2) / numeric * 100, 0, 100));
  Fd2.value = roundField(clampNumber((Number(flag3.y || 0) + numeric4 / 2) / numeric2 * 100, 0, 100));
  Gs.value = roundField(numeric3 / numeric * 100);
  Us2.value = roundField(numeric4 / numeric2 * 100);
  Wa2.value = roundField(Number(component.style?.scale || 1) * 100);
  _s2.value = roundField(Number(flag3.rotation || 0));
  if (flag && !zn.has(component.id)) {
    zn.set(component.id, "on");
    Sv2?.setComponentPreviewState(component.id, "on");
  }
  const flag4 = zn.get(component.id) || "auto";
  for (const element of Us.querySelectorAll("[data-icon-button-preview]")) {
    const flag5 = element.dataset.iconButtonPreview === flag4;
    element.classList.toggle("active", flag5);
    element.setAttribute("aria-pressed", String(flag5));
  }
  const isMultiSelect = selectedComponentIds.size > 1;
  for (const temp3 of [Gs, Us2]) {
    temp3.disabled = isMultiSelect;
  }
  _s2.disabled = false;
  Wa2.disabled = false;
  const chosen2 = component.type === "presence-sensor" ? st(component.type).filter(({
    component: arg
  }) => Ho2(arg) === chosen).length : st(component.type).length;
  const length = Ww2(component).length;
  Ys.disabled = chosen2 < 2 || !length;
  kx.textContent = length + " 项修改";
  Ys.textContent = "一键应用到同类型控件";
  fn(component, Ax);
}
function EE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  Cb.value = value.label || "";
  Bt(component);
  setInspectorToggle(Nb, value.mediaVisible !== false);
  const chosen = value.displayMode === "snapshot" ? "snapshot" : "live";
  for (const element of xb.querySelectorAll("[data-camera-display-mode]")) {
    const flag2 = element.dataset.cameraDisplayMode === chosen;
    element.classList.toggle("active", flag2);
    element.setAttribute("aria-pressed", String(flag2));
  }
  const numeric5 = Number(value.refreshInterval);
  const chosen2 = Number.isFinite(numeric5) ? Math.max(6, Math.round(numeric5)) : 10;
  Ga.value = String(chosen2);
  Ux.hidden = chosen !== "snapshot";
  Ga.disabled = chosen !== "snapshot";
  const chosen3 = value.fit === "contain" ? "contain" : "fill";
  for (const element of Sb.querySelectorAll("[data-camera-fit]")) {
    const flag2 = element.dataset.cameraFit === chosen3;
    element.classList.toggle("active", flag2);
    element.setAttribute("aria-pressed", String(flag2));
  }
  setInspectorToggle(Eb, value.frameVisible !== false);
  Lb.value = value.frameColor || "#d4d4d4";
  Ib.value = roundField(Number(value.frameWidth ?? 1));
  const numeric6 = Number(value.radius ?? 0.04);
  Tb.value = roundField(clampNumber(numeric6 > 0.5 ? numeric6 : numeric6 * 100, 0, 50));
  Ab.value = roundField(Number(value.frameAngle ?? 45));
  Pb.value = roundField(Number(value.frameOpacity ?? 0.9) * 100);
  Xd.value = roundField(clampNumber((Number(flag.x || 0) + numeric3 / 2) / numeric * 100, 0, 100));
  Kd.value = roundField(clampNumber((Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100, 0, 100));
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
  Yx.textContent = length2 + " 项修改";
  lc.textContent = "一键应用到同类型控件";
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
  fn(chosen4, _x);
}
function LE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  Lh.value = value.label || "";
  const chosen = ["air-conditioner", "bath-heater"].includes(value.deviceType) ? value.deviceType : "auto";
  for (const element of Ih.querySelectorAll("[data-air-conditioner-device-type]")) {
    const flag4 = element.dataset.airConditionerDeviceType === chosen;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  jd.textContent = chosen === "bath-heater" ? "预览浴霸详情" : "预览空调 / 浴霸详情";
  Bt(component);
  jd.disabled = !component.bindings?.entity?.entityId;
  Mh.value = value.iconOffColor || "#9aa5ad";
  Oh.value = value.iconOnColor || "#73c8ff";
  Bh.value = value.badgeColor || "#5b5e66";
  $h.value = roundField(Number(value.badgeOpacity ?? 0.58) * 100);
  Fh.value = roundField(Number(value.symbolSize ?? 14));
  Dh.value = roundField(Number(value.badgeSize ?? 28));
  zh.value = roundField(Number(value.iconLeft ?? 20));
  Vh.value = roundField(Number(value.iconTop ?? 50));
  setInspectorToggle(Eh2, value.iconVisible !== false);
  Rh.value = value.mainText || "";
  Hh.value = value.mainColor || "#c7c8cb";
  jh.value = roundField(Number(value.mainSize ?? 21));
  qh.value = roundField(normalizedFontWeight(value.mainWeight, 0.24));
  Gh.value = roundField(Number(value.mainSpacing ?? 0.5));
  Uh.value = roundField(Number(value.mainTextLeft ?? 39));
  _h.value = roundField(Number(value.mainTextTop ?? 40));
  setInspectorToggle(Bh2, value.mainTextVisible !== false);
  Xh.value = value.secondaryText || "";
  Kh.value = value.secondaryColor || "#75777d";
  Jh.value = roundField(Number(value.secondarySize ?? 12));
  Zh.value = roundField(normalizedFontWeight(value.secondaryWeight, 0.12));
  Qh.value = roundField(Number(value.secondarySpacing ?? 0.3));
  eb.value = roundField(Number(value.secondaryTextLeft ?? 39));
  tb.value = roundField(Number(value.secondaryTextTop ?? 67));
  setInspectorToggle(Hh2, value.secondaryTextVisible !== false);
  setInspectorToggle(nb, value.airflowVisible !== false);
  const chosen2 = value.airflowMotion === "static" ? "static" : "dynamic";
  for (const element of ob.querySelectorAll("[data-airflow-motion]")) {
    const flag4 = element.dataset.airflowMotion === chosen2;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  ib.value = value.airflowCoolColor || "#73c8ff";
  ab.value = value.airflowHeatColor || "#ff8a65";
  rb.value = value.airflowOtherColor || "#dce2e6";
  sb.value = roundField(Number(value.airflowAngle ?? 7));
  cb.value = roundField(Number(value.airflowCurve ?? 20));
  lb.value = roundField(Number(value.airflowLength ?? 200));
  db.value = roundField(Number(value.airflowFadePosition ?? 50));
  ub.value = roundField(Number(value.airflowSpread ?? 100));
  pb.value = roundField(Number(value.airflowDensity ?? 60));
  mb.value = roundField(Number(value.airflowIrregularity ?? 50));
  fb.value = roundField(Number(value.airflowThickness ?? 40));
  gb.value = roundField(Number(value.airflowStrength ?? 200));
  hb.value = roundField(Number(value.airflowBlur ?? 6));
  zd.value = roundField(Number(value.airflowSpeed ?? 1));
  zd.disabled = chosen2 === "static";
  const temp = airflowCanvasOffsetBounds(component, h.document.canvas);
  Ra.min = String(roundField(temp.minX));
  Ra.max = String(roundField(temp.maxX));
  Ha.min = String(roundField(temp.minY));
  Ha.max = String(roundField(temp.maxY));
  Ra.value = roundField(Number(value.airflowOffsetX ?? -75));
  Ha.value = roundField(Number(value.airflowOffsetY ?? 34));
  bb.value = roundField(Number(value.airflowWidth ?? 64));
  yb.value = roundField(Number(value.airflowHeight ?? 125));
  Vd.value = roundField(Number(value.airflowScale ?? 1) * 100);
  Wd.value = roundField(Number(value.airflowRotation ?? -3));
  Rd.value = roundField(clampNumber((Number(flag.x || 0) + numeric3 / 2) / numeric * 100, 0, 100));
  Hd.value = roundField(clampNumber((Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100, 0, 100));
  Zs2.value = roundField(numeric3 / numeric * 100);
  Qs.value = roundField(numeric4 / numeric2 * 100);
  ja.value = roundField(Number(component.style?.scale || 1) * 100);
  ec.value = roundField(Number(flag.rotation || 0));
  const chosen3 = Fu2.get(component.id) === "airflow" ? "airflow" : "button";
  if (!Mo2.has(component.id)) {
    const chosen4 = chosen3 === "airflow" ? "on" : "off";
    Mo2.set(component.id, chosen4);
    Sv2?.setComponentPreviewState(component.id, chosen4);
  }
  const flag2 = Mo2.get(component.id) || "auto";
  for (const element of Th.querySelectorAll("[data-air-conditioner-preview]")) {
    const flag4 = element.dataset.airConditionerPreview === flag2;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  Sv2?.setComponentSelectionLayer(component.id, chosen3);
  for (const element of Ah.querySelectorAll("[data-air-conditioner-layer]")) {
    const flag4 = element.dataset.airConditionerLayer === chosen3;
    element.classList.toggle("active", flag4);
    element.setAttribute("aria-pressed", String(flag4));
  }
  const flag3 = chosen3 === "airflow";
  Dx.hidden = flag3;
  zx.hidden = flag3;
  Vx.hidden = flag3;
  Nh2.hidden = !flag3;
  const isMultiSelect = selectedComponentIds.size > 1;
  for (const temp2 of [Zs2, Qs]) {
    temp2.disabled = isMultiSelect;
  }
  ec.disabled = false;
  ja.disabled = false;
  const length = st("air-conditioner").length;
  const length2 = Dw(component).length;
  _d.disabled = length < 2 || !length2;
  Rx.textContent = length2 + " 项修改";
  fn(component, Wx);
}
function IE(component) {
  const value = component.properties || {};
  const flag = component.position || {};
  const numeric = Number(h.document.canvas.width || 2778);
  const numeric2 = Number(h.document.canvas.height || 1940);
  const numeric3 = Number(flag.width || 100);
  const numeric4 = Number(flag.height || 100);
  vb.value = value.label || "";
  Bt(component);
  wb.value = roundField(Number(value.opacity ?? 0.5) * 100);
  Ud.value = roundField(clampNumber((Number(flag.x || 0) + numeric3 / 2) / numeric * 100, 0, 100));
  _d2.value = roundField(clampNumber((Number(flag.y || 0) + numeric4 / 2) / numeric2 * 100, 0, 100));
  qa.value = roundField(Number(component.style?.scale || 1) * 100);
  oc.value = roundField(Number(flag.rotation || 0));
  oc.disabled = false;
  qa.disabled = false;
}
function TE(component) {
  const value = [ia, si2, ks, ui2, tc, ic, Ks, _a, Ka, Qa, ir, sr, Ei].find(el2 => el2 && !el2.hidden)?.querySelector(":scope > .inspector-section");
  if (value && value.nextElementSibling !== gd) {
    value.insertAdjacentElement("afterend", gd);
  }
  const coverProps = component.properties || {};
  const coverKind = ["standard", "dream", "airer"].includes(coverProps.coverKind) ? coverProps.coverKind : "auto";
  for (const element of kg.querySelectorAll("[data-cover-kind]")) {
    const coverKind2 = element.dataset.coverKind === coverKind;
    element.classList.toggle("active", coverKind2);
    element.setAttribute("aria-pressed", String(coverKind2));
  }
  const coverDirection = ["left", "right"].includes(coverProps.coverDirection) ? coverProps.coverDirection : "split";
  for (const element of js.querySelectorAll("[data-cover-direction]")) {
    const coverDirection2 = element.dataset.coverDirection === coverDirection;
    element.classList.toggle("active", coverDirection2);
    element.setAttribute("aria-pressed", String(coverDirection2));
  }
  const motorDirection = ["normal", "reversed"].includes(coverProps.coverMotorDirection) ? coverProps.coverMotorDirection : "auto";
  for (const element of Og.querySelectorAll("[data-cover-motor-direction]")) {
    const motorDirection2 = element.dataset.coverMotorDirection === motorDirection;
    element.classList.toggle("active", motorDirection2);
    element.setAttribute("aria-pressed", String(motorDirection2));
  }
}
function ee() {
  window.requestAnimationFrame(CN);
  const component = Number2();
  const value344 = component?.type === "image";
  const value345 = component?.type === "interaction3d";
  renderInteraction3dInspector(Zm, component, {
    document: h?.document,
    entities: le,
    states: Sv2?.states,
    pickers: i3dEditorPickers,
    enhanceControls: arg50 => {
      Kv2(arg50);
      ju(arg50);
      Gu(arg50);
    },
    prepareCanvas: () => {
      const page2 = findComponent(h?.document, component.id);
      if (!page2) {
        throw new Error("3D 控件已不存在。");
      }
      const element2 = page2.page?.path || R.value;
      const value136 = Te !== "edit" || Sv2?.page?.path !== element2;
      R.value = element2;
      oe(R);
      if (value136) {
        Mt2("edit");
      }
      _e();
      Mc();
    },
    onError,
    onChange: (arg51, {
      replaceProperties: arg52 = false
    } = {}) => L(arg22 => {
      const type8 = findComponent(arg22, component.id)?.component;
      if (!type8 || type8.type !== "interaction3d") {
        throw new Error("3D 控件已不存在。");
      }
      for (const [value32, value33] of Object.entries(arg51)) {
        type8[value32] = value32 === "properties" && arg52 ? value33 : {
          ...type8[value32],
          ...value33
        };
      }
    }, R.value, {
      throwOnError: true
    })
  });
  const value346 = component?.type === "floorplan-auto-diagram";
  const value347 = component?.type === "icon-button-effect";
  const value348 = component?.type === "title-button";
  const value349 = component?.type === "light-statistics";
  const value350 = ["icon-button", "device-button", "presence-sensor"].includes(component?.type);
  const value351 = component?.type === "vacuum-map";
  const value352 = component?.type === "camera";
  const value353 = component?.type === "air-conditioner";
  const value354 = component?.type === "time";
  const value355 = component?.type === "date";
  const value356 = component?.type === "weather";
  const value357 = component?.type === "line-chart";
  const value358 = component?.type === "panel-frame";
  const value359 = component?.type === "navigation-button";
  const value360 = component?.type === "group";
  for (const temp2 of [...Pi.keys()]) {
    if (!value359 || temp2 !== component.id) {
      Pi.delete(temp2);
      Sv2?.setComponentPreviewState(temp2, "auto");
    }
  }
  for (const temp2 of [...Ec.keys()]) {
    if (!value347 || temp2 !== component.id) {
      Ec.delete(temp2);
      Sv2?.setComponentPreviewState(temp2, "auto");
    }
  }
  for (const temp2 of [...zn.keys()]) {
    if (!value350 || temp2 !== component.id) {
      zn.delete(temp2);
      Sv2?.setComponentPreviewState(temp2, "auto");
    }
  }
  for (const temp2 of [...Mo2.keys()]) {
    if (!value353 || temp2 !== component.id) {
      Mo2.delete(temp2);
      Sv2?.setComponentPreviewState(temp2, "auto");
    }
  }
  const flag15 = value345 || value360 || value344 || value346 || value347 || value348 || value349 || value350 || value351 || value352 || value353 || value354 || value355 || value356 || value357 || value358 || value359;
  Ol.hidden = flag15;
  if (value360) {
    Ol.querySelector("p").textContent = "组合支持整体移动、复制、旋转和缩放；双击组合可进入组内编辑。";
  }
  ia.hidden = !value344;
  ql.hidden = !value346;
  si2.hidden = !value347;
  ks.hidden = !value348;
  ud.hidden = !value349;
  ui2.hidden = !value350;
  tc.hidden = !value351;
  ic.hidden = !value352;
  Ks.hidden = !value353;
  _a.hidden = !value354;
  Ka.hidden = !value355;
  Qa.hidden = !value356;
  ir.hidden = !value357;
  sr.hidden = !value358;
  Ei.hidden = !value359;
  const temp = String(component?.bindings?.entity?.entityId || "").startsWith("cover.");
  gd.hidden = !flag15 || !temp;
  if (!flag15) {
    closeOtherPickerPanels();
    Ol.querySelector("p").textContent = component ? "“" + componentLabel(component) + "”的专属属性尚未实现。" : "选择一个控件开始编辑。";
    return;
  }
  if (temp) {
    TE(component);
  }
  if (value346) {
    const flag19 = component.properties || {};
    const flag20 = component.position || {};
    const numeric5 = Number(h.document.canvas.width || 2778);
    const numeric6 = Number(h.document.canvas.height || 1940);
    const numeric7 = Number(flag20.width || 100);
    const numeric8 = Number(flag20.height || 100);
    const list = Array.isArray(flag19.lightLayers) ? flag19.lightLayers.length : 0;
    const flag21 = flag19.previewReady === true && (flag19.generated !== true || flag19.previewing === true);
    si.textContent = flag19.generating ? "正在后台生成底图和灯组效果，请稍候…" : flag19.generated && list ? "已生成导图，包含 " + list + " 个灯组。" : flag21 ? "3D画面已置入仪表盘，请先确定位置、大小和视角。" : "尚未载入3D画面。";
    la2.hidden = !flag21;
    const flag22 = flag19.interactionMode === "view";
    la2.classList.toggle("active", flag22);
    la2.setAttribute("aria-pressed", String(flag22));
    la2.textContent = flag22 ? "完成3D视角调整" : "调整3D视角";
    Gl.value = flag19.label || flag19.instanceName || "";
    pa.value = flag19.exportFolder || "";
    const chosen2 = flag19.layoutMode === "fill" ? "fill" : "free";
    for (const element of of.querySelectorAll("[data-floorplan-layout]")) {
      const flag24 = element.dataset.floorplanLayout === chosen2;
      element.classList.toggle("active", flag24);
      element.setAttribute("aria-pressed", String(flag24));
    }
    ua.value = roundField(clampNumber((Number(flag20.x || 0) + numeric7 / 2) / numeric5 * 100, 0, 100));
    pa2.value = roundField(clampNumber((Number(flag20.y || 0) + numeric8 / 2) / numeric6 * 100, 0, 100));
    ma.value = roundField(numeric7 / numeric5 * 100);
    fa.value = roundField(numeric8 / numeric6 * 100);
    ga.value = roundField(Number(component.style?.scale || 1) * 100);
    ha.value = roundField(Number(flag20.rotation || 0));
    const temp2 = Du.get(component.id);
    const list2 = Array.isArray(temp2?.floors) ? temp2.floors : [];
    const flag23 = String(flag19.floorSelection || "") || String(temp2?.selected || "");
    if (list2.length) {
      const mapped2 = list2.map(component2 => Object.assign(document.createElement("option"), {
        value: component2.id,
        textContent: component2.name
      }));
      if (list2.length > 1) {
        mapped2.unshift(Object.assign(document.createElement("option"), {
          value: "all",
          textContent: "全楼"
        }));
      }
      Zt.replaceChildren(...mapped2);
      Zt.value = mapped2.some(element => element.value === flag23) ? flag23 : mapped2[0].value;
    } else {
      Zt.replaceChildren(Object.assign(document.createElement("option"), {
        value: "",
        textContent: flag21 ? "正在读取楼层…" : "载入3D画面后选择"
      }));
    }
    Zt.disabled = !flag21 || list2.length === 0 || flag19.generating === true;
    const chosen3 = flag19.cameraView === "top" ? "top" : "free";
    const chosen4 = flag19.cameraMode === "perspective" ? "perspective" : "orthographic";
    for (const element of ba.querySelectorAll("[data-floorplan-camera-view]")) {
      const flag24 = element.dataset.floorplanCameraView === chosen3;
      element.classList.toggle("active", flag24);
      element.setAttribute("aria-pressed", String(flag24));
    }
    for (const element of rf.querySelectorAll("[data-floorplan-camera-mode]")) {
      const flag24 = element.dataset.floorplanCameraMode === chosen4;
      element.classList.toggle("active", flag24);
      element.setAttribute("aria-pressed", String(flag24));
    }
    ba2.value = roundField(clampNumber(Number(flag19.cameraFocalLength || 50), 18, 120));
    ba2.disabled = chosen4 !== "perspective" || !flag21;
    sf.disabled = chosen3 !== "top" || !flag21;
    cf.disabled = !flag21;
    for (const temp3 of [ua, pa2, ma, fa, ga, ha]) {
      temp3.disabled = chosen2 === "fill";
    }
    xt.disabled = flag19.generating === true;
    xt.textContent = flag19.generated && !flag19.previewing ? "重新调整位置和视角" : flag19.generating ? "正在后台生成…" : flag21 ? "确定位置大小并后台生成" : "载入3D画面";
    P1.hidden = list === 0;
    const filtered = le.filter(arg => fe(arg) === "light");
    const mapped = (flag19.lightLayers || []).map(component2 => {
      const element = document.createElement("label");
      element.textContent = component2.note || component2.name || "灯组";
      const element2 = document.createElement("select");
      element2.dataset.floorplanLightGroupId = component2.id;
      const flag24 = component.bindings?.["lightGroup:" + component2.id]?.entityId || "";
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
      if (flag24 && !filtered.some(arg => arg.entityId === flag24)) {
        const element4 = document.createElement("option");
        element4.value = flag24;
        element4.textContent = flag24;
        element2.append(element4);
      }
      element2.value = flag24;
      element.append(element2);
      return element;
    });
    lf.replaceChildren(...mapped);
    return;
  }
  if (value347) {
    const chosen2 = Ts.hidden ? He.hidden ? Sa.hidden ? null : "ibe-icon" : "ibe-asset" : "ibe-entity";
    closeOtherPickerPanels(chosen2);
    const flag19 = component.properties || {};
    const flag20 = component.position || {};
    const numeric5 = Number(h.document.canvas.width || 2778);
    const numeric6 = Number(h.document.canvas.height || 1940);
    const numeric7 = Number(flag20.width || 100);
    const numeric8 = Number(flag20.height || 100);
    uf.value = flag19.label || "";
    setInspectorToggle(mf, flag19.buttonVisible !== false);
    setInspectorToggle(ff, flag19.effectVisible !== false);
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
    Zl.value = flag19.iconOffColor || "#9aa5ad";
    Ql.value = flag19.iconOnColor || "#ffffff";
    gf.value = roundField(Number(flag19.iconSize ?? 44));
    ed.value = flag19.buttonOffColor || "#17242d";
    td.value = flag19.buttonOnColor || "#1f91b8";
    hf.value = roundField(Number(flag19.buttonOpacity ?? 0.92) * 100);
    bf.value = flag19.frameColor || "#dcebf2";
    yf.value = roundField(Number(flag19.frameWidth ?? 1.5));
    vf.value = roundField(Number(flag19.frameOpacity ?? 0.72) * 100);
    wf.value = roundField(Number(flag19.radius ?? 50));
    Cf.value = flag19.glowColor || "#43c8f0";
    nd.value = roundField(Number(flag19.glowOffStrength ?? 0) * 100);
    od.value = roundField(Number(flag19.glowOnStrength ?? 1) * 100);
    xf.value = roundField(Number(flag19.effectOpacity ?? 1) * 100);
    Nf.value = roundField(Number(flag19.effectFadeDuration ?? 0.52));
    id.value = roundField(Number(flag19.effectLeft ?? 50));
    nd2.value = roundField(Number(flag19.effectTop ?? 50));
    od2.value = roundField(Number(flag19.effectScale ?? 1) * 100);
    id2.value = roundField(Number(flag19.effectRotation ?? 0));
    Na.value = roundField(clampNumber((Number(flag20.x || 0) + numeric7 / 2) / numeric5 * 100, 0, 100));
    Ea.value = roundField(clampNumber((Number(flag20.y || 0) + numeric8 / 2) / numeric6 * 100, 0, 100));
    ci2.value = roundField(numeric7 / numeric5 * 100);
    ui.value = roundField(numeric8 / numeric6 * 100);
    V1.value = roundField(Number(component.style?.scale || 1) * 100);
    pi.value = roundField(Number(flag20.rotation || 0));
    const isMultiSelect2 = selectedComponentIds.size > 1;
    ci2.disabled = isMultiSelect2;
    ui.disabled = isMultiSelect2;
    V1.disabled = false;
    pi.disabled = false;
    const chosen3 = flag19.effectLayoutMode === "fill" ? "fill" : "free";
    for (const element of Ef.querySelectorAll("[data-ibe-layout]")) {
      const flag23 = element.dataset.ibeLayout === chosen3;
      element.classList.toggle("active", flag23);
      element.setAttribute("aria-pressed", String(flag23));
    }
    for (const temp4 of [id, nd2, od2, id2]) {
      temp4.disabled = chosen3 === "fill";
    }
    const temp2 = pE(flag19);
    U1.textContent = temp2 ? "原始尺寸：" + roundField(temp2.width) + " × " + roundField(temp2.height) + "；仅支持等比缩放。" : "效果图片将按原始尺寸等比缩放。";
    const temp3 = iconButtonEffectInspectorLayer(component, Kv.get(component.id));
    Sv2?.setComponentSelectionLayer(component.id, temp3);
    if (!Ec.has(component.id)) {
      Ec.set(component.id, "on");
      Sv2?.setComponentPreviewState(component.id, "on");
    }
    const flag21 = Ec.get(component.id) || "auto";
    for (const element of Jl.querySelectorAll("[data-ibe-preview]")) {
      const flag23 = element.dataset.ibePreview === flag21;
      element.classList.toggle("active", flag23);
      element.setAttribute("aria-pressed", String(flag23));
    }
    for (const element of pf.querySelectorAll("[data-ibe-layer]")) {
      const flag23 = element.dataset.ibeLayer === temp3;
      element.classList.toggle("active", flag23);
      element.setAttribute("aria-pressed", String(flag23));
    }
    const flag22 = temp3 === "effect";
    W1.hidden = flag22;
    H1.hidden = flag22;
    j1.hidden = flag22;
    R1.hidden = !flag22;
    const length = st("icon-button-effect").length;
    const length2 = Vw2(component).length;
    Ps2.disabled = length < 2 || !length2;
    K1.textContent = length2 + " 项修改";
    Ps2.textContent = "一键应用到同类型控件";
    fn(component, X1);
    return;
  }
  if (value353) {
    closeOtherPickerPanels(Js.hidden ? null : "air-conditioner-entity");
    LE(component);
    return;
  }
  if (value348) {
    const chosen2 = Ms.hidden ? Ta.hidden ? null : "title-button-icon" : "title-button-entity";
    closeOtherPickerPanels(chosen2);
    SE(component);
    return;
  }
  if (value349) {
    const chosen2 = Ie2.hidden ? Vs.hidden ? Ba.hidden ? null : "light-statistics-icon" : "light-statistics-action-entity" : "light-statistics-entity";
    closeOtherPickerPanels(chosen2);
    xE(component);
    return;
  }
  if (value350) {
    const chosen2 = mi.hidden ? Va.hidden ? null : "icon-button-icon" : "icon-button-entity";
    closeOtherPickerPanels(chosen2);
    NE(component);
    return;
  }
  if (value352) {
    closeOtherPickerPanels(ac.hidden ? null : "camera-entity");
    EE(component);
    return;
  }
  if (value351) {
    closeOtherPickerPanels(nc.hidden ? null : "vacuum-map-entity");
    IE(component);
    return;
  }
  if (value359) {
    closeOtherPickerPanels(dr.hidden ? null : "navigation-icon");
    CE(component);
    return;
  }
  if (value354) {
    closeOtherPickerPanels();
    hE2(component);
    return;
  }
  if (value355) {
    closeOtherPickerPanels();
    bE2(component);
    return;
  }
  if (value356) {
    closeOtherPickerPanels();
    yE2(component);
    return;
  }
  if (value357) {
    closeOtherPickerPanels();
    vE(component);
    return;
  }
  if (value358) {
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
  L1.value = "图片";
  Ps.value = flag16.label || "";
  Bt(component);
  fE(component);
  da.value = roundField(Number(flag16.opacity ?? 1) * 100);
  Nn2.value = roundField(clampNumber((Number(flag17.x || 0) + numeric3 / 2) / numeric * 100, 0, 100));
  go2.value = roundField(clampNumber((Number(flag17.y || 0) + numeric4 / 2) / numeric2 * 100, 0, 100));
  Rl.value = roundField(clampNumber(Number(component.style?.scale || 1) * 100, 1, 500));
  ai.value = roundField(Number(flag17.rotation || 0));
  const chosen = flag16.layoutMode === "fill" ? "fill" : "free";
  for (const element of nf.querySelectorAll("[data-image-layout]")) {
    const flag19 = element.dataset.imageLayout === chosen;
    element.classList.toggle("active", flag19);
    element.setAttribute("aria-pressed", String(flag19));
  }
  const flag18 = chosen === "fill";
  const isMultiSelect = selectedComponentIds.size > 1;
  Nn2.disabled = flag18;
  go2.disabled = flag18;
  Rl.disabled = flag18;
  ai.disabled = flag18;
  fn(component, B1);
}
async function gn({
  refreshInspector: value = true
} = {}) {
  const [temp, temp2] = await Promise.all([Z("/assets/builtin?_=" + Date.now()), Z("/assets/user?_=" + Date.now())]);
  Ev2 = temp.items || [];
  ht2 = temp2.items || [];
  Ev3 = (temp.catalogVersion || "") + ":" + (temp2.catalogVersion || "");
  const temp3 = setBuiltinAssetVersions(D02());
  if (temp3) {
    Sv2?.renderComponents(true);
    xv2?.renderComponents(true);
  }
  if (value) {
    ee();
  }
  return temp3;
}
async function U0() {
  const value = await Z("/assets/version");
  const number = (value.builtin || "") + ":" + (value.user || "");
  if (Ev3 !== number) {
    await gn({
      refreshInspector: true
    });
  }
}
async function jc({
  afterCurrent: value = false
} = {}) {
  if (Po2) {
    if (value) {
      await Po2;
      return jc();
    } else {
      return Po2;
    }
  } else {
    Po2 = (async () => {
      const list = [];
      let temp = 0;
      let temp2 = 0;
      do {
        const temp5 = await Z("/ha/entities?limit=500&offset=" + temp);
        list.push(...(temp5.items || []));
        temp2 = Number(temp5.total || 0);
        temp += Number(temp5.limit || 500);
      } while (list.length < temp2);
      le = list.filter(arg => arg.status !== "missing");
      const [temp3, temp4] = await Promise.all([Z("/ha/devices").catch(() => ({
        items: []
      })), Z("/ha/translations").catch(() => ({
        resources: {}
      }))]);
      Ao2 = temp3?.items || [];
      Iu2 = new Map(Ao2.map(arg => [String(arg.deviceId || ""), Tr2(arg.name)]).filter(([arg, arg2]) => arg && arg2));
      Tu2 = temp4?.resources || {};
      Tu3 = true;
      Sv2?.setEntityCatalog(le, Tu2, Ao2);
      xv2?.setEntityCatalog(le, Tu2, Ao2);
      _0();
      if (!document.activeElement?.closest?.(".inspector-form")) {
        ee();
      }
    })().finally(() => {
      Po2 = null;
    });
    return Po2;
  }
}
function vp(value, arg2 = vr2) {
  const flag = value?.customPopups || [];
  ao2.replaceChildren();
  Yo2.replaceChildren();
  if (!flag.length) {
    vr2 = null;
    ao2.append(new Option("暂无组合弹窗", ""));
    ao2.disabled = true;
    ao.disabled = true;
    oe(ao2);
    const element = document.createElement("div");
    element.className = "popup-list-empty";
    element.textContent = "还没有组合弹窗";
    Yo2.append(element);
    return;
  }
  for (const temp of flag) {
    ao2.append(new Option(temp.name, temp.id));
  }
  vr2 = flag.some(component => component.id === arg2) ? arg2 : flag[0].id;
  ao2.value = vr2;
  ao2.disabled = false;
  ao.disabled = false;
  oe(ao2);
  for (const temp of flag) {
    const temp2 = document.createElement("button");
    temp2.type = "button";
    temp2.className = "popup-list-item" + (temp.id === vr2 ? " selected" : "");
    temp2.dataset.popupId = temp.id;
    temp2.setAttribute("role", "option");
    temp2.setAttribute("aria-selected", String(temp.id === vr2));
    const element = document.createElement("span");
    element.textContent = temp.name;
    const element2 = document.createElement("small");
    element2.textContent = (temp.modules || []).length + " 个模块";
    temp2.append(element, element2);
    Yo2.append(temp2);
  }
}
function _0() {
  for (const element of document.querySelectorAll("[data-popup-entity]")) {
    const value = element.closest("[data-action-trigger]");
    if (!element.value && le[0]?.entityId) {
      element.value = le[0].entityId;
    }
    yp2(value);
    const el2 = value?.querySelector("[data-popup-entity-menu]");
    if (el2 && !el2.hidden) {
      Rc(value, value.querySelector("[data-popup-entity-search]")?.value || "");
    }
  }
}
function wp(value = he.elements.deviceType.value) {
  const flag = he.elements.type.value === "climate";
  const temp = normalizedPopupClimateDeviceType(value);
  yu2.hidden = !flag;
  he.elements.deviceType.value = temp;
  for (const element of yu2.querySelectorAll("[data-popup-module-device-type]")) {
    const flag2 = element.dataset.popupModuleDeviceType === temp;
    element.classList.toggle("active", flag2);
    element.setAttribute("aria-pressed", String(flag2));
  }
}
function Cp2(value) {
  return le.find(arg => arg.entityId === value)?.name || value || "未选择实体";
}
function Y0() {
  const value = he.elements.entityId.value;
  const found = le.find(arg => arg.entityId === value);
  const chosen = found ? "[" + Hn(found) + "] " + Ot2(found) : value || "选择实体";
  Mr(rn, chosen, value || chosen);
  rn.dataset.entityId = value;
  rn._entityCopySync?.();
}
function Z0(value = hc.value) {
  const inputValue = he.elements.entityId.value;
  const temp = String(value || "").trim().toLocaleLowerCase("zh-CN");
  const mapped = le.map((entity, index) => ({
    entity,
    index
  })).filter(({
    entity: arg
  }) => !temp || (ct(arg) + " " + arg.entityId).toLocaleLowerCase("zh-CN").includes(temp)).sort((arg, arg2) => Number(popupModuleEntityRecommended(arg2.entity, he.elements.type.value)) - Number(popupModuleEntityRecommended(arg.entity, he.elements.type.value)) || arg.index - arg2.index).map(({
    entity: arg
  }) => arg);
  Ii.replaceChildren(...mapped.map(arg => {
    const temp2 = document.createElement("button");
    temp2.type = "button";
    temp2.className = "inspector-entity-option" + (arg.entityId === inputValue ? " selected" : "");
    temp2.dataset.popupModuleEntityId = arg.entityId;
    temp2.setAttribute("role", "option");
    temp2.setAttribute("aria-selected", String(arg.entityId === inputValue));
    const temp3 = document.createElement("span");
    temp3.className = "inspector-entity-option-content";
    const element = document.createElement("span");
    element.className = "inspector-entity-option-line inspector-entity-name-line";
    element.textContent = "[" + Hn(arg) + "] " + Ot2(arg);
    const element2 = document.createElement("span");
    element2.className = "inspector-entity-option-line inspector-entity-id";
    element2.textContent = arg.entityId;
    temp3.append(element, element2);
    Gn(temp2, element);
    temp2.append(temp3);
    return temp2;
  }));
  if (!mapped.length) {
    const element = document.createElement("div");
    element.className = "inspector-picker-empty";
    element.textContent = "没有匹配的实体";
    Ii.append(element);
  }
}
function zi() {
  wu.hidden = true;
  rn.setAttribute("aria-expanded", "false");
}
function K0() {
  if (Te !== "popup") {
    return;
  }
  const value = findCustomPopup(h?.document, vr2);
  const customPopupStageWrap = St2.querySelector(".custom-popup-stage-wrap");
  const customPopupViewport = St2.querySelector(".custom-popup-viewport");
  const customPopupStage = St2.querySelector(".custom-popup-stage");
  const customPopupEditorToolbar = St2.querySelector(".custom-popup-editor-toolbar");
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
function J0(value, arg2, arg3 = null, arg4 = false) {
  const found = (h?.document?.customPopups || []).find(component => component.id === value);
  if (!found) {
    return;
  }
  const temp = reorderedPopupModules(found.modules, arg2, arg3, arg4);
  if (temp.length !== (found.modules || []).length || !temp.every((component, arg22) => component.id === found.modules[arg22]?.id)) {
    if (!packPopupModules(temp, found.layout).fits) {
      onError(new Error("这个排序会使当前布局超过 3 行。"));
      return;
    }
    L(doc => {
      const found2 = (doc.customPopups || []).find(component => component.id === value);
      if (found2) {
        found2.modules = reorderedPopupModules(found2.modules, arg2, arg3, arg4);
      }
    });
  }
}
function AE(value, component) {
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
      element2.addEventListener("click", event => {
        event.stopPropagation();
        if (temp6 !== chosen) {
          L(doc => {
            const component2 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
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
  for (const [deviceType, temp5] of [["auto", "自动识别"], ["air-conditioner", "空调"], ["bath-heater", "浴霸"]]) {
    const element2 = document.createElement("button");
    element2.type = "button";
    element2.textContent = temp5;
    element2.classList.toggle("active", deviceType === temp4);
    element2.setAttribute("aria-pressed", String(deviceType === temp4));
    element2.addEventListener("click", event => {
      event.stopPropagation();
      if (deviceType !== temp4) {
        L(doc => {
          const component2 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
          if (!!component2 && component2.type === "climate") {
            component2.properties = {
              ...(component2.properties || {}),
              deviceType
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
  return value.map((element, arg2) => ({
    value: Number.isFinite(Number(list[arg2]?.value)) ? Number(list[arg2].value) : element.value,
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
  for (const [temp8, temp9] of [["auto", "自动"], ["0", "0 位"], ["1", "1 位"], ["2", "2 位"], ["3", "3 位"], ["4", "4 位"]]) {
    element2.append(new Option(temp9, temp8));
  }
  const temp3 = syncedLineChartProperties(h?.document, Je2(), component.entityId, component.properties);
  element2.value = ["0", "1", "2", "3", "4"].includes(String(temp3.statePrecision)) ? String(temp3.statePrecision) : "auto";
  element2.addEventListener("pointerdown", event => event.stopPropagation());
  element2.addEventListener("click", event => event.stopPropagation());
  element2.addEventListener("change", event => {
    event.stopPropagation();
    const statePrecision = ["0", "1", "2", "3", "4"].includes(element2.value) ? element2.value : "auto";
    L(doc => {
      const component2 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
      if (!!component2 && component2.type === "line-chart") {
        component2.properties = {
          ...(component2.properties || {}),
          statePrecision
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
      element7.setAttribute("aria-label", "" + arg + (arg2.length > 1 ? " " + (arg22 + 1) : ""));
      element7.addEventListener("pointerdown", event => event.stopPropagation());
      element7.addEventListener("click", event => event.stopPropagation());
      element7.addEventListener("change", event => {
        event.stopPropagation();
        arg3(element7.value, arg22);
      });
      temp9.append(element7);
    });
    temp8.append(element6, temp9);
    temp.append(temp8);
  };
  createControl("数值颜色", [String(component.properties?.valueColor || "#dce1e5")], valueColor => {
    L(doc => {
      const component2 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
      if (!!component2 && component2.type === "line-chart") {
        component2.properties = {
          ...(component2.properties || {}),
          valueColor
        };
      }
    });
  });
  const temp4 = document.createElement("div");
  temp4.className = "popup-line-chart-setting-row";
  const element3 = document.createElement("span");
  element3.textContent = "阈值模式";
  const element4 = document.createElement("select");
  element4.setAttribute("aria-label", "组合弹窗折线图阈值模式");
  element4.append(new Option("自动（按历史范围）", "auto"), new Option("手动设置", "manual"));
  const flag = Array.isArray(component.properties?.thresholds) && component.properties.thresholds.some(element6 => Number.isFinite(Number(element6?.value)));
  element4.value = component.properties?.thresholdMode === "auto" || !flag && component.properties?.thresholdMode !== "manual" ? "auto" : "manual";
  element4.addEventListener("pointerdown", event => event.stopPropagation());
  element4.addEventListener("click", event => event.stopPropagation());
  element4.addEventListener("change", event => {
    event.stopPropagation();
    const thresholdMode = element4.value === "manual" ? "manual" : "auto";
    L(doc => {
      const component2 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
      if (!component2 || component2.type !== "line-chart") {
        return;
      }
      const options = {
        ...(component2.properties || {}),
        thresholdMode
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
    element7.addEventListener("pointerdown", event => event.stopPropagation());
    element7.addEventListener("click", event => event.stopPropagation());
    element7.addEventListener("change", event => {
      event.stopPropagation();
      const number = Number(element7.value);
      if (Number.isFinite(number)) {
        element7.value = roundField(number);
        L(doc => {
          const component2 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
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
            thresholds
          };
        });
      }
    });
    temp7.append(element7);
  });
  temp6.append(element5, temp7);
  temp.append(temp6);
  createControl("折线颜色", temp5.map(arg => arg.color), (color, arg2) => {
    L(doc => {
      const component2 = (doc.customPopups || []).find(component3 => component3.id === value)?.modules?.find(component3 => component3.id === component.id);
      if (!component2 || component2.type !== "line-chart") {
        return;
      }
      const thresholds = qc(component2);
      thresholds[arg2] = {
        ...thresholds[arg2],
        color
      };
      component2.properties = {
        ...(component2.properties || {}),
        thresholdMode: "manual",
        thresholds
      };
    });
  }, element4.value === "auto");
  return temp;
}
function Sp() {
  if (Te !== "popup") {
    return;
  }
  const value = findCustomPopup(h?.document, vr2);
  St2.replaceChildren();
  if (!value) {
    const element5 = document.createElement("div");
    element5.className = "custom-popup-empty";
    element5.innerHTML = "<div><strong>还没有组合弹窗</strong><p>从左侧新建后，可以混合添加灯光、空调、空气净化器、窗帘、摄像头和折线图。</p></div>";
    St2.append(element5);
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
  element2.textContent = temp4.columns + " 列 × " + temp4.rows + " 行·行数自适应";
  temp3.append(element, element2);
  const temp5 = document.createElement("div");
  temp5.className = "custom-popup-toolbar-actions";
  const temp6 = document.createElement("span");
  temp6.className = "custom-popup-layout-toggle";
  for (const columns of [2, 3, 4]) {
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.textContent = columns + " 列";
    element5.classList.toggle("active", popupLayoutColumns(value.layout) === columns);
    element5.addEventListener("click", () => {
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
      L(doc => {
        const found = (doc.customPopups || []).find(component => component.id === value.id);
        if (found) {
          found.layout = {
            ...(found.layout || {}),
            columns
          };
        }
      });
    });
    temp6.append(element5);
  }
  const element3 = document.createElement("button");
  element3.type = "button";
  element3.textContent = "＋ 添加模块";
  element3.addEventListener("click", () => Z02());
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
  element4.style.gridTemplateColumns = "repeat(" + temp4.columns + ", minmax(0, 1fr))";
  element4.style.gridTemplateRows = "repeat(" + temp4.rows + ", minmax(0, 1fr))";
  let temp9 = null;
  const elements = () => {
    element4.classList.remove("popup-module-append-target");
    for (const element5 of element4.querySelectorAll(".popup-module-drop-top,.popup-module-drop-right,.popup-module-drop-bottom,.popup-module-drop-left")) {
      element5.classList.remove("popup-module-drop-top", "popup-module-drop-right", "popup-module-drop-bottom", "popup-module-drop-left");
    }
  };
  element4.addEventListener("dragover", event => {
    if (!!temp9 && !event.target.closest(".popup-module-card")) {
      event.preventDefault();
      elements();
      element4.classList.add("popup-module-append-target");
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    }
  });
  element4.addEventListener("drop", event => {
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
    const chosen = ["climate", "air-purifier", "water-heater", "media-player", "camera", "line-chart"].includes(temp11.type) ? 2 : flag.width;
    const element5 = document.createElement("article");
    element5.className = "popup-module-card";
    element5.dataset.popupModuleId = temp11.id;
    element5.draggable = true;
    element5.setAttribute("aria-label", (temp11.title || Cp2(temp11.entityId)) + "，可拖动排序");
    element5.style.gridColumn = flag.x + 1 + " / span " + chosen;
    element5.style.gridRow = flag.y + 1 + " / span " + flag.height;
    const temp12 = document.createElement("div");
    temp12.className = "popup-module-card-heading";
    const temp13 = document.createElement("div");
    const element6 = document.createElement("strong");
    element6.textContent = temp11.title || Cp2(temp11.entityId);
    temp13.append(element6);
    const temp14 = document.createElement("span");
    temp14.className = "popup-module-card-actions";
    const element7 = document.createElement("button");
    element7.type = "button";
    element7.textContent = "✎";
    element7.title = "编辑模块";
    element7.addEventListener("click", () => Z02(temp11));
    const element8 = document.createElement("button");
    element8.type = "button";
    element8.textContent = "⎘";
    element8.title = "复制模块";
    element8.addEventListener("click", () => {
      const list = [...(value.modules || []), {
        ...cloneValue(temp11),
        id: "candidate"
      }];
      if (!packPopupModules(list, value.layout).fits) {
        onError(new Error("当前布局已放不下这个复制模块。"));
        return;
      }
      L(event => {
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
    const element9 = document.createElement("button");
    element9.type = "button";
    element9.textContent = "×";
    element9.title = "删除模块";
    element9.addEventListener("click", () => L(doc => {
      const found = (doc.customPopups || []).find(component => component.id === value.id);
      if (found) {
        found.modules = found.modules.filter(component => component.id !== temp11.id);
      }
    }));
    temp14.append(element7, element8, element9);
    element5.addEventListener("pointerdown", event2 => {
      element5.dataset.dragBlocked = String(!!event2.target.closest(".popup-module-card-actions,.popup-cover-settings,.popup-climate-settings,.popup-line-chart-settings"));
    });
    element5.addEventListener("pointerup", () => {
      delete element5.dataset.dragBlocked;
    });
    element5.addEventListener("pointercancel", () => {
      delete element5.dataset.dragBlocked;
    });
    element5.addEventListener("dragstart", event => {
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
    element5.addEventListener("dragover", event => {
      if (!temp9 || temp9 === temp11.id) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      elements();
      const {
        edge: temp16
      } = popupModuleDropPosition(element5, event);
      element5.classList.add("popup-module-drop-" + temp16);
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    });
    element5.addEventListener("drop", event => {
      if (!temp9 || temp9 === temp11.id) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const temp16 = temp9;
      const {
        placeAfter: temp17
      } = popupModuleDropPosition(element5, event);
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
    element11.textContent = Cp2(temp11.entityId);
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
  St2.append(temp);
  window.requestAnimationFrame(K0);
}
function Z02(component = null) {
  if (!findCustomPopup(h?.document, vr2)) {
    return;
  }
  Cr = component?.id || null;
  yN.textContent = component ? "编辑弹窗模块" : "添加弹窗模块";
  const value = component?.type === "capability-device" ? "generic" : component?.type;
  he.elements.type.value = ["light", "climate", "air-purifier", "water-heater", "media-player", "electric-bed", "switch", "cover", "camera", "line-chart", "generic"].includes(value) ? value : "light";
  oe(he.elements.type);
  const flag = le.find(arg => popupModuleEntityRecommended(arg, he.elements.type.value)) || le[0];
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
  R.replaceChildren();
  if (!value.pages.length) {
    R.append(new Option("暂无页面", ""));
    R.disabled = true;
    oe(R);
    return false;
  }
  const chosen = value.pages.some(arg => arg.path === value.defaultPagePath) ? value.defaultPagePath : null;
  for (const temp of value.pages) {
    const temp2 = new Option(temp.name, temp.path);
    temp2.dataset.defaultPage = String(temp.path === chosen);
    R.append(temp2);
  }
  R.disabled = false;
  R.value = arg2 && value.pages.some(arg => arg.path === arg2) ? arg2 : chosen || value.pages[0].path;
  oe(R);
  return true;
}
function Q0(value, arg2) {
  const chosen = selectedComponentIds.size ? [...selectedComponentIds] : componentId ? [componentId] : [];
  selectedComponentIds = new Set(chosen.filter(arg => {
    const temp = findComponent(value, arg);
    return temp && (temp.scope !== "page" || temp.page?.path === arg2);
  }));
  if (!selectedComponentIds.has(componentId)) {
    componentId = selectedComponentIds.values().next().value || null;
  }
  if (!componentId) {
    ku2 = null;
  }
}
const jE = new Set();
function BE(value, arg2, arg3) {
  if (Te !== "edit" || !Sv2 || Sv2.page?.path !== arg3 || editorDocumentFrameSignature(value) !== editorDocumentFrameSignature(arg2)) {
    return null;
  }
  const temp = editorComponentEntries(value);
  const temp2 = editorComponentEntries(arg2);
  if (temp.order.length !== temp2.order.length || temp.order.some((arg, arg22) => arg !== temp2.order[arg22]) || temp.entries.size !== temp2.entries.size) {
    return null;
  }
  const list = [];
  for (const [componentId, temp3] of temp.entries) {
    const temp4 = temp2.entries.get(componentId);
    if (!temp4 || temp3.scope !== temp4.scope || temp3.pagePath !== temp4.pagePath || temp3.parentId !== temp4.parentId || jE.has(temp3.component.type) || editorComponentStructure(temp3.component) !== editorComponentStructure(temp4.component)) {
      return null;
    }
    if (JSON.stringify(temp3.component) !== JSON.stringify(temp4.component)) {
      if (!Sv2.componentHosts.has(componentId)) {
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
  const includesValue = ["icon-button", "device-button", "presence-sensor"].includes(component.type);
  const element = component.type === "title-button" ? rd : component.type === "light-statistics" ? ud2 : includesValue ? $d2 : component.type === "air-conditioner" ? Rd : component.type === "vacuum-map" ? Ud : component.type === "camera" ? Xd : component.type === "icon-button-effect" ? Na : component.type === "navigation-button" ? ur2 : component.type === "time" ? Ya : component.type === "date" ? Ja : component.type === "weather" ? er : component.type === "line-chart" ? or2 : component.type === "panel-frame" ? rr : Nn2;
  const element2 = component.type === "title-button" ? sd : component.type === "light-statistics" ? pd : includesValue ? Fd2 : component.type === "air-conditioner" ? Hd : component.type === "vacuum-map" ? _d2 : component.type === "camera" ? Kd : component.type === "icon-button-effect" ? Ea : component.type === "navigation-button" ? pr : component.type === "time" ? Xa : component.type === "date" ? Za : component.type === "weather" ? or : component.type === "line-chart" ? ir2 : component.type === "panel-frame" ? sr2 : go2;
  const element3 = component.type === "title-button" ? Aa2 : component.type === "light-statistics" ? $a2 : includesValue ? Wa2 : component.type === "air-conditioner" ? ja : component.type === "vacuum-map" ? qa : component.type === "camera" ? Ua : component.type === "icon-button-effect" ? V1 : component.type === "navigation-button" ? eN2 : component.type === "time" ? yo : component.type === "date" ? vo : component.type === "weather" ? wo : component.type === "line-chart" ? Co : component.type === "panel-frame" ? So : Rl;
  const element4 = component.type === "title-button" ? Ds2 : component.type === "light-statistics" ? Hs : includesValue ? _s2 : component.type === "air-conditioner" ? ec : component.type === "vacuum-map" ? oc : component.type === "camera" ? cc : component.type === "icon-button-effect" ? pi : component.type === "navigation-button" ? mc : component.type === "time" ? gi : component.type === "date" ? hi2 : component.type === "weather" ? bi : component.type === "line-chart" ? Ci : component.type === "panel-frame" ? Ni : ai;
  if (Number.isFinite(fallback.x)) {
    element.value = roundField(clampNumber((fallback.x + chosen / 2) / numeric * 100, 0, 100));
  }
  if (Number.isFinite(fallback.y)) {
    element2.value = roundField(clampNumber((fallback.y + chosen2 / 2) / numeric2 * 100, 0, 100));
  }
  if (component.type === "navigation-button" && Number.isFinite(fallback.width)) {
    An2.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "navigation-button" && Number.isFinite(fallback.height)) {
    Eo2.value = roundField(clampNumber(fallback.height / numeric2 * 100, 0.1, 100));
  }
  if (component.type === "icon-button-effect" && Number.isFinite(fallback.width)) {
    ci2.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "icon-button-effect" && Number.isFinite(fallback.height)) {
    ui.value = roundField(clampNumber(fallback.height / numeric2 * 100, 0.1, 100));
  }
  if (component.type === "title-button" && Number.isFinite(fallback.width)) {
    $s.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "title-button" && Number.isFinite(fallback.height)) {
    Fs2.value = roundField(clampNumber(fallback.height / numeric2 * 100, 0.1, 100));
  }
  if (component.type === "light-statistics" && Number.isFinite(fallback.width)) {
    Ws.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "light-statistics" && Number.isFinite(fallback.height)) {
    Rs.value = roundField(clampNumber(fallback.height / numeric2 * 100, 0.1, 100));
  }
  if (includesValue && Number.isFinite(fallback.width)) {
    Gs.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (includesValue && Number.isFinite(fallback.height)) {
    Us2.value = roundField(clampNumber(fallback.height / numeric2 * 100, 0.1, 100));
  }
  if (component.type === "camera" && Number.isFinite(fallback.width)) {
    rc.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "camera" && Number.isFinite(fallback.height)) {
    sc.value = roundField(clampNumber(fallback.height / numeric2 * 100, 0.1, 100));
  }
  if (component.type === "air-conditioner" && Number.isFinite(fallback.width)) {
    Zs2.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "air-conditioner" && Number.isFinite(fallback.height)) {
    Qs.value = roundField(clampNumber(fallback.height / numeric2 * 100, 0.1, 100));
  }
  if (component.type === "line-chart" && Number.isFinite(fallback.width)) {
    vi.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "line-chart" && Number.isFinite(fallback.height)) {
    wi2.value = roundField(clampNumber(fallback.height / numeric2 * 100, 0.1, 100));
  }
  if (component.type === "panel-frame" && Number.isFinite(fallback.width)) {
    Si.value = roundField(clampNumber(fallback.width / numeric * 100, 0.1, 100));
  }
  if (component.type === "panel-frame" && Number.isFinite(fallback.height)) {
    xi.value = roundField(clampNumber(fallback.height / numeric2 * 100, 0.1, 100));
  }
  if (Number.isFinite(fallback.scale)) {
    element3.value = roundField(fallback.scale * 100);
  }
  if (Number.isFinite(fallback.rotation)) {
    element4.value = roundField(fallback.rotation);
  }
}
function jr() {
  return Sv2 || (Sv2 = new PanelRenderer(Dt2, {
    editable: true,
    historySeriesCache: Sv3,
    runtimeStateCache: xv3,
    virtualEntityStateCache: Nv2,
    onComponentTransform(value, arg2) {
      componentId = value;
      selectedComponentIds = new Set([value]);
      L(arg => {
        const component = findComponent(arg, value)?.component;
        if (!component) {
          return;
        }
        const temp = Ae(component, "width");
        const temp2 = Ae(component, "height");
        const temp3 = Ae(component, "scale");
        const temp4 = Ae(component, "rotation");
        const {
          scale,
          airflowOffsetX,
          airflowOffsetY,
          ...temp5
        } = arg2;
        component.position = {
          ...(component.position || {}),
          ...temp5
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
        if (component.type === "navigation-button" && Number.isFinite(arg2.width)) {
          Kn(value, "width", temp, Ae(component, "width"));
        }
        if (component.type === "navigation-button" && Number.isFinite(arg2.height)) {
          Kn(value, "height", temp2, Ae(component, "height"));
        }
        if (component.type === "navigation-button" && Number.isFinite(arg2.scale)) {
          Kn(value, "scale", temp3, Ae(component, "scale"));
        }
        if (component.type === "navigation-button" && Number.isFinite(arg2.rotation)) {
          Kn(value, "rotation", temp4, Ae(component, "rotation"));
        }
      });
    },
    onComponentsTransform(value, arg2) {
      componentId = arg2;
      L(arg => {
        for (const temp of value) {
          const component = findComponent(arg, temp.componentId)?.component;
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
      ku2 = component.id;
      L(arg => {
        Gu2(arg, value, component, false);
      });
    },
    onComponentsDuplicate(value, arg23, arg3) {
      const mapped = value.map(arg => arg.copiedComponent.id);
      componentId = arg3 || mapped[0] || null;
      selectedComponentIds = new Set(mapped);
      ku2 = componentId;
      L(arg => {
        for (const temp of value) {
          Gu2(arg, temp.sourceComponentId, temp.copiedComponent, false);
        }
      });
    },
    onComponentTransformPreview(value, arg2) {
      ew(value, arg2);
    },
    onComponentProperties(value, arg2) {
      L(arg => {
        const component = findComponent(arg, value)?.component;
        if (!!component && !!["air-conditioner", "presence-sensor"].includes(component.type) && (component.type !== "presence-sensor" || component.properties?.sensorKind === "door-window")) {
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
      const found = value.find(arg => arg.componentId === arg2);
      if (found) {
        ew(arg2, found);
      }
    },
    onError,
    onRuntimeStateChange() {
      const value = Number2();
      if (value?.type === "light-statistics") {
        C0(value);
      }
    },
    onPageChange(value) {
      R.value = value.path;
      oe(R);
      Q0(h?.document, value.path);
      Sv2?.setSelectedComponents([...selectedComponentIds], componentId);
      _e();
      ee();
    }
  }), Sv2.setEntityCatalog(le, Tu2, Ao2), Sv2);
}
function qr(value = null) {
  Hu();
  Pl();
  ju2();
  vp(h.document, vr2);
  const temp = ME(h.document, value);
  a0(temp);
  qu();
  if (!temp) {
    qt2();
    Sv2?.destroy();
    Sv2 = null;
    Dt2.innerHTML = "<div class=\"canvas-message\"><strong>请从左侧新建页面。</strong></div>";
    _e();
    ee();
    Ac2(value);
    if (Te === "popup") {
      Sp();
    }
    return;
  }
  Q0(h.document, R.value);
  if (Te === "edit") {
    jr().setDocument(h.document, R.value);
    Sv2.setActiveGroup(se2);
    Sv2.setSelectedComponents([...selectedComponentIds], componentId);
  } else {
    Sv2?.destroy();
    Sv2 = null;
  }
  _e();
  ee();
  if (Te === "dashboard") {
    Ac2(R.value);
  } else if (Te === "popup") {
    Sp();
  } else {
    Do2();
  }
}
function Xn() {
  Km.disabled = pe.busy || !pe.undo.length || !h;
  Jm.disabled = pe.busy || !pe.redo.length || !h;
}
function Gc(value = h?.projectId) {
  if (value) {
    Hi.cancel(value);
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
const Hi = createRecoveryWriter(hn2);
window.addEventListener("pagehide", Hi.flush);
window.addEventListener("beforeunload", Hi.flush);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    Hi.flush();
  }
});
function tw() {
  if (!h || !Dn) {
    return;
  }
  const value = {
    projectId: h.projectId,
    revision: h.revision,
    document: h.document,
    selectedPath: R.value,
    selectedComponentId: componentId,
    selectedComponentIds: [...selectedComponentIds],
    undo: [...pe.undo],
    redo: [...pe.redo],
    savedAt: new Date().toISOString()
  };
  Hi.schedule(value);
}
function hn2(projectId2) {
  try {
    sessionStorage.setItem(recoveryStorageKey(xc, projectId2.projectId), JSON.stringify(projectId2));
  } catch {
    try {
      sessionStorage.setItem(recoveryStorageKey(xc, projectId2.projectId), JSON.stringify({
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
function hn({
  preserveRecovery: arg111 = false
} = {}) {
  Dn = !!h && value389(h.document) !== Ai;
  Nm.disabled = !h || !Dn || Nc2;
  if (Dn) {
    tw();
  } else if (!arg111) {
    Gc();
  }
}
function aw() {
  pe.undo = [];
  pe.redo = [];
  pe.busy = false;
  Xn();
}
function Vi(value, arg2) {
  for (value.push(arg2); value.filter(arg => arg.kind !== "save").length > ku3;) {
    const temp = value.findIndex(arg => arg.kind !== "save");
    if (temp < 0) {
      break;
    }
    value.splice(temp, 1);
  }
  if (value.length > ku3 * 2) {
    value.splice(0, value.length - ku3 * 2);
  }
}
function Uc() {
  return {
    kind: "edit",
    document: cloneValue(h.document),
    selectedPath: R.value,
    selectedComponentId: componentId,
    selectedComponentIds: [...selectedComponentIds]
  };
}
async function xp(projectId, value = null) {
  Hi.flush();
  window.HABridgeLog?.setContext({
    projectId
  });
  h = await Z("/projects/" + projectId + "/draft");
  Du2 = "";
  let temp = Tc(jt2(h.document));
  if (!temp) {
    await Ir();
    temp = Tc(jt2(h.document));
  }
  if (!temp?.allowed) {
    throw new Error("当前授权尚未解锁该 UI 方案。");
  }
  await ensureUiPackRuntime(temp);
  Oo2.clear();
  Oi.clear();
  Bi.clear();
  $i.clear();
  Fi.clear();
  Oi2.clear();
  Ke2 = cloneValue(h.document);
  Ai = value389(h.document);
  bt2 = $E(projectId);
  if (bt2 && (bt2.revision !== h.revision || value389(bt2.document) === Ai)) {
    Gc(projectId);
    bt2 = null;
  }
  qt2();
  aw();
  hn({
    preserveRecovery: !!bt2
  });
  Ru(true);
  Le3.value = projectId;
  oe(Le3);
  qr(value);
  if (bt2 && !ni.open) {
    ni.showModal();
  }
}
async function ow(arg112 = null) {
  ft2 = (await Z("/projects")).items || [];
  Le3.replaceChildren();
  if (!ft2.length) {
    Sv2?.destroy();
    Sv2 = null;
    Do2();
    h = null;
    Hu();
    Oo2.clear();
    Oi.clear();
    Bi.clear();
    $i.clear();
    Fi.clear();
    Oi2.clear();
    qt2();
    Ke2 = null;
    Ai = "";
    bt2 = null;
    aw();
    hn();
    Ru(false);
    a0(false);
    Le3.append(new Option("暂无仪表盘", ""));
    R.replaceChildren(new Option("暂无页面", ""));
    ao2.replaceChildren(new Option("暂无组合弹窗", ""));
    Yo2.innerHTML = "<div class=\"popup-list-empty\">还没有组合弹窗</div>";
    Le3.disabled = true;
    R.disabled = true;
    ao2.disabled = true;
    ao.disabled = true;
    oe(Le3);
    oe(R);
    oe(ao2);
    _e();
    Ac2();
    return;
  }
  for (const name14 of ft2) {
    Le3.append(new Option(name14.name, name14.id));
  }
  Le3.disabled = false;
  oe(Le3);
  const chosen = arg112 && ft2.some(component => component.id === arg112) ? arg112 : ft2[0].id;
  await xp(chosen);
}
async function vt(value, arg2 = R.value, {
  recordHistory: arg = true
} = {}) {
  if (!h) {
    throw new Error("请先选择仪表盘。");
  }
  const document = h.document;
  await guardInteraction3dChanges(document, value);
  const temp = BE(document, value, arg2);
  const temp2 = Uc();
  if (value389(temp2.document) === value389(value)) {
    return h;
  }
  h = {
    ...h,
    document: cloneValue(value)
  };
  if (arg) {
    Vi(pe.undo, temp2);
    pe.redo = [];
  }
  const found = ft2.find(component => component.id === h.projectId);
  if (found) {
    found.name = h.document.name;
  }
  const element = Le3.selectedOptions[0];
  if (element) {
    element.textContent = h.document.name;
  }
  oe(Le3);
  if (temp && Sv2?.applyEditorComponentUpdates(h.document, arg2, temp)) {
    _e();
    ee();
  } else {
    qr(arg2);
  }
  hn();
  Xn();
  return h;
}
async function Np() {
  if (!h || !Dn || Nc2) {
    return;
  }
  const beforeSavedDocument = cloneValue(Ke2);
  const value = cloneValue(h.document);
  const temp = value389(value);
  const globalPopupsDirty = value389(value.customPopups || []) !== value389(Ke2.customPopups || []);
  Nc2 = true;
  hn();
  try {
    const temp2 = await Z("/projects/" + h.projectId + "/draft", {
      method: "PUT",
      hbLogContext: {
        projectId: h.projectId,
        phase: "save-draft"
      },
      body: JSON.stringify({
        revision: h.revision,
        globalPopupRevision: h.globalPopupRevision,
        globalPopupsDirty,
        document: h.document
      })
    });
    h = temp2;
    Ke2 = cloneValue(temp2.document);
    Ai = value389(temp2.document);
    Oi.clear();
    Bi.clear();
    $i.clear();
    Fi.clear();
    Oi2.clear();
    Vi(pe.undo, {
      kind: "save",
      beforeSavedDocument,
      afterSavedDocument: cloneValue(temp2.document)
    });
    pe.redo = [];
    const found = ft2.find(component => component.id === h.projectId);
    if (found) {
      found.name = h.document.name;
    }
    const element = Le3.selectedOptions[0];
    if (element) {
      element.textContent = h.document.name;
    }
    oe(Le3);
    if (value389(temp2.document) !== temp) {
      qr(R.value);
    }
  } catch (error) {
    onError(error);
  } finally {
    Nc2 = false;
    hn();
    Xn();
  }
}
async function FE(value, arg2) {
  const document = arg2 === "undo" ? value.beforeSavedDocument : value.afterSavedDocument;
  const globalPopupsDirty = value389(document.customPopups || []) !== value389(Ke2.customPopups || []);
  const document2 = cloneValue(h.document);
  const inputValue = R.value;
  const temp = await Z("/projects/" + h.projectId + "/draft", {
    method: "PUT",
    body: JSON.stringify({
      revision: h.revision,
      globalPopupRevision: h.globalPopupRevision,
      globalPopupsDirty,
      document
    })
  });
  Ke2 = cloneValue(temp.document);
  Ai = value389(temp.document);
  if (!globalPopupsDirty) {
    document2.customPopups = cloneValue(temp.document.customPopups || []);
  }
  h = {
    ...temp,
    document: document2
  };
  qr(inputValue);
  hn();
}
async function zE(arg113) {
  await Cr2.catch(() => {});
  if (pe.busy || !h) {
    return;
  }
  const flag = arg113 === "undo" ? pe.undo : pe.redo;
  const flag2 = arg113 === "undo" ? pe.redo : pe.undo;
  const document2 = flag.pop();
  if (document2) {
    pe.busy = true;
    Xn();
    Oi.clear();
    Bi.clear();
    $i.clear();
    Fi.clear();
    Oi2.clear();
    try {
      if (document2.kind === "save") {
        await FE(document2, arg113);
        Vi(flag2, document2);
      } else {
        const value99 = Uc();
        const length3 = Array.isArray(document2.selectedComponentIds) ? document2.selectedComponentIds.filter(arg10 => findComponent(document2.document, arg10)) : [];
        componentId = findComponent(document2.document, document2.selectedComponentId) ? document2.selectedComponentId : length3[0] || null;
        selectedComponentIds = new Set(length3.length ? length3 : componentId ? [componentId] : []);
        ku2 = componentId;
        await vt(document2.document, document2.selectedPath, {
          recordHistory: false
        });
        Vi(flag2, value99);
      }
    } catch (value156) {
      Vi(flag, document2);
      onError(value156);
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
  const value = await Z("/auth/me");
}
async function HE({
  preserveForm: arg114 = false
} = {}) {
  ie = await Z("/ha/connection");
  const value361 = to.open && !dt.hidden;
  if (!arg114 || !Xe2 && !value361) {
    dt.elements.name.value = ie.name || "Home Assistant";
    dt.elements.baseUrl.value = ie.baseUrl || "";
    dt.elements.accessToken.value = "";
    dt.elements.accessToken.placeholder = ie.hasToken ? "已加密保存，留空则保留原 Token" : "输入 Long-Lived Access Token";
    dt.elements.verifyTls.checked = ie.verifyTls !== false;
  }
  const value362 = !ie.connected && !!ie.lastError;
  fs.classList.toggle("connected", ie.connected);
  fs.classList.toggle("error", value362);
  fs.querySelector("span").textContent = ie.connected ? ("HA 已连接 · " + (ie.version || "")).trim() : ie.lastError ? "HA 连接异常" : ie.configured ? "HA 重连中" : "HA 未配置";
  _m.disabled = !ie.configured || !ie.baseUrl;
  Wi2();
}
async function VE() {
  const value = await Z("/ha/sync/status");
  Ue2 = value;
  const flag = value.counts || {
    entities: 0,
    devices: 0,
    areas: 0
  };
  lS.textContent = value.configured ? value.connected ? "已连接并实时同步" : value.status === "error" ? "连接异常" : "正在连接或同步" : "尚未配置";
  dS.textContent = "实体 " + flag.entities + " · 设备 " + flag.devices + " · 区域 " + flag.areas;
  Wi2();
  if (!value.configured) {
    Ti = null;
    Tu3 = false;
    if (le.length || Ao2.length || Object.keys(Tu2).length) {
      le = [];
      Ao2 = [];
      Iu2 = new Map();
      Tu2 = {};
      Sv2?.setEntityCatalog([], {}, []);
      xv2?.setEntityCatalog([], {}, []);
      _0();
      if (!document.activeElement?.closest?.(".inspector-form")) {
        ee();
      }
    }
    return;
  }
  const temp = JSON.stringify([Number.isFinite(Number(value.catalogRevision)) ? Number(value.catalogRevision) : value.lastFullSyncAt || "", Number(flag.entities || 0), Number(flag.devices || 0), Number(flag.areas || 0)]);
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
function Wi2() {
  const value = !!ie?.configured;
  pS.hidden = !value || Xe2;
  dt.hidden = value && !Xe2;
  uS.hidden = value && !Xe2;
  Pm.hidden = !value || !Xe2;
  if (!value) {
    return;
  }
  const flag = Ue2?.counts || {
    entities: 0,
    devices: 0,
    areas: 0
  };
  const flag2 = !!ie.connected || !!Ue2?.connected;
  const flag3 = !flag2 && (!!ie.lastError || !!Ue2?.lastError);
  Cm.classList.toggle("connected", flag2);
  Cm.classList.toggle("error", flag3);
  mS.textContent = ie.name || "Home Assistant";
  Im.textContent = flag2 ? "已连接并实时同步" : flag3 ? "连接异常" : "正在重连";
  xm.textContent = ie.baseUrl || "—";
  xm.title = ie.baseUrl || "";
  fS.textContent = ie.version || "未知";
  gS.textContent = "实体 " + flag.entities + " · 设备 " + flag.devices + " · 区域 " + flag.areas;
  Nm2.hidden = !flag3;
  Nm2.textContent = flag3 && (ie.lastError || Ue2?.lastError) || "";
}
function WE() {
  Xe2 = true;
  Wi2();
  z(no, "");
}
function RE() {
  Xe2 = false;
  Wi2();
}
function Ri(arg115) {
  return new Promise(arg100 => window.setTimeout(arg100, arg115));
}
async function jE2({
  preserveForm = true
} = {}) {
  return De2 || (De2 = Promise.all([HE({
    preserveForm
  }), VE()]).finally(() => {
    De2 = null;
  }), De2);
}
async function iw(value = 30000) {
  const temp = Date.now() + value;
  while (Date.now() < temp) {
    await jE2({
      preserveForm: false
    });
    if (ie?.connected) {
      return true;
    }
    if (ie?.lastError) {
      return false;
    }
    await Ri(500);
  }
  return !!ie?.connected;
}
function Yc(value = false) {
  const flag = new FormData(dt);
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
function Jc(arg116 = be2) {
  const some2 = cn2.find(component => component.id === "ui.base")?.dashboardTemplates || [];
  be2 = arg116 === "" || some2.some(component => component.id === arg116) ? arg116 : some2[0]?.id || "";
  const map2 = [{
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
  Il.replaceChildren(...map2.map(previewUrls => {
    const dataset4 = document.createElement("div");
    dataset4.className = "project-template-option" + (previewUrls.id === be2 ? " active" : "");
    dataset4.dataset.projectTemplateId = previewUrls.id;
    dataset4.dataset.previewUrls = JSON.stringify(previewUrls.previewUrls);
    dataset4.dataset.previewLabels = JSON.stringify(previewUrls.previewLabels);
    dataset4.dataset.previewIndex = "0";
    dataset4.setAttribute("role", "radio");
    dataset4.setAttribute("aria-checked", String(previewUrls.id === be2));
    dataset4.tabIndex = 0;
    const className3 = document.createElement("div");
    className3.className = "project-template-carousel" + (previewUrls.previewUrls.length ? "" : " blank");
    if (previewUrls.previewUrls.length) {
      const type5 = document.createElement("button");
      type5.type = "button";
      type5.className = "project-template-preview-open";
      type5.dataset.projectPreviewAction = "open";
      type5.title = "点击放大预览";
      const src = document.createElement("img");
      src.src = previewUrls.previewUrls[0];
      src.alt = previewUrls.previewLabels[0] || previewUrls.name + "预览 1";
      src.loading = "eager";
      type5.append(src);
      const type6 = document.createElement("button");
      type6.type = "button";
      type6.className = "project-template-carousel-arrow previous";
      type6.dataset.projectPreviewAction = "previous";
      type6.setAttribute("aria-label", "上一张预览");
      type6.textContent = "‹";
      const type7 = document.createElement("button");
      type7.type = "button";
      type7.className = "project-template-carousel-arrow next";
      type7.dataset.projectPreviewAction = "next";
      type7.setAttribute("aria-label", "下一张预览");
      type7.textContent = "›";
      const className = document.createElement("div");
      className.className = "project-template-carousel-meta";
      const textContent = document.createElement("strong");
      textContent.textContent = previewUrls.previewLabels[0] || "栖光预览";
      const textContent2 = document.createElement("span");
      textContent2.textContent = "1 / " + previewUrls.previewUrls.length;
      className.append(textContent, textContent2);
      className3.append(type5, type6, type7, className);
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
  it2.hidden = false;
  if (be === "create") {
    const id3 = map2.find(component => component.id === be2);
    ta.elements.name.value = id3?.id ? id3.name : "我的仪表盘";
    const readOnly = !!id3?.id;
    it.readOnly = readOnly;
    at.readOnly = readOnly;
    it.value = String(readOnly ? id3.canvasWidth : sn2);
    at.value = String(readOnly ? id3.canvasHeight : hr);
    it2.classList.toggle("fixed", readOnly);
    it2.classList.remove("name-only");
    Bm2.textContent = readOnly ? "栖光使用固定画布分辨率，创建时会完整保留页面布局与比例。" : "编辑器和仪表盘将共用该分辨率与比例，显示时只做等比缩放。";
    Ur();
    rw(readOnly);
  }
}
function cw(value) {
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
  const {
    urls: temp,
    labels: temp2
  } = cw(value);
  if (!temp.length) {
    return;
  }
  const number = (Number(arg2) % temp.length + temp.length) % temp.length;
  value.dataset.previewIndex = String(number);
  const element = value.querySelector(".project-template-preview-open img");
  const element2 = value.querySelector(".project-template-carousel-meta strong");
  const element3 = value.querySelector(".project-template-carousel-meta span");
  if (element) {
    element.src = temp[number];
    element.alt = temp2[number] || "栖光预览 " + (number + 1);
  }
  if (element2) {
    element2.textContent = temp2[number] || "栖光预览";
  }
  if (element3) {
    element3.textContent = number + 1 + " / " + temp.length;
  }
}
function Yr() {
  if (To.length) {
    gt2 = (gt2 % To.length + To.length) % To.length;
    km2.src = To[gt2];
    km2.alt = Su2[gt2] || "栖光预览 " + (gt2 + 1);
    $S.textContent = Su2[gt2] || "栖光预览";
    FS.textContent = gt2 + 1 + " / " + To.length;
  }
}
function Ep(dataset29) {
  const {
    urls: length14,
    labels: value363
  } = cw(dataset29);
  if (length14.length) {
    To = length14;
    Su2 = value363;
    gt2 = Number(dataset29.dataset.previewIndex || 0);
    Yr();
    Zo.showModal();
  }
}
function Lp(value = "create") {
  be = value;
  const flag = value === "edit";
  const value2 = value === "resize";
  ta.reset();
  CS2.textContent = value2 ? "RESIZE DASHBOARD" : flag ? "EDIT PROJECT" : "NEW PROJECT";
  kS.textContent = value2 ? "修改仪表盘分辨率" : flag ? "修改仪表盘" : "创建仪表盘项目";
  Ll.textContent = value2 ? "应用修改" : flag ? "保存修改" : "创建项目";
  ta.elements.name.value = flag || value2 ? h?.document?.name || "" : "我的仪表盘";
  Ko.hidden = flag || value2;
  it.readOnly = false;
  at.readOnly = false;
  kS2.checked = false;
  ws.hidden = !value2;
  it2.classList.remove("fixed", "name-only");
  if (!flag && !value2) {
    sn2 = 2778;
    hr = 1940;
    br = false;
    yr = 2778;
    vr = 1940;
    it.value = "2778";
    at.value = "1940";
    Ur();
    Jc("dwell-light");
  } else if (flag) {
    it2.hidden = false;
    it2.classList.add("name-only");
  } else {
    be2 = "";
    const value202 = Number(h?.document?.canvas?.width || 2778);
    const value203 = Number(h?.document?.canvas?.height || 1940);
    sn2 = value202;
    hr = value203;
    br = true;
    yr = value202;
    vr = value203;
    it2.hidden = false;
    it.value = String(value202);
    at.value = String(value203);
    Bm2.textContent = "默认会同步调整所有页面、控件和弹窗；勾选“锁定控件大小及位置”后只改变画布，内容本身不会缩放或重新定位。";
    Ur();
    rw(false);
  }
  z(Nl, "");
  Yt.showModal();
}
function Ur() {
  const numeric = Number(it.value);
  const numeric2 = Number(at.value);
  if (!Number.isInteger(numeric) || !Number.isInteger(numeric2) || numeric <= 0 || numeric2 <= 0) {
    Mm2.textContent = "等待输入有效分辨率";
    return;
  }
  const value = !be2 && br ? yr : numeric;
  const chosen = !be2 && br ? vr : numeric2;
  const temp = greatestCommonDivisor(value, chosen);
  Mm2.textContent = value / temp + " : " + chosen / temp;
}
function rw(element3 = !!be2) {
  const numeric = element3 || br;
  oa.disabled = element3;
  oa.setAttribute("aria-pressed", String(numeric));
  oa.classList.toggle("locked", numeric);
  PS.textContent = element3 ? "固定" : numeric ? "已锁定" : "锁定";
  oa.title = element3 ? "栖光画布使用固定比例" : numeric ? "点击解锁画布比例" : "锁定当前画布比例";
}
function Xc(value) {
  if (be2 || !br) {
    return;
  }
  const temp = Number(yr);
  const value364 = Number(vr);
  if (!!temp && !!value364) {
    if (value === "width") {
      let value157 = Number(it.value);
      if (!Number.isInteger(value157) || value157 < 320 || value157 > 7680) {
        return;
      }
      let value158 = Math.round(value157 * value364 / temp);
      if (value158 < 240 || value158 > 4320) {
        value158 = Math.max(240, Math.min(4320, value158));
        value157 = Math.max(320, Math.min(7680, Math.round(value158 * temp / value364)));
        it.value = String(value157);
      }
      at.value = String(value158);
    } else {
      let value159 = Number(at.value);
      if (!Number.isInteger(value159) || value159 < 240 || value159 > 4320) {
        return;
      }
      let value160 = Math.round(value159 * temp / value364);
      if (value160 < 320 || value160 > 7680) {
        value160 = Math.max(320, Math.min(7680, value160));
        value159 = Math.max(240, Math.min(4320, Math.round(value160 * value364 / temp)));
        at.value = String(value159);
      }
      it.value = String(value160);
    }
  }
}
function UE(value, arg2, arg3) {
  HS.textContent = "当前分辨率为 " + arg2 + " × " + arg3 + "，预计有 " + value + " 个控件会部分或全部位于画布范围之外。";
  return new Promise(arg => {
    Nu = arg;
    xs.showModal();
  });
}
function sw(arg117) {
  const flag = Nu;
  Nu = null;
  if (xs.open) {
    xs.close();
  }
  flag?.(arg117);
}
function cw2(arg118 = "create") {
  if (!h) {
    return;
  }
  yr2 = arg118;
  const value365 = arg118 === "rename";
  Ns.reset();
  DS2.textContent = value365 ? "EDIT PAGE" : "NEW PAGE";
  zS2.textContent = value365 ? "重命名页面" : "新建页面";
  Tl.textContent = value365 ? "保存修改" : "创建页面";
  Ns.elements.name.value = value365 && Je2()?.name || "";
  z(VS2, "");
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
function uw(element) {
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
  const value366 = ["CONNECTION_WARNING", "STARTUP_VALIDATION_REQUIRED"].includes(hbFloorplanAutoDiagramLoading);
  const value367 = ["LEASE_EXPIRED", "INSTANCE_MISMATCH", "INVALID", "REVOKED", "CLOCK_ROLLBACK"].includes(hbFloorplanAutoDiagramLoading);
  ea.classList.toggle("connected", temp);
  ea.classList.toggle("warning", value366);
  ea.classList.toggle("error", value367);
  ea.querySelector("span").textContent = !element?.required && hbFloorplanAutoDiagramLoading === "UNACTIVATED" ? "授权 · 开发模式" : value[hbFloorplanAutoDiagramLoading] || "授权状态";
  XC.className = temp ? "connected" : value366 ? "warning" : value367 ? "error" : "";
  KC2.textContent = value[hbFloorplanAutoDiagramLoading] || hbFloorplanAutoDiagramLoading;
  wm.textContent = element?.activationCodeId ? "当前编辑器的授权与附加包" : element?.required ? "尚未激活" : "开发模式";
  to2.render(element);
  us.hidden = !element?.lastError;
  us.textContent = element?.lastError || "";
  Xo.hidden = !["UNACTIVATED", "DEACTIVATED", "INVALID", "INSTANCE_MISMATCH", "REVOKED"].includes(hbFloorplanAutoDiagramLoading);
}
async function Kc() {
  const value = await Z("/license/status");
  if (value?.required && !value.allowed) {
    window.location.replace("/license");
    return value;
  }
  const temp = JSON.stringify([...(value?.features || [])].sort());
  const flag = zu2 !== null && zu2 !== temp;
  zu2 = temp;
  const chosen = h ? Tc(jt2(h.document)) : null;
  const allowed = new Set(Array.isArray(value?.features) ? value.features : []);
  if (value?.required && chosen?.featureCode && !allowed.has(chosen.featureCode)) {
    const number = "当前授权已不再包含“" + chosen.name + "”，该仪表盘已停止显示和编辑。";
    Sv2?.destroy();
    Sv2 = null;
    Do2();
    h = null;
    qt2();
    Ru(false);
    const temp2 = document.createElement("div");
    temp2.className = "canvas-message";
    const element = document.createElement("strong");
    element.textContent = number;
    temp2.append(element);
    Dt2.replaceChildren(temp2);
    if (Du2 !== chosen.id) {
      Du2 = chosen.id;
      onError(new Error(number));
    }
  }
  if (flag) {
    await Promise.all([gn({
      refreshInspector: false
    }), Ir()]);
  }
  uw(value);
  return value;
}
ea.addEventListener("click", async () => {
  z(ms, "");
  try {
    const value = await Kc();
    if (!value?.required || value.allowed) {
      Yo.showModal();
    }
  } catch (value161) {
    onError(value161);
  }
});
oS.addEventListener("click", () => Yo.close());
Yo.addEventListener("click", target6 => {
  if (target6.target === Yo) {
    Yo.close();
  }
});
Xo.addEventListener("submit", async value => {
  value.preventDefault();
  const disabled2 = Xo.querySelector("button[type=\"submit\"]");
  const activationCode = String(new FormData(Xo).get("activationCode") || "").trim();
  const email = String(new FormData(Xo).get("email") || "").trim();
  disabled2.disabled = true;
  z(ms, "正在绑定实例并获取签名租约…");
  try {
    const value162 = await Z("/license/activate", {
      method: "POST",
      body: JSON.stringify({
        activationCode,
        email
      })
    });
    Xo.reset();
    uw(value162);
    z(ms, "当前实例已成功激活。", "success");
  } catch (message2) {
    z(ms, message2.message, "error");
  } finally {
    disabled2.disabled = false;
  }
});
fs.addEventListener("click", async () => {
  Xe2 = false;
  z(no, "");
  await jE2({
    preserveForm: false
  });
  to.showModal();
});
gl.addEventListener("click", () => {
  Xe2 = false;
  to.close();
});
to.addEventListener("click", event => {
  if (event.target === to) {
    Xe2 = false;
    to.close();
  }
});
dt.addEventListener("input", () => {
  if (!dt.hidden) {
    Xe2 = true;
  }
});
yl.addEventListener("click", async () => {
  z(no, "正在测试地址、Token 和版本…");
  yl.disabled = true;
  try {
    const locationName = await Z("/ha/test", {
      method: "POST",
      body: JSON.stringify(Yc(true))
    });
    z(no, "连接成功：" + (locationName.locationName || "Home Assistant") + " · " + (locationName.version || "未知版本"), "success");
  } catch (message3) {
    z(no, message3.message, "error");
  } finally {
    yl.disabled = false;
  }
});
dt.addEventListener("submit", async event => {
  event.preventDefault();
  const disabled3 = dt.querySelector("button[type=\"submit\"]");
  disabled3.disabled = true;
  z(no, "正在验证并加密保存连接…");
  try {
    ie = await Z("/ha/connection", {
      method: "PUT",
      body: JSON.stringify(Yc(false))
    });
    Xe2 = false;
    Wi2();
    if (!(await iw()) && !ie?.lastError && Ue2?.status !== "error") {
      Im.textContent = "后台仍在建立实时连接";
    }
  } catch (message4) {
    Xe2 = true;
    Wi2();
    z(no, message4.message, "error");
  } finally {
    disabled3.disabled = false;
  }
});
hS.addEventListener("click", WE);
Pm.addEventListener("click", RE);
oo2.addEventListener("click", () => {
  gs.reset();
  z(Le2, "");
  to.close();
  oo.showModal();
});
ps.addEventListener("click", () => oo.close());
vS.addEventListener("click", () => oo.close());
oo.addEventListener("click", target7 => {
  if (target7.target === oo) {
    oo.close();
  }
});
gs.addEventListener("submit", async preventDefault2 => {
  preventDefault2.preventDefault();
  if (String(new FormData(gs).get("confirmation") || "").trim() !== "删除连接") {
    z(Le2, "请输入“删除连接”确认。", "error");
    return;
  }
  const disabled4 = gs.querySelector("button[type=\"submit\"]");
  disabled4.disabled = true;
  z(Le2, "正在断开连接并清除同步目录…");
  try {
    await Z("/ha/connection", {
      method: "DELETE"
    });
    oo.close();
    ie = null;
    Ue2 = null;
    Xe2 = false;
    await jE2({
      preserveForm: false
    });
  } catch (message5) {
    z(Le2, message5.message, "error");
  } finally {
    disabled4.disabled = false;
  }
});
wS.addEventListener("click", async () => {
  if (!_r()) {
    try {
      if (!cn2.length) {
        await Ir();
      }
      Lp("create");
    } catch (value100) {
      onError(value100);
    }
  }
});
km.addEventListener("click", async () => {
  if (h) {
    z(gS2, "");
    try {
      await Ir();
      n0();
      io.showModal();
    } catch (value101) {
      onError(value101);
    }
  }
});
NS.addEventListener("click", () => io.close());
io.addEventListener("click", target8 => {
  if (target8.target === io) {
    io.close();
  }
});
hl.addEventListener("click", async value => {
  const disabled5 = value.target.closest("[data-ui-pack-id]");
  if (!disabled5 || disabled5.disabled || !h) {
    return;
  }
  const allowed = cn2.find(component => component.id === disabled5.dataset.uiPackId);
  if (!allowed?.allowed) {
    z(gS2, "当前授权尚未解锁该 UI 方案。", "error");
    return;
  }
  disabled5.disabled = true;
  z(gS2, "正在加载并应用整套 UI…");
  try {
    await ensureUiPackRuntime(allowed);
    await L(arg15 => applyUiPackToDocument(arg15, allowed));
    io.close();
  } catch (message6) {
    z(gS2, message6.message, "error");
    disabled5.disabled = false;
  }
});
MS.addEventListener("click", () => Yt.close());
OS.addEventListener("click", () => Yt.close());
Yt.addEventListener("click", target9 => {
  if (target9.target === Yt) {
    Yt.close();
  }
});
Il.addEventListener("click", target10 => {
  const dataset10 = target10.target.closest("[data-project-template-id]");
  if (!dataset10 || be !== "create") {
    return;
  }
  const value210 = target10.target.closest("[data-project-preview-action]")?.dataset.projectPreviewAction;
  if (value210) {
    target10.stopPropagation();
    if (value210 === "open" && (dataset10.dataset.projectTemplateId || "") !== be2) {
      be2 = dataset10.dataset.projectTemplateId || "";
      Jc(be2);
    } else if (value210 === "open") {
      Ep(dataset10);
    } else {
      qE(dataset10, Number(dataset10.dataset.previewIndex || 0) + (value210 === "next" ? 1 : -1));
    }
    return;
  }
  be2 = dataset10.dataset.projectTemplateId || "";
  Jc(be2);
});
Il.addEventListener("keydown", target11 => {
  if (!["Enter", " "].includes(target11.key) || target11.target.closest("button")) {
    return;
  }
  const dataset11 = target11.target.closest("[data-project-template-id]");
  if (!!dataset11 && be === "create") {
    target11.preventDefault();
    be2 = dataset11.dataset.projectTemplateId || "";
    Jc(be2);
  }
});
VS.addEventListener("click", () => Zo.close());
DS.addEventListener("click", () => {
  gt2 -= 1;
  Yr();
});
zS.addEventListener("click", () => {
  gt2 += 1;
  Yr();
});
Zo.addEventListener("click", target12 => {
  if (target12.target === Zo) {
    Zo.close();
  }
});
Zo.addEventListener("keydown", value => {
  if (value.key === "ArrowLeft") {
    gt2 -= 1;
    Yr();
  }
  if (value.key === "ArrowRight") {
    gt2 += 1;
    Yr();
  }
});
it.addEventListener("input", () => {
  Xc("width");
  if (!be2) {
    sn2 = Number(it.value) || 2778;
    hr = Number(at.value) || 1940;
  }
  Ur();
});
at.addEventListener("input", () => {
  Xc("height");
  if (!be2) {
    sn2 = Number(it.value) || 2778;
    hr = Number(at.value) || 1940;
  }
  Ur();
});
oa.addEventListener("click", () => {
  if (be2 || !["create", "resize"].includes(be)) {
    return;
  }
  const value211 = Number(it.value);
  const value212 = Number(at.value);
  if (!Number.isInteger(value211) || !Number.isInteger(value212) || value211 < 320 || value211 > 7680 || value212 < 240 || value212 > 4320) {
    z(Nl, "请先输入有效的宽度和高度后再锁定比例。", "error");
    return;
  }
  br = !br;
  if (br) {
    yr = value211;
    vr = value212;
  }
  z(Nl, "");
  rw(false);
});
jS.addEventListener("click", () => sw(false));
qS.addEventListener("click", () => sw(false));
GS.addEventListener("click", () => sw(true));
xs.addEventListener("cancel", preventDefault3 => {
  preventDefault3.preventDefault();
  sw(false);
});
ta.addEventListener("submit", async value => {
  value.preventDefault();
  const projectAction = new FormData(ta);
  const name15 = String(projectAction.get("name") || "").trim();
  const canvasWidth = Number(projectAction.get("canvasWidth"));
  const canvasHeight = Number(projectAction.get("canvasHeight"));
  const lockContent = be === "resize" && kS2.checked;
  if (be === "resize" && lockContent) {
    const value163 = Number(h?.document?.canvas?.width || 2778);
    const value164 = Number(h?.document?.canvas?.height || 1940);
    const value165 = canvasWidth !== value163 || canvasHeight !== value164 ? countComponentsOutsideCanvas(h.document, canvasWidth, canvasHeight) : 0;
    if (value165 > 0 && !(await UE(value165, canvasWidth, canvasHeight))) {
      return;
    }
  }
  Ll.disabled = true;
  z(Nl, be === "resize" ? "正在调整整个仪表盘…" : be === "edit" ? "正在保存仪表盘名称…" : be2 ? "正在套用栖光整套模板…" : "正在创建空白仪表盘…");
  try {
    if (be === "resize") {
      const name8 = resizeDashboardDocument(h.document, canvasWidth, canvasHeight, {
        lockContent
      });
      name8.name = name15;
      await vt(name8);
      Yt.close();
    } else if (be === "edit") {
      const name7 = cloneValue(h.document);
      name7.name = name15;
      await vt(name7);
      Yt.close();
    } else {
      const templateId = {
        name: name15,
        canvasWidth,
        canvasHeight,
        uiPackId: "ui.base"
      };
      if (be2) {
        templateId.templateId = be2;
      }
      const id3 = await Z("/projects", {
        method: "POST",
        body: JSON.stringify(templateId)
      });
      Yt.close();
      await ow(id3.id);
    }
  } catch (message7) {
    z(Nl, message7.message, "error");
  } finally {
    Ll.disabled = false;
  }
});
fs2.addEventListener("click", () => {
  const value213 = ys.hidden;
  Ht2();
  Wn();
  pn();
  ys.hidden = !value213;
  fs2.setAttribute("aria-expanded", String(value213));
});
CS.addEventListener("click", () => {
  if (!_r()) {
    window.location.assign("/3d-studio");
  }
});
ys.addEventListener("click", async value => {
  const value214 = value.target.closest("[data-project-action]")?.dataset.projectAction;
  if (!!value214 && !!h && (Wn(), !_r())) {
    if (value214 === "edit") {
      Lp("edit");
      return;
    }
    if (value214 === "resize") {
      Lp("resize");
      return;
    }
    if (value214 === "duplicate") {
      const value102 = h.document.name;
      const has = new Set(ft2.map(name4 => name4.name));
      let name9 = value102 + " 副本";
      let value103 = 2;
      while (has.has(name9)) {
        name9 = value102 + " 副本 " + value103++;
      }
      try {
        const id3 = await Z("/projects/" + h.projectId + "/duplicate", {
          method: "POST",
          body: JSON.stringify({
            name: name9
          })
        });
        await ow(id3.id);
      } catch (value63) {
        onError(value63);
      }
      return;
    }
    if (value214 === "delete") {
      const name10 = ft2.find(component => component.id === h.projectId);
      if (!name10) {
        return;
      }
      Ls.reset();
      Xt2.textContent = "“" + name10.name + "”";
      St.dataset.projectId = name10.id;
      St.dataset.projectName = name10.name;
      z(KS, "");
      St.showModal();
    }
  }
});
xs2.addEventListener("click", () => St.close());
a1.addEventListener("click", () => St.close());
St.addEventListener("click", target13 => {
  if (target13.target === St) {
    St.close();
  }
});
Ls.addEventListener("submit", async preventDefault4 => {
  preventDefault4.preventDefault();
  const disabled6 = Ls.querySelector("button[type=\"submit\"]");
  const confirmation = String(new FormData(Ls).get("confirmation") || "");
  const value215 = St.dataset.projectId;
  const value216 = St.dataset.projectName;
  if (confirmation !== value216) {
    z(KS, "请输入与项目名称完全一致的确认文字。", "error");
    return;
  }
  disabled6.disabled = true;
  z(KS, "正在删除项目和草稿…");
  try {
    await Z("/projects/" + value215, {
      method: "DELETE",
      body: JSON.stringify({
        confirmation
      })
    });
    Gc(value215);
    St.close();
    Sv2?.destroy();
    Sv2 = null;
    h = null;
    qt2();
    await ow();
  } catch (message8) {
    z(KS, message8.message, "error");
  } finally {
    disabled6.disabled = false;
  }
});
Mm.addEventListener("click", () => cw2("create"));
Cs2.addEventListener("click", () => so.close());
XS.addEventListener("click", () => so.close());
so.addEventListener("click", target14 => {
  if (target14.target === so) {
    so.close();
  }
});
Ns.addEventListener("submit", async value => {
  value.preventDefault();
  const name16 = String(new FormData(Ns).get("name") || "").trim();
  const pages3 = cloneValue(h.document);
  const value217 = R.value;
  Tl.disabled = true;
  z(VS2, yr2 === "rename" ? "正在保存页面名称…" : "正在创建页面…");
  try {
    if (yr2 === "rename") {
      const name11 = pages3.pages.find(path4 => path4.path === value217);
      name11.name = name16;
      await vt(pages3, value217);
    } else {
      const path5 = {
        id: newId("page"),
        name: name16,
        path: uniquePagePath(h?.document?.pages, name16),
        sharedComponentIds: pages3.sharedComponents.map(id3 => id3.id),
        components: []
      };
      const value104 = Math.max(0, pages3.pages.findIndex(path => path.path === value217));
      pages3.pages.splice(value104 + 1, 0, path5);
      await vt(pages3, path5.path);
    }
    so.close();
  } catch (message9) {
    z(VS2, message9.message, "error");
  } finally {
    Tl.disabled = false;
  }
});
$m.addEventListener("click", () => Ct.close());
JS.addEventListener("click", () => Ct.close());
Ct.addEventListener("click", value => {
  if (value.target === Ct) {
    Ct.close();
  }
});
Wm.addEventListener("submit", preventDefault5 => {
  preventDefault5.preventDefault();
  const value218 = Ct.dataset.groupId || "";
  const type13 = findComponent(h?.document, value218)?.component;
  if (!type13 || type13.type !== "group") {
    Ct.close();
    return;
  }
  const value219 = componentLabel(type13);
  const label2 = String(new FormData(Wm).get("name") || "").trim().slice(0, 128);
  if (!label2) {
    z(Hm, "请输入组合名称。", "error");
    return;
  }
  if (label2 === value219) {
    Ct.close();
    return;
  }
  L(arg53 => {
    const properties30 = findComponent(arg53, value218)?.component;
    if (properties30?.type === "group") {
      properties30.properties = {
        ...(properties30.properties || {}),
        label: label2
      };
    }
  });
  Ct.close();
});
bs.addEventListener("click", () => {
  const value220 = Cs.hidden;
  Ht2();
  Wn();
  pn();
  Cs.hidden = !value220;
  bs.setAttribute("aria-expanded", String(value220));
});
Cs.addEventListener("click", async value => {
  const value221 = value.target.closest("[data-page-action]")?.dataset.pageAction;
  const path10 = Je2();
  if (!value221 || !path10 || !h) {
    return;
  }
  pn();
  if (value221 === "rename") {
    cw2("rename");
    return;
  }
  const pages4 = cloneValue(h.document);
  const value222 = pages4.pages.findIndex(path6 => path6.path === path10.path);
  if (value221 === "default") {
    if (pages4.defaultPagePath === path10.path) {
      return;
    }
    pages4.defaultPagePath = path10.path;
    try {
      await vt(pages4, path10.path);
      await Np();
    } catch (value105) {
      onError(value105);
    }
    return;
  }
  if (value221 === "duplicate") {
    const path9 = clonePageWithFreshIds(path10, path10.name + " 副本", h.document.pages);
    pages4.pages.splice(value222 + 1, 0, path9);
    try {
      await vt(pages4, path9.path);
    } catch (value106) {
      onError(value106);
    }
    return;
  }
  if (value221 === "delete") {
    Xt.dataset.pagePath = path10.path;
    Kt2.textContent = "“" + path10.name + "”";
    z(QS2, "");
    Xt.showModal();
  }
});
kl.addEventListener("click", () => Xt.close());
c1.addEventListener("click", () => Xt.close());
Xt.addEventListener("click", target15 => {
  if (target15.target === Xt) {
    Xt.close();
  }
});
Bl.addEventListener("click", async () => {
  const value223 = Xt.dataset.pagePath;
  const pages5 = cloneValue(h.document);
  const value224 = pages5.pages.findIndex(path7 => path7.path === value223);
  if (value224 < 0) {
    z(QS2, "页面已经不存在，请刷新后重试。", "error");
    return;
  }
  const name17 = pages5.pages[value224];
  pages5.pages.splice(value224, 1);
  const target16 = pages5.pages[Math.max(0, value224 - 1)]?.path || pages5.pages[0]?.path || null;
  const name18 = pages5.pages.find(path8 => path8.path === target16);
  if (pages5.defaultPagePath === value223) {
    pages5.defaultPagePath = target16;
  }
  const value225 = arg54 => {
    for (const properties12 of arg54 || []) {
      properties12.properties = {
        ...(properties12.properties || {})
      };
      if (properties12.type === "navigation-button" && properties12.properties.targetPage === value223) {
        if (!properties12.properties.mainText || properties12.properties.mainText === "页面导航" || properties12.properties.mainText === name17?.name) {
          properties12.properties.mainText = name18?.name || "页面导航";
        }
        const value29 = String(value223).replace(/[-_]+/g, " ").toUpperCase();
        if (!properties12.properties.secondaryText || properties12.properties.secondaryText === "NAVIGATION" || properties12.properties.secondaryText === value29) {
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
      for (const value34 of ["tap", "doubleTap", "hold"]) {
        if (properties12.actions[value34]?.type === "navigate" && properties12.actions[value34]?.target === value223) {
          if (properties12.type === "navigation-button" && target16) {
            properties12.actions[value34] = {
              type: "navigate",
              target: target16
            };
          } else {
            delete properties12.actions[value34];
          }
        }
      }
      value225(properties12.children);
    }
  };
  value225(pages5.sharedComponents);
  for (const components5 of pages5.pages) {
    value225(components5.components);
  }
  Bl.disabled = true;
  z(QS2, "正在删除页面…");
  try {
    await vt(pages5, target16);
    Xt.close();
  } catch (message10) {
    z(QS2, message10.message, "error");
  } finally {
    Bl.disabled = false;
  }
});
Pe.addEventListener("click", value => {
  const value226 = Ou;
  const value227 = value.target.closest("[data-component-action]")?.dataset.componentAction;
  const dataset12 = value.target.closest("[data-label-color]");
  if (!value226 || !value227 && !dataset12) {
    return;
  }
  const map = selectedComponentIds.has(value226) ? [...selectedComponentIds] : [value226];
  _u();
  if (value227 === "copy") {
    f0(map, value226);
    return;
  }
  if (value227 === "group") {
    IN2(map);
    return;
  }
  if (value227 === "ungroup") {
    TN2(value226);
    return;
  }
  if (value227 === "rename-group") {
    AN2(value226);
    return;
  }
  if (value227 === "copy-to-page") {
    DN(map);
    return;
  }
  if (value227 === "visibility") {
    const length5 = map.map(arg9 => findComponent(h?.document, arg9)?.component).filter(Boolean).map(style2 => style2.style?.visible !== false);
    if (length5.length !== map.length || !length5.length || !length5.every(arg12 => arg12 === length5[0])) {
      return;
    }
    u0(map, !length5[0]);
    return;
  }
  if (value227 === "delete") {
    h0(map);
    return;
  }
  if (dataset12) {
    zN(map, dataset12.dataset.labelColor);
  }
});
d1.addEventListener("click", () => at2.close());
u1.addEventListener("click", () => at2.close());
at2.addEventListener("click", value => {
  if (value.target === at2) {
    at2.close();
  }
});
m1.addEventListener("click", () => at3.close());
f1.addEventListener("click", () => at3.close());
at3.addEventListener("click", value => {
  if (value.target === at3) {
    at3.close();
  }
});
v1.addEventListener("click", () => {
  xr2 = null;
  ti2.close();
});
w1.addEventListener("click", () => {
  BN2().catch(onError);
});
ti2.addEventListener("click", event => {
  if (event.target === ti2) {
    xr2 = null;
    ti2.close();
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
$l.addEventListener("submit", async event => {
  event.preventDefault();
  let length7 = [];
  try {
    length7 = JSON.parse(at3.dataset.componentIds || "[]");
  } catch {
    length7 = [];
  }
  const replace = qm.value;
  const value228 = vn.value === "other";
  if (!!h && !!length7.length && !!replace) {
    s1.disabled = true;
    z(ti, "正在复制控件…");
    try {
      if (value228) {
        const projectId = ei.value;
        if (!projectId || !xr || xr.projectId !== projectId) {
          throw new Error("目标仪表盘尚未加载完成，请稍后重试。");
        }
        const document = cloneValue(xr.document);
        const scaleMode = Ls2.hidden ? "none" : $l.elements.copyScaleMode.value;
        let value64 = 0;
        const length2 = copyComponentsAcrossDocuments(h.document, document, length7, replace, {
          cloneValue,
          createId: () => newId("component"),
          componentLabel,
          scaleMode,
          onInvalidAction: () => {
            value64 += 1;
          }
        });
        if (!length2.length) {
          throw new Error("目标页面或源控件已发生变化，请重新操作。");
        }
        const revision = await Z("/projects/" + encodeURIComponent(projectId) + "/draft", {
          method: "PUT",
          body: JSON.stringify({
            revision: xr.revision,
            globalPopupRevision: xr.globalPopupRevision,
            globalPopupsDirty: false,
            document
          })
        });
        xr = revision;
        const draftRevision = ft2.find(component => component.id === projectId);
        if (draftRevision) {
          draftRevision.draftRevision = revision.revision;
        }
        const value65 = draftRevision?.name || "目标仪表盘";
        const value66 = qm.selectedOptions[0]?.textContent || "目标区域";
        const value67 = value64 ? "（已清理 " + value64 + " 个目标仪表盘不存在的跳转或弹窗动作）" : "";
        at3.close();
        m0("已复制 " + length2.length + " 个控件到“" + value65 + "”的“" + value66 + "”，并已保存" + value67 + "。", {
          projectId,
          pagePath: replace === "shared" ? xr.document.pages?.[0]?.path : replace.replace(/^page:/, ""),
          scope: replace === "shared" ? "shared" : "page"
        });
        return;
      }
      const value107 = cloneValue(h.document);
      const length4 = copyComponentsToTarget(value107, length7, replace, {
        cloneValue,
        createId: () => newId("component"),
        componentLabel
      });
      if (!length4.length) {
        throw new Error("目标页面或源控件已发生变化，请重新操作。");
      }
      componentId = length4[0].id;
      selectedComponentIds = new Set(length4.map(sharedComponentIds => sharedComponentIds.id));
      ku2 = length4[0].id;
      const pagePath = replace === "shared" ? R.value : replace.replace(/^page:/, "");
      const value108 = qm.selectedOptions[0]?.textContent || "目标区域";
      await vt(value107, pagePath);
      at3.close();
      m0("已复制 " + length4.length + " 个控件到“" + value108 + "”，并已保存。", {
        projectId: h.projectId,
        pagePath,
        scope: replace === "shared" ? "shared" : "page"
      });
    } catch (message) {
      z(ti, message.message, "error");
    } finally {
      if (!value228 || !ti.classList.contains("success")) {
        s1.disabled = false;
      }
    }
  }
});
p1.addEventListener("click", () => {
  let length8 = [];
  try {
    length8 = JSON.parse(at2.dataset.componentIds || "[]");
  } catch {
    length8 = [];
  }
  if (!length8.length) {
    return;
  }
  at2.close();
  const has3 = new Set(length8);
  selectedComponentIds = new Set([...selectedComponentIds].filter(arg24 => !has3.has(arg24)));
  if (has3.has(componentId)) {
    componentId = selectedComponentIds.values().next().value || null;
  }
  if (has3.has(ku2)) {
    ku2 = componentId;
  }
  L(arg55 => {
    for (const value70 of length8) {
      kc2(arg55, value70);
    }
  });
});
ia.addEventListener("submit", event => event.preventDefault());
si2.addEventListener("submit", event => event.preventDefault());
ks.addEventListener("submit", event => event.preventDefault());
ud.addEventListener("submit", event => event.preventDefault());
ui2.addEventListener("submit", event => event.preventDefault());
tc.addEventListener("submit", event => event.preventDefault());
ic.addEventListener("submit", event => event.preventDefault());
Ks.addEventListener("submit", event => event.preventDefault());
_a.addEventListener("submit", event => event.preventDefault());
Ka.addEventListener("submit", event => event.preventDefault());
Qa.addEventListener("submit", event => event.preventDefault());
ir.addEventListener("submit", preventDefault6 => preventDefault6.preventDefault());
sr.addEventListener("submit", value => value.preventDefault());
Ei.addEventListener("submit", value => value.preventDefault());
const pw = new Map([[Ps, {
  componentType: "image",
  property: "label",
  trim: true
}], [uf, {
  componentType: "icon-button-effect",
  property: "label",
  trim: true
}], [Tf, {
  componentType: "title-button",
  property: "label",
  trim: true
}], [kf, {
  componentType: "title-button",
  property: "mainText",
  trim: false
}], [Fs, {
  componentType: "title-button",
  property: "secondaryText",
  trim: false,
  getValue: () => Fs.value + "\n" + Ds.value
}], [Ds, {
  componentType: "title-button",
  property: "secondaryText",
  trim: false,
  getValue: () => Fs.value + "\n" + Ds.value
}], [cg, {
  componentType: "light-statistics",
  property: "label",
  trim: true
}], [lg, {
  componentType: "light-statistics",
  property: "title",
  trim: false
}], [Ag, {
  componentType: "icon-button",
  componentTypes: ["icon-button", "device-button", "presence-sensor"],
  property: "label",
  trim: true
}], [Sd2, {
  componentType: "icon-button",
  componentTypes: ["icon-button", "device-button", "presence-sensor"],
  property: "mainText",
  trim: false
}], [xd, {
  componentType: "icon-button",
  componentTypes: ["icon-button", "device-button", "presence-sensor"],
  property: "secondaryText",
  trim: false
}], [vb, {
  componentType: "vacuum-map",
  property: "label",
  trim: true
}], [Cb, {
  componentType: "camera",
  property: "label",
  trim: true
}], [Lh, {
  componentType: "air-conditioner",
  property: "label",
  trim: true
}], [Rh, {
  componentType: "air-conditioner",
  property: "mainText",
  trim: false
}], [Xh, {
  componentType: "air-conditioner",
  property: "secondaryText",
  trim: false
}], [kb, {
  componentType: "time",
  property: "label",
  trim: true
}], [Vb, {
  componentType: "date",
  property: "label",
  trim: true
}], [Zb, {
  componentType: "weather",
  property: "label",
  trim: true
}], [gy, {
  componentType: "line-chart",
  property: "label",
  trim: true
}], [Ey, {
  componentType: "panel-frame",
  property: "label",
  trim: true
}], [Iy, {
  componentType: "panel-frame",
  property: "mainText",
  trim: false
}], [Fy, {
  componentType: "panel-frame",
  property: "secondaryText",
  trim: false
}], [gc, {
  componentType: "navigation-button",
  property: "label",
  trim: true
}], [cu, {
  componentType: "navigation-button",
  property: "mainText",
  trim: false
}], [lu, {
  componentType: "navigation-button",
  property: "secondaryText",
  trim: false
}]]);
const el = new WeakMap();
for (const [t, e] of pw) {
  t.addEventListener("focus", () => {
    if (!!h && !!componentId) {
      el.set(t, {
        componentId,
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
    let temp = el.get(t);
    if (!temp || temp.componentId !== componentId) {
      temp = {
        componentId,
        before: Uc(),
        historyRecorded: false
      };
      el.set(t, temp);
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
      Sv2?.previewComponentProperties(value.component.id, {
        label
      });
      xv2?.previewComponentProperties(value.component.id, {
        label
      });
    }
    if (e.componentType === "navigation-button" && e.property !== "label") {
      Sv2?.previewComponentProperties(value.component.id, {
        [e.property]: label
      });
    }
    if (e.componentType === "panel-frame" && e.property !== "label") {
      Sv2?.previewComponentProperties(value.component.id, {
        [e.property]: label
      });
    }
    if (e.componentType === "icon-button-effect" && e.property !== "label") {
      Sv2?.previewComponentProperties(value.component.id, {
        [e.property]: label
      });
    }
    if (["title-button", "light-statistics", "icon-button", "air-conditioner"].includes(e.componentType) && e.property !== "label") {
      Sv2?.previewComponentProperties(value.component.id, {
        [e.property]: label
      });
    }
    hn();
    Xn();
  });
  t.addEventListener("blur", () => el.delete(t));
}
H0();
for (const t of document.querySelectorAll(".component-action-controls")) {
  t.addEventListener("click", value => {
    const ancestorEl = value.target.closest("[data-hidden-content-clickable]");
    if (ancestorEl && componentId) {
      L(arg => {
        const component = findComponent(arg, componentId)?.component;
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
    const temp2 = componentId;
    if (!ancestorEl2 || !temp || !temp2 || ancestorEl2.disabled) {
      return;
    }
    const type = ACTION_TYPES.includes(ancestorEl2.dataset.actionType) ? ancestorEl2.dataset.actionType : "none";
    const actionTrigger = temp.dataset.actionTrigger;
    if (["tap", "doubleTap", "hold"].includes(actionTrigger)) {
      L(doc => {
        const component = findComponent(doc, temp2)?.component;
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
            entityId: temp3.entityId || le[0]?.entityId || ""
          } : {}),
          ...(popupSource === "custom" ? {
            popupId: temp3.popupId || doc.customPopups?.[0]?.id || ""
          } : {})
        } : {};
        const flag2 = component.actions?.[actionTrigger]?.type === "more-info";
        const target = component.actions?.[actionTrigger]?.target;
        const chosen = component.type === "navigation-button" ? component.properties?.targetPage : "";
        const pagePaths = new Set(doc.pages.map(arg => arg.path));
        const target2 = pagePaths.has(target) ? target : pagePaths.has(chosen) ? chosen : R.value || doc.pages[0]?.path;
        const type2 = type === "none" || componentActionIsSupported(component, type === "navigate" ? {
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
            data: component.actions?.[actionTrigger]?.type === "more-info" ? {
              ...cloneValue(component.actions[actionTrigger].data || {}),
              ...data
            } : data
          };
        } else {
          component.actions[actionTrigger] = {
            type: type2
          };
        }
        if (!flag && type2 === "more-info" && !flag2 && !component.properties?.relatedEntities && relatedPopupContext(component, Fr(), Dr())) {
          component.properties = {
            ...(component.properties || {}),
            relatedEntities: manualRelatedEntityConfig([])
          };
        }
      });
    }
  });
  t.addEventListener("change", value => {
    const ancestorEl = value.target.closest("[data-popup-source], [data-popup-entity], [data-popup-custom]");
    const temp = ancestorEl?.closest("[data-action-trigger]");
    if (ancestorEl && temp && componentId) {
      const actionTrigger2 = temp.dataset.actionTrigger;
      L(arg => {
        const component = findComponent(arg, componentId)?.component;
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
    const temp3 = componentId;
    if (!element || !temp2 || !temp3) {
      return;
    }
    const actionTrigger = temp2.dataset.actionTrigger;
    if (["tap", "doubleTap", "hold"].includes(actionTrigger)) {
      L(doc => {
        const component = findComponent(doc, temp3)?.component;
        if (!!component && !!doc.pages.some(arg => arg.path === element.value)) {
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
  t.addEventListener("click", value => {
    const ancestorEl = value.target.closest("[data-popup-preview]");
    const temp = ancestorEl?.closest("[data-action-trigger]");
    const temp2 = Number2();
    if (!ancestorEl || !temp || !temp2 || ancestorEl.disabled) {
      return;
    }
    if (Te !== "edit") {
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
      jr().previewAction(temp2, {
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
    const value166 = hidden.hidden;
    Wc(value166 ? querySelector : null);
    hidden.hidden = !value166;
    component.setAttribute("aria-expanded", String(value166));
    if (value166) {
      const value109 = querySelector.querySelector("[data-popup-entity-search]");
      value109.value = "";
      Rc(querySelector, "");
      Hc(querySelector);
      window.requestAnimationFrame(() => value109.focus({
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
  const value229 = querySelector2?.querySelector("[data-popup-entity]");
  if (!!querySelector2 && !!value229) {
    value229.value = value.dataset.popupActionEntityId;
    yp2(querySelector2);
    Wc();
    value229.dispatchEvent(new Event("change", {
      bubbles: true
    }));
  }
});
document.addEventListener("input", value => {
  const ancestorEl = value.target.closest("[data-popup-entity-search]");
  const temp = ancestorEl?.closest("[data-action-trigger]");
  if (!!ancestorEl && !!temp) {
    Rc(temp, ancestorEl.value);
    Hc(temp);
  }
});
gh.addEventListener("click", () => {
  const temp = Number2();
  const target = temp?.bindings?.entity?.entityId || "";
  if (temp?.type === "icon-button" && !!target) {
    try {
      jr().showEntityDetails(temp, {
        preview: true
      });
    } catch (value110) {
      onError(value110);
    }
  }
});
jd.addEventListener("click", () => {
  const target = Number2();
  const temp = target?.bindings?.entity?.entityId || "";
  if (target?.type === "air-conditioner" && !!temp) {
    try {
      jr().showEntityDetails(target, {
        preview: true
      });
    } catch (value111) {
      onError(value111);
    }
  }
});
nf.addEventListener("click", value => {
  const temp = value.target.closest("[data-image-layout]");
  const target = componentId;
  if (!temp || !target) {
    return;
  }
  const numeric = temp.dataset.imageLayout === "fill" ? "fill" : "free";
  const numeric2 = Number2();
  const numeric3 = numeric2?.properties?.layoutMode === "fill" ? "fill" : "free";
  if (!!numeric2 && numeric2.type === "image" && numeric3 !== numeric) {
    L(canvas2 => {
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
        const value30 = Number(canvas2.canvas?.width || 2778);
        const value31 = Number(canvas2.canvas?.height || 1940);
        properties13.position = {
          ...(properties13.position || {}),
          x: (value30 - width2) / 2,
          y: (value31 - height2) / 2,
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
ia.addEventListener("input", value => {
  const target = Number2();
  if (!target || target.type !== "image") {
    return;
  }
  const temp = value.target;
  if (String(temp.value).trim() === "") {
    return;
  }
  const value230 = Number(temp.value);
  if (!Number.isFinite(value230)) {
    return;
  }
  const value231 = Number(h.document.canvas.width || 2778);
  const value232 = Number(h.document.canvas.height || 1940);
  const value233 = Number(target.position?.width || 100);
  const value234 = Number(target.position?.height || 100);
  if (temp === da) {
    const value167 = clampNumber(value230, 0, 100);
    Sv2?.previewComponentProperties(target.id, {
      opacity: value167 / 100
    });
  } else if (temp === Nn2) {
    const value137 = clampNumber(value230, 0, 100);
    Sv2?.previewComponentTransform(target.id, {
      x: value231 * value137 / 100 - value233 / 2
    });
  } else if (temp === go2) {
    const value112 = clampNumber(value230, 0, 100);
    Sv2?.previewComponentTransform(target.id, {
      y: value232 * value112 / 100 - value234 / 2
    });
  } else if (temp === Rl) {
    const value71 = clampNumber(value230, 1, 500);
    Sv2?.previewComponentTransform(target.id, {
      scale: value71 / 100
    });
  } else if (temp === ai) {
    const rotation3 = clampNumber(value230, -360, 360);
    Sv2?.previewComponentTransform(target.id, {
      rotation: rotation3
    });
  }
});
ia.addEventListener("change", value => {
  const ancestorEl = value.target;
  const value235 = componentId;
  if (!!value235 && !![Ps, da, Nn2, go2, Rl, ai].includes(ancestorEl)) {
    if ([da, Nn2, go2, Rl, ai].includes(ancestorEl) && (String(ancestorEl.value).trim() === "" || !Number.isFinite(Number(ancestorEl.value)))) {
      ee();
      return;
    }
    L(arg => {
      const component = findComponent(arg, value235)?.component;
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
      const value72 = Number(arg.canvas.width || 2778);
      const value73 = Number(arg.canvas.height || 1940);
      const value74 = Number(ancestorEl.value);
      if (ancestorEl === Ps) {
        component.properties.label = ancestorEl.value.trim();
      } else if (ancestorEl === da) {
        component.properties.opacity = clampNumber(value74, 0, 100) / 100;
      } else if (ancestorEl === Nn2) {
        component.position.x = value72 * clampNumber(value74, 0, 100) / 100 - Number(component.position.width || 100) / 2;
      } else if (ancestorEl === go2) {
        component.position.y = value73 * clampNumber(value74, 0, 100) / 100 - Number(component.position.height || 100) / 2;
      } else if (ancestorEl === Rl) {
        component.style.scale = clampNumber(value74, 1, 500) / 100;
      } else if (ancestorEl === ai) {
        Gt2(arg, value235, clampNumber(value74, -360, 360));
      }
    });
  }
});
const JE = new Set([ua, pa2, ma, fa, ga, ha]);
ql.addEventListener("input", value => {
  const id3 = Number2();
  const value236 = value.target;
  if (!id3 || id3.type !== "floorplan-auto-diagram" || !JE.has(value236)) {
    return;
  }
  const value237 = Number(value236.value);
  if (!Number.isFinite(value237)) {
    return;
  }
  const value238 = Number(h.document.canvas.width || 2778);
  const value239 = Number(h.document.canvas.height || 1940);
  const value240 = Number(id3.position?.width || 100);
  const value241 = Number(id3.position?.height || 100);
  if (value236 === ua) {
    Sv2?.previewComponentTransform(id3.id, {
      x: value238 * clampNumber(value237, 0, 100) / 100 - value240 / 2
    });
  } else if (value236 === pa2) {
    Sv2?.previewComponentTransform(id3.id, {
      y: value239 * clampNumber(value237, 0, 100) / 100 - value241 / 2
    });
  } else if (value236 === ma) {
    Sv2?.previewComponentTransform(id3.id, {
      width: value238 * clampNumber(value237, 0.1, 100) / 100
    });
  } else if (value236 === fa) {
    Sv2?.previewComponentTransform(id3.id, {
      height: value239 * clampNumber(value237, 0.1, 100) / 100
    });
  } else if (value236 === ga) {
    Sv2?.previewComponentTransform(id3.id, {
      scale: clampNumber(value237, 1, 500) / 100
    });
  } else if (value236 === ha) {
    Sv2?.previewComponentTransform(id3.id, {
      rotation: clampNumber(value237, -360, 360)
    });
  }
});
ql.addEventListener("change", value => {
  const ancestorEl = value.target;
  const temp = componentId;
  if (!!temp && !![Gl, pa, ...JE].includes(ancestorEl)) {
    if (JE.has(ancestorEl) && !Number.isFinite(Number(ancestorEl.value))) {
      ee();
      return;
    }
    L(canvas3 => {
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
        if (ancestorEl === Gl) {
          position6.properties.label = ancestorEl.value.trim();
        } else if (ancestorEl === pa) {
          position6.properties.exportFolder = ancestorEl.value.trim();
        } else {
          const value23 = Number(canvas3.canvas.width || 2778);
          const value24 = Number(canvas3.canvas.height || 1940);
          const value25 = Number(ancestorEl.value);
          if (ancestorEl === ua) {
            position6.position.x = value23 * clampNumber(value25, 0, 100) / 100 - Number(position6.position.width || 100) / 2;
          } else if (ancestorEl === pa2) {
            position6.position.y = value24 * clampNumber(value25, 0, 100) / 100 - Number(position6.position.height || 100) / 2;
          } else if (ancestorEl === ma) {
            position6.position.width = value23 * clampNumber(value25, 0.1, 100) / 100;
          } else if (ancestorEl === fa) {
            position6.position.height = value24 * clampNumber(value25, 0.1, 100) / 100;
          } else if (ancestorEl === ga) {
            position6.style.scale = clampNumber(value25, 1, 500) / 100;
          } else if (ancestorEl === ha) {
            Gt2(canvas3, temp, clampNumber(value25, -360, 360));
          }
        }
      }
    });
  }
});
of.addEventListener("click", target18 => {
  const value = target18.target.closest("[data-floorplan-layout]");
  const value242 = componentId;
  if (!!value && !!value242) {
    L(arg => {
      const component2 = findComponent(arg, value242)?.component;
      if (component2?.type === "floorplan-auto-diagram") {
        component2.properties = {
          ...(component2.properties || {}),
          layoutMode: value.dataset.floorplanLayout === "fill" ? "fill" : "free"
        };
      }
    });
  }
});
function Yr2(componentId, command, value = null) {
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
function iL(componentId, value) {
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
function Tp(src2) {
  if (!src2?.isConnected) {
    return;
  }
  const querySelector3 = src2.closest(".hb-floorplan-auto-diagram");
  if (!querySelector3) {
    return;
  }
  src2.classList.remove("is-ready");
  let className9 = querySelector3.querySelector(".hb-floorplan-auto-diagram-loading");
  if (!className9) {
    className9 = document.createElement("div");
    className9.className = "hb-floorplan-auto-diagram-loading";
    className9.innerHTML = "<i aria-hidden=\"true\"></i><strong>正在重新载入3D户型…</strong>";
    querySelector3.append(className9);
  }
  const searchParams = new URL(src2.src, window.location.origin);
  searchParams.searchParams.set("auto-diagram-refresh", String(Date.now()));
  src2.src = searchParams.toString();
}
window.addEventListener("pageshow", value => {
  if (value.persisted) {
    for (const value138 of document.querySelectorAll(".hb-floorplan-auto-diagram-preview")) {
      Tp(value138);
    }
  }
});
ba.addEventListener("click", target19 => {
  const value = target19.target.closest("[data-floorplan-camera-view]");
  const value243 = componentId;
  if (!value || !value243) {
    return;
  }
  const cameraFocalLength = value.dataset.floorplanCameraView === "top" ? "top" : "free";
  L(arg => {
    const component = findComponent(arg, value243)?.component;
    if (component?.type === "floorplan-auto-diagram") {
      component.properties = {
        ...(component.properties || {}),
        cameraView: cameraFocalLength
      };
    }
  });
  Yr2(value243, "set-view", cameraFocalLength);
});
Zt.addEventListener("change", () => {
  const value = componentId;
  const floorSelection2 = String(Zt.value || "");
  const properties50 = Number2();
  if (!!value && !!floorSelection2 && properties50?.type === "floorplan-auto-diagram") {
    L(arg => {
      const component = findComponent(arg, value)?.component;
      if (component?.type === "floorplan-auto-diagram") {
        component.properties = {
          ...(component.properties || {}),
          floorSelection: floorSelection2
        };
      }
    });
    iL(value, floorSelection2);
    Yr2(value, "restore", {
      view: properties50.properties?.cameraView || "free",
      mode: properties50.properties?.cameraMode || "orthographic",
      topRotation: Number(properties50.properties?.cameraTopRotation || 0),
      focalLength: Number(properties50.properties?.cameraFocalLength || 50)
    });
  }
});
rf.addEventListener("click", target20 => {
  const dataset13 = target20.target.closest("[data-floorplan-camera-mode]");
  const value244 = componentId;
  if (!dataset13 || !value244) {
    return;
  }
  const cameraMode = dataset13.dataset.floorplanCameraMode === "perspective" ? "perspective" : "orthographic";
  L(arg56 => {
    const properties31 = findComponent(arg56, value244)?.component;
    if (properties31?.type === "floorplan-auto-diagram") {
      properties31.properties = {
        ...(properties31.properties || {}),
        cameraMode
      };
    }
  });
  Yr2(value244, "set-mode", cameraMode);
});
ba2.addEventListener("change", () => {
  const value245 = componentId;
  if (!value245 || String(ba2.value).trim() === "") {
    return ee();
  }
  const cameraFocalLength = clampNumber(Number(ba2.value), 18, 120);
  L(arg57 => {
    const properties32 = findComponent(arg57, value245)?.component;
    if (properties32?.type === "floorplan-auto-diagram") {
      properties32.properties = {
        ...(properties32.properties || {}),
        cameraFocalLength
      };
    }
  });
  Yr2(value245, "set-focal-length", cameraFocalLength);
});
sf.addEventListener("click", () => {
  const value246 = componentId;
  if (value246) {
    L(arg25 => {
      const properties14 = findComponent(arg25, value246)?.component;
      if (properties14?.type === "floorplan-auto-diagram") {
        properties14.properties = {
          ...(properties14.properties || {}),
          cameraView: "top",
          cameraTopRotation: (Number(properties14.properties?.cameraTopRotation || 0) + 90) % 360
        };
      }
    });
    Yr2(value246, "rotate-top");
  }
});
function Op(arg119 = va) {
  if (arg119) {
    return document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(arg119) + "\"] .hb-floorplan-auto-diagram-preview");
  } else {
    return null;
  }
}
function Xr(command, lighting = null) {
  const value = Op();
  if (value?.contentWindow) {
    value.contentWindow.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-base-lighting",
      componentId: va,
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
function XE(arg120) {
  const value368 = normalizeBaseLighting(arg120);
  for (const dataset14 of jl) {
    const toFixed = value368[dataset14.dataset.floorplanBaseLight];
    dataset14.value = dataset14.step === "5" ? String(Math.round(toFixed)) : String(Number(toFixed.toFixed(2)));
  }
  return value368;
}
function dw() {
  const value = {};
  for (const element of jl) {
    value[element.dataset.floorplanBaseLight] = Number(element.value);
  }
  return normalizeBaseLighting(value);
}
function KE({
  cancelPreview: arg121 = true
} = {}) {
  if (!C12.hidden) {
    if (arg121) {
      Xr("cancel");
    }
    C12.hidden = true;
    C12.setAttribute("aria-busy", "false");
    va = "";
    mt2 = null;
  }
}
function hw2(value) {
  const temp = Op(value);
  if (!value || !temp?.contentWindow) {
    return;
  }
  va = value;
  temp.classList.remove("is-position-mode");
  temp.classList.add("is-view-mode");
  L(arg101 => {
    const properties49 = findComponent(arg101, value)?.component;
    if (properties49?.type === "floorplan-auto-diagram") {
      properties49.properties = {
        ...(properties49.properties || {}),
        interactionMode: "view"
      };
    }
  });
  XE(N12);
  ci.textContent = "正在读取当前光照设置…";
  C12.hidden = false;
  C12.setAttribute("aria-busy", "true");
  const temp2 = C12.getBoundingClientRect();
  if (temp2.right > window.innerWidth - 8 || temp2.bottom > window.innerHeight - 8 || temp2.left < 8 || temp2.top < 8) {
    C12.style.right = "auto";
    C12.style.left = clampNumber(temp2.left, 8, Math.max(8, window.innerWidth - temp2.width - 8)) + "px";
    C12.style.top = clampNumber(temp2.top, 8, Math.max(8, window.innerHeight - temp2.height - 8)) + "px";
  }
  Xr("request-state");
}
cf.addEventListener("click", () => {
  hw2(componentId);
});
for (const t of jl) {
  t.addEventListener("input", () => {
    if (!C12.hidden) {
      ci.textContent = "修改已实时预览，保存后同步到全部3D入口。";
      Xr("preview", dw());
    }
  });
}
M1.addEventListener("click", () => {
  XE(DEFAULT_BASE_LIGHTING);
  ci.textContent = "已预览默认光照，点击保存后生效。";
  Xr("reset");
});
O1.addEventListener("click", () => {
  ci.textContent = "正在保存并同步…";
  C12.setAttribute("aria-busy", "true");
  Xr("save", dw());
});
k1.addEventListener("click", () => KE());
wa.addEventListener("pointerdown", pointerId => {
  if (pointerId.button !== 0 || pointerId.target.closest("button")) {
    return;
  }
  const left = C12.getBoundingClientRect();
  mt2 = {
    pointerId: pointerId.pointerId,
    startX: pointerId.clientX,
    startY: pointerId.clientY,
    startLeft: left.left,
    startTop: left.top
  };
  try {
    wa.setPointerCapture(pointerId.pointerId);
  } catch {}
});
wa.addEventListener("pointermove", pointerId2 => {
  if (!mt2 || pointerId2.pointerId !== mt2.pointerId) {
    return;
  }
  pointerId2.preventDefault();
  const component = C12.getBoundingClientRect();
  const element = Math.max(8, window.innerWidth - component.width - 8);
  const folderName = Math.max(8, window.innerHeight - component.height - 8);
  C12.style.right = "auto";
  C12.style.left = clampNumber(mt2.startLeft + pointerId2.clientX - mt2.startX, 8, element) + "px";
  C12.style.top = clampNumber(mt2.startTop + pointerId2.clientY - mt2.startY, 8, folderName) + "px";
});
const fw = pointerId3 => {
  if (!!mt2 && pointerId3.pointerId === mt2.pointerId) {
    mt2 = null;
  }
};
wa.addEventListener("pointerup", fw);
wa.addEventListener("pointercancel", fw);
function pw2() {
  if (mt3.open) {
    mt3.close();
  }
  mt3.dataset.componentId = "";
  mt3.dataset.cancelRemovesComponent = "false";
  of2.hidden = false;
}
function mw(value, {
  cancelRemovesComponent: arg = false
} = {}) {
  if (value) {
    mt3.dataset.componentId = value;
    mt3.dataset.cancelRemovesComponent = String(arg);
    of2.hidden = false;
    if (!mt3.open) {
      mt3.showModal();
    }
  }
}
function Pp() {
  const removedId = mt3.dataset.componentId;
  const cancelRemovesComponent = mt3.dataset.cancelRemovesComponent === "true";
  pw2();
  if (!!cancelRemovesComponent && !!removedId) {
    selectedComponentIds.delete(removedId);
    if (componentId === removedId) {
      componentId = selectedComponentIds.values().next().value || null;
    }
    if (ku2 === removedId) {
      ku2 = componentId;
    }
    L(arg => {
      kc2(arg, removedId);
    });
  }
}
xt.addEventListener("click", () => {
  const id3 = Number2();
  if (id3?.type !== "floorplan-auto-diagram") {
    return;
  }
  if (id3.properties?.generated === true && id3.properties?.previewing !== true) {
    L(arg26 => {
      const properties15 = findComponent(arg26, id3.id)?.component;
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
  const contentWindow6 = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(id3.id) + "\"] .hb-floorplan-auto-diagram-preview");
  if (!contentWindow6?.contentWindow) {
    mw(id3.id);
    return;
  }
  const startsWith = String(id3.properties?.exportFolder || "").trim();
  if (!startsWith || /[<>:"/\\|?*\x00-\x1f\x7f]/.test(startsWith) || startsWith.startsWith(".") || /[. ]$/.test(startsWith)) {
    si.textContent = "请先填写有效的导图文件夹名称。";
    pa.focus();
    return;
  }
  const width9 = id3.position || {};
  const width10 = h.document.canvas || {};
  si.textContent = "正在后台生成底图和灯组效果，请稍候…";
  xt.disabled = true;
  Zt.disabled = true;
  xt.textContent = "正在后台生成…";
  contentWindow6.contentWindow.postMessage({
    type: "ha-bridge-floorplan-auto-diagram-generate",
    componentId: id3.id,
    width: Math.max(320, Math.round(Number(width10.width || width9.width || 2778))),
    height: Math.max(320, Math.round(Number(width10.height || width9.height || 1940))),
    folderName: startsWith
  }, window.location.origin);
});
la2.addEventListener("click", () => {
  const value247 = componentId;
  if (value247) {
    L(arg27 => {
      const properties16 = findComponent(arg27, value247)?.component;
      if (properties16?.type === "floorplan-auto-diagram") {
        properties16.properties = {
          ...(properties16.properties || {}),
          interactionMode: properties16.properties?.interactionMode === "view" ? "position" : "view"
        };
      }
    });
  }
});
$1.addEventListener("click", Pp);
F1.addEventListener("click", Pp);
mt3.addEventListener("cancel", value => {
  value.preventDefault();
  Pp();
});
D1.addEventListener("click", () => {
  const temp = mt3.dataset.componentId;
  if (temp) {
    L(arg28 => {
      const properties17 = findComponent(arg28, temp)?.component;
      if (properties17?.type === "floorplan-auto-diagram") {
        properties17.properties = {
          ...(properties17.properties || {}),
          previewReady: true,
          previewing: true,
          interactionMode: "position"
        };
      }
    });
    pw2();
  }
});
lf.addEventListener("change", value => {
  const value248 = value.target.closest("[data-floorplan-light-group-id]");
  const value249 = componentId;
  if (!value248 || !value249) {
    return;
  }
  const temp2 = value248.dataset.floorplanLightGroupId;
  L(doc => {
    const component = findComponent(doc, value249)?.component;
    if (!component || component.type !== "floorplan-auto-diagram") {
      return;
    }
    component.bindings = {
      ...(component.bindings || {})
    };
    const numeric = "lightGroup:" + temp2;
    if (value248.value) {
      component.bindings[numeric] = {
        entityId: value248.value
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
    const value168 = String(ancestorEl.componentId || "");
    const contentWindow = Op(value168);
    if (!contentWindow || value.source !== contentWindow.contentWindow || value168 !== va) {
      return;
    }
    if (ancestorEl.status === "ready" || ancestorEl.status === "saved") {
      N12 = normalizeBaseLighting(ancestorEl.savedLighting || ancestorEl.lighting);
      XE(ancestorEl.lighting || N12);
    }
    C12.setAttribute("aria-busy", "false");
    if (ancestorEl.status === "saved") {
      ci.textContent = "已保存，并同步到实时预览、手动导图和自动导图。";
    } else if (ancestorEl.status === "ready") {
      ci.textContent = "修改会实时同步到当前3D预览。";
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
    const properties48 = findComponent(h?.document, componentId2)?.component;
    if (properties48?.type === "floorplan-auto-diagram") {
      const floors = (Array.isArray(ancestorEl.floors) ? ancestorEl.floors : []).map(id3 => ({
        id: String(id3?.id || ""),
        name: String(id3?.name || "")
      })).filter(event => event.id);
      const selected = String(ancestorEl.floorSelection || "");
      Du.set(componentId2, {
        floors,
        selected
      });
      const floorSelection = properties48.properties || {};
      if (Object.prototype.hasOwnProperty.call(floorSelection, "floorSelection") && selected && floorSelection.floorSelection !== selected) {
        L(arg11 => {
          const properties8 = findComponent(arg11, componentId2)?.component;
          if (properties8?.type === "floorplan-auto-diagram") {
            properties8.properties = {
              ...(properties8.properties || {}),
              floorSelection: selected
            };
          }
        });
      }
      ee();
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
    const value169 = String(ancestorEl.componentId || "");
    const contentWindow3 = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(value169) + "\"] .hb-floorplan-auto-diagram-preview");
    if (!contentWindow3 || value.source !== contentWindow3.contentWindow) {
      return;
    }
    const floors2 = (Array.isArray(ancestorEl.floors) ? ancestorEl.floors : []).map(id3 => ({
      id: String(id3?.id || ""),
      name: String(id3?.name || "")
    })).filter(component2 => component2.id);
    const selected2 = String(ancestorEl.floorSelection || "");
    Du.set(value169, {
      floors: floors2,
      selected: selected2
    });
    const type12 = findComponent(h?.document, value169)?.component;
    if (type12?.type === "floorplan-auto-diagram" && selected2 && type12.properties?.floorSelection !== selected2) {
      L(arg13 => {
        const properties10 = findComponent(arg13, value169)?.component;
        if (properties10?.type === "floorplan-auto-diagram") {
          properties10.properties = {
            ...(properties10.properties || {}),
            floorSelection: selected2
          };
        }
      });
    }
    if (value169 === componentId) {
      ee();
    }
    return;
  }
  if (ancestorEl?.type === "ha-bridge-floorplan-auto-diagram-stopped") {
    const value170 = String(ancestorEl.componentId || "");
    const contentWindow4 = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(value170) + "\"] .hb-floorplan-auto-diagram-preview");
    if (!contentWindow4 || value.source !== contentWindow4.contentWindow) {
      return;
    }
    xt.disabled = false;
    if (value170 === componentId) {
      Zt.disabled = false;
    }
    xt.textContent = "确定位置大小并后台生成";
    si.textContent = ancestorEl.message || "已停止本次生成。";
    if (ancestorEl.reason === "rename") {
      pa.focus();
    }
    return;
  }
  if (ancestorEl?.type === "ha-bridge-floorplan-auto-diagram-error") {
    const value171 = String(ancestorEl.componentId || "");
    const contentWindow5 = document.querySelector(".hb-component[data-component-id=\"" + CSS.escape(value171) + "\"] .hb-floorplan-auto-diagram-preview");
    if (!contentWindow5 || value.source !== contentWindow5.contentWindow) {
      return;
    }
    xt.disabled = false;
    if (value171 === componentId) {
      Zt.disabled = false;
    }
    xt.textContent = "确定位置大小并后台生成";
    si.textContent = ancestorEl.message || "后台生成失败，请重试。";
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
  xt.disabled = false;
  xt.textContent = "确定位置大小并后台生成";
  si.textContent = "已生成，正在置换到仪表盘…";
  const hidden2 = contentWindow7.closest(".hb-component");
  if (hidden2) {
    hidden2.hidden = true;
  }
  L(canvas => {
    let page = findComponentLocation(canvas, temp);
    const position4 = page?.component;
    if (!position4 || position4.type !== "floorplan-auto-diagram" || !page.page) {
      return null;
    }
    const components2 = page.page;
    const filter = [];
    const value35 = arg4 => {
      for (const properties of arg4 || []) {
        if (properties?.properties?.autoDiagramFolder === autoDiagramFolder) {
          filter.push(properties);
        }
        value35(properties?.children);
      }
    };
    value35(components2.components);
    const get = new Map(filter.filter(type => type.type === "image").map(properties2 => [properties2.properties?.autoDiagramRole === "base" ? "background-with-plan" : String(properties2.properties?.autoDiagramRole || ""), properties2]));
    const get2 = new Map(filter.filter(type2 => type2.type === "icon-button-effect").map(properties3 => {
      const value13 = String(properties3.properties?.autoDiagramRole || "light-group");
      const value14 = String(properties3.properties?.autoDiagramLayerId || properties3.properties?.autoDiagramGroupId || "");
      return [value13 + ":" + value14, properties3];
    }));
    for (const id3 of filter) {
      kc2(canvas, id3.id);
    }
    page = findComponentLocation(canvas, temp);
    if (!page) {
      return null;
    }
    const value36 = Number(canvas.canvas?.width || 2778);
    const value37 = Number(canvas.canvas?.height || 1940);
    const naturalWidth = Math.max(1, Number(resolution.resolution?.width || position4.position?.width || 1));
    const naturalHeight = Math.max(1, Number(resolution.resolution?.height || position4.position?.height || 1));
    const layoutMode = position4.properties?.layoutMode === "fill" ? "fill" : "free";
    const width3 = position4.position || {};
    const value38 = layoutMode === "fill" ? 1 : Math.max(0.01, Math.min(5, Number(position4.style?.scale || 1)));
    const value39 = layoutMode === "fill" ? value36 : Number(width3.width || 100);
    const value40 = layoutMode === "fill" ? value37 : Number(width3.height || 100);
    const width4 = value39 * value38;
    const height3 = value40 * value38;
    const x8 = layoutMode === "fill" ? 0 : Number(width3.x || 0) - (width4 - value39) / 2;
    const y2 = layoutMode === "fill" ? 0 : Number(width3.y || 0) - (height3 - value40) / 2;
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
      const style = get.get(label.role);
      const position = style ? cloneValue(style) : createComponentFromTemplate("image", {
        id: newId("component"),
        instanceName: label.label,
        canvas: canvas.canvas
      });
      position.position = {
        ...(position.position || {}),
        x: x8,
        y: y2,
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
    const value41 = find.find(properties4 => properties4.properties?.autoDiagramRole === "background");
    const value42 = find.find(properties5 => properties5.properties?.autoDiagramRole === "floor-plan");
    const value43 = find.find(properties6 => properties6.properties?.autoDiagramRole === "background-with-plan");
    const id3 = value43 || value42 || value41;
    const value44 = (Array.isArray(resolution.groups) ? resolution.groups : []).filter(id3 => String(id3?.id || id3?.groupId || "") && id3?.file).map(name => ({
      role: "light-group",
      id: String(name.id || name.groupId || ""),
      name: String(name.name || name.note || "灯组"),
      note: String(name.note || name.name || "灯组"),
      file: name.file,
      icon: "mdi:lightbulb-outline",
      anchor: name.anchor
    }));
    const value45 = (Array.isArray(resolution.screens) ? resolution.screens : []).filter(id3 => String(id3?.id || id3?.itemId || "") && id3?.file).map(name2 => ({
      role: "television",
      id: String(name2.id || name2.itemId || ""),
      name: String(name2.name || "电视画面"),
      note: String(name2.name || "电视画面"),
      file: name2.file,
      icon: "mdi:television",
      anchor: name2.anchor
    }));
    const value46 = (Array.isArray(resolution.vehicles) ? resolution.vehicles : []).filter(id3 => String(id3?.id || id3?.itemId || "") && id3?.file).map(name3 => ({
      role: "vehicle",
      id: String(name3.id || name3.itemId || ""),
      name: String(name3.name || "汽车充电"),
      note: String(name3.name || "汽车充电"),
      file: name3.file,
      icon: "mdi:car-electric",
      anchor: name3.anchor
    }));
    const length = [...value45, ...value46, ...value44];
    const value47 = x8 + width4 / 2;
    const value48 = y2 + height3 / 2;
    const value49 = rotation * Math.PI / 180;
    const value50 = Math.min(width4 / naturalWidth, height3 / naturalHeight);
    const value51 = naturalWidth * value50;
    const value52 = naturalHeight * value50;
    const push2 = [];
    const value53 = (anchor, arg5, arg6, arg7) => {
      const x5 = Number(anchor.anchor?.x);
      const y = Number(anchor.anchor?.y);
      const x6 = {
        x: length.length > 1 ? (arg5 + 1) / (length.length + 1) : 0.5,
        y: 0.9
      };
      const x7 = Number.isFinite(x5) && Number.isFinite(y) ? {
        x: x5,
        y
      } : x6;
      const spacingX = Math.max(0.035, arg6 / Math.max(value51, 1) * 1.08);
      const spacingY = Math.max(0.045, arg7 / Math.max(value52, 1) * 1.08);
      const push = [[0, 0]];
      for (let value15 = 1; value15 <= 4; value15 += 1) {
        push.push([0, -spacingY * value15], [spacingX * value15, 0], [0, spacingY * value15], [-spacingX * value15, 0], [spacingX * value15, -spacingY * value15], [spacingX * value15, spacingY * value15], [-spacingX * value15, spacingY * value15], [-spacingX * value15, -spacingY * value15]);
      }
      let value26 = null;
      for (const [value16, value17] of push) {
        const x2 = {
          x: clampNumber(x7.x + value16, spacingX / 2, 1 - spacingX / 2),
          y: clampNumber(x7.y + value17, spacingY / 2, 1 - spacingY / 2)
        };
        if (!push2.some(arg5 => Math.abs(x2.x - arg5.x) < (spacingX + arg5.spacingX) / 2 && Math.abs(x2.y - arg5.y) < (spacingY + arg5.spacingY) / 2)) {
          value26 = x2;
          break;
        }
      }
      value26 ||= {
        x: clampNumber(x6.x, spacingX / 2, 1 - spacingX / 2),
        y: clampNumber(x6.y, spacingY / 2, 1 - spacingY / 2)
      };
      push2.push({
        ...value26,
        spacingX,
        spacingY
      });
      return value26;
    };
    const value54 = length.map((role, arg2) => {
      const properties7 = get2.get(role.role + ":" + role.id);
      const position2 = properties7 ? cloneValue(properties7) : createComponentFromTemplate("icon-button-effect", {
        id: newId("component"),
        instanceName: role.name,
        canvas: canvas.canvas
      });
      const x3 = properties7?.properties?.autoDiagramSceneAnchor;
      const value20 = !x3 || Math.abs(Number(x3.x) - Number(role.anchor?.x)) > 0.002 || Math.abs(Number(x3.y) - Number(role.anchor?.y)) > 0.002;
      const value21 = !!properties7 && Number(properties7.properties?.autoDiagramLayoutVersion || 0) < RC;
      const value22 = !properties7 || value21 || role.role === "light-group" && value20;
      let x4 = properties7?.properties?.autoDiagramButtonAnchor || null;
      if (value22) {
        const value2 = Number(position2.position?.width || value36 * 0.075);
        const value3 = Number(position2.position?.height || value2);
        const value4 = Math.max(0.01, Math.min(5, Number(position2.style?.scale || 1)));
        x4 = value53(role, arg2, value2 * value4, value3 * value4);
        const value5 = -value51 / 2 + x4.x * value51;
        const value6 = -value52 / 2 + x4.y * value52;
        const value7 = value5 * Math.cos(value49) - value6 * Math.sin(value49);
        const value8 = value5 * Math.sin(value49) + value6 * Math.cos(value49);
        position2.position = {
          ...(position2.position || {}),
          x: value47 + value7 - value2 / 2,
          y: value48 + value8 - value3 / 2,
          rotation
        };
      } else if (Number.isFinite(Number(x4?.x)) && Number.isFinite(Number(x4?.y))) {
        const value2 = Number(position2.position?.width || value36 * 0.075);
        const value3 = Number(position2.position?.height || value2);
        const value4 = Math.max(0.01, Math.min(5, Number(position2.style?.scale || 1)));
        push2.push({
          x: Number(x4.x),
          y: Number(x4.y),
          spacingX: Math.max(0.035, value2 * value4 / Math.max(value51, 1) * 1.08),
          spacingY: Math.max(0.045, value3 * value4 / Math.max(value52, 1) * 1.08)
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
        effectReferenceImageId: id3?.id || "",
        effectLayoutMode: layoutMode,
        effectLeft: value47 / value36 * 100,
        effectTop: value48 / value37 * 100,
        effectScale: 1,
        effectRotation: rotation,
        autoDiagramFolder,
        autoDiagramRole: role.role,
        autoDiagramLayerId: role.id,
        autoDiagramSceneAnchor: role.anchor || null,
        autoDiagramButtonAnchor: x4,
        autoDiagramLayoutVersion: RC,
        ...(role.role === "light-group" ? {
          autoDiagramGroupId: role.id
        } : {})
      };
      return position2;
    });
    const value55 = [value42, value41, value43].filter(Boolean);
    const value56 = page.index;
    kc2(canvas, temp);
    page.collection.splice(value56, 0, ...value54, ...value55);
    applyCollectionLayerOrder(page.collection);
    return {
      removed: true,
      selectedId: (value41 || value42 || value43 || value54[0])?.id || null
    };
  }).then(removed => {
    if (!removed?.removed) {
      if (hidden2?.isConnected) {
        hidden2.hidden = false;
      }
      return;
    }
    const value75 = removed.selectedId;
    componentId = value75;
    selectedComponentIds = value75 ? new Set([value75]) : new Set();
    ku2 = value75;
    Sv2?.setSelectedComponents(value75 ? [value75] : [], value75);
    _e();
    ee();
  }).catch(onError);
});
const tL = new Map([[Ul, {
  property: "effectColorTemperatureRealtime",
  type: "boolean"
}], [_l, {
  property: "effectBrightnessRealtime",
  type: "boolean"
}], [Zl, {
  property: "iconOffColor"
}], [Ql, {
  property: "iconOnColor"
}], [gf, {
  property: "iconSize",
  min: 1,
  max: 100
}], [ed, {
  property: "buttonOffColor"
}], [td, {
  property: "buttonOnColor"
}], [hf, {
  property: "buttonOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [bf, {
  property: "frameColor"
}], [yf, {
  property: "frameWidth",
  min: 0,
  max: 20
}], [vf, {
  property: "frameOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [wf, {
  property: "radius",
  min: 0,
  max: 50
}], [Cf, {
  property: "glowColor"
}], [nd, {
  property: "glowOffStrength",
  min: 0,
  max: 300,
  divisor: 100
}], [od, {
  property: "glowOnStrength",
  min: 0,
  max: 300,
  divisor: 100
}], [xf, {
  property: "effectOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [Nf, {
  property: "effectFadeDuration",
  min: 0,
  max: 3
}], [id, {
  property: "effectLeft",
  min: -100,
  max: 200
}], [nd2, {
  property: "effectTop",
  min: -100,
  max: 200
}], [od2, {
  property: "effectScale",
  min: 1,
  max: 500,
  divisor: 100
}], [id2, {
  property: "effectRotation",
  min: -360,
  max: 360
}]]);
const nL = new Map([[Zl, "off"], [ed, "off"], [nd, "off"], [Ql, "on"], [td, "on"], [od, "on"]]);
const oL = new Set([Na, Ea, ci2, ui, V1, pi]);
function vw(value) {
  const list = nL.get(value);
  const callback = Number2();
  if (!!list && callback?.type === "icon-button-effect") {
    Ec.set(callback.id, list);
    Sv2?.setComponentPreviewState(callback.id, list);
    for (const dataset6 of Jl.querySelectorAll("[data-ibe-preview]")) {
      const value172 = dataset6.dataset.ibePreview === list;
      dataset6.classList.toggle("active", value172);
      dataset6.setAttribute("aria-pressed", String(value172));
    }
  }
}
for (const t of ["focusin", "pointerdown"]) {
  si2.addEventListener(t, value => vw(value.target));
}
si2.addEventListener("input", target21 => {
  const id3 = Number2();
  if (!id3 || id3.type !== "icon-button-effect") {
    return;
  }
  vw(target21.target);
  const type14 = tL.get(target21.target);
  if (type14) {
    let value173 = type14.type === "boolean" ? target21.target.checked : target21.target.type === "color" ? target21.target.value : Number(target21.target.value);
    if (type14.type !== "boolean" && target21.target.type !== "color") {
      if (!Number.isFinite(value173)) {
        return;
      }
      value173 = clampNumber(value173, type14.min, type14.max) / (type14.divisor || 1);
    }
    Sv2?.previewComponentProperties(id3.id, {
      [type14.property]: value173
    });
    return;
  }
  if (!oL.has(target21.target) || !Number.isFinite(Number(target21.target.value))) {
    return;
  }
  const value250 = Number(target21.target.value);
  const value251 = Number(h.document.canvas.width || 2778);
  const value252 = Number(h.document.canvas.height || 1940);
  const value253 = Number(id3.position?.width || 100);
  const value254 = Number(id3.position?.height || 100);
  if (target21.target === Na) {
    Sv2?.previewComponentTransform(id3.id, {
      x: value251 * clampNumber(value250, 0, 100) / 100 - value253 / 2
    });
  } else if (target21.target === Ea) {
    Sv2?.previewComponentTransform(id3.id, {
      y: value252 * clampNumber(value250, 0, 100) / 100 - value254 / 2
    });
  } else if (target21.target === ci2) {
    Sv2?.previewComponentTransform(id3.id, {
      width: value251 * clampNumber(value250, 0.1, 100) / 100
    });
  } else if (target21.target === ui) {
    Sv2?.previewComponentTransform(id3.id, {
      height: value252 * clampNumber(value250, 0.1, 100) / 100
    });
  } else if (target21.target === V1) {
    Sv2?.previewComponentTransform(id3.id, {
      scale: clampNumber(value250, 1, 500) / 100
    });
  } else if (target21.target === pi) {
    Sv2?.previewComponentTransform(id3.id, {
      rotation: clampNumber(value250, -360, 360)
    });
  }
});
si2.addEventListener("change", target22 => {
  const value255 = target22.target;
  const property = tL.get(value255);
  if (!property && !oL.has(value255)) {
    return;
  }
  if (value255.type === "number" && !Number.isFinite(Number(value255.value))) {
    ee();
    return;
  }
  const value256 = componentId;
  L(canvas10 => {
    const position14 = findComponent(canvas10, value256)?.component;
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
      position14.properties[property.property] = property.type === "boolean" ? value255.checked : value255.type === "color" ? value255.value : clampNumber(Number(value255.value), property.min, property.max) / (property.divisor || 1);
      return;
    }
    const value139 = Number(canvas10.canvas.width || 2778);
    const value140 = Number(canvas10.canvas.height || 1940);
    const value141 = Number(value255.value);
    if (value255 === Na) {
      position14.position.x = value139 * clampNumber(value141, 0, 100) / 100 - Number(position14.position.width || 100) / 2;
    } else if (value255 === Ea) {
      position14.position.y = value140 * clampNumber(value141, 0, 100) / 100 - Number(position14.position.height || 100) / 2;
    } else if (value255 === ci2) {
      position14.position.width = value139 * clampNumber(value141, 0.1, 100) / 100;
    } else if (value255 === ui) {
      position14.position.height = value140 * clampNumber(value141, 0.1, 100) / 100;
    } else if (value255 === V1) {
      position14.style.scale = clampNumber(value141, 1, 500) / 100;
    } else if (value255 === pi) {
      Gt2(canvas10, value256, clampNumber(value141, -360, 360));
    }
  });
});
Ef.addEventListener("click", target23 => {
  const dataset15 = target23.target.closest("[data-ibe-layout]");
  const value257 = componentId;
  if (!!dataset15 && !!value257) {
    L(arg29 => {
      const properties18 = findComponent(arg29, value257)?.component;
      if (!!properties18 && properties18.type === "icon-button-effect") {
        properties18.properties = {
          ...(properties18.properties || {}),
          effectLayoutMode: dataset15.dataset.ibeLayout === "fill" ? "fill" : "free"
        };
      }
    });
  }
});
function lL(value) {
  const push4 = [];
  const value369 = arg102 => {
    for (const type10 of arg102 || []) {
      if (type10.type === "image") {
        push4.push(type10);
      }
      value369(type10.children);
    }
  };
  value369(value?.components);
  return push4;
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
  const temp2 = findCustomPopup2(component.properties?.assetId || "");
  const temp3 = up2(temp2);
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
  const temp5 = roundField((Number(flag2.x || 0) + numeric3 / 2) / numeric * 100);
  const temp6 = roundField((Number(flag2.y || 0) + numeric4 / 2) / numeric2 * 100);
  const temp7 = roundField(Number(component.style?.scale || 1) * 100);
  const temp8 = roundField(Number(flag2.rotation || 0));
  element4.textContent = flag ? "铺满 · 覆盖整个画布" : "自由 · 左 " + temp5 + "% · 上 " + temp6 + "%";
  const element5 = document.createElement("small");
  element5.textContent = flag ? chosen : "缩放 " + temp7 + "% · 旋转 " + temp8 + "° · " + chosen;
  temp4.append(element3, element4, element5);
  temp.append(element, element2, temp4);
  return temp;
}
function eL() {
  const component = Number2();
  const value = Je2();
  if (!component || component.type !== "icon-button-effect" || !value) {
    return;
  }
  const temp = lL(value);
  const text = String(component.properties?.effectReferenceImageId || "");
  If.replaceChildren(...temp.map((component2, arg2) => QE(component2, component2.id === text || !text && arg2 === 0)));
  ku = component.id;
  As.hidden = temp.length > 0;
  As.textContent = temp.length ? "" : "本页面没有可以对齐的普通图片。";
  Lf.disabled = temp.length === 0;
  In.showModal();
}
G1.addEventListener("click", eL);
_1.addEventListener("click", () => In.close());
Y1.addEventListener("click", () => In.close());
In.addEventListener("click", value => {
  if (value.target === In) {
    In.close();
  }
});
In.addEventListener("close", () => {
  ku = null;
});
Lf.addEventListener("click", () => {
  const value = If.querySelector("input[name=\"effect-image-align-target\"]:checked")?.value;
  const value258 = ku;
  if (!value258 || !value) {
    As.textContent = "请选择一张本页面图片。";
    As.hidden = false;
    return;
  }
  In.close();
  L(pages2 => {
    const properties33 = findComponent(pages2, value258)?.component;
    const components4 = pages2.pages?.find(path2 => path2.path === R.value) || pages2.pages?.[0];
    const type11 = findComponentInItems(components4?.components, value);
    if (!properties33 || properties33.type !== "icon-button-effect" || !type11 || type11.type !== "image") {
      return;
    }
    const value142 = Number(pages2.canvas?.width || 2778);
    const value143 = Number(pages2.canvas?.height || 1940);
    const width8 = type11.position || {};
    const value144 = Number(width8.width || 100);
    const value145 = Number(width8.height || 100);
    const value146 = type11.properties?.layoutMode === "fill";
    properties33.properties = {
      ...(properties33.properties || {}),
      effectReferenceImageId: type11.id,
      effectLayoutMode: value146 ? "fill" : "free",
      ...(value146 ? {} : {
        effectLeft: (Number(width8.x || 0) + value144 / 2) / value142 * 100,
        effectTop: (Number(width8.y || 0) + value145 / 2) / value143 * 100,
        effectScale: clampNumber(Number(type11.style?.scale || 1), 0.01, 5),
        effectRotation: Number(width8.rotation || 0)
      })
    };
  });
});
Jl.addEventListener("click", target24 => {
  const value = target24.target.closest("[data-ibe-preview]");
  const value259 = componentId;
  if (!value || !value259) {
    return;
  }
  const value260 = ["on", "off"].includes(value.dataset.ibePreview) ? value.dataset.ibePreview : "auto";
  Ec.set(value259, value260);
  Sv2?.setComponentPreviewState(value259, value260);
  ee();
});
pf.addEventListener("click", target25 => {
  const dataset16 = target25.target.closest("[data-ibe-layer]");
  const value261 = componentId;
  if (!dataset16 || !value261) {
    return;
  }
  const value262 = dataset16.dataset.ibeLayer === "effect" ? "effect" : "button";
  const value263 = value262 === "effect" ? "on" : "off";
  Kv.set(value261, value262);
  Ec.set(value261, value263);
  Sv2?.setComponentPreviewState(value261, value263);
  Sv2?.setComponentSelectionLayer(value261, value262);
  closeOtherPickerPanels();
  ee();
});
mf.addEventListener("click", () => {
  const value264 = componentId;
  if (value264) {
    L(arg30 => {
      const properties19 = findComponent(arg30, value264)?.component;
      if (!!properties19 && properties19.type === "icon-button-effect") {
        properties19.properties = {
          ...(properties19.properties || {}),
          buttonVisible: properties19.properties?.buttonVisible === false
        };
      }
    });
  }
});
ff.addEventListener("click", () => {
  const value265 = componentId;
  if (value265) {
    L(arg31 => {
      const properties20 = findComponent(arg31, value265)?.component;
      if (!!properties20 && properties20.type === "icon-button-effect") {
        properties20.properties = {
          ...(properties20.properties || {}),
          effectVisible: properties20.properties?.effectVisible === false
        };
      }
    });
  }
});
const pL = new Map([[Mf, {
  property: "mainColor"
}], [Of, {
  property: "secondaryColor"
}], [Bf, {
  property: "mainSize",
  min: 8,
  max: 200
}], [$f, {
  property: "secondarySize",
  min: 6,
  max: 100
}], [Ff, {
  property: "mainWeight",
  min: 0,
  max: 1
}], [Df, {
  property: "secondaryWeight",
  min: 0,
  max: 1
}], [zf, {
  property: "mainSpacing",
  min: -20,
  max: 100
}], [Vf, {
  property: "secondarySpacing",
  min: -20,
  max: 100
}], [Wf, {
  property: "secondaryLineGap",
  min: 0,
  max: 100
}], [Rf, {
  property: "mainTextLeft",
  min: -100,
  max: 200
}], [Hf, {
  property: "mainTextTop",
  min: -100,
  max: 200
}], [jf, {
  property: "secondaryTextLeft",
  min: -100,
  max: 200
}], [qf, {
  property: "secondaryTextTop",
  min: -100,
  max: 200
}], [Uf, {
  property: "iconColor"
}], [_f, {
  property: "iconSize",
  min: 1,
  max: 100
}], [Yf, {
  property: "iconLeft",
  min: -100,
  max: 200
}], [Xf, {
  property: "iconTop",
  min: -100,
  max: 200
}], [Kf, {
  property: "frameColor"
}], [Zf, {
  property: "frameWidth",
  min: 0,
  max: 12
}], [Qf, {
  property: "frameSize",
  min: 10,
  max: 300
}], [eg, {
  property: "frameSpacing",
  min: 0,
  max: 300
}], [tg, {
  property: "frameOffsetX",
  min: -100,
  max: 100
}], [ng, {
  property: "frameOffsetY",
  min: -100,
  max: 100
}], [ig, {
  property: "markerColor"
}], [ag, {
  property: "markerSize",
  min: 2,
  max: 60
}], [rg, {
  property: "markerLeft",
  min: -100,
  max: 200
}], [sg, {
  property: "markerTop",
  min: -100,
  max: 200
}]]);
const mL = new Map([[rd, "left"], [sd, "top"], [$s, "width"], [Fs2, "height"], [Aa2, "scale"], [Ds2, "rotation"]]);
const fL = new Map([[mg, {
  property: "iconColor"
}], [fg, {
  property: "iconActiveColor"
}], [gg, {
  property: "iconSize",
  min: 8,
  max: 100
}], [bg, {
  property: "titleColor"
}], [yg, {
  property: "titleSize",
  min: 8,
  max: 100
}], [vg, {
  property: "titleWeight",
  min: 0,
  max: 1
}], [wg, {
  property: "titleSpacing",
  min: -20,
  max: 100
}], [Sg, {
  property: "countColor"
}], [xg, {
  property: "countActiveColor"
}], [Ng, {
  property: "countSize",
  min: 8,
  max: 140
}], [Eg, {
  property: "countWeight",
  min: 0,
  max: 1
}], [Lg, {
  property: "countSpacing",
  min: -20,
  max: 100
}], [Ig, {
  property: "iconGap",
  min: 0,
  max: 40
}], [Tg, {
  property: "countGap",
  min: 0,
  max: 40
}]]);
const gL = new Map([[ud2, "left"], [pd, "top"], [Ws, "width"], [Rs, "height"], [$a2, "scale"], [Hs, "rotation"]]);
const hL = new Map([[bh, {
  property: "haloScaleX",
  min: 20,
  max: 300,
  divisor: 100
}], [yh, {
  property: "haloScaleY",
  min: 20,
  max: 300,
  divisor: 100
}], [vh, {
  property: "haloRotation",
  min: -360,
  max: 360
}], [wh, {
  property: "haloOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [Sh, {
  property: "personScale",
  min: 20,
  max: 300,
  divisor: 100
}], [xh, {
  property: "personRotation",
  min: -360,
  max: 360
}], [Nh, {
  property: "personOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [Eh, {
  property: "orbitDuration",
  min: 2,
  max: 60
}], [hi, {
  property: "iconColor"
}], [wd, {
  property: properties29 => properties29.type !== "presence-sensor" ? "iconOnColor" : properties29.properties?.sensorKind === "water-leak" ? "waterLeakColor" : properties29.properties?.sensorKind === "smoke" ? "smokeColor" : properties29.properties?.sensorKind === "natural-gas" ? "naturalGasColor" : "iconOnColor"
}], [Fg, {
  property: "badgeColor"
}], [Dg, {
  property: "badgeOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [Vg, {
  property: "symbolSize",
  min: 1,
  max: 100
}], [Wg, {
  property: "badgeSize",
  min: 1,
  max: 100
}], [zg, {
  property: "iconSize",
  min: 1,
  max: 100
}], [Cd, {
  property: "iconOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [Sd, {
  property: "iconOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [wd2, {
  property: "iconLeft",
  min: -100,
  max: 200
}], [Cd2, {
  property: "iconTop",
  min: -100,
  max: 200
}], [Hg, {
  property: "mainColor"
}], [jg, {
  property: "secondaryColor"
}], [Ad, {
  property: "mainOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [Pd, {
  property: "mainOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [kd, {
  property: "secondaryOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [Md, {
  property: "secondaryOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [qg, {
  property: "mainSize",
  min: 6,
  max: 120
}], [Gg, {
  property: "secondarySize",
  min: 5,
  max: 80
}], [Ug, {
  property: "mainWeight",
  min: 0,
  max: 1
}], [_g, {
  property: "secondaryWeight",
  min: 0,
  max: 1
}], [Yg, {
  property: "mainSpacing",
  min: -20,
  max: 100
}], [Xg, {
  property: "secondarySpacing",
  min: -20,
  max: 100
}], [Kg, {
  property: "mainTextLeft",
  min: -100,
  max: 200
}], [Jg, {
  property: "mainTextTop",
  min: -100,
  max: 200
}], [Zg, {
  property: "secondaryTextLeft",
  min: -100,
  max: 200
}], [Qg, {
  property: "secondaryTextTop",
  min: -100,
  max: 200
}], [Bd, {
  property: "onFillColor"
}], [$d, {
  property: "onFillStrength",
  min: 0,
  max: 100,
  divisor: 100
}], [eh, {
  property: "onFillFadeDuration",
  min: 0,
  max: 3
}], [nh, {
  property: "frameWidth",
  min: 0,
  max: 12
}], [oh, {
  property: "frameAngle",
  min: 0,
  max: 360
}], [Fd, {
  property: "frameOffOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [Dd, {
  property: "frameOnOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [ih, {
  property: "cutCorner",
  min: 0,
  max: 50
}], [rh, {
  property: "softLightColor"
}], [sh, {
  property: "softLightStrength",
  min: 0,
  max: 500,
  divisor: 100
}], [ch, {
  property: "softLightSize",
  min: 0,
  max: 300,
  divisor: 100
}], [lh, {
  property: "softLightAngle",
  min: 0,
  max: 360
}], [uh, {
  property: "glowColor"
}], [ph, {
  property: "glowStrength",
  min: 0,
  max: 500,
  divisor: 100
}], [mh, {
  property: "glowSize",
  min: 0,
  max: 300,
  divisor: 100
}], [fh, {
  property: "glowAngle",
  min: 0,
  max: 360
}]]);
const bL = new Map([[$d2, "left"], [Fd2, "top"], [Gs, "width"], [Us2, "height"], [Wa2, "scale"], [_s2, "rotation"]]);
const ww = new Map([[Mh, {
  property: "iconOffColor"
}], [Oh, {
  property: "iconOnColor"
}], [Bh, {
  property: "badgeColor"
}], [$h, {
  property: "badgeOpacity",
  min: 0,
  max: 100,
  divisor: 100
}], [Fh, {
  property: "symbolSize",
  min: 1,
  max: 100
}], [Dh, {
  property: "badgeSize",
  min: 1,
  max: 100
}], [zh, {
  property: "iconLeft",
  min: -100,
  max: 200
}], [Vh, {
  property: "iconTop",
  min: -100,
  max: 200
}], [Hh, {
  property: "mainColor"
}], [jh, {
  property: "mainSize",
  min: 6,
  max: 120
}], [qh, {
  property: "mainWeight",
  min: 0,
  max: 1
}], [Gh, {
  property: "mainSpacing",
  min: -20,
  max: 100
}], [Uh, {
  property: "mainTextLeft",
  min: -100,
  max: 200
}], [_h, {
  property: "mainTextTop",
  min: -100,
  max: 200
}], [Kh, {
  property: "secondaryColor"
}], [Jh, {
  property: "secondarySize",
  min: 5,
  max: 80
}], [Zh, {
  property: "secondaryWeight",
  min: 0,
  max: 1
}], [Qh, {
  property: "secondarySpacing",
  min: -20,
  max: 100
}], [eb, {
  property: "secondaryTextLeft",
  min: -100,
  max: 200
}], [tb, {
  property: "secondaryTextTop",
  min: -100,
  max: 200
}], [ib, {
  property: "airflowCoolColor"
}], [ab, {
  property: "airflowHeatColor"
}], [rb, {
  property: "airflowOtherColor"
}], [sb, {
  property: "airflowAngle",
  min: -360,
  max: 360
}], [cb, {
  property: "airflowCurve",
  min: -200,
  max: 200
}], [lb, {
  property: "airflowLength",
  min: 10,
  max: 300
}], [db, {
  property: "airflowFadePosition",
  min: 15,
  max: 100
}], [ub, {
  property: "airflowSpread",
  min: 10,
  max: 300
}], [pb, {
  property: "airflowDensity",
  min: 20,
  max: 200
}], [mb, {
  property: "airflowIrregularity",
  min: 0,
  max: 200
}], [fb, {
  property: "airflowThickness",
  min: 5,
  max: 300
}], [gb, {
  property: "airflowStrength",
  min: 0,
  max: 500
}], [hb, {
  property: "airflowBlur",
  min: 0,
  max: 30
}], [zd, {
  property: "airflowSpeed",
  min: 0.3,
  max: 12
}], [Ra, {
  property: "airflowOffsetX",
  limits: (arg46, canvas8) => {
    const minX = airflowCanvasOffsetBounds(arg46, canvas8.canvas);
    return {
      min: minX.minX,
      max: minX.maxX
    };
  }
}], [Ha, {
  property: "airflowOffsetY",
  limits: (arg47, canvas9) => {
    const minY = airflowCanvasOffsetBounds(arg47, canvas9.canvas);
    return {
      min: minY.minY,
      max: minY.maxY
    };
  }
}], [bb, {
  property: "airflowWidth",
  min: 1,
  max: 500
}], [yb, {
  property: "airflowHeight",
  min: 1,
  max: 500
}], [Vd, {
  property: "airflowScale",
  min: 1,
  max: 500,
  divisor: 100
}], [Wd, {
  property: "airflowRotation",
  min: -360,
  max: 360
}]]);
const dL = new Map([[Rd, "left"], [Hd, "top"], [Zs2, "width"], [Qs, "height"], [ja, "scale"], [ec, "rotation"]]);
const uL = new Map([[Lb, {
  property: "frameColor"
}], [Ib, {
  property: "frameWidth",
  min: 0,
  max: 20
}], [Tb, {
  property: "radius",
  min: 0,
  max: 50,
  divisor: 100
}], [Ab, {
  property: "frameAngle",
  min: 0,
  max: 360
}], [Pb, {
  property: "frameOpacity",
  min: 0,
  max: 100,
  divisor: 100
}]]);
const Zc = new Map([[wb, {
  property: "opacity",
  min: 0,
  max: 100,
  divisor: 100
}]]);
const ww2 = new Map([[Ud, "left"], [_d2, "top"], [qa, "scale"], [oc, "rotation"]]);
const Cw2 = new Map([[Xd, "left"], [Kd, "top"], [rc, "width"], [sc, "height"], [Ua, "scale"], [cc, "rotation"]]);
function Hi2(value, arg2, arg3, arg4) {
  const list = Array.isArray(arg2) ? arg2 : [arg2];
  value.addEventListener("input", event2 => {
    const temp = Number2();
    if (!temp || !list.includes(temp.type)) {
      return;
    }
    const temp2 = arg3.get(event2.target);
    if (temp2) {
      const chosen = typeof temp2.property == "function" ? temp2.property(temp) : temp2.property;
      let chosen2 = event2.target.type === "color" ? event2.target.value : Number(event2.target.value);
      if (event2.target.type !== "color") {
        if (!Number.isFinite(chosen2)) {
          return;
        }
        const flag = temp2.limits?.(temp, h.document) || temp2;
        chosen2 = clampNumber(chosen2, flag.min, flag.max) / (temp2.divisor || 1);
      }
      Sv2?.previewComponentProperties(temp.id, {
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
      Sv2?.previewComponentTransform(temp.id, {
        x: numeric2 * clampNumber(numeric, 0, 100) / 100 - numeric4 / 2
      });
    } else if (temp3 === "top") {
      Sv2?.previewComponentTransform(temp.id, {
        y: numeric3 * clampNumber(numeric, 0, 100) / 100 - numeric5 / 2
      });
    } else if (temp3 === "width") {
      Sv2?.previewComponentTransform(temp.id, {
        width: numeric2 * clampNumber(numeric, 0.1, 100) / 100
      });
    } else if (temp3 === "height") {
      Sv2?.previewComponentTransform(temp.id, {
        height: numeric3 * clampNumber(numeric, 0.1, 100) / 100
      });
    } else if (temp3 === "scale") {
      Sv2?.previewComponentTransform(temp.id, {
        scale: clampNumber(numeric, 1, 500) / 100
      });
    } else if (temp3 === "rotation" && d0().length < 2) {
      Sv2?.previewComponentTransform(temp.id, {
        rotation: clampNumber(numeric, -360, 360)
      });
    }
  });
  value.addEventListener("change", event2 => {
    const temp = arg3.get(event2.target);
    const temp2 = arg4.get(event2.target);
    if (!temp && !temp2) {
      return;
    }
    if (event2.target.type === "number" && !Number.isFinite(Number(event2.target.value))) {
      ee();
      return;
    }
    const temp3 = componentId;
    const chosen = temp2 === "rotation" ? d0() : [];
    L(doc => {
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
        const chosen2 = typeof temp.property == "function" ? temp.property(component) : temp.property;
        const flag = temp.limits?.(component, doc) || temp;
        component.properties[chosen2] = event2.target.type === "color" ? event2.target.value : clampNumber(Number(event2.target.value), flag.min, flag.max) / (temp.divisor || 1);
        return;
      }
      const numeric = Number(doc.canvas.width || 2778);
      const numeric2 = Number(doc.canvas.height || 1940);
      const numeric3 = Number(event2.target.value);
      if (temp2 === "left") {
        component.position.x = numeric * clampNumber(numeric3, 0, 100) / 100 - Number(component.position.width || 100) / 2;
      } else if (temp2 === "top") {
        component.position.y = numeric2 * clampNumber(numeric3, 0, 100) / 100 - Number(component.position.height || 100) / 2;
      } else if (temp2 === "width") {
        component.position.width = numeric * clampNumber(numeric3, 0.1, 100) / 100;
      } else if (temp2 === "height") {
        component.position.height = numeric2 * clampNumber(numeric3, 0.1, 100) / 100;
      } else if (temp2 === "scale") {
        component.style.scale = clampNumber(numeric3, 1, 500) / 100;
      } else if (temp2 === "rotation") {
        Gt2(doc, temp3, clampNumber(numeric3, -360, 360), chosen);
      }
    });
  });
}
Hi2(ks, "title-button", pL, mL);
Hi2(ud, "light-statistics", fL, gL);
Hi2(ui2, ["icon-button", "device-button", "presence-sensor"], hL, bL);
Hi2(Ks, "air-conditioner", ww, dL);
Hi2(tc, "vacuum-map", Zc, ww2);
Hi2(ic, "camera", uL, Cw2);
_s.addEventListener("change", () => {
  const component = componentId;
  if (component) {
    L(arg32 => {
      const properties21 = findComponent(arg32, component)?.component;
      if (!properties21 || properties21.type !== "device-button") {
        return;
      }
      const statePrecision = ["0", "1", "2", "3", "4"].includes(_s.value) ? Number(_s.value) : "auto";
      properties21.properties = {
        ...(properties21.properties || {}),
        statePrecision
      };
    });
  }
});
Fa.addEventListener("change", () => {
  const value = componentId;
  if (value) {
    L(arg => {
      const component = findComponent(arg, value)?.component;
      if (!component || component.type !== "presence-sensor") {
        return;
      }
      const sensorKind = ["presence", "door-window", "water-leak", "smoke", "natural-gas"].includes(Fa.value) ? Fa.value : "presence";
      component.properties = {
        ...(component.properties || {}),
        sensorKind
      };
      if (sensorKind !== "door-window") {
        Ac.delete(value);
        Sv2?.setComponentSelectionLayer(value, "button");
      }
    });
  }
});
Tn.addEventListener("click", () => {
  const ancestorEl = Number2();
  if (!!ancestorEl && ancestorEl.type === "presence-sensor" && ancestorEl.properties?.sensorKind === "door-window") {
    Ac.add(ancestorEl.id);
    Tn.classList.add("active");
    Tn.setAttribute("aria-pressed", "true");
    Zs.disabled = false;
    Sv2?.setComponentSelectionLayer(ancestorEl.id, "perspective");
  }
});
Zs.addEventListener("click", () => {
  const ancestorEl = Number2();
  if (!!ancestorEl && ancestorEl.type === "presence-sensor" && ancestorEl.properties?.sensorKind === "door-window") {
    Ac.delete(ancestorEl.id);
    Tn.classList.remove("active");
    Tn.setAttribute("aria-pressed", "false");
    Zs.disabled = true;
    Sv2?.setComponentSelectionLayer(ancestorEl.id, "button");
  }
});
Bx.addEventListener("click", () => {
  const value = componentId;
  if (value) {
    L(arg33 => {
      const properties22 = findComponent(arg33, value)?.component;
      if (!!properties22 && properties22.type === "presence-sensor" && properties22.properties?.sensorKind === "door-window") {
        properties22.properties = {
          ...(properties22.properties || {}),
          perspectiveCorners: [...Fu]
        };
      }
    });
  }
});
Sb.addEventListener("click", target26 => {
  const value = target26.target.closest("[data-camera-fit]");
  const value266 = componentId;
  if (!value || !value266) {
    return;
  }
  const fit = value.dataset.cameraFit === "contain" ? "contain" : "fill";
  L(arg58 => {
    const properties34 = findComponent(arg58, value266)?.component;
    if (!!properties34 && properties34.type === "camera") {
      properties34.properties = {
        ...(properties34.properties || {}),
        fit
      };
    }
  });
});
xb.addEventListener("click", target27 => {
  const value = target27.target.closest("[data-camera-display-mode]");
  const value267 = componentId;
  if (!value || !value267) {
    return;
  }
  const displayMode = value.dataset.cameraDisplayMode === "snapshot" ? "snapshot" : "live";
  L(arg59 => {
    const properties35 = findComponent(arg59, value267)?.component;
    if (!!properties35 && properties35.type === "camera") {
      properties35.properties = {
        ...(properties35.properties || {}),
        displayMode
      };
    }
  });
});
Ga.addEventListener("change", () => {
  const ancestorEl = componentId;
  if (!ancestorEl) {
    return;
  }
  const value268 = Number(Ga.value);
  const refreshInterval = Number.isFinite(value268) ? Math.max(6, Math.round(value268)) : 10;
  Ga.value = String(refreshInterval);
  L(arg60 => {
    const properties36 = findComponent(arg60, ancestorEl)?.component;
    if (!!properties36 && properties36.type === "camera") {
      properties36.properties = {
        ...(properties36.properties || {}),
        refreshInterval
      };
    }
  });
});
Nb.addEventListener("click", () => {
  const ancestorEl = componentId;
  if (ancestorEl) {
    L(arg34 => {
      const properties23 = findComponent(arg34, ancestorEl)?.component;
      if (!!properties23 && properties23.type === "camera") {
        properties23.properties = {
          ...(properties23.properties || {}),
          mediaVisible: properties23.properties?.mediaVisible === false
        };
      }
    });
  }
});
Eb.addEventListener("click", () => {
  const ancestorEl = componentId;
  if (ancestorEl) {
    L(arg35 => {
      const properties24 = findComponent(arg35, ancestorEl)?.component;
      if (!!properties24 && properties24.type === "camera") {
        properties24.properties = {
          ...(properties24.properties || {}),
          frameVisible: properties24.properties?.frameVisible === false
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
  Mo2.set(value, chosen);
  Sv2?.setComponentPreviewState(value, chosen);
}
Th.addEventListener("click", target28 => {
  const value = target28.target.closest("[data-air-conditioner-preview]");
  if (!!value && !!componentId) {
    Kr(componentId, value.dataset.airConditionerPreview);
    ee();
  }
});
Ih.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-air-conditioner-device-type]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const deviceType = ["air-conditioner", "bath-heater"].includes(ancestorEl.dataset.airConditionerDeviceType) ? ancestorEl.dataset.airConditionerDeviceType : "auto";
  L(arg61 => {
    const properties37 = findComponent(arg61, temp)?.component;
    if (!!properties37 && properties37.type === "air-conditioner") {
      properties37.properties = {
        ...(properties37.properties || {}),
        deviceType
      };
    }
  });
});
Ah.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-air-conditioner-layer]");
  if (!ancestorEl || !componentId) {
    return;
  }
  const temp = ancestorEl.dataset.airConditionerLayer === "airflow" ? "airflow" : "button";
  Fu2.set(componentId, temp);
  Kr(componentId, temp === "airflow" ? "on" : "off");
  Sv2?.setComponentSelectionLayer(componentId, temp);
  closeOtherPickerPanels();
  ee();
});
nb.addEventListener("click", () => {
  const ancestorEl = componentId;
  if (ancestorEl) {
    Kr(ancestorEl, "on");
    L(arg36 => {
      const properties25 = findComponent(arg36, ancestorEl)?.component;
      if (!!properties25 && properties25.type === "air-conditioner") {
        properties25.properties = {
          ...(properties25.properties || {}),
          airflowVisible: properties25.properties?.airflowVisible === false
        };
      }
    });
  }
});
for (const [t, e] of [[Eh2, "iconVisible"], [Bh2, "mainTextVisible"], [Hh2, "secondaryTextVisible"]]) {
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L(arg => {
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
ob.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-airflow-motion]");
  const temp = componentId;
  if (!!ancestorEl && !!temp) {
    Kr(temp, "on");
    L(arg37 => {
      const properties26 = findComponent(arg37, temp)?.component;
      if (!!properties26 && properties26.type === "air-conditioner") {
        properties26.properties = {
          ...(properties26.properties || {}),
          airflowMotion: ancestorEl.dataset.airflowMotion === "static" ? "static" : "dynamic"
        };
      }
    });
  }
});
for (const t of ["focusin", "pointerdown", "input"]) {
  Nh2.addEventListener(t, value => {
    if (ww.has(value.target) && Number2()?.type === "air-conditioner") {
      Kr(componentId, "on");
    }
  });
}
const Mp = new Map([[Cd, "off"], [Ad, "off"], [kd, "off"], [Fd, "off"], [Pd2, "on"], [Sd, "on"], [Pd, "on"], [Md, "on"], [Bd, "on"], [$d, "on"], [Dd, "on"], [wd, "on"]]);
function xL(value) {
  for (const dataset17 of Us.querySelectorAll("[data-icon-button-preview]")) {
    const value209 = dataset17.dataset.iconButtonPreview === value;
    dataset17.classList.toggle("active", value209);
    dataset17.setAttribute("aria-pressed", String(value209));
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
  Sv2?.setComponentPreviewState(value, chosen);
  if (value === componentId) {
    xL(chosen);
  }
}
function Cw(value) {
  const temp = Number2();
  const value370 = Mp.get(value) || (temp?.type === "device-button" && value === hi ? "off" : null);
  if (!!value370 && !!["icon-button", "device-button", "presence-sensor"].includes(temp?.type)) {
    kp(temp.id, value370);
  }
}
function Sw(value) {
  const type17 = Number2();
  if (!!Mp.has(value) || type17?.type === "device-button" && value === hi) {
    if (["icon-button", "device-button", "presence-sensor"].includes(type17?.type)) {
      kp(type17.id, "auto");
    }
  }
}
for (const t of ["focusin", "pointerdown", "input"]) {
  ui2.addEventListener(t, value => Cw(value.target));
}
kg.addEventListener("click", value => {
  const temp = value.target.closest("[data-cover-kind]");
  const value269 = componentId;
  if (!temp || !value269) {
    return;
  }
  const coverKind = ["standard", "dream", "airer"].includes(temp.dataset.coverKind) ? temp.dataset.coverKind : "auto";
  L(arg62 => {
    const properties38 = findComponent(arg62, value269)?.component;
    if (properties38 && String(properties38.bindings?.entity?.entityId || "").startsWith("cover.")) {
      properties38.properties = {
        ...(properties38.properties || {}),
        coverKind
      };
    }
  });
});
js.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-cover-direction]");
  const temp = componentId;
  if (!ancestorEl || !temp) {
    return;
  }
  const chosen = ["left", "right"].includes(ancestorEl.dataset.coverDirection) ? ancestorEl.dataset.coverDirection : "split";
  L(arg63 => {
    const properties39 = findComponent(arg63, temp)?.component;
    if (properties39 && String(properties39.bindings?.entity?.entityId || "").startsWith("cover.")) {
      properties39.properties = {
        ...(properties39.properties || {}),
        coverDirection: chosen
      };
    }
  });
});
Og.addEventListener("click", value => {
  const component = value.target.closest("[data-cover-motor-direction]");
  const target = componentId;
  if (!component || !target) {
    return;
  }
  const temp = ["normal", "reversed"].includes(component.dataset.coverMotorDirection) ? component.dataset.coverMotorDirection : "auto";
  L(arg64 => {
    const properties40 = findComponent(arg64, target)?.component;
    if (properties40 && String(properties40.bindings?.entity?.entityId || "").startsWith("cover.")) {
      properties40.properties = {
        ...(properties40.properties || {}),
        coverMotorDirection: temp
      };
    }
  });
});
ui2.addEventListener("focusout", value => {
  const target = Number2();
  if ((!!Mp.has(value.target) || target?.type === "device-button" && value.target === hi) && (!(value.relatedTarget instanceof Node) || !Us.contains(value.relatedTarget))) {
    window.requestAnimationFrame(() => {
      if (me === value.target && !pt2.hidden) {
        return;
      }
      if (Mp.get(document.activeElement) || (Number2()?.type === "device-button" && document.activeElement === hi ? "off" : null)) {
        Cw(document.activeElement);
      } else {
        Sw(value.target);
      }
    });
  }
});
for (const [t, e] of [[xf2, "mainTextVisible"], [Nf2, "secondaryTextVisible"], [Vf2, "iconVisible"], [Gf, "frameVisible"], [Jf, "markerVisible"]]) {
  t.addEventListener("click", () => {
    const value = componentId;
    L(arg => {
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
for (const [t, e] of [[rg2, "iconVisible"], [dg2, "titleVisible"], [gg2, "countVisible"]]) {
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L(arg => {
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
for (const [t, e] of [[hd, "iconVisible"], [Nd, "mainTextVisible"], [Ed, "secondaryTextVisible"], [Pd2, "onFillVisible"], [Xg2, "frameVisible"], [Qg2, "softLightVisible"], [ih2, "glowVisible"], [dh, "haloVisible"], [gh2, "personVisible"]]) {
  t.addEventListener("click", () => {
    const value = componentId;
    L(arg => {
      const component = findComponent(arg, value)?.component;
      if (!!component && !!["icon-button", "device-button", "presence-sensor"].includes(component.type) && (!e.endsWith("Visible") || !["iconVisible", "mainTextVisible", "secondaryTextVisible"].includes(e) || component.type === "device-button") && (!["haloVisible", "personVisible"].includes(e) || component.type === "presence-sensor")) {
        component.properties = {
          ...(component.properties || {}),
          [e]: component.properties?.[e] === false
        };
      }
    });
  });
}
Us.addEventListener("click", value => {
  const component = value.target.closest("[data-icon-button-preview]");
  const target = componentId;
  if (!component || !target) {
    return;
  }
  const temp = ["on", "off"].includes(component.dataset.iconButtonPreview) ? component.dataset.iconButtonPreview : "auto";
  kp(target, temp);
});
const Sw2 = new Map([[Bb, "color"]]);
const xw = new Map([[$b, {
  property: "fontSize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [Fb, {
  property: "fontWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}], [Db, {
  property: "letterSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}], [zb, {
  property: "opacity",
  minimum: 0,
  maximum: 100,
  divisor: 100,
  resizes: false
}]]);
const Op2 = new Set([Ya, Xa, yo, gi]);
function mL2(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const numeric2 = Number(value.position?.height || 100);
  const number = Number(value.position?.x || 0) + numeric / 2;
  const number2 = Number(value.position?.y || 0) + numeric2 / 2;
  const {
    width,
    height
  } = timeComponentDimensions(fallback);
  Sv2?.previewComponentTransform(value.id, {
    x: number - width / 2,
    y: number2 - height / 2,
    width,
    height
  });
}
_a.addEventListener("input", value => {
  const target = Number2();
  if (!target || target.type !== "time") {
    return;
  }
  const value270 = value.target;
  const temp2 = Sw2.get(value270);
  if (temp2) {
    Sv2?.previewComponentProperties(target.id, {
      [temp2]: value270.value
    });
    return;
  }
  const temp3 = xw.get(value270);
  if (temp3) {
    if (String(value270.value).trim() === "" || !Number.isFinite(Number(value270.value))) {
      return;
    }
    const value174 = clampNumber(Number(value270.value), temp3.minimum, temp3.maximum) / temp3.divisor;
    const value175 = {
      ...(target.properties || {}),
      [temp3.property]: value174
    };
    Sv2?.previewComponentProperties(target.id, {
      [temp3.property]: value174
    });
    if (temp3.resizes) {
      mL2(target, value175);
    }
    return;
  }
  if (!Op2.has(value270) || String(value270.value).trim() === "" || !Number.isFinite(Number(value270.value))) {
    return;
  }
  const value271 = Number(value270.value);
  const value272 = Number(h.document.canvas.width || 2778);
  const value273 = Number(h.document.canvas.height || 1940);
  const value274 = Number(target.position?.width || 100);
  const value275 = Number(target.position?.height || 100);
  if (value270 === Ya) {
    const value176 = clampNumber(value271, 0, 100);
    Sv2?.previewComponentTransform(target.id, {
      x: value272 * value176 / 100 - value274 / 2
    });
  } else if (value270 === Xa) {
    const value147 = clampNumber(value271, 0, 100);
    Sv2?.previewComponentTransform(target.id, {
      y: value273 * value147 / 100 - value275 / 2
    });
  } else if (value270 === yo) {
    const value113 = clampNumber(value271, 1, 500);
    Sv2?.previewComponentTransform(target.id, {
      scale: value113 / 100
    });
  } else if (value270 === gi) {
    const rotation4 = clampNumber(value271, -360, 360);
    Sv2?.previewComponentTransform(target.id, {
      rotation: rotation4
    });
  }
});
_a.addEventListener("change", value => {
  const value276 = value.target;
  const target = componentId;
  if (!target) {
    return;
  }
  const temp = Sw2.get(value276);
  const temp2 = xw.get(value276);
  if (!!temp || !!temp2 || !!Op2.has(value276)) {
    if ((temp2 || Op2.has(value276)) && (String(value276.value).trim() === "" || !Number.isFinite(Number(value276.value)))) {
      ee();
      return;
    }
    L(canvas4 => {
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
      const value76 = Number(canvas4.canvas.width || 2778);
      const value77 = Number(canvas4.canvas.height || 1940);
      const value78 = Number(value276.value);
      if (temp) {
        position7.properties[temp] = value276.value;
      } else if (temp2) {
        position7.properties[temp2.property] = clampNumber(value78, temp2.minimum, temp2.maximum) / temp2.divisor;
        if (temp2.resizes) {
          j0(position7, position7.properties);
        }
      } else if (value276 === Ya) {
        position7.position.x = value76 * clampNumber(value78, 0, 100) / 100 - Number(position7.position.width || 100) / 2;
      } else if (value276 === Xa) {
        position7.position.y = value77 * clampNumber(value78, 0, 100) / 100 - Number(position7.position.height || 100) / 2;
      } else if (value276 === yo) {
        position7.style.scale = clampNumber(value78, 1, 500) / 100;
      } else if (value276 === gi) {
        Gt2(canvas4, target, clampNumber(value78, -360, 360));
      }
    });
  }
});
for (const t of [Lb2, Ib2]) {
  t.addEventListener("click", value => {
    const temp = componentId;
    const ancestorEl = value.target.closest("[data-time-hour-format]");
    const ancestorEl2 = value.target.closest("[data-time-seconds]");
    if (!!temp && (!!ancestorEl || !!ancestorEl2)) {
      L(arg => {
        const component = findComponent(arg, temp)?.component;
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
          j0(component, component.properties);
        }
      });
    }
  });
}
const Nw = new Map([[Hb, "primaryColor"], [Ub, "lunarColor"]]);
const Ew = new Map([[jb, {
  property: "primarySize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [qb, {
  property: "primaryWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}], [Gb, {
  property: "primarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}], [_b, {
  property: "lunarSize",
  minimum: 10,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [Yb, {
  property: "lunarWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}], [Xb, {
  property: "lunarSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}], [Kb, {
  property: "lineGap",
  minimum: 0,
  maximum: 200,
  divisor: 1,
  resizes: true
}], [Jb, {
  property: "opacity",
  minimum: 0,
  maximum: 100,
  divisor: 100,
  resizes: false
}]]);
const Bp = new Set([Ja, Za, vo, hi2]);
function fL2(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const numeric2 = Number(value.position?.height || 100);
  const number = Number(value.position?.x || 0) + numeric / 2;
  const number2 = Number(value.position?.y || 0) + numeric2 / 2;
  const {
    width,
    height
  } = dateComponentDimensions(fallback);
  Sv2?.previewComponentTransform(value.id, {
    x: number - width / 2,
    y: number2 - height / 2,
    width,
    height
  });
}
Ka.addEventListener("input", value => {
  const target = Number2();
  if (!target || target.type !== "date") {
    return;
  }
  const value277 = value.target;
  const temp2 = Nw.get(value277);
  if (temp2) {
    Sv2?.previewComponentProperties(target.id, {
      [temp2]: value277.value
    });
    return;
  }
  const temp3 = Ew.get(value277);
  if (temp3) {
    if (String(value277.value).trim() === "" || !Number.isFinite(Number(value277.value))) {
      return;
    }
    const value177 = clampNumber(Number(value277.value), temp3.minimum, temp3.maximum) / temp3.divisor;
    const value178 = {
      ...(target.properties || {}),
      [temp3.property]: value177
    };
    Sv2?.previewComponentProperties(target.id, {
      [temp3.property]: value177
    });
    if (temp3.resizes) {
      fL2(target, value178);
    }
    return;
  }
  if (!Bp.has(value277) || String(value277.value).trim() === "" || !Number.isFinite(Number(value277.value))) {
    return;
  }
  const value278 = Number(value277.value);
  const value279 = Number(h.document.canvas.width || 2778);
  const value280 = Number(h.document.canvas.height || 1940);
  const value281 = Number(target.position?.width || 100);
  const value282 = Number(target.position?.height || 100);
  if (value277 === Ja) {
    const value179 = clampNumber(value278, 0, 100);
    Sv2?.previewComponentTransform(target.id, {
      x: value279 * value179 / 100 - value281 / 2
    });
  } else if (value277 === Za) {
    const value148 = clampNumber(value278, 0, 100);
    Sv2?.previewComponentTransform(target.id, {
      y: value280 * value148 / 100 - value282 / 2
    });
  } else if (value277 === vo) {
    const value114 = clampNumber(value278, 1, 500);
    Sv2?.previewComponentTransform(target.id, {
      scale: value114 / 100
    });
  } else if (value277 === hi2) {
    const rotation5 = clampNumber(value278, -360, 360);
    Sv2?.previewComponentTransform(target.id, {
      rotation: rotation5
    });
  }
});
Ka.addEventListener("change", value => {
  const value283 = value.target;
  const target = componentId;
  if (!target) {
    return;
  }
  const temp2 = Nw.get(value283);
  const temp3 = Ew.get(value283);
  if (!!temp2 || !!temp3 || !!Bp.has(value283)) {
    if ((temp3 || Bp.has(value283)) && (String(value283.value).trim() === "" || !Number.isFinite(Number(value283.value)))) {
      ee();
      return;
    }
    L(canvas5 => {
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
      const value79 = Number(canvas5.canvas.width || 2778);
      const value80 = Number(canvas5.canvas.height || 1940);
      const value81 = Number(value283.value);
      if (temp2) {
        position8.properties[temp2] = value283.value;
      } else if (temp3) {
        position8.properties[temp3.property] = clampNumber(value81, temp3.minimum, temp3.maximum) / temp3.divisor;
        if (temp3.resizes) {
          q0(position8, position8.properties);
        }
      } else if (value283 === Ja) {
        position8.position.x = value79 * clampNumber(value81, 0, 100) / 100 - Number(position8.position.width || 100) / 2;
      } else if (value283 === Za) {
        position8.position.y = value80 * clampNumber(value81, 0, 100) / 100 - Number(position8.position.height || 100) / 2;
      } else if (value283 === vo) {
        position8.style.scale = clampNumber(value81, 1, 500) / 100;
      } else if (value283 === hi2) {
        Gt2(canvas5, target, clampNumber(value81, -360, 360));
      }
    });
  }
});
for (const t of [Bb2, $b2]) {
  t.addEventListener("click", value => {
    const temp = componentId;
    const ancestorEl = value.target.closest("[data-date-weekday]");
    const ancestorEl2 = value.target.closest("[data-date-lunar]");
    if (!!temp && (!!ancestorEl || !!ancestorEl2)) {
      L(arg => {
        const component = findComponent(arg, temp)?.component;
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
          q0(component, component.properties);
        }
      });
    }
  });
}
const Lw = new Map([[ay, "temperatureColor"], [ly, "secondaryColor"]]);
const Iw = new Map([[oy, {
  property: "iconSize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [iy, {
  property: "iconGap",
  minimum: 0,
  maximum: 300,
  divisor: 1,
  resizes: true
}], [ry, {
  property: "temperatureSize",
  minimum: 12,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [sy, {
  property: "temperatureWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}], [cy, {
  property: "temperatureSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}], [dy, {
  property: "secondarySize",
  minimum: 10,
  maximum: 500,
  divisor: 1,
  resizes: true
}], [uy, {
  property: "secondaryWeight",
  minimum: 0,
  maximum: 1,
  divisor: 1,
  resizes: true
}], [py, {
  property: "secondarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1,
  resizes: true
}], [my, {
  property: "lineGap",
  minimum: 0,
  maximum: 200,
  divisor: 1,
  resizes: true
}], [fy, {
  property: "opacity",
  minimum: 0,
  maximum: 100,
  divisor: 100,
  resizes: false
}]]);
const $p = new Set([er, or, wo, bi]);
function gL2(value, fallback) {
  const numeric = Number(value.position?.width || 100);
  const numeric2 = Number(value.position?.height || 100);
  const number = Number(value.position?.x || 0) + numeric / 2;
  const number2 = Number(value.position?.y || 0) + numeric2 / 2;
  const {
    width,
    height
  } = weatherComponentDimensions(fallback);
  Sv2?.previewComponentTransform(value.id, {
    x: number - width / 2,
    y: number2 - height / 2,
    width,
    height
  });
}
Qa.addEventListener("input", value => {
  const target = Number2();
  if (!target || target.type !== "weather") {
    return;
  }
  const value284 = value.target;
  const temp2 = Lw.get(value284);
  if (temp2) {
    Sv2?.previewComponentProperties(target.id, {
      [temp2]: value284.value
    });
    return;
  }
  const temp3 = Iw.get(value284);
  if (temp3) {
    if (String(value284.value).trim() === "" || !Number.isFinite(Number(value284.value))) {
      return;
    }
    const value180 = clampNumber(Number(value284.value), temp3.minimum, temp3.maximum) / temp3.divisor;
    const value181 = {
      ...(target.properties || {}),
      [temp3.property]: value180
    };
    Sv2?.previewComponentProperties(target.id, {
      [temp3.property]: value180
    });
    if (temp3.resizes) {
      gL2(target, value181);
    }
    return;
  }
  if (!$p.has(value284) || String(value284.value).trim() === "" || !Number.isFinite(Number(value284.value))) {
    return;
  }
  const temp4 = Number(value284.value);
  const value285 = Number(h.document.canvas.width || 2778);
  const value286 = Number(h.document.canvas.height || 1940);
  const value287 = Number(target.position?.width || 100);
  const value288 = Number(target.position?.height || 100);
  if (value284 === er) {
    const value182 = clampNumber(temp4, 0, 100);
    Sv2?.previewComponentTransform(target.id, {
      x: value285 * value182 / 100 - value287 / 2
    });
  } else if (value284 === or) {
    const value149 = clampNumber(temp4, 0, 100);
    Sv2?.previewComponentTransform(target.id, {
      y: value286 * value149 / 100 - value288 / 2
    });
  } else if (value284 === wo) {
    const value115 = clampNumber(temp4, 1, 500);
    Sv2?.previewComponentTransform(target.id, {
      scale: value115 / 100
    });
  } else if (value284 === bi) {
    const rotation6 = clampNumber(temp4, -360, 360);
    Sv2?.previewComponentTransform(target.id, {
      rotation: rotation6
    });
  }
});
Qa.addEventListener("change", value => {
  const ancestorEl = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const value289 = Lw.get(ancestorEl);
  const property2 = Iw.get(ancestorEl);
  if (!!value289 || !!property2 || !!$p.has(ancestorEl)) {
    if ((property2 || $p.has(ancestorEl)) && (String(ancestorEl.value).trim() === "" || !Number.isFinite(Number(ancestorEl.value)))) {
      ee();
      return;
    }
    L(canvas6 => {
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
      const value82 = Number(canvas6.canvas.width || 2778);
      const value83 = Number(canvas6.canvas.height || 1940);
      const value84 = Number(ancestorEl.value);
      if (value289) {
        position9.properties[value289] = ancestorEl.value;
      } else if (property2) {
        position9.properties[property2.property] = clampNumber(value84, property2.minimum, property2.maximum) / property2.divisor;
        if (property2.resizes) {
          G0(position9, position9.properties);
        }
      } else if (ancestorEl === er) {
        position9.position.x = value82 * clampNumber(value84, 0, 100) / 100 - Number(position9.position.width || 100) / 2;
      } else if (ancestorEl === or) {
        position9.position.y = value83 * clampNumber(value84, 0, 100) / 100 - Number(position9.position.height || 100) / 2;
      } else if (ancestorEl === wo) {
        position9.style.scale = clampNumber(value84, 1, 500) / 100;
      } else if (ancestorEl === bi) {
        Gt2(canvas6, temp, clampNumber(value84, -360, 360));
      }
    });
  }
});
for (const t of [_b2, Yb2, Xb2, Kb2]) {
  t.addEventListener("click", value => {
    const temp = componentId;
    const ancestorEl = value.target.closest("button");
    if (!temp || !ancestorEl) {
      return;
    }
    const found = [["weatherIconVisible", "iconVisible"], ["weatherTemperatureVisible", "temperatureVisible"], ["weatherConditionVisible", "conditionVisible"], ["weatherHumidityVisible", "humidityVisible"]].find(([arg]) => ancestorEl.dataset[arg] !== undefined);
    if (!found) {
      return;
    }
    const [temp2, temp3] = found;
    L(arg => {
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
const Tw = new Map([[yy, "valueColor"], [vy, "statePrecision"], [iu, "thresholdMode"]]);
const Aw = new Map([[by, {
  property: "valueScale",
  minimum: 10,
  maximum: 500,
  divisor: 1
}], [wy, {
  property: "valueOffsetX",
  minimum: -100,
  maximum: 100,
  divisor: 1
}], [Cy, {
  property: "valueOffsetY",
  minimum: -100,
  maximum: 100,
  divisor: 1
}], [Sy, {
  property: "updateInterval",
  minimum: 30,
  maximum: 86400,
  divisor: 1
}], [xy, {
  property: "hours",
  minimum: 1,
  maximum: 168,
  divisor: 1
}], [Ny, {
  property: "cornerRadius",
  minimum: 0,
  maximum: 50,
  divisor: 1
}]]);
const Fp = new Set([or2, ir2, vi, wi2, Co, Ci]);
ir.addEventListener("input", value => {
  const temp = Number2();
  if (!temp || temp.type !== "line-chart") {
    return;
  }
  const target = value.target;
  const temp2 = Tw.get(target);
  const temp3 = Aw.get(target);
  if (temp2) {
    Sv2?.previewComponentProperties(temp.id, {
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
      Sv2?.previewComponentProperties(temp.id, {
        [temp3.property]: clamped / temp3.divisor
      });
    }
    return;
  }
  if (wi.findIndex(value116 => value116.value === target || value116.color === target) >= 0) {
    const every = wi.map(value68 => ({
      value: Number(value68.value.value),
      color: value68.color.value
    }));
    if (every.every(value85 => Number.isFinite(value85.value))) {
      Sv2?.previewComponentProperties(temp.id, {
        thresholdMode: "manual",
        thresholds: every
      });
    }
    return;
  }
  if (!Fp.has(target) || String(target.value).trim() === "" || !Number.isFinite(Number(target.value))) {
    return;
  }
  const numeric = Number(target.value);
  const numeric2 = Number(h.document.canvas.width || 2778);
  const numeric3 = Number(h.document.canvas.height || 1940);
  const numeric4 = Number(temp.position?.width || 100);
  const numeric5 = Number(temp.position?.height || 100);
  const number = Number(temp.position?.x || 0) + numeric4 / 2;
  const number2 = Number(temp.position?.y || 0) + numeric5 / 2;
  if (target === or2) {
    Sv2?.previewComponentTransform(temp.id, {
      x: numeric2 * clampNumber(numeric, 0, 100) / 100 - numeric4 / 2
    });
  } else if (target === ir2) {
    Sv2?.previewComponentTransform(temp.id, {
      y: numeric3 * clampNumber(numeric, 0, 100) / 100 - numeric5 / 2
    });
  } else if (target === vi) {
    const width5 = numeric2 * clampNumber(numeric, 0.1, 100) / 100;
    Sv2?.previewComponentTransform(temp.id, {
      x: number - width5 / 2,
      width: width5
    });
  } else if (target === wi2) {
    const height4 = numeric3 * clampNumber(numeric, 0.1, 100) / 100;
    Sv2?.previewComponentTransform(temp.id, {
      y: number2 - height4 / 2,
      height: height4
    });
  } else if (target === Co) {
    Sv2?.previewComponentTransform(temp.id, {
      scale: clampNumber(numeric, 1, 500) / 100
    });
  } else if (target === Ci) {
    Sv2?.previewComponentTransform(temp.id, {
      rotation: clampNumber(numeric, -360, 360)
    });
  }
});
ir.addEventListener("change", value => {
  const target = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const temp2 = Tw.get(target);
  const temp3 = Aw.get(target);
  const target2 = wi.findIndex(value117 => value117.value === target || value117.color === target);
  if (!!temp2 || !!temp3 || !(target2 < 0) || !!Fp.has(target)) {
    if ((temp3 || Fp.has(target) || target2 >= 0 && target.type === "number") && (String(target.value).trim() === "" || !Number.isFinite(Number(target.value)))) {
      ee();
      return;
    }
    L(doc => {
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
      const value86 = Number(doc.canvas.width || 2778);
      const numeric2 = Number(doc.canvas.height || 1940);
      const value87 = Number(component.position.width || 100);
      const numeric4 = Number(component.position.height || 100);
      const value88 = Number(component.position.x || 0) + value87 / 2;
      const number2 = Number(component.position.y || 0) + numeric4 / 2;
      const numeric5 = Number(target.value);
      if (temp2) {
        component.properties[temp2] = target.value;
        if (target === iu && target.value === "manual" && (!Array.isArray(component.properties.thresholds) || !component.properties.thresholds.some(value9 => Number.isFinite(Number(value9?.value))))) {
          component.properties.thresholds = wi.map(value10 => ({
            value: Number(value10.value.value),
            color: value10.color.value
          }));
        }
      } else if (temp3) {
        component.properties[temp3.property] = clampNumber(numeric5, temp3.minimum, temp3.maximum) / temp3.divisor;
      } else if (target2 >= 0) {
        component.properties.thresholdMode = "manual";
        component.properties.thresholds = wi.map(value11 => ({
          value: Number(value11.value.value),
          color: value11.color.value
        }));
      } else if (target === or2) {
        component.position.x = value86 * clampNumber(numeric5, 0, 100) / 100 - value87 / 2;
      } else if (target === ir2) {
        component.position.y = numeric2 * clampNumber(numeric5, 0, 100) / 100 - numeric4 / 2;
      } else if (target === vi) {
        component.position.width = value86 * clampNumber(numeric5, 0.1, 100) / 100;
        component.position.x = value88 - component.position.width / 2;
      } else if (target === wi2) {
        component.position.height = numeric2 * clampNumber(numeric5, 0.1, 100) / 100;
        component.position.y = number2 - component.position.height / 2;
      } else if (target === Co) {
        component.style.scale = clampNumber(numeric5, 1, 500) / 100;
      } else if (target === Ci) {
        Gt2(doc, temp, clampNumber(numeric5, -360, 360));
      }
    });
  }
});
hy.addEventListener("click", value => {
  const temp = value.target.closest("[data-line-chart-value-visible]");
  const target = componentId;
  if (!!temp && !!target) {
    L(arg38 => {
      const properties27 = findComponent(arg38, target)?.component;
      if (!!properties27 && properties27.type === "line-chart") {
        properties27.properties = {
          ...(properties27.properties || {}),
          valueVisible: temp.dataset.lineChartValueVisible === "on"
        };
      }
    });
  }
});
const Dp = new Map([[Ty, "mainColor"], [Dy, "secondaryColor"], [Gy, "edgeColor"], [Jy, "glowColor"]]);
const zp = new Map([[Ay, {
  property: "mainSize",
  minimum: 8,
  maximum: 500,
  divisor: 1
}], [Py, {
  property: "mainWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}], [ky, {
  property: "mainOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [My, {
  property: "mainSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}], [Oy, {
  property: "mainTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [By, {
  property: "mainTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [zy, {
  property: "secondarySize",
  minimum: 6,
  maximum: 500,
  divisor: 1
}], [Vy, {
  property: "secondaryWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}], [Wy, {
  property: "secondaryOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [Ry, {
  property: "secondarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}], [Hy, {
  property: "secondaryTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [jy, {
  property: "secondaryTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [Uy, {
  property: "edgeWidth",
  minimum: 0,
  maximum: 20,
  divisor: 1
}], [_y, {
  property: "edgeOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [Yy, {
  property: "radius",
  minimum: 0,
  maximum: 50,
  divisor: 100
}], [Xy, {
  property: "edgeAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}], [Zy, {
  property: "glowStrength",
  minimum: 0,
  maximum: 500,
  divisor: 100
}], [Qy, {
  property: "glowSize",
  minimum: 0,
  maximum: 300,
  divisor: 100
}], [ev, {
  property: "glowAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}]]);
const Wp = new Set([rr, sr2, Si, xi, So, Ni]);
sr.addEventListener("input", value => {
  const id3 = Number2();
  if (!id3 || id3.type !== "panel-frame") {
    return;
  }
  const value290 = value.target;
  const value291 = Dp.get(value290);
  const minimum = zp.get(value290);
  if (value291) {
    Sv2?.previewComponentProperties(id3.id, {
      [value291]: value290.value
    });
    return;
  }
  if (minimum) {
    if (String(value290.value).trim() === "" || !Number.isFinite(Number(value290.value))) {
      return;
    }
    const value183 = clampNumber(Number(value290.value), minimum.minimum, minimum.maximum);
    Sv2?.previewComponentProperties(id3.id, {
      [minimum.property]: value183 / minimum.divisor
    });
    return;
  }
  if (!Wp.has(value290) || String(value290.value).trim() === "" || !Number.isFinite(Number(value290.value))) {
    return;
  }
  const value292 = Number(value290.value);
  const value293 = Number(h.document.canvas.width || 2778);
  const value294 = Number(h.document.canvas.height || 1940);
  const value295 = Number(id3.position?.width || 100);
  const value296 = Number(id3.position?.height || 100);
  const value297 = Number(id3.position?.x || 0) + value295 / 2;
  const value298 = Number(id3.position?.y || 0) + value296 / 2;
  if (value290 === rr) {
    Sv2?.previewComponentTransform(id3.id, {
      x: value293 * clampNumber(value292, 0, 100) / 100 - value295 / 2
    });
  } else if (value290 === sr2) {
    Sv2?.previewComponentTransform(id3.id, {
      y: value294 * clampNumber(value292, 0, 100) / 100 - value296 / 2
    });
  } else if (value290 === Si) {
    const width6 = value293 * clampNumber(value292, 0.1, 100) / 100;
    Sv2?.previewComponentTransform(id3.id, {
      x: value297 - width6 / 2,
      width: width6
    });
  } else if (value290 === xi) {
    const height5 = value294 * clampNumber(value292, 0.1, 100) / 100;
    Sv2?.previewComponentTransform(id3.id, {
      y: value298 - height5 / 2,
      height: height5
    });
  } else if (value290 === So) {
    Sv2?.previewComponentTransform(id3.id, {
      scale: clampNumber(value292, 1, 500) / 100
    });
  } else if (value290 === Ni) {
    Sv2?.previewComponentTransform(id3.id, {
      rotation: clampNumber(value292, -360, 360)
    });
  }
});
sr.addEventListener("change", value => {
  const target = value.target;
  const temp = componentId;
  if (!temp) {
    return;
  }
  const value299 = Dp.get(target);
  const property3 = zp.get(target);
  if (!!value299 || !!property3 || !!Wp.has(target)) {
    if ((property3 || Wp.has(target)) && (String(target.value).trim() === "" || !Number.isFinite(Number(target.value)))) {
      ee();
      return;
    }
    L(doc => {
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
      const numeric2 = Number(position10.position.width || 100);
      const numeric3 = Number(position10.position.height || 100);
      const value89 = Number(position10.position.x || 0) + numeric2 / 2;
      const value90 = Number(position10.position.y || 0) + numeric3 / 2;
      const numeric32 = Number(target.value);
      if (value299) {
        position10.properties[value299] = target.value;
      } else if (property3) {
        position10.properties[property3.property] = clampNumber(numeric32, property3.minimum, property3.maximum) / property3.divisor;
      } else if (target === rr) {
        position10.position.x = chosen * clampNumber(numeric32, 0, 100) / 100 - numeric2 / 2;
      } else if (target === sr2) {
        position10.position.y = numeric * clampNumber(numeric32, 0, 100) / 100 - numeric3 / 2;
      } else if (target === Si) {
        position10.position.width = chosen * clampNumber(numeric32, 0.1, 100) / 100;
        position10.position.x = value89 - position10.position.width / 2;
      } else if (target === xi) {
        position10.position.height = numeric * clampNumber(numeric32, 0.1, 100) / 100;
        position10.position.y = value90 - position10.position.height / 2;
      } else if (target === So) {
        position10.style.scale = clampNumber(numeric32, 1, 500) / 100;
      } else if (target === Ni) {
        Gt2(doc, temp, clampNumber(numeric32, -360, 360));
      }
    });
  }
});
for (const [t, e] of [[wy2, "mainTextVisible"], [Ay2, "secondaryTextVisible"], [zy2, "edgeVisible"], [qy, "glowVisible"]]) {
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L(arg => {
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
const Hp = new Map([[cu, "mainText"], [lu, "secondaryText"], [rv, "mainColor"], [sv, "secondaryColor"], [yv, "iconColor"], [Sv, "frameColor"], [Ev, "glowColor"]]);
const yL = new Map([[cv, {
  property: "mainSize",
  minimum: 1,
  maximum: 500,
  divisor: 1
}], [lv, {
  property: "secondarySize",
  minimum: 1,
  maximum: 500,
  divisor: 1
}], [dv, {
  property: "mainWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}], [uv, {
  property: "secondaryWeight",
  minimum: 0,
  maximum: 3,
  divisor: 1
}], [pv, {
  property: "mainSpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}], [mv, {
  property: "secondarySpacing",
  minimum: -20,
  maximum: 100,
  divisor: 1
}], [fv, {
  property: "mainTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [gv, {
  property: "mainTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [hv, {
  property: "secondaryTextLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [bv, {
  property: "secondaryTextTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [du, {
  property: "textIdleOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [uu, {
  property: "textActiveOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [vv, {
  property: "iconSize",
  minimum: 1,
  maximum: 500,
  divisor: 1
}], [wv, {
  property: "iconLeft",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [Cv, {
  property: "iconTop",
  minimum: -100,
  maximum: 200,
  divisor: 1
}], [pu, {
  property: "iconIdleOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [mu, {
  property: "iconActiveOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [xv, {
  property: "frameWidth",
  minimum: 0,
  maximum: 20,
  divisor: 1
}], [fu, {
  property: "frameIdleOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [gu, {
  property: "frameActiveOpacity",
  minimum: 0,
  maximum: 100,
  divisor: 100
}], [Iv, {
  property: "radius",
  minimum: 0,
  maximum: 50,
  divisor: 100
}], [Nv, {
  property: "frameAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}], [Lv, {
  property: "glowAngle",
  minimum: 0,
  maximum: 360,
  divisor: 1
}], [hu, {
  property: "glowIdleStrength",
  minimum: 0,
  maximum: 500,
  divisor: 100
}], [bu, {
  property: "glowIdleSize",
  minimum: 0,
  maximum: 300,
  divisor: 100
}], [yu, {
  property: "glowActiveStrength",
  minimum: 0,
  maximum: 500,
  divisor: 100
}], [vu, {
  property: "glowActiveSize",
  minimum: 0,
  maximum: 300,
  divisor: 100
}]]);
const Ow = new Map([[du, "off"], [pu, "off"], [fu, "off"], [hu, "off"], [bu, "off"], [uu, "on"], [mu, "on"], [gu, "on"], [yu, "on"], [vu, "on"]]);
function IL(value) {
  if (value) {
    for (const classList2 of au.querySelectorAll("[data-navigation-preview]")) {
      classList2.classList.toggle("active", classList2.dataset.navigationPreview === value);
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
  Sv2?.setComponentPreviewState(value, chosen);
  if (value === componentId) {
    IL(chosen);
  }
}
function bL2(value) {
  const temp = Ow.get(value);
  const property = Number2();
  if (!temp || property?.type !== "navigation-button") {
    return null;
  } else {
    kw(property.id, temp);
    return temp;
  }
}
const Mw = new Set([ur2, pr, An2, Eo2, eN2, mc]);
function Ow2(value) {
  const temp = Hp.get(value);
  if (temp && Zr[temp]) {
    return temp;
  }
  const value371 = yL.get(value)?.property;
  if (value371 && Zr[value371]) {
    return value371;
  } else if (value === An2) {
    return "width";
  } else if (value === Eo2) {
    return "height";
  } else if (value === eN2) {
    return "scale";
  } else if (value === mc) {
    return "rotation";
  } else {
    return "";
  }
}
Ei.addEventListener("input", value => {
  const ancestorEl = Number2();
  if (!ancestorEl || ancestorEl.type !== "navigation-button") {
    return;
  }
  const temp = value.target;
  const chosen = Hp.get(temp);
  if (chosen) {
    if (!pw.has(temp)) {
      Sv2?.previewComponentProperties(ancestorEl.id, {
        [chosen]: temp.value
      });
    }
    return;
  }
  const minimum2 = yL.get(temp);
  if (minimum2) {
    if (String(temp.value).trim() === "" || !Number.isFinite(Number(temp.value))) {
      return;
    }
    const value184 = clampNumber(Number(temp.value), minimum2.minimum, minimum2.maximum);
    bL2(temp);
    Sv2?.previewComponentProperties(ancestorEl.id, {
      [minimum2.property]: value184 / minimum2.divisor
    });
    return;
  }
  if (!Mw.has(temp) || String(temp.value).trim() === "" || !Number.isFinite(Number(temp.value))) {
    return;
  }
  const value300 = Number(temp.value);
  const value301 = Number(h.document.canvas.width || 2778);
  const value302 = Number(h.document.canvas.height || 1940);
  const value303 = Number(ancestorEl.position?.width || 100);
  const value304 = Number(ancestorEl.position?.height || 100);
  if (temp === ur2) {
    const value185 = clampNumber(value300, 0, 100);
    Sv2?.previewComponentTransform(ancestorEl.id, {
      x: value301 * value185 / 100 - value303 / 2
    });
  } else if (temp === pr) {
    const value150 = clampNumber(value300, 0, 100);
    Sv2?.previewComponentTransform(ancestorEl.id, {
      y: value302 * value150 / 100 - value304 / 2
    });
  } else if (temp === An2) {
    const value118 = clampNumber(value300, 0.1, 100);
    const width7 = value301 * value118 / 100;
    const value119 = Number(ancestorEl.position?.x || 0) + value303 / 2;
    Sv2?.previewComponentTransform(ancestorEl.id, {
      x: value119 - width7 / 2,
      width: width7
    });
  } else if (temp === Eo2) {
    const value91 = clampNumber(value300, 0.1, 100);
    const height6 = value302 * value91 / 100;
    const value92 = Number(ancestorEl.position?.y || 0) + value304 / 2;
    Sv2?.previewComponentTransform(ancestorEl.id, {
      y: value92 - height6 / 2,
      height: height6
    });
  } else if (temp === eN2) {
    const value69 = clampNumber(value300, 1, 500);
    Sv2?.previewComponentTransform(ancestorEl.id, {
      scale: value69 / 100
    });
  } else if (temp === mc) {
    const rotation2 = clampNumber(value300, -360, 360);
    Sv2?.previewComponentTransform(ancestorEl.id, {
      rotation: rotation2
    });
  }
});
Ei.addEventListener("focusin", target29 => {
  bL2(target29.target);
});
Ei.addEventListener("change", target30 => {
  const value305 = target30.target;
  const value306 = componentId;
  if (!value306) {
    return;
  }
  const value307 = Hp.get(value305);
  const property4 = yL.get(value305);
  const value308 = Ow.get(value305);
  const value309 = Ow2(value305);
  if (value305 === gc || !!value307 || !!property4 || !!Mw.has(value305)) {
    if ((property4 || Mw.has(value305)) && (String(value305.value).trim() === "" || !Number.isFinite(Number(value305.value)))) {
      ee();
      return;
    }
    if (value308) {
      bL2(value305);
    }
    L(canvas7 => {
      const position11 = findComponent(canvas7, value306)?.component;
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
      const value93 = value309 ? Ae(position11, value309) : undefined;
      const value94 = Number(canvas7.canvas.width || 2778);
      const value95 = Number(canvas7.canvas.height || 1940);
      const value96 = Number(value305.value);
      if (value305 === gc) {
        position11.properties.label = value305.value.trim();
      } else if (value307) {
        position11.properties[value307] = value305.value;
      } else if (property4) {
        position11.properties[property4.property] = clampNumber(value96, property4.minimum, property4.maximum) / property4.divisor;
      } else if (value305 === ur2) {
        position11.position.x = value94 * clampNumber(value96, 0, 100) / 100 - Number(position11.position.width || 100) / 2;
      } else if (value305 === pr) {
        position11.position.y = value95 * clampNumber(value96, 0, 100) / 100 - Number(position11.position.height || 100) / 2;
      } else if (value305 === An2) {
        const width = value94 * clampNumber(value96, 0.1, 100) / 100;
        const value18 = Number(position11.position.x || 0) + Number(position11.position.width || 100) / 2;
        position11.position.x = value18 - width / 2;
        position11.position.width = width;
      } else if (value305 === Eo2) {
        const height = value95 * clampNumber(value96, 0.1, 100) / 100;
        const value12 = Number(position11.position.y || 0) + Number(position11.position.height || 100) / 2;
        position11.position.y = value12 - height / 2;
        position11.position.height = height;
      } else if (value305 === eN2) {
        position11.style.scale = clampNumber(value96, 1, 500) / 100;
      } else if (value305 === mc) {
        Gt2(canvas7, value306, clampNumber(value96, -360, 360));
      }
      if (value309) {
        Kn(value306, value309, value93, Ae(position11, value309));
      }
    });
  }
});
const AL = new Map([[tv, "mainTextVisible"], [nv, "secondaryTextVisible"], [ov, "iconVisible"], [iv, "frameVisible"], [av, "glowVisible"]]);
for (const [t, e] of AL) {
  t.addEventListener("click", () => {
    const value = componentId;
    if (value) {
      L(arg => {
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
au.addEventListener("click", target31 => {
  const dataset18 = target31.target.closest("[data-navigation-preview]");
  const value310 = componentId;
  if (!dataset18 || !value310) {
    return;
  }
  const value311 = ["off", "on"].includes(dataset18.dataset.navigationPreview) ? dataset18.dataset.navigationPreview : "auto";
  kw(value310, value311);
});
const PL = {
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
const $w = {
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
      return component.properties?.[value] ?? cloneValue(PL[value]);
    }
  }
}
function Ow3(value) {
  if (!value || value.type !== "line-chart") {
    return [];
  }
  let flag = Bi.get(value.id);
  if (!flag) {
    flag = cloneValue(findComponent(Ke2, value.id)?.component || value);
    Bi.set(value.id, flag);
  }
  return Object.keys($w).filter(arg => JSON.stringify(Qc(value, arg)) !== JSON.stringify(Qc(flag, arg)));
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
    const numeric = Number(arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (["valueScale", "valueOffsetX", "valueOffsetY", "cornerRadius"].includes(value)) {
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
const ML = {
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
const Fw = {
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
function el2(component, value) {
  if (component) {
    if (value === "width" || value === "height") {
      return Number(component.position?.[value] || 100);
    } else if (value === "scale") {
      return Number(component.style?.scale || 1);
    } else if (value === "rotation") {
      return Number(component.position?.rotation || 0);
    } else {
      return component.properties?.[value] ?? ML[value];
    }
  }
}
function $w2(value) {
  if (!value || value.type !== "title-button") {
    return [];
  }
  const temp = findComponent(Ke2, value.id)?.component || value;
  return Object.keys(Fw).filter(arg => JSON.stringify(el2(value, arg)) !== JSON.stringify(el2(temp, arg)));
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
    const numeric = Number(arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (["mainSize", "secondarySize", "mainSpacing", "secondarySpacing", "secondaryLineGap", "mainTextLeft", "mainTextTop", "secondaryTextLeft", "secondaryTextTop", "iconSize", "iconLeft", "iconTop", "frameSize", "frameSpacing", "frameOffsetX", "frameOffsetY", "markerSize", "markerLeft", "markerTop"].includes(value)) {
    return roundField(Number(arg2 || 0)) + "%";
  } else {
    return String(arg2 ?? "");
  }
}
const BL = {
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
const $L = {
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
const Vw = {
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
      return component.properties?.[value] ?? $L[value];
    }
  }
}
function Dw(value) {
  if (!value || value.type !== "air-conditioner") {
    return [];
  }
  let temp = Oi2.get(value.id);
  if (!temp) {
    temp = cloneValue(findComponent(Ke2, value.id)?.component || value);
    Oi2.set(value.id, temp);
  }
  return Object.keys(Vw).filter(arg => JSON.stringify(tl(value, arg)) !== JSON.stringify(tl(temp, arg)));
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
    const numeric = Number(arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940));
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
const Rw = {
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
      return component.properties?.[value] ?? BL[value];
    }
  }
}
function Vw2(component) {
  if (!component || component.type !== "icon-button-effect") {
    return [];
  }
  let sensorKind = $i.get(component.id);
  if (!sensorKind) {
    sensorKind = cloneValue(findComponent(Ke2, component.id)?.component || component);
    $i.set(component.id, sensorKind);
  }
  return Object.keys(Rw).filter(arg103 => JSON.stringify(nl(component, arg103)) !== JSON.stringify(nl(sensorKind, arg103)));
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
    const numeric = Number(arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (["buttonOpacity", "frameOpacity", "glowOffStrength", "glowOnStrength", "effectOpacity", "effectScale", "scale"].includes(value)) {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (["iconSize", "radius", "effectLeft", "effectTop"].includes(value)) {
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
  perspectiveCorners: Fu,
  waterLeakColor: "#42c8ff",
  smokeColor: "#ffffff",
  naturalGasColor: "#ffb347"
};
const Hw = {
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
const zL = {
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
  width: Hw.width,
  height: Hw.height,
  scale: Hw.scale,
  rotation: Hw.rotation
};
function Ho2(value) {
  const value372 = value?.properties?.sensorKind;
  if (["presence", "door-window", "water-leak", "smoke", "natural-gas"].includes(value372)) {
    return value372;
  } else {
    return "presence";
  }
}
function VL(value) {
  return {
    presence: "人体/人在传感器",
    "door-window": "门窗传感器",
    "water-leak": "水浸传感器",
    smoke: "烟雾传感器",
    "natural-gas": "天然气传感器"
  }[Ho2(value)];
}
function Ww(value) {
  const temp = ["width", "height", "scale", "rotation"];
  const value373 = Ho2(value);
  if (value373 === "presence") {
    return ["iconColor", "iconOnColor", "haloVisible", "haloScaleX", "haloScaleY", "haloRotation", "haloOpacity", "personVisible", "personScale", "personRotation", "personOpacity", "orbitDuration", ...temp];
  } else if (value373 === "door-window") {
    return ["iconOnColor", "perspectiveCorners", ...temp];
  } else if (value373 === "water-leak") {
    return ["waterLeakColor", ...temp];
  } else if (value373 === "smoke") {
    return ["smokeColor", ...temp];
  } else {
    return ["naturalGasColor", ...temp];
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
    return flag.iconColor ?? flag.clearColor ?? flag.iconOffColor ?? flag.iconOnColor ?? Jr.iconColor;
  } else if (value === "iconOnColor") {
    return flag.iconOnColor ?? flag.occupiedColor ?? Jr.iconOnColor;
  } else if (value === "mainColor") {
    return flag.mainColor ?? flag.mainOffColor ?? flag.mainOnColor ?? Jr.mainColor;
  } else if (value === "secondaryColor") {
    return flag.secondaryColor ?? flag.secondaryOffColor ?? flag.secondaryOnColor ?? Jr.secondaryColor;
  } else {
    return flag[value] ?? Jr[value];
  }
}
function Ww2(value) {
  if (!value || !["icon-button", "device-button", "presence-sensor"].includes(value.type)) {
    return [];
  }
  let flag = Fi.get(value.id);
  if (!flag) {
    flag = cloneValue(findComponent(Ke2, value.id)?.component || value);
    Fi.set(value.id, flag);
  }
  return (value.type === "presence-sensor" ? Ww(value) : value.type === "device-button" ? ["iconColor", "iconOnColor", "badgeColor", "badgeOpacity", "symbolSize", "badgeSize", "iconLeft", "iconTop", "mainColor", "mainSize", "mainWeight", "mainSpacing", "mainTextLeft", "mainTextTop", "secondaryColor", "secondarySize", "secondaryWeight", "secondarySpacing", "secondaryTextLeft", "secondaryTextTop", "width", "height", "scale", "rotation"] : Object.keys(Hw)).filter(arg => JSON.stringify(ol(value, arg)) !== JSON.stringify(ol(flag, arg)));
}
function PL2(value, arg2) {
  if (value?.type === "presence-sensor") {
    return zL[arg2];
  } else if (value?.type !== "device-button") {
    return Hw[arg2];
  } else if (arg2.startsWith("main")) {
    return {
      group: "标题",
      label: arg2 === "mainOnOpacity" ? "透明度" : Hw[arg2]?.label?.replace("中文", "")
    };
  } else if (arg2.startsWith("secondary")) {
    return {
      group: "状态",
      label: arg2 === "secondaryOnOpacity" ? "透明度" : Hw[arg2]?.label?.replace("英文", "")
    };
  } else {
    return Hw[arg2];
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
    const numeric = Number(arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (value === "perspectiveCorners") {
    if (JSON.stringify(arg2) === JSON.stringify(Fu)) {
      return "默认透视";
    } else {
      return "自定义透视";
    }
  } else if (value === "orbitDuration") {
    return roundField(Number(arg2 || 0)) + " 秒";
  } else if (value === "onFillFadeDuration") {
    return roundField(Number(arg2 || 0)) + " 秒";
  } else if (["rotation", "frameAngle", "softLightAngle", "glowAngle", "haloRotation", "personRotation"].includes(value)) {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (["iconOffOpacity", "iconOnOpacity", "mainOffOpacity", "mainOnOpacity", "secondaryOffOpacity", "secondaryOnOpacity", "badgeOpacity", "onFillStrength", "frameOffOpacity", "frameOnOpacity", "softLightStrength", "softLightSize", "glowStrength", "glowSize", "haloScaleX", "haloScaleY", "haloOpacity", "personScale", "personOpacity"].includes(value)) {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (["iconSize", "symbolSize", "badgeSize", "iconLeft", "iconTop", "mainTextLeft", "mainTextTop", "secondaryTextLeft", "secondaryTextTop", "cutCorner"].includes(value)) {
    return roundField(Number(arg2 || 0)) + "%";
  } else {
    return String(arg2 ?? "");
  }
}
const Rw2 = {
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
const Gw = {
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
    const numeric = Number(flag.radius ?? Rw2.radius);
    return Math.max(0, Math.min(0.5, numeric > 0.5 ? numeric / 100 : numeric));
  }
  return flag[value] ?? Rw2[value];
}
function jw(value) {
  if (!value || value.type !== "camera") {
    return [];
  }
  const temp = findComponent(Ke2, value.id)?.component || value;
  return Object.keys(Gw).filter(arg => JSON.stringify(il(value, arg)) !== JSON.stringify(il(temp, arg)));
}
function ML2(value, arg2, arg3 = h?.document) {
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
    const numeric = Number(arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940));
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
const _w = {
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
    return flag.mainTextTop ?? Number(flag.textTop ?? 28) - Number(flag.lineGap ?? 24) / count * 100;
  }
  if (value === "secondaryTextTop") {
    return flag.secondaryTextTop ?? flag.textTop ?? Rp.secondaryTextTop;
  } else {
    return flag[value] ?? Rp[value];
  }
}
function Gw2(value) {
  if (!value || value.type !== "panel-frame") {
    return [];
  }
  let temp = Oi.get(value.id);
  if (!temp) {
    temp = cloneValue(findComponent(Ke2, value.id)?.component || value);
    Oi.set(value.id, temp);
  }
  return Object.keys(_w).filter(arg104 => !temp || temp.type !== "panel-frame" ? true : JSON.stringify(al(value, arg104)) !== JSON.stringify(al(temp, arg104)));
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
    const numeric = Number(arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (value === "rotation" || value === "edgeAngle" || value === "glowAngle") {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (["mainOpacity", "secondaryOpacity", "edgeOpacity", "radius", "glowStrength", "glowSize"].includes(value)) {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (["mainTextLeft", "mainTextTop", "secondaryTextLeft", "secondaryTextTop"].includes(value)) {
    return roundField(Number(arg2 || 0)) + "%";
  } else {
    return String(arg2 ?? "");
  }
}
const GL = {
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
  const temp = GL[value];
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
  let temp = Oo2.get(value);
  if (!!temp || !Uw(arg3, arg4)) {
    if (!temp) {
      temp = new Map();
      Oo2.set(value, temp);
    }
    if (!temp.has(arg2)) {
      temp.set(arg2, cloneValue(arg3));
    }
  }
}
function _w2(value) {
  const keys = Oo2.get(value?.id);
  if (keys) {
    for (const value204 of keys.keys()) {
      if (!Zr[value204]) {
        keys.delete(value204);
      }
    }
    if (!keys.size) {
      Oo2.delete(value.id);
    }
  }
}
function _w3(id3) {
  _w2(id3);
  return [...(Oo2.get(id3?.id)?.entries() || [])].filter(([arg65, arg66]) => !Uw(Ae(id3, arg65), arg66)).map(([arg105]) => arg105);
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
    const numeric = Number(arg3?.canvas?.[value] || (value === "width" ? 2778 : 1940));
    return roundField(Number(arg2 || 0) / numeric * 100) + "%";
  }
  if (value === "scale") {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (value === "rotation") {
    return roundField(Number(arg2 || 0)) + "°";
  } else if (["textIdleOpacity", "textActiveOpacity", "iconIdleOpacity", "iconActiveOpacity", "frameIdleOpacity", "frameActiveOpacity", "radius", "glowIdleStrength", "glowIdleSize", "glowActiveStrength", "glowActiveSize"].includes(value)) {
    return roundField(Number(arg2 || 0) * 100) + "%";
  } else if (["mainTextLeft", "mainTextTop", "secondaryTextLeft", "secondaryTextTop", "iconLeft", "iconTop"].includes(value)) {
    return roundField(Number(arg2 || 0)) + "%";
  } else if (value === "frameAngle" || value === "glowAngle") {
    return roundField(Number(arg2 || 0)) + "°";
  } else {
    return String(arg2 ?? "");
  }
}
function Hp2({
  value: navigationTargetId,
  label: element4,
  detail: element5,
  target: arg122 = false
}) {
  const className10 = document.createElement("label");
  className10.className = "navigation-style-apply-option";
  const dataset30 = document.createElement("input");
  dataset30.type = "checkbox";
  dataset30.checked = true;
  if (arg122) {
    dataset30.dataset.navigationTargetId = navigationTargetId;
  } else {
    dataset30.dataset.navigationStyleProperty = navigationTargetId;
  }
  const textContent7 = document.createElement("span");
  textContent7.textContent = element4;
  if (element5) {
    const textContent6 = document.createElement("small");
    textContent6.textContent = element5;
    textContent7.append(textContent6);
  }
  className10.append(dataset30, textContent7);
  return className10;
}
function Hp3(arg123) {
  mr2.classList.remove("grouped-by-page");
  mr2.replaceChildren(...arg123);
}
function ji(value, detail) {
  const index = new Map();
  value.forEach(({
    component: arg,
    page
  }) => {
    const flag = page?.id || page?.path || page?.name || "unknown-page";
    if (!index.has(flag)) {
      index.set(flag, {
        page,
        components: []
      });
    }
    index.get(flag).components.push(arg);
  });
  const list = [...index.values()].map(({
    page: arg,
    components: arg2
  }) => {
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
    temp4.replaceChildren(...arg2.map(component => Hp2({
      value: component.id,
      label: componentLabel(component),
      detail,
      target: true
    })));
    const elements = [...temp4.querySelectorAll("[data-navigation-target-id]")];
    const callback = () => {
      const length = elements.filter(arg3 => arg3.checked).length;
      const flag = length === elements.length;
      element2.textContent = length + "/" + elements.length + " 个控件";
      element3.textContent = flag ? "取消全选" : "全选";
      element3.setAttribute("aria-label", (flag ? "取消选择" : "全选") + "“" + textContent + "”中的控件");
    };
    element3.addEventListener("click", () => {
      const flag = !elements.every(arg3 => arg3.checked);
      elements.forEach(arg3 => {
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
  });
  mr2.classList.add("grouped-by-page");
  mr2.replaceChildren(...list);
}
function YL() {
  const value = Number2();
  if (!value || value.type !== "navigation-button") {
    return;
  }
  const temp = _w3(value);
  const filtered = Rn(h.document.sharedComponents, "navigation-button").filter(component => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    an2.textContent = "应用导航按钮设置";
    mr.textContent = "应用到导航按钮";
    ke2.textContent = "侧边栏通用";
    Mn2.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的侧边栏导航按钮。图标名称、文字内容、目标页面、备注和位置不会改变。";
    On2.replaceChildren(...temp.map(component => {
      const temp2 = Zr[component];
      const temp3 = Ae(value, component);
      return Hp2({
        value: component,
        label: temp2.label,
        detail: temp2.group + " · " + FL(component, temp3)
      });
    }));
    Hp3(filtered.map(component => {
      const flag = component.properties?.targetPage || component.actions?.tap?.target || "";
      const found = h.document.pages.find(arg => arg.path === flag);
      return Hp2({
        value: component.id,
        label: componentLabel(component),
        detail: found ? "跳转到：" + found.name : "未设置目标页面",
        target: true
      });
    }));
    iN2.hidden = true;
    iN2.textContent = "";
    Pu = {
      sourceId: value.id,
      type: "navigation-button"
    };
    Ge.showModal();
  }
}
function XL() {
  const value = Number2();
  if (!value || value.type !== "panel-frame") {
    return;
  }
  const temp = Gw2(value);
  const flag = findComponent(h.document, value.id)?.scope === "page";
  const chosen = flag ? st("panel-frame").filter(({
    component
  }) => component.id !== value.id) : Rn(h.document.sharedComponents, "panel-frame").filter(component => component.id !== value.id).map(component => ({
    component
  }));
  if (!!temp.length && !!chosen.length) {
    an2.textContent = "应用底图框设置";
    mr.textContent = flag ? "应用到主页面底图框" : "应用到侧边栏底图框";
    ke2.textContent = flag ? "按页面区分" : "侧边栏通用";
    Mn2.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的" + (flag ? "主页面" : "侧边栏") + "底图框。文字内容、备注和位置不会改变。";
    On2.replaceChildren(...temp.map(arg => {
      const temp2 = _w[arg];
      const temp3 = al(value, arg);
      return Hp2({
        value: arg,
        label: temp2.label,
        detail: temp2.group + " · " + OL(arg, temp3)
      });
    }));
    if (flag) {
      ji(chosen, "主页面底图框");
    } else {
      Hp3(chosen.map(({
        component
      }) => Hp2({
        value: component.id,
        label: componentLabel(component),
        detail: "侧边栏共享控件",
        target: true
      })));
    }
    iN2.hidden = true;
    iN2.textContent = "";
    Pu = {
      sourceId: value.id,
      type: "panel-frame"
    };
    Ge.showModal();
  }
}
function KL() {
  const value = Number2();
  if (!value || value.type !== "camera") {
    return;
  }
  const temp = jw(value);
  const filtered = st("camera").filter(({
    component
  }) => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    an2.textContent = "应用摄像头实时预览设置";
    mr.textContent = "应用到主页面摄像头实时预览";
    ke2.textContent = "按页面区分";
    Mn2.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的主页面摄像头实时预览。实体、备注、动作和控件位置不会改变。";
    On2.replaceChildren(...temp.map(arg => {
      const temp2 = Gw[arg];
      const temp3 = il(value, arg);
      return Hp2({
        value: arg,
        label: temp2.label,
        detail: temp2.group + " · " + ML2(arg, temp3)
      });
    }));
    ji(filtered, "摄像头实时预览");
    iN2.hidden = true;
    iN2.textContent = "";
    Pu = {
      sourceId: value.id,
      type: "camera"
    };
    Ge.showModal();
  }
}
function JL() {
  const value = Number2();
  if (!value || value.type !== "title-button") {
    return;
  }
  const temp = $w2(value);
  const filtered = st("title-button").filter(({
    component
  }) => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    an2.textContent = "应用标题按钮设置";
    mr.textContent = "应用到主页面标题按钮";
    ke2.textContent = "按页面区分";
    Mn2.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的标题按钮。文字内容、图标名称、备注、动作和控件中心位置不会改变。";
    On2.replaceChildren(...temp.map(arg => {
      const temp2 = Fw[arg];
      const temp3 = el2(value, arg);
      return Hp2({
        value: arg,
        label: temp2.label,
        detail: temp2.group + " · " + SL(arg, temp3)
      });
    }));
    ji(filtered, "标题按钮");
    iN2.hidden = true;
    iN2.textContent = "";
    Pu = {
      sourceId: value.id,
      type: "title-button"
    };
    Ge.showModal();
  }
}
function RL() {
  const value = Number2();
  if (!value || value.type !== "icon-button-effect") {
    return;
  }
  const temp = Vw2(value);
  const filtered = st("icon-button-effect").filter(({
    component
  }) => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    an2.textContent = "应用图标按钮（效果）设置";
    mr.textContent = "应用到主页面同类型控件";
    ke2.textContent = "按页面区分";
    Mn2.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的主页面图标按钮（效果）。实体、备注、动作和按钮位置不会改变。";
    On2.replaceChildren(...temp.map(arg => {
      const temp2 = Rw[arg];
      const temp3 = nl(value, arg);
      return Hp2({
        value: arg,
        label: temp2.label,
        detail: temp2.group + " · " + LL(arg, temp3)
      });
    }));
    ji(filtered, "图标按钮（效果）");
    iN2.hidden = true;
    iN2.textContent = "";
    Pu = {
      sourceId: value.id,
      type: "icon-button-effect"
    };
    Ge.showModal();
  }
}
function HL() {
  const value = Number2();
  if (!value || value.type !== "air-conditioner") {
    return;
  }
  const temp = Dw(value);
  const filtered = st("air-conditioner").filter(({
    component
  }) => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    an2.textContent = "应用空调设置";
    mr.textContent = "应用到主页面同类型控件";
    ke2.textContent = "按页面区分";
    Mn2.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的空调控件。实体、备注、文字内容、动作和按钮位置不会改变。";
    On2.replaceChildren(...temp.map(arg => {
      const temp2 = Vw[arg];
      const temp3 = tl(value, arg);
      return Hp2({
        value: arg,
        label: temp2.label,
        detail: temp2.group + " · " + EL(arg, temp3)
      });
    }));
    ji(filtered, "空调");
    iN2.hidden = true;
    iN2.textContent = "";
    Pu = {
      sourceId: value.id,
      type: "air-conditioner"
    };
    Ge.showModal();
  }
}
function jL() {
  const value = Number2();
  if (!value || !["icon-button", "device-button", "presence-sensor"].includes(value.type)) {
    return;
  }
  const chosen = value.type === "presence-sensor" ? VL(value) : value.type === "device-button" ? "设备按钮" : "图标按钮";
  const temp = Ww2(value);
  const temp2 = Ho2(value);
  const filtered = st(value.type).filter(({
    component
  }) => component.id !== value.id && (value.type !== "presence-sensor" || Ho2(component) === temp2));
  if (!!temp.length && !!filtered.length) {
    an2.textContent = "应用" + chosen + "设置";
    mr.textContent = "应用到主页面同类型控件";
    ke2.textContent = "按页面区分";
    Mn2.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的主页面" + chosen + "。实体、备注、图标名称、文字内容和位置不会改变。";
    On2.replaceChildren(...temp.map(arg => {
      const temp3 = PL2(value, arg);
      const temp4 = ol(value, arg);
      return Hp2({
        value: arg,
        label: temp3.label,
        detail: temp3.group + " · " + kL(arg, temp4)
      });
    }));
    ji(filtered, chosen);
    iN2.hidden = true;
    iN2.textContent = "";
    Pu = {
      sourceId: value.id,
      type: value.type
    };
    Ge.showModal();
  }
}
function tI() {
  const value = Number2();
  if (!value || value.type !== "line-chart") {
    return;
  }
  const temp = Ow3(value);
  const filtered = Rn(h.document.sharedComponents, "line-chart").filter(component => component.id !== value.id);
  if (!!temp.length && !!filtered.length) {
    an2.textContent = "应用折线图设置";
    mr.textContent = "应用到折线图";
    ke2.textContent = "侧边栏通用";
    Mn2.textContent = "将“" + componentLabel(value) + "”中选定的修改应用到选中的侧边栏折线图。数值实体、备注、动作和位置不会改变。";
    On2.replaceChildren(...temp.map(arg => {
      const temp2 = $w[arg];
      const temp3 = Qc(value, arg);
      return Hp2({
        value: arg,
        label: temp2.label,
        detail: temp2.group + " · " + wL(arg, temp3)
      });
    }));
    Hp3(filtered.map(component => Hp2({
      value: component.id,
      label: componentLabel(component),
      detail: component.bindings?.entity?.entityId || "未设置数值实体",
      target: true
    })));
    iN2.hidden = true;
    iN2.textContent = "";
    Pu = {
      sourceId: value.id,
      type: "line-chart"
    };
    Ge.showModal();
  }
}
function GL2(value, component, arg3) {
  const temp = cloneValue(Ae(value, arg3));
  if (arg3 === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
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
  const temp = cloneValue(al(value, arg3));
  if (arg3 === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
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
  const temp = cloneValue(il(value, arg3));
  if (arg3 === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
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
function YL2(value, component, arg3) {
  const temp = cloneValue(Qc(value, arg3));
  if (arg3 === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
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
function XL2(value, component, arg3) {
  const temp = cloneValue(nl(value, arg3));
  if (arg3 === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
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
function KL2(value, component, arg3) {
  const temp = cloneValue(el2(value, arg3));
  if (arg3 === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
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
function JL2(value, component, arg3) {
  const temp = cloneValue(ol(value, arg3));
  if (arg3 === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
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
  const temp = cloneValue(tl(value, arg3));
  if (arg3 === "width") {
    const number = Number(component.position?.x || 0) + Number(component.position?.width || 100) / 2;
    component.position = {
      ...(component.position || {}),
      x: number - Number(temp) / 2,
      width: Number(temp)
    };
    return;
  }
  if (arg3 === "height") {
    const number = Number(component.position?.y || 0) + Number(component.position?.height || 100) / 2;
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
mc2.addEventListener("click", YL);
uc.addEventListener("click", XL);
lc.addEventListener("click", KL);
zs.addEventListener("click", JL);
dc.addEventListener("click", tI);
Ps2.addEventListener("click", RL);
Ys.addEventListener("click", jL);
_d.addEventListener("click", HL);
pN.addEventListener("click", () => Ge.close());
mN.addEventListener("click", () => Ge.close());
Ge.addEventListener("click", target32 => {
  if (target32.target === Ge) {
    Ge.close();
  }
});
Ge.addEventListener("close", () => {
  Pu = null;
});
fN.addEventListener("click", () => {
  const value312 = Pu?.sourceId;
  const value313 = Pu?.type;
  const length9 = [...On2.querySelectorAll("[data-navigation-style-property]:checked")].map(dataset2 => dataset2.dataset.navigationStyleProperty);
  const length10 = [...mr2.querySelectorAll("[data-navigation-target-id]:checked")].map(dataset3 => dataset3.dataset.navigationTargetId);
  if (!value312 || !length9.length || !length10.length) {
    const value186 = value313 === "panel-frame" ? "底图框" : value313 === "camera" ? "摄像头实时预览" : value313 === "title-button" ? "标题按钮" : value313 === "air-conditioner" ? "空调" : value313 === "line-chart" ? "折线图" : value313 === "icon-button-effect" ? "图标按钮（效果）" : value313 === "icon-button" ? "图标按钮" : value313 === "device-button" ? "设备按钮" : value313 === "presence-sensor" ? "传感器" : "导航按钮";
    iN2.textContent = "请至少选择一项修改和一个目标" + value186 + "。";
    iN2.hidden = false;
    return;
  }
  Ge.close();
  L(arg39 => {
    const type9 = findComponent(arg39, value312)?.component;
    if (!!type9 && type9.type === value313) {
      for (const value27 of length10) {
        const type3 = findComponent(arg39, value27)?.component;
        if (!!type3 && type3.type === value313 && (value313 !== "presence-sensor" || Ho2(type3) === Ho2(type9))) {
          for (const value19 of length9) {
            if (value313 === "panel-frame") {
              UL(type9, type3, value19);
            } else if (value313 === "camera") {
              _L(type9, type3, value19);
            } else if (value313 === "title-button") {
              KL2(type9, type3, value19);
            } else if (value313 === "line-chart") {
              YL2(type9, type3, value19);
            } else if (value313 === "icon-button-effect") {
              XL2(type9, type3, value19);
            } else if (value313 === "air-conditioner") {
              ZL(type9, type3, value19);
            } else if (["icon-button", "device-button", "presence-sensor"].includes(value313)) {
              JL2(type9, type3, value19);
            } else {
              GL2(type9, type3, value19);
            }
          }
        }
      }
    }
  }).then(() => {
    const classList = value313 === "panel-frame" ? uc : value313 === "camera" ? lc : value313 === "title-button" ? zs : value313 === "air-conditioner" ? _d : value313 === "line-chart" ? dc : value313 === "icon-button-effect" ? Ps2 : ["icon-button", "device-button", "presence-sensor"].includes(value313) ? Ys : mc2;
    if (value313 === "panel-frame") {
      window.clearTimeout(Vv);
    } else if (value313 === "camera") {
      window.clearTimeout(Pt2);
    } else if (value313 === "title-button") {
      window.clearTimeout(Hv);
    } else if (value313 === "air-conditioner") {
      window.clearTimeout(Au2);
    } else if (value313 === "line-chart") {
      window.clearTimeout(Wv);
    } else if (value313 === "icon-button-effect") {
      window.clearTimeout(Rv);
    } else if (["icon-button", "device-button", "presence-sensor"].includes(value313)) {
      window.clearTimeout(jv);
    } else {
      window.clearTimeout(zv);
    }
    classList.classList.add("applied");
    const value151 = window.setTimeout(() => {
      classList.classList.remove("applied");
      if (componentId === value312) {
        ee();
      }
    }, 1800);
    if (value313 === "panel-frame") {
      Vv = value151;
    } else if (value313 === "camera") {
      Pt2 = value151;
    } else if (value313 === "title-button") {
      Hv = value151;
    } else if (value313 === "air-conditioner") {
      Au2 = value151;
    } else if (value313 === "line-chart") {
      Wv = value151;
    } else if (value313 === "icon-button-effect") {
      Rv = value151;
    } else if (["icon-button", "device-button", "presence-sensor"].includes(value313)) {
      jv = value151;
    } else {
      zv = value151;
    }
  });
});
on.addEventListener("click", () => {
  const ancestorEl = dr.hidden;
  closeOtherPickerPanels(ancestorEl ? "navigation-icon" : null);
  dr.hidden = !ancestorEl;
  on.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    Zu(ur.value).then(() => {
      k0();
      ur.focus({
        preventScroll: true
      });
    }).catch(onError);
  }
});
cr.addEventListener("click", async () => {
  const hidden = Number2()?.properties?.icon || "";
  if (hidden) {
    try {
      await zo2(hidden);
      window.clearTimeout(Av);
      cr.classList.add("copied");
      Av = window.setTimeout(() => cr.classList.remove("copied"), 1200);
    } catch (value120) {
      onError(value120);
    }
  }
});
ur.addEventListener("input", () => {
  window.clearTimeout(Tv);
  Tv = window.setTimeout(() => {
    Zu(ur.value).catch(onError);
  }, 160);
});
dr2.addEventListener("click", target33 => {
  const dataset19 = target33.target.closest("[data-icon-name]");
  const value314 = componentId;
  if (!dataset19 || !value314) {
    return;
  }
  const icon = dataset19.dataset.iconName;
  closeOtherPickerPanels();
  L(arg67 => {
    const properties41 = findComponent(arg67, value314)?.component;
    if (!properties41 || properties41.type !== "navigation-button") {
      return;
    }
    const value152 = Ae(properties41, "icon");
    const value153 = Ae(properties41, "iconVisible");
    properties41.properties = {
      ...(properties41.properties || {}),
      icon,
      iconVisible: !!icon
    };
    Kn(value314, "icon", value152, Ae(properties41, "icon"));
    Kn(value314, "iconVisible", value153, Ae(properties41, "iconVisible"));
  });
});
Qt.addEventListener("click", () => {
  const ancestorEl = Sa.hidden;
  closeOtherPickerPanels(ancestorEl ? "ibe-icon" : null);
  Sa.hidden = !ancestorEl;
  Qt.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    Qu(xa.value).then(() => {
      M0();
      xa.focus({
        preventScroll: true
      });
    }).catch(onError);
  }
});
wa2.addEventListener("click", async () => {
  const hidden = Number2()?.properties?.icon || "";
  if (hidden) {
    try {
      await zo2(hidden);
      window.clearTimeout(kv);
      wa2.classList.add("copied");
      kv = window.setTimeout(() => wa2.classList.remove("copied"), 1200);
    } catch (value121) {
      onError(value121);
    }
  }
});
xa.addEventListener("input", () => {
  window.clearTimeout(Pv);
  Pv = window.setTimeout(() => Qu(xa.value).catch(onError), 160);
});
Sa2.addEventListener("click", target34 => {
  const dataset20 = target34.target.closest("[data-icon-name]");
  const value315 = componentId;
  if (!dataset20 || !value315) {
    return;
  }
  const icon2 = dataset20.dataset.iconName;
  closeOtherPickerPanels();
  L(arg68 => {
    const properties42 = findComponent(arg68, value315)?.component;
    if (!!properties42 && properties42.type === "icon-button-effect") {
      properties42.properties = {
        ...(properties42.properties || {}),
        icon: icon2
      };
    }
  });
});
Lt.addEventListener("click", () => {
  const ancestorEl = Va.hidden;
  closeOtherPickerPanels(ancestorEl ? "icon-button-icon" : null);
  Va.hidden = !ancestorEl;
  Lt.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    ep(Wa.value).then(() => {
      O0();
      Wa.focus({
        preventScroll: true
      });
    }).catch(onError);
  }
});
Da.addEventListener("click", async () => {
  const hidden = Number2()?.properties?.icon || "";
  if (hidden) {
    try {
      await zo2(hidden);
      window.clearTimeout(Ov);
      Da.classList.add("copied");
      Ov = window.setTimeout(() => Da.classList.remove("copied"), 1200);
    } catch (value122) {
      onError(value122);
    }
  }
});
Wa.addEventListener("input", () => {
  window.clearTimeout(Mv);
  Mv = window.setTimeout(() => ep(Wa.value).catch(onError), 160);
});
Va2.addEventListener("click", target35 => {
  const dataset21 = target35.target.closest("[data-icon-name]");
  const value316 = componentId;
  if (!dataset21 || !value316) {
    return;
  }
  const icon3 = dataset21.dataset.iconName;
  closeOtherPickerPanels();
  L(arg69 => {
    const properties43 = findComponent(arg69, value316)?.component;
    if (!!properties43 && !!["icon-button", "device-button", "presence-sensor"].includes(properties43.type)) {
      properties43.properties = {
        ...(properties43.properties || {}),
        icon: icon3
      };
    }
  });
});
tn.addEventListener("click", value => {
  value.preventDefault();
  value.stopPropagation();
  const ancestorEl = Ta.hidden;
  closeOtherPickerPanels(ancestorEl ? "title-button-icon" : null);
  if (ancestorEl && Ta.parentElement !== document.body) {
    document.body.append(Ta);
  }
  Ta.hidden = !ancestorEl;
  Ta.style.position = "fixed";
  Ta.style.zIndex = "760";
  tn.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    op();
    tp(Aa.value).then(() => {
      op();
      Aa.focus({
        preventScroll: true
      });
    }).catch(onError);
  }
});
La.addEventListener("click", async () => {
  const hidden = Number2()?.properties?.icon || "";
  if (hidden) {
    try {
      await zo2(hidden);
      window.clearTimeout($v);
      La.classList.add("copied");
      $v = window.setTimeout(() => La.classList.remove("copied"), 1200);
    } catch (value123) {
      onError(value123);
    }
  }
});
Aa.addEventListener("input", () => {
  window.clearTimeout(Bv);
  Bv = window.setTimeout(() => tp(Aa.value).catch(onError), 160);
});
Ta2.addEventListener("click", target36 => {
  const dataset22 = target36.target.closest("[data-icon-name]");
  const value317 = componentId;
  if (!dataset22 || !value317) {
    return;
  }
  const icon4 = dataset22.dataset.iconName;
  closeOtherPickerPanels();
  L(arg70 => {
    const properties44 = findComponent(arg70, value317)?.component;
    if (!!properties44 && properties44.type === "title-button") {
      properties44.properties = {
        ...(properties44.properties || {}),
        icon: icon4,
        iconVisible: !!icon4
      };
    }
  });
});
nn.addEventListener("click", value => {
  value.preventDefault();
  value.stopPropagation();
  const ancestorEl = Ba.hidden;
  closeOtherPickerPanels(ancestorEl ? "light-statistics-icon" : null);
  if (ancestorEl && Ba.parentElement !== document.body) {
    document.body.append(Ba);
  }
  Ba.hidden = !ancestorEl;
  Ba.style.position = "fixed";
  Ba.style.zIndex = "760";
  nn.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    ip();
    np($a.value).then(() => {
      ip();
      $a.focus({
        preventScroll: true
      });
    }).catch(onError);
  }
});
Ma2.addEventListener("click", async () => {
  const hidden = Number2()?.properties?.icon || "";
  if (hidden) {
    try {
      await zo2(hidden);
      window.clearTimeout(ko2);
      Ma2.classList.add("copied");
      ko2 = window.setTimeout(() => Ma2.classList.remove("copied"), 1200);
    } catch (value124) {
      onError(value124);
    }
  }
});
$a.addEventListener("input", () => {
  window.clearTimeout(Rt2);
  Rt2 = window.setTimeout(() => np($a.value).catch(onError), 160);
});
Ba2.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-light-statistics-icon-name]");
  const value318 = componentId;
  if (!ancestorEl || !value318) {
    return;
  }
  const icon5 = ancestorEl.dataset.lightStatisticsIconName;
  closeOtherPickerPanels();
  L(arg71 => {
    const properties45 = findComponent(arg71, value318)?.component;
    if (!!properties45 && properties45.type === "light-statistics") {
      properties45.properties = {
        ...(properties45.properties || {}),
        icon: icon5
      };
    }
  });
});
rt.addEventListener("click", preventDefault7 => {
  preventDefault7.preventDefault();
  preventDefault7.stopPropagation();
  const value319 = Ie2.hidden;
  closeOtherPickerPanels(value319 ? "light-statistics-entity" : null);
  if (value319 && Ie2.parentElement !== document.body) {
    document.body.append(Ie2);
  }
  Ie2.hidden = !value319;
  Ie2.style.position = "fixed";
  Ie2.style.zIndex = "760";
  rt.setAttribute("aria-expanded", String(value319));
  if (value319) {
    Xu(Ma.value);
    ap();
    window.requestAnimationFrame(() => {
      ap();
      Ma.focus({
        preventScroll: true
      });
    });
  }
});
Ma.addEventListener("input", () => Xu(Ma.value));
ka.addEventListener("click", target37 => {
  const hidden = target37.target.closest("[data-light-statistics-entity-id]");
  if (hidden) {
    closePickerPanel(Ie2, rt);
    tE(hidden.dataset.lightStatisticsEntityId);
  }
});
tx.addEventListener("click", () => w0());
ug.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-light-statistics-replace-index]");
  const temp = value.target.closest("[data-light-statistics-remove-index]");
  if (temp) {
    UN(Number(temp.dataset.lightStatisticsRemoveIndex));
    return;
  }
  if (ancestorEl) {
    Rt3 = "";
    ko3 = Number(ancestorEl.dataset.lightStatisticsReplaceIndex);
    Sr = componentId || "";
    dg.hidden = true;
    jn("请选择新的实体。");
    Mr(rt, "选择替换实体");
    rt.click();
  }
});
oi.addEventListener("click", () => {
  const value320 = aa2.hidden;
  closeOtherPickerPanels(value320 ? "entity" : null);
  aa2.hidden = !value320;
  oi.setAttribute("aria-expanded", String(value320));
  if (value320) {
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
_m2.addEventListener("click", target38 => {
  const dataset23 = target38.target.closest("[data-entity-id]");
  if (!dataset23 || !componentId) {
    return;
  }
  const value321 = componentId;
  const entityId5 = dataset23.dataset.entityId;
  closeOtherPickerPanels();
  L(arg72 => {
    const bindings = findComponent(arg72, value321)?.component;
    if (!bindings || bindings.type !== "image") {
      return;
    }
    const value154 = String(bindings.bindings?.entity?.entityId || "");
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
      for (const value57 of ["tap", "doubleTap", "hold"]) {
        if (actionNeedsCurrentEntity(bindings.actions?.[value57])) {
          delete bindings.actions[value57];
        }
      }
    }
    if (entityId5 !== value154) {
      if (entityId5 ? relatedPopupContext(bindings, Fr(), Dr()) : null) {
        bindings.properties.relatedEntities = manualRelatedEntityConfig([]);
      } else {
        delete bindings.properties.relatedEntities;
      }
    }
  });
});
function _t(value, arg2 = [value]) {
  const temp = Un(value);
  temp.button.addEventListener("click", () => {
    const chosen = arg2.includes(Number2()?.type) ? Number2().type : value;
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
    const chosen = arg2.includes(Number2()?.type) ? Number2().type : value;
    $r(temp.search.value, chosen);
  });
  temp.options.addEventListener("click", event2 => {
    const ancestorEl = event2.target.closest("[data-entity-id]");
    const temp2 = componentId;
    if (!ancestorEl || !temp2) {
      return;
    }
    const entityId = ancestorEl.dataset.entityId;
    closeOtherPickerPanels();
    L(doc => {
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
          component.actions = Object.fromEntries(Object.entries(component.actions || {}).filter(([, arg]) => !actionNeedsCurrentEntity(arg)));
        }
        let temp3 = false;
        for (const temp4 of ["tap", "doubleTap", "hold"]) {
          if (actionNeedsCurrentEntity(component.actions?.[temp4])) {
            delete component.actions[temp4];
            temp3 = true;
          }
        }
        if (component.type === "navigation-button" && temp3 && !component.actions.tap) {
          const target = new Set(doc.pages.map(arg => arg.path)).has(component.properties?.targetPage) ? component.properties.targetPage : R.value || doc.pages[0]?.path || "";
          if (target) {
            component.actions.tap = {
              type: "navigate",
              target
            };
          }
        }
      }
      if (value === "weather") {
        const entityId2 = le.find(arg => arg.entityId === "sun.sun")?.entityId;
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
let iC2 = null;
const {
  deferUntilEntitiesLoaded: sl
} = createEditorPickerLifecycle({
  getEntitiesLoaded: () => Tu3,
  getEntityLoadPromise: () => Po2,
  loadEntities: jc,
  reportError: onError
});
function QL() {
  iC2?.close();
}
function qi({
  kind,
  title: element6,
  subtitle: element8 = "",
  searchPlaceholder: placeholder,
  triggerButton: setAttribute,
  pageSize,
  initialPage: arg127 = 1,
  selectedText = "",
  emptyText: element7,
  itemClass: arg128 = "",
  getPage: arg124,
  renderItem: arg125,
  renderLeadingItems: arg129 = null,
  renderTrailingItems: arg130 = null,
  buildToolbar: arg131 = null,
  onSelect: arg126,
  onDelete: arg132 = null,
  onItemHover: arg133 = null,
  closeLegacyPickers: arg134 = true,
  renderSelectedActions: arg135 = null,
  renderSelectedContent: arg136 = null
}) {
  QL();
  if (arg134) {
    closeOtherPickerPanels();
  }
  const component = document.createElement("dialog");
  component.className = "editor-paged-picker-dialog";
  component.dataset.editorPickerKind = kind;
  const value = document.createElement("div");
  value.className = "editor-paged-picker-card" + (arg131 ? " with-toolbar" : "");
  const temp = document.createElement("div");
  temp.className = "editor-paged-picker-heading";
  const append = document.createElement("div");
  append.className = element8 ? "editor-paged-picker-heading-copy has-subtitle" : "editor-paged-picker-heading-copy";
  const textContent8 = document.createElement("strong");
  textContent8.textContent = element6;
  const textContent9 = document.createElement("span");
  textContent9.textContent = element8;
  append.append(textContent8);
  if (element8) {
    append.append(textContent9);
  }
  const type18 = document.createElement("button");
  type18.type = "button";
  type18.className = "editor-paged-picker-close";
  type18.setAttribute("aria-label", "关闭");
  type18.textContent = "×";
  temp.append(append, type18);
  const hidden3 = document.createElement("div");
  hidden3.className = "editor-paged-picker-toolbar";
  hidden3.hidden = !arg131;
  const className11 = document.createElement("label");
  className11.className = "editor-paged-picker-search";
  const type19 = document.createElement("input");
  type19.type = "search";
  type19.placeholder = placeholder;
  type19.autocomplete = "off";
  className11.append(type19);
  const append2 = document.createElement("div");
  append2.className = "editor-paged-picker-selected";
  const selectedValueText = selectedText || (kind === "entity" ? "不使用实体" : "");
  append2.hidden = !selectedValueText;
  if (selectedValueText) {
    const className5 = document.createElement("span");
    className5.className = "editor-paged-picker-current-label";
    className5.textContent = "当前选择";
    append2.append(className5);
    if (arg136) {
      append2.append(...(arg136({
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
  if (arg135) {
    const length6 = arg135({
      controller: null
    });
    if (length6?.length) {
      append2.classList.add("has-actions");
      append2.hidden = false;
      append2.append(...length6);
    }
  }
  const addEventListener = document.createElement("div");
  addEventListener.className = ("editor-paged-picker-items " + arg128).trim();
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
  const value374 = document.createElement("input");
  value374.type = "text";
  value374.inputMode = "numeric";
  value374.setAttribute("aria-label", "页码");
  const textContent11 = document.createElement("span");
  const disabled8 = document.createElement("button");
  disabled8.type = "button";
  disabled8.textContent = "下一页";
  className13.append(disabled7, value374, textContent11, disabled8);
  className12.append(textContent10, className13);
  value.append(temp, hidden3, className11, append2, addEventListener, className12);
  component.append(value);
  document.body.append(component);
  let value375 = null;
  let value376 = 0;
  let value377 = false;
  const page4 = {
    page: Math.max(1, Number(arg127) || 1),
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
      resetPage: arg96 = false
    } = {}) {
      if (arg96) {
        page4.page = 1;
      }
      return fn3();
    },
    rebuildToolbar() {
      if (!!arg131 && !value377) {
        hidden3.replaceChildren();
        arg131({
          toolbar: hidden3,
          controller: close
        });
        hidden3.hidden = !hidden3.childElementCount;
      }
    },
    close() {
      if (!value377) {
        if (component.open) {
          component.close();
        } else {
          fn2();
        }
      }
    }
  };
  function fn2() {
    if (!value377) {
      value377 = true;
      window.clearTimeout(value375);
      value376 += 1;
      setAttribute?.setAttribute("aria-expanded", "false");
      addEventListener.replaceChildren();
      hidden3.replaceChildren();
      if (component.contains(y12)) {
        document.body.append(y12);
      }
      component.remove();
      if (iC2 === close) {
        iC2 = null;
      }
      Qe();
    }
  }
  async function fn3() {
    const value322 = ++value376;
    addEventListener.setAttribute("aria-busy", "true");
    textContent10.textContent = "正在加载…";
    disabled7.disabled = true;
    disabled8.disabled = true;
    try {
      const total = await arg124({
        query: page4.query,
        page: page4.page,
        pageSize
      });
      if (value377 || value322 !== value376) {
        return;
      }
      page4.total = Math.max(0, Number(total.total) || 0);
      page4.pageCount = Math.max(1, Math.ceil(page4.total / pageSize));
      if (page4.page > page4.pageCount) {
        page4.page = page4.pageCount;
        await fn3();
        return;
      }
      const value187 = arg129 ? arg129(page4) : [];
      const push3 = (total.items || []).map(arg16 => arg125(arg16));
      if (!push3.length) {
        const className2 = document.createElement("div");
        className2.className = "editor-paged-picker-empty";
        className2.textContent = element7;
        push3.push(className2);
      }
      if (arg130 && page4.page === page4.pageCount) {
        push3.push(...(arg130(page4) || []));
      }
      addEventListener.replaceChildren(...value187, ...push3);
      addEventListener.scrollTop = 0;
      value374.value = String(page4.page);
      textContent11.textContent = "/ " + page4.pageCount;
      textContent10.textContent = "第 " + page4.page + " / " + page4.pageCount + " 页 · 共 " + page4.total + " 项";
      disabled7.disabled = page4.page <= 1;
      disabled8.disabled = page4.page >= page4.pageCount;
    } catch (value188) {
      if (value377 || value322 !== value376) {
        return;
      }
      const className4 = document.createElement("div");
      className4.className = "editor-paged-picker-empty error";
      className4.textContent = "加载失败，请稍后重试";
      addEventListener.replaceChildren(className4);
      textContent10.textContent = "加载失败";
      onError(value188);
    } finally {
      if (!value377 && value322 === value376) {
        addEventListener.removeAttribute("aria-busy");
      }
    }
  }
  type18.addEventListener("click", () => close.close());
  component.addEventListener("cancel", preventDefault => {
    preventDefault.preventDefault();
    close.close();
  });
  component.addEventListener("click", target2 => {
    if (target2.target === component) {
      close.close();
    }
  });
  component.addEventListener("close", fn2, {
    once: true
  });
  type19.addEventListener("input", () => {
    window.clearTimeout(value375);
    value375 = window.setTimeout(() => {
      page4.query = type19.value.trim();
      page4.page = 1;
      fn3();
    }, 160);
  });
  disabled7.addEventListener("click", () => {
    if (!(page4.page <= 1)) {
      page4.page -= 1;
      fn3();
    }
  });
  disabled8.addEventListener("click", () => {
    if (!(page4.page >= page4.pageCount)) {
      page4.page += 1;
      fn3();
    }
  });
  value374.addEventListener("change", () => {
    const value205 = Math.trunc(Number(value374.value));
    page4.page = clampNumber(Number.isFinite(value205) ? value205 : page4.page, 1, page4.pageCount);
    fn3();
  });
  addEventListener.addEventListener("pointerover", target3 => {
    const contains = target3.target.closest("[data-editor-picker-value]");
    if (!!contains && !contains.contains(target3.relatedTarget)) {
      arg133?.(contains.dataset.editorPickerValue, contains);
    }
  });
  addEventListener.addEventListener("pointerleave", Qe);
  addEventListener.addEventListener("scroll", Qe);
  addEventListener.addEventListener("click", target4 => {
    const dataset7 = target4.target.closest("[data-delete-user-asset]");
    if (dataset7 && arg132) {
      target4.preventDefault();
      target4.stopPropagation();
      const value125 = dataset7.dataset.deleteUserAsset;
      close.close();
      arg132(value125);
      return;
    }
    const dataset8 = target4.target.closest("[data-editor-picker-value]");
    if (!dataset8 || !addEventListener.contains(dataset8)) {
      return;
    }
    const value206 = dataset8.dataset.editorPickerValue;
    close.close();
    arg126(value206);
  });
  append2.addEventListener("click", target5 => {
    const dataset9 = target5.target.closest("[data-editor-picker-value]");
    if (!dataset9 || !append2.contains(dataset9)) {
      return;
    }
    const value207 = dataset9.dataset.editorPickerValue;
    close.close();
    arg126(value207);
  });
  iC2 = close;
  setAttribute?.setAttribute("aria-expanded", "true");
  close.rebuildToolbar();
  component.showModal();
  fn3();
  window.requestAnimationFrame(() => type19.focus({
    preventScroll: true
  }));
  return close;
}
function Gi(value, arg2, arg3) {
  const temp = document.createElement("button");
  temp.type = "button";
  temp.dataset[arg2] = arg3;
  value.replaceChildren(temp);
  temp.click();
  value.replaceChildren();
}
function Yw(triggerButton) {
  const component = Number2();
  const value = [{
    button: on,
    title: "选择导航图标",
    options: dr2,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: "不使用图标"
  }, {
    button: Qt,
    title: "选择效果按钮图标",
    options: Sa2,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: "不使用图标"
  }, {
    button: Lt,
    title: "选择按钮图标",
    options: Va2,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: component?.type === "device-button" ? "跟随实体图标" : "不使用图标"
  }, {
    button: tn,
    title: "选择标题图标",
    options: Ta2,
    datasetKey: "iconName",
    current: component?.properties?.icon || "",
    clear: "不使用图标"
  }, {
    button: nn,
    title: "选择统计图标",
    options: Ba2,
    datasetKey: "lightStatisticsIconName",
    current: String(Object.hasOwn(component?.properties || {}, "icon") ? component?.properties?.icon || "" : "mdi:lightbulb-group-outline"),
    clear: "不使用图标"
  }].find(button => button.button === triggerButton);
  if (!value) {
    return false;
  }
  const temp = qi({
    kind: "icon",
    title: value.title,
    searchPlaceholder: "搜索图标名称",
    triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.icon,
    selectedText: "",
    emptyText: "没有匹配的图标",
    itemClass: "icon-grid",
    async getPage({
      query: arg73,
      page: arg74,
      pageSize: arg75
    }) {
      const value155 = (arg74 - 1) * arg75;
      const items = await Z("/icons?query=" + encodeURIComponent(arg73) + "&limit=" + arg75 + "&offset=" + value155);
      return {
        items: items.items || [],
        total: Number(items.total) || 0
      };
    },
    renderLeadingItems: () => [],
    renderSelectedActions: () => [Object.assign(document.createElement("span"), {
      className: "editor-paged-picker-current-label",
      textContent: "当前选择"
    }), D0(value.current, value.clear), Wi(value.clear, !value.current)],
    renderItem(name13) {
      const dataset5 = yp(name13, value.current, "editorPickerValue");
      dataset5.dataset.editorPickerValue = name13.name;
      return dataset5;
    },
    onSelect: arg48 => Gi(value.options, value.datasetKey, arg48)
  });
  return true;
}
function Kw(triggerButton) {
  const value = Number2();
  const value378 = triggerButton === oi ? "image" : triggerButton === pi2 && ["icon-button", "device-button", "presence-sensor"].includes(value?.type) ? value.type : ["weather", "line-chart", "title-button", "light-statistics", "icon-button-effect", "vacuum-map", "camera", "air-conditioner", "navigation-button"].find(arg49 => Un(arg49).button === triggerButton);
  if (!value378) {
    return false;
  }
  const el2 = componentId;
  if (sl(triggerButton, () => Kw(triggerButton), () => componentId === el2)) {
    return true;
  }
  const flag = Un(value378);
  const value379 = value?.bindings?.entity?.entityId || "";
  const flag3 = qn(value378).find(entityId2 => entityId2.entityId === value379) || null;
  const value380 = kr()[0] || null;
  const temp = readEntityId(value378, "").findIndex(arg => arg.entityId === value379);
  qi({
    kind: "entity",
    title: "选择实体",
    subtitle: yE(value378) + " · " + rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(temp, value380),
    selectedText: value379 || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({
      query: arg,
      page: arg2
    }) {
      const temp2 = readEntityId(value378, arg);
      return editorEntityPickerPage(temp2, arg2, value380);
    },
    renderLeadingItems: renderItem => renderItem.page === 1 && value380 ? [_n(value380, value379)] : [],
    renderSelectedContent: () => [mp(flag3)],
    renderSelectedActions: () => [Wi("不使用实体", !value379)],
    renderItem: arg76 => _n(arg76, value379),
    onSelect: arg77 => Gi(flag.options, "entityId", arg77)
  });
  return true;
}
function Xw() {
  if (Number2()?.type !== "light-statistics") {
    return false;
  }
  const value = componentId;
  if (sl(rt, Xw, () => componentId === value && Number2()?.type === "light-statistics")) {
    return true;
  }
  const callback = arg => {
    const temp3 = String(arg || "").trim().toLocaleLowerCase("zh-CN");
    return qn("light-statistics").map((entity, index) => ({
      entity,
      index,
      support: lightStatisticsEntitySupport(entity)
    })).filter(({
      entity: arg2
    }) => !temp3 || (ct(arg2) + " " + fe(arg2)).toLocaleLowerCase("zh-CN").includes(temp3)).sort((arg2, arg22) => Number(arg22.support.supported) - Number(arg2.support.supported) || +(fe(arg22.entity) === "light") - +(fe(arg2.entity) === "light") || arg2.index - arg22.index).map(({
      entity: arg2
    }) => arg2);
  };
  const temp = callback("").findIndex(arg => arg.entityId === Rt3);
  const flag = kr()[0] || null;
  const temp2 = qi({
    kind: "entity",
    title: ko3 >= 0 ? "选择替换实体" : "添加统计实体",
    subtitle: rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton: rt,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(temp, flag),
    selectedText: Rt3 || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    closeLegacyPickers: false,
    getPage({
      query: arg,
      page: arg2
    }) {
      const temp3 = callback(arg);
      return editorEntityPickerPage(temp3, arg2, flag);
    },
    renderLeadingItems: renderLeadingItems => renderLeadingItems.page === 1 && flag ? [_n(flag, Rt3)] : [],
    renderItem: renderItem => _n(renderItem, Rt3),
    onSelect: onSelect => Gi(ka, "lightStatisticsEntityId", onSelect)
  });
  return true;
}
function tI2(triggerButton) {
  const value = triggerButton.closest("[data-action-trigger]");
  const flag = value?.querySelector("[data-popup-entity]");
  const component = value?.querySelector("[data-popup-entity-options]");
  if (!value || !flag || !component) {
    return false;
  }
  if (sl(triggerButton, () => tI2(triggerButton), () => value.isConnected)) {
    return true;
  }
  const chosen = flag.value || "";
  const temp = le.find(entityId3 => entityId3.entityId === chosen) || null;
  const temp2 = kr()[0] || null;
  const value381 = arg106 => {
    const value208 = String(arg106 || "").trim().toLocaleLowerCase("zh-CN");
    return le.filter(virtual => !virtual.virtual && (!value208 || (ct(virtual) + " " + virtual.entityId).toLocaleLowerCase("zh-CN").includes(value208)));
  };
  const value382 = value381("").findIndex(entityId4 => entityId4.entityId === chosen);
  qi({
    kind: "entity",
    title: "选择弹窗实体",
    subtitle: rl,
    searchPlaceholder: "搜索实体名称或 ID",
    triggerButton,
    pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
    initialPage: editorEntityPickerInitialPage(value382, temp2),
    selectedText: chosen || "不使用实体",
    emptyText: "没有匹配的实体",
    itemClass: "entity-list",
    getPage({
      query: arg97,
      page: arg98
    }) {
      const value189 = value381(arg97);
      return editorEntityPickerPage(value189, arg98, temp2);
    },
    renderItem: arg78 => _n(arg78, chosen),
    renderLeadingItems: page3 => page3.page === 1 && temp2 ? [_n(temp2, chosen)] : [],
    renderSelectedContent: () => [mp(temp)],
    renderSelectedActions: () => [Wi("不使用实体", !chosen)],
    onSelect: arg79 => Gi(component, "popupActionEntityId", arg79)
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
  const flag = le.find(arg => arg.entityId === value) || null;
  const flag2 = kr()[0] || null;
  const readEntityId = arg => {
    const temp2 = String(arg || "").trim().toLocaleLowerCase("zh-CN");
    return le.map((entity, index) => ({
      entity,
      index
    })).filter(({
      entity: arg2
    }) => !arg2.virtual && (!temp2 || (ct(arg2) + " " + arg2.entityId).toLocaleLowerCase("zh-CN").includes(temp2))).sort((arg2, arg22) => Number(popupModuleEntityRecommended(arg22.entity, he.elements.type.value)) - Number(popupModuleEntityRecommended(arg2.entity, he.elements.type.value)) || arg2.index - arg22.index).map(({
      entity: arg2
    }) => arg2);
  };
  const temp = readEntityId("").findIndex(arg => arg.entityId === value);
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
    getPage({
      query: arg,
      page: arg2
    }) {
      const temp2 = readEntityId(arg);
      return editorEntityPickerPage(temp2, arg2, flag2);
    },
    renderItem: renderItem => _n(renderItem, value),
    renderLeadingItems: renderLeadingItems => renderLeadingItems.page === 1 && flag2 ? [_n(flag2, value)] : [],
    renderSelectedContent: () => [mp(flag)],
    renderSelectedActions: () => [Wi("不使用实体", !value)],
    onSelect: onSelect => Gi(Ii, "popupModuleEntityId", onSelect)
  });
  return true;
}
function Qw(value) {
  const temp = value === Cn ? "image" : value === En ? "ibe" : "";
  if (!temp) {
    return false;
  }
  const callback = temp === "image";
  const properties51 = Number2();
  const value383 = callback ? properties51?.properties?.assetId || "" : properties51?.properties?.effectAssetId || "";
  const name19 = findCustomPopup2(value383);
  gn({
    refreshInspector: false
  }).then(() => {
    if (iC2?.triggerButton === value) {
      iC2.syncAssetToolbar?.();
      iC2.refresh();
    }
  }).catch(onError);
  const value384 = OE2(temp).findIndex(arg99 => Vc(arg99, value383));
  qi({
    kind: temp + "-asset",
    title: callback ? "选择控件图片" : "选择效果图片",
    subtitle: "我的图片与栖光素材 · 固定分页加载",
    searchPlaceholder: "搜索图片名称",
    triggerButton: value,
    pageSize: EDITOR_PICKER_PAGE_SIZES.asset,
    initialPage: value384 < 0 ? 1 : Math.floor(value384 / EDITOR_PICKER_PAGE_SIZES.asset) + 1,
    selectedText: name19?.name || value383 || "不使用图片",
    emptyText: "没有匹配的图片",
    itemClass: "asset-grid",
    getPage({
      query: arg40,
      page: arg41,
      pageSize: arg42
    }) {
      const slice = OE2(temp, arg40);
      const value97 = (arg41 - 1) * arg42;
      return {
        items: slice.slice(value97, value97 + arg42),
        total: slice.length
      };
    },
    renderSelectedContent: () => [bE(name19)],
    renderSelectedActions: () => [Wi("不使用图片", !value383)],
    renderItem(assetId) {
      const matches = bp(assetId, value383);
      const dataset = matches.matches?.("[data-asset-id]") ? matches : matches.querySelector("[data-asset-id]");
      if (dataset) {
        dataset.dataset.editorPickerValue = assetId.assetId;
      }
      return matches;
    },
    buildToolbar: arg17 => lw2(temp, arg17),
    onItemHover: (arg18, arg19) => Cp(findCustomPopup2(arg18), arg19, iC2?.dialog),
    onDelete: nC,
    onSelect: arg20 => Gi(callback ? zt3 : en, "assetId", arg20)
  })?.dialog.append(y12);
  return true;
}
function jp(value, arg2) {
  const chosen = arg2 === "user" ? "user" : "builtin";
  if (value === "image") {
    Vt3 = chosen;
    Sn.value = "";
    Yn("image");
    Ro2("image");
    if (iC2?.kind === "image-asset") {
      iC2.rebuildToolbar();
      iC2.refresh({
        resetPage: true
      });
    } else {
      Wr();
      Vr();
    }
  } else {
    Wt3 = chosen;
    Ln.value = "";
    Yn("ibe");
    Ro2("ibe");
    if (iC2?.kind === "ibe-asset") {
      iC2.rebuildToolbar();
      iC2.refresh({
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
  const chosen = arg2 === "image" ? ef : Sf;
  chosen.disabled = true;
  const list2 = [];
  try {
    for (const body of list) {
      if (!/\.(png|jpe?g|webp|svg)$/i.test(body.name)) {
        list2.push(body.name + "：仅支持 PNG、JPG、JPEG、WebP 和 SVG");
        continue;
      }
      try {
        await Z("/assets/user", {
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
function nC(arg137) {
  const temp = findCustomPopup2(arg137);
  if (!temp || temp.source !== "user") {
    return;
  }
  const value385 = some => Array.isArray(some) ? some.some(value385) : some && typeof some == "object" ? Object.values(some).some(value385) : some === temp.assetId;
  if (value385(h?.document)) {
    closeOtherPickerPanels();
    onError(new Error("这张图片正在被当前仪表盘或弹窗使用，请先替换或移除后再删除。"));
    return;
  }
  Au = temp.assetId;
  LN.textContent = "“" + temp.name + "”";
  closeOtherPickerPanels();
  Lo.showModal();
}
function eC(kind, folderName) {
  if (!fp(kind === "image" ? Vt3 : Wt3, folderName)) {
    return;
  }
  const value = uE2(folderName);
  const number = "studio3d:" + folderName + "/";
  const callback = component => Array.isArray(component) ? component.some(callback) : component && typeof component == "object" ? Object.values(component).some(callback) : typeof component == "string" && component.startsWith(number);
  if (callback(h?.document)) {
    onError(new Error("这个文件夹中的图片正在被当前仪表盘或弹窗使用，请先替换或移除后再删除。"));
    return;
  }
  Nc = {
    kind,
    folderName
  };
  AN.textContent = "“" + folderName + "”";
  PN.textContent = String(value.length);
  Bn.showModal();
}
function nI() {
  Yn("image");
  Yn("ibe");
  Wr(Sn.value);
  Hr(Ln.value);
  if (iC2?.kind === "image-asset" || iC2?.kind === "ibe-asset") {
    iC2.syncAssetToolbar?.();
    iC2.refresh({
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
Re.addEventListener("click", target39 => {
  const dataset24 = target39.target.closest("[data-image-asset-source]");
  if (dataset24) {
    jp("image", dataset24.dataset.imageAssetSource);
  }
});
He.addEventListener("click", target40 => {
  const dataset25 = target40.target.closest("[data-ibe-asset-source]");
  if (dataset25) {
    jp("ibe", dataset25.dataset.ibeAssetSource);
  }
});
ef.addEventListener("click", () => la.click());
Sf.addEventListener("click", () => Lo2.click());
la.addEventListener("change", async () => {
  await Zw(la.files, "image");
  la.value = "";
});
Lo2.addEventListener("change", async () => {
  await Zw(Lo2.files, "ibe");
  Lo2.value = "";
});
for (const t of [zt3, en]) {
  t.addEventListener("click", event => {
    const value = event.target.closest("[data-delete-user-asset]");
    if (value) {
      event.preventDefault();
      event.stopPropagation();
      nC(value.dataset.deleteUserAsset);
    }
  });
}
wu2.addEventListener("click", () => Lo.close());
EN.addEventListener("click", () => Lo.close());
Lo.addEventListener("click", target41 => {
  if (target41.target === Lo) {
    Lo.close();
  }
});
Bn2.addEventListener("click", async () => {
  const value323 = String(Au || "").replace(/^user:/, "");
  if (/^[0-9a-f]{32}$/.test(value323)) {
    Bn2.disabled = true;
    try {
      await Z("/assets/user/" + value323, {
        method: "DELETE"
      });
      Au = null;
      Lo.close();
      await gn();
    } catch (code) {
      if (code?.code === "ASSET_IN_USE") {
        onError(new Error("这张图片仍被户型图绘制或仪表盘使用，请先移除引用后再删除。"));
      } else {
        onError(code);
      }
    } finally {
      Bn2.disabled = false;
    }
  }
});
IN.addEventListener("click", () => Bn.close());
TN.addEventListener("click", () => Bn.close());
Bn.addEventListener("click", target42 => {
  if (target42.target === Bn) {
    Bn.close();
  }
});
Bn.addEventListener("close", () => {
  if (!Cc.disabled) {
    Nc = null;
  }
});
Cc.addEventListener("click", async () => {
  const folderName = Nc;
  if (folderName?.folderName) {
    Cc.disabled = true;
    try {
      await Z("/studio3d/exports", {
        method: "DELETE",
        headers: {
          "X-Export-Folder": encodeURIComponent(folderName.folderName)
        }
      });
      Nc = null;
      Bn.close();
      await gn({
        refreshInspector: false
      });
      nI();
    } catch (code2) {
      if (code2?.code === "STUDIO3D_EXPORT_IN_USE") {
        onError(new Error("这个文件夹中的图片仍被仪表盘、弹窗或户型图绘制使用，请先移除引用后再删除。"));
      } else {
        onError(code2);
      }
    } finally {
      Cc.disabled = false;
    }
  }
});
Cn.addEventListener("click", async () => {
  const ancestorEl = Re.hidden;
  closeOtherPickerPanels(ancestorEl ? "asset" : null);
  Re.hidden = !ancestorEl;
  Cn.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    try {
      await gn({
        refreshInspector: false
      });
      Yn("image");
    } catch (value126) {
      onError(value126);
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
zt2.addEventListener("change", () => {
  Vt2 = zt2.value;
  Sn.value = "";
  Ro2("image");
  Wr();
});
Sn.addEventListener("input", () => Wr(Sn.value));
zt3.addEventListener("pointerover", value => {
  const ancestorEl = value.target.closest("[data-asset-id]");
  if (!ancestorEl || ancestorEl.contains(value.relatedTarget)) {
    return;
  }
  const temp = findCustomPopup2(ancestorEl.dataset.assetId);
  Cp(temp, ancestorEl);
});
zt3.addEventListener("pointerleave", Qe);
zt3.addEventListener("scroll", Qe);
zt3.addEventListener("click", async target43 => {
  const dataset26 = target43.target.closest("[data-asset-id]");
  if (!dataset26 || !componentId) {
    return;
  }
  const value324 = componentId;
  const value325 = dataset26.dataset.assetId;
  Qe();
  closeOtherPickerPanels();
  if (!value325) {
    L(arg43 => {
      const properties28 = findComponent(arg43, value324)?.component;
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
  const value326 = findCustomPopup2(value325);
  if (value326) {
    try {
      const value127 = await gp(value326);
      L(arg14 => {
        const type4 = findComponent(arg14, value324)?.component;
        if (!!type4 && type4.type === "image") {
          V0(type4, value325, value127);
        }
      });
    } catch (value128) {
      onError(value128);
    }
  }
});
En.addEventListener("click", async () => {
  const ancestorEl = He.hidden;
  closeOtherPickerPanels(ancestorEl ? "ibe-asset" : null);
  He.hidden = !ancestorEl;
  En.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    try {
      await gn({
        refreshInspector: false
      });
      Yn("ibe");
    } catch (value129) {
      onError(value129);
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
en2.addEventListener("change", () => {
  Wt2 = en2.value;
  Ln.value = "";
  Ro2("ibe");
  Hr();
});
Ln.addEventListener("input", () => Hr(Ln.value));
en.addEventListener("pointerover", value => {
  const ancestorEl = value.target.closest("[data-asset-id]");
  if (!!ancestorEl && !ancestorEl.contains(value.relatedTarget)) {
    Cp(findCustomPopup2(ancestorEl.dataset.assetId), ancestorEl, He);
  }
});
en.addEventListener("pointerleave", Qe);
en.addEventListener("scroll", Qe);
en.addEventListener("click", async target44 => {
  const dataset27 = target44.target.closest("[data-asset-id]");
  const list = componentId;
  if (!dataset27 || !list) {
    return;
  }
  const effectAssetId = dataset27.dataset.assetId;
  Qe();
  closeOtherPickerPanels();
  const value327 = effectAssetId ? findCustomPopup2(effectAssetId) : null;
  let width11 = null;
  if (value327) {
    try {
      width11 = await gp(value327);
    } catch (value130) {
      onError(value130);
      return;
    }
  }
  L(arg80 => {
    const properties46 = findComponent(arg80, list)?.component;
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
Km.addEventListener("click", () => zE("undo"));
Jm.addEventListener("click", () => zE("redo"));
E1.addEventListener("click", () => {
  if (!bt2 || !h) {
    ni.close();
    return;
  }
  const selectedComponentId = bt2;
  bt2 = null;
  h = {
    ...h,
    document: cloneValue(selectedComponentId.document)
  };
  componentId = findComponent(h.document, selectedComponentId.selectedComponentId) ? selectedComponentId.selectedComponentId : null;
  const length11 = Array.isArray(selectedComponentId.selectedComponentIds) ? selectedComponentId.selectedComponentIds.filter(arg44 => findComponent(h.document, arg44)) : [];
  selectedComponentIds = new Set(length11.length ? length11 : componentId ? [componentId] : []);
  ku2 = componentId;
  pe.undo = Array.isArray(selectedComponentId.undo) ? cloneValue(selectedComponentId.undo) : [];
  pe.redo = Array.isArray(selectedComponentId.redo) ? cloneValue(selectedComponentId.redo) : [];
  ni.close();
  qr(selectedComponentId.selectedPath || null);
  hn();
  Xn();
});
N1.addEventListener("click", () => {
  Gc(h?.projectId);
  bt2 = null;
  ni.close();
  hn();
  Xn();
});
ni.addEventListener("cancel", value => value.preventDefault());
C1.addEventListener("click", () => uo.close());
S1.addEventListener("click", () => uo.close());
uo.addEventListener("click", target45 => {
  if (target45.target === uo) {
    uo.close();
  }
});
Bm.addEventListener("click", () => $c("shared"));
Xo2.addEventListener("click", () => $c("page"));
vs.addEventListener("click", () => {
  if (!vs.disabled) {
    WN();
    Jo.showModal();
  }
});
TS.addEventListener("click", () => Jo.close());
Jo.addEventListener("click", target46 => {
  if (target46.target === Jo) {
    Jo.close();
  }
});
wl.addEventListener("click", target47 => {
  const value = target47.target.closest("[data-template-id]");
  const value328 = R.value;
  if (!value || value.disabled || !value328) {
    return;
  }
  const value329 = vc;
  const component2 = se2 ? findComponent(h?.document, se2) : null;
  const id3 = component2?.component?.type === "group" ? component2.component : null;
  const value330 = id3 ? component2.scope : value329;
  const id4 = newId("component");
  Jo.close();
  componentId = id4;
  selectedComponentIds = new Set([id4]);
  ku2 = id4;
  const then = L(pages => {
    const components3 = pages.pages.find(path3 => path3.path === value328);
    if (!components3) {
      throw new Error("当前页面不存在。");
    }
    const component = id3 ? findComponent(pages, id3.id) : null;
    const position12 = component?.component?.type === "group" ? component.component : null;
    const value131 = value329 === "shared" ? pages.sharedComponents : components3.components;
    const unshift = position12 ? position12.children ||= [] : value131;
    const value132 = value.dataset.templateId === "navigation-button" ? "导航按钮" : value.dataset.templateId === "interaction3d" ? "3D 交互" : value.dataset.templateId === "floorplan-auto-diagram" ? "户型图自动导图" : value.dataset.templateId === "icon-button-effect" ? "图标按钮（效果）" : value.dataset.templateId === "title-button" ? "标题按钮" : value.dataset.templateId === "light-statistics" ? "数量统计" : value.dataset.templateId === "icon-button" ? "图标按钮" : value.dataset.templateId === "device-button" ? "设备按钮" : value.dataset.templateId === "presence-sensor" ? "传感器" : value.dataset.templateId === "air-conditioner" ? "空调 / 浴霸" : value.dataset.templateId === "vacuum-map" ? "扫地机器人实时地图" : value.dataset.templateId === "camera" ? "摄像头实时预览" : value.dataset.templateId === "time" ? "时间" : value.dataset.templateId === "date" ? "日期" : value.dataset.templateId === "weather" ? "天气" : value.dataset.templateId === "line-chart" ? "折线图" : value.dataset.templateId === "panel-frame" ? "底图框" : "图片";
    const instanceName = nextTemplateInstanceName(unshift, value132);
    const position13 = createComponentFromTemplate(value.dataset.templateId, {
      id: id4,
      instanceName,
      canvas: pages.canvas,
      uiPackId: jt2(pages)
    });
    if (position12) {
      const value58 = Number(position12.position?.width || 100);
      const value59 = Number(position12.position?.height || 100);
      const value60 = Number(position13.position?.width || 100);
      const value61 = Number(position13.position?.height || 100);
      position13.position = {
        ...(position13.position || {}),
        x: (value58 - value60) / 2,
        y: (value59 - value61) / 2
      };
    }
    unshift.unshift(position13);
    applyCollectionLayerOrder(unshift);
    if (value330 === "shared" && !position12) {
      for (const sharedComponentIds of pages.pages) {
        sharedComponentIds.sharedComponentIds = [position13.id, ...(sharedComponentIds.sharedComponentIds || []).filter(arg => arg !== position13.id)];
      }
      syncSharedComponentReferenceOrder(pages);
    }
  }, value328);
  if (value.dataset.templateId === "floorplan-auto-diagram") {
    then.then(() => mw(id4, {
      cancelRemovesComponent: true
    }));
  }
});
Hm2.addEventListener("click", () => Mt2("edit"));
Um.addEventListener("click", () => Mt2("dashboard"));
Be.addEventListener("click", async () => {
  if (!h) {
    return;
  }
  const soundEnabled = cloneValue(h.document);
  soundEnabled.soundEnabled = h.document.soundEnabled === false;
  try {
    await vt(soundEnabled);
    await Np();
  } catch (value190) {
    onError(value190);
  }
});
_m.addEventListener("click", EN2);
bl.addEventListener("click", () => Mt2("edit"));
yl2.addEventListener("click", () => Mt2("popup"));
Le3.addEventListener("change", () => {
  Wn();
  if (Dn && h && Le3.value !== h.projectId) {
    Le3.value = h.projectId;
    oe(Le3);
    _r();
    return;
  }
  if (Le3.value) {
    xp(Le3.value).catch(onError);
  }
});
R.addEventListener("change", () => {
  pn();
  i0();
  se2 = null;
  if (Te === "popup") {
    Mt2("edit");
  }
  Sv2?.navigate(R.value);
  xv2?.navigate(R.value);
  const scope = findComponent(h?.document, componentId);
  if (scope?.scope === "page" && scope.page?.path !== R.value) {
    Oc(null);
  }
  _e();
  ee();
});
function nC2(arg138) {
  Iu = arg138;
  const name20 = findCustomPopup(h?.document, vr2);
  rN2.textContent = arg138 === "rename" ? "重命名组合弹窗" : "新建组合弹窗";
  yc.elements.name.value = arg138 === "rename" ? name20?.name || "" : "新建组合弹窗";
  gc2.showModal();
  yc.elements.name.select();
}
Om.addEventListener("click", () => nC2("create"));
hN.addEventListener("click", () => gc2.close());
bN.addEventListener("click", () => gc2.close());
yc.addEventListener("submit", event => {
  event.preventDefault();
  const value = yc.elements.name.value.trim();
  if (!value) {
    return;
  }
  const rect = Iu === "create" ? newId("custom-popup") : vr2;
  gc2.close();
  L(customPopups3 => {
    customPopups3.customPopups = customPopups3.customPopups || [];
    if (Iu === "rename") {
      const name6 = customPopups3.customPopups.find(component => component.id === vr2);
      if (name6) {
        name6.name = value;
      }
      return;
    }
    customPopups3.customPopups.push({
      id: rect,
      name: value,
      templateRef: {
        uiPackId: jt2(customPopups3),
        templateId: "custom-popup",
        version: 1
      },
      layout: {
        columns: 3
      },
      modules: []
    });
    vr2 = rect;
    Mt2("popup");
  });
});
ao2.addEventListener("change", () => {
  kc();
  vr2 = ao2.value || null;
  Mt2("popup");
});
Yo2.addEventListener("click", value => {
  const popupAction = value.target.closest("[data-popup-id]");
  if (popupAction) {
    kc();
    vr2 = popupAction.dataset.popupId;
    ao2.value = vr2;
    vp(h.document, vr2);
    Mt2("popup");
  }
});
Yo2.addEventListener("contextmenu", target48 => {
  const dataset28 = target48.target.closest("[data-popup-id]");
  if (!dataset28) {
    return;
  }
  target48.preventDefault();
  vr2 = dataset28.dataset.popupId;
  ao2.value = vr2;
  vp(h.document, vr2);
  Mt2("popup");
  Tu = vr2;
  $t.hidden = false;
  $t.style.left = "0px";
  $t.style.top = "0px";
  const width12 = $t.getBoundingClientRect();
  $t.style.left = clampNumber(target48.clientX, 8, window.innerWidth - width12.width - 8) + "px";
  $t.style.top = clampNumber(target48.clientY, 8, window.innerHeight - width12.height - 8) + "px";
});
ao.addEventListener("click", () => {
  if (ao.disabled) {
    return;
  }
  const value331 = $t.hidden;
  Wn();
  pn();
  $t.hidden = !value331;
  ao.setAttribute("aria-expanded", String(value331));
});
$t.addEventListener("click", target49 => {
  const value332 = target49.target.closest("[data-popup-action]")?.dataset.popupAction;
  const value333 = Tu || vr2;
  kc();
  if (!!value332 && !!value333) {
    if (value332 === "rename") {
      nC2("rename");
      return;
    }
    if (value332 === "duplicate") {
      const element = newId("custom-popup");
      vr2 = element;
      L(customPopups => {
        const name5 = (customPopups.customPopups || []).find(component => component.id === value333);
        if (!name5) {
          return;
        }
        const modules = cloneValue(name5);
        modules.id = element;
        modules.name = name5.name + "_副本";
        modules.modules = (modules.modules || []).map(arg3 => ({
          ...arg3,
          id: newId("popup-module")
        }));
        customPopups.customPopups.push(modules);
      });
      return;
    }
    if (value332 === "delete") {
      const name12 = (h?.document?.customPopups || []).find(component => component.id === value333);
      if (!name12) {
        return;
      }
      Cc2 = value333;
      fN2.textContent = name12.name;
      wc.showModal();
    }
  }
});
function aC() {
  Cc2 = null;
  wc.close();
}
vu2.addEventListener("click", aC);
SN.addEventListener("click", aC);
wc.addEventListener("close", () => {
  Cc2 = null;
});
Su.addEventListener("click", () => {
  const hidden = Cc2;
  if (hidden) {
    Cc2 = null;
    wc.close();
    Su.disabled = true;
    L(customPopups2 => {
      customPopups2.customPopups = (customPopups2.customPopups || []).filter(component => component.id !== hidden);
      const value62 = arg8 => {
        for (const actions of arg8 || []) {
          for (const [value, data] of Object.entries(actions.actions || {})) {
            if (data.type === "more-info" && data.data?.popupSource === "custom" && data.data?.popupId === hidden) {
              actions.actions[value] = {
                type: "none",
                data: {}
              };
            }
          }
          value62(actions.children);
        }
      };
      value62(customPopups2.sharedComponents);
      for (const components of customPopups2.pages || []) {
        value62(components.components);
      }
      vr2 = customPopups2.customPopups[0]?.id || null;
      if (!vr2) {
        Mt2("edit");
      }
    }).finally(() => {
      Su.disabled = false;
    });
  }
});
vN.addEventListener("click", () => {
  zi();
  Li.close();
});
wN.addEventListener("click", () => {
  zi();
  Li.close();
});
rn.addEventListener("click", () => {
  const ancestorEl = wu.hidden;
  wu.hidden = !ancestorEl;
  rn.setAttribute("aria-expanded", String(ancestorEl));
  if (ancestorEl) {
    Z0();
    window.requestAnimationFrame(() => hc.focus({
      preventScroll: true
    }));
  }
});
hc.addEventListener("input", () => Z0());
Ii.addEventListener("click", event => {
  const value = event.target.closest("[data-popup-module-entity-id]");
  if (value) {
    he.elements.entityId.value = value.dataset.popupModuleEntityId;
    Y0();
    zi();
  }
});
yu2.addEventListener("click", value => {
  const ancestorEl = value.target.closest("[data-popup-module-device-type]");
  if (!!ancestorEl && he.elements.type.value === "climate") {
    wp(ancestorEl.dataset.popupModuleDeviceType);
  }
});
he.elements.type.addEventListener("change", () => {
  wp();
  Ii.replaceChildren();
});
he.addEventListener("submit", event => {
  event.preventDefault();
  const numeric = vr2;
  const allowed = he.elements.type.value;
  const value = he.elements.entityId.value;
  const title = he.elements.title.value.trim();
  const deviceType2 = normalizedPopupClimateDeviceType(he.elements.deviceType.value);
  if (!numeric || !value) {
    return;
  }
  const modules3 = findCustomPopup(h?.document, vr2);
  const value334 = {
    id: Cr || "candidate",
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
  const value335 = Cr ? (modules3?.modules || []).map(id3 => id3.id === Cr ? {
    ...id3,
    ...value334
  } : id3) : [...(modules3?.modules || []), value334];
  if (!modules3 || !packPopupModules(value335, modules3.layout).fits) {
    onError(new Error("当前布局已超过 3 行，可增加列数或删除其它模块。"));
    return;
  }
  zi();
  Li.close();
  L(customPopups4 => {
    const modules2 = (customPopups4.customPopups || []).find(component2 => component2.id === numeric);
    if (!modules2) {
      return;
    }
    const properties47 = modules2.modules.find(component2 => component2.id === Cr);
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
          deviceType: value28,
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
  if (!Pe.contains(event.target)) {
    _u();
  }
  if (!value && Bo2 && !Bo2.button.contains(event.target) && !Bo2.menu.contains(event.target)) {
    Ht2();
  }
  if (!event.target.closest(".dashboard-select-row")) {
    Wn();
  }
  if (!event.target.closest(".page-control .page-select-row")) {
    pn();
  }
  if (!event.target.closest("#popup-list") && !event.target.closest("#popup-actions-menu")) {
    kc();
  }
  if (!event.target.closest("#popup-module-entity-picker")) {
    zi();
  }
  if (!event.target.closest(".component-popup-entity-picker")) {
    Wc();
  }
  if (!event.target.closest("#image-entity-picker")) {
    closePickerPanel(aa2, oi);
  }
  if (!event.target.closest("#weather-entity-picker")) {
    closePickerPanel(Zd2, Jd);
  }
  if (!event.target.closest("#line-chart-entity-picker")) {
    closePickerPanel(eu2, Qd);
  }
  if (!event.target.closest("#ibe-entity-picker")) {
    closePickerPanel(Ts, Gl2);
  }
  if (!event.target.closest("#icon-button-entity-picker")) {
    closePickerPanel(mi, pi2);
  }
  if (!event.target.closest("#vacuum-map-entity-picker")) {
    closePickerPanel(nc, Gd);
  }
  if (!event.target.closest("#camera-entity-picker")) {
    closePickerPanel(ac, Yd);
  }
  if (!event.target.closest("#air-conditioner-entity-picker")) {
    closePickerPanel(Js, Dd2);
  }
  if (!event.target.closest("#title-button-entity-picker")) {
    closePickerPanel(Ms, ad);
  }
  if (!Ie2.hidden && !event.target.closest("#light-statistics-entity-picker") && !Ie2.contains(event.target)) {
    closePickerPanel(Ie2, rt);
    Pr();
  }
  if (!event.target.closest("#light-statistics-action-entity-picker")) {
    closePickerPanel(Vs, dd);
  }
  if (!event.target.closest("#navigation-entity-picker")) {
    closePickerPanel(iu2, ou);
  }
  const options = Vn.get(zt2)?.menu;
  if (!value && !event.target.closest("#image-asset-picker") && !options?.contains(event.target)) {
    closePickerPanel(Re, Cn);
  }
  const ancestorEl = Vn.get(en2)?.menu;
  if (!value && !event.target.closest("#ibe-asset-picker") && !ancestorEl?.contains(event.target)) {
    closePickerPanel(He, En);
  }
  if (!event.target.closest("#ibe-icon-picker") && !Sa.contains(event.target)) {
    closePickerPanel(Sa, Qt);
  }
  if (!event.target.closest("#icon-button-icon-picker") && !Va.contains(event.target)) {
    closePickerPanel(Va, Lt);
  }
  if (!event.target.closest("#title-button-icon-picker") && !Ta.contains(event.target)) {
    closePickerPanel(Ta, tn);
  }
  if (!event.target.closest("#light-statistics-icon-picker") && !Ba.contains(event.target)) {
    closePickerPanel(Ba, nn);
  }
  if (!event.target.closest("#navigation-icon-picker") && !dr.contains(event.target)) {
    closePickerPanel(dr, on);
  }
});
const rC = new Set([Rl, V1, Aa2, $a2, Wa2, ja, qa, Ua, yo, vo, wo, Co, So, eN2]);
document.addEventListener("input", target50 => {
  if (selectedComponentIds.size < 2 || !rC.has(target50.target)) {
    return;
  }
  target50.stopPropagation();
  const value336 = Number(target50.target.value);
  if (!Number.isFinite(value336)) {
    return;
  }
  const length12 = l0(clampNumber(value336, 1, 500) / 100);
  if (length12.length) {
    Sv2?.previewComponentsTransform(length12, componentId);
  }
}, true);
document.addEventListener("change", target51 => {
  if (selectedComponentIds.size < 2 || !rC.has(target51.target)) {
    return;
  }
  target51.stopPropagation();
  const value337 = Number(target51.target.value);
  if (!Number.isFinite(value337)) {
    ee();
    return;
  }
  const has4 = new Set(selectedComponentIds);
  const length13 = l0(clampNumber(value337, 1, 500) / 100);
  if (length13.length) {
    L(arg45 => {
      for (const componentId2 of length13) {
        if (!has4.has(componentId2.componentId)) {
          continue;
        }
        const position3 = findComponent(arg45, componentId2.componentId)?.component;
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
document.addEventListener("keydown", key2 => {
  const value338 = key2.target.closest("input, textarea, select, button, [contenteditable=\"true\"], dialog");
  if (Te === "edit" && selectedComponentIds.size && !value338) {
    if ((key2.metaKey || key2.ctrlKey) && !key2.altKey && !key2.shiftKey && key2.key.toLowerCase() === "d") {
      key2.preventDefault();
      f0([...selectedComponentIds], componentId);
      return;
    }
    if (!key2.metaKey && !key2.ctrlKey && !key2.altKey && (key2.key === "Delete" || key2.key === "Backspace")) {
      key2.preventDefault();
      h0([...selectedComponentIds]);
      return;
    }
  }
  const value339 = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1]
  };
  if (value339[key2.key] && Te === "edit" && selectedComponentIds.size && !key2.metaKey && !key2.ctrlKey && !key2.altKey && !value338) {
    key2.preventDefault();
    const value191 = key2.shiftKey ? 10 : 1;
    const [value192, value193] = value339[key2.key];
    kN(value192 * value191, value193 * value191);
    return;
  }
  if (key2.key !== "Enter" || key2.isComposing) {
    return;
  }
  const blur = key2.target.closest("input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"button\"]):not([type=\"submit\"])");
  if (blur) {
    key2.preventDefault();
    blur.blur();
  }
});
Zm.addEventListener("scroll", () => {
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
  for (const closest of document.querySelectorAll("[data-popup-entity-menu]:not([hidden])")) {
    Hc(closest.closest("[data-action-trigger]"));
  }
});
window.addEventListener("resize", () => {
  bm();
  ym();
  _u();
  Ht2();
  closeOtherPickerPanels();
  Wc();
  Vu();
});
Nm.addEventListener("click", async () => {
  await Cr2.catch(() => {});
  await Np();
});
e1.addEventListener("click", ON);
t1.addEventListener("click", () => Tl2.close());
Es.addEventListener("input", () => {
  Es.value = Es.value.replace(/\D/g, "").slice(0, 6);
});
jm.addEventListener("submit", BN);
vm.addEventListener("click", async () => {
  if (!_r()) {
    await Z("/auth/logout", {
      method: "POST"
    });
    window.location.assign("/login");
  }
});
Kv2();
ju(document);
Gu(document);
const Fo = clientX => {
  const left2 = ri.getBoundingClientRect();
  Nr = clampNumber((clientX.clientX - left2.left) / Math.max(1, left2.width), 0, 1);
  Er = 1 - clampNumber((clientX.clientY - left2.top) / Math.max(1, left2.height), 0, 1);
  Jv();
};
ri.addEventListener("pointerdown", pointerId4 => {
  if (me) {
    pointerId4.preventDefault();
    Tr = pointerId4.pointerId;
    ri.setPointerCapture(pointerId4.pointerId);
    Fo(pointerId4);
  }
});
ri.addEventListener("pointermove", value => {
  if (value.pointerId === Tr) {
    Fo(value);
  }
});
ri.addEventListener("pointerup", pointerId5 => {
  if (pointerId5.pointerId === Tr) {
    Tr = null;
    ri.releasePointerCapture(pointerId5.pointerId);
  }
});
zl.addEventListener("input", () => {
  if (me) {
    $o2 = clampNumber(Number(zl.value), 0, 360);
    Jv();
  }
});
Dl.addEventListener("input", () => {
  const me2 = normalizedHexColor(Dl.value);
  if (me2) {
    Fo2(me2, true);
  }
});
Dl.addEventListener("change", () => {
  const value = normalizedHexColor(Dl.value);
  if (value) {
    Fo2(value, true);
  } else if (me) {
    Dl.value = String(me.value || "").toUpperCase();
  }
});
const aC2 = () => {
  if (!me) {
    return;
  }
  const value340 = clampNumber(Number(zl2.value), 0, 255);
  const value341 = clampNumber(Number(Vl3.value), 0, 255);
  const value342 = clampNumber(Number(Wl.value), 0, 255);
  if ([value340, value341, value342].every(Number.isFinite)) {
    Fo2(rgbToHex(value340, value341, value342), true);
  }
};
for (const t of [zl2, Vl3, Wl]) {
  t.addEventListener("input", aC2);
  t.addEventListener("change", aC2);
}
Vl.addEventListener("click", async () => {
  if (me) {
    try {
      await zo2(String(me.value || "").toUpperCase());
      window.clearTimeout(zu);
      Vl.classList.add("copied");
      zu = window.setTimeout(() => Vl.classList.remove("copied"), 1200);
    } catch (value133) {
      onError(value133);
    }
  }
});
Vl2.addEventListener("click", async () => {
  if (me) {
    try {
      const value134 = await navigator.clipboard.readText();
      const toUpperCase = normalizedHexColor(value134);
      if (!toUpperCase) {
        throw new Error("剪贴板中没有可用的十六进制颜色值。");
      }
      Dl.value = toUpperCase.toUpperCase();
      Fo2(toUpperCase, true);
      Vl2.classList.add("copied");
      window.setTimeout(() => Vl2.classList.remove("copied"), 1200);
    } catch (value135) {
      onError(value135);
    }
  }
});
document.addEventListener("click", target52 => {
  const matches2 = target52.target.closest("button");
  if (!matches2) {
    return;
  }
  let value343 = false;
  if ([on, Qt, Lt, tn, nn].includes(matches2)) {
    value343 = Yw(matches2);
  } else if (matches2 === rt) {
    value343 = Xw();
  } else if (matches2.matches("[data-popup-entity-button]")) {
    value343 = tI2(matches2);
  } else if (matches2 === rn) {
    value343 = Jw();
  } else if ([Cn, En].includes(matches2)) {
    value343 = Qw(matches2);
  } else {
    value343 = Kw(matches2);
  }
  if (value343) {
    target52.preventDefault();
    target52.stopImmediatePropagation();
  }
}, true);
document.addEventListener("pointerdown", target53 => {
  if (!pt2.hidden && !pt2.contains(target53.target) && target53.target !== me) {
    Qv();
  }
});
new MutationObserver(arg107 => {
  for (const addedNodes of arg107) {
    for (const value98 of addedNodes.addedNodes) {
      if (value98 instanceof HTMLElement) {
        Kv2(value98);
        ju(value98);
        Gu(value98);
      }
    }
  }
}).observe(document.body, {
  childList: true,
  subtree: true
});
deferHiddenEditorDialogs();
Mt2("edit");
window.setInterval(() => {
  if (document.visibilityState === "visible") {
    jE2().catch(() => {});
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
    jE2().catch(() => {});
    U0().catch(() => {});
    Kc().catch(() => {});
  }
});
Promise.all([DE(), Kc(), Ir(), jE2({
  preserveForm: false
}), ow(), gn(), jc()]).then(() => _e()).catch(onError);
