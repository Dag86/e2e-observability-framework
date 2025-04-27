import { Page } from '@playwright/test';
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
    await this.page.fill(HomePageSelectors.newTodoInput, todoText);
    await this.page.press(HomePageSelectors.newTodoInput, 'Enter');
  }

  async assertTodoVisible(todoText: string) {
    await this.page.waitForSelector(HomePageSelectors.todoTitle);
  }
}
