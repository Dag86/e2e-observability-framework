import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('@smoke Create Todo', () => {
  test('User can create a new todo item', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.gotoHomePage();
    await homePage.addTodo('Buy groceries');
    await homePage.assertTodoVisible('Buy groceries');
  });
});
