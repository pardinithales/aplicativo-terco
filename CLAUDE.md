# 🛠️ CLAUDE.md - Sistema de Gerenciamento de Terços

## 📋 SOBRE O PROJETO

**Nome:** Sistema de Gerenciamento de Terços - Pastoral Familiar  
**Versão:** 2.2  
**Cliente:** Santuário Nossa Senhora do Rosário - Barretos/SP  
**Deploy:** https://sistema-tercos-pastoral.vercel.app  
**Repositório:** https://github.com/pardinithales/aplicativo-terco

### Propósito
Sistema web para organizar e gerenciar terços (orações do rosário) de 5 grupos diferentes de missa da Pastoral Familiar. Cada grupo opera de forma completamente independente com seus próprios membros, famílias sorteadas e agendamentos.

### 📚 Documentação Adicional
- **DESENVOLVIMENTO.md** - Histórico completo de desenvolvimento, saga do Firebase, preferências do cliente
- **CREDENTIALS.md** - Segurança e credenciais (Firebase - não usado)
- **FIREBASE-SETUP.md** - Setup Firebase (tentativa abandonada)
- **README.md** - Documentação de usuário
- **TESTES.md** - Relatório de testes (92 testes)
- **EXEMPLOS-USO.md** - Casos de uso práticos

---

## 🏗️ ARQUITETURA

### Stack Tecnológica
- **Frontend:** HTML5, CSS3, JavaScript Vanilla (ES6+)
- **Armazenamento:** localStorage (navegador) - **DECISÃO FINAL após tentativa Firebase**
- **Deploy:** Vercel (static site)
- **Versionamento:** Git + GitHub

> ⚠️ **Nota importante:** Firebase foi testado e **abandonado** após 2h de debugging (19/12/2024). Ver `DESENVOLVIMENTO.md` para detalhes completos da saga.

### Estrutura de Arquivos
```
├── index.html              # Interface principal (213 linhas)
├── app.js                  # Lógica da aplicação (1050+ linhas)
├── style.css               # Design responsivo (1000+ linhas)
├── vercel.json             # Configuração Vercel
├── README.md               # Documentação geral
├── TESTES.md               # Relatório de testes (92 testes)
├── EXEMPLOS-USO.md         # Casos de uso práticos
├── firebase-backup.js      # Script de backup localStorage
└── CLAUDE.md               # Este arquivo (documentação técnica)
```

---

## 🎯 FUNCIONALIDADES PRINCIPAIS

### 1. Sistema Multi-Grupo (5 Grupos)
Cada grupo representa um horário de missa com membros independentes:

| Grupo | Ícone | Membros |
|-------|-------|---------|
| Sábado 19h30 | 🕯️ | 5 casais |
| Domingo 7h30 | 🌅 | 3 casais |
| Domingo 9h30 | ☀️ | 7 casais |
| Domingo 17h Capela | ⛪ | 2 casais |
| Domingo 19h | 🌙 | 5 casais |

**Isolamento de Dados:**
- Cada grupo tem namespace próprio no localStorage: `grupo_[id]_[tipo]`
- Exemplo: `grupo_domingo-19h_casaisPastoral`, `grupo_sabado-19h30_tercos`
- Zero risco de mistura de dados entre grupos

### 2. Gestão de Casais da Pastoral
- CRUD completo (Create, Read, Update, Delete)
- Dados: nome1, **telefone1**, nome2, **telefone2** (com DDD), data de cadastro
- Membros fixos que participam dos terços
- ✅ **Telefones separados** por pessoa (implementado 19/12/2024)

### 3. Famílias Sorteadas
- Cadastro rápido mobile-friendly
- Dados: nome1, **telefone1**, nome2, **telefone2**, endereço, observações, data sorteio
- Sorteio feito presencialmente na igreja (2º domingo/mês)
- Sistema apenas registra as famílias sorteadas
- ✅ **Telefones separados** por pessoa (implementado 19/12/2024)

### 4. Escala Mensal da Pasta
- Define casal responsável pela organização do mês
- Rotação mensal entre casais da pastoral
- Exibe histórico completo

### 5. Agendamento de Terços
- Data, hora, padre, família, casais participantes
- Sistema de confirmação de presença
- Observações específicas por terço
- Navegação por mês (anterior/próximo)

### 6. Geração de Mensagens WhatsApp
Formato padronizado:
```
Terço da Família
Dia 23/12 - às 20:15
Residência: Carlos Fabris
Avenida 5, 1511
Pe. Constante
Casal 1: Célia
Casal 2: Tales e julia
```
Botão "Copiar WhatsApp" copia para clipboard

