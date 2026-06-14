import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '3g-throttle',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [],
        },
        // Simulates Slow 3G: 500 kbps down, 500 kbps up, 400ms latency
        contextOptions: {
          offline: false,
        },
      },
    },
  ],
  webServer: {
    command: 'npx ng serve --proxy-config proxy.conf.json --port 4200',
    port: 4200,
    reuseExistingServer: true,
    timeout: 60000,
  },
});
