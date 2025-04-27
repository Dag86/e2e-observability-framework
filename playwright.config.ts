import { defineConfig } from '@playwright/test';
import { BASE_URL } from './src/constants/urls';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 5000, // 5 seconds for expect assertions
  },
  fullyParallel: true, // Run tests in parallel
  retries: 1, // Retry once on failure (useful for CI)
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/json-reports/report.json' }],
    ['html', { outputFolder: 'reports/playwright-reports', open: 'never' }]
  ],
  use: {
    headless: true, // Default headless, can override with CLI
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: BASE_URL 
  },
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'WebKit',
      use: { browserName: 'webkit' },
    },
  ],
});
