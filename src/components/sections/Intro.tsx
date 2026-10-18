import Image from "next/image";
import type { PageContent } from "@/server/content";
import { Rosette } from "@/components/ui/Rosette";
import { SectionMarker } from "@/components/ui/SectionMarker";

type Props = {
  intro: PageContent["intro"];
  audiences: PageContent["audiences"];
};

/**
 * s03 — Giới thiệu: thẻ trắng 816px đè lên hero, dải xanh lá phía dưới.
 * Số đo desktop tính theo px thiết kế (÷16 = rem).
 */
export function Intro({ intro, audiences }: Props) {
  return (
    <section
      id="introduccion"
      aria-labelledby="intro-title"
      className="relative z-10 scroll-mt-20 lg:-mt-[var(--hero-overlap)] lg:pb-[1.6875rem]"
    >
      <SectionMarker id="s03" className="top-0 h-[32.0625rem]" />
      {/* Dải xanh lá phía dưới (full màn hình) */}
      <div
        aria-hidden
        className="bg-green absolute inset-x-0 bottom-0 hidden h-[8.25rem] lg:block"
      />

      <div className="relative mx-auto bg-white px-5 pt-8 lg:w-[var(--container-card)] lg:rounded-t-[1.125rem] lg:px-0 lg:pt-[1.8rem]">
        {/* Hai cột chữ */}
        <div className="lg:grid lg:grid-cols-[22.125rem_1fr] lg:pr-[4.25rem]">
          <div className="relative flex justify-center pb-6 text-center lg:h-[6.6rem] lg:pt-[1.15rem] lg:pb-0">
            <Rosette className="absolute top-[-0.95rem] left-1/2 hidden size-[8rem] -translate-x-[48%] text-[#d8dadf] lg:block" />
            <h2
              id="intro-title"
              className="text-navy relative text-[1.25rem] leading-[1.25] font-semibold text-balance lg:max-w-[16rem] lg:text-[1.0625rem] lg:leading-[1.19rem]"
            >
              {intro.heading}
            </h2>
          </div>
          <div className="text-navy space-y-[0.95rem] text-[0.9375rem] leading-[1.45] lg:-ml-[0.05rem] lg:space-y-[0.9375rem] lg:text-[0.7875rem] lg:leading-[0.9375rem]">
            {intro.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>

        {/* Khung xanh nhạt: 3 thẻ đối tượng + "Un solo socio" */}
        <div className="bg-green-card relative mt-8 rounded-2xl px-4 pt-6 pb-8 lg:mt-[1.8rem] lg:mr-[1.6875rem] lg:ml-[1.53rem] lg:rounded-none lg:px-0 lg:pt-0 lg:pb-[1.85rem]">
          <ul className="grid gap-6 sm:grid-cols-3 lg:gap-[1.25rem]">
            {audiences.map((a) => (
              <li key={a.label} className="relative">
                <div className="relative aspect-[242/196] overflow-hidden rounded-[1.5rem] rounded-tl-none rounded-br-none">
                  <Image
                    src={a.image.src}
                    alt={a.image.alt}
                    fill
                    sizes="(min-width: 1024px) 15rem, (min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {/* Nhãn navy + icon tròn xanh lá */}
                <div className="bg-navy absolute -top-[0.125rem] left-0 flex h-[2.6875rem] items-center rounded-br-[0.75rem] pr-4 pl-[2.45rem] text-[0.8125rem] leading-[0.8rem] font-semibold text-white lg:pr-[1.15rem]">
                  <span className="whitespace-pre-line">{a.label}</span>
                </div>
                <Image
                  src={a.icon}
                  alt=""
                  width={89}
                  height={89}
                  className="absolute -top-[0.5625rem] -left-[0.84rem] size-[2.75rem]"
                />
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-center gap-3 text-center lg:mt-[2.7rem] lg:gap-0">
            <div className="relative">
              <Image
                src="/images/icon-wreath.png"
                alt=""
                width={130}
                height={172}
                className="mx-auto mb-2 h-[4rem] w-auto lg:absolute lg:top-[-1.7rem] lg:right-[calc(100%-1.95rem)] lg:mb-0 lg:h-[5.375rem]"
              />
              <p className="text-navy text-[1rem] leading-tight font-semibold uppercase lg:text-[1.05rem] lg:leading-[1.2rem]">
                {intro.partnerTitle}
              </p>
              <p className="text-navy mx-auto mt-1 max-w-[21rem] text-[0.875rem] leading-snug lg:mt-[0.3rem] lg:max-w-[21.5rem] lg:text-[0.8125rem] lg:leading-[0.9rem]">
                {intro.partnerText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
