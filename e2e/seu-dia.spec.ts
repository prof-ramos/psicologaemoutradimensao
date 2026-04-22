import { test, expect } from '@playwright/test'

// A Wikipedia é chamada server-side (Server Component + fetch com cache).
// page.route() só intercepta requisições do browser → não funciona para mockar.
// Os testes de resultado usam a API real; para o "Neste dia, em X" usamos
// 20/07/1969 (pouso lunar) que está garantidamente na API como evento de 1969.

test.describe('Seu Dia — formulário', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/seu-dia')
  })

  test('renderiza campo de data e botão de envio', async ({ page }) => {
    await expect(page.locator('#nascimento-data')).toBeVisible()
    await expect(
      page.getByRole('button', { name: /Descobrir Meu Dia/i })
    ).toBeVisible()
  })

  test('heading principal está presente', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/Seu/i)
  })

  test('link "Seu Dia" no navbar navega para /seu-dia', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Seu Dia/i }).click()
    await expect(page).toHaveURL('/seu-dia')
  })

  test('submit com data válida redireciona para URL com param data', async ({ page }) => {
    await page.locator('#nascimento-data').fill('1990-04-22')
    await page.getByRole('button', { name: /Descobrir Meu Dia/i }).click()
    await expect(page).toHaveURL(/\/seu-dia\?data=1990-04-22/)
  })

  test('não exibe seções de resultado sem params na URL', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Eventos Históricos' })
    ).not.toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Nascimentos' })
    ).not.toBeVisible()
  })
})

test.describe('Seu Dia — resultado (API real)', () => {
  // Wikipedia retorna dados reais para 22 de abril.
  // Aumenta timeout do expect para cobrir latência da API.
  test.beforeEach(async ({ page }) => {
    await page.goto('/seu-dia?data=1990-04-22')
  })

  test('exibe data formatada no heading de resultados', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /22 de abril de 1990/i })
    ).toBeVisible()
  })

  test('campo de data está pré-preenchido com a data da URL', async ({ page }) => {
    await expect(page.locator('#nascimento-data')).toHaveValue('1990-04-22')
  })

  test('seção "Eventos Históricos" é exibida', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Eventos Históricos' })
    ).toBeVisible({ timeout: 15000 })
  })

  test('seção "Nascimentos" é exibida', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Nascimentos' })
    ).toBeVisible({ timeout: 15000 })
  })

  test('seção "Mortes" é exibida', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Mortes' })
    ).toBeVisible({ timeout: 15000 })
  })

  test('links da Wikipedia apontam para pt.wikipedia.org', async ({ page }) => {
    const wikiLinks = page.getByRole('link', { name: /Wikipedia/i })
    await expect(wikiLinks.first()).toBeVisible({ timeout: 15000 })
    const href = await wikiLinks.first().getAttribute('href')
    expect(href).toMatch(/pt\.wikipedia\.org/)
  })
})

test.describe('Seu Dia — seção "Neste dia"', () => {
  // 20/07/1969 = pouso lunar (Apollo 11): evento de 1969 está na API da Wikipedia
  // para esse dia → exactDayEvents ≥ 1 → ExactDaySection renderiza.
  // O componente exibe "Aconteceu neste dia" (p) + "em {year}" (h3) como dois
  // elementos separados — não há uma string unificada "Neste dia, em 1969".
  test('exibe seção "Aconteceu neste dia" para 20 de julho de 1969', async ({ page }) => {
    await page.goto('/seu-dia?data=1969-07-20')
    await expect(
      page.getByText('Aconteceu neste dia')
    ).toBeVisible({ timeout: 15000 })
    await expect(
      page.getByRole('heading', { name: /em 1969/i })
    ).toBeVisible()
  })
})

test.describe('Seu Dia — erro', () => {
  test('exibe alerta com data inválida', async ({ page }) => {
    await page.goto('/seu-dia?data=invalido')

    const errorAlert = page.getByRole('alert').filter({ hasText: /inválid/i })
    await expect(errorAlert).toBeVisible()
  })
})
