import { db } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection('imoveis').get();
    const imoveis = [];

    snapshot.forEach(doc => {
      imoveis.push({ id: doc.id, ...doc.data() });
    });
    console.log("📦 Dados buscados do Firestore:", imoveis);
    res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    res.status(500).json({ error: 'Erro ao buscar imóveis.' });
  }
}
// Este endpoint busca todos os imóveis do Firestore e retorna como JSON