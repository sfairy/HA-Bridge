// Differential test: HEAD vs working tree, for functions touched by rename batches.
// Renaming a bound identifier must not change behaviour, and the tool's scope
// attribution is what guarantees it. These cases exercise the risky shapes:
// unparenthesised arrow params, nested closures, and shadowed names.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const CUR = 'frontend/static/3d-studio/studio-app.js';
const head = execFileSync('git', ['show', `HEAD:${CUR}`], { encoding: 'utf8' });
const cur = readFileSync(CUR, 'utf8');

function extract(src, name) {
  const i = src.indexOf(`function ${name}(`);
  if (i < 0) throw new Error(`missing function ${name}`);
  const open = src.indexOf('{', src.indexOf(')', i));
  let depth = 0;
  for (let j = open; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}') {
      depth--;
      if (depth === 0) return src.slice(i, j + 1);
    }
  }
  throw new Error(`unbalanced body for ${name}`);
}

function build(src, name, deps, mutate = (b) => b) {
  const keys = Object.keys(deps);
  const body = mutate(extract(src, name));
  const factory = new Function(...keys, `${body}\nreturn ${name};`);
  return factory(...keys.map((k) => deps[k]));
}

const canon = (v) => JSON.stringify(v, (_k, x) => (typeof x === 'number' ? +x.toFixed(9) : x));

// `X is not iterable` / `X is not a function` embed the identifier, so a rename
// is *expected* to change those words when a case feeds bad arguments; they carry
// no behavioural information, so normalise that identifier away.
// NOT normalised: `X is not defined`. A dangling reference is exactly the failure
// mode a rename can introduce, so it must stay visible and must NOT be conflated
// with an argument-shape artifact.
const normalizeError = (e) => {
  const msg = String(e.message)
    .replace(/^[A-Za-z_$][\w$]* is not iterable$/, 'value is not iterable')
    .replace(/^[A-Za-z_$][\w$]* is not a function$/, 'value is not a function');
  return `${e.name || 'Error'}: ${msg}`;
};

// ---------------------------------------------------------------- addCeilingMeshes
function testAddCeilingMeshes() {
  const A = build(head, 'addCeilingMeshes', {});
  const B = build(cur, 'addCeilingMeshes', {});
  const polys = [
    [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }],
    [{ x: 0, y: 0 }, { x: 0, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 0 }],
    [{ x: -3, y: 2 }, { x: 4, y: -1 }, { x: 9, y: 7 }],
    [{ x: 1, y: 1 }, { x: 1.0001, y: 1 }, { x: 1, y: 1.0001 }],
  ];
  const offsets = [-1, 0, 0.5, 2.75, 12];
  let n = 0, diff = 0;
  for (const p of polys) {
    for (const o of offsets) {
      n++;
      const a = canon(A(p.map((q) => ({ ...q })), o));
      const b = canon(B(p.map((q) => ({ ...q })), o));
      if (a !== b) { diff++; console.log('  DIFF addCeilingMeshes', canon(p), o, a, b); }
    }
  }
  const M = build(cur, 'addCeilingMeshes', {}, (b) => b.replace('Math.hypot', 'Math.max'));
  const m = canon(M(polys[2], 2.75));
  const g = canon(B(polys[2], 2.75));
  console.log(`  mutation sensitivity: ${m !== g ? 'ok' : 'BROKEN'}`);
  return { name: 'addCeilingMeshes', n, diff, mutation: m !== g };
}

// ------------------------------------------------- instanceMergeIdenticalItems
function testInstanceMerge() {
  const deps = () => ({
    THREE: { MathUtils: { degToRad: (d) => (d * Math.PI) / 180 } },
    finite: (v, d) => (Number.isFinite(v) ? v : d),
    clamp: (v, lo, hi) => Math.min(hi, Math.max(lo, v)),
    stairItemTypes: new Set(['stair', 'doublestair']),
    set: new Set(['striplight', 'spotlight', 'downlight']),
  });
  const A = build(head, 'instanceMergeIdenticalItems', deps());
  const B = build(cur, 'instanceMergeIdenticalItems', deps());
  const mkObj = () => ({
    rotation: { x: 0, y: 0, z: 0, order: 'XYZ' },
    scale: { x: 1, y: 1, z: 1 },
  });
  const types = ['stair', 'doublestair', 'shoecabinet', 'camera', 'presence',
    'striplight', 'spotlight', 'light', 'sofa'];
  const grid = [];
  for (const type of types) {
    for (const rotation of [0, 45, -90, 361]) {
      for (const verticalRotation of [0, -30, 30, 200, -200, undefined]) {
        for (const stairDirection of ['left', 'right', undefined]) {
          for (const shoeCabinetMirrored of [true, false, undefined]) {
            grid.push({ type, rotation, verticalRotation, stairDirection, shoeCabinetMirrored });
          }
        }
      }
    }
  }
  let n = 0, diff = 0;
  for (const item of grid) {
    n++;
    const a = mkObj(); const b = mkObj();
    A(a, { ...item }); B(b, { ...item });
    if (canon(a) !== canon(b)) { diff++; console.log('  DIFF instanceMergeIdenticalItems', canon(item), canon(a), canon(b)); }
  }
  const M = build(cur, 'instanceMergeIdenticalItems', deps(),
    (b) => b.replace('-180, 180', '-179, 179'));
  const probe = { type: 'camera', verticalRotation: 200, rotation: 45 };
  const mo = mkObj(); M(mo, probe); const go = mkObj(); B(go, probe);
  const mutation = canon(mo) !== canon(go);
  console.log(`  mutation sensitivity: ${mutation ? 'ok' : 'BROKEN'}`);
  return { name: 'instanceMergeIdenticalItems', n, diff, mutation };
}

