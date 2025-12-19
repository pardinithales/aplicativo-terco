# 🔥 SETUP DO FIREBASE - PASSO A PASSO

## 📋 STATUS ATUAL

✅ Estrutura de código preparada  
✅ Firebase SDK adicionado ao HTML  
✅ Serviço FirebaseDB criado  
⏳ **AGUARDANDO: Credenciais do Firebase**

---

## 🚀 PASSOS PARA CONFIGURAR

### 1. Acessar Firebase Console
**URL:** https://console.firebase.google.com/project/app-terco

### 2. Adicionar Web App

1. No menu principal do projeto, clique no ícone **</>** (Web)
2. **Nome do app:** Sistema Terços Pastoral
3. ✅ Marque **"Also set up Firebase Hosting"** (opcional)
4. Clique em **"Registrar app"**

### 3. Copiar Credenciais

Você verá algo assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "app-terco.firebaseapp.com",
  projectId: "app-terco",
  storageBucket: "app-terco.firebasestorage.app",
  messagingSenderId: "605327267124",
  appId: "1:605327267124:web:XXXXXXXXXXXXXXXXXXX"
};
```

**👉 COPIE ESSAS CREDENCIAIS E PASSE PARA O CLAUDE!**

### 4. Ativar Firestore Database

1. Menu lateral → **Firestore Database**
2. Clique em **"Criar banco de dados"**
3. **Modo:** Produção (com regras de segurança)
4. **Localização:** `southamerica-east1` (São Paulo, Brasil)
5. Clique em **"Ativar"**

### 5. Configurar Regras de Segurança

No Firestore, vá na aba **"Regras"** e cole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita em todos os documentos
    // TEMPORÁRIO - ajustar depois com autenticação
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **IMPORTANTE:** Estas regras são abertas! Após implementar autenticação, ajustar para:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /grupos/{grupoId}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📁 ESTRUTURA DO FIRESTORE

```
firestore/
└── grupos/
    ├── sabado-19h30/
    │   ├── casaisPastoral/
    │   │   ├── [auto-id]/
    │   │   │   ├── nome1: "Ana Letícia"
    │   │   │   ├── nome2: "Alexandre"
    │   │   │   ├── telefone: "17 99000-0001"
    │   │   │   └── cadastroEm: Timestamp
    │   │   └── ...
    │   ├── familiasSorteadas/
    │   │   ├── [auto-id]/
    │   │   │   ├── nome: "Família Silva"
    │   │   │   ├── telefone: "17 99123-4567"
    │   │   │   ├── endereco: "Rua X, 123"
    │   │   │   ├── observacoes: ""
    │   │   │   ├── dataSorteio: Timestamp
    │   │   │   └── cadastroEm: Timestamp
    │   │   └── ...
    │   ├── escala/
    │   │   ├── 2025-12/
    │   │   │   ├── month: "2025-12"
    │   │   │   └── casalId: "abc123"
    │   │   └── ...
    │   └── tercos/
    │       ├── [auto-id]/
    │       │   ├── data: "2025-12-23"
    │       │   ├── hora: "20:15"
    │       │   ├── padre: "Pe. Costante"
    │       │   ├── familiaId: "xyz789"
    │       │   ├── casaisIds: ["id1", "id2"]
    │       │   ├── observacoes: ""
    │       │   ├── confirmacoes: []
    │       │   └── cadastroEm: Timestamp
    │       └── ...
    ├── domingo-7h30/
    ├── domingo-9h30/
    ├── domingo-17h-capela/
    └── domingo-19h/
```

---

## 🔧 ARQUIVOS CRIADOS

### 1. `firebase-config.js`
- Inicializa Firebase
- **PRECISA DAS SUAS CREDENCIAIS**
- Configuração do Firestore

### 2. `firebase-db.js`
- Serviço completo de banco de dados
- Métodos CRUD para todas as entidades
- Listeners em tempo real
- Função de migração do localStorage

### 3. `firebase-backup.js`
- Script para exportar localStorage
- Preparação para migração

---

## 🔄 MIGRAÇÃO DOS DADOS

### Opção 1: Via Painel Admin (Recomendado)

1. Abra o sistema: https://sistema-tercos-pastoral.vercel.app
2. Faça login no painel admin (⚙️ → thales/thales)
3. Clique em **"🔄 Migrar localStorage → Firebase"**
4. Aguarde confirmação
5. Dados migrados automaticamente!

### Opção 2: Manual via Console

```javascript
// Abrir Console (F12) no site
firebaseDB.setGrupo('domingo-19h');
await firebaseDB.migrateFromLocalStorage();
```

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

### Firebase Console
- [ ] Projeto criado (app-terco)
- [ ] Web App registrado
- [ ] Credenciais copiadas
- [ ] Firestore ativado
- [ ] Região: southamerica-east1
- [ ] Regras de segurança configuradas

### Código
- [x] Firebase SDK adicionado ao HTML
- [x] firebase-config.js criado
- [x] firebase-db.js criado
- [ ] Credenciais inseridas em firebase-config.js
- [ ] Teste de conexão realizado

### Migração
- [ ] Backup do localStorage realizado
- [ ] Dados migrados para Firebase
- [ ] Testes de leitura/escrita
- [ ] Verificação de sincronização em tempo real

---

## 🧪 TESTES APÓS CONFIGURAÇÃO

### 1. Teste de Conexão
```javascript
// Console do navegador
console.log('Firebase:', firebase);
console.log('Firestore:', firebase.firestore());
```

### 2. Teste de Escrita
```javascript
firebaseDB.setGrupo('domingo-19h');
await firebaseDB.addCasalPastoral({
  nome1: 'Teste',
  nome2: 'Firebase',
  telefone: '17 99999-9999'
});
```

### 3. Teste de Leitura
```javascript
const casais = await firebaseDB.getCasaisPastoral();
console.log('Casais:', casais);
```

### 4. Teste em Tempo Real
```javascript
firebaseDB.onCasaisPastoralChange(casais => {
  console.log('Atualização em tempo real:', casais);
});
```

---

## ⚠️ PROBLEMAS COMUNS

### "Firebase not defined"
- Verifique se os scripts do Firebase estão carregando
- Ver no Network (F12 → Network)

### "Permission denied"
- Verificar regras do Firestore
- Temporariamente permitir `allow read, write: if true`

### "CORS error"
- Verificar domínio autorizado no Firebase
- Console → Authentication → Settings → Authorized domains

---

## 📊 BENEFÍCIOS PÓS-MIGRAÇÃO

✅ **Sincronização automática** entre dispositivos  
✅ **Backup na nuvem** (Google Cloud)  
✅ **Múltiplos usuários** simultâneos  
✅ **Tempo real** - mudanças aparecem instantaneamente  
✅ **Histórico** de alterações  
✅ **Escalabilidade** automática  
✅ **Sem perda de dados** ao limpar cache  

---

## 🚀 PRÓXIMO PASSO

**👉 ENVIE AS CREDENCIAIS DO FIREBASE PARA O CLAUDE:**

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Assim que receber, vou:
1. Atualizar `firebase-config.js`
2. Fazer commit
3. Deploy no Vercel
4. Testar integração
5. Documentar próximos passos

---

**Status:** ⏳ Aguardando credenciais do Firebase
