// Differential test for the renamed mesh builders (rounds R10-R14).
// Extracts each builder from two revisions, stubs addBoxMesh/addSoftBoxMesh and
// the THREE primitives with recorders, and replays a grid of sizes through both.
// Any difference in the recorded calls or the post-call mutations is a change.
//
// Round-scoped: BEFORE must be a snapshot of the file as it was when the round
// began (the builders only exist after the W7 decomposition, so it cannot come
// from git). It lives in scripts/.snapshots/, which is gitignored; if it is
// gone this guard cannot run and says so instead of passing vacuously.
//
//   BASELINE=/tmp/x.js node scripts/diff-mesh-builders.mjs
import fs from 'node:fs';

const BASELINE = process.env.BASELINE || process.env.BEFORE || 'scripts/.snapshots/studio-app.r10.js';
const AFTER = process.env.AFTER || 'frontend/static/3d-studio/studio-app.js';

if (!fs.existsSync(BASELINE)) {
  console.log(`SKIP  mesh builders: baseline ${BASELINE} is missing.`);
  console.log('      This guard needs a pre-rename snapshot; it cannot be rebuilt from git.');
  console.log('      Recover it from a previous run or pass BASELINE=<file>.');
  process.exit(0);
}

function mask(s) {
  const a = s.split('');
  let i = 0;
  const n = s.length;
  while (i < n) {
    const c = s[i];
    if (c === '/' && s[i + 1] === '/') { let j = s.indexOf('\n', i); j = j < 0 ? n : j; for (let k = i; k < j; k += 1) a[k] = ' '; i = j; }
    else if (c === '/' && s[i + 1] === '*') { let j = s.indexOf('*/', i + 2); j = j < 0 ? n : j + 2; for (let k = i; k < j; k += 1) if (s[k] !== '\n') a[k] = ' '; i = j; }
    else if (c === '"' || c === "'" || c === '`') { const q = c; let j = i + 1; while (j < n) { if (s[j] === '\\') { j += 2; continue; } if (s[j] === q) break; j += 1; } for (let k = i + 1; k < Math.min(j, n); k += 1) if (s[k] !== '\n') a[k] = ' '; i = Math.min(j + 1, n); }
    else i += 1;
  }
  return a.join('');
}

function extract(src, name) {
  const m = mask(src);
  const idx = m.indexOf(`function ${name}(`);
  if (idx < 0) throw new Error(`missing function ${name}`);
  const brace = m.indexOf('{', idx);
  let depth = 0;
  for (let k = brace; k < m.length; k += 1) {
    if (m[k] === '{') depth += 1;
    else if (m[k] === '}') { depth -= 1; if (depth === 0) return src.slice(idx, k + 1); }
  }
  throw new Error(`unbalanced function ${name}`);
}

class Vector3 { constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; } }
class Curve { constructor(name, ...args) { this.kind = name; this.args = args; } }
class Geometry { constructor(name, ...args) { this.kind = name; this.args = args; } }
class Material { constructor(name, opts) { this.kind = name; this.opts = opts; } }
class Mesh {
  constructor(geometry, material) {
    this.kind = 'Mesh';
    this.geometry = geometry;
    this.material = material;
    this.castShadow = false;
    this.scale = { x: 1, y: 1, z: 1, set(x, y, z) { this.x = x; this.y = y; this.z = z; } };
    this.position = { x: 0, y: 0, z: 0, set(x, y, z) { this.x = x; this.y = y; this.z = z; } };
    this.rotation = { x: 0, y: 0, z: 0 };
    this.userData = {};
  }
}
const THREE_BASE = {
  DoubleSide: 2,
  Vector3,
  Mesh,
  MeshStandardMaterial: class extends Material { constructor(o) { super('MeshStandardMaterial', o); } },
  MeshPhysicalMaterial: class extends Material { constructor(o) { super('MeshPhysicalMaterial', o); } },
  MeshBasicMaterial: class extends Material { constructor(o) { super('MeshBasicMaterial', o); } },
  MathUtils: { degToRad: (d) => (d * Math.PI) / 180 },
};
// Every other primitive (geometries, curves, lights) is auto-stubbed: the
// recorded constructor name and arguments are what the diff compares.
const THREE = new Proxy(THREE_BASE, {
  get(target, key) {
    if (key in target) return target[key];
    if (typeof key !== 'string') return undefined;
    const Klass = class extends Geometry { constructor(...a) { super(key, ...a); } };
    Object.defineProperty(target, key, { value: Klass, configurable: true });
    return Klass;
  },
});

