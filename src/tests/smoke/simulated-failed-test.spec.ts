import { test, expect } from '@playwright/test';

test('@smoke Simulated failure', async ({ page }) => {
  await page.goto('https://example.com');
  expect(1).toBe(2); // ❌ This will always fail
});
