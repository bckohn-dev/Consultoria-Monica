import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {publishHook,publishCatalog} from '../../api/_publishCatalog.js';
const hook='https://api.vercel.com/v1/integrations/deploy/prj_Fictitious/test_token';
let state,db,request;
beforeEach(()=>{
 vi.stubEnv('CATALOG_PUBLISH_HOOK',hook);vi.stubEnv('VERCEL_ENV','preview');state={};
 db={collection:vi.fn(()=>({doc:vi.fn(()=>({id:'preview'})),limit:()=>({query:true})})),runTransaction:async action=>action({get:async ref=>ref.query ? {docs:[]} : {exists:true,data:()=>state},set:(_ref,value)=>{if(value.day)state=value;}})};
 request=vi.fn(async()=>({ok:true,json:async()=>({job:{id:'test',state:'PENDING'}})}));
});
afterEach(()=>vi.unstubAllEnvs());
describe('Manual publication',()=>{
 it.each(['','http://api.vercel.com/v1/integrations/deploy/prj_X/x','https://evil.test/x',hook+'?leak=1',hook+'#x',hook.replace('https://','https://user:secret@')])('rejects invalid secret/SSRF target',value=>{vi.stubEnv('CATALOG_PUBLISH_HOOK',value);expect(publishHook()).toBeNull();});
 it('reserves a shared environment quota and never returns hook credentials',async()=>{
  const result=await publishCatalog(db,{request,now:1000000});expect(result).toEqual({requested:true});
  expect(state.count).toBe(1);expect(request.mock.calls[0][1]).toMatchObject({method:'POST',redirect:'error'});
  await expect(publishCatalog(db,{request,now:1000001})).rejects.toMatchObject({status:429});expect(request).toHaveBeenCalledOnce();
 });
 it('blocks more than ten deployments per UTC day',async()=>{
  state={day:'1970-01-01',count:10,lastAttempt:1};await expect(publishCatalog(db,{request,now:1000000})).rejects.toMatchObject({status:429});expect(request).not.toHaveBeenCalled();
 });
 it('does not retry ambiguous failures or leak sensitive errors',async()=>{
  request.mockRejectedValue(new Error(hook));await expect(publishCatalog(db,{request,now:1000000})).rejects.toMatchObject({status:503});expect(state.count).toBe(1);
  await expect(publishCatalog(db,{request,now:1000001})).rejects.toMatchObject({status:429});expect(request).toHaveBeenCalledOnce();
 });
});
