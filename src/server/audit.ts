import "server-only";
import { auditLog, getDb } from "@/db";

/** Ghi nhật ký thao tác quản trị. Lỗi ghi log không được làm hỏng thao tác chính. */
export async function audit(actor: string, action: string, target?: string) {
  try {
    const db = await getDb();
    await db.insert(auditLog).values({ actor, action, target });
  } catch (err) {
    console.error("[audit] Không ghi được nhật ký:", err);
  }
}
