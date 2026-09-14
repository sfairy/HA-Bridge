#!/usr/bin/env bash
# Guard suite for the 3D Studio front-end refactors (decomposition + junk-name cleanup).
#
#   ./scripts/check-guards.sh
#
# Every guard here is deterministic and runs offline. The junk-name ratchet is
# lowered by hand as functions get cleaned; if a change pushes the count back up
# above the recorded baseline, this script fails.
#
# Two of the guards are *round-scoped*: they compare the working tree against a
# pre-rename snapshot (`scripts/.snapshots/studio-app.r10.js`, gitignored) rather
# than against git, because the mesh builders they cover only exist after the W7
# decomposition. When that snapshot is absent they are reported as skipped, never
# as passed. Everything else runs unconditionally.
set -euo pipefail
cd "$(dirname "$0")/.."

PY="${PY:-./.venv/bin/python}"
[ -x "$PY" ] || PY=python3

# Ratchet baseline: 2641 at the start of the cleanup, 354 after R18j, 0 since R19i.
# It is now a hard floor: any new `argPrimary` / `localValue` / `x42` style placeholder
# fails the guard, so the readability debt cannot creep back in.
JUNK_BASELINE=0
STUDIO=frontend/static/3d-studio/studio-app.js
SNAPSHOT=scripts/.snapshots/studio-app.r10.js

echo "== junk-name ratchet (<= ${JUNK_BASELINE}) =="
"$PY" scripts/outline-junk-names.py "$STUDIO" --fail-over "$JUNK_BASELINE"

echo "== rename tool self-test =="
"$PY" scripts/rename-junk.py --selftest

echo "== outline tool self-test =="
# The outline tool reads the same kind of source as the renamer, so it needs the same
# regex-literal-aware masker. Without it a regex like /[<>:"/\\|?*]/g left a stray quote
# that swallowed real code, and `sanitizeExportFileName` was reported as 1266 lines long.
"$PY" scripts/outline-js-function.py --selftest

echo "== rename plans: no leftover references =="
# --audit catches an old name still used *inside* the renamed region, --audit-spill one
# still used after it (a use the rename missed would silently rebind to an outer scope:
# exactly the `list.filter(...)` bug that stopped drawing accents). Both run over every
# plan in one process so the 20k-line source is masked only once.
"$PY" scripts/rename-junk.py "$STUDIO" --audit-dir scripts/junk-plans
echo "no leftover references in $(ls scripts/junk-plans/plan-*.json | wc -l | tr -d ' ') plans"

echo "== JS syntax (all files) =="
node scripts/check-js.mjs

echo "== mesh-group delegation shape =="
node scripts/check-studio3d-mesh-groups.mjs

echo "== differential: rename batches (HEAD vs working tree) =="
node scripts/diff-rename-batch.mjs | tail -6

if [ -f "$SNAPSHOT" ]; then
  echo "== differential: mesh builders (vs pre-rename snapshot) =="
  node scripts/diff-mesh-builders.mjs | tail -3

  echo "== differential: wall corner caps =="
  node scripts/diff-wallcornercaps.mjs | tail -2
else
  echo "!! SKIPPED  mesh builders + wall corner caps: $SNAPSHOT is missing."
  echo "!!          These are round-scoped; they cannot be rebuilt from git."
fi

echo
echo "all guards passed"
