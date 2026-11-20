import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4175/leaf-n-bloom/';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4175 --strictPort',
    url: new URL('shop.html', baseURL).href,
  },
});
