import Link from "next/link";

/** Nội dung trang 404 song ngữ — dùng cho global-not-found và [locale]/not-found. */
export function NotFoundView() {
  return (
    <main className="bg-sky-soft grid min-h-dvh place-items-center px-4 py-16">
      <div className="max-w-[34rem] text-center">
        <p className="font-display text-green text-[4rem] leading-none font-bold">404</p>
        <h1 className="title-display mt-4">Página no encontrada</h1>
        <p className="text-body text-ink mt-3">
          La página que busca no existe o ha cambiado de dirección.
        </p>
        <p lang="en" className="text-body text-ink/70 mt-1">
          Page not found — the page you are looking for doesn’t exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/es" className="btn-green">
            Volver al inicio
          </Link>
          <Link
            href="/en"
            lang="en"
            className="border-navy text-navy hover:bg-navy inline-flex min-h-11 items-center rounded-lg border px-5 font-medium hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
