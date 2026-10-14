import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { LEAD_STATUSES, type LeadStatus } from "@/db/schema";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { requireAdmin } from "@/server/auth/session";
import { leadCounts, listLeads } from "@/server/leads";
import { dateTime, INTEREST_LABEL, label, SEGMENT_LABEL, STATUS_LABEL } from "../../labels";

export const metadata: Metadata = { title: "Khách hàng tiềm năng" };

function qs(params: Record<string, string | number | undefined>) {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") s.set(k, String(v));
  const str = s.toString();
  return str ? `?${str}` : "";
}

export default function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Leads searchParams={searchParams} />
    </Suspense>
  );
}

async function Leads({
  searchParams,
}: {
  searchParams: PageProps<"/admin/leads">["searchParams"];
}) {
  await requireAdmin();
  const sp = await searchParams;
  const statusParam = typeof sp.status === "string" ? sp.status : "";
  const status = (LEAD_STATUSES as readonly string[]).includes(statusParam)
    ? (statusParam as LeadStatus)
    : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ rows, total, pages }, counts] = await Promise.all([
    listLeads({ status, q, page }),
    leadCounts(),
  ]);
  const tabs: { key: LeadStatus | undefined; label: string; n: number }[] = [
    { key: undefined, label: "Tất cả", n: counts.all },
    ...LEAD_STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s], n: counts[s] })),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-navy text-2xl font-semibold">Khách hàng tiềm năng</h1>
          <p className="text-ink/70 mt-1">Yêu cầu gửi từ form liên hệ trên trang.</p>
        </div>
        <a href={`/admin/leads/export${qs({ status, q })}`} className="btn-green">
          Xuất CSV
        </a>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <nav
          aria-label="Lọc theo trạng thái"
          className="ring-ink/5 flex flex-wrap gap-1 rounded-lg bg-white p-1 ring-1"
        >
          {tabs.map((t) => {
            const active = t.key === status;
            return (
              <Link
                key={t.label}
                href={`/admin/leads${qs({ status: t.key, q })}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm ${active ? "bg-navy text-white" : "text-navy hover:bg-sky-100"}`}
              >
                {t.label} <span className="opacity-70">({t.n})</span>
              </Link>
            );
          })}
        </nav>
        <form className="flex gap-2" role="search">
          {status && <input type="hidden" name="status" value={status} />}
          <label htmlFor="q" className="sr-only">
            Tìm theo tên, email, tổ chức
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Tìm tên, email, tổ chức…"
            className="border-line h-10 w-64 rounded-lg border bg-white px-3 text-sm"
          />
          <button
            type="submit"
            className="bg-navy h-10 rounded-lg px-4 text-sm font-semibold text-white"
          >
            Tìm
          </button>
        </form>
      </div>

      <div className="ring-ink/5 mt-4 overflow-x-auto rounded-[1rem] bg-white shadow-sm ring-1">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <caption className="sr-only">Danh sách khách hàng tiềm năng, mới nhất trước</caption>
          <thead className="text-navy bg-sky-50">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Ngày
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Người gửi
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Liên hệ
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Nhóm · Quan tâm
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Lời nhắn
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-ink/5 divide-y align-top">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-ink/60 px-4 py-8 text-center">
                  Không có yêu cầu nào phù hợp.
                </td>
              </tr>
            )}
            {rows.map((l) => (
              <tr key={l.id}>
                <td className="text-ink/70 px-4 py-3 whitespace-nowrap">
                  {dateTime.format(l.createdAt)}
                  <span className="ml-1 rounded bg-sky-100 px-1 text-xs uppercase">{l.locale}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{l.name}</p>
                  {l.organization && <p className="text-ink/60">{l.organization}</p>}
                </td>
                <td className="px-4 py-3">
                  <a href={`mailto:${l.email}`} className="text-navy hover:underline">
                    {l.email}
                  </a>
                  {l.phone && (
                    <p>
                      <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                        {l.phone}
                      </a>
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  {label(SEGMENT_LABEL, l.segment)}
                  <p className="text-ink/60">{label(INTEREST_LABEL, l.interest)}</p>
                </td>
                <td className="max-w-[20rem] px-4 py-3">
                  <details>
                    <summary className="text-ink/80 line-clamp-2 cursor-pointer">
                      {l.message}
                    </summary>
                    <p className="mt-2 whitespace-pre-line">{l.message}</p>
                  </details>
                </td>
                <td className="px-4 py-3">
                  <StatusSelect id={l.id} status={l.status} name={l.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav aria-label="Phân trang" className="mt-4 flex items-center gap-3 text-sm">
          {page > 1 && (
            <Link
              href={`/admin/leads${qs({ status, q, page: page - 1 })}`}
              className="text-navy hover:underline"
            >
              ← Trang trước
            </Link>
          )}
          <span className="text-ink/60">
            Trang {page}/{pages} · {total} yêu cầu
          </span>
          {page < pages && (
            <Link
              href={`/admin/leads${qs({ status, q, page: page + 1 })}`}
              className="text-navy hover:underline"
            >
              Trang sau →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
