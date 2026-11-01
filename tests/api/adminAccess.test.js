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
