import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';

test.describe('@regression Todo Validation Tests', () => {
  test('User cannot add an empty todo item', async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Navigate to the Todo App', async () => {
      await homePage.gotoHomePage();
    });

    await test.step('Attempt to submit an empty todo', async () => {
      const inputField = page.locator(HomePageSelectors.newTodoInput);
      await inputField.focus();
      await inputField.press('Enter');
    });

    await test.step('Verify that no todo items were created', async () => {
      const todoItems = page.locator(HomePageSelectors.todoTitle);
      await expect(todoItems).toHaveCount(0);
    });
  });
});
