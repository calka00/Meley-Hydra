# Cory daily tracker

## Goal

Add second `Cory` tab for tracking daily pickup and completion status across three accounts and up to nine characters per account.

## Accounts and characters

- Three account slots with editable names.
- Each account starts empty and supports `Dodaj postać` up to nine characters.
- Character names are editable.
- Character definitions persist locally.

## Game days

- Game day rolls over at `02:00` local time.
- Tabs show `Wczoraj`, `Dzisiaj`, and `Jutro`.
- `Dzisiaj` and `Wczoraj` use independently persisted status data.
- `Jutro` always displays empty statuses and is read-only.
- Previous days remain available through stored date-keyed status data.

## Statuses

- Empty status is white.
- Clicking empty changes it to `Odebrane` and blue.
- Clicking `Odebrane` changes it to `Zrobione` and green.
- `Zrobione` cannot be changed again on same day.
- Yesterday remains editable to support completing yesterday's task after rollover.

## Navigation and persistence

- Existing tracker becomes first tab; `Cory` becomes second tab.
- Current tab and Cory data persist in `localStorage`.
- Existing Hydra, Meley, and run-history behavior remains unchanged.

## Testing

- Verify account and character name editing and nine-character limit.
- Verify status progression and lock at `Zrobione`.
- Verify today/yesterday editability and tomorrow read-only behavior.
- Verify `02:00` game-day key calculation and persisted status separation.
