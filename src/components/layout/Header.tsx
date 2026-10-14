import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { Flag } from "@/components/ui/Flag";
import { MobileMenu } from "./MobileMenu";

export type NavItem = { href: string; label: string };

export function navItems(locale: Locale, t: Dictionary): NavItem[] {
  return [
    { href: `/${locale}#inicio`, label: t.nav.home },
    { href: `/${locale}#introduccion`, label: t.nav.about },
    { href: `/${locale}#productos`, label: t.nav.products },
    { href: `/${locale}/tiendas`, label: t.nav.stores },
    { href: `/${locale}#contacto`, label: t.nav.contact },
  ];
}

/** s01 — Header: logo trái, menu 5 mục + cờ đổi ngôn ngữ bên phải, cao 65px. */
export function Header({
  locale,
  t,
  switchHref,
}: {
  locale: Locale;
  t: Dictionary;
  /** Đường dẫn cùng trang ở ngôn ngữ còn lại, ví dụ /en hoặc /en/tiendas */
  switchHref: string;
}) {
  const other: Locale = locale === "es" ? "en" : "es";
  const items = navItems(locale, t);
  return (
    <header
      data-section="s01"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
    >
      <a
        href="#contenido"
        className="focus:bg-navy sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:px-3 focus:py-2 focus:text-white"
      >
        {t.a11y.skip}
      </a>
      <div className="container-site flex h-16 items-center justify-between lg:h-[4.0625rem]">
        <Link href={`/${locale}`} className="-ml-[0.125rem] shrink-0" aria-label="TB Agri — inicio">
          <Image
            src="/images/logo-tbagri.png"
            alt="TBAgri"
            width={240}
            height={100}
            priority
            className="h-[2.75rem] w-auto lg:h-[3.125rem]"
          />
        </Link>

        <nav aria-label={t.a11y.mainNav} className="hidden items-center lg:flex">
          <ul className="flex items-center gap-[1.6875rem]">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-navy text-[0.84375rem] transition-colors hover:text-green-600"
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
            className="ml-[1.8rem] rounded-sm"
            aria-label={t.a11y.switchTo}
            title={t.a11y.switchTo}
          >
            <Flag locale={other} className="h-[0.9375rem] w-[1.375rem] shadow-sm" />
          </Link>
        </nav>

        <MobileMenu
          items={items}
          switchHref={switchHref}
          other={other}
          labels={{ open: t.a11y.openMenu, close: t.a11y.closeMenu, switchTo: t.a11y.switchTo }}
        />
      </div>
    </header>
  );
}
