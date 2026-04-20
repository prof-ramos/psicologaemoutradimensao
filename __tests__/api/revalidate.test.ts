/**
 * @jest-environment node
 */

const mockRevalidatePath = jest.fn()

jest.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

jest.mock('../../src/config', () => ({
  config: {
    revalidationSecret: 'test-secret-value',
    baseUrl: 'http://localhost:3000',
    blog: { name: 'Test', metadata: { title: { default: 'Test', absolute: 'Test', template: '%s | Test' }, description: 'Test' } },
    ogImageSecret: 'test-og-secret',
    wisp: { blogId: 'test-blog-id' },
  },
}))

describe('POST /api/revalidate', () => {
  let POST: (req: Request) => Promise<Response>

  beforeAll(async () => {
    const mod = await import('../../src/app/api/revalidate/route')
    POST = mod.POST
  })

  beforeEach(() => {
    mockRevalidatePath.mockClear()
  })

  function makeRequest(body: unknown) {
    return new Request('http://localhost/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  it('retorna 401 quando body não é JSON válido', async () => {
    const req = new Request('http://localhost/api/revalidate', {
      method: 'POST',
      body: 'not-json',
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('retorna 401 quando secret está ausente', async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(401)
  })

  it('retorna 401 quando secret está incorreto', async () => {
    const res = await POST(makeRequest({ secret: 'wrong-secret' }))
    expect(res.status).toBe(401)
  })

  it('retorna 200 e revalida quando secret está correto', async () => {
    mockRevalidatePath.mockImplementation(() => undefined)
    const res = await POST(makeRequest({ secret: 'test-secret-value' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.revalidated).toBe(true)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
  })

  it('retorna 500 se revalidatePath lança erro', async () => {
    mockRevalidatePath.mockImplementation(() => { throw new Error('cache error') })
    const res = await POST(makeRequest({ secret: 'test-secret-value' }))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.revalidated).toBe(false)
  })
})
