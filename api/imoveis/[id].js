import { propertyCollection } from '../_properties.js';
import { db } from '../_firebaseAdmin.js';

export default async function handler(req, res) {
  const { url = '' } = req;

  // 🧠 Extrai o ID da URL da requisição
  const matches = url.match(/\/api\/imoveis\/([^/?]+)/);
  const id = matches?.[1];


  if (!id) {
    return res.status(400).json({ error: 'ID do imóvel não fornecido.' });
  }

  try {
    const docRef = propertyCollection(db).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Imóvel não encontrado.' });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });

  } catch (error) {
    console.error('Erro ao buscar imóvel:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar imóvel.' });
  }
}
