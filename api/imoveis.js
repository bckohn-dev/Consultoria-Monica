import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app;

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

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
