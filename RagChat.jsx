import { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'

export default function RagChat({onSources}) {
  const [q,setQ]=useState('Find me a low-risk parking option within 7 minutes walking')
  const [answer,setAnswer]=useState('')
  const [loading,setLoading]=useState(false)
  const [mode,setMode]=useState('')

  async function ask(){
    if(!q.trim()) return
    setLoading(true)
    try{
      const r=await fetch('/api/rag',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:q})})
      const d=await r.json()
      setAnswer(d.answer||'No answer returned.')
      setMode(d.mode||'local')
      onSources?.(d.sources||[])
    }catch(e){setAnswer('API not running. Start the Node server on port 8787.');setMode('offline')}
    finally{setLoading(false)}
  }

  return <section className="rag">
    <div className="rag-head"><div><div className="eyebrow">GROUNDED AI</div><h2>Ask ParSafe</h2></div><Sparkles/></div>
    <div className="prompt"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask()}/><button onClick={ask}><Send size={16}/>{loading?'Retrieving...':'Ask'}</button></div>
    <div className="answer"><small>ANSWER MODE · {mode||'ready'}</small><p>{answer||'ParSafe retrieves parking records first, then answers from that context.'}</p></div>
  </section>
}