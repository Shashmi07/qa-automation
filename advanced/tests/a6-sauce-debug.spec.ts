import { test, expect } from '@playwright/test';

const testData = {
  users: {
    performanceGlitch: {
      username: 'performance_glitch_user',
      password: 'secret_sauce',
    },
    error: {
      username: 'error_user',
      password: 'secret_sauce',
    },
  },
  checkout: {
    firstName: 'test',
    lastName: 'User',
    postalCode: '12345',
  },
};

const sauceUrl = 'https://www.saucedemo.com/';

test.describe('A6 Sauce diagnostics', () => {
  test('A6a performance glitch user logs in without a fixed delay @a6a', async ({ page }) => {
    await page.goto(sauceUrl);
    await page.getByPlaceholder('Username').fill(testData.users.performanceGlitch.username);
    await page.getByPlaceholder('Password').fill(testData.users.performanceGlitch.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Synchronize with the application navigation instead of sleeping for an assumed duration.
    await expect(page).toHaveURL(/inventory\.html/, { timeout: 15_000 });
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('A6b error user checkout captures the known failure @a6b', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(sauceUrl);
    await page.getByPlaceholder('Username').fill(testData.users.error.username);
    await page.getByPlaceholder('Password').fill(testData.users.error.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('#add-to-cart-sauce-labs-backpack').click();
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill(testData.checkout.firstName);
    await page.getByPlaceholder('Last Name').fill(testData.checkout.lastName);
    await page.getByPlaceholder('Zip/Postal Code').fill(testData.checkout.postalCode);
    await page.getByRole('button', { name: 'Continue' }).click();

    // Leave this statement for VS Code's JavaScript/TypeScript debugger.
    debugger;
    await page.locator('#finish').click();
    console.log(JSON.stringify({ consoleErrors, pageErrors }));
    await page.screenshot({ path: 'test-results/a6d-error-user-checkout.png', fullPage: true });

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
    expect(pageErrors).toEqual(
      expect.arrayContaining([
        "Cannot read properties of undefined (reading 'value')",
        'wa.cesetRart is not a function',
      ])
    );
  });
});
