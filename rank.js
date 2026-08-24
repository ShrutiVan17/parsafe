function okRisk(item,risk){
 if(risk==='any') return true
 if(risk==='low') return String(item.ticket_risk).toLowerCase()==='low'
 if(risk==='medium') return ['low','medium'].includes(String(item.ticket_risk).toLowerCase())
 return true
}
function okOcc(item,occ){
 const s=String(item.occupancy_state).toLowerCase()
 if(occ==='any') return true
 if(occ==='available') return s==='available'
 if(occ==='not_occupied') return s!=='occupied'
 return true
}
export function rankWithPrefs(data,prefs={}){
 const maxWalk=Number(prefs.maxWalk||99),type=prefs.type||'any'
 let arr=data.filter(x=>Number(x.walking_minutes)<=maxWalk&&okRisk(x,prefs.risk||'any')&&okOcc(x,prefs.occupancy||'any')&&(type==='any'||x.parking_type===type))
 arr=arr.map(x=>{
   const exp=[]
   if(Number(x.walking_minutes)<=7) exp.push(`Short walking time at ${x.walking_minutes} minutes.`)
   if(String(x.ticket_risk).toLowerCase()==='low') exp.push('Ticket risk is marked low in the saved project data.')
   if(String(x.occupancy_state).toLowerCase()==='available') exp.push('Occupancy is currently marked available in the processed snapshot.')
   exp.push(`Saved ParSafe score is ${Number(x.parking_score).toFixed(3)}; lower scores rank ahead in this snapshot.`)
   return {...x,explanation:exp}
 })
 return arr.sort((a,b)=>Number(a.parking_score)-Number(b.parking_score)||Number(a.walking_minutes)-Number(b.walking_minutes)).slice(0,5)
}
