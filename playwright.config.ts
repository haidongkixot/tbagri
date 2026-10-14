import { defineConfig, devices } from "@playwright/test";

/**
 * E2E: chạy trên build production (`next start`) với CSDL PGlite riêng (.data/e2e) để không
 * đụng dữ liệu phát triển. `npm run test:e2e` tự build + start; đặt BASE_URL để chạy trên server có sẵn.
 */
const port = 3200;
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    locale: "es-CU", // khách mặc định: trình duyệt tiếng Tây Ban Nha → proxy chuyển /es
    trace: "retain-on-failure",
    launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH || undefined },
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1250, height: 900 } },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /public\.spec\.ts/ },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run e2e:prepare && npx next start -p ${port}`,
        url: `${baseURL}/es`,
        reuseExistingServer: false,
        timeout: 240_000,
        env: {
          PGLITE_DIR: ".data/e2e",
          SESSION_SECRET: "e2e-session-secret-e2e-session-secret-e2e",
          ADMIN_EMAIL: "e2e@tbagri.test",
          ADMIN_PASSWORD: "E2eTbagri2026ok",
          ADMIN_NAME: "E2E",
        },
      },
});
