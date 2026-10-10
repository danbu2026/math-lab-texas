export const TRACKED_KEYS=['mathlab-pilot-v1','mathlab-fraction-v1','mathlab-place-v1','mathlab-addition-v1','texas-math-lab-v1','mathlab-portal-rewards'];
const LEARNER_BUNDLE_KEYS=new Set(['mathlab-pilot-v1','mathlab-fraction-v1','mathlab-place-v1','mathlab-addition-v1']);

function json(value){try{return JSON.parse(value)}catch{return null}}
function time(value){const n=typeof value==='number'?value:Date.parse(value||'');return Number.isFinite(n)?n:0}

export function inferTimestamp(key,value){
  const data=json(value);if(!data)return 0;
  if(key==='mathlab-pilot-v1'||key==='mathlab-fraction-v1'||key==='mathlab-place-v1'||key==='mathlab-addition-v1')return Math.max(time(data.a?.updatedAt),time(data.b?.updatedAt));
  if(key==='texas-math-lab-v1'){
    const entries=Object.values(data.profiles||{}).flatMap(profile=>Object.entries(profile||{}).filter(([name])=>/^[a-z]+-[012]$/.test(name)).map(([,entry])=>entry));
    const meaningful=entries.some(entry=>entry&&(entry.attempts||entry.sessions||entry.errors||entry.independent||entry.supported||entry.note));
    return meaningful?Math.max(1,...entries.map(entry=>time(entry?.last))):0;
  }
  if(key==='mathlab-portal-rewards')return Object.keys(data).length?1:0;
  return 0;
}

export function mergeItems(localItems={},remoteItems={}){
  const merged={},download=[],upload=[];
  for(const key of TRACKED_KEYS){
    const local=localItems[key],remote=remoteItems[key];
    if(!local&&!remote)continue;
    if(local&&remote&&LEARNER_BUNDLE_KEYS.has(key)){
      const localData=json(local.value),remoteData=json(remote.value);
      if(localData&&remoteData){
        const pick=learner=>time(localData[learner]?.updatedAt)>=time(remoteData[learner]?.updatedAt)?localData[learner]:remoteData[learner];
        const value=JSON.stringify({...remoteData,...localData,a:pick('a')||{},b:pick('b')||{},learner:localData.learner||remoteData.learner||'a'});
        const item={value,updatedAt:Math.max(Number(local.updatedAt||0),Number(remote.updatedAt||0),time(localData.a?.updatedAt),time(localData.b?.updatedAt),time(remoteData.a?.updatedAt),time(remoteData.b?.updatedAt))};
        merged[key]=item;
        if(local.value!==value||Number(local.updatedAt||0)!==item.updatedAt)download.push(key);
        if(remote.value!==value||Number(remote.updatedAt||0)!==item.updatedAt)upload.push(key);
        continue;
      }
    }
    if(local&&(!remote||Number(local.updatedAt||0)>Number(remote.updatedAt||0))){merged[key]=local;upload.push(key)}
    else{merged[key]=remote;if(!local||local.value!==remote.value||Number(local.updatedAt||0)!==Number(remote.updatedAt||0))download.push(key)}
  }
  return{merged,download,upload};
}
