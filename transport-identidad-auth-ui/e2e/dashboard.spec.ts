import { test, expect, Page } from '@playwright/test';

async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@empresa.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
}

test.describe('Dashboard — layout', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('renders the dashboard header with the brand name', async ({ page }) => {
    await expect(page.locator('.dash-header')).toBeVisible();
    await expect(page.locator('.dash-header__brand-name')).toContainText('TransportControl');
  });

  test('renders the authenticated user name in the header', async ({ page }) => {
    const userInfo = page.locator('.dash-header__user-name');
    await expect(userInfo).toBeVisible();
    await expect(userInfo).not.toBeEmpty();
  });

  test('renders the sidebar with menu items', async ({ page }) => {
    await expect(page.locator('.dash-sidebar')).toBeVisible();
    const items = page.locator('.dash-sidebar__item');
    await expect(items).toHaveCount(3);
  });

  test('menu items are marked as Próximamente (disabled)', async ({ page }) => {
    const badges = page.locator('.dash-sidebar__badge');
    await expect(badges).toHaveCount(3);
    for (const badge of await badges.all()) {
      await expect(badge).toContainText('Próximamente');
    }
  });

  test('renders work area with Gastos Ejecutados widget', async ({ page }) => {
    await expect(page.locator('.work-area')).toBeVisible();
    const cards = page.locator('app-summary-card');
    await expect(cards).toHaveCount(2);
  });

  test('renders Cargas Transportadas section', async ({ page }) => {
    const sections = page.locator('app-loads-section');
    await expect(sections.first()).toBeVisible();
  });

  test('renders Cargas Asignadas section', async ({ page }) => {
    const sections = page.locator('app-loads-section');
    await expect(sections.last()).toBeVisible();
  });

  test('renders the footer', async ({ page }) => {
    await expect(page.locator('.dash-footer')).toBeVisible();
  });
});

test.describe('Dashboard — logout', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('header logout button redirects to /login', async ({ page }) => {
    await page.click('.dash-header__logout-btn');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('sidebar logout button redirects to /login', async ({ page }) => {
    await page.click('.dash-sidebar__logout');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});

test.describe('Dashboard — auth guard', () => {
  test('unauthenticated access to /dashboard redirects to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});
