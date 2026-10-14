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
      <div className="relative mx-auto w-full lg:w-[var(--container-hero)]">
        {/* Tiêu đề */}
        <div className="bg-gradient-to-b from-[#b9e0f8] to-sky-100 px-5 pt-8 pb-6 text-center lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:bg-none lg:px-0 lg:pt-[1.875rem] lg:pb-0">
          <h1 id="hero-title" className="font-display font-bold uppercase">
            <span className="text-navy block text-[1.75rem] leading-[1.1] lg:pl-[1.25rem] lg:text-[2.15rem] lg:leading-[2.375rem]">
              {hero.title}
            </span>
            <span className="mx-auto mt-2 block max-w-[30rem] text-[1.125rem] leading-[1.2] text-green-600 lg:mt-0 lg:max-w-[33.5rem] lg:pl-[1.25rem] lg:text-[1.5625rem] lg:leading-[1.65625rem]">
              {hero.subtitle}
            </span>
          </h1>
        </div>

        {/* Ảnh nền: mobile chỉ hiện phần vòng tròn; desktop hiện cả dải ruộng sau thẻ giới thiệu */}
        <div className="relative aspect-[1850/900] overflow-hidden lg:aspect-auto lg:h-[55.84375rem]">
          <Image
            src={hero.background.src}
            alt={hero.background.alt}
            fill
            priority
            sizes="(min-width: 1024px) 74vw, 100vw"
            className="object-cover object-[50%_15%] lg:object-top"
          />
        </div>
      </div>
    </section>
  );
}
