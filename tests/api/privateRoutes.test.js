import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
const { routes } = JSON.parse(readFileSync('vercel.json', 'utf8'))
describe('Reserved entry hosting policy', () => {
  it('sends noindex and no-store only for reserved entry paths', () => {
    const route = routes.find(r => r.src?.includes('gestao-monica'))
    const pattern = new RegExp(`^${route.src}$`)
    expect(pattern.test('/gestao-monica')).toBe(true)
    expect(pattern.test('/gestao-monica/imoveis')).toBe(true)
    expect(pattern.test('/catalogo')).toBe(false)
    expect(pattern.test('/')).toBe(false)
    expect(route.headers['X-Robots-Tag']).toContain('noindex')
    expect(route.headers['Cache-Control']).toBe('private, no-store')
  })
  it('returns 404 for legacy admin entry URLs', () => {
    const route = routes.find(r => r.src?.includes('admin|login'))
    expect(route.status).toBe(404)
    expect(route.dest).toBe('/index.html')
  })
})
