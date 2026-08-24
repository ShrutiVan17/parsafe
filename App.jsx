import {useEffect,useState} from 'react'
import HoloHero from './components/HoloHero'
import ControlPanel from './components/ControlPanel'
import Recommendations from './components/Recommendations'
import Analytics from './components/Analytics'
import RagChat from './components/RagChat'
import MapPanel from './components/MapPanel'
import Architecture from './components/Architecture'

export default function App(){
 const [items,setItems]=useState([]),[selected,setSelected]=useState(null),[stats,setStats]=useState(null),[mode,setMode]=useState('LOCAL RETRIEVAL')
 const [prefs,setPrefs]=useState({maxWalk:10,risk:'any',occupancy:'any',type:'any'})
 const [scan,setScan]=useState(false)

 async function load(){
   const [r,s]=await Promise.all([fetch('/api/rank',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(prefs)}),fetch('/api/stats')])
   const rd=await r.json(), sd=await s.json()
   setItems(rd.items||[]);setSelected((rd.items||[])[0]||null);setStats(sd);setMode(rd.mode||'LOCAL RETRIEVAL')
 }
 useEffect(()=>{load().catch(()=>{})},[])
 function runScan(){setScan(true);load().finally(()=>setTimeout(()=>setScan(false),1100))}
 return <>
  <div className={`scan-overlay ${scan?'active':''}`}/>
  <header><div className="brand"><b>PS</b><span><strong>ParSafe Project</strong><small>GCP + RAG Parking Intelligence</small></span></div><nav><a href="#rank">Rank</a><a href="#analytics">Analytics</a><a href="#rag">RAG</a><a href="#map">Map</a></nav><span className="status">GCP READY</span></header>
  <main>
    <HoloHero onScan={runScan} mode={mode}/>
    <section className="section"><ControlPanel prefs={prefs} setPrefs={setPrefs} onApply={load}/></section>
    <section className="section" id="rank"><div className="section-title"><div className="eyebrow">EXPLAINABLE TOP 5</div><h2>Ranked recommendations</h2></div><Recommendations items={items} selected={selected} onSelect={setSelected}/></section>
    <section className="section" id="analytics"><Analytics stats={stats}/></section>
    <section className="section" id="rag"><RagChat onSources={()=>{}}/></section>
    <section className="section" id="map"><MapPanel items={items} selected={selected} onSelect={setSelected}/></section>
    <section className="section"><Architecture/></section>
  </main>
  <footer>ParSafe Project · React · Explainable Ranking · Retrieval · Vertex AI-ready</footer>
 </>
}