### 7. Sistema de Backup
- **Automático:** A cada 5 dias (432.000.000ms) - **silencioso, não intrusivo**
- **Manual:** Exporta JSON com timestamp via botão no Admin
- **Avisos:** Após 10 dias sem backup manual (não mostra a cada seleção de grupo)
- **Estrutura:** Inclui grupo, dados e metadata
- ⚠️ **Preferência do cliente:** Backup não deve ser intrusivo ou aparecer toda hora

### 8. Painel Administrativo
**Acesso:** Login `thales` / Senha `thales`
- 🧪 Testar Sistema (9 testes automáticos)
- ♻️ Restaurar Backup Automático
- 🗑️ Limpar Todos os Dados (dupla confirmação)

---

## 💾 MODELO DE DADOS

### localStorage Schema

#### Casais Pastoral
```javascript
{
  id: number,
  nome1: string,
  nome2: string,
  telefone: string,        // Formato: "17 99123-4567"
  cadastroEm: string       // ISO 8601: "2025-12-19T10:00:00"
}
```

#### Famílias Sorteadas
```javascript
{
  id: number,
  nome: string,
  telefone: string,
  endereco: string,
  observacoes: string,
  dataSorteio: string,     // ISO 8601
  cadastroEm: string       // ISO 8601
}
```

#### Escala
```javascript
{
  month: string,           // Formato: "2025-12"
  casalId: number          // FK para casaisPastoral
}
```

#### Terços
```javascript
{
  id: number,
  data: string,            // Formato: "2025-12-23"
  hora: string,            // Formato: "20:15"
  padre: string,
  familiaId: number,       // FK para familiasSorteadas
  casaisIds: number[],     // Array de IDs de casais
  observacoes: string,
  confirmacoes: [
    {
      casalId: number,
      confirmedAt: string  // ISO 8601
    }
  ],
  cadastroEm: string       // ISO 8601
}
```

### Chaves do localStorage
```javascript
// Dados do grupo
grupo_[grupoId]_casaisPastoral
grupo_[grupoId]_familiasSorteadas
grupo_[grupoId]_escala
grupo_[grupoId]_tercos

// Backups
backupAutomatico_[grupoId]
ultimoBackupAutomatico_[grupoId]
ultimoBackup_[grupoId]           // Data do último backup manual

// Estado global
grupoAtual                       // ID do grupo selecionado
```

---

## 🎨 DESIGN SYSTEM

### Paleta de Cores (CSS Variables)
```css
--primary: #1a237e         /* Azul marinho (igreja) */
--primary-light: #3949ab
--primary-dark: #0d1442
--secondary: #c62828       /* Vermelho */
--secondary-light: #ff5252
--accent: #ffd700          /* Dourado */
--success: #2e7d32         /* Verde */
--warning: #f57c00         /* Laranja */
--text: #212121
--text-light: #757575
--bg: #fafafa
--card-bg: #ffffff
--border: #e0e0e0
```

### Componentes Principais
- **Cards:** Bordas arredondadas (12-16px), sombras, hover animado
- **Botões:** Gradientes, transform on hover, uppercase
- **Modais:** Backdrop blur, slide down animation
- **Formulários:** Inputs grandes (16px padding), autofocus
- **Tabs:** Navegação horizontal com border-bottom ativo

### Responsividade
**Breakpoint:** 768px
- Mobile: Coluna única, font-size aumentado
- Desktop: Grid layout, múltiplas colunas

---

## 🔧 PRINCIPAIS FUNÇÕES (app.js)

### Classe Principal: `PastoralManager`

#### Inicialização
```javascript
constructor()
  ├── loadGrupoData()           // Carrega dados do grupo do localStorage
  ├── showGrupoSelector()       // Mostra tela de seleção se não tem grupo
  └── showApp()                 // Exibe aplicação após seleção
      ├── init()
      ├── setupAutoBackup()     // Interval de 5 dias
      └── verificarBackupPendente()
```

#### Gestão de Dados
```javascript
// Persistência
loadData(key)                   // Carrega do localStorage com prefix grupo
saveData(key, value)            // Salva com prefix grupo

// CRUD Casais
addCasalPastoral()
editCasalPastoral(id)
deleteCasalPastoral(id)

// CRUD Famílias
addFamilia()
editFamilia(id)
deleteFamilia(id)

// CRUD Escala
addEscala()
deleteEscala(month)

// CRUD Terços
addTerco()
editTerco(id)
deleteTerco(id)
confirmarPresenca(tercoId, casalId)
```

#### Backup
```javascript
exportData()                    // Gera arquivo JSON
importData(file)                // Lê arquivo e importa
criarBackupAutomatico()         // Backup silencioso
restaurarBackupAutomatico()     // Via painel admin
```

#### Admin
```javascript
loginAdmin()                    // Valida thales/thales
testarPersistencia()           // 9 testes automáticos
limparTodosDados()             // Reset com confirmação dupla
```

