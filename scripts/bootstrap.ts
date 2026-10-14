/**
 * Chuẩn bị CSDL trước mỗi lần build trên Vercel (`npm run vercel-build`).
 * Chỉ dành cho bản chạy thật — khóa học vẫn chạy migrate/seed/admin:create bằng tay.
 *
 * 1. migrate — tạo bảng còn thiếu.
 * 2. seed    — chép nội dung mặc định cho các khóa CHƯA có (không ghi đè bản quản trị đã sửa).
 * 3. admin   — nếu có ADMIN_EMAIL và ADMIN_PASSWORD thì tạo/đặt lại tài khoản quản trị.
 *              Không có hai biến đó thì bỏ qua, build vẫn chạy bình thường.
 *              Tạo xong nên xóa ADMIN_PASSWORD khỏi Environment Variables.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

function run(script: string, args: string[] = []) {
  const result = spawnSync(
    process.execPath,
    ["--env-file-if-exists=.env.local", "--import", "tsx", join(here, script), ...args],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    throw new Error(`${script} thất bại (mã ${result.status})`);
  }
}

async function main() {
  run("db-migrate.ts");
  run("db-seed.ts");

  const hasAdmin = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
  if (hasAdmin) {
    run("create-admin.ts");
  } else {
    console.log("• Bỏ qua tạo tài khoản quản trị (chưa đặt ADMIN_EMAIL và ADMIN_PASSWORD)");
  }
}

main().catch((err) => {
  console.error("✗", err instanceof Error ? err.message : err);
  process.exit(1);
});
