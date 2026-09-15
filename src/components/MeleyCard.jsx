import { getRemainingMs } from '../domain'
import DungeonCard from './DungeonCard'

const labels = { readyToRegister: 'Gotowa do rejestracji', waitingToEnter: 'Oczekiwanie na wejście', readyToEnter: 'Gotowa do wejścia', waitingToRegister: 'Cooldown rejestracji' }
const format = (ms) => { const total = Math.ceil(ms / 1000); const h = Math.floor(total / 3600); const m = Math.floor((total % 3600) / 60); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}` }

export default function MeleyCard({ meley, now, onChannelChange, onRegister, onEnter, onReset }) {
  const remaining = getRemainingMs(meley.endsAt, now)
  const waiting = remaining > 0
  return <DungeonCard className="meley" title="Meley" eyebrow="Dungeon · cykl 4 godziny" status={labels[meley.phase]}>
    <div className="meley-phase"><span>{labels[meley.phase]}</span>{waiting && <strong>{format(remaining)}</strong>}</div>
    {waiting && <p className="muted">Gotowa o {new Date(meley.endsAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>}
    {meley.phase === 'readyToRegister' && <><label htmlFor="meley-channel">Kanał rejestracji</label><select id="meley-channel" value={meley.channel} onChange={(e) => onChannelChange(e.target.value)}>{['CH1', 'CH2', 'CH3', 'CH4', 'CH5', 'CH6'].map((channel) => <option key={channel}>{channel}</option>)}</select><button className="button accent amber" onClick={onRegister}>Zarejestruj</button></>}
    {meley.registeredAt && <p className="muted">Ostatnia rejestracja: {new Date(meley.registeredAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} · {meley.channel}</p>}
    {meley.phase === 'readyToEnter' && <button className="button accent amber" onClick={onEnter}>Wejdź</button>}
    {waiting && <button className="text-button" onClick={onReset}>Resetuj timer</button>}
  </DungeonCard>
}
