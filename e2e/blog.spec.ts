import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
  })

  test('carrega com heading visível', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('exibe posts ou mensagem de vazio', async ({ page }) => {
    // Cards de post: <a href="/blog/slug"> com <h2> dentro
    const postCards = page.locator('a[href^="/blog/"]:has(h2)')
    const count = await postCards.count()
    if (count > 0) {
      await expect(postCards.first()).toBeVisible()
    } else {
      await expect(page.getByText(/Em breve/i)).toBeVisible()
    }
  })

  test('link de post abre página do post', async ({ page }) => {
    const firstCard = page.locator('a[href^="/blog/"]:has(h2)').first()
    const count = await firstCard.count()
    if (count === 0) return // sem posts, skip

    await firstCard.click()
    await expect(page).toHaveURL(/\/blog\/.+/)
  })
})
