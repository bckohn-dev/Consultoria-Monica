import { releaseReference, releaseQuery, releaseData } from './_catalogRelease.js';
import { dataEnvironment } from './_properties.js';
const fail=(message,status)=>Object.assign(new Error(message),{status});
export function publishHook() {
  try {
    const url=new URL(process.env.CATALOG_PUBLISH_HOOK || '');
    if(url.protocol!=='https:' || url.host!=='api.vercel.com' || url.username || url.password || url.search || url.hash || !/^\/v1\/integrations\/deploy\/prj_[A-Za-z0-9]+\/[A-Za-z0-9_-]+$/.test(url.pathname)) return null;
    return url.href;
  }catch{return null;}
}
export async function publishCatalog(db,{now=Date.now(),request=fetch}={}) {
  const hook=publishHook();
  if(!hook) throw fail('A publicação ainda precisa ser configurada neste ambiente.',503);
  const reference=db.collection('catalog_publications').doc(dataEnvironment());
  await db.runTransaction(async tx=>{
    const snapshot=await tx.get(reference);
    const previous=snapshot.exists ? snapshot.data() : {};
    const day=new Date(now).toISOString().slice(0,10);
    const count=previous.day===day ? Number(previous.count||0) : 0;
    if(Number.isFinite(previous.lastAttempt) && now-previous.lastAttempt<120000) throw fail('Aguarde dois minutos antes de publicar novamente.',429);
    if(count>=10) throw fail('Limite diário de 10 publicações atingido. Tente amanhã.',429);
    const catalog=await tx.get(releaseQuery(db));
    const release=releaseData(catalog.docs,now);
    // Reserve before the network call. An ambiguous timeout must not trigger an automatic duplicate deployment.
    tx.set(reference,{day,count:count+1,lastAttempt:now});
    tx.set(releaseReference(db),release);
  });
  try {
    const response=await request(hook,{method:'POST',redirect:'error',signal:AbortSignal.timeout(15000)});
    if(!response.ok) throw new Error('Deploy hook rejected');
    const result=await response.json();
    if(!result?.job?.id || !['PENDING','RUNNING','QUEUED','READY'].includes(result.job.state)) throw new Error('Invalid deployment acknowledgement');
    return {requested:true};
  } catch {
    throw fail('Não foi possível confirmar a publicação. Confira os deployments no Vercel antes de tentar novamente.',503);
  }
}
