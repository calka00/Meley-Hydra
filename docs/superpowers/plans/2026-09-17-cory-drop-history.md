# Cory Drop History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add period-based Cory drop summaries and persistent history for all three accounts together.

**Architecture:** Store summaries in `cory.dropHistory`. Domain helpers validate non-negative integers and derive the next period start from the last entry. A focused `CoryDropHistory` component renders the active range, form, and newest-first history.

**Tech Stack:** React, Vitest, Testing Library, localStorage.

## Global Constraints

- First period starts on current game date when first summary is saved.
- Next period starts day after previous period end.
- Fields: Cory, Ruby, Garnet, Onyx, Sapphire, Jade, Diamond.
- All values are non-negative whole numbers.

---

### Task 1: Add drop-history domain helpers

**Files:**
- Modify: `src/domain.js`
- Modify: `src/domain.test.js`

**Interfaces:**
- Produces: `DROP_TYPES`, `createEmptyDropSummary()`, `validateDropSummary(summary)`, `getNextDropStart(history, currentDateKey)`.

- [ ] **Step 1: Write failing domain tests**

```js
it('validates drop summary values as non-negative integers', () => {
  expect(validateDropSummary({ cory: 4, ruby: 1, garnet: 0, onyx: 0, sapphire: 0, jade: 0, diamond: 0 }).valid).toBe(true)
  expect(validateDropSummary({ cory: -1, ruby: 0, garnet: 0, onyx: 0, sapphire: 0, jade: 0, diamond: 0 }).valid).toBe(false)
})

it('starts next period after last summary', () => {
  expect(getNextDropStart([{ endDate: '2026-09-17' }], '2026-09-20')).toBe('2026-09-18')
  expect(getNextDropStart([], '2026-09-20')).toBe('2026-09-20')
})
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm.cmd test -- src/domain.test.js`

Expected: FAIL because helpers do not exist.

- [ ] **Step 3: Implement helpers**

Add:

```js
export const DROP_TYPES = ['cory', 'ruby', 'garnet', 'onyx', 'sapphire', 'jade', 'diamond']
export function createEmptyDropSummary() { return Object.fromEntries(DROP_TYPES.map((type) => [type, ''])) }
export function validateDropSummary(summary) { return DROP_TYPES.every((type) => /^\d+$/.test(String(summary[type]).trim())) }
export function getNextDropStart(history, currentDateKey) { if (!history.length) return currentDateKey; const date = new Date(`${history[history.length - 1].endDate}T12:00:00`); date.setDate(date.getDate() + 1); return getLocalDateKey(date) }
```

- [ ] **Step 4: Run focused tests**

Run: `npm.cmd test -- src/domain.test.js`

Expected: PASS.

### Task 2: Add summary form and history component

**Files:**
- Create: `src/components/CoryDropHistory.jsx`
- Create: `src/components/CoryDropHistory.test.jsx`
- Modify: `src/components/CoryPanel.jsx`

**Interfaces:**
- Consumes: `history`, `now`, `onAdd`.
- Produces: active period display, seven numeric inputs, saved history rows.

- [ ] **Step 1: Write failing component test**

Assert all seven fields render, saving creates a row, and invalid negative input does not call `onAdd`.

- [ ] **Step 2: Implement form**

Use `createEmptyDropSummary()` for controlled state. Derive current game date via `getGameDateKey(now)` and start via `getNextDropStart(history, currentDate)`. On valid submit call `onAdd({ startDate, endDate: currentDate, ...numericValues })`, then clear form.

- [ ] **Step 3: Render history newest first**

Show date range and each material total in every saved row. Render panel after Cory account table.

- [ ] **Step 4: Run focused tests**

Run: `npm.cmd test -- src/components/CoryDropHistory.test.jsx`

Expected: PASS.

### Task 3: Persist summaries and verify

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/CoryPanel.jsx`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: `CoryDropHistory` callback.
- Produces: persisted `cory.dropHistory` and complete UI behavior.

- [ ] **Step 1: Extend Cory state default and loader**

Add `dropHistory: []` to `createInitialCoryState()` and merge saved Cory data with this default.

- [ ] **Step 2: Wire summary insertion**

Pass `history={cory.dropHistory || []}` and update with `onChange({ ...cory, dropHistory: [...(cory.dropHistory || []), entry] })`.

- [ ] **Step 3: Add integration test**

Open Cory tab, fill all fields, save, and assert the period row and totals appear.

- [ ] **Step 4: Run complete verification**

Run:

```powershell
npm.cmd test
npm.cmd run build
```

Expected: all tests pass and `dist/index.html` is generated.
