import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CMS_DOCS } from "@/cms/config";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { requireAdmin } from "@/server/auth/session";
import { getContentMeta } from "@/server/content";
import { dateTime } from "../../labels";

export const metadata: Metadata = { title: "Nội dung trang" };

export default function ContentPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <ContentList />
    </Suspense>
  );
}

const SECTION_NAMES: Record<string, string> = {
  chung: "Chung",
  s02: "s02 · Hero",
  s03: "s03 · Giới thiệu",
  s04: "s04 · Solución integral",
  s05: "s05 · Filosofía",
  s06: "s06 · Modelo de servicio",
  s07: "s07 · Grupo de productos",
  s08: "s08 · Semillas e insumos",
  s09: "s09 · Mecanización",
  s10: "s10 · Poscosecha",
  s11: "s11 · Digital",
  s12: "s12 · Beneficio y contacto",
  s13: "s13 · Invitación",
  s14: "s14 · Footer",
  tiendas: "Trang Nuestras tiendas",
};

async function ContentList() {
  await requireAdmin();
  const meta = await getContentMeta();
  const groups = Object.entries(SECTION_NAMES)
    .map(([code, name]) => ({ code, name, docs: CMS_DOCS.filter((d) => d.section === code) }))
    .filter((g) => g.docs.length > 0);

  return (
    <div className="max-w-[56rem]">
      <h1 className="text-navy text-2xl font-semibold">Nội dung trang</h1>
      <p className="text-ink/70 mt-1">
        Chọn một khối để sửa. Mỗi khối có bản tiếng Tây Ban Nha (bắt buộc) và tiếng Anh. Bấm “Lưu và
        đăng” là trang công khai cập nhật ngay.
      </p>
      <div className="mt-6 space-y-6">
        {groups.map((g) => (
          <section key={g.code}>
            <h2 className="text-ink/60 text-sm font-semibold tracking-wide uppercase">{g.name}</h2>
            <ul className="divide-ink/5 ring-ink/5 mt-2 divide-y overflow-hidden rounded-[1rem] bg-white shadow-sm ring-1">
              {g.docs.map((d) => {
                const m = meta[d.key];
                const edited = m && m.by !== "seed";
                return (
                  <li key={d.key}>
                    <Link
                      href={`/admin/content/${d.key}`}
                      className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-sky-50"
                    >
                      <span className="text-navy font-medium">{d.label}</span>
                      {d.type === "list" && (
                        <span className="text-navy rounded bg-sky-100 px-1.5 text-xs">
                          danh sách
                        </span>
                      )}
                      <span className="text-ink/60 ml-auto text-xs">
                        {edited ? `Đã sửa ${dateTime.format(m.at)} · ${m.by}` : "Nội dung mặc định"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
