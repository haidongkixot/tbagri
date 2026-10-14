"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { Locale } from "@/content/types";
import { Flag } from "@/components/ui/Flag";
import type { NavItem } from "./Header";

/** Menu dạng nút ☰ cho màn hình < 1024px. Đóng bằng Esc hoặc khi chọn một mục. */
export function MobileMenu({
  items,
  switchHref,
  other,
  labels,
}: {
  items: NavItem[];
  switchHref: string;
  other: Locale;
  labels: { open: string; close: string; switchTo: string };
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen((v) => !v)}
        className="text-navy grid size-11 place-items-center rounded-lg"
      >
        <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
          {open ? (
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white px-6 pt-4 pb-10"
      >
        <ul className="divide-green-pale divide-y">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-navy block py-4 text-lg font-medium"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={switchHref}
          hrefLang={other}
          lang={other}
          onClick={() => setOpen(false)}
          className="border-green-pale text-navy mt-6 inline-flex items-center gap-3 rounded-lg border px-4 py-3"
        >
          <Flag locale={other} className="h-4 w-6" />
          {labels.switchTo}
        </Link>
      </div>
    </div>
  );
}
