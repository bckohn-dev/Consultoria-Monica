import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Uncomment if used

const firebaseConfig = {
  apiKey: "AIzaSyDjp45m8QA6n6iAq_GnkvwjtSoMu2z0rDE",
  authDomain: "catalogo-imoveis.firebaseapp.com",
  projectId: "catalogo-imoveis",
  storageBucket: "catalogo-imoveis.appspot.com",
  messagingSenderId: "474028159075",
  appId: "1:474028159075:web:fdf95c32ee68efc4d78856",
  measurementId: "G-0V31KQH9YF"
};

// ✅ Rename this variable to avoid conflict
const firebaseApp = initializeApp(firebaseConfig);

// Optional analytics
// const analytics = getAnalytics(firebaseApp);

export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
