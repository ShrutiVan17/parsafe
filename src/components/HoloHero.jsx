import { motion } from 'framer-motion'
import { ScanSearch } from 'lucide-react'

export default function HoloHero({ onScan }) {
  return (
    <section className="hero">
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <div className="eyebrow">PARKING DECISION SYSTEM</div>
        <h1>Find the right spot <span>before you arrive.</span></h1>
        <p>ParSafe ranks parking options using walking time, occupancy, ticket risk and the saved parking score, then explains the result.</p>
        <button className="primary" onClick={onScan}><ScanSearch size={18}/>Run parking scan</button>
        <div className="badges"><span>React</span><span>Vite</span><span>Explainable ranking</span><span>Interactive analytics</span></div>
      </motion.div>

      <motion.div className="holo" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="holo-top"><div><small>PARSAFE VIEW</small><strong>Parking grid</strong></div><b>ACTIVE</b></div>
        <div className="world">
          <div className="road x"></div><div className="road y"></div>
          {[1,2,3,4,5].map(n => <div className={`slot s${n}`} key={n}>P{n}<i/></div>)}
          <div className="car"><div/><i/><i/></div>
          <div className="radar a"></div><div className="radar b"></div>
        </div>
        <div className="holo-bottom"><span>RETRIEVE → RANK → EXPLAIN</span><span>TOP 5 OUTPUT</span></div>
      </motion.div>
    </section>
  )
}
