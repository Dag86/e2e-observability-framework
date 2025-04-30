import { test, expect, step } from '../../utils/custom-test';

test.describe('@api TodoMVC App Health Check', () => {
  test('Home page is reachable and returns HTML', async ({ request }) => {
    await step('Send GET request to TodoMVC', async () => {
      const response = await request.get('https://demo.playwright.dev/todomvc/');
      await expect(response).toBeOK();
      expect(response.status()).toBe(200);

      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    });
  });
});
