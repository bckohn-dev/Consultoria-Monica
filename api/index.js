import { publicProperty } from './_publicProperty.js';
import { propertyCollection } from './_properties.js';
// api/index.js
import { db } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  res.setHeader?.('X-Content-Type-Options','nosniff');
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader?.('Allow','GET, HEAD');
    return res.status(405).json({ error:'Método não permitido.' });
  }
  try {
    const { quartos, precoMin, precoMax } = req.query;

    let query = propertyCollection(db);

    if (quartos) query = query.where('quartos', '==', parseInt(quartos));
    if (precoMin) query = query.where('preco', '>=', parseFloat(precoMin));
    if (precoMax) query = query.where('preco', '<=', parseFloat(precoMax));

    const snapshot = await query.get();
    const imoveis = snapshot.docs.map(doc => (publicProperty(doc.data(), doc.id)));

    res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao acessar Firestore:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
}
// This API endpoint retrieves properties from Firestore based on query parameters.