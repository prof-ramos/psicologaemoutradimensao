# Lint Assistant

Analyze and fix linting issues in $ARGUMENTS following project conventions.

## Task

I'll help you identify and fix code style and quality issues.

**Note:** This project does not have ESLint, Prettier, Husky, TSLint, or stylelint installed. If you want to add linting, I can set it up — just ask.

## Process

1. Check `package.json` for any installed linting tools
2. If none found, report that no linters are configured and offer to set one up
3. If tools are present, run them and parse results
4. Apply automatic fixes where possible
5. Explain issues that require manual intervention
6. Verify fixes don't introduce new problems

## What I Can Set Up (if requested)

- **ESLint** — static analysis for JS/TS: `npm install -D eslint @eslint/js typescript-eslint`
- **Prettier** — code formatting: `npm install -D prettier`
- **eslint-config-next** — Next.js recommended rules (includes React, a11y): bundled with Next.js via `next lint`

## Common Issues I Can Fix (once tools are present)

- Unused variables and imports
- Missing TypeScript type annotations
- Accessibility (a11y) issues in React components
- Deprecated API usage
- Import ordering problems