// --------------------------------------------- computeMultiFloorBoundsCenter
class Vec3 { constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; } }
class Box3 {
  constructor() { this.min = { x: Infinity, y: Infinity, z: Infinity }; this.max = { x: -Infinity, y: -Infinity, z: -Infinity }; }
  expandByPoint(p) {
    this.min.x = Math.min(this.min.x, p.x); this.max.x = Math.max(this.max.x, p.x);
    this.min.y = Math.min(this.min.y, p.y); this.max.y = Math.max(this.max.y, p.y);
    this.min.z = Math.min(this.min.z, p.z); this.max.z = Math.max(this.max.z, p.z);
  }
  isEmpty() { return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z; }
  getCenter(t) { t.x = (this.min.x + this.max.x) / 2; t.y = (this.min.y + this.max.y) / 2; t.z = (this.min.z + this.max.z) / 2; return t; }
}
function testBoundsCenter() {
  const world = (st) => ({
    THREE: { Box3, Vector3: Vec3 },
    projectDocCurrent: st.doc,
    planPointToWorldXZ: (scene, p) => ({ x: p.x + (scene.offset || 0), z: p.y }),
    finite: (v, d) => (Number.isFinite(v) ? v : d),
    getPreviewFloorModeCurrent: () => st.mode,
    activeFloorId: st.activeFloorId,
    rotatePlanPointByFloor: (floor, p) => (floor ? { x: p.x + 1, y: p.z + 2 } : { x: p.x, y: p.z }),
    worldPoint: (id, x, y, h) => ({ id, x, y, z: h }),
  });
  const docs = [
    { previewFloorGap: 2, floors: [] },
    { previewFloorGap: 2, floors: [{ id: 'f1', offset: 0, scene: { walls: [], settings: { wallHeight: 2.6 } } }, { id: 'f2', offset: 3, scene: { walls: [{ start: { x: 0, y: 0 }, end: { x: 5, y: 2 }, height: 2.9 }], settings: { wallHeight: 2.8 } } }] },
    { previewFloorGap: 1.5, floors: [{ id: 'f1', offset: 1, scene: { walls: [{ start: { x: 0, y: 0 }, end: { x: 3, y: 4 } }], settings: {} } }, { id: 'f9', offset: -2, scene: { walls: [{ start: { x: NaN, y: 1 }, end: { x: 2, y: 2 } }], settings: { wallHeight: 3.1 } } }, { id: 'f3', offset: 0, scene: { walls: [{ start: { x: 1, y: 1 }, end: { x: 1, y: 1 }, height: 0 }] } }] },
  ];
  const run = (fn, wp) => {
    try { return canon({ v: fn(wp) }); } catch (e) { return canon({ e: normalizeError(e) }); }
  };
  let n = 0, diff = 0;
  for (const doc of docs) {
    for (const mode of ['all', 'current']) {
      for (const activeFloorId of ['f1', 'f2', 'nope']) {
        const st = { doc: JSON.parse(JSON.stringify(doc)), mode, activeFloorId };
        n++;
        const depsA = world(st); const depsB = world(st);
        const a = run(build(head, 'computeMultiFloorBoundsCenter', depsA), depsA.worldPoint);
        const b = run(build(cur, 'computeMultiFloorBoundsCenter', depsB), depsB.worldPoint);
        if (a !== b) { diff++; console.log('  DIFF computeMultiFloorBoundsCenter', mode, activeFloorId, a, b); }
      }
    }
  }
  const st = { doc: JSON.parse(JSON.stringify(docs[2])), mode: 'all', activeFloorId: 'f1' };
  const depsM = world(st); const depsG = world(st);
  const mo = run(build(cur, 'computeMultiFloorBoundsCenter', depsM, (b) => b.replace('previewFloorGap / 2', 'previewFloorGap')), depsM.worldPoint);
  const go = run(build(cur, 'computeMultiFloorBoundsCenter', depsG), depsG.worldPoint);
  const mutation = mo !== go;
  console.log(`  mutation sensitivity: ${mutation ? 'ok' : 'BROKEN'}`);
  return { name: 'computeMultiFloorBoundsCenter', n, diff, mutation };
}

// ------------------------------------------------------------ resolvePlanSnap
class Mat4 {
  constructor() { this.ops = []; }
  compose(v, q, s) { this.ops.push(['compose', v.x, v.y, v.z, s.x, s.y, s.z, q.angle]); return this; }
}
class Quat { setFromAxisAngle(axis, angle) { this.axis = [axis.x, axis.y, axis.z]; this.angle = angle; return this; } }
function testResolvePlanSnap() {
  const mkDeps = () => {
    const log = [];
    const THREE = {
      Matrix4: Mat4,
      Vector3: Vec3,
      Quaternion: Quat,
      AdditiveBlending: 'AdditiveBlending',
      BoxGeometry: class {
        constructor(w, h, d) { this.w = w; this.h = h; this.d = d; }
        applyMatrix4(m) { this.matrix = m.ops; return this; }
        dispose() { log.push(['dispose', this.w, this.h, this.d]); }
      },
      Mesh: class {
        constructor(geometry, material) { this.geometry = geometry; this.material = material; this.userData = {}; }
      },
      MeshBasicMaterial: class { constructor(o) { Object.assign(this, o); } },
    };
    return {
      log,
      deps: {
        THREE,
        mergeGeometries: (list) => ({ __mergedCount: list.length, dispose() { log.push(['disposeMerged', list.length]); } }),
        worldGroup: { add(mesh) { log.push(['add', mesh.renderOrder, mesh.geometry.__mergedCount ?? null, canon(mesh.material), canon(mesh.userData)]); } },
      },
    };
  };
  const mk = (src) => {
    const { log, deps } = mkDeps();
    return { log, run: build(src, 'resolvePlanSnap', deps) };
  };
  const polygons = [
    [{ x: 0, z: 0 }, { x: 4, z: 0 }, { x: 4, z: 3 }],
    [{ x: 0, z: 0 }, { x: 4, z: 0 }, { x: 4, z: 3 }, { x: 0, z: 3 }],
    [{ x: 0, z: 0 }, { x: 0, z: 0 }, { x: 1, z: 1 }],
    [{ x: -2, z: 5 }, { x: 3, z: -1 }],
  ];
  let n = 0, diff = 0;
  for (const poly of polygons) {
    for (const color of [0xff0000, '#00ff00']) {
      for (const baseHeight of [0, 2.75, -1.5]) {
        n++;
        const a = mk(head); const b = mk(cur);
        a.run(poly.map((p) => ({ ...p })), color, baseHeight);
        b.run(poly.map((p) => ({ ...p })), color, baseHeight);
        const sa = canon(a.log); const sb = canon(b.log);
        if (sa !== sb) { diff++; console.log('  DIFF resolvePlanSnap', canon(poly), color, baseHeight, sa, sb); }
      }
    }
  }
  const base = mkDeps(); const mutated = mkDeps();
  const poly = polygons[1].map((p) => ({ ...p }));
  build(cur, 'resolvePlanSnap', base.deps)(poly.map((p) => ({ ...p })), 0xff0000, 0);
  build(cur, 'resolvePlanSnap', mutated.deps, (b) => b.replace('0.042', '0.043'))(poly.map((p) => ({ ...p })), 0xff0000, 0);
  const mutation = canon(base.log) !== canon(mutated.log);
  console.log(`  mutation sensitivity: ${mutation ? 'ok' : 'BROKEN'}`);
  return { name: 'resolvePlanSnap', n, diff, mutation };
}

// --------------------------------------------------- R14d/R15a: pure helpers
// Table-driven: each case builds fresh state, derives args from it, and compares
// result + mutated state across revisions. `deps` supplies the free names the
// body closes over. Awaiting is handled so Promise-returning functions compare
// their settled value rather than a stringified Promise.
function checkPure(name, makeState, cases, opts = {}) {
  const run = async (src, mutate) => {
    const out = [];
    const errored = [];
    for (const argsFrom of cases) {
      const state = makeState();
      let args;
      try { args = argsFrom(state); } catch (e) { out.push(canon({ e: normalizeError(e) })); errored.push(true); continue; }
      let fn;
      try { fn = build(src, name, { ...state.deps }, mutate); }
      catch (e) { out.push(canon({ e: normalizeError(e) })); errored.push(true); continue; }
      try {
        let v = fn(...args);
        if (v && typeof v.then === 'function') {
          // A rejected promise is an observable outcome of the call, not a
          // harness failure: record it as a value so it is compared, not skipped.
          try { v = await v; } catch (e) { v = { rejected: normalizeError(e) }; }
        }
        out.push(canon({ v, state: canon(state.observe()) }));
        errored.push(false);
      } catch (e) {
        out.push(canon({ e: normalizeError(e), state: canon(state.observe()) }));
        errored.push(true);
      }
    }
    return { values: out, errored };
  };
  return (async () => {
    // Sequential: a case factory that keeps per-state bookkeeping (branch
    // counters, probe registries) must not have two runs interleave.
    const a = await run(head);
    const b = await run(cur);
    let diff = 0;
    for (let i = 0; i < a.values.length; i++) {
      if (a.values[i] !== b.values[i]) { diff++; console.log(`  DIFF ${name} #${i}`, a.values[i], b.values[i]); }
    }
    // A case that throws on *both* revisions compares equal without exercising
    // anything -- a missing dependency in the harness reads as a passing test.
    // That is worse than a failure, so it is reported as one.
    const vacuous = a.errored.filter((e, i) => e && b.errored[i]);
    const allVacuous = vacuous.length === a.values.length;
    if (vacuous.length) {
      console.log(`  ${allVacuous ? 'VACUOUS' : 'warn   '} ${name}: ${vacuous.length}/${a.values.length} case(s) errored on both revisions, e.g. ${a.values[a.errored.findIndex((e, i) => e && b.errored[i])]}`);
    }
    let mutation = true;
    return (opts.mutate
      ? Promise.all([run(cur, opts.mutate), run(cur)]).then(([m, g]) => canon(m.values) !== canon(g.values))
      : Promise.resolve(true)
    ).then((mut) => {
      mutation = mut;
      console.log(`  mutation sensitivity: ${mutation ? 'ok' : 'BROKEN'}  (${name})`);
      return { name, n: a.values.length, diff, mutation, vacuous: vacuous.length, allVacuous };
    });
  })();
}

