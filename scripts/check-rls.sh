#!/usr/bin/env bash
# Fails if any create table in supabase/migrations/*.sql is missing
# `enable row level security` and a policy referencing tenant_id.
set -euo pipefail

DIR="supabase/migrations"
if [ ! -d "$DIR" ]; then
  echo "check-rls: no $DIR directory, skipping"
  exit 0
fi

shopt -s nullglob
files=("$DIR"/*.sql)
if [ ${#files[@]} -eq 0 ]; then
  echo "check-rls: no .sql files in $DIR, skipping"
  exit 0
fi

fail=0
for file in "${files[@]}"; do
  # Extract table names from `create table <name>`
  tables=$(grep -iEo 'create table[[:space:]]+(if not exists[[:space:]]+)?[a-z_][a-z0-9_]*' "$file" | awk '{print $NF}' || true)
  for table in $tables; do
    if ! grep -iqE "alter table[[:space:]]+$table[[:space:]]+enable row level security" "$file"; then
      echo "check-rls: $file: table '$table' missing 'enable row level security'"
      fail=1
    fi
    if ! grep -iqE "create policy.*on[[:space:]]+$table" "$file"; then
      echo "check-rls: $file: table '$table' has no policies"
      fail=1
      continue
    fi
    # Verify at least one policy on this table references tenant_id
    if ! awk -v t="$table" '
      BEGIN{IGNORECASE=1; in_policy=0}
      /create policy/ && $0 ~ ("on[[:space:]]+" t "([^a-z0-9_]|$)") {in_policy=1}
      in_policy && /tenant_id/ {found=1}
      /;/ {in_policy=0}
      END{exit found?0:1}
    ' "$file"; then
      echo "check-rls: $file: table '$table' has no policy referencing tenant_id"
      fail=1
    fi
  done
done

if [ $fail -ne 0 ]; then
  echo "check-rls: FAILED"
  exit 1
fi
echo "check-rls: OK"
