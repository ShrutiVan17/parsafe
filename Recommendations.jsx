import { motion } from 'framer-motion'

export default function Recommendations({items,selected,onSelect}) {
  return <div className="recommend-layout">
    <div className="result-list">
      {items.map((x,i)=><motion.button key={x.parking_id} className={`result-card ${selected?.parking_id===x.parking_id?'active':''}`}
        onClick={()=>onSelect(x)} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*.05}}>
        <span className="rank">0{i+1}</span>
        <div><strong>{x.name}</strong><small>{x.address}</small></div>
        <div className="metric"><b>{x.walking_minutes} min</b><small>score {Number(x.parking_score).toFixed(3)}</small></div>
      </motion.button>)}
    </div>
    <aside className="explain-card">
      {selected && <>
        <div className="eyebrow">WHY THIS RANKING?</div>
        <h3>{selected.name}</h3><p>{selected.address}</p>
        <div className="factor-grid">
          <div><span>Walk</span><strong>{selected.walking_minutes} min</strong></div>
          <div><span>Occupancy</span><strong>{selected.occupancy_state}</strong></div>
          <div><span>Ticket risk</span><strong>{selected.ticket_risk}</strong></div>
          <div><span>Saved score</span><strong>{Number(selected.parking_score).toFixed(3)}</strong></div>
        </div>
        <div className="why-list">{(selected.explanation||[]).map((t,i)=><p key={i}><i>0{i+1}</i>{t}</p>)}</div>
        <small className="source-line">SOURCE · {selected.source}</small>
      </>}
    </aside>
  </div>
}