import { test, expect, step } from '../../utils/custom-test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';

test.describe('@smoke HomePage filterTodos Function Verification', () => {
  test('should correctly filter Active, Completed, and All todos', async ({ page }) => {
    const homePage = new HomePage(page);

    await step('Navigate to Home Page', async () => {
      await homePage.gotoHomePage();
    });

    await step('Add two todos', async () => {
      await homePage.addTodo('First active task');
      await homePage.addTodo('Second completed task');
    });

    await step('Mark the second todo as completed', async () => {
      await page.locator(HomePageSelectors.todoToggle).nth(1).check();
    });

    await step('Test Active Filter and verify only active task is visible', async () => {
      await homePage.filterTodos('Active');
      await expect(page.getByText('First active task')).toBeVisible();
      await expect(page.getByText('Second completed task')).not.toBeVisible();
    });

    await step('Test Completed Filter and verify only completed task is visible', async () => {
      await homePage.filterTodos('Completed');
      await expect(page.getByText('Second completed task')).toBeVisible();
      await expect(page.getByText('First active task')).not.toBeVisible();
    });

    await step('Test All Filter and verify both tasks are visible', async () => {
      await homePage.filterTodos('All');
      await expect(page.getByText('First active task')).toBeVisible();
      await expect(page.getByText('Second completed task')).toBeVisible();
    });
  });
});
