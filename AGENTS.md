# Repository Guidelines

## Project Structure & Module Organization
Backend code lives in `api/app/` with FastAPI routers under `routers/`, data schemas in `schemas/`, and shared helpers in `core/`. Tests mirror this layout in `api/tests/`, using module-aligned suites and centralized fixtures in `conftest.py`. The Docusaurus front-end sits in `website/src/`, with authored content split between `website/docs/` and `website/blog/`. Keep strategic updates reflected in `ROADMAP.md` and `GEMINI.md` whenever backend or website work shifts direction.

## Build, Test, and Development Commands
Spin up the API locally with `cd api && uvicorn app.main:app --reload` for hot-reload iterations. Sync Python dependencies via `uv sync` (or `pip install -e .` when bootstraping). Regenerate OpenAPI artifacts by running `python dump_schema.py` after touching Pydantic models. For the website, initialize with `cd website && npm install`, preview using `npm run start`, and validate production output through `npm run build`. Type safety checks live behind `npm run typecheck`.

## Coding Style & Naming Conventions
Adopt four-space indentation for Python, naming modules and functions in `snake_case`, while classes stay `PascalCase`. Format Python code with `black . --line-length 200` before opening a PR. TypeScript and React components follow `PascalCase`, hooks use `camelCase`, and absolute imports prefer the `@site/` alias when practical. Keep all new files ASCII unless existing context dictates otherwise.

## Testing Guidelines
Use Pytest (`cd api && pytest -v`) to cover both happy-path and validation failures; integrate fixtures through `api/tests/conftest.py` to avoid duplication. Front-end changes must survive `npm run build`, and future linting or link-check steps should be added as the surface area grows. Name Python tests `test_*.py` and ensure sample payloads or edge cases are documented in the PR description.

## Commit & Pull Request Guidelines
Structure commit messages as `tipo: resumo`, e.g., `feat: adicionar endpoint de sinastria`, keeping scope tight. Branches start from `main` with prefixes like `feat/` or `fix/`. Pull requests should explain the problem, the implemented solution, observed API responses or UI captures, and reference issues (e.g., `#123`). Update relevant docs—`README.md`, `website/docs/`, or `ROADMAP.md`—whenever endpoints, flows, or processes evolve.

## Security & Configuration Tips
Never commit secrets; rely on environment variables sourced from `.env.example` or a local copy. Store RapidAPI keys and other credentials in secure vaults. Deployment scripts (`Procfile`, `run.sh`) assume parity with the declared dependencies—keep them in sync when adjusting runtime arguments or package versions.
