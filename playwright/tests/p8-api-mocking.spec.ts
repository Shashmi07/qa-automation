import { expect, test } from '@playwright/test';

const demoUrl = 'https://demo.playwright.dev/api-mocking';
const fruitsEndpoint = '**/api/v1/fruits';

test.describe('P8 API mocking demo', () => {
  test('returns and displays a custom fruit list', async ({ page }) => {
    await page.route(fruitsEndpoint, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Dragonfruit' },
          { id: 2, name: 'Passion fruit' },
        ]),
      });
    });

    await page.goto(demoUrl);

    await expect(page.getByRole('heading', { name: 'Render a List of Fruits' })).toBeVisible();
    await expect(page.locator('li')).toHaveText(['Dragonfruit', 'Passion fruit']);
  });

  test('returns a 500 response and displays the mocked error case', async ({ page }) => {
    await page.route(fruitsEndpoint, async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 500, name: 'Service unavailable' }]),
      });
    });

    const responsePromise = page.waitForResponse(fruitsEndpoint);
    await page.goto(demoUrl);
    const response = await responsePromise;

    expect(response.status()).toBe(500);
    await expect(page.locator('li')).toHaveText('Service unavailable');
  });

  test('adds one fruit to the real response', async ({ page }) => {
    await page.route(fruitsEndpoint, async route => {
      const response = await route.fetch();
      const fruits = await response.json();

      await route.fulfill({
        response,
        body: JSON.stringify([...fruits, { id: 999, name: 'Starfruit' }]),
      });
    });

    await page.goto(demoUrl);

    await expect(page.locator('li').last()).toHaveText('Starfruit');
  });
});
