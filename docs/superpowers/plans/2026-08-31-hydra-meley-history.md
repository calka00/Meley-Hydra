# Hydra, Meley, and Run History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Hydra skip recovery, persisted Meley channel registration details, and five-item run-history pagination.

**Architecture:** Keep Hydra skip in existing parent-owned state. Extend persisted `meley` state with selected channel and most recent registration timestamp. Keep page state local to `RunHistory`, deriving safely clamped visible entries from incoming runs.

**Tech Stack:** React, Vitest, Testing Library, localStorage.

## Global Constraints

- Hydra skip clears timer and draft without creating a run.
- Meley channels are exactly `CH1` through `CH6`.
- Meley registration records current timestamp and selected channel.
- Run history shows at most five newest entries per page.

---

### Task 1: Cover Hydra skip and Meley registration metadata

**Files:**
- Modify: `src/domain.test.js`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: `createInitialMeleyState`, `registerMeley`, rendered `App`
- Produces: failing coverage for persisted Meley metadata and Hydra skip behavior

- [ ] **Step 1: Write failing domain test**

Add imports for `createInitialMeleyState` and this test:

```jsx
  it('records selected Meley channel and registration time', () => {
    const state = { ...createInitialMeleyState(), channel: 'CH4' }
    expect(registerMeley(state, 1000)).toEqual({
      phase: 'waitingToEnter', endsAt: 1000 + MELEY_WAIT_MS, channel: 'CH4', registeredAt: 1000,
    })
  })
```

- [ ] **Step 2: Write failing app test**

Add this test to `src/App.test.jsx`:

```jsx
  it('skips active Hydra without saving a run', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Rozpocznij run' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pomiń Hydrę' }))
    expect(screen.getByRole('button', { name: 'Rozpocznij run' })).toBeInTheDocument()
    expect(screen.getByText('0 zapisanych')).toBeInTheDocument()
  })
```

- [ ] **Step 3: Verify tests fail**

Run:

```powershell
npm.cmd test -- src/domain.test.js src/App.test.jsx
```

Expected: FAIL because `Pomiń Hydrę` is absent and `registerMeley` does not accept state or return metadata.

### Task 2: Implement Hydra skip and Meley registration details

**Files:**
- Modify: `src/domain.js`
- Modify: `src/App.jsx`
- Modify: `src/components/HydraCard.jsx`
- Modify: `src/components/MeleyCard.jsx`
- Test: `src/domain.test.js`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: `meley.channel`, `registerMeley(state, now)`
- Produces: `meley.registeredAt`, visible `HH:MM · CHx`, `Pomiń Hydrę`

- [ ] **Step 1: Extend Meley domain state**

Change initial state and registration function:

```jsx
export function createInitialMeleyState() {
  return { phase: 'readyToRegister', endsAt: null, channel: 'CH1', registeredAt: null }
}

export function registerMeley(state, now) {
  return { ...state, phase: 'waitingToEnter', endsAt: now + MELEY_WAIT_MS, registeredAt: now }
}
```

Update `parseBackup` returned `meley` to preserve valid channel and timestamp:

```jsx
meley: {
  phase: data.meley.phase,
  endsAt: data.meley.endsAt ?? null,
  channel: /^CH[1-6]$/.test(data.meley.channel) ? data.meley.channel : 'CH1',
  registeredAt: Number.isFinite(data.meley.registeredAt) ? data.meley.registeredAt : null,
},
```

- [ ] **Step 2: Wire parent state and Hydra skip**

Update `load` so saved legacy Meley states receive missing defaults:

```jsx
const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved ? { ...initial, ...saved, meley: { ...initial.meley, ...saved.meley } } : initial
  } catch {
    return initial
  }
}
```

Pass Meley channel and callbacks from `App`:

```jsx
<HydraCard ... onSkip={() => patch({ hydra: null, hydraDraft: '' })}/>
<MeleyCard
  meley={state.meley}
  now={now}
  onChannelChange={(channel) => patch({ meley: { ...state.meley, channel } })}
  onRegister={() => patch({ meley: registerMeley(state.meley, now) })}
  ...
/>
```

- [ ] **Step 3: Render controls in dungeon cards**

Change Hydra active controls to include:

```jsx
<button className="text-button" onClick={onSkip}>Pomiń Hydrę</button>
```

In `MeleyCard`, add channel selection before `Zarejestruj`:

```jsx
<label htmlFor="meley-channel">Kanał rejestracji</label>
<select id="meley-channel" value={meley.channel} onChange={(e) => onChannelChange(e.target.value)}>
  {['CH1', 'CH2', 'CH3', 'CH4', 'CH5', 'CH6'].map((channel) => <option key={channel}>{channel}</option>)}
</select>
{meley.registeredAt && <p className="muted">Ostatnia rejestracja: {new Date(meley.registeredAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} · {meley.channel}</p>}
```

- [ ] **Step 4: Run focused tests**

Run:

```powershell
npm.cmd test -- src/domain.test.js src/App.test.jsx
```

Expected: focused tests pass.

### Task 3: Paginate run history

**Files:**
- Modify: `src/components/RunHistory.jsx`
- Modify: `src/components/RunHistory.test.jsx`

**Interfaces:**
- Consumes: `runs`, `onUpdate`, `onDelete`
- Produces: five newest visible entries and pagination buttons

- [ ] **Step 1: Write failing pagination test**

Add a test that renders six dated runs, asserts only five rows are present, clicks `Następna`, then asserts the sixth run is shown.

```jsx
expect(screen.getAllByRole('button', { name: 'Edytuj run' })).toHaveLength(5)
fireEvent.click(screen.getByRole('button', { name: 'Następna' }))
expect(screen.getByText('1 skrzyń')).toBeInTheDocument()
```

- [ ] **Step 2: Verify test fails**

Run:

```powershell
npm.cmd test -- src/components/RunHistory.test.jsx
```

Expected: FAIL because all six entries render and pagination controls are absent.

- [ ] **Step 3: Add local page state and controls**

Add `const PAGE_SIZE = 5`, `const [page, setPage] = useState(0)`, then derive:

```jsx
const sortedRuns = [...runs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
const pageCount = Math.max(1, Math.ceil(sortedRuns.length / PAGE_SIZE))
const currentPage = Math.min(page, pageCount - 1)
const visibleRuns = sortedRuns.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
```

Render `visibleRuns` instead of sorted inline entries, followed by:

```jsx
<div className="pagination">
  <button className="small-button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Poprzednia</button>
  <span className="muted">Strona {currentPage + 1} z {pageCount}</span>
  <button className="small-button" disabled={currentPage === pageCount - 1} onClick={() => setPage(currentPage + 1)}>Następna</button>
</div>
```

- [ ] **Step 4: Verify pagination and full suite**

Run:

```powershell
npm.cmd test -- src/components/RunHistory.test.jsx
npm.cmd test
npm.cmd run build
```

Expected: all tests pass and Vite produces `dist/index.html`.
