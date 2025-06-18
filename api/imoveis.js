// api/imoveis.js
import { getFirestore } from 'firebase-admin/firestore';
import { app } from './_firebaseAdmin'; // seu init do Firebase Admin

const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection('imoveis').get();

    const imoveis = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return res.status(500).json({ error: 'Erro ao buscar imóveis' });
  }
}
