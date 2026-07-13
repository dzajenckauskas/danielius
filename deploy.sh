#!/bin/bash
set -euo pipefail

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22 >/dev/null

REPO_DIR="/var/www/danielius"
PM2_BIN="/root/.nvm/versions/node/v18.18.0/bin/pm2"

if [ ! -x "$PM2_BIN" ]; then
  PM2_BIN="$(command -v pm2)"
fi

if [ -z "${PM2_BIN:-}" ] || [ ! -x "$PM2_BIN" ]; then
  echo "PM2 binary not found" >&2
  exit 1
fi

cd "$REPO_DIR"

echo "→ Pulling latest code..."
git fetch origin main
git reset --hard origin/main

echo "→ Installing dependencies..."
npm install

echo "→ Building..."
npm run build

echo "→ Restarting service..."
if "$PM2_BIN" describe danielius >/dev/null 2>&1; then
  "$PM2_BIN" restart danielius
else
  "$PM2_BIN" start npm --name "danielius" --cwd "$REPO_DIR" -- run start
fi
"$PM2_BIN" save

echo "✓ Deploy complete"