// state = { deps, observe(), ...probes } -- probes are per-case factories.
function testR15aPure() {
  const out = [];
  const plain = (deps) => () => ({ deps, observe: () => null });

  // tvMountLayoutMetrics(item, screenHeight)
  out.push(checkPure('tvMountLayoutMetrics', plain({}), [
    () => [{ tvMountStyle: 'mobile' }, 0.6],
    () => [{ tvMountStyle: 'tabletop' }, 0.6],
    () => [{ tvMountStyle: 'wall' }, 0.75],
    () => [{}, 1.2],
    () => [{ tvMountStyle: 'mobile' }, 0],
  ], { mutate: (b) => b.replace('0.43', '0.44') }));

  // polygonCentroid(PathClass, points)
  const pathState = () => {
    const ops = [];
    class PathClass {
      constructor() { ops.push(['new']); }
      moveTo(x, y) { ops.push(['M', x, y]); }
      lineTo(x, y) { ops.push(['L', x, y]); }
      closePath() { ops.push(['Z']); }
    }
    return { deps: {}, PathClass, observe: () => ops };
  };
  out.push(checkPure('polygonCentroid', pathState, [
    (s) => [s.PathClass, [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }]],
    (s) => [s.PathClass, []],
    (s) => [s.PathClass, [{ x: 1, y: 1 }]],
    (s) => [s.PathClass, [{ x: -1, y: 2 }]],
  ], { mutate: (b) => b.replace('closePath();', 'closePath();this.ops.length;') }));

  // focusCameraOnPoint(frameHeight, aspect, camera)
  const camState = () => {
    const made = [];
    const cam = () => {
      const c = { isOrthographicCamera: true, left: 0, right: 0, top: 0, bottom: 0, projections: 0, updateProjectionMatrix() { this.projections++; } };
      made.push(c);
      return c;
    };
    return { deps: {}, cam, observe: () => made };
  };
  out.push(checkPure('focusCameraOnPoint', camState, [
    (s) => [10, 2, s.cam()],
    (s) => [10, 0.5, s.cam()],
    (s) => [0, 0, s.cam()],
    (s) => [10, 2, { isOrthographicCamera: false }],
    (s) => [-4, 1, s.cam()],
  ], { mutate: (b) => b.replace('Math.max(aspect, 0.1)', 'Math.max(aspect, 0.2)') }));

  // getCameraPose(camera, target)
  const poseState = () => {
    const made = [];
    const cam = (dist) => {
      const c = {
        isPerspectiveCamera: true, near: 0, far: 0, projections: 0,
        position: { distanceTo: () => dist },
        updateProjectionMatrix() { this.projections++; },
      };
      made.push(c);
      return c;
    };
    return { deps: { cameraCurrent: null, am: 0.01, sm: 0.32, lm: 0.006, clamp: (v, lo, hi) => Math.min(hi, Math.max(lo, v)) }, cam, observe: () => made };
  };
  out.push(checkPure('getCameraPose', poseState, [
    (s) => [s.cam(12), { x: 0, y: 0, z: 0 }],
    (s) => [null, { x: 0, y: 0, z: 0 }],
    (s) => [s.cam(500), { x: 0, y: 0, z: 0 }],
    (s) => [s.cam(12), null],
    (s) => [s.cam(0.001), { x: 0, y: 0, z: 0 }],
  ], { mutate: (b) => b.replace('distance * lm', 'distance * lm * 1.5') }));

  // setGroupVisibilityByKey(groups, activeKey)
  const lightState = () => {
    const light = (onIntensity, isSpot) => ({
      visible: null, intensity: null, castShadow: null, isSpotLight: isSpot,
      userData: { lightOnIntensity: onIntensity }, shadow: { map: null, needsUpdate: false },
    });
    const groups = new Map([
      ['a', [light(3, true), light(4, false)]],
      ['b', [light(5, false)]],
      ['c', [light(0, true)]],
    ]);
    return {
      deps: { finite: (v, d) => (Number.isFinite(v) ? v : d), updateLightPreview: () => {} },
      groups,
      observe: () => [...groups].map(([k, ls]) => [k, ls.map((l) => [l.visible, l.intensity, l.castShadow, l.shadow.needsUpdate])]),
    };
  };
  out.push(checkPure('setGroupVisibilityByKey', lightState, [
    (s) => [s.groups, 'a'],
    (s) => [s.groups, 'c'],
    (s) => [s.groups, ''],
    (s) => [s.groups, undefined],
  ], { mutate: (b) => b.replace('light.intensity = visible ?', 'light.intensity = !visible ?') }));

  // canvasToBlob(canvas)
  const blobState = () => {
    const made = [];
    const canvas = (ok) => {
      const c = { mime: null, q: null, toBlob(cb, mime, q) { this.mime = mime; this.q = q; cb(ok ? { size: 1, type: mime } : null); } };
      made.push(c);
      return c;
    };
    return { deps: { EXPORT_IMAGE_MIME_TYPE: 'image/jpeg', EXPORT_IMAGE_QUALITY: 0.9 }, canvas, observe: () => made };
  };
  out.push(checkPure('canvasToBlob', blobState, [
    (s) => [s.canvas(true)],
    (s) => [s.canvas(false)],
  ], { mutate: (b) => b.replace('EXPORT_IMAGE_QUALITY', '0.5') }));

  // uniqueExportPresetLabel(label, presetIndex)
  const presetState = () => ({
    deps: {
      normalizeLabelText: (t) => String(t).slice(0, 24),
      projectDocCurrent: { exportPresets: ['客厅', '客厅', '卧室'] },
      defaultExportPresetLabel: (t, i) => `${t} ${i}`,
    },
    observe: () => null,
  });
  out.push(checkPure('uniqueExportPresetLabel', presetState, [
    () => ['客厅', 0],
    () => ['卧室', 1],
    () => ['书房', 2],
    () => ['客厅 1', 0],
  ], { mutate: (b) => b.replace('.slice(0, 24)', '.slice(0, 24) + "!"') }));

  // cancelWallDrawing() -- the restore call is the observable
  const cancelState = () => {
    const calls = [];
    return {
      deps: { previewScene: 1, defaultExportHeight: 6, exportAspectRatio: 1.5, zoomPlanViewAt: (...a) => calls.push(a) },
      observe: () => calls,
    };
  };
  out.push(checkPure('cancelWallDrawing', cancelState, [() => []],
    { mutate: (b) => b.replace('zoomPlanViewAt(previousExportHeight, previousAspect)', 'zoomPlanViewAt(previousExportHeight, 1)') }));

  // yieldToIdle() -- which fallback wins, and the argued timeout.
  // Three stateless variants so the branch is fixed per case, not shared state.
  // Only the idle branch reads `timeout`, so only it can carry a mutation proof.
  const idleBranch = (mode) => () => {
    const log = [];
    const requestIdleCallback = (cb, o) => { log.push(['idle', o.timeout]); cb(); };
    const requestAnimationFrame = (cb) => { log.push(['raf']); cb(); };
    const yieldFn = (...a) => { log.push(['scheduler', ...a]); return Promise.resolve(); };
    const globalThis = mode === 'idle' ? { requestIdleCallback: true }
      : mode === 'scheduler' ? { scheduler: { yield: yieldFn } }
        : {};
    return { deps: { globalThis, requestIdleCallback, requestAnimationFrame }, observe: () => log };
  };
  for (const mode of ['idle', 'raf', 'scheduler']) {
    out.push(checkPure('yieldToIdle', idleBranch(mode), [() => []],
      mode === 'idle' ? { mutate: (b) => b.replace('timeout: 80', 'timeout: 90') } : {}));
  }

  return out;
}

