import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';

test.describe('@smoke Todo Flow', () => {
  test('User can create and complete a todo item', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.gotoHomePage();

    const todoText = 'Wash the car';

    // Step 1: Create a Todo
    await homePage.addTodo(todoText);

    // Step 2: Verify Todo was created
    const todoItem = page.locator(HomePageSelectors.todoTitle);
    await expect(todoItem).toBeVisible();

    // Step 3: Complete the Todo
    await page.check(HomePageSelectors.todoToggle);

    // Step 4: Verify Todo is marked as completed
    await expect(todoItem).toHaveCSS('text-decoration-line', 'line-through');
  });
});
