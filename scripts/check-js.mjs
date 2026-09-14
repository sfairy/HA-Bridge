#!/usr/bin/env node
// Recursively syntax-check every non-vendor JavaScript file under the given roots.
// Usage: node scripts/check-js.mjs [root ...]   (defaults to frontend and register)
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

const SKIP_DIRS = new Set(['node_modules', 'vendor', '.git', 'dist', 'build']);
const roots = process.argv.slice(2);
if (roots.length === 0) {
  roots.push('frontend', 'register');
}

const files = [];
function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(join(dir, entry.name));
    }
  }
}

for (const root of roots) {
  try {
    if (statSync(root).isDirectory()) walk(root);
  } catch {
    console.error(`check-js: skipped missing path ${root}`);
  }
}

let failed = 0;
for (const file of files.sort()) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (error) {
    failed += 1;
    console.error(`SYNTAX FAIL: ${relative(process.cwd(), file)}`);
    const stderr = error.stderr?.toString().trim();
    if (stderr) console.error(stderr);
  }
}

if (failed > 0) {
  console.error(`check-js: ${failed} of ${files.length} files failed to parse.`);
  process.exit(1);
}
console.log(`check-js: ${files.length} files parsed OK.`);
