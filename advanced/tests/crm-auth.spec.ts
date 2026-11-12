import { test, expect, Page } from '@playwright/test';

const crmUrl = process.env.CRM_BASE_URL ?? 'http://localhost:3000';
const superadminPath = process.env.CRM_SUPERADMIN_PATH ?? '/settings';
const protectedPath = process.env.CRM_PROTECTED_PATH ?? '/dashboard';
const loginPath = process.env.CRM_LOGIN_PATH ?? '/login';

function requireCrm(project: string) {
  test.skip(!process.env.CRM_BASE_URL, 'Set CRM_BASE_URL to run against the CRM test copy');
  test.skip(test.info().project.name !== project, `Runs in the ${project} project`);
}

async function openCrm(page: Page, path: string) {
  await page.goto(new URL(path, crmUrl).toString());
}

test('superadmin opens the superadmin page', async ({ page }) => {
  requireCrm('crm-superadmin');
  await openCrm(page, superadminPath);
  await expect(page).toHaveURL(new RegExp(`${superadminPath.replace('/', '\\/')}`));
});

test('admin is blocked from the superadmin page', async ({ page }) => {
  requireCrm('crm-admin');
  await openCrm(page, superadminPath);
  await expect(page).not.toHaveURL(new RegExp(`${superadminPath.replace('/', '\\/')}`));
});

test('logout ends access to a protected page', async ({ page }) => {
  requireCrm('crm-superadmin');
  await openCrm(page, protectedPath);
  const signOutButton = page.getByRole('button', { name: /log[ -]?out|sign[ -]?out/i });
  await expect(signOutButton).toBeVisible();
  await Promise.all([
    page.waitForURL(new RegExp(`${loginPath.replace('/', '\\/')}$`)),
    signOutButton.click(),
  ]);
  await openCrm(page, protectedPath);
  await expect(page).toHaveURL(new RegExp(`${loginPath.replace('/', '\\/')}`));
});

test('a protected page redirects a logged-out user to login', async ({ browser }) => {
  requireCrm('crm-admin');
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  await openCrm(page, protectedPath);
  await expect(page).toHaveURL(new RegExp(`${loginPath.replace('/', '\\/')}`));
  await context.close();
});
