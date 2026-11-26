import { db } from '../_firebaseAdmin.js';
import { documentId } from '../_propertyValidation.js';
import { readPublicCatalog } from '../_publicCatalog.js';
import { preparePublicRequest, sendPublicData, publicFailure } from '../_publicRequest.js';

export default async function handler(req, res) {
  try {
    if (!preparePublicRequest(req, res, ['id'])) return;
    const match = (req.url || '').match(/\/api\/imoveis\/([^/?]+)/);
    let rawId;
    try { rawId = decodeURIComponent(match?.[1] || ''); }
    catch { throw Object.assign(new Error('Identificador inválido.'), { status: 400 }); }
    const id = documentId(rawId);
    const catalog = await readPublicCatalog(db);
    const entry = catalog.find(entry => entry.documentId === id);
    if (!entry) return sendPublicData(req, res, { error: 'Imóvel não encontrado.' }, 404);
    return sendPublicData(req, res, entry.property);
  } catch (error) {
    return publicFailure(res, error);
  }
}
