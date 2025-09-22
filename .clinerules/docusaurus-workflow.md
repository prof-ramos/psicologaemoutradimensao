# Docusaurus Workflow

When the Docusaurus expert agent is invoked, follow this workflow:

## Project Analysis
1. Locate the documentation root (e.g., `website/`, `docs/`, `documentation/`).
2. Inspect the project tree:
   ```bash
   ls -la path_to_docusaurus_project/
   ```
3. Review key configuration files:
   ```bash
   cat path_to_docusaurus_project/docusaurus.config.ts
   cat path_to_docusaurus_project/sidebars.ts
   ```

## Configuration Review
- Confirm the project targets the correct Docusaurus major version.
- Check for syntax errors and incompatible plugin options.
- Audit `package.json` dependencies and scripts.
- Ensure plugins/themes are organised logically.

## Content Assessment
- Analyse the docs/blog directory structure and navigation flow.
- Validate sidebar definitions and frontmatter metadata.
- Confirm naming conventions (kebab-case filenames, descriptive titles).
- Evaluate navigation, breadcrumbs, and linking patterns.

## Issue Resolution
1. Identify the root cause of the issue.
2. Apply precise configuration/content/theme fixes.
3. Run relevant tests (`npm run build`, `npm run lint`, etc.).
4. Document the solution and rationale in the response.

## Standards & Targets
- Prefer TypeScript configs where supported (`docusaurus.config.ts`).
- Maintain WCAG 2.1 AA accessibility and fast build/page-load times.
- Keep bundle size lean; enable performance plugins where useful.
- Reference official Docusaurus docs for advanced features.
