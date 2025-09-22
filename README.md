# Psicóloga em Outra Dimensão

Plataforma de astrologia e conteúdo digital para a persona @GayaLiz_, combinando uma API de mapas astrais em FastAPI com um site estático em Docusaurus.

## Visão geral
- **API**: serviços REST para geração de mapas astrais (SVG + dados) usando FastAPI, Pydantic e a biblioteca Kerykeion
- **Website**: portal em Docusaurus 3 com React 19 e TypeScript para blog, documentação e experiência do usuário
- **Monorepo**: diretórios `api/` e `website/` evoluem em paralelo e compartilham o roadmap em `ROADMAP.md`
- **Dependências globais**: Python 3.11+, Node.js 18+, Git, além de `uv` (recomendado) para gerenciar ambientes

## Estrutura do repositório
- `api/` backend FastAPI, testes com Pytest e scripts de implantação (Procfile, run.sh)
- `website/` site Docusaurus com conteúdo em `docs/`, blog em `blog/` e configurações em TypeScript
- `attached_assets/`, `cache/`, `frontend/` artefatos auxiliares e históricos internos da API
- `GEMINI.md`, `ROADMAP.md` guias estratégicos e anotações do projeto

## Comece rapidamente

### Backend (FastAPI)
1. `cd api`
2. Crie o ambiente: `uv venv` (ou `python -m venv .venv`)
3. Ative: `source .venv/bin/activate`
4. Sincronize dependências: `uv sync` (ou `pip install -e .`)
5. Execute: `uv run uvicorn app.main:app --reload --port 8000`
6. Testes: `uv run pytest`

> Dica: se preferir iniciar a partir da raiz do repo, use `uv run --from api uvicorn api.app.main:app --reload` para evitar erros de import, ou exporte `PYTHONPATH=api` antes de chamar o Uvicorn.

### Website (Docusaurus)
1. `cd website`
2. Instale dependências: `npm install`
3. Ambiente local: `npm run start`
4. Build estático: `npm run build`
5. Type-check opcional: `npm run typecheck`

## Fluxo de desenvolvimento
- Trabalhe com feature branches partindo de `main`
- Commits pequenos, mensagens no formato `tipo: contexto curto` (ex.: `feat: adicionar endpoint de sinastria`)
- Use pull requests com descrição do problema, solução e checklist de testes
- Automatize ou registre testes executados antes do merge
- Documente novas rotas, modelos ou páginas no diretório responsável (API docs ou docs do site)

## Boas práticas no GitHub
- **Planejamento com issues**: relate contexto, definição de pronto e links para referências
- **Branches claras**: use prefixos como `feat/`, `fix/`, `docs/`, `chore/` e evite commits diretos em `main`
- **Pull requests revisáveis**: mantenha diffs focados, marque reviewers e responda feedbacks rapidamente
- **Commits confiáveis**: mensagens no imperativo, cite tickets (`#123`) quando aplicável e evite commits gerados por build
- **Automação e checagens**: configure lint, testes e deploy preview sempre que possível via GitHub Actions
- **Documentação viva**: atualize README, docs e changelog a cada mudança que impacte o usuário ou a API

## Tags de frameworks
`#FastAPI` `#Python311` `#Pydantic` `#Uvicorn` `#Kerykeion` `#Docusaurus` `#React19` `#TypeScript`

## Próximos passos sugeridos
- Configurar pipelines de CI (lint, testes Python/Node) e badges de status
- Publicar documentação da API no site para centralizar conhecimento
- Adicionar templates de issue e PR para reforçar as boas práticas listadas acima
