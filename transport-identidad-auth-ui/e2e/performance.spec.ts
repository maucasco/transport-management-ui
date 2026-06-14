import { test, expect } from '@playwright/test';
import * as path from 'path';

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'playwright-evidence');

test.describe('Performance — login flow timing', () => {
  test('login → dashboard completes in < 5000ms under normal conditions', async ({ page }) => {
    const start = Date.now();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@empresa.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
    const elapsed = Date.now() - start;
    console.log(`Login flow elapsed: ${elapsed}ms`);
    expect(elapsed).toBeLessThan(5000);
  });
});

test.describe('Visual evidence', () => {
  test('screenshot: login page idle state', async ({ page }) => {
    await page.goto('/login');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-login-idle.png`, fullPage: true });
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('screenshot: login page error state (wrong password)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@empresa.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-form__error')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/02-login-error-401.png`, fullPage: true });
  });

  test('screenshot: login page error state (inactive account)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'inactive@empresa.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-form__error')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/03-login-error-403.png`, fullPage: true });
  });

  test('screenshot: dashboard after successful login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@empresa.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/04-dashboard-after-login.png`, fullPage: true });
  });

  test('screenshot: validation error on invalid email', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'not-an-email');
    await page.locator('input[type="email"]').blur();
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/05-login-validation-email.png`, fullPage: true });
  });
});
