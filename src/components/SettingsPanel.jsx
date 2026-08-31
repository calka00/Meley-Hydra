import { useRef, useState } from 'react'
import { parseBackup, serializeBackup } from '../domain'

export default function SettingsPanel({ state, onImport, onReset }) {
  const input = useRef(null); const [confirm, setConfirm] = useState(false); const [message, setMessage] = useState('')
  const exportData = () => { const blob = new Blob([serializeBackup(state)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'metin2-dungeon-tracker-backup.json'; link.click(); URL.revokeObjectURL(url); setMessage('Kopia została pobrana.') }
  const importData = async (event) => { const file = event.target.files?.[0]; if (!file) return; try { onImport(parseBackup(await file.text())); setMessage('Kopia została wczytana.') } catch (error) { setMessage(error.message) } event.target.value = '' }
  return <section className="settings"><div><p className="eyebrow">Dane lokalne</p><h2>Kopia zapasowa</h2><p className="muted">Dane pozostają tylko w tej przeglądarce.</p></div><div className="settings-actions"><button className="small-button" onClick={exportData}>Eksportuj JSON</button><button className="small-button" onClick={() => input.current?.click()}>Importuj JSON</button><input ref={input} type="file" accept="application/json" hidden onChange={importData}/>{confirm ? <button className="small-button danger" onClick={onReset}>Potwierdź wyczyszczenie</button> : <button className="small-button danger" onClick={() => setConfirm(true)}>Wyczyść dane</button>}</div>{message && <p className="feedback" role="status">{message}</p>}</section>
}
