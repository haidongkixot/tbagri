import { LEAD_STATUSES, type LeadStatus } from "@/db/schema";
import { audit } from "@/server/audit";
import { requireAdmin } from "@/server/auth/session";
import { allLeads } from "@/server/leads";

/**
 * GET /admin/leads/export?status=&q= → tệp CSV (UTF-8 có BOM để Excel đọc đúng dấu).
 * Chống "CSV injection": ô bắt đầu bằng = + - @ được thêm dấu ' phía trước.
 */
export async function GET(request: Request) {
  const session = await requireAdmin();
  const url = new URL(request.url);
  const st = url.searchParams.get("status") ?? "";
  const status = (LEAD_STATUSES as readonly string[]).includes(st) ? (st as LeadStatus) : undefined;
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
  const rows = await allLeads({ status, q });

  const header = [
    "fecha",
    "nombre",
    "organizacion",
    "email",
    "telefono",
    "segmento",
    "interes",
    "mensaje",
    "idioma",
    "estado",
  ];
  const cell = (v: unknown) => {
    let s = v == null ? "" : v instanceof Date ? v.toISOString() : String(v);
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = [
    header.join(","),
    ...rows.map((l) =>
      [
        l.createdAt,
        l.name,
        l.organization,
        l.email,
        l.phone,
        l.segment,
        l.interest,
        l.message,
        l.locale,
        l.status,
      ]
        .map(cell)
        .join(","),
    ),
  ];
  await audit(session.email, "leads_export", `${rows.length} dòng`);
  const date = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tbagri-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
