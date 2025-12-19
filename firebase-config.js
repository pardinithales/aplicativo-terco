// Configuração do Firebase (Gerado automaticamente)
// NÃO EDITE MANUALMENTE - Use build-config.js

const firebaseConfig = {
  apiKey: "AIzaSyD39hFHFL35SVW6HAY-1nlyrX4zCiTWhqI",
  authDomain: "app-terco.firebaseapp.com",
  projectId: "app-terco",
  storageBucket: "app-terco.firebasestorage.app",
  messagingSenderId: "605327267124",
  appId: "1:605327267124:web:9bf18c6ce7d824b0b58161",
  measurementId: "G-BEXPMDYMY6"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obter referência do Firestore
const db = firebase.firestore();

console.log('✅ Firebase inicializado com sucesso!');
