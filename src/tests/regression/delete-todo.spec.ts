import { test, expect, step } from '../../utils/custom-test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';
import { TestData } from '../../constants/test-data';

test.describe('@regression Delete Todo', () => {
  test('Should delete a todo item', async ({ page }) => {
    const homePage = new HomePage(page);
    const todoText = TestData.todoItem.second;

    await step('Should navigate to the Todo App', async () => {
      await homePage.gotoHomePage();
    });

    await step('Should create a new Todo item', async () => {
      await homePage.addTodo(todoText);
    });

    await step('Should verify the Todo item was created', async () => {
      const todoItem = page.locator(HomePageSelectors.todoTitle);
      await expect(todoItem).toBeVisible();
    });

    await step('Should hover over and delete the Todo item', async () => {
      await homePage.deleteTodo(todoText);
    });

    await step('Should verify the Todo item no longer exists', async () => {
      const todoItems = page.locator(HomePageSelectors.todoTitle);
      await expect(todoItems).toHaveCount(0);
    });
  });
});
