import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { HomePageSelectors } from '../../constants/selectors';

test('should correctly filter Active, Completed, and All todos', async ({ page }) => {

  // ✅ Initialize HomePage instance
  const homePage = new HomePage(page);

  // ✅ Navigate to Home Page
  await homePage.gotoHomePage();

  // ✅ Add two todos
  await homePage.addTodo('First active task');
  await homePage.addTodo('Second completed task');


  // ✅ Mark the second todo as completed
  const secondTodoToggle = page.locator(HomePageSelectors.todoToggle).nth(1);
  await secondTodoToggle.check();

  const todoItems = page.locator(HomePageSelectors.todoTitle); // ✅ Reusable locator

  // ✅ Test Active Filter
  await homePage.filterTodos('Active');
  await test.step('Verify only active task is visible', async () => {
    await expect(todoItems).toHaveCount(1);
    await expect(todoItems.nth(0)).toContainText('First active task');
  });

  // ✅ Test Completed Filter
  await homePage.filterTodos('Completed');
  await test.step('Verify only completed task is visible', async () => {
    await expect(todoItems).toHaveCount(1);
    await expect(todoItems.nth(0)).toContainText('Second completed task');
  });

  // ✅ Test All Filter
  await homePage.filterTodos('All');
  await test.step('Verify all tasks are visible', async () => {
    await expect(todoItems).toHaveCount(2);
  });
});
