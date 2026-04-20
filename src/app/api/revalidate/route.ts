import { revalidatePath } from 'next/cache'
import { config } from '@/config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (!config.revalidationSecret || secret !== config.revalidationSecret) {
    return new Response('Unauthorized', { status: 401 })
  }

  revalidatePath('/', 'layout')

  return Response.json({ revalidated: true, now: Date.now() })
}
