import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { defaultContent } from "@/content/defaults";
import { mergeWithDefaults } from "@/content/merge";
import { localize, type Locale, type SiteContent } from "@/content/types";
import { contentEntries, getDb } from "@/db";
import { desc } from "drizzle-orm";

/** Thẻ cache của toàn bộ nội dung trang. Lưu nội dung xong gọi `updateTag(CONTENT_TAG)`. */
export const CONTENT_TAG = "site-content";

/**
 * Nội dung đầy đủ (es + en): nội dung mặc định + bản đã sửa trong CSDL (bảng content_entries).
 * "use cache" + cacheLife("max"): đọc CSDL một lần rồi dùng lại cho tới khi quản trị lưu thay đổi.
 * CSDL lỗi/chưa cấu hình → vẫn hiển thị nội dung mặc định, không làm sập trang.
 */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  try {
    const db = await getDb();
    const rows = await db
      .select({ key: contentEntries.key, data: contentEntries.data })
      .from(contentEntries);
    return mergeWithDefaults(rows, defaultContent);
  } catch (err) {
    console.error("[content] Không đọc được CSDL, dùng nội dung mặc định:", err);
    return defaultContent;
  }
}

/** Nội dung đã chọn ngôn ngữ cho các section (props kiểu `PageContent[...]`). */
export async function getLocalizedContent(locale: Locale) {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  const content = localize(await getSiteContent(), locale);
  return { ...content, year: new Date().getFullYear() };
}

export type PageContent = Awaited<ReturnType<typeof getLocalizedContent>>;

/** Thời điểm/người sửa gần nhất của từng khối nội dung (trang danh sách CMS, không cache). */
export async function getContentMeta(): Promise<Record<string, { at: Date; by: string | null }>> {
  const db = await getDb();
  const rows = await db
    .select({ key: contentEntries.key, at: contentEntries.updatedAt, by: contentEntries.updatedBy })
    .from(contentEntries)
    .orderBy(desc(contentEntries.updatedAt));
  return Object.fromEntries(rows.map((r) => [r.key, { at: r.at, by: r.by }]));
}
