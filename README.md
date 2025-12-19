# Sistema de Organização de Terços - Pastoral Familiar

Sistema simples e prático para organizar as famílias que realizam terços nas missas de domingo às 19h.

## Funcionalidades

- ✅ Cadastro de famílias e datas dos terços
- ✅ Visualização de terços agendados e realizados
- ✅ Filtros (todos, próximos, realizados)
- ✅ Edição e exclusão de registros
- ✅ Banco de dados local (localStorage)
- ✅ Exportar/Importar dados (backup em JSON)
- ✅ Interface responsiva

## Deploy

### Vercel (Recomendado)

1. Instale o Vercel CLI:
```bash
npm i -g vercel
```

2. Na pasta do projeto, execute:
```bash
vercel
```

3. Siga as instruções e pronto!

### Netlify

1. Arraste a pasta do projeto para [netlify.com/drop](https://app.netlify.com/drop)
2. Ou use o Netlify CLI:
```bash
npm i -g netlify-cli
netlify deploy
```

### GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos arquivos
3. Em Settings > Pages, selecione a branch main
4. Aguarde o deploy

## Como usar

1. Abra o `index.html` no navegador
2. Adicione famílias usando o formulário
3. Os dados são salvos automaticamente no navegador
4. Use os filtros para visualizar terços agendados ou já realizados
5. Faça backup dos dados usando o botão "Exportar Dados"

## Arquivos

- `index.html` - Estrutura da página
- `style.css` - Estilos e responsividade
- `app.js` - Lógica e gerenciamento de dados
- `vercel.json` - Configuração para deploy no Vercel
