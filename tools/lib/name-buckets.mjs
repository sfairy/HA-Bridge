/**
 * Name buckets shared by the semantic-renaming tooling.
 *
 * Three tools need to answer "is this identifier mechanical residue, a short
 * leftover, or meaningful?" - `report_frontend_names.mjs` (progress + gate),
 * `apply_frontend_renames.mjs` (refuse to rename meaningful names) and
 * `plan_frontend_rename_ranges.mjs` (balance ranges by residue).  They used to
 * carry three hand-copied regexes, and the copies drifted: the whitelist below
 * was 15 prefixes while the pass that produced the names can emit many more.
 *
 * ## Why the prefix list is a whitelist and not a shape rule
 *
 * `rename_frontend_locals.mjs` derives a role prefix with
 * `toCamelCase(callee.name)`, so `new WeakMap()` became `weakMap1` and
 * `new IntersectionObserver()` became `intersectionObserver1`: the prefix set
 * is open ended.  The obvious fix - treat every `<lowercase word><digits>` as
 * residue - is wrong, because real code contains meaningful names of that exact
 * shape:
 *
 *   - `sha256`    an *exported* hash function, i.e. frozen public API;
 *   - `alignTo16` a helper whose `16` is part of its meaning
 *                 (`Math.max(16, Math.ceil(size / 16) * 16)`).
 *
 * Shape cannot separate `date1` (residue from `new Date`) from `alignTo16`, so
 * the classifier stays an explicit list of prefixes the pass can emit.  The list
 * is complete *by measurement*, not by guess: the pass has already run over the
 * whole frontend, so enumerating its output enumerates its vocabulary.  It was
 * derived by listing every binding that falls in the semantic bucket yet matches
 * the role+counter shape, and grouping by prefix - 25 prefixes, of which 23 were
 * residue and 2 (`sha` -> `sha256`, `alignTo` -> `alignTo16`) were the false
 * positives above.
 *
 * If a future run of the pass introduces new prefixes, re-derive the list the
 * same way instead of widening the shape rule.
 */

/**
 * Role prefixes emitted by `rename_frontend_locals.mjs`.
 *
 * Group 1 is the fixed vocabulary derived from the declaration shape
 * (function/list/object/string/...).  Group 2 is the `toCamelCase(callee.name)`
 * output, observed across `frontend/**` and sorted by frequency.
 */
export const ROLE_PREFIXES = [
  // 1. derived from the declaration shape by `roleForBinding`
  'value',
  'fn',
  'arg',
  'error',
  'element',
  'object',
  'text',
  'map',
  'set',
  'list',
  'keys',
  'values',
  'entries',
  'ClassName',
  // 2. derived from a callee or constructor name by `toCamelCase`
  'weakMap', // new WeakMap()
  'uint8Array', // new Uint8Array()
  'resizeObserver', // new ResizeObserver()
  'float32Array', // new Float32Array()
  'abortController', // new AbortController()
  'uRLSearchParams', // new URLSearchParams()  (see note below)
  'date', // new Date()
  'image', // new Image()
  'uRL', // new URL()
  'dataView', // new DataView()
  'uint32Array', // new Uint32Array()
  'hc', // short callee name
  'promise', // Promise.resolve()
  'roundedBoxGeometry', // new RoundedBoxGeometry()
  'weakSet', // new WeakSet()
  'formData', // new FormData()
  'uint8ClampedArray', // new Uint8ClampedArray()
  'int32Array', // new Int32Array()
  'orbitControls', // new OrbitControls()
  'blob', // new Blob()
  'float64Array', // new Float64Array()
  'option', // new Option()
  'webSocket', // new WebSocket()
];

// Note the `uRL` / `uRLSearchParams` casing: `toCamelCase` lowercases only the
// first character, so `URL` became `uRL`.  Those names are ugly, but they are
// the pass's *output* and are exactly what the renaming batches are here to
// replace - which is why they must be classified as residue, not as semantic.

/** `<role><counter>`, e.g. `value1234`, `weakMap1`. */
export const MECHANICAL_RE = new RegExp(`^(?:${ROLE_PREFIXES.join('|')})\\d+$`);

/** One- and two-character bindings, the other thing the passes left behind. */
export const SHORT_RE = /^[A-Za-z_$][A-Za-z0-9_$]?$/;

/**
 * Classify a binding name.
 *
 * @param {string} name
 * @returns {'mechanical' | 'short' | 'semantic'}
 */
export function classifyName(name) {
  if (MECHANICAL_RE.test(name)) return 'mechanical';
  if (SHORT_RE.test(name)) return 'short';
  return 'semantic';
}
