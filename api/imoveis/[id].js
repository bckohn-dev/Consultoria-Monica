import { db } from '../_firebaseAdmin.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID do imóvel não fornecido.' });
  }

  try {
    const docRef = db.collection('imoveis').doc(id);
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
