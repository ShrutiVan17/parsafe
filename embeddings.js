import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'
import aiplatform from '@google-cloud/aiplatform'
const {PredictionServiceClient}=aiplatform.v1
const {helpers}=aiplatform
const __dirname=path.dirname(fileURLToPath(import.meta.url))
const embedPath=path.join(__dirname,'..','embeddings.json')

function cosine(a,b){let dot=0,aa=0,bb=0;for(let i=0;i<a.length;i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i]}return dot/(Math.sqrt(aa)*Math.sqrt(bb)||1)}

export async function embedText(content,task='QUESTION_ANSWERING'){
 const project=process.env.GOOGLE_CLOUD_PROJECT,location='us-central1',model=process.env.EMBEDDING_MODEL||'gemini-embedding-001'
 const client=new PredictionServiceClient({apiEndpoint:`${location}-aiplatform.googleapis.com`})
 const endpoint=`projects/${project}/locations/${location}/publishers/google/models/${model}`
 const instance=helpers.toValue({content,task_type:task})
 const [response]=await client.predict({endpoint,instances:[instance],parameters:helpers.toValue({})})
 const obj=response.predictions[0].structValue.fields.embeddings.structValue.fields.values.listValue.values
 return obj.map(v=>v.numberValue)
}

export async function embeddingRetrieve(query,data,limit=5){
 if(!fs.existsSync(embedPath)) throw new Error('embeddings.json not built')
 const stored=JSON.parse(fs.readFileSync(embedPath,'utf-8'))
 const qv=await embedText(query,'QUESTION_ANSWERING')
 return stored.map((e,i)=>({...data[i],_similarity:cosine(qv,e.vector)})).sort((a,b)=>b._similarity-a._similarity).slice(0,limit)
}
export const embeddingsFile=embedPath
