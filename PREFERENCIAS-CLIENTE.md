# 👤 PREFERÊNCIAS DO CLIENTE (Thales Pardini)

## 🎯 Workflow de Desenvolvimento

### 1. Sempre Testar no Vercel (Produção)
❌ **NÃO:** Testar em localhost ou arquivo local  
✅ **SIM:** Sempre usar https://sistema-tercos-pastoral.vercel.app

**Razão:** Cliente prefere ver funcionando no ambiente real, onde os usuários vão usar.

**Como funciona:**
```bash
# 1. Fazer alterações
# 2. Commit
git add .
git commit -m "mensagem"
git push origin main

# 3. Vercel faz deploy automático em ~30 segundos
# 4. Testar em https://sistema-tercos-pastoral.vercel.app
```

---

## 🛡️ Proteção de Dados

### 2. Evitar Exclusões Acidentais
❌ **NÃO:** Deletar sem confirmação  
✅ **SIM:** Sempre pedir `confirm()` antes de deletar

**Implementado:**
```javascript
deleteCasalPastoral(id) {
    if (confirm('Excluir este casal da pastoral?')) {
        this.casaisPastoral = this.casaisPastoral.filter(c => c.id !== id);
        this.saveData('casaisPastoral', this.casaisPastoral);
        this.render();
    }
}
```

**Aplicado em:**
- ✅ Deletar casal pastoral
- ✅ Deletar família sorteada
- ✅ Deletar terço
- ✅ Deletar escala mensal
- ✅ Trocar de grupo (salva dados antes)

---

## 💾 Sistema de Backup

### 3. Backup Não Intrusivo

#### ❌ COMPORTAMENTO REJEITADO:
```javascript
// NÃO fazer isso:
showGrupoSelector() {
    alert('⚠️ Faça backup dos seus dados!'); // ❌ MUITO INTRUSIVO
    // ...
}
```

#### ✅ COMPORTAMENTO APROVADO:

**1. Backup Automático Silencioso**
```javascript
setupAutoBackup() {
    setInterval(() => {
        this.criarBackupAutomatico();  // Silencioso, em background
    }, 432000000); // 5 dias
}
```

**2. Backup Manual Via Botão**
```javascript
// No painel Admin, botão explícito:
<button onclick="app.exportData()">💾 Fazer Backup Agora</button>
```

**3. Alerta Apenas Quando Necessário**
```javascript
verificarBackupPendente() {
    const ultimoBackup = this.loadData('ultimoBackup');
    const diasSemBackup = /* cálculo */;
    
    if (diasSemBackup >= 10) { // Só avisa depois de 10 dias
        alert('⚠️ Último backup há ' + diasSemBackup + ' dias');
    }
}
```

**Frequências:**
- ⏰ Backup automático: **5 dias** (não 1 hora como estava antes)
- ⚠️ Alerta: **10 dias** sem backup (não 7 dias)
- 🔕 Alerta ao trocar grupo: **NUNCA** (foi removido)

---

## 📱 Estrutura de Dados

### 4. Telefones Separados

#### ❌ FORMATO ANTIGO (Rejeitado):
```javascript
{
    nome1: 'João',
    nome2: 'Maria',
    telefone: '17 99999-9999'  // ❌ Um único telefone
}
```

#### ✅ FORMATO ATUAL (Aprovado):
```javascript
{
    nome1: 'João',
    telefone1: '17 99999-9999',  // ✅ Telefone da pessoa 1
    nome2: 'Maria',
    telefone2: '17 98888-8888'   // ✅ Telefone da pessoa 2
}
```

**Razão:** Cada pessoa do casal tem seu próprio contato.

**Aplicado em:**
- ✅ Casais da Pastoral
- ✅ Famílias Sorteadas
- ✅ Formulários de cadastro
- ✅ Listagens (mostra ambos os telefones)
- ✅ Mensagem WhatsApp
- ✅ Dashboard

---

## 🔥 Decisões de Arquitetura

### 5. Firebase: Tentado e Rejeitado

**Data da decisão:** 19/12/2024 16:04  
**Tempo investido:** 2 horas  
**Resultado:** Abandonado

