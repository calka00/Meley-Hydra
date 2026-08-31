export default function StatsPanel({ stats }) {
  return <section className="stats-panel"><div className="section-title"><div><p className="eyebrow">Hydra · statystyki</p><h2>Twój wynik</h2></div><span className="muted">Aktualizuje się po zapisie runa</span></div><div className="stats-grid"><div><strong>{stats.today}</strong><span>Dzisiaj</span></div><div><strong>{stats.average.toFixed(2)}</strong><span>Średnia / run</span></div><div><strong>{stats.total}</strong><span>Łącznie skrzyń</span></div><div><strong>{stats.runs}</strong><span>Runów</span></div></div></section>
}
