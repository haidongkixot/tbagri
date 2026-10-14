"use client";

import { useEffect, useState } from "react";

/** Nút "Contáctanos" nổi góc phải dưới, hiện khi đã cuộn qua hero. Dẫn tới form #contacto. */
export function FloatingContact({ label, href }: { label: string; href: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      data-floating
      href={href}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`bg-navy hover:bg-navy-700 fixed right-4 bottom-5 z-30 inline-flex items-center gap-[0.625rem] rounded-[0.625rem] py-[0.5rem] pr-[1rem] pl-[0.75rem] font-semibold text-white shadow-lg transition-all duration-300 lg:right-[max(1rem,calc((100vw-var(--container-site))/2))] lg:rounded-r-none lg:py-[0.75rem] lg:text-[0.9375rem] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-[1.6rem]" aria-hidden>
        <path
          fill="currentColor"
          d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
        />
      </svg>
      {label}
    </a>
  );
}
