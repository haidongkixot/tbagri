import type { Locale } from "@/content/types";

/** Cờ của ngôn ngữ sẽ chuyển sang: tiếng Anh → cờ Mỹ (như thiết kế), tiếng Tây Ban Nha → cờ Cuba. */
export function Flag({ locale, className = "" }: { locale: Locale; className?: string }) {
  if (locale === "en") {
    return (
      <svg viewBox="0 0 22 15" className={className} aria-hidden>
        <rect width="22" height="15" fill="#fff" rx="1.5" />
        {[0, 2, 4, 6, 8, 10, 12].map((y) => (
          <rect key={y} y={(y * 15) / 13} width="22" height={15 / 13} fill="#c8102e" />
        ))}
        <rect width="9.5" height="8.1" fill="#012169" rx="1.5" />
        <g fill="#fff">
          {[
            [1.6, 1.4],
            [4, 1.4],
            [6.4, 1.4],
            [2.8, 3],
            [5.2, 3],
            [7.6, 3],
            [1.6, 4.6],
            [4, 4.6],
            [6.4, 4.6],
            [2.8, 6.2],
            [5.2, 6.2],
            [7.6, 6.2],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.45" />
          ))}
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 22 15" className={className} aria-hidden>
      <rect width="22" height="15" fill="#fff" rx="1.5" />
      <rect width="22" height="3" fill="#002a8f" />
      <rect y="6" width="22" height="3" fill="#002a8f" />
      <rect y="12" width="22" height="3" fill="#002a8f" />
      <path d="M0 0 L13 7.5 L0 15 Z" fill="#cf142b" />
      <path d="M4.3 5.3l.5 1.5h1.6l-1.3.9.5 1.5-1.3-.9-1.3.9.5-1.5-1.3-.9h1.6z" fill="#fff" />
    </svg>
  );
}
