import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';
import { TestData } from '../../constants/test-data';

test.describe('@regression Delete Todo', () => {
  test('User can delete a todo item', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.gotoHomePage();

    const todoText = TestData.todoItem.second;

    // Step 1: Create a Todo
    await homePage.addTodo(todoText);

    // Step 2: Verify Todo was created
    const todoItem = page.locator(HomePageSelectors.todoTitle);
    await expect(todoItem).toBeVisible();

    // Step 3: Hover over todo item and click delete button
    await page.hover(HomePageSelectors.todoTitle);
    await page.click(HomePageSelectors.todoDeleteButton); 

    // Step 4: Verify Todo is no longer visible
    await expect(todoItem).toHaveCount(0);
  });
});
