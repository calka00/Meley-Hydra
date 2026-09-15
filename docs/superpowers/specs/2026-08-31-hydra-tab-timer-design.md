# Hydra tab timer

## Goal

Show active Hydra cooldown in browser-tab title.

## Behavior

- Starting Hydra changes title to `<MM:SS> | Hydra`.
- Title decreases every second from existing dashboard clock state.
- Resetting Hydra or reaching zero restores `Dungeon Tracker | Metin2`.
- No other timer changes title.

## Implementation

- Keep title ownership in `App.jsx` with a React effect depending on `state.hydra` and `now`.
- Reuse `getRemainingMs` and same ceiling-to-seconds formatting as Hydra card.
- Update `document.title` only; do not persist title state.

## Testing

- Start Hydra and assert initial tab title.
- Advance fake time and assert countdown title.
- Assert default title after reset and expiry.
