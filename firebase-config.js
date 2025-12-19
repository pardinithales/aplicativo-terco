// Configuração do Firebase
// IMPORTANTE: Credenciais reais estão em .env (não versionado)
// Para desenvolvimento local, copie .env.example para .env

const firebaseConfig = {
  apiKey: "SEU_API_KEY",
  authDomain: "app-terco.firebaseapp.com",
  projectId: "app-terco",
  storageBucket: "app-terco.firebasestorage.app",
  messagingSenderId: "605327267124",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obter referência do Firestore
const db = firebase.firestore();

// Configurar para usar cache ilimitado
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Habilitar persistência offline
db.enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('⚠️ Persistência: Múltiplas abas abertas');
    } else if (err.code == 'unimplemented') {
      console.warn('⚠️ Persistência: Navegador não suporta');
    }
  });

console.log('✅ Firebase inicializado com sucesso!');
