import { motion } from 'framer-motion'
import { ScanSearch, CloudCog, BrainCircuit } from 'lucide-react'

export default function HoloHero({onScan, mode}) {
  return <section className="hero">
    <motion.div className="hero-copy" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}>
      <div className="eyebrow">GCP + RETRIEVAL + EXPLAINABLE DECISIONS</div>
      <h1>Parking intelligence <span>you can question.</span></h1>
      <p>ParSafe retrieves relevant parking records, explains the ranking, and can ground Gemini on Vertex AI in the same parking context.</p>
      <div className="hero-actions">
        <button className="primary" onClick={onScan}><ScanSearch size={18}/>Run parking scan</button>
        <span className="mode-pill"><BrainCircuit size={15}/>{mode}</span>
      </div>
      <div className="hero-badges">
        <span>React + Vite</span><span>Node + Express</span><span>Vertex AI Gemini</span><span>Vertex Embeddings</span><span>Google Maps-ready</span>
      </div>
    </motion.div>

    <motion.div className="holo-shell" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{delay:.15}}>
      <div className="holo-head"><div><small>PARSAFE DIGITAL TWIN</small><strong>Parking decision grid</strong></div><div className="live-dot">ACTIVE</div></div>
      <div className="holo-grid">
        <div className="road road-x"></div><div className="road road-y"></div>
        {[1,2,3,4,5].map(n=><div key={n} className={`slot s${n}`}>P{n}<i/></div>)}
        <div className="car"><div/><i/><i/></div>
        <div className="radar r1"></div><div className="radar r2"></div>
        <div className="gcp-float"><CloudCog size={14}/><span>VERTEX AI</span></div>
      </div>
      <div className="holo-foot"><span>RETRIEVE → RANK → EXPLAIN → GENERATE</span><span>GROUNDED MODE</span></div>
    </motion.div>
  </section>
}