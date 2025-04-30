import { defineConfig } from '@playwright/test';
import { BASE_URL } from './src/constants/urls';


export default defineConfig({
  testDir: './src/tests',

  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },

  fullyParallel: true,
  retries: 1,

  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/json-reports/report.json' }],
    ['html', { outputFolder: 'reports/playwright-reports', open: 'never' }],
    ['./src/utils/log-reporter.ts'] // ✅ Custom log reporter now fully valid
  ],

  use: {
    headless: true,
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      slowMo: 50,
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
    // {
    //   name: 'WebKit',
    //   use: { browserName: 'webkit' },
    // },
  ],
});
