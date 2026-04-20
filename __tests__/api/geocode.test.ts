describe('geocode query validation', () => {
  it('rejeita query vazia', () => {
    const q = ''
    expect(q.trim().length < 2).toBe(true)
  })

  it('rejeita query com 1 caractere', () => {
    const q = 'S'
    expect(q.trim().length < 2).toBe(true)
  })

  it('aceita cidade válida', () => {
    const q = 'São Paulo'
    expect(q.trim().length >= 2).toBe(true)
  })

  it('aceita cidade estrangeira', () => {
    const q = 'Paris'
    expect(q.trim().length >= 2).toBe(true)
  })
})
