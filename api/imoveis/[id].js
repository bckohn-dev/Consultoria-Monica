import { publicProperty } from '../_publicProperty.js';
import { propertyCollection } from '../_properties.js';
import { db } from '../_firebaseAdmin.js';

export default async function handler(req, res) {
  res.setHeader?.('X-Content-Type-Options','nosniff');
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader?.('Allow','GET, HEAD');
    return res.status(405).json({ error:'Método não permitido.' });
  }
  const { url = '' } = req;

  // 🧠 Extrai o ID da URL da requisição
  const matches = url.match(/\/api\/imoveis\/([^/?]+)/);
  let id;
  try { id = decodeURIComponent(matches?.[1] || ''); } catch { return res.status(400).json({error:'Identificador inválido.'}); }
  if (id && !/^[a-zA-Z0-9_-]{1,120}$/.test(id)) return res.status(400).json({error:'Identificador inválido.'});


  if (!id) {
    return res.status(400).json({ error: 'ID do imóvel não fornecido.' });
  }

  try {
    const docRef = propertyCollection(db).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Imóvel não encontrado.' });
    }

    return res.status(200).json(publicProperty(doc.data(), doc.id));

  } catch (error) {
    console.error('Erro ao buscar imóvel:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar imóvel.' });
  }
}
