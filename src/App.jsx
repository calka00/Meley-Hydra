import { useEffect, useMemo, useState } from 'react'
import { createInitialMeleyState, enterMeley, getChestValue, getHydraStats, getLocalDateKey, getUnsoldChests, parsePriceKk, registerMeley, resolveMeleyState, startHydra, validateChestCount } from './domain'
import HydraCard from './components/HydraCard'
import MeleyCard from './components/MeleyCard'
import StatsPanel from './components/StatsPanel'
import RunHistory from './components/RunHistory'
import SettingsPanel from './components/SettingsPanel'
import ChestValuePanel from './components/ChestValuePanel'

const STORAGE_KEY = 'metin2-dungeon-tracker-v1'
const initial = { hydra: null, hydraDraft: '', hydraRuns: [], soldChests: 0, chestPriceKk: '', meley: createInitialMeleyState() }
const load = () => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return saved ? { ...initial, ...saved } : initial } catch { return initial } }

export default function App() {
  const [state, setState] = useState(load); const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  useEffect(() => { setState((current) => { const meley = resolveMeleyState(current.meley, now); return meley === current.meley ? current : { ...current, meley } }) }, [now])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }, [state])
  const stats = useMemo(() => getHydraStats(state.hydraRuns, getLocalDateKey(now)), [state.hydraRuns, now])
  const unsold = getUnsoldChests(state.hydraRuns, state.soldChests)
  const chestValue = getChestValue(unsold, parsePriceKk(state.chestPriceKk))
  const patch = (changes) => setState((current) => ({ ...current, ...changes }))
  const saveRun = () => { const result = validateChestCount(state.hydraDraft); if (!result.valid) return; patch({ hydraRuns: [...state.hydraRuns, { id: crypto.randomUUID(), createdAt: new Date().toISOString(), chests: result.value }], hydraDraft: '' }) }
  return <main className="app-shell"><header className="topbar"><div className="brand"><span className="brand-mark">M</span><div><p className="eyebrow">METIN2 / TRACKER</p><h1>Dungeon control</h1></div></div><div className="clock"><span className="live-dot" />{new Date(now).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}<small>Dane lokalne</small></div></header><section className="hero"><div><p className="eyebrow">Twój panel cooldownów</p><h2>Graj według timera.</h2></div><p className="hero-copy">Pilnuj wejść na dungeon i zapisuj wyniki Hydry w jednym, spokojnym miejscu.</p></section><div className="dungeon-grid"><HydraCard hydra={state.hydra} draft={state.hydraDraft} now={now} onStart={() => patch({ hydra: startHydra(now) })} onDraftChange={(hydraDraft) => patch({ hydraDraft })} onSave={saveRun} onReset={() => patch({ hydra: null, hydraDraft: '' })}/><MeleyCard meley={state.meley} now={now} onRegister={() => patch({ meley: registerMeley(now) })} onEnter={() => patch({ meley: enterMeley(state.meley, now) })} onReset={() => patch({ meley: createInitialMeleyState() })}/></div><StatsPanel stats={stats}/><RunHistory runs={state.hydraRuns} onUpdate={(id, chests) => patch({ hydraRuns: state.hydraRuns.map((run) => run.id === id ? { ...run, chests } : run) })} onDelete={(id) => patch({ hydraRuns: state.hydraRuns.filter((run) => run.id !== id) })}/><ChestValuePanel priceKk={state.chestPriceKk} unsold={unsold} value={chestValue} onPriceChange={(chestPriceKk) => patch({ chestPriceKk })} onSell={() => patch({ soldChests: state.hydraRuns.reduce((sum, run) => sum + run.chests, 0) })}/><SettingsPanel state={state} onImport={setState} onReset={() => { setState(initial); localStorage.removeItem(STORAGE_KEY) }}/></main>
}
