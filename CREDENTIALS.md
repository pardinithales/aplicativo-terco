# 🔐 CONFIGURAÇÃO DE CREDENCIAIS - SUPABASE

## ⚠️ IMPORTANTE: Segurança das Credenciais

As credenciais do Supabase **NÃO devem estar no código versionado**.

---

## 📊 SUPABASE - Banco de Dados em Nuvem

### ✅ Informações do Projeto

**Projeto:** App-terço  
**Plano:** Free (nano)  
**URL:** https://elwvacgobxqhzjtzgyli.supabase.co  
**Região:** Auto-selecionado

### 🔑 Credenciais

```env
SUPABASE_URL=https://elwvacgobxqhzjtzgyli.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsd3ZhY2dvYnhxaHpqdHpneWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzMyMDAsImV4cCI6MjA1MDIwOTIwMH0.sb_publishable_6DEysRRiOKtD3UB27O3jaw_uHH8Ivxr
SUPABASE_SERVICE_ROLE_KEY=[service_role_key_se_necessario]
```

**Senha do Banco:** `pastoralfamiliar`

---

## 📁 Estrutura de Arquivos

### ✅ Arquivos Versionados (GitHub)
- `.env.example` - Template de exemplo
- `supabase-config.js` - Código com placeholders
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
SUPABASE_URL=https://elwvacgobxqhzjtzgyli.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsd3ZhY2dvYnhxaHpqdHpneWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzMyMDAsImV4cCI6MjA1MDIwOTIwMH0.sb_publishable_6DEysRRiOKtD3UB27O3jaw_uHH8Ivxr
```

---

## ☁️ Deploy no Vercel

### Opção 1: Via Dashboard (Recomendado)

1. Acesse: https://vercel.com/pardinithales/sistema-tercos-pastoral/settings/environment-variables

2. Adicione cada variável:

| Nome | Valor |
|------|-------|
| `SUPABASE_URL` | `https://elwvacgobxqhzjtzgyli.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

3. Marque: **Production**, **Preview**, **Development**

4. Clique em **"Save"**

5. **Redeploy** o projeto:
   ```bash
   vercel --prod
   ```

### Opção 2: Via CLI

```bash
# Adicionar variáveis
vercel env add SUPABASE_URL
# https://elwvacgobxqhzjtzgyli.supabase.co

vercel env add SUPABASE_ANON_KEY
# Cole o token quando solicitado

# Redeploy
vercel --prod
```

---

## 🗄️ Schema do Banco de Dados

### Tabelas Necessárias

