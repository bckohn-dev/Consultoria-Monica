// /api/destaques.js
import { db } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  try {
    let query = db.collection('imoveis').where('destaque', '==', true);
    // opcional: ordenar
    if (req.query.ordenar !== 'nao') query = query.orderBy('destaqueOrdem', 'asc');

    const snap = await query.get();
    const destaques = snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,        // slug público já usado por /api/imoveis/[id]
        nome: data.nome,
        foto: data.foto,
      };
    });

    return res.status(200).json(destaques);
  } catch (e) {
    console.error('Erro ao buscar destaques:', e);
    return res.status(500).json({ error: 'Erro ao buscar destaques' });
  }
}
