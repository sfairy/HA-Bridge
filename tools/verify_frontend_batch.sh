#!/usr/bin/env bash
#
# Verify one semantic-rename batch.
#
# Compares the working tree against HEAD, which is exactly "what this batch
# changed" as long as every batch is committed once it passes.  Both trees are
# therefore always available without managing snapshot directories by hand.
#
# Checks, in increasing cost:
#
#   1. every JavaScript file parses
#   2. alpha-equivalence   - the batch only renamed bindings, token stream equal
#   3. public API          - no exported name and no import specifier changed
#   4. module graph        - every import specifier still resolves
#   5. string fidelity     - no string lost versus the original obfuscated source
#   6. the full suite      - tools/verify_all.sh, all checks
#
# Usage:
#   tools/verify_frontend_batch.sh            # verify the current working tree
#   tools/verify_frontend_batch.sh --quick    # skip check 6 (the full suite)
#
# Exit status is non-zero if any check fails.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

quick=0
[ "${1:-}" = "--quick" ] && quick=1

pass=0
fail=0
section() { printf '\n\033[1m== %s\033[0m\n' "$1"; }
ok()   { printf '  \033[32mPASS\033[0m %s\n' "$1"; pass=$((pass + 1)); }
bad()  { printf '  \033[31mFAIL\033[0m %s\n' "$1"; fail=$((fail + 1)); }

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "not a git work tree: the batch comparison needs HEAD" >&2
  exit 2
fi

BASELINE="$(mktemp -d)"
trap 'rm -rf "$BASELINE"' EXIT
git archive HEAD frontend | tar -x -C "$BASELINE"
if [ ! -d "$BASELINE/frontend" ]; then
  echo "HEAD has no frontend/ tree; commit the current state first" >&2
  exit 2
fi

echo "baseline: HEAD ($(git rev-parse --short HEAD)) -> $BASELINE/frontend"

section "1. JavaScript syntax"
js_fail=0
js_total=0
while IFS= read -r file; do
  js_total=$((js_total + 1))
  node --check "$file" >/dev/null 2>&1 || { echo "  $file"; js_fail=$((js_fail + 1)); }
done < <(find frontend -name '*.js' -type f)
if [ "$js_fail" = "0" ]; then
  ok "$js_total file(s) parse"
else
  bad "$js_fail/$js_total file(s) failed to parse"
fi

section "2. Alpha-equivalence (rename only changed binding names)"
if out=$(node tools/verify_frontend_rename.mjs "$BASELINE/frontend" frontend 2>&1) \
  && echo "$out" | rg -q "mismatched=0"; then
  ok "$(echo "$out" | rg '^# byte-identical')"
else
  bad "not alpha-equivalent - something other than a rename changed"
  echo "$out" | rg 'MISMATCH|MISSING|EXTRA|PARSEFAIL|#' | head -20
fi

section "3. Public API (exported names and import specifiers)"
if out=$(node tools/verify_frontend_public_api.mjs "$BASELINE/frontend" frontend 2>&1) \
  && echo "$out" | rg -q "changed=0"; then
  ok "$(echo "$out" | rg '^# unchanged')"
else
  bad "public API changed - consumers would break"
  echo "$out" | rg 'CHANGED|MISSING|EXTRA|-export|\+export|#' | head -20
fi

section "4. Module graph"
if out=$(node tools/verify_frontend_imports.mjs 2>&1) && echo "$out" | rg -q "unresolved=0"; then
  ok "$(echo "$out" | rg '^# scanned')"
else
  bad "unresolved module imports"
  echo "$out" | rg 'UNRESOLVED|BARE|#' | head -20
fi

section "5. String fidelity versus the original obfuscated source"
if out=$(node tools/verify_frontend_strings.mjs 2>&1) && echo "$out" | rg -q "lost-strings=0"; then
  ok "$(echo "$out" | rg '^# checked')"
else
  bad "string content lost"
  echo "$out" | rg 'LOST|MISSING|checked=' | head -20
fi

if [ "$quick" = "0" ]; then
  section "6. Full suite (tools/verify_all.sh)"
  if out=$(bash tools/verify_all.sh 2>&1) && echo "$out" | rg -q "all checks passed"; then
    ok "$(echo "$out" | rg 'checks passed' | tr -d ' ')"
  else
    bad "full suite failed"
    echo "$out" | rg 'FAIL|checks failed' | head -20
  fi
fi

printf '\n\033[1m== batch summary\033[0m\n'
printf '  passed: %d\n  failed: %d\n' "$pass" "$fail"
[ "$fail" = "0" ] || exit 1
printf '  \033[32mbatch verified\033[0m\n'
