// src/services/imovelService.js
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const salvarImovel = async (dados) => {
  const docRef = doc(db, "imoveis", dados.id);
  await setDoc(docRef, dados);
};