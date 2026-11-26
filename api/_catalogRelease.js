import { propertyCollection, dataEnvironment } from './_properties.js';
import { publicProperty } from './_publicProperty.js';
export const releaseReference=db=>db.collection('catalog_releases').doc(dataEnvironment());
export function releaseData(documents,now=Date.now()) {
  if(documents.length>500) throw Object.assign(new Error('O catálogo excede o limite de 500 imóveis.'),{status:400});
  const records=documents.map(doc=>{
    const raw=doc.data();const property=publicProperty(raw,doc.id);
    property.foto ||= raw.imagens?.[0] || raw.fotos?.[0] || '/default-placeholder.jpg';
    return {documentId:doc.id,property};
  });
  // Below Firestore's 1 MiB document limit, including field overhead.
  if(Buffer.byteLength(JSON.stringify(records))>800*1024) throw Object.assign(new Error('O catálogo excede o tamanho permitido para publicação.'),{status:400});
  return {schemaVersion:1,capturedAt:now,records};
}
export function releaseQuery(db) {return propertyCollection(db).limit(501);}
export async function readOrInitializeRelease(db) {
  const ref=releaseReference(db);
  // One-time migration captures the current public baseline. Later code deployments
  // always use this frozen release, never unapproved edits in the working collection.
  return db.runTransaction(async tx=>{
    const existing=await tx.get(ref);
    if(existing.exists) return existing.data();
    const snapshot=await tx.get(releaseQuery(db));
    const release=releaseData(snapshot.docs);
    tx.create(ref,release);
    return release;
  });
}
