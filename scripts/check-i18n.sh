#!/usr/bin/env bash
# Fails if any key in messages/en.json is missing in fr/ar/nl.
set -euo pipefail

DIR="messages"
if [ ! -f "$DIR/en.json" ]; then
  echo "check-i18n: no $DIR/en.json, skipping"
  exit 0
fi

node - <<'NODE'
const fs = require('fs');
const path = require('path');

function flatten(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flatten(v, key));
    } else {
      out.push(key);
    }
  }
  return out;
}

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const enKeys = new Set(flatten(en));
const locales = ['fr', 'ar', 'nl'];
let fail = false;

for (const loc of locales) {
  const file = `messages/${loc}.json`;
  if (!fs.existsSync(file)) {
    console.error(`check-i18n: missing ${file}`);
    fail = true;
    continue;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const keys = new Set(flatten(data));
  for (const k of enKeys) {
    if (!keys.has(k)) {
      console.error(`check-i18n: ${file} is missing key '${k}'`);
      fail = true;
    }
  }
}

if (fail) {
  console.error('check-i18n: FAILED');
  process.exit(1);
}
console.log('check-i18n: OK');
NODE
