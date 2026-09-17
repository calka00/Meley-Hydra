# Cory Three-Day Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show yesterday, today, and tomorrow together for every Cory character with compact names and date-labelled status cells.

**Architecture:** Keep existing date-keyed status storage and replace only Cory's day selector UI with a three-column table. Each character row derives three date keys from the current game date, so status editing remains independent per day.

**Tech Stack:** React, Vitest, Testing Library, CSS.

## Global Constraints

- Show three columns simultaneously: yesterday, today, tomorrow.
- Header format: `DD mon` plus day label.
- Character name column remains narrow and leftmost.
- Yesterday and today cells are editable; tomorrow is disabled and empty.
- Mobile layout uses horizontal scrolling.

---

### Task 1: Cover three-day table behavior

**Files:**
- Modify: `src/components/CoryPanel.test.jsx`

**Interfaces:**
- Consumes: existing `CoryPanel`, `createInitialCoryState`, date-based status state.
- Produces: regression tests for simultaneous headers, row cells, and tomorrow lock.

- [ ] **Step 1: Write failing tests**

Add a test with one named character:

```jsx
it('shows all three game days in one character row', () => {
  const cory = createInitialCoryState()
  cory.accounts[0].characters = [{ id: 'char-1', name: 'Ninja' }]
  render(<CoryPanel cory={cory} now={new Date('2026-09-17T12:00:00')} onChange={vi.fn()} />)
  expect(screen.getByText('Wczoraj')).toBeInTheDocument()
  expect(screen.getByText('Dzisiaj')).toBeInTheDocument()
  expect(screen.getByText('Jutro')).toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Puste' })).toHaveLength(3)
  expect(screen.getAllByRole('button', { name: 'Puste' })[2]).toBeDisabled()
})
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm.cmd test -- src/components/CoryPanel.test.jsx`

Expected: FAIL because current component displays only one selected day.

### Task 2: Replace day selector with three-day table

**Files:**
- Modify: `src/components/CoryPanel.jsx`
- Modify: `src/components/CoryPanel.test.jsx`

**Interfaces:**
- Consumes: `getGameDateKey`, `getCoryStatus`, `advanceCoryStatus`, `now`.
- Produces: table headers and three status buttons for each character.

- [ ] **Step 1: Define day columns**

Replace `DAY_OFFSETS` UI usage with:

```jsx
const DAY_COLUMNS = [
  { key: 'yesterday', label: 'Wczoraj', offset: -1, editable: true },
  { key: 'today', label: 'Dzisiaj', offset: 0, editable: true },
  { key: 'tomorrow', label: 'Jutro', offset: 1, editable: false },
]
```

Use `dateKeyOffset(now, offset)` for every column.

- [ ] **Step 2: Render compact table**

Replace day buttons and character list with:

```jsx
<div className="cory-table-wrap">
  <table className="cory-table">
    <thead><tr><th>Postać</th>{DAY_COLUMNS.map((day) => <th key={day.key}>{day.label}<small>{formatCoryDate(dateKeyOffset(now, day.offset))}</small></th>)}</tr></thead>
    <tbody>{account.characters.map((character) => <tr key={character.id}><th><input aria-label="Nazwa postaci" value={character.name} /></th>{DAY_COLUMNS.map((day) => <td key={day.key}><StatusButton character={character} day={day} /></td>)}</tr>)}</tbody>
  </table>
</div>
```

Keep immutable account-name and character-name update callbacks. `StatusButton` must render tomorrow as empty and disabled, while yesterday/today read from their date keys and call existing status update logic.

- [ ] **Step 3: Add date formatter**

Add:

```jsx
const formatCoryDate = (dateKey) => new Date(`${dateKey}T12:00:00`).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' })
```

- [ ] **Step 4: Run focused tests**

Run: `npm.cmd test -- src/components/CoryPanel.test.jsx`

Expected: all Cory component tests pass.

### Task 3: Style compact table and verify application

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/CoryPanel.test.jsx`

**Interfaces:**
- Consumes: table class names from Task 2.
- Produces: compact left name column, readable status cells, mobile horizontal scrolling.

- [ ] **Step 1: Add table styling**

Add CSS:

```css
.cory-table-wrap { overflow-x: auto; margin: 18px 0; }
.cory-table { width: 100%; min-width: 620px; border-collapse: collapse; }
.cory-table th, .cory-table td { padding: 10px; border-bottom: 1px solid #283331; text-align: center; }
.cory-table th:first-child { width: 150px; text-align: left; }
.cory-table thead small { display: block; color: #95a4a1; font-weight: 400; }
.cory-table tbody th input { width: 130px; }
.cory-table .cory-status { width: 100%; min-height: 38px; }
```

- [ ] **Step 2: Run complete verification**

Run:

```powershell
npm.cmd test
npm.cmd run build
```

Expected: all tests pass and `dist/index.html` is generated.
