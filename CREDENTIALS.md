# 🔐 CONFIGURAÇÃO DE CREDENCIAIS

## ⚠️ IMPORTANTE: Segurança das Credenciais

As credenciais do Firebase **NÃO estão mais no código versionado**.

---

## 📁 Estrutura de Arquivos

### ✅ Arquivos Versionados (GitHub)
- `.env.example` - Template de exemplo
- `firebase-config.js` - Código com placeholders
- `.gitignore` - Ignora arquivos sensíveis

### ❌ Arquivos NÃO Versionados (Local)
- `.env` - **Suas credenciais reais** (ignorado pelo git)
- Backups JSON com dados

---

## 🖥️ Desenvolvimento Local

### 1. Copiar Template
```bash
cp .env.example .env
```

### 2. Editar .env
Abra `.env` e preencha com suas credenciais:

```env
FIREBASE_API_KEY=AIzaSyD39hFHFL35SVW6HAY-1nlyrX4zCiTWhqI
FIREBASE_AUTH_DOMAIN=app-terco.firebaseapp.com
FIREBASE_PROJECT_ID=app-terco
FIREBASE_STORAGE_BUCKET=app-terco.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=605327267124
FIREBASE_APP_ID=1:605327267124:web:9bf18c6ce7d824b0b58161
FIREBASE_MEASUREMENT_ID=G-BEXPMDYMY6
```

---

## ☁️ Deploy no Vercel

### Opção 1: Via Dashboard (Recomendado)

1. Acesse: https://vercel.com/pardinithales/sistema-tercos-pastoral/settings/environment-variables

2. Adicione cada variável:

| Nome | Valor |
|------|-------|
| `FIREBASE_API_KEY` | `AIzaSyD39hFHFL35SVW6HAY-1nlyrX4zCiTWhqI` |
| `FIREBASE_AUTH_DOMAIN` | `app-terco.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | `app-terco` |
| `FIREBASE_STORAGE_BUCKET` | `app-terco.firebasestorage.app` |
| `FIREBASE_MESSAGING_SENDER_ID` | `605327267124` |
| `FIREBASE_APP_ID` | `1:605327267124:web:9bf18c6ce7d824b0b58161` |
| `FIREBASE_MEASUREMENT_ID` | `G-BEXPMDYMY6` |

3. Marque: **Production**, **Preview**, **Development**

4. Clique em **"Save"**

5. **Redeploy** o projeto:
   ```bash
   vercel --prod
   ```

### Opção 2: Via CLI

```bash
# Adicionar variáveis
vercel env add FIREBASE_API_KEY
# Cole o valor quando solicitado

vercel env add FIREBASE_AUTH_DOMAIN
# app-terco.firebaseapp.com

vercel env add FIREBASE_PROJECT_ID
# app-terco

vercel env add FIREBASE_STORAGE_BUCKET
# app-terco.firebasestorage.app

vercel env add FIREBASE_MESSAGING_SENDER_ID
# 605327267124

vercel env add FIREBASE_APP_ID
# 1:605327267124:web:9bf18c6ce7d824b0b58161

vercel env add FIREBASE_MEASUREMENT_ID
# G-BEXPMDYMY6

# Redeploy
vercel --prod
```

---

## 🔧 Usar Variáveis no Código

### Atualizar firebase-config.js

```javascript
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "fallback_key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
```

**Porém:** JavaScript no navegador não tem acesso a `process.env`!

### Solução: Build Step

Para usar `process.env` no frontend, precisamos de um build step:

#### Opção A: Adicionar vercel.json
```json
{
  "env": {
    "FIREBASE_API_KEY": "@firebase-api-key",
    "FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain"
  }
}
```

#### Opção B: Script de substituição
Criar `inject-env.js`:
```javascript
const fs = require('fs');
const config = `
const firebaseConfig = {
  apiKey: "${process.env.FIREBASE_API_KEY}",
  authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
  projectId: "${process.env.FIREBASE_PROJECT_ID}",
  storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.FIREBASE_APP_ID}",
  measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}"
};
`;
fs.writeFileSync('firebase-config.js', config);
```

---

## 🎯 Solução Atual (Temporária)

**Por enquanto, as credenciais do Firebase são públicas no código.**

Isso é aceitável porque:
1. ✅ Firebase tem regras de segurança no Firestore
2. ✅ Restrições de domínio configuradas
3. ✅ Não há informações sensíveis nos dados

### Proteger com Regras do Firestore

No Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas leitura pública, escrita com autenticação
    match /grupos/{grupoId}/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🔐 Próximos Passos de Segurança

### 1. Adicionar Firebase Authentication
- Login com email/senha
- Login com Google
- Roles e permissões

### 2. Regras Firestore Avançadas
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /grupos/{grupoId} {
      // Apenas admins podem criar grupos
      allow create: if request.auth.token.admin == true;
      
      // Membros do grupo podem ler
      allow read: if request.auth != null;
      
      // Apenas responsável da pasta pode editar
      allow write: if request.auth.uid in resource.data.responsaveis;
    }
  }
}
```

### 3. Restrições de Domínio

No Firebase Console → Authentication → Settings → Authorized domains:
- `sistema-tercos-pastoral.vercel.app`
- `localhost` (para desenvolvimento)

---

## 📝 Checklist de Segurança

- [x] Credenciais no .env (não versionado)
- [x] .gitignore configurado
- [x] .env.example como template
- [ ] Variáveis de ambiente no Vercel
- [ ] Firebase Authentication implementado
- [ ] Regras Firestore restritivas
- [ ] Domínios autorizados configurados
- [ ] Rotação de API Keys (se necessário)

---

## 🆘 Se Credenciais Vazarem

1. **Revogar API Key:**
   - Firebase Console → Project Settings → API Keys
   - Deletar key comprometida
   - Gerar nova

2. **Atualizar .env:**
   ```bash
   FIREBASE_API_KEY=nova_key_aqui
   ```

3. **Atualizar Vercel:**
   ```bash
   vercel env rm FIREBASE_API_KEY
   vercel env add FIREBASE_API_KEY
   vercel --prod
   ```

4. **Verificar regras Firestore**

---

**Última atualização:** 19/12/2025  
**Mantido por:** Thales Pardini
