import { test, expect, step } from '../../utils/custom-test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';

test.describe('@regression Todo Validation Tests', () => {
  test('Should not add an empty todo item', async ({ page }) => {
    const homePage = new HomePage(page);

    await step('Should navigate to the Todo App', async () => {
      await homePage.gotoHomePage();
    });

    await step('Should attempt to submit an empty todo', async () => {
      const inputField = page.locator(HomePageSelectors.newTodoInput);
      await inputField.focus();
      await inputField.press('Enter');
    });

    await step('Should verify that no todo items were created', async () => {
      const todoItems = page.locator(HomePageSelectors.todoTitle);
      await expect(todoItems).toHaveCount(0);
    });
  });
});
