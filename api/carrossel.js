import { storage } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  try {
    const bucket = storage.bucket();
    const [files] = await bucket.getFiles({ prefix: 'carrossel/' });

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
    console.error('Erro ao buscar imagens do carrossel:', error);
    return res.status(500).json({ erro: 'Erro ao buscar imagens' });
  }
}
