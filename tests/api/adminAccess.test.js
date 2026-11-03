import { describe,it,expect,vi,beforeEach,afterEach } from 'vitest'
const verifyIdToken=vi.hoisted(()=>vi.fn())
vi.mock('../../api/_firebaseAdmin.js',()=>({app:{}}))
vi.mock('firebase-admin/auth',()=>({getAuth:()=>({verifyIdToken})}))
import { requireAdmin } from '../../api/_adminAccess.js'
beforeEach(()=>{vi.stubEnv('ADMIN_EMAILS','owner@example.com');vi.clearAllMocks()})
afterEach(()=>vi.unstubAllEnvs())
describe('Admin authorization',()=>{
  it('denies access when allowlist is missing',async()=>{vi.stubEnv('ADMIN_EMAILS','');await expect(requireAdmin({headers:{}})).rejects.toMatchObject({status:503})})
  it('rejects absent and invalid tokens',async()=>{
    await expect(requireAdmin({headers:{}})).rejects.toMatchObject({status:401})
    verifyIdToken.mockRejectedValue(new Error('bad-token'))
    await expect(requireAdmin({headers:{authorization:'Bearer forged'}})).rejects.toMatchObject({status:401})
  })
  it.each([{email:'stranger@example.com',email_verified:true},{email:'owner@example.com',email_verified:false}])('denies unauthorized or unverified account',async user=>{
    verifyIdToken.mockResolvedValue(user)
    await expect(requireAdmin({headers:{authorization:'Bearer token'}})).rejects.toMatchObject({status:403})
  })
  it('checks token revocation and admits only the verified allowed account',async()=>{
    verifyIdToken.mockResolvedValue({uid:'owner',email:'owner@example.com',email_verified:true})
    expect((await requireAdmin({headers:{authorization:'Bearer token'}})).uid).toBe('owner')
    expect(verifyIdToken).toHaveBeenCalledWith('token',true)
  })
})

describe('Cross-site request protections',()=>{
 it.each(['development','preview','production'])('allows local HTTP only during development: %s',async environment=>{
  vi.stubEnv('VERCEL_ENV',environment)
  verifyIdToken.mockResolvedValue({uid:'owner',email:'owner@example.com',email_verified:true})
  const request={headers:{origin:'http://localhost:3000',host:'localhost:3000',authorization:'Bearer token'}}
  if(environment==='development') expect((await requireAdmin(request)).uid).toBe('owner')
  else await expect(requireAdmin(request)).rejects.toMatchObject({status:403})
 })
 it('rejects cross-origin requests even with a token',async()=>{
  await expect(requireAdmin({headers:{origin:'https://attacker.invalid',host:'catalog.example',authorization:'Bearer token'}})).rejects.toMatchObject({status:403})
 })
 it('rejects opaque origins',async()=>{
  await expect(requireAdmin({headers:{origin:'null',host:'catalog.example',authorization:'Bearer token'}})).rejects.toMatchObject({status:403})
 })
})
