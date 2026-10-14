import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDocConfig } from "@/cms/config";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { requireAdmin } from "@/server/auth/session";
import { getSiteContent } from "@/server/content";

export const metadata: Metadata = { title: "Sửa nội dung" };

export default function EditContentPage({ params }: PageProps<"/admin/content/[key]">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/content/[key]">["params"] }) {
  await requireAdmin();
  const { key } = await params;
  const doc = getDocConfig(key);
  if (!doc) notFound();
  const content = await getSiteContent();
  const value = content[doc.key];
  const preview =
    doc.section === "tiendas" ? "/es/tiendas" : `/es${doc.anchor ? `#${doc.anchor}` : ""}`;

  return (
    <div>
      <nav aria-label="Đường dẫn" className="text-ink/60 text-sm">
        <Link href="/admin/content" className="hover:underline">
          Nội dung trang
        </Link>{" "}
        / {doc.label}
      </nav>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-4">
        <h1 className="text-navy text-2xl font-semibold">{doc.label}</h1>
        <a
          href={preview}
          target="_blank"
          rel="noopener"
          className="text-sm text-green-600 hover:underline"
        >
          Xem trên trang ↗
        </a>
      </div>
      {doc.description && <p className="text-ink/70 mt-1 max-w-[48rem]">{doc.description}</p>}
      <div className="mt-4">
        {/* key: dựng lại trình sửa khi đổi sang khối khác */}
        <ContentEditor key={doc.key} doc={doc} initial={value} />
      </div>
    </div>
  );
}
