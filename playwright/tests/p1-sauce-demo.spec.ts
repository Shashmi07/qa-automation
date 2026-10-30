
import { test, expect } from '@playwright/test';

// Reusable login function
async function login(
  page: import('@playwright/test').Page,
  username: string,
  password: string
) {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

// Test 1: Valid login
test('valid login', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory.html/);
  await expect(
    page.getByText('Products', { exact: true })
  ).toBeVisible();
});

// Test 2: Locked-out user
test('locked-out user cannot log in', async ({ page }) => {
  await login(page, 'locked_out_user', 'secret_sauce');

  await expect(
    page.getByText(
      'Epic sadface: Sorry, this user has been locked out.'
    )
  ).toBeVisible();
});

// Test 3: Wrong password
test('wrong password shows an error', async ({ page }) => {
  await login(page, 'standard_user', 'wrong_password');

  await expect(
    page.getByText(
      'Epic sadface: Username and password do not match any user in this service'
    )
  ).toBeVisible();
});

// Test 4: Add two products to the cart

test('add two products to cart', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  await page
    .locator('[data-test="add-to-cart-"]')
    .click();
  await page
    .locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
    .click();

  // Check that the cart badge shows 2
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // Open the cart
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart.html/);

  await expect(
    page.getByText('Sauce Labs Backpack', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText('Sauce Labs Bike Light', { exact: true })
  ).toBeVisible();

  await expect(page.locator('.cart_quantity')).toHaveCount(2);
});

  

// Test 5: Remove one product

test('remove one product from cart', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  await page
    .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    .click();
  await page
    .locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
    .click();

  await page.locator('.shopping_cart_link').click();
  await expect(page.locator('.cart_quantity')).toHaveCount(2);

  // Remove the first product
  await page.getByRole('button', { name: 'Remove' }).first().click();

  await expect(page.locator('.cart_quantity')).toHaveCount(1);

  await expect(
    page.getByText('Sauce Labs Bike Light', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText('Sauce Labs Backpack', { exact: true })
  ).toHaveCount(0);
});

// Test 6: Full checkout
test('complete the full checkout', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  const addButtons = page.getByRole('button', {
    name: 'Add to cart'
  });

  await addButtons.nth(0).click();
  await addButtons.nth(1).click();

  await page.locator('.shopping_cart_link').click();

  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(page).toHaveURL(/checkout-step-one.html/);

  await page.getByPlaceholder('First Name').fill('Test');
  await page.getByPlaceholder('Last Name').fill('User');
  await page.getByPlaceholder('Zip/Postal Code').fill('10100');

  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/checkout-step-two.html/);
  await expect(
    page.getByText('Payment Information')
  ).toBeVisible();

  // XPath locator comparison: find the Finish button
  await page.locator('xpath=//button[@id="finish"]').click();

  await expect(page).toHaveURL(/checkout-complete.html/);
  await expect(
    page.getByText('Thank you for your order!')
  ).toBeVisible();
});
