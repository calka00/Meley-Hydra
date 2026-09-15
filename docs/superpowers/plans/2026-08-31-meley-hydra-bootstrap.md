# Meley-Hydra Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Download Meley-Hydra, produce its Vite production build, and provide Windows launcher for served build output.

**Architecture:** Initialize Git in current workspace because approved design documentation already makes directory non-empty, then fetch and check out upstream `master` into root. Use upstream npm scripts for dependency installation, tests, and production build. `start.bat` validates `dist/index.html`, then invokes locally installed Vite preview server and opens browser.

**Tech Stack:** Git, Node.js/npm, Vite, React, Windows batch.

## Global Constraints

- Upstream: `https://github.com/calka00/Meley-Hydra.git`, branch `master`.
- Workspace: `C:\Users\Kacper\Desktop\hydra`.
- Use lockfile-respecting `npm ci`.
- Use `npm test` then `npm run build`.
- `start.bat` must run production artifact through local Vite, not source development server.

---

### Task 1: Fetch upstream repository into workspace root

**Files:**
- Create: Git metadata under `.git/`
- Create: upstream tracked project files, including `package.json`, `vite.config.js`, and `src/`

**Interfaces:**
- Consumes: remote `https://github.com/calka00/Meley-Hydra.git`, branch `master`
- Produces: Git worktree rooted at `C:\Users\Kacper\Desktop\hydra`

- [ ] **Step 1: Initialize repository and register upstream remote**

Run:

```powershell
git init
git remote add origin https://github.com/calka00/Meley-Hydra.git
```

Expected: Git creates `.git` and accepts remote named `origin`.

- [ ] **Step 2: Fetch upstream master and check it out**

Run:

```powershell
git fetch --depth=1 origin master
git checkout -B master FETCH_HEAD
git status --short
```

Expected: checkout creates upstream files; `docs/superpowers/` may remain untracked because it was created before checkout.

- [ ] **Step 3: Confirm checkout identity**

Run:

```powershell
git remote get-url origin
git branch --show-current
```

Expected:

```text
https://github.com/calka00/Meley-Hydra.git
master
```

### Task 2: Install, test, and build upstream Vite app

**Files:**
- Create: `node_modules/`
- Create: `dist/index.html` and Vite build assets under `dist/assets/`

**Interfaces:**
- Consumes: `package-lock.json`, scripts `test` and `build` in `package.json`
- Produces: tested, production-ready `dist/` directory

- [ ] **Step 1: Install locked npm dependencies**

Run:

```powershell
npm ci
```

Expected: npm finishes with exit code `0` and creates `node_modules/`.

- [ ] **Step 2: Run upstream tests**

Run:

```powershell
npm test
```

Expected: Vitest exits with code `0`.

- [ ] **Step 3: Build production artifact**

Run:

```powershell
npm run build
Test-Path -LiteralPath "dist\index.html"
```

Expected: Vite writes `dist/`; final command prints `True`.

### Task 3: Add Windows production launcher

**Files:**
- Create: `start.bat`

**Interfaces:**
- Consumes: `%~dp0dist\index.html`, `%~dp0node_modules\.bin\vite.cmd`
- Produces: Vite preview server bound to `127.0.0.1` and browser window

- [ ] **Step 1: Create launcher**

Create `start.bat` with:

```bat
@echo off
setlocal
set "ROOT=%~dp0"

if not exist "%ROOT%dist\index.html" (
  echo Build not found. Run: npm run build
  exit /b 1
)

if not exist "%ROOT%node_modules\.bin\vite.cmd" (
  echo Dependencies not found. Run: npm ci
  exit /b 1
)

call "%ROOT%node_modules\.bin\vite.cmd" preview --host 127.0.0.1 --open
exit /b %ERRORLEVEL%
```

- [ ] **Step 2: Verify missing-build failure path**

Run:

```powershell
Rename-Item -LiteralPath "dist" -NewName "dist.verify-hidden"
cmd /c start.bat
$exitCode = $LASTEXITCODE
Rename-Item -LiteralPath "dist.verify-hidden" -NewName "dist"
if ($exitCode -ne 1) { throw "Expected start.bat to exit 1, got $exitCode" }
```

Expected: launcher prints `Build not found. Run: npm run build` and exits `1`; `dist/` is restored.

- [ ] **Step 3: Verify production server starts**

Run:

```powershell
cmd /c start.bat
```

Expected: Vite reports `Local: http://127.0.0.1:4173/` and opens default browser. Stop process with `Ctrl+C` after browser loads.
