import Image from "next/image";
import type { CSSProperties } from "react";
import type { PageContent } from "@/server/content";
import { SectionMarker } from "@/components/ui/SectionMarker";

type Props = { cycle: PageContent["cycle"]; steps: PageContent["cycleSteps"] };

// Hình học vòng tròn (đơn vị px thiết kế, gốc toạ độ ở tâm vòng).
const SIZE = 666; // đường kính đĩa xanh ngoài
const R_DISC = 333;
const R_CENTER = 148; // vòng tròn trắng ở giữa
const A_IN = 180; // khoảng cách từ tâm tới cạnh trong của ô (12 cạnh)
const A_OUT = 286; // khoảng cách từ tâm tới cạnh ngoài của ô
const LABEL_R = 233; // bán kính đặt nhãn + icon
const GAP_DEG = 1.6; // nửa khe hở giữa hai ô (độ)
const NOTCH_DEG = 3.2; // độ nhô của mũi tên nối hai ô (độ)
// Màu ô chuyển dần từ xanh lá nhạt sang trắng theo thứ tự các bước (đo từ thiết kế)
const FILLS = [
  "#c2e0b8",
  "#c2e0b8",
  "#c2e1b9",
  "#c2e0b8",
  "#d9edd4",
  "#d9edd4",
  "#d9edd4",
  "#e6f3e2",
  "#eef6eb",
  "#f3f8f1",
  "#fafcf9",
  "#ffffff",
];

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))] as const;
const f = (n: number) => Math.round(n * 10) / 10;

/** Đường bao một ô hình thang của vòng 12 cạnh, có mũi tên ở cạnh trước và rãnh ở cạnh sau. */
function segmentPath(centerDeg: number) {
  const half = 15 - GAP_DEG;
  const t = centerDeg - half;
  const l = centerDeg + half;
  const k = 1 / Math.cos(rad(half));
  const mid = (A_IN + A_OUT) / 2;
  const P = [
    pt(A_IN * k, t),
    pt(mid, t + NOTCH_DEG), // rãnh nhận mũi tên của ô trước
    pt(A_OUT * k, t),
    pt(A_OUT * k, l),
    pt(mid, l + NOTCH_DEG), // mũi tên chỉ sang ô kế tiếp
    pt(A_IN * k, l),
  ];
  return `M${P.map(([x, y]) => `${f(x)} ${f(y)}`).join(" L")} Z`;
}

/** Cung cho chữ "INICIO DE CICLO" chạy theo vòng ngoài. */
function arcPath(r: number, fromDeg: number, toDeg: number) {
  const [x1, y1] = pt(r, fromDeg);
  const [x2, y2] = pt(r, toDeg);
  return `M${f(x1)} ${f(y1)} A${r} ${r} 0 0 1 ${f(x2)} ${f(y2)}`;
}

/**
 * s04 — "Solución integral": vòng 12 bước canh tác lúa, dựng bằng SVG theo dữ liệu.
 * Thêm/bớt bước trong CMS thì vòng tự chia lại (mỗi ô = 360° / số bước).
 */
export function CycleWheel({ cycle, steps }: Props) {
  const n = steps.length || 12;
  const step = 360 / n;
  const startDeg = -90 - step; // ô 1 nằm ngay bên trái điểm 12 giờ, ô 2 bên phải
  return (
    <section
      aria-labelledby="cycle-title"
      className="bg-sky-soft relative overflow-hidden pt-14 pb-16 lg:h-[51.25rem] lg:pt-[3.6rem] lg:pb-0"
    >
      <SectionMarker id="s04" className="top-0 h-full" />
      <h2 id="cycle-title" className="title-display text-center lg:text-[2.3rem]">
        {cycle.title}
      </h2>

      {/* Desktop: vòng tròn */}
      <div
        className="absolute top-[7.625rem] left-1/2 hidden -translate-x-1/2 lg:block"
        style={{ width: `${SIZE / 16}rem`, height: `${SIZE / 16}rem` }}
      >
        <svg
          viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`}
          className="absolute inset-0 size-full"
          aria-hidden
        >
          <defs>
            <path id="cycle-start-arc" d={arcPath(300, -125, -80)} />
          </defs>
          <circle r={R_DISC} fill="#bee8fb" opacity="0.85" />
          <circle r={A_IN - 2} fill="#b4e6fd" />
          {steps.map((_, i) => {
            const c = startDeg + step * (i + 0.5);
            return (
              <g key={i} className="cycle-wheel-segment">
                <path
                  d={segmentPath(c)}
                  transform="scale(1.01)"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
                <path d={segmentPath(c)} fill={FILLS[i % FILLS.length]} />
              </g>
            );
          })}
          <circle r={R_CENTER} fill="#f2faff" stroke="#fff" strokeWidth="2" />
          <text className="fill-navy font-sans text-[15.5px] font-bold tracking-[0.02em] uppercase">
            <textPath href="#cycle-start-arc">{cycle.startLabel} →</textPath>
          </text>
        </svg>

        {/* Họa tiết bông lúa mờ trong vòng giữa */}
        <Image
          src="/images/icon-wreath.png"
          alt=""
          width={130}
          height={172}
          className="absolute top-1/2 left-1/2 h-[14rem] w-auto -translate-x-[62%] -translate-y-[46%] opacity-[0.16]"
        />
        <div className="text-navy absolute top-1/2 left-1/2 w-[15rem] -translate-x-1/2 -translate-y-[58%] text-center">
          <p className="text-[1.3125rem] leading-[1.5625rem] font-semibold uppercase">
            {cycle.centerTitle}
          </p>
          <p className="mx-auto mt-[0.45rem] max-w-[12.5rem] text-[0.875rem] leading-[1.1rem]">
            {cycle.centerText}
          </p>
        </div>

        <ol className="contents">
          {steps.map((s, i) => {
            const c = startDeg + step * (i + 0.5);
            const [x, y] = pt(LABEL_R, c);
            return (
              <li
                key={s.label}
                tabIndex={0}
                className="pointer-events-none absolute flex w-[7rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
                style={{
                  left: `${((x + SIZE / 2) / SIZE) * 100}%`,
                  top: `${((y + SIZE / 2) / SIZE) * 100}%`,
                }}
              >
                <span className="text-navy max-w-[6.4rem] text-[0.8125rem] leading-[0.95rem] text-balance">
                  {i + 1}. {s.label}
                </span>
                <Image
                  src={s.icon}
                  alt=""
                  width={116}
                  height={92}
                  className="mt-[0.35rem] h-[2.875rem] w-auto"
                />
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile/tablet: lưới các bước */}
      <div className="container-site mt-8 lg:hidden">
        <div className="text-navy mx-auto mb-6 max-w-sm rounded-3xl bg-white/80 p-5 text-center">
          <p className="text-lg leading-tight font-semibold uppercase">{cycle.centerTitle}</p>
          <p className="mt-2 text-[0.9375rem]">{cycle.centerText}</p>
        </div>
        <p className="font-display text-navy mb-3 text-sm font-bold uppercase">
          {cycle.startLabel} →
        </p>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.label}
              tabIndex={0}
              className="cycle-wheel-mobile-step text-navy flex flex-col items-center gap-2 rounded-2xl px-3 py-4 text-center text-[0.9375rem]"
              style={{ "--cycle-step-fill": FILLS[i % FILLS.length] } as CSSProperties}
            >
              <Image
                src={s.icon}
                alt=""
                width={116}
                height={92}
                className="h-11 w-auto"
              />
              <span>
                {i + 1}. {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
