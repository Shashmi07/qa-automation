import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results/results.json" }]
  ],

  use: {
    baseURL: "http://localhost:3000",
    storageState: "playwright/.auth/user.json",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },

  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: {
        storageState: {
          cookies: [],
          origins: []
        }
      }
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      testIgnore: /sauce-demo\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"]
      }
    },
    {
      name: "sauce",
      testMatch: /sauce-demo\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/sauce-user.json"
      }
    }
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true
  }
});