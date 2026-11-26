import { readFile } from 'node:fs/promises';
let pending;
export async function readStaticSnapshot() {
  pending ??= readFile(new URL('../public/catalogo-publico/catalogo.json',import.meta.url),'utf8').then(text=>{
    const snapshot=JSON.parse(text);
    if(snapshot.schemaVersion!==1 || !Array.isArray(snapshot.entries)) throw new Error('Invalid static catalog');
    return snapshot;
  }).catch(error=>{pending=undefined;throw error;});
  return pending;
}
export async function readPublicCatalog() { return (await readStaticSnapshot()).entries; }
