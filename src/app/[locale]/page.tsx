import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/content/types";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocalizedContent } from "@/server/content";
import { Header } from "@/components/layout/Header";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { CycleWheel } from "@/components/sections/CycleWheel";
import { Philosophy } from "@/components/sections/Philosophy";
import { ServiceModel } from "@/components/sections/ServiceModel";
import { ProductGroups } from "@/components/sections/ProductGroups";
import { SeedsInputs } from "@/components/sections/SeedsInputs";
import { Machinery } from "@/components/sections/Machinery";
import { PostHarvest } from "@/components/sections/PostHarvest";
import { Digital } from "@/components/sections/Digital";
import { BenefitsContact } from "@/components/sections/BenefitsContact";
import { Invitation } from "@/components/sections/Invitation";
import { SkyBackdrop } from "@/components/layout/SkyBackdrop";
import { Footer } from "@/components/layout/Footer";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = await getLocalizedContent(locale);
  const t = getDictionary(locale);
  const other: Locale = locale === "es" ? "en" : "es";

  // Dữ liệu có cấu trúc cho công cụ tìm kiếm (schema.org Organization)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: c.settings.companyName,
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/images/logo-tbagri.png`,
    email: c.settings.email,
    telephone: c.settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.settings.address.replace(/\n/g, " "),
      addressCountry: "CU",
    },
    sameAs: [c.settings.facebook].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Nội dung do server tạo từ dữ liệu của chính site; thoát "<" để không thể đóng thẻ script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header locale={locale} t={t} switchHref={`/${other}`} />
      <main id="contenido">
        <Hero hero={c.hero} />
        <Intro intro={c.intro} audiences={c.audiences} />
        <CycleWheel cycle={c.cycle} steps={c.cycleSteps} />
        <Philosophy philosophy={c.philosophy} slides={c.philosophySlides} a11y={t.a11y} />
        <ServiceModel serviceModel={c.serviceModel} services={c.services} />
        <ProductGroups productGroups={c.productGroups} slides={c.productSlides} />
        <SeedsInputs seedsInputs={c.seedsInputs} slides={c.inputSlides} />
        <Machinery machinery={c.machinery} machines={c.machines} a11y={t.a11y} />
        <PostHarvest
          postHarvest={c.postHarvest}
          steps={c.postHarvestSteps}
          solutions={c.dryingSolutions}
        />
        <Digital digital={c.digital} features={c.digitalFeatures} />
        <SkyBackdrop>
          <BenefitsContact
            benefits={c.benefits}
            items={c.benefitItems}
            contact={c.contact}
            form={t.form}
            locale={locale}
          />
          <Invitation invitation={c.invitation} />
        </SkyBackdrop>
      </main>
      <Footer settings={c.settings} links={c.footerLinks} year={c.year} t={t.footer} />
      <FloatingContact label={t.floatingContact} href="#contacto" />
    </>
  );
}
