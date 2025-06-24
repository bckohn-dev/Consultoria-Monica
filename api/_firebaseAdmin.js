import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const {
  FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_STORAGE_BUCKET,
} = process.env;

let app;
let privateKey = FIREBASE_ADMIN_PRIVATE_KEY;

// 🔄 Corrige formatação da chave privada (caso venha do Vercel com \\n)
if (privateKey?.includes('\\n')) {
  privateKey = privateKey.replace(/\\\\n/g, '\n');
}

if (!getApps().length) {
  console.log("🔐 Inicializando Firebase Admin...");
  app = initializeApp({
    credential: cert({
      projectId: FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
    storageBucket: FIREBASE_STORAGE_BUCKET,
  });
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
