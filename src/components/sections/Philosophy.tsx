import Image from "next/image";
import type { PageContent } from "@/server/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { Carousel, CarouselButton, CarouselTrack } from "@/components/ui/Carousel";
import { SectionMarker } from "@/components/ui/SectionMarker";

type Props = {
  philosophy: PageContent["philosophy"];
  slides: PageContent["philosophySlides"];
  a11y: Dictionary["a11y"];
};

/** s05 — Dải trắng "Filosofía de implementación": chữ bên trái, carousel ảnh tràn sang phải. */
export function Philosophy({ philosophy, slides, a11y }: Props) {
  return (
    <section
      aria-labelledby="philosophy-title"
      className="relative overflow-hidden bg-white py-10 lg:h-[15.5rem] lg:py-0"
    >
      <SectionMarker id="s05" className="top-0 h-full" />
      <Carousel
        label={philosophy.title}
        className="container-site lg:grid lg:h-full lg:grid-cols-[20.0625rem_1fr]"
      >
        <div className="lg:pt-[1.95rem]">
          <h2
            id="philosophy-title"
            className="text-navy text-[1.125rem] leading-tight font-bold uppercase lg:max-w-[14rem] lg:text-[1rem] lg:leading-[1.25rem]"
          >
            {philosophy.title}
          </h2>
          <p className="text-body text-ink mt-3 lg:mt-[0.95rem] lg:max-w-[16rem] lg:text-[0.8375rem] lg:leading-[0.97rem] lg:font-[450] lg:tracking-[0.005em] lg:text-balance">
            {philosophy.text}
          </p>
          <div className="mt-5 hidden gap-[0.6rem] lg:mt-[1.3rem] lg:flex">
            <CarouselButton dir="prev" label={a11y.previous} />
            <CarouselButton dir="next" label={a11y.next} />
          </div>
        </div>

        {/* Track tràn ra mép phải màn hình */}
        <CarouselTrack className="mt-6 -mr-4 scroll-pl-0 gap-[1.25rem] lg:mt-[1.47rem] lg:mr-[calc((100vw-var(--container-site))/-2)] lg:-ml-[0.25rem] lg:h-[12.5rem]">
          {slides.map((s, i) => (
            <li
              key={s.label}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}: ${s.label}`}
              className="relative aspect-[248/199] w-[78%] shrink-0 snap-start sm:w-[16rem] lg:aspect-auto lg:h-[12.4375rem] lg:w-[15.5rem]"
            >
              <div className="relative size-full overflow-hidden rounded-[1.75rem] rounded-br-none">
                <Image
                  src={s.image.src}
                  alt={s.image.alt}
                  fill
                  sizes="(min-width: 1024px) 15.5rem, 78vw"
                  className="object-cover"
                />
              </div>
              <span className="bg-green absolute right-0 bottom-0 rounded-tl-[0.875rem] px-[0.95rem] py-[0.45rem] text-[0.9375rem] leading-[1.25rem] font-semibold text-white">
                {s.label}
              </span>
            </li>
          ))}
          <li aria-hidden className="w-px shrink-0" />
        </CarouselTrack>

        <div className="mt-4 flex gap-3 lg:hidden">
          <CarouselButton dir="prev" label={a11y.previous} />
          <CarouselButton dir="next" label={a11y.next} />
        </div>
      </Carousel>
    </section>
  );
}
