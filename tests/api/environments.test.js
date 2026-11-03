import { it, expect, vi, afterEach } from 'vitest'
import { propertyCollection, archiveCollectionName, imagePrefix, isPreview } from '../../api/_properties.js'
afterEach(() => vi.unstubAllEnvs())
it.each([
  ['production','imoveis','imoveis/',false],
  ['preview','imoveis_preview','imoveis-preview/',true],
  ['development','imoveis_dev','imoveis-dev/',true],
  ['', 'imoveis_dev','imoveis-dev/',true],
  ['unexpected','imoveis_dev','imoveis-dev/',true],
])('isolates data and image paths for environment %s', (env, collection, prefix, sandbox) => {
  vi.stubEnv('VERCEL_ENV',env)
  const db={collection:vi.fn()}
  propertyCollection(db)
  expect(db.collection).toHaveBeenCalledWith(collection)
  expect(archiveCollectionName()).toBe(collection+'_lixeira')
  expect(imagePrefix()).toBe(prefix)
  expect(isPreview()).toBe(sandbox)
})
