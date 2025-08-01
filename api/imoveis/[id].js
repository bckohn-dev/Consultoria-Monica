// api/imoveis/[id].js
import Cors from 'cors';
import initMiddleware from '../_initMiddleware';
import { db } from '../_firebaseAdmin.js';

const cors = initMiddleware(Cors({ origin: 'https://consultoria-monica.vercel.app' }));

export default async function handler(req, res) {
   // 1) Método
  if (req.method !== 'GET') {
    res.setHeader('Allow','GET');
    return res.status(405).end('Method Not Allowed');
  }

  // 2) CORS
  await cors(req, res);

  // 3) Security headers (Helmet-like)
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self';");

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID do imóvel não fornecido.' });
  }

  try {
    const snapshot = await db
      .collection('imoveis')
      .where('id', '==', id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Imóvel não encontrado.' });
    }

    const doc = snapshot.docs[0];
    return res.status(200).json({ id: doc.id, ...doc.data() });

  } catch (error) {
    console.error('Erro ao buscar imóvel:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar imóvel.' });
  }
}
