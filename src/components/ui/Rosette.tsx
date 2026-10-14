/** Hoa văn tám cánh mảnh (trang trí sau tiêu đề phần giới thiệu). */
export function Rosette({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="-60 -60 120 120" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        {petals.map((deg) => (
          <path
            key={deg}
            transform={`rotate(${deg})`}
            d="M0 0 C 10 -12, 30 -18, 40 -36 C 44 -48, 30 -56, 20 -48 C 10 -40, 4 -20, 0 0 Z"
          />
        ))}
      </g>
    </svg>
  );
}
