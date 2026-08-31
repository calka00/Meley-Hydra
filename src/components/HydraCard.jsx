import { getRemainingMs } from '../domain'
import DungeonCard from './DungeonCard'

const format = (ms) => { const total = Math.ceil(ms / 1000); return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}` }

export default function HydraCard({ hydra, draft, now, onStart, onDraftChange, onSave, onReset }) {
  const remaining = getRemainingMs(hydra?.endsAt, now)
  const active = remaining > 0
  return <DungeonCard className="hydra" title="Hydra" eyebrow="Dungeon · 20 min cooldown" status={active ? 'Aktywny timer' : 'Gotowa'}>
    <div className="timer-row"><strong>{active ? format(remaining) : 'Gotowa'}</strong><span>{active ? `do ${new Date(hydra.endsAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}` : 'możesz wejść'}</span></div>
    {active ? <div className="run-form"><label htmlFor="chests">Liczba skrzyń</label><div className="inline-form"><input id="chests" type="number" min="0" step="1" value={draft} onChange={(e) => onDraftChange(e.target.value)} placeholder="np. 4"/><button className="button accent" onClick={onSave}>Zapisz run</button></div><button className="text-button" onClick={onReset}>Resetuj timer</button></div> : <button className="button accent" onClick={onStart}>Rozpocznij run</button>}
  </DungeonCard>
}
