import { test, expect, step } from '../../utils/custom-test';

test.describe('@api TodoMVC App Negative Tests', () => {
  test('Returns 404 for invalid endpoint', async ({ request }) => {
    await step('Send GET request to invalid path', async () => {
      const response = await request.get('https://demo.playwright.dev/todomvc/nonexistent');
      expect(response.status()).toBe(404);
    });
  });
});
