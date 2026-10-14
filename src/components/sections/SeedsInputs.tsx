import type { PageContent } from "@/server/content";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { SlideImage } from "@/components/ui/SlideImage";
import { Stepper, StepperPanel, StepperTabs } from "@/components/ui/Stepper";

type Props = {
  seedsInputs: PageContent["seedsInputs"];
  slides: PageContent["inputSlides"];
};

/** s08 — "Semillas e insumos": chữ + stepper bên trái, minh họa bên phải (ngược với s07). */
export function SeedsInputs({ seedsInputs, slides }: Props) {
  return (
    <section
      aria-labelledby="inputs-title"
      className="bg-green-pale relative pb-14 lg:h-[26.5625rem] lg:pt-[3rem] lg:pb-0"
    >
      <SectionMarker id="s08" className="top-0 h-full" />
      <Stepper
        count={slides.length}
        className="container-site grid lg:grid-cols-[1fr_28.125rem] lg:grid-rows-[auto_auto_1fr]"
      >
        <h2
          id="inputs-title"
          className="title-side lg:col-start-1 lg:row-start-1 lg:pt-[0.1875rem]"
        >
          {seedsInputs.title}
        </h2>

        <div className="mt-6 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mt-0">
          {slides.map((s, i) => (
            <StepperPanel key={s.title} index={i} kind="media">
              <SlideImage
                src={s.image.src}
                alt={s.image.alt}
                fit={s.fit}
                sizes="(min-width: 1024px) 28.125rem, 100vw"
                className="aspect-[450/348] w-full lg:h-[21.75rem]"
              />
            </StepperPanel>
          ))}
        </div>

        <div className="mt-6 lg:col-start-1 lg:row-start-2 lg:mt-[2.25rem] lg:pl-[0.19rem]">
          {slides.map((s, i) => (
            <StepperPanel key={s.title} index={i} className="focus-visible:outline-offset-4">
              <h3 className="title-caps lg:max-w-[14.5rem] lg:text-[1.03125rem] lg:leading-[1.25rem]">
                {s.title}
              </h3>
              <p className="text-body mt-2 lg:mt-[1.5rem] lg:max-w-[18rem]">{s.description}</p>
            </StepperPanel>
          ))}
        </div>

        <StepperTabs
          label={seedsInputs.title}
          titles={slides.map((s) => s.title)}
          className="mt-6 -ml-[0.5625rem] lg:col-start-1 lg:row-start-3 lg:mt-0 lg:mb-[4.125rem] lg:ml-[0.19rem] lg:self-end"
        />
      </Stepper>
    </section>
  );
}
