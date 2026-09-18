# Cory drop history

## Goal

Add period-based drop summaries covering all three Cory accounts together.

## Periods

- First period starts on the current game date when the first summary is saved.
- First period ends on the game date when it is saved.
- Every next period starts the day after the previous period ended.
- Saving summary creates an immutable history entry with start and end dates.

## Summary fields

- Cory count.
- Ruby count.
- Garnet count.
- Onyx count.
- Sapphire count.
- Jade count.
- Diamond count.
- All values are non-negative whole numbers.

## UI and persistence

- Add `Historia dropu` panel inside Cory tab.
- Show active period range above form.
- Show history entries newest first with date range and all material totals.
- Store summaries in localStorage with Cory state.
- Existing reset clears summaries together with other local data.

## Testing

- Verify first period starts at current game date.
- Verify next period starts after previous period end.
- Verify invalid negative/fractional values are rejected.
- Verify saved entries render in history and persist through state updates.
