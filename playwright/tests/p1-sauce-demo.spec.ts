import { test, expect } from '../fixtures/test-fixtures';
import testData from '../test-data/testData.json';

test.describe('Sauce Demo shopping flows', () => {
  test.beforeAll(() => {
    console.log('Starting Sauce Demo shopping flow tests');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test.afterEach(async ({ page }) => {
    const menuButton = page.locator('#react-burger-menu-btn');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.getByText('Logout', { exact: true }).click();
    }
  });

  test('valid login displays the inventory @smoke', async ({ loggedInPage }) => {
    await expect(loggedInPage).toHaveURL(/inventory\.html/);
    await expect(loggedInPage.getByText('Products', { exact: true })).toBeVisible();
  });

  test('locked-out user cannot log in', async ({ page }) => {
    await page.getByPlaceholder('Username').fill(testData.users.lockedOut.username);
    await page.getByPlaceholder('Password').fill(testData.users.lockedOut.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.getByText('Epic sadface: Sorry, this user has been locked out.')
    ).toBeVisible();
  });

  test('wrong password shows an error', async ({ page }) => {
    await page.getByPlaceholder('Username').fill(testData.users.standard.username);
    await page.getByPlaceholder('Password').fill(testData.users.invalidPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.getByText(
        'Epic sadface: Username and password do not match any user in this service'
      )
    ).toBeVisible();
  });

  test('add two products to cart @smoke', async ({ loggedInPage }) => {
    await loggedInPage.locator(`[data-test="${testData.products.backpack.dataTest}"]`).click();
    await loggedInPage.locator(`[data-test="${testData.products.bikeLight.dataTest}"]`).click();

    await expect(loggedInPage.locator('.shopping_cart_badge')).toHaveText('2');
    await loggedInPage.locator('.shopping_cart_link').click();
    await expect(loggedInPage).toHaveURL(/cart\.html/);
    await expect(loggedInPage.getByText(testData.products.backpack.name, { exact: true })).toBeVisible();
    await expect(loggedInPage.getByText(testData.products.bikeLight.name, { exact: true })).toBeVisible();
    await expect(loggedInPage.locator('.cart_quantity')).toHaveCount(2);
  });

  test('remove one product from cart', async ({ loggedInPage }) => {
    await loggedInPage.locator(`[data-test="${testData.products.backpack.dataTest}"]`).click();
    await loggedInPage.locator(`[data-test="${testData.products.bikeLight.dataTest}"]`).click();
    await loggedInPage.locator('.shopping_cart_link').click();

    await loggedInPage.getByRole('button', { name: 'Remove' }).first().click();

    await expect(loggedInPage.locator('.cart_quantity')).toHaveCount(1);
    await expect(loggedInPage.getByText(testData.products.bikeLight.name, { exact: true })).toBeVisible();
    await expect(loggedInPage.getByText(testData.products.backpack.name, { exact: true })).toHaveCount(0);
  });

  test('complete the full checkout @smoke', async ({ loggedInPage }) => {
    await loggedInPage.locator(`[data-test="${testData.products.backpack.dataTest}"]`).click();
    await loggedInPage.locator('.shopping_cart_link').click();
    await loggedInPage.getByRole('button', { name: 'Checkout' }).click();

    await loggedInPage.getByPlaceholder('First Name').fill(testData.checkout.firstName);
    await loggedInPage.getByPlaceholder('Last Name').fill(testData.checkout.lastName);
    await loggedInPage.getByPlaceholder('Zip/Postal Code').fill(testData.checkout.postalCode);
    await loggedInPage.getByRole('button', { name: 'Continue' }).click();
    await loggedInPage.locator('#finish').click();

    await expect(loggedInPage).toHaveURL(/checkout-complete\.html/);
    await expect(loggedInPage.getByText('Thank you for your order!')).toBeVisible();
  });
});
