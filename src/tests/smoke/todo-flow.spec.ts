import { test, expect, step } from '../../utils/custom-test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';
import { TestData } from '../../constants/test-data';

const todoItems = [
  TestData.todoItem.basic,
  TestData.todoItem.second,
  TestData.todoItem.specialChars,
  TestData.todoItem.longText
];

test.describe('@smoke Todo Flow', () => {
  for (const todoText of todoItems) {
    test(`Should create and complete a todo item: "${todoText}"`, async ({ page }) => {
      const homePage = new HomePage(page);

      await step('Should navigate to the Todo App', async () => {
        await homePage.gotoHomePage();
      });

      await step(`Should create a Todo item: "${todoText}"`, async () => {
        await homePage.addTodo(todoText);
      });

      await step('Should verify Todo was created', async () => {
        const todoItem = page.locator(HomePageSelectors.todoTitle);
        await expect(todoItem).toBeVisible();
      });

      await step('Should complete the Todo item', async () => {
        await page.check(HomePageSelectors.todoToggle);
      });

      await step('Should verify Todo is marked as completed', async () => {
        const todoItem = page.locator(HomePageSelectors.todoTitle);
        await expect(todoItem).toHaveCSS('text-decoration-line', 'line-through');
      });
    });
  }
});
