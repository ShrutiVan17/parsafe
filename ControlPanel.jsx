export default function ControlPanel({prefs,setPrefs,onApply}) {
  const set = (k,v)=>setPrefs(p=>({...p,[k]:v}))
  return <section className="controls">
    <div><div className="eyebrow">DECISION CONTROLS</div><h2>Tell ParSafe what matters.</h2></div>
    <div className="control-grid">
      <label>Max walk
        <input type="range" min="4" max="15" value={prefs.maxWalk} onChange={e=>set('maxWalk',Number(e.target.value))}/>
        <strong>{prefs.maxWalk} min</strong>
      </label>
      <label>Risk
        <select value={prefs.risk} onChange={e=>set('risk',e.target.value)}>
          <option value="any">Any</option><option value="low">Low only</option><option value="medium">Low + medium</option>
        </select>
      </label>
      <label>Occupancy
        <select value={prefs.occupancy} onChange={e=>set('occupancy',e.target.value)}>
          <option value="any">Any</option><option value="available">Available</option><option value="not_occupied">Not occupied</option>
        </select>
      </label>
      <label>Type
        <select value={prefs.type} onChange={e=>set('type',e.target.value)}>
          <option value="any">Any</option><option value="street_meter">Street meter</option><option value="garage_or_lot">Garage / lot</option>
        </select>
      </label>
      <button onClick={onApply}>Re-rank options</button>
    </div>
  </section>
}