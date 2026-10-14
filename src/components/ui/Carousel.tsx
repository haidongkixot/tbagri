"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Carousel không phụ thuộc thư viện: thanh cuộn ngang có snap + nút trước/sau.
 * Tách thành Provider / Track / Button để mỗi section đặt nút ở chỗ thiết kế yêu cầu.
 *
 * <Carousel label="...">
 *   <CarouselButton dir="prev" label="Anterior" />
 *   <CarouselTrack>{slides}</CarouselTrack>
 * </Carousel>
 */
type Ctx = {
  trackRef: React.RefObject<HTMLUListElement | null>;
  canPrev: boolean;
  canNext: boolean;
  scroll: (dir: 1 | -1) => void;
};
const CarouselCtx = createContext<Ctx | null>(null);

function useCarouselCtx() {
  const ctx = useContext(CarouselCtx);
  if (!ctx) throw new Error("CarouselTrack/CarouselButton phải nằm trong <Carousel>");
  return ctx;
}

export function Carousel({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const scroll = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>(":scope > li");
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const step = first ? first.offsetWidth + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <CarouselCtx.Provider value={{ trackRef, canPrev, canNext, scroll }}>
      <div role="region" aria-roledescription="carousel" aria-label={label} className={className}>
        {children}
      </div>
    </CarouselCtx.Provider>
  );
}

export function CarouselTrack({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { trackRef } = useCarouselCtx();
  return (
    <ul
      ref={trackRef}
      tabIndex={0}
      className={`flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain focus-visible:outline-offset-4 [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </ul>
  );
}

export function CarouselButton({
  dir,
  label,
  variant = "outline",
  className = "",
}: {
  dir: "prev" | "next";
  label: string;
  /** outline: vòng tròn viền xanh (Filosofía) · chevron: mũi tên navy không viền (Mecanización) */
  variant?: "outline" | "chevron";
  className?: string;
}) {
  const { canPrev, canNext, scroll } = useCarouselCtx();
  const disabled = dir === "prev" ? !canPrev : !canNext;
  const base =
    variant === "outline"
      ? "grid size-11 place-items-center rounded-full lg:size-[1.6875rem] border-[1.5px] border-green text-green hover:bg-green hover:text-white"
      : "grid h-11 w-8 place-items-center text-navy hover:text-green-600";
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={() => scroll(dir === "prev" ? -1 : 1)}
      className={`${base} transition disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent ${
        variant === "outline" ? "disabled:hover:text-green" : "disabled:hover:text-navy"
      } ${className}`}
    >
      {variant === "outline" ? (
        <svg viewBox="0 0 24 24" className="size-5 lg:size-[0.95rem]" aria-hidden>
          <path
            d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        // Mũi tên mảnh, cao (14.5 × 27.5px thiết kế) — dùng ở s09 Mecanización
        <svg viewBox="0 0 16 30" className="h-[1.875rem] w-[1rem]" aria-hidden>
          <path
            d={dir === "prev" ? "M14 2.5 2 15l12 12.5" : "M2 2.5 14 15 2 27.5"}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
