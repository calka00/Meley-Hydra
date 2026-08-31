import { formatYang, PRICE_ALERT_THRESHOLD } from '../domain'

export default function ChestValuePanel({ priceKk, unsold, value, onPriceChange, onSell }) {
  const alert = unsold >= PRICE_ALERT_THRESHOLD
  return <section className={`value-panel ${alert ? 'threshold' : ''}`}>
    <div className="value-copy"><p className="eyebrow">Magazyn Hydry</p><h2>Wartość skrzyń</h2><p className="muted">Cena ręczna, w milionach yang.</p></div>
    <div className="value-fields"><label htmlFor="price">Cena skrzyni</label><strong className="price-display">{priceKk ? `${priceKk.replace('.', ',')}kk` : 'Brak ceny'}</strong><div className="price-input"><input id="price" inputMode="decimal" value={priceKk} onChange={(event) => onPriceChange(event.target.value)} placeholder="np. 37,5"/><span>kk</span></div></div>
    <div className="value-number"><span>Do sprzedania</span><strong>{unsold} szt.</strong></div>
    <div className="value-number"><span>Aktualny zarobek</span><strong>{formatYang(value)}</strong></div>
    <div className="value-actions">{alert && <p className="threshold-copy">Masz 40+ skrzyń. Czas na sprzedaż.</p>}<button className="small-button danger" onClick={onSell}>Sprzedane / wyzeruj</button></div>
  </section>
}
