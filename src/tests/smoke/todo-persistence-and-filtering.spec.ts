import { test, expect, step } from '../../utils/custom-test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';

test.describe('@smoke Todo App UI Behavior', () => {

  test('should correctly filter Active and Completed todos', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await step('Navigate to the Todo App', async () => {
      await homePage.gotoHomePage();
    });

    await step('Add multiple todos', async () => {
      await homePage.addTodo('First active task');
      await homePage.addTodo('Second completed task');
    });

    await step('Mark second todo as completed', async () => {
      const todoToggles = page.locator(HomePageSelectors.todoToggle);
      await todoToggles.nth(1).check();
    });

    const todoItems = page.locator(HomePageSelectors.todoTitle);

    await step('Filter Active todos and verify result', async () => {
      await homePage.filterTodos('Active');
      await expect(todoItems).toHaveCount(1);
      await expect(todoItems.nth(0)).toContainText('First active task');
    });

    await step('Filter Completed todos and verify result', async () => {
      await homePage.filterTodos('Completed');
      await expect(todoItems).toHaveCount(1);
      await expect(todoItems.nth(0)).toContainText('Second completed task');
    });
  });

  test('should persist todos after page reload', async ({ page }) => {
    const homePage = new HomePage(page);

    await step('Navigate to the Todo App', async () => {
      await homePage.gotoHomePage();
    });

    await step('Add a persistent todo', async () => {
      await homePage.addTodo('Persistent task');
    });

    await step('Reload the page', async () => {
      await page.reload();
    });

    await step('Verify the todo persists after reload', async () => {
      const todoItems = page.locator(HomePageSelectors.todoTitle);
      await expect(todoItems).toContainText('Persistent task');
    });
  });

});
