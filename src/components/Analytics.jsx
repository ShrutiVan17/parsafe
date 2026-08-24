export default function Analytics({ stats }) {
  if (!stats) return null

  return (
    <section className="analytics">
      <div className="section-title">
        <div className="eyebrow">ANALYTICS</div>
        <h2>Parking snapshot.</h2>
      </div>
      <div className="kpis">
        <div><small>RECORDS</small><strong>{stats.records}</strong></div>
        <div><small>AVG WALK</small><strong>{stats.avgWalk} min</strong></div>
        <div><small>LOW RISK</small><strong>{stats.lowRisk}</strong></div>
        <div><small>AVAILABLE</small><strong>{stats.available}</strong></div>
      </div>
    </section>
  )
}