// ------------------------------------------------- R15b: structural functions
// Shared recorder-heavy THREE stub: geometry attributes, material uniforms and
// renderOrder all end up in the log, so a rename that changed anything visible
// would move the log.
function makeStructuralTHREE(log) {
  const Mat4 = class { constructor() { this.ops = []; } compose(v, q, s) { this.ops.push([v.x, v.y, v.z, s.x, s.y, s.z, q.angle]); return this; } };
  const Quat = class { setFromAxisAngle(axis, angle) { this.axis = [axis.x, axis.y, axis.z]; this.angle = angle; return this; } };
  const Vec3 = class { constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; } };
  const Geom = (name) => class {
    constructor(...args) { this.kind = name; this.args = args; this.attrs = {}; this.ops = []; this.matrix = null; }
    applyMatrix4(m) { this.matrix = m.ops; return this; }
    rotateX(a) { this.ops.push(['rotateX', a]); return this; }
    translate(x, y, z) { this.ops.push(['translate', x, y, z]); return this; }
    setAttribute(k, v) { this.attrs[k] = v.record(); return this; }
    computeVertexNormals() { log.push(['computeVertexNormals', this.kind]); }
    dispose() { log.push(['dispose', this.kind]); }
  };
  const Mesh = class {
    constructor(geometry, material) { this.geometry = geometry; this.material = material; this.userData = {}; this.renderOrder = null; }
  };
  return {
    Matrix4: Mat4, Vector3: Vec3, Quaternion: Quat,
    DoubleSide: 2, AdditiveBlending: 2,
    BoxGeometry: Geom('Box'), ShapeGeometry: Geom('Shape'), BufferGeometry: Geom('Buffer'),
    Float32BufferAttribute: class {
      constructor(array, itemSize) { this.array = [...array]; this.itemSize = itemSize; }
      record() { return { itemSize: this.itemSize, array: this.array.map((n) => +n.toFixed(9)) }; }
    },
    Color: class { constructor(c) { this.c = c; } },
    Mesh,
    MeshBasicMaterial: class { constructor(o) { Object.assign(this, o); } },
    ShaderMaterial: class { constructor(o) { this.uniforms = o.uniforms; this.transparent = o.transparent; this.side = o.side; } },
    Shape: class { constructor(outline) { this.outline = outline; } },
    Group: class { constructor() { this.children = []; this.userData = {}; this.position = { set: (x, y, z) => log.push(['position', x, y, z]) }; } add(o) { this.children.push(o); log.push(['groupAdd', o.userData && o.userData.exportRole]); } },
  };
}

// ------------------------- mergeStaticItemInstanceBatches (R17d)
// The rename here also exercised the tool's new shorthand handling: `item` and
// `object3d` appear as `{ item }` both in a destructuring pattern and in an
// object literal, so the rename has to expand them to `{ item: batchItem }`. A
// rename that got that wrong would rewrite property names and move this log.
function testInstanceBatches() {
  const Mat4 = class {
    constructor(ops = []) { this.ops = ops; }
    clone() { return new Mat4([...this.ops]); }
    invert() { this.ops.push('invert'); return this; }
    multiplyMatrices(a, b) { this.ops = ['mul', a.ops, b.ops]; return this; }
  };
  const mesh = (tag, extra = {}) => ({
    userData: { ...extra },
    material: { tag: 'mat-' + tag, clone() { return { tag: 'mat-' + tag + '-clone' }; } },
    geometry: { tag: 'geo-' + tag },
    castShadow: true, receiveShadow: false, renderOrder: 2,
    matrixWorld: { ops: ['world-' + tag] },
  });

  // `makeBatches` builds the argument fresh for each revision run; the state
  // object exposes the log so both runs are observed the same way.
  const stateFor = (makeBatches) => () => {
    const log = [];
    const rootGroup = {
      children: [],
      userData: {},
      updateMatrixWorld: (force) => log.push(['updateMatrixWorld', force]),
      matrixWorld: new Mat4(['root']),
      add(o) { log.push(['add', o.name, o.userData.exportRole]); this.children.push(o); },
      remove(o) { log.push(['remove', o.tag]); },
    };
    const renderer = { domElement: { dataset: {} } };
    const deps = {
      THREE: {
        StaticDrawUsage: 35044,
        Matrix4: Mat4,
        InstancedMesh: class {
          constructor(geometry, material, count) {
            this.geometry = geometry;
            this.material = material;
            this.count = count;
            this.userData = {};
            this.name = null;
            log.push(['newInstancedMesh', geometry.tag, material.tag, count]);
            this.instanceMatrix = { setUsage: (u) => log.push(['setUsage', u]), needsUpdate: false };
          }
          setMatrixAt(i, m) { log.push(['setMatrixAt', i, m.ops]); }
          computeBoundingBox() { log.push(['computeBoundingBox', this.name]); }
          computeBoundingSphere() { log.push(['computeBoundingSphere', this.name]); }
        },
      },
      skipInstanceMergeTypes: new Set(['skipped']),
      isStageEmbed: false,
      isSelected: (_kind, id) => id === 'selected-item',
      collectShadowLights: (g) => g.descriptors,
      disposeObject3dResources: (o) => log.push(['dispose', o.tag]),
      renderer,
    };
    return {
      deps,
      args: [rootGroup, makeBatches()],
      observe: () => ({
        log,
        stats: rootGroup.userData.instanceBatchStats,
        children: rootGroup.children.map((c) => [c.name, c.count]),
        dataset: { ...renderer.domElement.dataset },
      }),
    };
  };

  const twoBatches = () => [
    { item: { type: 'chair', id: 'a' },
      group: { tag: 'g-a', descriptors: [{ signature: 's1', mesh: mesh('a1') }, { signature: 's2', mesh: mesh('a2') }] } },
    { item: { type: 'chair', id: 'b' },
      group: { tag: 'g-b', descriptors: [{ signature: 's1', mesh: mesh('b1') },
        { signature: 's2', mesh: { ...mesh('b2'), userData: { externalModelSharedMaterial: true } } }] } },
  ];
  const soloBatch = () => [
    { item: { type: 'chair', id: 'a' }, group: { tag: 'g-a', descriptors: [{ signature: 's1', mesh: mesh('a1') }] } },
  ];
  const oneMergesOneSkips = () => [
    ...twoBatches(),
    { item: { type: 'skipped', id: 'c' },
      group: { tag: 'g-c', descriptors: [{ signature: 's1', mesh: mesh('c1') }, { signature: 's2', mesh: mesh('c2') }] } },
    { item: { type: 'chair', id: 'selected-item' },
      group: { tag: 'g-d', descriptors: [{ signature: 's1', mesh: mesh('d1') }, { signature: 's2', mesh: mesh('d2') }] } },
  ];

  const out = [];
  const args = [(s) => s.args];
  out.push(checkPure('mergeStaticItemInstanceBatches', stateFor(twoBatches), args));
  // the single-entry group is where the `length < 2` guard actually decides
  // something, so that is where the mutation probe belongs
  out.push(checkPure('mergeStaticItemInstanceBatches', stateFor(soloBatch), args,
    { mutate: (b) => b.replace('if (batchEntries.length < 2)', 'if (batchEntries.length < 1)') }));
  out.push(checkPure('mergeStaticItemInstanceBatches', stateFor(oneMergesOneSkips), args));
  // a group whose shadow lights cannot be collected is skipped before merging
  out.push(checkPure('mergeStaticItemInstanceBatches', stateFor(() => {
    const batches = twoBatches();
    return batches;
  }), [(s) => [s.args[0], s.args[1].map((b, i) => (i ? b : { ...b, group: { ...b.group, descriptors: null } }))]]));
  return out;
}

