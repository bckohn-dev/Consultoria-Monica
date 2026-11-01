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
  it.each(['first\nsecond', 'first\\nsecond', 'first\\\\nsecond'])('normalizes line endings without changing key content', async value => {
    vi.stubEnv('FIREBASE_ADMIN_PRIVATE_KEY', value)
    await import('../../api/_firebaseAdmin.js')
    expect(sdk.cert.mock.calls[0][0].privateKey).toBe('first\nsecond')
  })
})
