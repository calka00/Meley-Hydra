import { describe, expect, it } from 'vitest'
import {
  MELEY_WAIT_MS,
  getHydraStats,
  registerMeley,
  enterMeley,
  resolveMeleyState,
  startHydra,
  validateChestCount,
} from './domain'

describe('dungeon domain', () => {
  it('starts Hydra for 20 minutes using an absolute end timestamp', () => {
    expect(startHydra(1000)).toEqual({ startedAt: 1000, endsAt: 1201000 })
  })

  it('moves Meley from registration wait to entry-ready', () => {
    const state = registerMeley(1000)
    expect(resolveMeleyState(state, 1000 + MELEY_WAIT_MS)).toEqual({ phase: 'readyToEnter', endsAt: null })
  })

  it('moves Meley from entry to registration wait', () => {
    expect(enterMeley({ phase: 'readyToEnter', endsAt: null }, 2000)).toEqual({
      phase: 'waitingToRegister',
      endsAt: 2000 + MELEY_WAIT_MS,
    })
  })

  it('calculates all-time and today Hydra stats', () => {
    const runs = [
      { id: '1', createdAt: '2026-08-31T10:00:00.000Z', chests: 5 },
      { id: '2', createdAt: '2026-08-30T10:00:00.000Z', chests: 3 },
    ]
    expect(getHydraStats(runs, '2026-08-31')).toMatchObject({ runs: 2, total: 8, average: 4, today: 5 })
  })

  it('rejects negative, fractional, and malformed chest values', () => {
    expect(validateChestCount('-1').valid).toBe(false)
    expect(validateChestCount('1.5').valid).toBe(false)
    expect(validateChestCount('4').value).toBe(4)
  })
})
