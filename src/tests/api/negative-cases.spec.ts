import { test, expect } from '@playwright/test';

test.describe('@api TodoMVC App Negative Tests', () => {
  test('Returns 404 for invalid endpoint', async ({ request }) => {
    const response = await request.get('https://demo.playwright.dev/todomvc/nonexistent');

    expect(response.status()).toBe(404);
  });
});
