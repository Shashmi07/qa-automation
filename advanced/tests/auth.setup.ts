import { test as setup, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const authDirectory = "playwright/.auth";
const sauceAuthFile = `${authDirectory}/sauce-user.json`;

async function loginAndSave(
  page: Page,
  email: string,
  password: string,
  authFile: string
) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign In" }).click();

    try {
      await expect(page).not.toHaveURL(/\/login/);
      break;
    } catch (error) {
      if (attempt === 1) {
        throw error;
      }
    }
  }

  await page.context().storageState({ path: authFile });
}

setup("save superadmin state", async ({ browser }) => {
  fs.mkdirSync(authDirectory, { recursive: true });

  const context = await browser.newContext();
  const page = await context.newPage();

  await loginAndSave(
    page,
    process.env.SUPERADMIN_EMAIL ?? "superadmin@doclink.com",
    process.env.SUPERADMIN_PASSWORD ?? "SuperAdmin@123",
    `${authDirectory}/superadmin.json`
  );

  await context.close();
});

setup("save admin state", async ({ browser }) => {
  fs.mkdirSync(authDirectory, { recursive: true });

  const context = await browser.newContext();
  const page = await context.newPage();

  await loginAndSave(
    page,
    process.env.ADMIN_EMAIL ?? "admin@doclink.com",
    process.env.ADMIN_PASSWORD ?? "#q2rCRg7!eWsTL",
    `${authDirectory}/admin.json`
  );

  await context.close();
});

setup("authenticate Sauce Demo user", async ({ page }) => {
  fs.mkdirSync(authDirectory, { recursive: true });

  await page.goto("https://www.saucedemo.com/");

  await page
    .getByRole("textbox", { name: /username/i })
    .fill(process.env.SAUCE_USERNAME ?? "standard_user");
  await page
    .getByRole("textbox", { name: /password/i })
    .fill(process.env.SAUCE_PASSWORD ?? "secret_sauce");
  await page.getByRole("button", { name: /login/i }).click();

  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: sauceAuthFile });
});