**Citação do cliente:**
> "desisti do firebase, mantenha o local storage"

**Razão da rejeição:**
- 2 horas de debugging sem sucesso
- Promises pendentes infinitamente
- Sistema funcionando perfeitamente com localStorage
- Projeto precisa estar pronto, não há tempo para mais debugging

**Decisão final:** 
- ✅ **localStorage** como solução permanente
- ❌ **Firebase** descartado
- 📦 Arquivos Firebase mantidos no repo para referência, mas não usados

**Ver detalhes completos:** `DESENVOLVIMENTO.md` - Seção "Saga do Firebase"

---

## 🚀 Deploy e CI/CD

### 6. Processo de Deploy

**Workflow aprovado:**
```bash
# 1. Desenvolvimento local
code app.js

# 2. Commit
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 3. Vercel deploy automático (~30s)
# Deploy acontece automaticamente ao push

# 4. OU deploy manual se necessário
vercel --prod

# 5. Cliente testa em: https://sistema-tercos-pastoral.vercel.app
```

**Importante:**
- ✅ Deploy automático via GitHub push
- ✅ Build command: `node build-config.js`
- ✅ Output directory: `.` (raiz do projeto)
- ✅ Cliente sempre testa na URL de produção

---

## 📝 Comunicação e Documentação

### 7. Preferências de Documentação

**Cliente pediu:**
> "deixe tudo bem documentado, essas minhas preferencias etc"

**Arquivos criados:**
1. ✅ `DESENVOLVIMENTO.md` - Histórico completo, saga Firebase, timeline
2. ✅ `PREFERENCIAS-CLIENTE.md` - Este arquivo
3. ✅ `CLAUDE.md` - Documentação técnica atualizada
4. ✅ `CREDENTIALS.md` - Segurança (Firebase não usado)
5. ✅ `FIREBASE-SETUP.md` - Setup abandonado (referência)

**Estilo de documentação preferido:**
- ✅ Detalhado com exemplos de código
- ✅ Histórico de decisões (o que foi tentado e por quê)
- ✅ Erros documentados para não repetir
- ✅ Emoji para facilitar leitura
- ✅ Seções claras com ❌/✅ para mostrar o que é rejeitado vs aprovado

---

## 🎨 UI/UX Preferences

### 8. Interface

**Aprovado pelo cliente:**
- ✅ Design técnico e profissional (não infantil)
- ✅ Branding: Santuário Nossa Senhora do Rosário - Barretos/SP
- ✅ Mobile-first (formulários grandes e tocáveis)
- ✅ Confirmações visuais claras
- ✅ Ícones para cada grupo (🕯️ 🌅 ☀️ ⛪ 🌙)

**Rejeitado:**
- ❌ "Domingos 19h" genérico no header (muito específico)
- ❌ Sorteio automático pelo site (deve ser na Igreja)
- ❌ Popup de backup a cada ação

---

## 🔧 Manutenção Futura

### Checklist ao Adicionar Funcionalidades

Ao fazer mudanças, sempre:

1. **Testar no Vercel** (não localhost)
2. **Adicionar confirmação** se for deletar algo
3. **Atualizar documentação**:
   - [ ] DESENVOLVIMENTO.md (se mudança significativa)
   - [ ] CLAUDE.md (se nova funcionalidade)
   - [ ] README.md (se afeta usuário)
4. **Manter telefones separados** (telefone1, telefone2)
5. **Backup não intrusivo** (se tocar sistema de backup)
6. **Commit descritivo** e push para main
7. **Verificar deploy no Vercel**

---

## 📞 Contato

**Cliente:** Thales Pardini  
**Comunidade:** Pastoral Familiar - Santuário N. Sra. do Rosário  
**Localização:** Barretos - SP  
**Deploy:** https://sistema-tercos-pastoral.vercel.app  
**Repositório:** https://github.com/pardinithales/aplicativo-terco

---

**Criado em:** 19/12/2024  
**Última atualização:** 19/12/2024  
**Status:** ✅ Documentação completa e sistema em produção
