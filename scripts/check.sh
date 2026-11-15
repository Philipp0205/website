#!/usr/bin/env bash
# Gate for the site: install, type/content check, build, internal link check, browser smoke.
# Stops at the first failing step, prints that step's last 30 lines, exits non-zero.
set -u
cd "$(dirname "$0")/.."

LOG_DIR="$(mktemp -d)"
trap 'rm -rf "$LOG_DIR"' EXIT

step() {
  local name="$1"
  shift
  local log="$LOG_DIR/${name// /_}.log"
  if "$@" >"$log" 2>&1; then
    echo "ok $name"
  else
    echo "FAIL $name"
    echo "--- last 30 lines of '$name' ---"
    tail -n 30 "$log"
    exit 1
  fi
}

step "npm ci" npm ci
step "astro check" npx astro check
step "astro build" npx astro build
step "link check" node scripts/check-links.mjs
step "playwright smoke" npx playwright test

echo "all checks passed"
