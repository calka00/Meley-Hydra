import { useState } from 'react'
import { advanceCoryStatus, getCoryStatus, getGameDateKey } from '../domain'

const DAY_OFFSETS = [{ key: 'yesterday', label: 'Wczoraj', offset: -1, editable: true }, { key: 'today', label: 'Dzisiaj', offset: 0, editable: true }, { key: 'tomorrow', label: 'Jutro', offset: 1, editable: false }]
const dateKeyOffset = (value, offset) => { const date = new Date(value); date.setDate(date.getDate() + offset); return getGameDateKey(date) }
const createId = () => globalThis.crypto?.randomUUID?.() || `character-${Date.now()}-${Math.random().toString(36).slice(2)}`

export default function CoryPanel({ cory, now, onChange }) {
  const [accountId, setAccountId] = useState(cory.accounts[0]?.id)
  const [dayKey, setDayKey] = useState('today')
  const day = DAY_OFFSETS.find((item) => item.key === dayKey)
  const dateKey = dateKeyOffset(now, day.offset)
  const account = cory.accounts.find((item) => item.id === accountId) || cory.accounts[0]
  const update = (change) => onChange({ ...cory, ...change })
  const updateAccount = (change) => update({ accounts: cory.accounts.map((item) => item.id === account.id ? { ...item, ...change } : item) })
  const addCharacter = () => { if (account.characters.length < 9) updateAccount({ characters: [...account.characters, { id: createId(), name: `Postać ${account.characters.length + 1}` }] }) }
  const setStatus = (characterId) => { const status = getCoryStatus(cory, dateKey, account.id, characterId); if (!day.editable || status === 'completed') return; const statuses = { ...cory.statuses, [dateKey]: { ...cory.statuses[dateKey], [account.id]: { ...cory.statuses[dateKey]?.[account.id], [characterId]: advanceCoryStatus(status) } } }; update({ statuses }) }
  return <section className="cory-panel"><div className="section-title"><div><p className="eyebrow">Codzienna lista</p><h2>Cory</h2></div><span className="muted">Doba gry: 02:00</span></div><div className="cory-tabs">{cory.accounts.map((item) => <button className={item.id === account.id ? 'small-button' : 'text-button'} key={item.id} onClick={() => setAccountId(item.id)}>{item.name}</button>)}</div><div className="cory-days">{DAY_OFFSETS.map((item) => <button className={item.key === dayKey ? 'small-button' : 'text-button'} key={item.key} onClick={() => setDayKey(item.key)}>{item.label}</button>)}</div><label htmlFor="cory-account-name">Nazwa konta</label><input id="cory-account-name" value={account.name} onChange={(event) => updateAccount({ name: event.target.value })}/><div className="cory-characters">{account.characters.map((character) => { const status = day.editable ? getCoryStatus(cory, dateKey, account.id, character.id) : ''; return <div className="cory-row" key={character.id}><input aria-label="Nazwa postaci" value={character.name} onChange={(event) => updateAccount({ characters: account.characters.map((item) => item.id === character.id ? { ...item, name: event.target.value } : item) })}/><button className={`cory-status cory-status-${status || 'empty'}`} disabled={!day.editable || status === 'completed'} onClick={() => setStatus(character.id)}>{status === 'received' ? 'Odebrane' : status === 'completed' ? 'Zrobione' : 'Puste'}</button></div>})}</div>{day.editable && account.characters.length < 9 && <button className="button accent" onClick={addCharacter}>Dodaj postać</button>}</section>
}
