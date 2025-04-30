import { test, expect, step } from '../../utils/custom-test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';
import { TestData } from '../../constants/test-data';

test.describe('@regression Complete and Delete Todo', () => {
  test('User can complete a todo item and then delete it', async ({ page }) => {
    const homePage = new HomePage(page);
    const todoText = TestData.todoItem.basic;

    await step('Navigate to the Todo App', async () => {
      await homePage.gotoHomePage();
    });

    await step('Create a new Todo item', async () => {
      await homePage.addTodo(todoText);
    });

    await step('Complete the Todo item', async () => {
      const todoToggle = page.locator(HomePageSelectors.todoToggle);
      await todoToggle.check();
    });

    await step('Hover over and delete the completed Todo item', async () => {
      const todoItem = page.locator(HomePageSelectors.todoTitle);
      await todoItem.hover();
      await page.click(HomePageSelectors.todoDeleteButton);
    });

    await step('Verify the completed Todo item no longer exists', async () => {
      const todoItems = page.locator(HomePageSelectors.todoTitle);
      await expect(todoItems).toHaveCount(0);
    });
  });
});
