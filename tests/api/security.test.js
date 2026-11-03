import { describe,it,expect,vi,afterEach } from 'vitest'
import { publicProperty } from '../../api/_publicProperty.js'
import { documentId,propertyInput,imageInput } from '../../api/_propertyValidation.js'
import { limitAdminWrites } from '../../api/_adminRateLimit.js'
afterEach(()=>vi.unstubAllEnvs())
describe('Attack regression tests',()=>{
 it('does not expose notes, contact details, credentials or extra nested fields',()=>{
  const out=publicProperty({nome:'Imóvel',preco:100,ownerEmail:'private@example.com',notes:'internal',privateKey:'secret',nested:{token:'secret'}},'safe-id')
  expect(out).toEqual({id:'safe-id',nome:'Imóvel',preco:100})
 })
 it.each(['../imoveis','a/b','%2e%2e','<script>','a'.repeat(121),['safe','unsafe']])('rejects path and ID injection: %s',id=>{
  expect(()=>documentId(id)).toThrow()
 })
 it('keeps rate limits across requests and rejects further writes',async()=>{
  let state;const set=vi.fn((ref,value)=>{state=value})
  const db={collection:vi.fn(()=>({doc:vi.fn(()=>({}))})),runTransaction:async fn=>fn({get:async()=>({exists:!!state,data:()=>state}),set})}
  vi.stubEnv('VERCEL_ENV','preview')
  for(let n=0;n<60;n++) await limitAdminWrites(db,'owner',1000)
  await expect(limitAdminWrites(db,'owner',1000)).rejects.toMatchObject({status:429})
  expect(state.count).toBe(60)
  await limitAdminWrites(db,'owner',61001)
  expect(state.count).toBe(1)
 })
})
