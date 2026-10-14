import Image from "next/image";
import type { PageContent } from "@/server/content";
import { SectionMarker } from "@/components/ui/SectionMarker";

/**
 * s02 — Hero. Desktop: khung ảnh 925px, cao 893.5px; nửa dưới nằm sau thẻ giới thiệu (s03).
 * Mobile: tiêu đề trên nền trời, ảnh vòng tròn bên dưới.
 */
export function Hero({ hero }: { hero: PageContent["hero"] }) {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative scroll-mt-20">
      <SectionMarker id="s02" className="top-0 h-[30.75rem]" />
      <div className="relative w-full">
        {/* Tiêu đề — giữ đúng khung 925px của thiết kế dù ảnh chạy hết bề ngang */}
        <div className="bg-gradient-to-b from-[#b9e0f8] to-sky-100 px-5 pt-8 pb-6 text-center lg:absolute lg:inset-x-0 lg:top-[var(--hero-title-top)] lg:z-10 lg:mx-auto lg:w-[var(--container-hero)] lg:bg-none lg:px-0 lg:pb-0">
          <h1 id="hero-title" className="font-display font-bold uppercase">
            <span className="text-navy block text-[1.75rem] leading-[1.1] lg:pl-[1.25rem] lg:text-[length:var(--hero-title-1)] lg:leading-[1.105]">
              {hero.title}
            </span>
            <span className="mx-auto mt-2 block max-w-[30rem] text-[1.125rem] leading-[1.2] text-green-600 lg:mt-0 lg:max-w-[57.9vw] lg:pl-[1.25rem] lg:text-[length:var(--hero-title-2)] lg:leading-[1.06]">
              {hero.subtitle}
            </span>
          </h1>
        </div>

        {/* Ảnh nền: mobile chỉ hiện phần vòng tròn; desktop hiện cả dải ruộng sau thẻ giới thiệu */}
        <div className="relative aspect-[1850/900] overflow-hidden lg:aspect-auto lg:h-[var(--hero-h)]">
          <Image
            src={hero.background.src}
            alt={hero.background.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_15%] lg:object-top"
          />
        </div>
      </div>
    </section>
  );
}
