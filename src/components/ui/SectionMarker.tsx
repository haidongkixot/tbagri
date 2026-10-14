/**
 * Mốc vô hình đánh dấu đúng vùng của một section trong ảnh thiết kế
 * để script `npm run compare` chụp lại. Không ảnh hưởng giao diện hay trình đọc màn hình.
 */
export function SectionMarker({ id, className = "" }: { id: string; className?: string }) {
  return (
    <span
      aria-hidden
      data-section={id}
      className={`pointer-events-none absolute inset-x-0 hidden lg:block ${className}`}
    />
  );
}
