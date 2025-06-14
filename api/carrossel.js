// api/carrossel.js
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert } from "firebase-admin/app";
import serviceAccount from "../../backend/serviceAccountKey.json"; // ou onde estiver

const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection("carrossel").get();
    const imoveis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(imoveis);
  } catch (err) {
    console.error("Erro ao buscar imóveis:", err);
    res.status(500).json({ erro: "Erro ao buscar carrossel" });
  }
}
