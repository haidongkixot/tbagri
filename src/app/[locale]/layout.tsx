import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/content/types";
import { getLocalizedContent } from "@/server/content";
import "../globals.css";

const montserrat = localFont({
  src: "../fonts/montserrat-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-montserrat",
  display: "swap",
});
const lora = localFont({
  src: "../fonts/lora-latin-wght-normal.woff2",
  weight: "400 700",
  variable: "--font-lora",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { settings } = await getLocalizedContent(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: settings.seoTitle,
    description: settings.seoDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    },
    openGraph: {
      type: "website",
      siteName: "TB Agri",
      title: settings.seoTitle,
      description: settings.seoDescription,
      locale: locale === "es" ? "es_CU" : "en_US",
      images: [{ url: "/images/hero-bg.webp", width: 1850, height: 1787 }],
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html
      lang={locale satisfies Locale}
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${lora.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
