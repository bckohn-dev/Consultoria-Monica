import { createHash } from 'node:crypto';
import { publicProperty } from '../api/_publicProperty.js';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export function imageSource(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'firebasestorage.googleapis.com' || url.port || url.username || url.password || url.hash) throw new Error('Unsupported image source');
  const match = url.pathname.match(/^\/v0\/b\/([^/]+)\/o\/(.+)$/);
  if (!match) throw new Error('Unsupported image path');
  const bucket = decodeURIComponent(match[1]);
  if (!['catalogo-imoveis.firebasestorage.app', 'catalogo-imoveis.appspot.com', 'catalogo-imoveis-dev.firebasestorage.app'].includes(bucket)) throw new Error('Unsupported bucket');
  const object = decodeURIComponent(match[2]);
  if (!object || object.includes('\0') || !/^(imoveis(?:-preview|-dev)?|carrossel)\//.test(object)) throw new Error('Unsupported object');
  return { bucket, object, url: url.href };
}
export function imageExtension(bytes) {
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg';
  if (bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'png';
  if (bytes.subarray(0,4).toString() === 'RIFF' && bytes.subarray(8,12).toString() === 'WEBP') return 'webp';
  if (['GIF87a','GIF89a'].includes(bytes.subarray(0,6).toString())) return 'gif';
  throw new Error('Unsupported image content');
}
export async function boundedResponse(response) {
  if (!response.ok) throw new Error('Image unavailable');
  if (Number(response.headers.get('content-length')) > MAX_IMAGE_BYTES) throw new Error('Image too large');
  const chunks=[]; let length=0;
  for await (const chunk of response.body) {
    length += chunk.length;
    if (length > MAX_IMAGE_BYTES) { await response.body.cancel?.().catch(()=>{}); throw new Error('Image too large'); }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
export async function createSnapshot(documents, { readImage, writeImage, now = new Date().toISOString() }) {
  if (documents.length > 500) throw new Error('Catalog exceeds 500 properties');
  const cache = new Map(); let total=0, missingImages=0;
  async function copy(value) {
    if (!value || value === '/default-placeholder.jpg' || value === '/placeholder-carrossel.jpg') return value || '/default-placeholder.jpg';
    if (cache.has(value)) return cache.get(value);
    if (cache.size >= 200) throw new Error('Catalog exceeds 200 unique images');
    const source=imageSource(value);
    const bytes=await readImage(source);
    if (bytes === null) {
      missingImages++;
      cache.set(value,'/default-placeholder.jpg');
      return '/default-placeholder.jpg';
    }
    if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) throw new Error('Image size invalid');
    total+=bytes.length;
    if (total > 100*1024*1024) throw new Error('Catalog exceeds 100 MiB images');
    const name=createHash('sha256').update(bytes).digest('hex')+'.'+imageExtension(bytes);
    await writeImage(name, bytes);
    const path='/catalogo-publico/images/'+name;
    cache.set(value,path);
    return path;
  }
  const entries=[];
  for (const document of documents) {
    const raw=document.data(); const property=publicProperty(raw,document.id);
    const sourceCover=raw.foto || raw.imagens?.[0] || raw.fotos?.[0];
    property.foto=await copy(sourceCover);
    property.fotos=[];
    for (const photo of [...new Set(Array.isArray(raw.fotos) ? raw.fotos : [])]) property.fotos.push(await copy(photo));
    entries.push({documentId:document.id, property, highlightPhoto:property.foto});
  }
  const revision=createHash('sha256').update(JSON.stringify(entries)).digest('hex');
  const snapshot={schemaVersion:1, publishedAt:now, revision, missingImages, entries};
  if (Buffer.byteLength(JSON.stringify(snapshot)) > 2*1024*1024) throw new Error('Catalog exceeds 2 MiB JSON');
  return snapshot;
}
