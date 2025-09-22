# Repository Guidelines

## Project Structure & Module Organization
- `api/app/` hospeda o backend FastAPI; roteadores em `routers/`, esquemas em `schemas/`, utilidades reutilizáveis em `core/`.
- `api/tests/` armazena suites Pytest alinhadas aos módulos.
- `website/src/` compõe o front-end Docusaurus (React + TypeScript); conteúdo editorial mora em `website/docs/` e `website/blog/`.
- `ROADMAP.md` e `GEMINI.md` concentram diretrizes estratégicas e devem acompanhar mudanças relevantes.

## Build, Test, and Development Commands
- Backend local: `cd api && uvicorn app.main:app --reload` para desenvolvimento rápido.
- Dependências: `uv sync` ou `pip install -e .`; regenere esquemas com `python dump_schema.py` sempre que alterar modelos Pydantic.
- Qualidade backend: `pytest -v`, `python -m mypy --ignore-missing-imports .`, `black . --line-length 200`.
- Website: `cd website && npm install` inicial; `npm run start` para preview, `npm run build` para validação final, `npm run typecheck` para checar tipos.

## Coding Style & Naming Conventions
- Python: indentação de 4 espaços, `snake_case` para funções/variáveis, `PascalCase` para classes. Formate com `black` antes de subir commits.
- TypeScript/React: componentes e hooks em `PascalCase` e `camelCase`; páginas vivem em `src/pages/`. Use `@site/` para imports absolutos quando fizer sentido.
- Segredos e tokens residem em variáveis de ambiente; nunca versionar `.env`.

## Testing Guidelines
- Nomeie arquivos como `test_*.py` e cubra cenários felizes e de validação negativa.
- Centralize fixtures em `api/tests/conftest.py` para evitar duplicação.
- No website, rode `npm run build` antes do merge; introduza lint ou testes de links conforme o front crescer.
- Registre no PR os testes executados e dados relevantes (por exemplo, payloads de exemplo).

## Commit & Pull Request Guidelines
- Mensagens `tipo: resumo` (ex.: `feat: adicionar endpoint de sinastria`); mantenha commits focados.
- Branches partem de `main` com prefixos `feat/`, `fix/`, `docs/` ou `chore/`.
- PRs explicam problema, solução e impacto; inclua capturas ou respostas da API e associe issues (`#123`) quando existirem.
- Atualize documentação (`README.md`, docs) sempre que expor novos endpoints, páginas ou processos.

## Environment & Configuration Tips
- Modele segredos a partir de `.env.example` (ou duplique `.env` para `.env.local`) e armazene chaves RapidAPI em cofres seguros.
- Scripts de implantação (`Procfile`, `run.sh`) dependem do mesmo conjunto de dependências; ajuste-os ao evoluir argumentos de execução.