function makeGroup() {
  return { children: [], add(o) { this.children.push(o); return this; } };
}

function recorder() {
  const calls = [];
  const mesh = () => ({
    rotation: { x: 0, y: 0, z: 0 }, position: { set() {} }, userData: {},
    layers: { enable() {} }, shadow: { mapSize: { set() {} }, camera: {} },
  });
  const wrap = (fn) => (...args) => { const m = mesh(); calls.push({ fn, args, mesh: m }); return m; };
  return { calls, addBoxMesh: wrap('box'), addSoftBoxMesh: wrap('soft') };
}

function canon(v, seen = new Set()) {
  if (v === null || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'string') return typeof v === 'number' && !Number.isFinite(v) ? String(v) : v;
  if (typeof v === 'undefined') return '<undefined>';
  if (typeof v === 'function') return '<fn>';
  if (typeof v === 'object') {
    if (seen.has(v)) return '<cycle>';
    seen.add(v);
    const out = Array.isArray(v) ? v.map((x) => canon(x, seen))
      : Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k], seen)]));
    seen.delete(v);
    return out;
  }
  return String(v);
}

function build(body, name, deps) {
  const keys = Object.keys(deps);
  // eslint-disable-next-line no-new-func
  return new Function(...keys, `${body}\nreturn ${name};`)(...keys.map((k) => deps[k]));
}

const sizes = [];
for (const w of [0.4, 0.62, 0.9, 1.4, 2.2, 3.1]) {
  for (const d of [0.35, 0.55, 0.8, 1.1, 1.9]) {
    for (const h of [0.3, 0.5, 0.78, 1.2, 2.05, 2.6]) sizes.push([w, d, h]);
  }
}

const glassA = { glass: 0x88ccff, furnitureDark: 0x223344 };
const glassB = { furnitureDark: 0x223344, glass: 0x88ccff };

const cases = {
  buildGlassCabinetItemMeshGroup: (w, d, h) => [[w, d, h, glassA, 0xaabbcc, 0x101010, 0xffee88]],
  buildBookcaseItemMeshGroup: (w, d, h) => [[w, d, h, 0xaabbcc, 0x223344, 0x101010, 0xffee88]],
  buildShowerItemMeshGroup: (w, d, h) => [[w, d, h, 0xffee88]],
  buildBathtubItemMeshGroup: (w, d, h) => [[w, d, h, 0x101010, 0xffee88, 0x223344, glassB]],
  buildTeaBarMachineItemMeshGroup: (w, d, h) => [[w, d, h, 0xaabbcc, 0x223344, 0x101010]],
  buildTvItemMeshGroup: (w, d, h) => [
    [{ tvMountStyle: 'standard' }, w, d, h, 0x223344, 0x101010],
    [{ tvMountStyle: 'tabletop' }, w, d, h, 0x223344, 0x101010],
    [{ tvMountStyle: 'mobile' }, w, d, h, 0x223344, 0x101010],
    [{ tvMountStyle: 'unknown-style' }, w, d, h, 0x223344, 0x101010],
  ],
  buildVanityItemMeshGroup: (w, d, h) => [[w, d, h, 0xaabbcc, 0x223344, 0xffee88, glassA]],
  buildPlantItemMeshGroup: (w, d, h) => [[w, d, h, 0x88cc44, 0x224422]],
  buildFloorLampItemMeshGroup: (w, d, h) => [[w, d, h, 0x223344, 0xffee88]],
  buildWallLampItemMeshGroup: (w, d, h) => [[w, d, h, 0xffee88, glassA]],
  buildGasWaterHeaterItemMeshGroup: (w, d, h) => [[w, d, h, 0xaabbcc, 0x101010, 0x223344]],
  buildTvStandItemMeshGroup: (w, d, h) => [[w, d, h, 0xaabbcc, 0xffee88, 0x223344]],
  buildAirPurifierItemMeshGroup: (w, d, h) => [[w, d, h, 0xaabbcc, 0x223344, 0xffee88]],
  buildBasinItemMeshGroup: (w, d, h) => [[w, d, h, 0xaabbcc, 0xeeeeee, 0x101010, 0x223344, glassA]],
  buildStorageWaterHeaterItemMeshGroup: (w, d, h) => [[w, d, h, 0xaabbcc, 0x223344, 0x101010]],
};

