
import { test, expect } from '@playwright/test';

test('Sauce Demo products page visual comparison', async ({ page }) => {

  const username = process.env.SAUCE_USER || 'standard_user';

  // Navigate to Sauce Demo
  await page.goto('https://www.saucedemo.com/');

  // Login
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Verify products page
  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  // Compare screenshot with baseline
 
await expect(page).toHaveScreenshot('products-page.png', {
  fullPage: true,

  // Ignore changing cart badge content
  mask: [
    page.locator('.shopping_cart_badge'),
  ],

  // Allow a small number of pixel differences
  maxDiffPixels: 100,
});


});
