import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Uncomment if used

const productionConfig = {
  apiKey: "AIzaSyDjp45m8QA6n6iAq_GnkvwjtSoMu2z0rDE",
  authDomain: "catalogo-imoveis.firebaseapp.com",
  projectId: "catalogo-imoveis",
  storageBucket: "catalogo-imoveis.appspot.com",
  messagingSenderId: "474028159075",
  appId: "1:474028159075:web:fdf95c32ee68efc4d78856",
  measurementId: "G-0V31KQH9YF"
};

// Public Firebase client settings; private Admin keys must never use VITE_ variables.
const firebaseConfig = import.meta.env.VITE_FIREBASE_CONFIG
  ? JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)
  : productionConfig;
if (!firebaseConfig.projectId || !firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.appId) {
  throw new Error('Configuração do Firebase incompleta para este ambiente.');
}
const firebaseApp = initializeApp(firebaseConfig);

// Optional analytics
// const analytics = getAnalytics(firebaseApp);


export { firebaseApp };
