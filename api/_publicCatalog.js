import { propertyCollection, dataEnvironment } from './_properties.js';
import { publicProperty } from './_publicProperty.js';

const MAX_PROPERTIES = 500;
const CACHE_MS = 30000;
const RETRY_MS = 5000;
const caches = new WeakMap();

// One bounded snapshot per Firebase client/environment. Query strings never create cache entries.
export async function readPublicCatalog(db) {
  let environments = caches.get(db);
  if (!environments) {
    environments = new Map();
    caches.set(db, environments);
  }
  const environment = dataEnvironment();
  let state = environments.get(environment);
  if (!state) {
    state = { expires: 0, retryAt: 0, entries: null, pending: null, error: null };
    environments.set(environment, state);
  }
  if (state.entries && Date.now() < state.expires) return state.entries;
  if (state.pending) return state.pending;
  if (Date.now() < state.retryAt) throw state.error;

  state.pending = Promise.resolve().then(async () => {
    try {
      const snapshot = await propertyCollection(db).limit(MAX_PROPERTIES + 1).get();
      if (snapshot.docs.length > MAX_PROPERTIES) {
        throw Object.assign(new Error('Catalog requires pagination.'), { code: 'catalog-limit' });
      }
      state.entries = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          documentId: doc.id,
          property: publicProperty(data, doc.id),
          highlightPhoto: data.foto ?? data.imagens?.[0] ?? null,
        };
      });
      state.expires = Date.now() + (environment === 'production' ? CACHE_MS : 0);
      state.retryAt = 0;
      state.error = null;
      return state.entries;
    } catch (error) {
      state.error = error;
      state.retryAt = Date.now() + RETRY_MS;
      throw error;
    } finally {
      state.pending = null;
    }
  });
  return state.pending;
}
