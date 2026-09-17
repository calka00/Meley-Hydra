#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are required. Install with:"
  echo "sudo apt update && sudo apt install -y nodejs npm"
  exit 1
fi

if [ ! -x "$ROOT_DIR/node_modules/.bin/vite" ]; then
  echo "Installing project dependencies..."
  npm ci
fi

echo "Building tracker..."
npm run build

echo "Tracker available on port 4173"
echo "Local: http://127.0.0.1:4173"
echo "LAN:   http://<DEBIAN-IP>:4173"
echo "Stop with Ctrl+C"

exec "$ROOT_DIR/node_modules/.bin/vite" preview --host 0.0.0.0 --port 4173
