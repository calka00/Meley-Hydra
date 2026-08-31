# Metin2 Dungeon Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive local-only React dashboard for Hydra and Meley cooldowns, Hydra chest statistics, editable history, and JSON backup.

**Architecture:** Vite serves a single React page. Pure utility functions handle timer state transitions, statistics, validation, and serialization; `App` owns persisted state and passes focused data/actions to presentational components. Timers persist absolute timestamps in `localStorage`, so refreshes and background tab throttling do not corrupt countdowns.

**Tech Stack:** React, Vite, JavaScript, CSS, Vitest, Testing Library.

---

## File Map

- Create: `package.json` and `vite.config.js` for scripts and test configuration.
- Create: `index.html` and `src/main.jsx` for the Vite entry point.
- Create: `src/domain.js` for pure constants, state transitions, statistics, validation, and import/export helpers.
- Create: `src/domain.test.js` for domain tests.
- Create: `src/App.jsx` for persisted app state and dashboard composition.
- Create: `src/App.test.jsx` for dashboard interaction tests.
- Create: `src/components/DungeonCard.jsx` for reusable Hydra/Meley card framing.
- Create: `src/components/HydraCard.jsx` for Hydra timer and chest draft controls.
- Create: `src/components/MeleyCard.jsx` for Meley state machine controls.
- Create: `src/components/StatsPanel.jsx` for Hydra aggregate metrics.
- Create: `src/components/RunHistory.jsx` for editable and removable history rows.
- Create: `src/components/RunHistory.test.jsx` for history interaction tests.
- Create: `src/components/SettingsPanel.jsx` for JSON export/import and reset controls.
- Create: `src/components/SettingsPanel.test.jsx` for backup interaction tests.
- Create: `src/styles.css` for responsive visual design.
- Create: `.gitignore` for dependencies and generated build output.

### Task 1: Bootstrap Vite and test harness

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `.gitignore`

- [ ] **Step 1: Add package metadata and scripts**

```json
{
  "scripts": { "dev": "vite", "build": "vite build", "test": "vitest run" },
  "dependencies": { "@vitejs/plugin-react": "latest", "vite": "latest", "react": "latest", "react-dom": "latest" },
  "devDependencies": { "vitest": "latest", "jsdom": "latest", "@testing-library/react": "latest", "@testing-library/jest-dom": "latest" },
  "type": "module"
}
```

- [ ] **Step 2: Configure Vite and create entrypoint**

`vite.config.js` enables the React plugin and Vitest `jsdom` environment. `src/main.jsx` renders `<App />` into `#root`; `index.html` supplies Polish title and viewport metadata.

- [ ] **Step 3: Install dependencies and verify empty app builds**

Run: `npm install`
Run: `npm test -- --passWithNoTests`
Expected: Vitest exits successfully with no test files.
Run: `npm run build`
Expected: Vite creates `dist/` successfully.

- [ ] **Step 4: Commit bootstrap**

```bash
git add package.json vite.config.js index.html src/main.jsx .gitignore package-lock.json
git commit -m "chore: bootstrap dungeon tracker"
```

### Task 2: Implement and test domain logic

**Files:**
- Create: `src/domain.js`
- Create: `src/domain.test.js`

- [ ] **Step 1: Write failing domain tests**

Cover these exact behaviors:

```js
it('starts Hydra for 20 minutes using an absolute end timestamp', () => {
  expect(startHydra(1000)).toEqual({ startedAt: 1000, endsAt: 1201000 });
});

it('moves Meley from registration wait to entry-ready', () => {
  const state = registerMeley(1000);
  expect(resolveMeleyState(state, 1000 + MELEY_WAIT_MS)).toEqual({ phase: 'readyToEnter', endsAt: null });
});

it('moves Meley from entry to registration wait', () => {
  expect(enterMeley({ phase: 'readyToEnter', endsAt: null }, 2000)).toEqual({ phase: 'waitingToRegister', endsAt: 2000 + MELEY_WAIT_MS });
});

it('calculates all-time and today Hydra stats', () => {
  const runs = [{ id: '1', createdAt: '2026-08-31T10:00:00.000Z', chests: 5 }, { id: '2', createdAt: '2026-08-30T10:00:00.000Z', chests: 3 }];
  expect(getHydraStats(runs, '2026-08-31')).toMatchObject({ runs: 2, total: 8, average: 4, today: 5 });
});

it('rejects negative, fractional, and malformed chest values', () => {
  expect(validateChestCount('-1').valid).toBe(false);
  expect(validateChestCount('1.5').valid).toBe(false);
  expect(validateChestCount('4').value).toBe(4);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- src/domain.test.js`
Expected: FAIL because domain functions do not exist.

- [ ] **Step 3: Implement minimal pure domain module**

Export `HYDRA_COOLDOWN_MS`, `MELEY_WAIT_MS`, `createInitialMeleyState`, `startHydra`, `registerMeley`, `resolveMeleyState`, `enterMeley`, `getHydraStats`, `validateChestCount`, `serializeBackup`, and `parseBackup`. Use ISO timestamps for run records, calculate “today” from local calendar date, and reject backups unless version, timers, and runs have expected types.

