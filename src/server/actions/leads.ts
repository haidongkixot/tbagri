"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod";
import { getDb, leads, LEAD_STATUSES } from "@/db";
import { audit } from "@/server/audit";
import { requireAdmin } from "@/server/auth/session";

const schema = z.object({ id: z.uuid(), status: z.enum(LEAD_STATUSES) });

/** Đổi trạng thái một lead (nuevo → contactado → cerrado). Chỉ người đã đăng nhập. */
export async function updateLeadStatus(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const parsed = schema.safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return;
  const db = await getDb();
  await db.update(leads).set({ status: parsed.data.status }).where(eq(leads.id, parsed.data.id));
  await audit(session.email, `lead_status:${parsed.data.status}`, parsed.data.id);
  refresh();
}
