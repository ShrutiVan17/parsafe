import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Analytics({stats}) {
  if(!stats) return null
  const occ = Object.entries(stats.occupancy||{}).map(([name,value])=>({name,value}))
  const risk = Object.entries(stats.risk||{}).map(([name,value])=>({name,value}))
  return <section className="analytics">
    <div className="section-title"><div className="eyebrow">ANALYTICS LAYER</div><h2>What the parking snapshot says.</h2></div>
    <div className="kpis">
      <div><small>RECORDS</small><strong>{stats.records}</strong></div>
      <div><small>AVG WALK</small><strong>{stats.avgWalk} min</strong></div>
      <div><small>LOW RISK</small><strong>{stats.lowRisk}</strong></div>
      <div><small>AVAILABLE</small><strong>{stats.available}</strong></div>
    </div>
    <div className="chart-grid">
      <article><h3>Occupancy</h3><ResponsiveContainer width="100%" height={220}><BarChart data={occ}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value"/></BarChart></ResponsiveContainer></article>
      <article><h3>Ticket risk</h3><ResponsiveContainer width="100%" height={220}><BarChart data={risk}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value"/></BarChart></ResponsiveContainer></article>
    </div>
  </section>
}