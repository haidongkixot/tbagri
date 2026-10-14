import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const pages = ["", "/tiendas"];

/** /sitemap.xml — mỗi trang có bản es/en, khai báo hreflang qua `alternates.languages`. */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((p) =>
    (["es", "en"] as const).map((locale) => ({
      url: `${siteUrl}/${locale}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.6,
      alternates: { languages: { es: `${siteUrl}/es${p}`, en: `${siteUrl}/en${p}` } },
    })),
  );
}
