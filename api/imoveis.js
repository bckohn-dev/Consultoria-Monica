import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const {
  FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
} = process.env;

if (!FIREBASE_ADMIN_PROJECT_ID || !FIREBASE_ADMIN_CLIENT_EMAIL || !FIREBASE_ADMIN_PRIVATE_KEY) {
  console.error("🚨 Variáveis de ambiente do Firebase não configuradas corretamente!");
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection("imoveis").get();
    const imoveis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(imoveis);
  } catch (err) {
    console.error("Erro ao buscar imóveis:", err);
    res.status(500).json({ erro: "Erro ao buscar imóveis" });
  }
}