- [ ] **Step 4: Run domain tests**

Run: `npm test -- src/domain.test.js`
Expected: PASS.

- [ ] **Step 5: Commit domain logic**

```bash
git add src/domain.js src/domain.test.js
git commit -m "feat: add dungeon timer domain logic"
```

### Task 3: Build application state and timer cards

**Files:**
- Create: `src/App.jsx`
- Create: `src/components/DungeonCard.jsx`
- Create: `src/components/HydraCard.jsx`
- Create: `src/components/MeleyCard.jsx`

- [ ] **Step 1: Add app behavior tests**

Render the app with fake timers and assert Hydra start text, Meley phase button labels, and persistence calls. Assert each interval derives remaining time from `Date.now()` and cleans itself up.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- src/App.test.jsx`
Expected: FAIL because components do not exist.

- [ ] **Step 3: Implement persisted state**

Use storage key `metin2-dungeon-tracker-v1`. On load, parse valid saved state or use defaults. `App` owns `now`, increments it once per second, resolves expired Meley phase, and persists state changes. Hydra start stores cooldown and creates a draft; saving a valid draft appends `{ id, createdAt, chests }` and clears the draft.

- [ ] **Step 4: Implement cards**

`DungeonCard` supplies title, accent, status, and compact action area. `HydraCard` shows `Gotowa`/remaining `mm:ss`, chest input, save action, and confirmed reset. `MeleyCard` renders registration, 4-hour wait, entry-ready, and post-entry wait states with exact actions `Zarejestruj`, `Wejdź`, and `Resetuj`.

- [ ] **Step 5: Run tests**

Run: `npm test -- src/App.test.jsx`
Expected: PASS.

- [ ] **Step 6: Commit cards**

```bash
git add src/App.jsx src/components/DungeonCard.jsx src/components/HydraCard.jsx src/components/MeleyCard.jsx src/App.test.jsx
git commit -m "feat: add dungeon cooldown dashboard"
```

### Task 4: Add Hydra statistics and history editing

**Files:**
- Create: `src/components/StatsPanel.jsx`
- Create: `src/components/RunHistory.jsx`

- [ ] **Step 1: Write failing component tests**

Assert totals, average rounded to two decimal places, today total, empty-state copy, inline edit save, and delete confirmation.

- [ ] **Step 2: Implement statistics and history**

`StatsPanel` consumes `getHydraStats`. `RunHistory` sorts newest first, displays local date/time and chest count, validates edits through `validateChestCount`, and calls parent update/delete actions.

- [ ] **Step 3: Run targeted tests**

Run: `npm test -- src/components/RunHistory.test.jsx`
Expected: PASS.

- [ ] **Step 4: Commit history features**

```bash
git add src/components/StatsPanel.jsx src/components/RunHistory.jsx src/components/*.test.jsx
git commit -m "feat: add Hydra statistics and history"
```

### Task 5: Add JSON backup and responsive visual system

**Files:**
- Create: `src/components/SettingsPanel.jsx`
- Create: `src/styles.css`
- Modify: `src/main.jsx`

- [ ] **Step 1: Write failing backup tests**

Assert export creates a JSON download, valid import replaces state, invalid import preserves existing state and shows an error, and reset-all requires confirmation.

- [ ] **Step 2: Implement settings actions**

Use a hidden file input for import and a Blob/object URL for export. Show compact feedback text. Keep import parsing behind `parseBackup`; never mutate state before validation succeeds.

- [ ] **Step 3: Implement CSS**

Use CSS variables for charcoal background, muted surfaces, white text, turquoise Hydra accent, amber Meley accent, restrained borders, and small radius. Use a two-column grid at desktop widths and one column below `760px`; make history rows stack without horizontal overflow. Style focus-visible controls and `prefers-reduced-motion`.

- [ ] **Step 4: Run tests and build**

Run: `npm test`
Expected: all tests PASS.
Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit UI and backup**

```bash
git add src/components/SettingsPanel.jsx src/styles.css src/main.jsx src/**/*.test.jsx
git commit -m "feat: add backup and responsive tracker UI"
```

### Task 6: Final verification

**Files:**
- Modify: any implementation files needed after verification

- [ ] **Step 1: Run complete automated checks**

Run: `npm test`
Expected: all tests PASS.
Run: `npm run build`
Expected: Vite build succeeds.
Run: `git diff --check`
Expected: no whitespace errors.

- [ ] **Step 2: Perform manual browser smoke test**

Run: `npm run dev -- --host 127.0.0.1`
Check: start Hydra, enter/save chests, verify stats/history, refresh and verify timer; complete each Meley transition using shortened test fixtures or browser devtools clock; export/import JSON; verify mobile layout at `375px`.

- [ ] **Step 3: Review repository status**

Run: `git status --short`
Expected: only intentional source, test, documentation, and lock files remain.
