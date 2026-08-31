# Hydra Chest Price Inventory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend existing tracker with a manually entered Hydra chest price for `[RUBY] Kirin`, an unsold inventory counter, a 40-chest alert, and a sell/reset action.

**Architecture:** Keep all inventory and price state in the existing localStorage state. Isolate inventory math, compact price formatting, and manual price parsing as pure domain functions. No network request is needed; the user updates price when market value changes.

**Tech Stack:** Existing React + Vite + JavaScript + Vitest + Testing Library.

---

## File Map

- Modify: `src/domain.js` for inventory math, price formatting, and manual price parsing.
- Modify: `src/domain.test.js` for pure price/inventory tests.
- Modify: `src/App.jsx` for persisted price, inventory, loading/error state, and refresh actions.
- Create: `src/components/ChestValuePanel.jsx` for the compact price/inventory panel.
- Create: `src/components/ChestValuePanel.test.jsx` for alert and reset behavior.
- Modify: `src/styles.css` for panel and 40-chest alert styles.
- Modify: `docs/superpowers/specs/2026-08-31-metina-dungeon-tracker-design.md` to document manual pricing.

### Task 1: Add inventory and price domain behavior

**Files:**

- [ ] **Step 1: Write failing pure tests**

```js
it('calculates unsold inventory after a sale reset', () => {
  expect(getUnsoldChests([{ chests: 12 }, { chests: 31 }], 0)).toBe(43)
  expect(getUnsoldChests([{ chests: 12 }, { chests: 31 }], 43)).toBe(0)
})

it('formats market price as Polish kk shorthand', () => {
  expect(formatYang(37500000)).toBe('37,5kk')
  expect(formatYang(1000000)).toBe('1kk')
})

it('calculates current chest value only from unsold inventory', () => {
  expect(getChestValue(43, 37500000)).toBe(1612500000)
})
```

- [ ] **Step 2: Run domain tests and verify failure**

Run: `npm test -- src/domain.test.js`
Expected: FAIL because inventory and formatting functions do not exist.

- [ ] **Step 3: Implement domain helpers**

Export `getUnsoldChests(runs, soldChests)`, `formatYang(value)`, `getChestValue(count, price)`, and `PRICE_ALERT_THRESHOLD = 40`. Format millions using one decimal only when needed, comma decimal separator, and `kk` suffix; preserve exact numeric value separately for calculations.

- [ ] **Step 4: Run domain tests**

Run: `npm test -- src/domain.test.js`
Expected: PASS.

### Task 2: Persist inventory and integrate manual price

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add failing integration tests**

Test that saving a Hydra run increases unsold inventory, clicking `Sprzedane / wyzeruj` makes inventory zero while leaving history visible, and a successful market refresh updates the displayed price. Test a failed refresh keeps the previous price and shows an error.

- [ ] **Step 2: Extend persisted state**

Add `soldChests: 0` and `chestPriceKk: ''` to initial state. Keep backward-compatible defaults when loading the existing v1 state. On save run, add chest count as before; do not mutate `soldChests`. The reset action sets only `soldChests` to the current total unsold count, not history.

- [ ] **Step 3: Integrate initial and manual refresh**

Bind price input to `chestPriceKk`, persist it with state, convert it with `parsePriceKk`, and calculate inventory/value from domain helpers on every render.

- [ ] **Step 4: Run integration tests**

Run: `npm test -- src/App.test.jsx`
Expected: PASS.

### Task 3: Add compact value panel

**Files:**
- Create: `src/components/ChestValuePanel.jsx`
- Create: `src/components/ChestValuePanel.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write failing component tests**

```jsx
it('shows formatted price, inventory value, and 40-chest alert', () => {
  render(<ChestValuePanel price={37500000} unsold={43} value={1612500000} onRefresh={vi.fn()} onSell={vi.fn()} />)
  expect(screen.getByText('37,5kk')).toBeInTheDocument()
  expect(screen.getByText('43 skrzynie')).toBeInTheDocument()
  expect(screen.getByText(/40 skrzyń/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Implement panel**

Show only `Cena skrzyni`, `Do sprzedania`, `Aktualny zarobek`, and `Sprzedane / wyzeruj`. Allow price entry in millions, display it as `37,5kk`, and show `Brak ceny` when empty. Use Polish pluralization for 1, 2-4, and other counts.

- [ ] **Step 3: Place panel below `RunHistory`**

Pass calculated values and actions from `App`; keep history independent so selling never removes records.

- [ ] **Step 4: Run component tests**

Run: `npm test -- src/components/ChestValuePanel.test.jsx`
Expected: PASS.

### Task 4: Style and verify

**Files:**
- Modify: `src/styles.css`
- Modify: `docs/superpowers/specs/2026-08-31-metina-dungeon-tracker-design.md` for final manual-price behavior.

- [ ] **Step 1: Add focused styles**

Create compact value panel styling consistent with existing cards. Make the 40-chest alert use a restrained amber border/background, preserve mobile one-column layout, and keep the price readable without creating an oversized dashboard block.

- [ ] **Step 2: Run full verification**

Run: `npm test`
Expected: all tests PASS.
Run: `npm run build`
Expected: Vite build succeeds.
Run: `git diff --check`
Expected: no whitespace errors.

- [ ] **Step 3: Manual smoke test**

Run: `npm run dev`
Check: price loads or displays a truthful error, manual refresh works, saved runs increase inventory, 40 threshold appears, sell reset keeps history, refresh preserves state, and mobile layout has no horizontal overflow.

- [ ] **Step 4: Commit UI integration**

```bash
git add src/domain.js src/domain.test.js src/App.jsx src/App.test.jsx src/components/ChestValuePanel.jsx src/components/ChestValuePanel.test.jsx src/styles.css docs/superpowers/specs/2026-08-31-metina-dungeon-tracker-design.md
git commit -m "feat: track Hydra chest inventory value"
```
