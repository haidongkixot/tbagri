/**
 * Mô hình nội dung của website TBAgri.
 * - Mỗi trường chữ hiển thị cho người dùng là `L10n` (có bản es và en).
 * - Ảnh là đường dẫn trong /public (ví dụ "/images/hero-bg.webp") hoặc URL tải lên.
 * - Cùng một mô hình được dùng cho nội dung mặc định (src/content/defaults.ts),
 *   cơ sở dữ liệu (lab 11) và trình quản trị CMS (lab 14).
 */
export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export type L10n = { es: string; en: string };

export type ImageRef = { src: string; alt: L10n };
/** Cách ảnh lấp khung: "cover" cắt cho đầy khung, "contain" giữ trọn ảnh (bao bì sản phẩm). */
export type ImageFit = "cover" | "contain";

export type SiteSettings = {
  companyName: L10n;
  address: L10n;
  email: string;
  phone: string;
  whatsapp: string; // số điện thoại quốc tế, không dấu cách, ví dụ 5350509999
  facebook: string; // URL trang Facebook, để trống nếu chưa có
  seoTitle: L10n;
  seoDescription: L10n;
};

export type HeroSection = { title: L10n; subtitle: L10n; background: ImageRef };

export type IntroSection = {
  heading: L10n;
  paragraphs: L10n[];
  partnerTitle: L10n;
  partnerText: L10n;
};

export type Audience = { label: L10n; image: ImageRef; icon: string };

export type CycleSection = {
  title: L10n;
  startLabel: L10n;
  centerTitle: L10n;
  centerText: L10n;
};
export type CycleStep = { label: L10n; icon: string };

export type PhilosophySection = { title: L10n; text: L10n };
export type PhilosophySlide = { label: L10n; image: ImageRef };

export type ServiceModelSection = { title: L10n; banner: ImageRef };
export type Service = { label: L10n; icon: string };

export type ProductGroupsSection = { title: L10n; ctaLabel: L10n };
/** Slide có ảnh: `fit` = "contain" cho ảnh bao bì (giữ trọn sản phẩm), mặc định "cover". */
export type Slide = {
  title: L10n;
  description: L10n;
  image: ImageRef;
  fit?: ImageFit;
};

export type SeedsInputsSection = { title: L10n };

export type MachinerySection = { title: L10n; ctaLabel: L10n };

export type PostHarvestSection = { title: L10n };
export type PostHarvestStep = { label: L10n; image: ImageRef };
export type DryingSolution = { label: L10n; description: L10n; image: ImageRef; fit?: ImageFit };

export type DigitalSection = {
  title: L10n;
  subtitle: L10n;
  text: L10n;
  image: ImageRef;
};
export type DigitalFeature = { title: L10n; description: L10n; icon: string };

export type BenefitsSection = { title: L10n };
export type Benefit = { title: L10n; description: L10n };

export type ContactSection = { title: L10n; intro: L10n };

export type InvitationSection = { title: L10n; text: L10n; ctaLabel: L10n };

export type FooterLink = { label: L10n; href: string };

export type Store = {
  name: L10n;
  address: L10n;
  phone: string;
  hours: L10n;
  mapUrl: string;
};

export type SiteContent = {
  settings: SiteSettings;
  hero: HeroSection;
  intro: IntroSection;
  audiences: Audience[];
  cycle: CycleSection;
  cycleSteps: CycleStep[];
  philosophy: PhilosophySection;
  philosophySlides: PhilosophySlide[];
  serviceModel: ServiceModelSection;
  services: Service[];
  productGroups: ProductGroupsSection;
  productSlides: Slide[];
  seedsInputs: SeedsInputsSection;
  inputSlides: Slide[];
  machinery: MachinerySection;
  machines: Slide[];
  postHarvest: PostHarvestSection;
  postHarvestSteps: PostHarvestStep[];
  dryingSolutions: DryingSolution[];
  digital: DigitalSection;
  digitalFeatures: DigitalFeature[];
  benefits: BenefitsSection;
  benefitItems: Benefit[];
  contact: ContactSection;
  invitation: InvitationSection;
  footerLinks: FooterLink[];
  stores: Store[];
};

/** Biến mọi L10n trong T thành string — dùng cho component đã chọn ngôn ngữ. */
export type Localized<T> = T extends L10n
  ? string
  : T extends (infer U)[]
    ? Localized<U>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

export function isL10n(value: unknown): value is L10n {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 2 &&
    "es" in value &&
    "en" in value
  );
}

/** Chọn ngôn ngữ cho toàn bộ cây nội dung. Thiếu bản dịch thì dùng tiếng Tây Ban Nha. */
export function localize<T>(value: T, locale: Locale): Localized<T> {
  if (isL10n(value)) {
    return ((value[locale] || value.es) ?? "") as Localized<T>;
  }
  if (Array.isArray(value)) {
    return value.map((v) => localize(v, locale)) as Localized<T>;
  }
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = localize(v, locale);
    return out as Localized<T>;
  }
  return value as Localized<T>;
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
