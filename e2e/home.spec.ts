import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('carrega com título correto', async ({ page }) => {
    await expect(page).toHaveTitle(/PsicologaEmOutraDimensão/)
  })

  test('ticker animado está visível', async ({ page }) => {
    await expect(page.getByText('NOVO POST TODA SEMANA').first()).toBeVisible()
  })

  test('heading principal está presente', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/Psicóloga/i)
  })

  test('botão "Ler os posts" navega para /blog', async ({ page }) => {
    await page.getByRole('link', { name: /Ler os posts/i }).click()
    await expect(page).toHaveURL('/blog')
  })

  test('seção de posts recentes está presente', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Posts recentes/i })
    ).toBeVisible()
  })
})
