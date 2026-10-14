/**
 * Chuẩn bị CSDL E2E (PGLITE_DIR=.data/e2e): xóa dữ liệu cũ, migrate, seed, tạo tài khoản quản trị.
 * Gọi từ playwright.config.ts trước khi `next start`.
 */
import { rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

const dir = process.env.PGLITE_DIR ?? ".data/e2e";
rmSync(dir, { recursive: true, force: true });
const run = (script: string) =>
  execFileSync("node", ["--import", "tsx", script], { stdio: "inherit", env: process.env });
run("scripts/db-migrate.ts");
run("scripts/db-seed.ts");
run("scripts/create-admin.ts");
console.log("✓ CSDL E2E sẵn sàng tại", dir);