#### Renderização
```javascript
render()                        // Renderiza aba ativa
renderDashboard()
renderCasaisPastoral()
renderFamilias()
renderEscala()
renderTercos()
renderCalendario(month)
```

#### Utilidades
```javascript
formatDate(isoString)           // ISO → dd/mm/yyyy
formatDateTime(isoString)       // ISO → dd/mm/yyyy HH:mm
copiarWhatsApp(tercoId)        // Gera mensagem formatada
```

---

## 🚀 DEPLOY E CI/CD

### Vercel
**Comando:** `vercel --prod --yes`

**Configuração:** `vercel.json`
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

**Domínio:** https://sistema-tercos-pastoral.vercel.app

### Git Workflow
```bash
# Commit
git add .
git commit -m "feat: descrição"

# Push
git push origin main

# Vercel auto-deploy (webhook configurado)
```

---

## 🧪 TESTES

### Cobertura de Testes (TESTES.md)
- **92 testes manuais** executados
- **100% aprovação**
- Categorias:
  - Funcionalidades (46 testes)
  - Persistência (8 testes)
  - Segurança (8 testes)
  - Interface (18 testes)
  - Edge cases (8 testes)
  - Performance (4 testes)

### Testes Automáticos (Painel Admin)
```javascript
testarPersistencia() // 9 testes:
  ✅ Grupo selecionado
  ✅ localStorage disponível
  ✅ Escrita/Leitura localStorage
  ✅ Casais Pastoral carregados
  ✅ Famílias Sorteadas
  ✅ Escala definida
  ✅ Terços agendados
  ✅ Backup automático existe
  ✅ Backup manual realizado
```

---

## ⚠️ LIMITAÇÕES CONHECIDAS

### localStorage
- **Capacidade:** ~5-10 MB por domínio
- **Sincronização:** Não sincroniza entre dispositivos
- **Persistência:** Apagado ao limpar cache
- **Compartilhamento:** Impossível acesso simultâneo multi-usuário

### Mitigações
- Sistema de backup manual robusto
- Backup automático a cada 5 dias
- Avisos proativos após 10 dias sem backup
- Documentação clara sobre limitações

---

## 🔮 MIGRAÇÃO PARA FIREBASE (EM PLANEJAMENTO)

### Benefícios
- ✅ Sincronização em tempo real
- ✅ Acesso multi-dispositivo
- ✅ Backup automático na nuvem
- ✅ Múltiplos usuários simultâneos
- ✅ Histórico de alterações

### Estrutura Firestore Proposta
```
tercos/
  └── grupos/
      ├── sabado-19h30/
      │   ├── casaisPastoral/
      │   ├── familiasSorteadas/
      │   ├── escala/
      │   └── tercos/
      ├── domingo-7h30/
      └── ...
```

### Alterações Necessárias
1. Adicionar Firebase SDK ao `index.html`
2. Criar arquivo `firebase-config.js`
3. Substituir métodos `loadData/saveData` por Firestore
4. Implementar listeners em tempo real
5. Adicionar sistema de autenticação (opcional)
6. Migrar dados existentes do localStorage

### Script de Migração
```javascript
// firebase-backup.js já criado para exportar localStorage
// Próximo passo: script para importar no Firestore
```

---

## 🐛 DEBUGGING

### Console Logs
```javascript
console.log('✅ Backup automático criado:', date)
console.log('🧪 TESTE DE PERSISTÊNCIA:', relatorio)
```

### DevTools
**Ver dados:** F12 → Application → Local Storage → https://sistema-tercos-pastoral.vercel.app

**Limpar dados de teste:**
```javascript
localStorage.clear()
location.reload()
```

**Forçar backup:**
```javascript
app.criarBackupAutomatico()
```

**Testar sistema:**
```javascript
app.testarPersistencia()
```

---

## 📚 REGRAS DE NEGÓCIO

### Fluxo de Trabalho
1. **Setup inicial:** Definir casais da pastoral e escala mensal
2. **2º domingo do mês:** Sorteio físico na igreja
3. **Pós-sorteio:** Cadastro rápido das famílias no sistema
4. **Agendamento:** Responsável da pasta marca terços
5. **Notificação:** Copia mensagem WhatsApp e envia no grupo
6. **Confirmação:** Casais confirmam presença no sistema
7. **Realização:** Terço acontece
8. **Backup:** Semanal ou após mudanças importantes

### Dados Pré-carregados
- Cada grupo tem casais de exemplo ao primeiro acesso
- Função `getDadosGrupo()` retorna membros específicos
- Dados carregados apenas se `casaisPastoral.length === 0`

---

## 🔐 SEGURANÇA

