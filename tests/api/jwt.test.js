import { it,expect } from 'vitest'
import { initializeApp,deleteApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
it('real Firebase SDK rejects a forged unsigned administrator JWT',async()=>{
 const app=initializeApp({projectId:'catalogo-imoveis'},'security-audit-unsigned-jwt')
 const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url')
 const now=Math.floor(Date.now()/1000)
 const forged=encode({alg:'none',typ:'JWT'})+'.'+encode({iss:'https://securetoken.google.com/catalogo-imoveis',aud:'catalogo-imoveis',sub:'fake-owner',email:'owner@example.com',email_verified:true,iat:now,exp:now+3600})+'.forged'
 try {
  await expect(getAuth(app).verifyIdToken(forged,true)).rejects.toMatchObject({code:expect.stringMatching(/^auth\//)})
 } finally { await deleteApp(app) }
})