function testR15bStructural() {
  const out = [];

  // --- addCeilingMeshesFromPolygons(polygons, heightOffset), sign of polygonArea
  const ceilingState = (areaSign) => () => {
    const log = [];
    const THREE = makeStructuralTHREE(log);
    return {
      deps: {
        THREE,
        addCeilingMeshes: (poly, offset) => poly.map((p) => ({ x: p.x + offset, y: p.y + offset * 2 })),
        polygonArea: () => areaSign,
        polygonCentroid: (Ctor, pts) => new Ctor(pts),
        mergeGeometries: (list) => (list.length ? { merged: list.length } : null),
        worldGroup: { add: (m) => log.push(['add', m.renderOrder, m.userData.batchedWallContactShadowCount]) },
      },
      observe: () => log,
    };
  };
  const ceilings = [
    [[[{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }]], 0.05],
    [[[{ x: 0, y: 0 }, { x: 0, y: 4 }, { x: 3, y: 4 }, { x: 3, y: 0 }]], -0.02],
    [[[]], 0.1],
    [[], 0.1],
  ];
  for (const sign of [1, -1]) {
    out.push(checkPure('addCeilingMeshesFromPolygons', ceilingState(sign),
      ceilings.map((c) => () => c)));
  }

  // --- splitFloorPolygonsByHolesCurrent(polygon, glowColor, baseY)
  const splitState = () => {
    const log = [];
    const THREE = makeStructuralTHREE(log);
    return {
      deps: {
        THREE,
        distance: (a, b) => Math.hypot(a.x - b.x, a.y - b.y),
        addCeilingMeshes: (points, offset) => points.map((p) => ({ x: p.x + offset, y: p.y + offset })),
        mergeGeometries: (list) => ({ merged: list.length }),
        worldGroup: { add: (m) => log.push(['add', m.renderOrder, m.geometry.kind, canon(m.geometry.attrs), canon(m.material.uniforms)]) },
      },
      observe: () => log,
    };
  };
  const splits = [
    [[{ x: 0, z: 0 }, { x: 4, z: 0 }, { x: 4, z: 3 }], 0xff8800, 0],
    [[{ x: 0, z: 0 }, { x: 4, z: 0 }, { x: 4, z: 3 }, { x: 0, z: 3 }], 0x00ff00, 2.75],
    [[{ x: 0, z: 0 }, { x: 1, z: 1 }], 0x123456, -1],       // too few points
    [[{ x: 0, z: 0 }, { x: 0, z: 0 }, { x: 0, z: 0 }], 0xffffff, 0.5], // degenerate
    ['not-an-array', 0x000000, 0],
  ];
  out.push(checkPure('splitFloorPolygonsByHolesCurrent', splitState, splits.map((s) => () => s)));

  // --- runWithResidentFloorCache(entries, lightCache)
  const residentState = (opts) => () => {
    const log = [];
    const THREE = makeStructuralTHREE(log);
    THREE.Object3D = class Object3D {};
    const existing = { userData: { floorId: 'f1' }, children: [], add(o) { this.children.push(o); log.push(['layerAdd', o.userData.exportRole]); } };
    const worldGroup = { children: [existing], add: () => {} };
    const light = (id) => ({ isLight: true, id });
    return {
      deps: {
        THREE,
        worldGroup,
        floorSceneCurrent: { tag: 'scene' },
        activeFloorId: 'f2',
        residentCacheMode: false,
        getPreviewFloorModeCurrent: () => (opts.all ? 'all' : 'single'),
        pixelsPerMeter: () => opts.ppm,
        getPreviewFloorMode: () => ({ minX: -1, maxX: 5, minY: -2, maxY: 6 }),
        finite: (v, d) => (Number.isFinite(v) ? v : d),
        buildWallCornerCaps: (target, item, ids) => { log.push(['cornerCaps', item.id, canon(ids)]); target.traverse = (cb) => { (item.lights || []).forEach((l) => cb(light(l))); }; },
        shadowCastingLightIdSet: () => new Set(['a']),
        instanceMergeIdenticalItems: (target, item) => log.push(['merge', item.id]),
        isStageEmbed: opts.embed,
        cacheObjectTransforms: (o) => log.push(['cacheTransforms']),
        syncSpotShadowCastingLights: (g, o) => log.push(['syncSpot', canon(o)]),
      },
      observe: () => log,
    };
  };
  const buildEntry = ([id, lights]) => ({ floor: { id, scene: { tag: id }, originX: 1, originY: 2 }, item: { id, x: 3, y: 4, elevation: 0, lights }, itemKey: `key-${id}` });
  const cases = [
    () => [[buildEntry(['f1', [1, 2]]), buildEntry(['f2', []]), buildEntry(['f1', [3]])], new Map()],
    () => [[buildEntry(['f1', [1, 2]])], new Map([['key-f1', ['cached']]])],
    () => [[], new Map()],
    () => [[buildEntry(['f2', [5]]), buildEntry(['f9', [6]])], new Map()],
  ];
  for (const opts of [{ all: true, ppm: 40, embed: false }, { all: false, ppm: 40, embed: true }, { all: true, ppm: 0, embed: false }]) {
    out.push(checkPure('runWithResidentFloorCache', residentState(opts), cases));
  }

  return out;
}

