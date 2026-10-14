"use client";

import { createContext, useContext, useId, useRef, useState, type ReactNode } from "react";

/**
 * Stepper "hạt lúa" (s07, s08): các nút số hình hạt gạo chọn slide đang hiển thị.
 * Về trợ năng đây là mẫu Tabs của WAI-ARIA: nút = tab, phần chữ = tabpanel,
 * phím ← → Home End để chuyển, chỉ tab đang chọn nằm trong thứ tự Tab.
 *
 * <Stepper count={n}>
 *   <StepperPanel index={i} kind="media">ảnh</StepperPanel>   ← có thể đặt ở cột khác
 *   <StepperPanel index={i}>chữ</StepperPanel>
 *   <StepperTabs label="Productos" titles={[...]} />
 * </Stepper>
 */
type Ctx = { active: number; setActive: (i: number) => void; count: number; baseId: string };
const StepperCtx = createContext<Ctx | null>(null);

function useStepper() {
  const ctx = useContext(StepperCtx);
  if (!ctx) throw new Error("StepperPanel/StepperTabs phải nằm trong <Stepper>");
  return ctx;
}

export function Stepper({
  count,
  className,
  children,
}: {
  count: number;
  className?: string;
  children: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  return (
    <StepperCtx.Provider value={{ active, setActive, count, baseId }}>
      <div className={className}>{children}</div>
    </StepperCtx.Provider>
  );
}

/**
 * Nội dung của một bước. `kind="text"` (mặc định) là tabpanel chính;
 * `kind="media"` là phần ảnh đi kèm, ẩn với trình đọc màn hình khi không hiển thị.
 */
export function StepperPanel({
  index,
  kind = "text",
  className = "",
  children,
}: {
  index: number;
  kind?: "text" | "media";
  className?: string;
  children: ReactNode;
}) {
  const { active, baseId } = useStepper();
  const hidden = index !== active;
  const a11y =
    kind === "text"
      ? {
          role: "tabpanel" as const,
          id: `${baseId}-panel-${index}`,
          "aria-labelledby": `${baseId}-tab-${index}`,
          tabIndex: 0,
        }
      : {};
  return (
    <div {...a11y} hidden={hidden} className={`animate-fade-in ${className}`}>
      {children}
    </div>
  );
}

/** Hành vi bàn phím chung của tablist: ← → ↑ ↓ (vòng tròn), Home, End; focus đi theo tab. */
function useRovingTabs() {
  const { active, setActive, count, baseId } = useStepper();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent) {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (keys[e.key] + count) % count;
    setActive(next);
    refs.current[next]?.focus();
  }

  function tabProps(i: number) {
    const selected = i === active;
    return {
      ref: (el: HTMLButtonElement | null) => {
        refs.current[i] = el;
      },
      type: "button" as const,
      role: "tab" as const,
      id: `${baseId}-tab-${i}`,
      "aria-selected": selected,
      "aria-controls": `${baseId}-panel-${i}`,
      tabIndex: selected ? 0 : -1,
      onClick: () => setActive(i),
    };
  }

  return { active, onKeyDown, tabProps };
}

/** Nút số hình hạt lúa xếp ngang (s07, s08). */
export function StepperTabs({
  label,
  titles,
  className = "",
}: {
  /** Tên nhóm cho trình đọc màn hình, ví dụ "Productos" */
  label: string;
  /** Tiêu đề từng bước — dùng làm tên truy cập của nút số */
  titles: string[];
  className?: string;
}) {
  const { active, onKeyDown, tabProps } = useRovingTabs();
  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`flex flex-wrap gap-x-1 gap-y-2 lg:gap-x-[0.9375rem] ${className}`}
    >
      {titles.map((title, i) => {
        const selected = i === active;
        return (
          <button
            key={i}
            {...tabProps(i)}
            aria-label={`${i + 1}. ${title}`}
            className="group relative grid h-11 w-11 place-items-center text-[0.875rem] font-bold focus-visible:outline-offset-0 lg:h-[2.0625rem] lg:w-[1.6rem]"
          >
            <RiceGrain selected={selected} />
            <span
              aria-hidden
              className={`relative mt-[0.1rem] ${selected ? "text-white" : "text-green"}`}
            >
              {i + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Danh sách tab dạng chữ xếp dọc (s10 — "Soluciones de secado / empaque / …"):
 * tab đang chọn in đậm + gạch chân navy, các tab khác ngăn bằng đường kẻ xám.
 */
export function StepperList({
  label,
  titles,
  className = "",
}: {
  label: string;
  titles: string[];
  className?: string;
}) {
  const { active, onKeyDown, tabProps } = useRovingTabs();
  return (
    <div
      role="tablist"
      aria-label={label}
      aria-orientation="vertical"
      onKeyDown={onKeyDown}
      className={`flex flex-col ${className}`}
    >
      {titles.map((title, i) => {
        const selected = i === active;
        return (
          <button
            key={i}
            {...tabProps(i)}
            className={`text-navy min-h-11 border-b pt-4 pb-[0.78rem] text-left text-[0.9375rem] leading-4 transition-colors hover:text-green-600 lg:min-h-0 lg:text-[0.78125rem] ${
              selected
                ? "border-navy border-b-[1.5px] font-semibold"
                : "border-line font-normal last:border-b-0"
            }`}
          >
            {title}
          </button>
        );
      })}
    </div>
  );
}

/** Hình hạt gạo nghiêng ~25°, đo từ thiết kế (25.5 × 33 px). */
function RiceGrain({ selected }: { selected: boolean }) {
  return (
    <svg
      viewBox="0 0 26 34"
      aria-hidden
      className="absolute inset-x-0 top-1/2 h-[2.0625rem] w-full -translate-y-1/2 overflow-visible"
    >
      <path
        d="M17.6 1.2c3.9-.7 6.6 2 6.2 6-.2 1.9-1.2 3.2-1.5 5.3-.4 2.6.3 5-.6 8.1C19.9 27 15.6 32.6 9.6 32.9 3.8 33.2.6 29.2 1.6 23.3 2.5 17.6 6 11.3 9.4 6.6 11.7 3.5 14.4 1.8 17.6 1.2Z"
        className={
          selected
            ? "fill-green stroke-green"
            : "stroke-green group-hover:fill-green/15 fill-transparent transition-colors"
        }
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