#### 1. `grupos`
```sql
CREATE TABLE grupos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  icone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. `casais_pastoral`
```sql
CREATE TABLE casais_pastoral (
  id BIGINT PRIMARY KEY,
  grupo_id TEXT REFERENCES grupos(id),
  nome1 TEXT NOT NULL,
  telefone1 TEXT,
  nome2 TEXT,
  telefone2 TEXT,
  cadastro_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. `familias_sorteadas`
```sql
CREATE TABLE familias_sorteadas (
  id BIGINT PRIMARY KEY,
  grupo_id TEXT REFERENCES grupos(id),
  nome1 TEXT NOT NULL,
  telefone1 TEXT,
  nome2 TEXT,
  telefone2 TEXT,
  endereco TEXT,
  observacoes TEXT,
  data_sorteio TIMESTAMP WITH TIME ZONE,
  cadastro_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. `escala`
```sql
CREATE TABLE escala (
  id SERIAL PRIMARY KEY,
  grupo_id TEXT REFERENCES grupos(id),
  mes TEXT NOT NULL,
  casal_id BIGINT,
  cadastro_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(grupo_id, mes)
);
```

#### 5. `tercos`
```sql
CREATE TABLE tercos (
  id BIGINT PRIMARY KEY,
  grupo_id TEXT REFERENCES grupos(id),
  data DATE NOT NULL,
  hora TIME,
  padre TEXT,
  familia_id BIGINT,
  casais_ids BIGINT[],
  observacoes TEXT,
  confirmacoes JSONB DEFAULT '[]',
  cadastro_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔧 Usar Variáveis no Código

### supabase-config.js

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://elwvacgobxqhzjtzgyli.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 🔐 Segurança - Row Level Security (RLS)

### Políticas Supabase

#### Casais Pastoral
```sql
-- Permitir leitura pública
CREATE POLICY "Permitir leitura casais" ON casais_pastoral
  FOR SELECT USING (true);

-- Permitir inserção/atualização/exclusão autenticada
CREATE POLICY "Permitir escrita casais" ON casais_pastoral
  FOR ALL USING (auth.role() = 'authenticated');
```

#### Famílias Sorteadas
```sql
CREATE POLICY "Permitir leitura familias" ON familias_sorteadas
  FOR SELECT USING (true);

CREATE POLICY "Permitir escrita familias" ON familias_sorteadas
  FOR ALL USING (auth.role() = 'authenticated');
```

#### Terços
```sql
CREATE POLICY "Permitir leitura tercos" ON tercos
  FOR SELECT USING (true);

CREATE POLICY "Permitir escrita tercos" ON tercos
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 🎯 Vantagens do Supabase sobre localStorage

✅ **Sincronização em tempo real** entre dispositivos  
✅ **Backup automático** na nuvem  
✅ **Acesso multi-usuário** simultâneo  
✅ **Histórico de alterações**  
✅ **API REST automática**  
✅ **Realtime subscriptions** (WebSocket)  
✅ **PostgreSQL** robusto e escalável  
✅ **Sem limite de 5MB** do localStorage  

---

## 🚀 Migração de localStorage para Supabase

### Script de Migração

```javascript
// Executar no console do navegador
async function migrarParaSupabase() {
  const grupos = ['sabado-19h30', 'domingo-7h30', 'domingo-9h30', 'domingo-17h-capela', 'domingo-19h'];
  
  for (const grupoId of grupos) {
    const casais = JSON.parse(localStorage.getItem(`grupo_${grupoId}_casaisPastoral`) || '[]');
    const familias = JSON.parse(localStorage.getItem(`grupo_${grupoId}_familiasSorteadas`) || '[]');
    const escala = JSON.parse(localStorage.getItem(`grupo_${grupoId}_escala`) || '[]');
    const tercos = JSON.parse(localStorage.getItem(`grupo_${grupoId}_tercos`) || '[]');
    
    // Inserir no Supabase
    await supabase.from('casais_pastoral').insert(casais.map(c => ({...c, grupo_id: grupoId})));
    await supabase.from('familias_sorteadas').insert(familias.map(f => ({...f, grupo_id: grupoId})));
    await supabase.from('escala').insert(escala.map(e => ({...e, grupo_id: grupoId})));
    await supabase.from('tercos').insert(tercos.map(t => ({...t, grupo_id: grupoId})));
  }
  
  console.log('✅ Migração concluída!');
}

migrarParaSupabase();
```

---

## 📝 Checklist de Implementação

- [ ] Criar projeto no Supabase
- [ ] Criar tabelas (schema SQL)
- [ ] Configurar RLS (Row Level Security)
- [ ] Adicionar credenciais no `.env`
- [ ] Instalar `@supabase/supabase-js`
- [ ] Criar `supabase-config.js`
- [ ] Atualizar `app.js` para usar Supabase
- [ ] Testar CRUD operations
- [ ] Migrar dados do localStorage
- [ ] Adicionar env vars no Vercel
- [ ] Deploy e teste em produção

---

## 🆘 Se Credenciais Vazarem

1. **Revogar Anon Key:**
   - Supabase Dashboard → Settings → API
   - Reset anon key

2. **Atualizar .env:**
   ```bash
   SUPABASE_ANON_KEY=nova_key_aqui
   ```

3. **Atualizar Vercel:**
   ```bash
   vercel env rm SUPABASE_ANON_KEY
   vercel env add SUPABASE_ANON_KEY
   vercel --prod
   ```

4. **Verificar RLS policies**

---

**Última atualização:** 19/12/2024  
**Mantido por:** Thales Pardini  
**Banco:** Supabase PostgreSQL  
**Status:** ✅ Pronto para implementação