// ------------------------------------------------- R16a: structural functions
function testR16aStructural() {
  const out = [];

  // --- createGroundGridHelper(worldSize, theme, floorY)
  const gridState = () => {
    const log = [];
    const added = [];
    const vec = () => ({ x: 0, y: 0, z: 0, distanceTo: (o) => Math.abs(o.__d ?? 7) });
    class GridHelper {
      constructor(size, divisions, c1, c2) {
        this.args = [size, divisions, c1, c2];
        this.material = { transparent: false, opacity: 1, depthWrite: true, toneMapped: true, userData: {} };
        this.position = { y: 0 };
        this.renderOrder = null;
        this.userData = {};
      }
      getWorldPosition(t) { t.x = 1; t.y = 2; t.z = 3; }
    }
    const THREE = {
      GridHelper,
      Vector3: class { constructor(x = 0, y = 0, z = 0) { Object.assign(this, vec(), { x, y, z }); } },
      MathUtils: { degToRad: (d) => (d * Math.PI) / 180 },
    };
    const camera = (d) => ({
      __d: d, isOrthographicCamera: false, top: 5, bottom: -5, zoom: 1, fov: 45, aspect: 1.6,
      position: { distanceTo: () => d },
    });
    return {
      deps: { THREE, worldGroup: { add: (h) => { added.push(h); log.push(['add', h.renderOrder]); } }, orbitControls: { target: { __d: 99 } } },
      camera,
      observe: () => {
        const h = added[added.length - 1];
        if (h && !h.__probed) {
          h.__probed = true;
          const shader = { uniforms: {}, vertexShader: 'v: #include <common> #include <project_vertex>', fragmentShader: 'f: #include <common> vec4 diffuseColor = vec4( diffuse, opacity );' };
          h.material.onBeforeCompile(shader);
          log.push(['compiled', canon(shader.uniforms)]);
          for (const d of [4, 30]) h.onBeforeRender(null, null, camera(d));
        }
        return {
          log,
          helper: h ? { args: h.args, renderOrder: h.renderOrder, y: h.position.y, role: h.userData.exportRole, mat: [h.material.transparent, h.material.opacity, h.material.depthWrite, h.material.toneMapped], uniforms: h.material.userData.depthFadeShader?.uniforms } : null,
        };
      },
    };
  };
  out.push(checkPure('createGroundGridHelper', gridState, [
    () => [48, { grid: 0x333333 }, 0],
    () => [12.4, { grid: 0x888888 }, -1.5],
    () => [0.2, { grid: 0x000000 }, 2.75],
  ], { mutate: (b) => b.replace('worldSize * 0.46', 'worldSize * 0.56') }));

  // --- recordPerfFloorSwitchSample(nowMs, cpuRenderMs, isMotionFrame)
  const perfState = (opts) => () => {
    const samples = [];
    const stats = {
      floorSwitch: opts.active ? {
        until: opts.until, last: 100, frames: 3, longFrames: 1, maxMs: 20, cpuMs: 10, checksSinceRender: 4,
        pendingPhases: { a: 1 }, maxRenderCpuMs: 12, slowRenderCount: 1,
      } : null,
      cpuRenderTimes: [], frameIntervals: [], lastMotionRenderAt: opts.lastMotion,
    };
    return {
      deps: {
        isPerfDiagnosticsEnabled: true,
        perfStats: stats,
        performance: { now: () => opts.now },
        renderer: { info: { programs: [1, 2, 3], memory: { geometries: 42 } } },
        renderCache: opts.renderCache ? { stats: { hits: 1 } } : null,
        pushBoundedTimingSample: (arr, v) => { arr.push(v); samples.push([arr.length, v]); if (arr.length > 64) arr.shift(); },
      },
      observe: () => stats,
    };
  };
  const perfCases = [
    { active: true, until: 200, now: 150, lastMotion: 0, renderCache: true },
    { active: true, until: 100, now: 150, lastMotion: 140, renderCache: false },
    { active: false, until: 200, now: 150, lastMotion: 140, renderCache: true },
    { active: true, until: 200, now: 60, lastMotion: 58, renderCache: false },
  ];
  out.push(checkPure('recordPerfFloorSwitchSample', perfState(perfCases[0]),
    [() => [150, 60, true], () => [1000, 10, false]],
    { mutate: (b) => b.replace('renderGapMs > 50', 'renderGapMs > 49') }));
  out.push(checkPure('recordPerfFloorSwitchSample', perfState(perfCases[3]),
    [() => [60, 8, true]],
    { mutate: (b) => b.replace('frameInterval >= 2', 'frameInterval >= 3') }));

  // --- warmLightCacheMeshesForGroups(groupIds, cacheDurationMs)
  const warmState = () => {
    const log = [];
    const frames = [];
    const lights = [
      { isLight: true, intensity: 0.2, visible: false, userData: { lightGroupId: 'a', lightOnIntensity: 5 } },
      { isLight: true, intensity: 0.4, visible: false, userData: { lightGroupId: 'b', lightOnIntensity: 7 } },
      { isLight: true, intensity: 0.6, visible: true, userData: { lightGroupId: 'c', lightOnIntensity: 9 } },
      { isLight: false, userData: { lightGroupId: 'a' } },
    ];
    return {
      deps: {
        worldGroup: { traverse: (cb) => lights.forEach(cb), children: [] },
        isPreviewQualityReady: () => true,
        stageSession: null,
        findLightGroupById: (id) => ({ enabled: id !== 'c' }),
        finite: (v, d) => (Number.isFinite(v) ? v : d),
        syncSpotShadowCastingLights: (g, o) => log.push(['syncSpot', canon(o)]),
        cancelAnimationFrame: (h) => log.push(['cancel', h]),
        performance: { now: () => 500 },
        clamp: (v, lo, hi) => Math.min(hi, Math.max(lo, v)),
        updateLightPreview: () => log.push(['preview']),
        requestAnimationFrame: (cb) => { frames.push(cb); log.push(['raf']); return 77; },
        is: null,
      },
      frames,
      observe: () => {
        // step the fade loop a few times to exercise advanceFade
        for (let i = 0; i < 3 && frames.length; i++) {
          const cb = frames.pop();
          cb(i === 0 ? 500 : 500 + 400 * (i + 1) * 6);
        }
        return { log, lights: lights.map((l) => [l.intensity, l.visible]) };
      },
    };
  };
  out.push(checkPure('warmLightCacheMeshesForGroups', warmState, [
    () => [['a', 'b'], 1200],
    () => [['c'], 1200],
    () => [[], 1200],
  ], { mutate: (b) => b.replace('(3 - progress * 2)', '(3 - progress * 3)') }));

  // --- removeWorldModelLayer(removedFloorIds)
  const removeState = (opts) => () => {
    const log = [];
    const floors = [
      { id: 'f1', elevation: 0, scene: { tag: 'f1' }, originX: 1, originY: 2, offsetX: 0, offsetY: 0, offsetZ: 0, rotation: 0 },
      { id: 'f2', elevation: 3, scene: { tag: 'f2' }, originX: 0, originY: 0, offsetX: 1, offsetY: 0, offsetZ: 2, rotation: 90 },
    ];
    const layer = (id) => ({
      userData: { floorId: id },
      position: { set: (...a) => log.push(['position', id, ...a]) },
      rotation: { set: (...a) => log.push(['rotation', id, ...a]) },
      scale: { set: (...a) => log.push(['scale', id, ...a]) },
      add() {}, remove(o) { log.push(['removeChild', id, o.userData.exportRole]); },
      children: [
        { userData: { exportRole: 'background' }, visible: true, remove() {} },
        { userData: { exportRole: 'grid' }, visible: true },
        { userData: { exportRole: 'items' }, visible: true },
      ],
    });
    const root = {
      children: opts.missing ? [] : [layer('f1'), layer('f2')],
      position: { set: (...a) => log.push(['position', ...a]) },
      rotation: { set: (...a) => log.push(['rotation', ...a]) },
      scale: { set: (...a) => log.push(['scale', ...a]) },
      traverse() {}, add() {}, remove() {},
    };
    return {
      deps: {
        worldGroup: root,
        getPreviewFloorModeCurrent: () => opts.mode,
        activeFloorId: 'f1',
        rebuildWorldPreviewCurrent: () => log.push(['rebuildCurrent']),
        projectDocCurrent: { floors, previewFloorGap: 2 },
        finite: (v, d) => (Number.isFinite(v) ? v : d),
        THREE: { MathUtils: { degToRad: (d) => (d * Math.PI) / 180 } },
        rebuildWorldPreview: () => log.push(['rebuild']),
        isStageEmbed: opts.embed,
        disposeObject3dResources: (o) => log.push(['dispose', o.userData.exportRole]),
        syncSpotShadowCastingLights: (g) => log.push(['syncSpot']),
        flushPlanZoomFrame: () => log.push(['flush']),
        Lo: { x: 0, y: 0 },
        floorSceneCurrent: { tag: 'cur' },
      },
      observe: () => log,
    };
  };
  const removeCases = [() => [new Set(['f1'])], () => [new Set(['f2'])], () => [new Set()], () => [new Set(['f1', 'f2'])]];
  for (const opts of [
    { mode: 'all', missing: false, embed: false },
    { mode: 'single', missing: false, embed: true },
    { mode: 'all', missing: true, embed: false },
  ]) {
    out.push(checkPure('removeWorldModelLayer', removeState(opts), removeCases));
  }

  return out;
}