const beforeSrc = fs.readFileSync(BASELINE, 'utf8');
const afterSrc = fs.readFileSync(AFTER, 'utf8');
const metricsSrc = extract(afterSrc, 'tvMountLayoutMetrics');
const metrics = build(metricsSrc, 'tvMountLayoutMetrics', {});

const cache = new Map();
function body(src, builder) {
  let byBuilder = cache.get(src);
  if (!byBuilder) { byBuilder = new Map(); cache.set(src, byBuilder); }
  if (!byBuilder.has(builder)) byBuilder.set(builder, extract(src, builder));
  return byBuilder.get(builder);
}

function run(src, builder, args) {
  const rec = recorder();
  const fn = build(body(src, builder), builder, {
    addBoxMesh: rec.addBoxMesh, addSoftBoxMesh: rec.addSoftBoxMesh, THREE, tvMountLayoutMetrics: metrics,
  });
  const group = makeGroup();
  fn(group, ...args);
  return canon({
    calls: rec.calls.map((c) => [c.fn, c.args, [c.mesh.rotation.x, c.mesh.rotation.y, c.mesh.rotation.z]]),
    children: group.children,
  });
}

let total = 0;
let bad = 0;
for (const builder of Object.keys(cases)) {
  let diffs = 0;
  let first = null;
  for (const [w, d, h] of sizes) {
    for (const args of cases[builder](w, d, h)) {
      total += 1;
      const a = JSON.stringify(run(beforeSrc, builder, args));
      const b = JSON.stringify(run(afterSrc, builder, args));
      if (a !== b) { diffs += 1; bad += 1; if (!first) first = { w, d, h }; }
    }
  }
  console.log(`${diffs === 0 ? 'ok  ' : 'DIFF'} ${builder}: ${sizes.length * cases[builder](1, 1, 1).length} cases, ${diffs} differences`);
  if (first) console.log('     first mismatch at size', JSON.stringify(first));
}

function mutate(src, builder, from, to) {
  const original = body(src, builder);
  const changed = original.replace(from, to);
  if (changed === original) throw new Error(`mutation did not apply to ${builder}: ${from}`);
  return src.replace(original, changed);
}

const bathtubArgs = cases.buildBathtubItemMeshGroup(1.2, 0.7, 0.6)[0];
const vanityArgs = cases.buildVanityItemMeshGroup(1.2, 0.7, 2.05)[0];
const sunkenBathtub = mutate(beforeSrc, 'buildBathtubItemMeshGroup', 'itemHeight * 0.84', 'itemHeight * 0.85');
const tallerVanity = mutate(beforeSrc, 'buildVanityItemMeshGroup', 'Math.min(0.76, itemHeight * 0.5)', 'Math.min(0.79, itemHeight * 0.5)');
const tubBase = JSON.stringify(run(beforeSrc, 'buildBathtubItemMeshGroup', bathtubArgs));
const tubMutated = JSON.stringify(run(sunkenBathtub, 'buildBathtubItemMeshGroup', bathtubArgs));
const vanityBase = JSON.stringify(run(beforeSrc, 'buildVanityItemMeshGroup', vanityArgs));
const vanityMutated = JSON.stringify(run(tallerVanity, 'buildVanityItemMeshGroup', vanityArgs));
const sensitive = tubBase !== tubMutated && vanityBase !== vanityMutated;
console.log(`\nmutation sensitivity: ${sensitive ? 'ok' : 'BROKEN'} `
  + `(bathtub ${tubBase !== tubMutated}, vanity ${vanityBase !== vanityMutated})`);
console.log(`total comparisons: ${total}, differences: ${bad}`);
process.exitCode = bad === 0 && sensitive ? 0 : 1;
