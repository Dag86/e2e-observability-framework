import { test, expect } from '@playwright/test';

test.describe('@api TodoMVC App Health Check', () => {
  test('Home page is reachable and returns HTML', async ({ request }) => {
    const response = await request.get('https://demo.playwright.dev/todomvc/');

    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/html');
  });
});