// ------------------------- countLightPrecompileWork: retry-path regression
// The pre-rename body read `window.setTimeout(helperFn, 32)` while an inner
// `helperFn` -- the tracked-program predicate -- shadowed the poll function, so
// the retry branch invoked the predicate instead of rescheduling itself and the
// returned promise never settled. Renaming the shadowed bindings (R16b) made the
// collision legible; the fix is `setTimeout(pollUntilReady, 32)`.
//
// This one is deliberately NOT a zero-diff comparison: HEAD is where the hang
// lives, and HEAD moves. The expectation is therefore asserted on the working
// tree only, with HEAD's outcome printed for context.
async function testPrecompileRetry() {
  const harness = async (src, opts = {}) => {
    const { xm = 1000, contextLost = false, readyAfterRuns = 3, mutate } = opts;
    const timers = [];
    let clock = 0;
    let runs = 0;
    let settled = 'pending';
    const gl = { isContextLost: () => contextLost, isProgram: () => true };
    const program = {
      program: { id: 1 },
      isReady: () => runs >= readyAfterRuns,
      getUniforms() {},
      getAttributes() {},
    };
    const renderer = {
      compile() {},
      extensions: { has: () => true },
      info: { programs: [program] },
      getContext: () => gl,
      getRenderTarget: () => null,
      getActiveCubeFace: () => 0,
      getActiveMipmapLevel: () => 0,
      setRenderTarget() {},
    };
    const deps = {
      THREE: { WebGLRenderTarget: class { dispose() {} } },
      Xm: xm,
      performance: { now: () => clock },
      // A virtual clock: queued callbacks are run by the drain loop below, so
      // "the promise hangs" is observable instead of a timeout.
      window: { setTimeout: (fn, ms) => timers.push({ fn, at: clock + (ms || 0) }) },
    };
    const fn = build(src, 'countLightPrecompileWork', deps, mutate);
    fn(renderer, { traverse() {} }, {}, () => true).then(
      (v) => { settled = { value: v }; },
      (e) => { settled = { error: normalizeError(e) }; },
    );
    for (let guard = 0; guard < 50 && timers.length; guard++) {
      timers.sort((a, b) => a.at - b.at);
      const t = timers.shift();
      clock = Math.max(clock, t.at);
      runs++;
      t.fn();
    }
    await new Promise((r) => setImmediate(r));
    return canon({ runs, settled });
  };

  const cases = [
    ['retries until ready', {}, { runs: 3, settled: { value: true } }],
    ['gives up at the deadline', { xm: -1, readyAfterRuns: 99 }, { runs: 1, settled: { value: false } }],
    ['bails out when the context is lost', { contextLost: true }, { runs: 0, settled: { value: false } }],
    // Self-validation: putting the shadowed binding back must reproduce the
    // hang, otherwise this test cannot detect the regression it exists for.
    ['regression probe (retry rebound to the predicate)',
      { mutate: (b) => b.replace('window.setTimeout(pollUntilReady, 32)', 'window.setTimeout(isTrackedProgram, 32)') },
      { runs: 2, settled: 'pending' }],
  ];
  let diff = 0;
  for (const [label, opts, want] of cases) {
    const got = await harness(cur, opts);
    const expect = canon(want);
    const ok = got === expect;
    if (!ok) diff++;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  precompile retry / ${label}: ${got}${ok ? '' : ` (want ${expect})`}`);
  }
  const hung = await harness(head);
  console.log(`  note  precompile retry / HEAD: ${hung}`
    + (/pending/.test(hung) ? '  <- the shadowing bug this test pins' : '  <- HEAD already settles here'));
  return { name: 'countLightPrecompileWork(retry)', n: cases.length, diff, mutation: true, vacuous: 0, allVacuous: false };
}

// ------------------------------------------------------- R17e helper functions
// tickQualityProbe / setPerfMotionActive / syncLightGroupVisibility /
// countSceneMeshes / meshInstanceDescriptors / setPreviewFloorMode.
function testR17ePure() {
  const out = [];
  const plain = (deps) => () => ({ deps, observe: () => null });

  // meshInstanceDescriptors(lights)
  out.push(checkPure('meshInstanceDescriptors', plain({}), [
    () => [[]],
    () => [[{ isSpotLight: true }]],
    () => [[{ isSpotLight: true }, { isRectAreaLight: true }, { isPointLight: true }, {}]],
    () => [[{}, {}, {}]],
    () => [[{ isSpotLight: true, isRectAreaLight: true }]],
  ], { mutate: (b) => b.replace('spotCount += 1;', 'spotCount += 2;') }));

  // countSceneMeshes(root)
  const meshState = () => {
    const nodes = [
      { isSpotLight: true, visible: true, userData: { shadowCandidate: true, lightFloorId: 'f1', lightItemId: 'i1', lightGroupId: 'g1', lightType: 'spot', lightBrightness: 3 } },
      { isSpotLight: true, visible: false, userData: { shadowCandidate: true, lightFloorId: 'f1', lightItemId: '', lightGroupId: 'g2' } },
      { isSpotLight: true, userData: { lightItemId: 'i2' } },
      { isMesh: true, userData: {} },
      { isSpotLight: true, visible: false, userData: { shadowCandidate: true, lightFloorId: 7, lightItemId: 9, lightBrightness: 'x' } },
    ];
    return {
      deps: { finite: (v, d) => (Number.isFinite(v) ? v : d), worldGroup: null },
      root: { traverse: (cb) => nodes.forEach(cb) },
      observe: () => null,
    };
  };
  out.push(checkPure('countSceneMeshes', meshState, [
    (s) => [s.root],
    () => [null],
    () => [undefined],
  ], { mutate: (b) => b.replace('if (itemId) {', 'if (!itemId) {') }));

  // syncLightGroupVisibility(lightsByGroup)
  const groupState = () => {
    const mk = (onIntensity, isSpot) => ({ visible: null, intensity: null, castShadow: null, isSpotLight: isSpot, userData: { lightOnIntensity: onIntensity } });
    const groups = new Map([
      ['a', [mk(3, true), mk(4, false)]],
      ['b', [mk(0, false)]],
      ['c', [mk(5, true)]],
    ]);
    return {
      deps: { enabledVisibleLightKeys: () => new Set(['a', 'b']), updateLightPreview: () => {}, finite: (v, d) => (Number.isFinite(v) ? v : d) },
      groups,
      observe: () => [...groups].map(([k, ls]) => [k, ls.map((l) => [l.visible, l.intensity, l.castShadow])]),
    };
  };
  out.push(checkPure('syncLightGroupVisibility', groupState, [
    (s) => [s.groups],
    (s) => [[]],
  ], { mutate: (b) => b.replace('light.visible = isGroupEnabled;', 'light.visible = !isGroupEnabled;') }));

  // setPreviewFloorMode(polygonPoints, baseY, holeLoops)
  const floorModeState = () => {
    const added = [];
    class Shape { constructor(points) { this.points = points; } }
    class Mesh {
      constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.rotation = { x: 0 };
        this.position = { y: 0 };
        this.userData = {};
        this.renderOrder = 0;
      }
    }
    return {
      deps: {
        THREE: {
          Shape,
          DoubleSide: 2,
          ShapeGeometry: function (shape, c) { return { tag: 'shapeGeom', shape, c }; },
          MeshBasicMaterial: function (opts) { return { tag: 'mat', opts }; },
          Mesh,
        },
        worldGroup: { add: (m) => added.push(m) },
        isStageEmbed: false,
        addCeilingMeshes: (points, spread) => points.map((p) => ({ x: p.x + spread, y: p.y })),
        splitFloorPolygonsByHoles: (loops) => ({ tag: 'split', loops }),
        subtractPolygonLoops: (loops) => ({ tag: 'subtract', loops }),
        polygonCentroid: (PathClass, points) => new PathClass(points),
      },
      observe: () => added.map((m) => [m.geometry.tag, m.rotation.x, m.position.y, m.renderOrder, m.userData, m.material.opts.opacity]),
    };
  };
  const tri = [{ x: 0, z: 0 }, { x: 4, z: 0 }, { x: 4, z: 3 }];
  out.push(checkPure('setPreviewFloorMode', floorModeState, [
    (s) => [tri, 0],
    (s) => [tri, 1.2, [[{ x: 1, z: 1 }]]],
    (s) => [[{ x: 0, z: 0 }, { x: 1, z: 1 }], 0],
    (s) => ['nope', 0],
    (s) => [[{ x: NaN, z: 1 }, { x: 1, z: 1 }, { x: 1, z: 2 }], -3],
  ], { mutate: (b) => b.replace('shadowMesh.rotation.x = Math.PI / 2;', 'shadowMesh.rotation.x = Math.PI;') }));

  // setPerfMotionActive(lastTick, isActive)
  const perfState = () => {
    const floorSwitch = { until: 1000, lastTick: null, maxTickMs: 0, tickLongFrames: 0, checksSinceRender: 0 };
    return {
      deps: { isPerfDiagnosticsEnabled: true, perfStats: { floorSwitch }, performance: { now: () => 500 } },
      floorSwitch,
      observe: () => ({ ...floorSwitch }),
    };
  };
  out.push(checkPure('setPerfMotionActive', perfState, [
    (s) => [100, false],
    (s) => [100, true],
    (s) => [100, undefined],
    (s) => { s.floorSwitch.lastTick = 90; return [140, true]; },
    (s) => { s.floorSwitch.lastTick = 10; return [100, true]; },
    (s) => { s.floorSwitch.lastTick = 10; return [61, true]; },
    (s) => { s.floorSwitch.until = 100; s.floorSwitch.lastTick = 90; return [140, true]; },
    (s) => { s.floorSwitch.lastTick = 90; return [100, false]; },
    (s) => { s.deps.isPerfDiagnosticsEnabled = false; return [100, true]; },
  ], { mutate: (b) => b.replace('if (tickMs > 50) {', 'if (tickMs > 60) {') }));

  // tickQualityProbe(nowMs)
  const probeState = () => {
    const samples = [];
    const checks = [];
    return {
      deps: {
        previewOrbitLocked: true,
        isStageEmbed: false,
        isStageWarmup: false,
        stageSession: false,
        previewQualityReady: false,
        enabledVisibleLights: () => [{ id: 'l1' }],
        qualityProbeStartMs: 0,
        recentFrameMsSamplesCurrent: samples,
        checkAdaptiveQuality: () => checks.push(samples.length),
        performance: { now: () => 0 },
      },
      observe: () => ({ samples: [...samples], checks: [...checks] }),
    };
  };
  out.push(checkPure('tickQualityProbe', probeState, [
    (s) => [1000],
    (s) => { s.deps.qualityProbeStartMs = 990; return [1000]; },
    (s) => { s.deps.qualityProbeStartMs = 800; return [1000]; },
    (s) => { s.deps.qualityProbeStartMs = 800; s.deps.isStageEmbed = true; return [1000]; },
    (s) => { s.deps.qualityProbeStartMs = 1000; return [1003]; },
    (s) => { s.deps.qualityProbeStartMs = 992; return [1000]; },
    (s) => { s.deps.recentFrameMsSamplesCurrent.push(...Array(24).fill(7)); s.deps.qualityProbeStartMs = 990; return [1000]; },
    (s) => { s.deps.previewQualityReady = true; return [1000]; },
    (s) => { s.deps.previewOrbitLocked = false; return [1000]; },
    (s) => { s.deps.previewOrbitLocked = false; s.deps.isStageEmbed = true; s.deps.isStageWarmup = true; return [1000]; },
    (s) => { s.deps.enabledVisibleLights = () => []; return [1000]; },
    (s) => { s.deps.stageSession = true; return [1000]; },
  ], { mutate: (b) => b.replace('frameIntervalMs >= 8 && (frameIntervalMs <= 120', 'frameIntervalMs >= 9 && (frameIntervalMs <= 120') }));

  return out;
}

async function main() {
  const results = [
    testAddCeilingMeshes(), testInstanceMerge(), testBoundsCenter(), testResolvePlanSnap(),
    ...(await Promise.all(testR15aPure())),
    ...(await Promise.all(testR15bStructural())),
    ...(await Promise.all(testR16aStructural())),
    ...(await Promise.all(testInstanceBatches())),
    ...(await Promise.all(testR17ePure())),
    await testPrecompileRetry(),
  ];
  let total = 0, bad = 0, broken = 0, vacuous = 0;
  for (const r of results) {
    total += r.n; bad += r.diff;
    if (!r.mutation) broken++;
    if (r.allVacuous) vacuous++;
    console.log(`${r.diff ? 'FAIL' : 'ok  '}  ${r.name}: ${r.n} comparisons, ${r.diff} differences`
      + (r.vacuous ? `, ${r.vacuous} vacuous` : ''));
  }
  console.log(`\n${total} comparisons, ${bad} differences; mutation harness: ${broken ? 'BROKEN' : 'sensitive'}`
    + (vacuous ? `; ${vacuous} all-vacuous test(s)` : ''));
  process.exit(bad || broken || vacuous ? 1 : 0);
}

main();
