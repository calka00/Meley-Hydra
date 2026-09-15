# Hydra, Meley, and run history controls

## Goal

Allow recovery from missed Hydra timer activation, record Meley registration channel and time, and paginate Hydra runs.

## Hydra

- Active Hydra exposes `Pomiń Hydrę`.
- Activating it clears active Hydra timer and draft chest count.
- It does not create a run-history entry.

## Meley

- User selects one channel from `CH1` through `CH6` before registering.
- Registration stores selected channel and current timestamp in persisted Meley state.
- Meley card displays latest registration as `HH:MM · CHx` after registration and after reload.

## Run history

- List remains sorted newest first.
- One page renders at most five runs.
- `Poprzednia` and `Następna` navigate pages.
- Adding or deleting runs clamps current page to an available page.

## Testing

- Verify Hydra skip returns it to ready without creating run.
- Verify Meley registration records chosen channel and current timestamp.
- Verify history page size and navigation between pages.
