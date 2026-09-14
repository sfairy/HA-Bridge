#!/usr/bin/env node
// Structural guard for the incremental decomposition of buildStudioItemMeshGroup.
//
// The 3D Studio item meshes are built by one giant dispatcher that delegates a
// growing number of `type.type` branches to `build<X>ItemMeshGroup(...)` helpers.
// Hand-written edits in that area are easy to get subtly wrong, and a wrong
// argument does not fail loudly: it just produces shifted or NaN geometry.
//
// This script fails the build when:
//   1. a `build<X>ItemMeshGroup` helper is declared more than once (dead copy), or
//   2. a helper exists but is never called from the dispatcher (dead helper), or
//   3. a dispatcher call passes the wrong number of arguments, or
//   4. a dispatcher call passes an argument whose *kind* does not match the
//      parameter's name (e.g. a colour passed where `itemWidth` is expected).
//
// Usage: node scripts/check-studio3d-mesh-groups.mjs [path]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(process.argv[2] ?? resolve(here, "../frontend/static/3d-studio/studio-app.js"));
const source = readFileSync(target, "utf8");
const errors = [];
const rel = target.split("/").slice(-2).join("/");

// --- collect helper signatures -------------------------------------------
const DISPATCHER = "buildStudioItemMeshGroup";
const signatures = new Map();
for (const line of source.split("\n")) {
  const match = /^function (build\w+ItemMeshGroup)\(([^)]*)\)/.exec(line);
  if (!match) continue;
  const [, name, params] = match;
  if (name === DISPATCHER) continue; // the dispatcher is not one of its own helpers
  const list = params.split(",").map((p) => p.trim()).filter(Boolean);
  if (signatures.has(name)) {
    errors.push(`${name}: declared more than once (duplicate/dead definition)`);
  }
  signatures.set(name, list);
}
if (!/^function buildStudioItemMeshGroup\(/m.test(source)) {
  errors.push("buildStudioItemMeshGroup: dispatcher declaration not found");
}
if (signatures.size === 0) errors.push("no build<X>ItemMeshGroup helpers found");

// --- split a call's argument list on top-level commas ---------------------
function splitArguments(text) {
  const out = [];
  let depth = 0;
  let current = "";
  for (const ch of text) {
    if (ch === "(" || ch === "[") depth += 1;
    else if (ch === ")" || ch === "]") depth -= 1;
    if (ch === "," && depth === 0) {
      out.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current.trim());
  return out.filter((a) => a.length > 0);
}

// Parameter name -> the *kind* of value it must receive.
function expectedKind(param) {
  if (param === "group") return "group";
  if (param === "item") return "item";
  if (param === "itemWidth" || param === "itemDepth" || param === "itemHeight") return param;
  if (param.includes("olor") || param === "glassColors") return "color";
  return null; // free-form parameter, skip
}

// Expression -> the kind of value it actually is.
const COLORS = new Set(["furnitureItems", "furnitureDark", "furnitureLight", "color", "glass", "computedValue", "glassColors"]);
function actualKind(expr) {
  const text = expr.trim();
  if (text === "rotation" || text.startsWith("rotation.")) return "group";
  if (text === "type" || text.startsWith("type.")) return "item";
  if (text === "itemWidth" || text === "itemDepth" || text === "itemHeight") return text;
  if (COLORS.has(text) || text.startsWith("glass.")) return "color";
  return null;
}

// --- validate every dispatcher delegation ---------------------------------
const called = new Set();
let checked = 0;
for (const line of source.split("\n")) {
  const match = /^\s{4}(build\w+ItemMeshGroup)\((.*)\);\s*$/.exec(line);
  if (!match) continue;
  const [, name, argText] = match;
  const params = signatures.get(name);
  if (!params) {
    errors.push(`${name}: called but never declared`);
    continue;
  }
  called.add(name);
  checked += 1;
  const args = splitArguments(argText);
  if (params.length !== args.length) {
    errors.push(`${name}: ${params.length} parameter(s) but ${args.length} argument(s) -> ${args.join(", ")}`);
    continue;
  }
  params.forEach((param, i) => {
    const want = expectedKind(param);
    const got = actualKind(args[i]);
    if (want && got && want !== got) {
      errors.push(`${name}: argument #${i + 1} for '${param}' looks like a ${got} (${args[i].trim()})`);
    }
  });
}
for (const name of signatures.keys()) {
  if (!called.has(name)) errors.push(`${name}: declared but never called from the dispatcher`);
}

if (errors.length) {
  console.error(`check-studio3d-mesh-groups: ${errors.length} problem(s) in ${rel}`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`check-studio3d-mesh-groups: ${signatures.size} helpers, ${checked} delegations, all consistent.`);
