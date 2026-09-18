export const HYDRA_COOLDOWN_MS = 20 * 60 * 1000
export const MELEY_WAIT_MS = 4 * 60 * 60 * 1000
export const BACKUP_VERSION = 1
export const PRICE_ALERT_THRESHOLD = 40
export const DROP_TYPES = ['cory', 'ruby', 'garnet', 'onyx', 'sapphire', 'jade', 'diamond']

export function createEmptyDropSummary() {
  return Object.fromEntries(DROP_TYPES.map((type) => [type, '']))
}

export function validateDropSummary(summary) {
  return { valid: DROP_TYPES.every((type) => /^\d+$/.test(String(summary[type]).trim())) }
}

export function getNextDropStart(history, currentDateKey) {
  if (!history.length) return currentDateKey
  const date = new Date(`${history[history.length - 1].endDate}T12:00:00`)
  date.setDate(date.getDate() + 1)
  return getLocalDateKey(date)
}

export function createInitialCoryState() {
  return { accounts: [{ id: 'account-1', name: 'Konto 1', characters: [] }, { id: 'account-2', name: 'Konto 2', characters: [] }, { id: 'account-3', name: 'Konto 3', characters: [] }], statuses: {}, dropHistory: [] }
}

export function getGameDateKey(value) {
  const date = new Date(value)
  if (date.getHours() < 2) date.setDate(date.getDate() - 1)
  return getLocalDateKey(date)
}

export function advanceCoryStatus(status) {
  if (status === 'received') return 'completed'
  return status === 'completed' ? 'completed' : 'received'
}

export function getCoryStatus(state, dateKey, accountId, characterId) {
  return state.statuses?.[dateKey]?.[accountId]?.[characterId] ?? ''
}

export function createInitialMeleyState() {
  return { phase: 'readyToRegister', endsAt: null, channel: 'CH1', registeredAt: null }
}

export function startHydra(now) {
  return { startedAt: now, endsAt: now + HYDRA_COOLDOWN_MS }
}

export function registerMeley(state, now) {
  return { ...state, phase: 'waitingToEnter', endsAt: now + MELEY_WAIT_MS, registeredAt: now }
}

export function enterMeley(state, now) {
  if (state.phase !== 'readyToEnter') return state
  return { ...state, phase: 'waitingToRegister', endsAt: now + MELEY_WAIT_MS }
}

export function resolveMeleyState(state, now) {
  if (state.endsAt === null || now < state.endsAt) return state
  if (state.phase === 'waitingToEnter') return { ...state, phase: 'readyToEnter', endsAt: null }
  if (state.phase === 'waitingToRegister') return { ...state, phase: 'readyToRegister', endsAt: null }
  return state
}

export function getRemainingMs(endsAt, now) {
  return endsAt ? Math.max(0, endsAt - now) : 0
}

export function getLocalDateKey(value) {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getHydraStats(runs, today = getLocalDateKey(Date.now())) {
  const total = runs.reduce((sum, run) => sum + run.chests, 0)
  const todayTotal = runs
    .filter((run) => getLocalDateKey(run.createdAt) === today)
    .reduce((sum, run) => sum + run.chests, 0)
  return {
    runs: runs.length,
    total,
    average: runs.length ? Number((total / runs.length).toFixed(2)) : 0,
    today: todayTotal,
  }
}

export function validateChestCount(raw) {
  const value = String(raw).trim()
  if (!/^\d+$/.test(value)) return { valid: false, error: 'Wpisz nieujemną liczbę całkowitą.' }
  return { valid: true, value: Number(value) }
}

export function getUnsoldChests(runs, soldChests = 0) {
  return Math.max(0, runs.reduce((sum, run) => sum + run.chests, 0) - soldChests)
}

export function parsePriceKk(raw) {
  const normalized = String(raw).trim().replace(',', '.')
  const value = Number(normalized)
  return Number.isFinite(value) && value > 0 ? value * 1_000_000 : null
}

export function formatYang(value) {
  if (!Number.isFinite(value) || value <= 0) return 'Brak ceny'
  const kk = value / 1_000_000
  const formatted = Number.isInteger(kk) ? String(kk) : kk.toFixed(1).replace('.', ',')
  return `${formatted}kk`
}

export function getChestValue(count, price) {
  return count * (price || 0)
}

export function serializeBackup(state) {
  return JSON.stringify({ version: BACKUP_VERSION, ...state }, null, 2)
}

export function parseBackup(raw) {
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error('Plik nie zawiera poprawnego JSON.')
  }
  if (!data || data.version !== BACKUP_VERSION || !Array.isArray(data.hydraRuns)) {
    throw new Error('Nieprawidłowy format kopii zapasowej.')
  }
  if (!data.meley || typeof data.meley.phase !== 'string') {
    throw new Error('Brak poprawnego stanu Meley.')
  }
  const hydraRuns = data.hydraRuns.map((run) => {
    if (!run || typeof run.id !== 'string' || typeof run.createdAt !== 'string' || !Number.isInteger(run.chests) || run.chests < 0) {
      throw new Error('Nieprawidłowy wpis Hydry.')
    }
    return run
  })
  return {
    hydra: data.hydra ?? null,
    hydraRuns,
    soldChests: Number.isInteger(data.soldChests) && data.soldChests >= 0 ? data.soldChests : 0,
    chestPriceKk: typeof data.chestPriceKk === 'string' ? data.chestPriceKk : '',
    meley: { phase: data.meley.phase, endsAt: data.meley.endsAt ?? null, channel: /^CH[1-6]$/.test(data.meley.channel) ? data.meley.channel : 'CH1', registeredAt: Number.isFinite(data.meley.registeredAt) ? data.meley.registeredAt : null },
  }
}
