import fs from 'fs'
import {parkingData,textFor} from '../lib/data.js'
import {embedText,embeddingsFile} from '../lib/embeddings.js'
const out=[]
for(let i=0;i<parkingData.length;i++){
 console.log(`Embedding ${i+1}/${parkingData.length}: ${parkingData[i].name}`)
 const vector=await embedText(textFor(parkingData[i]),'RETRIEVAL_DOCUMENT')
 out.push({parking_id:parkingData[i].parking_id,vector})
}
fs.writeFileSync(embeddingsFile,JSON.stringify(out))
console.log(`Saved ${out.length} embeddings to ${embeddingsFile}`)
