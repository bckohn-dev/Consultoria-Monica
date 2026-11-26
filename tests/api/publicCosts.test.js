import { describe,it,expect,vi,beforeEach,afterEach } from 'vitest';
import { publicProperty } from '../../api/_publicProperty.js';
const mocks=vi.hoisted(()=>({read:vi.fn()}));
vi.mock('../../api/_staticCatalog.js',()=>({readPublicCatalog:mocks.read}));
// Any import of the Admin SDK by a public route is a regression.
vi.mock('../../api/_firebaseAdmin.js',()=>{throw new Error('Public route touched Firebase');});
import list from '../../api/imoveis.js';
import detail from '../../api/imoveis/[id].js';
import highlights from '../../api/destaques.js';
import legacy from '../../api/index.js';
import carousel from '../../api/carrossel.js';
const response=()=>({setHeader:vi.fn(),status:vi.fn().mockReturnThis(),json:vi.fn(),end:vi.fn()});
beforeEach(()=>{
 vi.clearAllMocks();vi.stubEnv('VERCEL_ENV','production');vi.stubEnv('PUBLIC_CATALOG_ENABLED','true');
 mocks.read.mockResolvedValue([{documentId:'document-a',property:publicProperty({id:'slug',nome:'Casa',quartos:4,preco:300,garagem:true,destaque:true,ownerEmail:'private@example.com'},'document-a'),highlightPhoto:'/catalogo-publico/images/photo.jpg'}]);
});
afterEach(()=>vi.unstubAllEnvs());
describe('Static public cost boundary',()=>{
 it('serves 100 varied queries and random IDs without importing Firebase',async()=>{
  await Promise.all(Array.from({length:100},(_,i)=>list({query:{precoMin:String(i)}},response())));
  for(let i=0;i<20;i++){const res=response();await detail({url:'/api/imoveis/missing-'+i,query:{}},res);expect(res.status).toHaveBeenCalledWith(404);}
 });
 it('preserves filtered, slug/document, highlights and legacy contracts',async()=>{
  const res=response();await list({query:{quartos:'3',garagem:'true'}},res);
  expect(res.json).toHaveBeenCalledWith([expect.objectContaining({id:'slug'})]);
  expect(JSON.stringify(res.json.mock.calls)).not.toContain('ownerEmail');
  for(const id of ['slug','document-a']){const res=response();await detail({url:'/api/imoveis/'+id,query:{}},res);expect(res.json).toHaveBeenCalledWith(expect.objectContaining({id:'slug'}));}
  const h=response();await highlights({query:{}},h);expect(h.json.mock.calls[0][0][0].foto).toMatch(/^\/catalogo-publico\//);
  const old=response();await legacy({query:{quartos:'3'}},old);expect(old.json).toHaveBeenCalledWith([]);
  const c=response();await carousel({query:{}},c);expect(c.json).toHaveBeenCalledWith(['/catalogo-publico/images/photo.jpg']);
 });
 it.each([{cacheBust:'x'},{quartos:['1','2']},{precoMin:'Infinity'},{precoMin:'-1'},{precoMin:'200',precoMax:'100'},{quartos:'1.5'},{suite:'yes'},{id:'../private'}])('rejects malformed input before reading files: %j',async query=>{
  const res=response();await list({query},res);expect(res.status).toHaveBeenCalledWith(400);expect(mocks.read).not.toHaveBeenCalled();
 });
 it('blocks writes and supports HEAD',async()=>{
  for(const handler of [list,detail,highlights,legacy,carousel]){const res=response();await handler({method:'POST',query:{}},res);expect(res.status).toHaveBeenCalledWith(405);}
  expect(mocks.read).not.toHaveBeenCalled();const res=response();await list({method:'HEAD',query:{}},res);expect(res.end).toHaveBeenCalledOnce();expect(res.json).not.toHaveBeenCalled();
 });
});
