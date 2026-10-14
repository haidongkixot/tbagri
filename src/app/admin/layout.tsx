import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

/** Layout gốc riêng của khu quản trị (không dùng [locale]). Không cho máy tìm kiếm lập chỉ mục. */
const montserrat = localFont({
  src: "../fonts/montserrat-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-montserrat",
});
const lora = localFont({
  src: "../fonts/lora-latin-wght-normal.woff2",
  weight: "400 700",
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: { template: "%s · Quản trị TB Agri", default: "Quản trị TB Agri" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${lora.variable}`}
    >
      <body className="text-ink bg-sky-50 text-[0.9375rem]">{children}</body>
    </html>
  );
}
