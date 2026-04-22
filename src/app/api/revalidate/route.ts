import crypto from 'crypto'
import { integrationsConfig } from '@/config/integrations'
import { revalidatePath } from 'next/cache'

function timingSafeCompare(a: string, b: string): boolean {
  const bufA = crypto.createHash('sha256').update(a).digest()
  const bufB = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(bufA, bufB)
}

export async function POST(request: Request) {
  let secret: string | null = null
  try {
    const body = await request.json()
    secret = body.secret ?? null
  } catch {
    return new Response('Unauthorized', { status: 401 })
  }

  if (
    !integrationsConfig.revalidationSecret ||
    !secret ||
    !timingSafeCompare(secret, integrationsConfig.revalidationSecret)
  ) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    revalidatePath('/', 'layout')
  } catch (err) {
    console.error('revalidatePath error:', err)
    return Response.json(
      { revalidated: false, message: 'Internal server error', now: Date.now() },
      { status: 500 }
    )
  }

  return Response.json({ revalidated: true, now: Date.now() })
}
