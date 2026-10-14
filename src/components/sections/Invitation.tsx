import type { PageContent } from "@/server/content";
import { SectionMarker } from "@/components/ui/SectionMarker";

/** s13 — "Invitación a colaborar": tiêu đề, đoạn mời hợp tác và nút về form liên hệ. */
export function Invitation({ invitation }: { invitation: PageContent["invitation"] }) {
  return (
    <section
      aria-labelledby="invite-title"
      className="relative pt-4 pb-16 lg:h-[20rem] lg:pt-[1.46875rem] lg:pb-0"
    >
      <SectionMarker id="s13" className="top-0 h-full" />
      <div className="container-site">
        <div className="rounded-[1.5rem] bg-white/75 p-5 backdrop-blur-sm lg:rounded-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <h2 id="invite-title" className="title-side">
            {invitation.title}
          </h2>
          <p className="text-body text-ink mt-3 lg:mt-[1.03rem] lg:max-w-[26.5rem]">
            {invitation.text}
          </p>
          <a
            href="#contacto"
            className="btn-green mt-6 font-semibold lg:mt-[1.48rem] lg:h-[2.8125rem] lg:rounded-[0.625rem] lg:px-[1.3125rem]"
          >
            {invitation.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
