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
    test(`User can create and complete a todo item: "${todoText}"`, async ({ page }) => {
      const homePage = new HomePage(page);

      await step('Navigate to the Todo App', async () => {
        await homePage.gotoHomePage();
      });

      await step(`Create a Todo item: "${todoText}"`, async () => {
        await homePage.addTodo(todoText);
      });

      await step('Verify Todo was created', async () => {
        const todoItem = page.locator(HomePageSelectors.todoTitle);
        await expect(todoItem).toBeVisible();
      });

      await step('Complete the Todo item', async () => {
        await page.check(HomePageSelectors.todoToggle);
      });

      await step('Verify Todo is marked as completed', async () => {
        const todoItem = page.locator(HomePageSelectors.todoTitle);
        await expect(todoItem).toHaveCSS('text-decoration-line', 'line-through');
      });
    });
  }
});