### Autenticação
- Painel admin protegido por senha hardcoded
- Credenciais: `thales` / `thales`
- Botão admin discreto (opacity: 0.3)

### Dados Sensíveis
- Não há informações bancárias ou documentos
- Telefones e endereços são dados públicos da paróquia
- localStorage é local ao dispositivo do usuário

### Melhorias Futuras
- Implementar Firebase Authentication
- Hash de senhas
- Níveis de permissão (admin, coordenador, membro)

---

## 📞 CONTATOS E SUPORTE

**Desenvolvedor:** Thales Pardini  
**Email:** pardinithales@gmail.com  
**GitHub:** https://github.com/pardinithales  
**Sistema:** https://sistema-tercos-pastoral.vercel.app

**Cliente:** Santuário Nossa Senhora do Rosário  
**Localização:** Barretos - SP  
**Pastoral Familiar:** 5 grupos de missa

---

## 📝 CHANGELOG

### v2.1 (2025-12-19) - Atual
- ✅ Sistema multi-grupo (5 grupos independentes)
- ✅ Backup automático a cada 5 dias
- ✅ Avisos após 10 dias sem backup
- ✅ Painel administrativo
- ✅ Testes automáticos integrados
- ✅ Deploy no Vercel
- ✅ Repositório no GitHub

### v2.0 (2025-12-15)
- Design profissional com gradientes
- Branding do Santuário
- Separação de casais pastoral e famílias sorteadas
- Escala mensal da pasta

### v1.0 (2025-12-01)
- MVP inicial
- localStorage básico
- CRUD simples

---

## 🎓 APRENDIZADOS E DECISÕES TÉCNICAS

### Por que Vanilla JS?
- Sem dependências externas
- Performance excelente
- Facilidade de manutenção
- Projeto pequeno/médio não justifica framework

### Por que localStorage primeiro?
- MVP rápido
- Zero custos
- Simplicidade de implementação
- Offline-first

### Por que não usar framework CSS?
- Design personalizado para marca da igreja
- Controle total das animações
- CSS moderno (variables, grid, flexbox) é suficiente
- Menor bundle size

### Melhorias Arquiteturais Futuras
- Separar em módulos ES6
- Implementar Service Worker (PWA)
- Adicionar TypeScript
- Testes unitários automatizados (Jest)

---

## 🏃 QUICK START PARA DESENVOLVIMENTO

### Clonar e Rodar Localmente
```bash
# Clone
git clone https://github.com/pardinithales/aplicativo-terco.git
cd aplicativo-terco

# Abrir no navegador (qualquer servidor HTTP)
# Opção 1: VS Code Live Server
# Opção 2: Python
python -m http.server 8000

# Opção 3: Node
npx serve
```

### Deploy
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Fazer Backup do localStorage
```bash
# Abrir https://sistema-tercos-pastoral.vercel.app
# F12 → Console → Colar:
```
```javascript
// Conteúdo do firebase-backup.js
```

---

## 📖 DOCUMENTAÇÃO ADICIONAL

- **README.md:** Visão geral e instruções de deploy
- **TESTES.md:** Relatório completo de testes manuais
- **EXEMPLOS-USO.md:** 15 casos de uso práticos
- **firebase-backup.js:** Script de backup localStorage

---

## ✅ COMANDOS ÚTEIS PARA CLAUDE

### Desenvolvimento
```bash
# Testar localmente
python -m http.server 8000

# Lint/Check (futuro)
npm run lint

# Build (futuro, se adicionar bundler)
npm run build
```

### Deploy
```bash
# Deploy para produção
vercel --prod --yes

# Ver logs
vercel logs sistema-tercos-pastoral

# Rollback
vercel rollback
```

### Git
```bash
# Status
git status

# Commit padrão
git add .
git commit -m "feat: nova funcionalidade"

# Push
git push origin main
```

### Backup
```bash
# Exportar localStorage (rodar no console do navegador)
node firebase-backup.js
```

---

## 🎯 PRÓXIMOS PASSOS (TODO)

### Curto Prazo
- [ ] Integração completa com Firebase Firestore
- [ ] Script de migração localStorage → Firestore
- [ ] Sistema de autenticação Firebase
- [ ] Sincronização em tempo real

### Médio Prazo
- [ ] PWA (Progressive Web App)
- [ ] Notificações push para lembretes
- [ ] Modo offline com sincronização
- [ ] Exportar relatórios em PDF

### Longo Prazo
- [ ] App mobile (React Native / Flutter)
- [ ] Dashboard com estatísticas avançadas
- [ ] Integração com calendário (Google Calendar)
- [ ] Sistema de permissões granular

---

**Última atualização:** 19/12/2025  
**Mantido por:** Claude + Thales Pardini
