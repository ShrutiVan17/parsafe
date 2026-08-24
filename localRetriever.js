import {textFor} from './data.js'
export function localRetrieve(data,query,limit=5){
 const q=String(query||'').toLowerCase(),tokens=q.split(/\s+/).filter(x=>x.length>3)
 return data.map(x=>{
   let r=Math.max(0,6-Number(x.parking_score||6))
   const txt=textFor(x).toLowerCase()
   for(const t of tokens) if(txt.includes(t)) r+=.6
   if((q.includes('safe')||q.includes('low risk'))&&String(x.ticket_risk).toLowerCase()==='low')r+=4
   if((q.includes('available')||q.includes('open spot'))&&String(x.occupancy_state).toLowerCase()==='available')r+=5
   if((q.includes('short')||q.includes('near')||q.includes('close'))&&Number(x.walking_minutes)<=7)r+=3
   return {...x,_relevance:r}
 }).sort((a,b)=>b._relevance-a._relevance||Number(a.parking_score)-Number(b.parking_score)).slice(0,limit)
}
