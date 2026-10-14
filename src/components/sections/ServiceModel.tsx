import Image from "next/image";
import type { PageContent } from "@/server/content";
import { SectionMarker } from "@/components/ui/SectionMarker";

type Props = { serviceModel: PageContent["serviceModel"]; services: PageContent["services"] };

/** s06 — "Modelo de servicio": 6 icon dịch vụ và băng rôn sản phẩm trên cánh đồng. */
export function ServiceModel({ serviceModel, services }: Props) {
  return (
    <section
      aria-labelledby="service-title"
      className="bg-sky-soft relative pt-10 lg:h-[34.5rem] lg:pt-[2.15rem]"
    >
      <SectionMarker id="s06" className="top-0 h-full" />
      <div className="container-site">
        <h2 id="service-title" className="title-caps">
          {serviceModel.title}
        </h2>
        <ul className="mt-6 grid grid-cols-3 gap-y-6 sm:grid-cols-6 lg:mt-[1.4rem] lg:-ml-[3.49rem] lg:w-[62.75rem] lg:gap-y-0">
          {services.map((s) => (
            <li key={s.label} className="flex flex-col items-center text-center">
              <Image
                src={s.icon}
                alt=""
                width={107}
                height={107}
                className="size-14 lg:size-[3.375rem]"
              />
              <span className="text-navy mt-2 max-w-[8.5rem] text-[0.875rem] leading-[1.1rem] lg:mt-[0.85rem] lg:max-w-[8.5rem] lg:text-[0.875rem] lg:leading-[1.0625rem]">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative mt-8 aspect-[2500/745] w-full lg:absolute lg:inset-x-0 lg:bottom-[-0.15rem] lg:mt-0">
        <Image
          src={serviceModel.banner.src}
          alt={serviceModel.banner.alt}
          fill
          sizes="100vw"
          className="[mask-image:linear-gradient(to_bottom,transparent_0,#000_14%)] object-cover"
        />
      </div>
    </section>
  );
}
