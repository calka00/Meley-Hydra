# Cory three-day table

## Goal

Show yesterday, today, and tomorrow simultaneously in Cory view.

## Layout

- Keep account tabs and account name editing.
- Replace day switcher with one table.
- First narrow column contains character name.
- Three status columns appear beside it: yesterday, today, tomorrow.
- Column headers show label and local game date as `DD mon`, for example `17 wrz`.
- On narrow screens table scrolls horizontally.

## Interaction

- Yesterday and today cells remain clickable.
- Tomorrow cells remain white, empty, and disabled.
- Status colors and progression remain unchanged.
- Each row shows one character across all three date columns.

## Persistence

- Existing date-keyed statuses remain unchanged.
- Header dates use the existing 02:00 game-day boundary.

## Testing

- Verify all three date headers render at once.
- Verify one character renders three status cells.
- Verify yesterday/today cells are interactive and tomorrow is disabled.
- Verify date labels reflect the game-day date.
