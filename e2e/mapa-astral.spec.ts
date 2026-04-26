import { test, expect } from '@playwright/test'

test.describe('Mapa Astral — formulário', () => {
  test('renderiza campos e botão de calcular', async ({ page }) => {
    await page.goto('/mapa-astral')

    await expect(page.getByLabel(/Data de nascimento/i)).toBeVisible()
    await expect(page.getByLabel(/Hora de nascimento/i)).toBeVisible()
    await expect(page.getByLabel(/Cidade de nascimento/i)).toBeVisible()
    await expect(
      page.getByRole('button', { name: /Calcular Mapa Astral/i })
    ).toBeVisible()
  })

  test('busca de cidade com API mockada exibe resultados', async ({ page }) => {
    await page.route('**/api/geocode**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            display_name: 'São Paulo, SP, Brasil',
            lat: '-23.5505',
            lon: '-46.6333',
            place_id: '1',
          },
        ]),
      })
    })

    await page.goto('/mapa-astral')
    await page.getByLabel(/Cidade de nascimento/i).fill('São Paulo')
    await page.getByRole('button', { name: /Buscar/i }).click()

    await expect(page.getByRole('listbox')).toBeVisible()
    await expect(page.getByRole('option').first()).toContainText('São Paulo')
  })
})

test.describe('Mapa Astral — resultado', () => {
  test('exibe resultado com params válidos na URL', async ({ page }) => {
    await page.goto(
      '/mapa-astral?data=1990-03-15&hora=14:30&lat=-23.5505&lng=-46.6333&cidade=S%C3%A3o%20Paulo'
    )

    await expect(
      page.getByRole('heading', { name: /Seu Céu Natal/i })
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Abrir Seu Dia/i })
    ).toHaveAttribute('href', '/seu-dia?data=1990-03-15')
  })

  test('exibe erro com data inválida', async ({ page }) => {
    await page.goto('/mapa-astral?data=invalido&lat=-23.55&lng=-46.63')

    // Filtra pelo alerta de erro (evita conflito com o route-announcer do Next.js)
    const errorAlert = page.getByRole('alert').filter({ hasText: /inválid/i })
    await expect(errorAlert).toBeVisible()
  })
})
