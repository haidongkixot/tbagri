import "server-only";
import { and, count, desc, eq, gte, ilike, or, sql, type SQL } from "drizzle-orm";
import { auditLog, contentEntries, getDb, leads, LEAD_STATUSES, type LeadStatus } from "@/db";

export const LEADS_PAGE_SIZE = 20;

export type LeadFilter = { status?: LeadStatus; q?: string; page?: number };

function where({ status, q }: LeadFilter): SQL | undefined {
  const parts: SQL[] = [];
  if (status) parts.push(eq(leads.status, status));
  if (q) {
    const like = `%${q.replace(/[%_]/g, "\\$&")}%`;
    parts.push(
      or(ilike(leads.name, like), ilike(leads.email, like), ilike(leads.organization, like))!,
    );
  }
  return parts.length ? and(...parts) : undefined;
}

/** Danh sách lead mới nhất trước, có lọc trạng thái, tìm kiếm và phân trang. */
export async function listLeads(filter: LeadFilter) {
  const db = await getDb();
  const page = Math.max(1, filter.page ?? 1);
  const w = where(filter);
  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(w)
      .orderBy(desc(leads.createdAt))
      .limit(LEADS_PAGE_SIZE)
      .offset((page - 1) * LEADS_PAGE_SIZE),
    db.select({ total: count() }).from(leads).where(w),
  ]);
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE)) };
}

/** Toàn bộ lead theo bộ lọc (để xuất CSV). */
export async function allLeads(filter: LeadFilter) {
  const db = await getDb();
  return db.select().from(leads).where(where(filter)).orderBy(desc(leads.createdAt));
}

/** Số lead theo từng trạng thái — cho thẻ lọc. */
export async function leadCounts(): Promise<Record<LeadStatus | "all", number>> {
  const db = await getDb();
  const rows = await db
    .select({ status: leads.status, n: count() })
    .from(leads)
    .groupBy(leads.status);
  const out = { all: 0, nuevo: 0, contactado: 0, cerrado: 0 };
  for (const r of rows) {
    if ((LEAD_STATUSES as readonly string[]).includes(r.status)) out[r.status] = r.n;
    out.all += r.n;
  }
  return out;
}

/** Số liệu cho trang tổng quan. */
export async function dashboardStats() {
  const db = await getDb();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [counts, [{ week }], recent, [lastEdit], activity] = await Promise.all([
    leadCounts(),
    db.select({ week: count() }).from(leads).where(gte(leads.createdAt, weekAgo)),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5),
    db
      .select({
        key: contentEntries.key,
        at: contentEntries.updatedAt,
        by: contentEntries.updatedBy,
      })
      .from(contentEntries)
      .where(sql`${contentEntries.updatedBy} is distinct from 'seed'`)
      .orderBy(desc(contentEntries.updatedAt))
      .limit(1),
    db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(8),
  ]);
  return { counts, week, recent, lastEdit, activity };
}
