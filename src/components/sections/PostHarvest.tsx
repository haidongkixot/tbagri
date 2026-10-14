import Image from "next/image";
import type { PageContent } from "@/server/content";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { Stepper, StepperList, StepperPanel } from "@/components/ui/Stepper";

type Props = {
  postHarvest: PageContent["postHarvest"];
  steps: PageContent["postHarvestSteps"];
  solutions: PageContent["dryingSolutions"];
};

/** Vị trí lưới desktop của từng bước: hàng 1 trái → phải, hàng 2 phải → trái (chữ U ngược). */
const GRID_POS = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-4 lg:row-start-1",
  "lg:col-start-4 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-start-2 lg:row-start-2",
  "lg:col-start-1 lg:row-start-2",
];

/**
 * s10 — "Procesamiento posterior a la cosecha…": dây chuyền 8 bước có mũi tên nét đứt,
 * bên dưới là khung "Soluciones de secado…" (tab dọc) đặt trên ảnh cánh đồng.
 */
export function PostHarvest({ postHarvest, steps, solutions }: Props) {
  return (
    <section
      aria-labelledby="postharvest-title"
      className="bg-green-pale relative lg:pt-[0.4375rem]"
    >
      <SectionMarker id="s10" className="top-0 h-full" />
      {/* Phần thân bông lúa của s09 lấn xuống, nằm dưới tấm trắng bo góc */}
      <Image
        src="/images/deco-rice-stems.png"
        alt=""
        width={150}
        height={50}
        className="pointer-events-none absolute top-0 left-[calc(50%-39.0625rem+5rem)] hidden h-[1.5625rem] w-[4.6875rem] lg:block"
      />

      <div className="relative overflow-hidden rounded-tl-[5rem] bg-white pt-14 lg:h-[73.875rem] lg:rounded-tl-[11.25rem] lg:pt-[3.75rem]">
        <h2
          id="postharvest-title"
          className="title-side container-site text-center lg:max-w-[32.5rem]"
        >
          {postHarvest.title}
        </h2>

        {/* Dây chuyền 8 bước */}
        <ol className="container-site mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:mt-0 lg:w-[61rem] lg:max-w-none lg:-translate-x-[1.1875rem] lg:gap-x-0 lg:gap-y-[1.6875rem]">
          {steps.map((step, i) => (
            <li key={step.label} className={`flex flex-col items-center ${GRID_POS[i] ?? ""}`}>
              <div className="relative h-28 w-full lg:h-[10.25rem] lg:w-[10.5rem]">
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  sizes="(min-width: 1024px) 10.5rem, 45vw"
                  className="img-multiply object-contain object-bottom"
                />
              </div>
              <div className="mt-2 flex w-full items-start justify-center lg:mt-[0.5625rem]">
                <ArrowZone index={i} total={steps.length} side="left" />
                <span className="text-navy text-center text-[0.9375rem] leading-[1.1875rem] font-medium whitespace-pre-line">
                  {i + 1}. {step.label}
                </span>
                <ArrowZone index={i} total={steps.length} side="right" />
              </div>
            </li>
          ))}
        </ol>

        {/* Khung giải pháp: ảnh + tab dọc bên trái, mô tả bên phải */}
        <Stepper
          count={solutions.length}
          className="container-site relative z-10 mt-14 lg:mt-[4.5625rem] lg:grid lg:grid-cols-[18.1875rem_1fr] lg:gap-x-[3.53rem] lg:pl-[10.59rem]"
        >
          <div className="bg-green-pale rounded-tr-[2.5rem] rounded-bl-[2.5rem] p-[0.625rem] pb-4 lg:h-[25.40625rem] lg:pb-[0.625rem]">
            {solutions.map((s, i) => (
              <StepperPanel key={s.label} index={i} kind="media">
                <div
                  className={`relative aspect-[271/194] w-full overflow-hidden rounded-tr-[1.875rem] rounded-bl-[1.875rem] lg:aspect-auto lg:h-[12.15625rem] ${
                    s.fit === "contain" ? "bg-white" : ""
                  }`}
                >
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    fill
                    sizes="(min-width: 1024px) 17rem, 90vw"
                    className={s.fit === "contain" ? "object-contain p-3" : "object-cover"}
                  />
                </div>
              </StepperPanel>
            ))}
            <StepperList
              label={solutions[0]?.label ?? ""}
              titles={solutions.map((s) => s.label)}
              className="mt-2 px-3 lg:mt-[0.53rem] lg:pr-[3.15rem] lg:pl-[1.40625rem]"
            />
          </div>

          <div className="mt-6 lg:mt-[4.35rem]">
            {solutions.map((s, i) => (
              <StepperPanel key={s.label} index={i} className="focus-visible:outline-offset-4">
                <h3 className="title-caps lg:text-[1.03125rem] lg:leading-[1.25rem]">{s.label}</h3>
                <p className="text-body mt-3 lg:mt-[0.6875rem] lg:max-w-[15.5rem]">
                  {s.description}
                </p>
              </StepperPanel>
            ))}
          </div>
        </Stepper>

        {/* Ảnh cánh đồng: nền đáy trên desktop, dải ảnh cuối section trên mobile */}
        <div className="relative mt-10 aspect-[2500/1070] w-full lg:absolute lg:inset-x-0 lg:bottom-[-0.0625rem] lg:mt-0 lg:aspect-auto lg:h-[33.4375rem]">
          <Image
            src="/images/drying-field.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right-bottom"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Đoạn mũi tên nét đứt hai bên nhãn bước (chỉ desktop). Mũi tên giữa hai bước được ghép từ
 * vùng phải của bước trước và vùng trái của bước sau, cách chữ 34.5px.
 */
function ArrowZone({
  index,
  total,
  side,
}: {
  index: number;
  total: number;
  side: "left" | "right";
}) {
  const perRow = total / 2;
  const row = index < perRow ? 1 : 2;
  const lastOfRow1 = index === perRow - 1;
  const firstOfRow2 = index === perRow;
  const lastStep = index === total - 1;
  // Hàng 1 chạy sang phải, hàng 2 chạy sang trái.
  // Hàng 1: vùng trái có đầu mũi tên (trừ bước 1), vùng phải có nét (trừ bước 4 = khúc rẽ).
  // Hàng 2: vùng phải có đầu mũi tên trỏ trái (trừ bước 5), vùng trái có nét (trừ bước cuối).
  let content: React.ReactNode = null;
  if (row === 1 && side === "left" && index > 0) content = <Segment head="right" />;
  if (row === 1 && side === "right" && !lastOfRow1) content = <Segment gapAt="left" />;
  if (row === 1 && side === "right" && lastOfRow1) content = <Turn />;
  if (row === 2 && side === "right" && !firstOfRow2) content = <Segment head="left" />;
  if (row === 2 && side === "left" && !lastStep) content = <Segment gapAt="right" />;

  return (
    <span aria-hidden className="relative hidden h-[1.1875rem] flex-1 lg:block">
      {content}
    </span>
  );
}

const GAP = "2.15625rem"; // 34.5px — khoảng cách từ chữ tới mũi tên

/**
 * Một nửa mũi tên trong vùng bên cạnh nhãn.
 * - `gapAt`: nét nối, chừa khoảng 34.5px ở phía sát chữ.
 * - `head`: nửa có đầu mũi tên, đầu nằm cách chữ 34.5px.
 */
function Segment({ gapAt, head }: { gapAt?: "left" | "right"; head?: "left" | "right" }) {
  if (head === "right") {
    return (
      <>
        <span className="dash-x absolute top-2 left-0" style={{ right: `calc(${GAP} + 0.5rem)` }} />
        <Head dir="right" style={{ right: GAP }} />
      </>
    );
  }
  if (head === "left") {
    return (
      <>
        <span className="dash-x absolute top-2 right-0" style={{ left: `calc(${GAP} + 0.5rem)` }} />
        <Head dir="left" style={{ left: GAP }} />
      </>
    );
  }
  return (
    <span
      className="dash-x absolute top-2"
      style={gapAt === "left" ? { left: GAP, right: 0 } : { left: 0, right: GAP }}
    />
  );
}

/** Khúc rẽ từ bước 4 xuống bước 5: nét ngang rồi nét dọc, đầu mũi tên trỏ xuống. */
function Turn() {
  return (
    <>
      <span className="dash-x absolute top-2 right-[1.0625rem]" style={{ left: GAP }} />
      <span className="dash-y absolute top-2 right-[1.0625rem] h-[14.3125rem]" />
      <svg
        viewBox="0 0 20 10"
        className="fill-green absolute top-[14.8125rem] right-[0.4375rem] h-[0.625rem] w-[1.25rem]"
      >
        <path d="M0 0h20L10 10Z" />
      </svg>
    </>
  );
}

function Head({ dir, style }: { dir: "left" | "right"; style: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 10 20"
      className="fill-green absolute top-[-0.15625rem] h-[1.3rem] w-[0.65rem]"
      style={style}
    >
      <path d={dir === "right" ? "M0 0l10 10L0 20Z" : "M10 0L0 10l10 10Z"} />
    </svg>
  );
}
