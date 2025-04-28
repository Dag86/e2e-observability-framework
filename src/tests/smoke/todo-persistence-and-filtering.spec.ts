import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';

test.describe('@smoke Todo App UI Behavior', () => {
  test('User can filter active and completed todos', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.gotoHomePage();
    await homePage.addTodo('First active task');
    await homePage.addTodo('Second completed task');

    // Complete the second task
    const secondTodoToggle = page.locator(HomePageSelectors.todoToggle).nth(1);
    await secondTodoToggle.check();

    // Filter Active
    await homePage.filterTodos('Active');
    await page.waitForURL('**/active'); // 🛠️ Explicit wait for URL after clicking filter

    const activeItems = page.locator(HomePageSelectors.todoTitle);
    await expect(activeItems).toHaveCount(1);
    await expect(activeItems.first()).toContainText('First active task');

    // Filter Completed
    await homePage.filterTodos('Completed');
    await page.waitForURL('**/completed'); // 🛠️ Explicit wait for URL after clicking filter

    const completedItems = page.locator(HomePageSelectors.todoTitle);
    await expect(completedItems).toHaveCount(1);
    await expect(completedItems.first()).toContainText('Second completed task');
  });

  test('Todos persist after page reload', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.gotoHomePage();
    await homePage.addTodo('Persistent task');

    // Reload the page
    await page.reload();

    // Verify the todo still exists after reload
    const todoItems = page.locator(HomePageSelectors.todoTitle);
    await expect(todoItems).toContainText('Persistent task');
  });
});
