<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Design System Rule

Este projeto usa **NeoBrutalismo** como sistema visual oficial.

- Fonte de verdade para agentes: `DESIGN.md`
- Fonte de verdade: `docs/design/neobrutalism-system.md`
- Base local: `src/app/globals.css`
- Referência de componentes: `neobrutalism.dev`
- Referência consultiva: `https://context7.com/websites/neobrutalism_dev/llms.txt?tokens=21933`
- Formato persistente: `https://github.com/google-labs-code/design.md`

Ao refatorar UI:

- preserve bordas pretas explícitas, sombra dura deslocada e contraste alto
- preserve a presença física de cards, botões, inputs, badges e tabelas
- não substitua a linguagem NeoBrutalist por uma estética editorial suave, glassy ou minimalista lavada
- melhorias de hierarquia, legibilidade e espaçamento são desejadas, mas devem continuar claramente neobrutalist
- rode `npm run design:lint` quando alterar tokens, componentes globais ou regras visuais em `DESIGN.md`
