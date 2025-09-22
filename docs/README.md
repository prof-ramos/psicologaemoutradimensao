# Manutenção, Personalização e Conteúdo do Site

Este guia orienta a pessoa responsável pelo site quanto à manutenção técnica, personalização visual e criação de conteúdo em Docusaurus (deploy automático via Vercel).

## Papel do Responsável

- Garantir que o site compile e seja publicado pela Vercel a partir da branch `deploy`.
- Manter o visual consistente com as diretrizes de UI/UX documentadas em `.clinerules/`.
- Planejar, redigir e publicar novos conteúdos (docs, blog, páginas customizadas).
- Automatizar e documentar alterações relevantes neste diretório `docs/`.
- Executar comandos `git` e `gh` conforme necessário (o agente tem autorização completa para isso).

## Estrutura do Projeto

- `website/`: código-fonte do site Docusaurus
  - `src/pages/`: páginas customizadas em React/TSX
  - `src/components/`: componentes reutilizáveis
  - `src/theme/`: overrides de temas e componentes padrão
  - `static/`: arquivos estáticos (favicons, imagens, manifestos)
- `.clinerules/`: instruções operacionais para agentes especializados
- `docs/`: este diretório com runbooks e anotações de manutenção

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

### Checklist Recorrente

| Frequência | Atividade |
| --- | --- |
| Semanal | Revisar logs da Vercel, rodar `npm run build` localmente |
| Mensal | Auditar dependências (`npm audit`, atualizar dependências-chave) |
| A cada entrega | Atualizar documentação neste diretório, registrar decisões em `.clinerules/` se necessário |

## Personalização Visual

### Favicons e Manifest

Arquivos em `website/static/`. Ajuste `website/docusaurus.config.ts` para apontar para novos favicons e, se necessário, atualize `website/src/theme/Root.tsx` para tags adicionais no `<head>`.

### CSS e Temas

- Ajustes globais: `website/src/css/custom.css`
- Overrides de componentes Docusaurus: crie arquivos em `website/src/theme/`
- Componentes próprios: `website/src/components/`

### Layout das Páginas

Páginas customizadas ficam em `website/src/pages/`. Use React + TypeScript para criar novas rotas. O arquivo `index.tsx` define a homepage.

### Guia Rápido de Customização

1. Ajustes simples de estilo → `website/src/css/custom.css`
2. Overrides completos de componentes → `website/src/theme/<Componente>.tsx`
3. Novos elementos reutilizáveis → `website/src/components/`
4. Atualização de identidade visual (paleta/typography) → revisar `.clinerules/ui-ux-design-principles.md`

## Conteúdo e Documentação

- Documentos Markdown/MDX devem ser colocados em `website/docs/`
- Sidebar e navegação: `website/sidebars.ts`
- Blog: `website/blog/`

Para novos conteúdos, inclua frontmatter consistente (`title`, `sidebar_position`, `description`).

### Fluxo para Criar Conteúdo

1. Planeje tópicos e defina metadados no frontmatter.
2. Crie o arquivo em `website/docs/` (ou `website/blog/` para posts).
3. Atualize `website/sidebars.ts` se for documentação.
4. Valide a navegação localmente (`npm run start` ou `npm run build`).
5. Atualize este `docs/README.md` caso surjam novos padrões ou processos.

## Fluxo de Deploy

- Apenas a branch `deploy` dispara deploy automático na Vercel (configurado em `vercel.json`).
- Faça merge das mudanças relevantes em `deploy` e `git push` para acionar o deploy.
- Monitore o painel da Vercel para logs e status.

### Fluxo Git Padrão

1. Trabalhe em uma branch de feature.
2. Abra PR direcionando para `main` (se necessário).
3. Após revisão, garanta que `main` e `deploy` estejam sincronizadas (`git merge` e `git push`).
4. A Vercel fará deploy automaticamente assim que `deploy` for atualizada.

## Boas Práticas

1. Sempre rodar `npm run build` antes do commit.
2. Manter o `docusaurus.config.ts` coerente com a estrutura do projeto.
3. Seguir convenções definidas em `.clinerules/` para decisões de UI/UX e Docusaurus.
4. Documentar alterações significativas neste diretório `docs/`.
5. Utilizar `gh pr create` para abrir PRs e registrar contexto.
6. Rodar `npm audit` periodicamente e registrar ações de correção.

## Referências Úteis

- [Documentação oficial Docusaurus](https://docusaurus.io/docs)
- [Guia de Deploy na Vercel](https://docusaurus.io/docs/deployment#vercel)
- Diretório `.clinerules/` para orientações específicas de agentes
