import { expect, Page, test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import testData from '../test-data/testData.json';

type TestFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<TestFixtures>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await expect(page).toHaveURL(/inventory\.html/);

    await use(page);
  },
});

export { expect };
