import {describe,it,expect,vi} from 'vitest';
import {createSnapshot,imageSource,imageExtension,boundedResponse,MAX_IMAGE_BYTES} from '../../scripts/catalogSnapshot.mjs';
const source='https://firebasestorage.googleapis.com/v0/b/catalogo-imoveis.firebasestorage.app/o/imoveis%2Fphoto.jpg?alt=media&token=fictitious';
const jpeg=Buffer.from([255,216,255,0,0]);
const document=data=>({id:'test',data:()=>data});
describe('Catalog export trust boundaries',()=>{
 it('copies/deduplicates images and excludes secrets and original download tokens',async()=>{
  const readImage=vi.fn(async()=>jpeg),writeImage=vi.fn();
  const snapshot=await createSnapshot([document({nome:'FictÃ­cio',foto:source,fotos:[source,source],ownerEmail:'private@example.com',secret:'hidden'})],{readImage,writeImage});
  expect(readImage).toHaveBeenCalledOnce();expect(writeImage).toHaveBeenCalledOnce();
  expect(snapshot.entries[0].property.foto).toMatch(/^\/catalogo-publico\/images\/[a-f0-9]{64}\.jpg$/);
  expect(JSON.stringify(snapshot)).not.toMatch(/private@example|fictitious|hidden|googleapis/);
 });
 it('uses existing default cover without network',async()=>{
  const readImage=vi.fn();const snapshot=await createSnapshot([document({nome:'Sem foto'})],{readImage,writeImage:vi.fn()});
  expect(snapshot.entries[0].property.foto).toBe('/default-placeholder.jpg');expect(readImage).not.toHaveBeenCalled();
 });
 it.each(['http://127.0.0.1/a','https://evil.test/a',source.replace('catalogo-imoveis.firebasestorage.app','attacker.appspot.com'),source.replace('imoveis%2Fphoto.jpg','secret%2Fkey.json'),source.replace('https://','https://user:password@')])('blocks SSRF before network: %s',value=>{expect(()=>imageSource(value)).toThrow();});
 it('rejects SVG/HTML masquerading as an image',()=>{expect(()=>imageExtension(Buffer.from('<svg>'))).toThrow();});
 it('rejects oversized catalogs and images',async()=>{
  await expect(createSnapshot(Array(501).fill(document({})),{})).rejects.toThrow('500');
  await expect(createSnapshot([document({foto:source})],{readImage:async()=>Buffer.alloc(MAX_IMAGE_BYTES+1),writeImage:vi.fn()})).rejects.toThrow('size');
  await expect(boundedResponse(new Response('x',{headers:{'content-length':String(MAX_IMAGE_BYTES+1)}}))).rejects.toThrow('large');
 });
 it('fails publication on missing images rather than deploying a partial catalog',async()=>{
  await expect(createSnapshot([document({foto:source})],{readImage:async()=>{throw new Error('Unavailable');},writeImage:vi.fn()})).rejects.toThrow('Unavailable');
 });
});

it('records unavailable originals and uses the default without an external URL',async()=>{
 const snapshot=await createSnapshot([document({foto:source,fotos:[source]})],{readImage:async()=>null,writeImage:vi.fn()});
 expect(snapshot.missingImages).toBe(1);expect(snapshot.entries[0].property.foto).toBe('/default-placeholder.jpg');
 expect(JSON.stringify(snapshot)).not.toContain('googleapis');
});
