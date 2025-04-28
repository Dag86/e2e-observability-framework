import { defineConfig } from '@playwright/test';
import { BASE_URL } from './src/constants/urls';

export default defineConfig({
  testDir: './src/tests',
  
  // Global timeouts
  timeout: 30 * 1000,  // Each test max 30 seconds
  expect: {
    timeout: 5 * 1000,  // Each assertion max 5 seconds
  },

  fullyParallel: true,
  retries: 1, // Retry once on failure (helps on CI flakes)

  reporter: [
    ['list'], // Console output
    ['json', { outputFile: 'reports/json-reports/report.json' }],
    ['html', { outputFolder: 'reports/playwright-reports', open: 'never' }]
  ],

  use: {
    headless: true,
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure', // 🛡️ Add trace only on failure too (easy debugging!)
    launchOptions: {
      slowMo: 50, // 🛡️ Slight slowMo makes test flakiness almost disappear without making tests slow
    },
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
    // You can enable WebKit later when ready
    // {
    //   name: 'WebKit',
    //   use: { browserName: 'webkit' },
    // },
  ],
});
