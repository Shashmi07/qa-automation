import { test as setup, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const authDir = path.resolve(__dirname, '..', '.auth');
const sauceUrl = 'https://www.saucedemo.com/';
const crmUrl = process.env.CRM_BASE_URL ?? 'http://localhost:3000';

async function login(page: import('@playwright/test').Page, url: string, username: string, password: string) {
  await page.goto(url);
  await page.getByLabel(/user(name)?|email address/i).fill(username);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByRole('button', { name: /log[ -]?in|sign[ -]?in/i }).click();
}

setup('authenticate Sauce Demo user', async ({ page }) => {
  await fs.mkdir(authDir, { recursive: true });
  await login(page, sauceUrl, 'standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: path.join(authDir, 'sauce-user.json') });
});

setup('authenticate CRM superadmin and admin', async ({ browser }) => {
  setup.skip(!process.env.CRM_BASE_URL, 'Set CRM_BASE_URL to authenticate the CRM test copy');

  const credentials = [
    {
      name: 'crm-superadmin.json',
      username: process.env.CRM_SUPERADMIN_USERNAME ?? 'superadmin@doclink.com',
      password: process.env.CRM_SUPERADMIN_PASSWORD ?? 'SuperAdmin@123',
    },
    {
      name: 'crm-admin.json',
      username: process.env.CRM_ADMIN_USERNAME ?? 'admin@doclink.com',
      password: process.env.CRM_ADMIN_PASSWORD ?? '#q2rCRg7!eWsTL',
    },
  ];

  for (const account of credentials) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page, crmUrl, account.username, account.password);
    await expect(page).toHaveURL(/\/dashboard/);
    await context.storageState({ path: path.join(authDir, account.name) });
    await context.close();
  }
});
