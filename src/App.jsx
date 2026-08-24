import { useEffect, useState } from 'react'
import HoloHero from './components/HoloHero'
import Controls from './components/Controls'
import Recommendations from './components/Recommendations'
import Analytics from './components/Analytics'
import AskParSafe from './components/AskParSafe'
import { getStats, rankParking } from './api'
import { getStaticDemo, rankingKey } from './demo'

export default function App() {
  const [prefs, setPrefs] = useState({ maxWalk: 10, risk: 'any', occupancy: 'any', type: 'any' })
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [apiEnabled, setApiEnabled] = useState(false)
  const [staticDemo, setStaticDemo] = useState(null)
  const [mode, setMode] = useState('Loading')
  const [scan, setScan] = useState(false)

  const selected = items.find((item) => item.parking_id === selectedId) || items[0] || null

  async function loadInitial() {
    try {
      const [ranked, currentStats] = await Promise.all([rankParking(prefs), getStats()])
      setItems(ranked.items || [])
      setStats(currentStats)
      setApiEnabled(true)
      setMode('Python API')
    } catch {
      const demo = await getStaticDemo()
      setStaticDemo(demo)
      setItems(demo.rankingMatrix?.[rankingKey(prefs)] || [])
      setStats(demo.stats || null)
      setApiEnabled(false)
      setMode('Python-generated static demo')
    }
  }

  async function applyPreferences() {
    if (apiEnabled) {
      const ranked = await rankParking(prefs)
      setItems(ranked.items || [])
    } else {
      const demo = staticDemo || (await getStaticDemo())
      setStaticDemo(demo)
      setItems(demo.rankingMatrix?.[rankingKey(prefs)] || [])
    }
    setSelectedId(null)
  }

  useEffect(() => {
    loadInitial()
  }, [])

  function runScan() {
    setScan(true)
    applyPreferences().catch(() => {})
    setTimeout(() => setScan(false), 1100)
  }

  return (
    <>
      <div className={`scan-overlay ${scan ? 'active' : ''}`} />
      <header>
        <div className="brand"><b>PS</b><span><strong>ParSafe Project</strong><small>React + Python Parking Decision System</small></span></div>
        <nav><a href="#rank">Rank</a><a href="#analytics">Analytics</a><a href="#retrieval">Retrieval</a></nav>
        <span className="runtime-mode">{mode}</span>
      </header>
      <main>
        <HoloHero onScan={runScan} />
        <section className="section"><Controls prefs={prefs} setPrefs={setPrefs} onApply={applyPreferences} staticMode={!apiEnabled} /></section>
        <section className="section" id="rank">
          <div className="section-title"><div className="eyebrow">EXPLAINABLE TOP 5</div><h2>Ranked recommendations.</h2></div>
          <Recommendations items={items} selected={selected} onSelect={(item) => setSelectedId(item.parking_id)} />
        </section>
        <section className="section" id="analytics"><Analytics stats={stats} /></section>
        <section className="section" id="retrieval"><AskParSafe apiEnabled={apiEnabled} /></section>
      </main>
      <footer>ParSafe Project</footer>
    </>
  )
}
