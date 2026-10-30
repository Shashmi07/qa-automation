
import { test, expect } from '@playwright/test';
import testData from '../test-data/testData.json';

test('Two users have independent shopping carts', async ({ browser }) => {

  // Create two separate browser contexts
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  // Create separate pages
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  // USER 1 - standard user
  await page1.goto('https://www.saucedemo.com/');

  await page1.locator('[data-test="username"]')
    .fill(testData.users.standard.username);

  await page1.locator('[data-test="password"]')
    .fill(testData.users.standard.password);

  await page1.locator('[data-test="login-button"]').click();

  // Add Backpack to User 1 cart
  await page1.locator(
    `[data-test="${testData.products.backpack.dataTest}"]`
  ).click();

  await expect(page1.locator('.shopping_cart_badge'))
    .toHaveText('1');

  // USER 2 - problem user
  await page2.goto('https://www.saucedemo.com/');

  await page2.locator('[data-test="username"]')
    .fill(testData.users.problem.username);

  await page2.locator('[data-test="password"]')
    .fill(testData.users.problem.password);

  await page2.locator('[data-test="login-button"]').click();

  // Add Bike Light to User 2 cart
  await page2.locator(
    `[data-test="${testData.products.bikeLight.dataTest}"]`
  ).click();

  await expect(page2.locator('.shopping_cart_badge'))
    .toHaveText('1');

  // Check User 1 cart
  await page1.locator('.shopping_cart_link').click();

  await expect(page1.getByText(testData.products.backpack.name))
    .toBeVisible();

  await expect(page1.getByText(testData.products.bikeLight.name))
    .toHaveCount(0);

  // Check User 2 cart
  await page2.locator('.shopping_cart_link').click();

  await expect(page2.getByText(testData.products.bikeLight.name))
    .toBeVisible();

  await expect(page2.getByText(testData.products.backpack.name))
    .toHaveCount(0);

  console.log('Both users have independent shopping carts!');

  // Close browser contexts
  await context1.close();
  await context2.close();

});
