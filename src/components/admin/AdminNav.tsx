"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Tổng quan", exact: true },
  { href: "/admin/leads", label: "Khách hàng tiềm năng" },
  { href: "/admin/content", label: "Nội dung trang" },
];

/** Menu bên trái khu quản trị; mục đang mở được đánh dấu (aria-current). */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Quản trị" className="flex gap-1 overflow-x-auto lg:flex-col">
      {ITEMS.map((it) => {
        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
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
