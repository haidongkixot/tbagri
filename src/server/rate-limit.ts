import "server-only";
import { sql } from "drizzle-orm";
import { getDb, rateLimits } from "@/db";

/**
 * Giới hạn tần suất bằng bảng rate_limits (chạy được trên PGlite và Neon, không cần Redis).
 * Mỗi lần gọi tăng bộ đếm của `key`; hết `windowMs` thì đếm lại từ 1.
 * Trả `{ ok: false }` khi vượt `limit`.
 */
export async function rateLimit(key: string, limit: number, windowMs: number) {
  const db = await getDb();
  const resetAt = new Date(Date.now() + windowMs);
  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, resetAt })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`case when ${rateLimits.resetAt} < now() then 1 else ${rateLimits.count} + 1 end`,
        resetAt: sql`case when ${rateLimits.resetAt} < now() then excluded.reset_at else ${rateLimits.resetAt} end`,
      },
    })
    .returning({ count: rateLimits.count, resetAt: rateLimits.resetAt });
  return {
    ok: row.count <= limit,
    remaining: Math.max(0, limit - row.count),
    resetAt: row.resetAt,
  };
}
