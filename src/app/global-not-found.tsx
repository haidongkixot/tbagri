import type { Metadata } from "next";
import localFont from "next/font/local";
import { NotFoundView } from "@/components/layout/NotFoundView";
import "./globals.css";

/**
 * 404 cho mọi đường dẫn không khớp route nào (ví dụ /es/khong-co).
 * Cần vì layout gốc nằm trong segment động [locale] (và /admin có layout gốc riêng từ lab 13).
 * Bật bằng `experimental.globalNotFound` trong next.config.ts.
 */
const montserrat = localFont({
  src: "./fonts/montserrat-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-montserrat",
});
const lora = localFont({
  src: "./fonts/lora-latin-wght-normal.woff2",
  weight: "400 700",
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "404 — TB Agri",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${montserrat.variable} ${lora.variable}`}>
      <body>
        <NotFoundView />
      </body>
    </html>
  );
}
