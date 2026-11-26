const invalid = () => { throw Object.assign(new Error('Parâmetros de busca inválidos.'), { status: 400 }); };

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

