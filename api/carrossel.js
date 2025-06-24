import { storage } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  try {
    const bucket = storage.bucket();
    const [files] = await bucket.getFiles({ prefix: 'carrossel/' });
    console.log('📦 Arquivos encontrados:', files.length);

    if (!files.length) {
      return res.status(200).json([]);
    }

    const urls = await Promise.all(
      files.map(file =>
        file.getSignedUrl({
          action: 'read',
          expires: '03-01-2500',
        }).then(urls => urls[0])
      )
    );

    return res.status(200).json(urls);
  } catch (error) {
    console.error('❌ Firebase Admin erro no carrossel:', {
      message: error.message,
      stack: error.stack,
      custom: error?.errors || error, // mostra se o Firebase retornou objeto estranho
    });
    return res.status(500).json({ erro: 'Erro ao buscar imagens' });
  }

}
