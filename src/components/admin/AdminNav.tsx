"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Tổng quan", exact: true },
  { href: "/admin/leads", label: "Khách hàng tiềm năng" },
  { href: "/admin/content", label: "Nội dung trang" },
];
/** Chỉ vai trò admin thấy (trang cũng tự chặn bằng requireAdmin({ role: "admin" })). */
const ADMIN_ITEMS = [{ href: "/admin/users", label: "Tài khoản quản trị" }];

/** Menu bên trái khu quản trị; mục đang mở được đánh dấu (aria-current). */
export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? [...ITEMS, ...ADMIN_ITEMS] : ITEMS;
  return (
    <nav aria-label="Quản trị" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((it) => {
        const active = "exact" in it ? pathname === it.href : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
              active
                ? "bg-white/15 font-semibold text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
      <a
        href="/es"
        target="_blank"
        rel="noopener"
        className="rounded-lg px-3 py-2.5 text-sm whitespace-nowrap text-white/80 hover:bg-white/10 hover:text-white"
      >
        Xem trang ↗
      </a>
    </nav>
  );
}
