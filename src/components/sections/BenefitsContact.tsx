import type { PageContent } from "@/server/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/content/types";
import { Accordion } from "@/components/ui/Accordion";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionMarker } from "@/components/ui/SectionMarker";

type Props = {
  benefits: PageContent["benefits"];
  items: PageContent["benefitItems"];
  contact: PageContent["contact"];
  form: Dictionary["form"];
  locale: Locale;
};

/**
 * s12 — "Beneficio y contacto": accordion lợi ích trên tấm kính mờ (vẽ sẵn trong ảnh nền chung
 * với s13, xem `SkyBackdrop`), form liên hệ đặt ở vùng trời bên phải.
 * Thiết kế không vẽ form → bổ sung theo phong cách thẻ kính mờ, vừa khít chiều cao 491px;
 * khi form hiện lỗi thì section cao thêm (min-height) thay vì đè lên s13.
 */
export function BenefitsContact({ benefits, items, contact, form, locale }: Props) {
  return (
    <section
      id="contacto"
      aria-labelledby="benefits-title"
      className="relative z-10 pt-14 pb-12 lg:min-h-[30.6875rem] lg:pt-[3.9375rem] lg:pb-4"
    >
      <SectionMarker id="s12" className="top-0 h-full" />
      <div className="container-site lg:grid lg:grid-cols-[1fr_24.0625rem] lg:gap-x-10">
        <div className="rounded-[1.5rem] bg-white/75 p-5 backdrop-blur-sm lg:rounded-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <h2 id="benefits-title" className="title-side">
            {benefits.title}
          </h2>
          <Accordion items={items} className="mt-6 lg:mt-[2.6rem] lg:max-w-[24.3rem]" />
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-white/90 p-5 shadow-[0_0.5rem_2rem_rgb(0_55_123/0.12)] backdrop-blur lg:-mt-[2.6875rem] lg:self-start lg:px-[1.375rem] lg:py-[1rem]">
          <ContactForm t={form} locale={locale} title={contact.title} intro={contact.intro} />
        </div>
      </div>
    </section>
  );
}
