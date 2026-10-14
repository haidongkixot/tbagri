"use client";

import { useId, useState } from "react";

type Item = { title: string; description: string };

/**
 * Accordion lợi ích (s12): mở một mục mỗi lần, mục đầu mở sẵn như thiết kế.
 * Trợ năng theo mẫu WAI-ARIA Accordion: tiêu đề là <h3><button aria-expanded>,
 * nội dung là region gắn aria-labelledby. Hiệu ứng mở/đóng dùng grid-rows 0fr → 1fr.
 */
export function Accordion({ items, className = "" }: { items: Item[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={className}>
      {items.map((item, i) => {
        const expanded = open === i;
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.title} className="border-line border-b-[1.5px]">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : i)}
                className={`title-caps flex w-full items-center justify-between gap-4 text-left transition-[padding] duration-300 hover:text-green-600 lg:text-[1.03125rem] lg:leading-[1.25rem] ${
                  i === 0 ? "pt-0" : "pt-4 lg:pt-[1.35rem]"
                } ${expanded ? "pb-2 lg:pb-[0.62rem]" : "pb-4 lg:pb-[1.35rem]"}`}
              >
                {item.title}
                <svg
                  viewBox="0 0 14 8"
                  aria-hidden
                  className={`text-green h-[0.4375rem] w-[0.8125rem] shrink-0 transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M1 1l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              inert={!expanded}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-body text-ink pb-5 lg:max-w-[23rem] lg:pb-[1.7rem]">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
