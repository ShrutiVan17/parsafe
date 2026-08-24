import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'
const __dirname=path.dirname(fileURLToPath(import.meta.url))
const pathToData=path.join(__dirname,'..','..','data','parsafe_agent_ready_data.json')
export const parkingData=JSON.parse(fs.readFileSync(pathToData,'utf-8'))
export function textFor(x){return `${x.name}. ${x.address}. Type ${x.parking_type}. Occupancy ${x.occupancy_state}. Ticket risk ${x.ticket_risk}. Walking ${x.walking_minutes} minutes. Score ${x.parking_score}. Source ${x.source}. ${x.parking_summary||''}`}
