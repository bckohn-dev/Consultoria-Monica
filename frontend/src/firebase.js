import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjp45m8QA6n6iAq_GnkvwjtSoMu2z0rDE",
  authDomain: "catalogo-imoveis.firebaseapp.com",
  projectId: "catalogo-imoveis",
  storageBucket: "catalogo-imoveis.firebasestorage.app",
  messagingSenderId: "474028159075",
  appId: "1:474028159075:web:fdf95c32ee68efc4d78856",
  measurementId: "G-0V31KQH9YF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);