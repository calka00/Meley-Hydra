# Debian Local Launcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an executable Debian script that installs local dependencies, builds the tracker, and serves it on the PVE LAN.

**Architecture:** `start.sh` resolves its own directory, validates Node/npm, installs dependencies only when Vite is absent, builds `dist`, prints access URLs, and launches Vite preview bound to all interfaces.

**Tech Stack:** POSIX shell, Node.js/npm, Vite.

## Global Constraints

- Server bind address: `0.0.0.0`.
- Server port: `4173`.
- Do not alter firewall or install global packages.
- Use project-local `node_modules/.bin/vite`.

---

### Task 1: Add Debian launcher

**Files:**
- Create: `start.sh`

**Interfaces:**
- Consumes: `package.json`, `package-lock.json`, local project directory.
- Produces: built `dist/` and Vite preview at `http://0.0.0.0:4173`.

- [ ] **Step 1: Create launcher**

Create `start.sh`:

```sh
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
```

- [ ] **Step 2: Mark script executable**

Run on Debian:

```sh
chmod +x start.sh
```

- [ ] **Step 3: Verify shell syntax**

Run:

```sh
bash -n start.sh
```

Expected: exit code `0` and no output.

### Task 2: Verify build and server behavior

**Files:**
- Test: `start.sh`

**Interfaces:**
- Consumes: launcher from Task 1.
- Produces: HTTP response from Vite preview on port `4173`.

- [ ] **Step 1: Run existing tests and build**

Run:

```sh
npm test
npm run build
```

Expected: all tests pass and `dist/index.html` exists.

- [ ] **Step 2: Start launcher**

Run:

```sh
./start.sh
```

Expected: terminal prints LAN URL and Vite reports port `4173`.

- [ ] **Step 3: Verify HTTP response from another machine**

Run from a LAN client:

```sh
curl -I http://DEBIAN_IP:4173
```

Expected: HTTP `200` response. Stop server with `Ctrl+C`.
