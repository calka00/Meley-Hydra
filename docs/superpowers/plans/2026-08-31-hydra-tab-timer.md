# Hydra Tab Timer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display active Hydra cooldown in browser-tab title and restore default title once timer is inactive.

**Architecture:** `App.jsx` already owns Hydra state and one-second `now` updates, so one effect derives `document.title` from `state.hydra.endsAt` and `now`. App tests use existing fake timers to assert title state transitions.

**Tech Stack:** React, Vitest, Testing Library, jsdom.

## Global Constraints

- Active title format: `<MM:SS> | Hydra`.
- Default title: `Dungeon Tracker | Metin2`.
- Reuse `getRemainingMs`; do not persist title state.
- Meley state must not change browser-tab title.

---

### Task 1: Cover browser-tab title transitions

**Files:**
- Modify: `src/App.test.jsx:14-20`

**Interfaces:**
- Consumes: rendered `App`, `document.title`, existing fake clock from `beforeEach`
- Produces: regression coverage for active, reset, and expired Hydra title states

- [ ] **Step 1: Write failing title test**

Add after `starts Hydra and shows chest input`:

```jsx
  it('shows active Hydra time in browser-tab title and restores default after reset', () => {
    render(<App />)
    expect(document.title).toBe('Dungeon Tracker | Metin2')

    fireEvent.click(screen.getByRole('button', { name: 'Rozpocznij run' }))
    expect(document.title).toBe('20:00 | Hydra')

    act(() => vi.advanceTimersByTime(1000))
    expect(document.title).toBe('19:59 | Hydra')

    fireEvent.click(screen.getByRole('button', { name: 'Resetuj timer' }))
    expect(document.title).toBe('Dungeon Tracker | Metin2')
  })

  it('restores default browser-tab title when Hydra expires', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Rozpocznij run' }))

    act(() => vi.advanceTimersByTime(20 * 60 * 1000))

    expect(document.title).toBe('Dungeon Tracker | Metin2')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm.cmd test -- src/App.test.jsx
```

Expected: FAIL because `document.title` remains `Dungeon Tracker | Metin2` after starting Hydra.

### Task 2: Synchronize document title with Hydra timer

**Files:**
- Modify: `src/App.jsx:1-18`
- Test: `src/App.test.jsx:14-44`

**Interfaces:**
- Consumes: `getRemainingMs(endsAt, now): number`, `state.hydra`, `now`
- Produces: `document.title` as `Dungeon Tracker | Metin2` or `<MM:SS> | Hydra`

- [ ] **Step 1: Add remaining-time import and title formatter**

Replace import from `./domain` with:

```jsx
import { createInitialMeleyState, enterMeley, getChestValue, getHydraStats, getLocalDateKey, getRemainingMs, getUnsoldChests, parsePriceKk, registerMeley, resolveMeleyState, startHydra, validateChestCount } from './domain'
```

Add below `load`:

```jsx
const formatHydraTitle = (remaining) => {
  const total = Math.ceil(remaining / 1000)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')} | Hydra`
}
```

- [ ] **Step 2: Add minimal title synchronization effect**

Add after existing Meley resolution effect:

```jsx
  useEffect(() => {
    const remaining = getRemainingMs(state.hydra?.endsAt, now)
    document.title = remaining > 0 ? formatHydraTitle(remaining) : 'Dungeon Tracker | Metin2'
  }, [state.hydra, now])
```

- [ ] **Step 3: Run focused test to verify it passes**

Run:

```powershell
npm.cmd test -- src/App.test.jsx
```

Expected: all `src/App.test.jsx` tests pass, including both title tests.

- [ ] **Step 4: Run full test suite and production build**

Run:

```powershell
npm.cmd test
npm.cmd run build
```

Expected: all Vitest tests pass and Vite writes `dist/index.html`.
