import { test, expect } from '@playwright/test'

const MOBILE_BREAKPOINT = 768

test.describe('Navbar — mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('botão hamburger está visível em mobile', async ({ page, viewport }) => {
    test.skip(viewport!.width >= MOBILE_BREAKPOINT, 'apenas em mobile')
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible()
  })

  test('nav desktop está oculta em mobile', async ({ page, viewport }) => {
    test.skip(viewport!.width >= MOBILE_BREAKPOINT, 'apenas em mobile')
    await expect(page.locator('div.hidden.md\\:flex')).not.toBeVisible()
  })

  test('clicar no hamburger abre o menu mobile', async ({ page, viewport }) => {
    test.skip(viewport!.width >= MOBILE_BREAKPOINT, 'apenas em mobile')
    await expect(page.locator('#mobile-menu')).not.toBeAttached()
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.locator('#mobile-menu')).toBeVisible()
  })

  test('aria-expanded reflete o estado do menu', async ({ page, viewport }) => {
    test.skip(viewport!.width >= MOBILE_BREAKPOINT, 'apenas em mobile')
    const hamburger = page.getByRole('button', { name: 'Abrir menu' })
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
    await hamburger.click()
    await expect(
      page.getByRole('button', { name: 'Fechar menu' })
    ).toHaveAttribute('aria-expanded', 'true')
  })

  test('clicar no hamburger novamente fecha o menu', async ({ page, viewport }) => {
    test.skip(viewport!.width >= MOBILE_BREAKPOINT, 'apenas em mobile')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.locator('#mobile-menu')).toBeVisible()
    await page.getByRole('button', { name: 'Fechar menu' }).click()
    await expect(page.locator('#mobile-menu')).not.toBeAttached()
  })

  test('clicar em link do menu fecha o menu e navega', async ({ page, viewport }) => {
    test.skip(viewport!.width >= MOBILE_BREAKPOINT, 'apenas em mobile')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.locator('#mobile-menu')).toBeVisible()
    await page.locator('#mobile-menu').getByRole('link', { name: 'Blog' }).click()
    await expect(page.locator('#mobile-menu')).not.toBeAttached()
    await expect(page).toHaveURL('/blog')
  })

  test('todos os links de navegação estão presentes no menu mobile', async ({ page, viewport }) => {
    test.skip(viewport!.width >= MOBILE_BREAKPOINT, 'apenas em mobile')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    const menu = page.locator('#mobile-menu')
    await expect(menu.getByRole('link', { name: 'Blog' })).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Mapa Astral' })).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Seu Dia' })).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Contato' })).toBeVisible()
  })
})

test.describe('Navbar — desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('botão hamburger está oculto em desktop', async ({ page, viewport }) => {
    test.skip(viewport!.width < MOBILE_BREAKPOINT, 'apenas em desktop')
    await expect(page.getByRole('button', { name: 'Abrir menu' })).not.toBeVisible()
  })

  test('nav desktop está visível em desktop', async ({ page, viewport }) => {
    test.skip(viewport!.width < MOBILE_BREAKPOINT, 'apenas em desktop')
    await expect(page.locator('div.hidden.md\\:flex')).toBeVisible()
  })

  test('links de navegação desktop estão visíveis', async ({ page, viewport }) => {
    test.skip(viewport!.width < MOBILE_BREAKPOINT, 'apenas em desktop')
    const desktopNav = page.locator('div.hidden.md\\:flex')
    await expect(desktopNav.getByRole('link', { name: 'Blog' })).toBeVisible()
    await expect(desktopNav.getByRole('link', { name: 'Mapa Astral' })).toBeVisible()
    await expect(desktopNav.getByRole('link', { name: 'Seu Dia' })).toBeVisible()
    await expect(desktopNav.getByRole('link', { name: 'Contato' })).toBeVisible()
  })
})

test.describe('Navbar — compartilhado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('logo está visível em todos os viewports', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /PsicologaEmOutraDimensão/i })
    ).toBeVisible()
  })

  test('header tem role navigation acessível', async ({ page }) => {
    await expect(
      page.getByRole('navigation', { name: 'Main navigation' })
    ).toBeVisible()
  })
})
