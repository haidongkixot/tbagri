import Image from "next/image";
import type { PageContent } from "@/server/content";
import { SectionMarker } from "@/components/ui/SectionMarker";

type Props = { cycle: PageContent["cycle"]; steps: PageContent["cycleSteps"] };

// Hình học vòng tròn (đơn vị px thiết kế, gốc toạ độ ở tâm vòng).
// Số đo lấy từ ảnh thiết kế s04 rồi quy về đĩa bán kính 333.
const SIZE = 666; // đường kính đĩa xanh ngoài
const R_DISC = 333;
const R_CENTER = 146; // vòng tròn trắng ở giữa
const A_IN = 180; // cạnh trong của ô (cung tròn)
const A_OUT = 285; // cạnh ngoài của ô (cung tròn)
const LABEL_R = 233; // bán kính đặt nhãn + icon
const GAP_HALF = 16.5; // nửa khe hở giữa hai ô, tính theo px (khe rộng đều ở mọi bán kính)
const OUTLINE_OFF = 11.5; // viền trắng nằm cách mép ô bấy nhiêu px
// Mũi tên: cạnh bên là đường thẳng hướng tâm, chỉ nhô ra một "gai" nhọn ở giữa bán kính.
const BARB_D = 11; // độ nhô của gai (px, theo chiều kim đồng hồ)
const BARB_H = 7; // nửa chiều cao của gai theo hướng bán kính (px)
const OUT_BARB_D = 19; // gai của đường viền trắng nhô xa hơn (do viền nằm ngoài ô)
const OUT_BARB_H = 9;
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

/** Đổi khoảng cách theo px ở bán kính r thành góc (độ). */
const angle = (px: number, r: number) => ((px / r) * 180) / Math.PI;
const L = ([x, y]: readonly [number, number]) => `L${f(x)} ${f(y)}`;

/**
 * Đường bao một ô của vòng bước, dựng đúng theo ảnh thiết kế:
 * cạnh trong và cạnh ngoài là cung tròn; hai cạnh bên là đường thẳng hướng tâm,
 * ở giữa bán kính nhô ra một gai nhọn theo chiều kim đồng hồ. Gai của ô trước
 * khớp vào rãnh của ô sau nên 12 ô nối thành một chuỗi mũi tên.
 *
 * @param gapHalf nửa khe hở tính theo px. Giảm giá trị này để có đường viền bao ngoài ô.
 */
function ringPath(
  centerDeg: number,
  rIn: number,
  rOut: number,
  gapHalf: number,
  barbD: number,
  barbH: number,
) {
  const c = centerDeg;
  const rMid = (rIn + rOut) / 2;
  // Khe hở rộng đều theo px nên nửa góc của ô nhỏ dần khi bán kính lớn dần.
  const h = (r: number) => 15 - angle(gapHalf, r);
  const nd = angle(barbD, rMid); // đỉnh gai lệch theo chiều kim đồng hồ
  const r1 = rMid - barbH;
  const r2 = rMid + barbH;
  const start = pt(rIn, c - h(rIn));
  return [
    `M${f(start[0])} ${f(start[1])}`,
    L(pt(r1, c - h(r1))), // cạnh sau: thẳng tới chân gai
    L(pt(rMid, c - h(rMid) + nd)), // rãnh nhận gai của ô trước
    L(pt(r2, c - h(r2))),
    L(pt(rOut, c - h(rOut))),
    `A${f(rOut)} ${f(rOut)} 0 0 1 ${f(pt(rOut, c + h(rOut))[0])} ${f(pt(rOut, c + h(rOut))[1])}`,
    L(pt(r2, c + h(r2))), // cạnh trước
    L(pt(rMid, c + h(rMid) + nd)), // gai chỉ sang ô kế tiếp
    L(pt(r1, c + h(r1))),
    L(pt(rIn, c + h(rIn))),
    `A${f(rIn)} ${f(rIn)} 0 0 0 ${f(start[0])} ${f(start[1])}`,
    "Z",
  ].join(" ");
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
            <path id="cycle-start-arc" d={arcPath(312, -128, -76)} />
            <radialGradient id="cycle-disc" cx="50%" cy="50%" r="50%">
              <stop offset="0.45" stopColor="#a8e2fd" />
              <stop offset="1" stopColor="#c8eeff" />
            </radialGradient>
          </defs>
          <circle r={R_DISC} fill="url(#cycle-disc)" />
          {steps.map((s, i) => {
            const c = startDeg + step * (i + 0.5);
            return (
              <g key={s.label} className="cycle-step">
                <path
                  d={ringPath(
                    c,
                    A_IN - OUTLINE_OFF,
                    A_OUT + OUTLINE_OFF,
                    GAP_HALF - OUTLINE_OFF,
                    OUT_BARB_D,
                    OUT_BARB_H,
                  )}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path
                  className="cycle-step-fill"
                  d={ringPath(c, A_IN, A_OUT, GAP_HALF, BARB_D, BARB_H)}
                  fill={FILLS[i % FILLS.length]}
                />
              </g>
            );
          })}
          <circle r={R_CENTER} fill="#fbfeff" />
          <text className="fill-navy font-display text-[15.5px] font-bold tracking-[0.02em] uppercase">
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
                // Nhãn không nhận chuột để trỏ chuột vào chữ vẫn tính là trỏ vào ô dưới nó.
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
              className="cycle-step-card text-navy flex flex-col items-center gap-2 rounded-2xl px-3 py-4 text-center text-[0.9375rem]"
              style={{ background: FILLS[i % FILLS.length] }}
            >
              <Image src={s.icon} alt="" width={116} height={92} className="h-11 w-auto" />
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
