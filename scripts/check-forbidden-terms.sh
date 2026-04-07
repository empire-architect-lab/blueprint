#!/usr/bin/env bash
# Fails on console.log, @ts-ignore, TODO:, FIXME: outside test files.
set -euo pipefail

if [ ! -d src ]; then
  echo "check-forbidden-terms: no src/ directory, skipping"
  exit 0
fi

patterns=(
  'console\.log'
  '@ts-ignore'
  'TODO:'
  'FIXME:'
)

fail=0
for pat in "${patterns[@]}"; do
  matches=$(grep -RInE "$pat" src \
    --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
    --exclude='*.test.*' --exclude='*.spec.*' \
    --exclude-dir='__tests__' --exclude-dir='e2e' || true)
  if [ -n "$matches" ]; then
    echo "check-forbidden-terms: forbidden pattern '$pat':"
    echo "$matches"
    fail=1
  fi
done

if [ $fail -ne 0 ]; then
  echo "check-forbidden-terms: FAILED"
  exit 1
fi
echo "check-forbidden-terms: OK"
