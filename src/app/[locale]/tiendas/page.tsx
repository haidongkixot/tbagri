import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/content/types";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocalizedContent } from "@/server/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/tiendas">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: `${t.stores.title} | TB Agri`,
    description: t.stores.intro,
    alternates: {
      canonical: `/${locale}/tiendas`,
      languages: { es: "/es/tiendas", en: "/en/tiendas", "x-default": "/es/tiendas" },
    },
  };
}

/**
 * Trang "Nuestras tiendas" (menu thứ 4). Thiết kế không có trang này → dựng theo hệ thống
 * thiết kế của landing (tiêu đề Lora, thẻ xanh nhạt bo 24). Danh sách cửa hàng sửa ở CMS (lab 14).
 */
export default async function StoresPage({ params }: PageProps<"/[locale]/tiendas">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = await getLocalizedContent(locale);
  const t = getDictionary(locale);
  const other: Locale = locale === "es" ? "en" : "es";

  return (
    <>
      <Header locale={locale} t={t} switchHref={`/${other}/tiendas`} />
      <main id="contenido" className="bg-sky-soft">
        <div className="container-site py-14 lg:py-[4.5rem]">
          <h1 className="title-display">{t.stores.title}</h1>
          <p className="text-body text-ink mt-4 max-w-[36rem] lg:mt-5">{t.stores.intro}</p>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {c.stores.map((s) => (
              <li
                key={s.name}
                className="flex flex-col rounded-tr-[2.8125rem] rounded-bl-[2.8125rem] bg-white p-6 shadow-[0_0.5rem_2rem_rgb(0_55_123/0.08)] lg:p-7"
              >
                <h2 className="title-caps lg:text-[1.03125rem] lg:leading-[1.25rem]">{s.name}</h2>
                <address className="text-body text-ink mt-3 whitespace-pre-line not-italic">
                  {s.address}
                </address>
                <dl className="text-body text-ink mt-4 space-y-1">
                  <div className="flex gap-2">
                    <dt className="text-navy font-semibold">{t.stores.hours}:</dt>
                    <dd>{s.hours}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-navy font-semibold">{t.stores.phone}:</dt>
                    <dd>
                      <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                        {s.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
                {s.mapUrl && (
                  <a
                    href={s.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-green mt-6 self-start"
                  >
                    {t.stores.map}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <Link
            href={`/${locale}`}
            className="text-navy mt-10 inline-flex min-h-11 items-center gap-2 font-semibold hover:text-green-600"
          >
            <span aria-hidden>←</span> {t.stores.back}
          </Link>
        </div>
      </main>
      <Footer settings={c.settings} links={c.footerLinks} year={c.year} t={t.footer} />
      <FloatingContact label={t.floatingContact} href={`/${locale}#contacto`} />
    </>
  );
}
