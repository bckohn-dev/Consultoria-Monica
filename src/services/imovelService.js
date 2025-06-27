// src/services/imovelService.js
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from 'uuid';

const gerarIdSeguroComPrefixo = (prefixo = 'imv') => {
  const random = uuidv4().replace(/-/g, '').substring(0, 8);
  return `${prefixo}-${random}`;
};

const gerarIdUnico = async () => {
  let tentativa = 0;

  while (tentativa < 5) {
    const id = gerarIdSeguroComPrefixo();
    const docRef = doc(db, "imoveis", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return id;
    }

    tentativa++;
  }

  throw new Error("Não foi possível gerar um ID único após 5 tentativas.");
};

export const salvarImovel = async (dados) => {
  const docId = dados.id || await gerarIdUnico();
  const docRef = doc(db, "imoveis", docId);
  await setDoc(docRef, { ...dados, id: docId }); // Garante que o campo `id` também esteja no objeto
};
