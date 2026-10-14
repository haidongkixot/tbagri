/**
 * Chạy migration trong drizzle/ lên CSDL hiện tại.
 *   npm run db:migrate            (máy cá nhân → PGlite .data/pglite)
 *   DATABASE_URL=... npm run db:migrate   (Neon — Vercel chạy lệnh này trước khi build)
 * PGlite chỉ cho MỘT tiến trình mở thư mục dữ liệu: tắt `npm run dev` trước khi chạy.
 */
import { createDb } from "../src/db/client";

async function main() {
  const { db, kind, close } = createDb();
  if (kind === "neon") {
    const { migrate } = await import("drizzle-orm/neon-http/migrator");
    // neon-http và pglite có cùng API migrate; ép kiểu vì Database là kiểu chung của PGlite
    await migrate(db as never, { migrationsFolder: "drizzle" });
  } else {
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    await migrate(db, { migrationsFolder: "drizzle" });
  }
  console.log(`✓ Migration xong (${kind})`);
  await close();
}

main().catch((err) => {
  console.error("✗ Migration lỗi:", err);
  process.exit(1);
});
