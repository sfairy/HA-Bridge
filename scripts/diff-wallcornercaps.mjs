// Differential test for buildWallCornerCaps (R12), which needs a wide set of
// module-level helpers. We inject deterministic stubs for every free name, then
// replay a grid of light descriptors through both revisions and compare the
// objects handed to list.add plus the mutations made to them.
//
// Round-scoped: see the note in diff-mesh-builders.mjs about BASELINE.
import fs from 'node:fs';

const BASELINE = process.env.BASELINE || 'scripts/.snapshots/studio-app.r10.js';
const AFTER = process.argv[2] || 'frontend/static/3d-studio/studio-app.js';

if (!fs.existsSync(BASELINE)) {
  console.log(`SKIP  wall corner caps: baseline ${BASELINE} is missing.`);
  console.log('      This guard needs a pre-rename snapshot; it cannot be rebuilt from git.');
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
  if (idx < 0) throw new Error(`missing ${name}`);
  const brace = m.indexOf('{', idx);
  let depth = 0;
  for (let k = brace; k < m.length; k += 1) {
    if (m[k] === '{') depth += 1;
    else if (m[k] === '}') { depth -= 1; if (depth === 0) return src.slice(idx, k + 1); }
  }
  throw new Error(`unbalanced ${name}`);
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

function node(name, extra = {}) {
  return {
    name, position: { x: 0, y: 0, z: 0, set(x, y, z) { this.x = x; this.y = y; this.z = z; } },
    rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 },
    visible: true, castShadow: false, add() {}, layers: { enable() {}, set() {} },
    userData: {}, ...extra,
  };
}

class Group { constructor() { return node('Group'); } }
class Object3D { constructor() { return node('Object3D'); } }
class RectAreaLight { constructor(color, intensity, w, h) { return node('RectAreaLight', { color, intensity, width: w, height: h }); } }
class SpotLight {
  constructor(color, intensity, distance, angle, penumbra, decay) {
    return node('SpotLight', {
      color, intensity, distance, angle, penumbra, decay,
      target: null,
      shadow: { mapSize: { set() {}, width: 0, height: 0 }, camera: { near: 0, far: 0, layers: { set() {}, enable() {} } }, bias: 0, normalBias: 0, radius: 0, blurSamples: 0, autoUpdate: true, needsUpdate: false },
    });
  }
}
const THREE = { Group, Object3D, RectAreaLight, SpotLight, MathUtils: { degToRad: (d) => (d * Math.PI) / 180 } };

function makeDeps() {
  const list = { items: [], add(o) { this.items.push(o); } };
  const registered = [];
  const presets = {
    downlight: { brightness: 80, range: 5, angle: 60 },
    spotlight: { brightness: 70, range: 6, angle: 45 },
    ceilinglight: { brightness: 85, range: 5.5, angle: 70 },
    striplight: { brightness: 75, range: 4, angle: 90 },
  };
  return {
    list, registered,
    deps: {
      THREE,
      isStageEmbed: false,
      lightEffectColorHex: () => 0xffffff,
      kelvinToRgbHex: () => 0xffffff,
      isLightGroupVisible: () => true,
      finite: (v, d) => (Number.isFinite(v) ? v : d),
      stageSession: null,
      forcedVisibleLightGroupIds: null,
      isPreviewQualityReady: () => true,
      residentCacheMode: false,
      defaultLightPresets: presets,
      clamp: (v, a, b) => Math.min(Math.max(v, a), b),
      deferExternalModels: { striplight: 1.1, ceilinglight: 1.05, downlight: 1 },
      resolveLightGroup: () => ({ id: 'group-a' }),
      activeFloorId: 'f1',
      normalizeFullRotation: (v) => v,
      yt: false,
      studioReady: { register: (o, c) => registered.push([canon(o.name), c.id]) },
      HELPER_LAYER: 1,
      localSpotShadowSettings: () => ({ mapSize: 1024, normalBias: 0.02, radius: 2, blurSamples: 8 }),
      scaledShadowMapSize: (n) => n,
      shadowCameraExpanded: false,
      defaultItemDepth: () => 12,
      spotLightBrightnessResponse: (t, v) => v,
    },
  };
}

function run(src, bundle, args) {
  const body = extract(src, 'buildWallCornerCaps');
  const { list, registered, deps } = bundle;
  const keys = Object.keys(deps);
  const fn = new Function(...keys, `${body}\nreturn buildWallCornerCaps;`)(...keys.map((k) => deps[k]));
  fn(list, ...args.slice(1));
  return canon([list.items, registered]);
}

function makeCase(kind, yt, seed) {
  const types = ['striplight', 'ceilinglight', 'downlight', 'spotlight'];
  return {
    id: 'l' + seed, type: types[seed % types.length],
    lightTemperature: 2700 + seed * 300, lightBrightness: seed % 3 === 0 ? 0 : 20 + seed * 13,
    width: 0.4 + seed * 0.37, depth: 0.2 + seed * 0.23, lightRange: 1 + seed * 0.9,
    elevation: 1.2 + seed * 0.4, lightAngle: 20 + seed * 11,
    verticalRotation: seed * 37, stripRollRotation: seed * 53,
    kind, yt,
  };
}

const beforeSrc = fs.readFileSync(BASELINE, 'utf8');
const afterSrc = fs.readFileSync(AFTER, 'utf8');

let total = 0;
let bad = 0;
for (const isStageEmbed of [false, true]) {
  for (const forced of [null, new Set(['l2'])]) {
    for (const yt of [false, true]) {
      for (const pending of [null, new Set(['l1', 'l3'])]) {
        for (let seed = 0; seed < 12; seed += 1) {
          const color = makeCase('spot', yt, seed);
          const a = (() => {
            const bundle = makeDeps();
            bundle.deps.isStageEmbed = isStageEmbed;
            bundle.deps.forcedVisibleLightGroupIds = forced;
            bundle.deps.yt = yt;
            return run(beforeSrc, bundle, [bundle.list, color, pending]);
          })();
          const b = (() => {
            const bundle = makeDeps();
            bundle.deps.isStageEmbed = isStageEmbed;
            bundle.deps.forcedVisibleLightGroupIds = forced;
            bundle.deps.yt = yt;
            return run(afterSrc, bundle, [bundle.list, color, pending]);
          })();
          total += 1;
          if (JSON.stringify(a) !== JSON.stringify(b)) { bad += 1; if (bad === 1) console.log('first diff at', { isStageEmbed, forced: !!forced, yt, pending: !!pending, seed }); }
        }
      }
    }
  }
}
console.log(`buildWallCornerCaps: ${total} cases, ${bad} differences`);
process.exitCode = bad === 0 ? 0 : 1;
