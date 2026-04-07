#!/usr/bin/env bash
# Fails if any .from( call in src/ is not followed by .eq('tenant_id'
# within 10 lines. Skips test files.
set -euo pipefail

if [ ! -d src ]; then
  echo "check-tenant-id: no src/ directory, skipping"
  exit 0
fi

fail=0
while IFS= read -r -d '' file; do
  case "$file" in
    *.test.*|*.spec.*|*/__tests__/*|*/e2e/*) continue ;;
  esac
  awk '
    /\.from\(["\x27][a-z_]/ {
      from_line = NR
      from_text = $0
      buf = $0
      lines_left = 10
      next_check = 1
      next
    }
    next_check && lines_left > 0 {
      buf = buf "\n" $0
      lines_left--
      if (/\.eq\(["\x27]tenant_id/) { next_check = 0 }
      else if (lines_left == 0) {
        print FILENAME ":" from_line ": .from() call missing .eq(\"tenant_id\", ...) within 10 lines"
        exit_code = 1
        next_check = 0
      }
    }
    END { exit exit_code+0 }
  ' "$file" || fail=1
done < <(find src -type f \( -name "*.ts" -o -name "*.tsx" \) -print0)

if [ $fail -ne 0 ]; then
  echo "check-tenant-id: FAILED"
  exit 1
fi
echo "check-tenant-id: OK"
