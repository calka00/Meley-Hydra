export default function DungeonCard({ className = '', title, eyebrow, status, children }) {
  return <section className={`dungeon-card ${className}`}><div className="card-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><span className="status-dot" aria-label={status} /></div>{children}</section>
}
