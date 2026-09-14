#!/usr/bin/env bash
# Syntax-check first-party JavaScript (excludes vendor).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

failed=0
checked=0

while IFS= read -r -d '' file; do
  checked=$((checked + 1))
  if ! node --check "$file" >/dev/null 2>&1; then
    echo "FAIL: $file"
    node --check "$file" || true
    failed=$((failed + 1))
  fi
done < <(find frontend -type f -name '*.js' ! -path '*/vendor/*' -print0 | sort -z)

if [[ "$failed" -gt 0 ]]; then
  echo "check-js: $failed/$checked files failed syntax check"
  exit 1
fi

echo "check-js: $checked files OK"
