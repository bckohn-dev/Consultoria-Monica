import { dataEnvironment } from './_properties.js';

const invalid = () => { throw Object.assign(new Error('Parâmetros de busca inválidos.'), { status: 400 }); };

export function preparePublicRequest(req, res, allowed) {
  res.setHeader?.('X-Content-Type-Options', 'nosniff');
  res.setHeader?.('Cache-Control', 'no-store');
  res.setHeader?.('Vercel-CDN-Cache-Control', 'no-store');
  if (req.method && !['GET', 'HEAD'].includes(req.method)) {
    res.setHeader?.('Allow', 'GET, HEAD');
    res.status(405).json({ error: 'Método não permitido.' });
    return false;
  }
  for (const [key, value] of Object.entries(req.query || {})) {
    if (!allowed.includes(key) || typeof value !== 'string' || value.length > 120) invalid();
  }
  if (process.env.PUBLIC_CATALOG_ENABLED === 'false') {
    res.setHeader?.('Retry-After', '300');
    res.status(503).json({ error: 'Catálogo temporariamente indisponível.' });
    return false;
  }
  return true;
}

export function readFilters(query = {}) {
  const filters = {};
  for (const key of ['quartos', 'precoMin', 'precoMax']) {
    if (query[key] === undefined || query[key] === '') continue;
    if (!/^\d+(?:\.\d+)?$/.test(query[key])) invalid();
    const value = Number(query[key]);
    if (!Number.isFinite(value) || value > 1e12) invalid();
    if (key === 'quartos' && (!Number.isInteger(value) || value > 50)) invalid();
    filters[key] = value;
  }
  if (filters.precoMin !== undefined && filters.precoMax !== undefined && filters.precoMin > filters.precoMax) invalid();
  for (const key of ['garagem', 'suite']) {
    if (query[key] === undefined) continue;
    if (!['true', 'false'].includes(query[key])) invalid();
    filters[key] = query[key] === 'true';
  }
  return filters;
}

export function matchesFilters(property, filters, legacySearch = false) {
  const rooms = Number(property.quartos);
  const price = Number(property.preco);
  if (filters.quartos !== undefined) {
    if (!legacySearch && filters.quartos === 3) {
      if (!(rooms >= 3)) return false;
    } else if (rooms !== filters.quartos) return false;
  }
  if (filters.precoMin !== undefined && !(price >= filters.precoMin)) return false;
  if (filters.precoMax !== undefined && !(price <= filters.precoMax)) return false;
  if (filters.garagem !== undefined && Boolean(property.vagaGaragem ?? property.garagem) !== filters.garagem) return false;
  if (filters.suite !== undefined && Boolean(property.suite) !== filters.suite) return false;
  return true;
}

export function sendPublicData(req, res, data, status = 200) {
  if (dataEnvironment() === 'production') {
    res.setHeader?.('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader?.('Vercel-CDN-Cache-Control', 'public, s-maxage=30');
  }
  if (req.method === 'HEAD') return res.status(status).end();
  return res.status(status).json(data);
}

export function publicFailure(res, error) {
  const status = error.status === 400 ? 400 : 503;
  if (status === 503) {
    res.setHeader?.('Retry-After', '5');
    console.error('Public catalog failure', error.code || 'internal');
  }
  return res.status(status).json({ error: status === 400 ? error.message : 'Catálogo temporariamente indisponível.' });
}
