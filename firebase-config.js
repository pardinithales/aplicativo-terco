// Configuração do Firebase
// Credenciais do projeto app-terco

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
