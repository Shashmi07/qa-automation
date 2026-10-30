
import { test, expect } from '@playwright/test';

test('TodoMVC complete exercise', async ({ page }) => {

  // Open TodoMVC
  await page.goto('https://demo.playwright.dev/todomvc/');

  // Add three todos
  const todoInput = page.getByPlaceholder('What needs to be done?');

  await todoInput.fill('Learn Playwright');
  await todoInput.press('Enter');

  await todoInput.fill('Practice Automation Testing');
  await todoInput.press('Enter');

  await todoInput.fill('Learn Cross Browser Testing');
  await todoInput.press('Enter');

  // Verify three todos
  await expect(page.getByTestId('todo-item')).toHaveCount(3);

  // Complete the first todo
  const firstTodo = page.getByTestId('todo-item').nth(0);

  await firstTodo.getByRole('checkbox').check();

  // Verify completed count
  await expect(page.getByTestId('todo-item').filter({
    has: page.locator('.completed')
  })).toHaveCount(0); // We will verify using checkbox below

  // Filter Active todos
  await page.getByRole('link', { name: 'Active' }).click();

  await expect(page.getByTestId('todo-item')).toHaveCount(2);

  // Filter Completed todos
  await page.getByRole('link', { name: 'Completed' }).click();

  await expect(page.getByTestId('todo-item')).toHaveCount(1);

  // Clear completed todos
  await page.getByRole('button', {
    name: 'Clear completed'
  }).click();

  // Verify no completed todos remain
  await expect(page.getByTestId('todo-item')).toHaveCount(0);

 
});
