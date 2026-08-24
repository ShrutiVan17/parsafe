import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {parkingData} from './lib/data.js'
import {rankWithPrefs} from './lib/rank.js'
import {localRetrieve} from './lib/localRetriever.js'
import {vertexAnswer} from './lib/vertex.js'
import {embeddingRetrieve} from './lib/embeddings.js'
dotenv.config()
const app=express();app.use(cors());app.use(express.json())

app.get('/api/health',(req,res)=>res.json({ok:true,vertexGemini:process.env.USE_VERTEX_GEMINI==='true',vertexEmbeddings:process.env.USE_VERTEX_EMBEDDINGS==='true'}))

app.get('/api/stats',(req,res)=>{
 const count=k=>parkingData.reduce((a,x)=>(a[x[k]??'unknown']=(a[x[k]??'unknown']||0)+1,a),{})
 res.json({
   records:parkingData.length,
   avgWalk:(parkingData.reduce((s,x)=>s+Number(x.walking_minutes||0),0)/parkingData.length).toFixed(1),
   lowRisk:parkingData.filter(x=>String(x.ticket_risk).toLowerCase()==='low').length,
   available:parkingData.filter(x=>String(x.occupancy_state).toLowerCase()==='available').length,
   occupancy:count('occupancy_state'),risk:count('ticket_risk')
 })
})

app.post('/api/rank',(req,res)=>res.json({mode:'EXPLAINABLE RANKING',items:rankWithPrefs(parkingData,req.body||{})}))

app.post('/api/rag',async(req,res)=>{
 const query=String(req.body?.query||'').trim()
 if(!query)return res.status(400).json({error:'query required'})
 let docs,mode='LOCAL RETRIEVAL'
 try{
   if(process.env.USE_VERTEX_EMBEDDINGS==='true'){docs=await embeddingRetrieve(query,parkingData,5);mode='VERTEX EMBEDDING RETRIEVAL'}
   else docs=localRetrieve(parkingData,query,5)
 }catch(e){docs=localRetrieve(parkingData,query,5);mode='LOCAL RETRIEVAL FALLBACK'}
 let answer
 if(process.env.USE_VERTEX_GEMINI==='true'){
   try{answer=await vertexAnswer(query,docs);mode+=' + GEMINI'}
   catch(e){answer=null;mode+=' + LOCAL ANSWER FALLBACK'}
 }
 if(!answer){
   const b=docs[0],alts=docs.slice(1,3).map(x=>x.name).join(' and ')
   answer=b?`${b.name} is the strongest retrieved match. It is ${b.walking_minutes} minutes away, has ${b.ticket_risk} ticket risk, occupancy ${b.occupancy_state}, and saved score ${b.parking_score}.${alts?` Alternatives: ${alts}.`:''}`:'No matching record found.'
 }
 res.json({mode,answer,sources:docs.map(x=>({parking_id:x.parking_id,name:x.name,address:x.address,walking_minutes:x.walking_minutes,occupancy_state:x.occupancy_state,ticket_risk:x.ticket_risk,parking_score:x.parking_score,source:x.source}))})
})

app.listen(Number(process.env.PORT||8787),()=>console.log(`ParSafe API http://localhost:${process.env.PORT||8787}`))
