import { test, expect, Page } from '@playwright/test';

async function fillAndSubmit(page: Page, email: string, password: string) {
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test.describe('Login page render', () => {
  test('shows the email and password fields', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe('Successful login', () => {
  test('navigates to /dashboard after valid credentials', async ({ page }) => {
    await fillAndSubmit(page, 'admin@empresa.com', 'admin123');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });
});

test.describe('Failed login — wrong password', () => {
  test('shows "Credenciales incorrectas" and stays on /login', async ({ page }) => {
    await fillAndSubmit(page, 'admin@empresa.com', 'wrong-password');
    await expect(page.locator('.login-form__error')).toContainText('Credenciales incorrectas');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Failed login — inactive account', () => {
  test('shows "Cuenta inactiva" message', async ({ page }) => {
    await fillAndSubmit(page, 'inactive@empresa.com', 'admin123');
    await expect(page.locator('.login-form__error')).toContainText('Cuenta inactiva');
  });
});

test.describe('Form validation', () => {
  test('submit button is present and form shows validation on invalid email', async ({ page }) => {
    await page.fill('input[type="email"]', 'not-an-email');
    await page.fill('input[type="password"]', 'pass123');
    await page.locator('input[type="email"]').blur();
    await expect(page.locator('.login-form__field-error')).toContainText('Ingresa un correo válido');
  });
});
