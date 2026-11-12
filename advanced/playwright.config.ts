import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const authDir = path.resolve(__dirname, '.auth');
const crmProjects = process.env.CRM_BASE_URL
  ? [
      {
        name: 'crm-superadmin',
        testMatch: /crm-auth\.spec\.ts/,
        dependencies: ['setup'],
        use: { ...devices['Desktop Chrome'], storageState: path.join(authDir, 'crm-superadmin.json') },
      },
      {
        name: 'crm-admin',
        testMatch: /crm-auth\.spec\.ts/,
        dependencies: ['setup'],
        use: { ...devices['Desktop Chrome'], storageState: path.join(authDir, 'crm-admin.json') },
      },
    ]
  : [];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      testMatch: /sauce-demo\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: path.join(authDir, 'sauce-user.json') },
    },
    ...crmProjects,
  ],
});
