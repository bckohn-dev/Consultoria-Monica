// src/services/uploadImagem.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export const uploadImagem = async (arquivo, nomeArquivo) => {
  const storageRef = ref(storage, `imoveis/${nomeArquivo}`);
  await uploadBytes(storageRef, arquivo);
  const url = await getDownloadURL(storageRef);
  return url;
};