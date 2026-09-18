import { useState } from 'react'
import { createEmptyDropSummary, DROP_TYPES, getGameDateKey, getNextDropStart, validateDropSummary } from '../domain'

const labels = { cory: 'Cory', ruby: 'Rubiny', garnet: 'Granaty', onyx: 'Onyksy', sapphire: 'Szafiry', jade: 'Jadeity', diamond: 'Diamenty' }
const formatDate = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })

export default function CoryDropHistory({ history, now, onAdd }) {
  const [form, setForm] = useState(createEmptyDropSummary)
  const currentDate = getGameDateKey(now)
  const startDate = getNextDropStart(history, currentDate)
  const submit = (event) => { event.preventDefault(); const result = validateDropSummary(form); if (!result.valid) return; onAdd({ ...Object.fromEntries(DROP_TYPES.map((type) => [type, Number(form[type])])), startDate, endDate: currentDate }); setForm(createEmptyDropSummary()) }
  return <section className="drop-history"><div className="section-title"><div><p className="eyebrow">Cory</p><h2>Historia dropu</h2></div><span className="muted">Okres: {formatDate(startDate)} – {formatDate(currentDate)}</span></div><form className="drop-form" onSubmit={submit}>{DROP_TYPES.map((type) => <label key={type}>{labels[type]}<input aria-label={labels[type]} type="number" min="0" step="1" value={form[type]} onChange={(event) => setForm({ ...form, [type]: event.target.value })} /></label>)}<button className="button accent" type="submit">Zapisz podsumowanie</button></form>{history.length > 0 && <div className="drop-history-list">{[...history].reverse().map((entry) => <article className="drop-history-row" key={`${entry.startDate}-${entry.endDate}`}><strong>{formatDate(entry.startDate)} – {formatDate(entry.endDate)}</strong><div>{DROP_TYPES.map((type) => <span key={type}>{labels[type]}: <b>{entry[type]}</b></span>)}</div></article>)}</div>}</section>
}
