import Image from "next/image";
import type { PageContent } from "@/server/content";
import { SectionMarker } from "@/components/ui/SectionMarker";

type Props = {
  digital: PageContent["digital"];
  features: PageContent["digitalFeatures"];
};

/**
 * s11 — "TB Agri incorpora tecnologías digitales…": nền ruộng xanh, 4 thẻ bạc hà có huy hiệu
 * icon tròn đè lên mép trên, ảnh nông dân tràn ra mép phải màn hình.
 */
export function Digital({ digital, features }: Props) {
  return (
    <section
      aria-labelledby="digital-title"
      className="bg-green relative overflow-hidden pt-14 pb-16 lg:h-[56.5625rem] lg:pt-[5.375rem] lg:pb-0"
    >
      <SectionMarker id="s11" className="top-0 h-full" />
      <Image
        src="/images/digital-bg.webp"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover object-top"
      />

      <div className="container-site relative">
        <h2 id="digital-title" className="title-side mx-auto text-center lg:max-w-[51rem]">
          {digital.title}
        </h2>

        <div className="mt-10 lg:mt-[4rem] lg:grid lg:grid-cols-[34.6875rem_1fr] lg:gap-x-[2.5625rem]">
          <div>
            <h3 className="title-caps lg:text-[1.03125rem] lg:leading-[1.25rem]">
              {digital.subtitle}
            </h3>
            <p className="text-body text-ink mt-3 lg:mt-[0.75rem] lg:max-w-[29rem] lg:leading-4 lg:font-medium lg:tracking-[-0.05em]">
              {digital.text}
            </p>

            <ul className="mt-12 grid gap-x-[1.96875rem] gap-y-12 sm:grid-cols-2 lg:mt-[3.47rem] lg:gap-y-[3.8125rem]">
              {features.map((f) => (
                <li
                  key={f.title}
                  className="bg-mint relative rounded-[1.0625rem] px-[1.375rem] pt-10 pb-6 lg:h-[12.75rem] lg:pt-[2.1rem] lg:pr-[0.875rem] lg:pb-0"
                >
                  <Image
                    src={f.icon}
                    alt=""
                    width={113}
                    height={113}
                    className="absolute -top-[1.8125rem] left-[1.1875rem] size-[3.40625rem]"
                  />
                  <h4 className="title-caps lg:text-[1.03125rem] lg:leading-[1.25rem]">
                    {f.title}
                  </h4>
                  <p className="text-body text-ink mt-1 lg:mt-[0.22rem] lg:max-w-[13.4rem] lg:leading-[0.9375rem] lg:font-medium lg:tracking-[-0.05em]">
                    {f.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Ảnh tràn ra mép phải màn hình trên desktop */}
          <div className="relative mt-12 aspect-[493/594] overflow-hidden rounded-[1.75rem] lg:mt-0 lg:mr-[calc((100vw-var(--container-site))/-2)] lg:aspect-auto lg:h-[37.125rem] lg:rounded-r-none">
            <Image
              src={digital.image.src}
              alt={digital.image.alt}
              fill
              sizes="(min-width: 1024px) 31rem, 100vw"
              className="object-cover object-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
