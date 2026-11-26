import { db } from './_firebaseAdmin.js';
import { documentId } from './_propertyValidation.js';
import { readPublicCatalog } from './_publicCatalog.js';
import { preparePublicRequest, readFilters, matchesFilters, sendPublicData, publicFailure } from './_publicRequest.js';

export default async function handler(req, res) {
  try {
    if (!preparePublicRequest(req, res, ['id', 'quartos', 'precoMin', 'precoMax', 'garagem', 'suite'])) return;
    const query = req.query || {};
    const id = query.id === undefined ? null : documentId(query.id);
    const filters = readFilters(query);
    const catalog = await readPublicCatalog(db);
    if (id) {
      const entry = catalog.find(entry => entry.property.id === id);
      if (!entry) return sendPublicData(req, res, { error: 'Imóvel não encontrado.' }, 404);
      return sendPublicData(req, res, entry.property);
    }
    return sendPublicData(req, res, catalog.map(entry => entry.property).filter(property => matchesFilters(property, filters)));
  } catch (error) {
    return publicFailure(res, error);
  }
}
