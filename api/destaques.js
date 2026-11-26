import { db } from './_firebaseAdmin.js';
import { readPublicCatalog } from './_publicCatalog.js';
import { preparePublicRequest, sendPublicData, publicFailure } from './_publicRequest.js';

export default async function handler(req, res) {
  try {
    if (!preparePublicRequest(req, res, ['ordenar'])) return;
    const order = req.query?.ordenar ?? 'sim';
    if (!['sim', 'nao'].includes(order)) throw Object.assign(new Error('Ordenação inválida.'), { status: 400 });
    const catalog = await readPublicCatalog(db);
    const entries = catalog.filter(entry => entry.property.destaque === true && entry.highlightPhoto);
    if (order !== 'nao') entries.sort((a, b) => Number(a.property.destaqueOrdem || 0) - Number(b.property.destaqueOrdem || 0));
    const highlights = entries.map(entry => ({
      id: entry.property.id,
      nome: entry.property.nome ?? 'Imóvel',
      foto: entry.highlightPhoto,
      marca: String(entry.property.marca ?? '').trim().toLowerCase(),
    }));
    return sendPublicData(req, res, highlights);
  } catch (error) {
    return publicFailure(res, error);
  }
}
