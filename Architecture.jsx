export default function Architecture(){
  const s=[['01','React UI','Preferences, rankings, analytics, map and chat.'],['02','Retriever','Heuristic or Vertex embedding retrieval over parking records.'],['03','Ranker','Saved score + user constraints produce explainable top candidates.'],['04','Grounding','Only retrieved parking records are passed into the answer prompt.'],['05','Gemini','Vertex AI generates a concise grounded recommendation when enabled.']]
  return <section className="architecture"><div className="eyebrow">SYSTEM ARCHITECTURE</div><h2>Real GCP upgrade path.</h2>
    <div className="arch-grid">{s.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
    <div className="cloud-band"><div><strong>Vertex AI Workbench</strong><small>original development</small></div><div><strong>Gemini on Vertex AI</strong><small>grounded generation</small></div><div><strong>gemini-embedding-001</strong><small>semantic retrieval</small></div><div><strong>Secret Manager</strong><small>secrets / credentials</small></div><div><strong>Cloud Scheduler</strong><small>refresh jobs</small></div></div>
  </section>
}