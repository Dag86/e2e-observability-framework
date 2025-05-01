import { Page, expect } from '@playwright/test';
import { BASE_URL } from '../constants/urls';
import { HomePageSelectors } from '../constants/selectors';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoHomePage() {
    await this.page.goto(BASE_URL);
  }

  async addTodo(todoText: string) {
    await this.page.locator(HomePageSelectors.newTodoInput).fill(todoText);
    await this.page.locator(HomePageSelectors.newTodoInput).press('Enter');
  }

  async completeTodo(todoText: string) {
    const todoItem = this.page.locator(HomePageSelectors.todoToggle).filter({ hasText: todoText });
    await todoItem.click();  

  }
  
  async deleteTodo(todoText: string) {
    const todoItem = this.page.locator(HomePageSelectors.todoTitle).filter({ hasText: todoText });
    await todoItem.hover();
    await this.page.locator(HomePageSelectors.todoDeleteButton).click();
  }

  async assertTodoVisible(todoText: string) {
    const todoItem = this.page.locator(HomePageSelectors.todoTitle).filter({ hasText: todoText });
    expect(todoItem).toBeVisible();
  }


  async filterTodos(filterName: 'All' | 'Active' | 'Completed') {
    let href = '#/';
    if (filterName === 'Active') href = '#/active';
    if (filterName === 'Completed') href = '#/completed';
  
    await this.page.locator(`ul.filters >> a[href="${href}"]`).click();
  }
  
  
  async clearCompleted() {
    await this.page.click(HomePageSelectors.clearCompletedButton);
  }  
  
}
