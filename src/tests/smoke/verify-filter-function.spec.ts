import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';

test.describe('@smoke HomePage filterTodos Function Verification', () => {
  test('should correctly filter Active, Completed, and All todos', async ({ page }) => {
    const homePage = new HomePage(page);

    // ➡️ Navigate to Home Page
    await homePage.gotoHomePage();

    // ➡️ Add two todos
    await homePage.addTodo('First active task');
    await homePage.addTodo('Second completed task');

    // ➡️ Mark the second todo as completed
    await page.locator(HomePageSelectors.todoToggle).nth(1).check();

    // ➡️ Test Active Filter
    await homePage.filterTodos('Active');
    await test.step('Verify only active task is visible', async () => {
      await expect(page.getByText('First active task')).toBeVisible();
      await expect(page.getByText('Second completed task')).not.toBeVisible();
    });

    // ➡️ Test Completed Filter
    await homePage.filterTodos('Completed');
    await test.step('Verify only completed task is visible', async () => {
      await expect(page.getByText('Second completed task')).toBeVisible();
      await expect(page.getByText('First active task')).not.toBeVisible();
    });

    // ➡️ Test All Filter
    await homePage.filterTodos('All');
    await test.step('Verify all tasks are visible', async () => {
      await expect(page.getByText('First active task')).toBeVisible();
      await expect(page.getByText('Second completed task')).toBeVisible();
    });
  });
});
