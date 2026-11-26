import { readPublicCatalog } from './_staticCatalog.js';
import { preparePublicRequest, readFilters, matchesFilters, sendPublicData, publicFailure } from './_publicRequest.js';

export default async function handler(req, res) {
  try {
    if (!preparePublicRequest(req, res, ['quartos', 'precoMin', 'precoMax'])) return;
    const filters = readFilters(req.query);
    const catalog = await readPublicCatalog();
    return sendPublicData(req, res, catalog.map(entry => entry.property).filter(property => matchesFilters(property, filters, true)));
  } catch (error) {
    return publicFailure(res, error);
  }
}
