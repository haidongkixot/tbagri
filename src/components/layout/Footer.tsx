import Image from "next/image";
import type { PageContent } from "@/server/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { SectionMarker } from "@/components/ui/SectionMarker";

type Props = {
  settings: PageContent["settings"];
  links: PageContent["footerLinks"];
  year: number;
  t: Dictionary["footer"];
};

/**
 * s14 — Footer xanh: logo trắng + tên công ty + mạng xã hội, cột liên hệ, cột liên kết,
 * bông lúa xanh đậm trang trí bên phải.
 * Icon mạng xã hội là icon chung (bong bóng chat, biểu tượng trang) — thay bằng bộ icon chính
 * thức khi TBAgri cung cấp theo hướng dẫn thương hiệu của từng nền tảng.
 */
export function Footer({ settings, links, year, t }: Props) {
  const tel = settings.phone.replace(/[^\d+]/g, "");
  return (
    <footer className="bg-green relative overflow-hidden text-white lg:h-[18.84375rem]">
      <SectionMarker id="s14" className="top-0 h-full" />
      <Image
        src="/images/deco-rice-stalk-dark.png"
        alt=""
        width={395}
        height={523}
        className="pointer-events-none absolute right-[-2rem] bottom-0 h-[12rem] w-auto opacity-80 lg:right-auto lg:left-[calc(50%-39.0625rem+54.84375rem)] lg:h-[16.34375rem] lg:opacity-100"
      />

      <div className="container-site relative grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[18.125rem_16.5625rem_1fr] lg:gap-0 lg:py-0">
        {/* Cột 1: thương hiệu */}
        <div className="lg:relative lg:h-[18.84375rem]">
          <Image
            src="/images/logo-tbagri-white.png"
            alt="TBAgri"
            width={280}
            height={114}
            className="h-[3.5625rem] w-auto lg:absolute lg:top-[2.5625rem] lg:-left-[0.125rem]"
          />
          <p className="mt-4 max-w-[12rem] text-[0.9375rem] leading-tight font-semibold uppercase lg:absolute lg:top-[6.8rem] lg:mt-0 lg:max-w-[10rem] lg:text-[0.7875rem] lg:leading-[0.9375rem]">
            {settings.companyName}
          </p>
          <ul className="mt-5 flex gap-4 lg:absolute lg:top-[10.1875rem] lg:mt-0 lg:gap-[1.4rem]">
            {settings.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.whatsapp}
                  className="grid size-11 place-items-center rounded-full hover:bg-white/15 lg:-m-[0.75rem]"
                >
                  <ChatIcon />
                </a>
              </li>
            )}
            <li>
              <a
                href={settings.facebook || "#"}
                target={settings.facebook ? "_blank" : undefined}
                rel={settings.facebook ? "noopener noreferrer" : undefined}
                aria-label={t.facebook}
                aria-disabled={!settings.facebook || undefined}
                className="grid size-11 place-items-center rounded-full hover:bg-white/15 lg:-m-[0.75rem]"
              >
                <PageIcon />
              </a>
            </li>
          </ul>
          <p className="mt-8 text-[0.75rem] lg:absolute lg:top-[15.2rem] lg:mt-0 lg:text-[0.5rem]">
            © {year}. {t.rights}
          </p>
        </div>

        {/* Cột 2: liên hệ */}
        <div className="lg:pt-[2.6rem]">
          <h2 className="text-[1rem] font-semibold uppercase lg:text-[0.78125rem] lg:leading-4">
            {t.contactTitle}
          </h2>
          <ul className="mt-4 space-y-3 text-[0.9375rem] lg:mt-[0.9rem] lg:space-y-[0.7rem] lg:text-[0.5625rem] lg:leading-[0.78rem]">
            <li className="flex gap-3 lg:gap-[0.6rem]">
              <PinIcon />
              <address className="whitespace-pre-line not-italic">{settings.address}</address>
            </li>
            <li className="flex items-center gap-3 lg:gap-[0.6rem]">
              <MailIcon />
              <a href={`mailto:${settings.email}`} className="hover:underline">
                {settings.email}
              </a>
            </li>
            <li className="flex items-center gap-3 lg:gap-[0.4rem]">
              <PhoneIcon />
              <a href={`tel:${tel}`} className="hover:underline">
                {settings.phone}
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3: liên kết */}
        <nav aria-labelledby="footer-about" className="lg:pt-[3.0rem]">
          <h2
            id="footer-about"
            className="text-[1rem] font-semibold uppercase lg:text-[0.78125rem] lg:leading-4"
          >
            {t.aboutTitle}
          </h2>
          <ul className="mt-3 space-y-2 text-[0.9375rem] lg:mt-[0.35rem] lg:space-y-0 lg:text-[0.5625rem] lg:leading-[0.7875rem]">
            {links.map((l) => (
              <li key={l.label}>
                {l.href ? (
                  <a href={l.href} className="hover:underline">
                    {l.label}
                  </a>
                ) : (
                  <span>{l.label}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

const iconCls = "size-5 shrink-0 lg:size-[0.75rem]";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className={`${iconCls} lg:mt-[0.05rem]`} aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#fff" />
      <path
        d="M12 5.5a4.3 4.3 0 0 0-4.3 4.3c0 3.1 4.3 8.2 4.3 8.2s4.3-5.1 4.3-8.2A4.3 4.3 0 0 0 12 5.5Zm0 6a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z"
        className="fill-green"
      />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconCls} aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#fff" />
      <rect x="6" y="8" width="12" height="8.5" rx="1.2" className="fill-green" />
      <path d="M6.5 8.7 12 13l5.5-4.3" fill="none" stroke="#fff" strokeWidth="1.2" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconCls} aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#fff" />
      <path
        d="M9.2 6.5c.4 0 .7.2.8.6l.6 2c.1.3 0 .7-.3.9l-1 .8a8.6 8.6 0 0 0 3.9 3.9l.8-1c.2-.3.6-.4.9-.3l2 .6c.4.1.6.4.6.8v1.8c0 .5-.4.9-.9.9A10.9 10.9 0 0 1 6.5 7.4c0-.5.4-.9.9-.9h1.8Z"
        className="fill-green"
      />
    </svg>
  );
}
/** Icon chat chung (dùng cho liên kết WhatsApp) */
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 lg:size-[1.15rem]" aria-hidden>
      <path
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 8.2c.3 0 .5.1.6.4l.5 1.3c.1.2 0 .5-.1.7l-.5.6a6 6 0 0 0 2.9 2.9l.6-.5c.2-.2.5-.2.7-.1l1.3.5c.3.1.4.3.4.6v1c0 .4-.3.7-.7.7A6.8 6.8 0 0 1 8.2 9.6v-.7c0-.4.3-.7.7-.7h.4Z"
        fill="currentColor"
      />
    </svg>
  );
}
/** Icon trang/cộng đồng chung (dùng cho liên kết trang mạng xã hội) */
function PageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 lg:size-[1.15rem]" aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7.5 17c.8-2.2 2.5-3.3 4.5-3.3s3.7 1.1 4.5 3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
