"use server";

import { eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { getDocConfig } from "@/cms/config";
import { docSchema, issuesToList } from "@/cms/schema";
import { contentEntries, getDb } from "@/db";
import { audit } from "@/server/audit";
import { requireAdmin } from "@/server/auth/session";
import { CONTENT_TAG } from "@/server/content";

export type SaveResult =
  | { ok: true; savedAt: string }
  | { ok: false; message: string; issues?: { path: string; message: string }[] };

/**
 * Lưu một khối nội dung (một khóa của SiteContent).
 * requireAdmin → tìm cấu hình → kiểm tra Zod sinh từ cấu hình → ghi CSDL → nhật ký →
 * updateTag("site-content") để trang công khai hiển thị ngay nội dung mới.
 */
export async function saveContent(key: string, json: string): Promise<SaveResult> {
  const session = await requireAdmin();
  const doc = getDocConfig(key);
  if (!doc) return { ok: false, message: "Khối nội dung không tồn tại." };

  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, message: "Dữ liệu gửi lên không hợp lệ." };
  }
  const parsed = docSchema(doc).safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Có ô chưa hợp lệ, xem chi tiết bên dưới.",
      issues: issuesToList(parsed.error),
    };
  }

  try {
    const db = await getDb();
    await db
      .insert(contentEntries)
      .values({ key, data: parsed.data, updatedBy: session.email })
      .onConflictDoUpdate({
        target: contentEntries.key,
        set: { data: parsed.data, updatedAt: sql`now()`, updatedBy: session.email },
      });
    await audit(session.email, "content_save", key);
    updateTag(CONTENT_TAG);
    return { ok: true, savedAt: new Date().toISOString() };
  } catch (err) {
    console.error("[content] Lưu lỗi:", err);
    return { ok: false, message: "Không lưu được do lỗi hệ thống. Vui lòng thử lại." };
  }
}

/** Khôi phục nội dung mặc định của một khối (xóa bản đã sửa). */
export async function resetContent(key: string): Promise<SaveResult> {
  const session = await requireAdmin();
  if (!getDocConfig(key)) return { ok: false, message: "Khối nội dung không tồn tại." };
  const db = await getDb();
  await db.delete(contentEntries).where(eq(contentEntries.key, key));
  await audit(session.email, "content_reset", key);
  updateTag(CONTENT_TAG);
  return { ok: true, savedAt: new Date().toISOString() };
}
