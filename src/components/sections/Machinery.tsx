import Image from "next/image";
import type { PageContent } from "@/server/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { Carousel, CarouselButton, CarouselTrack } from "@/components/ui/Carousel";
import { SectionMarker } from "@/components/ui/SectionMarker";

type Props = {
  machinery: PageContent["machinery"];
  machines: PageContent["machines"];
  a11y: Dictionary["a11y"];
};

/**
 * s09 — "Mecanización agrícola": carousel thẻ máy (3 thẻ hiển thị trên desktop),
 * mũi tên hai bên, nút liên hệ ở dưới, bông lúa trang trí góc trái.
 */
export function Machinery({ machinery, machines, a11y }: Props) {
  return (
    <section
      aria-labelledby="machinery-title"
      className="bg-green-pale relative overflow-hidden pt-4 pb-14 lg:h-[36.875rem] lg:pt-[1.96875rem] lg:pb-0"
    >
      <SectionMarker id="s09" className="top-0 h-full" />

      {/* Bông lúa trang trí: canh theo mép canvas thiết kế (x = 40, y = 330) */}
      <Image
        src="/images/deco-rice-stalk-light.png"
        alt=""
        width={352}
        height={520}
        className="pointer-events-none absolute top-[20.625rem] left-[calc(50%-36.5625rem)] hidden h-[16.25rem] w-[11rem] lg:block"
      />

      <h2 id="machinery-title" className="title-side container-site text-center">
        {machinery.title}
      </h2>

      <Carousel label={machinery.title} className="container-site relative mt-6 lg:mt-[1.90625rem]">
        <div className="lg:mx-auto lg:max-w-[var(--container-card)]">
          <CarouselTrack className="-mr-4 scroll-pl-0 gap-4 lg:mr-0 lg:gap-[0.953125rem]">
            {machines.map((m, i) => (
              <li
                key={m.title}
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${machines.length}: ${m.title}`}
                className="flex w-[82%] shrink-0 snap-start flex-col rounded-tr-[2.8125rem] rounded-bl-[2.8125rem] bg-white p-[0.40625rem] pb-6 sm:w-[17rem] lg:h-[22.15625rem] lg:w-[16.34375rem] lg:pb-[0.40625rem]"
              >
                <div className="relative aspect-[249/176] w-full overflow-hidden rounded-tr-[2.375rem] rounded-bl-[2.375rem] lg:aspect-auto lg:h-[11rem]">
                  <Image
                    src={m.image.src}
                    alt={m.image.alt}
                    fill
                    sizes="(min-width: 1024px) 15.6rem, 80vw"
                    className={m.fit === "contain" ? "bg-white object-contain" : "object-cover"}
                  />
                </div>
                <div className="px-4 lg:pr-[1.25rem] lg:pl-[1rem]">
                  <h3 className="title-caps mt-4 lg:mt-[1.0625rem] lg:text-[1.03125rem] lg:leading-[1.25rem]">
                    {m.title}
                  </h3>
                  <p className="text-body mt-1">{m.description}</p>
                </div>
              </li>
            ))}
          </CarouselTrack>
        </div>

        <CarouselButton
          dir="prev"
          variant="chevron"
          label={a11y.previous}
          className="absolute top-[9.234rem] -left-[0.55rem] hidden lg:grid"
        />
        <CarouselButton
          dir="next"
          variant="chevron"
          label={a11y.next}
          className="absolute top-[9.234rem] -right-[0.25rem] hidden lg:grid"
        />
      </Carousel>

      <div className="container-site mt-8 text-center lg:mt-[1.84375rem]">
        <a
          href="#contacto"
          data-interest="maquinaria"
          className="btn-green w-full sm:w-auto lg:h-[2.8125rem] lg:w-[25.4rem] lg:text-[0.90625rem]"
        >
          {machinery.ctaLabel}
        </a>
      </div>
    </section>
  );
}
