import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
const mocks = vi.hoisted(() => ({ collection: vi.fn(), limit: vi.fn(), get: vi.fn(), getFiles: vi.fn(), getSignedUrl: vi.fn() }))
vi.mock('../../api/_firebaseAdmin.js', () => ({
  db: { collection: mocks.collection },
  storage: { bucket: () => ({ getFiles: mocks.getFiles }) },
}))
const documents = () => [
  { id: 'document-a', data: () => ({ id: 'public-slug', nome: 'Casa', preco: 300, quartos: 4, garagem: true, suite: false, destaque: true, destaqueOrdem: 1, foto: 'https://example.com/a.jpg', ownerEmail: 'private@example.com' }) },
  { id: 'document-b', data: () => ({ nome: 'Apartamento', preco: 100, quartos: 1, destaque: true, destaqueOrdem: 0, imagens: ['https://example.com/legacy.jpg'], marca: ' VIBRA ' }) },
]
const response = () => ({ setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn(), end: vi.fn() })
async function handlers() {
  return {
    list: (await import('../../api/imoveis.js')).default,
    detail: (await import('../../api/imoveis/[id].js')).default,
    highlights: (await import('../../api/destaques.js')).default,
    legacy: (await import('../../api/index.js')).default,
    carousel: (await import('../../api/carrossel.js')).default,
  }
}
beforeEach(() => {
  vi.resetModules(); vi.resetAllMocks()
  vi.stubEnv('VERCEL_ENV', 'production')
  vi.stubEnv('PUBLIC_CATALOG_ENABLED', '')
  vi.stubEnv('FIREBASE_STORAGE_ENABLED', 'true')
  mocks.collection.mockReturnValue({ limit: mocks.limit })
  mocks.limit.mockReturnValue({ get: mocks.get })
  mocks.get.mockResolvedValue({ docs: documents() })
  mocks.getFiles.mockResolvedValue([[{ name: 'carrossel/cover.jpg', getSignedUrl: mocks.getSignedUrl }]])
  mocks.getSignedUrl.mockResolvedValue(['https://example.com/signed.jpg'])
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); vi.useRealTimers() })

