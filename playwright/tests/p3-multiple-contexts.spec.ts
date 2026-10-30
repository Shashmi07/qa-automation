
import { test, expect } from '@playwright/test';

test('Two users have independent shopping carts', async ({ browser }) => {

  // Create two separate browser contexts
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  // Create separate pages
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  // USER 1 - standard_user
  await page1.goto('https://www.saucedemo.com/');

  await page1.locator('[data-test="username"]')
    .fill('standard_user');

  await page1.locator('[data-test="password"]')
    .fill('secret_sauce');

  await page1.locator('[data-test="login-button"]').click();

  // Add Backpack to User 1 cart
  await page1.locator(
    '[data-test="add-to-cart-sauce-labs-backpack"]'
  ).click();

  await expect(page1.locator('.shopping_cart_badge'))
    .toHaveText('1');

  // USER 2 - problem_user
  await page2.goto('https://www.saucedemo.com/');

  await page2.locator('[data-test="username"]')
    .fill('problem_user');

  await page2.locator('[data-test="password"]')
    .fill('secret_sauce');

  await page2.locator('[data-test="login-button"]').click();

  // Add Bike Light to User 2 cart
  await page2.locator(
    '[data-test="add-to-cart-sauce-labs-bike-light"]'
  ).click();

  await expect(page2.locator('.shopping_cart_badge'))
    .toHaveText('1');

  // Check User 1 cart
  await page1.locator('.shopping_cart_link').click();

  await expect(page1.getByText('Sauce Labs Backpack'))
    .toBeVisible();

  await expect(page1.getByText('Sauce Labs Bike Light'))
    .toHaveCount(0);

  // Check User 2 cart
  await page2.locator('.shopping_cart_link').click();

  await expect(page2.getByText('Sauce Labs Bike Light'))
    .toBeVisible();

  await expect(page2.getByText('Sauce Labs Backpack'))
    .toHaveCount(0);

  console.log('Both users have independent shopping carts!');

  // Close browser contexts
  await context1.close();
  await context2.close();

});
