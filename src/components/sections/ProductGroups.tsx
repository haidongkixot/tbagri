import type { PageContent } from "@/server/content";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { SlideImage } from "@/components/ui/SlideImage";
import { Stepper, StepperPanel, StepperTabs } from "@/components/ui/Stepper";

type Props = {
  productGroups: PageContent["productGroups"];
  slides: PageContent["productSlides"];
};

/**
 * s07 — "Grupo de productos y servicios": ảnh bên trái, bên phải là tiêu đề, nút liên hệ,
 * mô tả nhóm sản phẩm đang chọn và stepper hạt lúa. Neo menu "Productos" → #productos.
 */
export function ProductGroups({ productGroups, slides }: Props) {
  return (
    <section
      id="productos"
      aria-labelledby="products-title"
      className="bg-green-pale relative py-12 lg:h-[33.125rem] lg:py-0 lg:pt-[4.8125rem]"
    >
      <SectionMarker id="s07" className="top-0 h-full" />
      <Stepper
        count={slides.length}
        className="container-site grid lg:grid-cols-[28.125rem_1fr] lg:grid-rows-[auto_auto_1fr] lg:gap-x-[4.03rem]"
      >
        {/* Tiêu đề + nút: trên mobile đứng đầu, desktop nằm cột phải */}
        <div className="lg:col-start-2 lg:row-start-1">
          <h2 id="products-title" className="title-side lg:max-w-[25.5rem]">
            {productGroups.title}
          </h2>
          <a
            href="#contacto"
            data-interest="paquete"
            className="btn-green mt-5 w-full lg:mt-[1.3125rem] lg:h-[2.8125rem] lg:w-[25.4rem] lg:text-[0.90625rem]"
          >
            {productGroups.ctaLabel}
          </a>
        </div>

        {/* Ảnh: đổi theo bước đang chọn */}
        <div className="mt-8 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
          {slides.map((s, i) => (
            <StepperPanel key={s.title} index={i} kind="media">
              <SlideImage
                src={s.image.src}
                alt={s.image.alt}
                fit={s.fit}
                sizes="(min-width: 1024px) 28.125rem, 100vw"
                className="aspect-[450/418] w-full lg:h-[26.125rem]"
              />
            </StepperPanel>
          ))}
        </div>

        {/* Chữ của bước đang chọn */}
        <div className="mt-6 lg:col-start-2 lg:row-start-2 lg:mt-[1.975rem]">
          {slides.map((s, i) => (
            <StepperPanel key={s.title} index={i} className="focus-visible:outline-offset-4">
              <h3 className="title-caps lg:text-[1.03125rem] lg:leading-[1.25rem]">{s.title}</h3>
              <p className="text-body mt-2 lg:mt-[0.9375rem] lg:max-w-[16.5rem]">{s.description}</p>
            </StepperPanel>
          ))}
        </div>

        <StepperTabs
          label={productGroups.title}
          titles={slides.map((s) => s.title)}
          className="mt-6 -ml-[0.5625rem] lg:col-start-2 lg:row-start-3 lg:mt-0 lg:mb-[2.1875rem] lg:ml-0 lg:self-end"
        />
      </Stepper>
    </section>
  );
}