describe('Public Firebase cost boundaries', () => {
  it('coalesces 100 concurrent filtered requests into one bounded Firestore read', async () => {
    const { list } = await handlers()
    await Promise.all(Array.from({ length: 100 }, (_, index) => list({ query: { precoMin: String(index) } }, response())))
    expect(mocks.get).toHaveBeenCalledOnce()
    expect(mocks.limit).toHaveBeenCalledWith(501)
  })
  it('shares a snapshot across list, detail, highlights and legacy search while preserving contracts', async () => {
    const api = await handlers()
    const list = response(); await api.list({ query: { quartos: '3', garagem: 'true' } }, list)
    expect(list.json.mock.calls[0][0]).toEqual([expect.objectContaining({ id: 'public-slug', quartos: 4 })])
    expect(list.json.mock.calls[0][0][0].ownerEmail).toBeUndefined()
    const detail = response(); await api.detail({ url: '/api/imoveis/document-a', query: {} }, detail)
    expect(detail.json.mock.calls[0][0].id).toBe('public-slug')
    const slug = response(); await api.list({ query: { id: 'public-slug' } }, slug)
    expect(slug.json.mock.calls[0][0].nome).toBe('Casa')
    const highlights = response(); await api.highlights({ query: {} }, highlights)
    expect(highlights.json.mock.calls[0][0][0]).toMatchObject({ id: 'document-b', foto: 'https://example.com/legacy.jpg', marca: 'vibra' })
    const legacy = response(); await api.legacy({ query: { quartos: '3' } }, legacy)
    expect(legacy.json).toHaveBeenCalledWith([])
    expect(mocks.get).toHaveBeenCalledOnce()
  })
  it('does not read Firestore again for valid but nonexistent random IDs', async () => {
    const { detail } = await handlers()
    for (let index = 0; index < 100; index++) {
      const res = response(); await detail({ url: '/api/imoveis/missing-' + index, query: {} }, res)
      expect(res.status).toHaveBeenCalledWith(404)
    }
    expect(mocks.get).toHaveBeenCalledOnce()
  })
  it.each([{ cacheBust: 'random' }, { quartos: ['1', '2'] }, { precoMin: 'Infinity' }, { precoMin: '-1' }, { precoMin: '10x' }, { precoMin: '200', precoMax: '100' }, { quartos: '1.5' }, { suite: 'yes' }, { id: '../private' }])('rejects malformed or cache-busting input before Firebase: %j', async query => {
    const { list } = await handlers(); const res = response()
    await list({ query }, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(mocks.collection).not.toHaveBeenCalled()
    expect(res.setHeader).toHaveBeenCalledWith('Vercel-CDN-Cache-Control', 'no-store')
  })
  it('refreshes after the production TTL instead of keeping outdated data indefinitely', async () => {
    vi.useFakeTimers(); vi.setSystemTime(100000)
    const { list } = await handlers()
    await list({ query: {} }, response())
    vi.advanceTimersByTime(29999); await list({ query: {} }, response())
    expect(mocks.get).toHaveBeenCalledOnce()
    vi.advanceTimersByTime(2); await list({ query: {} }, response())
    expect(mocks.get).toHaveBeenCalledTimes(2)
  })
  it('coalesces failures, backs off and recovers after the retry interval', async () => {
    vi.useFakeTimers(); vi.setSystemTime(100000)
    mocks.collection.mockImplementationOnce(() => { throw new Error('internal failure') })
    const { list } = await handlers()
    const res = response(); await list({ query: {} }, res)
    expect(res.status).toHaveBeenCalledWith(503)
    await list({ query: { quartos: '2' } }, response())
    expect(mocks.collection).toHaveBeenCalledOnce()
    vi.advanceTimersByTime(5001)
    const recovered = response(); await list({ query: {} }, recovered)
    expect(recovered.status).toHaveBeenCalledWith(200)
    expect(mocks.get).toHaveBeenCalledOnce()
  })
  it('refuses oversized catalogs explicitly instead of silently truncating', async () => {
    mocks.get.mockResolvedValue({ docs: Array.from({ length: 501 }, () => documents()[0]) })
    const { list } = await handlers(); const res = response()
    await list({ query: {} }, res)
    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).not.toHaveBeenCalledWith(expect.any(Array))
  })
  it('returns cacheable public responses and bodyless HEAD responses', async () => {
    const { list } = await handlers(); const res = response()
    await list({ method: 'HEAD', query: {} }, res)
    expect(res.end).toHaveBeenCalledOnce()
    expect(res.json).not.toHaveBeenCalled()
    expect(res.setHeader).toHaveBeenCalledWith('Vercel-CDN-Cache-Control', 'public, s-maxage=30')
  })
  it('keeps nonproduction data fresh and separate from the production snapshot', async () => {
    const { list } = await handlers()
    await list({ query: {} }, response())
    vi.stubEnv('VERCEL_ENV', 'preview')
    await list({ query: {} }, response()); await list({ query: {} }, response())
    expect(mocks.collection).toHaveBeenCalledWith('imoveis_preview')
    expect(mocks.get).toHaveBeenCalledTimes(3)
  })
  it('can pause public Firebase reads without blocking administration', async () => {
    vi.stubEnv('PUBLIC_CATALOG_ENABLED', 'false')
    const api = await handlers()
    for (const handler of [api.list, api.detail, api.highlights, api.legacy, api.carousel]) {
      const res = response(); await handler({ query: {} }, res)
      expect(res.status).toHaveBeenCalledWith(503)
    }
    expect(mocks.collection).not.toHaveBeenCalled()
    expect(mocks.getFiles).not.toHaveBeenCalled()
  })
  it('rejects write methods on every public endpoint before Firebase access', async () => {
    const api = await handlers()
    for (const handler of Object.values(api)) {
      const res = response(); await handler({ method: 'POST', query: {} }, res)
      expect(res.status).toHaveBeenCalledWith(405)
    }
    expect(mocks.collection).not.toHaveBeenCalled()
    expect(mocks.getFiles).not.toHaveBeenCalled()
  })
})

describe('Legacy Storage endpoint costs', () => {
  it('bounds file listing, disables pagination, coalesces requests and signs for one hour', async () => {
    vi.useFakeTimers(); vi.setSystemTime(100000)
    const { carousel } = await handlers()
    await Promise.all(Array.from({ length: 30 }, () => carousel({ query: {} }, response())))
    expect(mocks.getFiles).toHaveBeenCalledOnce()
    expect(mocks.getFiles).toHaveBeenCalledWith({ prefix: 'carrossel/', autoPaginate: false, maxResults: 50 })
    expect(mocks.getSignedUrl).toHaveBeenCalledWith({ action: 'read', expires: 3700000 })
  })
  it('does not contact Storage when the sandbox has uploads disabled', async () => {
    vi.stubEnv('FIREBASE_STORAGE_ENABLED', 'false')
    const { carousel } = await handlers(); const res = response()
    await carousel({ query: {} }, res)
    expect(res.json).toHaveBeenCalledWith([])
    expect(mocks.getFiles).not.toHaveBeenCalled()
  })
})
