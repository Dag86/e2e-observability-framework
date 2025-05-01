import { test, expect, step } from '../../utils/custom-test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';
import { TestData } from '../../constants/test-data';

test.describe('@regression Complete and Delete Todo', () => {
  test('Should complete a todo item and then delete it', async ({ page }) => {
    const homePage = new HomePage(page);
    const todoText = TestData.todoItem.basic;

    await step('Should navigate to the Todo App', async () => {
      await homePage.gotoHomePage();
    });

    await step('Should create a new Todo item', async () => {
      await homePage.addTodo(todoText);
    });

    await step('Should complete the Todo item', async () => {
      await homePage.completeTodo(todoText);
    });

    await step('Should hover over and delete the completed Todo item', async () => {
      await homePage.deleteTodo(todoText);
    });

    await step('Should verify the completed Todo item no longer exists', async () => {
      const todoItems = page.locator(HomePageSelectors.todoTitle);
      await expect(todoItems).toHaveCount(0);
    });
  });
});
