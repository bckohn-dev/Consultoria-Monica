import { getStorage } from "firebase-admin/storage";
import { getApps, initializeApp, cert } from "firebase-admin/app";

const {
  FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
} = process.env;

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    storageBucket: `${FIREBASE_ADMIN_PROJECT_ID}.appspot.com`,
  });
}

export default async function handler(req, res) {
  try {
    const bucket = getStorage().bucket();
    const [files] = await bucket.getFiles({ prefix: "carrossel/" });
    const urls = await Promise.all(
      files.map(file => file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500'
      }).then(urls => urls[0]))
    );
    res.status(200).json(urls);
  } catch (error) {
    console.error("Erro ao buscar imagens do carrossel:", error);
    res.status(500).json({ erro: "Erro ao buscar imagens" });
  }
}
