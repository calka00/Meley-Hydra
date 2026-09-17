import { useState } from 'react'
import { advanceCoryStatus, getCoryStatus, getGameDateKey } from '../domain'

const DAY_COLUMNS = [
  { key: 'yesterday', label: 'Wczoraj', offset: -1, editable: true },
  { key: 'today', label: 'Dzisiaj', offset: 0, editable: true },
  { key: 'tomorrow', label: 'Jutro', offset: 1, editable: false },
]

const dateKeyOffset = (value, offset) => { const date = new Date(value); date.setDate(date.getDate() + offset); return getGameDateKey(date) }
const formatCoryDate = (dateKey) => new Date(`${dateKey}T12:00:00`).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' })
const createId = () => globalThis.crypto?.randomUUID?.() || `character-${Date.now()}-${Math.random().toString(36).slice(2)}`
const statusLabel = (status) => status === 'received' ? 'Odebrane' : status === 'completed' ? 'Zrobione' : 'Puste'

export default function CoryPanel({ cory, now, onChange }) {
  const [accountId, setAccountId] = useState(cory.accounts[0]?.id)
  const account = cory.accounts.find((item) => item.id === accountId) || cory.accounts[0]
  const update = (change) => onChange({ ...cory, ...change })
  const updateAccount = (change) => update({ accounts: cory.accounts.map((item) => item.id === account.id ? { ...item, ...change } : item) })
  const addCharacter = () => { if (account.characters.length < 9) updateAccount({ characters: [...account.characters, { id: createId(), name: `Postać ${account.characters.length + 1}` }] }) }
  const setStatus = (dateKey, characterId, editable) => {
    if (!editable) return
    const status = getCoryStatus(cory, dateKey, account.id, characterId)
    if (status === 'completed') return
    update({ statuses: { ...cory.statuses, [dateKey]: { ...cory.statuses[dateKey], [account.id]: { ...cory.statuses[dateKey]?.[account.id], [characterId]: advanceCoryStatus(status) } } } })
  }
  return <section className="cory-panel"><div className="section-title"><div><p className="eyebrow">Codzienna lista</p><h2>Cory</h2></div><span className="muted">Doba gry: 02:00</span></div><div className="cory-tabs">{cory.accounts.map((item) => <button className={item.id === account.id ? 'small-button' : 'text-button'} key={item.id} onClick={() => setAccountId(item.id)}>{item.name}</button>)}</div><label htmlFor="cory-account-name">Nazwa konta</label><input id="cory-account-name" value={account.name} onChange={(event) => updateAccount({ name: event.target.value })}/><div className="cory-table-wrap"><table className="cory-table"><thead><tr><th>Postać</th>{DAY_COLUMNS.map((day) => <th key={day.key}>{day.label}<small>{formatCoryDate(dateKeyOffset(now, day.offset))}</small></th>)}</tr></thead><tbody>{account.characters.map((character) => <tr key={character.id}><th><input aria-label="Nazwa postaci" value={character.name} onChange={(event) => updateAccount({ characters: account.characters.map((item) => item.id === character.id ? { ...item, name: event.target.value } : item) })}/></th>{DAY_COLUMNS.map((day) => { const dateKey = dateKeyOffset(now, day.offset); const status = day.editable ? getCoryStatus(cory, dateKey, account.id, character.id) : ''; return <td key={day.key}><button className={`cory-status cory-status-${status || 'empty'}`} disabled={!day.editable || status === 'completed'} onClick={() => setStatus(dateKey, character.id, day.editable)}>{statusLabel(status)}</button></td> })}</tr>)}</tbody></table></div>{account.characters.length < 9 && <button className="button accent" onClick={addCharacter}>Dodaj postać</button>}</section>
}
