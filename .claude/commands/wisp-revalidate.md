---
name: wisp-revalidate
description: Dispara revalidação ISR do blog via /api/revalidate
---

Execute o curl abaixo para revalidar o cache do blog em produção:

```bash
curl -X POST https://psicologaemoutradimensao.vercel.app/api/revalidate \
  -H "Content-Type: application/json" \
  -d "{\"secret\":\"$REVALIDATION_SECRET\"}"
```

Se `$REVALIDATION_SECRET` não estiver definido no ambiente, instrua o usuário a rodar `vercel env pull .env.local` e tentar novamente.

Mostre o status HTTP da resposta e confirme se a revalidação foi bem-sucedida.
