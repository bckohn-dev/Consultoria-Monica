import { describe, it, expect, vi, afterEach } from 'vitest'
const { collection } = vi.hoisted(() => ({ collection: vi.fn(() => { throw new Error('internal-only-diagnostic') }) }))
vi.mock('../../api/_firebaseAdmin.js', () => ({ db: { collection } }))
import search from '../../api/index.js'
import highlights from '../../api/destaques.js'
afterEach(() => vi.restoreAllMocks())
describe('Public API error responses', () => {
  it.each([search, highlights])('does not send internal error details to visitors', async handler => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    await handler({ query: {} }, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json.mock.calls[0][0]).toEqual({ error: expect.any(String) })
    expect(JSON.stringify(res.json.mock.calls)).not.toContain('internal-only-diagnostic')
  })
})
