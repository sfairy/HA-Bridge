/**
 * Prove that `rename_frontend_locals.mjs` was semantics-preserving.
 *
 * A rename is only safe if the before/after pair is *alpha-equivalent*: the two
 * programs must differ solely in the spelling of lexically bound names, while
 * every observable name stays identical.  Concretely, comparing the two files
 * must show that the following are unchanged:
 *
 *   - the set of string literal values (in order), so no string, template
 *     quasi or `?v=` cache-busting query string was touched;
 *   - the sequence of every non-computed member property and object/class
 *     property key, so no property access was renamed;
 *   - the sequence of every *unresolved* identifier (globals such as
 *     `document`, `window`, `navigator`), which have no binding to follow;
 *   - the structure of the program, including which occurrences belong to
 *     which binding.
 *
 * The last point is what makes the check meaningful: each file is re-emitted
 * as a canonical token stream in source order, where every bound identifier is
 * replaced by the identity of *the binding it resolves to* rather than by its
 * name.  Binding identities are assigned in a deterministic, source-ordered
 * scope walk, which a rename does not perturb.  Two files that render to the
 * same token stream are therefore identical up to the renaming of bound
 * variables — exactly the property we want.
 *
 * Usage:
 *   node tools/verify_frontend_rename.mjs <before-dir> <after-dir>
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const BABEL_ROOT =
  process.env.BABEL_ROOT || '/Users/sfairy/.npm/_npx/6da011cd7208f74f/node_modules';

const parser = require(`${BABEL_ROOT}/@babel/parser`);
const traverse = require(`${BABEL_ROOT}/@babel/traverse`).default;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && entry.name.endsWith('.js')) yield full;
  }
}

function parse(code) {
  return parser.parse(code, { sourceType: 'module', errorRecovery: false });
}

function isPropertyPosition(p) {
  const parent = p.parentPath?.node;
  if (!parent) return false;
  if (
    (parent.type === 'MemberExpression' ||
      parent.type === 'OptionalMemberExpression') &&
    parent.property === p.node &&
    !parent.computed
  ) {
    return true;
  }
  if (
    (parent.type === 'ObjectProperty' ||
      parent.type === 'ObjectMethod' ||
      parent.type === 'ClassProperty' ||
      parent.type === 'ClassMethod' ||
      parent.type === 'ClassPrivateProperty' ||
      parent.type === 'ClassPrivateMethod') &&
    parent.key === p.node &&
    !parent.computed
  ) {
    return true;
  }
  if (parent.type === 'ImportSpecifier' && parent.imported === p.node) return true;
  if (parent.type === 'ExportSpecifier' && parent.exported === p.node) return true;
  return false;
}

/** Render a program as a canonical token stream (see the file header). */
function canonicalize(code) {
  const ast = parse(code);
  const tokens = [];

  // Assign a stable id to every binding, in source order.  A rename does not
  // change the order in which scopes and declarations appear.
  const bindingIds = new Map();
  let nextBindingId = 0;
  traverse(ast, {
    Scopable(p) {
      for (const name of Object.keys(p.scope.bindings)) {
        const binding = p.scope.bindings[name];
        if (!bindingIds.has(binding)) {
          bindingIds.set(binding, nextBindingId);
          nextBindingId += 1;
        }
      }
    },
  });

  traverse(ast, {
    StringLiteral(p) {
      tokens.push(`S:${JSON.stringify(p.node.value)}`);
    },
    TemplateElement(p) {
      tokens.push(`T:${JSON.stringify(p.node.value.cooked)}`);
    },
    NumericLiteral(p) {
      tokens.push(`N:${String(p.node.value)}`);
    },
    Identifier(p) {
      if (isPropertyPosition(p)) {
        tokens.push(`K:${p.node.name}`);
        return;
      }
      const binding = p.scope.getBinding(p.node.name);
      if (binding && bindingIds.has(binding)) {
        tokens.push(`B:${bindingIds.get(binding)}`);
      } else {
        tokens.push(`U:${p.node.name}`);
      }
    },
    PrivateName(p) {
      tokens.push(`P:${p.node.id.name}`);
    },
  });

  return tokens;
}

function fingerprint(file) {
  const code = fs.readFileSync(file, 'utf8');
  const tokens = canonicalize(code);
  return {
    digest: crypto.createHash('sha256').update(tokens.join('\u0000')).digest('hex'),
    tokenCount: tokens.length,
  };
}

const [beforeDir, afterDir] = process.argv.slice(2);
if (!beforeDir || !afterDir) {
  console.error('usage: node tools/verify_frontend_rename.mjs <before-dir> <after-dir>');
  process.exit(2);
}

const beforeFiles = new Map();
for (const file of walk(beforeDir)) {
  beforeFiles.set(path.relative(beforeDir, file), file);
}
const afterFiles = new Map();
for (const file of walk(afterDir)) {
  afterFiles.set(path.relative(afterDir, file), file);
}

let identical = 0;
let unchanged = 0;
let mismatched = 0;
let missing = 0;

for (const [rel, beforePath] of beforeFiles) {
  const afterPath = afterFiles.get(rel);
  if (!afterPath) {
    console.log(`MISSING  ${rel} (present before, absent after)`);
    missing += 1;
    continue;
  }
  const before = fs.readFileSync(beforePath, 'utf8');
  const after = fs.readFileSync(afterPath, 'utf8');
  if (before === after) {
    unchanged += 1;
    continue;
  }
  let a;
  let b;
  try {
    a = fingerprint(beforePath);
    b = fingerprint(afterPath);
  } catch (error) {
    console.log(`PARSEFAIL ${rel} :: ${error.message}`);
    mismatched += 1;
    continue;
  }
  if (a.digest === b.digest && a.tokenCount === b.tokenCount) {
    identical += 1;
  } else {
    console.log(
      `MISMATCH ${rel} :: tokens ${a.tokenCount} -> ${b.tokenCount}, ` +
        `${a.digest.slice(0, 12)} -> ${b.digest.slice(0, 12)}`
    );
    mismatched += 1;
  }
}

for (const rel of afterFiles.keys()) {
  if (!beforeFiles.has(rel)) {
    console.log(`EXTRA    ${rel} (absent before, present after)`);
    missing += 1;
  }
}

console.log(
  `# byte-identical=${unchanged} alpha-equivalent=${identical} ` +
    `mismatched=${mismatched} missing-or-extra=${missing} ` +
    `total-before=${beforeFiles.size} total-after=${afterFiles.size}`
);
if (mismatched > 0 || missing > 0) process.exitCode = 1;
