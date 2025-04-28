import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';

test.describe('@smoke Todo App UI Behavior', () => {
  
  test('should correctly filter Active and Completed todos', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoHomePage();

    // ➡️ Add todos
    await homePage.addTodo('First active task');
    await homePage.addTodo('Second completed task');

    // ➡️ Mark second todo as completed
    const todoToggles = page.locator(HomePageSelectors.todoToggle);
    await todoToggles.nth(1).check();

    const todoItems = page.locator(HomePageSelectors.todoTitle); // Centralized locator

    // ➡️ Filter Active todos
    await homePage.filterTodos('Active');
    await test.step('Verify only active task is visible', async () => {
      await expect(todoItems).toHaveCount(1);
      await expect(todoItems.nth(0)).toContainText('First active task');
    });

    // ➡️ Filter Completed todos
    await homePage.filterTodos('Completed');
    await test.step('Verify only completed task is visible', async () => {
      await expect(todoItems).toHaveCount(1);
      await expect(todoItems.nth(0)).toContainText('Second completed task');
    });
  });

  test('should persist todos after page reload', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoHomePage();

    // ➡️ Add a todo
    await homePage.addTodo('Persistent task');

    // ➡️ Reload the page
    await page.reload();

    const todoItems = page.locator(HomePageSelectors.todoTitle);

    await test.step('Verify the todo persists after reload', async () => {
      await expect(todoItems).toContainText('Persistent task');
    });
  });

});
