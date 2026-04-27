---
name: pre-deploy
description: Roda lint + tsc + jest + build antes do deploy para Vercel
---

Execute a sequência de verificação pré-deploy na ordem abaixo. Pare imediatamente se qualquer etapa falhar e mostre o erro completo.

1. `npx eslint . --max-warnings=0`
2. `npx tsc --noEmit`
3. `npx jest --no-coverage --passWithNoTests`
4. `npm run build`

Se tudo passar, confirme sucesso e pergunte se deve executar `vercel --prod`.
