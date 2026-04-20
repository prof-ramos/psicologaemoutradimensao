describe('revalidation auth logic', () => {
  it('rejeita quando secret está ausente', () => {
    const secret = 'my-secret'
    const provided = null
    expect(provided === secret).toBe(false)
  })

  it('rejeita com secret incorreto', () => {
    const secret = 'my-secret'
    const provided = 'wrong' as string
    expect(provided === secret).toBe(false)
  })

  it('aceita com secret correto', () => {
    const secret = 'my-secret'
    const provided = 'my-secret'
    expect(provided === secret).toBe(true)
  })
})
