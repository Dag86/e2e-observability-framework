import { test, expect, step } from '../../utils/custom-test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';

test.describe('@smoke Todo App UI Behavior', () => {

  test('Should correctly filter Active and Completed todos', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await step('Should navigate to the Todo App', async () => {
      await homePage.gotoHomePage();
    });

    await step('Should add multiple todos', async () => {
      await homePage.addTodo('First active task');
      await homePage.addTodo('Second completed task');
    });

    await step('Should mark second todo as completed', async () => {
      const todoToggles = page.locator(HomePageSelectors.todoToggle);
      await todoToggles.nth(1).check();
    });

    const todoItems = page.locator(HomePageSelectors.todoTitle);

    await step('Should filter Active todos and verify result', async () => {
      await homePage.filterTodos('Active');
      await expect(todoItems).toHaveCount(1);
      await expect(todoItems.nth(0)).toContainText('First active task');
    });

    await step('Should filter Completed todos and verify result', async () => {
      await homePage.filterTodos('Completed');
      await expect(todoItems).toHaveCount(1);
      await expect(todoItems.nth(0)).toContainText('Second completed task');
    });
  });

  test('hould persist todos after page reload', async ({ page }) => {
    const homePage = new HomePage(page);

    await step('Should navigate to the Todo App', async () => {
      await homePage.gotoHomePage();
    });

    await step('Should add a persistent todo', async () => {
      await homePage.addTodo('Persistent task');
    });

    await step('Should reload the page', async () => {
      await page.reload();
    });

    await step('Should verify the todo persists after reload', async () => {
      const todoItems = page.locator(HomePageSelectors.todoTitle);
      await expect(todoItems).toContainText('Persistent task');
    });
  });

});
