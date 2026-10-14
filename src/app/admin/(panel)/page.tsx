import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { requireAdmin } from "@/server/auth/session";
import { dashboardStats } from "@/server/leads";
import { dateTime, label, SEGMENT_LABEL, STATUS_LABEL, STATUS_STYLE } from "../labels";

export const metadata: Metadata = { title: "Tổng quan" };

/**
 * Đọc phiên + CSDL là dữ liệu theo yêu cầu → đặt trong <Suspense> NGAY TRONG trang
 * (Cache Components kiểm tra để điều hướng giữa các trang luôn tức thì).
 */
export default function DashboardPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const session = await requireAdmin();
  const { counts, week, recent, lastEdit, activity } = await dashboardStats();
  const cards = [
    { label: "Yêu cầu mới (chưa xử lý)", value: counts.nuevo, href: "/admin/leads?status=nuevo" },
    { label: "Nhận trong 7 ngày", value: week, href: "/admin/leads" },
    { label: "Tổng số yêu cầu", value: counts.all, href: "/admin/leads" },
  ];
  return (
    <div className="max-w-[60rem]">
      <h1 className="text-navy text-2xl font-semibold">Xin chào, {session.name}</h1>
      <p className="text-ink/70 mt-1">Tình hình yêu cầu liên hệ và nội dung trang.</p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              className="ring-ink/5 hover:ring-green block rounded-[1rem] bg-white p-5 shadow-sm ring-1"
            >
              <p className="text-navy text-3xl font-semibold">{c.value}</p>
              <p className="text-ink/70 mt-1 text-sm">{c.label}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="ring-ink/5 mt-8 rounded-[1rem] bg-white p-5 shadow-sm ring-1">
        <div className="flex items-center justify-between">
          <h2 className="text-navy font-semibold">Yêu cầu gần nhất</h2>
          <Link href="/admin/leads" className="text-sm text-green-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-ink/60 mt-3 text-sm">Chưa có yêu cầu nào.</p>
        ) : (
          <ul className="divide-ink/5 mt-3 divide-y">
            {recent.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5 text-sm">
                <span className="text-ink/60 w-32">{dateTime.format(l.createdAt)}</span>
                <span className="font-medium">{l.name}</span>
                <span className="text-ink/60">{label(SEGMENT_LABEL, l.segment)}</span>
                <span
                  className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[l.status]}`}
                >
                  {STATUS_LABEL[l.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="ring-ink/5 rounded-[1rem] bg-white p-5 shadow-sm ring-1">
          <h2 className="text-navy font-semibold">Nội dung</h2>
          <p className="text-ink/70 mt-2 text-sm">
            {lastEdit
              ? `Sửa gần nhất: "${lastEdit.key}" lúc ${dateTime.format(lastEdit.at)} bởi ${lastEdit.by ?? "—"}.`
              : "Trang đang dùng nội dung mặc định — chưa có chỉnh sửa nào."}
          </p>
          <Link href="/admin/content" className="btn-green mt-4">
            Sửa nội dung
          </Link>
        </section>
        <section className="ring-ink/5 rounded-[1rem] bg-white p-5 shadow-sm ring-1">
          <h2 className="text-navy font-semibold">Hoạt động gần đây</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {activity.map((a) => (
              <li key={a.id} className="text-ink/70">
                <span className="text-ink/50">{dateTime.format(a.createdAt)}</span> · {a.actor} ·{" "}
                {a.action}
                {a.target ? ` · ${a.target.slice(0, 24)}` : ""}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
