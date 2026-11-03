import { describe, it, expect, vi, afterEach } from 'vitest'
const sdk = vi.hoisted(() => ({
  cert: vi.fn(value => value),
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
}))
vi.mock('firebase-admin/app', () => sdk)
vi.mock('firebase-admin/firestore', () => ({ getFirestore: vi.fn(() => ({})) }))
vi.mock('firebase-admin/storage', () => ({ getStorage: vi.fn(() => ({})) }))
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); vi.resetModules() })
describe('Firebase private key formatting', () => {
  it('refuses credentials for a different project before initializing the SDK', async () => {
    vi.stubEnv('FIREBASE_EXPECTED_PROJECT_ID', 'catalogo-imoveis-dev')
    vi.stubEnv('FIREBASE_ADMIN_PROJECT_ID', 'catalogo-imoveis')
    await expect(import('../../api/_firebaseAdmin.js')).rejects.toThrow('Firebase project does not match')
    expect(sdk.initializeApp).not.toHaveBeenCalled()
  })
  it.each(['first\nsecond', 'first\\nsecond', 'first\\\\nsecond'])('normalizes line endings without changing key content', async value => {
    vi.stubEnv('FIREBASE_ADMIN_PRIVATE_KEY', value)
    await import('../../api/_firebaseAdmin.js')
    expect(sdk.cert.mock.calls[0][0].privateKey).toBe('first\nsecond')
  })
})


describe('Preview Firebase isolation', () => {
  it.each(['catalogo-imoveis', ''])('refuses unsafe or missing Preview project %s', async project => {
    vi.stubEnv('VERCEL_ENV', 'preview')
    vi.stubEnv('FIREBASE_ADMIN_PROJECT_ID', project)
    vi.stubEnv('FIREBASE_EXPECTED_PROJECT_ID', '')
    await expect(import('../../api/_firebaseAdmin.js')).rejects.toThrow('Preview requires isolated')
    expect(sdk.initializeApp).not.toHaveBeenCalled()
  })
  it('accepts the isolated Dev project in Preview', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview')
    vi.stubEnv('FIREBASE_ADMIN_PROJECT_ID', 'catalogo-imoveis-dev')
    vi.stubEnv('FIREBASE_EXPECTED_PROJECT_ID', 'catalogo-imoveis-dev')
    await import('../../api/_firebaseAdmin.js')
    expect(sdk.cert).toHaveBeenCalledWith(expect.objectContaining({projectId:'catalogo-imoveis-dev'}))
  })
  it('preserves Production project initialization', async () => {
    vi.stubEnv('VERCEL_ENV', 'production')
    vi.stubEnv('FIREBASE_ADMIN_PROJECT_ID', 'catalogo-imoveis')
    vi.stubEnv('FIREBASE_EXPECTED_PROJECT_ID', 'catalogo-imoveis')
    await import('../../api/_firebaseAdmin.js')
    expect(sdk.initializeApp).toHaveBeenCalledOnce()
  })
})
