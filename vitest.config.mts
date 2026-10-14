import { defineConfig } from "vitest/config";
import path from "node:path";

/** Test đơn vị (hàm thuần): nội dung, lược đồ form/CMS, mật khẩu. E2E dùng Playwright riêng. */
export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
