
import { test, expect } from '@playwright/test';

test('Handle multiple windows', async ({ page }) => {

  // Open the website
  await page.goto('https://the-internet.herokuapp.com/windows');

  // Verify the main page heading
  await expect(page.getByRole('heading', {
    name: 'Opening a new window'
  })).toBeVisible();

  // Wait for the new tab and click the link
  const newPagePromise = page.waitForEvent('popup');

  await page.getByText('Click Here').click();

  const newPage = await newPagePromise;

  // Verify the new tab heading
  await expect(
    newPage.getByRole('heading', { name: 'New Window' })
  ).toBeVisible();

  console.log('New tab opened successfully!');
});
