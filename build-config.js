// Script de build para injetar variáveis de ambiente
// Executado pelo Vercel antes do deploy

const fs = require('fs');
const path = require('path');

// Tentar carregar do .env primeiro (local)
let config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Se não houver env vars, usar valores do .env file
if (!config.apiKey && fs.existsSync('.env')) {
  console.log('📄 Carregando credenciais do .env...');
  const envContent = fs.readFileSync('.env', 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });

  config = {
    apiKey: envVars.FIREBASE_API_KEY,
    authDomain: envVars.FIREBASE_AUTH_DOMAIN,
    projectId: envVars.FIREBASE_PROJECT_ID,
    storageBucket: envVars.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: envVars.FIREBASE_MESSAGING_SENDER_ID,
    appId: envVars.FIREBASE_APP_ID,
    measurementId: envVars.FIREBASE_MEASUREMENT_ID
  };
}

// Gerar arquivo firebase-config.js
const configContent = `// Configuração do Firebase (Gerado automaticamente)
// NÃO EDITE MANUALMENTE - Use build-config.js

const firebaseConfig = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}",
  messagingSenderId: "${config.messagingSenderId}",
  appId: "${config.appId}",
  measurementId: "${config.measurementId}"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obter referência do Firestore
const db = firebase.firestore();

// Configurar para usar cache ilimitado
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Persistência offline desabilitada temporariamente para debug
// db.enablePersistence()
//   .catch((err) => {
//     if (err.code == 'failed-precondition') {
//       console.warn('⚠️ Persistência: Múltiplas abas abertas');
//     } else if (err.code == 'unimplemented') {
//       console.warn('⚠️ Persistência: Navegador não suporta');
//     }
//   });

console.log('✅ Firebase inicializado com sucesso!');
`;

fs.writeFileSync('firebase-config.js', configContent);
console.log('✅ firebase-config.js gerado com credenciais!');
