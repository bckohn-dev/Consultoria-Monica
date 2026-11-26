import {describe,it,expect,vi,beforeEach} from 'vitest';
import axios from 'axios';
import {catalogApi} from '../catalogApi.js';
vi.mock('axios');
beforeEach(()=>{vi.clearAllMocks();axios.get.mockResolvedValue({data:{schemaVersion:1,entries:[{documentId:'doc',property:{id:'slug',quartos:4,preco:200,destaque:true},highlightPhoto:'/catalogo-publico/images/x.jpg'}]}});});
describe('CDN visitor reads',()=>{
 it('uses only the static URL, with local filtering and both detail identifiers',async()=>{
  expect((await catalogApi.get('/api/imoveis',{params:{quartos:'3'}})).data).toHaveLength(1);
  expect((await catalogApi.get('/api/imoveis',{params:{precoMin:'300'}})).data).toEqual([]);
  for(const id of ['slug','doc']) expect((await catalogApi.get('/api/imoveis/'+id)).data.id).toBe('slug');
  expect((await catalogApi.get('/destaques')).data[0].foto).toMatch(/^\/catalogo-publico\//);
  for(const call of axios.get.mock.calls){expect(call[0]).toBe('/catalogo-publico/catalogo.json');expect(call[1].params).toBeUndefined();}
 });
 it('rejects missing IDs and invalid snapshots without API fallback',async()=>{
  await expect(catalogApi.get('/api/imoveis/missing')).rejects.toThrow();
  axios.get.mockResolvedValue({data:'HTML'});await expect(catalogApi.get('/api/imoveis')).rejects.toThrow();
 });
});
