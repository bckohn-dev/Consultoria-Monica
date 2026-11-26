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

export { readFilters, matchesFilters } from '../shared/catalogFilters.js';

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
