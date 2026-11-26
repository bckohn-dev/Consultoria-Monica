import {describe,it,expect,vi} from 'vitest';
import {releaseData,readOrInitializeRelease} from '../../api/_catalogRelease.js';
describe('Frozen manual releases',()=>{
 it('captures only allowed fields and legacy covers',()=>{
  const release=releaseData([{id:'doc',data:()=>({nome:'Teste',imagens:['https://example.com/a.jpg'],privateNote:'private'})}],100);
  expect(release.records[0].property.foto).toBe('https://example.com/a.jpg');expect(JSON.stringify(release)).not.toContain('private');
 });
 it('rejects data beyond the single-document publication budget',()=>{
  expect(()=>releaseData([{id:'doc',data:()=>({descricao:'x'.repeat(820000)})}])).toThrow('tamanho');
 });
 it('uses the frozen release on code builds without reading working drafts',async()=>{
  const get=vi.fn(async()=>({exists:true,data:()=>({schemaVersion:1,records:[]})})),create=vi.fn(),limit=vi.fn();
  const db={collection:()=>({doc:()=>({}),limit}),runTransaction:fn=>fn({get,create})};
  await expect(readOrInitializeRelease(db)).resolves.toEqual({schemaVersion:1,records:[]});expect(get).toHaveBeenCalledOnce();expect(limit).not.toHaveBeenCalled();expect(create).not.toHaveBeenCalled();
 });
 it('initializes the baseline exactly once through an atomic transaction',async()=>{
  const get=vi.fn().mockResolvedValueOnce({exists:false}).mockResolvedValueOnce({docs:[]}),create=vi.fn();
  const db={collection:()=>({doc:()=>({}),limit:()=>({})}),runTransaction:fn=>fn({get,create})};
  await readOrInitializeRelease(db);expect(create).toHaveBeenCalledOnce();
 });
});
