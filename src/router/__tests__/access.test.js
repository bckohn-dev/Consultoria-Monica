import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { createSiteRouter } from '../index.js'
import { OWNER_ENTRY_PATH, OWNER_PANEL_PATH } from '../../config/adminRoutes.js'
const auth = vi.hoisted(() => ({ currentUser: null, authStateReady: vi.fn(), adminRequest: vi.fn() }))
vi.mock('../../services/adminApi', () => ({ adminAuth: auth, adminRequest: auth.adminRequest }))
vi.mock('../../views/LoginPage.vue', () => ({ default: { template: '<div>Login</div>' } }))
vi.mock('../../views/AdminPage.vue', () => ({ default: { template: '<div>Admin</div>' } }))
vi.mock('../../views/HomePage.vue', () => ({ default: { template: '<div>Home</div>' } }))
vi.mock('../../views/NotFoundPage.vue', () => ({ default: { template: '<div>Not found</div>' } }))
beforeEach(() => {
  vi.resetAllMocks()
  window.scrollTo = vi.fn()
  auth.currentUser = null
  document.head.querySelectorAll('meta[data-route-privacy]').forEach(node => node.remove())
})
const router = () => createSiteRouter(createMemoryHistory())
describe('Reserved admin navigation', () => {
  it('redirects signed-out visitors without requesting privileged data', async () => {
    const r = router(); await r.push(OWNER_PANEL_PATH)
    expect(r.currentRoute.value.path).toBe(OWNER_ENTRY_PATH)
    expect(auth.adminRequest).not.toHaveBeenCalled()
  })
  it('refuses an authenticated account rejected by the API', async () => {
    auth.currentUser = { uid: 'not-owner' }
    auth.adminRequest.mockRejectedValue(new Error('Forbidden'))
    const r = router(); await r.push(OWNER_PANEL_PATH)
    expect(r.currentRoute.value.path).toBe(OWNER_ENTRY_PATH)
  })
  it('opens the panel only after a successful server session check', async () => {
    auth.currentUser = { uid: 'owner' }
    auth.adminRequest.mockResolvedValue({ email: 'owner@example.com' })
    const r = router(); await r.push(OWNER_PANEL_PATH)
    expect(r.currentRoute.value.name).toBe('Admin')
    expect(auth.adminRequest).toHaveBeenCalledWith('get', {params:{action:'session'}})
  })
  it('fails closed when Firebase initialization fails', async () => {
    auth.authStateReady.mockRejectedValue(new Error('Unavailable'))
    const r = router(); await r.push(OWNER_PANEL_PATH)
    expect(r.currentRoute.value.path).toBe(OWNER_ENTRY_PATH)
  })
  it.each(['/admin','/login','/admin/anything','/unknown'])('does not expose a panel at %s', async path => {
    const r = router(); await r.push(path)
    expect(r.currentRoute.value.name).toBe('NotFound')
    expect(auth.adminRequest).not.toHaveBeenCalled()
  })
  it('limits route-owned noindex metadata to private or missing pages', async () => {
    const r = router(); await r.push(OWNER_ENTRY_PATH)
    expect(document.head.querySelector('meta[data-route-privacy]').content).toContain('noindex')
    await r.push('/')
    expect(document.head.querySelector('meta[data-route-privacy]')).toBeNull()
  })
})
