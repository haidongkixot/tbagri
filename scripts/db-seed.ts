/**
 * Nạp dữ liệu mẫu:
 * - content_entries: chép nội dung mặc định (src/content/defaults.ts) cho các khóa CHƯA có.
 *   Không ghi đè nội dung quản trị đã sửa. Thêm `--force` để ghi đè toàn bộ (cẩn thận!).
 * Tắt `npm run dev` trước khi chạy nếu dùng PGlite.
 */
import { sql } from "drizzle-orm";
import { createDb } from "../src/db/client";
import { contentEntries } from "../src/db/schema";
import { defaultContent } from "../src/content/defaults";

async function main() {
  const force = process.argv.includes("--force");
  const { db, kind, close } = createDb();
  let n = 0;
  for (const [key, data] of Object.entries(defaultContent)) {
    const q = db
      .insert(contentEntries)
      .values({ key, data, updatedBy: "seed" })
      .onConflictDoUpdate({
        target: contentEntries.key,
        set: { data, updatedAt: sql`now()`, updatedBy: "seed" },
        // không --force: chỉ "cập nhật" khi điều kiện sai → giữ nguyên dòng đã có
        setWhere: force ? undefined : sql`false`,
      });
    await q;
    n++;
  }
  console.log(`✓ Seed nội dung: ${n} khóa (${kind}${force ? ", ghi đè" : ", giữ bản đã sửa"})`);
  await close();
}

main().catch((err) => {
  console.error("✗ Seed lỗi:", err);
  process.exit(1);
});
