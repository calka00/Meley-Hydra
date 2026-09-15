import { useState } from 'react'
import { validateChestCount } from '../domain'

const PAGE_SIZE = 5

export default function RunHistory({ runs, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(null)
  const [value, setValue] = useState('')
  const [page, setPage] = useState(0)
  const sortedRuns = [...runs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const pageCount = Math.max(1, Math.ceil(sortedRuns.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const visibleRuns = sortedRuns.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
  const save = (id) => { const result = validateChestCount(value); if (result.valid) { onUpdate(id, result.value); setEditing(null) } }
  return <section className="history-panel"><div className="section-title"><div><p className="eyebrow">Dziennik</p><h2>Historia runów</h2></div><span className="muted">{runs.length} zapisanych</span></div>{runs.length === 0 ? <div className="empty-state">Brak zapisanych runów.<br />Uruchom Hydrę i wpisz liczbę skrzyń.</div> : <><div className="history-list">{visibleRuns.map((run) => <div className="history-row" key={run.id}><time dateTime={run.createdAt}>{new Date(run.createdAt).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })}</time>{editing === run.id ? <div className="edit-row"><input aria-label="Edytuj liczbę skrzyń" value={value} onChange={(e) => setValue(e.target.value)} /><button className="small-button" onClick={() => save(run.id)} aria-label="Zapisz zmianę">Zapisz</button></div> : <strong>{run.chests} skrzyń</strong>}<div className="row-actions">{editing !== run.id && <button className="icon-button" onClick={() => { setEditing(run.id); setValue(String(run.chests)) }} aria-label="Edytuj run">Edytuj</button>}<button className="icon-button danger" onClick={() => onDelete(run.id)} aria-label="Usuń run">Usuń</button></div></div>)}</div>{pageCount > 1 && <div className="pagination"><button className="small-button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Poprzednia</button><span className="muted">Strona {currentPage + 1} z {pageCount}</span><button className="small-button" disabled={currentPage === pageCount - 1} onClick={() => setPage(currentPage + 1)}>Następna</button></div>}</>}</section>
}
