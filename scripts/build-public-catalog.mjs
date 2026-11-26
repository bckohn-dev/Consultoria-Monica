import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createSnapshot, boundedResponse, MAX_IMAGE_BYTES } from './catalogSnapshot.mjs';

const output = new URL('../public/catalogo-publico/', import.meta.url);
await mkdir(new URL('images/', output), {recursive:true});
let documents, storage;
const fixture = process.argv.includes('--fixture');
if (fixture) {
  if (process.env.VERCEL || process.env.VERCEL_ENV) throw new Error('Fixture export is local only');
  // Explicit isolated UI fixture: no credentials, network, or production photos.
  documents=JSON.parse(await readFile(new URL('../fixtures/catalogo-dev.json',import.meta.url),'utf8')).map(data=>({id:data.id,data:()=>({...data,foto:'/default-placeholder.jpg',fotos:[]})}));
} else {
  const firebase = await import('../api/_firebaseAdmin.js');
  const {readOrInitializeRelease} = await import('../api/_catalogRelease.js');
  storage=firebase.storage;
  const release=await readOrInitializeRelease(firebase.db);
  if(release.schemaVersion!==1 || !Array.isArray(release.records)) throw new Error('Invalid frozen catalog release');
  documents=release.records.map(record=>({id:record.documentId,data:()=>record.property}));
}
const snapshot=await createSnapshot(documents, {
  async readImage(source) {
    if (source.bucket === process.env.FIREBASE_STORAGE_BUCKET && process.env.FIREBASE_STORAGE_ENABLED !== 'false') {
      const file=storage.bucket(source.bucket).file(source.object);
      const [metadata]=await file.getMetadata();
      if (Number(metadata.size) > MAX_IMAGE_BYTES) throw new Error('Image too large');
      const chunks=[];let length=0;
      for await(const chunk of file.createReadStream()) {length+=chunk.length;if(length>MAX_IMAGE_BYTES)throw new Error('Image too large');chunks.push(chunk);}
      return Buffer.concat(chunks);
    }
    // Dev has no billed Storage: reads only allowlisted public images, never Prod credentials.
    const response=await fetch(source.url,{redirect:'error',signal:AbortSignal.timeout(15000)});
    if ([403,404].includes(response.status)) { await response.body?.cancel(); return null; }
    return boundedResponse(response);
  },
  writeImage:(name,bytes)=>writeFile(new URL('images/'+name,output),bytes),
});
await writeFile(new URL('catalogo.json',output),JSON.stringify(snapshot));
console.log(`Static catalog exported: ${snapshot.entries.length} properties (${fileURLToPath(output)}).`);

if(snapshot.missingImages) console.warn(`Warning: ${snapshot.missingImages} unavailable images replaced with the existing default cover.`);
