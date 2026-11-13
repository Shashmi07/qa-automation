import { test, expect } from "@playwright/test";

const superadminState = "playwright/.auth/superadmin.json";
const adminState = "playwright/.auth/admin.json";

test("superadmin can open the Settings page", async ({ browser }) => {
  const context = await browser.newContext({
    storageState: superadminState
  });

  const page = await context.newPage();

  await page.goto("/settings");

  await expect(page).toHaveURL(/\/settings/);
  await expect(
    page.getByText("Settings", { exact: true }).first()
  ).toBeVisible();

  await context.close();
});

test("admin is blocked from the Settings page", async ({ browser }) => {
  const context = await browser.newContext({
    storageState: adminState
  });

  const page = await context.newPage();

  await page.goto("/settings");

  // DocLink CRM redirects non-superadmins to the dashboard.
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page).not.toHaveURL(/\/settings/);

  await context.close();
});

test("logout ends access to a protected page", async ({ browser }) => {
  const context = await browser.newContext({
    storageState: superadminState
  });

  const page = await context.newPage();

  await page.goto("/dashboard");
  await expect(page).not.toHaveURL(/\/login/);

  await Promise.all([
    page.waitForURL(/\/login/),
    page.getByRole("button", { name: "Sign out" }).click()
  ]);

  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login/);

  await context.close();
});

test("logged-out user is redirected to login", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByLabel("Email address")).toBeVisible();

  await context.close();
});