import {GoogleGenAI} from '@google/genai'

export async function vertexAnswer(query,docs){
 const project=process.env.GOOGLE_CLOUD_PROJECT
 if(!project) throw new Error('GOOGLE_CLOUD_PROJECT is not configured')
 const client=new GoogleGenAI({vertexai:true,project,location:process.env.GOOGLE_CLOUD_LOCATION||'global'})
 const context=docs.map((d,i)=>`[${i+1}] ${d.name} | ${d.address} | walk ${d.walking_minutes} min | occupancy ${d.occupancy_state} | risk ${d.ticket_risk} | score ${d.parking_score} | source ${d.source}`).join('\n')
 const prompt=`You are the ParSafe parking recommendation assistant.
Answer ONLY from the retrieved parking context below. Do not invent availability, prices, ratings, or live conditions.
If the context does not support something, say that it is unknown.
Give one best recommendation and up to two alternatives. Briefly explain why.

User question:
${query}

Retrieved parking context:
${context}`
 const response=await client.models.generateContent({model:process.env.GEMINI_MODEL||'gemini-2.5-flash',contents:prompt})
 return response.text
}
