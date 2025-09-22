# Manutenção e Personalização do Site

Este guia descreve as rotinas principais para manter e personalizar o front-end em Docusaurus hospedado na Vercel.

## Estrutura do Projeto

- `website/`: código-fonte do site Docusaurus
  - `src/pages/`: páginas customizadas em React/TSX
  - `src/components/`: componentes reutilizáveis
  - `src/theme/`: overrides de temas e componentes padrão
  - `static/`: arquivos estáticos (favicons, imagens, manifestos)
- `.clinerules/`: instruções operacionais para agentes especializados

## Tarefas de Manutenção

### Instalação e Atualizações

```bash
cd website
npm install
```

Para atualizar dependências, modifique `package.json` e execute `npm install`. Teste com `npm run build` antes do commit.

### Scripts Importantes

- `npm run start`: ambiente de desenvolvimento local
- `npm run build`: build de produção (executado pela Vercel)
- `npm run typecheck`: verificação de tipos TypeScript

## Personalização Visual

### Favicons e Manifest

Arquivos em `website/static/`. Ajuste `website/docusaurus.config.ts` para apontar para novos favicons e, se necessário, atualize `website/src/theme/Root.tsx` para tags adicionais no `<head>`.

### CSS e Temas

- Ajustes globais: `website/src/css/custom.css`
- Overrides de componentes Docusaurus: crie arquivos em `website/src/theme/`
- Componentes próprios: `website/src/components/`

### Layout das Páginas

Páginas customizadas ficam em `website/src/pages/`. Use React + TypeScript para criar novas rotas. O arquivo `index.tsx` define a homepage.

## Conteúdo e Documentação

- Documentos Markdown/MDX devem ser colocados em `website/docs/`
- Sidebar e navegação: `website/sidebars.ts`
- Blog: `website/blog/`

Para novos conteúdos, inclua frontmatter consistente (`title`, `sidebar_position`, `description`).

## Fluxo de Deploy

- Apenas a branch `deploy` dispara deploy automático na Vercel (configurado em `vercel.json`).
- Faça merge das mudanças relevantes em `deploy` e `git push` para acionar o deploy.
- Monitore o painel da Vercel para logs e status.

## Boas Práticas

1. Sempre rodar `npm run build` antes do commit.
2. Manter o `docusaurus.config.ts` coerente com a estrutura do projeto.
3. Seguir convenções definidas em `.clinerules/` para decisões de UI/UX e Docusaurus.
4. Documentar alterações significativas neste diretório `docs/`.

## Referências Úteis

- [Documentação oficial Docusaurus](https://docusaurus.io/docs)
- [Guia de Deploy na Vercel](https://docusaurus.io/docs/deployment#vercel)
- Diretório `.clinerules/` para orientações específicas de agentes
